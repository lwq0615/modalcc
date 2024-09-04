<template>
  <Suspense>
    <Component v-if="show" v-bind="props.componentProps">
      <slot></slot>
    </Component>
  </Suspense>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps(['component', 'componentProps']);
const Component = props.component;
const show = ref(false);
Promise.resolve().then(() => {
  show.value = true;
});
</script>
