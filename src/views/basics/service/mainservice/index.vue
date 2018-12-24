<template>
  <div>
    <el-col :span="24" class="opaPart">
      <el-radio-group v-model="servType" @change="changeType">
        <el-radio-button label="allt">全部</el-radio-button>
        <el-radio-button v-for="item in servTypeList" :key="item.key" :label="item.key">{{item.value}}</el-radio-button>
      </el-radio-group>
    </el-col>
    <el-col :span="24">

      <el-card v-if="fwserTypeList.length === 0" class="box-card">
        <div class="empty-tips">
          暂无数据
        </div>
      </el-card>

      <el-card v-else class="box-card" v-loading.body="listLoading">
        <el-row class="fw-rowbox" :gutter="20">
          <el-col style="margin: 6px 0;" :lg="12" :xl="8" v-for="item in fwserTypeList" :key="item.id">
            <el-card class="box-card">
              <div slot="header" class="box-card-header">
                {{item.name}}
                <el-tag class="fw-part-tag" size="small">{{item.tagname?item.tagname:'其他'}}</el-tag>
                <el-tag v-if="item.subscribed === '1'" class="fw-part-tag" size="small" type="success">已订阅</el-tag>
                <el-tag v-if="item.subscribed === '0'" class="fw-part-tag" size="small" type="warning">审批中</el-tag>
                <el-button class="box-card-hbtn" type="success" size="small" @click="toStudentInfo(item.type,item.id,item.subscribed)">查看</el-button>
              </div>

              <div class="fw-part-con">{{item.intro}}</div>
              <div class="fw-part-foot">
                <div class="target">
                  <span>{{item.producer}}</span>
                </div>
                <div class="count">
                  <i class="el-icon-view"></i>
                  {{item.evalCount}}
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[6,12,18,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
      </el-card>

    </el-col>

  </div>
</template>

<script>
import * as dicty from "api/dictionary";
import * as api from "api/service/management";
import { mapGetters } from "vuex";
export default {
  name: "mainService",
  computed: {
    ...mapGetters(["rightInfoObj"])
  },
  data() {
    return {
      servTypeList: [], //服务分类
      servType: "allt", //服务分类选择
      listLoading: true,
      listQuery: {
        pageNo: 1,
        limit: 6,
        name: undefined,
        sortName: "",
        sortOrder: "asc", //asc  正序   desc 倒序
        tag: ""
        // type: "",
        // useof: "1"
      },
      total: null, //总页数
      fwserTypeList: [] //所有服务List
    };
  },
  created() {
    this.getBaseData();
  },
  mounted() {
    this.getList();
  },
  // watch: {
  //   // servTypeList(){
  //   //     this.getList()
  //   // }
  // },
  methods: {
    // 获取服务分类
    getBaseData() {
      var query = { group: "servType" };
      dicty.getBaseData(query).then(data => {
        data.push({
          key: "sub",
          value: "已订阅"
        });
        this.servTypeList = data;
      });
    },
    // 获取全部服务
    getList() {
      api.getRetrieveList({
        ...this.listQuery,
        status: '1'
      }).then(data => {
        this.fwserTypeList = data.rows;
        this.total = data.total;
        this.fwserTypeList.forEach((item, index) => {
          item.tagname = "";
          this.servTypeList.forEach((obj, ind) => {
            if (item.tag == obj.key) {
              item.tagname = obj.value;
            }
          });
        });
        this.listLoading = false;
      });
    },
    //分页
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this.getList();
    },
    // 分类排列
    changeType(val) {
      if (val == "allt") {
        this.listQuery.tag = "";
      } else {
        this.listQuery.tag = val;
      }
      this.listQuery.pageNo = "1";
      this.getList();
    },
    toStudentInfo(type, id, subscribed) {
      this.$router.push({
        path: "/serviceinfo",
        query: { type: type, servId: id, sub: subscribed }
      });
    }
  }
};
</script>

<style scoped>
.empty-tips {
  padding: 200px 0;
  text-align: center;
  font-size: 14px;
  color: #9a9a9a;
}
/* .box-card-header {
  line-height: 40px;
} */
</style>
