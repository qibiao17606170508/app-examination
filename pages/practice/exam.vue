<template>
  <gui-page :apiLoadingStatus="apiLoadingStatus">
    <template v-slot:gBody>
      <view class="exam-container" v-if="currentQuestion">
        <!-- 题目类型和进度 -->
        <view class="question-header">
          <view class="question-type">
            <text class="type-tag" :class="getTypeClass(currentQuestion.type)">
              {{ getTypeText(currentQuestion.type) }}
            </text>
          </view>
          <view class="question-progress">
            <text class="progress-text">{{ currentIndex + 1 }}/{{ totalQuestions }}</text>
          </view>
        </view>

        <!-- 题目内容 -->
        <view class="question-content">
          <view class="question-title" v-html="currentQuestion.title_content"></view>

          <!-- 题目图片 -->
          <view class="question-image" v-if="currentQuestion.image">
            <image :src="currentQuestion.image" mode="aspectFit" class="question-img" />
          </view>
        </view>

        <!-- 选择题选项 -->
        <view class="answer-options" v-if="currentQuestion.type === 1 || currentQuestion.type === 4">
          <view
            v-for="(option, index) in getOptions(currentQuestion)"
            :key="index"
            class="option-item"
            :class="{
              'option-selected': option.active,
              'option-correct': isCorrectAnswer(option),
              'option-wrong': isWrongAnswer(option),
            }"
            @click="selectOption(option)"
          >
            <view class="option-content">
              <view class="option-key">{{ option.key }}</view>
              <view class="option-text" v-html="option.value"></view>
            </view>
            <view class="option-icon" v-if="currentQuestion.submit">
              <text v-if="isCorrectAnswer(option)" class="icon-correct">✓</text>
              <text v-if="isWrongAnswer(option)" class="icon-wrong">✗</text>
            </view>
          </view>
        </view>

        <!-- 填空题输入 -->
        <view class="answer-input" v-if="currentQuestion.type === 2">
          <input
            v-model="currentQuestion.answer_content"
            placeholder="请输入您的答案"
            :disabled="currentQuestion.submit"
            class="input-field"
            :class="{
              'input-correct': isInputCorrect(),
              'input-wrong': isInputWrong(),
            }"
          />
        </view>

        <!-- 应用题输入 -->
        <view class="answer-textarea" v-if="currentQuestion.type === 3">
          <textarea v-model="currentQuestion.answer_content" placeholder="请输入您的答案" :disabled="currentQuestion.submit" class="textarea-field" :rows="5" />
        </view>

        <!-- 答题结果 -->
        <view class="answer-result" v-if="currentQuestion.submit">
          <!-- 正确答案 -->
          <view class="result-correct" v-if="isAnswerCorrect()">
            <text class="result-icon">🎉</text>
            <text class="result-text">恭喜你，回答正确！</text>
          </view>

          <!-- 错误答案 -->
          <view class="result-wrong" v-if="!isAnswerCorrect()">
            <text class="result-icon">😔</text>
            <text class="result-text">很遗憾，回答错误。正确答案是</text>
            <text class="correct-answer" v-html="currentQuestion.answer"></text>
          </view>

          <!-- 题目解析 -->
          <view class="question-analysis" v-if="currentQuestion.analysis">
            <text class="analysis-title">解析：</text>
            <view class="analysis-content" v-html="currentQuestion.analysis"></view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="!currentQuestion" class="empty-state">
        <text class="empty-text">暂无题目数据</text>
      </view>

      <!-- 卡片内操作按钮 -->
      <view class="card-actions" v-if="currentQuestion">
        <view class="nav-buttons">
          <view class="nav-button" @click="prevQuestion" v-if="currentIndex > 0">
            <text class="nav-text">上一题</text>
          </view>
          <view class="nav-button" @click="nextQuestion" v-if="currentIndex < totalQuestions - 1">
            <text class="nav-text">下一题</text>
          </view>
        </view>

        <view class="action-buttons">
          <view class="action-button" @click="skipQuestion" v-if="!currentQuestion.submit">
            <text class="action-text">不会</text>
          </view>
          <view class="action-button primary" @click="continueNext" v-if="currentQuestion.submit && currentIndex < totalQuestions - 1">
            <text class="action-text">继续</text>
          </view>
          <view class="action-button primary" @click="submitAnswer" v-if="!currentQuestion.submit">
            <text class="action-text">提交</text>
          </view>
        </view>
      </view>
      <!-- 固定退出按钮 -->
      <view class="exit-button-container" v-if="currentQuestion">
        <view class="exit-button" @click="exitExam">
          <text class="exit-text">退出</text>
        </view>
        <gui-iphone-bottom></gui-iphone-bottom>
      </view>
    </template>
  </gui-page>
