/*
 * @Description: 首页数据
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2020-12-28 16:25:18
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-12-10 16:18:09
 */
import service from '@/utils/request'

/**
 * @description: 学校列表
 * @return {Promise<any>}
 * @author: qibiao
 */
export function getSchoolList(data: any): Promise<any> {
  return service({
    url: 'web/school/list',
    method: 'POST',
    data,
  })
}
/**
 * @description: 学校详情 web/school/detail
 * @return {*}
 * @author: Jack Qi
 */
export function getSchoolDetail(data: any): Promise<any> {
  return service({
    url: 'web/school/detail',
    method: 'POST',
    data,
  })
}
/**
 * @description: 学校删除 web/school/delete
 * @return {*}
 * @author: Jack Qi
 */
export function deleteSchool(data: any): Promise<any> {
  return service({
    url: 'web/school/delete',
    method: 'POST',
    data,
  })
}
/**
 * @description: 学校修改 web/school/edit
 * @return {*}
 * @author: Jack Qi
 */
export function editSchool(data: any): Promise<any> {
  return service({
    url: 'web/school/edit',
    method: 'POST',
    data,
  })
}
/**
 * @description: 学校新增 web/school/add
 * @return {*}
 * @author: Jack Qi
 */
export function addSchool(data: any): Promise<any> {
  return service({
    url: 'web/school/add',
    method: 'POST',
    data,
  })
}
/**
 * @description: 班级列表 web/class/list
 * @return {*}
 * @author: Jack Qi
 */
export function getClassList(data: any): Promise<any> {
  return service({
    url: 'web/class/list',
    method: 'POST',
    data,
  })
}

/**
 * @description: 班级添加 web/class/add
 * @return {*}
 * @author: Jack Qi
 */
export function addClass(data: any): Promise<any> {
  return service({
    url: 'web/class/add',
    method: 'POST',
    data,
  })
}
/**
 * @description: 班级更新 web/class/edit
 * @return {*}
 * @author: Jack Qi
 */
export function editClass(data: any): Promise<any> {
  return service({
    url: 'web/class/edit',
    method: 'POST',
    data,
  })
}
/**
 * @description: 班级详情 web/class/detail
 * @return {*}
 * @author: Jack Qi
 */
export function getClassDetail(data: any): Promise<any> {
  return service({
    url: 'web/class/detail',
    method: 'POST',
    data,
  })
}
/**
 * @description: 班级删除 web/class/delete
 * @return {*}
 * @author: Jack Qi
 */
export function deleteClass(data: any): Promise<any> {
  return service({
    url: 'web/class/delete',
    method: 'POST',
    data,
  })
}
/**
 * @description: 获取学科列表 web/subject/list
 * @return {*}
 * @author: Jack Qi
 */
export function getSubjectList(data: any): Promise<any> {
  return service({
    url: 'web/subject/list',
    method: 'POST',
    data,
  })
}
/**
 * @description: 获取省市区 common/common/getAddress
 * @return {*}
 * @author: Jack Qi
 */
export function getAddress(data: any): Promise<any> {
  return service({
    url: 'common/common/getAddress',
    method: 'POST',
    data,
  })
}
/**
 * @description: 获取年级 common/common/getGrade
 * @return {*}
 * @author: Jack Qi
 */
export function getGrade(data: any): Promise<any> {
  return service({
    url: 'common/common/getGrade',
    method: 'POST',
    data,
  })
}
/**
 * @description: 知识点 web/Knowledge/list
 * @return {*}
 * @author: Jack Qi
 */
export function getKnowledgeList(data: any): Promise<any> {
  return service({
    url: 'web/Knowledge/list',
    method: 'POST',
    data,
  })
}
/**
 * @description: 删除知识点 web/Knowledge/delete
 * @return {*}
 * @author: Jack Qi
 */
export function deleteKnowledge(data: any): Promise<any> {
  return service({
    url: 'web/Knowledge/delete',
    method: 'POST',
    data,
  })
}
/**
 * @description: 新增知识点 web/Knowledge/add
 * @return {*}
 * @author: Jack Qi
 */
export function addKnowledge(data: any): Promise<any> {
  return service({
    url: 'web/Knowledge/add',
    method: 'POST',
    data,
  })
}
/**
 * @description: 知识点编辑 web/Knowledge/edit
 * @return {*}
 * @author: Jack Qi
 */
export function editKnowledge(data: any): Promise<any> {
  return service({
    url: 'web/Knowledge/edit',
    method: 'POST',
    data,
  })
}
/**
 * @description: 题库列表 web/Topic/list
 * @return {*}
 * @author: Jack Qi
 */
export function getTopicList(data: any): Promise<any> {
  return service({
    url: 'web/Topic/list',
    method: 'POST',
    data,
  })
}

