<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:02:16
-->
<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="tabsName">
      <component :is="Component" class="component flex-item_f-1" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeMount,
  computed,
  toRefs,
  watch,
  reactive,
} from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

interface Tab {
  name: string
  keepalive: boolean
}

interface Data {
  tabsName: string[]
}

export default defineComponent({
  props: {
    transition: {
      type: String,
      default: 'el-fade-in',
    },
  },
  setup() {
    const data: Data = reactive({
      tabsName: [],
    })
    const store = useStore()
    const tabs = computed(() => store.state.tabs.tabs as Tab[])
    const route = useRoute()
    const path = route.path

    data.tabsName = tabs.value
      .filter((item) => item.keepalive)
      .map((item) => item.name)

    watch(
      tabs,
      (val) => {
        data.tabsName = val
          .filter((item) => item.keepalive)
          .map((item) => item.name)
      },
      { deep: true }
    )

    return {
      ...toRefs(data),
      path,
      route,
    }
  },
})
</script>
