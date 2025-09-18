<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-22 15:53:03
-->
<template>
  <div class="page-container">
    <div>共 {{ page.total }} 项数据</div>
    <el-pagination
      class="page flex_j_c-flex-end ml-10"
      layout="prev, pager, next, ->"
      :current-page="page.page"
      :page-sizes="page.sizes"
      :page-size="page.page_size"
      :total="page.total"
      @current-change="currentChangeHandle"
      @size-change="sizeChangeHandle"
    />
    <div class="footer-container-right flex-box flex-alc">
      <span class="margin_r-10" v-if="updateTime">
        更新时间：{{ updateTime }}2020-01-20
      </span>
      <Iconfont
        class="margin_r-15 cursor-pointer"
        size="16px"
        name="refresh"
        v-if="refresh"
        @click="iconfontClickHandle('refresh')"
      />
    </div>
  </div>
  <!-- :hide-on-single-page="page.total <= page.size" -->
</template>

<script lang="ts">
import store from '@/store'
import {
  defineComponent,
  nextTick,
  PropType,
  reactive,
  toRefs,
  watchEffect,
} from 'vue'
import { useRoute } from 'vue-router'

interface Page {
  page: number
  sizes: number[]
  page_size: number
  total: number
}

export default defineComponent({
  emits: ['change'],
  props: {
    page: {
      type: Object as PropType<Page>,
      required: true,
    },
    updateTime: {
      type: String as PropType<string>,
    },
    refresh: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props, { emit }) {
    const route = useRoute()
    const data = reactive({
      pages: store.getters['menu/pages'] as Array<any>,
      crumbs: [] as Array<any>,
      pageInfo: {} as any,
      updateTime: props.updateTime,
      refresh: props.refresh,
    })
    /**
     * @description: 当前页变化事件
     * @param {number} val
     * @return {void}
     */
    const currentChangeHandle = (val: number): void => {
      emit('change', { page: val, page_size: props.page.page_size })
    }
    const iconfontClickHandle = (type: string) => {
      switch (type) {
        case 'refresh':
          store.dispatch('settings/setRefresh', true)
          nextTick(() => {
            store.dispatch('settings/setRefresh', false)
          })
          break
      }
    }
    const crumbHandle = (menus: Array<any>): boolean => {
      let flag = false
      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i]
        if (route.name === menu.name) {
          data.pageInfo = menu
          flag = true
        }
      }
      return flag
    }
    /**
     * @description: 当前页数变化事件
     * @param {number} val
     * @return {void}
     */
    const sizeChangeHandle = (val: number): void => {
      emit('change', { page: props.page.page, page_size: val })
    }
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
      currentChangeHandle,
      sizeChangeHandle,
      iconfontClickHandle,
    }
  },
})
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;

  :deep(.el-pagination) {
    line-height: normal;
  }
  :deep(.el-pager li) {
    width: 30px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #ddd;
    margin-right: 5px;
  }
  :deep(.el-pager li:nth-last-of-type(1)) {
    margin-right: 0;
  }
  :deep(.el-pager li.is-active) {
    background-color: rgba(21, 171, 190, 0.1);
    border: 1px solid var(--el-color-primary);
  }
}
</style>
