// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import moment from 'moment'
import cusBread from './components/cusbread.vue'// 面包屑组建
// 引入公共的样式文件
import './assets/css/base.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 使用自己开发的插件（axios 这只请求头的token）
import HttpServer from './components/http'
Vue.use(HttpServer)

// 插件的使用 基于Vue
Vue.use(ElementUI)

Vue.config.productionTip = false

// 全局过滤器 处理日期
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

// 全局使用面包屑组建
Vue.component(cusBread.name, cusBread)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
