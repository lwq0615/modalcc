import { type App, type DefineComponent } from 'vue'

type VueComponent = DefineComponent<any, any, any>

declare namespace Modalcc {
  function init(app: App, modalVue: VueComponent): void
  function useModal<T = any>(component: VueComponent, modalVue?: VueComponent): T
  function withModal<T = any>(modalProps?: any): Promise<T>
  function onModalInit(func: (props: any) => void): void
}

export = Modalcc