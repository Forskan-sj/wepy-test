import wepy from 'wepy'

const baseUrl = 'https://m_college.quansuwangluo.com/api/app/'

export default function request(param) {
  param.url = baseUrl + param.url
  wepy.showLoading({title: '数据加载中'})
  return new Promise((resolve, reject) => {
    wepy.hideLoading()
    wepy.request({
      ...param})
      .then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
  })
}
