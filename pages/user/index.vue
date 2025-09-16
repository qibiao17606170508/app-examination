<template>
  <gui-page :customHeader="true" :headerClass="headerClass" :headerStyle="{ background: headerClass.length == 0 ? 'linear-gradient(190deg, #ACC9FF 34%, rgba(216, 227, 253, 0) 67%)' : '#fff' }">
    <template v-slot:gHeader>
      <view style="height: 44px" class="gui-flex gui-nowrap gui-rows gui-align-items-center">
        <text class="gui-h6 gui-blod gui-flex1 gui-ellipsis gui-text-center gui-header-content">智启AI</text>
      </view>
    </template>
    <template v-slot:gBody>213</template>
  </gui-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  // 离开页面清除定时器
  onUnload() {
    clearInterval(this.timer);
  },
  onHide() {
    clearInterval(this.timer);
  },
  methods: {},
  async onShow() {},
};
</script>
<style>
page {
  background: #fff;
}
</style>
<style scoped lang="scss"></style>
