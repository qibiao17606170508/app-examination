<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-16 12:00:37
-->
<template>
  <Container>
    <template #header>
      <!-- <cu-form :formItemList="formConfigData" @search="getList"></cu-form> -->
    </template>
    <template #default>
      <cuTable
        v-if="false"
        :loading="data.loading"
        ref="filterTable"
        :multiple="false"
        :operations="true"
        :tableData="data.list"
        :finallyColumns="listConfigData"
        @search="getList"
        :defaultPageTips="'暂无数据'"
        :heightFlag="true"
        rowClick
        :rowClickQuery="['orderId']"
        rowClickPath="homeOrderDetails"
      >
        <template #operations="scope">
          <el-button
            v-repeat
            link
            type="primary"
            size="small"
            @click.prevent="tbBtnHandle(scope.row, 'report')"
          >
            {{ $t('modules/public.view') }}
          </el-button>
        </template>
      </cuTable>
    </template>
    <template #footer>
      <Page :page="page" @change="pageChangeHandle" />
    </template>
  </Container>
</template>

<script lang="ts" setup name="Home">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  computed,
  onMounted,
} from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import usePage from '@/mixins/page'
import { date2time } from '@/utils'
import { listConfig, formConfig } from './config'
import { getOrderList } from '@/api/home/index'

interface Data {
  list: Array<any>
  loading: boolean
  chartList: Record<string, any>
  chartFlag: boolean
  searchForm: Record<string, any>
}

const data = reactive<Data>({
  list: [],
  loading: false,
  chartList: {},
  chartFlag: false,
  searchForm: {},
})

const formConfigData = ref(formConfig)
const listConfigData = ref(listConfig)
const router = useRouter()
const { t } = useI18n()
const i18n = useI18n()
const currentLanguage = computed(() => i18n.locale.value)
const { page } = usePage()

const getList = async (val: Record<string, any>, flag: boolean) => {
  if (!flag) {
    data.searchForm = { ...data.searchForm, ...val }
    page.page = 1
    page.page_size = 10
  }
  const params = {
    ...data.searchForm,
    page: page.page,
    page_size: page.page_size,
    dateStart: val?.dateTime?.[0] ? date2time(val.dateTime[0]) : '',
    dateEnd: val?.dateTime?.[1] ? date2time(val.dateTime[1]) : '',
  }
  try {
    const res = await getOrderList(params)
    if (res.success) {
      data.list = res.data.list
      page.total = res.data.total
    }
  } catch (error) {
    console.error('Error fetching order list:', error)
  }
}

onMounted(() => {
  // getList({}, true)
})

const tbBtnHandle = (row: Record<string, any>, name: string) => {
  const orderId = name === 'report' ? row.order_id : row.orderId
  // router.push({
  //   path: 'home/orderDetails',
  //   query: { orderId },
  // })
}

const pageChangeHandle = (argPage: { page: number; page_size: number }) => {
  page.page = argPage.page
  page.page_size = argPage.page_size
  getList({}, true)
}
</script>

<style lang="scss" scoped>
.home-tips {
  margin: 10px auto 0;
}
</style>
