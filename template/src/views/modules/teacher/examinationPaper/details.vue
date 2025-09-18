<template>
  <Container back>
    <template #header>
      <div class="flex-alc mb-10 flex_j_c-space-between">
        <div class="details-title">
          <span class="title">{{ info.name }}</span>
          <span class="info ml-20">
            {{ info.subject_name }} | {{ info.time }}
          </span>
          <el-icon
            class="ml-10 cursor-pointer"
            @click="tbBtnHandle({}, 'editInfo')"
          >
            <Edit />
          </el-icon>
        </div>
        <div>
          <el-button type="" @click="tbBtnHandle({}, 'add')">
            新增题目
          </el-button>
          <!-- <el-button type="" >
            批量导入
          </el-button> -->
          <file-upload-single
            type=""
            showName="批量导入"
            @change="importTopicFn"
            :showFileList="false"
            ref="importTopicRef"
            class="file-box"
            noUpload
          ></file-upload-single>
          <el-button type="" @click="tbBtnHandle({}, 'download')">
            下载模板
          </el-button>
          <el-button type="primary" @click="tbBtnHandle({}, 'script')">
            脚本导入
          </el-button>
          <!-- <el-button type="primary" @click="tbBtnHandle({}, 'save')">
            保存
          </el-button> -->
        </div>
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
          rightWidth="130px"
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
            <el-button
              v-repeat
              link
              type="primary"
              size="small"
              @click.prevent="tbBtnHandle(scope.row, 'up', scope.index)"
            >
              上移
            </el-button>
            <el-button
              v-repeat
              link
              type="primary"
              size="small"
              @click.prevent="tbBtnHandle(scope.row, 'dow', scope.index)"
            >
              下移
            </el-button>
          </template>
        </cuTable>
      </div>
      <div v-else>
        <!-- 知识覆盖点内容 -->
      </div>
      <topicPage ref="topicRef" @refresh="getList({}, true)"></topicPage>
      <componentPage
        ref="componentRef"
        @refresh="getList({}, true)"
      ></componentPage>
      <scriptPage ref="scriptRef" @refresh="getList({}, true)"></scriptPage>
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
import { listConfigDetails, formConfig } from './config'
import componentPage from './components/component.vue'
import topicPage from './components/topic.vue'
import { useI18n } from 'vue-i18n'
import scriptPage from './components/script.vue'
import {
  getPaperDetail,
  getTopicList,
  deleteTopic,
  downloadTopic,
  importTopic,
  setSort,
} from '@/api/teacher'
export default defineComponent({
  name: 'examinationPaper',
  components: { componentPage, topicPage, scriptPage },
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const i18n = useI18n()
    const currentLanguage = computed(() => i18n.locale.value)
    const componentRef = ref<InstanceType<typeof componentPage>>()
    const importTopicRef = ref()
    const scriptRef = ref<InstanceType<typeof scriptPage>>()
    const { page } = usePage()
    const data = reactive<{
      loading: boolean
      visible: boolean
      list: Array<any>
      searchForm: Record<string, any>
      activeTab: string
      info: any
    }>({
      loading: false,
      visible: false,
      list: [],
      searchForm: {},
      activeTab: 'studentIssues',
      info: {},
    })
    const listConfigData = ref(listConfigDetails)
    const formConfigData = ref(formConfig)
    const topicRef = ref<InstanceType<typeof topicPage>>()
    const getList = (val: Record<string, any>, flag: boolean) => {
      console.log('123')
      // data.loading = true
      // 获取数据
      getPaperDetail({ id: router.currentRoute.value.query.id }).then((r) => {
        if (r.code == 0) {
          data.info = r.data
        }
      })
      if (!flag) {
        data.searchForm = { ...data.searchForm, ...val }
        page.page = 1
        page.page_size = 10
      }
      let params = {
        ...data.searchForm,
        page: page.page,
        page_size: page.page_size,
        papers_id: router.currentRoute.value.query.id,
      }
      getTopicList(params).then((r) => {
        if (r.code == 0) {
          data.list = r.data.list
          page.total = r.data.total
        }
      })
    }

    const tbBtnHandle = (row: any, name: string, index: any) => {
      if (name == 'editInfo') {
        componentRef.value?.init(data.info)
      } else if (name == 'add') {
        topicRef.value?.init({ papers_id: router.currentRoute.value.query.id })
      } else if (name == 'delete') {
        ElMessageBox.confirm('确定删除该题目吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deleteTopic({ id: row.id }).then((r) => {
              if (r.code == 0) {
                getList({}, true)
              }
            })
          })
          .catch(() => {})
      } else if (name == 'edit') {
        topicRef.value?.init(row)
      } else if (name == 'download') {
        downloadTopic({})
      } else if (name == 'up' || name == 'dow') {
        // 获取当前id  如果是up 则获取上一个id 如果是down 则获取下一个id
        if (name == 'up' && index == 0) {
          ElMessage.warning('已经是第一个了')
          return
        }
        const params = {
          id: row.id,
          type: name,
        }
        setSort(params).then((r) => {
          if (r.code == 0) {
            getList({}, true)
          }
        })
      } else if (name == 'script') {
        scriptRef.value?.init(row)
      }
    }

    const pageChangeHandle = (argPage: { page: number; page_size: number }) => {
      page.page = argPage.page
      page.page_size = argPage.page_size
      getList({}, true)
    }
    const importTopicFn = (file: any) => {
      console.log(file)
      try {
        importTopic({
          file: file.raw,
          papers_id: router.currentRoute.value.query.id,
        }).then((r) => {
          if (r.code == 0) {
            ElMessage.success('导入成功')
            getList({}, true)
          }
        })
        // 清除组件内的文件
        importTopicRef.value?.clearFile()
      } catch (error) {
        importTopicRef.value?.clearFile()
      }
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
      topicRef,
      importTopicFn,
      importTopicRef,
      scriptRef,
    }
  },
})
</script>

<style lang="scss" scoped>
.details-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;

  .title {
    font-weight: bold;
    font-size: 18px;
  }

  .info {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
  }
}
.file-box {
  display: inline;
  margin: 0 10px;
}
</style>
