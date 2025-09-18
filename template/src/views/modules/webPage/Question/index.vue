<template>
  <Container :showTitle="false">
    <template #header>
      <div class="flex-box mb-20 flex_j_c-space-between flex-alc">
        <div class="page-info">
          <span>{{ router.currentRoute.value.meta.title_cn }}</span>
        </div>
        <div class="flex-box flex_j_c-flex-end">
          <el-button v-if="!multiple" @click="tbBtnHandle({}, 'batch')">
            批量管理
          </el-button>
          <el-button v-if="multiple" @click="tbBtnHandle({}, 'batch')">
            取消
          </el-button>
          <el-button v-if="multiple" @click="tbBtnHandle({}, 'deleteBatch')">
            批量删除
          </el-button>
          <el-button type="primary" @click="tbBtnHandle({}, 'add')">
            新增题目
          </el-button>
        </div>
      </div>
    </template>
    <template #default>
      <div class="cu-box">
        <div class="mt-10">
          <cu-form :formItemList="formConfigData" @search="getList">
            <template #search>
              <el-form-item label="知识点">
                <el-cascader
                  v-model="searchForm.knowledge_id"
                  :options="knowledgeList"
                  filterable
                  :props="{
                    checkStrictly: true,
                    value: 'id',
                    label: 'name',
                  }"
                  @change="knowledgeChangeHandle"
                  clearable
                />
              </el-form-item>
            </template>
          </cu-form>
        </div>
      </div>
      <div v-if="activeTab === 'studentIssues'">
        <!-- 学生问题点内容 -->
        <cuTable
          :page="page"
          :loading="loading"
          ref="filterTable"
          :multiple="multiple"
          :operations="true"
          :tableData="list"
          :finallyColumns="listConfigData"
          @search="getList"
          :defaultPageTips="'暂无数据'"
          @sortChange="getList"
          @switchChange="switchChangeHandle"
          :selectListData="selectList"
          @selectList="selectListFn"
          selectId="id"
          listId="id"
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
      <topicPage ref="topicRef" @refresh="getList({}, true)"></topicPage>
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
import {
  deleteTopic,
  editTopicStatus,
  getKnowledgeList,
  getTopicList,
} from '@/api/adminApi'
import { getSubjectApi } from '@/api/login'
import topicPage from './components/topic.vue'
export default defineComponent({
  name: 'examinationPaper',
  components: { componentPage, topicPage },
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
      subjectName: string
      subjectId: string
      subjectList: Array<any>
      multiple: boolean
      selectList: Array<any>
      knowledgeList: Array<any>
    }>({
      loading: false,
      visible: false,
      list: [],
      searchForm: {},
      activeTab: 'studentIssues',
      subjectName: '',
      subjectId: '',
      subjectList: [],
      multiple: false,
      selectList: [],
      knowledgeList: [],
    })
    const listConfigData = ref(listConfig)
    const formConfigData = ref(formConfig)
    const topicRef = ref<InstanceType<typeof topicPage>>()
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
        subject_id: data.subjectId,
        knowledge_id: Array.isArray(data.searchForm.knowledge_id)
          ? data.searchForm.knowledge_id[
              data.searchForm.knowledge_id.length - 1
            ]
          : data.searchForm.knowledge_id,
      }
      // data.loading = true
      // 获取数据
      getTopicList(params).then((r) => {
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
        ElMessageBox.confirm(`确定删除该题目？此操作不可恢复。`, `提示`, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deleteTopic({ id: row.id.toString() }).then((r) => {
              if (r.code == 0) {
                ElMessage.success('删除成功')
                getList({}, true)
              }
            })
          })
          .catch(() => {})
      } else if (name == 'add') {
        topicRef.value?.init('')
      } else if (name == 'edit') {
        topicRef.value?.init(row)
      } else if (name == 'batch') {
        data.selectList = []
        data.multiple = !data.multiple
      } else if (name == 'deleteBatch') {
        if (data.selectList.length == 0) {
          ElMessage.warning('请选择题目')
          return
        }
        ElMessageBox.confirm(`确定删除所选题目？此操作不可恢复。`, `提示`, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deleteTopic({
              id: data.selectList.map((item) => item.id).join(','),
            }).then((r) => {
              if (r.code == 0) {
                ElMessage.success('删除成功')
                getList({}, true)
              }
            })
          })
          .catch(() => {})
      }
    }

    const pageChangeHandle = (argPage: { page: number; page_size: number }) => {
      page.page = argPage.page
      page.page_size = argPage.page_size
      getList({}, true)
    }
    const knowledgeChangeHandle = (val: Array<any>) => {
      getList({}, true)
    }
    const selectListFn = (val: Array<any>) => {
      data.selectList = val
    }
    const getSubject = () => {
      getSubjectApi({}).then((r) => {
        if (r.code == 0) {
          data.subjectList = r.data.list
          data.subjectName = r.data.list[0].name
        }
      })
    }
    onMounted(async () => {
      await getSubject()
      await getList({}, true)
      await getKnowledgeList({}).then((res: any) => {
        if (res.data && Object.keys(res.data).length !== 0) {
          data.knowledgeList = res.data.list || []
        }
      })
    })
    const subjectHandle = (val: string) => {
      data.subjectId = val
      data.subjectName = data.subjectList.find((item) => item.id == val).name
      getList({}, true)
    }
    const switchChangeHandle = (row: any, name: string) => {
      editTopicStatus({
        id: row.id,
        is_public: row.is_public,
      }).then((r) => {
        if (r.code == 0) {
          ElMessage.success('操作成功')
        }
      })
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
      subjectHandle,
      switchChangeHandle,
      topicRef,
      selectListFn,
      knowledgeChangeHandle,
      router,
    }
  },
})
</script>

<style lang="scss" scoped></style>
