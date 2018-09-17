<template>
  <div class="monitor-main">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item v-for="(item,index) in list" :title="item.registration.name" :name="index" :key="index">
        <li>接口详情: {{item.registration.metadata.detail}}</li>
        <li>接口版本: {{item.registration.metadata.version}}</li>
        <li>开始时间: {{item.registration.metadata.startup}}</li>
        <li>接口介绍: {{item.registration.metadata.intro}}</li>
        <li>接口状态: {{item.statusInfo.status}}</li>
        <li>接口managementUrl: {{item.registration.managementUrl}}</li>
        <li>接口healthUrl: {{item.registration.healthUrl}}</li>
        <li>接口serviceUrl: {{item.registration.serviceUrl}}</li>
        <li>接口source: {{item.registration.source}}</li>
        <el-button type="primary" plain @click="goToDetail(item)">查看详细</el-button>
      </el-collapse-item>
    </el-collapse>  
  </div>
</template>
<script>
import * as api from "api/monitor";
export default {
  // name: "monitor-main",
  created() {
    this.getAllInstance()
  },
  data() {
    return {
      activeName: 0,
      list: [],

    };
  },
  methods: {
    getAllInstance() {
      api.getAllInstance().then(res => {
        console.log(res);
        const {status, data} = res
        if (status === 200 && data) {
          this.list = data
        }
      });
    },
    goToDetail(item) {
      this.$router.push({
        path: '/detail',
        query: {
          id: item.id
        }
      })
    },

  }
};
</script>
<style lang="scss" scoped>
</style>

