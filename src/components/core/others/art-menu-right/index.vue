<!-- Context menu -->
<template>
  <div class="menu-right">
    <Transition name="context-menu" @before-enter="onBeforeEnter" @after-leave="onAfterLeave">
      <div v-show="visible" :style="menuStyle" class="context-menu">
        <ul class="menu-list" :style="menuListStyle">
          <template v-for="item in menuItems" :key="item.key">
            <!-- Normal menu item -->
            <li
              v-if="!item.children"
              class="menu-item"
              :class="{ 'is-disabled': item.disabled, 'has-line': item.showLine }"
              :style="menuItemStyle"
              @click="handleMenuClick(item)"
            >
              <i v-if="item.icon" class="iconfont-sys" v-html="item.icon"></i>
              <span class="menu-label">{{ item.label }}</span>
            </li>

            <!-- Submenu -->
            <li v-else class="menu-item submenu" :style="menuItemStyle">
              <div class="submenu-title">
                <i v-if="item.icon" class="iconfont-sys" v-html="item.icon"></i>
                <span class="menu-label">{{ item.label }}</span>
                <i class="iconfont-sys submenu-arrow">&#xe865;</i>
              </div>
              <ul class="submenu-list" :style="submenuListStyle">
                <li
                  v-for="child in item.children"
                  :key="child.key"
                  class="menu-item"
                  :class="{ 'is-disabled': child.disabled, 'has-line': child.showLine }"
                  :style="menuItemStyle"
                  @click="handleMenuClick(child)"
                >
                  <i v-if="child.icon" class="iconfont-sys" v-html="child.icon"></i>
                  <span class="menu-label">{{ child.label }}</span>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import type { CSSProperties } from 'vue'

  defineOptions({ name: 'ArtMenuRight' })

  export interface MenuItemType {
    /** unique key */
    key: string
    /** label */
    label: string
    /** icon */
    icon?: string
    /** disabled */
    disabled?: boolean
    /** show divider */
    showLine?: boolean
    /** children */
    children?: MenuItemType[]
    [key: string]: any
  }

  interface Props {
    menuItems: MenuItemType[]
    /** menu width */
    menuWidth?: number
    /** submenu width */
    submenuWidth?: number
    /** item height */
    itemHeight?: number
    /** boundary distance */
    boundaryDistance?: number
    /** menu padding */
    menuPadding?: number
    /** item horizontal padding */
    itemPaddingX?: number
    /** menu border radius */
    borderRadius?: number
    /** animation duration */
    animationDuration?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    menuWidth: 120,
    submenuWidth: 150,
    itemHeight: 32,
    boundaryDistance: 10,
    menuPadding: 5,
    itemPaddingX: 6,
    borderRadius: 6,
    animationDuration: 100
  })

  const emit = defineEmits<{
    (e: 'select', item: MenuItemType): void
    (e: 'show'): void
    (e: 'hide'): void
  }>()

  const visible = ref(false)
  const position = ref({ x: 0, y: 0 })

  // For cleaning timers and listeners
  let showTimer: number | null = null
  let eventListenersAdded = false

  // Compute menu styles
  const menuStyle = computed(
    (): CSSProperties => ({
      position: 'fixed' as const,
      left: `${position.value.x}px`,
      top: `${position.value.y}px`,
      zIndex: 2000,
      width: `${props.menuWidth}px`
    })
  )

  // Compute menu list styles
  const menuListStyle = computed(
    (): CSSProperties => ({
      padding: `${props.menuPadding}px`
    })
  )

  // Compute menu item styles
  const menuItemStyle = computed(
    (): CSSProperties => ({
      height: `${props.itemHeight}px`,
      padding: `0 ${props.itemPaddingX}px`,
      borderRadius: '4px'
    })
  )

  // Compute submenu list styles
  const submenuListStyle = computed(
    (): CSSProperties => ({
      minWidth: `${props.submenuWidth}px`,
      padding: `${props.menuPadding}px 0`,
      borderRadius: `${props.borderRadius}px`
    })
  )

  // Compute menu height (for boundary checks)
  const calculateMenuHeight = (): number => {
    let totalHeight = props.menuPadding * 2 // vertical padding

    props.menuItems.forEach((item) => {
      totalHeight += props.itemHeight
      if (item.showLine) {
        totalHeight += 10 // divider extra height
      }
    })

    return totalHeight
  }

  // Optimized position calculation
  const calculatePosition = (e: MouseEvent) => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const menuHeight = calculateMenuHeight()

    let x = e.clientX
    let y = e.clientY

    // Check right boundary: prefer right of cursor, else left
    if (x + props.menuWidth > screenWidth - props.boundaryDistance) {
      x = Math.max(props.boundaryDistance, x - props.menuWidth)
    }

    // Check bottom boundary: prefer below cursor, else adjust up
    if (y + menuHeight > screenHeight - props.boundaryDistance) {
      y = Math.max(props.boundaryDistance, screenHeight - menuHeight - props.boundaryDistance)
    }

    // Ensure within viewport boundaries
    x = Math.max(
      props.boundaryDistance,
      Math.min(x, screenWidth - props.menuWidth - props.boundaryDistance)
    )
    y = Math.max(
      props.boundaryDistance,
      Math.min(y, screenHeight - menuHeight - props.boundaryDistance)
    )

    return { x, y }
  }

  // Add event listeners
  const addEventListeners = () => {
    if (eventListenersAdded) return

    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('contextmenu', handleDocumentContextmenu)
    document.addEventListener('keydown', handleKeydown)
    eventListenersAdded = true
  }

  // Remove event listeners
  const removeEventListeners = () => {
    if (!eventListenersAdded) return

    document.removeEventListener('click', handleDocumentClick)
    document.removeEventListener('contextmenu', handleDocumentContextmenu)
    document.removeEventListener('keydown', handleKeydown)
    eventListenersAdded = false
  }

  // Handle document click
  const handleDocumentClick = (e: Event) => {
    // Check if click is inside menu
    const target = e.target as Element
    const menuElement = document.querySelector('.context-menu')
    if (menuElement && menuElement.contains(target)) {
      return
    }
    hide()
  }

  // Handle document contextmenu
  const handleDocumentContextmenu = () => {
    hide()
  }

  // Handle keyboard events
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      hide()
    }
  }

  const show = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Clear previous timer
    if (showTimer) {
      window.clearTimeout(showTimer)
      showTimer = null
    }

    // Calculate position
    position.value = calculatePosition(e)
    visible.value = true

    emit('show')

    // Delay adding listeners to avoid immediate close
    showTimer = window.setTimeout(() => {
      if (visible.value) {
        addEventListeners()
      }
      showTimer = null
    }, 50) // Reduce delay for responsiveness
  }

  const hide = () => {
    if (!visible.value) return

    visible.value = false
    emit('hide')

    // Clear timer
    if (showTimer) {
      window.clearTimeout(showTimer)
      showTimer = null
    }

    // Remove event listeners
    removeEventListeners()
  }

  const handleMenuClick = (item: MenuItemType) => {
    if (item.disabled) return
    emit('select', item)
    hide()
  }

  // Transition hooks
  const onBeforeEnter = (el: Element) => {
    const element = el as HTMLElement
    element.style.transformOrigin = 'top left'
  }

  const onAfterLeave = () => {
    // Ensure cleanup of all resources
    removeEventListeners()
    if (showTimer) {
      window.clearTimeout(showTimer)
      showTimer = null
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    removeEventListeners()
    if (showTimer) {
      window.clearTimeout(showTimer)
      showTimer = null
    }
  })

  // Expose methods to parent
  defineExpose({
    show,
    hide,
    visible: computed(() => visible.value)
  })
