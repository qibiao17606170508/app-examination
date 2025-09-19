<template>
  <gui-page :refresh="true" @reload="reload" :loadMoreText="loadMoreText" :apiLoadingStatus="apiLoadingStatus" :loadmore="true" @loadmorefun="loadMorePracticeHistory" ref="guipage" :customHeader="true" @scroll="bodyScroll">
    <template v-slot:gHeader>
      <view style="height: 44px; padding-top: 20rpx; padding-bottom: 20rpx" class="gui-flex gui-nowrap gui-rows gui-align-items-center gui-justify-content-between gui-space-between header-container">
        <!-- 欢迎语 -->
        <view class="welcome-section">
          <text class="welcome-text">
            欢迎您
            <text class="username-text">{{ userInfo.nickname || userInfo.username || "..." }}</text>
          </text>

          <!-- 科目选择器 -->
          <view class="language-section1" @click="showLanguageSelector">
            <text class="language-text1">{{ currentSubject ? currentSubject.name : "未选择" }}</text>
            <view class="language-dropdown">
              <text class="grace-iconfont dropdown-arrow1">&#xe603;</text>
            </view>
          </view>
        </view>
        <!-- 科目选择器 -->
        <view class="language-section" @click="logout">
          <text class="language-text">退出登录</text>
        </view>
      </view>
    </template>

    <template v-slot:gBody>
      <!-- 练习历史列表 -->
      <view class="practice-history-container">
        <view v-for="(item, index) in practiceHistoryList" :key="item.id || index" class="practice-card">
          <!-- 卡片头部 -->
          <view class="card-header">
            <view class="card-title-section">
              <text class="card-title">{{ item.knowledge_name }}</text>
              <text class="card-difficulty">难度: {{ item.difficulty }}</text>
            </view>
            <text class="card-date">{{ formatDate(item.time) }}</text>
          </view>

          <!-- 题目内容 -->
          <view class="card-question">
            <view class="question-text" v-html="item.title_content"></view>
          </view>

          <!-- 底部状态 -->
          <view class="card-footer">
            <text class="status-text" :class="item.is_correct == 1 ? 'correct' : 'incorrect'">
              {{ item.is_correct == 1 ? "正确" : "错误" }}
            </text>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="practiceHistoryList.length === 0 && !apiLoadingStatus" class="empty-state">
          <view class="empty-image">
            <image src="/static/nodata.png" class="empty-icon" mode="aspectFit" />
          </view>
        </view>
      </view>

      <!-- 科目选择弹窗 -->
      <gui-popup ref="subjectPopup" @close="onPopupClose" position="bottom">
        <view class="subject-popup-content">
          <view class="subject-popup-header">
            <text class="subject-popup-title">选择科目</text>
            <view class="subject-popup-close" @click="closeSubjectPopup">
              <text>✕</text>
            </view>
          </view>
          <scroll-view class="subject-list" scroll-y="true" :show-scrollbar="false">
            <view v-for="(item, index) in subjectList" :key="item.id || index" class="subject-item" :class="{ active: currentSubject && currentSubject.id === item.id }" @click="selectSubject(item)">
              <text class="subject-name">{{ item.name }}</text>
              <view v-if="currentSubject && currentSubject.id === item.id" class="subject-check">✓</view>
            </view>
          </scroll-view>
        </view>
      </gui-popup>
    </template>
  </gui-page>
