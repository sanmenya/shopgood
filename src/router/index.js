import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Role from '@/components/role.vue'
import Goods from '@/components/goods.vue'
import Goodsadd from '@/components/goodsadd.vue'
import Params from '@/components/params.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/users',
          name: 'Users',
          component: Users
        },
        {
          path: '/',
          redirect: { name: 'Users' }
        },
        {
          path: '/rights',
          name: 'Rights',
          component: Rights
        },
        {
          path: '/roles',
          name: 'Role',
          component: Role
        },
        {
          path: '/goods',
          name: 'Goods',
          component: Goods
        },
        {
          path: '/goodsadd',
          name: 'Goodsadd',
          component: Goodsadd
        },
        {
          path: '/params',
          name: 'Params',
          component: Params
        }
      ]
    }
  ]
})
