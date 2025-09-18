<template>
  <Container :showTitle="false">
    <template #header>
      <div class="flex-box flex_j_c-space-between flex-alc width-full">
        <div>
          <h2>用户管理</h2>
        </div>
        <div>
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
            新增用户
          </el-button>
        </div>
      </div>
    </template>
    <template #default>
      <div class="cu-box flex-box flex_j_c-space-between flex-alc width-full">
        <div style="width: 50%">
          <el-menu
            :default-active="activeValue"
            mode="horizontal"
            @select="getActiveValue"
          >
            <el-menu-item :index="0">老师</el-menu-item>
            <el-menu-item :index="1">学生</el-menu-item>
          </el-menu>
        </div>
        <div class="">
          <div>
            <el-input
              @keydown.enter="getList({}, false)"
              v-model="searchForm.keyword"
              placeholder="请输入关键词"
              clearable
              style="width: 240px"
              @clear="getList({}, false)"
            />
          </div>
        </div>
      </div>
      <cuTable
        :page="page"
        :loading="loading"
        ref="filterTable"
        :multiple="multiple"
        :operations="true"
        :tableData="list"
        :finallyColumns="
          activeValue == 0 ? listConfigData : listDialogConfigData
        "
        @search="getList"
        :defaultPageTips="'暂无数据'"
        @buttonChangle="buttonChangle"
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
            编辑
          </el-button>
          <el-button
            v-repeat
            link
            type="primary"
            size="small"
            @click.prevent="tbBtnHandle(scope.row, 'delete')"
          >
            删除
          </el-button>
        </template>
      </cuTable>
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
import { listConfig, formConfig, listDialogConfig } from './config'
import componentPage from './components/component.vue'
import { useI18n } from 'vue-i18n'
import { getPracticeLog, getPracticeStatistics } from '@/api/student'
import {
  deleteStudent,
  deleteTeacher,
  editStudentStatus,
  editTeacherStatus,
  getStudentList,
  getTeacherList,
} from '@/api/adminApi'

export default defineComponent({
  name: 'default',
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
      activeValue: number
      selectList: Array<any>
      multiple: boolean
    }>({
      loading: false,
      visible: false,
      list: [],
      searchForm: {},
      activeValue: 0,
      selectList: [],
      multiple: false,
    })
    const listConfigData = ref(listConfig)
    const formConfigData = ref(formConfig)
    const listDialogConfigData = ref(listDialogConfig)
    const subject = computed(() =>
      JSON.parse(sessionStorage.getItem('subject') || '{}')
    )
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
        subject_id: subject.value.id,
      }
      if (data.activeValue === 0) {
        // 获取数据
        getTeacherList(params).then((r) => {
          if (r.code == 0) {
            data.list = r.data.list
            page.total = r.data.total
            data.list.forEach((item) => {
              item.standing = '老师'
            })
          }
        })
      } else {
        getStudentList(params).then((r) => {
          if (r.code == 0) {
            data.list = r.data.list
            page.total = r.data.total
            data.list.forEach((item) => {
              item.standing = '学生'
            })
          }
        })
      }
    }

    const tbBtnHandle = (row: any, name: string) => {
      if (name == 'edit' || name == 'add') {
        componentRef.value?.init(row)
      } else if (name == 'batch') {
        data.selectList = []
        data.multiple = !data.multiple
      } else if (name == 'deleteBatch') {
        if (data.selectList.length == 0) {
          ElMessage.warning('请选择用户')
          return
        }
        ElMessageBox.confirm(`确定删除所选用户？此操作不可恢复。`, `提示`, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            if (data.activeValue === 0) {
              deleteTeacher({
                id: data.selectList.map((item) => item.id).join(','),
              }).then((r) => {
                if (r.code == 0) {
                  ElMessage.success('删除成功')
                  data.multiple = false
                  data.selectList = []
                  getList({}, true)
                }
              })
            } else {
              deleteStudent({
                id: data.selectList.map((item) => item.id).join(','),
              }).then((r) => {
                if (r.code == 0) {
                  ElMessage.success('删除成功')
                  getList({}, true)
                }
              })
            }
          })
          .catch(() => {})
      } else if (name == 'delete') {
        ElMessageBox.confirm(
          `确定删除${row.standing}“${row.nickname}”？此操作不可恢复。`,
          `提示`,
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            if (data.activeValue === 0) {
              deleteTeacher({ id: row.id.toString() }).then((r) => {
                if (r.code == 0) {
                  ElMessage.success('删除成功')
                  getList({}, true)
                }
              })
            } else {
              deleteStudent({ id: row.id.toString() }).then((r) => {
                if (r.code == 0) {
                  ElMessage.success('删除成功')
                  getList({}, true)
                }
              })
            }
          })
          .catch(() => {})
      }
    }
    const buttonChangle = (row: any, value: number) => {
      let params: any = {
        ...row,
        difficulty: value,
      }
      componentRef.value?.init(params)
    }
    const pageChangeHandle = (argPage: { page: number; page_size: number }) => {
      page.page = argPage.page
      page.page_size = argPage.page_size
      getList({}, true)
    }
    onMounted(() => {
      getList({}, true)
    })
    const getActiveValue = (val: number) => {
      data.activeValue = val
      getList({}, false)
    }
    const switchChangeHandle = (row: any, name: string) => {
      if (data.activeValue === 0) {
        editTeacherStatus({
          id: row.id,
          status: row.status,
        })
      } else if (data.activeValue === 1) {
        editStudentStatus({
          id: row.id,
          status: row.status,
        })
      }
    }
    const selectListFn = (val: Array<any>) => {
      data.selectList = val
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
      getActiveValue,
      listDialogConfigData,
      buttonChangle,
      switchChangeHandle,
      selectListFn,
    }
  },
})
</script>

<style lang="scss" scoped>
.page-info {
  font-size: 22px;
  font-weight: 600;
  display: flex;
  gap: 20px;
}
.page-info-title {
  color: #c6c6c6;
}
.page-info-title.active {
  color: #000;
}
</style>
