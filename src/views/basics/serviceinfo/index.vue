<template>
  <div class="container" v-loading.body="listLoading">
    <h1>{{infoData.name}}</h1>
    <el-row class="top-nav">
      <el-col :span="24">
        <ul>
          <li><span>&emsp;服务商：</span><a href="javascript:;">{{infoData.producer}}</a></li>
          <li><span>分&emsp;类：</span>
            <el-tag type="success">{{infoData.tagname}}</el-tag>
          </li>
          <li>{{infoData.subCount}}</li>
          <li>{{infoData.evalCount}}</li>
          <li>
            <el-rate v-model="valRate" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
          </li>
          <li class="nav-back" @click="$router.back()">返回</li>
          <!-- <li class="nav-forbidden" v-if="$store.getters.userInfoObj.roleId === '1'">
            <span v-if="sub === '0'">禁用</span>
            <span v-else>发布</span>
          </li> -->
          <li class="nav-monitor" v-if="$store.getters.userInfoObj.roleId === '1'" @click="goToMonitor">&nbsp;监控</li>
          <li @click="subscribe" v-if="sub === '0'" class="nav-sub">
            <span>订阅</span>
          </li>
          <li @click="unSubscribe" v-else class="nav-sub">
            <span>取消订阅</span>
          </li>
          <li class="nav-res" @click="handleList">意见反馈</li>
        </ul>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="14">
        <el-card shadow="always" class="card-item" :body-style="{'height': '392px'}">
          <h5>服务简介</h5>
          <section v-html="infoData.detail"></section>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="always" class="card-item">
          <div class="card-item-title">
            <h5>猜你喜欢</h5>
            <!--<a href="javascript:;">换一批</a>-->
          </div>
          <div class="card-itembox" v-for="item in enjoyList" :key="item.id">
            <div class="card-item-top">
              <span>{{item.name}}</span>
              <el-button type="success" size="small" @click="toStudentInfo(item.type,item.id)">查看</el-button>
            </div>
            <el-row class="card-item-bottom">
              <el-col class="li" :span="5">{{item.producer}}</el-col>
              <el-col class="li" :span="5">{{item.subCount}}</el-col>
              <el-col class="li" :span="5">{{item.evalCount}}</el-col>
              <el-col class="li" :span="9">
                <el-rate v-model="item.evalRank" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" class="main">
      <el-col :span="24">
        <el-card shadow="always" class="card-item">
          <section>
            <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;" :stretch="true">
              <el-radio-button label="left">API文档</el-radio-button>
              <el-radio-button label="top">错误代码</el-radio-button>
            </el-radio-group>
            <el-tabs :tab-position="tabPosition">
              <el-tab-pane v-for="item in apisList" :key="item.id" :label="item.name">
                <el-row :gutter="14" v-if='tabPosition=="left"'>
                  <el-col :span="12" class="left-box">
                    <h5>基本信息</h5>
                    <ol>
                      <li><span class="li-title">接口地址：</span><span class="li-cont">{{item.url}}</span></li>
                      <li><span class="li-title">返回格式：</span><span class="li-cont">
                          <el-tag>{{item.resp?item.resp:(type==2?'XML':'空')}}</el-tag>
                        </span>
                      </li>
                      <li><span class="li-title">请求方式：</span><span class="li-cont">
                          <el-tag>{{item.method}}</el-tag>
                        </span>
                      </li>
                      <li><span class="li-title">请求示例：</span><span class="li-cont">{{item.expUrl}}</span></li>
                      <li><span class="li-title">接口备注：</span><span class="li-cont" v-html="item.intro"></span>
                      </li>
                    </ol>
                    <h5>请求参数说明</h5>
                    <el-tabs class="exact" type="border-card">
                      <el-tab-pane label="输入参数">
                        <el-table :data="item.params" style="width: 100%">
                          <el-table-column prop="name" label="名称"></el-table-column>
                          <el-table-column prop="required" label="必填">
                            <template slot-scope="scope">
                              {{scope.row.required=="1"?'是':'否'}}
                            </template>
                          </el-table-column>
                          <el-table-column prop="type" label="类型"></el-table-column>
                          <el-table-column prop="desc" label="说明"></el-table-column>
                        </el-table>
                      </el-tab-pane>
                      <el-tab-pane label="输出参数">
                        <el-table :data="item.responses" style="width: 100%">
                          <el-table-column prop="name" label="名称"></el-table-column>
                          <el-table-column prop="key" label="类型"></el-table-column>
                          <el-table-column prop="desc" label="说明"></el-table-column>
                        </el-table>
                      </el-tab-pane>
                    </el-tabs>
                  </el-col>
                  <el-col :span="12" class="right-box">
                    <h5>&emsp;{{item.resp?item.resp:(type==2?'XML':'空')}}返回示例</h5>
                    <div class="respBox" v-html="item.example"></div>
                  </el-col>
                </el-row>
                <el-row v-else>
                  <el-col :span="24">
                    <h5>服务级错误码参照</h5>
                    <el-table :data="item.errors" style="width: 100%">
                      <el-table-column prop="code" label="错误码"></el-table-column>
                      <el-table-column prop="text" label="说明"></el-table-column>
                    </el-table>
                    <h5>系统级错误码参照</h5>
                    <el-table :data="ErrorCode" style="width: 100%">
                      <el-table-column prop="code" label="错误码"></el-table-column>
                      <el-table-column prop="text" label="说明"></el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </section>
        </el-card>
      </el-col>
    </el-row>

    <!-- 对话框 -->
    <el-dialog title="意见反馈" :visible.sync="centerDialogVisible" width="600px" center>
      <el-row class="dialog-topbox">
        <el-col :span="6">
          <h4>评论及评分</h4>
          <h2>{{evalself.alleval}}</h2>
          <span>满分为5分</span>
        </el-col>
        <el-col :span="18" class="evalsbox">
          <el-row>
            <el-col class="dialog-stars" :span="10">
              <el-rate v-model="evalsinfo.star5" disabled :colors="['#606266', '#606266', '#606266']"></el-rate>
            </el-col>
            <el-col :span="14">
              <el-progress class="dialog-line" :percentage="evalself.rank5" color="#909399" :show-text="false"></el-progress>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="dialog-stars" :span="10">
              <el-rate v-model="evalsinfo.star4" disabled :colors="['#606266', '#606266', '#606266']"></el-rate>
            </el-col>
            <el-col :span="14">
              <el-progress class="dialog-line" :percentage="evalself.rank4" color="#909399" :show-text="false"></el-progress>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="dialog-stars" :span="10">
              <el-rate v-model="evalsinfo.star3" disabled :colors="['#606266', '#606266', '#606266']"></el-rate>
            </el-col>
            <el-col :span="14">
              <el-progress class="dialog-line" :percentage="evalself.rank3" color="#909399" :show-text="false"></el-progress>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="dialog-stars" :span="10">
              <el-rate v-model="evalsinfo.star2" disabled :colors="['#606266', '#606266', '#606266']"></el-rate>
            </el-col>
            <el-col :span="14">
              <el-progress class="dialog-line" :percentage="evalself.rank2" color="#909399" :show-text="false"></el-progress>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="dialog-stars" :span="10">
              <el-rate v-model="evalsinfo.star1" disabled :colors="['#606266', '#606266', '#606266']"></el-rate>
            </el-col>
            <el-col :span="14">
              <el-progress class="dialog-line" :percentage="evalself.rank1" color="#909399" :show-text="false"></el-progress>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="dialog-middlebox" v-if="isMiddle">
        <el-col :span="12">
          <a href="javascript:;" @click="isMiddle = !isMiddle"><i class="el-icon-edit"></i>&emsp;撰写评论</a>
        </el-col>
        <el-col :span="12">
          <span>给我打分&nbsp;&nbsp;</span>
          <el-rate v-model="submitParams.rank" class="dialog-stars" @change="rateChange"></el-rate>
        </el-col>
      </el-row>

      <section v-if="!isMiddle">
        <el-row class="dialog-bottombox">
          <div class="dialog-title">
            <span>&emsp;给我打分&nbsp;&nbsp;</span>
            <el-rate v-model="submitParams.rank" class="dialog-stars" @change="rateChange"></el-rate>
          </div>

          <el-form :model="submitParams" :rules="rules" ref="submitParams" label-width="70px" class="demo-ruleForm">
            <el-form-item label="标题" prop="text">
              <el-input v-model="submitParams.text"></el-input>
            </el-form-item>
            <el-form-item label="评论" prop="title">
              <el-input type="textarea" v-model="submitParams.title"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="submitForm('submitParams')">确 定</el-button>
              <el-button size="small" @click="isMiddle = !isMiddle">取 消</el-button>
            </el-form-item>
          </el-form>

        </el-row>
        <el-row class="dialog-more">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              按最有帮助排序
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item command="最有帮助">按最有帮助排序</el-dropdown-item> -->
              <el-dropdown-item command="最高评价">按最高评价排序</el-dropdown-item>
              <el-dropdown-item command="最低评价">按最低评价排序</el-dropdown-item>
              <el-dropdown-item command="最新评价">按最新评价排序</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-col v-for="(item, index) in accessList" :key="index" :span="24" class="dialog-assessbox">
            <h4>{{item.title}}</h4>
            <div class="dialog-title">
              <span>{{item.userName}}</span>&nbsp;<span>{{item.timestamp}}</span>
              <el-rate v-model="item.rank" class="dialog-stars" disabled></el-rate>
            </div>
            <div class="dialog-message">
              <p>{{item.text}}&nbsp;</p>
            </div>
          </el-col>
          <el-col :span="24" class="dialog-links">
            <a v-if="lessControll" @click="handleLessMsg" href="javascript:;">收起
              <i class="el-icon-arrow-up"></i>
            </a>
            <a v-if="totalNumber > 5 && accessList.length != totalNumber" @click="handleMoreMsg" href="javascript:;">更多
              <i class="el-icon-arrow-down"></i>
            </a>
          </el-col>
        </el-row>
      </section>
    </el-dialog>

    <!-- 接口的弹出层 -->
    <el-dialog width="76%" title="接口监控信息" :visible.sync="dialogIOVisible">
      <TabService :servId="servId" :servType="type" ref="tab-service" />
    </el-dialog>
    <!-- /接口的弹出层 -->

    <!-- 订阅弹出层 -->
    <el-dialog width="40%" title="选择要订阅的应用" :visible.sync="dialogIOVisibleSub">

      <el-form ref="form" :rules="rulesApp" :model="form" label-width="80px">

        <el-form-item label="应用" prop="appId">
          <el-select v-model="form.appId" placeholder="请选择应用">
            <el-option v-for="(item, index) in appArr" :key="index" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="subscribeDone('form')">确定</el-button>
          <el-button @click="dialogIOVisibleSub = false">取消</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import * as api from "api/serviceinfo/index";
