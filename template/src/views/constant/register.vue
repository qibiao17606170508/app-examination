<!--
 * @Description: 
 * @Autor: Jack Qi
 * @Email: qibiao0508@163.com
 * @Date: 2024-10-14 09:14:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-28 15:34:45
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
        <div
          class="cursor-pointer"
          style="position: absolute; top: 20px; left: 20px"
          @click="goLogin()"
          v-else
        >
          <div class="flex-box flex-alc">
            <el-icon><ArrowLeft /></el-icon>
            <span>去登录</span>
          </div>
        </div>
        <h2>注册系统</h2>
        <el-steps
          class="mt-20 mb-20 width-full cuSteps"
          :active="active"
          align-center
        >
          <el-step title="账户信息" />
          <el-step title="基本信息" />
          <el-step title="身份验证" />
        </el-steps>
        <div class="ml-30 mr-30 mt-30">
          <el-form
            ref="refForm"
            :model="form"
            :rules="rules"
            @keyup.enter="submit(2)"
            v-if="active === 1"
          >
            <el-form-item prop="username">
              <el-input
                v-model="form.username"
                placeholder="请输入用户名5-16位字母或数字"
                clearable
              >
                <template #prefix>
                  <!-- <Iconfont name="user" /> -->
                  <svg-icon name="User_Empty" />
                </template>
              </el-input>
            </el-form-item>
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
                :type="passwordType.confirmPassword ? 'text' : 'password'"
              >
                <template #prefix>
                  <svg-icon name="Lock" />
                </template>
                <template #suffix>
                  <svg-icon
                    class="cursor-pointer"
                    name="Eye_Off"
                    v-show="passwordType.confirmPassword"
                    @click="showPassword('confirmPassword')"
                  />
                  <svg-icon
                    class="cursor-pointer"
                    name="Eye"
                    v-show="!passwordType.confirmPassword"
                    @click="showPassword('confirmPassword')"
                  />
                </template>
              </el-input>
            </el-form-item>
            <el-button
              :loading="loading"
              class="login-button mb-20"
              type="primary"
              @click="submit(2)"
            >
              下一步
            </el-button>
          </el-form>
          <el-form
            ref="refForm"
            :model="form"
            :rules="rules"
            @keyup.enter="submit(3)"
            v-if="active === 2"
          >
            <el-form-item prop="nickname">
              <el-input
                v-model="form.nickname"
                placeholder="请输入您的姓名"
                clearable
                class="input-box"
              >
                <template #prefix>
                  <svg-icon name="User_Circle_SVG"></svg-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="student_number" v-if="form.type == 'student'">
              <el-input
                v-model="form.student_number"
                placeholder="请输入学号"
                clearable
              >
                <template #prefix>
                  <!-- <Iconfont name="user" /> -->
                  <svg-icon name="User_Card_ID" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="sex" v-if="form.type == 'student'">
              <el-select
                class="select-box"
                v-model="form.sex"
                placeholder="请选择性别"
              >
                <template #prefix>
                  <!-- <Iconfont name="user" /> -->
                  <svg-icon name="User_Circle" />
                </template>
                <el-option label="未知" :value="0"></el-option>
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="school_id">
              <select-school
                v-model="form.school_id"
                placeholder="请选择您的学校"
                class="select-box"
              >
                <template #prefix>
                  <svg-icon name="Home" />
                </template>
              </select-school>
            </el-form-item>
            <el-form-item
              prop="subject_id"
              v-if="form.school_id && form.type != 'student'"
            >
              <select-subject
                v-model="form.subject_id"
                placeholder="请选择您的学科"
                class="select-box"
                :school-id="form.school_id"
              >
                <template #prefix>
                  <svg-icon name="Notebook" />
                </template>
              </select-subject>
            </el-form-item>
            <el-form-item
              prop="class_id"
              v-if="form.school_id && form.type == 'student'"
            >
              <select-class
                v-model="form.class_id"
                placeholder="请选择您的班级"
                class="select-box"
                :school-id="form.school_id"
              >
                <template #prefix>
                  <svg-icon name="Notebook" />
                </template>
              </select-class>
            </el-form-item>
            <el-button
              :loading="loading"
              class="login-button mb-20"
              type="primary"
              @click="submit(3)"
            >
              下一步
            </el-button>
          </el-form>
          <el-form
            ref="refForm"
            :model="form"
            :rules="rules"
            @keyup.enter="submit(4)"
            v-if="active === 3"
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
                    :disabled="countdown > 0"
                  >
                    {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
                  </span>
                </template>
              </el-input>
            </el-form-item>
            <el-button
              :loading="loading"
              class="login-button mb-20"
              type="primary"
              @click="submit(4)"
            >
              完成注册
            </el-button>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
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
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { registerApi, sendCodeApi } from '@/api/login'
import { ElMessage } from 'element-plus'

interface Form {
  username: string
  password: string
  password_affirm: string
  name: string
  school: string
  department: string
  phone: string
  verificationCode: string
  captcha: string
  captcha_id: string
  type: any
  sex: number
  student_number: string
}

export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useStore()
    const { t } = useI18n()
    const refForm = ref()
    const data = reactive<{
      loading: boolean
      captcha: string
      form: Form
      phoneFlag: boolean
      active: number
      passwordType: {
        password: boolean
        confirmPassword: boolean
      }
    }>({
      loading: false,
      captcha: '',
      form: {
        username: '',
        password: '',
        password_affirm: '',
        name: '',
        school: '',
        department: '',
        phone: '',
        verificationCode: '',
        captcha_id: '',
        captcha: '',
        type: router.currentRoute.value.query.type,
        sex: 0,
        student_number: '',
      },
      phoneFlag: false,
      active: 1,
      passwordType: {
        password: false,
        confirmPassword: false,
      },
    })
    const rules = computed(() => {
      const checkConfirmPassword = (_rule: any, value: any, callback: any) => {
        if (data.form.password && data.form.password !== value) {
          callback(new Error('密码不一致'))
        } else {
          callback()
        }
      }
      return {
        username: [
          {
            required: true,
            // 5-64位 必须是字母和数字组合
            validator: (rule: any, value: any, callback: any) => {
              if (!value) {
                callback(new Error('请输入5-16位字母和数字组合'))
              } else if (
                !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,16}$/.test(value)
              ) {
                callback(new Error('请输入5-16位字母和数字组合'))
              } else {
                callback()
              }
            },
            trigger: ['blur', 'input', 'change'],
          },
        ],
        password: [
          {
            required: true,
            //  5-24位 不校验数字和字母组合
            validator: (rule: any, value: any, callback: any) => {
              if (!value) {
                callback(new Error('请输入密码'))
              } else if (value.length < 5 || value.length > 24) {
                callback(new Error('请输入5-24位密码'))
              } else {
                callback()
              }
            },
            trigger: ['blur', 'input', 'change'],
          },
        ],
        password_affirm: [
          {
            required: true,
            validator: checkConfirmPassword,
            trigger: ['blur', 'input', 'change'],
          },
        ],
        nickname: [
          {
            required: true,
            message: '请输入姓名',
            trigger: ['blur', 'input', 'change'],
          },
        ],
        school_id: [
          {
            required: true,
            message: '请选择学校',
            trigger: ['blur', 'input', 'change'],
          },
        ],
        subject_id: [
          {
            required: true,
            message: '请选择学科',
            trigger: ['blur', 'input', 'change'],
          },
        ],
        phone: [
          {
            required: true,
            trigger: ['blur', 'input', 'change'],
            validator: (rule: any, value: any, callback: any) => {
              if (!value) {
                callback(new Error('请输入手机号'))
              } else if (!/^1[3-9]\d{9}$/.test(value)) {
                callback(new Error('请输入有效的手机号'))
              } else {
                callback()
              }
            },
          },
        ],
        captcha: [
          {
            required: true,
            message: '请输入验证码',
            trigger: ['blur', 'input', 'change'],
          },
        ],
        student_number: [
          {
            required: true,
            message: '请输入学号',
            trigger: ['blur', 'input', 'change'],
          },
        ],
        sex: [
          {
            required: true,
            message: '请选择性别',
            trigger: ['blur', 'input', 'change'],
          },
        ],
        class_id: [
          {
            required: true,
            message: '请选择班级',
            trigger: ['blur', 'input', 'change'],
          },
        ],
      }
    })

    const submit = (step: number) => {
      refForm.value.validate((valid: boolean) => {
        if (valid) {
          if (step === 2) {
            data.active = 2
          } else if (step === 3) {
            data.active = 3
          } else {
            // 注册
            registerApi(data.form).then((res) => {
              if (res.code === 0) {
                ElMessage.success('注册成功')
                router.push({
                  name: 'login',
                  query: {
                    type: data.form.type,
                  },
                })
              } else {
                ElMessage.error('注册失败')
              }
            })
          }
        } else {
          return false
        }
      })
    }

    onMounted(() => {})

    onBeforeMount(() => {
      sessionStorage.clear()
    })
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
    }
    const toStep = () => {
      if (data.active === 2) {
        data.active = 1
      } else {
        data.active = 2
      }
    }
    const showPassword = (type: 'password' | 'confirmPassword') => {
      data.passwordType[type] = !data.passwordType[type]
    }
    const countdown = ref(0) // 添加倒计时变量
    const startCountdown = () => {
      countdown.value = 60 // 设置倒计时为60秒
      const timer = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--
        } else {
          clearInterval(timer)
        }
      }, 1000)
    }
    const goLogin = () => {
      router.push({
        name: 'login',
      })
    }
    return {
      refForm,
      getVerificationCode,
      ...toRefs(data),
      rules,
      submit,
      toStep,
      showPassword,
      countdown, // 返回倒计时变量
      startCountdown,
      goLogin,
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
  :deep(.el-form-item__content .el-select .el-select__wrapper) {
    width: 100% !important;
  }
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
    /* padding: 40px; */
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
    .captcha-img {
      cursor: pointer;
      margin-bottom: 10px;
      margin-left: 10px;
      height: 40px;
    }
    .login-button {
      width: 100%;
      margin-top: 10px;
      /* background-color: #00bcd4; */
      /* border-color: #00bcd4; */
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
  :deep(.select-box .el-select__placeholder) {
    padding-left: 10px;
  }
  :deep(.el-input__wrapper) {
    font-size: 14px;
    gap: 6px;
    line-height: 24px;
    min-height: 40px;
    padding: 8px 16px;
  }
  :deep(.el-form-item__content .el-select .el-select__wrapper) {
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
