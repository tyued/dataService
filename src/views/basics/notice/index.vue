<template>
  <div class="notice">
    <el-card v-if="noticeList.length === 0" class="box-card">
      <div class="empty-tips">
        暂无通知
      </div>
    </el-card>
    <el-card v-else class="box-card">
      <div slot="header" class="clearfix">
        <span>通知中心</span>
        <el-button @click="handleDeleteAll" style="float: right; padding: 3px 0;margin-left:10px;" type="text">批量删除</el-button>
        <el-button @click="handleReadAll" style="float: right; padding: 3px 0;" type="text">全部已读</el-button>
      </div>
      <!-- <el-collapse @change="handleTabClick" accordion>
        <el-collapse-item v-for="(item, index) in noticeList" :key="index" :name="index">
          <template slot="title">
            <span class="title" :class="{already: item.status === '1'}">
              <i v-show="item.status !== '1'"></i>
              {{item.title}}
              <span class="fr">{{item.timestamp}}&emsp;</span>
            </span>
          </template>
          <div class="detail" :class="{already: item.status === '1'}">{{item.detail}}</div>
        </el-collapse-item>
      </el-collapse> -->

      <el-table @selection-change="handleSelectionChange" @expand-change="handleTabClick" :show-header="false" ref="multipleTable" :data="noticeList" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column align="left" prop="title">
          <template slot-scope="props">
            <i v-show="props.row.status !== '1'"></i>
            <span>{{props.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop="timestamp">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="detail">{{props.row.detail}}</div>
            <!-- <div class="detail" :class="{already: props.row.status === '1'}">{{props.row.detail}}</div> -->
          </template>
        </el-table-column>
      </el-table>

      <PageBar :total="total" :currentpage="current" @handlePage="handlePage" @handlePageSize="handlePageSize" />
    </el-card>
  </div>
</template>

<script>
import * as api from "api/login";
import PageBar from "components/PageBar/index";
export default {
  name: "notice",
  components: {
    PageBar
  },
  created() {
    this.getList();
  },
  computed: {
    ids() {
      return this.multipleSelection.map(item => item.id);
    }
  },
  data() {
    return {
      activeName: 0,
      noticeList: [],
      multipleSelection: [],
      total: 0,
      current: 0,
      size: 10 // 缓存一下每页大小
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getList(pageNo = 1, limit = this.size) {
      api
        .postNoticeList({
          limit,
          pageNo
        })
        .then(res => {
          const { data, status } = res;
          if (status === 200 && data) {
            data.rows.forEach(item => (item.checked = false));
            this.noticeList = data.rows;
            this.total = parseInt(data.total);
            this.current = parseInt(data.current);
          }
        });
    },
    handlePage(number) {
      // 分页
      this.getList(number);
      this.current = number;
    },
    handlePageSize(number) {
      this.size = number;
      this.getList(1, number);
      this.current = 1;
    },
    handleTabClick(row, expandedRows) {
      const { status, id } = row;
      if (status === "0") {
        api
          .postRead({
            id
          })
          .then(res => {
            if (res.status === 200 && res.data.status === "success") {
              row.status = "1";
              this.changeNoticeNumber();
            }
          });
      }
    },
    handleReadAll() {
      this.$confirm("确定要标记为全部已读吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api.postReadAll().then(res => {
          const { status, data } = res;
          if (status === 200 && data) {
            if (data.status === "success") {
              this.getList(this.current, this.size);
              this.changeNoticeNumber();
              this.$message({
                type: "success",
                message: data.message
              });
            } else {
              this.$message.error(data.message);
            }
          }
        });
      });
    },
    changeNoticeNumber() {
      this.$store.dispatch("getNoticeNumber");
    },
    handleDeleteAll() {
      if (this.ids.length === 0) {
        return;
      }
      this.$confirm(`确定要删除${this.ids.length}条通知吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api
          .deleteNotice({
            ids: this.ids.join(",")
          })
          .then(res => {
            const { status, data } = res;
            if (status === 200 && data) {
              if (data.status === "success") {
                this.getList(this.current, this.size);
                this.changeNoticeNumber();
                this.$message({
                  type: "success",
                  message: data.message
                });
              } else {
                this.$message.error(data.message);
              }
            }
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.empty-tips {
  padding: 200px 0;
  text-align: center;
  font-size: 14px;
  color: #9a9a9a;
}
.detail {
  padding-left: 30px;
  line-height: 2em;
}
.already {
  color: #9a9a9a;
}
i {
    position: absolute;
    left: 0;
    top: 13px;
    // top: 50%;
    // transform: translateY(-50%);
    // -webkit-transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background-color: #f56c6c;
    border-radius: 50%;
  }
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
