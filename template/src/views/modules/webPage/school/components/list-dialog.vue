<!--
 * @Description: 组件弹框Default
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-03-10 13:39:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-09 10:38:59
-->
<template>
  <el-dialog
    width="950px"
    :title="'列表弹框'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
  >
    <cuTable
      :loading="loading"
      ref="filterTable"
      :multiple="false"
      :operations="false"
      :tableData="list"
      :finallyColumns="listDialogConfigData"
      :defaultPageTips="'暂无数据'"
    ></cuTable>
    <template #footer>
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

interface Data {
  loading: boolean
  visible: boolean
  list: Array<any>
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
    })
    const listDialogConfigData = ref(listDialogConfig)
    const rules = reactive<Record<string, any>>({})

    const init = async (item: any) => {
      data.visible = true
      data.loading = true
      // data.form = item
      // msgDetailRecord({ msgId: item.msgId }).then((res) => {
      //   data.list = res.data
      //   nextTick(() => {
      //     data.loading = false
      //   })
      // })
    }
    onBeforeMount(() => {})

    /**
     * @description: 弹窗关闭动画结束时的回调
     * @param {*}
     * @return {*}
     */
    const dialogClosedHandle = () => {}
    return {
      refForm,
      ...toRefs(data),
      rules,
      init,
      dialogClosedHandle,
      listDialogConfigData,
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
