import App from './App.vue'
import { createApp } from 'vue'
import { initStore } from './store'                 // Store
import { initRouter } from './router'               // Router
import '@styles/reset.scss'                         // Reset HTML styles
import '@styles/app.scss'                           // Global styles
import '@styles/el-ui.scss'                         // Element+ style tweaks
import '@styles/mobile.scss'                        // Mobile style optimization
import '@styles/change.scss'                        // Theme switch transition tweaks
import '@styles/theme-animation.scss'               // Theme switch animation
import '@styles/el-light.scss'                      // Element custom theme (light)
import '@styles/el-dark.scss'                       // Element custom theme (dark)
import '@styles/dark.scss'                          // System theme
import '@icons/system/iconfont.js'                  // System colored icons
import '@icons/system/iconfont.css'                 // System icons
import '@utils/sys/console.ts'                      // Console output content
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { setupGlobDirectives } from './directives'
import language from './locales'

document.addEventListener(
  'touchstart',
  function () {},
  { passive: false }
)

const app = createApp(App)
initStore(app)
initRouter(app)
setupGlobDirectives(app)

app.use(language)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')

