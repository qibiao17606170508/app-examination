<!--
 * @Description: 
 * @Autor: Jack Qi
 * @Email: qibiao0508@163.com
 * @Date: 2024-10-08 14:49:16
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-09 10:31:40
-->
<template>
  <el-scrollbar class="flex-item_f-1" :view-class="`flex-box flex_d-column`">
    <slot name="headbar" />
    <slot name="tabsbar" />
    <slot />
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped></style>
