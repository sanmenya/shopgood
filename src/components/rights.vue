<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="权限管理" level2="权限列表"></cus-bread>
        <!-- 表格 -->
        <el-table :data="list" style="width: 100%" height="700px">
      <el-table-column type="index" label="#" width="230"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="260"></el-table-column>
      <el-table-column prop="path" label="路径" width="330"></el-table-column>
      <el-table-column prop="mobile" label="层级" width="350">
          <template slot-scope="list">
              <span v-if="list.row.level==='0'">一级</span>
              <span v-if="list.row.level==='1'">二级</span>
              <span v-if="list.row.level==='2'">三级</span>
          </template>
      </el-table-column>
    </el-table>
    </el-card>
</template>

<script>
export default {
    data(){
        return  {
            list:[]
        }
    },
    created(){
        this.getTable()
    },
    methods:{
        async getTable(){
            const AUTH_TOKEN = localStorage.getItem('token')
            this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
            const res = await this.$http.get('rights/list')
            console.log(res)
            const {data,meta:{status}} = res.data
            if(status === 200) {
                this.list = data
            }
        }
    }
}
</script>

<style>

</style>
