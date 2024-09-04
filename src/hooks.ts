import { getApp, getModalVue, modalSymbol } from "./context";
import { getModalInstance, ModalInstance } from "./modal";
import { Expose, VueComponent, VueHParams } from "./types/vue";
import { h, render, Suspense, onUnmounted } from 'vue';

export function useModal(component: VueComponent | VueHParams, modalComponent: VueComponent = getModalVue()) {
  let props: Record<string, any> = {};
  let slots = {};
  if (Array.isArray(component)) {
    component = component[0];
    props = component[1] || {};
    slots = component[2] || [];
  }
  const modal = new ModalInstance();
  props[modalSymbol] = modal;
  const instance = h(
    modalComponent,
    {
      [modalSymbol]: modal,
    },
    {
      default: () => h(Suspense, null, [h(component, props, slots)]),
    }
  );
  instance.appContext = getApp()._context;
  render(instance, document.body);
  const exposed = instance.component.exposed;
  Reflect.defineMetadata(modalSymbol, modal, exposed);
  modal.setExposed(exposed);
  onUnmounted(() => {
    modal.invokeDestroy();
  });
  return exposed;
}

export function withModal(props: any) {
  const modal = getModalInstance();
  if (!modal) {
    return;
  }
  return new Promise((resolve) => {
    Promise.resolve().then(() => {
      modal.setProps(props);
      modal.invokeModalInit();
      resolve(modal.getExposed());
    });
  });
}

export function onModalInit(func: Function) {
  const modal = getModalInstance();
  if (!modal) {
    return;
  }
  modal.addInitTask(func);
}

export function onEmit(names: string | string[], handle: Function, modalExpose: Expose) {
  let modal = null;
  modal = getModalInstance(modalExpose);
  if (!modal) {
    throw new Error(
      'onEmit在非模态框内嵌组件内调用时，需要传入useModal的返回值作为第3个参数，指定要监听的模态框'
    );
  }
  modal.addEmit(names, handle);
}

export function useEmit(emits: string | string[]) {
  const modal = getModalInstance();
  if (!modal) {
    throw new Error('useEmit必须在模态框模板组件内调用');
  }
  if (!emits) {
    return;
  }
  if (!Array.isArray(emits)) {
    emits = [emits];
  }
  return function emit(name: string, ...args: any[]) {
    if (!emits.includes(name)) {
      return;
    }
    Promise.resolve().then(() => {
      modal.invokeEmit(name, ...args);
    });
  };
}

export function onDestroy(handle: Function) {
  const modal = getModalInstance();
  if (!modal) {
    throw new Error('onDestroy必须在模态框模板组件内调用');
  }
  modal.addDestroyTask(handle);
}
