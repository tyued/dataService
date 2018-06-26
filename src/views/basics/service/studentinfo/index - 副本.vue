<template>
  <div class="container">
    <h1>学生信息查询</h1>
    <el-row class="top-nav">
      <el-col :span="24">
        <ul>
          <li>&emsp;服务商：
            <a href="javascript:;">天音智慧校园</a>
          </li>
          <li>分&emsp;类:&nbsp;
            <el-button type="success" plain size="small">学生信息</el-button>&nbsp;
            <el-button type="primary" plain size="small">信息查询</el-button>
          </li>
          <li>{{ navData.wifi }}</li>
          <li>{{ navData.heart }}</li>
          <li>{{ navData.message }}</li>
          <li>
            <el-rate v-model="value2" disabled show-score text-color="#ff9900" score-template="{value}">
            </el-rate>
          </li>
          <li>
            <a href="javascript:;">返回</a>
          </li>
          <li>
            <a href="javascript:;">禁用/发布</a>
          </li>
          <li>
            <a href="javascript:;">监控</a>
          </li>
          <li>
            <a href="javascript:;">&nbsp;订阅/取消</a>
          </li>
          <li>
            <a href="javascript:;" @click="handleList">意见反馈</a>
          </li>
          <li>
            <a href="javascript:;">加入收藏</a>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="16">
        <el-card shadow="always" class="card-item">
          <h5>服务简介</h5>
          <section>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </section>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always" class="card-item">
          <div class="card-item-title">
            <h5>猜你喜欢</h5>
            <a href="javascript:;">换一批</a>
          </div>
          <div class="card-itembox">
            <div class="card-item-top">
              <span>学生分数查询</span>
              <el-button type="success" size="small">查看</el-button>
            </div>
            <div class="card-item-bottom">
              <li>天音智慧教育</li>
              <li>{{ navData.wifi }}</li>
              <li>{{ navData.message }}</li>
              <li>
                <el-rate v-model="value2" disabled show-score text-color="#ff9900" score-template="{value}">
                </el-rate>
              </li>
            </div>
          </div>
          <div class="card-itembox">
            <div class="card-item-top">
              <span>学生成绩查询</span>
              <el-button type="success" size="small">查看</el-button>
            </div>
            <div class="card-item-bottom">
              <li>天音智慧教育</li>
              <li>{{ navData.wifi }}</li>
              <li>{{ navData.message }}</li>
              <li>
                <el-rate v-model="value3" disabled show-score text-color="#ff9900" score-template="{value}">
                </el-rate>
              </li>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" class="main">
      <el-col :span="24">
        <el-card shadow="always" class="card-item">
          <h5>服务简介</h5>
          <section>
            <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;" :stretch="true">
              <el-radio-button label="left">API文档</el-radio-button>
              <el-radio-button label="top">错误代码</el-radio-button>
            </el-radio-group>

            <el-tabs :tab-position="tabPosition">
              <el-tab-pane class="tab-container" label="获取token">
                <el-col :span="12" class="left-box">
                  <h5>基本信息</h5>
                  <ol>
                    <li>接口地址：http://www.91118.com/apo/test</li>
                    <li>返回格式：
                      <el-button type="primary" plain size="mini">JSON</el-button>
                      <el-button type="success" plain size="mini">XML</el-button>
                    </li>
                    <li>请求方式：
                      <el-button type="info" plain size="mini">GET</el-button>
                      <el-button type="warning" plain size="mini">POST</el-button>
                    </li>
                    <li>请求示例：http://www.91118.com/apo/test?param1=xxx&amp;param2=123</li>
                    <li>接口备注：</li>
                  </ol>
                  <h5>请求参数说明</h5>
                  <el-table :data="requestTableData" style="width: 100%" height="200">
                    <el-table-column prop="key" label="名称">
                    </el-table-column>
                    <el-table-column prop="require" label="必填">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                    </el-table-column>
                    <el-table-column prop="desc" label="说明" width="300">
                    </el-table-column>
                  </el-table>
                  <h5>返回参数说明</h5>
                  <el-table :data="responseTableData" style="width: 100%" height="200" empty-text="是">
                    <el-table-column prop="key" label="名称">
                    </el-table-column>
                    <el-table-column prop="require" label="必填">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                    </el-table-column>
                    <el-table-column prop="desc" label="说明" width="300">
                    </el-table-column>
                  </el-table>
                </el-col>
                <el-col :span="12" class="right-box">
                  <h5>&emsp;JSON返回示例</h5>
                  <pre>
                  "swagger": "2.0",
                  "info": {
                      "description": "数据服务总线-管理后台接口",
                      "version": "1.0.0-SNAPSHOT",
                      "title": "数据服务总线",
                      "contact": {
                          "name": "杭州天音计算机系统工程有限公司",
                          "url": "http://www.yd-jxt.com/",
                          "email": "171274313@qq.com"
                      },
                      "license": {
                          "name": "Apache License, Version 2.0",
                          "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
                      }
                    },
                    "host": "192.168.0.111:8083",
                    "basePath": "/dsb"
                  </pre>
                </el-col>
              </el-tab-pane>

              <el-tab-pane label="获取当年学年学期">获取当年学年学期</el-tab-pane>
              <el-tab-pane label="获取年级列表">获取年级列表</el-tab-pane>
              <el-tab-pane label="获取年级列表">获取年级列表</el-tab-pane>
              <el-tab-pane label="获取班级查询学生信息">获取班级查询学生信息</el-tab-pane>
              <el-tab-pane label="根据年级查询学生信息">根据年级查询学生信息</el-tab-pane>
              <el-tab-pane label="通过学籍编号获取学生信息">通过学籍编号获取学生信息</el-tab-pane>
            </el-tabs>
          </section>
        </el-card>
      </el-col>
    </el-row>

    <!-- 对话框 -->
    <el-dialog title="意见反馈" :visible.sync="centerDialogVisible" width="30%" center>
      <el-row class="dialog-topbox">
        <el-col :span="6">
          <h4>评论及评分</h4>
          <h2>4.5</h2>
          <span>满分为5分</span>
        </el-col>
        <el-col :span="18">
          <el-row>
            <el-col class="dialog-stars" :span="10">
              <i class="el-icon-star-on"></i>
              <i class="el-icon-star-on"></i>
              <i class="el-icon-star-on"></i>
              <i class="el-icon-star-on"></i>
              <i class="el-icon-star-on"></i>
            </el-col>
            <el-col :span="14">
              <el-progress class="dialog-line" :percentage="100" color="#909399" :show-text="false"></el-progress>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="dialog-stars" :span="10">
              <i class="el-icon-star-on"></i>
              <i class="el-icon-star-on"></i>
              <i class="el-icon-star-on"></i>
              <i class="el-icon-star-on"></i>
            </el-col>
            <el-col :span="14">
              <el-progress class="dialog-line" :percentage="80" color="#909399" :show-text="false"></el-progress>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="dialog-stars" :span="10">
              <i class="el-icon-star-on"></i>
              <i class="el-icon-star-on"></i>
              <i class="el-icon-star-on"></i>
            </el-col>
            <el-col :span="14">
              <el-progress class="dialog-line" :percentage="60" color="#909399" :show-text="false"></el-progress>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="dialog-stars" :span="10">
              <i class="el-icon-star-on"></i>
              <i class="el-icon-star-on"></i>
            </el-col>
            <el-col :span="14">
              <el-progress class="dialog-line" :percentage="40" color="#909399" :show-text="false"></el-progress>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="dialog-stars" :span="10">
              <i class="el-icon-star-on"></i>
            </el-col>
            <el-col :span="14">
              <el-progress class="dialog-line" :percentage="20" color="#909399" :show-text="false"></el-progress>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row class="dialog-middlebox" v-if="isMiddle">
        <el-col :span="12">
          <a href="javascript:;">&emsp;撰写评论</a>
        </el-col>
        <el-col :span="12">
          <span>给我打分&nbsp;&nbsp;</span>
          <el-rate v-model="submitParams.rank" class="dialog-stars"></el-rate>
        </el-col>
      </el-row>

      <section v-if="isBottom">
        <el-row class="dialog-bottombox">
          <div class="dialog-title">
            <span>&emsp;给我打分&nbsp;&nbsp;</span>
            <el-rate v-model="submitParams.rank" class="dialog-stars"></el-rate>
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
              <el-button size="small" @click="centerDialogVisible = false">取 消</el-button>
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
              <el-dropdown-item command="评分">评分</el-dropdown-item>
              <el-dropdown-item command="内容">内容</el-dropdown-item>
              <el-dropdown-item command="时间">时间</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-col v-for="(item, index) in accessList" :key="index" :span="24" class="dialog-assessbox">
            <h4>{{item.title}}</h4>
            <div class="dialog-title">
              <span>某某某 2018年12月12日</span>
              <el-rate v-model="item.rank" class="dialog-stars" disabled></el-rate>
            </div>
            <div class="dialog-message">
              <p>{{item.text}}&nbsp;</p>
            </div>
          </el-col>
          <el-col :span="24" class="dialog-links">
            <a v-show="accessList.length == 1" @click="handleMoreMsg" href="javascript:;">更多
              <i class="el-icon-arrow-down"></i>
            </a>
            <a v-show="accessList.length > 1" @click="handleLessMsg" href="javascript:;">收起
              <i class="el-icon-arrow-up"></i>
            </a>
          </el-col>
        </el-row>
      </section>
    </el-dialog>
  </div>

