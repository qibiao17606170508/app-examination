<template>
  <gui-page :refresh="true" @reload="reload" :loadMoreText="loadMoreText" :apiLoadingStatus="apiLoadingStatus" :loadmore="true" @loadmorefun="loadMorePractice" ref="guipage" :customHeader="false" @scroll="bodyScroll">
    <template v-slot:gBody>
      <!-- 练习列表 -->
      <view class="practice-container">
        <view v-for="(item, index) in practiceList" :key="item.id || index" class="practice-card">
          <!-- 卡片头部 -->
          <view class="card-header">
            <view class="card-title-section">
              <text class="card-main-title">{{ item.name }}</text>
            </view>
            <view class="card-status-section">
              <text class="card-status" :class="item.status == 1 ? 'submitted' : 'not-submitted'">
                {{ item.status == 1 ? "已提交" : "未提交" }}
              </text>
            </view>
          </view>

          <!-- 卡片底部 -->
          <view class="card-footer">
            <view class="card-time-section">
              <text class="card-time">考试时间: {{ formatDate(item.time) }}</text>
            </view>
            <view class="card-action-section">
              <view class="register-button" @click="registerWrongQuestions(item)">
                <text class="register-button-text">登记错题</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="practiceList.length === 0 && !apiLoadingStatus" class="empty-state">
          <view class="empty-image">
            <image src="/static/nodata.png" class="empty-icon" mode="aspectFit" />
          </view>
        </view>
      </view>

      <!-- 题目选择弹框 -->
      <gui-popup ref="topicPopup" @close="onTopicPopupClose" position="bottom">
        <view class="topic-popup-content">
          <view class="topic-popup-header">
            <text class="topic-popup-title">登记错题</text>
            <view class="topic-popup-close" @click="closeTopicPopup">
              <text>✕</text>
            </view>
          </view>

          <!-- 题目列表 -->
          <view class="topic-list-container">
            <view v-if="topicList.length === 0 && !topicLoading" class="topic-empty">
              <text class="topic-empty-text">暂无题目数据</text>
            </view>
            <view v-else class="topic-list">
              <view v-for="(item, index) in topicList" :key="item.id || index" class="topic-item" :class="{ selected: isTopicSelected(item.id) }" @click="toggleTopicSelection(item)">
                <view class="topic-checkbox">
                  <text v-if="isTopicSelected(item.id)" class="checkbox-checked">✓</text>
                </view>
                <view class="topic-content">
                  <text class="topic-number">题目{{ index + 1 }}</text>
                  <view class="topic-title" v-html="item.title_content"></view>
                </view>
              </view>
            </view>
          </view>

          <!-- 弹框底部 -->
          <view class="topic-popup-footer">
            <view class="selected-count">
              <text class="selected-text">已选择 {{ selectedTopics.length }} 题</text>
            </view>
            <view class="topic-actions">
              <view class="cancel-button" @click="closeTopicPopup">
                <text class="cancel-button-text">取消</text>
              </view>
              <view class="confirm-button" @click="submitTopics">
                <text class="confirm-button-text">确认</text>
              </view>
            </view>
          </view>
        </view>
      </gui-popup>
    </template>
  </gui-page>
</template>

<script>
import { getPapersApi, getTopicsApi, setTopicsApi } from "@/apis/common.js";

