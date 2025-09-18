<!--
 * @Description: 编辑问答
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-03-10 13:39:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-09 10:41:38
-->
<template>
  <el-dialog
    width="650px"
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
      <!-- 排序 -->
      <el-form-item label="排序" prop="sort">
        <el-input
          v-model="form.sort"
          type="number"
          placeholder="请输入排序"
        ></el-input>
      </el-form-item>
      <el-form-item label="问题" prop="question">
        <el-input
          v-model="form.question"
          type="textarea"
          placeholder="请输入问题内容（最多500字）"
        ></el-input>
      </el-form-item>
      <el-form-item label="答案" prop="answer">
        <el-input
          v-model="form.answer"
          type="textarea"
          placeholder="请输入问题内容（最多500字）"
        ></el-input>
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
import { clearJson } from '@/utils'

interface Form {
  sort: number
  question: string
  answer: string
  id?: number
  attName?: string
}

export default defineComponent({
  components: {},
  emits: ['refresh'],
  setup(_props, { emit }) {
    const refForm = ref<InstanceType<typeof ElForm>>()
    const data = reactive<{
      loading: boolean
      visible: boolean
      form: Form
    }>({
      loading: false,
      visible: false,
      form: {
        sort: 1,
        question: '',
        answer: '',
      },
    })

    const rules = reactive({
      sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
      answer: [{ required: true, message: '请输入答案', trigger: 'blur' }],
      question: [{ required: true, message: '请输入问题', trigger: 'blur' }],
    })

    const init = async (item?: { id: number }) => {
      data.loading = true
      if (item && item.id) {
        // const res = await getQADetail({ id: item.id })
        // data.form = res.data
      } else {
        clearJson(data.form)
      }
      data.visible = true
      nextTick(() => {
        data.loading = false
      })
    }

    const getFileName = (val: string) => {
      data.form.attName = val
    }

    const submit = () => {
      refForm.value?.validate(async (valid: boolean) => {
        if (valid) {
          if (data.form.id) {
            // const res = await editQADetail(data.form)
            // if (res.success) {
            //   ElMessage.success('编辑成功')
            //   emit('refresh')
            //   data.visible = false
            // }
          } else {
            // const res = await addQAList(data.form)
            // if (res.success) {
            //   ElMessage.success('新增成功')
            //   emit('refresh')
            //   data.visible = false
            // }
          }
        }
      })
    }

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
      getFileName,
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
