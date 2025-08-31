<!-- WangEditor rich text editor. Plugin: https://www.wangeditor.com/ -->
<template>
  <div class="editor-wrapper">
    <Toolbar
      class="editor-toolbar"
      :editor="editorRef"
      :mode="mode"
      :defaultConfig="toolbarConfig"
    />
    <Editor
      :style="{ height: height, overflowY: 'hidden' }"
      v-model="modelValue"
      :mode="mode"
      :defaultConfig="editorConfig"
      @onCreated="onCreateEditor"
    />
  </div>
</template>

<script setup lang="ts">
  import '@wangeditor/editor/dist/css/style.css'
  import { onBeforeUnmount, onMounted, shallowRef, computed } from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { useUserStore } from '@/store/modules/user'
  import { ElMessage } from 'element-plus'
  import EmojiText from '@/utils/ui/emojo'
  import { IDomEditor, IToolbarConfig, IEditorConfig } from '@wangeditor/editor'

  defineOptions({ name: 'ArtWangEditor' })

  // Props
  interface Props {
    /** Editor height */
    height?: string
    /** Custom toolbar keys */
    toolbarKeys?: string[]
    /** Insert new tools at a position */
    insertKeys?: { index: number; keys: string[] }
    /** Excluded toolbar keys */
    excludeKeys?: string[]
    /** Editor mode */
    mode?: 'default' | 'simple'
    /** Placeholder text */
    placeholder?: string
    /** Upload config */
    uploadConfig?: {
      maxFileSize?: number
      maxNumberOfFiles?: number
      server?: string
    }
  }

  const props = withDefaults(defineProps<Props>(), {
    height: '500px',
    mode: 'default',
    placeholder: 'Please enter content...',
    excludeKeys: () => ['fontFamily']
  })

  const modelValue = defineModel<string>({ required: true })

  // Editor instance
  const editorRef = shallowRef<IDomEditor>()
  const userStore = useUserStore()

  // Constants
  const DEFAULT_UPLOAD_CONFIG = {
    maxFileSize: 3 * 1024 * 1024, // 3MB
    maxNumberOfFiles: 10,
    fieldName: 'file',
    allowedFileTypes: ['image/*']
  } as const

  // Icon map
  const ICON_MAP = {
    bold: '&#xe630;',
    blockquote: '&#xe61c;',
    underline: '&#xe65a;',
    italic: '&#xe638;',
    'group-more-style': '&#xe648;',
    color: '&#xe68c;',
    bgColor: '&#xe691;',
    bulletedList: '&#xe64e;',
    numberedList: '&#xe66c;',
    todo: '&#xe641;',
    'group-justify': '&#xe67e;',
    'group-indent': '&#xe63e;',
    emotion: '&#xe690;',
    insertLink: '&#xe63a;',
    'group-image': '&#xe634;',
    insertTable: '&#xe67b;',
    codeBlock: '&#xe68b;',
    divider: '&#xe66d;',
    undo: '&#xe65e;',
    redo: '&#xe659;',
    fullScreen: '&#xe633;',
    tableFullWidth: '&#xe67b;'
  } as const

  // Computed upload server
  const uploadServer = computed(
    () =>
      props.uploadConfig?.server || `${import.meta.env.VITE_API_URL}/api/common/upload/wangeditor`
  )

  // Merge upload config
  const mergedUploadConfig = computed(() => ({
    ...DEFAULT_UPLOAD_CONFIG,
    ...props.uploadConfig
  }))

  // Toolbar config
  const toolbarConfig = computed((): Partial<IToolbarConfig> => {
    const config: Partial<IToolbarConfig> = {}

    // Fully custom toolbar
    if (props.toolbarKeys && props.toolbarKeys.length > 0) {
      config.toolbarKeys = props.toolbarKeys
    }

    // Insert new tools
    if (props.insertKeys) {
      config.insertKeys = props.insertKeys
    }

    // Exclude tools
    if (props.excludeKeys && props.excludeKeys.length > 0) {
      config.excludeKeys = props.excludeKeys
    }

    return config
  })

  // Editor config
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: props.placeholder,
    MENU_CONF: {
      uploadImage: {
        fieldName: mergedUploadConfig.value.fieldName,
        maxFileSize: mergedUploadConfig.value.maxFileSize,
        maxNumberOfFiles: mergedUploadConfig.value.maxNumberOfFiles,
        allowedFileTypes: mergedUploadConfig.value.allowedFileTypes,
        server: uploadServer.value,
        headers: {
          Authorization: userStore.accessToken
        },
        onSuccess() {
          ElMessage.success(`Image uploaded successfully ${EmojiText[200]}`)
        },
        onError(file: File, err: any, res: any) {
          console.error('Image upload failed:', err, res)
          ElMessage.error(`Image upload failed ${EmojiText[500]}`)
        }
      }
    }
  }

  // Editor creation callback
  const onCreateEditor = (editor: IDomEditor) => {
    editorRef.value = editor

    // Listen to fullscreen event
    editor.on('fullScreen', () => {
      console.log('Editor entered fullscreen')
    })

    // Ensure custom icons applied after creation
    applyCustomIcons()
  }

  // Optimized icon replacement for a specific editor instance
  const overrideIcons = (editorInstance: IDomEditor) => {
    // Get current editor's toolbar container
    const editorContainer = editorInstance.getEditableContainer().closest('.editor-wrapper')
    if (!editorContainer) return

    const toolbar = editorContainer.querySelector('.w-e-toolbar')
    if (!toolbar) return

    Object.entries(ICON_MAP).forEach(([menuKey, iconCode]) => {
      const button = toolbar.querySelector(`button[data-menu-key="${menuKey}"]`)
      if (button) {
        button.innerHTML = `<i class='iconfont-sys'>${iconCode}</i>`
      }
    })
  }

  // Apply custom icons (with retry)
  const applyCustomIcons = () => {
    let retryCount = 0
    const maxRetries = 10
    const retryDelay = 100

    const tryApplyIcons = () => {
      const editor = editorRef.value
      if (!editor) {
        if (retryCount < maxRetries) {
          retryCount++
          setTimeout(tryApplyIcons, retryDelay)
        }
        return
      }

      // Get current editor's toolbar container
      const editorContainer = editor.getEditableContainer().closest('.editor-wrapper')
      if (!editorContainer) {
        if (retryCount < maxRetries) {
          retryCount++
          setTimeout(tryApplyIcons, retryDelay)
        }
        return
      }

      const toolbar = editorContainer.querySelector('.w-e-toolbar')
      const toolbarButtons = editorContainer.querySelectorAll('.w-e-bar-item button[data-menu-key]')

      if (toolbar && toolbarButtons.length > 0) {
        overrideIcons(editor)
        return
      }

      // If the toolbar hasn't finished rendering yet, keep retrying
      if (retryCount < maxRetries) {
        retryCount++
        setTimeout(tryApplyIcons, retryDelay)
      } else {
        console.warn(
          'Toolbar render timed out, unable to apply custom icons - editor id:',
          editor.id
        )
      }
    }

    // Use requestAnimationFrame to run on the next frame
    requestAnimationFrame(tryApplyIcons)
  }

  // Expose editor instance and methods
  defineExpose({
    /** Get editor instance */
    getEditor: () => editorRef.value,
    /** Set editor content */
    setHtml: (html: string) => editorRef.value?.setHtml(html),
    /** Get editor content */
    getHtml: () => editorRef.value?.getHtml(),
    /** Clear editor */
    clear: () => editorRef.value?.clear(),
    /** Focus editor */
    focus: () => editorRef.value?.focus()
  })

  // Lifecycle
  onMounted(() => {
    // Icon replacement is handled in onCreateEditor
  })

  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor) {
      editor.destroy()
    }
  })
</script>

<style lang="scss">
  @use './style';
</style>