</template>

<script>
import * as api from "api/service/studentinfo";
export default {
  data() {
    return {
      navData: {
        wifi: 13256,
        heart: 12321,
        message: 23365,
        good: 5
      },
      value1: 3.7,
      value2: 5,
      value3: 4,
      centerDialogVisible: false,
      tabPosition: "left",
      requestTableData: [],
      responseTableData: [],
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
      isBottom: false,
      isMiddle: true,
      isP1: true,
      isP2: false,
      submitParams: {
        userId: "001",
        servId: "1",
        text: "",
        title: "",
        rank: 5
      },
      accessList: [],
      tmpMessage: []
    };
  },
  created() {
    this.getParamForms();
    this.getRelationForms();
  },
  mounted() {},
  methods: {
    handledia() {
      console.log(11);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 增加一个新的服务评价信息
          api.submitAssess(this.submitParams).then(res => {
            if (res.status === 200) {
              this.$message({
                message: res.data.message,
                type: "success"
              });
              this.centerDialogVisible = false;
            }
          });
        } else {
          this.$message.error("提交失败");
          this.centerDialogVisible = false;
          return false;
        }
      });
    },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // },
    handleCommand(command) {
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
    handleList() {
      this.centerDialogVisible = true;

      this.isBottom = true;
      this.isMiddle = false;
      // 增加一个新的服务评价信息
      api
        .getAssessList({
          servId: this.submitParams.servId
        })
        .then(res => {
          if (res.status === 200) {
            res.data.rows.forEach(item => {
              item.rank = +item.rank;
            });
            this.tmpMessage = res.data.rows;
            this.accessList = res.data.rows.slice(0, 1);
          }
        });
    },
    handleMoreMsg() {
      this.accessList = this.tmpMessage;
    },
    handleLessMsg() {
      this.accessList = this.tmpMessage.slice(0, 1);
    }
  }
};
</script>

