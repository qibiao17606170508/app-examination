<template>
  <gui-page>
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
  background: #f5f5f5;
}
</style>
<style scoped lang="scss"></style>
