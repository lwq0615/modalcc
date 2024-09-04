## init

```ts
/**
 * 初始化运行环境
 * @param app createApp创建的app
 * @param modalVue 默认的模态框模板
 */
function init(app: App, modalVue: VueComponent): void;
```

## useModal

```ts
/**
 * 在调用方使用，指定要嵌入模态框的组件，并生成模态框实例
 * @param component 需要嵌入模态框的组件/组件配置
 * @param modalVue 覆盖默认的模态框模板
 * @returns 模态框模板defineExpose的对象，通过这个对象控制模态框行为
 */
function useModal<T = any>(
  component: VueComponent | VueHParams,
  modalVue?: VueComponent
): T;
```

## withModal

```ts
/**
 * 内嵌组件内调用，给模态框传递初始参数
 * @param modalProps 需要传递给模态框的数据，一般是需要设置的模态框props
 * @returns 模态框defineExpose的对象，通过这个对象控制模态框行为
 */
function withModal<T = any>(modalProps?: any): T;
```

## onModalInit

```ts
/**
 * 在模态框模板内调用，接收内嵌组件传递的参数，在内嵌组件调用withModal时触发
 * @param func 回调函数，参数props为withModal传递的值
 */
function onModalInit(func: (props: any) => void): void;
```

## useEmit

```ts
/**
 * 在模态框模板内调用，定义模态框的事件列表
 * @param emits 模态框的事件列表
 * @returns 返回一个事件抛出函数，调用指定事件
 */
function useEmit(
  emits: string | string[]
): (name: string, ...args: any[]) => void;
```

## onEmit

```ts
/**
 * 在内嵌组件内调用，监听模态框事件
 * @param names 监听事件列表
 * @param handle 事件触发时执行的函数，入参为抛出事件时传递的参数
 * @param modalExpose 可以指定需要监听的弹窗实例，指定此参数时，该函数可以在任何位置调用
 */
function onEmit(
  names: string | string[],
  handle: (...args: any[]) => void,
  modalExpose?: any
): void;
```

## onDestroy

```ts
/**
 * 在模态框模板内调用，调用useModal的组件（调用方）被销毁时触发
 * @param handle 事件触发时执行的函数
 */
function onDestroy(handle: Function): void;
```