</script>

<style lang="scss" scoped>
  .menu-right {
    .context-menu {
      width: v-bind('props.menuWidth + "px"');
      min-width: v-bind('props.menuWidth + "px"');
      background: var(--el-bg-color);
      border: 1px solid var(--el-border-color-light);
      border-radius: v-bind('props.borderRadius + "px"');
      box-shadow: var(--art-box-shadow-xs);

      .menu-list {
        margin: 0;
        list-style: none;

        .menu-item {
          position: relative;
          display: flex;
          align-items: center;
          font-size: 13px;
          color: var(--el-text-color-primary);
          cursor: pointer;
          user-select: none;
          transition: background-color 0.15s ease;

          &:hover:not(.is-disabled) {
            background-color: rgba(var(--art-gray-200-rgb), 0.7);
          }

          &.has-line {
            margin-bottom: 10px;

            &::after {
              position: absolute;
              right: 0;
              bottom: -5px;
              left: 0;
              height: 1px;
              content: '';
              background-color: rgba(var(--art-gray-300-rgb), 0.5);
            }
          }

          i:not(.submenu-arrow) {
            flex-shrink: 0;
            margin-right: 8px;
            font-size: 16px;
            color: var(--art-gray-800);
          }

          .menu-label {
            flex: 1;
            overflow: hidden;
            color: var(--art-gray-800);
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          &.is-disabled {
            color: var(--el-text-color-disabled);
            cursor: not-allowed;

            &:hover {
              background-color: transparent !important;
            }

            i:not(.submenu-arrow) {
              color: var(--el-text-color-disabled) !important;
            }

            .menu-label {
              color: var(--el-text-color-disabled) !important;
            }
          }

          &.submenu {
            &:hover {
              .submenu-list {
                display: block;
              }
            }

            .submenu-title {
              display: flex;
              align-items: center;
              width: 100%;

              .submenu-arrow {
                margin-right: 0;
                margin-left: auto;
                font-size: 12px;
                color: var(--art-gray-600);
                transition: transform 0.15s ease;
              }
            }

            &:hover .submenu-title .submenu-arrow {
              transform: rotate(90deg);
            }

            .submenu-list {
              position: absolute;
              top: 0;
              left: 100%;
              z-index: 2001;
              display: none;
              width: max-content;
              min-width: max-content;
              list-style: none;
              background: var(--el-bg-color);
              border: 1px solid var(--el-border-color-light);
              box-shadow: var(--el-box-shadow-light);

              .menu-item {
                position: relative;
                display: flex;
                align-items: center;
                margin: 0 6px;
                font-size: 13px;
                color: var(--el-text-color-primary);
                cursor: pointer;
                user-select: none;
                transition: background-color 0.15s ease;

                &:hover:not(.is-disabled) {
                  background-color: rgba(var(--art-gray-200-rgb), 0.7);
                }

                &.has-line {
                  margin-bottom: 10px;

                  &::after {
                    position: absolute;
                    right: 0;
                    bottom: -5px;
                    left: 0;
                    height: 1px;
                    content: '';
                    background-color: rgba(var(--art-gray-300-rgb), 0.5);
                  }
                }

                i:not(.submenu-arrow) {
                  flex-shrink: 0;
                  margin-right: 8px;
                  font-size: 16px;
                  color: var(--art-gray-800);
                }

                .menu-label {
                  flex: 1;
                  overflow: hidden;
                  color: var(--art-gray-800);
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                &.is-disabled {
                  color: var(--el-text-color-disabled);
                  cursor: not-allowed;

                  &:hover {
                    background-color: transparent !important;
                  }

                  i:not(.submenu-arrow) {
                    color: var(--el-text-color-disabled) !important;
                  }

                  .menu-label {
                    color: var(--el-text-color-disabled) !important;
                  }
                }
              }
            }
          }
        }
      }
    }

    // Transition styles
    .context-menu-enter-active,
    .context-menu-leave-active {
      transition: all v-bind('props.animationDuration + "ms"') ease-out;
    }

    .context-menu-enter-from,
    .context-menu-leave-to {
      opacity: 0;
      transform: scale(0.9);
    }

    .context-menu-enter-to,
    .context-menu-leave-from {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
