<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="商品管理" level2="分类参数"></cus-bread>
        <el-alert class="alert" title="警告提示的文案" type="warning" show-icon>
        </el-alert>
        <!-- 级联 -->
        <div class="block">
        <span class="demonstration">请选择商品分类</span>
        {{selectedOptions}}
  <el-cascader
  :props="object1"
    expand-trigger="hover"
    :options="options"
    v-model="selectedOptions"
    @change="handleChange">
  </el-cascader>
  </div>
        <!-- tabs -->
    <el-tabs v-model="active" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="1">
           <el-button type="success" disabled class="tag" center>11设置动态参数</el-button>
    <el-table :data="arrDy" style="width: 100%" height="500">
        <!-- 展开项 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
            <el-tag
  :key="i"
  v-for="(attr,i) in scope.row.attr_vals"
  closable
  :disable-transitions="false"
  @close="handleClose(scope.row,attr)">
  {{attr}}
</el-tag>
<el-input
  class="input-new-tag"
  v-if="inputVisible"
  v-model="inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
</template>
        </el-table-column>
            <el-table-column type="index" label="#" width="330">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="330">
            </el-table-column>
            <el-table-column prop="address" label="操作" width="355">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle></el-button>    
                    <el-button type="danger" icon="el-icon-delete" circle></el-button>    
                </template>    
            </el-table-column>
    </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="2">静态参数
          <el-button type="success" disabled class="tag" center>设置静态参数</el-button>
          <el-table :data="arrState" style="width: 100%" height="500">
              <el-table-column type="index" label="#" width="230">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="230">
            </el-table-column>
            <el-table-column prop="attr_vals" label="属性值" width="230">
            </el-table-column>
            <el-table-column prop="address" label="操作" width="255">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle></el-button>    
                    <el-button type="danger" icon="el-icon-delete" circle></el-button>    
                </template>    
            </el-table-column>
          </el-table>
        </el-tab-pane>
    </el-tabs>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: "1",
      selectedOptions: [],
      options: [],
      object1: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      arrDy: [],
      arrState:[],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    //获取三级数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      //   console.log(res);
      const { data, meta: { status } } = res.data;

      if (status === 200) {
        this.options = data;
        // console.log(this.options);
      }
    },
    async handleChange() {
      console.log(11);
      if (this.selectedOptions.length !== 3) {
        this.$message.warning("请输入三级分类！");
        this.arrDy = [];
      }
      if (this.active === "1") {
        // 获取动态数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        console.log(res);
        const { meta: { msg, status }, data } = res.data;
        if (status === 200) {
          this.arrDy = data;
          this.arrDy.forEach(item => {
            //   item.attr_vals = item.attr_vals.trim().split(",")
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.trim().split(",");
            // this.dynamicTags = item.attr_vals;
          });
          console.log("动态数据----");
          console.log(this.arrDy);
        }
      };
       if(this.active === "2"){
        // 获取静态参数
        const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
        console.log(1111)
        console.log(res)
        const {data,meta:{status}} = res.data
        if(status===200){
          this.arrState = data
        }
      }
    },
    async handleClick() {
      if (this.active === "1") {
        // 获取动态数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        // console.log(res);
        const { meta: { msg, status }, data } = res.data;
        if (status === 200) {
          this.arrDy = data;
          this.arrDy.forEach(item => {
            //   item.attr_vals = item.attr_vals.trim().split(",")
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.trim().split(",");
          });
          console.log("动态数据----");
          console.log(this.arrDy);
        }
      };
      if(this.active === "2"){
        // 获取静态参数
        const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
        console.log(1111)
        console.log(res)
        const {data,meta:{status}} = res.data
        if(status===200){
          this.arrState = data
        }
      }
    },
    // tag
    async handleClose(item, attr) {
      //   this.dynamicTags.splice(this.dynamicTags.indexOf(attr), 1);
      item.attr_vals.splice(item.attr_vals.indexOf(attr), 1);
      // console.log(11111)
      // console.log(item.attr_vals)
      // console.log(item.attr_vals.join(','))
      // 移除Tag
    const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`,{
      attr_name: item.attr_name,
      attr_sel: "many",
      attr_vals: item.attr_vals.join(",")
    })
  //  console.log('tag')
  //  console.log(res)
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(item) {
      let inputValue = this.inputValue;
      if (inputValue) {
        item.attr_vals.push(inputValue);
      }
      // console.log(111)
      // console.log(item)
      this.inputVisible = false;
      this.inputValue = "";
      //添加
      const res=await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`,{
          attr_name:item.attr_name,
          attr_sel:'many',
          attr_vals:item.attr_vals.join(',')
      })
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 20px;
}
.tag {
  width: 200px;
  text-align: center;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
