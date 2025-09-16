<template>
  <gui-page>
    <template v-slot:gBody>
      <view class="login-container">
        <!-- 品牌信息 -->
        <view class="brand-section">
          <image class="brand-logo" src="/static/logo.png" />
        </view>
        <!-- 学生登录表单 -->
        <view>
          <view class="login-form">
            <!-- 用户名输入框 -->
            <view class="form-item">
              <view class="input-wrapper">
                <view class="input-icon">
                  <view class="icon-user"></view>
                </view>
                <input class="input-field" v-model="form.username" placeholder="请输入用户名" :maxlength="20" />
              </view>
            </view>
            <!-- 密码输入框 -->
            <view class="form-item">
              <view class="input-wrapper">
                <view class="input-icon">
                  <view class="icon-lock"></view>
                </view>
                <input class="input-field" v-model="form.password" placeholder="请输入密码" :password="!showPassword" :maxlength="20" />
                <view class="password-toggle" @click="togglePassword">
                  <view class="icon-eye" :class="{ 'icon-eye-off': showPassword }"></view>
                </view>
              </view>
            </view>
            <!-- 验证码输入框 -->
            <view class="form-item">
              <view class="captcha-wrapper">
                <view class="input-wrapper captcha-input">
                  <view class="input-icon">
                    <view class="icon-shield"></view>
                  </view>
                  <input class="input-field" v-model="form.captcha" placeholder="请输入验证码" :maxlength="6" />
                </view>
                <image v-if="captchaImage" class="captcha-image" :src="captchaImage" @click="getCaptcha" />
              </view>
            </view>
            <!-- 登录按钮 -->
            <button class="login-btn" :class="{ loading: loading }" @click="handleLogin" :disabled="loading">
              {{ loading ? "登录中..." : "登录" }}
            </button>
            <!-- 底部链接 -->
            <view class="login-links">
              <text class="link-text" @click="goToForgotPassword">忘记密码</text>
              <text class="link-separator">|</text>
              <text class="link-text" @click="goToRegister">注册账号</text>
            </view>
          </view>
        </view>
      </view>
    </template>
  </gui-page>
</template>
<script>
import { getCaptchaApi, loginApi } from "@/apis/login.js";
export default {
  name: "StudentLogin",
  data() {
    return {
      loading: false,
      showPassword: false,
      captchaImage: "",
      form: {
        username: "",
        password: "",
        captcha: "",
        captcha_id: "",
        type: "student",
      },
    };
  },

  onLoad() {
    this.getCaptcha();
    // 清除会话存储
    uni.clearStorageSync();
  },

  methods: {
    // 获取验证码
    async getCaptcha() {
      try {
        const res = await getCaptchaApi();
        console.log("验证码API响应:", res); // 调试日志
        // 适配不同的响应格式
        if (res && (res.code === 0 || res.status === "success")) {
          // 尝试不同的数据结构
          const imageData = res.data?.image || res.image;
          const keyData = res.data?.key || res.key || res.data?.captcha_id;

          if (imageData && keyData) {
            this.captchaImage = imageData;
            this.form.captcha_id = keyData;
            this.form.captcha = "";
            console.log("验证码设置成功:", this.captchaImage);
          } else {
            console.error("验证码数据格式错误:", res);
            uni.showToast({
              title: "验证码加载失败",
              icon: "none",
            });
          }
        } else {
          console.error("验证码API响应错误:", res);
          uni.showToast({
            title: res.msg || "获取验证码失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取验证码失败:", error);
        uni.showToast({
          title: "网络错误，请重试",
          icon: "none",
        });
      }
    },

    // 切换密码显示状态
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    // 表单验证
    validateForm() {
      if (!this.form.username.trim()) {
        uni.showToast({
          title: "请输入用户名",
          icon: "none",
        });
        return false;
      }

      if (!this.form.password.trim()) {
        uni.showToast({
          title: "请输入密码",
          icon: "none",
        });
        return false;
      }

      if (!this.form.captcha.trim()) {
        uni.showToast({
          title: "请输入验证码",
          icon: "none",
        });
        return false;
      }

      return true;
    },

    // 登录处理
    async handleLogin() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;

      try {
        const res = await loginApi(this.form);
        console.log("登录API响应:", res); // 调试日志

        // 适配不同的响应格式
        if (res && (res.code === 0 || res.status === "success")) {
          const token = res.data?.token || res.token;
          const userInfo = res.data?.user || res.data?.userInfo || res.userInfo || {};

          if (token) {
            // 使用uni全局认证管理器保存登录信息
            if (uni.$authManager) {
              uni.$authManager.setLoginInfo(token, "student", userInfo);
            } else {
              // fallback: 直接保存到本地存储
              uni.setStorageSync("token", token);
              uni.setStorageSync("userType", "student");
              uni.setStorageSync("userInfo", userInfo);
            }

            uni.showToast({
              title: "登录成功",
              icon: "success",
            });

            // 跳转到首页
            setTimeout(() => {
              uni.reLaunch({
                url: "/pages/registration/index",
              });
            }, 1500);
          } else {
            uni.showToast({
              title: "登录失败，未获取到token",
              icon: "none",
            });
            this.getCaptcha();
          }
        } else {
          uni.showToast({
            title: res.msg || res.message || "登录失败",
            icon: "none",
          });
          this.getCaptcha();
        }
      } catch (error) {
        console.error("登录失败:", error);
        uni.showToast({
          title: error.msg || "网络错误，请重试",
          icon: "none",
        });
        // 重新获取验证码
        this.getCaptcha();
      } finally {
        this.loading = false;
      }
    },

    // 前往忘记密码页面
    goToForgotPassword() {
      uni.navigateTo({
        url: "/pages/forgot-password/forgot-password?type=student",
      });
    },

    // 前往注册页面
    goToRegister() {
      uni.navigateTo({
        url: "/pages/register/register?type=student",
      });
    },
  },
};
</script>
<style scoped lang="scss">
.login-container {
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  position: relative;
  overflow: hidden;
}

.brand-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 160rpx;
}

