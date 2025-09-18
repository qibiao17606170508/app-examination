<template>
  <gui-page :apiLoadingStatus="apiLoadingStatus" :loadmore="true" @loadmorefun="getdata" ref="guipage" :customHeader="true">
    <template v-slot:gHeader>
      <view style="height: 44px"></view>
      <view style="height: 44px" class="gui-flex gui-nowrap gui-rows gui-align-items-center gui-justify-content-between gui-space-between header-container">
        <!-- 欢迎语 -->
        <view class="welcome-section">
          <text class="welcome-text">欢迎您</text>
          <text class="username-text">{{ userInfo.nickname || userInfo.username || "张三同学" }}</text>
        </view>

        <!-- 科目选择器 -->
        <view class="language-section" @click="showLanguageSelector">
          <text class="language-text">{{ currentSubject ? currentSubject.name : "语文" }}</text>
          <view class="language-dropdown">
            <text class="dropdown-arrow grace-iconfont">&#xe608;</text>
          </view>
        </view>
      </view>
    </template>

    <!-- 科目选择弹窗 -->
    <gui-popup ref="subjectPopup" @close="closeSubjectPopup" position="bottom">
      <view class="subject-popup-content">
        <view class="subject-popup-header">
          <text class="subject-popup-title">选择科目</text>
          <view class="subject-popup-close" @click="closeSubjectPopup">
            <text>✕</text>
          </view>
        </view>
        <view class="subject-list">
          <view v-for="(item, index) in subjectList" :key="item.id || index" class="subject-item" :class="{ active: currentSubject && currentSubject.id === item.id }" @click="selectSubject(item)">
            <text class="subject-name">{{ item.name }}</text>
            <view v-if="currentSubject && currentSubject.id === item.id" class="subject-check">✓</view>
          </view>
        </view>
      </view>
    </gui-popup>
    <template v-slot:gBody>
      <text v-for="(item, idx) in demoData" :key="idx" class="demo gui-block gui-bg-white gui-dark-bg-level-3 gui-primary-text gui-text-center gui-text-small">{{ item }}</text>
    </template>
  </gui-page>
