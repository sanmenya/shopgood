<template>
    <el-card class="box">
         <!-- 面包屑 -->
        <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
        <el-alert class="alert" title="添加商品信息" type="info" center show-icon>
     </el-alert>
            <!-- 步骤进度 -->
    <el-steps class="steps" :active="active*1" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-form class="form1" label-position="top" label-width="80px" :model="formLabelAlign">
  <el-tabs @tab-click="changeTab()" v-model="active" tab-position="left" >
    <el-tab-pane label="基本信息" name="1">
        <el-form-item label="商品名称">
            <el-input v-model="formLabelAlign.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
            <el-input v-model="formLabelAlign.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
            <el-input v-model="formLabelAlign.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
            <el-input v-model="formLabelAlign.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
        {{selectedOptions}}
                <el-cascader
                clearable
                :props="defaultProp"
    :options="options"
    v-model="selectedOptions"
    @change="handleChange">
  </el-cascader>

        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="2">
        <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDy" :key="i">
            <!-- {{checkList}} -->
        <el-checkbox-group v-model="checkList">
    <el-checkbox :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>

  </el-checkbox-group>
  </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="3">
        <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="4"></el-tab-pane>
    <el-tab-pane label="商品内容" name="5"></el-tab-pane>
  </el-tabs>
  </el-form>
    </el-card>
</template>

<script>
export default {
    data(){
        return{
            active:'1',
            formLabelAlign:{
                goods_name:'',
                goods_cat:'',
                goods_price:'',
                goods_number:'',
                goods_weight:'',
                goods_introduce:'',
                pics:{},
                attrs:[]
            },
            arrDy:[],
            arrStatic:[],
            options:[],
            selectedOptions: [],
            checkList:[],
            defaultProp:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            }
        }
    },
    created(){
        this.getGoodsCate()
    },
    methods:{
          handleChange(value) {
        console.log(value);
      },
     async changeTab(){
         if(this.active==='2' || this.active === "3"){
             if(this.selectedOptions.length!==3){
                 this.$message.error('请先选择三级分类!')
                 return 
             }
             if(this.active === "2"){
                 const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          )
          // console.log(res);
          const {
            meta: { msg, status },
            data
          } = res.data
          if (status === 200) {
            this.arrDy = data;
            this.arrDy.forEach(item => {
            //   item.attr_vals = item.attr_vals.trim().split(",")
           item.attr_vals = item.attr_vals.trim().length===0 ?[]:item.attr_vals.trim().split(",")
            })
            // console.log(this.arrDy)
          }
             }
             if(this.active === "3"){
                 // 获取静态数据
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          )
          // console.log(res);
          const {
            meta: { msg, status },
            data
          } = res.data;
          if (status === 200) {
            this.arrStatic = data;
            console.log("静态数据----")
            console.log(this.arrStatic)
          }
             }
         }
          
      },
      // 获取三级分类的数据
      async getGoodsCate(){
          const res = await this.$http.get(`categories?type=3`)
          console.log(res)
          const {data,meta:{status}} = res.data

      if (status === 200) {
        this.options = data;
        // console.log(this.options);
      }
      } 
    }
}
</script>

<style>
.box{
    height: 100%;
}
.alert{
    margin-top: 20px;
}
.steps{
    margin-top: 20px;
}
.form1{
    height: 500px;
    overflow: auto;
}
.inpunt{
    width: 200px;
}
</style>
