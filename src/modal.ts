import { modalSymbol } from "./context";
import { Expose } from "./types/vue";
import { useAttrs } from 'vue'


export class ModalInstance {
  #props: any;
  setProps(props: any) {
    this.#props = props;
  }
  getProps() {
    return this.#props;
  }
  #modalInitTask: Function[] = [];
  addInitTask(func: Function) {
    if (typeof func !== 'function') {
      return;
    }
    this.#modalInitTask.push(func);
  }
  invokeModalInit() {
    for (const task of this.#modalInitTask) {
      task(this.getProps());
    }
  }
  #exposed: Expose = {};
  setExposed(exposed: Record<string, any>) {
    this.#exposed = exposed;
  }
  getExposed() {
    return this.#exposed;
  }
  #emits: Record<string, any> = {};
  addEmit(names: string | string[], handle: Function) {
    if (!names || !handle) {
      return;
    }
    if (!Array.isArray(names)) {
      names = [names];
    }
    for (const name of names) {
      if (this.#emits[name]) {
        this.#emits[name].push(handle);
      } else {
        this.#emits[name] = [handle];
      }
    }
  }
  invokeEmit(name: string, ...args: any[]) {
    if (!this.#emits[name]) {
      return;
    }
    for (const handle of this.#emits[name]) {
      handle(...args);
    }
  }
  #destroyTask: Function[] = [];
  addDestroyTask(func: Function) {
    if (typeof func !== 'function') {
      return;
    }
    this.#destroyTask.push(func);
  }
  invokeDestroy() {
    for (const task of this.#destroyTask) {
      task();
    }
  }
}

export function getModalInstance(modalExpose?: Expose) {
  if (modalExpose) {
    return Reflect.getMetadata(modalSymbol, modalExpose);
  }
  return useAttrs()[modalSymbol];
}