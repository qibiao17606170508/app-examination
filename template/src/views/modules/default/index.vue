<template>
  <Container>
    <template #header>
      <cu-form :formItemList="formConfigData" @search="getList"></cu-form>
    </template>
    <template #default>
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
      >
        <template #operations="scope">
          <el-button
            v-repeat
            v-permission="'administrator:update'"
            link
            type="primary"
            size="small"
            @click.prevent="tbBtnHandle(scope.row, 'edit')"
          >
            {{ $t('modules/public.edit') }}
          </el-button>
          <el-button
            v-repeat
            v-permission="'administrator:update'"
            link
            type="danger"
            size="small"
            @click.prevent="tbBtnHandle(scope.row, 'delete')"
          >
            {{ $t('modules/public.delete') }}
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
    }>({
      loading: false,
      visible: false,
      list: [],
      searchForm: {},
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
      // data.loading = true
      // 获取数据
      // pageApi(params).then((r) => {
      //   if (r.success) {
      //     data.list = r.result.list
      //     page.total = r.result.total
      //   }
      //   nextTick(() => {
      //     data.loading = false
      //   })
      // })
    }

    const tbBtnHandle = (row: any, name: string) => {
      if (name == 'delete') {
        ElMessageBox.confirm(`提示`, `确定删除?`, {
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
    }
  },
})
</script>

<style lang="scss" scoped></style>
