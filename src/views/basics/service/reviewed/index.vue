<template>
  <el-col :span="24" class="review-container">
    <el-card class="box-card">
      <!--<el-button icon="el-icon-tickets">筛选</el-button>-->
      <el-table v-loading.body="listLoading" :data="tableData" height="620px">
        <el-table-column prop="servName" label="接口名称"></el-table-column>
        <el-table-column prop="_servType" label="所属服务"></el-table-column>
        <el-table-column label="是否公开">
          <template slot-scope="scope">{{scope.row.servUseof==1?'否':'是'}}</template>
        </el-table-column>
        <el-table-column prop="apiVer" label="版本"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">           
            <el-tag type="success">{{scope.row.apiStatus==1?'在线':(scope.row.apiStatus==2?'暂停':'下线')}}</el-tag> 
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
    </el-card>
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
            <li>接口备注：{{ contentData.intro }}</li>
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
            <el-switch @change="handleSwitch1" v-model="value1" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" class="dialog-innertext">是否需要格式转换</el-col>
          <el-col :span="12" :offset="1">
            <el-switch @change="handleSwitch2" v-model="value2" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" class="dialog-innertext">请选择格式转换的适配器</el-col>
          <el-col :span="12" :offset="1">
            <el-dropdown class="layer-selectbox" trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                {{ commandMsg }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="selectState" command="ComboBox1">ComboBox1</el-dropdown-item>
                <el-dropdown-item :disabled="selectState" command="ComboBox2">ComboBox2</el-dropdown-item>
                <el-dropdown-item :disabled="selectState" command="ComboBox3">ComboBox3</el-dropdown-item>
                <el-dropdown-item :disabled="selectState" command="ComboBox4">ComboBox4</el-dropdown-item>
                <el-dropdown-item :disabled="selectState" command="ComboBox5">ComboBox5</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
        <el-row class="layer-innerbtns">
          <el-button type="primary" @click="outerVisible = false; innerVisible = false">通 过</el-button>
          <el-button @click="innerVisible = false">取 消</el-button>
        </el-row>
      </el-dialog>
      <!-- 驳回弹出层 -->
      <el-dialog class="review-complete-layer" title="驳回申请" width="400px" :visible.sync="innerAnotherVisible" append-to-body>

        <VueUEditor :ueditorConfig='editorConfig' @ready="editorReady"></VueUEditor>

        <el-row class="layer-innerbtns">
          <el-button type="danger" @click="outerVisible = false; innerAnotherVisible = false">驳 回</el-button>
          <el-button @click="innerAnotherVisible = false">取 消</el-button>
        </el-row>
      </el-dialog>
      <el-row class="layer-btns">
        <el-button type="primary" @click="innerVisible = true">审核通过</el-button>
        <el-button type="danger" @click="innerAnotherVisible = true">驳 回</el-button>
      </el-row>
    </el-dialog>
  </el-col>
</template>

<script>
import * as api from "api/service/reviewed";
import * as apiRet from "api/service/management";
import * as dicty from 'api/dictionary';
import VueUEditor from "vue-ueditor";
export default {
  name: "pageReviewed",
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
      value1: true,
      value2: true,
      listQuery: {
        pageNo: "1",
        limit: "10",
        pubStatus: "0",
        sortOrder: "desc"
      },
      total: null,
      tableData: [],
      requestData: [], // 弹出层表格数据
      responseData: [],
      errorData: [],
      contentData: "",
      ckRow:'',      // 查看数据
      Settings:'',
      expUrl:'',      //接口示例
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
      apiRet.getApiList(params).then(res => {
        const { status, statusText, data } = res;
        if (status === 200 && statusText === "OK") {
          this.listLoading = false;
          data.rows.map(item => {
            switch (item.servType) {
              case "1":
                item._servType = "Rest服务";
                break;
              case "2":
                item._servType = "Soap服务";
                break;
              case "3":
                item._servType = "数据源服务";
                break;
              case "4":
                item._servType = "OSGi规范服务";
                break;
            }
            return item;
          });
          this.tableData = data.rows;
          this.totalItem = data.total;
        }
      });
    },
    openLayerPage(row){
      this.ckRow = row

      console.log(row)   
      this.outerVisible = true;
      var diaData={
        servId:row.servId,
        type:row.servType,
        apiId:row.apiId
      }
      api.getApiParamForms(diaData).then(res => {
          const { status, statusText, data } = res;
          this.contentData = data;
              
          var uuid = row.servUuid?row.servUuid:''
          if(row.servType==1){      //soap---http   
            this.expUrl = this.Settings+'/rest/'+uuid+'/'+data.ename+'/V'+row.apiVer
          }
          if(row.servType==2){      //webservice----soap
            this.expUrl = this.Settings+'/soap/'+uuid+'/'+data.method+'_V'+row.apiVer
          }
          if(row.servType==3){      //数据源-----rest
            this.expUrl = this.Settings+'/rest/'+uuid+'/'+data.ename+'/V'+row.apiVer
          }
          if(row.servType==4){      //第三方
            this.expUrl = this.Settings+'/rest/'+data.ename
          }

          console.log(this.expUrl)


          console.log(this.contentData)         
        });
    },
    handleSwitch1() {

    },
    handleSwitch2() {
      if (this.value2 === false) {
        this.selectState = true;
        this.commandMsg = "无";
      } else if (this.value2 === true) {
        this.selectState = false;
        this.commandMsg = '请选择适配器'
      }
    },
    handleCommand(item) {
      this.commandMsg = item;
    },
    // 富文本编辑器
    editorReady(editorInstance) {
      editorInstance.addListener("contentChange", () => {
        // this.editableTabs[this.curEditTabs].intro = editorInstance.getContent();
        console.log(editorInstance.getContent().replace(/<[^<]+>/g, ''))
      });
    },
    // 获取服务分类
    getBaseData(){
        // 访问前缀
        dicty.getSettings().then(response => {
            this.Settings = response.data.servUrl
        }); 
        
    },
  }
};
</script>

<style lang="scss" scope>
.el-tabs--border-card{ margin-top:10px;}
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
  .el-dialog__body{
    padding:10px 20px 30px;
  }
  height: auto;
  .right-box {
    padding: 20px;

    margin-bottom: -20000px;
    padding-bottom: 20000px;
    h3 {
      padding: 20px 0;
    }
    height: inherit;
    line-height: 1.4em;
    background-color: #e3e6ec;
  }
  .left-box {
    padding: 20px;

    margin-bottom: -20000px;
    padding-bottom: 20000px;
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
      li{
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

