<template>
  <Container>
    <template #header>
      <el-form ref="refForm" :inline="true" @keyup.enter="reacquireHandle()">
        <el-form-item>
          <el-input v-model="form.keywords" placeholder="名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button v-repeat @click="reacquireHandle()">
            {{ $t('modules/public.search') }}
          </el-button>
          <el-button v-repeat @click="clearJson(form), reacquireHandle()">
            {{ $t('modules/public.reset') }}
          </el-button>
          <el-button
            v-repeat
            v-permission="'role:create'"
            type="primary"
            @click="addEditHandle()"
          >
            {{ $t('modules/public.add') }}
          </el-button>
          <!-- <el-button
            v-repeat
            v-permission="'role:delete'"
            type="danger"
            :disabled="selection.length <= 0"
            @click="deleteHandle()"
            >批量删除</el-button
          > -->
        </el-form-item>
      </el-form>
    </template>
    <template #default>
      <el-table ref="refTable" v-loading="loading" :data="list" border>
        <el-table-column align="center" type="index" label="序号" width="80" />
        <el-table-column
          align="center"
          :label="$t('modules/system/role.roleName')"
          prop="name"
        />
        <el-table-column align="center" label="创建时间" prop="create_time" />
        <el-table-column
          align="center"
          :label="$t('modules/public.operation')"
          width="120"
          fixed="right"
        >
          <template v-slot="{ row }">
            <el-button
              v-repeat
              v-permission="'role:update'"
              type="primary"
              link
              @click="addEditHandle(row.id, row.is_type)"
            >
              {{ $t('modules/public.edit') }}
            </el-button>
            <el-button
              v-repeat
              v-permission="'role:delete'"
              type="danger"
              link
              @click="deleteHandle(row.id)"
            >
              {{ $t('modules/public.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <AddEdit ref="refAddEdit" v-if="visible" @refresh="getList" />
    </template>
    <template #footer>
      <Page :page="page" @change="pageChangeHandle" />
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
} from 'vue'

import { ElMessage, ElMessageBox } from 'element-plus'
import AddEdit from './components/add-edit.vue'

import useDictionary from '@/mixins/dictionary'
import usePage from '@/mixins/page'
import { clearJson, havePermission } from '@/utils'
import { useStore } from 'vuex'
import { pageApi, deleteApi } from '@/api/role'
import { useI18n } from 'vue-i18n'

interface Form {
  keywords: string
}

interface Data {
  loading: boolean
  visible: boolean
  form: Form
  list: Array<any>
  selection: Array<any>
}

export default defineComponent({
  name: 'role',
  components: { AddEdit },
  setup() {
    const refForm = ref<InstanceType<typeof HTMLFormElement>>()
    const refTable = ref<InstanceType<typeof HTMLTableElement>>()
    const refAddEdit = ref<InstanceType<typeof AddEdit>>()
    const { t } = useI18n()
    const { dictionaryMap, getDictionary } = useDictionary()
    const { page } = usePage()
    const store = useStore()
    const data = reactive<Data>({
      loading: false,
      visible: false,
      form: {
        keywords: '',
      },
      list: [],
      selection: [],
    })

    const getList = () => {
      const params = {
        ...data.form,
        page: page.page,
        page_size: page.page_size,
      }
      data.loading = true
      pageApi(params).then((r: any) => {
        if ((r.status as any) === 'success') {
          data.list = r.data.data
          page.total = r.data.total
        }
        nextTick(() => {
          data.loading = false
        })
      })
    }
    const reacquireHandle = () => {
      page.page = 1
      getList()
    }

    const addEditHandle = (id?: string) => {
      data.visible = true
      nextTick(() => {
        refAddEdit.value?.init(id)
      })
    }

    const deleteHandle = (id?: string) => {
      ElMessageBox.confirm(
        t('modules/system/role.ifDelete'),
        t('modules/system/role.tip'),
        {
          confirmButtonText: t('modules/public.confirm'),
          cancelButtonText: t('modules/public.cancel'),
          type: 'warning',
        }
      )
        .then(() => {
          deleteApi({ id: id }).then((r: any) => {
            if (r) {
              ElMessage({
                message: t('modules/public.operationSucceeded'),
                type: 'success',
              })
              getList()
            }
          })
        })
        .catch(() => {
          // to do something on canceled
        })
    }

    const pageChangeHandle = (argPage: { page: number; page_size: number }) => {
      page.page = argPage.page
      page.page_size = argPage.page_size
      getList()
    }

    onMounted(() => {
      getDictionary('dataPermission')
      getList()
    })

    return {
      refForm,
      refTable,
      refAddEdit,
      page,
      dictionaryMap,
      ...toRefs(data),
      getList,
      reacquireHandle,
      addEditHandle,
      deleteHandle,
      pageChangeHandle,
      clearJson,
      havePermission,
    }
  },
})
</script>

<style lang="scss" scoped></style>
