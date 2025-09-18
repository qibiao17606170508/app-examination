<!--
 * @Description: 
 * @Autor: Jack Qi
 * @Email: qibiao0508@163.com
 * @Date: 2024-10-08 14:49:16
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 16:39:19
-->
<template>
  <div
    :class="`
    container-custom-container
    flex-box
    flex_d-column
    overflow-auto
    ${panelMode.value !== 1 ? 'container-panel' : ''}`"
  >
    <el-scrollbar
      ref="refScrollbar"
      :class="`
      content-container
      ${contanierMode.value === 2 ? 'flex-item_f-1' : 'height-unset'}`"
    >
      <div class="content-wrap">
        <slot />
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  props: {
    mode: {
      type: Number,
      default: null,
    },
  },
  setup(props) {
    const store = useStore()
    const refScrollbar = ref<HTMLElement | null>(null)
    const contanierMode = computed(() => store.state.settings.contanierMode)
    const panelMode = computed(
      () => props.mode ?? store.state.settings.panelMode
    )

    const setScrollTop = (top: number = 0) => {
      if (refScrollbar.value) {
        refScrollbar.value.scrollTop = top
      }
    }

    return {
      contanierMode,
      panelMode,
      refScrollbar,
      setScrollTop,
    }
  },
})
</script>

<style lang="scss" scoped>
.container-custom-container {
  margin: unset;
}
</style>
