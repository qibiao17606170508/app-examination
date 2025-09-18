import { computed, getCurrentInstance } from 'vue'
import { MODEL_NAME, UPDATE_MODEL_EVENT } from '@/utils/constant'

export default function useModel<T>(props: Record<string, any>, key?: string) {
  const vm = getCurrentInstance()?.proxy

  return computed<T>({
    get() {
      return props[key || MODEL_NAME]
    },
    set(value: T) {
      const event = key ? `update:${key}` : UPDATE_MODEL_EVENT
      vm?.$emit(event, value)
    },
  })
}
