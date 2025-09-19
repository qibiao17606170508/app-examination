import request from "@/utils/request/index_base.js";

/**
 * 通用接口
 */

// 获取学校列表
export function getSchoolListApi() {
  return request.request({
    url: "common/common/getSchool",
    method: "POST",
  });
}

// 获取学科列表
export function getSubjectListApi(data) {
  return request.request({
    url: "common/common/getSubject",
    method: "POST",
    data,
  });
}

// 获取班级列表
export function getClassListApi(data) {
  return request.request({
    url: "common/common/getClass",
    method: "POST",
    data,
  });
}

// 获取用户信息
export function getUserInfoApi(data) {
  return request.request({
    url: "student/user/getInfo",
    method: "POST",
    data,
  });
}

// 获取练习历史
export function getPracticeLogApi(data) {
  return request.request({
    url: "student/PracticeLog/list",
    method: "POST",
    data,
  });
}

// 获取练习统计
export function getPracticeStatisticsApi(data) {
  return request.request({
    url: "student/PracticeStatistics/list",
    method: "POST",
    data,
  });
}

// 获取错题分析
export function getPracticeAnalyzeApi(data) {
  return request.request({
    url: "student/Analyze/getAnalyze",
    method: "POST",
    data,
  });
}

// 设置错题分析
export function setPracticeAnalyzeApi(data) {
  return request.request({
    url: "student/Analyze/setAnalyze",
    method: "POST",
    data,
  });
}

// 获取练习列表（登记错题）
export function getPracticeListApi(data) {
  return request.request({
    url: "student/Practice/list",
    method: "POST",
    data,
  });
}

// 获取登记错题试卷列表
export function getPapersApi(data) {
  return request.request({
    url: "student/RegisterTopic/getPapers",
    method: "POST",
    data,
  });
}

// 获取登记错题题目列表
export function getTopicsApi(data) {
  return request.request({
    url: "student/RegisterTopic/getTopics",
    method: "POST",
    data,
  });
}

// 设置登记错题题目
export function setTopicsApi(data) {
  return request.request({
    url: "student/RegisterTopic/setTopics",
    method: "POST",
    data,
  });
}

// 获取随机练习题目
export function getPracticeListRandomApi(data) {
  return request.request({
    url: "student/Practice/list",
    method: "POST",
    data,
  });
}

// 提交练习答案
export function setPracticeAddApi(data) {
  return request.request({
    url: "student/Practice/add",
    method: "POST",
    data,
  });
}
