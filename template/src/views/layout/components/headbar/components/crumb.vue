<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-16 16:41:44
-->
<template>
  <el-breadcrumb separator="/" class="crumb-container flex-box">
    <transition-group name="right-in-out">
      <el-breadcrumb-item
        v-for="(item, index) in crumbs"
        :key="index"
        :to="{ name: item.name, query: item.query, params: item.params }"
      >
        <span style="color: #000">
          {{ currentLanguage == 'en' ? item.label_en : item.label_cn }}
        </span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watchEffect, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, RouteLocationNormalizedLoaded } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface Crumb {
  name: string
  label_cn: string
  label_en: string
  query?: Record<string, any>
  params?: Record<string, any>
}

export default defineComponent({
  setup() {
    const store = useStore()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const i18n = useI18n()
    const currentLanguage = computed(() => i18n.locale.value)
    const data = reactive({
      pages: store.getters['menu/pages'] as Array<any>,
      crumbs: [] as Crumb[],
    })

    const crumbHandle = (menus: Array<any>): boolean => {
      let flag = false
      for (let i = 0; i < menus.length; i++) {
        console.log(menus[i])
        const menu = menus[i]
        if (route.name === menu.name) {
          flag = true
          data.crumbs.push({
            name: menu.name,
            label_cn: menu.nameCn,
            label_en: menu.nameEn,
            query: route.query,
            params: route.params,
          })
        }
        if (menu.children && menu.children.length > 0) {
          if (crumbHandle(menu.children)) {
            flag = true
            data.crumbs.push({
              name: menu.name,
              label_cn: menu.nameCn,
              label_en: menu.nameEn,
            })
          }
        }
      }
      return flag
    }

    watchEffect(() => {
      data.crumbs = []
      crumbHandle(data.pages)
      data.crumbs = data.crumbs.reverse()
    })

    return {
      ...toRefs(data),
      currentLanguage,
    }
  },
})
</script>

<style lang="scss" scoped>
.crumb-container {
  :deep(.right-in-out-leave-active) {
    .el-breadcrumb__separator {
      // display: none;
      visibility: hidden;
    }
  }
}
</style>
