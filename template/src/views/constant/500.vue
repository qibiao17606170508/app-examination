<template>
  <div class="no-authority-container">
    <h2 class="status-code">500</h2>
    <p class="describe">{{ $t('errorPage.error500Title') }}</p>
    <p class="suggest">{{ $t('errorPage.contact') }}</p>
    <!--
 <p class="timeout">
      <em>{{ endTime }}</em>秒后自动返回首页
    </p>
-->
    <el-button v-repeat @click="jump(0)">
      {{ $t('errorPage.return') }}
    </el-button>
    <el-button v-repeat type="primary" @click="jump(1)">
      {{ $t('errorPage.homePage') }}
    </el-button>
    <el-button v-repeat type="primary" @click="jump(2)">
      {{ $t('errorPage.signInAgain') }}
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useStore()

    const endTime = ref<number>(10)
    const timer = ref<number>(-1)

    watch(endTime, (newVal: number, _oldVal: number) => {
      if (newVal === 0) {
        clearTimeout(timer.value)
        router.push({ name: 'login', replace: true })
      }
    })

    // onMounted(() => {
    //   timer.value = window.setInterval(() => {
    //     endTime.value--
    //   }, 1000)
    // })

    const jump = (type: number) => {
      switch (type) {
        case 0:
          router.back()
          break
        case 1:
          router.push({ name: 'redirect', replace: true })
          break
        case 2:
          store.dispatch('logout')
          router.push({ name: 'login' })
          break
      }
      clearTimeout(timer.value)
    }

    return {
      endTime,
      timer,
      jump,
    }
  },
})
</script>

<style lang="scss" scoped>
.no-authority-container {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0);
  text-align: center;
  .status-code {
    margin: 20px 0;
    font-size: 10em;
  }
  .describe {
    margin-bottom: 10px;
    font-size: 26px;
    & > em {
      font-style: normal;
      color: var(--el-color-warning);
    }
  }
  .suggest {
    margin-top: 10px;
    font-size: 14px;
    text-align: left;
    color: var(--el-text-color-placeholder);
  }
  .timeout {
    margin-bottom: 30px;
    font-size: 18px;
    > em {
      margin: 0 10px;
      color: var(--el-color-warning);
    }
  }
}
.error-container {
  margin: 0 auto;
  padding-top: 100px;
  width: 800px;
  max-width: 100%;
  .other-go {
    font-size: 14px;
    li {
      padding-bottom: 5px;
      cursor: pointer;
    }
    a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
