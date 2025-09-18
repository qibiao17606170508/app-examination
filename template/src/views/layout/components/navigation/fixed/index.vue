<!--
 * @Description: 
 * @Autor: Jack Qi
 * @Email: qibiao0508@163.com
 * @Date: 2024-10-08 14:49:16
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-09 10:32:00
-->
<template>
  <div class="flex-item_f-1 flex-box flex_d-column overflow-auto">
    <slot name="headbar" />
    <slot name="tabsbar" />
    <slot v-if="contanierMode === 2" />
    <el-scrollbar
      class="flex-item_f-1"
      :view-class="`flex-box flex_d-column`"
      v-else
    >
      <slot />
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()

    const contanierMode = computed<number>(
      () => store.state.settings.contanierMode
    )

    return {
      contanierMode,
    }
  },
})
</script>

<style lang="scss" scoped></style>
