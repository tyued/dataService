<template>
  <div class="subscription">
    <el-table v-loading.body="loading" :data="tableData">
      <el-table-column prop="servUuid" label="UID" sortable>
      </el-table-column>
      <el-table-column prop="servName" label="服务名称">
      </el-table-column>
      <el-table-column prop="typeValue" label="服务类型">
      </el-table-column>
      <el-table-column prop="producer" label="服务提供商">
      </el-table-column>
      <el-table-column prop="appName" label="订阅应用">
      </el-table-column>
      <el-table-column label="是否公开">
        <template slot-scope="scope">{{scope.row.servUseof==1?'否':'是'}}</template>
      </el-table-column>
      <el-table-column prop="servTag" label="服务分类">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in servTagArr" v-if="scope.row.servTag === item.key" :key="index" size="small">{{item.value}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === '0'" type="info">待审批</el-tag>
          <el-tag size="small" v-if="scope.row.status === '1'" type="success">已通过</el-tag>
          <el-tag size="small" v-if="scope.row.status === '2'" type="warning ">未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <template v-if="rightInfoObj['serv-subscribe']['serv-sub:review']">
            <el-button v-if="scope.row.status == '0'" type="primary" size="small" @click="showDetail(scope.row)">审核</el-button>
          </template>
          
          <!-- <el-button v-if="rightInfoObj['serv-subscribe']['serv-sub:detail']" type="info" size="small" @click="goToServiceInfo(scope.row)">详情</el-button> -->
          <el-button v-if="rightInfoObj['serv-subscribe']['serv-sub:detail']" class="text_under" type="text" @click="goToServiceInfo(scope.row)">详情</el-button>
          <template  v-if="rightInfoObj['serv-subscribe']['serv-sub:list']">
            <el-button v-if="scope.row.status == '1'" type="primary" size="small" @click="showDialog(scope.row)">授权管理</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件here -->
    <PageBar v-if="!loading" :total="total" :currentpage="current" @handlePage="handlePage" @handlePageSize="handlePageSize" />

    <!-- 管理员-授权管理-弹层 -->
    <el-dialog title="服务授权管理" :visible.sync="dialogTableVisible" width="60%">
      <el-container>
        <el-col :span="14">
          <el-table :data="gridData" height="462" :highlight-current-row="true" @row-click="rowClick">
            <el-table-column prop="producer" label="提供商">
            </el-table-column>
            <el-table-column prop="servName" label="服务名称">
            </el-table-column>
            <el-table-column prop="appName" label="订阅应用">
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <el-tag size="small" v-if="scope.row.status === '0'" type="info">禁用</el-tag>
                <el-tag size="small" v-if="scope.row.status === '1'" type="success">可用</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="timestamp" label="签发时间">
            </el-table-column>
            <el-table-column prop="expValue" label="过期时间">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="10">
          <el-form label-position="left" label-width="80px" style="padding: 20px;">
            <el-form-item label="秘钥">
              <el-input disabled type="textarea" :rows="10" v-model.trim="firstrow.token"></el-input>
            </el-form-item>
            <el-form-item label="申请人">
              <span>{{firstrow.userName}}</span>
            </el-form-item>
            <el-form-item label="过期时间">
              <el-date-picker :rules="[{ required: true, message: '过期时间不能为空'},]" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss" v-model="firstrow.expiration" type="datetime" placeholder="选择过期时间" :picker-options="pickerOptions1">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="私钥管理">
              <template>
                <el-popover placement="bottom" width="160" v-model="visible1">
                  <p>确定要把过期时间设置为{{firstrow.expiration}}吗？</p>
                  <div style="text-align: right; margin: 4px 0">
                    <el-button size="mini" type="text" @click="visible1 = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleReset">确定</el-button>
                  </div>
                  <el-button v-if="rightInfoObj['serv-subscribe']['serv-authz:reset']" slot="reference" size="mini" type="danger" plain>重置私钥</el-button>
                </el-popover>
                &nbsp;
                <el-popover v-if="firstrow.status === '1'" placement="bottom" width="160" v-model="visible2">
                  <p>确定要禁用私钥吗？</p>
                  <div style="text-align: right; margin: 4px 0">
                    <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleForbidden('0')">确定</el-button>
                  </div>
                  <el-button v-if="rightInfoObj['serv-subscribe']['serv-authz:disable']" slot="reference" size="mini" type="danger" plain>禁用私钥</el-button>
                </el-popover>
                <el-popover v-if="firstrow.status === '0'" placement="bottom" width="160" v-model="visible3">
                  <p>确定要启用私钥吗？</p>
                  <div style="text-align: right; margin: 4px 0">
                    <el-button size="mini" type="text" @click="visible3 = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleForbidden('1')">确定</el-button>
                  </div>
                  <el-button v-if="rightInfoObj['serv-subscribe']['serv-authz:enable']" slot="reference" size="mini" type="success" plain>启用私钥</el-button>
                </el-popover>
              </template>
            </el-form-item>
          </el-form>
        </el-col>
      </el-container>
    </el-dialog>

    <!-- 查看弹层 -->
    <el-dialog title="查看详情" :visible.sync="dialogTableVisibleSee">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="供应商" prop="producer">
          <el-tag>{{ruleForm.producer}}</el-tag>
        </el-form-item>
        <el-form-item label="服务名" prop="servName">
          <el-tag>{{ruleForm.servName}}</el-tag>
        </el-form-item>
        <el-form-item label="应用名" prop="appName">
          <el-tag>{{ruleForm.appName}}</el-tag>
        </el-form-item>
        <el-form-item label="申请人" prop="userName">
          <el-tag>{{ruleForm.userName}}</el-tag>
        </el-form-item>
        <el-form-item label="申请说明" prop="desc">
          <span>{{ruleForm.desc}}</span>
        </el-form-item>
        <el-form-item label="审核意见" prop="opinion" :rules="[{ required: ruleForm.status === '0', message: '审核意见不能为空'},]">
          <el-input  :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" maxlength="1000" :disabled="ruleForm.status !== '0'" v-model.trim="ruleForm.opinion"></el-input>
        </el-form-item>
        <el-form-item v-if="ruleForm.status === '0'">
          <el-button type="primary" @click="submitForm('ruleForm', '1')">同意订阅</el-button>
          <el-button type="primary" @click="submitForm('ruleForm', '2')">拒绝订阅</el-button>
          <el-button @click="dialogTableVisibleSee = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "api/service/management";
