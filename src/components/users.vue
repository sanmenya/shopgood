<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="用户管理" level2="用户列表"></cus-bread>
        <el-row class="search">
            <el-col>
                <!-- 搜索框 -->
                 <el-input @clear="getAll()" clearable placeholder="请输入内容" v-model="query" class="searchinput">
                        <el-button @click="searchUsers()" slot="append" icon="el-icon-search"></el-button>
                 </el-input>
                 <el-button type="primary" @click.prevent="showAdd()">添加用户</el-button>
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
      <el-table-column label="用户状态" width="120">
          <template slot-scope="list">
              <el-switch @change="changeState(list.row)" v-model="list.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">

              </el-switch>
          </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" width="180">
          <template slot-scope="list">
              <el-button @click="handleshowEdit(list.row)" size="mini" type="primary" icon="el-icon-edit" circle plain></el-button>
              <el-button @click="handledelete(list.row.id)" size="mini" type="danger" icon="el-icon-delete" circle plain></el-button>
              <el-button @click="handleshowallot(list.row)" size="mini" type="success" icon="el-icon-check" circle plain></el-button>
          </template>
      </el-table-column>
    </el-table>
            <!-- 分页 -->
            <div class="block">
    <span class="demonstration">完整功能</span>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  <!-- 添加对话框 -->
  <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
  <el-form :label-position="labelPosition" label-width="80px" :model="formdata">
  <el-form-item label="用户名">
    <el-input v-model="formdata.username"></el-input>
  </el-form-item>
  <el-form-item label="密码">
    <el-input v-model="formdata.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱">
    <el-input v-model="formdata.email"></el-input>
  </el-form-item>
  <el-form-item label="密码">
    <el-input v-model="formdata.mobile"></el-input>
  </el-form-item>
</el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisibleadd()">确 定</el-button>
  </div>
</el-dialog>

<!-- 编辑对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleedit">
  <el-form :label-position="labelPosition" label-width="80px" :model="formdata">
  <el-form-item  label="用户名">
    <el-input disabled v-model="formdata.username"></el-input>
  </el-form-item>
  <el-form-item label="邮箱">
    <el-input v-model="formdata.email"></el-input>
  </el-form-item>
  <el-form-item label="电话">
    <el-input v-model="formdata.mobile"></el-input>
  </el-form-item>
</el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleedit = false">取 消</el-button>
    <el-button type="primary" @click="handleEdit()">确 定</el-button>
  </div>
</el-dialog>

<!-- 分配角色对话框 -->
<el-dialog title="分配角色" :visible.sync="dialogFormVisibleallot">
  <el-form :label-position="labelPosition" label-width="80px" :model="formdata">
  <el-form-item  label="用户名">
    {{currentusers}}
  </el-form-item>
  <el-form-item  label="角色">
      {{selectVal}}
      <el-select v-model="selectVal" placeholder="请选择角色名称">
         <el-option label="请选择" :value="-1" disabled>
          </el-option>
          <el-option v-for="(item,i) in roles" :key="i" :label="item.roleName" :value="item.id">

          </el-option>
      </el-select>
  </el-form-item>

</el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleallot = false">取 消</el-button>
    <el-button type="primary" @click="handleRevise()">确 定</el-button>
  </div>
</el-dialog>
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      selectVal: -1,
      roles: '[]',
      currentusers: [],
      query: '',
      pagenum: 1,
      pagesize: 2,
      list: [],
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleedit: false,
      dialogFormVisibleallot: false,
      labelPosition: 'right',
      formdata: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editID: '',
      ReviseID: ''
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      // 设置发送请求头
      // const AUTH_TOKEN = localStorage.getItem('token')
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      )
      // console.log(res)
      const { data: { data: { users, total }, meta: { status } } } = res
      if (status === 200) {
        this.list = users
        this.total = total
      }
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = 1
      this.pagesize = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getTableData()
    },
    searchUsers () {
      this.pagenum = 1
      this.getTableData()
    },
    getAll () {
      this.getTableData()
    },
    showAdd () {
      this.formdata = {}
      this.dialogFormVisibleAdd = true
    },
    // 删除单个表格中的数据
    handledelete (ID) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${ID}`)
        // console.log(res)
        const {data: {meta: {msg, status}}} = res
        if (status === 200) {
          this.pagenum = 1
          this.getTableData()
          this.$message.success(msg)
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 添加用户
    async dialogFormVisibleadd () {
      await this.$http.post(`users`, this.formdata)
      // console.log(res)
      this.dialogFormVisibleAdd = false
      this.getTableData()
    },
    // 显示编辑 更改信息
    handleshowEdit (user) {
      this.formdata = user
      this.editID = user.id
      this.dialogFormVisibleedit = true
    },
    // 更改编辑信息
    async handleEdit () {
      const res = await this.$http.put(`users/${this.editID}`, this.formdata)
      if (res.data.meta.status === 200) {
        this.dialogFormVisibleedit = false
        this.getTableData()
        this.$message.success(res.data.meta.msg)
      }
    },
    // 修改用户状态
    async changeState (user) {
      // console.log(11)
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      // console.log(res)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg)
      }
    },
    // 分配角色
    async handleshowallot (user) {
      this.currentusers = user.username
      this.dialogFormVisibleallot = true
      // 获取角色列表
      const res = await this.$http.get(`roles`)
      // console.log(res)
      const {data, meta: {status}} = res.data
      // console.log(data)
      if (status === 200) {
        this.roles = data
        // console.log(this.roles)
        this.ReviseID = user.id
      }
      // 获取当前用户的角色id
      const res2 = await this.$http.get(`users/${user.id}`)
      // console.log(res2)
      // const {
      //   meta: { msg2, status2 },
      //   data2
      // } = res2.data;
      // if (status2 === 200) {

      // 所有角色5个[每个角色有自己的id]
      // 用户信息中也有rid 角色rid
      //
      this.selectVal = res2.data.data.rid
    },
    // 修改用户角色
    async handleRevise () {
      const res = await this.$http.put(`users/${this.ReviseID}/role`, {rid: this.selectVal})
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        // 关闭对话框
        this.dialogFormVisibleallot = false
        this.$message.success(msg)
      }
    }
  }
}
</script>

<style>
.box {
  height: 100%;
}
.search {
  margin-top: 20px;
}
.searchinput {
  width: 400px;
}
</style>
