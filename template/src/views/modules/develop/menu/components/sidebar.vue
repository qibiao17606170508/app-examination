<template>
  <div class="sidebar-container height-full width-300 flex-box flex_d-column">
    <div class="margin_b-10 flex-box">
      <el-input class="margin_r-10" v-model="form.name" @input="inputHandle">
        <template #suffix>
          <Iconfont name="search" />
        </template>
      </el-input>
      <el-button v-repeat @click="getList()">
        <iconfont name="refresh" />
      </el-button>
      <el-button
        v-repeat
        v-permission="'menu:create'"
        type="primary"
        @click="addHandle()"
      >
        <iconfont name="plus" />
      </el-button>
    </div>
    <el-scrollbar class="flex-item_f-1" v-loading="loading">
      <el-tree
        ref="refTree"
        :data="list"
        :props="treeProps"
        node-key="id"
        :expand-on-click-node="true"
        :filter-node-method="filterNodeHandle"
        @node-click="clickHandle"
        highlight-current
        :draggable="havePermission('menu:drag')"
        :allow-drag="allowDragHandle"
        :allow-drop="allowDropHandle"
        @node-drop="nodeDropHandle"
      >
        <template #default="{ node, data }">
          <div
            class="node-box font-size-14 flex-item_f-1 flex-box flex_j_c-space-between flex_a_i-center"
          >
            <div class="node-label flex-item_f-1 margin_r-10 ellipse">
              {{ currentLanguage == 'en' ? data.nameEn : data.nameCn }}
            </div>
            <div class="node-button-box">
              <div
                class="inlineBlock"
                v-if="data.type !== 2 && data.type !== 3 && data.type !== 4"
              >
                <el-button
                  v-repeat
                  v-permission="'menu:create'"
                  size="small"
                  @click.stop="addHandle(data)"
                >
                  <Iconfont name="plus" size="12px" />
                </el-button>
              </div>
              <div class="inlineBlock" v-if="data.children">
                <el-button
                  v-repeat
                  v-permission="'menu:delete'"
                  size="small"
                  @click.stop="deleteHandle(node, data)"
                >
                  <Iconfont name="delete" size="12px" />
                </el-button>
              </div>
              <el-tag v-if="data.type === 0 && dictionaryMap[data.type]">
                {{
                  currentLanguage == 'en'
                    ? dictionaryMap[data.type].labelEn
                    : dictionaryMap[data.type].labelCn
                }}
              </el-tag>
              <el-tag
                type="success"
                v-else-if="data.type === 1 && dictionaryMap[data.type]"
              >
                {{
                  currentLanguage == 'en'
                    ? dictionaryMap[data.type].labelEn
                    : dictionaryMap[data.type].labelCn
                }}
              </el-tag>
              <el-tag
                type="info"
                v-else-if="data.type === 2 && dictionaryMap[data.type]"
              >
                {{
                  currentLanguage == 'en'
                    ? dictionaryMap[data.type].labelEn
                    : dictionaryMap[data.type].labelCn
                }}
              </el-tag>
              <el-tag
                type="warning"
                v-else-if="data.type === 3 && dictionaryMap[data.type]"
              >
                {{
                  currentLanguage == 'en'
                    ? dictionaryMap[data.type].labelEn
                    : dictionaryMap[data.type].labelCn
                }}
              </el-tag>
              <el-tag
                type="danger"
                v-else-if="data.type === 4 && dictionaryMap[data.type]"
              >
                {{
                  currentLanguage == 'en'
                    ? dictionaryMap[data.type].labelEn
                    : dictionaryMap[data.type].labelCn
                }}
              </el-tag>
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
import { havePermission } from '@/utils/index'
import { VIRTUAL_ID_KEY } from '../index'
import { useI18n } from 'vue-i18n'
import { selectListApi, deleteApi, dragApi } from '@/api/menu'

interface MenuItem {
  id: string | number
  nameCn: string
  nameEn: string
  parentId: number
  type: number
  children?: MenuItem[]
}

