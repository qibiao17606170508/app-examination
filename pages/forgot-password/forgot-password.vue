<template>
  <gui-page :customHeader="true">
    <template v-slot:gHeader>
      <!-- 返回按钮 -->
      <gui-header-leading :backButtonClass="['gui-color-black']" :home="false"></gui-header-leading>
    </template>
    <template v-slot:gBody>
      <view class="forgot-container">
        <!-- 安全图标 -->
        <view class="security-icon">
          <image class="shield-icon" src="/static/4.png" />
        </view>
        <view class="">
          <view class="forgot-header">
            <text class="forgot-title">重置密码</text>
          </view>

          <view class="forgot-form">
            <!-- 手机号 -->
            <view class="form-item">
              <view class="input-wrapper">
                <view class="input-icon">
                  <view class="icon-phone"></view>
                </view>
                <input class="input-field" v-model="form.phone" placeholder="请输入手机号" type="number" :maxlength="11" />
              </view>
            </view>

            <!-- 短信验证码 -->
            <view class="form-item">
              <view class="sms-wrapper">
                <view class="input-wrapper sms-input">
                  <view class="input-icon">
                    <view class="icon-shield"></view>
                  </view>
                  <input class="input-field" v-model="form.smsCode" placeholder="请输入验证码" type="number" :maxlength="6" />
                  <view class="sms-btn" :class="{ disabled: smsCountdown > 0 }" @click="sendSmsCode" :disabled="smsCountdown > 0">
                    {{ smsCountdown > 0 ? `${smsCountdown}s` : "获取验证码" }}
                  </view>
                </view>
              </view>
            </view>

            <!-- 新密码 -->
            <view class="form-item">
              <view class="input-wrapper">
                <view class="input-icon">
                  <view class="icon-lock"></view>
                </view>
                <input class="input-field" v-model="form.newPassword" placeholder="请输入新密码" :password="!showNewPassword" :maxlength="20" />
                <view class="password-toggle" @click="toggleNewPassword">
                  <view class="icon-eye" :class="{ 'icon-eye-off': showNewPassword }"></view>
                </view>
              </view>
            </view>

            <!-- 重置按钮 -->
            <button class="reset-btn" :class="{ loading: loading }" @click="resetPassword" :disabled="loading">
              {{ loading ? "重置中..." : "重置密码" }}
            </button>
          </view>
        </view>
      </view>
    </template>
  </gui-page>
</template>

<script>
import { sendSmsCodeApi, forgotPasswordApi } from "@/apis/register.js";

export default {
  name: "ForgotPassword",
  data() {
    return {
      loading: false,
      showNewPassword: false,
      smsCountdown: 0,
      smsTimer: null,
      form: {
        phone: "",
        smsCode: "",
        newPassword: "",
        type: "student",
      },
    };
  },

  onLoad(options) {
    if (options.type) {
      this.form.type = options.type;
    }
  },

  onUnload() {
    if (this.smsTimer) {
      clearInterval(this.smsTimer);
    }
  },

  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1,
      });
    },

    // 发送短信验证码
    async sendSmsCode() {
      if (!this.form.phone) {
        uni.showToast({
          title: "请输入手机号",
          icon: "none",
        });
        return;
      }

      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        uni.showToast({
          title: "手机号格式不正确",
          icon: "none",
        });
        return;
      }

      try {
        const res = await sendSmsCodeApi({
          phone: this.form.phone,
          type: "forgot",
        });

        if (res.status === "success") {
          uni.showToast({
            title: "验证码已发送",
            icon: "success",
          });
          this.startSmsCountdown();
        }
      } catch (error) {
        console.error("发送短信验证码失败:", error);
      }
    },

    // 开始短信倒计时
    startSmsCountdown() {
      this.smsCountdown = 60;
      this.smsTimer = setInterval(() => {
        this.smsCountdown--;
        if (this.smsCountdown <= 0) {
          clearInterval(this.smsTimer);
          this.smsTimer = null;
        }
      }, 1000);
    },

    // 切换密码显示状态
    toggleNewPassword() {
      this.showNewPassword = !this.showNewPassword;
    },

    // 重置密码
    async resetPassword() {
      const { phone, smsCode, newPassword } = this.form;

      if (!phone.trim()) {
        uni.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }

      if (!/^1[3-9]\d{9}$/.test(phone)) {
        uni.showToast({ title: "手机号格式不正确", icon: "none" });
        return;
      }

      if (!smsCode.trim()) {
        uni.showToast({ title: "请输入短信验证码", icon: "none" });
        return;
      }

      if (!newPassword.trim()) {
        uni.showToast({ title: "请输入新密码", icon: "none" });
        return;
      }

      if (newPassword.length < 6) {
        uni.showToast({ title: "密码至少6位", icon: "none" });
        return;
      }

      this.loading = true;

      try {
        const res = await forgotPasswordApi({
          phone: this.form.phone,
          smsCode: this.form.smsCode,
          newPassword: this.form.newPassword,
          type: this.form.type,
        });

        if (res.status === "success") {
          uni.showToast({
            title: "密码重置成功",
            icon: "success",
          });

          setTimeout(() => {
            this.goToLogin();
          }, 1500);
        }
      } catch (error) {
        console.error("重置密码失败:", error);
      } finally {
        this.loading = false;
      }
    },

    // 前往登录页面
    goToLogin() {
      uni.reLaunch({
        url: "/login",
      });
    },
  },
};
</script>
<style>
page {
  background-image: linear-gradient(180deg, #3bb2b8 0%, #fff 35%) !important;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
<style lang="scss">
.top-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
}
.forgot-container {
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* justify-content: center; */
  padding: 40rpx;
  position: relative;
  overflow: hidden;
}

.security-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  margin-top: 200rpx;
  .shield-icon {
    width: 200rpx;
    height: 200rpx;
    object-fit: contain;
  }
}

