<template>
  <div>
    <el-table v-loading.body="loading" :data="tableData">
      <el-table-column prop="servUuid" label="UID" sortable></el-table-column>
      <el-table-column prop="servName" label="服务名称"></el-table-column>
      <el-table-column prop="_servType" label="服务类型"></el-table-column>
      <el-table-column prop="producer" label="服务提供商">
      </el-table-column>
      <el-table-column prop="timestamp" label="申请时间" width="160px">
      </el-table-column>
      <el-table-column label="是否公开">
        <template slot-scope="scope">{{scope.row.servUseof=== '1'?'否':'是'}}</template>
      </el-table-column>
      <el-table-column prop="apiVer" label="发布版本"></el-table-column>
      <el-table-column prop="servTag" label="服务分类">
        <template slot-scope="scope">
          <el-tag size="small">{{scope.row.servTag}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="apiStatus" label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-show="scope.row.apiStatus == '0'" type="info">待上线</el-tag>
          <el-tag size="small" v-show="scope.row.apiStatus == '1'" type="success">在线</el-tag>
          <el-tag size="small" v-show="scope.row.apiStatus == '2'" type="warning ">暂停</el-tag>
          <el-tag size="small" v-show="scope.row.apiStatus == '3'" type="danger">下线</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="opinion" label="驳回意见">
      </el-table-column>
    </el-table>

    <!-- 分页组件here -->
    <PageBar v-show="!loading" :total="total" :currentpage="current" @handlePage="handlePage" @handlePageSize="handlePageSize" />
  </div>

</template>

<script>
import * as api from "api/service/management";
import PageBar from "components/PageBar/index";
export default {
  name: "reject",
  components: {
    PageBar
  },
  data() {
    return {
      loading: true,
      total: 0, // 分页
      current: 1, // 分页
      size: 10, // 缓存一下每页大小
      tableData: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList(pageNo = 1, limit = 10, pubStatus = "2") {
      api
        .getApiList({
          pageNo,
          limit,
          pubStatus
        })
        .then(res => {
          const { status, data, total } = res;
          if (status === 200 && data) {
            this.loading = false;
            data.rows.forEach(item => {
              switch (item.servType) {
                case "1":
                  item._servType = "HTTP API";
                  break;
                case "2":
                  item._servType = "WebService API";
                  break;
                case "3":
                  item._servType = "数据源 API";
                  break;
              }
            });
            this.tableData = data.rows;
            this.total = data.total;
            this.current = data.current;
          }
        });
    },
    handlePage(number) {
      // 分页
      this.getList(number);
      this.current = number;
    },
    handlePageSize(number) {
      // 分页大小
      this.size = number;
      this.getList(1, number);
      this.current = 1;
    }
  }
};
</script>

