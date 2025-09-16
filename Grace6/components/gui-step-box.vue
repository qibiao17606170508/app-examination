<template>
  <view class="gui-flex gui-rows gui-nowrap gui-align-items-center" :style="{ width: width }">
    <view hover-class="gui-tap" @tap.stop="reduce" :class="buttonClass" :style="{ border: btnDisabled ? '1rpx solid #ccc' : '', color: btnDisabled ? '#ccc' : '' }">
      <view class="gui-block gui-text-center">-</view>
    </view>
    <input style="margin: 0 20rpx" class="gui-form-input gui-text-center gui-flex1" :class="inputClass" :style="{ ...{ color: btnDisabled ? '#ccc' : '' } }" :disabled="disabled" v-model="inputNumber" type="digit" @blur="inputval" />
    <view hover-class="gui-tap" @tap.stop="add" :class="buttonClass" :style="{ ...rightStyle, ...{ background: btnDisabled ? '#ccc' : '', border: 'none' } }">
      <view class="gui-block gui-text-center">+</view>
    </view>
  </view>
</template>
<script>
export default {
  name: "gui-step-box",
  props: {
    width: { type: String, default: "200rpx" },
    value: { type: Number, default: 0 },
    step: { type: Number, default: 1 },
    maxNum: { type: Number, default: 9999 },
    minNum: { type: Number, default: 0 },
    buttonClass: {
      type: Array,
      default: function () {
        return ["gui-step-box-button", "gui-color-gray"];
      },
    },
    inputClass: {
      type: Array,
      default: function () {
        return ["gui-step-box-input", "gui-border-radius"];
      },
    },
    disabled: { type: Boolean, default: false },
    index: { type: Number, default: 0 },
    datas: {
      type: Array,
      default: function () {
        return [];
      },
    },
    decimal: { type: Number, default: 2 },
    rightStyle: { type: Object, default: {} },
    btnDisabled: { type: Boolean, default: false },
    tipsTxt: { type: String, default: "已达到最大值" },
    showTips: { type: Boolean, default: false },
  },
  data() {
    return {
      inputNumber: 0,
      callbackNumber: 0,
    };
  },
  created: function () {
    this.inputNumber = Number(this.value);
  },
  watch: {
    value: function (val, vo) {
      this.inputNumber = Number(val);
    },
    inputNumber: function (val, vo) {
      if (val == "") {
        return;
      }
      val = Number(val);
      if (isNaN(val)) {
        setTimeout(() => {
          this.inputNumber = Number(vo);
        }, 200);
        return;
      }
      var newVal = this.decimalVal(val);
      if (newVal != val) {
        setTimeout(() => {
          this.inputNumber = Number(newVal);
        }, 200);
        return;
      }
      if (val > this.maxNum) {
        setTimeout(() => {
          this.inputNumber = this.maxNum;
          if (this.showTips) {
            uni.showToast({
              title: this.tipsTxt,
              icon: "none",
            });
          }
        }, 200);
        return;
      }
      if (val < this.minNum) {
        setTimeout(() => {
          this.inputNumber = this.minNum;
        }, 200);
        return;
      }
    },
  },
  methods: {
    add: function () {
      if (this.btnDisabled) {
        return;
      }

      var newVal = Number(this.inputNumber) + Number(this.step);
      newVal = this.decimalVal(newVal);
      if (newVal > this.maxNum) {
        if (this.showTips) {
          uni.showToast({
            title: this.tipsTxt,
            icon: "none",
          });
        }
        return;
      }
      this.inputNumber = Number(newVal);
      this.$emit("change", [this.inputNumber, this.index, this.datas]);
    },
    reduce: function () {
      if (this.btnDisabled) {
        return;
      }
      var newVal = Number(this.inputNumber) - Number(this.step);
      newVal = this.decimalVal(newVal);
      if (newVal < this.minNum) {
        return;
      }
      this.inputNumber = newVal;
      this.$emit("change", [this.inputNumber, this.index, this.datas]);
    },
    inputval: function (e) {
      this.inputNumber = Number(e.detail.value);

      this.$emit("change", [this.inputNumber, this.index, this.datas]);
    },
    decimalVal: function (val) {
      var isDecimal = String(val).indexOf(".");
      if (isDecimal != -1) {
        val = val.toFixed(this.decimal);
        var valArr = String(val).split(".");
        if (valArr[1].length > this.decimal) {
          valArr[1] = valArr[1].substr(0, this.decimal);
          val = Number(valArr.join("."));
        }
      }
      return val;
    },
  },
  emits: ["change"],
};
</script>
<style scoped></style>