import * as dicty from "api/dictionary";
import TabService from "../monitor/service/tabservice/index";
export default {
  name: "serviceinfo",
  components: {
    TabService
  },
  data() {
    return {
      form: {
        appId: "",
        desc: ""
      },
      rulesApp: {
        desc: [
          { required: true, message: "请输入描述内容", trigger: "blur" },
          {
            min: 1,
            max: 500,
            message: "长度在 1 到 500 个字符",
            trigger: "blur"
          }
        ],
        appId: [{ required: true, message: "请选择应用", trigger: "change" }]
      },
      listLoading: true,
      dialogIOVisibleSub: false,
      dialogIOVisible: false,
      lessControll: false, // 控制收起按钮的显示
      type: "", //1. HTTP API(rest)  2. WebService API   3.  通过数据源发布
      servId: "",
      detail: true,
      DetailQuery: {
        detail: true
      },
      infoData: [], //详细信息
      servTypeList: [], //服务分类
      valRate: 0, //评分
      tabPosition: "left",
      apisList: [], //接口详情
      enjoyList: [], //猜你喜欢的
      ErrorCode: [], //服务错误对照信息
      Settings: "",
      appArr: [],
      evalsinfo: {
        //评价详情
        star1: 1,
        star2: 2,
        star3: 3,
        star4: 4,
        star5: 5
      },
      evalself: {
        rank5: 0,
        rank4: 0,
        rank3: 0,
        rank2: 0,
        rank1: 0
      },

      centerDialogVisible: false,
      rules: {
        text: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur"
          }
        ],
        title: [
          {
            required: true,
            message: "请填写评论",
            trigger: "blur"
          }
        ]
      },
      isMiddle: true,
      submitParams: {
        text: "",
        title: "",
        rank: 0
      },
      accessList: [],
      totalNumber: 0,
      limitNumber: 5,
      sub: "",
      commandNumber: "3" // 一开始就是按最新评论来排序 排序方式：1：最高评价，2：最低评价，3：最新评价
    };
  },
  created() {
    this.type = this.$route.query.type;
    this.servId = this.$route.query.servId;
    // this.sub = this.$route.query.sub;
    this.DetailQuery.servId = this.servId;
    this.submitParams.servId = this.servId;
    this.getBaseData();
    this.getErrorCode();

    this.getParamForms();
    this.getRelationForms();
  },
  mounted() {
    this.init();
  },
  methods: {
    // 获取服务分类
    getBaseData() {
      var query = { group: "servType" };
      dicty.getBaseData(query).then(response => {
        this.servTypeList = response.data;
      });
      // 访问前缀
      dicty.getSettings().then(response => {
        this.Settings = response.data.servUrl;
      });
    },
    init() {
      if (this.type == "1") {
        //HTTP API(rest)
        api.getRest(this.DetailQuery).then(response => {
          this.infoData = response.data;
          this.sub = response.data.subscribed;
          this.apisList = response.data.apis;
          this.infoData.tagname = "";
          var that = this;
          this.servTypeList.forEach(function(item, index) {
            if (that.infoData.tag == item.key) {
              that.infoData.tagname = item.value;
            }
          });
          var uuid = this.infoData.uuid;
          var reg = new RegExp("\\.", "g");
          this.apisList.forEach((item, index) => {
            var apiVer = item.version.replace(reg, "_");
            item.expUrl =
              this.Settings +
              "/rest/" +
              uuid +
              "/" +
              item.ename +
              "/V" +
              apiVer;
          });

          this.infoData.tagname = this.infoData.tagname
            ? this.infoData.tagname
            : "其他";
          this.listLoading = false;

          this.valRate = parseInt(this.infoData.evalRank);
          this.getEnjoyList();
        });
      }
      if (this.type == "2") {
        //WebService API(soap)
        api.getSoap(this.DetailQuery).then(response => {
          this.infoData = response.data;
          this.sub = response.data.subscribed;
          this.apisList = response.data.apis;
          this.infoData.tagname = "";
          var that = this;
          this.servTypeList.forEach(function(item, index) {
            if (that.infoData.tag == item.key) {
              that.infoData.tagname = item.value;
            }
          });
          var uuid = this.infoData.uuid;
          var reg = new RegExp("\\.", "g");
          this.apisList.forEach(function(item, index) {
            var apiVer = item.version.replace(reg, "_");
            item.expUrl =
              item.Settings +
              "/rest/" +
              uuid +
              "/" +
              item.ename +
              "/V" +
              apiVer;
          });
          this.infoData.tagname = this.infoData.tagname
            ? this.infoData.tagname
            : "其他";
          this.listLoading = false;
          this.valRate = parseInt(this.infoData.evalRank);
          this.getEnjoyList();
        });
      }
      if (this.type == "3") {
        //数据源
        api.getDataset(this.DetailQuery).then(response => {
          this.infoData = response.data;
          this.sub = response.data.subscribed;
          this.apisList = response.data.apis;
          this.infoData.tagname = "";
          var that = this;
          this.servTypeList.forEach(function(item, index) {
            if (that.infoData.tag == item.key) {
              that.infoData.tagname = item.value;
            }
          });
          var uuid = this.infoData.uuid;
          var reg = new RegExp("\\.", "g");
          this.apisList.forEach(function(item, index) {
            var apiVer = item.version.replace(reg, "_");
            item.expUrl =
              item.Settings +
              "/rest/" +
              uuid +
              "/" +
              item.ename +
              "/V" +
              apiVer;
          });
          this.infoData.tagname = this.infoData.tagname
            ? this.infoData.tagname
            : "其他";
          this.listLoading = false;
          this.valRate = parseInt(this.infoData.evalRank);
          this.getEnjoyList();
        });
      }
    },
    // 猜你喜欢的
    getEnjoyList() {
      var query = { tag: this.infoData.tag };
      api.getEnjoy(query).then(response => {
        this.enjoyList = response.data;
        this.enjoyList.forEach(function(item, index) {
          item.evalRank = parseInt(item.evalRank);
        });
      });
    },
    //服务错误对照信息
    getErrorCode() {
      api.getErrorCode().then(response => {
        this.ErrorCode = response.data;
      });
    },
    // 猜你喜欢的查看
    toStudentInfo(type, id) {
      this.$router.push({
        path: "/serviceinfo",
        query: { type: type, servId: id }
      });
    },
    // 意见反馈
    handleList() {
      this.centerDialogVisible = true;
      this.isMiddle = true;
      // 重置表单
      this.submitParams.rank = 0;
      this.submitParams.text = "";
      this.submitParams.title = "";
      api.getEvalStats({ servId: "1" }).then(res => {
        var rank5 = Number(res.data.rank5);
        var rank4 = Number(res.data.rank4);
        var rank3 = Number(res.data.rank3);
        var rank2 = Number(res.data.rank2);
        var rank1 = Number(res.data.rank1);
        var allRank = rank5 + rank4 + rank3 + rank2 + rank1;
        this.evalself.rank5 = (rank5 / allRank) * 100;
        this.evalself.rank4 = (rank4 / allRank) * 100;
        this.evalself.rank3 = (rank3 / allRank) * 100;
        this.evalself.rank2 = (rank2 / allRank) * 100;
        this.evalself.rank1 = (rank1 / allRank) * 100;
        this.evalself.alleval = (
          (rank5 * 5 + rank4 * 4 + rank3 * 3 + rank2 * 2 + rank1 * 1) /
          allRank
        ).toFixed(1);
      });
      // 一开始就是按最新排序来展示
      this.getMoreList(this.commandNumber);
    },
    getMoreList(sortType, limit = 5, servId = this.servId, pageNo = 1) {
      api
        .getEvalSort({
          servId,
          pageNo,
          limit,
          sortType
        })
        .then(res => {
          const { data, status, total } = res;
          if (status === 200 && data.rows) {
            data.rows.forEach(item => {
              item.rank = +item.rank;
            });
            this.accessList = data.rows;
            this.totalNumber = data.total;
          }
        });
    },
    // 意见反馈--打分
    rateChange(val) {
      // if(this.isMiddle){              //只打分
      //   // console.log(this.submitParams)
      //   // this.submitParams.servId = "1"
      //   api.submitAssess(this.submitParams).then(res => {
      //       if (res.status === 200) {
      //         this.$notify({title: '成功', message: '打分成功', type: 'success', duration: 2000});
      //         this.init();
      //         this.centerDialogVisible = false;
      //       }
      //   })
      // }
    },
    // 意见反馈--提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.submitAssess(this.submitParams).then(res => {
            if (res.status === 200) {
              this.$notify({
                title: "成功",
                message: "提交成功",
                type: "success",
                duration: 2000
              });
              this.init();
              this.centerDialogVisible = false;
            }
          });
        } else {
          this.$notify({
            title: "失败",
            message: "还有未填项",
            type: "error",
            duration: 2000
          });
          return false;
        }
      });
    },
    async handleCommand(command) {
      let obj = {
        最高评价: "1",
        最低评价: "2",
        最新评价: "3"
      };
      this.commandNumber = obj[command];
      await this.getMoreList(this.commandNumber, this.limitNumber);
      this.$message("已按照" + command + "排序");
    },
    getParamForms() {
      api.getParamForms().then(res => {
        res.data.map(item => {
          item.require = "是";
          item.type = "String";
          return item;
        });
        this.requestTableData = res.data;
      });
    },
    getRelationForms() {
      api.getRelationForms().then(res => {
        res.data.map(item => {
          item.require = "是";
          item.type = "String";
          return item;
        });
        this.responseTableData = res.data;
      });
    },
    handleMoreMsg() {
      this.lessControll = true;
      this.limitNumber += 5;

      this.getMoreList(this.commandNumber, this.limitNumber);
    },
    handleLessMsg() {
      this.lessControll = false;
      this.limitNumber = 5;
      this.getMoreList(this.commandNumber, this.limitNumber);
    },
    goToMonitor() {
      this.dialogIOVisible = true;
      if (this.$refs["tab-service"]) {
        this.$refs["tab-service"].init();
      }
    },
    unSubscribe() {
      this.$confirm("确认要取消订阅该服务吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api
          .unSubscribe({
            servId: this.servId
          })
          .then(res => {
            const { status, data } = res;
            if (status === 200 && data) {
              if (data.status === "success") {
                this.infoData.subCount--;
                this.sub = "0";
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
    subscribe() {
      this.dialogIOVisibleSub = true
      this.form.appId = ""
      this.form.desc = ""
      api.getAppList().then(res => {
        const { status, data } = res;
        if (status === 200 && data) {
          this.appArr = data;
        }
      });
    },
    subscribeDone(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api
            .subscribe({
              servId: this.servId,
              appId: this.form.appId,
              desc: this.form.desc
            })
            .then(res => {
              const { status, data } = res;
              if (status === 200 && data) {
                if (data.status === "success") {
                  this.dialogIOVisibleSub = false;
                  this.infoData.subCount++;
                  this.sub = "1";
                  this.$message({
                    type: "success",
                    message: data.message
                  });
                } else {
                  this.$message.error(data.message);
                }
              }
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  padding: 4px;
  width: 100%;
  overflow-x: hidden;
  color: #303133;
  font-size: 14px;
  line-height: 24px;
  .top-nav {
    .el-rate {
      margin-top: 6px;
    }
  }
  h1 {
    font-size: 24px;
  }
  ul li {
    float: left;
    padding: 20px 0;
    margin-left: 26px;
    box-sizing: content-box;
    line-height: 32px;
    height: 32px;
  }
  ul li:first-child {
    margin-left: 0;
    a {
      color: #449afc;
    }
  }
  ul li:nth-child(n + 3) {
    padding-left: 34px;
  }
  ul li:nth-child(n + 6) {
    float: right;
    cursor: pointer;
  }
  ul li:nth-child(3) {
    background: url("./img/info_wifi.png") no-repeat left center;
  }
  ul li:nth-child(4) {
    background: url("./img/info_message.png") no-repeat left center;
  }
  ul li:nth-child(5) {
    background: url("./img/info_good.png") no-repeat left center;
  }

  .nav-back {
    background: url("./img/info_back.png") no-repeat left center;
  }
  .nav-forbidden {
    background: url("./img/info_forbidden.png") no-repeat left center;
  }
  .nav-monitor {
    background: url("./img/info_watch.png") no-repeat left center;
  }
  .nav-res {
    background: url("./img/info_edit.png") no-repeat left center;
  }
  .nav-sub {
    background: url("./img/info_wifi.png") no-repeat left center;
  }
  /* 卡片 */
  .card-item {
    // min-width: 530px;
    // height: 408px;
    h5 {
      line-height: 52px;
    }
    .card-item-title {
      height: 52px;
      line-height: 52px;
      h5 {
        float: left;
      }
      a {
        float: right;
        color: #449afc;
      }
    }
    h5 {
      font-size: 20px;
    }
    .card-itembox {
      padding: 10px;
      width: 100%;
      height: 130px;
      background-color: #f5f7fa;
      border-radius: 2px;
      margin-bottom: 20px;
    }
    .card-item-top {
      border-bottom: 1px solid #ccc;
      overflow: hidden;
      padding: 0 10px;
      height: 44px;
      line-height: 44px;
      & > span {
        float: left;
        font-size: 16px;
        color: #000;
      }
      .el-button {
        float: right;
        margin-top: 6px;
      }
    }
    .card-item-bottom {
      padding: 22px 10px;
      .el-rate {
        margin-top: 6px;
      }
      .li {
        vertical-align: middle;
        box-sizing: border-box;
        line-height: 32px;
        height: 32px;
      }
      .li:nth-child(2) {
        padding-left: 30px;
        background: url("./img/info_wifi.png") no-repeat left center;
      }
      .li:nth-child(3) {
        padding-left: 30px;
        background: url("./img/info_message.png") no-repeat left center;
      }
      .li:nth-child(4) {
        // min-width: 160px;
        padding-left: 30px;
        background: url("./img/info_good.png") no-repeat left center;
      }
    }
  }
  .main {
    margin-top: 12px;
    // .tab-container {
    //   overflow: hidden;
    // }
    .el-card {
      height: auto;
      .el-tabs {
        height: auto;
      }
    }
    .el-tabs__content {
      h5 {
        font-size: 16px;
      }
    }
    ol {
      padding-left: 10px;
    }
    ol li {
      padding: 4px 0;
      color: #606266;
    }
    .left-box {
      margin-bottom: -3000px;
      padding-bottom: 3000px;
    }
    .right-box {
      margin-bottom: -3000px;
      padding-bottom: 3000px;
      // height: inherit;
      // min-height: 520px;
      background-color: #e3e6ec;
    }
  }
  .dialog-topbox {
    height: 150px;
    border-bottom: 1px solid #e3e6ec;
    h2 {
      font-size: 50px;
      line-height: 1.2em;
    }
    span {
      font-size: 12px;
    }
  }
  .dialog-stars {
    text-align: right;
    padding-right: 6px;
    i {
      margin-right: 4px;
    }
  }
  .dialog-line {
    margin-top: 9px;
    // width: 100%;
    height: 4px;
  }
  .dialog-middlebox {
    height: 70px;
    line-height: 70px;
    font-size: 12px;
    overflow: hidden;
    // border-bottom: 1px solid #e3e6ec;
    a {
      color: #50a1fc;
    }
    .dialog-stars {
      float: right;
      margin-top: 25px;
    }
    & div:last-child {
      text-align: right;
    }
  }

  .dialog-bottombox {
    font-size: 12px;
    // height: 280px;
    border-bottom: 1px solid #e3e6ec;
    .dialog-stars {
      float: left;
      margin-top: 2px;
    }
    & span {
      float: left;
      height: 24px;
      line-height: 24px;
    }
    .dialog-title {
      overflow: hidden;
      padding: 14px 0;
    }
  }
  .dialog-more {
    padding-top: 6px;
    h4 {
      color: #000;
      margin-top: 20px;
      font-size: 16px;
    }
    .dialog-stars {
      float: right;
      margin-top: 2px;
    }
  }
  .el-dropdown-link {
    cursor: pointer;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

  .dialog-assessbox {
    overflow: hidden;
  }
  .dialog-links {
    text-align: right;
    a,
    i {
      color: #50a1fc;
    }
  }
}
</style>
