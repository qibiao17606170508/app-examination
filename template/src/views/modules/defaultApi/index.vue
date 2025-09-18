<template>
  <Container>
    <template #header>
      <cu-form :formItemList="formConfigData" @search="getList">
        <template #button>
          <el-button
            v-repeat
            v-permission="'administrator:create'"
            type="primary"
            @click.prevent="tbBtnHandle(null, 'add')"
          >
            {{ $t('modules/public.add') }}
          </el-button>
        </template>
      </cu-form>
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
        v-if="visible"
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

interface Data {
  loading: boolean
  visible: boolean
  list: Array<any>
  searchForm: Record<string, any>
}

export default defineComponent({
  name: 'qcAnswerQuestion',
  components: { componentPage },
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const i18n = useI18n()
    const currentLanguage = computed(() => i18n.locale.value)
    const componentRef = ref<InstanceType<typeof componentPage>>()
    const { page } = usePage()
    const data = reactive<Data>({
      loading: false,
      visible: false,
      list: [],
      searchForm: {},
    })
    const listConfigData = ref(listConfig)
    const formConfigData = ref(formConfig)

    /**
     * @description: 获取列表
     * @param {*} val
     * @return {*}
     * @author: qibiao
     */
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
      // getQAList(params).then((r) => {
      //   if (r.success) {
      //     data.list = r.data.list
      //     page.total = r.data.total
      //   }
      //   nextTick(() => {
      //     data.loading = false
      //   })
      // })
    }

    /**
     * @description: 操作按钮方法
     * @param {*} name = add | edit | delete
     * @param {*} id
     * @return {*}
     * @author: qibiao
     */
    const tbBtnHandle = (item: any, name: string) => {
      if (name == 'delete') {
        ElMessageBox.confirm(`是否删除该？`, `提示`, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // deleteQAList(item).then((r) => {
            //   if (r.success) {
            //     ElMessage.success('删除成功')
            //     getList({}, true)
            //   }
            // })
          })
          .catch(() => {})
      }
      if (name == 'edit' || name == 'add') {
        data.visible = true
        nextTick(() => {
          componentRef.value?.init(item)
        })
      }
    }

    /**
     * @description: 分页
     * @param {*} argPage
     * @return {*}
     */
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
