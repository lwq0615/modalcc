import { App } from 'vue';
import { VueComponent } from './types/vue';

export const modalSymbol = '__modalcc';
let app: App;
let modalVue: VueComponent;

// 初始化运行环境
export function init(appMain: App, modal: VueComponent) {
  app = appMain;
  modalVue = modal;
}

export function getApp() {
  return app
} 

export function getModalVue() {
  return modalVue
}