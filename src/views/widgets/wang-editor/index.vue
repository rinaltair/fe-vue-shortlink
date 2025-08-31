<template>
  <div class="page-content">
    <!-- Full Toolbar Editor -->
    <ElCard class="editor-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>🛠️ Full Toolbar Editor</span>
          <div class="header-buttons">
            <el-button size="small" @click="clearFullEditor">Clear</el-button>
            <el-button size="small" @click="getFullEditorContent">Get Content</el-button>
            <el-button size="small" @click="setFullEditorDemo">Set Demo</el-button>
          </div>
        </div>
      </template>

      <ArtWangEditor
        ref="fullEditorRef"
        v-model="fullEditorHtml"
        height="400px"
        placeholder="Enter content to try full features..."
        :exclude-keys="[]"
      />
    </ElCard>

    <!-- Simplified Toolbar Editor -->
    <el-card class="editor-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>✨ Simplified Toolbar Editor</span>
          <div class="header-buttons">
            <el-button size="small" @click="clearSimpleEditor">Clear</el-button>
            <el-button size="small" @click="getSimpleEditorContent">Get Content</el-button>
            <el-button size="small" @click="setSimpleEditorDemo">Set Demo</el-button>
          </div>
        </div>
      </template>

      <ArtWangEditor
        ref="simpleEditorRef"
        v-model="simpleEditorHtml"
        height="400px"
        placeholder="Enter content to try simplified features..."
        :toolbar-keys="simpleToolbarKeys"
      />
    </el-card>

    <!-- Content Preview -->
    <el-card class="preview-card" shadow="never">
      <template #header>
        <span>📖 Content Preview</span>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <h3>Full Editor Content</h3>
          <el-tabs v-model="fullActiveTab">
            <el-tab-pane label="Rendered" name="preview">
              <div class="content-preview" v-html="fullEditorHtml"></div>
            </el-tab-pane>
            <el-tab-pane label="HTML Source" name="html">
              <el-input
                v-model="fullEditorHtml"
                type="textarea"
                :rows="8"
                placeholder="HTML Source"
                readonly
              />
            </el-tab-pane>
          </el-tabs>
        </el-col>

        <el-col :span="12">
          <h3>Simple Editor Content</h3>
          <el-tabs v-model="simpleActiveTab">
            <el-tab-pane label="Rendered" name="preview">
              <div class="content-preview" v-html="simpleEditorHtml"></div>
            </el-tab-pane>
            <el-tab-pane label="HTML Source" name="html">
              <el-input
                v-model="simpleEditorHtml"
                type="textarea"
                :rows="8"
                placeholder="HTML Source"
                readonly
              />
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>

    <!-- Usage Guide -->
    <el-card class="usage-card" shadow="never">
      <template #header>
        <span>📚 Usage Guide</span>
      </template>

      <el-collapse v-model="activeCollapse">
        <el-collapse-item title="Basic Usage" name="basic">
          <pre><code class="language-vue">&lt;template&gt;
  &lt;ArtWangEditor v-model="content" /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'

const content = ref('&lt;p&gt;Initial content&lt;/p&gt;')
&lt;/script&gt;</code></pre>
        </el-collapse-item>

        <el-collapse-item title="Full Toolbar Config" name="full">
          <pre><code class="language-vue">&lt;template&gt;
  &lt;!-- Show all tools; exclude none --&gt;
  &lt;ArtWangEditor
    v-model="content"
    :exclude-keys="[]"
  /&gt;
&lt;/template&gt;</code></pre>
        </el-collapse-item>

        <el-collapse-item title="Simple Toolbar Config" name="simple">
          <pre><code class="language-vue">&lt;template&gt;
  &lt;!-- Show basic editing tools only --&gt;
  &lt;ArtWangEditor
    v-model="content"
    :toolbar-keys="[
      'bold', 'italic', 'underline', '|',
      'bulletedList', 'numberedList', '|',
      'insertLink', 'insertImage', '|',
      'undo', 'redo'
    ]"
  /&gt;
&lt;/template&gt;</code></pre>
        </el-collapse-item>

        <el-collapse-item title="Custom Config" name="config">
          <pre><code class="language-vue">&lt;template&gt;
  &lt;ArtWangEditor
    v-model="content"
    height="600px"
    placeholder="Please enter your content..."
    :exclude-keys="['fontFamily', 'fontSize']"
    :upload-config="{
      maxFileSize: 5 * 1024 * 1024,
      maxNumberOfFiles: 5
    }"
  /&gt;
&lt;/template&gt;</code></pre>
        </el-collapse-item>

        <el-collapse-item title="Component Methods" name="methods">
          <pre><code class="language-vue">&lt;template&gt;
  &lt;ArtWangEditor ref="editorRef" v-model="content" /&gt;
  &lt;el-button @click="handleClear"&gt;Clear&lt;/el-button&gt;
  &lt;el-button @click="handleFocus"&gt;Focus&lt;/el-button&gt;
  &lt;el-button @click="handleGetContent"&gt;Get Content&lt;/el-button&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'

