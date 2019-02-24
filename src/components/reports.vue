<template>
    <el-card class="box">
         <!-- 面包屑 -->
        <cus-bread level1="权限管理" level2="权限列表"></cus-bread>
        <!-- 折线图 -->
         <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width: 1200px;height:700px;"></div>
    </el-card>
</template>


<script>
import echarts from 'echarts'
export default {
    data(){
        return{
            option:{}
        }
    },
    mounted(){
        this.getchart()
    },
    methods:{
        async getchart(){

            // 获取要求的折线图数据
            const res = await this.$http.get(`reports/type/1`)
            // console.log(1111)
            // console.log(res)
            //l s x y 
            const {data,meta:{status}} = res.data
            if(status===200){
                this.option = data
            }



             // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        const option1 = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
        };
        const option2 = this.option
        const option = {...option1,...option2}
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        }
    }
}
</script>

<style>
.box{
    height: 100%
}
</style>
