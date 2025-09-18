<!--
 * @Description: 组件弹框Default
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-03-10 13:39:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-28 15:20:48
-->
<template>
  <el-dialog
    width="650px"
    :title="form.id ? '编辑知识点' : '新增知识点'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
  >
    <p class="tips ml-120">不选择，则默认添加一级知识点</p>
    <el-form
      ref="refForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      status-icon
    >
      <el-form-item label="知识点" prop="parent_id">
        <el-cascader
          style="width: 100%"
          :props="{
            checkStrictly: true,
            value: 'id',
            label: 'name',
            children: 'children',
            disabled: (node) => node.id == form.id || node.level >= 3,
          }"
          clearable
          :options="list"
          placeholder="请选择知识点"
          :show-all-levels="true"
          v-model="parent_id"
          @change="changeFn"
        />
      </el-form-item>
      <el-form-item label="知识点名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入知识点名称" />
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
import { addKnowledge, editKnowledge } from '@/api/adminApi'
export default defineComponent({
  components: {},
  emits: ['refresh'],
  setup(_props, { emit }) {
    const refForm = ref<InstanceType<typeof ElForm>>()
    const data = reactive({
      loading: false,
      visible: false,
      form: {
        parent_id: 0,
      },
      list: [],
      parent_id: [] as any[],
    })

    const rules = reactive(
      (function () {
        return {
          name: [
            { required: true, message: '请输入知识点名称', trigger: 'blur' },
          ],
        }
      })()
    )

    const init = async (item: any, list: any) => {
      data.visible = true
      data.loading = true
      data.form = JSON.parse(JSON.stringify(item))
      if ((data.form as any).id) {
        // 数据结构如 : [{id:497,name:'',children:[{id:498,name:'',children:[{id:499,name:''}]}]}]
        // 找到对应id 如果最后一级则是[497,498,499]
        const find = (list: any[], id: number): any => {
          for (const item of list) {
            if (item.id === id) return item
            if (item.children) {
              const res = find(item.children, id)
              if (res) return res
            }
          }
        }
        const res1 = find(list, (data.form as any).id)
        if (res1.level == 3) {
          const res2 = find(list, res1.parent_id)
          data.parent_id = [res2.parent_id, res2.id]
        } else {
          data.parent_id = [res1.parent_id]
        }
        console.log(res1)
      }
      data.list = list
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
        if (data.parent_id.length > 0) {
          data.form.parent_id = data.parent_id[data.parent_id.length - 1]
        }
        if (valid) {
          if ((data.form as any).id) {
            let params = {
              id: (data.form as any).id,
              subject_id: (data.form as any).subject_id,
              name: (data.form as any).name,
              parent_id: (data.form as any).parent_id,
              grade_id: (data.form as any).grade_id,
            }
            const res = await editKnowledge(params)
            if (res.code == 0) {
              ElMessage.success('编辑成功')
              data.visible = false
              emit('refresh')
            }
          } else {
            const res = await addKnowledge(data.form)
            if (res.code == 0) {
              ElMessage.success('新增成功')
              data.visible = false
              emit('refresh')
            }
          }
        }
      })
    }
    const changeFn = (value: any) => {}
    onBeforeMount(() => {})

    /**
     * @description: 弹窗关闭动画结束时的回调
     * @param {*}
     * @return {*}
     */
    const dialogClosedHandle = () => {
      // 清除data里的数据
      data.parent_id = []
      data.form = {
        parent_id: 0,
      }
      refForm.value?.resetFields()
    }

    return {
      refForm,
      ...toRefs(data),
      rules,
      init,
      submit,
      dialogClosedHandle,
      changeFn,
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
