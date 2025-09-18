<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-14 16:21:24
-->
<template>
  <el-select
    v-model="value"
    :filterable="filterable"
    :remote="remote"
    :reserve-keyword="reserveKeyword"
    :placeholder="'请选择班级'"
    :remote-method="remoteMethod"
    style="width: 100%"
    clearable
  >
    <el-option
      v-for="item in userOptions"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
    <template #prefix>
      <slot name="prefix"></slot>
    </template>
    <template #suffix>
      <slot name="suffix"></slot>
    </template>
  </el-select>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import useModel from '@/mixins/model'
import { getClassApi } from '@/api/login'
interface UserOption {
  uid: string
  companyName: string
  phone: string
}

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Array, Number, Object, Boolean] as unknown as () =>
        | string
        | any[]
        | number
        | object
        | boolean,
      required: true,
      default: () => '',
    },
    name: {
      type: String,
      default: '',
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    remote: {
      type: Boolean,
      default: false,
    },
    reserveKeyword: {
      type: Boolean,
      default: false,
    },
    schoolId: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    schoolId(newVal) {
      this.remoteMethod(newVal)
    },
  },
  setup(props) {
    const value = useModel(props)
    const data = reactive({
      userOptions: [] as UserOption[],
      filterable: props.filterable,
      remote: props.remote,
      reserveKeyword: props.reserveKeyword,
    })
    const remoteMethod = (query: string) => {
      // if (query !== '') {
      getClassApi({ school_id: props.schoolId }).then((res: any) => {
        data.userOptions = res.data.list
      })
      // }
    }
    onMounted(() => {
      remoteMethod(props.name)
    })
    return {
      value,
      ...toRefs(data),
      remoteMethod,
    }
  },
})
</script>

<style lang="scss" scoped>
:deep(.el-input__wrapper) {
  font-size: 14px;
  gap: 6px;
  line-height: 24px;
  min-height: 40px;
  padding: 8px 16px;
}
:deep(
    .el-select--large .el-select__prefix,
    .el-select--large .el-select__suffix
  ) {
  color: #000;
}
</style>
