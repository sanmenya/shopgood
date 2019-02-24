<template>
    <el-card class="box">
        <cus-bread level1="订单管理" level2="订单列表"></cus-bread>
        <el-table :data="tableData" style="width: 100%" height='660'>
            <el-table-column type="index" label="#" width="110">
            </el-table-column>
            <el-table-column prop="order_number" label="订单编号" width="220">
            </el-table-column>
            <el-table-column prop="order_price" label="订单价格" width="60">
            </el-table-column>
            <el-table-column prop="trade_no" label="是否付款" width="120">
                <template slot-scope="scope" class="template">
                    <el-tag type="success" v-if="scope.row.order_pay==='0'">已付款</el-tag>
                    <el-tag type="danger" v-if="scope.row.order_pay==='1'">未付款</el-tag>
                    <el-tag type="warning" v-if="scope.row.order_pay==='2'">待付款</el-tag>

                </template> 
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货" width="310">
            </el-table-column>
            <el-table-column prop="create_time" label="下单时间" width="260">
                <template slot-scope="scope">
                    {{scope.row.update_time | fmtdate}}
                </template>
            </el-table-column>
            <el-table-column prop="date" label="操作" width="260">
                <template slot-scope="scope">
                    <el-button @click="showHandle()" type="primary" size="mini" icon="el-icon-edit" circle></el-button>
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
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  <!-- 对话框 -->
        <el-dialog
  title="修改订单地址"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
    
    <el-form label-position="right" label-width="80px" :model="formLabelAlign">
  <el-form-item label="省市区/县">
      <!-- 级联省市区 -->
      {{selectedOptions2}}
    <el-cascader
    :props="prop"
    expand-trigger="hover"
    :options="options"
    v-model="selectedOptions2"
    @change="handleChange">
  </el-cascader>
  </el-form-item>
  <el-form-item label="详细地址">
    <el-input v-model="formLabelAlign.region"></el-input>
  </el-form-item>
  
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
    </el-card>
</template>

<script>
import CityArr from '../assets/city_data2017_element.js'
export default {
    data(){
        return{
            tableData:[],
            pagenum:1,
            pagesize:10,
            total:-1,
            options:[],
            selectedOptions2:[],
            formLabelAlign:{},
            dialogVisible:false,
            prop:{
                value:'value',
                label:'label',
                children:'children',
            }
        }
    },
    created(){
        this.ListHandle()
    },
    methods:{
        async ListHandle(){
            const res=await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            console.log(111)
            console.log(res)
            const {data:{goods,total},meta:{status}} = res.data
            if(status===200){
                this.tableData = goods
                this.total = total

            }
        },
        // 分页
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pagesize =  val
        this.ListHandle()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pagenum = val
        this.ListHandle()
      },
    //   对话框
    showHandle(){
        this.dialogVisible = true
        this.options = CityArr
    },
    // 级联省市区
    handleChange(value) {
        console.log(value);
      }
    }
}
</script>

<style>
.box{
    height: 100%
}

</style>
