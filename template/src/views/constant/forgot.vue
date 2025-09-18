<!--
 * @Description: 
 * @Autor: Jack Qi
 * @Email: qibiao0508@163.com
 * @Date: 2024-10-14 09:14:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-15 14:06:41
-->
<template>
  <div class="login-container">
    <div class="logo-section">
      <!-- <img src="@/assets/images/login-bg.jpg" alt="Logo" class="logo-title" /> -->
    </div>
    <div class="box-container">
      <div class="logo-title">
        <img
          src="@/assets/images/login-title.png"
          alt="Logo"
          class="logo-title"
        />
      </div>
      <el-card class="login-box">
        <div
          class="cursor-pointer"
          style="position: absolute; top: 20px; left: 20px"
          @click="toStep()"
          v-if="active !== 1"
        >
          <div class="flex-box flex-alc">
            <el-icon><ArrowLeft /></el-icon>
            <span>返回</span>
          </div>
        </div>
        <h2>忘记密码</h2>
        <el-steps
          class="mt-20 mb-20 width-full cuSteps"
          :active="active"
          align-center
        >
          <el-step title="验证手机号" />
          <el-step title="重置密码" />
        </el-steps>
        <div class="ml-30 mr-30 mt-30">
          <el-form
            ref="refForm"
            :model="form"
            :rules="rules"
            @keyup.enter="submit(2)"
            v-if="active === 1"
          >
            <el-form-item prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入您的手机号"
                clearable
              >
                <template #prefix>
                  <svg-icon name="Phone" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-input
                v-model="form.captcha"
                placeholder="请输入验证码"
                clearable
              >
                <template #prefix>
                  <svg-icon name="Edit_Box" />
                </template>
                <template #suffix>
                  <span
                    class="grayColor cursor-pointer"
                    @click="getVerificationCode"
                    v-if="countdown === 0"
                  >
                    获取验证码
                  </span>
                  <span v-else>{{ countdown }}秒后重试</span>
                </template>
              </el-input>
            </el-form-item>
            <el-button
              :loading="loading"
              class="login-button mb-20"
              type="primary"
              @click="submit(2)"
            >
              提交
            </el-button>
          </el-form>
          <el-form
            ref="refForm"
            :model="form"
            :rules="rules"
            @keyup.enter="submit(3)"
            v-if="active === 2"
          >
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                placeholder="请输入密码"
                :type="passwordType.password ? 'text' : 'password'"
              >
                <template #prefix>
                  <svg-icon name="Lock" />
                </template>
                <template #suffix>
                  <svg-icon
                    class="cursor-pointer"
                    name="Eye_Off"
                    v-show="passwordType.password"
                    @click="showPassword('password')"
                  />
                  <svg-icon
                    class="cursor-pointer"
                    name="Eye"
                    v-show="!passwordType.password"
                    @click="showPassword('password')"
                  />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password_affirm">
              <el-input
                v-model="form.password_affirm"
                placeholder="请再次输入密码"
                :type="passwordType.password_affirm ? 'text' : 'password'"
              >
                <template #prefix>
                  <svg-icon name="Lock" />
                </template>
                <template #suffix>
                  <svg-icon
                    class="cursor-pointer"
                    name="Eye_Off"
                    v-show="passwordType.password_affirm"
                    @click="showPassword('password_affirm')"
                  />
                  <svg-icon
                    class="cursor-pointer"
                    name="Eye"
                    v-show="!passwordType.password_affirm"
                    @click="showPassword('password_affirm')"
                  />
                </template>
              </el-input>
            </el-form-item>
            <el-button
              :loading="loading"
              class="login-button mb-20"
              type="primary"
              @click="submit(3)"
            >
              重置密码
            </el-button>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { forgotPasswordApi, sendCodeApi } from '@/api/login'

interface Form {
  password: string
  password_affirm: string
  phone: string
  captcha: string
  captcha_id: string
  type: any
}

