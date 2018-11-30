<template>
  <el-table :data="responseData" style="width: 100%" height="340">
    <el-table-column prop="name" label="服务名称"></el-table-column>
    <el-table-column width="150" prop="producer" label="服务提供方"></el-table-column>
    <el-table-column width="100" prop="total" label="调用次数">
    </el-table-column>
  </el-table>
</template>

<script>
// import * as api from "api/generalization/index";
export default {
  name: "FwfwlTable",
  props: {
    responseData: {
      type: Array,
      default: []
    }
  },
};
</script>