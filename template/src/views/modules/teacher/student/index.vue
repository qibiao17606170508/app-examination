<template>
  <Container>
    <template #header>
      <cu-tab
        :tabs="teachClassList"
        v-model="activeTab"
        @change="getList({}, true)"
      ></cu-tab>
      <div class="flex-box flex_j_c-flex-end mb-5" v-if="!flag">
        <el-button @click="editClassHandle">编辑班级</el-button>
      </div>
      <div v-else class="flex-box flex-alc">
        <p class="no-data mr-10">暂无班级，去选择您所教授的班级</p>
        <el-button @click="editClassHandle">选择班级</el-button>
      </div>
    </template>
    <template #default>
      <div>
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
          @switchChange="switchChangeHandle"
        ></cuTable>
      </div>
      <componentPage
        ref="componentRef"
        @refresh="getClassList({}, true)"
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
import { getStudentList, getTeachClass, editStudent } from '@/api/teacher'
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
      activeTab: string
      teachClassList: Array<any>
      class_ids: Array<any>
      flag: boolean
    }>({
      loading: false,
      visible: false,
      list: [],
      searchForm: {},
      activeTab: '',
      teachClassList: [],
      class_ids: [],
      flag: false,
    })
    const listConfigData = ref(listConfig)
    const formConfigData = ref(formConfig)
    const editClassHandle = () => {
      componentRef.value?.init({ class_ids: data.class_ids })
    }
    const getList = async (val: Record<string, any>, flag: boolean) => {
      if (!flag) {
        data.searchForm = { ...data.searchForm, ...val }
        page.page = 1
        page.page_size = 10
      }

      let params = {
        ...data.searchForm,
        page: page.page,
        page_size: page.page_size,
        class_id: data.activeTab,
      }
      data.loading = true
      // 获取数据
      await getStudentList(params).then((r) => {
        if (r && r.code == 0) {
          data.list = r.data.list
          page.total = r.data.total
        }
        nextTick(() => {
          data.loading = false
        })
      })
    }

    const tbBtnHandle = (row: any, name: string) => {}
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
    const getClassList = async () => {
      await getTeachClass({}).then((r: any) => {
        if (r && r.code === 0) {
          data.teachClassList = r.data.result.list
          data.class_ids = r.data.class_ids
          if (data.teachClassList && data.teachClassList.length > 0) {
            data.activeTab = data.teachClassList[0].id
          }
        }
      })

      if (!data.teachClassList || data.teachClassList.length === 0) {
        // componentRef.value?.init({ class_ids: data.class_ids, noClose: true })
        data.flag = true
        return
      }
      await getList({}, true)
    }
    onMounted(async () => {
      await getClassList()
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
      editClassHandle,
      getClassList,
      switchChangeHandle,
    }
  },
})
</script>

<style lang="scss" scoped>
.no-data {
  font-family: HarmonyOS Sans SC;
  font-size: 15px;
  font-weight: normal;
  line-height: 28px;
  letter-spacing: 0em;
  font-variation-settings: 'opsz' auto;
  /* black-60 */
  color: rgba(0, 0, 0, 0.6);
}
</style>
