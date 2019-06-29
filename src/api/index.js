import $request from '../utils/request'

export function getCate(data) {
  return $request({
    url: 'index/getCate',
    method: 'post',
    data
  })
}

// 登陆
export function Login(data) {
  return $request({
    url: 'Login/wxLogin',
    method: 'post',
    data
  })
}
// 重新登陆
export function reLogin(data) {
  return $request({
    url: 'Login/reLogin',
    method: 'post',
    data
  })
}

// 首页商品列表
export function getMainDatas(data) {
  return $request({
    url: 'index/index',
    method: 'post',
    data
  })
}
