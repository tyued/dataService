import * as api from "api/service/management";
import * as dicty from "api/dictionary";
import VueUEditor from "vue-ueditor";
import {
  mapGetters
} from "vuex";
import PageBar from "components/PageBar/index";


var expSoap1 =
  '<?xml version="1.0" encoding="utf-8"?>' +
  '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
  "<soap:Body>" +
  '<[method]Response xmlns="http://WebXml.com.cn/">' +
  "<[method]Result>" +
  "<string>string</string>" +
  "<string>string</string>" +
  "</[method]Result>" +
  "</[method]Response>" +
  "</soap:Body>" +
  "</soap:Envelope>";
var expSoap2 =
  '<?xml version="1.0" encoding="utf-8"?>' +
  '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
  "<soap12:Body>" +
  '<[method]Response xmlns="http://WebXml.com.cn/">' +
  "<[method]Result>" +
  "<string>string</string>" +
  "<string>string</string>" +
  "</[method]Result>" +
  "</[method]Response>" +
  "</soap12:Body>" +
  "</soap12:Envelope>";

export default {
  name: "iomanagement",
  components: {
    PageBar,
    VueUEditor
  },

  computed: {
    ...mapGetters(["servTagArr", 'rightInfoObj'])
  },
  data() {
    var validatePass = (rule, value, callback) => {
      const re = /^[A-Za-z]\w+(?:\/\{?\w+\}?)*$/i;
      if (re.test(value)) {
        callback();
      } else {
        callback(new Error("地址不符合RESTful规范"));
      }
    };
    return {
      type: '', // 服务类型
      pathRule: [{
          required: true,
          message: "请输入接口发布地址",
          trigger: "blur"
        },
        {
          max: 200,
          min: 3,
          message: "长度3-200个字符",
          trigger: "blur"
        },
        {
          validator: validatePass,
          trigger: "blur"
        }
      ],
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
      editObj: {},
      editDialogVisible: false,
      selectState: false,
      isActiveBtn1: true,
      isActiveBtn2: false,
      innerAnotherVisible: false,
      outerVisible: false,
      innerVisible: false,
      loading: false,
      total: 0, // 分页
      current: 1, // 分页
      size: 10, // 缓存一下每页大小
      tableData: [], // 表格数据
      requestData: [], // 弹出层表格数据
      responseData: [],
      errorData: [],
      contentData: "",
      ckRow: "", // 查看数据
      expUrl: "", //接口示例
      extensions: [], //格式转换的适配器
      isChecked: false,
      form: {
        //审核操作
        encryptObj: true,
        translateObj: true,
        extensel: ""
      },
      servArr: [],
      dataSourceList: [], // 选择数据源
      OptTypes: [], //查询数据源操作类型信息
      ObjTypeList: [],
      TablesList: [],
      ViewsList: [],
      ObjTransferList: [],
      conditionList: [], //条件与条件值关系
      datatype: ["String", "Boolean", "Number"], //数据类型
      Settings: "", //访问地址前缀
      valtypeList: [
        //值类型
        {
          name: "常量",
          key: "1"
        },
        {
          name: "变量",
          key: "2"
        }
      ],
      disRelation: false, //是否值类型能填
      reqmethod: [
        "GET",
        "HEAD",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
        "TRACE"
      ], //请求方式
      retformat: ["normal", "JSON", "XML", "Stream"], //返回格式
      pubStatus: [{
          id: 0,
          name: "全部",
          show: true,
          value: ""
        }, {
          id: 1,
          name: "待发布",
          show: false,
          value: "0"
        },
        {
          id: 2,
          name: "待审批",
          show: false,
          value: "1"
        },
        {
          id: 3,
          name: "审批通过",
          show: false,
          value: "2"
        },
        {
          id: 4,
          name: "审批不通过",
          show: false,
          value: "3"
        }
      ],
      apiStatus: [{
          id: 0,
          name: "全部",
          show: true,
          value: ""
        }, {
          id: 1,
          name: "在线",
          show: false,
          value: "1"
        },
        {
          id: 2,
          name: "暂停",
          show: false,
          value: "2"
        },
        {
          id: 3,
          name: "下线",
          show: false,
          value: "3"
        }
      ],
      typeObj: {
        // 请求参数对象
        pubStatus: "",
        apiStatus: "",
        servId: ""
      }
    };
  },
  created() {
    this.getBaseData();
  },
  methods: {
    openEdit(row) {
      this.type = row.servType
      this.editObj = {}
      this.$set(this.editObj, 'servType', row.servType)
      this.$set(this.editObj, 'servUuid', row.servUuid)
      api.getApiParamForms({
        apiId: row.apiId,
        servId: row.servId,
        type: row.servType,
      }).then(({
        status,
        data
      }) => {
        if (status == 200 && data) {
          // 处理显示隐藏等active属性
          if (data.params) {
            this.editObj.params = data.params.forEach(item => {
              item.state = '0'
              item.foucs = false
            });
          }

          if (data.responses) {
            this.editObj.responses = data.responses.forEach(item => {
              item.state = '0'
              item.foucs = false
            });
          }

          if (this.type == 3 && data.errors) {
            this.editObj.errors = data.errors.forEach(item => {
              item.state = '0'
              item.foucs = false
            });
          }
          if (this.type == 3 && data.conditions) {
            this.editObj.conditions = data.conditions.forEach(item => {
              item.state = '0'
            });
          }
          let obj = Object.assign({}, this.editObj, data, {
            queryList: [
              ...data.params,
              {
                name: "新增参数"
              }
            ],
            selObjType: ''
          })
          if (this.type == 3) {
            this.selDataSourceInit(obj);
            this.changeTarget(obj);
            obj.column = obj.columns.map((item) => {
              return item.column
            })
          }
          if(this.type == 2) {
            obj.resp = 'XML'
            obj.selexample = '1'
          }


          this.editObj = obj
          this.editDialogVisible = true
        }
      })
    },
    submitEdit() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {

          api.submitEditIo({
              ...this.editObj
            }, this.editObj.servType)
            .then(({status, data}) => {
              if (status == 200 && data) {
                
                if (data.status == 'success') {
                  this.$notify({
                    title: "成功",
                    message: "创建成功",
                    type: "success",
                    duration: 2000
                  });
                  this.$store.dispatch('getNoticeNumber')
                  this.editDialogVisible = false;
                } else {
                  this.$notify({
                    title: "失败",
                    message: res.data.message,
                    type: "error",
                    duration: 2000
                  });
                }
              }

            })
        } else {
          return false;
        }
      });
    },
    handleSearch() {
      this.getList(this.current, this.size);
    },
    getList(pageNo = 1, limit = this.size) {
      api
        .getApiList({
          pageNo,
          limit,
          pubStatus: this.typeObj.pubStatus,
          apiStatus: this.typeObj.apiStatus,
          servId: this.typeObj.servId
        })
        .then(res => {
          const {
            status,
            data
          } = res;
          if (status == 200 && data) {
            this.loading = false;
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
            this.total = data.total;
            this.current = data.current;
          }
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
    // handleServArr(item) {
    //   const {
    //     id,
    //     value
    //   } = item;
    //   this.servArr.forEach(item => (item.show = false));
    //   this.servArr[id].show = true;
    //   this.typeObj.servId = value;
    // },
    handlePubArr(item) {
      const {
        id,
        value
      } = item;
      this.pubStatus.forEach(item => (item.show = false));
      this.pubStatus[id].show = true;
      this.typeObj.pubStatus = value;

    },
    handleApiArr(item) {
      const {
        id,
        value
      } = item;
      this.apiStatus.forEach(item => (item.show = false));
      this.apiStatus[id].show = true;
      this.typeObj.apiStatus = value;
    },
    openLayerPage(row, status) {
      this.type = row.servType
      this.isChecked = status
      this.ckRow = row;
      this.outerVisible = true;
      this.diaData = {
        servId: row.servId,
        type: row.servType,
        apiId: row.apiId
      };
      api.getApiParamForms(this.diaData).then(res => {
        const {
          status,
          statusText,
          data
        } = res;
        this.contentData = data;
        const {
          path,
          method,
          version
        } = data;
        var uuid = row.servUuid ? row.servUuid : "";
        if (row.servType == 1) {
          //soap---http
          this.expUrl = `${this.Settings}/http/${uuid}/v${version}${
            path ? "/" + path : ""
          }`;
        }
        if (row.servType == 2) {
          //webservice----soap
          this.expUrl = `${this.Settings}/http/${uuid}/v${method}${
            version ? "/" + version : ""
          }`;
        }
        if (row.servType == 3) {
          //数据源-----dataset
          this.expUrl = `${this.Settings}/http/${uuid}/v${version}${
            path ? "/" + path : ""
          }`;
        }
      });
    },
    handleSwitch2(val) {
      if (val == false) {
        this.selectState = true;
        this.form.extensel = "";
      } else if (val == true) {
        this.selectState = false;
        this.form.extensel = "";
      }
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
            this.getList();
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
    },
    openChange(row) {
      this.$confirm("您是否要启用改服务?", "启用提醒", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          // 增加一个新的服务发布申请记录 提交服务发布申请
          api
            .runService({
              servId: row.servId,
              apiId: row.apiId,
              ver: row.apiVer
            })
            .then(res => {
              const {
                status,
                data
              } = res;
              if (status == 200 && data) {
                if (data.status == "success") {
                  this.$message({
                    type: "success",
                    message: data.message
                  });
                  this.getList();
                } else {
                  this.$message.error(data.message);
                }
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handleForbidden(row) {
      this.$confirm("您是否要禁用该服务?", "禁用提醒", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          api
            .forbiddenService({
              servId: row.servId,
              apiId: row.apiId,
              ver: row.apiVer
            })
            .then(res => {
              const {
                status,
                data
              } = res;
              if (status == 200 && data) {
                if (data.status == "success") {
                  this.$message({
                    type: "success",
                    message: data.message
                  });
                  this.getList();
                } else {
                  this.$message.error(data.message);
                }
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handleOn(row) {
      this.$confirm("您是否要上线该服务?", "上线提醒", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          api
            .deployService({
              servId: row.servId,
              apiId: row.apiId,
              ver: row.apiVer
            })
            .then(res => {
              const {
                status,
                data
              } = res;
              if (status == 200 && data) {
                if (data.status == "success") {
                  this.$message({
                    type: "success",
                    message: data.message
                  });
                  this.getList();
                } else {
                  this.$message.error(data.message);
                }
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handleOff(row) {
      this.$confirm("您是否要下线该服务?", "下线提醒", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          api
            .destroyService({
              servId: row.servId,
              apiId: row.apiId,
              ver: row.apiVer
            })
            .then(res => {
              const {
                status,
                data
              } = res;
              if (status == 200 && data) {
                if (data.status == "success") {
                  this.$message({
                    type: "success",
                    message: data.message
                  });
                  this.getList();
                } else {
                  this.$message.error(data.message);
                }
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 获取服务分类
    getBaseData() {
      if (this.type == '3') {
        dicty.getDatasources().then(response => {
          this.dataSourceList = response.data;
        });
        dicty.getOptTypes().then(response => {
          this.OptTypes = response.data;
        });
        dicty.getRelations().then(response => {
          this.conditionList = response.data;
        });
      }
      
      // 访问前缀
      dicty.getSettings().then(response => {
        this.Settings = response.data.servUrl;
      });
      // 获取适配器 
      api.getExtensions().then(res => {
        this.extensions = res.data;
      });


      // 拉去服务list
      api.getServList().then(({
        status,
        data
      }) => {
        if (status == 200 && data) {
          this.servArr = data
        }
        this.getList()
      });
    },
    // 接口返回实例
    changeExample(val) {
      if (val == "1") {
        this.editObj.example = expSoap1;
      } else {
        this.editObj.example = expSoap2;
      }
    },
    // 返回格式
    changeResp(val) {
      if (val == "XML") {
        this.editObj.example = expSoap1;
      } else {
        this.editObj.example = "";
      }
    },
    // 富文本编辑器
    editorReady(editorInstance) {
      editorInstance.setContent(this.editObj.intro);
      editorInstance.addListener("contentChange", () => {
        this.editObj.intro = editorInstance.getContent();
      });
    },
    // 注册--数据流注册--接口列表--选择数据源
    selDataSource(data) {
      let ele = "";
      this.dataSourceList.forEach(item => {
        if (item.id == data.dsId) {
          ele = item.uid;
        }
      });
      data.target = "";
      data.column = [];
      this.ObjTransferList = [];

      var condobj = data.conditions;
      if (condobj) {
        condobj.forEach(function (item, index) {
          if (item.name) item.name = "";
        });
      }
      var query = {
        uid: ele
      };
      dicty.getTables(query).then(response => {
        this.ObjTypeList = this.TablesList = response.data;
        this.ObjTypeList.forEach((item) => {
          if (item.name == data.target) {
            this.editObj.selObjType = 1
          }
        })
      });
      dicty.getViews(query).then(response => {
        this.ViewsList = response.data;
        this.ViewsList.forEach((item) => {
          if (item.name == data.target) {
            this.editObj.selObjType = 2
          }
        })
      });
    },
    selDataSourceInit(data) {
      let ele = "";
      this.dataSourceList.forEach(item => {
        if (item.id == data.dsId) {
          ele = item.uid;
        }
      });
      data.column = [];
      this.ObjTransferList = [];

      var condobj = data.conditions;
      if (condobj) {
        condobj.forEach(function (item, index) {
          if (item.name) item.name = "";
        });
      }
      var query = {
        uid: ele
      };
      dicty.getTables(query).then(response => {
        this.ObjTypeList = this.TablesList = response.data;
        this.ObjTypeList.forEach((item) => {
          if (item.name == data.target) {
            this.editObj.selObjType = 1
          }
        })
      });
      dicty.getViews(query).then(response => {
        this.ViewsList = response.data;
        this.ViewsList.forEach((item) => {
          if (item.name == data.target) {
            this.editObj.selObjType = 2
          }
        })
      });
    },
    // 注册--数据流注册--接口列表--查询对象--表和视图
    changeObjType(data) {
      let val = data.selObjType;
      data.target = "";
      this.ObjTransferList = [];
      var condobj = data.conditions;
      if (condobj) {
        condobj.forEach(function (item, index) {
          if (item.name) item.name = "";
        });
      }
      if (val == 1) {
        this.ObjTypeList = this.TablesList;
      } else {
        this.ObjTypeList = this.ViewsList;
      }
    },
    // 注册--数据流注册--接口列表--查询对象
    changeTarget(data) {
      let val = data.target;
      // data.column = [];
      this.ObjTransferList = [];
      var condobj = data.conditions;
      if (condobj) {
        condobj.forEach(function (item, index) {
          if (item.name) item.name = "";
        });
      }
      let ele = "";
      this.dataSourceList.forEach(item => {
        if (item.id == data.dsId) {
          ele = item.uid;
        }
      });
      var query = {
        uid: ele,
        table: val
      };
      dicty.getColumns(query).then(response => {
        var list = response.data;
        list.forEach((item, index) => {
          this.ObjTransferList.push({
            key: item.name,
            label: item.remark.split("：")[0]
          });
        });
      });
    },
    // 注册--数据流注册--接口列表--选择操作类型
    selOpt(data) {
      let val = data.opt;
      data.target = "";
      data.selObjType = 1;

      data.ObjTransferList = [];
      var condobj = data.conditions;
      if (condobj) {
        condobj.forEach(function (item, index) {
          if (item.name) item.name = "";
        });
      }
      if (val != "query") {
        this.ObjTypeList = this.TablesList;
      }
    },
    // 注册--数据流注册--接口列表--条件及参数设定--条件选择
    changeRelation(val) {
      if (val.relation == "is null" || val.relation == "is not null") {
        this.disRelation = true;
        if (val.type) val.type = "";
        if (val.value) val.value = "";
      } else {
        this.disRelation = false;
      }
    },
    // 注册--数据流注册--接口列表--条件及参数设定--编辑
    tabNozzPUpdate(val, row) {
      row.state = "1";
      if (val == "params") {
        var queryList = this.editObj.queryList;
        if (queryList) {
          queryList.forEach(function (item, index) {
            if (item.name == row.name) {
              queryList.splice(index, 1);
            }
          });
        }
      }
    },
    // 注册--数据流注册--接口列表--条件及参数设定--保存
    tabNozzPSure(val, row) {
      row.state = "0";
      if (val == "params") {
        var queryList = this.editObj.queryList;
        if (queryList) {
          queryList.splice(queryList.length - 1, 0, row);
        }
      }
    },
    // 注册--数据流注册--接口列表--条件及参数设定--删除
    tabNozzPDelete(val, row) {
      if (val == "nozz") {
        const index = this.editObj.conditions.indexOf(
          row
        );
        this.editObj.conditions.splice(index, 1);
      }
      if (val == "params") {
        const index = this.editObj.params.indexOf(row);
        this.editObj.params.splice(index, 1);
        const index1 = this.editObj.queryList.indexOf(
          row
        );
        this.editObj.queryList.splice(index1, 1);
      }
      if (val == "res") {
        const index = this.editObj.responses.indexOf(
          row
        );
        this.editObj.responses.splice(index, 1);
      }
      if (val == "err") {
        const index = this.editObj.errors.indexOf(row);
        this.editObj.errors.splice(index, 1);
      }
    },
    // 注册--数据流注册--接口列表--条件及参数设定--刷新
    tabNozzPRefresh(val, row) {
      if (val == "nozz") {
        row.name = "";
        row.relation = "";
        row.type = "";
        row.value = "";
        row.state = "1";
      }
      if (val == "params") {
        row.name = "";
        row.required = true;
        row.type = "";
        row.desc = "";
        row.state = "1";
      }
      if (val == "res") {
        row.name = "";
        row.type = "";
        row.desc = "";
        row.state = "0";
      }
      if (val == "err") {
        row.code = "";
        row.text = "";
        row.state = "0";
      }
    },
    // 注册--数据流注册--接口列表--条件及参数设定--查询值
    changeQuery(data) {
      if (data.value == "新增参数") {
        this.addTabNozz("params");
        data.value = "";
      }
    },
    // 注册--数据流注册--接口列表--条件及参数设定--新添加table
    addTabNozz(val) {
      if (val == "nozz") {
        this.editObj.conditions.push({
          state: "1"
        });
      }
      if (val == "params") {
        this.editObj.params.push({
          required: true,
          state: "1"
        });
      }
      if (val == "res") {
        this.editObj.responses.push({
          state: "1"
        });
      }
      if (val == "err") {
        this.editObj.errors.push({
          state: "1"
        });
      }
    },
  }
};
