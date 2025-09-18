<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-09 10:49:46
-->
<template>
  <div class="loading-container height-full" ref="refContainer">
    <div v-loading="loading" class="height-full">
      <iframe
        ref="refIframe"
        :src="url"
        width="100%"
        height="100%"
        frameborder="0"
        scrolling="yes"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const route = useRoute()

    const refContainer = ref<HTMLElement | null>(null)
    const refIframe = ref<HTMLIFrameElement | null>(null)

    const loading = ref<boolean>(false)

    const url = computed<string>(() => {
      return route.meta.url as string
    })

    watch(url, () => {
      loading.value = true
    })

    onMounted(() => {
      loading.value = true
      if (refIframe.value) {
        refIframe.value.onload = () => {
          loading.value = false
        }
      }
    })

    return {
      refContainer,
      refIframe,
      loading,
      url,
    }
  },
})
</script>