export default {
  data() {
    return {
      // 用于记录是否有 api 请求正在执行
      apiLoadingStatus: false,
      // 试卷列表数据
      practiceList: [],
      practicePage: 1,
      practicePageSize: 10,
      hasMorePracticeData: true,
      // 当前科目ID
      currentSubjectId: null,
      // 题目选择相关
      topicList: [],
      selectedTopics: [],
      currentPapersId: null,
      topicLoading: false,
      loadMoreText: ["", "数据加载中", "已加载全部数据", "暂无数据"],
    };
  },
  onLoad: async function () {
    // 获取当前科目ID
    this.currentSubjectId = uni.getStorageSync("subject")?.id || null;
    // 加载练习列表
    await this.getPracticeList();
  },
  onShow: function () {
    // 页面显示时检查科目是否变化
    const newSubjectId = uni.getStorageSync("subject")?.id || null;
    if (newSubjectId !== this.currentSubjectId) {
      this.currentSubjectId = newSubjectId;
      this.practicePage = 1;
      this.hasMorePracticeData = true;
      this.getPracticeList();
    }
  },
  methods: {
    // 获取试卷列表
    async getPracticeList(isLoadMore = false, isReload = false) {
      try {
        this.apiLoadingStatus = true;
        const params = {
          page: this.practicePage,
          page_size: this.practicePageSize,
          subject_id: this.currentSubjectId,
        };

        const res = await getPapersApi(params);
        if (res.code === 0) {
          const newData = res.data.list || [];
          if (res.data.total == 0) {
            this.loadMoreText[2] = "";
          }
          if (isLoadMore) {
            // 加载更多时追加数据
            this.practiceList = this.practiceList.concat(newData);
          } else {
            // 首次加载或刷新时替换数据
            this.practiceList = newData;
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
          console.error("获取试卷列表失败:", res.msg);
          uni.showToast({
            title: res.msg || "获取数据失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取试卷列表失败:", error);
        uni.showToast({
          title: "网络错误，请重试",
          icon: "none",
        });
      } finally {
        this.apiLoadingStatus = false;
      }
    },

    // 登记错题
    async registerWrongQuestions(item) {
      console.log("登记错题:", item);
      this.currentPapersId = item.id;
      this.selectedTopics = [];
      await this.getTopics();
      if (this.$refs.topicPopup) {
        this.$refs.topicPopup.open();
      }
    },

    // 获取题目列表
    async getTopics() {
      try {
        this.topicLoading = true;
        const params = {
          papers_id: this.currentPapersId,
        };

        const res = await getTopicsApi(params);
        if (res.code === 0) {
          this.topicList = res.data.list || [];
        } else {
          console.error("获取题目列表失败:", res.msg);
          uni.showToast({
            title: res.msg || "获取题目失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取题目列表失败:", error);
        uni.showToast({
          title: "网络错误，请重试",
          icon: "none",
        });
      } finally {
        this.topicLoading = false;
      }
    },

    // 切换题目选择状态
    toggleTopicSelection(topic) {
      const index = this.selectedTopics.findIndex((item) => item.id === topic.id);
      if (index > -1) {
        this.selectedTopics.splice(index, 1);
      } else {
        this.selectedTopics.push(topic);
      }
    },

    // 检查题目是否已选择
    isTopicSelected(topicId) {
      return this.selectedTopics.some((item) => item.id === topicId);
    },

    // 关闭题目弹框
    closeTopicPopup() {
      if (this.$refs.topicPopup) {
        this.$refs.topicPopup.close();
      }
    },

    // 题目弹框关闭事件
    onTopicPopupClose() {
      console.log("题目弹框已关闭");
    },

    // 提交选中的题目
    async submitTopics() {
      if (this.selectedTopics.length === 0) {
        uni.showToast({
          title: "请选择题目",
          icon: "none",
        });
        return;
      }

      try {
        uni.showLoading({
          title: "提交中...",
        });

        const params = {
          papers_id: this.currentPapersId,
          topic_ids: this.selectedTopics.map((item) => item.id).join(","),
        };

        const res = await setTopicsApi(params);
        if (res.code === 0) {
          uni.hideLoading();
          uni.showToast({
            title: "提交成功",
            icon: "success",
          });
          this.closeTopicPopup();
          // 重新加载试卷列表
          await this.getPracticeList();
        } else {
          uni.hideLoading();
          uni.showToast({
            title: res.msg || "提交失败",
            icon: "none",
          });
        }
      } catch (error) {
        uni.hideLoading();
        console.error("提交题目失败:", error);
        uni.showToast({
          title: "网络错误，请重试",
          icon: "none",
        });
      }
    },

    // 下拉刷新
    reload() {
      this.practicePage = 1;
      this.hasMorePracticeData = true;
      this.getPracticeList(false, true);
    },

    // 加载更多练习列表
    async loadMorePractice() {
      if (!this.hasMorePracticeData) {
        return;
      }

      this.practicePage++;
      await this.getPracticeList(true);
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
  background: #f5f5f5;
}
</style>

<style scoped>
/* 练习容器样式 */
.practice-container {
  padding: 20rpx;
}

.practice-card {
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-title-section {
  flex: 1;
}

.card-main-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.card-status-section {
  margin-left: 20rpx;
}

.card-status {
  font-size: 28rpx;
  font-weight: 500;
}

.card-status.submitted {
  color: #15abbe;
}

.card-status.not-submitted {
  color: #ff4d4f;
}

/* 卡片底部样式 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-time-section {
  flex: 1;
}

.card-time {
  font-size: 28rpx;
  color: #666666;
}

.card-action-section {
  margin-left: 20rpx;
}

.register-button {
  background: #15abbe;
  border-radius: 8rpx;
  padding: 16rpx 32rpx;
  min-width: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-button-text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

/* 空状态样式 */
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
  .practice-card {
    padding: 24rpx;
  }

  .card-main-title {
    font-size: 30rpx;
  }

  .card-status {
    font-size: 26rpx;
  }

  .card-time {
    font-size: 26rpx;
  }

  .register-button {
    padding: 14rpx 28rpx;
  }

  .register-button-text {
    font-size: 26rpx;
  }
}

/* 题目选择弹框样式 */
.topic-popup-content {
  background: #ffffff;
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
  max-height: 80vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.topic-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.topic-popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.topic-popup-close {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #333333;
}

.topic-list-container {
  flex: 1;
  overflow: hidden;
  max-height: 60vh;
}

.topic-empty {
  text-align: center;
  padding: 100rpx 0;
}

.topic-empty-text {
  font-size: 28rpx;
  color: #999999;
}

.topic-list {
  padding: 20rpx;
}

.topic-item {
  display: flex;
  align-items: flex-start;
  padding: 20rpx;
  margin-bottom: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s ease;
}

.topic-item.selected {
  background: #e3f2fd;
  border-color: #15abbe;
}

.topic-checkbox {
  width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
  border: 2rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  margin-top: 4rpx;
  flex-shrink: 0;
}

.topic-item.selected .topic-checkbox {
  background: #15abbe;
  border-color: #15abbe;
}

.checkbox-checked {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 600;
}

.topic-content {
  flex: 1;
}

.topic-number {
  font-size: 24rpx;
  color: #15abbe;
  font-weight: 600;
  margin-bottom: 8rpx;
  display: block;
}

.topic-title {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.6;
  display: block;
}

.topic-popup-footer {
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
  background: #ffffff;
}

.selected-count {
  margin-bottom: 20rpx;
  text-align: center;
}

.selected-text {
  font-size: 28rpx;
  color: #666666;
}

.topic-actions {
  display: flex;
  gap: 20rpx;
}

.cancel-button {
  flex: 1;
  background: #f5f5f5;
  border-radius: 8rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-button-text {
  font-size: 32rpx;
  color: #666666;
  font-weight: 500;
}

.confirm-button {
  flex: 1;
  background: #15abbe;
  border-radius: 8rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-button-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
}
</style>
