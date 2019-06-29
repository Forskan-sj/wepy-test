import wepy from 'wepy'
import { getCache, setCache } from './utils'
import { reLogin } from '../api'
// const baseUrl = 'https://m_college.quansuwangluo.com/api/app/'
const baseUrl = 'http://shuimeiren.qs110.com/api/'

export default function request(param) {
  param.url = baseUrl + param.url
  param.header = {
    'content-type': 'application/x-www-form-urlencoded',
    'token': getCache('sid') || ''
  }
  wepy.showLoading({title: '数据加载中'})
  return new Promise((resolve, reject) => {
    wepy.hideLoading()
    wepy.request({
      ...param})
      .then((res) => {
        if (res.data.success === 10) {
          wepy.login().then((res) => {
            if (res.code) {
              reLogin({code: res.code}).then((re) => {
                setCache('sid', re.data)
                console.log(getCache('sid'))
                // @ts-ignore
                 // eslint-disable-next-line no-undef
                if (getCurrentPages().length !== 0) {
                  // @ts-ignore
                  // eslint-disable-next-line no-undef
                  getCurrentPages()[getCurrentPages().length - 1].onLoad()
                }
              })
            }
          })
        } else if (res.data.success === 100) {
          wepy.navigateTo({
            url: 'shouquan'
          })
        } else {
          resolve(res.data)
        }
      }).catch((err) => {
        reject(err)
      })
  })
}
