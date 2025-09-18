<template>
  <el-form
    class="basic-info-container"
    :model="form"
    :rules="rules"
    ref="refForm"
    @keyup.enter="submit()"
    label-position="top"
  >
    <el-form-item
      :label="$t('modules/personal/basic-info.headPortrait')"
      prop="portrait"
    >
      <ImageUploadSingle
        v-model="form.portrait"
        :disabled="!havePermission('administrator:basic')"
      />
    </el-form-item>
    <el-form-item
      :label="$t('modules/personal/basic-info.nickname')"
      prop="name"
    >
      <el-input
        v-model="form.name"
        :placeholder="$t('modules/personal/basic-info.nickname')"
        maxlength="20"
        show-word-limit
        :disabled="!havePermission('administrator:basic')"
      />
    </el-form-item>
    <el-form-item :label="$t('modules/public.phone')" prop="phone">
      <el-input
        v-model="form.phone"
        :placeholder="$t('modules/public.phone')"
        :disabled="!havePermission('administrator:basic')"
      />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input
        v-model="form.email"
        placeholder="邮箱"
        :disabled="!havePermission('administrator:basic')"
      />
    </el-form-item>
    <el-form-item v-if="havePermission('administrator:basic')">
      <el-button v-repeat type="primary" @click="submit()">
        {{ $t('modules/public.submit') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  reactive,
  ref,
  toRefs,
} from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
// import ImageUploadSingle from '@/components/image-upload-single/index.vue'

import { isEmail, isMobile } from '@/utils/regular'
import { havePermission } from '@/utils'
import { QINIU_IMAGE_SERVER } from '@/utils/constant'
import { editBasicApi } from '@/api/administrator'

interface Administrator {
  portrait: string
  sex: number
  name?: string
  phone?: string
  email?: string
}

export default defineComponent({
  // components: { ImageUploadSingle },
  props: {
    administrator: {
      type: Object as () => Administrator,
      required: true,
    },
  },
  setup(props) {
    const store = useStore()
    const { t } = useI18n()
    const refForm = ref()
    const data = reactive({
      form: {
        portrait: '',
        sex: 0,
        name: '',
        phone: '',
        email: '',
      },
    })
    const rules = computed(() => {
      const checkMobile = (_rule: any, value: string, callback: Function) => {
        if (data.form.phone !== '' && !isMobile(value)) {
          callback(new Error(t('modules/personal/basic-info.phoneError')))
        } else {
          callback()
        }
      }
      const checkEmail = (_rule: any, value: string, callback: Function) => {
        if (data.form.email !== '' && !isEmail(value)) {
          callback(new Error(t('modules/personal/basic-info.emailError')))
        } else {
          callback()
        }
      }
      return {
        name: [
          {
            required: true,
            message: t('modules/personal/basic-info.AccountError'),
            trigger: 'blur',
          },
        ],
        phone: [{ required: true, validator: checkMobile, trigger: 'blur' }],
        email: [{ required: true, validator: checkEmail, trigger: 'blur' }],
        portrait: [{ required: true, message: '请选择头像', trigger: 'blur' }],
      }
    })

    const submit = () => {
      refForm.value?.validate((valid: boolean) => {
        if (valid) {
          editBasicApi(data.form).then((r) => {
            if (r) {
              store.dispatch('menu/getAdministrator')
              ElMessage({
                message: t('modules/public.operationSucceeded'),
                type: 'success',
              })
            }
          })
        }
      })
    }

    onBeforeMount(() => {
      data.form = props.administrator as any
      data.form.portrait =
        data.form.portrait && data.form.portrait.indexOf('http') === -1
          ? QINIU_IMAGE_SERVER + data.form.portrait
          : data.form.portrait
    })

    return {
      refForm,
      ...toRefs(data),
      rules,
      submit,
      havePermission,
      QINIU_IMAGE_SERVER,
    }
  },
})
</script>

<style lang="scss" scoped>
.basic-info-container {
  min-width: 350px;
  max-width: 500px;
}
</style>
