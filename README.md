<h1 align="center">Modalcc</h1>

<div align="center">
  
Vue3模态框最佳实践

[NPM][npm-url]&nbsp;&nbsp;&nbsp;&nbsp;[Github][github-url]

[npm-url]: https://www.npmjs.com/package/modalcc
[github-url]: https://github.com/lwq0615/modalcc.git
  
</div>

## 🌈 Modalcc 的重大突破

* 无需关心模态框的状态绑定
* 无需要再把模态框书写到 template 中
* 以命令式思维去调用模态框
* 一个组件，多种行为

## ✨ 特性

* 🌍 适用于任何版本的 Vue3
* 🌈 极低的学习成本，仅仅只有4个 API
* 📦 提供完整的 TypeScript 类型定义文件

## ⚙️ 如何使用

* 安装依赖

```bash
npm install modalcc
// or
yarn add modalcc
```

* 创建模态框模板`modal.vue`，后续的模态框默认都以这个模态框为基础，此处以antd的模态框为例

```vue
<template>
  <a-modal
    v-model:open="open"
    cancel-text="取消"
    ok-text="确定"
    v-bind="config"
  >
    <!-- 定义模态框内容插入的位置 -->
    <slot />
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onModalInit } from 'modalcc'

const open = ref(false)
// 动态绑定模态框属性
const config = ref({})

// onModalInit方法会在每个模态框初始化时执行，可能是组件渲染时
// 也可能是模态框展开时，取决于你何时渲染模态框内容
onModalInit(props => {
  config.value = props
})

// 模态框对外暴露的事件
defineExpose({
  show() {
    open.value = true
  },
})
</script>
```

* 入口文件中配置 Modalcc

```ts
import Modal from './modal.vue'
import { createApp } from 'vue'
import { init } from 'modalcc'

const app = createApp(App)
// 配置modal.vue为模态框的模板
init(app, Modal)
app.mount('#app')
```

* 需要拉起模态框的组件

```vue
<template>
  <button @click="onShow">打开弹窗</button>
</template>

<script lang="ts" setup>
import { useModal } from 'modalcc'
import Test from './Test.vue'

/**
 * modal可以拿到模态框模板中defineExpose暴露的属性
 * 而useModal的接收一个Vue组件为参数
 * 这个组件将会被渲染在模态框的default插槽中
 */
const modal = useModal(Test)
function onShow() {
  modal.show()
}
</script>
```

* 需要以模态框形式弹出的组件

```vue
<template>
  <div>
    这是一个表格
  </div>
  <button @click="onClose">关闭弹窗</button>
  <button @click="setTitle">改变标题</button>
</template>

<script setup lang="ts">
import { withModal } from 'modalcc'
import { reactive } from 'vue'

const props = reactive({
  title: 'hello'
})

/**
 * modal拿到模态框模板中defineExpose暴露的属性
 * props为模态框模板绑定的props，这边使用reactive是为了可以出发响应式更新
 * 使用普通对象也行，但是不具备响应式
 */
const modal = await withModal(props)

function onClose() {
  modal.close()
}

// 设置模态框的title属性
function setTitle() {
  props.title = 'world'
}
</script>
```

* 效果展示

![效果展示](https://github.com/user-attachments/assets/1526443a-e0e9-4d9e-a3ea-6f509b22102a)


## ✨ 扩展能力

自定义模态框模板，useModel接受两个参数，第一个是要嵌入模态框的组件（必填），第二个是自定义模态框模板（选填，会覆盖init配置的默认模态框）
