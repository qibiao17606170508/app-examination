<template>
  <el-popover trigger="click" placement="bottom-start" width="316px">
    <div>
      <div class="flex-item_f-1 flex-box flex_w-wrap">
        <div class="padding-5" v-for="(item, index) in list" :key="index">
          <el-button
            v-repeat
            size="small"
            :class="{ 'is-active': item === value }"
            :disabled="readonly"
            @click="clickHandle(item)"
          >
            <Iconfont :name="item" />
          </el-button>
        </div>
      </div>
      <el-pagination
        class="flex_j_c-space-between"
        v-model:currentPage="page.current"
        v-model:page-size="page.size"
        :total="icons.length"
        layout="prev, next"
      />
    </div>
    <template #reference>
      <el-input
        v-model="value"
        placeholder="图标"
        clearable
        :readonly="readonly"
      >
        <template #prefix>
          <Iconfont :name="value" v-if="value" />
        </template>
      </el-input>
    </template>
  </el-popover>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  reactive,
  toRefs,
  watchEffect,
} from 'vue'
import axios from 'axios'

import useModel from '@/mixins/model'
import { UPDATE_MODEL_EVENT, CONTENT_TYPE, TIME_OUT } from '@/utils/constant'

interface Page {
  current: number
  size: number
}

interface Data {
  icons: string[]
  page: Page
}

export default defineComponent({
  emits: [UPDATE_MODEL_EVENT],
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const value = useModel(props)

    const data: Data = reactive({
      icons: [],
      page: {
        current: 1,
        size: 30,
      },
    })

    const list = computed(() => {
      const { current, size } = data.page
      let result = data.icons.slice(size * (current - 1), size * current)
      if (current !== 1 && result.length === 0) {
        result = data.icons.slice(size * (current - 2), size * (current - 1))
      }
      return result
    })

    watchEffect(() => {
      if (typeof value.value === 'string') {
        const index = data.icons.indexOf(value.value)
        const page = Math.floor(index / data.page.size) + 1
        data.page.current = page
      }
    })

    const getIconfont = async () => {
      try {
        const service = axios.create({
          timeout: TIME_OUT,
          headers: {
            'Content-Type': CONTENT_TYPE,
          },
        })
        const response = await service.get(
          '//at.alicdn.com/t/c/font_3901622_ufb7icmm6mm.css'
        )
        if (response.status === 200) {
          const arr = response.data.match(/.icon-(.+?):/g) || []
          data.icons = arr.map(
            (item: string) => item.match(/.icon-(.+?):/)?.[1] || ''
          )
        }
      } catch (error) {
        console.error('Error fetching icon font:', error)
      }
    }

    const clickHandle = (icon: string) => {
      value.value = icon
    }

    onBeforeMount(() => {
      getIconfont()
    })

    return {
      value,
      ...toRefs(data),
      list,
      clickHandle,
    }
  },
})
</script>

<style lang="scss" scoped></style>