.login-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  width: 100%;
  max-width: 600rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 60rpx;

  .login-title {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 16rpx;
  }

  .login-subtitle {
    font-size: 28rpx;
    color: #999;
    display: block;
  }
}

.login-form {
  .form-item {
    margin-bottom: 40rpx;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border-radius: 16rpx;
    padding: 0 24rpx;
    height: 96rpx;
    border: 2rpx solid transparent;
    transition: all 0.3s ease;

    &:focus-within {
      border-color: #667eea;
      background: #fff;
      box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
    }
  }

  .input-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-user {
      width: 32rpx;
      height: 32rpx;
      background: #999;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E") center/contain no-repeat;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E") center/contain no-repeat;
    }

    .icon-lock {
      width: 32rpx;
      height: 32rpx;
      background: #999;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M18 10v-3c0-3.31-2.69-6-6-6s-6 2.69-6 6v3H4v11h16V10h-2zm-5 6.5V20h-2v-3.5c-.55-.31-1-.78-1-1.5 0-1.1.9-2 2-2s2 .9 2 2c0 .72-.45 1.19-1 1.5zM16 10H8V7c0-2.21 1.79-4 4-4s4 1.79 4 4v3z'/%3E%3C/svg%3E") center/contain no-repeat;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M18 10v-3c0-3.31-2.69-6-6-6s-6 2.69-6 6v3H4v11h16V10h-2zm-5 6.5V20h-2v-3.5c-.55-.31-1-.78-1-1.5 0-1.1.9-2 2-2s2 .9 2 2c0 .72-.45 1.19-1 1.5zM16 10H8V7c0-2.21 1.79-4 4-4s4 1.79 4 4v3z'/%3E%3C/svg%3E") center/contain no-repeat;
    }

    .icon-shield {
      width: 32rpx;
      height: 32rpx;
      background: #999;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z'/%3E%3C/svg%3E") center/contain no-repeat;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z'/%3E%3C/svg%3E") center/contain no-repeat;
    }
  }

  .input-field {
    flex: 1;
    font-size: 32rpx;
    color: #333;
    background: transparent;
    border: none;
    outline: none;

    &::placeholder {
      color: #ccc;
    }
  }

  .password-toggle {
    cursor: pointer;
    padding: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-eye {
      width: 32rpx;
      height: 32rpx;
      background: #999;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/%3E%3C/svg%3E") center/contain no-repeat;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/%3E%3C/svg%3E") center/contain no-repeat;
      transition: all 0.3s ease;

      &.icon-eye-off {
        mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z'/%3E%3C/svg%3E") center/contain no-repeat;
        -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z'/%3E%3C/svg%3E") center/contain no-repeat;
      }
    }
  }

  .captcha-wrapper {
    display: flex;
    align-items: center;
    gap: 20rpx;
  }

  .captcha-input {
    flex: 1;
  }

  .captcha-image {
    width: 200rpx;
    height: 96rpx;
    border-radius: 16rpx;
    border: 2rpx solid #e9ecef;
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.95);
    }
  }

  .login-btn {
    width: 100%;
    height: 96rpx;
    line-height: 96rpx;
    background: linear-gradient(135deg, #ff9a56 0%, #3bb2b8 100%);
    border: none;
    border-radius: 16rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    margin-top: 20rpx;
    transition: all 0.3s ease;

    &:not(.loading):active {
      transform: translateY(2rpx);
      box-shadow: 0 4rpx 12rpx rgba(255, 154, 86, 0.3);
    }

    &.loading {
      opacity: 0.7;
      cursor: not-allowed;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .login-links {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40rpx;
    gap: 20rpx;
  }

  .link-text {
    font-size: 28rpx;
    color: #3bb2b8;
    cursor: pointer;
    transition: color 0.3s ease;

    &:active {
      color: #2a8c92;
    }
  }

  .link-separator {
    font-size: 28rpx;
    color: #ccc;
  }
}

/* 适配不同屏幕尺寸 */
@media (max-width: 375px) {
  .login-card {
    padding: 40rpx 30rpx;
  }

  .login-header .login-title {
    font-size: 42rpx;
  }
}
</style>
