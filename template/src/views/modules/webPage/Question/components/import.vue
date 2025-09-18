<!--
 * @Description: 导入
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-03-10 13:39:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-12-10 16:18:18
-->
<template>
  <el-dialog
    width="950px"
    :title="'题库导入'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
  >
    <import-file-upload v-if="visible" v-model="form.file"></import-file-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-repeat type="primary" @click="submit">导入</el-button>
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  nextTick,
  onBeforeMount,
  reactive,
  ref,
  toRefs,
} from 'vue'
import { ElMessage } from 'element-plus'
// import { download } from '@/utils'
import { importTopic } from '@/api/adminApi'
export default defineComponent({
  components: {},
  emits: ['refresh'],
  setup(_props, { emit }) {
    const refForm = ref()
    const data = reactive({
      loading: false,
      visible: false,
      list: [],
      form: {},
    })
    const rules = reactive(
      (function () {
        return {}
      })()
    )

    const init = async (item) => {
      data.visible = true
      data.loading = true
      if (item && item.bookId) {
        data.form.bookId = item.bookId
      } else {
        data.form = {}
      }
    }
    onBeforeMount(() => {})
    /**
     * @description: 提交
     * @return {*}
     * @author: qibiao
     */
    const submit = () => {
      // 表单方式提交
      let form = new FormData()
      form.append('file', data.form.file)
      importTopic(form).then((res) => {
        if (res.success) {
          ElMessage.success('导入成功')
          data.visible = false
          emit('refresh')
        }
      })
    }

    /**
     * @description: 弹窗关闭动画结束时的回调
     * @param {*}
     * @return {*}
     * @author: qibiao
     */
    const dialogClosedHandle = () => {}
    return {
      refForm,
      ...toRefs(data),
      rules,
      init,
      dialogClosedHandle,
      submit,
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
