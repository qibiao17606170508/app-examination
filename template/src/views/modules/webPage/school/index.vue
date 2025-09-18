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
            新增学校
          </el-button>
        </div>
      </div>
    </template>
    <template #default>
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
            type="primary"
            size="small"
            @click.prevent="tbBtnHandle(scope.row, 'class')"
          >
            管理班级
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
import { listConfig, formConfig } from './config'
import componentPage from './components/component.vue'
import { useI18n } from 'vue-i18n'
import { getSchoolList, deleteSchool } from '@/api/adminApi'
export default defineComponent({
  name: 'default',
  components: { componentPage },
  setup() {
    const router = useRouter()
    console.log(router)
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
      multiple: boolean
      selectList: Array<any>
    }>({
      loading: false,
      visible: false,
      list: [],
      searchForm: {},
      multiple: false,
      selectList: [],
    })
    const listConfigData = ref(listConfig)
    const formConfigData = ref(formConfig)

    const getList = (val: Record<string, any>, flag: boolean) => {
      if (!flag) {
        data.searchForm = { ...data.searchForm, ...val }
        page.page = 1
        page.page_size = 10
      }
      let params = {
        ...data.searchForm,
        page: page.page,
        page_size: page.page_size,
      }
      data.loading = true
      // 获取数据
      getSchoolList(params).then((r) => {
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
      if (name == 'delete') {
        ElMessageBox.confirm(`请确认是否删除学校“${row.name}”?`, `提示`, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deleteSchool({ id: row.id.toString() }).then((r) => {
              if (r.code == 0) {
                ElMessage.success('删除成功')
                getList({}, true)
              }
            })
          })
          .catch(() => {})
      } else if (name == 'edit' || name == 'add') {
        componentRef.value?.init(row)
      } else if (name == 'batch') {
        data.selectList = []
        data.multiple = !data.multiple
      } else if (name == 'deleteBatch') {
        if (data.selectList.length == 0) {
          ElMessage.warning('请选择学校')
          return
        }
        ElMessageBox.confirm(`请确认是否删除所选学校?该操作不可恢复`, `提示`, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deleteSchool({
              id: data.selectList.map((item) => item.id).join(','),
            }).then((r) => {
              if (r.code == 0) {
                ElMessage.success('删除成功')
                getList({}, true)
              }
            })
          })
          .catch(() => {})
      } else if (name == 'class') {
        router.push({
          name: 'schoolDetails',
          query: { id: row.id },
        })
      }
    }
    const selectListFn = (val: any[]) => {
      data.selectList = val
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
      selectListFn,
      router,
    }
  },
})
</script>

<style lang="scss" scoped></style>
