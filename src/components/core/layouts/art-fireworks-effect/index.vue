<!-- Fireworks effect | Celebration effect -->
<template>
  <canvas ref="canvasRef" class="layout-fireworks"></canvas>
</template>

<script setup lang="ts">
  import { useEventListener } from '@vueuse/core'
  import { mittBus } from '@/utils/sys'
  import type { Handler } from 'mitt'
  import bp from '@/assets/img/ceremony/hb.png'
  import sd from '@/assets/img/ceremony/sd.png'
  import yd from '@/assets/img/ceremony/yd.png'

  defineOptions({ name: 'ArtFireworksEffect' })

  /**
   * Firework system config interface
   * Defines all configurable parameters of the fireworks effect
   */
  interface FireworkConfig {
    /** Object pool size - number of pre-created particle objects */
    readonly POOL_SIZE: number
    /** Number of particles per burst */
    readonly PARTICLES_PER_BURST: number
    /** Size configuration for all shapes */
    readonly SIZES: {
      /** Rectangle particle width/height */
      readonly RECTANGLE: { readonly WIDTH: number; readonly HEIGHT: number }
      /** Square particle side length */
      readonly SQUARE: { readonly SIZE: number }
      /** Circle particle diameter */
      readonly CIRCLE: { readonly SIZE: number }
      /** Triangle particle side length */
      readonly TRIANGLE: { readonly SIZE: number }
      /** Oval particle width/height */
      readonly OVAL: { readonly WIDTH: number; readonly HEIGHT: number }
      /** Image particle width/height */
      readonly IMAGE: { readonly WIDTH: number; readonly HEIGHT: number }
    }
    /** Rotation parameters */
    readonly ROTATION: {
      /** Base rotation speed */
      readonly BASE_SPEED: number
      /** Random rotation speed delta */
      readonly RANDOM_SPEED: number
      /** Rotation decay factor - controls rotation slowdown */
      readonly DECAY: number
    }
    /** Physics parameters */
    readonly PHYSICS: {
      /** Gravity acceleration */
      readonly GRAVITY: number
      /** Fall velocity threshold - start fade when exceeded */
      readonly VELOCITY_THRESHOLD: number
      /** Opacity decay speed */
      readonly OPACITY_DECAY: number
    }
    /** Firework particle colors (with alpha) */
    readonly COLORS: readonly string[]
    /** Firework particle shapes (higher chance for rectangle) */
    readonly SHAPES: readonly string[]
  }

  /**
   * Single firework particle object
   * Includes particle position, velocity, appearance and other properties
   */
  interface Firework {
    /** X coordinate */
    x: number
    /** Y coordinate */
    y: number
    /** Velocity on X axis */
    vx: number
    /** Velocity on Y axis */
    vy: number
    /** Particle color (RGBA) */
    color: string
    /** Current rotation angle */
    rotation: number
    /** Rotation speed */
    rotationSpeed: number
    /** Scale */
    scale: number
    /** Particle shape type */
    shape: string
    /** Opacity (0-1) */
    opacity: number
    /** Whether the particle is active */
    active: boolean
    /** Image URL (used when shape is 'image') */
    imageUrl?: string
  }

  /**
   * Image cache interface
   * Used to cache preloaded image resources
   */
  interface ImageCache {
    [url: string]: HTMLImageElement
  }

  // ==================== Config constants ====================

  /**
   * Global config for fireworks effect
   * Use `as const` to keep it immutable
   */
  const CONFIG: FireworkConfig = {
    // Performance-related config
    POOL_SIZE: 600, // Object pool size, affects max concurrent particles
    PARTICLES_PER_BURST: 200, // Particles per burst, affects visual density

    // Particle size config
    SIZES: {
      RECTANGLE: { WIDTH: 24, HEIGHT: 12 }, // Rectangle particle size
      SQUARE: { SIZE: 12 }, // Square particle size
      CIRCLE: { SIZE: 12 }, // Circle particle size
      TRIANGLE: { SIZE: 10 }, // Triangle particle size
      OVAL: { WIDTH: 24, HEIGHT: 12 }, // Oval particle size
      IMAGE: { WIDTH: 30, HEIGHT: 30 } // Image particle size
    },

    // Rotation animation config
    ROTATION: {
      BASE_SPEED: 2, // Base rotation speed
      RANDOM_SPEED: 3, // Extra random rotation speed range
      DECAY: 0.98 // Rotation speed decay (smaller = faster decay)
    },

    // Physics config
    PHYSICS: {
      GRAVITY: 0.525, // Gravity acceleration, affects fall speed
      VELOCITY_THRESHOLD: 10, // Velocity threshold; start opacity decay when exceeded
      OPACITY_DECAY: 0.02 // Opacity decay speed, affects fade-out speed
    },

    // Particle colors - RGBA supports opacity
    COLORS: [
      'rgba(255, 68, 68, 1)', // Red
      'rgba(255, 68, 68, 0.9)',
      'rgba(255, 68, 68, 0.8)',
      'rgba(255, 116, 188, 1)', // Pink
      'rgba(255, 116, 188, 0.9)',
      'rgba(255, 116, 188, 0.8)',
      'rgba(68, 68, 255, 0.8)', // Blue
      'rgba(92, 202, 56, 0.7)', // Green
      'rgba(255, 68, 255, 0.8)', // Purple
      'rgba(68, 255, 255, 0.7)', // Cyan
      'rgba(255, 136, 68, 0.7)', // Orange
      'rgba(68, 136, 255, 1)', // Blue
      'rgba(250, 198, 122, 0.8)' // Gold
    ],

    // Particle shapes - rectangles are more frequent for richer visuals
    SHAPES: [
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
      'circle',
      'triangle',
      'oval'
    ]
  } as const

  // ==================== Reactive state ====================

  /** Canvas DOM element ref */
  const canvasRef = ref<HTMLCanvasElement>()
  /** Canvas 2D rendering context */
  const ctx = ref<CanvasRenderingContext2D | null>(null)

  // ==================== Firework system ====================

  /**
   * Core class of the fireworks system
   * Manages particle lifecycle, rendering, and animation
   */
  class FireworkSystem {
    /** Particle object pool - pre-created particle objects */
    private particlePool: Firework[] = []
    /** Currently active particles */
    private activeParticles: Firework[] = []
    /** Pool index pointer - for circular allocation */
    private poolIndex = 0
    /** Image resource cache */
    private imageCache: ImageCache = {}
    /** Animation frame ID - for canceling animation */
    private animationId = 0
    /** Cached canvas width */
    private canvasWidth = 0
    /** Cached canvas height */
    private canvasHeight = 0

    constructor() {
      this.initializePool()
    }

    /**
     * Initialize the object pool
     * Pre-create a number of particle objects to avoid runtime allocations
     */
    private initializePool(): void {
      for (let i = 0; i < CONFIG.POOL_SIZE; i++) {
        this.particlePool.push(this.createParticle())
      }
    }

    /**
     * Create a new particle object
     * Returns a particle in the initial state
     */
    private createParticle(): Firework {
      return {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        color: '',
        rotation: 0,
        rotationSpeed: 0,
        scale: 1,
        shape: 'circle',
        opacity: 1,
        active: false
      }
    }

    /**
     * Get an available particle from the pool (optimized)
     * Uses a circular index instead of Array.find(); O(1) instead of O(n)
     * @returns available particle or null
     */
    private getAvailableParticle(): Firework | null {
      for (let i = 0; i < CONFIG.POOL_SIZE; i++) {
        const index = (this.poolIndex + i) % CONFIG.POOL_SIZE
        const particle = this.particlePool[index]

        if (!particle.active) {
          this.poolIndex = (index + 1) % CONFIG.POOL_SIZE
          particle.active = true
          return particle
        }
      }
      return null
    }

    /**
     * Preload a single image resource
     * @param url image URL
     * @returns Promise<HTMLImageElement>
     */
    async preloadImage(url: string): Promise<HTMLImageElement> {
      // Return from cache if already loaded
      if (this.imageCache[url]) {
        return this.imageCache[url]
      }

      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous' // Handle cross-origin
        img.onload = () => {
          this.imageCache[url] = img
          resolve(img)
        }
        img.onerror = reject
        img.src = url
      })
    }

    /**
     * Preload all required image resources
     * Call during component init to ensure readiness
     */
    async preloadAllImages(): Promise<void> {
      const imageUrls = [bp, sd, yd]
      try {
        await Promise.all(imageUrls.map((url) => this.preloadImage(url)))
      } catch (error) {
        console.error('Image preloading failed:', error)
      }
    }

    /**
     * Create a fireworks burst
     * @param imageUrl optional image URL; if provided, use image particles
     */
    createFirework(imageUrl?: string): void {
      // Randomize starting position of the burst
      const startX = Math.random() * this.canvasWidth
      const startY = this.canvasHeight

      // Determine available shapes depending on image availability
      const availableShapes = imageUrl && this.imageCache[imageUrl] ? ['image'] : CONFIG.SHAPES

      // Create particles in batch to reduce array operations
      const particles: Firework[] = []

      for (let i = 0; i < CONFIG.PARTICLES_PER_BURST; i++) {
        const particle = this.getAvailableParticle()
        if (!particle) continue

        // Compute particle angle and speed (original algorithm)
        const angle = (Math.PI * i) / (CONFIG.PARTICLES_PER_BURST / 2) // Sector distribution
        const speed = (12 + Math.random() * 6) * 1.5 // Random speed
        const spread = Math.random() * Math.PI * 2 // 360-degree random spread

        // Direct property assignment; avoid Object.assign overhead
        particle.x = startX
        particle.y = startY
        // Complex velocity calc to simulate realistic trajectory
        particle.vx = Math.cos(angle) * Math.cos(spread) * speed * (Math.random() * 0.5 + 0.5)
        particle.vy = Math.sin(angle) * speed - 15 // Initial upward speed
        particle.color = CONFIG.COLORS[Math.floor(Math.random() * CONFIG.COLORS.length)]
        particle.rotation = Math.random() * 360
        particle.rotationSpeed =
          (Math.random() * CONFIG.ROTATION.RANDOM_SPEED + CONFIG.ROTATION.BASE_SPEED) *
          (Math.random() > 0.5 ? 1 : -1) // Random rotation direction
        particle.scale = 0.8 + Math.random() * 0.4 // Random scale
        particle.shape = availableShapes[Math.floor(Math.random() * availableShapes.length)]
        particle.opacity = 1
        particle.imageUrl = imageUrl && this.imageCache[imageUrl] ? imageUrl : undefined

        particles.push(particle)
      }

      // Push in batch to the active array to reduce operations
      this.activeParticles.push(...particles)
    }

    /**
     * Update physics for all particles (optimized)
     * Includes position, velocity, rotation, opacity, etc.
     */
    private updateParticles(): void {
      const { GRAVITY, VELOCITY_THRESHOLD, OPACITY_DECAY } = CONFIG.PHYSICS
      const { DECAY } = CONFIG.ROTATION

      // Iterate in reverse to avoid index issues when removing
      for (let i = this.activeParticles.length - 1; i >= 0; i--) {
        const particle = this.activeParticles[i]

        // Update position (uniformly accelerated motion)
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += GRAVITY // Gravity effect

        // Update rotation
        particle.rotation += particle.rotationSpeed
        particle.rotationSpeed *= DECAY // Rotation speed decay

        // Opacity decay - start fading when falling speed exceeds threshold
        if (particle.vy > VELOCITY_THRESHOLD) {
          particle.opacity -= OPACITY_DECAY
          if (particle.opacity <= 0) {
            this.recycleParticle(i)
            continue
          }
        }

        // Boundary check - remove particles out of screen
        if (this.isOutOfBounds(particle)) {
          this.recycleParticle(i)
        }
      }
    }

    /**
     * Recycle a particle back to the pool
     * @param index index in the active array
     */
    private recycleParticle(index: number): void {
      const particle = this.activeParticles[index]
      particle.active = false // Mark as inactive
      this.activeParticles.splice(index, 1) // Remove from active array
    }

    /**
     * Check if a particle is out of bounds
     * @param particle particle to check
     * @returns whether it's out of bounds
     */
    private isOutOfBounds(particle: Firework): boolean {
      const margin = 100 // Boundary padding
      return (
        particle.x < -margin ||
        particle.x > this.canvasWidth + margin ||
        particle.y < -margin ||
        particle.y > this.canvasHeight + margin
      )
    }

    /**
     * Draw a single particle
     * @param particle particle to draw
     */
    private drawParticle(particle: Firework): void {
      if (!ctx.value) return

      // Save current canvas state
      ctx.value.save()
      ctx.value.globalAlpha = particle.opacity // Set opacity
      ctx.value.translate(particle.x, particle.y) // Move to particle position
      ctx.value.rotate((particle.rotation * Math.PI) / 180) // Apply rotation
      ctx.value.scale(particle.scale, particle.scale) // Apply scale

      // Render shape
      this.renderShape(particle)

      // Restore canvas state
      ctx.value.restore()
    }

    /**
     * Render shape by particle type
     * @param particle particle to render
     */
    private renderShape(particle: Firework): void {
      if (!ctx.value) return

      const { SIZES } = CONFIG
      ctx.value.fillStyle = particle.color

      switch (particle.shape) {
        case 'rectangle':
          // Draw rectangle
          ctx.value.fillRect(
            -SIZES.RECTANGLE.WIDTH / 2,
            -SIZES.RECTANGLE.HEIGHT / 2,
            SIZES.RECTANGLE.WIDTH,
            SIZES.RECTANGLE.HEIGHT
          )
          break

        case 'square':
          // Draw square
          ctx.value.fillRect(
            -SIZES.SQUARE.SIZE / 2,
            -SIZES.SQUARE.SIZE / 2,
            SIZES.SQUARE.SIZE,
            SIZES.SQUARE.SIZE
          )
          break

        case 'circle':
          // Draw circle
          ctx.value.beginPath()
          ctx.value.arc(0, 0, SIZES.CIRCLE.SIZE / 2, 0, Math.PI * 2)
          ctx.value.fill()
          break

        case 'triangle':
          // Draw triangle
          ctx.value.beginPath()
          ctx.value.moveTo(0, -SIZES.TRIANGLE.SIZE)
          ctx.value.lineTo(SIZES.TRIANGLE.SIZE, SIZES.TRIANGLE.SIZE)
          ctx.value.lineTo(-SIZES.TRIANGLE.SIZE, SIZES.TRIANGLE.SIZE)
          ctx.value.closePath()
          ctx.value.fill()
          break

        case 'oval':
          // Draw oval
          ctx.value.beginPath()
          ctx.value.ellipse(0, 0, SIZES.OVAL.WIDTH / 2, SIZES.OVAL.HEIGHT / 2, 0, 0, Math.PI * 2)
          ctx.value.fill()
          break

        case 'image':
          // Draw image
          this.renderImage(particle)
          break
      }
    }

    /**
     * Render an image particle
     * @param particle particle containing an image URL
     */
    private renderImage(particle: Firework): void {
      if (!ctx.value || !particle.imageUrl) return

      const img = this.imageCache[particle.imageUrl]
      if (img?.complete) {
        const { WIDTH, HEIGHT } = CONFIG.SIZES.IMAGE
        ctx.value.drawImage(img, -WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT)
      }
    }

    /**
     * Render all active particles
     * Clear the canvas and redraw all particles
     */
    private render(): void {
      if (!ctx.value || !canvasRef.value) return

      // Clear entire canvas
      ctx.value.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      // Set composite mode to "lighter" to enhance visuals
      ctx.value.globalCompositeOperation = 'lighter'

      // Render all active particles
      for (const particle of this.activeParticles) {
        this.drawParticle(particle)
      }
    }

    /**
     * Animation main loop
     * Arrow function to keep `this` binding
     */
    private animate = (): void => {
      this.updateParticles() // Update particles
      this.render() // Render
      this.animationId = requestAnimationFrame(this.animate) // Request next frame
    }

    /**
     * Update cached canvas size
     * Call when window size changes
     * @param width new canvas width
     * @param height new canvas height
     */
    updateCanvasSize(width: number, height: number): void {
      this.canvasWidth = width
      this.canvasHeight = height
    }

    /**
     * Start the animation loop
     */
    start(): void {
      this.animate()
    }

    /**
     * Stop the animation loop
     * Call on component unmount to avoid memory leaks
     */
    stop(): void {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
        this.animationId = 0
      }
    }

    /**
     * Get current active particle count
     * For debugging and performance monitoring
     * @returns active particle count
     */
    getActiveParticleCount(): number {
      return this.activeParticles.length
    }
  }

  // ==================== Component logic ====================

  /** Fireworks system instance */
  const fireworkSystem = new FireworkSystem()

  /**
   * Handle keyboard shortcut
   * Listen for Ctrl+Shift+P or Cmd+Shift+P to trigger fireworks
   * @param event keyboard event
   */
  const handleKeyPress = (event: KeyboardEvent): void => {
    const isFireworkShortcut =
      (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'p') ||
      (event.metaKey && event.shiftKey && event.key.toLowerCase() === 'p')

    if (isFireworkShortcut) {
      event.preventDefault()
      fireworkSystem.createFirework()
    }
  }

  /**
   * Resize canvas to viewport
   * Respond to window changes; keep the canvas covering the viewport
   */
  const resizeCanvas = (): void => {
    if (!canvasRef.value) return

    const { innerWidth, innerHeight } = window
    canvasRef.value.width = innerWidth
    canvasRef.value.height = innerHeight
    fireworkSystem.updateCanvasSize(innerWidth, innerHeight)
  }

  /**
   * Handle external firework trigger
   * Receive trigger command via mittBus event bus
   * @param event event data, may contain an image URL
   */
  const handleFireworkTrigger: Handler<unknown> = (event: unknown) => {
    const imageUrl = event as string | undefined
    fireworkSystem.createFirework(imageUrl)
  }

  // ==================== Lifecycle ====================

  /**
   * Initialization on component mount
   */
  onMounted(async () => {
    if (!canvasRef.value) return

    // Get 2D rendering context
    ctx.value = canvasRef.value.getContext('2d')
    if (!ctx.value) return

    // Set initial canvas size
    resizeCanvas()

    // Preload all image resources
    await fireworkSystem.preloadAllImages()

    // Start animation loop
    fireworkSystem.start()

    // Register event listeners
    useEventListener(window, 'keydown', handleKeyPress) // Keyboard shortcut
    useEventListener(window, 'resize', resizeCanvas) // Window resize
    mittBus.on('triggerFireworks', handleFireworkTrigger) // External trigger
  })

  /**
   * Cleanup on component unmount
   * Stop the animation loop and remove listeners to prevent leaks
   */
  onUnmounted(() => {
    fireworkSystem.stop()
    mittBus.off('triggerFireworks', handleFireworkTrigger)
  })
</script>

<style scoped>
  /**
 * Firework canvas style
 * Fixed to cover the viewport; ignore mouse events
 */
  .layout-fireworks {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999; /* Highest stacking order; stay above everything */
    width: 100%;
    height: 100%;
    pointer-events: none; /* Do not block user interaction */
  }
</style>