const editorRef = ref()
const content = ref('')

const handleClear = () =&gt; {
  editorRef.value?.clear()
}

const handleFocus = () =&gt; {
  editorRef.value?.focus()
}

const handleGetContent = () =&gt; {
  const html = editorRef.value?.getHtml()
  console.log('Editor content:', html)
}
&lt;/script&gt;</code></pre>
        </el-collapse-item>

        <el-collapse-item title="Toolbar Config Notes" name="toolbar-config">
          <div class="toolbar-explanation">
            <h4>Full Toolbar vs. Simplified Toolbar</h4>
            <el-row :gutter="16">
              <el-col :span="12">
                <h5>✅ Full toolbar includes:</h5>
                <ul>
                  <li>Text: bold, italic, underline, font color, background</li>
                  <li>Paragraph: headings, quote, alignment, indent</li>
                  <li>Lists: ordered, unordered, todo</li>
                  <li>Insert: link, image, table, divider, emoji</li>
                  <li>Code: code block, inline code</li>
                  <li>Actions: undo, redo, fullscreen, clear formatting</li>
                </ul>
              </el-col>
              <el-col :span="12">
                <h5>⚡ Simplified toolbar includes:</h5>
                <ul>
                  <li>Basic: bold, italic, underline</li>
                  <li>Lists: ordered, unordered</li>
                  <li>Insert: link, image</li>
                  <li>Actions: undo, redo</li>
                </ul>
                <p class="note">Great for simple editing scenarios with a cleaner UI.</p>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'

  // Editor refs
  const fullEditorRef = ref()
  const simpleEditorRef = ref()

  // Tab states
  const fullActiveTab = ref('preview')
  const simpleActiveTab = ref('preview')
  const activeCollapse = ref(['basic'])

  // Simple toolbar config
  const simpleToolbarKeys = [
    'bold',
    'italic',
    'underline',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'insertLink',
    'insertImage',
    '|',
    'undo',
    'redo'
  ]

  // Full editor content
  const fullEditorHtml = ref(`<h1>🎨 Full Toolbar Editor Demo</h1>
<p>This editor includes all features so you can try rich formatting.</p>

<h2>✨ Text Styles</h2>
<p><strong>This is bold text</strong></p>
<p><em>This is italic text</em></p>
<p><u>This is underlined text</u></p>
<p><span style="color: rgb(194, 79, 74);">This is colored text</span></p>

<h2>📝 Lists and Todos</h2>
<ul>
  <li>Unordered item 1</li>
  <li>Unordered item 2</li>
</ul>

<ol>
  <li>Ordered item 1</li>
  <li>Ordered item 2</li>
</ol>

<ul class="w-e-todo">
  <li class="w-e-todo-item"><input type="checkbox" checked="true" readonly="true" disabled="disabled"><span>Completed task</span></li>
  <li class="w-e-todo-item"><input type="checkbox" readonly="true" disabled="disabled"><span>Pending task</span></li>
</ul>

<h2>💬 Blockquote and Table</h2>
<blockquote>
  This is a quoted paragraph showing quote style.
</blockquote>

<table style="border-collapse: collapse; width: 100%;" border="1">
  <thead>
    <tr><th>Feature</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>Full toolbar</td><td>Includes all editing features</td></tr>
    <tr><td>Custom config</td><td>Supports flexible toolbar configuration</td></tr>
  </tbody>
</table>

<h2>💻 Code Block</h2>
<pre><code class="language-javascript">// Full editor supports syntax highlighting
function createEditor() {
  return new WangEditor({
    container: '#editor',
    toolbar: 'full' // Full toolbar
  });
}</code></pre>

<p>🔗 <a href="https://www.wangeditor.com/" target="_blank">Visit the official site to learn more</a></p>`)

  // Simple editor content
  const simpleEditorHtml = ref(`<h1>✨ Simplified Toolbar Editor Demo</h1>
<p>This editor includes only basic features for a simpler UI.</p>

<h2>Basic Text Styles</h2>
<p><strong>Bold text</strong></p>
<p><em>Italic text</em></p>
<p><u>Underlined text</u></p>

<h2>List Features</h2>
<ul>
  <li>Unordered item 1</li>
  <li>Unordered item 2</li>
</ul>

<ol>
  <li>Ordered item 1</li>
  <li>Ordered item 2</li>
</ol>

<h2>Links and Images</h2>
<p>Supports inserting <a href="https://www.wangeditor.com/" target="_blank">links</a> and images.</p>

<p>The simplified editor focuses on essentials and is ideal for simple content.</p>`)

  // Full editor actions
  const clearFullEditor = () => {
    fullEditorRef.value?.clear()
    ElMessage.success('Full editor cleared')
  }

  const getFullEditorContent = () => {
    const content = fullEditorRef.value?.getHtml()
    console.log('Full editor content:', content)
    ElMessage.success('Full editor content printed to console')
  }

  const setFullEditorDemo = () => {
    const demoContent = `<h2>🎉 Full Editor Demo Content</h2>
<p>Demo content set via method, showing the full editor's power.</p>
<ul>
  <li>Supports rich text formatting</li>
  <li>Includes advanced features like tables and code blocks</li>
  <li>Provides a complete editing experience</li>
</ul>
<table style="border-collapse: collapse; width: 100%;" border="1">
  <tr><th>Feature</th><th>Status</th></tr>
  <tr><td>Full toolbar</td><td>✅ Enabled</td></tr>
  <tr><td>Advanced features</td><td>✅ Enabled</td></tr>
</table>`

    fullEditorRef.value?.setHtml(demoContent)
    ElMessage.success('Full editor demo content set')
  }

  // Simple editor actions
  const clearSimpleEditor = () => {
    simpleEditorRef.value?.clear()
    ElMessage.success('Simple editor cleared')
  }

  const getSimpleEditorContent = () => {
    const content = simpleEditorRef.value?.getHtml()
    console.log('Simple editor content:', content)
    ElMessage.success('Simple editor content printed to console')
  }

  const setSimpleEditorDemo = () => {
    const demoContent = `<h2>⚡ Simple Editor Demo Content</h2>
<p>Demo content set via method, showing the simple editor's core features.</p>
<ul>
  <li><strong>Basic styles</strong>: bold, italic, underline</li>
  <li><em>List support</em>: ordered and unordered lists</li>
  <li><u>Media</u>: links and images</li>
</ul>
<ol>
  <li>Clean, minimal UI</li>
  <li>Focused, practical features</li>
  <li>Great for quick edits</li>
</ol>
<p>🔗 <a href="https://example.com" target="_blank">Example link</a></p>`

    simpleEditorRef.value?.setHtml(demoContent)
    ElMessage.success('Simple editor demo content set')
  }