</template>

<script>
import { getPracticeListRandomApi, setPracticeAddApi } from "@/apis/common.js";
export default {
  data() {
    return {
      // API加载状态
      apiLoadingStatus: false,
      // 考试参数
      examParams: {},
      // 题目列表
      questionList: [],
      // 当前题目索引
      currentIndex: 0,
      // 总题目数
      totalQuestions: 0,
      // 当前题目
      currentQuestion: null,
    };
  },
  onLoad(options) {
    // 解析传递的参数
    if (options.params) {
      try {
        this.examParams = JSON.parse(decodeURIComponent(options.params));
        this.loadQuestions();
      } catch (error) {
        console.error("解析参数失败:", error);
        uni.showToast({
          title: "参数错误",
          icon: "none",
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    } else {
      uni.showToast({
        title: "缺少必要参数",
        icon: "none",
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  methods: {
    // 加载题目
    async loadQuestions() {
      try {
        this.apiLoadingStatus = true;
        const params = {
          subject_id: this.examParams.subject_id,
          knowledge_id: this.examParams.knowledge_id,
          difficulty: this.examParams.difficulty,
        };

        const res = await getPracticeListRandomApi(params);
        if (res.code === 0) {
          if (res.data.total === 0) {
            uni.showToast({
              title: "该知识点没有题目",
              icon: "none",
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
            return;
          }

          this.totalQuestions = res.data.total;
          this.questionList = res.data.list;
          this.currentIndex = 0;
          this.currentQuestion = this.questionList[0];
        } else {
          console.error("获取题目失败:", res.msg);
          uni.showToast({
            title: res.msg || "获取题目失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取题目失败:", error);
        uni.showToast({
          title: "网络错误，请重试",
          icon: "none",
        });
      } finally {
        this.apiLoadingStatus = false;
      }
    },

    // 获取题目类型文本
    getTypeText(type) {
      const typeMap = {
        1: "选择题",
        2: "填空题",
        3: "应用题",
        4: "判断题",
      };
      return typeMap[type] || "未知题型";
    },

    // 获取题目类型样式类
    getTypeClass(type) {
      const classMap = {
        1: "type-choice",
        2: "type-fill",
        3: "type-application",
        4: "type-judge",
      };
      return classMap[type] || "type-default";
    },

    // 获取选项列表
    getOptions(question) {
      if (question.type === 1 || question.type === 4) {
        try {
          const options = JSON.parse(question.title_content_extend);
          return options.map((option) => ({
            key: option.key,
            value: option.value,
            active: option.active || false,
          }));
        } catch (error) {
          console.error("解析选项失败:", error);
          return [];
        }
      }
      return [];
    },

    // 选择选项
    selectOption(option) {
      if (this.currentQuestion.submit) return;

      // 更新选项状态 - 按照template的逻辑
      const titleContentExtend = JSON.parse(this.currentQuestion.title_content_extend);
      titleContentExtend.forEach((item) => {
        item.active = false;
        if (item.key === option.key) {
          item.active = true;
          this.currentQuestion.answer_content = item.key;
        }
      });
      this.currentQuestion.title_content_extend = JSON.stringify(titleContentExtend);
    },

    // 判断是否为正确答案
    isCorrectAnswer(option) {
      return this.currentQuestion.submit && this.currentQuestion.answer_content === this.currentQuestion.answer && option.active;
    },

    // 判断是否为错误答案
    isWrongAnswer(option) {
      return this.currentQuestion.submit && this.currentQuestion.answer_content !== this.currentQuestion.answer && option.active;
    },

    // 判断输入是否正确
    isInputCorrect() {
      return this.currentQuestion.submit && this.currentQuestion.answer_content === this.currentQuestion.answer;
    },

    // 判断输入是否错误
    isInputWrong() {
      return this.currentQuestion.submit && this.currentQuestion.answer_content !== this.currentQuestion.answer;
    },

    // 判断答案是否正确
    isAnswerCorrect() {
      return this.currentQuestion.submit && this.currentQuestion.answer_content === this.currentQuestion.answer;
    },

    // 提交答案
    async submitAnswer() {
      // 验证是否已选择答案 - 按照template的逻辑
      let flag = false;
      if (this.currentQuestion.type === 1 || this.currentQuestion.type === 4) {
        JSON.parse(this.currentQuestion.title_content_extend).forEach((item) => {
          if (item.active) {
            flag = true;
          }
        });
      }
      if ((this.currentQuestion.type === 2 || this.currentQuestion.type === 3) && this.currentQuestion.answer_content) {
        flag = true;
      }

      if (!flag) {
        const message = this.currentQuestion.type === 1 || this.currentQuestion.type === 4 ? "选择答案之后才能提交" : "填写答案之后才能提交";

        uni.showModal({
          title: "提示",
          content: message,
          showCancel: false,
          confirmText: "我知道了",
        });
        return;
      }

      try {
        // 设置答案正确性
        if (this.currentQuestion.answer_content === this.currentQuestion.answer) {
          this.currentQuestion.is_correct = 1;
        } else {
          this.currentQuestion.is_correct = 2;
        }

        // 先设置submit状态 - 按照template的逻辑
        if (this.currentQuestion.type === 1 || this.currentQuestion.type === 4) {
          this.currentQuestion.submit = true;
          JSON.parse(this.currentQuestion.title_content_extend).forEach((item) => {
            if (item.active) {
              this.currentQuestion.answer_content = item.key;
            }
          });
        } else if (this.currentQuestion.type === 2 || this.currentQuestion.type === 3) {
          this.currentQuestion.submit = true;
        }

        // 提交答案到服务器
        const params = {
          topic_id: this.currentQuestion.id,
          is_correct: this.currentQuestion.is_correct,
          subject_id: this.currentQuestion.subject_id,
          answer_content: this.currentQuestion.answer_content,
        };

        await setPracticeAddApi(params);

        uni.showToast({
          title: "提交成功",
          icon: "success",
        });
      } catch (error) {
        console.error("提交答案失败:", error);
        uni.showToast({
          title: "提交失败，请重试",
          icon: "none",
        });
      }
    },

    // 跳过题目
    skipQuestion() {
      this.currentQuestion.answer_content = "";
      this.currentQuestion.submit = true;
    },

    // 上一题
    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.currentQuestion = this.questionList[this.currentIndex];
      }
    },

    // 下一题
    nextQuestion() {
      if (this.currentIndex < this.totalQuestions - 1) {
        this.currentIndex++;
        this.currentQuestion = this.questionList[this.currentIndex];
      }
    },

    // 继续下一题
    continueNext() {
      this.nextQuestion();
    },

    // 退出考试
    exitExam() {
      uni.showModal({
        title: "确认退出",
        content: "确定要退出答题吗？",
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: "/pages/practice/index",
            });
          }
        },
      });
    },

    // 返回
    goBack() {
      uni.navigateBack();
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
/* 头部样式 */
.exam-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #e0e0e0;
}

.header-left {
  display: flex;
  align-items: center;
}

.back-icon {
  font-size: 40rpx;
  color: #15abbe;
  margin-right: 10rpx;
}

.back-text {
  font-size: 32rpx;
  color: #15abbe;
}

.header-center {
  flex: 1;
  text-align: center;
}

.exam-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.header-right {
  display: flex;
  align-items: center;
}

.progress-text {
  font-size: 28rpx;
  color: #666666;
}

/* 考试容器 */
.exam-container {
  padding: 30rpx;
  background: #ffffff;
  margin: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

/* 题目头部 */
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

/* 题目类型 */
.question-type {
  margin-bottom: 0;
}

.type-tag {
  display: inline-block;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 500;
}

.type-choice {
  background: #e3f2fd;
  color: #1976d2;
}

.type-fill {
  background: #f3e5f5;
  color: #7b1fa2;
}

.type-application {
  background: #e8f5e8;
  color: #388e3c;
}

.type-judge {
  background: #fff3e0;
  color: #f57c00;
}

/* 题目内容 */
.question-content {
  margin-bottom: 20rpx;
}

/* 题目进度 */
.question-progress {
  margin-bottom: 0;
}

.progress-text {
  font-size: 24rpx;
  color: #999999;
  background: #f5f5f5;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.question-title {
  font-size: 32rpx;
  line-height: 1.6;
  color: #333333;
  white-space: pre-wrap;
}

.question-image {
  margin-top: 20rpx;
  text-align: center;
}

.question-img {
  max-width: 100%;
  max-height: 400rpx;
  border-radius: 8rpx;
}

/* 选项样式 */
.answer-options {
  margin-bottom: 40rpx;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  margin-bottom: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s ease;
}

.option-item:active {
  background: #e9ecef;
}

.option-selected {
  background: #e3f2fd;
  border-color: #15abbe;
}

.option-correct {
  background: #e8f5e8;
  border-color: #4caf50;
}

.option-wrong {
  background: #ffebee;
  border-color: #f44336;
}

.option-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.option-key {
  width: 50rpx;
  height: 50rpx;
  border-radius: 25rpx;
  background: #ffffff;
  border: 2rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 600;
  margin-right: 20rpx;
  color: #666666;
}

.option-selected .option-key {
  background: #15abbe;
  border-color: #15abbe;
  color: #ffffff;
}

.option-correct .option-key {
  background: #4caf50;
  border-color: #4caf50;
  color: #ffffff;
}

.option-wrong .option-key {
  background: #f44336;
  border-color: #f44336;
  color: #ffffff;
}

.option-text {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
  line-height: 1.5;
}

.option-icon {
  font-size: 32rpx;
  font-weight: 600;
}

.icon-correct {
  color: #4caf50;
}

.icon-wrong {
  color: #f44336;
}

/* 输入框样式 */
.answer-input,
.answer-textarea {
  margin-bottom: 40rpx;
}

.input-field,
.textarea-field {
  padding: 20rpx;
  border: 2rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #ffffff;
}

.input-field:focus,
.textarea-field:focus {
  border-color: #15abbe;
}

.input-correct {
  border-color: #4caf50;
  background: #e8f5e8;
}

.input-wrong {
  border-color: #f44336;
  background: #ffebee;
}

/* 答题结果 */
.answer-result {
  margin-top: 30rpx;
  border-radius: 12rpx;
}

.result-correct {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #e8f5e8;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.result-wrong {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 20rpx;
  background: #ffebee;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.result-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
}

.result-text {
  font-size: 28rpx;
  color: #333333;
}

.correct-answer {
  font-size: 28rpx;
  color: #4caf50;
  font-weight: 600;
  margin-left: 10rpx;
}

.question-analysis {
  padding: 20rpx;
  background: #ffffff;
  border-radius: 8rpx;
}

.analysis-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 10rpx;
  display: block;
}

.analysis-content {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
}

/* 卡片内操作按钮 */
.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1rpx solid #f0f0f0;
  gap: 20rpx;
  padding: 0 20rpx;
  margin-bottom: 200rpx;
}

.nav-buttons {
  display: flex;
  gap: 15rpx;
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 15rpx;
  flex: 1;
}

.nav-button,
.action-button {
  padding: 16rpx 20rpx;
  border-radius: 8rpx;
  background: #f5f5f5;
  border: 1rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60rpx;
  flex: 1;
}

.action-button.primary {
  background: #15abbe;
  border-color: #15abbe;
}

.nav-text,
.action-text {
  font-size: 28rpx;
  color: #333333;
}

.action-button.primary .action-text {
  color: #ffffff;
}

/* 固定退出按钮容器 */
.exit-button-container {
  margin: 0 20rpx;
  margin-bottom: 40rpx;
}

/* 固定退出按钮 */
.exit-button {
  background: #ff4757;
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(255, 71, 87, 0.3);
}

.exit-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
}

/* 空状态 */
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
  .exam-container {
    margin: 10rpx;
    padding: 20rpx;
  }

  .question-title {
    font-size: 30rpx;
  }

  .option-text {
    font-size: 26rpx;
  }

  .nav-text,
  .action-text {
    font-size: 26rpx;
  }
}
</style>
