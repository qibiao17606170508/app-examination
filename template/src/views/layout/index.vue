<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-11 09:53:02
-->
<template>
  <!-- <el-watermark :font="font" :content="content"> -->
  <div class="layout-container height-full flex-box overflow-auto">
    <Sidebar />
    <component :is="component" class="navigation-container">
      <!-- <template #headbar>
        <Headbar />
      </template> -->
      <template #tabsbar v-if="showTabs">
        <Tabsbar />
      </template>
      <template #default v-if="!refresh">
        <View class="margin-20 flex-item_f-1" transition="left-in-right-out" />
      </template>
    </component>
    <!-- <Websocket /> -->
  </div>
  <!-- </el-watermark> -->
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

import Sidebar from './components/sidebar/index.vue'
import Headbar from './components/headbar/index.vue'
import Tabsbar from './components/tabsbar/index.vue'
import View from '@/components/view/index.vue'
import NavigationActive from './components/navigation/active/index.vue'
import NavigationFixed from './components/navigation/fixed/index.vue'

export default defineComponent({
  components: {
    Sidebar,
    Headbar,
    Tabsbar,
    View,
    NavigationActive,
    NavigationFixed,
  },
  setup() {
    const store = useStore()

    const navigationMode = computed<number>(
      () => store.state.settings.navigationMode
    )

    const showTabs = computed<boolean>(() => store.state.settings.showTabs)
    const refresh = computed<boolean>(() => store.state.settings.refresh)
    const administrator = computed(() => store.state.menu.administrator)
    const content = ref<string[]>([
      administrator.value.roleName ? administrator.value.roleName : '',
      administrator.value.username +
        ' ' +
        administrator.value.username.slice(-4),
    ])

    const font = ref<{ color: string }>({
      color: 'rgba(0, 0, 0, .04)',
    })
    const component = computed(() => {
      let result: any = ''
      switch (navigationMode.value) {
        case 1:
          result = NavigationFixed
          break
        case 2:
          result = NavigationActive
          break
      }
      return result
    })

    return {
      navigationMode,
      showTabs,
      refresh,
      component,
      content,
      font,
    }
  },
})
</script>

<style lang="scss">
.layout-container {
  z-index: 0;
  background-color: var(--gl-content-background-color);
  .navigation-container {
    z-index: 0;
    overflow: hidden;
  }
}
</style>
