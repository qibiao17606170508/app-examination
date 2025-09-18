<template>
  <gui-page :apiLoadingStatus="apiLoadingStatus" :loadmore="true" @loadmorefun="getdata" ref="guipage" :customHeader="true">
    <template v-slot:gHeader>
      <view style="height: 44px" class="gui-flex gui-nowrap gui-rows gui-align-items-center"></view>
    </template>
    <template v-slot:gBody>
      <text v-for="(item, idx) in demoData" :key="idx" class="demo gui-block gui-bg-white gui-dark-bg-level-3 gui-primary-text gui-text-center gui-text-small">{{ item }}</text>
    </template>
  </gui-page>
</template>
<script>
// 模拟数据
var data = [1, 2, 3, 4, 5, 6, 7, 8];
import graceJS from "@/Grace6/js/grace.js";
// 模拟页码
var page = 1;
export default {
  data() {
    return {
      demoData: [],
      pageLoading: true,
      // 用于记录是否有 api 请求正在执行
      apiLoadingStatus: false,
    };
  },
  onLoad: function () {
    // 页码加载时第一次加载数据
    page = 1;
    this.demoData = [];
    this.getdata();
  },
  methods: {
    getdata: function () {
      this.apiLoadingStatus = true;
      console.log("加载函数运行，页码 : " + page);
      // 模拟 api 请求刷新数据
      setTimeout(() => {
        // 对演示数据随机刷新模拟数据刷新
        var demoArr = graceJS.arrayShuffle(data);
        if (page >= 2) {
          this.demoData = this.demoData.concat(demoArr);
          // 加载完成后停止加载动画
          this.$refs.guipage.stopLoadmore();
          // 假定第3页加载了全部数据，通知组件不再加载更多
          // 实际开发由接口返回值来决定
          if (page >= 3) {
            this.$refs.guipage.nomore();
          }
        }
        // 第一页数据
        else {
          this.demoData = demoArr;
          this.pageLoading = false;
          // 加载完成后停止加载动画
          this.$refs.guipage.stopLoadmore();
        }
        page++;
        this.apiLoadingStatus = false;
      }, 1000);
    },
  },
};
</script>
<style>
page {
  background-image: linear-gradient(180deg, #e0f8ff 0, #fff 20%);
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>

<style scoped>
.demo {
  margin: 30rpx;
  margin-bottom: 0rpx;
  line-height: 200rpx;
}
</style>
