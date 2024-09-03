import { type DefineComponent } from 'vue';

// vue组件
export type VueComponent = DefineComponent<any, any, any>;

// vue h函数参数列表
export type VueHParams = [VueComponent, any?, any?];

export type Expose<T extends Record<string, any> = Record<string, any>> = T;
