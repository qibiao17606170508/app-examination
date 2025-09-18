<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-16 11:59:58
-->
<template>
  <el-sub-menu
    v-if="data.children && data.children.length > 0 && data.status == 1"
    :index="data.name || data.id + ''"
  >
    <template #title>
      <svg-icon
        :name="data.icon"
        :class="{ 'padding_r-5': !collapse }"
        v-if="data.icon"
      />
      <span>
        {{ currentLanguage == 'en' ? data.nameEn : data.nameCn }}
      </span>
    </template>
    <div v-for="item in data.children" :key="item.id">
      <sub-item v-if="item.status == 1" :data="item" />
    </div>
  </el-sub-menu>
  <el-menu-item
    v-if="data.status == 1 && (!data.children || data.children.length === 0)"
    :index="data.name || data.id + ''"
    @click="clickHandle"
  >
    <svg-icon
      :name="data.icon"
      :class="{ 'padding_r-5': !collapse }"
      v-if="data.icon"
    />
    <template #title>
      <span>{{ currentLanguage == 'en' ? data.nameEn : data.nameCn }}</span>
    </template>
  </el-menu-item>
</template>

<script lang="ts">
import { defineComponent, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

interface Data {
  name: string
  id: string | number
  icon?: string
  nameEn: string
  nameCn: string
  children?: Data[]
  status: number
  type: number
  url?: string
}

export default defineComponent({
  name: 'SubItem',
  props: {
    data: {
      type: Object as () => Data,
      required: true,
    },
    collapse: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const i18n = useI18n()
    const currentLanguage = computed(() => i18n.locale.value)
    const router = useRouter()
    const store = useStore()

    const tabs = computed(() => store.state.tabs.tabs)
    /**
     * 菜单点击事件
     * @param name 路由名称
     */
    const clickHandle = () => {
      switch (props.data.type) {
        case 4: // 外链
          if (props.data.url) {
            window.open(props.data.url)
          }
          break
        case 1: // 菜单
        case 3: // iframe
          // 判断 props.data.name 是否存在于tabsName 如果存在 则 用取出与tabs相同名字的对象
          const tab = tabs.value.find(
            (item: any) => item.name === props.data.name
          )
          if (tab) {
            store.dispatch('tabs/removeHandle', [tab.value])
          }
          setTimeout(() => {
            router.push({
              name: props.data.name,
            })
          }, 100)
          break
      }
    }
    return {
      clickHandle,
      currentLanguage,
    }
  },
})
</script>
<style></style>
