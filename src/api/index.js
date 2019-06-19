import $request from '../utils/request'

export function getCate(data) {
  return $request({
    url: 'index/getCate',
    method: 'post',
    data
  })
}
