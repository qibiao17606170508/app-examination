<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-11 09:49:03
-->
<template>
  <div class="tabsbar-container flex-box flex_a_i-flex-end">
    <el-tabs
      class="margin_b-1"
      type="card"
      v-model="active"
      @tab-click="clickHandle"
      @tab-remove="removeHandle"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.value"
        :label="currentLanguage == 'en' ? tab.title_en : tab.title_cn"
        :name="tab.value"
        :closable="tabs.length > 1"
      />
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeMount } from 'vue'
import { onBeforeRouteUpdate, useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

interface Tab {
  value: string
  label_en: string
  label_cn: string
  name: string
  query?: Record<string, any>
  params?: Record<string, any>
}

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const i18n = useI18n()
    const currentLanguage = computed<string>(() => i18n.locale.value)
    const active = computed<string>({
      get: () => {
        return store.state.tabs.active
      },
      set: (val: string) => store.dispatch('tabs/setActive', val),
    })
    const tabs = computed<Tab[]>(() => store.state.tabs.tabs)

    const clickHandle = ({ index }: { index: string }) => {
      setTimeout(() => {
        const tab = tabs.value[+index]
        router.push({
          name: tab.name,
          query: tab.query,
          params: tab.params,
        })
      }, 100)
    }

    const removeHandle = (name: string) => {
      store.dispatch('tabs/removeHandle', [name])
    }

    onBeforeRouteUpdate((to) => {
      store.dispatch('tabs/changeHandle', to)
      const meta = to.meta as { multiple?: boolean }
      if (meta.multiple) {
        store.dispatch('settings/setRefresh', true)
        nextTick(() => {
          store.dispatch('settings/setRefresh', false)
        })
      }
    })

    onBeforeMount(() => {
      store.dispatch('tabs/changeHandle', route)
    })

    return {
      active,
      tabs,
      clickHandle,
      removeHandle,
      currentLanguage,
    }
  },
})
</script>

<style lang="scss" scoped>
.tabsbar-container {
  z-index: 5;
  padding: 10px 10px 0 10px;
  height: var(--gl-tabsbar-height);
  background-color: var(--gl-tabsbar-background-color);
  box-shadow: var(--el-box-shadow-light);
  :deep(.el-tabs) {
    width: 100%;
    .el-tabs__header {
      margin: 0;
      border: none;
    }
  }
}
</style>