/**
 * @description: 题库详情 web/Topic/detail
 * @return {*}
 * @author: Jack Qi
 */
export function getTopicDetail(data: any): Promise<any> {
  return service({
    url: 'web/Topic/detail',
    method: 'POST',
    data,
  })
}
/**
 * @description: 添加题库 web/Topic/add
 * @return {*}
 * @author: Jack Qi
 */
export function addTopic(data: any): Promise<any> {
  return service({
    url: 'web/Topic/add',
    method: 'POST',
    data,
  })
}
/**
 * @description: 题库更新 web/Topic/edit
 * @return {*}
 * @author: Jack Qi
 */
export function editTopic(data: any): Promise<any> {
  return service({
    url: 'web/Topic/edit',
    method: 'POST',
    data,
  })
}
/**
 * @description: 设置公开显示状态 web/Topic/editStatus
 * @return {*}
 * @author: Jack Qi
 */
export function editTopicStatus(data: any): Promise<any> {
  return service({
    url: 'web/Topic/editStatus',
    method: 'POST',
    data,
  })
}
/**
 * @description: 删除题库 web/Topic/delete
 * @return {*}
 * @author: Jack Qi
 */
export function deleteTopic(data: any): Promise<any> {
  return service({
    url: 'web/Topic/delete',
    method: 'POST',
    data,
  })
}
/**
 * @description: 教师删除 web/Teacher/delete
 * @return {*}
 * @author: Jack Qi
 */
export function deleteTeacher(data: any): Promise<any> {
  return service({
    url: 'web/Teacher/delete',
    method: 'POST',
    data,
  })
}

/**
 * @description: 教师列表 web/Teacher/list
 * @return {*}
 * @author: Jack Qi
 */
export function getTeacherList(data: any): Promise<any> {
  return service({
    url: 'web/Teacher/list',
    method: 'POST',
    data,
  })
}
/**
 * @description: 教师详情 web/Teacher/detail
 * @return {*}
 * @author: Jack Qi
 */
export function getTeacherDetail(data: any): Promise<any> {
  return service({
    url: 'web/Teacher/detail',
    method: 'POST',
    data,
  })
}
/**
 * @description: 教师新增 web/Teacher/add
 * @return {*}
 * @author: Jack Qi
 */
export function addTeacher(data: any): Promise<any> {
  return service({
    url: 'web/Teacher/add',
    method: 'POST',
    data,
  })
}

/**
 * @description: 教师更新 web/Teacher/edit
 * @return {*}
 * @author: Jack Qi
 */
export function editTeacher(data: any): Promise<any> {
  return service({
    url: 'web/Teacher/edit',
    method: 'POST',
    data,
  })
}
/**
 * @description: 教师状态更新 web/Teacher/editStatus
 * @return {*}
 * @author: Jack Qi
 */
export function editTeacherStatus(data: any): Promise<any> {
  return service({
    url: 'web/Teacher/editStatus',
    method: 'POST',
    data,
  })
}
/**
 * @description: 学生列表 web/Student/list
 * @return {*}
 * @author: Jack Qi
 */
export function getStudentList(data: any): Promise<any> {
  return service({
    url: 'web/Student/list',
    method: 'POST',
    data,
  })
}

/**
 * @description: 学生详情 web/Student/detail
 * @return {*}
 * @author: Jack Qi
 */
export function getStudentDetail(data: any): Promise<any> {
  return service({
    url: 'web/Student/detail',
    method: 'POST',
    data,
  })
}
/**
 * @description: 学生新增 web/Student/add
 * @return {*}
 * @author: Jack Qi
 */
export function addStudent(data: any): Promise<any> {
  return service({
    url: 'web/Student/add',
    method: 'POST',
    data,
  })
}
/**
 * @description: 学生更新 web/Student/edit
 * @return {*}
 * @author: Jack Qi
 */
export function editStudent(data: any): Promise<any> {
  return service({
    url: 'web/Student/edit',
    method: 'POST',
    data,
  })
}
/**
 * @description: 学生状态更新 web/Student/editStatus
 * @return {*}
 * @author: Jack Qi
 */
export function editStudentStatus(data: any): Promise<any> {
  return service({
    url: 'web/Student/editStatus',
    method: 'POST',
    data,
  })
}
/**
 * @description: 学生删除 web/Student/delete
 * @return {*}
 * @author: Jack Qi
 */
export function deleteStudent(data: any): Promise<any> {
  return service({
    url: 'web/Student/delete',
    method: 'POST',
    data,
  })
}
/**
 * @description: 题库导入 web/Topic/import
 * @return {*}
 * @author: Jack Qi
 */
export function importTopic(data: any): Promise<any> {
  return service({
    url: 'web/Topic/import',
    method: 'POST',
    data,
  })
}
