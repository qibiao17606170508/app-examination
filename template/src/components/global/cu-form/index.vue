<!--
 * @Description: 表格
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-01-31 15:10:30
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:06:43
-->
<template>
  <div>
    <el-form
      :inline="true"
      ref="ruleForm"
      :model="search"
      class="demo-form-inline"
    >
      <slot name="beforeButton"></slot>
      <el-form-item
        v-for="(item, index) in formItemList"
        :key="index"
        :label="item.label"
      >
        <div style="display: flex">
          <!-- 普通输入框 -->
          <el-input
            v-if="item.searchType == 'input'"
            v-model="search[item.searchName]"
            :placeholder="item.placeholder"
            clearable
            @clear="searchChange"
            @keyup.enter="searchChange"
            class="formInput"
            :size="item.size"
          ></el-input>
        </div>
        <!-- 下拉选择框 -->
        <div class="selectClass" v-if="item.searchType == 'select'">
          <el-select
            v-model="search[item.searchName]"
            @change="searchChange"
            clearable
            @clear="searchChange"
            :multiple="item.multiple"
            filterable
            :remote="item.remote"
            :size="item.size"
            :remote-method="
              item.remote
                ? (query) => {
                    remoteMethod(query, item, index)
                  }
                : null
            "
            :placeholder="
              item.placeholder
                ? item.placeholder
                : $t('modules/public.pleaseSelect')
            "
          >
            <el-option
              v-for="(subitem, subindex) in item.selectOptions"
              :key="subindex"
              :label="subitem.label"
              :value="subitem.value"
            ></el-option>
          </el-select>
        </div>
        <!-- 日期选择 -->
        <el-date-picker
          v-if="item.searchType && item.searchType.indexOf('date') !== -1"
          v-model="search[item.searchName]"
          :type="item.picker"
          @change="searchChange(item)"
          :size="item.size"
          :placeholder="item.placeholder"
          :start-placeholder="item['start-placeholder']"
          :end-placeholder="item['end-placeholder']"
          clearable
          :value-format="item['value-format']"
        ></el-date-picker>
      </el-form-item>
      <slot name="search"></slot>
      <el-form-item>
        <el-button
          type="primary"
          v-repeat
          style="margin-left: 5px"
          v-if="searchButton"
          @click="searchChange"
        >
          查询
        </el-button>
        <el-button type="primary" v-repeat v-if="formReset" @click="onEmpty">
          重置
        </el-button>
        <slot name="button"></slot>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, reactive, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { clearJson } from '@/utils/index'

interface FormData {
  columnCheckedId: string
  multipleSelection: any[]
  checkedList: any[]
  toDetailsQuery: Record<string, any>
  search: Record<string, any>
  tags: any[]
  srcList: any[]
}

export default defineComponent({
  props: {
    formItemList: {
      type: Array as () => Array<any>,
      default: () => [],
    },
    formReset: {
      type: Boolean,
      default: false,
    },
    searchButton: {
      type: Boolean,
      default: true,
    },
    searchData: {
      type: Object as () => Record<string, any>,
      default: () => ({}),
    },
  },
  emits: ['search', 'pageChange'],
  setup(props, { emit }) {
    const i18n = useI18n()
    const data = reactive<FormData>({
      columnCheckedId: '',
      multipleSelection: [],
      checkedList: [],
      toDetailsQuery: {},
      search: props.searchData || {},
      tags: [],
      srcList: [],
    })

    const searchChange = () => {
      for (const key in data.search) {
        if (typeof data.search[key] === 'string') {
          data.search[key] = data.search[key].replace(/\s|\t/g, '')
        }
      }
      emit('search', data.search)
    }

    const remoteMethod = (query: string, row: any, index: number) => {
      row.remoteMethod(query, row, index)
    }

    const onEmpty = () => {
      clearJson(data.search)
      emit('search', data.search, 'reset')
    }

    return {
      ...toRefs(data),
      clearJson,
      remoteMethod,
      onEmpty,
      searchChange,
    }
  },
})
</script>
<style scoped lang="scss">
:deep(.formInput .el-input__inner) {
  width: 200px;
}
</style>
