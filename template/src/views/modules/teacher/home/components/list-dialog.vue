<!--
 * @Description: 组件弹框Default
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-03-10 13:39:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-25 10:50:12
-->
<template>
  <el-dialog
    width="950px"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
  >
    <template #header>
      <div class="dialog-header">
        {{ info.nickname + '的练习历史' }}
        <span class="pl-10">累计练习{{ info.practice_num }}次</span>
      </div>
    </template>
    <cuTable
      :loading="loading"
      ref="filterTable"
      :multiple="false"
      :operations="false"
      :tableData="list"
      :finallyColumns="listDialogConfigData"
      :defaultPageTips="'暂无数据'"
      :serial="false"
      :heightFlag="false"
      maxHeight="450px"
    ></cuTable>
    <template #footer>
      <Page :page="page" @change="pageChangeHandle" />
      <span class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onBeforeMount,
  reactive,
  ref,
  toRefs,
} from 'vue'
import { listDialogConfig } from '../config'
import usePage from '@/mixins/page'
import { ElMessage } from 'element-plus'
import { getPracticeLog } from '@/api/teacher'
interface Data {
  loading: boolean
  visible: boolean
  list: Array<any>
  info: Record<string, any>
  selectList: Array<any>
}

export default defineComponent({
  components: {},
  emits: ['refresh'],
  setup(_props, { emit }) {
    const refForm = ref<HTMLElement | null>(null)
    const data = reactive<Data>({
      loading: false,
      visible: false,
      list: [],
      info: {},
      selectList: [],
    })
    const listDialogConfigData = ref(listDialogConfig)
    const rules = reactive<Record<string, any>>({})
    const { page } = usePage()
    const init = async (item: any) => {
      data.visible = true
      data.info = item
      getList({}, true)
      // data.loading = true
    }

    const getList = async (val: Record<string, any>, flag: boolean) => {
      data.loading = true
      if (!flag) {
        page.page = 1
        page.page_size = 1
      }
      const params = {
        page: page.page,
        page_size: page.page_size,
        student_id: data.info.id,
      }
      try {
        const res = await getPracticeLog(params)
        if (res.code == 0) {
          data.list = res.data.list
          page.total = res.data.total
        }
        data.loading = false
      } catch (error) {
        data.loading = false
      }
    }
    onBeforeMount(() => {})

    /**
     * @description: 弹窗关闭动画结束时的回调
     * @param {*}
     * @return {*}
     */
    const dialogClosedHandle = () => {}
    const selectListFn = (val: any[]) => {
      data.selectList = val
    }

    const pageChangeHandle = (argPage: { page: number; page_size: number }) => {
      page.page = argPage.page
      page.page_size = argPage.page_size
      getList({}, true)
    }
    return {
      refForm,
      ...toRefs(data),
      rules,
      init,
      dialogClosedHandle,
      listDialogConfigData,
      selectListFn,
      page,
      pageChangeHandle,
    }
  },
})
</script>
<style scoped lang="scss">
:deep(.upload-cu .el-upload-list__item) {
  width: 100px;
  height: 100px;
}
:deep(.upload-cu .el-upload--picture-card) {
  width: 100px;
  height: 100px;
}
.tips {
  color: rgba(136, 136, 136, 1);
  font-size: 12px;
}
.dialog-header {
  font-weight: bold;
  margin-bottom: 10px;
  span {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    font-weight: normal;
  }
}
</style>
