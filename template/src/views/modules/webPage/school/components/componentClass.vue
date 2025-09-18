<!--
 * @Description: 组件弹框Default
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-03-10 13:39:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-06 10:29:11
-->
<template>
  <el-dialog
    width="470px"
    :title="form.id ? '编辑班级信息' : '新增班级'"
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
      label-width="80px"
      status-icon
    >
      <el-form-item label="班级名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入班级名称" />
      </el-form-item>
      <!-- 年级 下拉框 -->
      <el-form-item label="年级" prop="grade_id">
        <el-select
          v-model="form.grade_id"
          placeholder="请选择年级"
          class="w-full-select"
        >
          <el-option
            v-for="item in gradeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
import { addClass, editClass, getGrade } from '@/api/adminApi'

export default defineComponent({
  components: {},
  emits: ['refresh'],
  setup(_props, { emit }) {
    const refForm = ref<InstanceType<typeof ElForm>>()
    const data = reactive({
      loading: false,
      visible: false,
      form: {},
      gradeList: [],
    })

    const rules = reactive(
      (function () {
        return {
          name: [
            { required: true, message: '班级名称不能为空', trigger: 'blur' },
          ],
        }
      })()
    )

    const init = async (item: any) => {
      data.visible = true
      data.loading = true
      data.form = JSON.parse(JSON.stringify(item))
      const res = await getGrade({})
      data.gradeList = res.data.list
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
          if ((data.form as any).id) {
            let params = {
              id: (data.form as any).id,
              name: (data.form as any).name,
              grade_id: (data.form as any).grade_id,
            }
            const res = await editClass(params)
            if (res.code == 0) {
              ElMessage.success('编辑成功')
            }
          } else {
            const res = await addClass(data.form)
            if (res.code == 0) {
              ElMessage.success('新增成功')
            }
          }
          emit('refresh')
          data.visible = false
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
