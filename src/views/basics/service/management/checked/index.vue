<template>
  <div>
    <el-table v-loading.body="listLoading" :data="tableData" style="width: 100%; height: 580px; overflow-y: auto" :default-sort="{prop: 'name', order: 'descending'}">
      <el-table-column prop="servName" label="接口名称" sortable>
      </el-table-column>
      <el-table-column prop="servTag" label="所属服务" sortable>
      </el-table-column>
      <el-table-column prop="apiVer" label="版本">
      </el-table-column>
      <el-table-column prop="timestamp" label="申请时间" sortable>
      </el-table-column>
      <el-table-column prop="pubStatus" label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-show="scope.row.pubStatus == '0'" type="primary" plain>待审核</el-tag>
          <el-tag size="small" v-show="scope.row.pubStatus == '1'" type="success" plain>已发布</el-tag>
          <el-tag size="small" v-show="scope.row.pubStatus == '2'" type="warning" plain>已驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="pubStatus" label="操作">
        <template slot-scope="scope">
          <!-- <el-button v-if="scope.row.status == 1" size="small" @click="openChange(scope.row.id, scope.row.userId)">修改</el-button> -->
          <el-button v-if="scope.row.pubStatus == '1'" size="small" @click="openCancel(scope.row.id, scope.row.userId)">撤销审核</el-button>
          <el-button v-if="scope.row.pubStatus == '0'" size="small" @click="openStart(scope.row.id, scope.row.userId)" class="activeBtn">启用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row class="change-page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-row>
  </div>

</template>

<script>
import * as api from "api/service/management";
export default {
  name: "checked",
  data() {
    return {
      listQuery: {
        apiStatus: "",
        limit: 10,
        pageNo: 1,
        pubStatus: "0", // 0:待审核|1:审核通过|2:审核不通过
        sortName: "",
        sortOrder: "desc"
      },

      listLoading: true,
      tableData: [],
      tips: "启用成功!",
      total: 0,
      warning: "warning",
      success: "success",
      danger: "danger",
      currentPage: 1
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList(pageNo = 1, limit = 10, pubStatus = "0") {
      api
        .getApiList({
          pageNo,
          limit,
          pubStatus
        })
        .then(res => {
          // pubStatus   0:待审核|1:已通过（即已发布）|2:已驳回
          const { status, data, total } = res;
          if (status === 200 && data) {
            this.listLoading = false;
            this.tableData = data.rows;
            this.total = data.total;
          }
        });
    },
    //分页
    handleSizeChange(val) {},
    handleCurrentChange(val) {},

    openStart(id, userId) {
      this.$confirm("您是否要启用改服务?", "启用提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 增加一个新的服务发布申请记录 提交服务发布申请
          api
            .submitService({
              servId: id,
              userId: userId
            })
            .then(res => {
              const { data } = res;
              if (data.status === "success") {
                this.tips = data.message;
                this.$message({
                  type: "success",
                  message: this.tips
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    openChange(id, userId) {
    },
    openCancle(id, userId) {
    }
  }
};
</script>

<style lang="scss" scoped>
.change-page {
  overflow: hidden;
}
.pagebox {
  // float: right;
  margin-top: 10px;
}
</style>

