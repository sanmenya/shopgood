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
            {{item1.attr_vals}}
        <el-checkbox-group v-model="item1.attr_vals">
    <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>

  </el-checkbox-group>
  </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="3">
        <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="4">
        <!-- 图片上传 -->
        <el-form-item label="添加图片">
        <el-upload
        :headers="headers"
  action="http://localhost:8888/api/private/v1/upload"
  :on-remove="handleRemove"
  :on-success="handleSuccess"
  list-type="picture">
  <el-button size="small" type="primary">点击上传</el-button>
  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
</el-upload>
</el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="5">
      <el-form-item>
        <el-button type="success" @click="addGoods()">添加商品</el-button>
        <quill-Editor v-model="formLabelAlign.goods_introduce" class="editor"></quill-Editor> 
      </el-form-item>
    </el-tab-pane>
  </el-tabs>
  </el-form>
    </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      headers: {
        Authorization: localStorage.getItem("token")
      },
      active: "1",
      formLabelAlign: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      arrDy: [],
      arrStatic: [],
      options: [],
      selectedOptions: [],
      // checkList:[],
      defaultProp: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
    async changeTab() {
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请先选择三级分类!");
          this.arrDy = [];
          this.arrStatic = [];
          return;
        }
        if (this.active === "2") {
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
        }
        if (this.active === "3") {
          // 获取静态数据
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          console.log(res);
          const { meta: { msg, status }, data } = res.data;
          if (status === 200) {
            this.arrStatic = data;
            // console.log("静态数据----")
            // console.log(this.arrStatic)
          }
        }
      }
    },
    // 获取三级分类的数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      //   console.log(res)
      const { data, meta: { status } } = res.data;

      if (status === 200) {
        this.options = data;
        // console.log(this.options);
      }
    },
    // 图片上传
    handleRemove(file, fileList) {
      console.log("handleRemove");
      console.log(file);
      const Index1 = this.formLabelAlign.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path;
      });
      // console.log(typeof(Index1));
      // console.log(Index1);
      // console.log(Index1);
      this.formLabelAlign.pics.splice(Index1, 1);
    },
    async handleSuccess(response, file, fileList) {
      // console.log("Success");
      // console.log(response);
      this.formLabelAlign.pics.push({ pic: response.data.tmp_path });
    },
    async addGoods() {
      this.formLabelAlign.goods_cat = this.selectedOptions.join(",");
      const arr1 = this.arrDy.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      const arr2 = this.arrStatic.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      this.formLabelAlign.attrs = [...arr1, ...arr2];
      const res = await this.$http.post(`goods`, this.formLabelAlign);
      console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        // 列表
        this.$router.push({
          name: "Goods"
        });
      } else {
        this.$message.error(msg);
      }
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
.steps {
  margin-top: 20px;
}
.form1 {
  height: 500px;
  overflow: auto;
}
.inpunt {
  width: 200px;
}
.ql-container,
.ql-snow {
  /* height: 400px; */
  min-height: 200px;
}
</style>
