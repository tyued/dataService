<template>
  <div>
    <el-table :data="tableDataPub" style="width: 100%; height: 580px; overflow-y: auto" :default-sort="{prop: 'name', order: 'descending'}" :cell-class-name="handleRedFont">
      <el-table-column prop="name" label="服务名称" sortable>
      </el-table-column>
      <el-table-column prop="detail" label="请求秘钥" sortable>
      </el-table-column>
      <el-table-column prop="type" label="是否加密" sortable>
      </el-table-column>
      <el-table-column prop="timestamp" label="申请时间" sortable>
      </el-table-column>
      <el-table-column prop="intro" label="服务来源" sortable>
      </el-table-column>
      <el-table-column prop="category" label="分类">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" size="mini" :type="warning" plain>{{scope.row.tag}}</el-button>
          <el-button v-if="scope.row.status == 2" size="mini" :type="success" plain>{{scope.row.tag}}</el-button>
          <el-button v-if="scope.row.status == 0" size="mini" :type="danger" plain>{{scope.row.tag}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" width="260">
        <template slot-scope="scope">
          <el-button size="mini">查看</el-button>
          <el-button size="mini" type="danger" @click="openForbidden">禁用</el-button>
          <el-button size="mini">
            <i class="el-icon-download"></i>下载私钥</el-button>
        </template>
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
  name: "subcription",
  data() {
    return {
      tableDataPub: [],
      tips: "禁用成功!",
      totalItem: 0,
      currentPage: 1,
      warning: "warning",
      success: "success",
      danger: "danger"
    };
  },
  created() {
    this.getSubscribeList({
      limit: "10",
      pageNo: "1"
    });
  },
  methods: {
    openForbidden() {
      this.$confirm("您是否要禁用改服务?", "禁用提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 禁用接口?????
          api
            .forbiddenService({
              servId: "001"
            })
            .then(res => {
              this.tips = res.message;
            });

          this.$message({
            type: "success",
            message: this.tips
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handleRedFont(data) {  // 设置字体为红色
      if (data.rowIndex <= 4) {
        if (data.columnIndex === 2) {
          return "red-font";
        }
      }
    },
    getSubscribeList(params) {   // 获取列表
      api.getSubscribeList(params).then(res => {
        // console.log(res);
        const { status, statusText, data } = res;
        if (status === 200 && statusText === "OK") {
          this.tableDataPub = data.rows;
          this.totalItem = data.total;
          // this.$emit("gettotal", data.total);
        }
      });
    },
    // 分页
    handleSizeChange(val) {
      this.currentPage = 1;
      this.getSubscribeList({
        limit: val,
        pageNo: "1"
      });
    },
    handleCurrentChange(val) {
      this.getSubscribeList({
        limit: "10",
        pageNo: val
      });
    }
  }
};
</script>

<style lang="scss">
.red-font {
  color: #f77878;
}

.change-page {
  overflow: hidden;
}
.pagebox {
  // float: right;
  margin-top: 10px;
}
</style>

