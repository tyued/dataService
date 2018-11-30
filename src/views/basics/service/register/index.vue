<template>
  <el-col :span="24">
    <div class="regCon">
      <h3 class="regH3">服务注册</h3>
      <el-steps :active="active" finish-status="success">
        <el-step title="选择服务用途"></el-step>
        <el-step title="选择服务类型"></el-step>
        <el-step title="填写注册信息"></el-step>
        <el-step title="提交审核"></el-step>
      </el-steps>
      <div class="act_stepBox">
        <el-form label-position="top" label-width="80px" :model="formLabelStep1" class="formStep1" v-if="active==0">
          <el-form-item label="请根据接口用途、适用的场景：">
            <el-radio-group v-model="formLabelStep1.useof">
              <el-radio :label="1">内部接口（仅校内使用）</el-radio>
              <el-radio :label="2">开放接口（可供其他学校或平台使用）</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-row :gutter="20" v-if="active==1">
          <el-col :span="6" v-for="(item,index) in stepTypeList" v-bind:key="index">
            <div @click="selStepType(item)" :class="{'on':item.sel}">
              <el-card class="box-card" v-if="item.show">
                <div class="stepTypeBox">{{item.name}}</div>
              </el-card>
            </div>
          </el-col>
        </el-row>
        <el-form label-width="120px" :model="formLabelStep3" class="formStep3" v-if="active==2" ref="form">
          <el-form-item :rules="[{ required: true, message: '请输入服务名称', trigger: 'blur' },{ max: 50, min: 3, message: '长度3-50个字符', trigger: 'blur' }]" label="服务名称" prop="name">
            <el-input v-model.trim="formLabelStep3.name" placeholder="3-50个字符"></el-input>
          </el-form-item>
          <el-form-item :rules="[{ required: true, message: '请选择服务分类', trigger: 'change' }]" label="服务分类" prop="tag">
            <el-radio-group v-model="formLabelStep3.tag">
              <el-radio v-for="item in servTypeList" :key="item.key" :label="item.key" border>{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :rules="[{ required: true, message: '请输入服务简介', trigger: 'blur' },{ max: 400, min: 3, message: '长度3-400个字符', trigger: 'blur' }]" label="服务简介" prop="intro">
            <el-input :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" v-model.trim="formLabelStep3.intro"></el-input>
          </el-form-item>
          <el-form-item label='服务详情'>
            <VueUEditor :ueditorConfig='editorConfig' @ready="editorReadyServ"></VueUEditor>
          </el-form-item>
          <div class="nozzleList">
            <div class="nozz-label">接口列表<el-button class="addNozz" size="small" @click="addTab(editableTabsValue)" icon="el-icon-plus"></el-button>
            </div>
            <div class="nozz-box">
              <el-tabs type="border-card" v-model="editableTabsValue" closable @tab-remove="removeTab">
                <el-tab-pane v-for="(item) in editableTabs" :key="item.tabInd" :label="item.title" :name="item.tabInd">
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
                    <el-form-item v-if="selSerType == 2" :rules="[{ required: true, message: '请输入原始方法名称', trigger: 'blur' },{ max: 200, min: 3, message: '长度3-200个字符', trigger: 'blur' }]" label="原始方法名称" prop="method">
                      <el-input v-model.trim="item.method" placeholder="3-200个字符"></el-input>
                    </el-form-item>
                    <el-form-item required label="外部访问地址" v-if="selSerType!=4">
                      <el-input v-if="selSerType == 1" :value="`${Settings}/http/{uuid}/{version}${item.path ? '/' + item.path : ''}`" disabled></el-input>
                      <el-input v-if="selSerType == 2" :value="`${Settings}/soap/{uuid}/${item.method}_{version}`" disabled></el-input>
                      <el-input v-if="selSerType == 3" :value="`${Settings}/dataset/{uuid}/{version}${item.path ? '/' + item.path : ''}`" disabled></el-input>
                    </el-form-item>
                    <el-form-item v-if="selSerType == 1" :rules="[{ required: true, message: '请选择请求方式', trigger: 'change' }]" label="请求方式" prop="method">
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
                      <el-input type="textarea" :rows="11" placeholder="请输入字符" v-model.trim="item.example"></el-input>
                    </el-form-item>
                    <el-form-item :rules="[{ required: true, message: '请选择接口返回示例', trigger: 'change' }]" label="接口返回示例" v-if="item.resp=='XML'" prop="selexample">
                      <el-radio-group v-model="item.selexample" @change="changeExample">
                        <el-radio label="1">Soap 1.1</el-radio>
                        <el-radio label="2">Soap 1.2</el-radio>
                      </el-radio-group>
                      <el-input type="textarea" :autosize="true" placeholder="请输入字符" v-model.trim="item.example"></el-input>
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
                    <!-- <el-form-item required label="发布路径规则" v-if="selSerType==3">
                    <el-input v-model="item.path" placeholder="3-20个字符"></el-input>
                  </el-form-item> -->
                    <el-form-item :rules="[{ required: true, message: '请上传接口文件', trigger: 'change' }]" label="上传接口文件" v-if="selSerType==4" prop="opt">
                      <!-- <el-upload class="upload-demo"
                                            action="https://jsonplaceholder.typicode.com/posts/"
                                            :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove"
                                            multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
                                            <el-button size="small" type="primary">点击上传</el-button>
                                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                        </el-upload>-->
                    </el-form-item>
                    <el-tabs v-model="item.opt" v-if="selSerType==3">
                      <el-tab-pane v-if="item.opt==itemOpt.key" v-for="itemOpt in OptTypes" :key="itemOpt.key" :label="itemOpt.desc" :name="itemOpt.key">
                        <div>
                          <p class="tips" v-if="itemOpt.key=='query'">
                            <i class="el-icon-question"></i>
                            查询服务可以选择的查询对象包含视图或者实体表，暂不支持复杂条件、子查询或查询中包含函数、存储过程等调用的
                          </p>
                          <el-form-item :label="itemOpt.key=='query'?'查询对象':'操作对象'">
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
                              <!--<el-col :span="12">
                                  <div class="boxrig">
                                      <el-button type="primary" size="small" plain>预览SQL</el-button>
                                      <el-button type="primary" size="small" plain>预览返回结果</el-button>
                                  </div>
                              </el-col>-->
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
                          <el-form-item prop="rtType" label="返回内容" :rules="[{ required: true, message: '请选择返回内容', trigger: 'change' }]">
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
        <el-button @click='prev' v-if='active!=3 && active!=0'>上一步</el-button>
        <el-button type="primary" :disabled="nextActive" @click='next' v-if="active!=3">{{active==2?'保存':'下一步'}}</el-button>
        <el-button type="primary" :disabled="sureRegActive" @click='sureReg' v-if="active==3">提交审核</el-button>
      </div>
    </div>
    <el-dialog center :title="textMap[dialogStatus]" :visible.sync="dialogVisible_user" width="600px">
      <div class="diag_tipsBox">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non nu</div>
      <el-checkbox v-model="agreeuser">我已认真阅读该协议</el-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_user = false">取 消</el-button>
        <el-button type="primary" @click="Clickagreeuser">同 意</el-button>
      </span>
    </el-dialog>
    <el-dialog center :title="textMap[dialogStatus]" :visible.sync="dialogVisible_nazz" width="600px">
      <div class="diag_tipsBox">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non nu</div>
      <el-checkbox v-model="agreenazz">我已认真阅读该协议</el-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_nazz = false">取 消</el-button>
        <el-button type="primary" @click="Clickagreenazz">同 意</el-button>
      </span>
    </el-dialog>
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
      nextActive: false,
      sureRegActive: false,
      active: 0, //当前步骤
      formLabelStep1: {
        useof: 1
      },
      stepTypeList: [
        { name: "HTTP API", type: "1", sel: true, show: false },
        { name: "WebService API", type: "2", sel: false, show: false },
        { name: "数据源服务", type: "3", sel: false, show: false }
        // {name:'上传服务接口',type:'4',sel:false},
      ],
      selSerType: "", //选择服务类型   --选中的
      formLabelStep3: {},
      servTypeList: [],
      dbTypes: [],
      dataSourceList: [],
      OptTypes: [], //查询数据源操作类型信息
      textMap: {
        //判断弹层
        agreeuser: "用户许可协议",
        agreenazz: "接口须知"
      },
      dialogVisible_user: false, //用户许可协议
      dialogStatus: "",
      agreeuser: false, //用户许可协议
      dialogVisible_nazz: false, //接口须知
      agreenazz: false,
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

      disRelation: false, //是否值类型能填
      valtypeList: [
        //值类型
        { name: "常量", key: "1" },
        { name: "变量", key: "2" }
      ],
      conditionList: [], //条件与条件值关系
      TablesList: [],
      ViewsList: [],
      editableTabs: [
        {
          title: "接口1",
          ObjTypeList: [],
          ObjTransferList: [],
          tabInd: "1",
          opt: "query",
          selObjType: 1,
          target: "",
          column: [],
          rtType: '0',
          intro: "",
          selexample: "1",
          example: "",
          resp: "JSON", //返回格式
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
              foucs: false,
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
        }
      ],

      ediTabNum: "",
      curEditTabs: 0,
      tabIndex: 1, //条件及参数设定 table
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
            "formatmatch"
          ]
          //   [
          //   'fullscreen', 'source', '|', 'undo', 'redo', '|',
          //   'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
          //   'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
          //   'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
          //   'directionalityltr', 'directionalityrtl', 'indent', '|',
          //   'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
          //   'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
          //   'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvid eo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
          //   'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
          //   'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
          //   'print', 'preview', 'searchreplace', 'drafts', 'help'
          // ]
        ]
      },
      datatype: ["String", "Boolean", "Number"], //数据类型

      Settings: "", //访问地址前缀
      servId: ""
    };
  },
  computed: {
    ...mapGetters(["rightInfoObj"])
  },
  created() {
    this.stepTypeList[0].show = this.rightInfoObj["http-serv-registry"]
      ? true
      : false;
    this.stepTypeList[1].show = this.rightInfoObj["soap-serv-registry"]
      ? true
      : false;
    this.stepTypeList[2].show = this.rightInfoObj["dataset-serv-registry"]
      ? true
      : false;
    this.getBaseData();
    this.ediTabNum = this.editableTabs.length;
  },
  watch: {
    active(val) {
      if (val === 2) {
        this.$store.commit('SET_formLeave', true)
      } else {
        this.$store.commit('SET_formLeave', false)
      }
    },
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
    // 上一步
    prev() {
      var actpart = this.active;
      if (actpart == 1) {
        this.active--;
      }
      if (actpart == 2) {
        this.$confirm("数据尚未保存，确定要离开吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.editableTabsValue = "1";
          this.editableTabs = [
            {
              title: "接口1",
              ObjTypeList: [],
              ObjTransferList: [],
              tabInd: "1",
              opt: "query",
              selObjType: 1,
              target: "",
              column: [],
              rtType: '0',
              intro: "",
              selexample: "1",
              example: "",
              resp: "JSON", //返回格式
              method: "", //返回格式
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
                  foucs: false,
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
            }
          ];
          this.tabIndex = 1;
          this.active--;
        });
      }
      // if (this.active < 1) return false;
      // if (this.active-- < 1) return false;
    },
    // 下一步
    next() {
      var actpart = this.active;
      if (actpart == 0) {
        this.agreeuser = false;
        this.dialogVisible_user = true;
        this.dialogStatus = "agreeuser";
      }
      if (actpart == 1) {
        // 清空表单
        this.formLabelStep3 = {};
        this.agreenazz = false;
        this.dialogVisible_nazz = true;
        this.dialogStatus = "agreenazz";
        this.stepTypeList.forEach((item, index) => {
          if (item.sel) {
            this.selSerType = item.type;
          }
        });
        if (this.selSerType == 2) {
          this.editableTabs[0].resp = "XML";
          this.editableTabs[0].example = expSoap1;
        } else {
          this.editableTabs[0].resp = "JSON";
          this.editableTabs[0].example = "";
        }
      }
      if (actpart == 2) {
        var submitD = {};
        submitD.useof = this.formLabelStep1.useof; //选择服务用途
        submitD.type = this.selSerType; //选择的服务类型
        submitD.name = this.formLabelStep3.name ? this.formLabelStep3.name : ""; //服务名称
        submitD.tag = this.formLabelStep3.tag; //服务分类
        submitD.intro = this.formLabelStep3.intro; //服务简介
        submitD.detail = this.formLabelStep3.detail
          ? this.formLabelStep3.detail
          : "空"; //服务详情
        submitD.apis = []; //接口列表

        this.editableTabs.forEach(function(item, index) {
          var exp = {};
          exp.name = item.name; //接口中文名称
          exp.intro = item.intro ? item.intro : "空";
          exp.params = [];
          exp.responses = [];
          exp.errors = [];
          item.params.forEach(function(obj, ind) {
            obj.key = obj.name;
            obj.required = obj.required ? "1" : "0";
            if (obj.state == "0") {
              //保存过的
              exp.params.push(obj);
            }
          });
          item.responses.forEach(function(obj, ind) {
            obj.key = obj.name;
            if (obj.state == "0") {
              //保存过的
              exp.responses.push(obj);
            }
          });
          item.errors.forEach(function(obj, ind) {
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
            submitD.apis[index].example = item.example; //接口返回示例
            submitD.apis[index].url = item.url; //接口地址
            submitD.apis[index].path = item.path;
            // submitD.apis[index].method = item.method; //请求方式
            submitD.apis[index].resp = item.resp; //返回格式
          });
          this.checkNext("putRest", submitD);
        }
        if (this.selSerType == 2) {
          //rest---webservice
          this.editableTabs.forEach(function(item, index) {
            submitD.apis[index].example = item.example; //接口返回示例
            submitD.apis[index].url = item.url; //接口地址
            submitD.apis[index].path = item.method;
            submitD.apis[index].namespace = item.namespace; //命名空间
            submitD.apis[index].method = item.method; //请求方式
            submitD.apis[index].resp = item.resp; //返回格式
            // submitD.apis[index].method = submitD.apis[index].path = item.method  //方法名称
          });
          this.checkNext("putSoap", submitD);
        }
        if (this.selSerType == 3) {
          //rest---数据源
          var that = this;
          this.editableTabs.forEach((item, index) => {
            submitD.apis[index].example = item.example; //接口返回示例
            submitD.apis[index].url = item.url; //接口地址
            // submitD.apis[index].method = item.method; //请求方式
            submitD.apis[index].resp = item.resp; //返回格式
            submitD.apis[index].dsId = item.dsId; 
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
          this.checkNext("putDataSet", submitD);
        }
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
                // this.sureRegFlag = false;
                // this.sureRegActive = false;
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
                  this.servId = res.data.servId;
                  if (this.sureRegFlag) {
                    this.save();
                  } else {
                    this.$notify({
                      title: "成功",
                      message: "创建成功",
                      type: "success",
                      duration: 2000
                    });
                    this.active = 3;
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
    //同意 用户协议
    Clickagreeuser() {
      if (!this.agreeuser) {
        this.$message.error("请先同意服务条款");
        return;
      }
      this.dialogVisible_user = false;
      // window.localStorage.setItem("agreeuser", this.agreeuser);
      this.active = 1;
    },
    //同意 接口须知
    Clickagreenazz() {
      if (!this.agreenazz) {
        this.$message.error("请先同意服务条款");
        return;
      }
      this.dialogVisible_nazz = false;
      // window.localStorage.setItem("agreenazz", this.agreenazz);
      this.active = 2;
    },
    // 第二步选择服务类型
    selStepType(item) {
      this.stepTypeList.forEach(function(obj, ind) {
        obj.sel = false;
      });
      const index = this.stepTypeList.indexOf(item);
      this.stepTypeList[index].sel = true;
    },
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
      let tabInd = ++this.tabIndex + "";
      this.editableTabs.push({
        title: "接口" + tabInd,
        ObjTypeList: [],
        ObjTransferList: [],
        tabInd: tabInd,
        opt: "query",
        selObjType: 1,
        column: [],
        rtType: 0,
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
      this.editableTabs[this.curEditTabs].target = "";
      this.editableTabs[this.curEditTabs].column = [];
      data.ObjTransferList = [];

      var condobj = data.conditions;
      if (condobj) {
        condobj.forEach(function(item, index) {
          if (item.name) item.name = "";
        });
      }
      var query = { uid: ele };
      dicty.getTables(query).then(response => {
        data.ObjTypeList = this.TablesList = response.data;
      });
      dicty.getViews(query).then(response => {
        this.ViewsList = response.data;
      });
    },
    // 注册--数据流注册--接口列表--查询对象
    changeObjType(data) {
      let val = data.selObjType;
      this.editableTabs[this.curEditTabs].target = "";
      data.ObjTransferList = [];
      var condobj = this.editableTabs[this.curEditTabs].conditions;
      if (condobj) {
        condobj.forEach(function(item, index) {
          if (item.name) item.name = "";
        });
      }
      if (val == 1) {
        data.ObjTypeList = this.TablesList;
      } else {
        data.ObjTypeList = this.ViewsList;
      }
    },
    // 注册--数据流注册--接口列表--查询对象
    changeTarget(data) {
      let val = data.target;
      this.editableTabs[this.curEditTabs].column = [];
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
        data.ObjTypeList = this.TablesList;
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
      editorInstance.addListener("contentChange", () => {
        this.editableTabs[this.curEditTabs].intro = editorInstance.getContent();
      });
    },
    editorReadyServ(editorInstance) {
      editorInstance.addListener("contentChange", () => {
        this.formLabelStep3.detail = editorInstance.getContent();
      });
    },
    // 提交审核
    sureReg() {
      this.sureRegActive = true;
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
          this.sureRegActive = false;
        })
        .catch(() => {
          this.sureRegActive = false;
        });
    }
  }
};
</script>