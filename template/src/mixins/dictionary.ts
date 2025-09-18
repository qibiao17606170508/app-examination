/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-11 10:16:43
 */
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

interface DictionaryItem {
  value: string
  [key: string]: any
}

interface Dictionary {
  dictionaryMap: Record<string, DictionaryItem>
  dictionaryList: DictionaryItem[]
}

export default function () {
  const store = useStore()

  const dictionary: Dictionary = reactive({
    dictionaryMap: {},
    dictionaryList: [],
  })

  const getDictionary = async (
    code: string
  ): Promise<{
    list: DictionaryItem[]
    map: Record<string, DictionaryItem>
  }> => {
    const response: DictionaryItem[] = await store.dispatch(
      'dictionary/getDictionary',
      code
    )
    dictionary.dictionaryList = response
    const result: Record<string, DictionaryItem> = {}
    response.forEach((item) => {
      result[item.value] = item
    })
    dictionary.dictionaryMap = result
    return { list: response, map: result }
  }

  return {
    ...toRefs(dictionary),
    getDictionary,
  }
}
