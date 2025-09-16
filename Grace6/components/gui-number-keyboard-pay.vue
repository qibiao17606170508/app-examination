<template>
  <gui-popup ref="guipopupfornk" position="bottom" :canCloseByShade="canCloseByShade">
    <view class="gui-bg-gray gui-dark-bg-level-3 gui-padding" @tap.stop.prevent="stopfun">
      <!-- <text class="gui-keyboard-res gui-block gui-primary-text" v-if="showInputRes" :style="{ fontSize: resultSize }">{{ resVal }}</text> -->
      <view class="gui-margin-top gui-flex gui-row gui-justify-content-center">
        <text class="gui-number-input gui-block gui-bg-white gui-dark-bg-level-3">{{ vcode[0] }}</text>
        <text class="gui-number-input gui-block gui-bg-white gui-dark-bg-level-3">{{ vcode[1] }}</text>
        <text class="gui-number-input gui-block gui-bg-white gui-dark-bg-level-3">{{ vcode[2] }}</text>
        <text class="gui-number-input gui-block gui-bg-white gui-dark-bg-level-3">{{ vcode[3] }}</text>
        <text class="gui-number-input gui-block gui-bg-white gui-dark-bg-level-3">{{ vcode[4] }}</text>
        <text class="gui-number-input gui-block gui-bg-white gui-dark-bg-level-3">{{ vcode[5] }}</text>
      </view>
      <view class="fs-24 price-color" style="margin-top: 20rpx" v-if="tips">*如未设置密码则初始化为000000</view>
      <view class="gui-keyboard gui-flex gui-row gui-space-between">
        <view class="gui-keyboard-left gui-flex gui-row gui-wrap gui-space-between">
          <view v-for="(item, index) in [1, 2, 3, 4, 5, 6, 7, 8, 9]" :key="index" class="gui-keyboard-keys gui-bg-white gui-dark-bg-level-1" :data-keynumber="item" hover-class="gui-tap" @tap.stop="inputNow">
            <text class="gui-block gui-keyboard-keys-text gui-primary-text">{{ item }}</text>
          </view>
          <view class="gui-keyboard-keys gui-bg-white gui-dark-bg-level-1" :style="{ width: isPoint ? '259rpx' : '538rpx' }" data-keynumber="0" @tap.stop="inputNow">
            <text class="gui-keyboard-keys-text gui-block gui-primary-text" :style="{ width: isPoint ? '259rpx' : '538rpx' }">0</text>
          </view>
          <view v-if="isPoint" class="gui-keyboard-keys gui-bg-white gui-dark-bg-level-1" :style="{ width: '259rpx' }" data-keynumber="." @tap.stop="inputNow">
            <text class="gui-keyboard-keys-text gui-block gui-primary-text" :style="{ width: '259rpx' }">.</text>
          </view>
        </view>
        <view class="gui-keyboard-right gui-flex gui-columns gui-align-items-center">
          <view class="gui-keyboard-keys gui-bg-white gui-dark-bg-level-1" hover-class="gui-tap" :data-keynumber="-3" @tap.stop="deleteNow">
            <text class="gui-keyboard-keys-text gui-icons gui-block gui-primary-text">&#xe623;</text>
          </view>
          <view v-if="false" class="gui-keyboard-keys gui-keyboard-done gui-bg-primary" hover-class="gui-tap" @tap.stop="done">
            <text class="gui-keyboard-done gui-block gui-color-white">{{ doneBtnName }}</text>
          </view>
        </view>
      </view>
      <!-- iphone 底部适配 -->
      <gui-iphone-bottom v-if="!isSwitchPage"></gui-iphone-bottom>
    </view>
  </gui-popup>
</template>
<script>
export default {
  name: "gui-number-keyboard",
  props: {
    canCloseByShade: { type: Boolean, default: true },
    doneBtnName: { type: String, default: "完成" },
    isPoint: { type: Boolean, default: true },
    value: { type: String, default: "" },
    showInputRes: { type: Boolean, default: true },
    resultSize: { type: String, default: "32rpx" },
    isSwitchPage: { type: Boolean, default: false },
    tips: { type: Boolean, default: true },
  },
  methods: {
    open: function () {
      this.$refs.guipopupfornk.open();
    },
    close: function () {
      this.$refs.guipopupfornk.close();
    },
    stopfun: function (e) {
      e.stopPropagation();
      return;
    },
    inputNow: function (e) {
      var k = e.currentTarget.dataset.keynumber;
      var that = this;
      this.resVal += k + "";
      this.tapIndex = k;
      var code = this.vcode;
      var codeLength = 0;
      for (let i = 0; i < code.length; i++) {
        codeLength = i + 1;
        if (code[i] === "") {
          code.splice(i, 1, k);
          break;
        }
      }
      this.vcode = code;
      if (codeLength >= 6) {
        this.$emit("keyboardInput", this.vcode);
        setTimeout(() => {
          that.vcode = ["", "", "", "", "", ""];
        }, 1000);
      }
      this.removeClass();
    },
    deleteNow: function (e) {
      var k = e.currentTarget.dataset.keynumber;
      this.tapIndex = k;
      this.resVal = this.resVal.substring(0, this.resVal.length - 1);
      this.$emit("keyboardDelete");
      for (let i = this.vcode.length - 1; i >= 0; i--) {
        if (this.vcode[i] !== "") {
          this.vcode.splice(i, 1, "");
          break;
        }
      }
      this.removeClass();
    },
    done: function () {
      this.$emit("keyboardDone");
    },
    setVal: function (val) {
      this.resVal = val;
    },
    removeClass: function () {
      setTimeout(() => {
        this.tapIndex = -1;
      }, 100);
    },
  },
  data() {
    return {
      resVal: "",
      tapIndex: -1,
      vcode: ["", "", "", "", "", ""],
    };
  },
  created: function () {
    this.resVal = this.value + "";
  },
  watch: {
    value: function (val) {
      this.resVal = val + "";
    },
  },
  emits: ["keyboardInput", "keyboardDelete", "keyboardDone"],
};
</script>
<style scoped>
.lineH60 {
  line-height: 60rpx;
}
.gui-number-input {
  width: 80rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: #a5a7b2;
  text-align: center;
  margin: 10rpx;
  border-width: 1px;
  border-style: solid;
  border-color: #d5d6d8;
  border-radius: 10rpx;
}
</style>