</script>

<style lang="scss" scoped>
  .page-content {
    padding: 20px;
  }

  .editor-card {
    margin-bottom: 24px;

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .header-buttons {
        display: flex;
        gap: 8px;
      }
    }
  }

  .editor-description {
    padding: 12px 16px;
    margin-bottom: 16px;
    background-color: var(--el-bg-color-page);
    border-left: 4px solid var(--el-color-primary);
    border-radius: 8px;

    p {
      margin: 0;
      font-size: 14px;
      color: var(--el-text-color-regular);
    }
  }

  .preview-card {
    margin-bottom: 24px;

    h3 {
      margin: 0 0 16px;
      font-size: 16px;
      color: var(--el-text-color-primary);
    }

    .content-preview {
      min-height: 200px;
      max-height: 300px;
      padding: 16px;
      overflow-y: auto;
      background-color: var(--el-bg-color);
      border: 1px solid var(--el-border-color);
      border-radius: 6px;

      // Ensure preview content styles render correctly
      :deep(h1),
      :deep(h2),
      :deep(h3) {
        margin: 16px 0 8px;
      }

      :deep(p) {
        margin: 8px 0;
        line-height: 1.6;
      }

      :deep(table) {
        margin: 16px 0;

        th,
        td {
          padding: 8px 12px;
        }
      }

      :deep(pre) {
        padding: 12px;
        margin: 16px 0;
        overflow-x: auto;
        background-color: var(--el-fill-color-light);
        border-radius: 4px;
      }

      :deep(blockquote) {
        padding-left: 16px;
        margin: 16px 0;
        color: var(--el-text-color-regular);
        border-left: 4px solid var(--el-color-primary);
      }
    }
  }

  .usage-card {
    :deep(.el-collapse-item__content) {
      padding-bottom: 16px;
    }

    pre {
      padding: 16px;
      margin: 0;
      overflow-x: auto;
      background-color: var(--el-fill-color-light);
      border-radius: 6px;

      code {
        font-family: Consolas, Monaco, 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.5;
      }
    }

    .toolbar-explanation {
      h4 {
        margin: 0 0 16px;
        color: var(--el-text-color-primary);
      }

      h5 {
        margin: 0 0 8px;
        font-size: 14px;
        color: var(--el-text-color-regular);
      }

      ul {
        padding-left: 20px;
        margin: 8px 0 16px;

        li {
          margin: 4px 0;
          font-size: 13px;
          color: var(--el-text-color-regular);
        }
      }

      .note {
        margin: 8px 0 0;
        font-size: 12px;
        font-style: italic;
        color: var(--el-text-color-placeholder);
      }
    }
  }

  // Responsive design
  @media (width <= 768px) {
    .page-content {
      padding: 12px;
    }

    .card-header {
      flex-direction: column;
      gap: 12px;
      align-items: stretch !important;

      .header-buttons {
        justify-content: center;
      }
    }

    .preview-card {
      :deep(.el-col) {
        margin-bottom: 16px;
      }
    }
  }
</style>
