<template>
  <gui-page :isLoading="pageLoading" :refresh="true" @reload="reload" :apiLoadingStatus="apiLoadingStatus" :loadmore="true" @loadmorefun="loadMorePractice" ref="guipage" :customHeader="false" @scroll="bodyScroll">
    <template v-slot:gBody>
      <!-- 练习统计列表 -->
      <view class="practice-container">
        <view v-for="(item, index) in practiceList" :key="item.id || index" class="practice-card">
          <!-- 卡片头部 -->
          <view class="card-header">
            <view class="card-title-section">
              <text class="card-main-title">{{ item.level1_name }} - {{ item.level2_name }}</text>
              <text class="card-sub-title">{{ item.name }}</text>
            </view>
          </view>

          <!-- 分割线 -->
          <!-- <view class="card-divider"></view> -->

          <!-- 统计区域 -->
          <view class="card-stats">
            <!-- 累计次数 -->
            <view class="stat-item">
              <text class="stat-number">{{ item.practice_total_num || 0 }}</text>
              <text class="stat-label">累计次数</text>
            </view>

            <!-- 难度1 -->
            <view class="stat-item">
              <text class="stat-number">{{ item.difficulty1_percentage || 0 }}</text>
              <text class="stat-label">难度 1</text>
            </view>

            <!-- 难度2 -->
            <view class="stat-item">
              <text class="stat-number">{{ item.difficulty2_percentage || 0 }}</text>
              <text class="stat-label">难度 2</text>
            </view>

            <!-- 难度3 -->
            <view class="stat-item">
              <text class="stat-number">{{ item.difficulty3_percentage || 0 }}</text>
              <text class="stat-label">难度 3</text>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="practiceList.length === 0 && !apiLoadingStatus" class="empty-state">
          <text class="empty-text">暂无练习数据</text>
        </view>
      </view>
    </template>
  </gui-page>
</template>
<script>
import { getPracticeStatisticsApi } from "@/apis/common.js";

export default {
  data() {
    return {
      // 页面加载状态
      pageLoading: true,
      // 用于记录是否有 api 请求正在执行
      apiLoadingStatus: false,
      // 练习统计数据
      practiceList: [],
      practicePage: 1,
      practicePageSize: 10,
      hasMorePracticeData: true,
      // 当前科目ID
      currentSubjectId: null,
    };
  },
  onLoad: async function () {
    // 获取当前科目ID
    this.currentSubjectId = uni.getStorageSync("subject")?.id || null;
    // 加载练习统计
    await this.getPracticeStatistics();
  },
  onShow: function () {
    // 页面显示时检查科目是否变化
    const newSubjectId = uni.getStorageSync("subject")?.id || null;
    if (newSubjectId !== this.currentSubjectId) {
      this.currentSubjectId = newSubjectId;
      this.practicePage = 1;
      this.hasMorePracticeData = true;
      this.getPracticeStatistics();
    }
  },
  methods: {
    // 获取练习统计
    async getPracticeStatistics(isLoadMore = false, isReload = false) {
      try {
        this.apiLoadingStatus = true;
        const params = {
          page: this.practicePage,
          page_size: this.practicePageSize,
          subject_id: this.currentSubjectId,
        };

        const res = await getPracticeStatisticsApi(params);
        if (res.code === 0) {
          const newData = res.data.list || [];
          if (isLoadMore) {
            // 加载更多时追加数据
            this.practiceList = this.practiceList.concat(newData);
          } else {
            // 首次加载或刷新时替换数据
            this.practiceList = newData;
            this.pageLoading = false;
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
          console.error("获取练习统计失败:", res.msg);
          uni.showToast({
            title: res.msg || "获取数据失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取练习统计失败:", error);
        uni.showToast({
          title: "网络错误，请重试",
          icon: "none",
        });
      } finally {
        this.apiLoadingStatus = false;
      }
    },

    // 下拉刷新
    reload() {
      this.practicePage = 1;
      this.hasMorePracticeData = true;
      this.getPracticeStatistics(false, true);
    },

    // 加载更多练习统计
    async loadMorePractice() {
      if (!this.hasMorePracticeData) {
        return;
      }

      this.practicePage++;
      await this.getPracticeStatistics(true);
    },

    // 滚动区域滚动事件
    bodyScroll(e) {
      console.log("滚动位置:", e.detail.scrollTop);
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

/* 练习容器样式 */
.practice-container {
  padding: 20rpx;
}

.practice-card {
  background: #f8f9fa;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

/* 卡片头部样式 */
.card-header {
  background: linear-gradient(270deg, rgba(238, 238, 238, 0.12) 0%, #e9e9e9 100%);
}

.card-title-section {
  display: flex;
  padding: 10rpx 30rpx;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.card-main-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8rpx;
}

.card-sub-title {
  font-size: 28rpx;
  color: #4e5969;
}

/* 分割线样式 */
.card-divider {
  height: 1rpx;
  background: #e0e0e0;
  margin: 0rpx 0 20rpx 0;
}

/* 统计区域样式 */
.card-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-number {
  font-size: 36rpx;
  font-weight: 600;
  color: #15abbe;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666666;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 100rpx 0;
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

  .page-title {
    font-size: 32rpx;
  }

  .practice-card {
    padding: 24rpx;
  }

  .card-main-title {
    font-size: 30rpx;
  }

  .card-sub-title {
    font-size: 26rpx;
  }

  .stat-number {
    font-size: 32rpx;
  }

  .stat-label {
    font-size: 22rpx;
  }
}
</style>
