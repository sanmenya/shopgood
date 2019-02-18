// 通过自定义插件（开发插件）封装代码
import axios from 'axios'
const HttpServer = {}
HttpServer.install = function (Vue) {
  axios.interceptors.request.use(
    function (config) {
      if (config.url !== 'login') {
        const AUTH_TOKEN = localStorage.getItem('token')
        config.headers.common['Authorization'] = AUTH_TOKEN
      }
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  Vue.prototype.$http = axios
}
export default HttpServer
