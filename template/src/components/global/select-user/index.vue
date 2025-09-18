<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:38:48
-->
<template>
  <el-select
    v-model="value"
    filterable
    remote
    reserve-keyword
    :placeholder="$t('modules/public.pleaseSelect')"
    :remote-method="remoteMethod"
    style="width: 100%"
    clearable
  >
    <el-option
      v-for="item in userOptions"
      :key="item.uid"
      :label="item.companyName + ' — ' + item.phone"
      :value="item.uid"
    />
  </el-select>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import useModel from '@/mixins/model'
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
  },
  setup(props) {
    const value = useModel(props)
    const data = reactive({
      userOptions: [] as UserOption[],
    })
    const remoteMethod = (query: string) => {
      if (query !== '') {
        // pageApi({ keywords: query }).then((res: any) => {
        //   data.userOptions = res.data.list
        // })
      }
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

<style lang="scss" scoped></style>
