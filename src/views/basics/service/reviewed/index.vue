<template>
    <el-col :span="24" class="review-container">
        <el-card class="box-card">
        <el-button icon="el-icon-tickets">筛选</el-button>
        <el-table v-loading.body="listLoading" :data="tableData" style="width: 100%; height: 580px; overflow-y: auto">
            <el-table-column prop="name" label="接口名称"></el-table-column>
            <el-table-column prop="belong" label="所属服务"></el-table-column>
            <el-table-column prop="type" label="是否公开"></el-table-column>
            <el-table-column prop="useof" label="版本"></el-table-column>
            <el-table-column label="状态">
            <template slot-scope="scope">
                <el-button v-if="scope.row.status == 1" size="mini" type="warning" plain>新建</el-button>
                <el-button v-if="scope.row.status == 2" size="mini" type="success" plain>更新</el-button>
                <el-button v-if="scope.row.status == 0" size="mini" type="danger" plain>已禁用</el-button>
            </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
            <template slot-scope="scope">
                <el-button size="small" type="primary" @click="openLayerPage">查看</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-row class="change-page">
            <el-pagination class="pagebox" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="totalItem">
            </el-pagination>
        </el-row>
        </el-card>
        <!-- 审核弹出层 -->
        <el-dialog class="review-layer" :visible.sync="outerVisible" width="80%">
        <el-row class="layer-container">
            <el-col :span="12" class="left-box">
            <h2>根据身份证号码查询学籍号接口的新增审核</h2>
            <h3>基本信息</h3>
            <ol>
                <li>服务名称：学生基本信息查询</li>
                <li>服务分类：
                <el-button type="primary" plain size="mini">信息查询</el-button>
                </li>
                <li>接口中文名称：queryStudentStatusNumber</li>
                <li>接口地址：http://www.91118.com/api/test</li>
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
            <h3>请求参数说明</h3>
            <el-tabs type="border-card">
                <el-tab-pane label="输入参数">
                <template>
                    <el-table :data="requestInputData" style="width: 100%;" height="200">
                    <el-table-column prop="key" label="名称">
                    </el-table-column>
                    <el-table-column prop="require" label="必填">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                    </el-table-column>
                    <el-table-column prop="desc" label="说明" width="300">
                    </el-table-column>
                    </el-table>
                </template>
                </el-tab-pane>
                <el-tab-pane label="输出参数">
                <template>
                    <el-table :data="requestOutputData" style="width: 100%" height="200">
                    <el-table-column prop="key" label="名称">
                    </el-table-column>
                    <el-table-column prop="require" label="必填">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                    </el-table-column>
                    <el-table-column prop="desc" label="说明" width="300">
                    </el-table-column>
                    </el-table>
                </template>
                </el-tab-pane>
                <el-tab-pane label="错误代码">
                <template>
                    <el-table :data="requestErrorData" style="width: 100%" height="200">
                    <el-table-column prop="key" label="名称">
                    </el-table-column>
                    <el-table-column prop="require" label="必填">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                    </el-table-column>
                    <el-table-column prop="desc" label="说明" width="300">
                    </el-table-column>
                    </el-table>
                </template>
                </el-tab-pane>

            </el-tabs>
            <h3>返回参数说明</h3>
            <el-tabs type="border-card">
                <el-tab-pane label="输入参数">
                <template>
                    <el-table :data="responseInputData" style="width: 100%" height="200">
                    <el-table-column prop="key" label="名称">
                    </el-table-column>
                    <el-table-column prop="require" label="必填">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                    </el-table-column>
                    <el-table-column prop="desc" label="说明" width="300">
                    </el-table-column>
                    </el-table>
                </template>
                </el-tab-pane>
                <el-tab-pane label="输出参数">
                <template>
                    <el-table :data="responseOutputData" style="width: 100%" height="200">
                    <el-table-column prop="key" label="名称">
                    </el-table-column>
                    <el-table-column prop="require" label="必填">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                    </el-table-column>
                    <el-table-column prop="desc" label="说明" width="300">
                    </el-table-column>
                    </el-table>
                </template>
                </el-tab-pane>
                <el-tab-pane label="错误代码">
                <template>
                    <el-table :data="responseErrorData" style="width: 100%" height="200">
                    <el-table-column prop="key" label="名称">
                    </el-table-column>
                    <el-table-column prop="require" label="必填">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                    </el-table-column>
                    <el-table-column prop="desc" label="说明" width="300">
                    </el-table-column>
                    </el-table>
                </template>
                </el-tab-pane>

            </el-tabs>
            </el-col>
            <el-col :span="12" class="right-box">
            <el-button :class="{activeBtn: isActiveBtn1}" @click="isActiveBtn1 = true; isActiveBtn2 = false">JSON</el-button>
            <el-button :class="{activeBtn: isActiveBtn2}" @click="isActiveBtn2 = true; isActiveBtn1 = false">XML</el-button>
            <h3>返回示例</h3>
            <pre>
            {
                "error_code":0,
                "resultcode":"200",
                "reason":"成功的返回",
                "result":{
                    "BJ":{
                        "province":"北京",
                        "citys":[
                            {
                                "city_name":"北京",
                                "city_code":"BJ",
                                "abbr":"京",
                                "engine":"1",
                                "engineno":"0",
                                "class":"0",
                                "classno":"0",
                                "regist":"0",
                                "registno":"0"
                            }
                        ]
                    },
                    "SH":{
                        "province":"上海",
                        "citys":[
                            {
                                "city_name":"上海",
                                "city_code":"SH",
                                "abbr":"沪",
                                "engine":"1",
                                "engineno":"0",
                                "class":"0",
                                "classno":"0",
                                "regist":"0",
                                "registno":"0"
                            }
                        ]
                    }
                }
            }
            </pre>
            </el-col>
        </el-row>
        <!-- 审核通过弹出层 -->
        <el-dialog class="review-complete-layer" title="审核即将完成发布" width="400px" :visible.sync="innerVisible" append-to-body>
            <el-row>
            <el-col :span="11" class="dialog-innertext">对相应结果非对称加密</el-col>
            <el-col :span="12" :offset="1">
                <el-switch v-model="value1" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-col>
            </el-row>
            <el-row>
            <el-col :span="11" class="dialog-innertext">是否需要格式转换</el-col>
            <el-col :span="12" :offset="1">
                <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-col>
            </el-row>
            <el-row>
            <el-col :span="11" class="dialog-innertext">请选择格式转换的适配器</el-col>
            <el-col :span="12" :offset="1">
                <el-dropdown class="layer-selectbox" trigger="click">
                <span class="el-dropdown-link">
                    ComboBox
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>ComboBox</el-dropdown-item>
                    <el-dropdown-item>ComboBox</el-dropdown-item>
                    <el-dropdown-item>ComboBox</el-dropdown-item>
                    <el-dropdown-item>ComboBox</el-dropdown-item>
                    <el-dropdown-item>ComboBox</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
            </el-col>
            </el-row>
            <el-row class="layer-innerbtns">
            <el-button type="primary" @click="outerVisible = false; innerVisible = false">通 过</el-button>
            <el-button @click="innerVisible = false">取 消</el-button>
            </el-row>
        </el-dialog>

        <el-row class="layer-btns">
            <el-button type="primary" @click="innerVisible = true">审核通过</el-button>
            <el-button type="danger" @click="outerVisible = false">驳 回</el-button>
        </el-row>
        </el-dialog>
    </el-col>
