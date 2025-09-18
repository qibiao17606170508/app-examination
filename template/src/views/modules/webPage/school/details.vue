<template>
  <Container back>
    <template #header>
      <cu-tab
        :tabs="teachClassList"
        v-model="activeTab"
        @change="getList({}, true)"
      ></cu-tab>
      <div class="flex-box flex_j_c-flex-end mb-5">
        <el-button v-if="!multiple" @click="tbBtnHandle({}, 'batch')">
          批量管理
        </el-button>
        <el-button v-if="multiple" @click="tbBtnHandle({}, 'batch')">
          取消
        </el-button>
        <el-button v-if="multiple" @click="tbBtnHandle({}, 'deleteBatch')">
          批量删除
        </el-button>
        <el-button @click="tbBtnHandle({}, 'add')" type="primary">
          新增班级
        </el-button>
      </div>
    </template>
    <template #default>
      <div>
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
          :selectListData="selectList"
          @selectList="selectListFn"
          selectId="id"
          listId="id"
        >
          <template #operations="{ row }">
            <el-button
              type="primary"
              size="small"
              link
              @click="tbBtnHandle(row, 'edit')"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              link
              size="small"
              @click="tbBtnHandle(row, 'delete')"
            >
              删除
            </el-button>
          </template>
        </cuTable>
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
import { listConfig1, formConfig } from './config'
import componentPage from './components/componentClass.vue'
import { useI18n } from 'vue-i18n'
import { getStudentList, getTeachClass, editStudent } from '@/api/teacher'
import { getClassList, deleteClass } from '@/api/adminApi'
export default defineComponent({
  name: 'schoolDetails',
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
      teachClassList: Array<any>
      activeTab: string
      selectList: Array<any>
      multiple: boolean
    }>({
      loading: false,
      visible: false,
      list: [],
      searchForm: {},
      teachClassList: [],
      activeTab: '',
      selectList: [],
      multiple: false,
    })
    const listConfigData = ref(listConfig1)
    const formConfigData = ref(formConfig)
    const getList = async (val: any, flag: boolean) => {
      if (!flag) {
        data.searchForm = { ...data.searchForm, ...val }
        page.page = 1
        page.page_size = 10
      }

      let params = {
        ...data.searchForm,
        page: page.page,
        page_size: page.page_size,
        school_id: router.currentRoute.value.query.id,
      }
      data.loading = true
      // 获取数据
      await getClassList(params).then((r: any) => {
        if (r.code == 0) {
          data.list = r.data.list
          page.total = r.data.total
        }
        nextTick(() => {
          data.loading = false
        })
      })
    }

    const tbBtnHandle = (row: any, name: string) => {
      if (name == 'edit') {
        componentRef.value?.init(row)
      } else if (name == 'delete') {
        ElMessageBox.confirm(`请确认是否删除班级“${row.name}”?`, `提示`, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deleteClass({ id: row.id }).then((r: any) => {
              if (r.code == 0) {
                ElMessage.success('删除成功')
                getList({}, true)
              }
            })
          })
          .catch(() => {})
      } else if (name == 'batch') {
        data.selectList = []
        data.multiple = !data.multiple
      } else if (name == 'deleteBatch') {
        console.log(data.selectList)
        if (data.selectList.length == 0) {
          ElMessage.warning('请选择班级')
          return
        }
        ElMessageBox.confirm(`请确认是否删除所选班级?该操作不可恢复`, `提示`, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deleteClass({
              id: data.selectList.map((item) => item.id).join(','),
            }).then((r: any) => {
              if (r.code == 0) {
                ElMessage.success('删除成功')
                getList({}, true)
              }
            })
          })
          .catch(() => {})
      } else if (name == 'add') {
        componentRef.value?.init({
          school_id: router.currentRoute.value.query.id,
        })
      }
    }
    const switchChangeHandle = (row: any, item: any) => {
      editStudent({
        id: row.id,
        status: row.status,
      }).then((r: any) => {
        if (r.code == 0) {
          ElMessage.success('操作成功')
          getList({}, true)
        }
      })
    }
    const pageChangeHandle = (argPage: { page: number; page_size: number }) => {
      page.page = argPage.page
      page.page_size = argPage.page_size
      getList({}, true)
    }
    const getGradeList = async () => {
      // await getGradeList({}).then((r: any) => {
      //   if (r.code == 0) {
      //     data.teachClassList = r.data.result.list
      //   }
      // })
      await getList({}, true)
    }
    const selectListFn = (val: Array<any>) => {
      data.selectList = val
    }
    onMounted(async () => {
      await getGradeList()
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
      switchChangeHandle,
      selectListFn,
    }
  },
})
</script>

<style lang="scss" scoped></style>
