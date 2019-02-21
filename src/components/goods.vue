<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
        <el-row class="search">
            <el-col>
                <!-- 搜索框 -->
                 <el-input @clear="getAll()" clearable placeholder="请输入内容" v-model="query" class="searchinput">
                        <el-button @click="searchUsers()" slot="append" icon="el-icon-search"></el-button>
                 </el-input>
                 <el-button class="btn" type="primary" @click.prevent="$router.push({name:'Goodsadd'})">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
    <el-table border :data="list" style="width: 100%" height="500">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="1150"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
      <el-table-column  label="创建日期" width="110">
          <template slot-scope="list">
              <!-- 内层list.row表示list 的每一个对象 -->
          {{list.row.create_time | fmtdate}}
          </template>
      </el-table-column>
      <el-table-column  label="操作" width="110">
          <template slot-scope="list">
              <el-button @click="handleshowEdit(list.row)" size="mini" type="primary" icon="el-icon-edit" circle plain></el-button>
              <el-button @click="handledelete(list.row.id)" size="mini" type="danger" icon="el-icon-delete" circle plain></el-button>
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
      :page-sizes="[10,20,30,40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
    </el-card>
</template>

<script>
export default {
    data(){
        return {
            query:'',
            list:[],
            pagenum:1,
            total:-1,
            pagenum:1,
            pagesize:10
        }
    },
    created(){
        this.LodingList()
    },
    methods:{
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pagesize = val
        this.LodingList()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pagenum = val
        this.LodingList()
      },

        searchUsers(){},
        // 加载商品列表
        async LodingList(){
            const res = await this.$http.get(`goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            // console.log('获取商品信息')
            // console.log(res)
            const {data,meta:{status}} = res.data
            if(status === 200){
                this.list = data.goods
                this.total = data.total 
                }    
        }
    }

}
</script>

<style>
.box{
    height: 100%;
}
.search{
    width: 400px;
    margin-top: 20px;
}
.btn{
    position: relative;
    left:410px;
    top:-40px;
}
</style>
