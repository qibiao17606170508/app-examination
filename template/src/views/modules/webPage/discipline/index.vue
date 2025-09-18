<template>
  <ContainerSidebar ref="refContainerSidebar" :scroll="false">
    <template #header></template>
    <template #sidebar>
      <Sidebar v-model="active" @change="changeHandle" />
    </template>
    <template #default>
      <div>
        <div class="flex-box flex_j_c-space-between flex-alc">
          <div>
            <h3>
              知识点列表
              <el-dropdown
                style="margin-left: 10px"
                trigger="click"
                @command="levelHandle"
              >
                <div class="cursor-pointer width-full font-700">
                  {{ levelName }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="''">
                      全部知识点
                    </el-dropdown-item>
                    <el-dropdown-item command="1">一级知识点</el-dropdown-item>
                    <el-dropdown-item command="2">二级知识点</el-dropdown-item>
                    <el-dropdown-item command="3">三级知识点</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-dropdown
                style="margin-left: 10px"
                trigger="click"
                @command="gradeHandle"
              >
                <div class="cursor-pointer width-full font-700">
                  {{ gradeName }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.id"
                      v-for="item in gradeList"
                      :key="item.id"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </h3>
          </div>
          <div>
            <el-button @click="tbBtnHandle({}, 'add')">新增知识点</el-button>
          </div>
        </div>
        <el-table
          :data="list"
          style="
            width: 100%;
            margin-bottom: 20px;
            max-height: 550px;
            overflow-x: hidden;
            overflow-y: auto;
          "
          row-key="id"
          ref="tableRef"
          class="table-expand"
        >
          <el-table-column prop="level" label="知识点等级" align="left" />
          <el-table-column prop="name" label="知识点名称" align="left">
            <template #default="scope">
              <div class="flex-box flex-alc">
                <!-- <span
                  class="cursor-pointer pr-10"
                  @click="toggleCollapse(scope.row)"
                >
                  <el-icon v-if="!scope.row.is_expand"><ArrowDown /></el-icon>
                  <el-icon v-else><ArrowUp /></el-icon>
                </span> -->
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                link
                @click="tbBtnHandle(scope.row, 'edit')"
              >
                编辑
              </el-button>
              <el-button
                type="primary"
                size="small"
                link
                @click="tbBtnHandle(scope.row, 'delete')"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <componentPage
        ref="componentRef"
        @refresh="getList({}, true)"
      ></componentPage>
    </template>
    <!-- <template #footer>
      <Page :page="page" @change="pageChangeHandle" />
    </template> -->
  </ContainerSidebar>
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
  watch,
} from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import usePage from '@/mixins/page'
import { clearJson } from '@/utils'
import { listConfig, formConfig } from './config'
import componentPage from './components/component.vue'
import { useI18n } from 'vue-i18n'
import Sidebar from './components/sidebar.vue'
import { deleteKnowledge, getKnowledgeList, getGrade } from '@/api/adminApi'

export default defineComponent({
  name: 'default',
  components: { componentPage, Sidebar },
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const i18n = useI18n()
    const currentLanguage = computed(() => i18n.locale.value)
    const componentRef = ref<InstanceType<typeof componentPage>>()
    const { page } = usePage()
    const tableRef = ref()
    const data = reactive({
      loading: false,
      visible: false,
      list: [],
      searchForm: {
        level: '' as any,
        grade_id: '' as any,
      },
      active: '',
      levelName: '全部知识点',
      gradeList: [],
      gradeName: '暂无年级',
    })
    watch(
      () => data.active,
      (val, oldVal) => {
        console.log(val, oldVal)
        if (val && val != oldVal) {
          if (data.gradeList.length > 0) {
            data.gradeName = (data.gradeList[0] as any).name
            data.searchForm.grade_id = (data.gradeList[0] as any).id
            data.levelName = '全部知识点'
            data.searchForm.level = ''
          }
          getList({}, true)
        }
      }
    )
    const listConfigData = ref(listConfig)
    const formConfigData = ref(formConfig)

    const getList = (val: Record<string, any>, flag: boolean) => {
      if (!flag) {
        data.searchForm = { ...data.searchForm, ...val }
      }
      let params = {
        ...data.searchForm,
        subject_id: data.active,
      }
      data.loading = true
      getKnowledgeList(params).then((r) => {
        if (r.code == 0) {
          data.list = r.data.list
          page.total = r.data.total
        }
        nextTick(() => {
          data.loading = false
        })
      })
    }

    const tbBtnHandle = (row: any, name: string) => {
      if (name == 'delete') {
        ElMessageBox.confirm(
          `确定删除“${row.name}”知识点? 子级也会一并删除！`,
          `提示`,
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            deleteKnowledge({ id: row.id.toString() }).then((r) => {
              if (r.code == 0) {
                ElMessage.success('删除成功')
                getList({}, true)
              }
            })
          })
          .catch(() => {})
      }
      if (name == 'edit' || name == 'add') {
        let params = row
        params.subject_id = data.active
        params.grade_id = data.searchForm.grade_id
        componentRef.value?.init(params, data.list)
      }
    }

    const pageChangeHandle = (argPage: { page: number; page_size: number }) => {
      page.page = argPage.page
      page.page_size = argPage.page_size
      getList({}, true)
    }
    onMounted(() => {
      getGrade({}).then((r) => {
        if (r.code == 0) {
          data.gradeList = r.data.list
        }
      })
    })
    const changeHandle = (val: any) => {
      if (val.row.id != data.active) {
        // getList({}, true)
        data.levelName = '全部知识点'
        data.searchForm.level = ''
        data.searchForm.grade_id = ''
        data.gradeName =
          data.gradeList.length > 0
            ? (data.gradeList[0] as any).name
            : '暂无年级'
      }
    }
    const levelHandle = (val: string | number) => {
      page.page = 1
      page.page_size = 10
      data.levelName =
        val == '1'
          ? '一级知识点'
          : val == '2'
          ? '二级知识点'
          : val == '3'
          ? '三级知识点'
          : '全部知识点'
      data.searchForm.level = val
      getList({}, true)
    }
    const gradeHandle = (val: string | number) => {
      data.searchForm.grade_id = val as any
      data.gradeName =
        val == ''
          ? '暂无年级'
          : (data.gradeList.find((item: any) => item.id == val) as any).name
      getList({}, true)
    }
    const toggleCollapse = (row: any) => {
      // 在这里实现折叠/展开逻辑
      console.log('Toggle collapse for:', row)
      tableRef.value.toggleRowExpansion(row)
    }
    return {
      page,
      pageChangeHandle,
      ...toRefs(data),
      getList,
      tbBtnHandle,
      clearJson,
      componentRef,
      listConfigData,
      formConfigData,
      changeHandle,
      levelHandle,
      gradeHandle,
      router,
      toggleCollapse,
      tableRef,
    }
  },
})
</script>

<style lang="scss" scoped>
/* 隐藏默认的展开按钮 */
:deep(.table-expand .el-table__expand-icon) {
  /* display: none !important; */
}
</style>
