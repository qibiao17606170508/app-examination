<!--
 * @Description: 组件弹框Default
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-03-10 13:39:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-30 16:11:59
-->
<template>
  <el-dialog
    width="600px"
    :title="form.id ? '编辑' : '新增'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
  >
    <el-form
      ref="refForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      status-icon
    >
      <el-form-item label="xx" prop="xx">
        <el-input v-model="form.xx" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button v-repeat type="primary" @click="submit()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeMount,
  reactive,
  ref,
  toRefs,
} from 'vue'
import { ElForm, ElMessage } from 'element-plus'

interface Form {
  id?: string
  xx?: string
  // 其他表单字段
}

export default defineComponent({
  components: {},
  emits: ['refresh'],
  setup(_props, { emit }) {
    const refForm = ref<InstanceType<typeof ElForm>>()
    const data = reactive({
      loading: false,
      visible: false,
      form: {} as Form,
    })

    const rules = reactive(
      (function () {
        return {
          // name: [{ required: true, message: t('modules/system/administrator.nameErr'), trigger: 'blur' }]
        }
      })()
    )

    const init = async (item: Form) => {
      data.visible = true
      data.loading = true
      nextTick(() => {
        data.loading = false
      })
    }

    /**
     * @description: 表单验证提交
     * @param {*}
     * @return {*}
     */
    const submit = () => {
      refForm.value?.validate(async (valid: boolean) => {
        if (valid) {
          console.log('123')
        }
      })
    }

    onBeforeMount(() => {})

    /**
     * @description: 弹窗关闭动画结束时的回调
     * @param {*}
     * @return {*}
     */
    const dialogClosedHandle = () => {
      refForm.value?.resetFields()
    }

    return {
      refForm,
      ...toRefs(data),
      rules,
      init,
      submit,
      dialogClosedHandle,
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
