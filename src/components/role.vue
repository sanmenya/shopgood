<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="用户管理" level2="用户列表"></cus-bread>
        <el-button class="btn" type="primary">添加角色</el-button>
        <!-- 表格 -->
    <el-table :data="role" style="width: 100%" height="660">
    <el-table-column type="expand">
        <template slot-scope="role">
            <el-row v-for="(item1,i1) in role.row.children" :key="i1">
                <el-col :span="4">
                    <el-tag  @close="handleclose(role.row,item1.id)"  closable class="tag1" type="danger">{{item1.authName}}</el-tag>
                    <el-icon class="el-icon-arrow-right"></el-icon> 
                </el-col>
                <el-col :span="20">
                    <el-row v-for="(item2,i2) in item1.children" :key="i2">
                        <el-col :span="4">
                            <el-tag @close="handleclose(role.row,item2.id)" closable class="tag2" type="warning">{{item2.authName}}</el-tag>
                            <el-icon class="el-icon-arrow-right"></el-icon>
                        </el-col>
                        <el-col :span="20">
                            <el-tag @close="handleclose(role.row,item3.id)" type="success" closable class="tag3" v-for="(item3,i3) in item2.children" :key="i3">{{item3.authName}}</el-tag>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row v-if="role.row.children.length===0">
            <el-col>
              <span>未分配权限</span>
            </el-col>
          </el-row>
        </template>
    </el-table-column>
      <el-table-column type="index" label="#" width="260"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="260"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
      <el-table-column prop="date" label="操作" width="380">
          <template slot-scope="role">
              <el-button  size="mini" type="primary" icon="el-icon-edit" circle plain></el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" circle plain></el-button>
              <el-button @click="handleshowrole(role.row)" size="mini" type="success" icon="el-icon-check" circle plain></el-button>
          </template>
      </el-table-column>
    </el-table>
    <!-- 弹出框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisiblerole">
        <el-tree
        ref="treeDom"
       default-expand-all
  :data="treedata"
  show-checkbox
  node-key="id"
  :default-expanded-keys="arrExpand"
  :default-checked-keys="arrCheck"
  :props="defaultProps">
    </el-tree>    
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisiblerole = false">取 消</el-button>
            <el-button type="primary" @click="handleEditrole()">确 定</el-button>
        </div>
    </el-dialog>
    </el-card>
</template>

<script>
export default {
    data(){
        return{
            role:[],
            treedata:[],
            arrExpand:[],
            arrCheck:[],
            currRoleId:-1,
            defaultProps:{
                label: 'authName',
                children: 'children'
            },
            dialogFormVisiblerole:false
        }
    },
    created(){
        this.gettableRole()
    },
    methods:{
        //获取role列表数据
        async gettableRole(){
            const res = await this.$http.get('roles')
            // console.log(res)
            const {data,meta:{status}} = res.data
            if(status===200){
                this.role = data
            }
        },
        async handleshowrole(role){
            const res = await this.$http.get(`rights/tree`)
            console.log(res)
            // console.log(11)
            const {data,meta:{status}} = res.data
            if(status === 200){
                this.treedata = data
                this.currRoleId = role.id
                // console.log(this.treedata)
            //    const temp = []
            //     this.treedata.forEach((item1) => {
            //         temp.push(item1.id)
            //        item1.children.forEach((item2)=>{
            //            temp.push(item2.id)
            //            item2.children.forEach((item3)=>{
            //                temp.push(item3.id)
            //            })
            //        }) 
            //     }) 
            //     this.arrExpand = temp
            }
            // console.log(1)
            //  console.log(role)  
             const temp = []
                role.children.forEach((item1) => {
                   item1.children.forEach((item2)=>{
                       item2.children.forEach((item3)=>{
                           temp.push(item3.id)
                       })
                   }) 
                }) 
                this.arrCheck = temp       
            this.dialogFormVisiblerole = true
        },
        async handleclose(user,ID){
            const res = await this.$http.delete(`roles/${user.id}/rights/${ID}`)
            const {data,meta:{msg,status}} = res.data
            if(status===200){
                this.$message.success(msg)
                // console.log(data)
                user.children = data
            }    

        },
        async handleEditrole(){
            //修改权限
             const arr1 = this.$refs.treeDom.getCheckedKeys()
             const arr2 = this.$refs.treeDom.getHalfCheckedKeys()
             const arr = [...arr1, ...arr2]
             const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(",")
      }) 
      // console.log(res);
      if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
        this.dialogFormVisiblerole = false
        this.gettableRole()
      }
        } 
    }
}
</script>

<style>
.box{
    height: 100%;
}
.btn{
    margin-top: 20px;
}
.tag1 ,.tag2{
    margin-bottom: 10px;
    /* margin-left: 20px; */
}
/* .tag3 {
    margin-left: 30px
} */
</style>
