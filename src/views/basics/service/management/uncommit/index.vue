<template>
  <div>
    <el-table v-loading.body="loading" :data="tableData">
      <el-table-column prop="uuid" label="UID" sortable>
      </el-table-column>
      <el-table-column prop="belongValue" label="服务归属">
      </el-table-column>
      <el-table-column prop="producer" label="服务提供商">
      </el-table-column>
      <el-table-column prop="typeValue" label="服务类型">
      </el-table-column>
      <el-table-column prop="name" label="服务名称">
      </el-table-column>
      <el-table-column label="是否公开">
        <template slot-scope="scope">{{scope.row.useof==1?'否':'是'}}</template>
      </el-table-column>
      <el-table-column prop="tag" label="服务分类">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in servTagArr" v-if="scope.row.tag === item.key" :key="index" size="small">{{item.value}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <!-- 服务注册信息还未提交审批（待上线），服务发布审批通过后启动服务（在线），服务临时维护或临时性的暂停服务（暂停），服务下线，即销毁（下线） -->f
        <template slot-scope="scope">
          <el-tag size="small" v-show="scope.row.status == '0'" type="info">待上线</el-tag>
          <el-tag size="small" v-show="scope.row.status == '1'" type="success">在线</el-tag>
          <el-tag size="small" v-show="scope.row.status == '2'" type="warning ">暂停</el-tag>
          <el-tag size="small" v-show="scope.row.status == '3'" type="danger">下线</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="操作" width="220">
        <template slot-scope="scope">
          <el-button v-if="rightInfoObj['serv-examining']['serv-examining:renew']" size="small" type="success" v-show="scope.row.status == '0'" @click="openChange(scope.row)">修改</el-button>
          <el-button v-if="rightInfoObj['serv-examining']['serv-examining:submit']" size="small" type="primary" @click="openStart(scope.row)" class="activeBtn">提交</el-button>
          <el-button v-if="rightInfoObj['serv-examining']['serv-examining:delete']" size="small" type="danger" @click="deleteServe(scope.row)" class="activeBtn">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件here -->
    <PageBar v-show="!loading" :total="total" :currentpage="current" @handlePage="handlePage" @handlePageSize="handlePageSize" />
  </div>

</template>

<script>
import * as api from "api/service/management";
import PageBar from "components/PageBar/index";
import { putSubmit } from "api/service/register";
import { mapGetters } from "vuex";
export default {
  name: "uncommit",
  components: {
    PageBar
  },
  computed: {
    ...mapGetters(["servTagArr", 'rightInfoObj'])
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
    getList(pageNo = 1, limit = this.size, status = "0") {
      api
        .getRetrieveListUn({
          pageNo,
          limit,
          status
        })
        .then(data => {
          this.loading = false;
          data.rows.forEach(item => {
            item.belongValue =
              item.belong === "1" ? "服务运营方" : "数据提供方";
            switch (item.type) {
              case "1":
                item.typeValue = "HTTP API";
                break;
              case "2":
                item.typeValue = "WebService API";
                break;
              case "3":
                item.typeValue = "数据源 API";
                break;
            }
            item.typeValue;
          });
          this.tableData = data.rows;
          this.total = data.total;
          this.current = data.current;
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
    },
    openStart(row) {
      this.$confirm("确定要发布该服务吗？", "提交审核", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        putSubmit({
          servId: row.id
        }).then(data => {
          if (data.status === "success") {
            this.getList();
            this.$message({
              type: "success",
              message: data.message
            });
          } else {
            this.$message.error(data.message);
          }
        });
      });
    },
    openChange(row) {
      this.$emit("handleEdit", row);
    },
    deleteServe(row) {
      let type = "";
      switch (row.type) {
        case "1":
          type = "rest";
          break;
        case "2":
          type = "soap";
          break;
        case "3":
          type = "dataset";
          break;
        case "4":
          type = "ogsi";
          break;
      }
      api
        .deleteService(type, {
          servId: row.id
        })
        .then(data => {
          if (data.status === "success") {
            this.getList();
            this.$message({
              type: "success",
              message: data.message
            });
            this.$store.dispatch('getNoticeNumber')
          } else {
            this.$message.error(data.message);
          }
        });
    }
  }
};
</script>

