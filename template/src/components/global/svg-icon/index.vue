<!--
 * @Description: 
 * @Autor: Jack Qi
 * @Email: qibiao0508@163.com
 * @Date: 2024-10-14 10:23:34
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-16 12:22:58
-->
<template>
  <svg
    :class="svgClass"
    :style="{
      width: size + 'px',
      height: size + 'px',
      color: color,
      verticalAlign: deviation + 'em',
      fontWeight: 'bold',
    }"
    aria-hidden="true"
  >
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'svg-icon',
  props: {
    name: { type: String, required: true }, // svg 图标名称
    className: { type: String, default: '' }, // 指定的类样式
    size: { type: Number, default: 26 }, // 图标尺寸
    color: { type: String, default: '#000' }, // 图标颜色
    deviation: { type: Number, default: -0.2 }, //图标上下偏移量
  },
  setup(props) {
    const svgClass = computed(() => {
      return props.className ? 'svg-icon ' + props.className : 'svg-icon'
    })

    return {
      svgClass,
    }
  },
})
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.2em;
  fill: currentColor;
  overflow: hidden;
  padding: 0 0.15em;
}
</style>
