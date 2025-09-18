<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-11 09:23:41
-->
<template>
  <div class="operation-log-container">
    <el-timeline v-if="list.length">
      <el-timeline-item
        placement="top"
        v-for="item in list"
        :key="item.id"
        :timestamp="item.gmtModified"
      >
        <el-card>
          <el-descriptions :column="2">
            <el-descriptions-item
              :label="$t('modules/personal/login-log.operationInformation')"
            >
              {{ item.operateName }}
            </el-descriptions-item>
            <el-descriptions-item
              :label="$t('modules/personal/login-log.browser')"
            >
              {{ item.browser }}
            </el-descriptions-item>
            <el-descriptions-item label="IP">
              {{ item.ipAddress }}
            </el-descriptions-item>
            <el-descriptions-item
              :label="$t('modules/personal/login-log.operatingSystem')"
            >
              {{ item.operatingSystem }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-empty v-else />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  nextTick,
  onBeforeMount,
  toRefs,
  computed,
} from 'vue'

import { useStore } from 'vuex'

import usePage from '@/mixins/page'

interface OperationLogItem {
  id: number
  gmtModified: string
  operateName: string
  browser: string
  ipAddress: string
  operatingSystem: string
}

interface Data {
  loading: boolean
  list: OperationLogItem[]
}

export default defineComponent({
  setup() {
    const { page } = usePage()
    const data = reactive<Data>({
      loading: false,
      list: [],
    })
    const store = useStore()

    const administratorId = computed(() => store.state.menu.administrator.id)

    const getList = () => {
      const params = {
        page: page.page,
        page_size: page.page_size,
        creatorId: store.state.menu.administrator.id,
      }
      data.loading = true
    }

    onBeforeMount(() => {
      getList()
    })

    return {
      page,
      ...toRefs(data),
      administratorId,
    }
  },
})
</script>

<style lang="scss" scoped>
.operation-log-container {
  // max-height: 600px;
}
</style>
