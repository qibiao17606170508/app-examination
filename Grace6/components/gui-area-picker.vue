<template>
  <gui-popup ref="guipopupforareapicker" :isSwitchPage="true" :zIndex="zIndex" position="bottom">
    <view class="gui-ap-body gui-bg-white gui-dark-bg-level-3 gui-relative" @tap.stop.prevent="stopfun">
      <view class="gui-ap-header gui-flex gui-row gui-space-between">
        <text class="gui-ap-header-btn gui-block" :class="cancelClass" @tap="close">{{ cancelText }}</text>
        <text class="gui-ap-header-btn gui-block" :class="confirmClass" style="text-align: right" @tap="confirm">{{ confirmText }}</text>
      </view>
      <picker-view :style="{ height: height + 'rpx' }" :indicator-style="indicatorStyle" :value="defaultVal" mask-class="gui-pv-mask" @change="change">
        <picker-view-column v-if="level >= 1">
          <view class="gui-picker-item" :style="indicatorStyle" v-for="(item, index) in province" :key="index">
            <text :style="indicatorStyle" class="gui-block gui-picker-item">{{ item.area_name }}</text>
          </view>
        </picker-view-column>
        <picker-view-column v-if="level >= 2">
          <view class="gui-picker-item" :style="indicatorStyle" v-for="(item, index) in province[defaultVal[0]].child" :key="index">
            <text :style="indicatorStyle" class="gui-block gui-picker-item">{{ item.area_name }}</text>
          </view>
        </picker-view-column>
        <picker-view-column v-if="level >= 3">
          <view class="gui-picker-item" :style="indicatorStyle" v-for="(item, index) in province[defaultVal[0]].child[defaultVal[1]].child" :key="index">
            <text :style="indicatorStyle" class="gui-block gui-picker-item">{{ item.area_name }}</text>
          </view>
        </picker-view-column>
      </picker-view>
    </view>
  </gui-popup>
</template>
<script>
import { getAddressTree } from "@/apis/user.js";
import { getDeviceCity } from "@/apis/store.js";
export default {
  name: "gui-area-picker",
  props: {
    indicatorStyle: { type: String, default: "height:36px; line-height:36px;" },
    cancelText: { type: String, default: "取消" },
    cancelClass: {
      type: Array,
      default: function () {
        return ["gui-color-gray"];
      },
    },
    confirmText: { type: String, default: "确定" },
    confirmClass: {
      type: Array,
      default: function () {
        return ["gui-primary-color"];
      },
    },
    value: {
      type: Array,
      default: function () {
        return ["", "", ""];
      },
    },
    level: { type: Number, default: 3 },
    height: { type: Number, default: 550 },
    zIndex: { type: Number, default: 1000 },
    store: { type: String || Number, default: "" },
  },
  data() {
    return {
      province: [{ child: [{ child: [] }] }],
      defaultVal: [0, 0, 0],
      realshow: false,
    };
  },
  watch: {
    value: function (nv, ov) {
      this.setDefault();
    },
    defaultVal: function (nv, ov) {
      if (ov[0] != nv[0]) {
        this.defaultVal.splice(1, 1, 0);
        this.defaultVal.splice(2, 1, 0);
      } else if (ov[1] != nv[1]) {
        this.defaultVal.splice(2, 1, 0);
      }
    },
    // store: function (nv, ov) {
    //   if (nv) {
    //     this.getCity();
    //   }
    // },
  },
  mounted() {
    this.getCity();
  },
  methods: {
    getCity() {
      if (this.store) {
        getDeviceCity({ device_id: this.store }).then(async (res) => {
          let arr = JSON.parse(JSON.stringify(res.data));
          arr.forEach((element) => {
            element.area_name = element.name;
          });
          this.$set(this, "province", arr);
          await this.setDefault();
        });
      } else {
        getAddressTree().then(async (res) => {
          this.province = await res.data;
          await this.setDefault();
        });
      }
    },
    setDefault: function () {
      if (this.value[0] == "") {
        return;
      }

      this.$nextTick(() => {
        this.defaultVal.splice(0, 1, this.arrayIndexOf(this.province, this.value[0]));
        if (this.value[1] == "") {
          return;
        }
        this.$nextTick(() => {
          this.defaultVal.splice(1, 1, this.arrayIndexOf(this.province[this.defaultVal[0]].child, this.value[1]));
          if (this.value[2] == "") {
            return;
          }
          this.$nextTick(() => {
            this.defaultVal.splice(2, 1, this.arrayIndexOf(this.province[this.defaultVal[0]].child[this.defaultVal[1]].child, this.value[2]));
          });
        });
      });
    },
    arrayIndexOf: function (arr, needFind) {
      var index = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == needFind) {
          index = i;
          return i;
        }
      }
      return index;
    },
    change: function (e) {
      var res = e.detail.value;
      if (!res[0]) {
        res[0] = 0;
      }
      if (!res[1]) {
        res[1] = 0;
      }
      if (!res[2]) {
        res[2] = 0;
      }
      this.defaultVal = res;
    },
    confirm: function () {
      if (this.level >= 3) {
        var codes = [this.province[this.defaultVal[0]].id, this.province[this.defaultVal[0]].child[this.defaultVal[1]].id, this.province[this.defaultVal[0]].child[this.defaultVal[1]].child.length > 0 && this.province[this.defaultVal[0]].child[this.defaultVal[1]].child[this.defaultVal[2]].id ? this.province[this.defaultVal[0]].child[this.defaultVal[1]].child[this.defaultVal[2]].id : 0];
        var names = [this.province[this.defaultVal[0]].area_name, this.province[this.defaultVal[0]].child[this.defaultVal[1]].area_name, this.province[this.defaultVal[0]].child[this.defaultVal[1]].child.length > 0 && this.province[this.defaultVal[0]].child[this.defaultVal[1]].child[this.defaultVal[2]].area_name ? this.province[this.defaultVal[0]].child[this.defaultVal[1]].child[this.defaultVal[2]].area_name : ""];
        codes = codes.splice(0, this.level);
        names = names.splice(0, this.level);
        var res = { codes: codes, names: names, indexs: this.defaultVal };
        this.$emit("confirm", res);
      } else if (this.level == 2) {
        var codes = [this.province[this.defaultVal[0]].id, this.province[this.defaultVal[0]].child[this.defaultVal[1]].id];
        var names = [this.province[this.defaultVal[0]].area_name, this.province[this.defaultVal[0]].child[this.defaultVal[1]].area_name];
        codes = codes.splice(0, this.level);
        names = names.splice(0, this.level);
        var res = { codes: codes, names: names, indexs: this.defaultVal };
        this.$emit("confirm", res);
      } else if (this.level == 1) {
        var codes = [this.province[this.defaultVal[0]].id];
        var names = [this.province[this.defaultVal[0]].area_name];
        codes = codes.splice(0, this.level);
        names = names.splice(0, this.level);
        var res = { codes: codes, names: names, indexs: this.defaultVal, item: this.province[this.defaultVal[0]] };
        this.$emit("confirm", res);
      }

      this.$refs.guipopupforareapicker.close();
    },
    open: function () {
      this.$refs.guipopupforareapicker.open();
    },
    close: function () {
      this.$refs.guipopupforareapicker.close();
    },
    stopfun: function (e) {
      e.stopPropagation();
      return null;
    },
  },
  emits: ["confirm"],
};
</script>
<style scoped></style>
