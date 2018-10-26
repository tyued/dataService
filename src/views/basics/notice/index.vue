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
        <el-button @click="handleReadAll" style="float: right; padding: 3px 0" type="text">全部已读</el-button>
      </div>
      <el-collapse @change="handleTabClick" accordion>
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
      </el-collapse>
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
  data() {
    return {
      activeName: 0,
      noticeList: [],
      total: 0,
      current: 0,
      size: 10 // 缓存一下每页大小
    };
  },
  methods: {
    getList(pageNo = 1, limit = 10) {
      api
        .postNoticeList({
          limit,
          pageNo
        })
        .then(res => {
          const { data, status } = res;
          if (status === 200 && data) {
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
    handleTabClick(i) {
      if (typeof i !== "number") {
        return;
      }
      const { status, id } = this.noticeList[i];
      if (status === "0") {
        api
          .postRead({
            id
          })
          .then(res => {
            if (res.status === 200 && res.data.status === "success") {
              this.noticeList[i].status = '1'
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
          if (res.status === 200 && res.data.status === "success") {
            this.getList(this.current, this.size);
            this.changeNoticeNumber();
          }
        });
      });
    },
    changeNoticeNumber() {
      this.$store.dispatch("getNoticeNumber");
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
  padding-top: 12px;
  padding-left: 12px;
  line-height: 2em;
}
.already {
  color: #9a9a9a;
}
.title {
  position: relative;
  padding-left: 12px;
  i {
    position: absolute;
    left: 0;
    top: 0;
    // top: 50%;
    // transform: translateY(-50%);
    // -webkit-transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background-color: #f56c6c;
    border-radius: 50%;
  }
}
</style>
