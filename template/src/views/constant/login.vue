<template>
  <div class="login-container">
    <div class="logo-section">
      <img src="@/assets/images/login-bg.jpg" alt="Logo" class="logo-title" />
    </div>
    <el-card class="login-box" v-if="standing === 0">
      <h2>请选择您的身份登录</h2>
      <div class="login-buttonBox" @click="toLogin(1)">
        <div class="flex-box flex-alc">
          <div class="login-button-img">
            <img src="@/assets/images/student.png" alt="学生" />
          </div>
          <div class="login-button-text">我是学生</div>
        </div>
        <div>
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
      <div class="login-buttonBox" @click="toLogin(2)">
        <div class="flex-box flex-alc">
          <div class="login-button-img">
            <img src="@/assets/images/teacher.png" alt="老师" />
          </div>
          <div class="login-button-text">我是老师</div>
        </div>
        <div>
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
      <div class="login-buttonBox" @click="toLogin(3)">
        <div class="flex-box flex-alc">
          <div class="login-button-img">
            <img src="@/assets/images/admin.png" alt="管理员" />
          </div>
          <div class="login-button-text">我是管理员</div>
        </div>
        <div>
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </el-card>
    <el-card class="login-box" v-if="standing !== 0">
      <div
        class="cursor-pointer"
        style="position: absolute; top: 20px; left: 20px"
        @click="
          () => {
            standing = 0
          }
        "
      >
        <div class="flex-box flex-alc">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回</span>
        </div>
      </div>
      <h2>欢迎登录系统</h2>
      <el-form
        ref="refForm"
        :model="form"
        :rules="rules"
        @keyup.enter="submit()"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            clearable
          >
            <template #prefix>
              <svg-icon name="User_Empty" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            show-password
            clearable
          >
            <template #prefix>
              <svg-icon name="Lock" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input
            v-model="form.captcha"
            class="flex-item_f-1"
            placeholder="请输入图形验证码"
            clearable
          >
            <template #prefix>
              <svg-icon name="Edit_Box" />
            </template>
          </el-input>
          <img
            v-show="captcha"
            class="captcha-img height-32 mt-7"
            :src="captcha"
            @click="getCaptcha()"
            alt="验证码"
          />
        </el-form-item>
        <el-button
          :loading="loading"
          class="login-button"
          type="primary"
          @click="submit()"
        >
          登录
        </el-button>
      </el-form>
      <div class="links" v-if="standing !== 3">
        <!-- <span
          class="cursor-pointer defaultColor font-size-15"
          @click="toPage(1)"
        >
          修改手机号
        </span>
        | -->
        <span
          class="cursor-pointer defaultColor font-size-15"
          @click="toPage(2)"
        >
          忘记密码？
        </span>
        <br />
        <div class="pt-10">
          还没有账号？
          <span
            class="cursor-pointer defaultColor font-size-15"
            @click="toRegister()"
          >
            去注册
          </span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import {
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
import { captchaApi } from '@/api/login'

interface Form {
  username: string
  password: string
  captcha?: string
  type: string
  captcha_id?: string
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
      standing: number
    }>({
      loading: false,
      captcha: '',
      form: {
        username: '',
        password: '',
        type: '',
        captcha_id: '',
      },
      phoneFlag: false,
      standing: 0,
    })
    const phoneRef = ref<HTMLElement | null>(null)
    const rules = reactive({
      username: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: '请输入密码',
          trigger: 'blur',
        },
      ],
      captcha: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
    })

    const getCaptcha = () => {
      captchaApi()
        .then((r: any) => {
          // let blob = new Blob([r])
          // let url = window.URL.createObjectURL(blob)
          data.captcha = r.data.image
          data.form.captcha_id = r.data.key
          data.form.captcha = ''
        })
        .catch(() => {
          data.captcha = ''
          data.form.captcha_id = ''
          data.form.captcha = ''
        })
    }

    const submit = () => {
      refForm.value?.validate((valid: boolean) => {
        if (valid) {
          data.loading = true
          data.form.type =
            data.standing == 1
              ? 'student'
              : data.standing == 2
              ? 'teacher'
              : 'web'
          store
            .dispatch('administrator/login', data.form)
            .then((r: boolean) => {
              if (r) {
                router.push({ name: 'redirect', replace: true })
              } else {
                getCaptcha()
                nextTick(() => {
                  data.loading = false
                })
              }
            })
            .catch(() => {
              data.loading = false
            })
        }
      })
    }

    onMounted(() => {
      nextTick(() => {
        if (data.phoneFlag) {
          setTimeout(() => {
            phoneRef.value?.focus()
          }, 1000)
        }
      })
    })

    onBeforeMount(() => {
      sessionStorage.clear()
      getCaptcha()
      if (router.currentRoute.value.query.type) {
        data.standing =
          router.currentRoute.value.query.type === 'student'
            ? 1
            : router.currentRoute.value.query.type === 'teacher'
            ? 2
            : 3
      }
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        data.phoneFlag = true
      } else {
        data.phoneFlag = false
      }
    })
    const toRegister = () => {
      router.push({
        name: 'register',
        query: {
          type:
            data.standing == 1
              ? 'student'
              : data.standing == 2
              ? 'teacher'
              : 'admin',
        },
      })
    }
    const toLogin = (standing: number) => {
      data.standing = standing
    }
    const toPage = (type: number) => {
      if (type == 2) {
        router.push({
          name: 'forgot',
          query: {
            type:
              data.standing == 1
                ? 'student'
                : data.standing == 2
                ? 'teacher'
                : 'web',
          },
        })
      }
    }
    return {
      refForm,
      ...toRefs(data),
      rules,
      submit,
      getCaptcha,
      phoneRef,
      toRegister,
      toLogin,
      toPage,
    }
  },
})
</script>

<style lang="scss" scoped>
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
      /* width: 120px; */
      /* font-size: 64px; */
      /* font-weight: bold; */
      /* margin-bottom: 20px; */
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
    position: relative;
    /* padding: 40px; */
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin-right: 10%;

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
      height: 46px;
      width: 120px;
    }
    .login-button {
      width: 100%;
      margin-top: 10px;
      /* background-color: #f7f7f7; */
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
}
.login-buttonBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f7f7f7;
  height: 100px;
  margin-bottom: 20px;
  font-size: 18px;
  padding: 0 30px;
  cursor: pointer;
  font-weight: 600;
  .login-button-img {
    width: 60px;
    height: 60px;
    margin-right: 20px;
    img {
      width: 100%;
      height: 100%;
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
</style>
