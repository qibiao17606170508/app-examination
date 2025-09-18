<template>
  <Container>
    <template #header>
      <cu-tab
        :tabs="[
          { name: '学生问题点', id: 'studentIssues' },
          { name: '知识覆盖点', id: 'knowledgeCoverage' },
        ]"
        v-model="activeTab"
        @change="getList({}, true)"
      ></cu-tab>
    </template>
    <template #default>
      <div v-if="activeTab === 'studentIssues'">
        <!-- 学生问题点内容 -->
        <cuTable
          :page="page"
          :loading="loading"
          ref="filterTable"
          :multiple="false"
          :operations="false"
          :tableData="list"
          :finallyColumns="listConfigData"
          @search="getList"
          :defaultPageTips="'暂无数据'"
          @tbClick="tbClickHandle"
        ></cuTable>
      </div>
      <div v-else>
        <!-- 知识覆盖点内容 -->
        <cuTable
          :page="page"
          :loading="loading"
          ref="filterTable"
          :multiple="false"
          :operations="false"
          :tableData="list"
          :finallyColumns="listConfigData1"
          @search="getList"
          :defaultPageTips="'暂无数据'"
          @sortChange="getList"
        ></cuTable>
      </div>
      <listDialog ref="listDialogRef"></listDialog>
      <componentPage
        ref="componentRef"
        @refresh="getList({}, true)"
      ></componentPage>
    </template>
    <template #footer>
      <Page :page="page" @change="pageChangeHandle" />
    </template>
  </Container>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
  computed,
} from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import usePage from '@/mixins/page'
import { clearJson } from '@/utils'
import { listConfig, formConfig, listDialog1 } from './config'
import componentPage from './components/component.vue'
import listDialog from './components/list-dialog.vue'
import { useI18n } from 'vue-i18n'
import { getKnowledgeCoverList, getProblemList } from '@/api/teacher'

export default defineComponent({
  name: 'default',
  components: { componentPage, listDialog },
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const i18n = useI18n()
    const currentLanguage = computed(() => i18n.locale.value)
    const componentRef = ref<InstanceType<typeof componentPage>>()
    const listDialogRef = ref<InstanceType<typeof listDialog>>()
    const { page } = usePage()
    const data = reactive<{
      loading: boolean
      visible: boolean
      list: Array<any>
      searchForm: Record<string, any>
      activeTab: string
    }>({
      loading: false,
      visible: false,
      list: [],
      searchForm: {},
      activeTab: 'studentIssues',
    })
    const listConfigData = ref(listConfig)
    const formConfigData = ref(formConfig)
    const listConfigData1 = ref(listDialog1)
    const getList = (val: Record<string, any>, flag: boolean) => {
      if (!flag) {
        data.searchForm = { ...data.searchForm, ...val }
        page.page = 1
        page.page_size = 10
      }
      let params: any = {
        ...data.searchForm,
        page: page.page,
        page_size: page.page_size,
      }
      if (data.activeTab === 'studentIssues') {
        // 获取数据
        getProblemList(params).then((r) => {
          if (r.code == 0) {
            data.list = r.data.list
            page.total = r.data.total
          }
          nextTick(() => {
            data.loading = false
          })
        })
      }
      if (data.activeTab === 'knowledgeCoverage') {
        if (val.prop == 'practice_total_num') {
          params.practice_order = val.order
        }
        if (val.prop == 'problem_student_num') {
          params.problem_order = val.order
        }
        getKnowledgeCoverList(params).then((r) => {
          if (r.code == 0) {
            data.list = r.data.list
            page.total = r.data.total
          }
        })
      }
    }

    const tbBtnHandle = (row: any, name: string) => {
      if (name == 'delete') {
        ElMessageBox.confirm(`确定删除?`, `提示`, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // deleteApi(id).then((r) => {
            //   if (r.success) {
            //     ElMessage.success('删除成功')
            //     getList()
            //   }
            // })
          })
          .catch(() => {})
      }
      if (name == 'edit' || name == 'add') {
        componentRef.value?.init(row)
      }
    }

    const pageChangeHandle = (argPage: { page: number; page_size: number }) => {
      page.page = argPage.page
      page.page_size = argPage.page_size
      getList({}, true)
    }
    onMounted(() => {
      getList({}, true)
    })
    const tbClickHandle = (row: any) => {
      listDialogRef.value?.init(row)
    }
    return {
      page,
      pageChangeHandle,
      ...toRefs(data),
      getList,
      tbBtnHandle,
      clearJson,
      componentRef,
      listConfigData,
      formConfigData,
      listConfigData1,
      tbClickHandle,
      listDialogRef,
    }
  },
})
</script>

<style lang="scss" scoped></style>