<style lang="scss">
.container {
  padding: 4px;
  width: 100%;
  overflow-x: hidden;
  color: #303133;
  font-size: 14px;
  line-height: 24px;
  .top-nav {
    min-width: 1650px;
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
  ul li:nth-child(n + 7) {
    float: right;
  }
  ul li:nth-child(3) {
    background: url("./img/info_wifi.png") no-repeat left center;
  }
  ul li:nth-child(4) {
    background: url("./img/info_heart.png") no-repeat left center;
  }
  ul li:nth-child(5) {
    background: url("./img/info_message.png") no-repeat left center;
  }
  ul li:nth-child(6) {
    background: url("./img/info_good.png") no-repeat left center;
  }
  ul li:nth-child(7) {
    background: url("./img/info_back.png") no-repeat left center;
  }
  ul li:nth-child(8) {
    background: url("./img/info_forbidden.png") no-repeat left center;
  }
  ul li:nth-child(9) {
    background: url("./img/info_watch.png") no-repeat left center;
  }
  ul li:nth-child(10) {
    background: url("./img/info_wifi.png") no-repeat left center;
  }
  ul li:nth-child(11) {
    background: url("./img/info_edit.png") no-repeat left center;
  }
  ul li:nth-child(12) {
    background: url("./img/info_add.png") no-repeat left center;
  }
  /* 卡片 */
  .card-item {
    min-width: 500px;
    height: 408px;
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
        margin-top: 10px;
      }
    }
    .card-item-bottom {
      height: 76px;
      .el-rate {
        margin-top: 6px;
      }
      li {
        float: left;
        padding: 20px 0;
        margin-left: 14px;
        box-sizing: content-box;
        line-height: 32px;
        height: 32px;
      }
      li:first-child {
        margin-left: 10px;
      }
      li:nth-child(2) {
        padding-left: 30px;
        background: url("./img/info_wifi.png") no-repeat left center;
      }
      li:nth-child(3) {
        padding-left: 30px;
        background: url("./img/info_message.png") no-repeat left center;
      }
      li:nth-child(4) {
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
      // margin-bottom: -20000px;
      // padding-bottom: 20000px;
    }
    .right-box {
      // margin-bottom: -20000px;
      // padding-bottom: 20000px;
      height: inherit;
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
    border-bottom: 1px solid #e3e6ec;
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
  .el-button--small,
  .el-button--small.is-round {
    padding: 5px 15px;
  }
}
</style>
