<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-13 15:24:47
-->
<template>
  <Container>
    <template #header>
      <!-- <cu-form :formItemList="formConfigData" @search="getList"></cu-form> -->
    </template>
    <template #default>
      <cuTable
        :loading="data.loading"
        ref="filterTable"
        :multiple="false"
        :operations="true"
        :tableData="data.list"
        :finallyColumns="listConfigData"
        @search="getList"
        :defaultPageTips="'暂无数据'"
        :heightFlag="true"
        @sortChange="getList"
      >
        <template #operations="scope">
          <el-button
            v-repeat
            link
            type="primary"
            size="small"
            @click.prevent="tbBtnHandle(scope.row, 'report')"
          >
            登记错题
          </el-button>
        </template>
      </cuTable>
      <ListDialog ref="listDialogRef" />
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
import { getPracticeList } from '@/api/student'
import ListDialog from './components/list-dialog.vue'
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
const listDialogRef = ref()
const { page } = usePage()
const subject = computed(() =>
  JSON.parse(sessionStorage.getItem('subject') || '{}')
)
const getList = async (val: Record<string, any>, flag: boolean) => {
  if (val.sort) {
    data.searchForm = { ...data.searchForm, ...val }
  }
  if (!flag) {
    data.searchForm = { ...data.searchForm, ...val }
    page.page = 1
    page.page_size = 10
  }
  if (!subject.value.id) {
    // 定时器
    setTimeout(() => {
      getList(val, flag)
    }, 1000)
    return
  }
  const params = {
    ...data.searchForm,
    page: page.page,
    page_size: page.page_size,
    subject_id: subject.value.id,
    orderBy: val.order,
  }
  try {
    const res = await getPracticeList(params)
    if (res.code == 0) {
      data.list = res.data.list
      page.total = res.data.total
    }
  } catch (error) {
    console.error('Error fetching order list:', error)
  }
}

onMounted(() => {
  getList({}, true)
})

const tbBtnHandle = (row: Record<string, any>, name: string) => {
  listDialogRef.value.init(row)
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
