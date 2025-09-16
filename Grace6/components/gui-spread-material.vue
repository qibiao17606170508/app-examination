<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2024-04-09 11:23:57
 * @LastEditors: qibiao
 * @LastEditTime: 2024-04-16 22:53:50
-->
<template>
  <view class="gui-spread material gui-bg-white" :class="[isShrink ? 'gui-transition-all' : '']" :style="{ height: reHeight }">
    <view
      :style="{
        paddingBottom: !isBtn && isShrink ? '80rpx' : '0rpx',
      }"
    >
      <view v-if="dataInfo.content">
        <view class="top gui-flex gui-space-between gui-border-b">
          <view>{{ dataInfo.express_name }}</view>
          <view>{{ dataInfo.express_no }}</view>
        </view>
        <view class="steps" v-if="dataInfo.content">
          <view class="steps_item" v-for="(i, index) in list" :key="index">
            <view class="s_r">
              <view class="line" :style="{ backgroundColor: index != 0 ? '#D8D8D8' : 'rgba(0,0,0,0)' }"></view>
              <view class="index" :style="{ backgroundColor: backgroundColor, color: color }"></view>
              <view class="line" :style="{ backgroundColor: index != list.length - 1 ? '#D8D8D8' : 'rgba(0,0,0,0)' }"></view>
            </view>
            <view class="s_l">
              <view class="info_item">
                <view class="top_info">
                  <view class="title">{{ i.status }}</view>
                </view>
                <view class="info">
                  <view class="text-grey" v-if="i.time">{{ i.time }} <text class="ml5"></text></view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-else>
        <view class="gui-flex gui-space-between fs-28 color-333">
          <view>暂无物流信息，请耐心等待</view>
        </view>
      </view>
    </view>
    <text v-if="isBtn && btnShow" @tap="spreadContent" :style="{ fontSize: btnTxtSize, zIndex: zIndex, width: width }" class="gui-primary-text gui-icons gui-block gui-spread-btn gui-bg-white gui-dark-bg-level-1">&#xe69d; {{ btnTxt }}</text>
    <text v-if="!isBtn && isShrink && btnShow" @tap="shrinkContent" :style="{ fontSize: btnTxtSize, zIndex: zIndex, width: width }" class="gui-primary-text gui-icons gui-block gui-spread-btn gui-bg-white gui-dark-bg-level-1">&#xe638; {{ shrinkBtnTxt }}</text>
  </view>
</template>
<script>
export default {
  name: "gui-spread",
  props: {
    width: { type: String, default: "690rpx" },
    height: { type: String, default: "520rpx" },
    btnTxt: { type: String, default: "查看完整物流信息" },
    btnTxtSize: { type: String, default: "28rpx" },
    zIndex: { type: Number, default: 1 },
    isShrink: { type: Boolean, default: true },
    shrinkBtnTxt: { type: String, default: "收起物流信息" },
    dataInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      reHeight: "520rpx",
      isBtn: true,
      color: "#fff",
      backgroundColor: "#1499FF",
      lineNum: 0,
      list: [],
      btnShow: true,
    };
  },
  created: function () {
    this.reHeight = this.height;
  },
  watch: {
    dataInfo: {
      handler: function (val) {
        if (val.content) {
          this.list = JSON.parse(val.content);
          console.log(this.list);
          if (this.list.length == 0) {
            this.reHeight = "auto";
            this.btnShow = false;
          }
        }
      },
      deep: true,
    },
  },
  created() {
    if (this.dataInfo.content) {
      this.list = JSON.parse(this.dataInfo.content);
      console.log(this.list);
      if (this.list.length == 0) {
        this.reHeight = "auto";
        this.btnShow = false;
      }
    }
  },
  methods: {
    auditStatus(i) {
      if (i == 2) {
        return {
          text: "通过",
          color: "#00D288",
          bgColor: "#EAFFF8",
        };
      } else if (i == 3) {
        return {
          text: "驳回",
          color: "#FF4141",
          bgColor: "#FFDCD5",
        };
      }
    },
    handlePreview(url) {
      uni.previewImage({ urls: [url] });
    },
    spreadContent: function () {
      // #ifdef MP-BAIDU
      this.reHeight = "";
      // #endif
      // #ifndef MP-BAIDU
      this.reHeight = "auto";
      // #endif
      // #ifdef APP-NVUE
      this.reHeight = "";
      // #endif
      this.isBtn = false;
    },
    shrinkContent: function () {
      this.reHeight = this.height;
      this.isBtn = true;
    },
  },
};
</script>
<style scoped lang="scss">
.gui-spread {
  overflow: hidden;
  position: relative;
  padding: 30rpx 20rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;
}
.gui-spread-btn {
  height: 91rpx;
  line-height: 88rpx;
  position: absolute;
  z-index: 999;
  left: 0;
  bottom: -3rpx;
  text-align: center;
  font-size: 28rpx;
  opacity: 0.96;
}
.top {
  padding-bottom: 20rpx;
  box-sizing: border-box;
  font-size: 28rpx;
  color: #333;
}

.steps {
  display: flex;
  flex-direction: column;

  .steps_item {
    display: flex;

    .s_r {
      padding: 0 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .line {
        flex: 1;
        width: 5rpx;
        /* border-left: 4rpx dashed #fff; */
      }

      .index {
        width: 24rpx;
        height: 24rpx;
        border-radius: 50rpx;
        border: 4rpx solid #e3eeff;
        box-sizing: border-box;
      }
    }

    .s_l {
      display: flex;
      flex-direction: column;
      padding: 10rpx 0;
      flex: 1;

      .info_item {
        background-color: #ffffff;
        margin-right: 30rpx;
        border-radius: 10rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 10rpx 0;

        .top_info {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        text {
          font-size: 24rpx;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }

        .title {
          // width: calc(100vw - 330rpx);
          font-size: 24rpx;
          font-weight: 500;
          color: rgba(102, 102, 102, 1);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          flex-direction: column;
        }

        .info {
          font-size: 24rpx;
          color: #afb4be;
          margin-top: 10rpx;
        }

        .date {
          font-size: 23rpx;
          color: #afb4be;
        }

        .audit-status {
          float: right;
          width: 120rpx;
          height: 40rpx;
          line-height: 40rpx;
          text-align: center;
          font-size: 22rpx;
          background: #eafff8;
          border-radius: 20rpx;
        }
      }

      .info_item:active {
        background-color: #f4f4f4;
      }
    }
  }
}
</style>
