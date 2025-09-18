<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-28 14:49:19
-->
<template>
  <div
    :class="`
    container
    flex-box
    flex_d-column
    overflow-auto
    ${panelMode !== 1 ? 'container-panel' : ''}`"
  >
    <div class="header-container" v-if="slots.header">
      <!-- margin_b-10 -->
      <div v-if="showTitle">
        <div class="page-info mb-20" v-if="!back">
          <span>{{ pageInfo.nameCn }}</span>
        </div>
        <div v-else class="flex-box flex_j_c-space-between flex-alc mb-20">
          <div class="back-info flex-alc">
            <div
              style="display: inline-block"
              class="back-icon cursor-pointer"
              @click="backHandle"
            >
              <div class="flex-box flex-alc defaultColor">
                <el-icon class="mr-5"><ArrowLeft /></el-icon>
                <div class="defaultColor">返回</div>
              </div>
            </div>
            <span class="back-text pl-10">{{ pageInfo.nameCn }}</span>
          </div>
          <slot name="header" v-if="back" />
        </div>
      </div>
      <slot name="header" v-if="!back" />
    </div>
    <el-scrollbar
      ref="refScrollbar"
      :class="`
      content-container
      ${contanierMode === 2 ? 'flex-item_f-1' : 'height-unset'}`"
      v-if="slots.default"
    >
      <div class="content-wrap">
        <slot />
      </div>
    </el-scrollbar>
    <div
      class="footer-container padding-10 flex-box flex_j_c-space-between"
      v-if="slots.footer"
    >
      <!-- margin_t-10 -->
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  ref,
  Ref,
  reactive,
  toRefs,
  watchEffect,
  nextTick,
  onBeforeUnmount,
} from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { parseDate2Str } from '@/utils'
interface ContainerProps {
  back: any
  mode: number | null
}

interface ContainerData {
  slots: any
  contanierMode: Ref<number>
  panelMode: Ref<number>
  refScrollbar: Ref<any>
  setScrollTop: (top?: number) => void
  iconfontClickHandle: (type: string) => void
  backHandle: () => void
}
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'Container',
  props: {
    /**
     * 面板模式
     * 1: 头部 主要内容 脚部 左侧 分离
     * 2: 左右面板分离
     * 3: 整个容器为面板
     */
    mode: {
      type: Number,
      default: null,
    },
    back: {
      type: Boolean,
      default: false,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  setup(props: ContainerProps): ContainerData {
    const store = useStore()
    const router = useRouter()
    const data = reactive({
      pages: store.getters['menu/pages'] as Array<any>,
      crumbs: [] as Array<any>,
      pageInfo: {} as any,
      updateTime: '',
      back: props.back,
    })
    const { slots } = getCurrentInstance()!
    const refScrollbar = ref<any>()
    const route = useRoute()
    const contanierMode = computed(() => store.state.settings.contanierMode)
    const panelMode = computed(
      () => props.mode || store.state.settings.panelMode
    )

    const setScrollTop = (top: number = 0) => {
      refScrollbar.value.setScrollTop(top)
    }
    const backHandle = () => {
      router.back()
    }
    const crumbHandle = (menus: Array<any>): boolean => {
      let flag = false
      // console.log(route.meta.title_cn)
      data.pageInfo.nameCn = route.meta.title_cn
      // 递归查找有可能是children的 也有可能是 children.children的
      // const findMenu = (menus: Array<any>) => {
      //   for (let i = 0; i < menus.length; i++) {
      //     const menu = menus[i]
      //     if (route.name === menu.name) {
      //       data.pageInfo = menu
      //       flag = true
      //     }
      //     if (menu.children && menu.children.length > 0) {
      //       findMenu(menu.children)
      //     }
      //   }
      // }
      return flag
    }
    const iconfontClickHandle = (type: string) => {
      switch (type) {
        case 'refresh':
          store.dispatch('settings/setRefresh', true)
          nextTick(() => {
            store.dispatch('settings/setRefresh', false)
          })
          // // 本地存储更新时间，区分页面
          // localStorage.setItem(
          //   'updateTime',
          //   data.pageInfo.name + '#' + new Date().toLocaleString()
          // )
          // console.log(data.pageInfo.name + '#' + new Date().toLocaleString())
          // const updateTimeStr = localStorage
          //   .getItem('updateTime')
          //   ?.split('#')[1]
          // const updateTimeStrName = localStorage
          //   .getItem('updateTime')
          //   ?.split('#')[0]
          // if (updateTimeStrName === data.pageInfo.name) {
          //   data.updateTime = updateTimeStr
          //     ? parseDate2Str(new Date(updateTimeStr))
          //     : ''
          // }
          break
      }
    }
    // 离开页面清除更新时间
    onBeforeUnmount(() => {
      // localStorage.removeItem('updateTime')
    })
    watchEffect(() => {
      crumbHandle(data.pages)
      // const updateTimeStr = localStorage.getItem('updateTime')?.split('#')[1]
      // const updateTimeStrName = localStorage
      //   .getItem('updateTime')
      //   ?.split('#')[0]
      // if (updateTimeStrName === data.pageInfo.name) {
      //   data.updateTime = updateTimeStr
      //     ? parseDate2Str(new Date(updateTimeStr))
      //     : ''
      // }
    })

    return {
      ...toRefs(data),
      slots,
      contanierMode,
      panelMode,
      refScrollbar,
      setScrollTop,
      iconfontClickHandle,
      backHandle,
    }
  },
})
</script>

<style lang="scss" scoped>
$padding: 15px;

.container {
  border-radius: var(--el-border-radius-base);
  &-panel {
    background-color: var(--gl-content-panel-background-color);
  }
  .header-container,
  .content-container,
  .footer-container {
    background-color: var(--gl-content-panel-background-color);
    border-radius: var(--el-border-radius-base);
  }
  .header-container {
    background: transparent;
  }
  // todo: 主要处理左侧菜单折叠起来后再展开表格宽度不缩减问题
  .header-container {
    padding: $padding $padding 0 0;
    :deep(.el-form-item) {
      margin-bottom: $padding;
    }
  }
  .content-wrap {
    padding: $padding;
  }
}
.page-info {
  font-size: 22px;
  font-weight: 600;
}
.back-icon {
  font-weight: 600;
}
.back-text {
  font-weight: 600;
}
</style>
