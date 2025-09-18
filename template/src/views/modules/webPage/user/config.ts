/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-09 11:28:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-11 16:02:27
 */

interface ListConfig {
  label: string
  label_en: string
  name: string
  width: string
}

interface SelectOption {
  label: string
  value: string | number
}

interface FormConfig {
  searchType: string
  searchName: string
  label: string
  placeholder: string
  selectOptions?: SelectOption[]
  remote?: boolean
  remoteMethod?: (query: string, row: any, index: number) => void
  picker?: string
  'start-placeholder'?: string
  'end-placeholder'?: string
}

export const listConfig: any[] = [
  {
    label: '用户ID',
    name: 'id',
  },
  {
    label: '姓名',
    name: 'nickname',
  },
  {
    label: '用户名',
    name: 'username',
  },
  {
    label: '手机号',
    name: 'phone',
  },
  {
    label: '身份',
    name: 'standing',
  },
  {
    label: '学校',
    name: 'school_name',
  },
  {
    label: '学科',
    name: 'subject_name',
  },
  {
    label: '状态',
    name: 'status',
    switch: true,
    true: 1,
    false: 0,
  },
]

export const listDialogConfig: any[] = [
  {
    label: '用户ID',
    name: 'id',
  },

  {
    label: '姓名',
    name: 'nickname',
  },
  {
    label: '学号',
    name: 'student_number',
  },
  {
    label: '性别',
    name: 'sex',
    options: [
      { label: '未知', value: 0 },
      { label: '男', value: 1 },
      { label: '女', value: 2 },
    ],
  },
  {
    label: '用户名',
    name: 'username',
  },
  {
    label: '手机号',
    name: 'phone',
  },
  {
    label: '身份',
    name: 'standing',
  },
  {
    label: '学校',
    name: 'school_name',
  },
  {
    label: '班级',
    name: 'class_name',
  },
  {
    label: '状态',
    name: 'status',
    switch: true,
    true: 1,
    false: 0,
  },
]

export const formConfig: FormConfig[] = []
