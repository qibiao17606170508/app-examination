<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-11 09:23:27
-->
<template>
  <div class="login-log-container">
    <el-timeline v-if="list.length">
      <el-timeline-item
        placement="top"
        v-for="item in list"
        :key="item.id"
        :timestamp="item.gmtCreate"
      >
        <el-card>
          <el-descriptions :column="2">
            <el-descriptions-item
              :label="$t('modules/personal/login-log.loginInformation')"
            >
              {{ item.loginType }}
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
import { defineComponent, reactive, nextTick, onBeforeMount, toRefs } from 'vue'
import usePage from '@/mixins/page'
import { useStore } from 'vuex'

interface ListItem {
  id: number
  gmtCreate: string
  loginType: string
  browser: string
  ipAddress: string
  operatingSystem: string
}

export default defineComponent({
  setup() {
    const { page } = usePage()
    const data = reactive<{
      loading: boolean
      list: ListItem[]
    }>({
      loading: false,
      list: [],
    })
    const store = useStore()
    const getList = () => {
      const params = {
        page: page.page,
        page_size: page.page_size,
        empId: store.state.menu.administrator.id,
        keywords: '',
      }
      data.loading = true
    }

    onBeforeMount(() => {
      getList()
    })

    return {
      page,
      ...toRefs(data),
    }
  },
})
</script>

<style></style>
