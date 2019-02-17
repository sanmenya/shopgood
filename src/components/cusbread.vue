// 封装面包屑组建  使其在全局使用
<template>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>    
</template>
<script>
export default {
    name:'cusBread',
    props:["level1","level2"]
}
</script>

<style>

</style>
