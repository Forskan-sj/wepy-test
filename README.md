### wepy  类vue写法写小程序，Tencent官方推荐框架

[GitHub](https://github.com/Tencent/wepy.git)
[官方文档](https://tencent.github.io/wepy/document.html#/)
#####类Vue开发风格
#####支持自定义组件开发
#####支持引入NPM包
#####支持Promise
#####支持ES2015+特性，如Async Functions
#####支持多种编译器，Less/Sass/Stylus/PostCSS、Babel/Typescript、Pug
#####支持多种插件处理，文件压缩，图片压缩，内容替换等
#####支持 Sourcemap，ESLint等
#####小程序细节优化，如请求列队，事件优化等

```
npm i
npm run dev / wepy build --watch
```

1. app.wpy文件结构 app.wpy为入口文件，对应app
```
import 'wepy-async-function' 使用promise
...
constructor() {
	super()
	this.use('requestfix') // requestfix: 修复小程序请求并发问题。
    this.use('promisify')  // promise   
}
promise化调用方式

wepy.getUserInfo().then((res) => {
  console.log(res)
})
...


config ={
	对应json文件
	pages: [
		第一个页面为默认页面，跟小程序一致
	],
	window:{

	}
}
<!-- 全局数据 -->
globalData = {

}

```

2. wx.request

```
原生：
wx.request({
	url: 'xx',
	success: function(data) {
		console.log(data)
	}
	})

对wepy进行了一个封装
requst.js

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

api.js
import $request from '../utils/request'
export function getCate(data) {
  return $request({
    url: 'index/getCate',
    method: 'post',
    data
  })
}
*.wpy
import { getCate } from '@/api/index'
onclick() {

	getCate({})
	.then((res) => {
	    console.log(res)
	})
	.catch((err) => {
		console.log(err)
	})
}
```

3. 优化事件参数传递

```
原生：
<view data-id="{{index}}" data-title="wepy" data-other="otherparams" bindtap="tapName"> Click me! </view>

wepy：
<view @tap="tapName({{index}}, 'wepy', 'otherparams')"> Click me! </view>

methods = {
	tapName(p1, p2, p3, e) {
		console.log(p1, p2, p3, e) // e为事件参数
	}
}
```

4. 绑定class

```
与原生一致：
<view class="class-a {{true ? 'class-b' : 'class-c'}}">

vue：
<div class="class-a" :class="{true ? 'class-b': 'class-c'}"></div>
```

5. 组件

```
原生组件写法：
Component({
  options:{},
  properties:{},
  data:{},
  created:function(){},
  attached:function(){},
  ready:function(){},
  moved:function(){},
  detached:function(){}, 
  methods:{
    //子组件采用this.triggerEvent('layerBkSH',routeName);触发，routeName不为''，为切换弹窗,不传值为关闭当前窗口
    _testEvent() {
      var sdf={
        name:'test',
        age:'19',
        sex:'22',
        num:'asdf23423413',
        param:'tests'
      };
      this.triggerEvent('cancelEfdst', sdf);
    },
    _confirmEvent() {
      this.triggerEvent('confirmEvent');
    },
  },
})
json:
"component":true,
"usingComponents":{
    "userInfo":"../userInfo/userInfo/userInfo",
    "hisNotices":"../dirOptions/hisNotices/hisNotices"
 }

 wepy写法：extends wepy.component
 export default class Ceshi2 extends wepy.component({})
 其他与页面写法一致
```

6. 组件通信
	
#### 1.$invoke('name',  'funName', param1, param2) 父 -> 指定子组件指定函数
#### 2.$broadcast('ceshievent') 父 -> 指定事件，所有子组件接收
#### 3.$emit('eEvt', tempData)  子 -> 指定事件，所有父组件接收
2 3 事件要写在event中， 1  直接调用methods方法
```
子 -> 父
const tempData = {
  a: 'asdf',
  b: 233,
  c: {
    s: 2
  }
}
this.$emit('eEvt', tempData)

父接收：
events = {
  'eEvt': (...args) => {
    console.log(args)
  }
}

父 -> 子
1. this.$broadcast('ceshievent')
2. this.$invoke('ceshi1', 'funName', 11, 22)
```
7. preload
下一页数据预加载
app.wpy
pages:[
	'page/page2?id=23'
]


```
page1：

[p1: key, p2: value ]
this.$preload('test', {ss: 'contest', a: 'asdfasdf'})

page2:
onload(id, param) {
	console.log(id, param.preload)
}

```

8. wepy注意事项
```
	与Vue开发不同之处
```

```
	1、methods方法使用不同：methods方法中只用于声明页面wxml中标签的bind、catch事件，自定义方法需以自定义方法的方式声明。
	2、命名规范不同：template里面组件组件标签命名使用驼峰式命名(即comChild),而不是短横杠式命名(com-child)。
	3、响应事件顺序不同：对于组件methods响应事件，以及小程序页面事件将采用兼容式混合，
	即先响应组件本身响应事件，然后再响应混合对象(mixin)中响应事件。
	注意，这里事件的执行顺序跟Vue中相反，Vue中是先执行mixin中的函数， 再执行组件本身的函数。
	4、wepy中也有computed,props,slot,data,watch等vue中有的一些属性(没有filter, directive)
	props,slot,data,watch和vue基本无异，其中computed计算属性是无法传参的。
	5、wepy中props传递需要加上.sync修饰符（类似VUE1.x）才能实现props动态更新，
	并且父组件再变更传递给子组件props后要执行this.$apply()方法才能更新。
	关于props动态传值，可以通过设置子组件props的twoWay: true来达到子组件数据绑定至父组件的效果。
	那如果既使用.sync修饰符，同时子组件props中添加的twoWay: true时，就可以实现数据的双向绑定了。
	6、wepy支持数据双向绑定，子组件在定义props时加上twoway:true属性值即可实现子组件修改父组件数据。
	7、VUE2.x推荐使用eventBus方式进行组件通信，而在wepy中是通过$broadcast，$emit，$invoke 三种方法实现通信。
	8、VUE的生命周期包括created、mounted等，wepy仅支持小程序的生命周期：onLoad、onReady等。
	9、wepy不支持过滤器、keep-alive、ref、transition、全局插件、路由管理、服务端渲染等VUE特性技术。
```

```
	与原生开发不同之处
```

```
1、数据绑定写法不一：this.title = 'this is title'; 替换 this.setData({title: 'this is title'});
注意：在异步函数中更新数据的时候，必须手动调用$apply方法，才会触发脏数据检查流程的运行。
setTimeout(() => {
    this.title = 'this is title';
    this.$apply();
}, 3000);
2、组件的循环渲染新增repeat标签，其中该标签不能添加类名，即不能添加样式。
3、wepy框架对原生API请求进行封装了，可以使用拦截器就行拦截。
4、wepy框架封装的方法都是Promise，不是Object，一些原生方法返回的是Object，可以直接获取到方法的返回对象。
```

9. 全局对象

```
app.wpy
globalData = {
	userInfo: null
}
子页面 无需引用
this.$parent.globalData.userInfo
```

10. wepy-redux 类似vuex

[参考文章](https://www.jianshu.com/p/cc9a78d091e7)
[github](https://www.baidu.com/link?url=b5Z90ojORx-xYu5qYxaGs-1UAPZ60vy3IGZ3cNerX5FURE2YTv1NM1DXC_rYqKnZKgKDClZCDJG467e5psm67a&wd=&eqid=f9f82674000d682c000000045d09e1cb)

####store->type  
	定义函数名称，全大写，不包含实现
####store->reducers
	({函数实现}, {变量名称})
####store->actions ???? WTF!

使用：
```
import { connect } from 'wepy-redux'
import { INCREMENT, DECREMENT } from '../store/types/counter'
@connect({
    num (state) {
      return state.counter.num
    },
    asyncNum (state) {
      return state.counter.asyncNum
    },
    sumNum (state) {
      return state.counter.num + state.counter.asyncNum
    }
  }, {
    icNum: INCREMENT,
    dcNum: DECREMENT
  })


调用store变量： this.num  this.sunNum
调用store函数:  this.methods.icNum()
```

简单点：
app.wpy
```
import { setStore } from 'wepy-redux'
import configStore from './store'
const store = configStore()
setStore(store)
wepy.$store = store
```

*.wpy 无需任何引用  无需connect连接
```
wepy.$store.dispatch({ type: 'INCREMENT' })
console.log(wepy.$store.getState().counter.num)
```
