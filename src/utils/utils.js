import wepy from 'wepy'

export function setCache(key, value) {
  try {
    wepy.setStorageSync(key, value)
  } catch (e) { }
}

export function getCache(key) {
  try {
    var value = wepy.getStorageSync(key)
    if (value) {
      return value
    }
  } catch (e) {
  }
}

export function removeCache(key, t) {
  wepy.removeStorage({ key }).then(t)
}

export function showTos(msg) {
  wepy.showToast({
    title: msg,
    icon: 'none'
  })
}
