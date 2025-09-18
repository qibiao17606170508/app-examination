<template>
  <el-dialog
    width="600px"
    :title="form.id ? $t('modules/public.edit') : $t('modules/public.add')"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
    destroy-on-close
  >
    <el-form
      v-loading="loading"
      :model="form"
      :rules="rules"
      ref="refForm"
      @keyup.enter="submit()"
      label-position="top"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            :label="$t('modules/system/administrator.avatar')"
            prop="avatar"
          >
            <ImageUploadSingle v-model="form.avatar" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item
            :label="$t('modules/system/administrator.name')"
            prop="name"
          >
            <el-input
              v-model="form.name"
              :placeholder="$t('modules/system/administrator.name')"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item
            :label="$t('modules/system/administrator.name')"
            prop="username"
          >
            <el-input
              v-model="form.username"
              :placeholder="$t('modules/system/administrator.name')"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('modules/system/administrator.telphone')"
            prop="phone"
          >
            <el-input
              v-model="form.phone"
              :placeholder="$t('modules/system/administrator.telphone')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('modules/system/administrator.password')"
            :prop="!form.id ? 'password' : ''"
          >
            <el-input
              v-model="form.password"
              type="password"
              :placeholder="$t('modules/system/administrator.password')"
              maxlength="20"
              show-password
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('modules/system/administrator.passwordSecond')"
            :prop="!form.id ? 'confirmPassword' : ''"
          >
            <el-input
              v-model="form.confirmPassword"
              :placeholder="$t('modules/system/administrator.passwordSecond')"
              show-password
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            :label="$t('modules/system/administrator.userRole')"
            prop="role_id"
          >
            <el-select v-model="form.role_id">
              <el-option
                :value="item.id"
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            :label="$t('modules/system/administrator.remark')"
            prop="remarks"
          >
            <el-input
              v-model="form.remarks"
              type="textarea"
              :placeholder="$t('modules/system/administrator.remark')"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <Collapse :inactive-text="$t('modules/system/administrator.open')">
        <template #default>
          
        </template>
      </Collapse> -->
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
  onMounted,
  reactive,
  ref,
  toRefs,
} from 'vue'

import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import Collapse from '@/components/collapse/index.vue'
// import ImageUploadSingle from '@/components/image-upload-single/index.vue'

import useDictionary from '@/mixins/dictionary'
import { isUsername, isPassword, isEmail, isMobile } from '@/utils/regular'

import { selectListApi as roleSelectApi } from '@/api/role'
import { getUserInfoApi, addApi, editApi } from '@/api/administrator'
import { QINIU_IMAGE_SERVER } from '@/utils/constant'
export default defineComponent({
  emits: ['refresh'],
  components: { Collapse },
  setup(_props, { emit }) {
    const { dictionaryList, getDictionary } = useDictionary()
    const refForm = ref()
    const refCascader = ref()
    const { t } = useI18n()
    const data = reactive({
      loading: false,
      visible: false,
      departments: [],
      form: {
        id: null,
        username: '',
        password: '',
        confirmPassword: '',
        avatar: '',
        phone: '',
        role_id: '',
      },
      roles: [],
      menus: [],
    })
    const rules = computed(() => {
      const checkUsername = (_rule, value, callback) => {
        if (!isUsername(value)) {
          callback(new Error(t('modules/system/administrator.userNameErr')))
        } else {
          callback()
        }
      }
      const checkPassword = (_rule, value, callback) => {
        if (data.form.id && !isPassword(value)) {
          callback(new Error(t('modules/system/administrator.userNameErr')))
        } else if (!data.form.id && !isPassword(value)) {
          callback(new Error(t('modules/system/administrator.userNameErr')))
        } else {
          callback()
        }
      }
      const checkConfirmPassword = (_rule, value, callback) => {
        if (data.form.password && data.form.password !== value) {
          callback(new Error(t('modules/system/administrator.psdNotSame')))
        } else {
          callback()
        }
      }
      const checkMobile = (_rule, value, callback) => {
        if (data.form.mobile !== '' && !isMobile(value)) {
          callback(new Error(t('modules/system/administrator.phoneErr')))
        } else {
          callback()
        }
      }
      const checkEmail = (_rule, value, callback) => {
        if (data.form.email !== '' && !isEmail(value)) {
          callback(new Error(t('modules/system/administrator.emailErr')))
        } else {
          callback()
        }
      }
      return {
        email: [{ required: true, validator: checkEmail, trigger: 'blur' }],
        number: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        name: [
          {
            required: true,
            message: t('modules/system/administrator.nameErr'),
            trigger: 'blur',
          },
        ],
        phone: [
          {
            required: true,
            message: t('modules/system/administrator.phoneErr'),
            trigger: 'blur',
          },
          { validator: checkMobile, trigger: 'blur' },
        ],
        username: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          },
          // { validator: checkUsername, trigger: 'blur' }
        ],
        password: [
          {
            required: !data.form.id,
            message: t('modules/system/administrator.psdErr'),
            trigger: 'blur',
          },
          // { validator: checkPassword, trigger: 'blur' }
        ],
        confirmPassword: [
          {
            required: !data.form.id,
            message: t('modules/system/administrator.psd2Err'),
            trigger: 'blur',
          },
          { validator: checkConfirmPassword, trigger: 'blur' },
        ],
        // phone: [{ validator: checkMobile, trigger: 'blur' }],
        role_id: [
          {
            required: true,
            message: t('modules/system/administrator.pleaseSelectRole'),
            trigger: 'blur',
          },
        ],
      }
    })

    const cascaderProps = computed(() => {
      const reuslt = {
        checkStrictly: true,
        value: 'id',
        label: `name`,
        children: 'children',
      }
      return reuslt
    })

    const authorityProps = computed(() => {
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

    const getRole = async () => {
      const r = await roleSelectApi()
      if (r.status == 'success') {
        data.roles = r.data.data
      }
    }

    const init = async (id) => {
      data.visible = true
      data.loading = true
      data.form.id = id
      await getRole()
      if (id) {
        const r = await getUserInfoApi({ id: id })
        if (r.status == 'success') {
          data.form = r.data
          data.form.password = ''
          data.form.confirmPassword = ''
          // data.form.role_id = r.data.empRoles.map((item) => item.role_id)
        }
      } else {
        data.form.password = ''
        data.form.confirmPassword = ''
      }

      nextTick(() => {
        data.loading = false
      })
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
            id: data.form.id,
            avatar: data.form.avatar,
            phone: data.form.phone,
            password: data.form.password,
            username: data.form.username,
            role_id: data.form.role_id,
            remarks: data.form.remarks,
          }
          if (!data.form.password) {
            delete params.password
          }
          const r = data.form.id ? await editApi(params) : await addApi(params)
          if (r.status == 'success') {
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

    onBeforeMount(() => {
      // getDictionary('dataPermission')
    })

    /**
     * @description: 弹窗关闭动画结束时的回调
     * @param {*}
     * @return {*}
     * @author: qibiao
     */
    const dialogClosedHandle = () => {
      refForm.value.resetFields()
    }

    return {
      refForm,
      refCascader,
      dictionaryList,
      ...toRefs(data),
      rules,
      cascaderProps,
      init,
      submit,
      dialogClosedHandle,
      authorityProps,
      QINIU_IMAGE_SERVER,
    }
  },
})
</script>
