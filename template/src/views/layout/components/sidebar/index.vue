<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-09 10:36:02
-->
<template>
  <component :is="component" />
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute, RouteLocationNormalized } from 'vue-router'

import Classic from './classic/index.vue'
import Subfield from './subfield/index.vue'

export default defineComponent({
  components: { Classic, Subfield },
  setup() {
    const store = useStore()
    const route = useRoute()

    const sidebarMode = computed(() => store.state.settings.sidebarMode)
    const component = computed(() => {
      let result: any = ''
      switch (sidebarMode.value) {
        case 1:
          result = Classic
          break
        case 2:
          result = Subfield
          break
      }
      return result
    })

    /**
     * @description: 路由变化事件
     * @param {RouteLocationNormalized} argRoute
     * @return {void}
     */
    const routeHandle = (argRoute: RouteLocationNormalized): void => {
      const name = argRoute.name as string
      store.dispatch('menu/setActive', name)
    }

    watchEffect(() => {
      routeHandle(route)
    })

    return {
      component,
    }
  },
})
</script>

<style></style>
