<template>
  <div class="container"  v-loading.body="listLoading">
    <h1>{{infoData.name}}</h1>
    <el-row class="top-nav">
      <el-col :span="24">
        <ul>
          <li>&emsp;服务商：<a href="javascript:;">天音智慧校园</a></li>
          <li>分&emsp;类:&nbsp;
            <el-tag type="success">{{infoData.tagname}}</el-tag> 
          </li>
          <li>123456</li>
          <li>123456</li>
          <li>123456</li>
          <li><el-rate v-model="valRate" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></li>
          <li>返回</li>
          <li>禁用/发布</li>
          <li>监控</a></li>
          <li>&nbsp;订阅/取消</li>
          <li @click="handleList">意见反馈</li>
          <li>加入收藏</li>
        </ul>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="15">
        <el-card shadow="always" class="card-item">
          <h5>服务简介</h5>
          <section>{{infoData.detail}}</section>
        </el-card>
      </el-col>
      <el-col :span="9">
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
            <div class="card-item-bottom">
              <li>天音智慧教育</li>
              <li>123456</li>
              <li>123456</li>
              <li><el-rate v-model="value2" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></li>
            </div>
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
                <el-row :gutter="12" v-if='tabPosition=="left"'>
                  <el-col :span="12" class="left-box">
                    <h5>基本信息</h5>
                    <ol>
                      <li>接口地址：{{item.url}}</li>
                      <li>返回格式：<el-tag>{{item.resp?item.resp:(type==2?'XML':'空')}}</el-tag></li>
                      <li>请求方式：<el-tag>{{item.method}}</el-tag></li>
                      <li>请求示例：{{item.example}}</li>
                      <li>接口备注：{{item.intro}}</li>
                    </ol>
                    <h5>请求参数说明</h5>
                    <el-tabs type="border-card">
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
                    <h5 >&emsp;{{item.resp?item.resp:(type==2?'XML':'空')}}返回示例</h5>
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
    <el-dialog title="意见反馈" :visible.sync="centerDialogVisible" width="450px" center>
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
              <el-dropdown-item command="最有帮助">按最有帮助排序</el-dropdown-item>
              <el-dropdown-item command="最高评价">按最高评价排序</el-dropdown-item>
              <el-dropdown-item command="最低评价">按最低评价排序</el-dropdown-item>
              <el-dropdown-item command="最新评价">按最新评价排序</el-dropdown-item>
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
import * as api from 'api/service/studentinfo/index';
import * as dicty from 'api/dictionary';
export default {
  data() {
    return {
      listLoading: true,
      type:'',                //1. HTTP API(rest)  2. WebService API   3.  通过数据源发布
      servId:'',
      detail:true,
      DetailQuery:{
          detail: true
      },
      infoData:[],            //详细信息
      servTypeList:[],        //服务分类
      valRate: 0,             //评分
      tabPosition: "left",
      apisList:[],            //接口详情
      enjoyList:[],           //猜你喜欢的
      ErrorCode:[],           //服务错误对照信息



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
    this.type =  this.$route.query.type
    this.servId =  this.$route.query.servId
    this.DetailQuery.servId = this.servId
    this.getBaseData()
    this.getErrorCode()





    this.getParamForms();
    this.getRelationForms();
  },
  mounted() {
    this.init()  

  },
  methods: {
    // 获取服务分类
    getBaseData(){
        var query = {group:'servType'}
        dicty.getBaseData(query).then(response => {
            this.servTypeList = response.data
        });         
        
    },
    init(){
        if(this.type=='1'){                 //HTTP API(rest)
            api.getRest(this.DetailQuery).then(response => {
                this.infoData = response.data
                this.apisList = response.data.apis
                this.infoData.tagname = ''
                var that = this
                this.servTypeList.forEach(function(item,index){
                    if(that.infoData.tag == item.key){
                        that.infoData.tagname = item.value    
                    }
                })
                this.infoData.tagname = this.infoData.tagname ? this.infoData.tagname : '其他'
                this.listLoading = false               
                this.getEnjoyList()
            });         
        }
        if(this.type=='2'){                 //WebService API(soap)
            api.getSoap(this.DetailQuery).then(response => {
              
                this.infoData = response.data
                this.apisList = response.data.apis
                this.infoData.tagname = ''
                var that = this
                this.servTypeList.forEach(function(item,index){
                    if(that.infoData.tag == item.key){
                        that.infoData.tagname = item.value    
                    }
                })
                this.infoData.tagname = this.infoData.tagname ? this.infoData.tagname : '其他'
                this.listLoading = false
                            
                this.getEnjoyList()

            });         
        }
    },
    // 猜你喜欢的
    getEnjoyList(){
      var query={tag:this.infoData.tag}
      api.getEnjoy(query).then(response => {
        this.enjoyList = response.data
      });         

    },
    //服务错误对照信息
    getErrorCode(){
      api.getErrorCode().then(response => {
        this.ErrorCode = response.data
      }); 
    },
    // 猜你喜欢的查看
    toStudentInfo (type,id) {
        this.$router.push({ path: '/service/studentinfo', query: { type:type,servId:id} });
    },









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

<style scoped lang="scss">
// .container .box-card .el-col{height: 290px;}
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
    float: right; cursor:pointer;
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
    min-width: 530px;
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
      min-height: 520px;
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