import PageBar from "components/PageBar/index";
import { mapGetters } from "vuex";
export default {
  name: "subcription",
  computed: {
    ...mapGetters(["servTagArr", 'rightInfoObj'])
  },
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() || time.getTime() <= new Date(that.firstrow.timestamp).getTime();
        }
      },
      visible1: false,
      visible2: false,
      visible3: false,
      gridData: [],
      dialogTableVisible: false,
      dialogTableVisibleSee: false,
      loading: true,
      tableData: [],
      firstrow: {
        token: "",
        userName: "",
        timestamp: "",
        status: "",
        expiration: "",
        id: ""
      },
      total: 0, // 分页
      current: 1, // 分页
      size: 10, // 缓存一下每页大小
      ruleForm: {
        id: "",
        userId: "",
        opinion: "",
        desc: "",
        userName: "",
        appName: "",
        servName: "",
        producer: "",
        status: ""
      },
      servId: "", // 缓存id
      subId: "", // 缓存id
      appId: "" // 缓存id
    };
  },
  components: {
    PageBar
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList(pageNo = 1, limit = this.size) {
      api
        .getPassSubscribeList({
          pageNo,
          limit
        })
        .then(data => {
          this.loading = false;
          data.rows.forEach(item => {
            switch (item.servType) {
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
    showDialog(row) {
      this.dialogTableVisible = true;
      this.firstrow.userName = row.userName;
      this.firstrow.timestamp = row.timestamp;
      this.servId = row.servId;
      this.subId = row.id;
      this.appId = row.appId;
      this.getGridList(row);
    },
    getGridList(row) {
      api
        .getKeyList({
          servId: row.servId,
          subId: row.id,
          appId: row.appId
        })
        .then(data => {
          this.loading = false;
          data.rows.forEach(item => {
            item.expValue = item.expiration ? item.expiration : "无限制";
          });
          this.gridData = data.rows;
          this.firstrow = Object.assign({}, this.firstrow, data.rows[0]);
        });
    },
    showDetail(row) {
      this.ruleForm.id = row.id;
      this.ruleForm.userId = row.userId;
      this.ruleForm.desc = row.desc;
      this.ruleForm.opinion = row.opinion;
      this.ruleForm.userName = row.userName;
      this.ruleForm.appName = row.appName;
      this.ruleForm.servName = row.servName;
      this.ruleForm.producer = row.producer;
      this.ruleForm.status = row.status;
      this.dialogTableVisibleSee = true;
    },
    submitForm(formName, st) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api
            .passReviewKey({
              id: this.ruleForm.id,
              opinion: this.ruleForm.opinion,
              status: st,
              userId: this.ruleForm.userId
            })
            .then(data => {
              if (data.status === "success") {
                this.$message({
                  type: "success",
                  message: data.message
                });
                this.dialogTableVisibleSee = false;
                this.getList();
                this.$store.dispatch("getNoticeNumber");
              } else {
                this.$message.error(data.message);
              }
            });
        }
      });
    },
    rowClick(row, index, i) {
      this.firstrow = Object.assign({}, this.firstrow, row);
    },
    handleForbidden(st) {
      api
        .updateKey({
          id: this.firstrow.id,
          status: st
        })
        .then(data => {
          if (data.status === "success") {
            this.$message({
              type: "success",
              message: data.message
            });
            if (st === "0") {
              this.visible2 = false;
            } else if (st === "1") {
              this.visible3 = false;
            }
            this.getGridList({
              servId: this.servId,
              id: this.subId,
              appId: this.appId
            });
          } else {
            this.$message.error(data.message);
          }
        });
    },
    handleReset() {
      if (!this.firstrow.expiration) {
        this.$message.error("请设置过期时间");
        return;
      }
      api
        .resetKey({
          id: this.firstrow.id,
          expiration: this.firstrow.expiration
        })
        .then(data => {
          if (data.status === "success") {
            this.$message({
              type: "success",
              message: data.message
            });
            this.visible1 = false;
            this.getGridList({
              servId: this.servId,
              id: this.subId,
              appId: this.appId
            });
          } else {
            this.$message.error(data.message);
          }
        });
    },
    goToServiceInfo(row) {
      // 我从管理来
      this.$router.push({
        path: "/serviceinfo",
        query: { type: row.servType, servId: row.servId, sub: '1', from: 'mgr' }
      });
    }
  }
};
</script>

<style>
.el-table .green {
  background-color: #f0f9eb;
}
</style>


