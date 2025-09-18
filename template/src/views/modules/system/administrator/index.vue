<!--
 * @Description:
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2024-05-15 16:50:13
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-11 11:01:26
-->
<template>
  <Container>
    <template #header>
      <el-form ref="refForm" :inline="true" @keyup.enter="reacquireHandle()">
        <!-- <el-form-item>
          <select-platform
            v-model="form.is_type"
            @change="getList"
          ></select-platform>
        </el-form-item> -->
        <el-form-item>
          <el-input
            v-model="form.name"
            :placeholder="$t('modules/system/administrator.searchName')"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <select-role v-model="form.role_id" @change="getList"></select-role>
        </el-form-item>
        <el-form-item>
          <el-button v-repeat @click="reacquireHandle()">
            {{ $t('modules/public.search') }}
          </el-button>
          <el-button
            v-repeat
            v-permission="'administrator:create'"
            type="primary"
            @click="addEditHandle()"
          >
            {{ $t('modules/public.add') }}
          </el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #default>
      <el-table ref="refTable" v-loading="loading" :data="list">
        <el-table-column align="center" type="index" width="80" label="序号" />
        <el-table-column
          align="center"
          :label="$t('modules/system/administrator.userName')"
          prop="username"
          width="180"
        />
        <el-table-column
          align="center"
          label="手机号"
          prop="phone"
          width="180"
        />
        <el-table-column
          align="center"
          :label="$t('modules/system/administrator.role')"
          prop="realname"
          width="180"
        >
          <template #default="{ row }">
            {{ row.role.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" prop="phone" width="140">
          <template #default="{ row }">
            <el-switch
              @change="statusHandle(row)"
              inline-prompt
              active-text="启用"
              inactive-text="停用"
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="create_time" />

        <el-table-column
          align="center"
          :label="$t('modules/public.operation')"
          width="120"
          fixed="right"
        >
          <template v-slot="{ row }">
            <!-- 只有administratorId==1才可以显示row.id==1的按钮 -->
            <div class="inlineBlock" v-if="row.id != 1 || administratorId == 1">
              <el-button
                v-repeat
                v-permission="'administrator:update'"
                type="primary"
                link
                @click="addEditHandle(row.id)"
              >
                {{ $t('modules/public.edit') }}
              </el-button>
            </div>
            <div class="inlineBlock" v-if="row.id != 1 || administratorId == 1">
              <el-button
                v-repeat
                v-permission="'administrator:delete'"
                type="danger"
                link
                @click="deleteHandle(row.id)"
              >
                {{ $t('modules/public.delete') }}
              </el-button>
            </div>
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

<script>
import {
  computed,
  defineComponent,
  nextTick,
  onActivated,
  onMounted,
  reactive,
  ref,
  toRefs,
} from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddEdit from './components/add-edit.vue'
import usePage from '@/mixins/page'
import useDictionary from '@/mixins/dictionary'
import { clearJson, parseDate2Str } from '@/utils'
import { useI18n } from 'vue-i18n'
import {
  getSystemUserApi,
  deleteUserApi,
  setStatusApi,
} from '@/api/administrator'

export default defineComponent({
  name: 'administrator',
  components: { AddEdit },

  setup() {
    const store = useStore()
    const { t } = useI18n()
    const refForm = ref()
    const refTable = ref()
    const refAddEdit = ref()
    const { page } = usePage()
    const { dictionaryMap, getDictionary } = useDictionary()
    const data = reactive({
      loading: false,
      visible: false,
      uploadVisible: false,
      form: {
        name: '',
        department: '',
        is_type: 1,
      },
      list: [],
      selection: [],
      departments: [],
    })
    const administratorId = computed(() => store.state.menu.administrator.id)
    /**
     * @description: 获取列表
     * @return {*}
     * @author: qibiao
     */
    const getList = () => {
      const params = {
        page: page.page,
        limit: page.limit,
        keywords: data.form.name,
        role_id: data.form.role_id,
      }
      data.loading = true
      getSystemUserApi(params).then((r) => {
        if (r.status == 'success') {
          data.list = r.data.data
          page.total = r.data.total
        }
        nextTick(() => {
          data.loading = false
        })
      })
    }
    /**
     * @description: 查询
     * @return {*}
     * @author: qibiao
     */
    const reacquireHandle = () => {
      page.page = 1
      getList()
    }
    /**
     * @description: 新增用户
     * @param {*} id
     * @return {*}
     * @author: qibiao
     */
    const addEditHandle = (id) => {
      data.visible = true
      nextTick(() => {
        refAddEdit.value.init(id)
      })
    }
    /**
     * @description: 删除用户
     * @param {*} id
     * @return {*}
     * @author: qibiao
     */
    const deleteHandle = (id) => {
      let ids = id ? [id] : data.selection.map((item) => item.id)
      // 数组转为字符串
      ids = ids.join(',')
      ElMessageBox.confirm(
        t('modules/system/administrator.ifDelete'),
        t('modules/system/administrator.tip'),
        {
          confirmButtonText: t('modules/public.confirm'),
          cancelButtonText: t('modules/public.cancel'),
          type: 'warning',
        }
      )
        .then(() => {
          deleteUserApi({ id: ids }).then((r) => {
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
    /**
     * @description: 启用禁用
     * @param {*} id
     * @return {*}
     * @author: qibiao
     */
    const statusHandle = (row) => {
      ElMessageBox.confirm(
        t('modules/system/administrator.ifOperate'),
        t('modules/system/administrator.tip'),
        {
          confirmButtonText: t('modules/public.confirm'),
          cancelButtonText: t('modules/public.cancel'),
          type: 'warning',
        }
      )
        .then(() => {
          const params = {
            id: row.id,
            field: 'status',
            value: row.status,
          }
          setStatusApi(params).then((r) => {
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
          getList()

          // to do something on canceled
        })
    }

    const pageChangeHandle = (argPage) => {
      page.page = argPage.page
      page.limit = argPage.limit
      getList()
    }

    onActivated(() => {
      getList()
    })
    onMounted(() => {
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
      pageChangeHandle,
      reacquireHandle,
      addEditHandle,
      deleteHandle,
      statusHandle,
      clearJson,
      administratorId,
    }
  },
})
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 5px;
}
</style>
