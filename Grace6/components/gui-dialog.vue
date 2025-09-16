<template>
  <view v-if="show">
    <!-- 居中 -->
    <view
      class="gui-popup gui-flex gui-column gui-justify-content-center gui-align-items-center"
      :class="[out ? 'gui-fade-out' : 'gui-fade-in']"
      ref="guipopup"
      @tap.stop="closebysd"
      @touchmove.stop.prevent="stopfun"
      :style="{
        backgroundColor: bgColor,
        zIndex: zIndex,
        top: top + 'px',
        animationDuration: duration + 'ms',
      }"
    >
      <view class="gui-popup-content gui-popup-center" style="text-align: center" @tap.stop="stopfun" ref="guiPopupCenter" :class="[out ? 'gui-scale-out' : 'gui-scale-in']" :style="{ width: width, animationDuration: duration + 'ms' }">
        <view class="dialogBox gui-padding">
          <view class="gui-flex gui-justify-content-center mt-30" v-if="img">
            <image style="width: 120rpx; height: 120rpx" :src="img"></image>
          </view>
          <view class="gui-text-center title" v-html="title" v-if="title"></view>
          <view class="gui-text-left title" v-html="leftTitle" v-if="leftTitle"></view>
          <view class="gui-text-center title color-blue mt-30" v-html="blueTxt" v-if="blueTxt"></view>
          <view class="gui-text-center desc" v-html="desc" v-if="desc"> </view>
          <view v-if="!isAuth" class="btn gui-text-center" @tap="change">
            {{ btn }}
          </view>
          <button v-if="isAuth" class="btn" open-type="getPhoneNumber" @getphonenumber="change">{{ btn }}1</button>
        </view>
        <view class="gui-icons close" @tap="closebysd">&#xe78a;</view>
      </view>
    </view>
  </view>
</template>
<script>
// #ifdef APP-NVUE
const animation = weex.requireModule("animation");
import graceJS from "@/Grace6/js/grace.js";
// #endif

export default {
  name: "gui-popup",
  props: {
    bgColor: { type: String, default: "rgba(0, 0, 0, 0.7)" },
    width: { type: String, default: "580rpx" },
    canCloseByShade: { type: Boolean, default: true },
    zIndex: { type: Number, default: 999 },
    top: { type: Number, default: 0 },
    duration: { type: Number, default: 280 },
    isSwitchPage: { type: Boolean, default: false },
  },
  data() {
    return {
      show: false,
      out: false,
      title: "",
      img: "",
      desc: "",
      btn: "",
      state: null,
      isAuth: false,
      item: {},
      blueTxt: "",
      leftTitle: "",
    };
  },
  methods: {
    change: function (e) {
      this.close(true);
    },
    open: function (item) {
      if (item) {
        this.title = item.title;
        this.img = item.img;
        this.desc = item.desc;
        this.btn = item.btn;
        this.state = item.state;
        this.isAuth = item.isAuth;
        this.item = item.item;
        this.blueTxt = item.blueTxt;
        this.leftTitle = item.leftTitle;
        // 1 未支付 2 未登录  3 未实名 4 余额不足 5 超时 6 待取货 7 待归还 8 已发货 9 已签收
      }

      this.out = false;
      this.show = true;
      // #ifdef APP-NVUE
      this.weexAnimateIn();
      // #endif
      this.$emit("open");
    },
    closebysd: function () {
      if (this.canCloseByShade) {
        this.close();
      }
    },
    close: function (flag = false) {
      this.$emit("change", { state: this.state, item: this.item, flag: flag });
      this.out = true;
      // #ifdef APP-NVUE
      this.weexAnimateOut();
      // #endif
      setTimeout(() => {
        this.show = false;
        this.$emit("close");
      }, 350);
    },
    stopfun: function (e) {
      e.stopPropagation();
      return null;
    },

    // #ifdef APP-NVUE
    weexAnimateIn: function () {
      graceJS.getRefs("guipopup", this, 0, (guipopupref) => {
        animation.transition(guipopupref, {
          styles: { opacity: 1 },
          duration: this.duration, //ms
          timingFunction: "ease",
          delay: 0, //ms
        });
      });
      graceJS.getRefs("guiPopupCenter", this, 0, (guipopupref) => {
        animation.transition(guipopupref, {
          styles: { transform: "scale(1)" },
          duration: this.duration, //ms
          timingFunction: "ease",
          delay: 0, //ms
        });
      });
    },
    weexAnimateOut: function () {
      graceJS.getRefs("guipopup", this, 0, (guipopupref) => {
        animation.transition(guipopupref, {
          styles: { opacity: 0 },
          duration: this.duration, //ms
          timingFunction: "ease",
          delay: 0, //ms
        });
      });
      graceJS.getRefs("guiPopupCenter", this, 0, (guipopupref) => {
        animation.transition(guipopupref, {
          styles: { transform: "scale(0.3)" },
          duration: this.duration, //ms
          timingFunction: "ease",
          delay: 0, //ms
        });
      });
    },
    // #endif
  },
  emits: ["close", "open", "change"],
};
</script>
<style scoped>
/* 遮罩层 */
.gui-popup {
  width: 750rpx;
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  bottom: 0;
}
.gui-popup-content {
  overflow: hidden;
}
.gui-fade-out {
  opacity: 0;
}
.gui-popup-center {
  transform: scale(0.3, 0.3);
}
.gui-popup-top {
  transform: translateY(-1000px);
}
.gui-popup-bottom {
  transform: translateY(600px);
}
.gui-popup-left {
  transform: translateX(-600px);
}
.gui-popup-right {
  transform: translateX(600px);
}
.dialogBox {
  width: 600rpx;
  background: #fff;
}
.close {
  color: #fff;
  font-size: 60rpx;
  margin-top: 50rpx;
}
.btn {
  width: 480rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 30rpx;
  color: #fff;
  margin: 80rpx auto 20rpx;
  background: linear-gradient(100deg, #66bdff 0%, #1499ff 100%);
}
.title {
  margin: 40rpx 40rpx 0;
  font-size: 32rpx;
}
.desc {
  margin: 40rpx 50rpx 0;
  font-size: 26rpx;
  color: #999;
  font-weight: 400;
}
</style>
