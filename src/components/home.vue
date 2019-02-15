<template>
<!-- 顶部 -->
        <el-container class="homeheader">
            <el-header>
                <el-row>
                    <el-col class="logo" :span="8"><div class="grid-content bg-purple"><img src="../assets/logo.png" alt="图片"></div></el-col>
                    <el-col class="dianshang" :span="8"><div class="grid-content bg-purple-light"><h2>电商后台管理</h2></div></el-col>
                    <el-col class="tuichu" :span="8"><div class="grid-content bg-purple"><a @click.prevent="handleexit()" href="#">退出</a></div></el-col>
                </el-row>
            </el-header>
        <el-container class="homeaside">
            <el-aside width="200px">
                <!-- 侧边栏 -->
                <!-- 用户管理 -->
    <el-menu default-active="1" @open="handleOpen" @close="handleClose" :unique-opened="true" :router="true">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>用户管理</span>
        </template>
          <el-menu-item index="users">
             <i class="el-icon-view"></i>
              用户列表
          </el-menu-item>
      </el-submenu>

      <!-- 权限管理 -->
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="2-1"><i class="el-icon-view"></i>权限列表</el-menu-item>
          <el-menu-item index="2-2"><i class="el-icon-view"></i>角色列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

        <!-- 商品管理 -->

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>商品管理</span>
        </template>
          <el-menu-item index="3-1"><i class="el-icon-view"></i>商品列表</el-menu-item>
          <el-menu-item index="3-2"><i class="el-icon-view"></i>分类参数</el-menu-item>
          <el-menu-item index="3-3"><i class="el-icon-view"></i>商品分类</el-menu-item>
      </el-submenu>

       <!-- 订单管理 -->
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>订单管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="4-1"><i class="el-icon-view"></i>订单列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

         <!-- 数据统计 -->
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>数据统计</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="5-1"><i class="el-icon-view"></i>数据报表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

    </el-menu>
            </el-aside>
            <el-container>
            <el-main class="homemain">
                <router-view></router-view>
            </el-main>
        </el-container>
        </el-container>
        </el-container>

</template>

<script>
export default {
  beforeMount () {
    if (!localStorage.getItem('token')) {
      this.$router.push({
        name: 'Login'
      })
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    handleexit () {
      localStorage.clear()
      this.$router.push({
        name: 'Login'
      })
      this.$message.warning('退出成功！')
    }
  }
}
</script>

<style>
.homeheader {
    height: 100%;
    background-color: yellowgreen
}
/* .homeaside {
    background-color: yellow
} */
.homemain {
    background-color: violet
}
.dianshang {
    line-height: 60px;
    text-align: center
}
.tuichu {
    text-align: right;
    line-height: 60px;
}
</style>