</template>
<script>
import { getSubjectListApi, getUserInfoApi, getPracticeLogApi } from "@/apis/common.js";
export default {
  data() {
    return {
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
      // 练习历史数据
      practiceHistoryList: [],
      practicePage: 1,
      practicePageSize: 10,
      hasMorePracticeData: true,
      loadMoreText: ["", "数据加载中", "已加载全部数据", "暂无数据"],
    };
  },
  onLoad: async function () {
    // 初始化用户信息和科目数据
    await this.initUserInfo();
    await this.getSubjectList();
    if (uni.getStorageSync("subject")) {
      await this.getPracticeHistory();
    }
  },
  methods: {
    // 初始化用户信息
    async initUserInfo() {
      // 从本地存储或全局状态获取用户信息
      try {
        const userInfo = await getUserInfoApi();
        if (userInfo.code === 0) {
          this.userInfo = userInfo.data;
          uni.setStorageSync("userInfo", userInfo.data);
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
          if (this.subjectList.length > 0 && !uni.getStorageSync("subject")) {
            this.$refs.subjectPopup.open();
          } else {
            this.currentSubject = uni.getStorageSync("subject");
          }
        }
      } catch (error) {
        console.error("获取科目列表失败:", error);
        // 如果API失败，使用模拟数据
        this.subjectList = [];
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

    // 关闭科目选择弹窗（点击关闭按钮时调用）
    closeSubjectPopup() {
      console.log("点击关闭按钮");
      if (this.$refs.subjectPopup) {
        this.$refs.subjectPopup.close();
      }
    },

    // 弹窗关闭事件处理（弹窗组件触发）
    onPopupClose() {
      console.log("弹窗已关闭");
      // 这里可以添加弹窗关闭后的业务逻辑
    },

    // 选择科目
    async selectSubject(subject) {
      console.log("选择了科目:", subject);
      this.currentSubject = subject;
      uni.setStorageSync("subject", subject);
      this.closeSubjectPopup();
      // 这里可以添加切换科目后的逻辑
      await this.onSubjectChange(subject);
    },

    // 科目切换后的处理
    async onSubjectChange(subject) {
      console.log("切换到科目:", subject);
      uni.showToast({
        title: `已切换到${subject.name}`,
        icon: "success",
      });
      // 重置分页状态并重新加载练习历史
      this.practicePage = 1;
      this.hasMorePracticeData = true;
      await this.getPracticeHistory();
    },

    // 获取练习历史
    async getPracticeHistory(isLoadMore = false, isReload = false) {
      try {
        this.apiLoadingStatus = true;
        const params = {
          page: this.practicePage,
          page_size: this.practicePageSize,
          subject_id: this.currentSubject ? this.currentSubject.id : null,
        };

        const res = await getPracticeLogApi(params);
        if (res.code === 0) {
          const newData = res.data.list || [];
          if (res.data.total == 0) {
            this.loadMoreText[2] = "";
          }
          if (isLoadMore) {
            // 加载更多时追加数据
            this.practiceHistoryList = this.practiceHistoryList.concat(newData);
          } else {
            // 首次加载或刷新时替换数据
            this.practiceHistoryList = newData;
            // 下拉刷新
            if (isReload && this.$refs.guipage) {
              this.$refs.guipage.endReload();
            }
          }

          // 判断是否还有更多数据
          this.hasMorePracticeData = newData.length >= this.practicePageSize;

          // 停止加载动画
          if (this.$refs.guipage) {
            this.$refs.guipage.stopLoadmore();
            if (!this.hasMorePracticeData) {
              this.$refs.guipage.nomore();
            }
          }
        } else {
          console.error("获取练习历史失败:", res.msg);
          // 使用模拟数据
          if (isLoadMore) {
            this.practiceHistoryList = this.practiceHistoryList.concat(this.getMockPracticeData());
          } else {
            this.practiceHistoryList = this.getMockPracticeData();
            // 下拉刷新
            if (isReload && this.$refs.guipage) {
              this.$refs.guipage.endReload();
            }
          }
        }
      } catch (error) {
        console.error("获取练习历史失败:", error);
        // 使用模拟数据
        if (isLoadMore) {
          this.practiceHistoryList = this.practiceHistoryList.concat(this.getMockPracticeData());
        } else {
          this.practiceHistoryList = this.getMockPracticeData();
          // 下拉刷新
          if (isReload && this.$refs.guipage) {
            this.$refs.guipage.endReload();
          }
        }
      } finally {
        this.apiLoadingStatus = false;
      }
    },

    // 获取模拟练习数据
    getMockPracticeData() {
      return [
        {
          id: 1,
          title: "集合的概念",
          difficulty: 3,
          question: "到定点(1, 0, 0)的距离小于或等于1的点的集合是()",
          options: [
            { label: "A", content: "{(x, y, z)|(x-1)²+y²+z²≤1}" },
            { label: "B", content: "{(x, y, z)|(x-1)²+y²+z²=1}" },
            { label: "C", content: "{(x-1)+y+z≤1}" },
            { label: "D", content: "{(x, y, z)|x²+y²+z≤1}" },
          ],
          is_correct: true,
          created_at: "2024-10-08",
        },
        {
          id: 2,
          title: "集合的概念",
          difficulty: 3,
          question: "到定点(1, 0, 0)的距离小于或等于1的点的集合是()",
          options: [
            { label: "A", content: "{(x, y, z)|(x-1)²+y²+z²≤1}" },
            { label: "B", content: "{(x, y, z)|(x-1)²+y²+z²=1}" },
            { label: "C", content: "{(x-1)+y+z≤1}" },
            { label: "D", content: "{(x, y, z)|x²+y²+z≤1}" },
          ],
          is_correct: false,
          created_at: "2024-10-08",
        },
      ];
    },

    // 获取选项数据
    getOptions(item) {
      if (item.options && Array.isArray(item.options)) {
        return item.options;
      }
      // 默认选项
      return [
        { label: "A", content: "{(x, y, z)|(x-1)²+y²+z²≤1}" },
        { label: "B", content: "{(x, y, z)|(x-1)²+y²+z²=1}" },
        { label: "C", content: "{(x-1)+y+z≤1}" },
        { label: "D", content: "{(x, y, z)|x²+y²+z≤1}" },
      ];
    },

    // 下拉刷新
    reload() {
      this.practicePage = 1;
      this.hasMorePracticeData = true;
      this.getPracticeHistory(false, true);
    },

    // 加载更多练习历史
    async loadMorePracticeHistory() {
      if (!this.hasMorePracticeData) {
        return;
      }

      this.practicePage++;
      await this.getPracticeHistory(true);
    },

    // 滚动区域滚动事件
    bodyScroll(e) {
      console.log("滚动位置:", e.detail.scrollTop);
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    // 退出登录
    logout() {
      // 二次确认
      uni.showModal({
        title: "提示",
        content: "确定退出登录吗",
        success: (res) => {
          if (res.confirm) {
            uni.clearStorageSync();
            uni.reLaunch({
              url: "/pages/login/login",
            });
          }
        },
      });
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
  background: #15abbe;
  border-radius: 40rpx;
  padding: 16rpx 36rpx;
}
/* 科目选择器样式 */
.language-section1 {
  display: flex;
  align-items: center;
  border-radius: 12rpx;
  border: 1rpx solid #15abbe;
  margin-top: 10rpx;
  padding: 8rpx 16rpx;
}
.language-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
  margin-right: 12rpx;
}

.language-text1 {
  font-size: 28rpx;
  color: #15abbe;
  font-weight: 500;
  margin-right: 12rpx;
}

.language-dropdown {
  display: flex;
  align-items: center;
}

.dropdown-arrow {
  font-size: 20rpx;
  color: #fff;
  transition: transform 0.3s ease;
}

.dropdown-arrow1 {
  font-size: 20rpx;
  color: #15abbe;
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
  display: flex;
  flex-direction: column;
}

.subject-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  color: #000;
}

.subject-popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000;
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
  color: #000;
}

.subject-list {
  max-height: 600rpx;
  /* APP端滚动优化 */
  -webkit-overflow-scrolling: touch;
  /* 确保scroll-view有明确的高度 */
  height: 600rpx;
  /* 确保内容可以滚动 */
  flex: 1;
  /* 防止内容溢出 */
  overflow: hidden;
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

/* 练习历史样式 */
.practice-history-container {
  padding: 20rpx;
}

.practice-card {
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  padding-bottom: 20rpx;
}

.card-title-section {
  flex: 1;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.card-difficulty {
  font-size: 24rpx;
  color: #666666;
  display: block;
}

.card-date {
  font-size: 24rpx;
  color: #999999;
}

.card-question {
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.question-text {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.6;
}

.card-options {
  margin-bottom: 24rpx;
}

.option-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12rpx;
}

.option-label {
  font-size: 26rpx;
  color: #333333;
  font-weight: 500;
  margin-right: 12rpx;
  min-width: 40rpx;
}

.option-content {
  font-size: 26rpx;
  color: #666666;
  flex: 1;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.status-text {
  font-size: 24rpx;
  font-weight: 500;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.status-text.correct {
  color: #52c41a;
  background: #f6ffed;
  border: 1rpx solid #b7eb8f;
}

.status-text.incorrect {
  color: #ff4d4f;
  background: #fff2f0;
  border: 1rpx solid #ffccc7;
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;
}

.empty-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.empty-icon {
  width: 400rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
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

  .practice-card {
    padding: 24rpx;
  }

  .card-title {
    font-size: 30rpx;
  }

  .question-text {
    font-size: 26rpx;
  }
}
</style>
