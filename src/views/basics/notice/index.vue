<template>
  <div class="notice">
    <el-row class="gl-rowbox">
      <el-card class="box-card">
        通知中心
      </el-card>
    </el-row>
    <el-row class="gl-rowbox">
      <el-card class="box-card">
        <div v-if="noticeList.length === 0" class="empty-tips">
          暂无通知
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      noticeList: []
    }
  }
};
</script>

<style lang="scss" scoped>
.empty-tips {
  padding: 100px 0;
  text-align: center;
  font-size: 14px;
  color: #9a9a9a;
}
</style>
