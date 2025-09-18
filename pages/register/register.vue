<template>
  <gui-page :customHeader="true">
    <template v-slot:gHeader>
      <!-- 返回按钮 -->
      <gui-header-leading :backButtonClass="['gui-color-black']" :home="false"></gui-header-leading>
    </template>
    <template v-slot:gBody>
      <view class="register-container">
        <!-- 安全图标 -->
        <view class="security-icon">
          <image class="shield-icon" src="/static/4.png" />
        </view>
        <view>
          <view class="register-header">
            <text class="register-title">注册账号</text>
          </view>
          <view class="register-form">
            <!-- 账户信息 -->
            <view class="form-section">
              <view class="section-title">账户信息</view>

              <!-- 用户名 -->
              <view class="form-item">
                <view class="input-wrapper">
                  <input class="input-field" placeholder-style="color: red" v-model="form.username" placeholder="请输入用户名" :maxlength="20" />
                </view>
              </view>

              <!-- 密码 -->
              <view class="form-item">
                <view class="input-wrapper">
                  <input class="input-field" v-model="form.password" placeholder="请输入密码" :password="!showPassword" :maxlength="20" />
                  <view class="password-toggle" @click="togglePassword">
                    <view class="icon-eye" :class="{ 'icon-eye-off': showPassword }"></view>
                  </view>
                </view>
              </view>

              <!-- 确认密码 -->
              <view class="form-item">
                <view class="input-wrapper">
                  <input class="input-field" v-model="form.confirmPassword" placeholder="请再次输入密码" :password="!showConfirmPassword" :maxlength="20" />
                  <view class="password-toggle" @click="toggleConfirmPassword">
                    <view class="icon-eye" :class="{ 'icon-eye-off': showConfirmPassword }"></view>
                  </view>
                </view>
              </view>
            </view>

            <!-- 基本信息 -->
            <view class="form-section">
              <view class="section-title">基本信息</view>

              <!-- 真实姓名 -->
              <view class="form-item">
                <view class="input-wrapper">
                  <input class="input-field" v-model="form.nickname" placeholder="请输入姓名" :maxlength="10" />
                </view>
              </view>

              <!-- 学号 -->
              <view class="form-item">
                <view class="input-wrapper">
                  <input class="input-field" v-model="form.student_number" placeholder="请输入学号" :maxlength="20" />
                </view>
              </view>

              <!-- 性别选择 -->
              <view class="form-item">
                <view class="input-wrapper" @click="showGenderPicker = true">
                  <text class="picker-text" :class="{ placeholder: !selectedGender }">
                    {{ selectedGender ? selectedGender.name : "请选择性别" }}
                  </text>
                  <text class="arrow-icon gui-icons">&#xe661;</text>
                </view>
              </view>

              <!-- 学校选择 -->
              <view class="form-item">
                <view class="input-wrapper" @click="showSchoolPicker = true">
                  <text class="picker-text" :class="{ placeholder: !selectedSchool }">
                    {{ selectedSchool ? selectedSchool.name : "请选择学校" }}
                  </text>
                  <text class="arrow-icon gui-icons">&#xe661;</text>
                </view>
              </view>

              <!-- 班级选择 -->
              <view class="form-item" v-if="selectedSchool">
                <view class="input-wrapper" @click="showClassPicker = true">
                  <text class="picker-text" :class="{ placeholder: !selectedClass }">
                    {{ selectedClass ? selectedClass.name : "请选择班级" }}
                  </text>
                  <text class="arrow-icon gui-icons">&#xe661;</text>
                </view>
              </view>
            </view>

            <!-- 身份验证 -->
            <view class="form-section">
              <view class="section-title">身份验证</view>

              <!-- 手机号 -->
              <view class="form-item">
                <view class="input-wrapper">
                  <input class="input-field" v-model="form.phone" placeholder="请输入手机号" type="number" :maxlength="11" />
                </view>
              </view>

              <!-- 短信验证码 -->
              <view class="form-item">
                <view class="sms-wrapper">
                  <view class="input-wrapper sms-input">
                    <input class="input-field" v-model="form.smsCode" placeholder="请输入验证码" type="number" :maxlength="6" />
                    <span class="sms-btn" :class="{ disabled: smsCountdown > 0 }" @click="sendSmsCode" :disabled="smsCountdown > 0">
                      {{ smsCountdown > 0 ? `${smsCountdown}s` : "获取验证码" }}
                    </span>
                  </view>
                </view>
              </view>
            </view>

            <!-- 注册按钮 -->
            <button class="register-btn" :class="{ loading: loading }" @click="handleRegister" :disabled="loading">
              {{ loading ? "注册中..." : "完成注册" }}
            </button>

            <!-- 底部链接 -->
            <view class="register-links">
              <text class="link-text" @click="goToLogin">已有账号？去登录</text>
            </view>
          </view>
        </view>

        <!-- 学校选择弹窗 -->
        <view class="picker-modal" v-if="showSchoolPicker" @click="showSchoolPicker = false">
          <view class="picker-content" @click.stop="">
            <view class="picker-header">
              <text class="picker-title">选择学校</text>
              <text class="picker-close" @click="showSchoolPicker = false">✕</text>
            </view>
            <scroll-view class="picker-list" scroll-y>
              <view class="picker-item" v-for="school in schoolList" :key="school.id" @click="selectSchool(school)">
                {{ school.name }}
              </view>
            </scroll-view>
          </view>
        </view>

        <!-- 班级选择弹窗 -->
        <view class="picker-modal" v-if="showClassPicker" @click="showClassPicker = false">
          <view class="picker-content" @click.stop="">
            <view class="picker-header">
              <text class="picker-title">选择班级</text>
              <text class="picker-close" @click="showClassPicker = false">✕</text>
            </view>
            <scroll-view class="picker-list" scroll-y>
              <view class="picker-item" v-for="classItem in classList" :key="classItem.id" @click="selectClass(classItem)">
                {{ classItem.name }}
              </view>
            </scroll-view>
          </view>
        </view>

        <!-- 性别选择弹窗 -->
        <view class="picker-modal" v-if="showGenderPicker" @click="showGenderPicker = false">
          <view class="picker-content" @click.stop="">
            <view class="picker-header">
              <text class="picker-title">选择性别</text>
              <text class="picker-close" @click="showGenderPicker = false">✕</text>
            </view>
            <view class="picker-list">
              <view class="picker-item" v-for="gender in genderList" :key="gender.value" @click="selectGender(gender)">
                {{ gender.name }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>
  </gui-page>
</template>

<script>
import { registerApi, sendSmsCodeApi } from "@/apis/register.js";
import { getSchoolListApi, getClassListApi } from "@/apis/common.js";

export default {
  name: "StudentRegister",
  data() {
    return {
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      captchaImage: "",
      smsCountdown: 0,
      smsTimer: null,
      showSchoolPicker: false,
      showClassPicker: false,
      showGenderPicker: false,
      schoolList: [],
      classList: [],
      genderList: [
        { name: "男", value: 1 },
        { name: "女", value: 2 },
      ],
      selectedSchool: null,
      selectedClass: null,
      selectedGender: null,
      form: {
        username: "",
        nickname: "", // 修改为nickname匹配后端
        student_number: "", // 修改为student_number匹配后端
        phone: "",
        smsCode: "",
        password: "",
        confirmPassword: "",
        school_id: "", // 修改为school_id匹配后端
        class_id: "", // 修改为class_id匹配后端
        sex: 0, // 修改为sex，使用数字格式
        type: "student",
        captcha: "", // 短信验证码作为captcha
        captcha_id: "", // 短信验证码ID
      },
    };
  },

  onLoad() {
    this.getSchoolList();
  },

  onUnload() {
    if (this.smsTimer) {
      clearInterval(this.smsTimer);
    }
  },

  methods: {
    // 获取学校列表
    async getSchoolList() {
      try {
        const res = await getSchoolListApi();
        this.schoolList = res.data.list;
        console.log(this.schoolList);
      } catch (error) {
        console.error("获取学校列表失败:", error);
      }
    },

    // 获取班级列表
    async getClassList(schoolId) {
      try {
        const res = await getClassListApi({ school_id: schoolId });

        this.classList = res.data.list || [];
      } catch (error) {
        console.error("获取班级列表失败:", error);
      }
    },

    // 选择学校
    selectSchool(school) {
      this.selectedSchool = school;
      this.form.school_id = school.id;
      this.selectedClass = null;
      this.form.class_id = "";
      this.classList = [];
      this.showSchoolPicker = false;
      this.getClassList(school.id);
    },

    // 选择班级
    selectClass(classItem) {
      this.selectedClass = classItem;
      this.form.class_id = classItem.id;
      this.showClassPicker = false;
    },

    // 选择性别
    selectGender(gender) {
      this.selectedGender = gender;
      this.form.sex = gender.value;
      this.showGenderPicker = false;
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
          type: "register",
        });

        if (res.code === 0) {
          this.form.captcha_id = res.data.key || res.data.captcha_id; // 保存验证码ID
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
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },

    // 表单验证
    validateForm() {
      const { username, nickname, phone, smsCode, password, confirmPassword, school_id, class_id } = this.form;

      if (!username.trim()) {
        uni.showToast({ title: "请输入用户名", icon: "none" });
        return false;
      }

      if (!nickname.trim()) {
        uni.showToast({ title: "请输入姓名", icon: "none" });
        return false;
      }

      if (!this.form.student_number.trim()) {
        uni.showToast({ title: "请输入学号", icon: "none" });
        return false;
      }

      if (!this.form.sex) {
        uni.showToast({ title: "请选择性别", icon: "none" });
        return false;
      }

      if (!phone.trim()) {
        uni.showToast({ title: "请输入手机号", icon: "none" });
        return false;
      }

      if (!/^1[3-9]\d{9}$/.test(phone)) {
        uni.showToast({ title: "手机号格式不正确", icon: "none" });
        return false;
      }

      if (!smsCode.trim()) {
        uni.showToast({ title: "请输入短信验证码", icon: "none" });
        return false;
      }

      if (!school_id) {
        uni.showToast({ title: "请选择学校", icon: "none" });
        return false;
      }

      if (!class_id) {
        uni.showToast({ title: "请选择班级", icon: "none" });
        return false;
      }

      if (!password.trim()) {
        uni.showToast({ title: "请输入密码", icon: "none" });
        return false;
      }

      if (password.length < 6) {
        uni.showToast({ title: "密码至少6位", icon: "none" });
        return false;
      }

      if (password !== confirmPassword) {
        uni.showToast({ title: "两次密码不一致", icon: "none" });
        return false;
      }

      return true;
    },

    // 注册处理
    async handleRegister() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;

      try {
        const { confirmPassword, smsCode, ...submitData } = this.form;

        // 构建提交数据，确保字段名匹配后端
        const submitForm = {
          ...submitData,
          captcha: smsCode, // 短信验证码作为captcha
          captcha_id: this.form.captcha_id, // 短信验证码ID
          password_affirm: confirmPassword, // 确认密码
        };

        const res = await registerApi(submitForm);

        if (res.status === "success") {
          uni.showToast({
            title: "注册成功",
            icon: "success",
          });

          setTimeout(() => {
            this.goToLogin();
          }, 1500);
        }
      } catch (error) {
        console.error("注册失败:", error);
      } finally {
        this.loading = false;
      }
    },

    // 前往登录页面
    goToLogin() {
      uni.navigateBack();
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
.register-container {
  padding: 40rpx 20rpx;
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

.register-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  margin-top: 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 60rpx;

  .register-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #1d2129;
    display: block;
    margin-bottom: 16rpx;
  }

  .register-subtitle {
    font-size: 28rpx;
    color: #999;
    display: block;
  }
}

.register-form {
  .form-section {
    margin-bottom: 60rpx;

    .section-title {
      font-size: 32rpx;
      color: #4e5969;
      font-weight: bold;
      margin-bottom: 30rpx;
      padding-left: 14rpx;
      border-left: 6rpx solid #3bb2b8;
    }
  }

  .form-item {
    margin-bottom: 30rpx;
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
      border-color: #3bb2b8;
      background: #fff;
      box-shadow: 0 0 0 4rpx rgba(59, 178, 184, 0.1);
    }
  }

  .input-icon {
    font-size: 32rpx;
    margin-right: 16rpx;
    color: #999;
  }

  .input-field {
    flex: 1;
    font-size: 32rpx;
    color: #333;
    background: transparent;
    border: none;
    outline: none;

    &::placeholder {
      color: #f8f8f8 !important;
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

  .picker-text {
    flex: 1;
    font-size: 32rpx;
    color: #333;

    &.placeholder {
      color: #888;
    }
  }

  .arrow-icon {
    font-size: 24rpx;
    color: #999;
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
    width: 180rpx;
    height: 96rpx;
    line-height: 96rpx;
    color: #3bb2b8;
    border: none;
    border-radius: 16rpx;
    font-size: 28rpx;
    text-align: right;
    &.disabled {
      color: #ccc;
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

  .register-btn {
    width: 100%;
    height: 96rpx;
    background: #3bb2b8;
    border: none;
    border-radius: 16rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    margin-top: 40rpx;

    &:not(.loading):active {
      transform: translateY(2rpx);
      background: #2a8c92;
    }

    &.loading {
      opacity: 0.7;
    }
  }

  .register-links {
    text-align: center;
    margin-top: 40rpx;
  }

  .link-text {
    font-size: 28rpx;
    color: #3bb2b8;
    cursor: pointer;
  }
}

.picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.picker-content {
  background: #fff;
  border-radius: 24rpx;
  width: 80%;
  max-height: 80%;
  overflow: hidden;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx;
  border-bottom: 1rpx solid #eee;
}

.picker-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.picker-close {
  font-size: 40rpx;
  color: #999;
  cursor: pointer;
}

.picker-list {
  max-height: 600rpx;
}

.picker-item {
  padding: 40rpx;
  border-bottom: 1rpx solid #f5f5f5;
  font-size: 32rpx;
  color: #333;
  cursor: pointer;

  &:active {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
}
</style>
