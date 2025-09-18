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
