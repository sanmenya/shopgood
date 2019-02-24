// 通过自定义插件（开发插件）封装代码
import axios from 'axios'
import { Message } from 'element-ui'
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
  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    console.log(response)
    console.log('aaa')
    const {meta: { status, msg }} = response.data
    if (status !== 200 && status !== 201) {
      Message.warning(msg)
    }
    return response
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  })

  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  Vue.prototype.$http = axios
}
export default HttpServer
