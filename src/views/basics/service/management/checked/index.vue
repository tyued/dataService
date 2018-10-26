<template>
  <el-col :span="24" class="review-container">
    <el-table v-loading.body="listLoading" :data="tableData">
      <el-table-column prop="servUuid" label="UID" sortable></el-table-column>
      <el-table-column prop="servName" label="服务名称"></el-table-column>
      <el-table-column prop="_servType" label="服务类型"></el-table-column>
      <el-table-column prop="producer" label="服务提供商">
      </el-table-column>
      <el-table-column prop="timestamp" label="申请时间" width="160px">
      </el-table-column>
      <el-table-column label="是否公开">
        <template slot-scope="scope">{{scope.row.servUseof=== '1'?'否':'是'}}</template>
      </el-table-column>
      <el-table-column prop="apiVer" label="发布版本"></el-table-column>
      <el-table-column prop="servTag" label="服务分类">
        <template slot-scope="scope">
          <el-tag size="small">{{scope.row.servTag}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" size="small">{{scope.row.apiStatus==1?'在线':(scope.row.apiStatus==2?'暂停':'下线')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="openLayerPage(scope.row)">查看</el-button>
          <!--<el-button size="small" type="primary" @click="openLayerPage(scope.row.servId,scope.row.servType,scope.row.apiId,scope.row.servTag,scope.row._servType)">查看</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-row class="change-page">
      <el-pagination class="pagebox" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="totalItem">
      </el-pagination>
    </el-row>
    <!-- 审核弹出层 -->
    <el-dialog class="review-layer" :title="contentData.name+'新增审核'" :visible.sync="outerVisible" width="1000px">
      <el-row class="layer-container">
        <el-col :span="12" class="left-box">
          <h3>基本信息</h3>
          <ol>
            <li>服务名称：{{ ckRow._servType }}</li>
            <li>服务分类：
              <el-tag size="small">{{ckRow.servTag}}</el-tag>
            </li>
            <li>接口中文名称：{{ contentData.name }}</li>
            <li>接口地址：{{ contentData.url }}</li>
            <li>返回格式：
              <el-tag size="small" type="success">{{ contentData.resp }}</el-tag>
            </li>
            <li>请求方式：
              <el-tag size="small">{{ contentData.method }}</el-tag>
            </li>
            <li>请求示例：{{expUrl}}</li>
            <li>接口备注：<span v-html="contentData.intro"></span></li>
          </ol>
          <h3>参数说明</h3>
          <el-tabs type="border-card">
            <el-tab-pane label="输入参数">
              <template>
                <el-table :data="contentData.params" height="200">
                  <el-table-column prop="name" label="名称"></el-table-column>
                  <el-table-column label="必填">
                    <template slot-scope="scope">
                      {{scope.row.required=='1'?'是':'否'}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="类型"></el-table-column>
                  <el-table-column prop="desc" label="说明" width="150"></el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
            <el-tab-pane label="返回参数">
              <template>
                <el-table :data="contentData.responses" height="200">
                  <el-table-column prop="name" label="名称"></el-table-column>
                  <el-table-column prop="key" label="类型"></el-table-column>
                  <el-table-column prop="desc" label="说明" width="150"></el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
            <el-tab-pane label="错误代码">
              <template>
                <el-table :data="contentData.errors" style="width: 100%" height="200">
                  <el-table-column prop="code" label="错误码"></el-table-column>
                  <el-table-column prop="text" label="说明" width="200"></el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="12" class="right-box">
          <el-button type="primary">{{contentData.resp}}</el-button>
          <h3>返回示例</h3>
          <pre>{{ contentData.example }}</pre>
        </el-col>
      </el-row>
      <!-- 审核通过弹出层 -->
      <el-dialog class="review-complete-layer" title="审核即将完成发布" width="400px" :visible.sync="innerVisible" append-to-body>
        <el-row>
          <el-col :span="11" class="dialog-innertext">对相应结果非对称加密</el-col>
          <el-col :span="12" :offset="1">
            <el-switch v-model="form.encryptObj" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" class="dialog-innertext">是否需要格式转换</el-col>
          <el-col :span="12" :offset="1">
            <el-switch @change="handleSwitch2" v-model="form.translateObj" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" class="dialog-innertext">请选择格式转换的适配器</el-col>
          <el-col :span="12" :offset="1">
            <el-select v-model="form.extensel" :placeholder="selectState?'空':'请选择'">
              <el-option :disabled="selectState" v-for="(item,index) in extensions" :key="index" :label="item.pluginName+'('+item.extensionName+')'" :value="item.pluginId+':-'+item.extensionId">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="layer-innerbtns">
          <!--<el-button type="primary" @click="outerVisible = false; innerVisible = false">通 过</el-button> -->
          <el-button type="primary" @click="handerReviewReq('adopt')">通 过</el-button>
          <el-button @click="innerVisible = false">取 消</el-button>
        </el-row>
      </el-dialog>
      <!-- 驳回弹出层 -->
      <el-dialog class="review-complete-layer" title="驳回申请" width="400px" :visible.sync="innerAnotherVisible" append-to-body>
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.opinion"></el-input>

        <!-- <VueUEditor :ueditorConfig='editorConfig' @ready="editorReady"></VueUEditor> -->

        <el-row class="layer-innerbtns">
          <el-button type="primary" @click="handerReviewReq('reject')">驳 回</el-button>
          <!--<el-button type="danger" @click="outerVisible = false; innerAnotherVisible = false">驳 回</el-button> -->
          <el-button @click="innerAnotherVisible = false">取 消</el-button>
        </el-row>
      </el-dialog>
      <el-row class="layer-btns">
        <el-button type="primary" @click="handerReviewVia">审核通过</el-button>
        <el-button type="danger" @click="innerAnotherVisible = true">驳 回</el-button>
      </el-row>
    </el-dialog>
  </el-col>
</template>

<script>
import * as api from "api/service/management";
import * as dicty from "api/dictionary";
import VueUEditor from "vue-ueditor";
export default {
  name: "checked",
  components: {
    VueUEditor
  },
  data() {
    return {
      editorConfig: {
        //富文本框基础设定
        toolbars: [
          [
            "bold",
            "italic",
            "underline",
            "|",
            "justifyleft",
            "justifycenter",
            "justifyright",
            "justifyjustify",
            "|"
          ]
        ]
      },
      diaData: {},
      commandMsg: "选择适配器",
      selectState: false,
      listLoading: true,
      isActiveBtn1: true,
      isActiveBtn2: false,
      currentPage: 1,
      totalItem: 0,
      innerAnotherVisible: false,
      outerVisible: false,
      innerVisible: false,
      listQuery: {
        pageNo: "1",
        limit: "10",
        pubStatus: "0", // 0:待审核|1:审核通过|2:审核不通过
        sortOrder: "desc"
      },
      total: null,
      tableData: [],
      requestData: [], // 弹出层表格数据
      responseData: [],
      errorData: [],
      contentData: "",
      ckRow: "", // 查看数据
      Settings: "",
      expUrl: "", //接口示例
      extensions: [], //格式转换的适配器
      form: {
        //审核操作
        encryptObj: true,
        translateObj: true,
        extensel: ""
      }
    };
  },
  created() {
    this.getBaseData();
    this.init();
  },
  methods: {
    init() {
      // this.listLoading = false;
      this.getReviewList();
      api.getExtensions().then(res => {
        this.extensions = res.data;
      });
    },
    //分页
    handleSizeChange(val) {
      this.currentPage = 1;
      this.getReviewList({
        limit: val,
        pageNo: "1",
        pubStatus: "0",
        sortOrder: "desc"
      });
    },
    handleCurrentChange(val) {
      this.getReviewList({
        limit: "10",
        pageNo: val,
        pubStatus: "0",
        sortOrder: "desc"
      });
    },
    getReviewList(params = this.listQuery) {
      api.getApiList(params).then(res => {
        const { status, statusText, data } = res;
        if (status === 200 && statusText === "OK") {
          this.listLoading = false;
          data.rows.map(item => {
            switch (item.servType) {
              case "1":
                item._servType = "HTTP API";
                break;
              case "2":
                item._servType = "WebService API";
                break;
              case "3":
                item._servType = "数据源 API";
                break;
            }

            return item;
          });
          this.tableData = data.rows;
          this.totalItem = data.total;
        }
      });
    },
    openLayerPage(row) {
      this.ckRow = row;
      this.outerVisible = true;
      this.diaData = {
        servId: row.servId,
        type: row.servType,
        apiId: row.apiId
      };
      api.getApiParamForms(this.diaData).then(res => {
        const { status, statusText, data } = res;
        this.contentData = data;

        var uuid = row.servUuid ? row.servUuid : "";
        var reg = new RegExp("\\.", "g");
        var apiVer = row.apiVer.replace(reg, "_");
        if (row.servType == 1) {
          //soap---http
          this.expUrl =
            this.Settings + "/rest/" + uuid + "/" + data.ename + "/V" + apiVer;
        }
        if (row.servType == 2) {
          //webservice----soap
          this.expUrl =
            this.Settings + "/soap/" + uuid + "/" + data.method + "_V" + apiVer;
        }
        if (row.servType == 3) {
          //数据源-----rest
          this.expUrl =
            this.Settings + "/rest/" + uuid + "/" + data.ename + "/V" + apiVer;
        }
        if (row.servType == 4) {
          //第三方
          this.expUrl = this.Settings + "/rest/" + data.ename;
        }
      });
    },
    handleSwitch2(val) {
      if (val === false) {
        this.selectState = true;
        this.form.extensel = "";
      } else if (val === true) {
        this.selectState = false;
        this.form.extensel = "";
      }
    },

    // 富文本编辑器
    editorReady(editorInstance) {
      editorInstance.addListener("contentChange", () => {
        // this.editableTabs[this.curEditTabs].intro = editorInstance.getContent();
        // console.log(editorInstance.getContent().replace(/<[^<]+>/g, ''))
      });
    },
    // 获取服务分类
    getBaseData() {
      // 访问前缀
      dicty.getSettings().then(response => {
        this.Settings = response.data.servUrl;
      });
    },
    // 审核通过按钮
    handerReviewVia() {
      this.innerVisible = true;
    },
    // 审核通过按钮--(审核即将完成发布)
    handerReviewReq(val) {
      if (val == "adopt") {
        //通过
        this.form.pubStatus = "1"; //已通过
        this.form.opinion = "";
      } else if (val == "reject") {
        //驳回
        this.form.pubStatus = "2"; //已驳回
      }
      this.form.apiId = this.ckRow.apiId;
      this.form.encrypt = this.form.encryptObj ? "1" : "0";
      var extenselId = this.form.extensel.split(":-");
      this.form.extensionId = extenselId[1] || "";
      this.form.pluginId = extenselId[0] || "";
      this.form.pubId = this.ckRow.pubId;
      this.form.servId = this.ckRow.servId;
      this.form.translate = this.form.translateObj ? "1" : "0";

      this.form.servUseof = this.ckRow.servUseof;
      var that = this;
      api
        .checkPublishRequest({
          apiId: this.form.apiId,
          encrypt: this.form.encrypt,
          extensionId: this.form.extensionId,
          opinion: this.form.opinion,
          pluginId: this.form.pluginId,
          pubId: this.form.pubId,
          pubStatus: this.form.pubStatus,
          servId: this.form.servId,
          translate: this.form.translate
        })
        .then(res => {
          if (res.data.status == "success") {
            this.$notify({
              title: "成功",
              message: "审核通过",
              type: "success",
              duration: 2000
            });
            this.outerVisible = false;
            this.innerVisible = false;
            this.innerAnotherVisible = false;
            this.listQuery.pageNo = "1";
            this.getReviewList();
            this.$store.dispatch("getNoticeNumber");
          } else {
            this.$notify({
              title: "失败",
              message: res.message,
              type: "error",
              duration: 2000
            });
          }
        });
      // console.log(this.ckRow)
      // // console.log(this.diaData)
      // console.log(this.form)
    }
  }
};
</script>

<style lang="scss" scope>
.el-tabs--border-card {
  margin-top: 10px;
}
// 分页样式
.change-page {
  overflow: hidden;
}
.pagebox {
  // float: right;
  margin-top: 10px;
}
.el-input__icon {
  line-height: inherit;
}

// 审核弹出层样式
.review-layer {
  .layer-container {
    overflow: hidden;
  }
  .activeBtn {
    background-color: #449afc;
    color: #fff;
  }
  .layer-btns {
    margin-top: 10px;
    overflow: hidden;
    text-align: center;
  }

  .el-dialog {
    overflow: hidden;
  }
  .el-dialog__header {
    // display: none;
  }
  .el-dialog__body {
    padding: 10px 20px 30px;
  }
  height: auto;
  .right-box {
    padding: 20px;

    // margin-bottom: -20000px;
    // padding-bottom: 20000px;
    h3 {
      padding: 20px 0;
    }
    height: inherit;
    line-height: 1.4em;
    background-color: #e3e6ec;
  }
  .left-box {
    padding: 20px;

    // margin-bottom: -20000px;
    // padding-bottom: 20000px;
    h2 {
      padding-bottom: 20px;
      text-align: center;
    }
    h3 {
      padding: 0 0 10px;
    }
    ol {
      padding: 0 10px 10px;
      line-height: 2.6em;
      li {
        word-wrap: break-word;
      }
    }
  }
}

// 内部弹层
.review-complete-layer {
  line-height: 3em;
  .el-dialog__header {
    text-align: center;
  }
  .dialog-innertext {
    text-align: right;
  }
  .layer-selectbox {
    line-height: 2.4em;
    padding: 0 10px;
    border: 1px solid #eee;
    cursor: pointer;
  }
  .el-dialog__body {
    padding: 10px 10px 20px 10px;
  }
  .layer-innerbtns {
    margin-top: 30px;
    overflow: hidden;
    text-align: center;
  }
}
</style>

