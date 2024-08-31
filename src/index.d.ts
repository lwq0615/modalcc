import { type App, type DefineComponent } from 'vue'


declare namespace Modalc {
  function init(app: App, modalVue: DefineComponent<any, any, any>): void
  function useModal<T = any>(component: DefineComponent<any, any, any>): T
  function withModal<T = any>(modalProps?: any): Promise<T>
  function onModalInit(func: (props: any) => void): void
}

export = Modalc