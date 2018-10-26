<template>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="servName" label="服务名称"></el-table-column>
        <el-table-column prop="apiName" label="接口名称"></el-table-column>
        <!-- <el-table-column prop="reqAddr" label="请求地址"></el-table-column>
        <el-table-column prop="reqURI" label="请求URL"></el-table-column> -->
        <el-table-column prop="exception" label="异常类型"></el-table-column>
        <el-table-column prop="respMsg" label="错误原因"></el-table-column>
        <el-table-column prop="timestamp" label="请求时间"></el-table-column>
    </el-table>

</template>

<script>
import * as api from "api/generalization/index";
export default {
  name: "ZxfwycTable",
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // 最新服务访问异常数据
      api.errorLastest().then(response => {
        this.tableData = response.data;
      });
    }
  }
};
</script>
    
