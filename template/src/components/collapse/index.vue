<!--
 * @Description: 
 * @Autor: Jack Qi
 * @Email: qibiao0508@163.com
 * @Date: 2024-10-08 14:49:16
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-09 09:24:28
-->
<template>
  <el-collapse-transition>
    <div v-show="collapse">
      <slot />
    </div>
  </el-collapse-transition>
  <el-button type="primary" v-repeat link @click="collapseHandle">
    {{ collapse ? activeText : inactiveText }}
  </el-button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  emits: ['collapse'],
  props: {
    activeText: {
      type: String,
      default: '', // 这里不需要设置默认值，交由 setup 处理
    },
    inactiveText: {
      type: String,
      default: '', // 这里不需要设置默认值，交由 setup 处理
    },
  },
  setup(_props, { emit }) {
    const { t } = useI18n() // 使用 Composition API 的 useI18n 函数
    const collapse = ref<boolean>(false)

    // 使用 setup 中的 t 函数来设置默认的翻译文本
    const activeText = _props.activeText || t('modules/public.putAway')
    const inactiveText = _props.inactiveText || t('modules/public.open')

    const collapseHandle = (): void => {
      collapse.value = !collapse.value
      emit('collapse', collapse.value)
    }

    return {
      collapse,
      collapseHandle,
      activeText,
      inactiveText,
    }
  },
})
</script>

<style scoped>
/* 添加样式以适应组件的需求 */
</style>
