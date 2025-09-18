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
      :label="$t('modules/personal/edit-password.originalPassword')"
      prop="oldPassword"
    >
      <el-input
        v-model="form.oldPassword"
        :placeholder="$t('modules/personal/edit-password.originalPassword')"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item
      :label="$t('modules/personal/edit-password.newPassword')"
      prop="password"
    >
      <el-input
        v-model="form.password"
        :placeholder="$t('modules/personal/edit-password.newPasswordError')"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item
      :label="$t('modules/personal/edit-password.confirmPassword')"
      prop="confirmPassword"
    >
      <el-input
        v-model="form.confirmPassword"
        :placeholder="$t('modules/personal/edit-password.newPasswordError')"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button v-repeat type="primary" @click="submit()">
        {{ $t('modules/public.submit') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { editPasswordApi } from '@/api/administrator'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    const refForm = ref<InstanceType<typeof ElForm>>()
    const data = reactive({
      form: {
        oldPassword: '',
        password: '',
        confirmPassword: '',
      },
    })
    const store = useStore()
    const router = useRouter()
    const { t } = useI18n()
    const rules = computed(() => {
      const checkConfirmPassword = (
        _rule: any,
        value: string,
        callback: Function
      ) => {
        if (data.form.password && data.form.password !== value) {
          callback(
            new Error(t('modules/personal/edit-password.confirmPasswordError'))
          )
        } else {
          callback()
        }
      }
      return {
        oldPassword: [
          {
            required: true,
            message: t('modules/personal/edit-password.originalPasswordError'),
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: t('modules/personal/edit-password.newPasswordError'),
            trigger: 'blur',
          },
        ],
        confirmPassword: [
          { required: true, validator: checkConfirmPassword, trigger: 'blur' },
        ],
      }
    })

    const submit = () => {
      refForm.value?.validate((valid: boolean) => {
        if (valid) {
          const params = {
            oldPassword: data.form.oldPassword,
            password: data.form.password,
          }
          editPasswordApi(params).then((r: any) => {
            if (r.success) {
              ElMessage({
                message: r.msg,
                type: 'success',
              })
              setTimeout(() => {
                store.dispatch('logout')
                router.push({ name: 'login' })
              }, 1000)
            }
          })
        }
      })
    }

    return {
      refForm,
      ...toRefs(data),
      rules,
      submit,
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
