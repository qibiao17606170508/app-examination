/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-09 11:28:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-09 10:40:51
 */

interface ListConfig {
  label: string
  label_en: string
  name: string
}

interface FormConfig {
  searchType: string
  searchName: string
  label: string
  placeholder: string
}

export const listConfig: ListConfig[] = [
  {
    label: '问题',
    label_en: 'Question',
    name: 'question',
  },
  {
    label: '答案',
    label_en: 'Answer',
    name: 'answer',
  },
]

export const formConfig: FormConfig[] = [
  {
    searchType: 'input',
    searchName: 'keywords',
    label: '问题',
    placeholder: '请输入关键字',
  },
]
