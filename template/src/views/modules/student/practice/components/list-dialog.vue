<!--
 * @Description: 组件弹框Default
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-03-10 13:39:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-30 16:15:57
-->
<template>
  <el-dialog
    width="600px"
    :title="'登记错题'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
  >
    <cuTable
      :loading="loading"
      ref="filterTable"
      :multiple="true"
      :operations="false"
      :tableData="list"
      :finallyColumns="listDialogConfigData"
      :defaultPageTips="'暂无数据'"
      :serial="false"
      :heightFlag="false"
      maxHeight="550px"
      :selectListData="selectList"
      @selectList="selectListFn"
      selectId="id"
      listId="id"
    ></cuTable>
    <template #footer>
      <Page :page="page" @change="pageChangeHandle" />
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitHandle">提交</el-button>
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
import { listConfig1 } from '../config'
import { getPracticeTopics } from '@/api/student'
import usePage from '@/mixins/page'
import { ElMessage } from 'element-plus'
import { setPracticeTopics } from '@/api/student'
interface Data {
  loading: boolean
  visible: boolean
  list: Array<any>
  papers_id: string
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
      papers_id: '',
      selectList: [],
    })
    const listDialogConfigData = ref(listConfig1)
    const rules = reactive<Record<string, any>>({})
    const { page } = usePage()
    const init = async (item: any) => {
      data.visible = true
      data.papers_id = item.id
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
        papers_id: data.papers_id,
      }
      try {
        const res = await getPracticeTopics(params)
        if (res.code == 0) {
          data.list = res.data.list
          page.total = res.data.total
        }
        data.loading = false
      } catch (error) {
        console.error('Error fetching order list:', error)
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
    const submitHandle = () => {
      console.log(data.selectList)
      if (data.selectList.length === 0) {
        ElMessage.warning('请选择题目')
        return
      } else {
        setPracticeTopics({
          topic_ids: data.selectList.map((item) => item.id).join(','),
          papers_id: data.papers_id,
        }).then((res) => {
          if (res.code == 0) {
            ElMessage.success('提交成功')
            data.visible = false
          }
        })
      }
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
      submitHandle,
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
</style>

function usePage(): { page: any } { throw new Error('Function not implemented.')
}
