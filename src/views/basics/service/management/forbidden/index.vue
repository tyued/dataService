<template>
  <div>
    <el-table :data="tableDataCheck" style="width: 100%; height: 580px; overflow-y: auto" :default-sort="{prop: 'name', order: 'descending'}">
      <el-table-column prop="servName" label="接口名称" sortable>
      </el-table-column>
      <el-table-column prop="servTag" label="所需服务" sortable>
      </el-table-column>
      <el-table-column prop="apiVer" label="版本">
      </el-table-column>
      <el-table-column prop="timestamp" label="申请时间" sortable>
      </el-table-column>
      <el-table-column prop="action" label="操作">
        <!-- <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" size="mini" @click="openChange(scope.row.id, scope.row.userId)">修改</el-button>
          <el-button v-if="scope.row.status == 2" size="mini" @click="openCancel(scope.row.id, scope.row.userId)">撤销审核</el-button>
          <el-button v-if="scope.row.status == 0" size="mini" @click="openStart(scope.row.id, scope.row.userId)" class="activeBtn">启用</el-button>
        </template> -->
      </el-table-column>
    </el-table>

    <el-row class="change-page">
      <el-pagination class="pagebox" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="totalItem">
      </el-pagination>
    </el-row>
  </div>

</template>

<script>
import * as api from "api/service/management";
export default {
  name: "forbidden",
  data() {
    return {
      tableDataCheck: [],
      tips: "启用成功!",
      totalItem: 0,
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
      console.log("change");
    },
    openCancle(id, userId) {
      console.log("cancel");
    },
    getList(pageNo = 1, limit = 10, pubStatus = "1", apiStatus = "3") {
      api
        .getApiList({
          pageNo,
          limit,
          pubStatus,
          apiStatus
        })
        .then(res => {
          console.log(res);
          // apiStatus: 服务-接口状态：1:在线|2:暂停|3:下线(用于筛选接口自身的状态)
          // pubStatus: 服务-接口发布状态：0:待审核|1:已通过（即已发布）|2:已驳回(用于筛选接口审核状态)
          const { status, data, total } = res;
          if (status === 200 && data) {
            this.listLoading = false;
            this.tableDataCheck = data.rows;
            this.totalItem = data.total;
          }
        });
    },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
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

