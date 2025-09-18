/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-11 10:41:18
 */
import { subSelectListApi } from '@/api/dictionary'

interface DictionaryItem {
  value: number | string
  labelCn: string
  labelEn: string
}

interface State {
  map: Record<string, DictionaryItem[]>
}

export default {
  state: {
    map: {} as Record<string, DictionaryItem[]>,
  },
  getters: {
    dictionary(state: State) {
      return state.map
    },
  },
  mutations: {
    SET_MAP: (state: State, map: Record<string, DictionaryItem[]>) => {
      state.map = { ...state.map, ...map }
    },
  },
  actions: {
    async getDictionary(
      { commit, state }: { commit: Function; state: State },
      code: string
    ) {
      if (state.map[code] && JSON.stringify(state.map[code]) !== '{}') {
        return state.map[code]
      } else {
        const params = { code } // 假设Params类型包含code属性
        const r = await subSelectListApi(params)
        if (r) {
          const map: Record<string, DictionaryItem[]> = {}
          const arr = r.data.map((item: any) => {
            return {
              value: /^[0-9]+.?[0-9]*$/.test(item.type)
                ? +item.type
                : item.type,
              labelCn: item.name,
              labelEn: item.name,
              type: item.type,
            }
          })
          map[code] = arr
          commit('SET_MAP', map)
          return state.map[code]
        } else {
          return {}
        }
      }
    },
  },
}
