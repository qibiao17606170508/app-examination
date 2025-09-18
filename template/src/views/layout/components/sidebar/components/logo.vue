<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-13 14:46:08
-->
<template>
  <div class="logo-container padding-n-10 width-full flex-box">
    <transition name="el-fade-in" mode="out-in">
      <div class="flex-box flex-item_f-1 flex_j_c-center flex_a_i-center">
        <el-image
          v-if="collapse"
          class="logo-style flex_j_c-center flex_a_i-center"
          style="width: 40px"
          :src="require('@/assets/images/logo-mini.png')"
        ></el-image>
        <el-image
          v-if="!collapse"
          class="logo-style flex-item_f-1 flex_j_c-center flex_a_i-center"
          style="max-width: 150px"
          :src="require('@/assets/images/logo.png')"
        ></el-image>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  props: {
    collapse: {
      type: Boolean,
      default: () => true,
    },
  },

  setup() {
    const store = useStore()
    const enterprise = computed(() => store.state.enterprise.enterprise)
    return {
      enterprise,
    }
  },
})
</script>

<style lang="scss" scoped>
.logo-container {
  height: var(--gl-headbar-height);
  line-height: var(--gl-headbar-height);
  background-color: var(--gl-sidebar-background-color);
  transition: width 0.4s;
}
.logo-style {
  :deep img {
    display: block;
  }
}
</style>
