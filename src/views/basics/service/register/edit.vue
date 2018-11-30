<template>
  <el-col :span="24">
    <div class="regCon" v-loading="loading">
      <h3 class="regH3">服务注册</h3>
      <div>
        <el-form label-width="120px" :model="editDataObj" class="formStep3" ref="form">
          <el-form-item :rules="[{ required: true, message: '请输入服务名称', trigger: 'blur' },{ max: 50, min: 3, message: '长度3-50个字符', trigger: 'blur' }]" label="服务名称" prop="name">
            <el-input v-model.trim="editDataObj.name" placeholder="3-50个字符"></el-input>
          </el-form-item>
          <el-form-item :rules="[{ required: true, message: '请选择服务分类', trigger: 'change' }]" label="服务分类" prop="tag">
            <el-radio-group v-model="editDataObj.tag">
              <el-radio v-for="item in servTypeList" :key="item.key" :label="item.key" border>{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :rules="[{ required: true, message: '请输入服务简介', trigger: 'blur' },{ max: 400, min: 3, message: '长度3-400个字符', trigger: 'blur' }]" label="服务简介" prop="intro">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-model.trim="editDataObj.intro"></el-input>
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
                  <el-form label-width="120px" :model="item" :ref="item.tabInd">
                    <el-form-item :rules="[{ required: true, message: '请输入接口中文名称', trigger: 'blur' },{ max: 50, min: 3, message: '长度3-50个字符', trigger: 'blur' }]" label="接口中文名称" prop="name">
                      <el-input v-model.trim="item.name" placeholder="3-50个字符"></el-input>
                    </el-form-item>
                    <el-form-item :rules="[{ required: true, message: '请输入原始接口地址', trigger: 'blur' },{ max: 200, min: 3, message: '长度3-200个字符', trigger: 'blur' }]" label="原始接口地址" v-if="selSerType == 1 || selSerType == 2" prop="url">
                      <el-input v-model.trim="item.url" placeholder="3-200个字符"></el-input>
                    </el-form-item>
                    <el-form-item :rules="pathRule" label="接口发布地址" v-if="selSerType == 1 || selSerType == 3" prop="path">
                      <el-input v-model.trim="item.path" placeholder="3-200个字符，符合RESTful规范"></el-input>
                    </el-form-item>
                    <el-form-item :rules="[{ required: true, message: '请输入原始命名空间', trigger: 'blur' },{ max: 200, min: 3, message: '长度3-200个字符', trigger: 'blur' }]" label="原始命名空间" v-if="selSerType==2" prop="namespace">
                      <el-input v-model.trim="item.namespace" placeholder="3-200个字符"></el-input>
                    </el-form-item>
                    <el-form-item :rules="[{ required: true, message: '请输入原始方法名称', trigger: 'blur' },{ max: 200, min: 3, message: '长度3-200个字符', trigger: 'blur' }]" label="原始方法名称" v-if="selSerType==2" prop="method">
                      <el-input v-model.trim="item.method" placeholder="3-200个字符"></el-input>
                    </el-form-item>
                    <el-form-item label="外部访问地址" v-if="selSerType!=4">
                      <el-input v-if="selSerType == 1" :value="`${Settings}/http/${editDataObj.uuid}/v${item.version}${item.path ? '/' + item.path : ''}`" disabled></el-input>
                      <el-input v-if="selSerType == 2" :value="`${Settings}/soap/${editDataObj.uuid}/${item.method}_v${item.version ? item.version : ''}`" disabled></el-input>
                      <el-input v-if="selSerType == 3" :value="`${Settings}/dataset/${editDataObj.uuid}/v${item.version}${item.path ? '/' + item.path : ''}`" disabled></el-input>
                    </el-form-item>
                    <el-form-item :rules="[{ required: true, message: '请选择请求方式', trigger: 'change' }]" label="请求方式" v-if="selSerType==1" prop="method">
                      <el-radio-group v-model="item.method">
                        <el-radio v-for='list in reqmethod' :key="list" :label="list">{{list}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <!-- <el-form-item :rules="[{ required: true, message: '请选择返回格式', trigger: 'change' }]" label="返回格式" v-if="selSerType==1" prop="resp">
                      <el-radio-group v-model="item.resp" @change="changeResp">
                        <el-radio v-for='list in retformat' :key="list" :label="list">{{list}}</el-radio>
                      </el-radio-group>
                    </el-form-item> -->
                    <!-- <el-form-item :rules="[{ required: true, message: '请选择返回格式', trigger: 'change' }]" label="返回格式" v-if="selSerType==3" prop="resp">
                      <el-radio-group v-model="item.resp">
                        <el-radio label="JSON">JSON</el-radio>
                      </el-radio-group>
                    </el-form-item> -->
                    <!-- <el-form-item :rules="[{ required: true, message: '请选择原始接口响应类型', trigger: 'change' }]" label="原始接口响应类型" v-if="selSerType==3" prop="rtType">
                      <el-radio-group v-model="item.rtType">
                        <el-radio label="1">受影响记录数</el-radio>
                        <el-radio label="2">操作状态</el-radio>
                      </el-radio-group>
                    </el-form-item> -->
                    <el-form-item :rules="[{ required: true, message: '请选择返回格式', trigger: 'change' }]" label="返回格式" v-if="selSerType==2" prop="resp">
                      <el-radio-group v-model="item.resp">
                        <el-radio label="XML">XML</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item :rules="[{ required: true, message: '请输入接口返回示例', trigger: 'blur' }]" label="接口返回示例" v-if="item.resp!='XML'" prop="example">
                      <el-input type="textarea"  :autosize="{ minRows: 2, maxRows: 11 }" placeholder="请输入字符" v-model.trim="item.example"></el-input>
                    </el-form-item>
                    <el-form-item :rules="[{ required: true, message: '请选择接口返回示例', trigger: 'change' }]" label="接口返回示例" v-if="item.resp=='XML'" prop="selexample">
                      <el-radio-group v-model="item.selexample" @change="changeExample">
                        <el-radio label="1">Soap 1.1</el-radio>
                        <el-radio label="2">Soap 1.2</el-radio>
                      </el-radio-group>
                      <el-input type="textarea"   :autosize="true" placeholder="请输入字符" v-model.trim="item.example"></el-input>
                    </el-form-item>
                    <el-form-item :rules="[{ required: true, message: '请选择数据源', trigger: 'change' }]" label="选择数据源" v-if="selSerType==3" class="dbType_sel" prop="dsId">
                      <el-select v-model="item.dsId" placeholder="请选择" clearable @change="selDataSource(item)">
                        <el-option v-for='list in dataSourceList' :key="list.uid" :label="list.name" :value="list.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :rules="[{ required: true, message: '请选择操作类型', trigger: 'change' }]" label="选择操作类型" v-if="selSerType==3" prop="opt">
                      <el-radio-group v-model="item.opt" @change="selOpt(item)">
                        <el-radio v-for="item in OptTypes" :key="item.key" :label="item.key">{{item.desc}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item :rules="[{ required: true, message: '请上传接口文件', trigger: 'change' }]" label="上传接口文件" v-if="selSerType==4" prop="opt">
                    </el-form-item>
                    <el-tabs v-model="item.opt" v-if="selSerType==3">
                      <el-tab-pane v-if="item.opt==itemOpt.key" v-for="itemOpt in OptTypes" :key="itemOpt.key" :label="itemOpt.desc" :name="itemOpt.key">
                        <div>
                          <p class="tips" v-if="itemOpt.key=='query'">
                            <i class="el-icon-question"></i>
                            查询服务可以选择的查询对象包含视图或者实体表，暂不支持复杂条件、子查询或查询中包含函数、存储过程等调用的
                          </p>
                          <el-form-item label-width="80px" :label="itemOpt.key=='query'?'查询对象':'操作对象'">
                            <el-select v-model="item.target" placeholder="请选择" clearable @change="changeTarget(item)">
                              <el-option v-for='exp in item.ObjTypeList' :key="exp.name" :label="exp.remark" :value="exp.name"></el-option>
                            </el-select>
                            <el-radio-group v-model="item.selObjType" v-if="itemOpt.key=='query'" class="ObjRgpart" @change="changeObjType(item)">
                              <el-radio :label="1">表</el-radio>
                              <el-radio :label="2">视图</el-radio>
                            </el-radio-group>
                          </el-form-item>
                          <el-transfer v-if="itemOpt.key!='delete'" :titles="['字段列表', '返回属性']" v-model="item.column" :data="item.ObjTransferList"></el-transfer>
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
                                    <el-option v-for='exp in item.ObjTransferList' :key="exp.key" :label="exp.label" :value="exp.key"></el-option>
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
                                  <el-input v-if="scope.row.state=='1' && scope.row.type=='1'" v-model.trim="scope.row.value" placeholder="请输入字符" :disabled="disRelation"></el-input>
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
                          <el-form-item prop="rtType" label-width="80px" label="返回内容" :rules="[{ required: true, message: '请选择返回内容', trigger: 'change' }]">
                            <el-radio-group v-model="item.rtType">
                              <el-radio label="0">受影响记录数</el-radio>
                              <el-radio label="1">操作状态</el-radio>
                            </el-radio-group>
                          </el-form-item>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                    <el-form-item class="topFormBox" label='接口简介'>
                      <VueUEditor :ueditorConfig='editorConfig' @ready="editorReady"></VueUEditor>
                    </el-form-item>
                    <el-form-item class="topFormBox" label='服务分类'>
                      <el-tabs type="border-card">
                        <el-tab-pane label="输入参数">
                          <el-table :data="item.params" style="width: 100%">
                            <el-table-column label="名称">
                              <template slot-scope="scope">
                                <span v-if="scope.row.state=='0'">{{scope.row.name?scope.row.name:'/'}}</span>
                                <el-input v-else v-model.trim="scope.row.name" autofocus placeholder="请输入字符"></el-input>
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
                                <el-input v-else v-model.trim="scope.row.desc" placeholder="请输入字符"></el-input>
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
                                <el-input v-else v-model.trim="scope.row.name" placeholder="请输入字符"></el-input>
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
                                <el-input v-else v-model.trim="scope.row.desc" placeholder="请输入字符"></el-input>
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
                                <el-input v-else v-model.trim="scope.row.code" placeholder="请输入字符"></el-input>
                              </template>
                            </el-table-column>
                            <el-table-column label="说明">
                              <template slot-scope="scope">
                                <span v-if="scope.row.state=='0'">{{scope.row.text?scope.row.text:'/'}}</span>
                                <el-input v-else v-model.trim="scope.row.text" placeholder="请输入字符"></el-input>
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
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </el-form>
      </div>
      <div class="stepBtnr">
        <el-button type="warning" :disabled="nextActive" @click='next'>保存并返回</el-button>
        <el-button type="primary" :disabled="sureRegActive" @click='sureReg'>提交审核</el-button>
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
// function validatePass (rule, value, callback) {
//   const re = /^[A-Za-z]\w+(?:\/\{?\w+\}?)*$/i;
//   if (re.test(value)) {
//     callback();
//   } else {
//     callback(new Error("地址不符合RESTful规范"));
//   }
// };
export default {
  name: "register",
  components: {
    VueUEditor
  },
  props: ["editDataObj"],
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
      pathRule: [
        { required: true, message: "请输入接口发布地址", trigger: "blur" },
        { max: 200, min: 3, message: "长度3-200个字符", trigger: "blur" },
        { validator: validatePass, trigger: "blur" }
      ],
      sureRegFlag: false,
      nextActive: false,
      sureRegActive: false,
      loading: true,
      servTypeList: [], // 服务分类
      dbTypes: [],
      dataSourceList: [], // 选择数据源
      OptTypes: [], //查询数据源操作类型信息

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
      datatype: ["String", "Boolean", "Number"], //数据类型
      Settings: "", //访问地址前缀
      servId: "",
      selSerType: 0
    };
  },
  created() {
    this.$store.commit('SET_formLeave', true)
    this.selSerType = +this.editDataObj.type;
    this.getBaseData();
  },
  watch: {
    ediTabNum() {
      let tabs = this.editableTabs;
      let active = this.editableTabsValue;
      let that = this;
      tabs.forEach((tab, index) => {
        if (tab.tabInd == active) {
          that.curEditTabs = index;
        }
      });
    },
    editableTabsValue() {
      let tabs = this.editableTabs;
      let active = this.editableTabsValue;
      let that = this;
      tabs.forEach((tab, index) => {
        if (tab.tabInd == active) {
          that.curEditTabs = index;
        }
      });
    }
  },
  methods: {
    init() {
      this.editableTabs = this.editDataObj.apis.map((item, index) => {
        let obj = {
          title: `接口${++index}`,
          ObjTypeList: [],
          ObjTransferList: [],
          TablesList: [],
          ViewsList: [],
          tabInd: index + "",
          selexample: "1",
          selObjType: 1,
          queryList: [
            ...item.params,
            {
              name: "新增参数"
            }
          ],
          ...item
        };
          
        if(item.type == '2') {
            obj.resp = 'XML'
        }        
        if (item.params) {
          obj.params = item.params.map(item => {
            return {
              id: item.id,
              state: "0", //0 编辑  1 保存
              name: item.name,
              required: item.required == "1" ? true : false,
              type: item.type,
              desc: item.desc,
              foucs: false
            };
          });
        }

        if (item.responses) {
          obj.responses = item.responses.map(item => {
            return {
              id: item.id,
              state: "0", //0 编辑  1 保存
              name: item.name,
              required: item.required == "1" ? true : false,
              type: item.type,
              desc: item.desc,
              foucs: false
            };
          });
        }

        if (item.errors) {
          obj.errors = item.errors.map(item => {
            return {
              id: item.id,
              state: "0", //0 编辑  1 保存
              name: item.name,
              required: item.required == "1" ? true : false,
              type: item.type,
              desc: item.desc,
              foucs: false,
              code: item.code,
              text: item.text
            };
          });
        }
        if (this.selSerType == 3 && item.conditions) {
          obj.conditions = item.conditions.map(item => {
            return {
              id: item.id,
              apiId: item.apiId,
              name: item.name,
              relation: item.relation,
              servId: item.servId,
              type: item.type,
              value: item.value,
              state: "0" //0 编辑  1 保存
            };
          });
        }
        if (this.selSerType == 3 && item.columns) {
          obj.column = item.columns.map(item => {
            return item.column;
          });
        }

        return obj;
      });
      if (this.selSerType == 3) {
        this.editableTabs.forEach(item => {
          this.selDataSource(item);
          // this.changeObjType(item);
          this.changeTarget(item);
        });
      }

      this.ediTabNum = this.editableTabs.length;
      this.loading = false;
    },
    // 获取服务分类
    getBaseData() {
      var query = { group: "servType" };
      if (this.selSerType == 3) {
        Promise.all([
          dicty.getBaseData(query),
          dicty.getdbTypes(),
          dicty.getDatasources(),
          dicty.getOptTypes(),
          dicty.getRelations(),
          dicty.getSettings()
        ])
          .then(arr => {
            this.servTypeList = arr[0].data;
            this.dbTypes = arr[1].data;
            this.dataSourceList = arr[2].data;
            this.OptTypes = arr[3].data;
            this.conditionList = arr[4].data;
            this.Settings = arr[5].data.servUrl;
          })
          .then(() => {
            this.init();
          });
      } else {
        Promise.all([dicty.getBaseData(query), dicty.getSettings()])
          .then(arr => {
            this.servTypeList = arr[0].data;
            this.Settings = arr[1].data.servUrl;
          })
          .then(() => {
            this.init();
          });
      }

      // dicty.getBaseData(query).then(response => {
      //   this.servTypeList = response.data;
      // });
      // dicty.getdbTypes().then(response => {
      //   this.dbTypes = response.data;
      // });
      // dicty.getDatasources().then(response => {
      //   this.dataSourceList = response.data;
      // });

      // dicty.getOptTypes().then(response => {
      //   this.OptTypes = response.data;
      // });
      // dicty.getRelations().then(response => {
      //   this.conditionList = response.data;
      // });
      // // 访问前缀
      // dicty.getSettings().then(response => {
      //   this.Settings = response.data.servUrl;
      // });
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
        ObjTypeList: [],
        ObjTransferList: [],
        tabInd: tabInd,
        opt: "query",
        selObjType: 1,
        column: [],
        rtType: '0',
        intro: "",
        selexample: "1",
        example: exampleSel,
        resp: respSel,
        method: "",
        queryList: [
          // {
          //   //输入参数
          //   name: "appKey",
          //   required: true, //0：否  1：是
          //   type: "String",
          //   desc: "申请调用的appKey",
          //   state: "0" //0 编辑  1 保存
          // },
          {
            name: "新增参数"
          }
        ],
        params: [
          {
            //输入参数
            name: "appKey",
            required: true, //0：否  1：是
            type: "String",
            desc: "申请调用的appKey",
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
      if (activeName == targetName) {
        tabs.forEach((tab, index) => {
          if (tab.tabInd == targetName) {
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
    selDataSource(data) {
      let ele = "";
      this.dataSourceList.forEach(item => {
        if (item.id == data.dsId) {
          ele = item.uid;
        }
      });
      // this.editableTabs[this.curEditTabs].target = "";
      // this.editableTabs[this.curEditTabs].column = [];
      data.ObjTransferList = [];

      var condobj = data.conditions;
      if (condobj) {
        condobj.forEach(function(item, index) {
          if (item.name) item.name = "";
        });
      }
      var query = { uid: ele };
      dicty.getTables(query).then(response => {
        data.ObjTypeList = data.TablesList = response.data;
        data.ObjTypeList.forEach(item => {
          if (item.name == data.target) {
            data.selObjType = 1;
          }
        });
      });
      dicty.getViews(query).then(response => {
        data.ViewsList = response.data;
        data.ViewsList.forEach(item => {
          if (item.name == data.target) {
            data.selObjType = 2;
          }
        });
      });
    },
    // 注册--数据流注册--接口列表--查询对象
    changeObjType(data) {
      let val = data.selObjType;
      data.target = "";
      data.ObjTransferList = [];
      var condobj = this.editableTabs[this.curEditTabs].conditions;
      if (condobj) {
        condobj.forEach(function(item, index) {
          if (item.name) item.name = "";
        });
      }
      if (val == 1) {
        data.ObjTypeList = data.TablesList;
      } else {
        data.ObjTypeList = data.ViewsList;
      }
    },
    // 注册--数据流注册--接口列表--查询对象
    changeTarget(data) {
      let val = data.target;
      // this.editableTabs[this.curEditTabs].column = [];
      data.ObjTransferList = [];
      var condobj = this.editableTabs[this.curEditTabs].conditions;
      if (condobj) {
        condobj.forEach(function(item, index) {
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
          data.ObjTransferList.push({
            key: item.name,
            label: item.remark.split("：")[0]
          });
        });
      });
    },
    // 注册--数据流注册--接口列表--选择操作类型
    selOpt(data) {
      let val = data.opt;
      this.editableTabs[this.curEditTabs].target = "";
      this.editableTabs[this.curEditTabs].selObjType = 1;

      data.ObjTransferList = [];
      var condobj = this.editableTabs[this.curEditTabs].conditions;
      if (condobj) {
        condobj.forEach(function(item, index) {
          if (item.name) item.name = "";
        });
      }
      if (val != "query") {
        data.ObjTypeList = data.TablesList;
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
      submitD.useof = this.editDataObj.useof; //选择服务用途
      submitD.type = this.editDataObj.type; //选择的服务类型
      submitD.name = this.editDataObj.name ? this.editDataObj.name : ""; //服务名称
      submitD.id = this.editDataObj.id; //服务分类
      submitD.tag = this.editDataObj.tag; //服务分类
      submitD.intro = this.editDataObj.intro; //服务简介
      submitD.detail = this.editDataObj.detail ? this.editDataObj.detail : "空"; //服务详情
      submitD.apis = []; //接口列表
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
        submitD.apis.push(exp);
      });
      if (this.selSerType == 1) {
        //rest---http api
        this.editableTabs.forEach((item, index) => {
          submitD.apis[index].id = item.id;
          submitD.apis[index].example = item.example; //接口返回示例
          submitD.apis[index].url = item.url; //接口地址
          // submitD.apis[index].method = item.method; //请求方式
          submitD.apis[index].path = item.path;
          submitD.apis[index].resp = item.resp; //返回格式
        });
        this.checkNext("updateRest", submitD);
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
        });
        this.checkNext("updateSoap", submitD);
      }
      if (this.selSerType == 3) {
        //rest---数据源
        var that = this;
        this.editableTabs.forEach((item, index) => {
          submitD.apis[index].id = item.id;
          submitD.apis[index].dsId = item.dsId;
          submitD.apis[index].example = item.example; //接口返回示例
          submitD.apis[index].url = item.url; //接口地址
          // submitD.apis[index].method = item.method; //请求方式
          submitD.apis[index].resp = item.resp; //返回格式
          submitD.apis[index].dsId = item.dsId; //返回格式
          // that.dataSourceList.forEach(function(objData, ind) {
          //   //数据源
          //   if (item.dsId == objData.uid) {
          //     submitD.apis[index].dsId = objData.id;
          //   }
          // });
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
        });
        this.checkNext("updateDataSet", submitD);
      }
    },
    checkNext(method, submitD) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let bool = this.editableTabs.every((item, index) => {
            let i;
            this.$refs[item.tabInd][0].validate(valid => {
              if (valid) {
                i = true;
              } else {
                i = false;
                // 这里也要让审核通过按钮状态回复
                this.sureRegFlag = false;
                this.sureRegActive = false;
                return false;
              }
            });
            return i;
          });
          if (bool) {
            // 所有的表单验证通过
            this.nextActive = true;
            api[method](submitD)
              .then(res => {
                if (res.status == "200") {
                  this.servId = this.editDataObj.id;
                  if (this.sureRegFlag) {
                    this.save();
                  } else {
                    this.$notify({
                      title: "成功",
                      message: "创建成功",
                      type: "success",
                      duration: 2000
                    });
                    this.$store.commit('SET_formLeave', false)
                    this.$emit("clickServiceManegement");
                    this.$store.dispatch("getNoticeNumber");
                  }
                } else {
                  this.$notify({
                    title: "失败",
                    message: res.data.message,
                    type: "error",
                    duration: 2000
                  });
                }
                this.nextActive = false;
              })
              .catch(() => {
                this.nextActive = false;
              });
          }
        } else {
          this.nextActive = false;
          return false;
        }
      });
    },
    save() {
      var submitD = {
        servId: this.servId,
        userId: ""
      };
      api
        .putSubmit(submitD)
        .then(res => {
          if (res.status == "200") {
            this.$notify({
              title: "成功",
              message: "提交成功",
              type: "success",
              duration: 2000
            });
            this.$store.commit('SET_formLeave', false)
            this.$store.dispatch("GET_fuwindex_on", [
              true,
              false,
              false,
              false
            ]);
            this.$emit("clickServiceManegement");
          } else {
            this.$notify({
              title: "失败",
              message: res.message,
              type: "error",
              duration: 2000
            });
          }
          this.sureRegFlag = false;
          this.sureRegActive = false;
        })
        .catch(() => {
          this.sureRegFlag = false;
          this.sureRegActive = false;
        });
    },
    // 提交审核
    sureReg() {
      this.sureRegFlag = true;
      this.sureRegActive = true;
      this.next();
    }
  }
};
</script>