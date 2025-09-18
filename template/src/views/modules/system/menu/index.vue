<template>
  <Container>
    <template #default>
      <el-table
        ref="refTable"
        :data="list"
        v-loading="loading"
        :tree-props="props"
        row-key="id"
        border
      >
        <el-table-column
          align="center"
          :label="$t('modules/system/menu.chineseName')"
          prop="nameCn"
          min-width="150"
        />
        <el-table-column
          align="center"
          :label="$t('modules/system/menu.icon')"
          width="80"
        >
          <template v-slot="{ row }">
            <Iconfont v-if="row.type !== 2 && row.icon" :name="row.icon" />
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('modules/system/menu.type')"
          prop="type"
          width="90"
        >
          <template v-slot="{ row }">
            <el-tag v-if="row.type === 0">
              {{
                currentLanguage == 'en'
                  ? dictionaryMap[row.type].labelEn
                  : dictionaryMap[row.type].labelCn
              }}
            </el-tag>
            <el-tag type="success" v-else-if="row.type === 1">
              {{
                currentLanguage == 'en'
                  ? dictionaryMap[row.type].labelEn
                  : dictionaryMap[row.type].labelCn
              }}
            </el-tag>
            <el-tag type="info" v-else-if="row.type === 2">
              {{
                currentLanguage == 'en'
                  ? dictionaryMap[row.type].labelEn
                  : dictionaryMap[row.type].labelCn
              }}
            </el-tag>
            <el-tag type="warning" v-else-if="row.type === 3">
              {{
                currentLanguage == 'en'
                  ? dictionaryMap[row.type].labelEn
                  : dictionaryMap[row.type].labelCn
              }}
            </el-tag>
            <el-tag type="danger" v-else-if="row.type === 4">
              {{
                currentLanguage == 'en'
                  ? dictionaryMap[row.type].labelEn
                  : dictionaryMap[row.type].labelCn
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('modules/system/menu.sort')"
          prop="sort"
          width="80"
        />
        <el-table-column
          align="center"
          :label="$t('modules/system/menu.operation')"
          prop="type"
          width="100"
        >
          <template v-slot="{ row }">
            <el-button
              v-repeat
              v-permission="'enterpriseMenu:update'"
              type="primary"
              link
              @click="editHandle(row)"
            >
              {{ $t('modules/public.edit') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <Edit ref="refEdit" v-if="visible" />
    </template>
  </Container>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
  computed,
} from 'vue'

import Edit from './components/edit.vue'

import useDictionary from '@/mixins/dictionary'
import { useStore } from 'vuex'

import { listApi } from '@/api/enterprise-menu'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'menuPage',
  components: { Edit },
  setup() {
    const props = {
      children: 'children',
    }
    const store = useStore()
    const administratorId = computed(() => store.state.menu.administrator.uid)
    const i18n = useI18n()
    const currentLanguage = computed(() => i18n.locale.value)
    const refTable = ref<InstanceType<typeof Edit> | null>(null)
    const refEdit = ref<InstanceType<typeof Edit> | null>(null)
    const { dictionaryMap, getDictionary } = useDictionary()
    const data = reactive({
      loading: false,
      visible: false,
      list: [] as Array<any>,
    })

    const getList = () => {
      data.loading = true
      listApi({}).then((result) => {
        let r = result
        r.data = result.data
        if (r) {
          data.list = r.data
          // 如果administratorId != 20057 不显示data.list中 id==213 的数据
          if (administratorId.value != 20057) {
            data.list = data.list.filter((item) => item.id != 213)
          }
        }
        nextTick(() => {
          data.loading = false
        })
      })
    }

    const editHandle = (row: any) => {
      data.visible = true
      nextTick(() => {
        refEdit.value?.init(row)
      })
    }

    onMounted(() => {
      getDictionary('menu')
      getList()
    })

    return {
      props,
      refTable,
      refEdit,
      dictionaryMap,
      ...toRefs(data),
      editHandle,
      currentLanguage,
    }
  },
})
</script>

<style lang="scss" scoped></style>
