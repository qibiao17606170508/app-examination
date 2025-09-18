/*
 * @Description: 首页数据
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2020-12-28 16:25:18
 * @LastEditors: Jack Qi
 * @LastEditTime: 2025-05-09 16:42:13
 */
import service from '@/utils/request'
import { download } from '@/utils'

/**
 * @description: 获取试卷 teacher/papers/list
 * @return {Promise<any>}
 * @author: qibiao
 */
export function getPaperList(data: any): Promise<any> {
  return service({
    url: '/teacher/papers/list',
    method: 'POST',
    data,
  })
}
/**
 * @description: 添加试卷 teacher/papers/add
 * @return {*}
 * @author: Jack Qi
 */
export function addPaper(params: any): Promise<any> {
  return service({
    url: '/teacher/papers/add',
    method: 'POST',
    data: params,
  })
}
/**
 * @description: 试卷删除 teacher/papers/delete
 * @return {*}
 * @author: Jack Qi
 */
export function deletePaper(params: any): Promise<any> {
  return service({
    url: '/teacher/papers/delete',
    method: 'POST',
    data: params,
  })
}
/**
 * @description: 获取试卷详情teacher/papers/detail
 * @return {*}
 * @author: Jack Qi
 */
export function getPaperDetail(params: any): Promise<any> {
  return service({
    url: '/teacher/papers/detail',
    method: 'POST',
    data: params,
  })
}
/**
 * @description: 试卷更新 teacher/papers/edit
 * @return {*}
 * @author: Jack Qi
 */
export function editPaper(params: any): Promise<any> {
  return service({
    url: '/teacher/papers/edit',
    method: 'POST',
    data: params,
  })
}
/**
 * @description: 题目列表 teacher/topic/list
 * @return {*}
 * @author: Jack Qi
 */
export function getTopicList(data: any): Promise<any> {
  return service({
    url: '/teacher/topic/list',
    method: 'POST',
    data,
  })
}
/**
 * @description: 修改题目 teacher/topic/edit
 * @return {*}
 * @author: Jack Qi
 */
export function editTopic(params: any): Promise<any> {
  return service({
    url: '/teacher/topic/edit',
    method: 'POST',
    data: params,
  })
}
/**
 * @description: 删除题目 teacher/topic/delete
 * @return {*}
 * @author: Jack Qi
 */
export function deleteTopic(params: any): Promise<any> {
  return service({
    url: '/teacher/topic/delete',
    method: 'POST',
    data: params,
  })
}
/**
 * @description: 新增题目 teacher/topic/add
 * @return {*}
 * @author: Jack Qi
 */
export function addTopic(params: any): Promise<any> {
  return service({
    url: '/teacher/topic/add',
    method: 'POST',
    data: params,
  })
}
/**
 * @description: 获取教授班级 teacher/student/getTeachClass
 * @return {*}
 * @author: Jack Qi
 */
export function getTeachClass(params: any): Promise<any> {
  return service({
    url: '/teacher/student/getTeachClass',
    method: 'POST',
    data: params,
  })
}
/**
 * @description: 编辑班级 teacher/student/updateTeachClass
 * @return {*}
 * @author: Jack Qi
 */
export function editClass(params: any): Promise<any> {
  return service({
    url: '/teacher/student/updateTeachClass',
    method: 'POST',
    data: params,
  })
}
/**
 * @description: 查询学生信息 teacher/student/list
 * @return {*}
 * @author: Jack Qi
 */
export function getStudentList(data: any): Promise<any> {
  return service({
    url: '/teacher/student/list',
    method: 'POST',
    data,
  })
}

/**
 * @description: 更新学生状态 teacher/student/edit
 * @return {*}
 * @author: Jack Qi
 */
export function editStudent(params: any): Promise<any> {
  return service({
    url: '/teacher/student/edit',
    method: 'POST',
    data: params,
  })
}
/**
 * @description: 编辑教授班级 teacher/student/updateTeachClass
 * @return {*}
 * @author: Jack Qi
 */
export function editTeachClass(params: any): Promise<any> {
  return service({
    url: '/teacher/student/updateTeachClass',
    method: 'POST',
    data: params,
  })
}
/**
 * @description: 查询学生信息 teacher/student/list
 * @return {*}
 * @author: Jack Qi
 */
export function getStudentInfo(data: any): Promise<any> {
  return service({
    url: '/teacher/student/list',
    method: 'POST',
    data,
  })
}
/**
 * @description: 更新学生状态 teacher/student/edit
 * @return {*}
 * @author: Jack Qi
 */
export function editStudentState(params: any): Promise<any> {
  return service({
    url: '/teacher/student/edit',
    method: 'POST',
    data: params,
  })
}
/**
 * @description: 获取知识点 teacher/topic/getKnowledge
 * @return {*}
 * @author: Jack Qi
 */
export function getKnowledge(data: any): Promise<any> {
  return service({
    url: '/teacher/topic/getKnowledge',
    method: 'get',
    params: data,
  })
}
/**
 * @description: 下载导入模板 teacher/topic/downloadTopic
 * @return {*}
 * @author: Jack Qi
 */
export async function downloadTopic(data: any): Promise<any> {
  var rData = await service({
    url: 'teacher/topic/downloadTopic',
    method: 'get',
    responseType: 'blob',
    params: data,
  })
  download(rData as any, '导入模板')
}
/**
 * @description: 批量导入 teacher/topic/importTopic
 * @return {*}
 * @author: Jack Qi
 */
export function importTopic(
  data: any,
  isBlob = false,
  name = '试卷.xlsx'
): Promise<any> {
  let formData = new FormData()
  if (isBlob) {
    formData.append('file', data.file)
  } else {
    formData.append('file', data.file, name)
  }
  formData.append('papers_id', data.papers_id)
  return service({
    url: '/teacher/topic/importTopic',
    method: 'POST',
    data: formData,
  })
}
/**
 * @description: 学生问题点 teacher/TeacherPanel/problemList
 * @return {*}
 * @author: Jack Qi
 */
export function getProblemList(data: any): Promise<any> {
  return service({
    url: '/teacher/TeacherPanel/problemList',
    method: 'POST',
    data,
  })
}
/**
 * @description: 上移下移 teacher/topic/setSort
 * @return {*}
 * @author: Jack Qi
 */
export function setSort(params: any): Promise<any> {
  return service({
    url: '/teacher/topic/setSort',
    method: 'POST',
    data: params,
  })
}
/**
 * @description: 知识覆盖点 teacher/TeacherPanel/knowledgeCoverList
 * @return {*}
 * @author: Jack Qi
 */
export function getKnowledgeCoverList(data: any): Promise<any> {
  return service({
    url: '/teacher/TeacherPanel/knowledgeCoverList',
    method: 'POST',
    data,
  })
}
/**
 * @description: 学生练习历史 teacher/TeacherPanel/practiceLog
 * @return {*}
 * @author: Jack Qi
 */
export function getPracticeLog(data: any): Promise<any> {
  return service({
    url: '/teacher/TeacherPanel/practiceLog',
    method: 'POST',
    data,
  })
}
