<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-21 16:51:06
-->
<template>
  <div class="custom-tabs mb-10">
    <div
      v-for="(tab, index) in tabs"
      :key="index"
      class="custom-tabs-item"
      :class="{ 'is-active': activeTab === tab.id }"
      @click="handleTabClick(tab)"
    >
      {{ tab.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch } from 'vue'
import useModel from '@/mixins/model'

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
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['change', 'update:modelValue'],
  setup(props, { emit }) {
    const value = useModel(props)
    const data = reactive({
      activeTab: '',
    })

    const handleTabClick = (tab: any) => {
      data.activeTab = tab.id as any
      value.value = tab.id
      emit('change', tab.id)
      // emit('update:modelValue', tab.id)
    }
    watch(value, (newVal) => {
      data.activeTab = newVal as any
    })
    onMounted(() => {
      data.activeTab = (value.value as any)
        ? (value.value as any)
        : (props.tabs[0] as any)?.id || ''
    })
    return {
      value,
      ...toRefs(data),
      handleTabClick,
    }
  },
})
</script>

<style lang="scss" scoped>
.custom-tabs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.custom-tabs-item {
  border-radius: 20px;
  padding: 10px 30px;
  margin-right: 10px;
  color: #666;
  font-size: 15px;
  margin-top: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  border: 1px solid transparent;
}

.custom-tabs-item.is-active {
  font-weight: 600;
  color: #00bcd4;
  background-color: #e0f7fa;
  border: 1px solid #00bcd4;
}

.custom-tabs-item:hover {
  font-weight: 600;
  color: #00bcd4;
  background-color: #e0f7fa;
  border: 1px solid #00bcd4;
}
</style>
