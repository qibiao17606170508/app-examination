<template>
  <Container :showTitle="false">
    <template #header>
      <div class="page-info mb-20">
        <div
          class="page-info-title cursor-pointer"
          :class="{ active: activeValue === 0 }"
          @click="getActiveValue(0)"
        >
          <span>习题练习</span>
        </div>
        <div
          class="page-info-title cursor-pointer"
          :class="{ active: activeValue === 1 }"
          @click="getActiveValue(1)"
        >
          <span>练习历史</span>
        </div>
      </div>
    </template>
    <template #default>
      <cuTable
        :page="page"
        :loading="loading"
        ref="filterTable"
        :multiple="false"
        :operations="false"
        :tableData="list"
        :finallyColumns="
          activeValue === 0 ? listConfigData : listDialogConfigData
        "
        @search="getList"
        :defaultPageTips="'暂无数据'"
        @buttonChangle="buttonChangle"
      >
        <!-- <template #operations="scope">
          <el-button
            v-repeat
            link
            type="primary"
            size="small"
            @click.prevent="tbBtnHandle(scope.row, 'edit')"
          >
            {{ activeValue === 0 ? '去练习' : '重新练习' }}
          </el-button>
        </template> -->
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
    }>({
      loading: false,
      visible: false,
      list: [],
      searchForm: {},
      activeValue: 0,
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
        if (val.prop == 'difficulty1_percentage') {
          params.difficulty1_order = val.order
        }
        if (val.prop == 'difficulty2_percentage') {
          params.difficulty2_order = val.order
        }
        if (val.prop == 'difficulty3_percentage') {
          params.difficulty3_order = val.order
        }
        // 获取数据
        getPracticeStatistics(params).then((r) => {
          if (r.code == 0) {
            data.list = r.data.list
            page.total = r.data.total
          }
        })
      } else {
        // 获取历史数据
        getPracticeLog(params).then((r) => {
          if (r.code == 0) {
            data.list = r.data.list
            page.total = r.data.total
          }
        })
      }
    }

    const tbBtnHandle = (row: any, name: string) => {
      if (name == 'edit' || name == 'add') {
        componentRef.value?.init(row)
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
