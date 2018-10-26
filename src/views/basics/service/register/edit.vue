<template>
  <el-col :span="24">
    <div class="regCon">
      <h3 class="regH3">服务注册</h3>
      <div>
        <el-form label-width="120px" :model="editDataObj" class="formStep3">
          <el-form-item required label="服务名称">
            <el-input v-model="editDataObj.name" placeholder="3-20个字符"></el-input>
          </el-form-item>
          <el-form-item required label="服务分类">
            <el-radio-group v-model="editDataObj.tag">
              <el-radio v-for="item in servTypeList" :key="item.key" :label="item.value" border></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item required label="服务简介">
            <el-input type="textarea" v-model="editDataObj.intro"></el-input>
          </el-form-item>
          <el-form-item label='服务详情'>
            <VueUEditor :ueditorConfig='editorConfig' @ready="editorReadyServ"></VueUEditor>
          </el-form-item>
          <div class="nozzleList">
            <div class="nozz-label">接口列表<el-button class="addNozz" size="small" @click="addTab(editableTabsValue)" icon="el-icon-plus"></el-button>
            </div>
            <div class="nozz-box">
              <el-tabs type="border-card" v-model="editableTabsValue" closable @tab-remove="removeTab">
                <el-tab-pane v-for="(item, index) in editableTabs" :key="index" :label="item.title" :name="item.tabInd">
                  <el-form-item required label="接口中文名称">
                    <el-input v-model="item.name" placeholder="3-20个字符"></el-input>
                  </el-form-item>
                  <el-form-item required label="原始接口地址" v-if="selSerType == 1 || selSerType == 2">
                    <el-input v-model="item.url" placeholder="3-20个字符"></el-input>
                  </el-form-item>
                  <el-form-item required label="接口发布地址" v-if="selSerType == 1 || selSerType == 3">
                    <el-input v-model="item.path" placeholder="3-20个字符，符合RESTful规范"></el-input>
                  </el-form-item>
                  <el-form-item required label="原始命名空间" v-if="selSerType==2">
                    <el-input v-model="item.namespace" placeholder="3-20个字符"></el-input>
                  </el-form-item>
                  <el-form-item required label="原始方法名称" v-if="selSerType==2">
                    <el-input v-model="item.method" placeholder="3-20个字符"></el-input>
                  </el-form-item>
                  <el-form-item required label="外部访问地址" v-if="selSerType!=4">
                    <el-input :value="`${Settings}/${item.version}${item.path ? '/' + item.path : ''}`" disabled></el-input>
                  </el-form-item>
                  <el-form-item required label="请求方式" v-if="selSerType==1 || selSerType==3">
                    <el-radio-group v-model="item.method">
                      <el-radio v-for='list in reqmethod' :key="list" :label="list">{{list}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item required label="返回格式" v-if="selSerType===1">
                    <el-radio-group v-model="item.resp" @change="changeResp">
                      <el-radio v-for='list in retformat' :key="list" :label="list">{{list}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item required label="返回格式" v-if="selSerType===3">
                    <el-radio-group v-model="item.resp">
                      <el-radio label="JSON">JSON</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item required label="返回格式" v-if="selSerType===2">
                    <el-radio-group v-model="item.resp">
                      <el-radio label="XML">XML</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item required label="接口返回示例" v-if="item.resp!='XML'">
                    <el-input type="textarea" :rows="11" placeholder="请输入字符" v-model="item.example"></el-input>
                  </el-form-item>
                  <el-form-item required label="接口返回示例" v-if="item.resp=='XML'">
                    <el-radio-group v-model="item.selexample" @change="changeExample">
                      <el-radio label="1">Soap 1.1</el-radio>
                      <el-radio label="2">Soap 1.2</el-radio>
                    </el-radio-group>
                    <el-input type="textarea" :rows="11" placeholder="请输入字符" v-model="item.example"></el-input>
                  </el-form-item>
                  <el-form-item required label="选择数据源" v-if="selSerType==3" class="dbType_sel">
                    <el-select v-model="item.dsId" placeholder="请选择" clearable @change="selDataSource">
                      <el-option v-for='list in dataSourceList' :key="list.uid" :label="list.name" :value="list.uid"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item required label="选择操作类型" v-if="selSerType==3">
                    <el-radio-group v-model="item.opt" @change="selOpt">
                      <el-radio v-for="item in OptTypes" :key="item.key" :label="item.key">{{item.desc}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item required label="上传接口文件" v-if="selSerType==4">
                  </el-form-item>
                  <el-tabs v-model="item.opt" v-if="selSerType==3">
                    <el-tab-pane v-if="item.opt==itemOpt.key" v-for="itemOpt in OptTypes" :key="itemOpt.key" :label="itemOpt.desc" :name="itemOpt.key">
                      <div>
                        <p class="tips" v-if="itemOpt.key=='query'">
                          <i class="el-icon-question"></i>
                          查询服务可以选择的查询对象包含视图或者实体表，暂不支持复杂条件、子查询或查询中包含函数、存储过程等调用的
                        </p>
                        <el-form-item :label="itemOpt.key=='query'?'查询对象':'操作对象'">
                          <el-select v-model="item.target" placeholder="请选择" clearable @change="changeTarget">
                            <el-option v-for='exp in ObjTypeList' :key="exp.name" :label="exp.remark" :value="exp.name"></el-option>
                          </el-select>
                          <el-radio-group v-model="item.selObjType" v-if="itemOpt.key=='query'" class="ObjRgpart" @change="changeObjType">
                            <el-radio :label="1">表</el-radio>
                            <el-radio :label="2">视图</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <el-transfer v-if="itemOpt.key!='delete'" :titles="['字段列表', '返回属性']" v-model="item.column" :data="ObjTransferList"></el-transfer>
                        <div class="nozzsetPart" v-if="itemOpt.key!='insert'">
                          <el-row type="flex" class="row-bg" justify="space-between">
                            <el-col :span="12">
                              <div class="label">条件及参数设定</div>
                            </el-col>
                          </el-row>
                          <el-table :data="item.conditions" style="width: 100%">
                            <el-table-column label="列名">
                              <template slot-scope="scope">
                                <span v-if="scope.row.state=='0'">{{scope.row.name?scope.row.name:'/'}}</span>
                                <el-select v-else v-model="scope.row.name" placeholder="请选择" clearable>
                                  <el-option v-for='exp in ObjTransferList' :key="exp.key" :label="exp.label" :value="exp.key"></el-option>
                                </el-select>
                              </template>
                            </el-table-column>
                            <el-table-column label="条件">
                              <template slot-scope="scope">
                                <span v-if="scope.row.state=='0'">{{scope.row.relation?scope.row.relation:'/'}}</span>
                                <el-select v-else v-model="scope.row.relation" placeholder="请选择" clearable @change="changeRelation(scope.row)">
                                  <el-option v-for='exp in conditionList' :key="exp.key" :label="exp.desc" :value="exp.key"></el-option>
                                </el-select>
                              </template>
                            </el-table-column>
                            <el-table-column label="值类型">
                              <template slot-scope="scope">
                                <span v-if="scope.row.state=='0'">{{scope.row.type?scope.row.type:'/'}}</span>
                                <el-select v-else v-model="scope.row.type" placeholder="请选择" clearable :disabled="disRelation">
                                  <el-option v-for='exp in valtypeList' :key="exp.key" :label="exp.name" :value="exp.key"></el-option>
                                </el-select>
                              </template>
                            </el-table-column>
                            <el-table-column label="查询值">
                              <template slot-scope="scope">
                                <span v-if="scope.row.state=='0'">{{scope.row.value?scope.row.value:'/'}}</span>
                                <el-input v-if="scope.row.state=='1' && scope.row.type=='1'" v-model="scope.row.value" placeholder="请输入字符" :disabled="disRelation"></el-input>
                                <el-select v-if="scope.row.state=='1' && (scope.row.type=='2' || !scope.row.type)" v-model="scope.row.value" @change="changeQuery(scope.row)" placeholder="请选择" :disabled="disRelation" clearable>
                                  <el-option v-for='exp in item.queryList' :key="exp.name" :label="exp.name" :value="exp.name"></el-option>
                                </el-select>
                              </template>
                            </el-table-column>
                            <el-table-column label="操作" width="120">
                              <template slot-scope="scope">
                                <span class="primary" @click="tabNozzPUpdate('nozz',scope.row)" v-if="scope.row.state=='0'">编辑</span>
                                <span class="success" type="text" @click="tabNozzPSure('nozz',scope.row)" v-if="scope.row.state=='1'">保存</span>
                                <span class="danger" type="text" @click="tabNozzPDelete('nozz',scope.row)" v-if="scope.row.state=='0'">删除</span>
                                <span class="primary" type="text" @click="tabNozzPRefresh('nozz',scope.row)" v-if="scope.row.state=='1'">刷新</span>
                              </template>
                            </el-table-column>
                          </el-table>
                          <div class="addTab">
                            <i class="el-icon-plus" @click="addTabNozz('nozz')"></i>
                          </div>
                        </div>
                        <el-form-item label="返回内容" required v-if="itemOpt.key!='query'">
                          <el-radio-group v-model="item.rtType">
                            <el-radio :label="0">受影响记录数</el-radio>
                            <el-radio :label="1">操作状态</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                  <el-form-item required class="topFormBox" label='接口简介'>
                    <VueUEditor :ueditorConfig='editorConfig' @ready="editorReady"></VueUEditor>
                  </el-form-item>
                  <el-form-item required class="topFormBox" label='服务分类'>
                    <el-tabs type="border-card">
                      <el-tab-pane label="输入参数">
                        <el-table :data="item.params" style="width: 100%">
                          <el-table-column label="名称">
                            <template slot-scope="scope">
                              <span v-if="scope.row.state=='0'">{{scope.row.name?scope.row.name:'/'}}</span>
                              <el-input v-else v-model="scope.row.name" autofocus placeholder="请输入字符"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column label="必填">
                            <template slot-scope="scope">
                              <span v-if="scope.row.state=='0'">{{scope.row.required?'是':'否'}}</span>
                              <el-switch v-else v-model="scope.row.required" active-color="#13ce66" inactive-color="#ccc"></el-switch>
                            </template>
                          </el-table-column>
                          <el-table-column label="类型">
                            <template slot-scope="scope">
                              <span v-if="scope.row.state=='0'">{{scope.row.type?scope.row.type:'/'}}</span>
                              <el-select v-else v-model="scope.row.type" placeholder="请选择" clearable>
                                <el-option v-for='exp in datatype' :key="exp" :label="exp" :value="exp"></el-option>
                              </el-select>
                            </template>
                          </el-table-column>
                          <el-table-column label="说明">
                            <template slot-scope="scope">
                              <span v-if="scope.row.state=='0'">{{scope.row.desc?scope.row.desc:'/'}}</span>
                              <el-input v-else v-model="scope.row.desc" placeholder="请输入字符"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column label="操作" width="120">
                            <template slot-scope="scope">
                              <span class="primary" @click="tabNozzPUpdate('params',scope.row)" v-if="scope.row.state=='0'">编辑</span>
                              <span class="success" type="text" @click="tabNozzPSure('params',scope.row)" v-if="scope.row.state=='1'">保存</span>
                              <span class="danger" type="text" @click="tabNozzPDelete('params',scope.row)" v-if="scope.row.state=='0'">删除</span>
                              <span class="primary" type="text" @click="tabNozzPRefresh('params',scope.row)" v-if="scope.row.state=='1'">刷新</span>
                            </template>
                          </el-table-column>
                        </el-table>
                        <div class="addTab">
                          <i class="el-icon-plus" @click="addTabNozz('params')"></i>
                        </div>
                      </el-tab-pane>
                      <el-tab-pane label="输出参数">
                        <el-table :data="item.responses" style="width: 100%">
                          <el-table-column label="名称">
                            <template slot-scope="scope">
                              <span v-if="scope.row.state=='0'">{{scope.row.name?scope.row.name:'/'}}</span>
                              <el-input v-else v-model="scope.row.name" placeholder="请输入字符"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column label="类型">
                            <template slot-scope="scope">
                              <span v-if="scope.row.state=='0'">{{scope.row.type?scope.row.type:'/'}}</span>
                              <el-select v-else v-model="scope.row.type" placeholder="请选择" clearable>
                                <el-option v-for='exp in datatype' :key="exp" :label="exp" :value="exp"></el-option>
                              </el-select>
                            </template>
                          </el-table-column>
                          <el-table-column label="说明">
                            <template slot-scope="scope">
                              <span v-if="scope.row.state=='0'">{{scope.row.desc?scope.row.desc:'/'}}</span>
                              <el-input v-else v-model="scope.row.desc" placeholder="请输入字符"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column label="操作" width="120">
                            <template slot-scope="scope">
                              <span class="primary" @click="tabNozzPUpdate('res',scope.row)" v-if="scope.row.state=='0'">编辑</span>
                              <span class="success" type="text" @click="tabNozzPSure('res',scope.row)" v-if="scope.row.state=='1'">保存</span>
                              <span class="danger" type="text" @click="tabNozzPDelete('res',scope.row)" v-if="scope.row.state=='0'">删除</span>
                              <span class="primary" type="text" @click="tabNozzPRefresh('res',scope.row)" v-if="scope.row.state=='1'">刷新</span>
                            </template>
                          </el-table-column>
                        </el-table>
                        <div class="addTab">
                          <i class="el-icon-plus" @click="addTabNozz('res')"></i>
                        </div>
                      </el-tab-pane>
                      <el-tab-pane label="错误代码">
                        <el-table :data="item.errors" style="width: 100%">
                          <el-table-column label="错误码">
                            <template slot-scope="scope">
                              <span v-if="scope.row.state=='0'">{{scope.row.code?scope.row.code:'/'}}</span>
                              <el-input v-else v-model="scope.row.code" placeholder="请输入字符"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column label="说明">
                            <template slot-scope="scope">
                              <span v-if="scope.row.state=='0'">{{scope.row.text?scope.row.text:'/'}}</span>
                              <el-input v-else v-model="scope.row.text" placeholder="请输入字符"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column label="操作" width="120">
                            <template slot-scope="scope">
                              <span class="primary" @click="tabNozzPUpdate('err',scope.row)" v-if="scope.row.state=='0'">编辑</span>
                              <span class="success" type="text" @click="tabNozzPSure('err',scope.row)" v-if="scope.row.state=='1'">保存</span>
                              <span class="danger" type="text" @click="tabNozzPDelete('err',scope.row)" v-if="scope.row.state=='0'">删除</span>
                              <span class="primary" type="text" @click="tabNozzPRefresh('err',scope.row)" v-if="scope.row.state=='1'">刷新</span>
                            </template>
                          </el-table-column>
                        </el-table>
                        <div class="addTab">
                          <i class="el-icon-plus" @click="addTabNozz('err')"></i>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </el-form-item>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </el-form>
      </div>
      <div class="stepBtnr">
        <el-button type="warning" @click='next'>暂不提交</el-button>
        <el-button type="primary" @click='sureReg'>提交审核</el-button>
      </div>
    </div>
  </el-col>
</template>


<script>
import VueUEditor from "vue-ueditor";
import * as dicty from "api/dictionary";
import * as api from "api/service/register";
import { mapGetters } from "vuex";
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
  name: "register",
  components: {
    VueUEditor
  },
  props: ["editDataObj"],
  data() {
    return {
      servTypeList: [], // 服务分类
      dbTypes: [],
      dataSourceList: [], // 选择数据源
      OptTypes: [], //查询数据源操作类型信息
      ObjTypeList: [],
      TablesList: [],
      ViewsList: [],
      ObjTransferList: [],
      conditionList: [], //条件与条件值关系
      valtypeList: [
        //值类型
        { name: "常量", key: "1" },
        { name: "变量", key: "2" }
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
      editableTabsValue: "1",
      editableTabs: [], // 接口数组
      ediTabNum: "",
      curEditTabs: 0,
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
      datatype: ["String", "Boolean", "Number"], //数据类型

      Settings: "", //访问地址前缀
      servId: "",
      selSerType: 0,
      sureRegActive: false
    };
  },
  async created() {
    this.selSerType = +this.editDataObj.type;
    await this.getBaseData();
    this.editableTabs = this.editDataObj.apis.map((item, index) => {
      let obj = {
        title: `接口${++index}`,
        tabInd: index + "",
        selexample: "1",
        selObjType: 1,
        resp: this.editDataObj.type === "2" ? "XML" : "JSON",
        ...item
      };

      // obj.queryList = item.queryList.map(item => {
      //   return {
      //     state: item.state ? item.state : "0", //0 编辑  1 保存
      //     name: item.name,
      //     required: item.required === "1" ? true : false,
      //     type: item.type,
      //     desc: item.desc
      //   };
      // });
      obj.params = item.params.map(item => {
        return {
          id: item.id,
          state: "0", //0 编辑  1 保存
          name: item.name,
          required: item.required === "1" ? true : false,
          type: item.type,
          desc: item.desc,
          foucs: false
        };
      });

      obj.responses = item.responses.map(item => {
        return {
          id: item.id,
          state: "0", //0 编辑  1 保存
          name: item.name,
          required: item.required === "1" ? true : false,
          type: item.type,
          desc: item.desc,
          foucs: false
        };
      });

      obj.errors = item.errors.map(item => {
        return {
          id: item.id,
          state: "0", //0 编辑  1 保存
          name: item.name,
          required: item.required === "1" ? true : false,
          type: item.type,
          desc: item.desc,
          foucs: false,
          code: item.code,
          text: item.text
        };
      });
      if (item.conditions) {
        obj.conditions = item.conditions.map(item => {
          return {
            id: item.id,
            apiId: item.apiId,
            id: item.id,
            name: item.name,
            relation: item.relation,
            servId: item.servId,
            type: item.type,
            value: item.value,
            state: "0" //0 编辑  1 保存
          };
        });
      }

      return obj;
    });
    this.ediTabNum = this.editableTabs.length;
  },
  watch: {
    ediTabNum() {
      let tabs = this.editableTabs;
      let active = this.editableTabsValue;
      let that = this;
      tabs.forEach((tab, index) => {
        if (tab.tabInd === active) {
          that.curEditTabs = index;
        }
      });
    },
    editableTabsValue() {
      let tabs = this.editableTabs;
      let active = this.editableTabsValue;
      let that = this;
      tabs.forEach((tab, index) => {
        if (tab.tabInd === active) {
          that.curEditTabs = index;
        }
      });
    }
  },
  methods: {
    // 获取服务分类
    getBaseData() {
      var query = { group: "servType" };
      dicty.getBaseData(query).then(response => {
        this.servTypeList = response.data;
      });
      dicty.getdbTypes().then(response => {
        this.dbTypes = response.data;
      });
      dicty.getDatasources().then(response => {
        this.dataSourceList = response.data;
      });

      dicty.getOptTypes().then(response => {
        this.OptTypes = response.data;
      });
      dicty.getRelations().then(response => {
        this.conditionList = response.data;
      });
      // 访问前缀
      dicty.getSettings().then(response => {
        this.Settings = response.data.servUrl;
      });
    },
    // 接口返回实例
    changeExample(val) {
      if (val == "1") {
        this.editableTabs[this.curEditTabs].example = expSoap1;
      } else {
        this.editableTabs[this.curEditTabs].example = expSoap2;
      }
    },
    // 返回格式
    changeResp(val) {
      if (val == "XML") {
        this.editableTabs[this.curEditTabs].example = expSoap1;
      } else {
        this.editableTabs[this.curEditTabs].example = "";
      }
    },
    // 添加接口列表
    addTab(targetName) {
      var respSel = "";
      var exampleSel = "";
      if (this.selSerType == 2) {
        respSel = "XML";
        exampleSel = expSoap1;
      } else {
        respSel = "JSON";
        exampleSel = "";
      }
      var tabInd = this.editableTabs.length + 1 + "";
      this.editableTabs.push({
        title: "接口" + tabInd,
        tabInd: tabInd,
        opt: "query",
        selObjType: 1,
        column: [],
        rtType: 1,
        intro: "",
        selexample: "1",
        example: exampleSel,
        resp: respSel,
        method: "GET",
        queryList: [
          {
            //输入参数
            name: "Key",
            required: true, //0：否  1：是
            type: "String",
            desc: "申请调用的Key",
            state: "0" //0 编辑  1 保存
          },
          {
            name: "新增参数"
          }
        ],
        params: [
          {
            //输入参数
            name: "Key",
            required: true, //0：否  1：是
            type: "String",
            desc: "申请调用的Key",
            foucs: true,
            state: "0" //0 编辑  1 保存
          }
        ],
        responses: [
          {
            //输出参数
            state: "1" //0 编辑  1 保存
          }
        ],
        errors: [
          {
            //错误代码
            state: "1" //0 编辑  1 保存
          }
        ],
        conditions: [
          {
            state: "1" //0 编辑  1 保存
          }
        ]
      });
      this.editableTabsValue = tabInd;
      this.ediTabNum = this.editableTabs.length;
    },
    // 移除接口列表
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.tabInd === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.tabInd;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.tabInd !== targetName);
      this.ediTabNum = this.editableTabs.length;
    },
    // 注册--数据流注册--接口列表--选择数据源
    selDataSource(val) {
      this.editableTabs[this.curEditTabs].target = "";
      this.editableTabs[this.curEditTabs].column = [];
      this.ObjTransferList = [];
      var condobj = this.editableTabs[this.curEditTabs].conditions;
      if (condobj) {
        condobj.forEach(function(item, index) {
          if (item.name) item.name = "";
        });
      }
      var query = { uid: val };
      dicty.getTables(query).then(response => {
        this.ObjTypeList = this.TablesList = response.data;
      });
      dicty.getViews(query).then(response => {
        this.ViewsList = response.data;
      });
    },
    // 注册--数据流注册--接口列表--查询对象
    changeObjType(val) {
      this.editableTabs[this.curEditTabs].target = "";
      this.ObjTransferList = [];
      var condobj = this.editableTabs[this.curEditTabs].conditions;
      if (condobj) {
        condobj.forEach(function(item, index) {
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
    changeTarget(val) {
      this.editableTabs[this.curEditTabs].column = [];
      this.ObjTransferList = [];
      var condobj = this.editableTabs[this.curEditTabs].conditions;
      if (condobj) {
        condobj.forEach(function(item, index) {
          if (item.name) item.name = "";
        });
      }
      var query = {
        uid: this.editableTabs[this.curEditTabs].dsId,
        table: val
      };
      dicty.getColumns(query).then(response => {
        var list = response.data;
        var that = this;
        list.forEach(function(item, index) {
          that.ObjTransferList.push({
            key: item.name,
            label: item.remark.split("：")[0]
          });
        });
      });
    },
    // 注册--数据流注册--接口列表--选择操作类型
    selOpt(val) {
      this.editableTabs[this.curEditTabs].target = "";
      this.editableTabs[this.curEditTabs].selObjType = 1;
      this.ObjTransferList = [];
      var condobj = this.editableTabs[this.curEditTabs].conditions;
      if (condobj) {
        condobj.forEach(function(item, index) {
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
        var queryList = this.editableTabs[this.curEditTabs].queryList;
        if (queryList) {
          queryList.forEach(function(item, index) {
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
        var queryList = this.editableTabs[this.curEditTabs].queryList;
        if (queryList) {
          queryList.splice(queryList.length - 1, 0, row);
        }
      }
    },
    // 注册--数据流注册--接口列表--条件及参数设定--删除
    tabNozzPDelete(val, row) {
      if (val == "nozz") {
        const index = this.editableTabs[this.curEditTabs].conditions.indexOf(
          row
        );
        this.editableTabs[this.curEditTabs].conditions.splice(index, 1);
      }
      if (val == "params") {
        const index = this.editableTabs[this.curEditTabs].params.indexOf(row);
        this.editableTabs[this.curEditTabs].params.splice(index, 1);
        const index1 = this.editableTabs[this.curEditTabs].queryList.indexOf(
          row
        );
        this.editableTabs[this.curEditTabs].queryList.splice(index1, 1);
      }
      if (val == "res") {
        const index = this.editableTabs[this.curEditTabs].responses.indexOf(
          row
        );
        this.editableTabs[this.curEditTabs].responses.splice(index, 1);
      }
      if (val == "err") {
        const index = this.editableTabs[this.curEditTabs].errors.indexOf(row);
        this.editableTabs[this.curEditTabs].errors.splice(index, 1);
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
        this.editableTabs[this.curEditTabs].conditions.push({
          state: "1"
        });
      }
      if (val == "params") {
        this.editableTabs[this.curEditTabs].params.push({
          required: true,
          state: "1"
        });
      }
      if (val == "res") {
        this.editableTabs[this.curEditTabs].responses.push({
          state: "1"
        });
      }
      if (val == "err") {
        this.editableTabs[this.curEditTabs].errors.push({
          state: "1"
        });
      }
    },
    // 富文本编辑器
    editorReady(editorInstance) {
      editorInstance.setContent(this.editableTabs[this.curEditTabs].intro);
      editorInstance.addListener("contentChange", () => {
        this.editableTabs[this.curEditTabs].intro = editorInstance.getContent();
      });
    },
    editorReadyServ(editorInstance) {
      editorInstance.setContent(this.editDataObj.detail);
      editorInstance.addListener("contentChange", () => {
        this.editDataObj.detail = editorInstance.getContent();
      });
    },

    // 下一步
    next() {
      var submitD = {};
      var judge = true;
      submitD.useof = this.editDataObj.useof; //选择服务用途
      submitD.type = this.editDataObj.type; //选择的服务类型

      submitD.name = this.editDataObj.name ? this.editDataObj.name : ""; //服务名称
      submitD.id = this.editDataObj.id; //服务分类
      submitD.tag = this.editDataObj.tag; //服务分类
      submitD.intro = this.editDataObj.intro; //服务简介
      submitD.detail = this.editDataObj.detail ? this.editDataObj.detail : "空"; //服务详情
      submitD.apis = []; //接口列表

      if (submitD.name.length < 3 || submitD.name.length > 20) judge = false;
      if (!submitD.tag) judge = false;
      if (!submitD.intro || submitD.intro.length < 3) judge = false;

      this.editableTabs.forEach((item, index) => {
        var exp = {};
        exp.id = item.id; //接口id
        exp.name = item.name; //接口中文名称
        // exp.ename = item.ename; //接口英文名称
        exp.intro = item.intro ? item.intro : "空";
        exp.params = [];
        exp.responses = [];
        exp.errors = [];
        item.params.forEach(function(obj, ind) {
          obj.id = obj.id;
          obj.key = obj.name;
          obj.required = obj.required ? "1" : "0";
          if (obj.state == "0") {
            //保存过的
            exp.params.push(obj);
          }
        });
        item.responses.forEach(function(obj, ind) {
          obj.id = obj.id;
          obj.key = obj.name;
          if (obj.state == "0") {
            //保存过的
            exp.responses.push(obj);
          }
        });
        item.errors.forEach(function(obj, ind) {
          obj.id = obj.id;
          if (obj.state == "0") {
            //保存过的
            exp.errors.push(obj);
          }
        });
        if (!exp.name) judge = false;
        if (exp.name.length < 3 || exp.name.length > 20) judge = false;

        submitD.apis.push(exp);
      });
      if (this.selSerType == 1) {
        //rest---http api
        this.editableTabs.forEach((item, index) => {
          submitD.apis[index].id = item.id;
          submitD.apis[index].example = item.example; //接口返回示例
          submitD.apis[index].url = item.url; //接口地址
          submitD.apis[index].method = item.method; //请求方式
          submitD.apis[index].path = item.path;
          submitD.apis[index].resp = item.resp; //返回格式
          if (!submitD.apis[index].url) judge = false;
          if (
            submitD.apis[index].url.length < 3 ||
            submitD.apis[index].url.length > 20
          )
            judge = false;
          if (!this.validatePass(item.path)) judge = false;
          if (
            submitD.apis[index].path.length < 3 ||
            submitD.apis[index].path.length > 20
          )
            judge = false;
        });
        if (judge) {
          api.putRest(submitD).then(res => {
            if (res.status == "200") {
              this.servId = res.data.servId;
              if (this.sureRegActive) {
                this.save();
              } else {
                this.$notify({
                  title: "成功",
                  message: "创建成功",
                  type: "success",
                  duration: 2000
                });
                this.$emit("clickServiceManegement");
              }
            } else {
              this.$notify({
                title: "失败",
                message: res.data.message,
                type: "error",
                duration: 2000
              });
            }
          });
        } else {
          this.$message({ type: "warning", message: "请完整填写条件!" });
        }
      }
      if (this.selSerType == 2) {
        //rest---webservice
        this.editableTabs.forEach(function(item, index) {
          submitD.apis[index].id = item.id;
          submitD.apis[index].example = item.example; //接口返回示例
          submitD.apis[index].url = item.url; //接口地址
          submitD.apis[index].path = item.method;
          submitD.apis[index].namespace = item.namespace; //命名空间
          submitD.apis[index].method = item.method; //请求方式
          submitD.apis[index].resp = item.resp; //返回格式
          if (!submitD.apis[index].url) judge = false;
          // submitD.apis[index].method = submitD.apis[index].path = item.method  //方法名称
        });
        if (judge) {
          api.putSoap(submitD).then(res => {
            if (res.status == "200") {
              this.servId = res.data.servId;
              if (this.sureRegActive) {
                this.save();
              } else {
                this.$notify({
                  title: "成功",
                  message: "创建成功",
                  type: "success",
                  duration: 2000
                });
                this.$emit("clickServiceManegement");
              }
            } else {
              this.$notify({
                title: "失败",
                message: res.message,
                type: "error",
                duration: 2000
              });
            }
          });
        } else {
          this.$message({ type: "warning", message: "请完整填写条件!" });
        }
      }
      if (this.selSerType == 3) {
        //rest---数据源
        var that = this;
        this.editableTabs.forEach((item, index) => {
          submitD.apis[index].id = item.id;
          submitD.apis[index].example = item.example; //接口返回示例
          submitD.apis[index].url = item.url; //接口地址
          submitD.apis[index].method = item.method; //请求方式
          submitD.apis[index].resp = item.resp; //返回格式
          that.dataSourceList.forEach(function(objData, ind) {
            //数据源
            if (item.dsId == objData.uid) {
              submitD.apis[index].dsId = objData.id;
            }
          });
          submitD.apis[index].opt = item.opt; //选择操作类型
          submitD.apis[index].rtType = item.rtType; //返回内容
          submitD.apis[index].columns = []; //返回属性
          item.column.forEach(function(objcol, ind) {
            var expcol = {};
            expcol.column = objcol;
            submitD.apis[index].columns.push(expcol);
          });
          submitD.apis[index].conditions = item.conditions; //返回属性
          submitD.apis[index].target = item.target; //查询-操作对象
          submitD.apis[index].path = item.path; //接口发布路径规则

          // if (!submitD.apis[index].url) judge = false;
          if (!this.validatePass(item.path)) judge = false;
        });
        if (judge) {
          api.putDataSet(submitD).then(res => {
            if (res.status == "200") {
              this.servId = res.data.servId;
              if (this.sureRegActive) {
                this.save();
              } else {
                this.$notify({
                  title: "成功",
                  message: "创建成功",
                  type: "success",
                  duration: 2000
                });
                this.$emit("clickServiceManegement");
              }
            } else {
              this.$notify({
                title: "失败",
                message: res.message,
                type: "error",
                duration: 2000
              });
            }
          });
        } else {
          this.$message({ type: "warning", message: "请完整填写条件!" });
        }
      }
    },
    save() {
      var submitD = {
        servId: this.servId,
        userId: ""
      };
      api.putSubmit(submitD).then(res => {
        if (res.status == "200") {
          this.$notify({
            title: "成功",
            message: "提交成功",
            type: "success",
            duration: 2000
          });
          this.$store.dispatch("GET_fuwindex_on", [true, false, false, false]);
          this.$emit("clickServiceManegement");
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
    // 提交审核
    sureReg() {
      this.sureRegActive = true;
      this.next();
    },
    validatePass(value) {
      const re = /^([A-Z0-9a-z\.]+)?(\/\{?[A-Z0-9a-z]+\}?)*$/i;
      return re.test(value);
    }
  }
};
</script>