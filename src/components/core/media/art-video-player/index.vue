<!-- Video player component: https://h5player.bytedance.com/ -->
<template>
  <div :id="playerId" />
</template>

<script setup lang="ts">
  import Player from 'xgplayer'
  import 'xgplayer/dist/index.min.css'

  defineOptions({ name: 'ArtVideoPlayer' })

  interface Props {
    /** player container ID */
    playerId: string
    /** video source URL */
    videoUrl: string
    /** video poster URL */
    posterUrl: string
    /** autoplay */
    autoplay?: boolean
    /** volume (0-1) */
    volume?: number
    /** available playback rates */
    playbackRates?: number[]
    /** loop */
    loop?: boolean
    /** muted */
    muted?: boolean
    commonStyle?: VideoPlayerStyle
  }

  const props = withDefaults(defineProps<Props>(), {
    playerId: '',
    videoUrl: '',
    posterUrl: '',
    autoplay: false,
    volume: 1,
    loop: false,
    muted: false
  })

  // Set default props

  // Player instance ref
  const playerInstance = ref<Player | null>(null)

  // Player style interface
  interface VideoPlayerStyle {
    progressColor?: string // progress bar background
    playedColor?: string // played color
    cachedColor?: string // cached color
    sliderBtnStyle?: Record<string, string> // slider button style
    volumeColor?: string // volume color
  }

  // Default styles
  const defaultStyle: VideoPlayerStyle = {
    progressColor: 'rgba(255, 255, 255, 0.3)',
    playedColor: '#00AEED',
    cachedColor: 'rgba(255, 255, 255, 0.6)',
    sliderBtnStyle: {
      width: '10px',
      height: '10px',
      backgroundColor: '#00AEED'
    },
    volumeColor: '#00AEED'
  }

  // Initialize player on mount
  onMounted(() => {
    playerInstance.value = new Player({
      id: props.playerId,
      lang: 'zh', // set UI language to Chinese
      volume: props.volume,
      autoplay: props.autoplay,
      screenShot: true, // enable screenshot
      url: props.videoUrl,
      poster: props.posterUrl,
      fluid: true, // fluid layout, fit container
      playbackRate: props.playbackRates,
      loop: props.loop,
      muted: props.muted,
      commonStyle: {
        ...defaultStyle,
        ...props.commonStyle
      }
    })

    // Play event listener
    playerInstance.value.on('play', () => {
      console.log('Video is playing')
    })

    // Pause event listener
    playerInstance.value.on('pause', () => {
      console.log('Video is paused')
    })

    // Error event listener
    playerInstance.value.on('error', (error) => {
      console.error('Error occurred:', error)
    })
  })

  // Cleanup player instance before unmount
  onBeforeUnmount(() => {
    if (playerInstance.value) {
      playerInstance.value.destroy()
    }
  })
</script>
