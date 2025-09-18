<template>
  <el-dialog
    width="450px"
    :title="form.id ? $t('modules/public.edit') : $t('modules/public.add')"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
  >
    <el-form
      v-loading="loading"
      :model="form"
      :rules="rules"
      ref="refForm"
      @keyup.enter="submit()"
      label-position="top"
    >
      <el-form-item :label="$t('modules/system/role.roleName')" prop="name">
        <el-input
          v-model="form.name"
          :placeholder="$t('modules/system/role.roleName')"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="$t('modules/system/role.authority')" prop="menu_id">
        <el-cascader
          :placeholder="$t('modules/public.pleaseSelect')"
          class="width-full"
          ref="refCascader"
          v-model="form.menu_id"
          :options="menus"
          :props="permissionCascaderProps"
          :show-all-levels="false"
          collapse-tags
          collapse-tags-tooltip
          clearable
          @change="changeHandle"
          v-if="flag"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-repeat @click="visible = false">
          {{ $t('modules/public.cancel') }}
        </el-button>
        <el-button v-repeat type="primary" @click="submit()">
          {{ $t('modules/public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeMount,
  reactive,
  ref,
  toRefs,
} from 'vue'
import { ElMessage } from 'element-plus'
import useDictionary from '@/mixins/dictionary'
import { selectListApi } from '@/api/enterprise-menu'
import { infoApi, addApi, editApi } from '@/api/role'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default defineComponent({
  emits: ['refresh'],
  setup(_props, { emit }) {
    const refForm = ref()
    const refCascader = ref()
    const refPermissionCascader = ref()
    const { t } = useI18n()
    const { dictionaryList, getDictionary } = useDictionary()
    const store = useStore()

    const data = reactive({
      loading: false,
      visible: false,
      departments: [],
      form: {
        id: null,
        name: '',
        permission: '',
        menu_id: [],
        is_type: 1,
      },
      menus: [],
      flag: '',
    })

    const rules = reactive(
      (function () {
        const checkCustom = (_rule, value, callback) => {
          if (data.form.permission === 4 && value.length < 1) {
            callback(new Error('请选择自定义数据权限'))
          } else {
            callback()
          }
        }
        return {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
          ],
          // custom: [{ validator: checkCustom, trigger: 'change' }],
          menu_id: [
            {
              type: 'array',
              required: true,
              message: '请选择权限',
              trigger: 'blur',
            },
          ],
        }
      })()
    )

    const cascaderProps = computed(() => {
      const reuslt = {
        multiple: true,
        emitPath: false,
        checkStrictly: false,
        value: 'id',
        label: `nameCn`,
        children: 'children',
      }
      return reuslt
    })
    const permissionCascaderProps = computed(() => {
      const reuslt = {
        multiple: true,
        checkStrictly: true,
        value: 'id',
        label: `nameCn`,
        children: 'children',
      }
      return reuslt
    })

    const getEnterpriseMenu = async () => {
      const r = await selectListApi({ is_type: data.form.is_type })
      let result = r
      r.data = result.data
      if (r) {
        data.menus = r.data
        setTimeout(() => {
          data.flag = true
        }, 500)
      }
    }

    const init = async (id, is_type) => {
      data.visible = true
      data.loading = true
      data.form.id = id
      if (id) {
        const result = await infoApi({ id: id, is_type: is_type })
        var r = result
        r.data = result.data
        if (r) {
          data.form = JSON.parse(JSON.stringify(r.data))
          data.form.menu_id = r.data.menu_id
            ? r.data.menu_id.split(',').map((item) => +item)
            : []
        }
        await getEnterpriseMenu()
        nextTick(() => {
          data.loading = false
        })
      } else {
        data.form = {
          is_type: 1,
        }
        await getEnterpriseMenu()
        nextTick(() => {
          data.loading = false
        })
      }
    }

    /**
     * @description: 表单验证提交
     * @param {*}
     * @return {*}
     * @author: qibiao
     */
    const submit = () => {
      refForm.value.validate(async (valid) => {
        if (valid) {
          const params = {
            menu_id: data.form.menu_id,
            name: data.form.name,
            id: data.form.id,
            is_type: data.form.is_type,
          }
          // 处理已选 菜单 权限
          const checkedNodes = refCascader.value.getCheckedNodes(false, true)
          const enterpriseMenuIds = []
          checkedNodes.forEach((item) => {
            if (item.value !== -1) {
              enterpriseMenuIds.push(item.value)
            }
            // enterpriseMenuIds.push.apply(enterpriseMenuIds, item.pathValues)
          })
          params.menu_id = Array.from(new Set(enterpriseMenuIds)).filter(
            (item) => item !== 0
          )
          params.menu_id = params.menu_id.join(',')
          const r = data.form.id ? await editApi(params) : await addApi(params)
          if (r) {
            data.visible = false
            ElMessage({
              message: t('modules/public.operationSucceeded'),
              type: 'success',
            })
            emit('refresh')
          }
        }
      })
    }
    const changeHandle = (value) => {
      // data.form.menu_id = value
    }
    onBeforeMount(() => {
      getDictionary('dataPermission')
    })

    /**
     * @description: 弹窗关闭动画结束时的回调
     * @param {*}
     * @return {*}
     * @author: qibiao
     */
    const dialogClosedHandle = () => {
      refForm.value.resetFields()
      emit('close')
    }

    return {
      refForm,
      refCascader,
      refPermissionCascader,
      dictionaryList,
      ...toRefs(data),
      rules,
      cascaderProps,
      permissionCascaderProps,
      init,
      submit,
      dialogClosedHandle,
      getEnterpriseMenu,
      changeHandle,
    }
  },
})
</script>
