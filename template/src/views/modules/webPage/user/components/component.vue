<!--
 * @Description: 组件弹框Default
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-03-10 13:39:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-28 14:54:32
-->
<template>
  <el-dialog
    width="650px"
    :title="form.id ? '编辑用户信息' : '新增用户'"
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
      label-position="right"
    >
      <el-form-item label="身份" prop="standing">
        <el-select
          v-model="form.standing"
          class="w-full-select"
          placeholder="请选择身份"
          @change="standingChange"
        >
          <el-option label="老师" :value="0" />
          <el-option label="学生" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="学号"
        prop="student_number"
        v-if="form.standing == 1"
      >
        <el-input v-model="form.student_number" placeholder="请输入学号" />
      </el-form-item>
      <el-form-item label="姓名" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="性别" prop="sex" v-if="form.standing == 1">
        <el-select
          v-model="form.sex"
          class="w-full-select"
          placeholder="请选择性别"
        >
          <el-option label="未知" :value="0" />
          <el-option label="男" :value="1" />
          <el-option label="女" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="学校" prop="school_id">
        <select-school class="w-full-select" v-model="form.school_id" />
      </el-form-item>
      <el-form-item label="学科" prop="subject_id" v-if="form.standing == 0">
        <select-subject class="w-full-select" v-model="form.subject_id" />
      </el-form-item>
      <el-form-item
        label="班级"
        prop="class_id"
        v-if="form.standing == 1 && form.school_id"
      >
        <select-class
          :school-id="form.school_id"
          class="w-full-select"
          v-model="form.class_id"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!form.id">
        <el-input v-model="form.password" placeholder="请输入密码" />
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
import {
  addStudent,
  addTeacher,
  editStudent,
  editTeacher,
} from '@/api/adminApi'

export default defineComponent({
  components: {},
  emits: ['refresh'],
  setup(_props, { emit }) {
    const refForm = ref<InstanceType<typeof ElForm>>()
    const data = reactive({
      loading: false,
      visible: false,
      form: {},
    })

    const rules = reactive(
      (function () {
        return {
          standing: [
            { required: true, message: '请选择身份', trigger: 'blur' },
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          school_id: [
            { required: true, message: '请选择学校', trigger: 'blur' },
          ],
          phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
          nickname: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
          ],
          subject_id: [
            { required: true, message: '请选择学科', trigger: 'blur' },
          ],
          class_id: [
            { required: true, message: '请选择班级', trigger: 'blur' },
          ],
          student_number: [
            { required: true, message: '请输入学号', trigger: 'blur' },
          ],
          sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        }
      })()
    )

    const init = async (item: any) => {
      data.visible = true
      data.loading = true
      data.form = JSON.parse(JSON.stringify(item))
      if ((data.form as any).standing == '老师') {
        ;(data.form as any).standing = 0
      } else if ((data.form as any).standing == '学生') {
        ;(data.form as any).standing = 1
      }
      console.log(data.form)
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
          console.log(data.form)
          if ((data.form as any).id) {
            if (
              (data.form as any).standing == 0 ||
              (data.form as any).standing == '老师'
            ) {
              const res = await editTeacher(data.form)
              if (res.code == 0) {
                ElMessage.success('编辑成功')
                emit('refresh')
                data.visible = false
              } else {
                ElMessage.error(res.message)
              }
            } else if (
              (data.form as any).standing == 1 ||
              (data.form as any).standing == '学生'
            ) {
              const res = await editStudent(data.form)
              if (res.code == 0) {
                ElMessage.success('编辑成功')
                emit('refresh')
                data.visible = false
              }
            }
          } else {
            if (
              (data.form as any).standing == 0 ||
              (data.form as any).standing == '老师'
            ) {
              const res = await addTeacher(data.form)
              if (res.code == 0) {
                ElMessage.success('新增成功')
                emit('refresh')
                data.visible = false
              }
            } else if (
              (data.form as any).standing == 1 ||
              (data.form as any).standing == '学生'
            ) {
              const res = await addStudent(data.form)
              if (res.code == 0) {
                ElMessage.success('新增成功')
                emit('refresh')
                data.visible = false
              }
            }
          }
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
    const standingChange = (val: any) => {
      console.log(val)
      if (val == 0) {
        ;(data.form as any).student_number = ''
        ;(data.form as any).sex = ''
      }
    }
    return {
      refForm,
      ...toRefs(data),
      rules,
      init,
      submit,
      dialogClosedHandle,
      standingChange,
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
