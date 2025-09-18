<template>
  <div class="sidebar-container height-full width-300 flex-box flex_d-column">
    <div class="margin_b-10 flex-box">
      <el-input class="margin_r-10" v-model="form.name" @input="inputHandle">
        <template #suffix>
          <Iconfont name="search" />
        </template>
      </el-input>
    </div>
    <el-scrollbar class="flex-item_f-1" v-loading="loading">
      <el-tree
        ref="refTree"
        :data="list"
        :props="treeProps"
        node-key="id"
        :expand-on-click-node="true"
        @node-click="clickHandle"
        highlight-current
        :filter-node-method="filterNodeHandle"
        :current-node-key="defaultSelectedKey"
      >
        <template #default="{ data }">
          <div
            class="node-box font-size-14 flex-item_f-1 flex-box flex_j_c-space-between flex_a_i-center"
          >
            <div class="node-label flex-item_f-1 margin_r-10 ellipse">
              {{ data.name }}
            </div>
            <div class="node-button-box">
              <!-- <div class="inlineBlock el-dropdown-box">
                <el-dropdown trigger="click" @command="handleClick">
                  <span class="el-dropdown-link">
                    <el-icon><MoreFilled /></el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="edit">编辑</el-dropdown-item>
                      <el-dropdown-item command="delete">删除</el-dropdown-item>
                      <el-dropdown-item command="import">
                        导入知识点
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div> -->
            </div>
          </div>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
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
  PropType,
} from 'vue'

import { ElMessage, ElMessageBox } from 'element-plus'

import useModel from '@/mixins/model'
import useDictionary from '@/mixins/dictionary'
import { UPDATE_MODEL_EVENT } from '@/utils/constant'
import { useI18n } from 'vue-i18n'
import { selectListApi, deleteApi, dragApi } from '@/api/menu'
import { getSubjectApi } from '@/api/login'

export default defineComponent({
  emits: ['change', UPDATE_MODEL_EVENT],
  props: {
    modelValue: {
      type: [String, Number, null, Object] as PropType<
        string | number | null | object
      >,
      required: true,
    },
  },
  setup(props, { emit }) {
    const value = useModel(props)
    const { t } = useI18n()
    const refTree = ref<any>()
    const i18n = useI18n()
    const defaultSelectedKey = ref(null)
    const currentLanguage = computed(() => i18n.locale.value)
    const data = reactive({
      loading: false,
      form: {
        name: '',
      },
      list: [],
      index: 1,
    })
    const treeProps = computed(() => {
      return {
        label: 'name',
      }
    })

    const getList = () => {
      data.loading = true
      getSubjectApi({ page: 1, pageSize: 9999 }).then((result) => {
        if (result.code == 0) {
          value.value = result.data.list[0].id
          defaultSelectedKey.value = result.data.list[0].id
          data.list = result.data.list
          nextTick(() => {
            refTree.value.setCurrentKey(defaultSelectedKey.value)
          })
          console.log(defaultSelectedKey.value)
        }
        nextTick(() => {
          data.loading = false
          refTree.value.filter(data.form.name)
        })
      })
    }
    const filterNodeHandle = (keyword: string, row: any) => {
      if (!keyword) return true
      return row.name.includes(keyword)
    }
    const delHandle = (id: string | number, list: any[], index: number) => {
      ElMessageBox.confirm(
        `${t('modules/system/department.confirmTheOperation')}`,
        t('modules/public.tips'),
        {
          confirmButtonText: t('modules/public.confirm'),
          cancelButtonText: t('modules/public.cancel'),
          type: 'warning',
        }
      )
        .then(() => {
          deleteApi({ key: String(id) }).then((r) => {
            if (r) {
              ElMessage({
                message: t('modules/public.operationSucceeded'),
                type: 'success',
              })
              list.splice(index, 1)
            }
          })
        })
        .catch(() => {
          // to do something on canceled
        })
    }

    const deleteHandle = (node: any, row: any) => {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((item: any) => item.id === row.id)
      if (row.id + '') {
        children.splice(index, 1)
      } else {
        delHandle(row.id, children, index)
      }
    }

    const clickHandle = (row: any, node: any) => {
      value.value = row.id
      emit('change', { row, parentType: node.parent.data.type || 0 })
    }

    const inputHandle = () => {
      refTree.value.filter(data.form.name)
    }

    onBeforeMount(() => {
      getList()
    })
    const handleClick = (val: any) => {
      console.log('handleClick', val)
    }
    return {
      value,
      refTree,
      ...toRefs(data),
      treeProps,
      getList,
      deleteHandle,
      clickHandle,
      inputHandle,
      currentLanguage,
      filterNodeHandle,
      handleClick,
      defaultSelectedKey,
    }
  },
})
</script>

<style lang="scss" scoped>
:deep(.el-tree-node__content) {
  height: 36px;
  &:hover {
    .node-button-box .el-button {
      visibility: visible;
    }
  }
  /* &:hover .el-dropdown-box {
    display: block;
  } */
}
.node-box {
  width: 0;
  font-size: 14px;
  .node-button-box {
    .el-button {
      visibility: hidden;
    }
    /* .el-dropdown-box {
      display: none;
    } */
    .el-button + .el-button {
      margin-left: 5px;
    }
    .el-tag {
      margin-left: 5px;
    }
  }
}
</style>
