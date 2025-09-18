<!--
 * @Description:
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-03-07 11:02:15
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:25:54
-->
<template>
  <i class="iconfont" :style="style" :class="`icon-${name}`" />
</template>
<!--
 * 使用:
 *   1.组件模版中使用
 *      [<g-icon name="name" size="size" color="color"></g-icon>]
 * 注意:
 *    1.name      为 阿里图库图标名称 不包括前面的 icon-（必填）
 *    2.size      大小 font-size
 *    3.color     颜色
-->
<script lang="ts">
import { defineComponent, computed } from 'vue'

interface IconProps {
  name: string
  size?: string
  color?: string
}

export default defineComponent({
  props: {
    name: {
      type: String as () => IconProps['name'],
      required: true,
    },
    size: {
      type: String as () => IconProps['size'],
      default: '14px',
    },
    color: {
      type: String as () => IconProps['color'],
      default: '',
    },
  },
  setup(props: IconProps) {
    const style = computed(() => ({
      'font-size': props.size,
      color: props.color,
    }))
    return {
      style,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '//at.alicdn.com/t/c/font_3901622_ufb7icmm6mm.css';
</style>
