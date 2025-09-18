<!--
 * @Description: 组件弹框Default
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-03-10 13:39:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-30 16:10:46
-->
<template>
  <el-dialog
    width="600px"
    :title="form.id ? '编辑试卷信息' : '创建试卷'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
  >
    <div style="max-height: 700px; overflow-y: auto">
      <el-form ref="refForm" :model="form" label-width="80px">
        <el-form-item label="试卷名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="学科" prop="subject">
          <el-input v-model="administrator.subject_name" disabled />
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker
            v-model="form.time"
            type="datetime"
            placeholder="选择日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, computed } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { addPaper, editPaper } from '@/api/teacher'
export default defineComponent({
  setup(props, { emit }) {
    const refForm = ref<InstanceType<typeof ElForm>>()
    const data = reactive({
      form: {
        name: '',
        time: '',
      },
      visible: false,
    })
    const store = useStore()
    const administrator = computed(() => store.state.menu.administrator)
    const init = (row: any) => {
      data.form = JSON.parse(JSON.stringify(row))
      data.visible = true
    }
    const submit = () => {
      if (data.form.name && data.form.time) {
        if ((data.form as any).id) {
          editPaper(data.form).then((r) => {
            if (r.code == 0) {
              ElMessage.success('修改成功')
              data.visible = false
              emit('refresh')
            }
          })
        } else {
          addPaper(data.form).then((r) => {
            if (r.code == 0) {
              ElMessage.success('添加成功')
              data.visible = false
              emit('refresh')
            }
          })
        }
      } else {
        ElMessage.error('请填写试卷名称和时间')
      }
    }

    const dialogClosedHandle = () => {
      refForm.value?.resetFields()
    }

    return {
      ...toRefs(data),
      refForm,
      submit,
      init,
      dialogClosedHandle,
      administrator,
    }
  },
})
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
