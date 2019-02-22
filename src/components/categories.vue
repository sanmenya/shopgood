<template>
    <!-- 面包屑 -->
    <el-card class="box">
        <cus-bread level1="商品管理" level2="分类参数"></cus-bread>
        <el-button @click="showhandle()" class="btn" type='success'>添加分类</el-button>
        <!-- 表格 -->
        <el-table :data="data" style="width: 100%" height="500">
             <!-- 展开项 -->
             <el-tree-grid 
             prop="cat_name"
             treeKey='cat_id'
             parentKey="cat_pid"
             levelKey ="cat_level"
             childKey='children'
 label="分类名称" width="220">


             </el-tree-grid>
            <el-table-column prop="attr_name" label="级别" width="330">
                <template slot-scope="scope">
          <span v-if="scope.row.cat_level===0">一级</span>
          <span v-else-if="scope.row.cat_level===1">二级</span>
          <span v-else-if="scope.row.cat_level===2">三级</span>
        </template>
            </el-table-column>
            <el-table-column prop="attr_name" label="是否有效" width="330">
                <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted===false">有效</span>
          <span v-if="scope.row.cat_deleted===true">无效</span>
        </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" width="355">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle></el-button>    
                    <el-button type="danger" icon="el-icon-delete" circle></el-button>    
                </template>    
            </el-table-column>

        </el-table>
        <!-- 分页 -->
            <div class="block">
   
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10,20,30,40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
     <!-- 对话框 -->
    <el-dialog
  title="添加商品分类"
  :visible.sync="dialogVisible"
  width="50%"
  :before-close="handleClose">
  <el-form label-position="top" label-width="80px" :model="formLabelAlign">
  <el-form-item label="分类名称">
    <el-input v-model="formLabelAlign.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="分类名称">
  <!-- 级联 -->
  {{selectedOptions}}
     <el-cascader
     change-on-select
    expand-trigger="hover"
    :options="options"
    :props="object"
    v-model="selectedOptions"
    @change="handleChange"
    clearable>
  </el-cascader>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addhandle()">确 定</el-button>
  </span>
</el-dialog>

    </el-card>
</template>

<script>
import ElTreeGrid from 'element-tree-grid'
export default {
     components:{
        ElTreeGrid
     },
    data(){
        return{
            data:[],
            pagenum:1,
            pagesize:5,
            total:-1,
            dialogVisible:false,
            formLabelAlign:{
                cat_pid:'',
                cat_name:'',
                cat_level:''
            },
            options:[],
            object:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            selectedOptions:[]
        }
    },
    created(){
        this.getList()
    },
    methods:{
        async getList(){
            const res = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            console.log(111)
            console.log(res)
            const {data:{result,total} , meta:{status}} = res.data
            if(status===200){
                this.data = result
                this.total = total
                // console.log(11)
                // console.log(result)    
            }
        },
        // 分页
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pagesize = val
        this.getList()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pagenum = val
        this.getList()
      },
    //   对话框
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done(alert);
            alert('1')
          })
          .catch(_ => {});
      },
      async showhandle(){
          //获取级联数据
        const res = await this.$http.get(`categories?type=2`)
        console.log(111)
        console.log(res)
        const {data,meta:{status}} = res.data
        if(status === 200){
            this.options = data
        }
           this.dialogVisible=true
      },
       handleChange(value) {
           console.log(value);
           console.log('aaa');
      },
      async addhandle(){
         
            if(this.selectedOptions.length===0){
                this.formLabelAlign.cat_level=0
                this.formLabelAlign.cat_pid=0
            }
             // 如果选了一个分类 -> 添加的是二级分类
      if (this.selectedOptions.length === 1) {
        this.formLabelAlign.cat_pid = this.selectedOptions[0];
        this.formLabelAlign.cat_level = 1;
      }
      // 如果选了两个分类,->添加三级分类
      if (this.selectedOptions.length === 2) {
        this.formLabelAlign.cat_pid = this.selectedOptions[1];
        this.formLabelAlign.cat_level = 2;
      }
         const res=await this.$http.post(`categories`,this.formLabelAlign)
        //  console.log('vvv')
        //  console.log(res)
        
        if(res.data.meta.status===201){
            this.dialogVisible = false
            this.getList()
        }
      }
    }
    } 

</script>

<style>
.box{
    height: 100%
}
.btn{
    margin-top: 20px
}
</style>
