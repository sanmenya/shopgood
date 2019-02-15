<template>
    <el-card>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row class="search">
            <el-col>
                <!-- 搜索框 -->
                 <el-input placeholder="请输入内容" v-model="query" class="searchinput">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                 </el-input>
                 <el-button type="primary">添加用户</el-button>
            </el-col>
        </el-row>

            <!-- 表格 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
      <el-table-column  label="创建日期" width="200">
          <!-- 前提: 单元格内容不是prop的值,
      3.1 给单元格内容外层加template
      3.2 给template设置slot-scope
      3.3 slot-scope的值 自动绑定为外层数据el-table :data="list"
      3.4 在template内部通过list.row 自动取出数组list中每个对象
      3.5 list.row.属性create_time
      注意: row是固定写法 -->
          <template slot-scope="list">
              <!-- 内层list.row表示list 的每一个对象 -->
          {{list.row.create_time | fmtdate}}
          </template>
      </el-table-column>
      <el-table-column prop="date" label="用户状态" width="120"></el-table-column>
      <el-table-column prop="date" label="操作" width="180"></el-table-column>
    </el-table>
            <!-- 分页 -->
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum:1,
      pagesize:6,
      list:[]
    };
  },
  created(){
      this.getTableData();
  },
  methods:{
      async getTableData(){
        //设置发送请求头
        const AUTH_TOKEN = localStorage.getItem('token')
        this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN  
        const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        // console.log(res)
        const {data:{data:{users},meta:{msg,status}}} = res
        if(status === 200){
            this.list = users
        }
      }
  }
};
</script>

<style>
.search {
  margin-top: 20px;
}
.searchinput {
  width: 400px;
}
</style>