</template>

<script>
import * as api from "api/service/reviewed";
export default {
  name: "pageReviewed",
  data() {
    return {
      isActiveBtn1: true,
      isActiveBtn2: false,
      currentPage: 1,
      totalItem: 0,
      outerVisible: false,
      innerVisible: false,
      value1: true,
      value2: true,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined
      },
      total: null,
      tableData: [
        {
          date: "学生信息查询",
          name: "天音智慧校园",
          sfgk: "是",
          bb: "V1.1",
          zht: "更新",
          zhtgs: "success"
        },
        {
          date: "学生信息查询",
          name: "天音智慧校园",
          sfgk: "是",
          bb: "V1.1",
          zht: "新增",
          zhtgs: "warning"
        },
        {
          date: "学生信息查询",
          name: "天音智慧校园",
          sfgk: "是",
          bb: "V1.1",
          zht: "禁用",
          zhtgs: "danger"
        },
        {
          date: "学生信息查询",
          name: "天音智慧校园",
          sfgk: "是",
          bb: "V1.1",
          zht: "更新",
          zhtgs: "success"
        },
        {
          date: "学生信息查询",
          name: "天音智慧校园",
          sfgk: "是",
          bb: "V1.1",
          zht: "更新",
          zhtgs: "success"
        }
      ],
      requestInputData: [], // 弹出层表格数据
      requestOutputData: [],
      requestErrorData: [],
      responseInputData: [],
      responseOutputData: [],
      responseErrorData: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.listLoading = false;
      this.getSubscribeList(this.listQuery);
    },
    //分页
    handleSizeChange(val) {
      this.currentPage = 1;
      this.getSubscribeList({
        limit: val,
        pageNo: "1"
      });
    },
    handleCurrentChange(val) {
      this.getSubscribeList({
        limit: "10",
        pageNo: val
      });
    },
    // handleClose1(done) {
    //   this.$confirm("确认关闭？")
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // },
    // handleClose2() {
    //     this.$confirm("确认关闭？")
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // }
    getSubscribeList(params) {
      api.getSubscribeList(params).then(res => {
        const { status, statusText, data } = res;
        if (status === 200 && statusText === "OK") {
          data.rows.map(item => {
            switch (item.belong) {
              case "1":
                item.belong = "数据源服务";
                break;
              case "2":
                item.belong = "Soap服务";
                break;
              case "3":
                item.belong = "Rest服务";
                break;
              case "4":
                item.belong = "OSGi规范服务";
                break;
            }
            item.type = item.type === "1" ? "是" : "否";
            return item;
          });
          this.tableData = data.rows;
          this.totalItem = data.total;
        }
      });
    },
    openLayerPage() {
      this.outerVisible = true;
      api.getParamForms().then(res => {
        const { status, statusText, data } = res;
        if (status === 200 && statusText === "OK") {
          res.data.map(item => {
            item.require = "是";
            item.type = "String";
            return item;
          });
          this.requestInputData = res.data;
          this.responseInputData = res.data;
        }
      });
    }
  }
};
</script>

<style lang="scss">
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
    display: none;
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
      padding: 10px 0;
    }
    ol {
      padding: 0 10px;
      line-height: 2.6em;
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

