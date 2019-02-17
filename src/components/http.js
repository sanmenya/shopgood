import aixos from 'axios'
const httpServer = {}
httpServer.install = function (Vue, options) {
  aixos.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 拦截器
  aixos.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      aixos.defaults.headers.common['Authorization'] = AUTH_TOKEN
    }
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })
  // 4. 添加实例方法
  Vue.prototype.$http = aixos
}
export default httpServer