.forgot-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  width: 100%;
  max-width: 600rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
}

.forgot-header {
  text-align: center;
  margin-bottom: 60rpx;

  .forgot-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #1d2129;
    display: block;
    margin-bottom: 16rpx;
  }

  .forgot-subtitle {
    font-size: 28rpx;
    color: #999;
    display: block;
  }
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60rpx;

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;

    .step-number {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      background: #e9ecef;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      font-weight: bold;
      margin-bottom: 12rpx;
      transition: all 0.3s ease;
    }

    .step-text {
      font-size: 24rpx;
      color: #999;
      transition: all 0.3s ease;
    }

    &.active,
    &.completed {
      .step-number {
        background: #667eea;
        color: #fff;
      }

      .step-text {
        color: #667eea;
      }
    }
  }

  .step-line {
    width: 80rpx;
    height: 4rpx;
    background: #e9ecef;
    margin: 0 20rpx;
    margin-bottom: 40rpx;
    transition: all 0.3s ease;

    &.active {
      background: #667eea;
    }
  }
}

.forgot-form {
  .form-item {
    margin-bottom: 40rpx;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    background: #f7f7f7;
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

    .icon-phone {
      width: 32rpx;
      height: 32rpx;
      background: #999;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6.54 5c.06.89.21 1.76.45 2.59l-1.2 1.2c-.41-1.2-.67-2.47-.76-3.79h1.51m9.86 12.02c.85.24 1.72.39 2.6.45v1.49c-1.32-.09-2.59-.35-3.8-.75l1.2-1.19M7.5 3H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.49c0-.55-.45-1-1-1-1.24 0-2.45-.2-3.57-.57-.1-.04-.21-.05-.31-.05-.26 0-.51.1-.71.29l-2.2 2.2c-2.83-1.45-5.15-3.76-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1z'/%3E%3C/svg%3E") center/contain no-repeat;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6.54 5c.06.89.21 1.76.45 2.59l-1.2 1.2c-.41-1.2-.67-2.47-.76-3.79h1.51m9.86 12.02c.85.24 1.72.39 2.6.45v1.49c-1.32-.09-2.59-.35-3.8-.75l1.2-1.19M7.5 3H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.49c0-.55-.45-1-1-1-1.24 0-2.45-.2-3.57-.57-.1-.04-.21-.05-.31-.05-.26 0-.51.1-.71.29l-2.2 2.2c-2.83-1.45-5.15-3.76-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1z'/%3E%3C/svg%3E") center/contain no-repeat;
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

  .sms-wrapper {
    display: flex;
    align-items: center;
    gap: 20rpx;
  }

  .sms-input {
    flex: 1;
  }

  .sms-btn {
    width: 200rpx;
    height: 96rpx;
    line-height: 96rpx;
    color: #15abbe;
    text-align: center;
    border: none;
    border-radius: 16rpx;
    font-size: 28rpx;

    &.disabled {
      background: #ccc;
      cursor: not-allowed;
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
  }

  .reset-btn {
    width: 100%;
    height: 96rpx;
    line-height: 96rpx;
    background: #15abbe;
    border: none;
    border-radius: 16rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    margin-top: 200rpx;
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

  .password-tips {
    background: #f8f9fa;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 40rpx;

    .tips-title {
      font-size: 28rpx;
      color: #333;
      font-weight: bold;
      display: block;
      margin-bottom: 12rpx;
    }

    .tips-item {
      font-size: 24rpx;
      color: #666;
      display: block;
      margin-bottom: 8rpx;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .button-group {
    display: flex;
    gap: 20rpx;
    margin-top: 20rpx;

    .back-btn {
      flex: 1;
      height: 96rpx;
      background: #f8f9fa;
      border: 2rpx solid #e9ecef;
      border-radius: 16rpx;
      color: #666;
      font-size: 32rpx;
    }

    .reset-btn {
      flex: 2;
      margin-top: 0;
    }
  }
}

.success-content {
  text-align: center;
  padding: 40rpx 0;

  .success-icon {
    font-size: 120rpx;
    margin-bottom: 40rpx;
  }

  .success-title {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 16rpx;
  }

  .success-subtitle {
    font-size: 28rpx;
    color: #999;
    display: block;
    margin-bottom: 60rpx;
  }
}

.forgot-links {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40rpx;
  gap: 20rpx;
}

.link-text {
  font-size: 28rpx;
  color: #667eea;
  cursor: pointer;

  &:active {
    color: #5a67d8;
  }
}

.link-separator {
  font-size: 28rpx;
  color: #ccc;
}
</style>
