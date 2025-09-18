<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: qibiao
 * @LastEditTime: 2024-06-01 20:32:19
-->
<template>
  <el-select
    v-model="value"
    @change="changeFn"
    clearable
    :placeholder="'请选择角色'"
    style="width: 100%"
    v-if="visible"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import useModel from '@/mixins/model'
import { selectListApi } from '@/api/role'
export default defineComponent({
  props: {
    modelValue: {
      type: [String, Array, Number],
      required: true,
      default: () => '',
    },
  },
  setup(props, { emit }) {
    const value = useModel(props)
    const data = reactive({
      options: [],
      visible: false,
    })
    const remoteMethod = async (query) => {
      // if (query != '') {
      await selectListApi({ limit: 999 }).then((res) => {
        if (res.status == 'success') {
          data.options = res.data.data
        }
      })
      data.visible = true
      // }
    }
    const changeFn = (val) => {
      value.value = val
      // emit('change', val)
    }
    onMounted(() => {
      remoteMethod('')
    })
    return {
      value,
      ...toRefs(data),
      remoteMethod,
      changeFn,
    }
  },
})
</script>

<style lang="scss" scoped></style>
