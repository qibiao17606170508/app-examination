<template>
  <gui-page :isLoading="pageLoading" :refresh="true" @reload="reload" :apiLoadingStatus="apiLoadingStatus" ref="guipage" @scroll="bodyScroll">
    <template v-slot:gBody>
      <!-- 无数据状态 -->
      <view v-if="noData" class="no-data">
        <view class="no-data-image">
          <image src="/static/1.png" class="analyze-icon" mode="aspectFit" />
        </view>
        <text class="no-data-text">您尚未分析过错题</text>
        <view class="analyze-button" @click="analyzeErrors">
          <text class="analyze-button-text">分析错题</text>
        </view>
      </view>

      <!-- 有数据状态 -->
      <view v-else class="analyze-list">
        <view class="report-card">
          <view class="report-header">
            <text class="report-title">错题分析报告</text>
          </view>

          <view v-for="(item, index) in analyzeList" :key="item.id || index" class="analyze-item">
            <view class="time-section">
              <text class="time-diff">{{ item.time_diff }}</text>
              <text class="time">{{ item.time }}</text>
            </view>
            <view class="details-content" v-html="item.details"></view>
          </view>
        </view>

        <view class="analyze-again">
          <view class="analyze-button" @click="analyzeErrors">
            <text class="analyze-button-text">再次分析</text>
          </view>
        </view>
      </view>
    </template>
  </gui-page>
</template>

<script>
import { getPracticeAnalyzeApi, setPracticeAnalyzeApi, getUserInfoApi } from "@/apis/common.js";

export default {
  data() {
    return {
      // 页面加载状态
      pageLoading: true,
      // 用于记录是否有 api 请求正在执行
      apiLoadingStatus: false,
      // 错题分析数据
      analyzeList: [],
      // 是否无数据
      noData: false,
      // 用户信息
      userInfo: {
        nickname: "",
        username: "",
      },
      // 当前科目ID
      currentSubjectId: null,
    };
  },
  onLoad: async function () {
    // 获取用户信息
    await this.initUserInfo();
    // 获取当前科目ID
    this.currentSubjectId = uni.getStorageSync("subject")?.id || null;
    // 加载错题分析数据
    await this.getAnalyzeList();
  },
  onShow: function () {
    // 页面显示时检查科目是否变化
    const newSubjectId = uni.getStorageSync("subject")?.id || null;
    if (newSubjectId !== this.currentSubjectId) {
      this.currentSubjectId = newSubjectId;
      this.getAnalyzeList();
    }
  },
  methods: {
    // 初始化用户信息
    async initUserInfo() {
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

    // 获取错题分析列表
    async getAnalyzeList(isReload = false) {
      try {
        this.apiLoadingStatus = true;
        const params = {
          subject_id: this.currentSubjectId,
        };

        const res = await getPracticeAnalyzeApi(params);
        if (res.code === 0) {
          this.analyzeList = res.data.list || [];
          this.noData = this.analyzeList.length === 0;
          this.pageLoading = false;

          // 下拉刷新
          if (isReload && this.$refs.guipage) {
            this.$refs.guipage.endReload();
          }
        } else {
          console.error("获取错题分析失败:", res.msg);
          uni.showToast({
            title: res.msg || "获取数据失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取错题分析失败:", error);
        uni.showToast({
          title: "网络错误，请重试",
          icon: "none",
        });
      } finally {
        this.apiLoadingStatus = false;
      }
    },

    // 分析错题
    async analyzeErrors() {
      try {
        uni.showLoading({
          title: "分析中...",
        });

        const params = {
          subject_id: this.currentSubjectId,
        };

        const res = await setPracticeAnalyzeApi(params);
        if (res.code === 0) {
          uni.hideLoading();
          uni.showToast({
            title: "分析成功",
            icon: "success",
          });
          // 重新获取分析列表
          await this.getAnalyzeList();
        } else {
          uni.hideLoading();
          uni.showToast({
            title: res.msg || "分析失败",
            icon: "none",
          });
        }
      } catch (error) {
        uni.hideLoading();
        console.error("分析错题失败:", error);
        uni.showToast({
          title: "网络错误，请重试",
          icon: "none",
        });
      }
    },

    // 下拉刷新
    reload() {
      this.getAnalyzeList(true);
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
  },
};
</script>

<style>
page {
  background: #fff;
}
</style>

<style scoped>
/* 头部容器样式 */
.header-container {
  padding: 0 30rpx;
  background: #fff;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

/* 无数据状态样式 */
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 40rpx;
  min-height: 60vh;
}

.no-data-image {
  margin-bottom: 40rpx;
}

.analyze-icon {
  width: 480rpx;
  height: 320rpx;
}

.no-data-text {
  font-size: 32rpx;
  color: #333333;
  margin-bottom: 60rpx;
  text-align: center;
}

/* 分析按钮样式 */
.analyze-button {
  background: #15abbe;
  border-radius: 8rpx;
  padding: 24rpx 60rpx;
  min-width: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analyze-button-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
}

/* 有数据状态样式 */
.analyze-list {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.report-card {
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  padding: 40rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.report-header {
  margin-bottom: 40rpx;
}

.report-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

.analyze-item {
  margin-bottom: 40rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.analyze-item:last-child {
  border-bottom: none;
}

.time-section {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.time-diff {
  font-size: 32rpx;
  color: #15abbe;
  font-weight: 600;
}

.time {
  font-size: 28rpx;
  color: #999999;
  font-weight: 500;
  margin-left: 20rpx;
}

.details-content {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.6;
  white-space: pre-wrap;
}

.analyze-again {
  display: flex;
  justify-content: center;
  margin-top: 60rpx;
}

/* 响应式调整 */
@media (max-width: 750rpx) {
  .header-container {
    padding: 0 20rpx;
  }

  .page-title {
    font-size: 32rpx;
  }

  .analyze-icon {
    width: 400rpx;
    height: 260rpx;
  }

  .no-data-text {
    font-size: 28rpx;
  }

  .analyze-button {
    padding: 20rpx 50rpx;
  }

  .analyze-button-text {
    font-size: 28rpx;
  }

  .report-card {
    padding: 30rpx;
  }

  .report-title {
    font-size: 32rpx;
  }

  .time-diff {
    font-size: 28rpx;
  }

  .time {
    font-size: 24rpx;
  }

  .details-content {
    font-size: 26rpx;
  }
}
</style>
