<!--
 * @Description: 组件弹框Default
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-03-10 13:39:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-22 09:21:43
-->
<template>
  <el-dialog
    width="600px"
    :title="form.id ? '编辑教授班级' : '编辑教授班级'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    :append-to-body="!noClose"
    :close-on-press-escape="!noClose"
    :show-close="!noClose"
    draggable
  >
    <div style="max-height: 700px; overflow-y: auto" v-if="list.length > 0">
      <p class="text-align-center">请至少选择一个班级</p>
      <el-form ref="refForm" :model="form" :rules="rules" status-icon>
        <el-form-item>
          <el-checkbox-group v-model="class_ids" @change="changeHandle">
            <el-checkbox
              v-for="(item, index) in list"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <div v-else>
      <p class="text-align-center">暂无班级，请先创建班级</p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false" v-if="!noClose">取消</el-button>
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
import { editTeachClass, getTeachClass } from '@/api/teacher'
import { getClassApi } from '@/api/login'
interface Form {
  id?: string
  xx?: string
  // 其他表单字段
}
import { useStore } from 'vuex'
export default defineComponent({
  components: {},
  emits: ['refresh'],
  setup(_props, { emit }) {
    const refForm = ref<InstanceType<typeof ElForm>>()
    const data = reactive({
      loading: false,
      visible: false,
      form: {} as Form,
      class_ids: [],
      list: [],
      noClose: false,
    })
    const store = useStore()
    const rules = reactive(
      (function () {
        return {
          // name: [{ required: true, message: t('modules/system/administrator.nameErr'), trigger: 'blur' }]
        }
      })()
    )
    const administrator = computed(() => store.state.menu.administrator)
    const init = async (item: any) => {
      data.visible = true
      data.loading = true
      data.noClose = item.noClose
      const res = await getClassApi({
        page: 1,
        page_size: 999,
        school_id: administrator.value.school_id,
      })
      data.class_ids = item.class_ids.map((item: any) => Number(item))
      data.list = res.data.list
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
      if (data.class_ids.length === 0) {
        ElMessage.warning('请至少选择一个班级')
        return
      }
      editTeachClass({
        class_ids: data.class_ids.join(','),
      }).then((res) => {
        if (res.code == 0) {
          ElMessage.success('操作成功')
          data.visible = false
          emit('refresh')
        }
      })
    }
    const changeHandle = (val: any) => {
      console.log(val)
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
      changeHandle,
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
