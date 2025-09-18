<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-10 10:33:07
-->
<template>
  <div
    class="headbar-container padding-n-10 flex-box flex_w-wrap flex_a_i-center"
  >
    <el-tooltip
      :content="$t('layout/theme.collapseExpandMenu')"
      placement="bottom"
      :show-after="500"
      :hide-after="0"
      transition=""
    >
      <!-- <Iconfont
        class="cursor-pointer margin_r-20"
        :name="`collapse-${collapse ? 'right' : 'left'}`"
        @click="collapseHandle"
      /> -->
    </el-tooltip>
    <Crumb />
    <Action />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import Crumb from './components/crumb.vue'
import Action from './components/action.vue'

export default defineComponent({
  components: { Crumb, Action },
  setup() {
    const store = useStore()

    const collapse = computed<boolean>({
      get: (): boolean => store.state.menu.collapse,
      set: (val: boolean) => store.dispatch('menu/setCollapse', val),
    })

    /**
     * @description: 菜单栏折叠事件
     * @param {*}
     * @return {*}
     */
    const collapseHandle = (): void => {
      collapse.value = !collapse.value
    }

    return {
      collapse,
      collapseHandle,
    }
  },
})
</script>

<style lang="scss" scoped>
.headbar-container {
  z-index: 10;
  min-height: var(--gl-headbar-height);
  background-color: var(--gl-headbar-background-color);
  box-shadow: var(--el-box-shadow-light);
}
</style>
