/// <reference types="vite/client" />

declare module 'nprogress'

declare module 'crypto-js'

declare module 'vue-img-cutter'

declare module 'file-saver'

declare module 'qrcode.vue' {
  export type Level = 'L' | 'M' | 'Q' | 'H'
  export type RenderAs = 'canvas' | 'svg'
  export type GradientType = 'linear' | 'radial'
  export interface ImageSettings {
    src: string
    height: number
    width: number
    excavate: boolean
  }
  export interface QRCodeProps {
    value: string
    size?: number
    level?: Level
    background?: string
    foreground?: string
    renderAs?: RenderAs
  }
  const QrcodeVue: any
  export default QrcodeVue
}

// Global variable declarations
declare const __APP_VERSION__: string // Application version

// Environment variable hints
// interface ImportMetaEnv {
//   VITE_BASE_API_URL: string
// }

// Import vue-i18n type definitions
// import 'vue-i18n';

// declare module 'vue' {
//   interface ComponentCustomProperties {
//     $t: typeof import('vue-i18n').t;
//   }
// }