export default defineComponent({
  emits: ['change', UPDATE_MODEL_EVENT],
  props: {
    modelValue: {
      type: [String, Number] as PropType<string | number>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const value = useModel(props)
    const { t } = useI18n()
    const refTree = ref<any>()
    const i18n = useI18n()
    const currentLanguage = computed(() => i18n.locale.value)
    const { dictionaryMap, getDictionary } = useDictionary()
    console.log(dictionaryMap)
    const data = reactive({
      loading: false,
      form: {
        name: '',
      },
      list: [] as MenuItem[],
      index: 1,
    })

    const treeProps = computed(() => {
      return {
        children: 'children',
        label: 'nameCn',
      }
    })

    const getList = () => {
      data.loading = true
      selectListApi().then((result) => {
        var r = result
        r.data = result.data
        if (r) {
          data.list = r.data
        }
        nextTick(() => {
          data.loading = false
          refTree.value.filter(data.form.name)
        })
      })
    }

    const addHandle = (row?: MenuItem) => {
      const menu: MenuItem = {
        id: `${VIRTUAL_ID_KEY}${data.index}`,
        nameCn: `未命名${data.index}`,
        nameEn: `Unnamed ${data.index}`,
        parentId: 0,
        type: 0,
      }
      if (row) {
        menu.parentId = Number(row.id)
        if (row.type === 1) {
          menu.type = 2
        }
        if (!row.children) {
          row.children = []
        }
        row.children.push(menu)
      } else {
        data.list.push(menu)
      }
      data.index++
    }

    const delHandle = (
      id: string | number,
      list: MenuItem[],
      index: number
    ) => {
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

    const deleteHandle = (node: any, row: MenuItem) => {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((item: MenuItem) => item.id === row.id)
      if ((row.id + '').includes(VIRTUAL_ID_KEY)) {
        children.splice(index, 1)
      } else {
        delHandle(row.id, children, index)
      }
    }

    const clickHandle = (row: MenuItem, node: any) => {
      value.value = row.id
      emit('change', { row, parentType: node.parent.data.type || 0 })
    }

    const allowDragHandle = (node: any) => {
      if ((node.data.id + '').includes(VIRTUAL_ID_KEY)) {
        return false
      }
      return true
    }

    const allowDropHandle = (dragNode: any, dropNode: any, type: string) => {
      let result = true
      const dragData = dragNode.data
      const dropData = dropNode.data
      let dropParentType
      switch (type) {
        case 'inner':
          dropParentType = dropData.type
          break
        case 'prev':
        case 'next':
          dropParentType = dropNode.parent.data.type || 0
          break
      }
      switch (dragData.type) {
        case 0:
          if (dropParentType !== 0) {
            result = false
          }
          break
        case 1:
          if (dropParentType !== 0) {
            result = false
          }
          break
        case 2:
          if (dropParentType !== 1) {
            result = false
          }
          break
        case 3:
          if (dropParentType !== 0) {
            result = false
          }
          break
        case 4:
          if (dropParentType !== 0) {
            result = false
          }
          break
      }
      return result
    }

    const nodeDropHandle = (dragNode: any, dropNode: any, position: string) => {
      const dragData = dragNode.data
      const dropData = dropNode.data
      const dropParentData = dropNode.parent.data
      let dropParentId
      let dropChildren
      switch (position) {
        case 'inner':
          dropParentId = dropData.id
          dropChildren = dropData.children
          break
        case 'before':
        case 'after':
          dropParentId = dropParentData.id || 0
          dropChildren = dropParentData.children || dropParentData
          break
      }
      const params = {
        id: dragData.id,
        parentId: dropParentId,
        sortIds: dropChildren.map((item: MenuItem) => item.id),
      }
      // 拖拽
      dragApi(params).then((r) => {
        if (r) {
          ElMessage({
            message: '操作成功!',
            type: 'success',
          })
        } else {
          getList()
        }
      })
    }

    const filterNodeHandle = (keyword: string, row: MenuItem) => {
      if (!keyword) return true
      return row.nameCn.includes(keyword) || row.nameEn.includes(keyword)
    }

    const inputHandle = () => {
      refTree.value.filter(data.form.name)
    }

    onBeforeMount(() => {
      getDictionary('menu')
      getList()
    })

    return {
      value,
      refTree,
      dictionaryMap,
      ...toRefs(data),
      treeProps,
      getList,
      addHandle,
      deleteHandle,
      clickHandle,
      allowDragHandle,
      allowDropHandle,
      nodeDropHandle,
      filterNodeHandle,
      inputHandle,
      havePermission,
      currentLanguage,
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
}
.node-box {
  width: 0;
  font-size: 14px;
  .node-button-box {
    .el-button {
      visibility: hidden;
    }
    .el-button + .el-button {
      margin-left: 5px;
    }
    .el-tag {
      margin-left: 5px;
    }
  }
}
</style>
