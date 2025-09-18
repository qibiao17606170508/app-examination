<template>
  <Container :showTitle="false">
    <template #header>
      <div class="flex-box flex_j_c-space-between flex-alc">
        <div class="page-info">
          <span>{{ router.currentRoute.value.meta.title_cn }}</span>
        </div>
        <el-button type="primary" class="mb-10" @click="tbBtnHandle({}, 'add')">
          创建试卷
        </el-button>
      </div>
    </template>
    <template #default>
      <div v-if="activeTab === 'studentIssues'">
        <!-- 学生问题点内容 -->
        <cuTable
          :page="page"
          :loading="loading"
          ref="filterTable"
          :multiple="false"
          :operations="true"
          :tableData="list"
          :finallyColumns="listConfigData"
          @search="getList"
          :defaultPageTips="'暂无数据'"
          @sortChange="getList"
        >
          <template #operations="scope">
            <el-button
              v-repeat
              link
              type="primary"
              size="small"
              @click.prevent="tbBtnHandle(scope.row, 'edit')"
            >
              {{ $t('modules/public.edit') }}
            </el-button>
            <el-button
              v-repeat
              link
              type="primary"
              size="small"
              @click.prevent="tbBtnHandle(scope.row, 'delete')"
            >
              {{ $t('modules/public.delete') }}
            </el-button>
          </template>
        </cuTable>
      </div>
      <div v-else>
        <!-- 知识覆盖点内容 -->
      </div>
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
import { listConfig, formConfig } from './config'
import componentPage from './components/component.vue'
import { useI18n } from 'vue-i18n'
import { deletePaper, getPaperList } from '@/api/teacher'
export default defineComponent({
  name: 'examinationPaper',
  components: { componentPage },
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const i18n = useI18n()
    const currentLanguage = computed(() => i18n.locale.value)
    const componentRef = ref<InstanceType<typeof componentPage>>()
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

    const getList = (val: Record<string, any>, flag: boolean) => {
      if (val.sort) {
        data.searchForm = { ...data.searchForm, ...val }
      }
      if (!flag) {
        data.searchForm = { ...data.searchForm, ...val }
        page.page = 1
        page.page_size = 10
      }
      let params = {
        ...data.searchForm,
        page: page.page,
        page_size: page.page_size,
        orderBy: val.order,
      }
      // data.loading = true
      // 获取数据
      getPaperList(params).then((r) => {
        if (r.code == 0) {
          data.list = r.data.list
          page.total = r.data.total
          nextTick(() => {
            data.loading = false
          })
        }
      })
    }

    const tbBtnHandle = (row: any, name: string) => {
      if (name == 'delete') {
        ElMessageBox.confirm(`确定删除该试卷？此操作不可恢复。`, `提示`, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deletePaper({ id: row.id }).then((r) => {
              if (r.code == 0) {
                ElMessage.success('删除成功')
                getList({}, true)
              }
            })
          })
          .catch(() => {})
      }
      if (name == 'add') {
        componentRef.value?.init(row)
      }
      if (name == 'edit') {
        router.push({
          name: 'examinationPaperDetails',
          query: {
            id: row.id,
          },
        })
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
      router,
    }
  },
})
</script>

<style lang="scss" scoped></style>
