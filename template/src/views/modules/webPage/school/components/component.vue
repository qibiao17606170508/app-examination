<!--
 * @Description: 组件弹框Default
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-03-10 13:39:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-06 10:26:35
-->
<template>
  <el-dialog
    width="600px"
    :title="form.id ? '编辑学校信息' : '新增学校'"
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
      <el-form-item label="学校名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入学校名称" />
      </el-form-item>
      <el-form-item
        label="省份"
        prop="province_code"
        v-if="provinceList.length > 0"
      >
        <el-select
          v-model="form.province_code"
          @change="cityChangeHandle"
          placeholder="请选择省份"
          class="w-full-select"
        >
          <el-option
            v-for="item in provinceList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="城市" prop="city_code" v-if="cityList.length > 0">
        <el-select
          v-model="form.city_code"
          placeholder="请选择城市"
          class="w-full-select"
          @change="areaChangeHandle"
        >
          <el-option
            v-for="item in cityList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="地区"
        prop="area_code"
        class="w-full-select"
        v-if="districtList.length > 0"
      >
        <el-select v-model="form.area_code" placeholder="请选择地区">
          <el-option
            v-for="item in districtList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
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
import { addSchool, editSchool, getAddress } from '@/api/adminApi'

export default defineComponent({
  components: {},
  emits: ['refresh'],
  setup(_props, { emit }) {
    const refForm = ref<InstanceType<typeof ElForm>>()
    const data = reactive({
      loading: false,
      visible: false,
      form: {
        province_code: '',
        city_code: '',
        area_code: '',
      },
      provinceList: [],
      cityList: [],
      districtList: [],
    })

    const rules = reactive(
      (function () {
        return {
          name: [
            { required: true, message: '学校名称不能为空', trigger: 'blur' },
          ],
          province_code: [
            { required: true, message: '省份不能为空', trigger: 'blur' },
          ],
          city_code: [
            { required: true, message: '城市不能为空', trigger: 'blur' },
          ],
          area_code: [
            { required: true, message: '地区不能为空', trigger: 'blur' },
          ],
        }
      })()
    )
    const init = async (item: any) => {
      data.visible = true
      data.loading = true
      data.provinceList = []
      data.cityList = []
      data.districtList = []
      data.form = JSON.parse(JSON.stringify(item))
      provinceChangeHandle(data.form.province_code, true)
      if (data.form.city_code) {
        cityChangeHandle(data.form.city_code, true)
      }
      if (data.form.area_code) {
        areaChangeHandle(data.form.area_code, true)
      }
      nextTick(() => {
        data.loading = false
      })
    }
    const provinceChangeHandle = async (val: any, isInit = false) => {
      data.cityList = []
      data.districtList = []
      data.provinceList = []
      const res = await getAddress({ type: 'province' })
      if (res.code == 0) {
        data.provinceList = res.data.list
      }
    }
    const cityChangeHandle = async (val: any, isInit = false) => {
      // 清空地区
      if (!isInit) {
        data.form.area_code = ''
        data.form.city_code = ''
        data.cityList = []
        data.districtList = []
      }
      const res = await getAddress({
        type: 'city',
        province_code: data.form.province_code,
      })
      if (res.code == 0) {
        data.cityList = res.data.list
      }
    }
    const areaChangeHandle = async (val: any, isInit = false) => {
      // 清空地区
      if (!isInit) {
        data.form.area_code = ''
        data.districtList = []
      }
      const res = await getAddress({
        type: 'area',
        city_code: data.form.city_code,
        province_code: data.form.province_code,
      })
      if (res.code == 0) {
        data.districtList = res.data.list
      }
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
              province_code: (data.form as any).province_code,
              city_code: (data.form as any).city_code,
              area_code: (data.form as any).area_code,
            }
            const res = await editSchool(params)
            if (res.code == 0) {
              ElMessage.success('编辑成功')
            }
          } else {
            const res = await addSchool(data.form)
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
      provinceChangeHandle,
      cityChangeHandle,
      areaChangeHandle,
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
