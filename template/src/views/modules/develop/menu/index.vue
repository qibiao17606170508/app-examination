<template>
  <ContainerSidebar ref="refContainerSidebar" :scroll="false">
    <template #sidebar>
      <Sidebar v-model="active" @change="changeHandle" />
    </template>
    <template #default>
      <div class="name-box margin_b-20 font-size-20">
        {{ form.nameCn }}&nbsp;
      </div>
      <el-row v-show="active">
        <el-col :xs="24" :sm="24" :md="16" :lg="14" :xl="10">
          <el-form
            v-loading="loading"
            :model="form"
            :rules="rules"
            ref="refForm"
            @keyup.enter="submit()"
            label-position="top"
          >
            <el-form-item
              :label="$t('modules/develop.chineseName')"
              prop="nameCn"
            >
              <el-input
                v-model="form.nameCn"
                :placeholder="$t('modules/develop.chineseName')"
                maxlength="20"
                show-word-limit
                :readonly="!havePermission('\menu:create|menu:update', '|')"
              />
            </el-form-item>
            <!-- <el-form-item
              :label="$t('modules/develop.englishName')"
              prop="nameEn"
            >
              <el-input
                v-model="form.nameEn"
                :placeholder="$t('modules/develop.englishName')"
                maxlength="30"
                show-word-limit
                :readonly="!havePermission('menu:create|menu:update', '|')"
              />
            </el-form-item> -->
            <el-form-item :label="$t('modules/develop.type')" prop="type">
              <el-radio-group
                v-model="form.type"
                :disabled="!havePermission('menu:create|menu:update', '|')"
                @change="clearRouterParams"
              >
                <el-radio-button
                  :label="item.value"
                  :disabled="buttonHandle(item.value)"
                  v-for="item in dictionaryList"
                  :key="item.value"
                >
                  {{ currentLanguage == 'en' ? item.labelEn : item.labelCn }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="$t('modules/develop.path')"
              prop="url"
              v-if="form.type !== 0 && form.type !== 2"
            >
              <el-input
                v-model="form.url"
                :placeholder="$t('modules/develop.router')"
                :readonly="!havePermission('menu:create|menu:update', '|')"
              />
            </el-form-item>
            <el-form-item
              :label="$t('modules/develop.routerLabel')"
              prop="path"
              v-if="form.type == 1"
            >
              <el-input
                v-model="form.path"
                :placeholder="$t('modules/develop.routerPlaceholder')"
                :readonly="!havePermission('menu:create|menu:update', '|')"
              />
            </el-form-item>
            <el-form-item
              :label="$t('modules/develop.routerName')"
              prop="name"
              v-if="form.type == 1"
            >
              <el-input
                v-model="form.name"
                :placeholder="$t('modules/develop.routerNamePlaceholder')"
                :readonly="!havePermission('menu:create|menu:update', '|')"
              />
            </el-form-item>
            <el-form-item
              :label="$t('modules/develop.authorizationMark')"
              prop="permission"
              v-if="form.type == 1 || form.type == 2"
            >
              <el-input
                v-model="form.permission"
                :placeholder="$t('modules/develop.authorizationMark')"
                :readonly="!havePermission('menu:create|menu:update', '|')"
              />
            </el-form-item>
            <el-form-item
              :label="$t('modules/develop.icon')"
              prop="icon"
              v-if="form.type !== 2"
            >
              <IconSelectInput
                v-model="form.icon"
                :readonly="!havePermission('menu:create|menu:update', '|')"
              />
            </el-form-item>
            <el-form-item :label="$t('modules/develop.sort')" prop="sort">
              <el-input-number
                v-model="form.sort"
                :min="1"
                controls-position="right"
                :disabled="!havePermission('menu:create|menu:update', '|')"
              />
            </el-form-item>
            <template v-if="form.type === 1 || form.type === 3">
              <el-form-item
                :label="$t('modules/develop.menuBarDisplay')"
                prop="is_show"
              >
                <el-radio-group
                  v-model="form.is_show"
                  :disabled="!havePermission('menu:create|menu:update', '|')"
                >
                  <el-radio :label="0">{{ $t('modules/develop.no') }}</el-radio>
                  <el-radio :label="1">
                    {{ $t('modules/develop.yes') }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('modules/develop.tabShow')" prop="tab">
                <el-radio-group
                  v-model="form.tab"
                  :disabled="!havePermission('menu:create|menu:update', '|')"
                >
                  <el-radio :label="0">{{ $t('modules/develop.no') }}</el-radio>
                  <el-radio :label="1">
                    {{ $t('modules/develop.yes') }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="form.type === 1">
                <el-form-item
                  :label="$t('modules/develop.labelMultipleOpening')"
                  prop="multiple"
                >
                  <el-radio-group
                    v-model="form.multiple"
                    :disabled="!havePermission('menu:create|menu:update', '|')"
                  >
                    <el-radio :label="0">
                      {{ $t('modules/develop.no') }}
                    </el-radio>
                    <el-radio :label="1">
                      {{ $t('modules/develop.yes') }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  :label="$t('modules/develop.whetherCacheIsSupported')"
                  prop="keepalive"
                >
                  <el-radio-group
                    v-model="form.keepalive"
                    :disabled="!havePermission('menu:create|menu:update', '|')"
                  >
                    <el-radio :label="0">
                      {{ $t('modules/develop.no') }}
                    </el-radio>
                    <el-radio :label="1">
                      {{ $t('modules/develop.yes') }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
            </template>
            <el-form-item>
              <el-button
                v-repeat
                v-permission="'menu:update'"
                type="primary"
                @click="submit"
              >
                {{ $t('modules/public.submit') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </template>
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
  Ref,
} from 'vue'

import { ElMessage } from 'element-plus'
import ContainerSidebar from '@/components/container-sidebar/index.vue'
import Sidebar from './components/sidebar.vue'
import IconSelectInput from '@/components/icon-select-input/index.vue'

import useDictionary from '@/mixins/dictionary'
import { havePermission } from '@/utils'
import { VIRTUAL_ID_KEY } from './index'
import { useI18n } from 'vue-i18n'
import { infoApi, addApi, editApi } from '@/api/menu'

interface Form {
  id: number | null
  nameCn: string
  nameEn: string
  path: string
  name: string
  url: string
  permission: string
  type: number | string
  icon: string
  is_show: number
  tab: number
  multiple: number
  keepalive: number
  sort: number
  parentId: string
}

export default defineComponent({
  name: 'develop-menu',
  components: { ContainerSidebar, Sidebar, IconSelectInput },
  setup() {
    const refContainerSidebar = ref<InstanceType<typeof ContainerSidebar>>()
    const refForm = ref<InstanceType<typeof HTMLFormElement>>()
    const { t } = useI18n()
    const i18n = useI18n()
    const currentLanguage = computed(() => i18n.locale.value)
    const { dictionaryList, getDictionary } = useDictionary()
    const data = reactive({
      active: '',
      loading: false,
      form: {
        id: null,
        nameCn: '',
        nameEn: '',
        path: '',
        name: '',
        url: '',
        permission: '',
        type: '',
        icon: '',
        is_show: 1,
        tab: 1,
        multiple: 0,
        keepalive: 0,
        sort: 1,
        parentId: '',
      } as Form,
      row: null as any, // todo: 引用传递 用于编辑之后修改 列表数据
      parentType: 0, // 父级的类型
    })

    const checkUrl = (_rule: any, value: string, callback: Function) => {
      const types = [1, 3, 4]
      if (types.includes(data.form.type as number) && !value) {
        callback(new Error(t('modules/develop.routerError')))
      } else {
        callback()
      }
    }

    const checkPermission = (_rule: any, value: string, callback: Function) => {
      const types = [2]
      if (types.includes(data.form.type as number) && !value) {
        callback(new Error(t('modules/develop.authorizationMarkError')))
      } else {
        callback()
      }
    }
    const rules = reactive({
      nameCn: [
        {
          required: true,
          message: t('modules/develop.pleaseEnterAChineseName'),
          trigger: 'blur',
        },
      ],
      nameEn: [
        {
          required: true,
          message: t('modules/develop.pleaseEnterAEnglishName'),
          trigger: 'blur',
        },
      ],
      url: [
        {
          required: false,
          message: t('modules/develop.pleaseEnterRoutingPathError'),
          trigger: 'blur',
        },
        { validator: checkUrl, trigger: 'blur' },
      ],
      permission: [
        {
          required: false,
          message: t('modules/develop.authorizationMarkError'),
          trigger: 'blur',
        },
        { validator: checkPermission, trigger: 'blur' },
      ],
    })

    const getInfo = async () => {
      data.loading = true
      const result = await infoApi({ id: data.form.id })
      let r = result
      r.data = result.data
      if (r) {
        data.form = r.data
      }
      nextTick(() => {
        data.loading = false
      })
    }

    const clearFrom = () => {
      data.form.id = null
      data.form.nameCn = ''
      data.form.nameEn = ''
      data.form.path = ''
      data.form.name = ''
      data.form.url = ''
      data.form.permission = ''
      data.form.icon = ''
    }

    const clearRouterParams = () => {
      data.form.is_show = 1
      data.form.tab = 1
      data.form.multiple = 0
      data.form.keepalive = 0
    }

    const changeHandle = ({
      row,
      parentType,
    }: {
      row: any
      parentType: number
    }) => {
      refContainerSidebar.value?.setScrollTop()
      data.row = row
      data.parentType = parentType
      if ((row.id + '').includes(VIRTUAL_ID_KEY)) {
        clearFrom()
        data.form.nameCn = row.nameCn
        data.form.nameEn = row.nameEn
        data.form.parentId = row.parentId
        data.form.type = row.type
        data.form.tab = 0
        data.form.sort = 1
      } else {
        data.form.id = row.id
        getInfo()
      }
    }

    const buttonHandle = (val: number) => {
      let result = false
      return result
    }

    const submit = () => {
      refForm.value?.validate(async (valid: boolean) => {
        if (valid) {
          const r = data.form.id
            ? await editApi(data.form)
            : await addApi(data.form)
          if (r) {
            ElMessage({
              message: t('modules/public.operationSucceeded'),
              type: 'success',
            })
            if (r.data) {
              data.row.id = r.data
              data.form.id = r.data
            }
            data.row.nameCn = data.form.nameCn
            data.row.nameEn = data.form.nameEn
            data.row.type = data.form.type
          }
        }
      })
    }

    onMounted(() => {
      getDictionary('menu')
    })

    return {
      refContainerSidebar,
      refForm,
      dictionaryList,
      ...toRefs(data),
      rules,
      clearRouterParams,
      changeHandle,
      buttonHandle,
      submit,
      havePermission,
      currentLanguage,
    }
  },
})
</script>

<style lang="scss" scoped>
.name-box {
  font-weight: bold;
}
</style>
