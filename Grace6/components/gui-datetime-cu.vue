<template>
  <view>
    <view @tap.stop="open">
      <slot></slot>
    </view>
    <view class="gui-dateBT-shade gui-flex gui-columns gui-justify-content-end" v-if="show" :style="{ zIndex: zIndex, width: width }">
      <view class="graceDateTime-header gui-bg-white gui-dark-bg-level-1 gui-flex gui-row gui-justify-content-center gui-relative" style="padding: 30rpx 20rpx">
        <text class="graceDateTime-header-btn gui-color-gray" @tap="close" style="position: absolute; top: 50%; left: 20rpx; transform: translateY(-50%)">{{ cancelText }}</text>
        <text class="graceDateTime-header-btn gui-color-black gui-bold" style="text-align: center; font-size: 32rpx">{{ title }}</text>
        <!-- <text></text> -->
      </view>
      <view class="gui-bg-white gui-dark-bg-level-3" style="border-top: 6rpx solid #fff !important">
        <picker-view class="gui-padding" v-if="!noInput">
          <text class="graceDateTime-header-btn gui-color-black gui-bold">取货时间</text>
        </picker-view>
        <picker-view :indicator-style="indicatorStyle" class="graceDateTime-main gui-bg-white gui-dark-bg-level-3" :value="defaultVal" @change="change" :style="{ height: height, width: width }">
          <picker-view-column>
            <view class="gui-picker-item" :style="indicatorStyle" v-for="(item, index) in sDate[0]" :key="index">
              <text class="gui-picker-item gui-block" :style="indicatorStyle">{{ item }}{{ units[0] }}</text>
            </view>
          </picker-view-column>
          <picker-view-column>
            <view class="gui-picker-item" :style="indicatorStyle" v-for="(item, index) in sDate[1]" :key="index">
              <text class="gui-picker-item gui-block" :style="indicatorStyle">{{ item }}{{ units[1] }}</text>
            </view>
          </picker-view-column>
          <picker-view-column>
            <view class="gui-picker-item" :style="indicatorStyle" v-for="(item, index) in sDate[2]" :key="index">
              <text class="gui-picker-item gui-block" :style="indicatorStyle">{{ item }}{{ units[2] }}</text>
            </view>
          </picker-view-column>
          <picker-view-column v-if="isTime || isTimeHour">
            <view class="gui-picker-item" :style="indicatorStyle" v-for="(item, index) in sDate[3]" :key="index">
              <text class="gui-picker-item gui-block" :style="indicatorStyle">{{ item }}{{ units[3] }}</text>
            </view>
          </picker-view-column>
          <picker-view-column v-if="isTime && isMinute">
            <view class="gui-picker-item" :style="indicatorStyle" v-for="(item, index) in sDate[4]" :key="index">
              <text class="gui-picker-item gui-block" :style="indicatorStyle">{{ item }}{{ units[4] }}</text>
            </view>
          </picker-view-column>
          <picker-view-column v-if="isTime && isMinute && isSecond">
            <view class="gui-picker-item" :style="indicatorStyle" v-for="(item, index) in sDate[5]" :key="index">
              <text class="gui-picker-item gui-block" :style="indicatorStyle">{{ item }}{{ units[5] }}</text>
            </view>
          </picker-view-column>
        </picker-view>
        <picker-view class="gui-padding" v-if="!noInput">
          <text class="graceDateTime-header-btn gui-color-black gui-bold">租赁天数</text>
        </picker-view>
        <picker-view class="gui-padding-x" v-if="!noInput">
          <view class="daysClass">
            <input type="number" @input="getValue" class="gui-form-input" v-model="days" placeholder="请输入天数" />
          </view>
        </picker-view>
        <picker-view class="gui-padding-x" v-if="!noInput">
          <text class="graceDateTime-header-btn gui-color-gray" style="width: 100%; font-size: 22rpx">请于{{ endTime }}前归还设备，超时需支付费用</text>
        </picker-view>
        <picker-view class="gui-padding-x" style="padding-bottom: 40rpx">
          <text class="confirmClass" @tap="confirm">{{ confirmText }}</text>
        </picker-view>
        <picker-view v-if="!noInput" class="gui-padding-x" style="margin-bottom: 100rpx">
          <text class="graceDateTime-header-btn gui-color-gray" style="width: 100%; font-size: 22rpx; text-align: center">请按实际使用时间进行选择，租金根据租用天数决定。</text>
        </picker-view>
        <picker-view>
          <gui-iphone-bottom :customClass="['gui-bg-white', 'gui-dark-bg-level-3']"></gui-iphone-bottom>
        </picker-view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: "gui-datetime",
  props: {
    cancelText: { type: String, default: "取消" },
    confirmText: { type: String, default: "确定" },
    value: { type: String, default: "" },
    objValue: { type: Object, default: {} },
    datas: { type: Array, default: [] },
    isTime: { type: Boolean, default: true },
    isTimeHour: { type: Boolean, default: false },
    isMinute: { type: Boolean, default: true },
    isSecond: { type: Boolean, default: true },
    startYear: { type: Number, default: 1980 },
    endYear: { type: Number, default: 2050 },
    noInput: { type: Boolean, default: false },
    openFlag: { type: Boolean, default: true },
    units: {
      type: Array,
      default: function () {
        return new Array("年", "月", "日", "时", "分", "秒");
      },
    },
    height: { type: String, default: "390rpx" },
    zIndex: { type: Number, default: 10001 },
    width: { type: String, default: "750rpx" },
    indicatorStyle: { type: String, default: "height:36px; line-height:36px;" },
    title: { type: String, default: "确认租赁时间" },
    daysValue: { type: Number, default: 1 },
  },
  data() {
    return {
      show: false,
      defaultVal: [0, 0, 0, 0, 0, 0],
      sDate: [[], [], [], [], [], []],
      timer: null,
      endTime: "",
      days: 1,
    };
  },
  created() {
    this.init();
  },
  methods: {
    getValue() {
      if (this.days <= 0) {
        return;
      }
      var date = "";
      if (this.isTime) {
        date = this.sDate[0][this.defaultVal[0]] + "/" + this.sDate[1][this.defaultVal[1]] + "/" + this.sDate[2][this.defaultVal[2]] + " " + this.sDate[3][this.defaultVal[3]] + ":" + this.sDate[4][this.defaultVal[4]] + ":" + this.sDate[5][this.defaultVal[5]];
      } else if (this.isTimeHour) {
        date = this.sDate[0][this.defaultVal[0]] + "/" + this.sDate[1][this.defaultVal[1]] + "/" + this.sDate[2][this.defaultVal[2]] + " " + this.sDate[3][this.defaultVal[3]] + ":00:00";
      } else {
        date = this.sDate[0][this.defaultVal[0]] + "/" + this.sDate[1][this.defaultVal[1]] + "/" + this.sDate[2][this.defaultVal[2]];
      }
      this.endTime = this.$moment(new Date(date).getTime() + this.days * 24 * 60 * 60 * 1000).format("YYYY年MM月DD日HH时");
    },
    stopfun: function (e) {
      e.stopPropagation();
      return;
    },
    now: function () {
      var date = new Date();
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },
    arrayIndexOf: function (arr, needFind) {
      var index = -1;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == needFind) {
          index = i;
          return i;
        }
      }
      return index;
    },
    setValue: function (val) {
      if (val == "") {
        val = this.now();
      }
      var reg = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
      var res = val.match(reg);
      if (res == null) {
        reg = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
        res = val.match(reg);
        if (res == null) {
          this.setValue(this.now());
          return;
        }
        res[4] = "00";
        res[5] = "00";
        res[6] = "00";
      }
      this.setDefaults([res[1], res[2], res[3], res[4], res[5], res[6]]);
    },
    setDefaults: function (res) {
      for (let i = 0; i < res.length; i++) {
        var index = this.arrayIndexOf(this.sDate[i], res[i]);
        if (index == -1) {
          index = 0;
        }
        this.defaultVal.splice(i, 1, index);
      }
      this.changeBase(this.defaultVal);
    },
    // 初始化组件
    init: function () {
      if (this.endYear < this.startYear) {
        this.endYear = this.startYear + 10;
      }
      var years = new Array();
      for (let i = this.startYear; i <= this.endYear; i++) {
        years.push(i);
      }
      var months = new Array();
      for (let i = 1; i <= 12; i++) {
        if (i < 10) {
          months.push("0" + i);
        } else {
          months.push(i);
        }
      }
      var days = new Array();
      for (let i = 1; i <= 31; i++) {
        if (i < 10) {
          days.push("0" + i);
        } else {
          days.push(i);
        }
      }
      var hours = new Array();
      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          hours.push("0" + i);
        } else {
          hours.push(i);
        }
      }
      var minutes = new Array();
      var seconds = new Array();
      for (let i = 0; i < 60; i++) {
        if (i < 10) {
          minutes.push("0" + i);
          seconds.push("0" + i);
        } else {
          minutes.push(i);
          seconds.push(i);
        }
      }
      // 发版的时候把这块打开
      // // 把小于当前年的年数去掉
      // years = years.slice(this.arrayIndexOf(years, new Date().getFullYear()));
      // // 把小于当前月的月数去掉
      // if (this.arrayIndexOf(years, new Date().getFullYear()) == 0) {
      //   months = months.slice(this.arrayIndexOf(months, new Date().getMonth() + 1));
      // }
      // // 把小于当前日的日数去掉
      // if (this.arrayIndexOf(years, new Date().getFullYear()) == 0 && this.arrayIndexOf(months, new Date().getMonth() + 1) == 0) {
      //   days = days.slice(this.arrayIndexOf(days, new Date().getDate()));
      // }
      // // 把小于当前小时的小时数去掉
      // if (this.arrayIndexOf(years, new Date().getFullYear()) == 0 && this.arrayIndexOf(months, new Date().getMonth() + 1) == 0 && this.arrayIndexOf(days, new Date().getDate()) == 0) {
      //   hours = hours.slice(this.arrayIndexOf(hours, new Date().getHours()));
      // }
      // // 把小于当前分钟的分钟数去掉
      // if (this.arrayIndexOf(years, new Date().getFullYear()) == 0 && this.arrayIndexOf(months, new Date().getMonth() + 1) == 0 && this.arrayIndexOf(days, new Date().getDate()) == 0 && this.arrayIndexOf(hours, new Date().getHours()) == 0) {
      //   minutes = minutes.slice(this.arrayIndexOf(minutes, new Date().getMinutes()));
      // }
      // // 把小于当前秒的秒数去掉
      // if (this.arrayIndexOf(years, new Date().getFullYear()) == 0 && this.arrayIndexOf(months, new Date().getMonth() + 1) == 0 && this.arrayIndexOf(days, new Date().getDate()) == 0 && this.arrayIndexOf(hours, new Date().getHours()) == 0 && this.arrayIndexOf(minutes, new Date().getMinutes()) == 0) {
      //   seconds = seconds.slice(this.arrayIndexOf(seconds, new Date().getSeconds()));
      // }

      this.sDate = [years, months, days, hours, minutes, seconds];
      // 把this.sDate 把当前时间的之前的时间去掉

      // this.endTime等于days天后的时间
      this.endTime = new Date(new Date().getTime() + this.days * 24 * 60 * 60 * 1000);
      this.$nextTick(() => {
        setTimeout(() => {
          this.setValue(this.value);
          this.days = this.daysValue;
        }, 500);
      });
    },
    change: function (res) {
      if (this.timer != null) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.changeBase(res.detail.value);
      }, 500);
    },
    changeBase: function (res) {
      var date = new Date(this.sDate[0][res[0]], this.sDate[1][res[1]], 0);
      var days = date.getDate();
      var daysOut = new Array();
      var date = "";
      for (let i = 1; i <= days; i++) {
        if (i < 10) {
          daysOut.push("0" + i);
        } else {
          daysOut.push(i);
        }
      }
      this.sDate.splice(2, 1, daysOut);
      if (res[2] + 1 > days) {
        res[2] = days - 1;
      }
      this.defaultVal = res;

      if (this.isTime) {
        var resdata = new Array(this.sDate[0][this.defaultVal[0]], this.sDate[1][this.defaultVal[1]], this.sDate[2][this.defaultVal[2]], this.sDate[3][this.defaultVal[3]], this.sDate[4][this.defaultVal[4]], this.sDate[5][this.defaultVal[5]]);
        date = this.sDate[0][this.defaultVal[0]] + "/" + this.sDate[1][this.defaultVal[1]] + "/" + this.sDate[2][this.defaultVal[2]] + " " + this.sDate[3][this.defaultVal[3]] + ":" + this.sDate[4][this.defaultVal[4]] + ":" + this.sDate[5][this.defaultVal[5]];
      } else if (this.isTimeHour) {
        var resdata = new Array(this.sDate[0][this.defaultVal[0]], this.sDate[1][this.defaultVal[1]], this.sDate[2][this.defaultVal[2]], this.sDate[3][this.defaultVal[3]]);
        date = this.sDate[0][this.defaultVal[0]] + "/" + this.sDate[1][this.defaultVal[1]] + "/" + this.sDate[2][this.defaultVal[2]] + " " + this.sDate[3][this.defaultVal[3]] + ":00:00";
      } else {
        var resdata = new Array(this.sDate[0][this.defaultVal[0]], this.sDate[1][this.defaultVal[1]], this.sDate[2][this.defaultVal[2]]);
        date = this.sDate[0][this.defaultVal[0]] + "/" + this.sDate[1][this.defaultVal[1]] + "/" + this.sDate[2][this.defaultVal[2]];
      }
      this.endTime = this.$moment(new Date(date).getTime() + this.days * 24 * 60 * 60 * 1000).format("YYYY年MM月DD日HH时");
      this.$emit("change", resdata);
    },
    confirm: function () {
      if (this.isTime) {
        var res = new Array(this.sDate[0][this.defaultVal[0]], this.sDate[1][this.defaultVal[1]], this.sDate[2][this.defaultVal[2]], this.sDate[3][this.defaultVal[3]], this.sDate[4][this.defaultVal[4]], this.sDate[5][this.defaultVal[5]]);
      } else if (this.isTimeHour) {
        var res = new Array(this.sDate[0][this.defaultVal[0]], this.sDate[1][this.defaultVal[1]], this.sDate[2][this.defaultVal[2]], this.sDate[3][this.defaultVal[3]]);
      } else {
        var res = new Array(this.sDate[0][this.defaultVal[0]], this.sDate[1][this.defaultVal[1]], this.sDate[2][this.defaultVal[2]]);
      }
      this.$emit("confirm", { value: res, days: this.days, objValue: this.objValue, datas: this.datas });
      this.close();
    },
    open: function () {
      if (this.openFlag) {
        this.show = true;
      }
      this.$emit("open", { objValue: this.objValue });
    },
    openFn() {
      this.show = true;
    },
    close: function () {
      this.show = false;
      this.$emit("close");
    },
  },
  emits: ["change", "confirm", "close", "open"],
};
</script>
<style scoped>
.gui-dateBT-shade {
  width: 750rpx;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 99;
  left: 0;
  top: 0;
  bottom: 0;
  flex: 1;
  overflow: hidden;
}
.graceDateTime-header {
  padding: 25rpx;
}
.graceDateTime-header-btn {
  width: 200rpx;
  line-height: 38rpx;
  height: 38rpx;
  font-size: 28rpx;
}
.graceDateTime-main {
  width: 750rpx;
}
.daysClass {
  width: 100%;
  background: #f6f7f7;
  padding: 0 20rpx;
  box-sizing: border-box;
}
.daysClass input {
  width: 100%;
}
.confirmClass {
  width: 100%;
  color: #fff;
  font-size: 26rpx;
  background-image: linear-gradient(109deg, #66bdff 0%, #1499ff 100%);
  text-align: center;
  padding: 20rpx 0;
  margin-top: 60rpx;
}
</style>