export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useStore()
    const refForm = ref()
    const data = reactive<{
      loading: boolean
      form: Form
      active: number
      passwordType: {
        password: boolean
        password_affirm: boolean
      }
      countdown: number // 新增倒计时状态
    }>({
      loading: false,
      form: {
        password: '',
        password_affirm: '',
        phone: '',
        captcha: '',
        captcha_id: '',
        type: '',
      },
      active: 1,
      passwordType: {
        password: false,
        password_affirm: false,
      },
      countdown: 0, // 初始化倒计时为0
    })
    const submit = (step: number) => {
      refForm.value.validate((valid: boolean) => {
        if (valid) {
          data.form.type = router.currentRoute.value.query.type
          if (step === 2) {
            data.active = 2
          } else if (step === 3) {
            forgotPasswordApi(data.form).then((res) => {
              if (res.code == 0) {
                router.push({ name: 'login' })
                ElMessage.success('重置密码成功')
              }
            })
          }
        }
      })
    }
    const startCountdown = () => {
      data.countdown = 60 // 设置倒计时为60秒
      const timer = setInterval(() => {
        if (data.countdown > 0) {
          data.countdown--
        } else {
          clearInterval(timer)
        }
      }, 1000)
    }
    const getVerificationCode = () => {
      if (data.form.phone && /^1[3-9]\d{9}$/.test(data.form.phone)) {
        sendCodeApi({
          phone: data.form.phone,
        }).then((res) => {
          if (res.code == 0) {
            data.form.captcha_id = res.data.key
            startCountdown()
          }
        })
      } else {
        ElMessage.error('请输入正确的手机号')
      }
      if (data.form.phone) {
        if (data.countdown === 0) {
          // 确保倒计时未进行中
          data.countdown = 60 // 设置倒计时为60秒
          const timer = setInterval(() => {
            if (data.countdown > 0) {
              data.countdown--
            } else {
              clearInterval(timer)
            }
          }, 1000)
        }
      } else {
        ElMessage.error('请先输入手机号')
      }
    }
    const rules = reactive({
      phone: [
        {
          required: true,
          // 检验是否真实手机号
          validator: (rule: any, value: string, callback: any) => {
            if (!/^(1[3-9]\d{9})$/.test(value)) {
              callback(new Error('请输入正确的手机号'))
            } else {
              callback()
            }
          },
          trigger: ['blur', 'input', 'change'],
        },
      ],
      captcha: [
        {
          required: true,
          message: '请输入验证码',
          trigger: ['blur', 'input', 'change'],
        },
      ],
      password: [
        {
          required: true,
          message: '请输入密码',
          trigger: ['blur', 'input', 'change'],
        },
      ],
      password_affirm: [
        {
          required: true,
          // 校验两次密码是否一致
          validator: (rule: any, value: string, callback: any) => {
            if (value !== data.form.password) {
              callback(new Error('两次密码不一致'))
            } else {
              callback()
            }
          },
          trigger: ['blur', 'input', 'change'],
        },
      ],
    })
    const toStep = () => {
      if (data.active === 2) {
        data.active = 1
      } else {
        data.active = 2
      }
    }
    const showPassword = (type: 'password' | 'password_affirm') => {
      data.passwordType[type] = !data.passwordType[type]
    }
    return {
      refForm,
      getVerificationCode,
      ...toRefs(data),
      submit,
      toStep,
      showPassword,
      rules,
    }
  },
})
</script>

<style lang="scss" scoped>
.box-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.logo-title {
  width: 100px;
  height: 42px;
  margin: 0 auto 20px;
  img {
    width: 100%;
    height: 100%;
  }
}
.login-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px;
  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    .logo-title {
      width: 80%;
      margin-top: 20%;
      margin-right: 10%;
    }
    h1 {
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }
  }
  .login-box {
    width: 430px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    position: relative;
    h2 {
      text-align: center;
      margin-bottom: 30px;
      font-size: 24px;
      font-weight: bold;
    }
    .el-form-item {
      margin-bottom: 20px;
    }
    .login-button {
      width: 100%;
      margin-top: 10px;
      height: 40px;
      font-size: 16px;
    }
    .links {
      text-align: center;
      margin-top: 40px;
      a {
        color: #007bff;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  :deep(.el-input__wrapper) {
    font-size: 14px;
    gap: 6px;
    line-height: 24px;
    min-height: 40px;
    padding: 8px 16px;
  }
  :deep(
      .el-select--large .el-select__prefix,
      .el-select--large .el-select__suffix
    ) {
    color: #000;
  }
}
</style>