</template>
<script>
// 模拟数据
var data = [1, 2, 3, 4, 5, 6, 7, 8];
import graceJS from "@/Grace6/js/grace.js";
import { getSubjectListApi } from "@/apis/common.js";
// 模拟页码
var page = 1;
export default {
  data() {
    return {
      demoData: [],
      pageLoading: true,
      // 用于记录是否有 api 请求正在执行
      apiLoadingStatus: false,
      // 用户信息
      userInfo: {
        nickname: "",
        username: "",
      },
      // 科目相关数据
      subjectList: [],
      currentSubject: null,
    };
  },
  onLoad: function () {
    // 页码加载时第一次加载数据
    page = 1;
    this.demoData = [];
    this.getdata();
    // 初始化用户信息和科目数据
    this.initUserInfo();
    this.getSubjectList();
  },
  methods: {
    getdata: function () {
      this.apiLoadingStatus = true;
      console.log("加载函数运行，页码 : " + page);
      // 模拟 api 请求刷新数据
      setTimeout(() => {
        // 对演示数据随机刷新模拟数据刷新
        var demoArr = graceJS.arrayShuffle(data);
        if (page >= 2) {
          this.demoData = this.demoData.concat(demoArr);
          // 加载完成后停止加载动画
          this.$refs.guipage.stopLoadmore();
          // 假定第3页加载了全部数据，通知组件不再加载更多
          // 实际开发由接口返回值来决定
          if (page >= 3) {
            this.$refs.guipage.nomore();
          }
        }
        // 第一页数据
        else {
          this.demoData = demoArr;
          this.pageLoading = false;
          // 加载完成后停止加载动画
          this.$refs.guipage.stopLoadmore();
        }
        page++;
        this.apiLoadingStatus = false;
      }, 1000);
    },

    // 初始化用户信息
    initUserInfo() {
      // 从本地存储或全局状态获取用户信息
      try {
        const userInfo = uni.getStorageSync("userInfo");
        if (userInfo) {
          this.userInfo = userInfo;
        }
      } catch (e) {
        console.log("获取用户信息失败:", e);
      }
    },

    // 获取科目列表
    async getSubjectList() {
      try {
        this.apiLoadingStatus = true;
        const res = await getSubjectListApi();
        if (res.code === 0) {
          this.subjectList = res.data.list;
          // 设置默认选中第一个科目
          if (this.subjectList.length > 0 && !this.currentSubject) {
            this.currentSubject = this.subjectList[0];
          }
        }
      } catch (error) {
        console.error("获取科目列表失败:", error);
        // 如果API失败，使用模拟数据
        this.subjectList = [
          { id: 1, name: "语文" },
          { id: 2, name: "数学" },
          { id: 3, name: "英语" },
          { id: 4, name: "物理" },
          { id: 5, name: "化学" },
          { id: 6, name: "生物" },
          { id: 7, name: "历史" },
          { id: 8, name: "地理" },
          { id: 9, name: "政治" },
        ];
        // 设置默认选中第一个科目
        if (this.subjectList.length > 0 && !this.currentSubject) {
          this.currentSubject = this.subjectList[0];
        }
        uni.showToast({
          title: "已加载模拟科目数据",
          icon: "none",
        });
      } finally {
        this.apiLoadingStatus = false;
      }
    },

    // 显示科目选择器
    showLanguageSelector() {
      console.log("点击了科目选择器");
      if (this.$refs.subjectPopup) {
        this.$refs.subjectPopup.open();
        console.log("弹窗已打开");
      } else {
        console.log("弹窗ref未找到");
      }
    },

    // 关闭科目选择弹窗
    closeSubjectPopup() {
      console.log("关闭弹窗");
      if (this.$refs.subjectPopup) {
        this.$refs.subjectPopup.close();
      }
    },

    // 选择科目
    selectSubject(subject) {
      console.log("选择了科目:", subject);
      this.currentSubject = subject;
      this.closeSubjectPopup();
      // 这里可以添加切换科目后的逻辑
      this.onSubjectChange(subject);
    },

    // 科目切换后的处理
    onSubjectChange(subject) {
      console.log("切换到科目:", subject);
      uni.showToast({
        title: `已切换到${subject.name}`,
        icon: "success",
      });
      // 这里可以添加更多切换科目后的业务逻辑
      // 比如重新加载数据等
    },
  },
};
</script>
<style>
page {
  background-image: linear-gradient(180deg, #e0f8ff 0, #fff 20%);
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>

<style scoped>
.demo {
  margin: 30rpx;
  margin-bottom: 0rpx;
  line-height: 200rpx;
}

/* 头部容器样式 */
.header-container {
  padding: 0 30rpx;
  border-radius: 0 0 40rpx 40rpx;
}

/* 欢迎区域样式 */
.welcome-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}

.welcome-text {
  font-size: 24rpx;
  color: #000;
  margin-bottom: 4rpx;
}

.username-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #000;
}

/* 科目选择器样式 */
.language-section {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 40rpx;
  padding: 16rpx 24rpx;
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
}

.language-text {
  font-size: 28rpx;
  color: #000;
  font-weight: 500;
  margin-right: 12rpx;
}

.language-dropdown {
  display: flex;
  align-items: center;
}

.dropdown-arrow {
  font-size: 20rpx;
  color: #000;
  transition: transform 0.3s ease;
}

.grace-iconfont {
  font-family: "graceIconfontBase64" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 科目选择弹窗样式 */
.subject-popup-content {
  background: #ffffff;
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
  max-height: 80vh;
  width: 100%;
  position: relative;
}

.subject-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.subject-popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.subject-popup-close {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #ffffff;
}

.subject-list {
  max-height: 600rpx;
  overflow-y: auto;
}

.subject-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.subject-item:last-child {
  border-bottom: none;
}

.subject-item:active {
  background-color: #f8f9fa;
}

.subject-item.active {
  background-color: #e3f2fd;
  border-left: 6rpx solid #2196f3;
}

.subject-name {
  font-size: 30rpx;
  color: #333333;
  font-weight: 500;
}

.subject-item.active .subject-name {
  color: #2196f3;
  font-weight: 600;
}

.subject-check {
  width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
  background: #2196f3;
  color: #ffffff;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式调整 */
@media (max-width: 750rpx) {
  .header-container {
    padding: 0 20rpx;
  }

  .welcome-text {
    font-size: 22rpx;
  }

  .username-text {
    font-size: 28rpx;
  }

  .language-text {
    font-size: 26rpx;
  }
}
</style>
