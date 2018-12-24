<template>
  <!-- <el-table  :data="tableData" style="width: 100%" height="333">
        <el-table-column prop="name" label="服务名称" width="120"></el-table-column>
        <el-table-column prop="producer" label="服务提供方" width="120"></el-table-column>
        <el-table-column label="数据分类" width="120">
            <template slot-scope="scope">
                <el-tag size="small">{{scope.row.tagname}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="type" label="接口协议" width="80"></el-table-column>
        <el-table-column prop="way" label="返回模式" width="80"></el-table-column>        
        <el-table-column prop="timestamp" label="请求时间"></el-table-column>
        <el-table-column label="操作" width="100">
            <template slot-scope="scope">
                <el-button @click="showDetail(scope.row.id)" size="small" type="primary">查看</el-button>
            </template> 
        </el-table-column>
    
    </el-table> -->
  <el-col :span="24" class="review-container">
    <el-table v-loading.body="listLoading" :data="tableData">
      <el-table-column prop="servUuid" label="UID" sortable></el-table-column>
      <el-table-column prop="servName" label="服务名称" sortable></el-table-column>
      <el-table-column prop="_servType" label="服务类型" sortable></el-table-column>
      <el-table-column prop="producer" label="服务提供商" sortable>
      </el-table-column>
      <el-table-column prop="timestamp" label="申请时间" width="160px" sortable>
      </el-table-column>
      <el-table-column label="是否公开" sortable>
        <template slot-scope="scope">{{scope.row.servUseof=== '1'?'否':'是'}}</template>
      </el-table-column>
      <el-table-column prop="apiVer" label="发布版本" sortable></el-table-column>
      <el-table-column prop="servTag" label="服务分类" sortable>
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in servTagArr" v-if="scope.row.servTag == item.key" :key="index" size="small">{{item.value}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" sortable>
        <template slot-scope="scope">
          <el-tag type="success" size="small">{{scope.row.apiStatus==1?'在线':(scope.row.apiStatus==2?'暂停':'下线')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
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
    <el-dialog class="review-layer" :title="contentData.name+'新增审核'" :visible.sync="outerVisible" width="70%">
      <el-row class="layer-container">
        <el-col :span="12" class="left-box">
          <h3>基本信息</h3>
          <ol>
            <li>服务名称：{{ ckRow._servType }}</li>
            <li>服务分类：
              <el-tag v-for="(item, index) in servTagArr" v-if="ckRow.servTag == item.key" :key="index" size="small">{{item.value}}</el-tag>
            </li>
            <li>接口中文名称：{{ contentData.name }}</li>
            <li v-if="type != '3'">原始接口地址：{{ contentData.url }}</li>
            <li v-if="type != '3'">返回格式：
              <el-tag v-if="type == '2'" size="small" type="success">XML</el-tag>
              <el-tag v-else size="small" type="success">{{ contentData.resp }}</el-tag>
            </li>
            <li v-if="type == '2'">请求方式：
              <el-tag size="small">{{ contentData.method }}</el-tag>
            </li>
            <li v-if="type == '3'">返回内容：
              <span v-if="contentData.rtType == '0'">受影响记录数</span>
              <span v-if="contentData.rtType == '1'">操作状态</span>
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
          <el-button v-if="type == '2'" type="primary">XML</el-button>
          <el-button v-else type="primary">{{contentData.resp}}</el-button>
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
        <el-input type="textarea"  :autosize="{ minRows: 2, maxRows: 6 }" placeholder="请输入内容" v-model.trim="form.opinion"></el-input>

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
// import * as api from 'api/generalization/index'
// import * as dicty from 'api/dictionary'
// export default {
//     name:'SqjrlistTable',
//     data() {
//         return {
//             tableData:[],
//             servTypeList:[],

//         }
//     },
//     created(){
//         this.getBaseData()
//     },
//     mounted(){
//         this.init()

//     },
//     methods:{
//         // 获取服务分类
//         getBaseData(){
//             var query = {group:'servType'}
//             dicty.getBaseData(query).then(response => {
//                 this.servTypeList = response.data
//             });

//         },
//         // 最近10条服务发布申请记录
//         init(){
//             api.pubTop10().then(response => {
//                 this.tableData = response.data
//                 var that = this;
//                 this.tableData.forEach(function(item,index){
//                     item.tagname = '';
//                     that.servTypeList.forEach(function(obj,ind){
//                         if(item.tag == obj.key){
//                             item.tagname = obj.value
//                         }
//                     })
//                 })
//             })
//         },
//         showDetail(id) {
//             api.showServiceDetail({
//                 subId: id
//             }).then((res) => {
//                 console.log(res, 'showServiceDetail')
//             })
//         }
//     },
// }

import * as api from "api/service/management";
import * as dicty from "api/dictionary";
import VueUEditor from "vue-ueditor";
import { mapGetters } from "vuex";
export default {
  name: "checked",
  components: {
    VueUEditor
  },
  computed: {
    ...mapGetters(["servTagArr"])
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
            "forecolor",
            "|",
            "justifyleft",
            "justifycenter",
            "justifyright",
            "justifyjustify",
            "|",
            "link",
            "unlink",
            "removeformat",
            "formatmatch",
          ]
        ]
      },
      diaData: {},
      commandMsg: "选择适配器",
      selectState: false,
      listLoading: false,
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
      type: "",
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
      api.getExtensions().then(data => {
        this.extensions = data;
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
      api.getApiList(params).then(data => {
        this.listLoading = false;
        data.rows.map(item => {
          item.apiVer = "v" + item.apiVer;
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
      });
    },
    openLayerPage(row) {
      this.type = row.servType;
      this.ckRow = row;
      this.outerVisible = true;
      this.diaData = {
        servId: row.servId,
        type: row.servType,
        apiId: row.apiId
      };
      api.getApiParamForms(this.diaData).then(data => {
        data.apiVer = "v" + data.apiVer;
        switch (data.servType) {
          case "1":
            data._servType = "HTTP API";
            break;
          case "2":
            data._servType = "WebService API";
            break;
          case "3":
            data._servType = "数据源 API";
            break;
        }
        this.contentData = data;

        var uuid = row.servUuid ? row.servUuid : "";
        if (row.servType == 1) {
          //soap---http
          this.expUrl = `${this.Settings}/http/${uuid}/v${data.version}${
            data.path ? "/" + data.path : ""
          }`;
        }
        if (row.servType == 2) {
          //webservice----soap
          this.expUrl = `${this.Settings}/soap/${uuid}/${data.method}_v${
            data.version
          }`;
        }
        if (row.servType == 3) {
          //数据源-----dataset
          this.expUrl = `${this.Settings}/dataset/${uuid}/v${data.version}${
            data.path ? "/" + data.path : ""
          }`;
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

    // // 富文本编辑器
    // editorReady(editorInstance) {
    //   editorInstance.addListener("contentChange", () => {
    //     // this.editableTabs[this.curEditTabs].intro = editorInstance.getContent();
    //     // console.log(editorInstance.getContent().replace(/<[^<]+>/g, ''))
    //   });
    // },
    // 获取服务分类
    getBaseData() {
      // 访问前缀
      dicty.getSettings().then(data => {
        this.Settings = data.servUrl;
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
        .then(data => {
          if (data.status == "success") {
            // this.$notify({
            //   title: "成功",
            //   message: "审核通过",
            //   type: "success",
            //   duration: 2000
            // });
            this.$message({
              type: "success",
              message: res.message
            });
            this.outerVisible = false;
            this.innerVisible = false;
            this.innerAnotherVisible = false;
            this.listQuery.pageNo = "1";
            this.getReviewList();
            this.$store.dispatch("getNoticeNumber");
          } else {
            this.$message.error(res.message);
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
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
    max-height: 700px;
    overflow: auto;
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
  .el-dialog__body {
    padding: 10px 20px 30px;
  }
  .right-box {
    padding: 20px;
    h3 {
      padding: 20px 0;
    }
    height: inherit;
    line-height: 1.4em;
    background-color: #e3e6ec;
  }
  .left-box {
    padding: 20px;
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

