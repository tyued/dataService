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
                            <el-card class="box-card">
                                <div class="stepTypeBox">{{item.name}}</div>
                            </el-card>
                        </div>
                    </el-col>
                </el-row>
                <el-form label-width="120px" :model="formLabelStep3" class="formStep3" v-if="active==2">
                    <el-form-item label="服务名称">
                        <el-input v-model="formLabelStep3.name" placeholder="3-20个字符"></el-input>
                    </el-form-item>
                    <el-form-item label="服务分类">
                        <el-radio-group v-model="formLabelStep3.type">
                            <el-radio v-for="item in servTypeList" :key="item.key" :label="item.value" border></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="nozzleList">
                        <div class="nozz-label">接口列表</div>
                        <div class="nozz-box">
                            <el-button class="addNozz" size="small" @click="addTab(editableTabsValue)" icon="el-icon-plus"></el-button>
                            <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
                                <el-tab-pane v-for="(item, index) in editableTabs" :key="item.tabInd" :label="item.title" :name="item.tabInd">
                                    <el-form-item label="接口中文名称">
                                        <el-input v-model="item.name" placeholder="3-20个字符"></el-input>
                                    </el-form-item>
                                    <el-form-item label="接口英文名称">
                                        <el-input v-model="item.ename" placeholder="3-20个字符"></el-input>
                                    </el-form-item>
                                    <el-form-item label="接口地址">
                                        <el-input v-model="item.url" placeholder="3-20个字符"></el-input>
                                    </el-form-item>
                                    <el-form-item label="选择数据源" class="dbType_sel">
                                        <!--<el-select v-model="item.dsId" placeholder="请选择" clearable>
                                            <el-option v-for='(item,index) in dbTypes' v-bind:key="index" :label="item.vendor" :value="item.key"></el-option>
                                        </el-select>-->
                                    </el-form-item>
                                    <el-form-item label="选择操作类型">
                                        <el-radio-group v-model="item.opt" @change="selOpt">
                                            <el-radio v-for="item in OptTypes" :key="item.key" :label="item.key">{{item.desc}}</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-tabs v-model="item.opt">
                                        <el-tab-pane v-if="item.opt==itemOpt.key" v-for="itemOpt in OptTypes" :key="itemOpt.key" :label="itemOpt.desc" :name="itemOpt.key">
                                            <div v-if="itemOpt.key=='query'">
                                                <p class="tips">
                                                    <i class="el-icon-question"></i>
                                                    查询服务可以选择的查询对象包含视图或者实体表，暂不支持复杂条件、子查询或查询中包含函数、存储过程等调用的
                                                </p>
                                                <el-form-item label="查询对象">
                                                    <el-input v-model="item.url" placeholder="3-20个字符"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-tab-pane>

                                    </el-tabs>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </el-form>
            </div>
            <div class="stepBtnr">
                <el-button @click='prev'>取 消</el-button>
                <el-button type="primary" @click='next'>下一步</el-button>
            </div>   
        </div>
        <el-dialog center :title="textMap[dialogStatus]" :visible.sync="dialogVisible_user" width="600px">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_user = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible_user = false">确 定</el-button>
            </span>
        </el-dialog>
    </el-col>
</template>


<script>
import * as dicty from 'api/dictionary';
export default {
    name:'pageRegister',
    data() {
        return {
            active:0,              //当前步骤
            formLabelStep1:{
                useof:1
            },
            stepTypeList:[
                {name:'HTTP API',type:'1',sel:true},
                {name:'WebService API',type:'2',sel:false},
                {name:'通过数据源发布',type:'3',sel:false},
                {name:'上传服务接口',type:'4',sel:false},
            ],
            formLabelStep3:{},
            servTypeList:[],
            dbTypes:[],
            OptTypes:[],        //查询数据源操作类型信息

            textMap: {                              //判断弹层
                useragree: '用户许可协议',
                nazzagree: '接口须知'
            },  
            dialogVisible_user: false,              //用户许可协议
            dialogStatus: '',  

            editableTabsValue: '1',
            editableTabs: [{
                title: '接口1',
                tabInd: '1',
                opt:"query",
            }],
            tabIndex: 1
    
        }
    },
    created(){
        this.getBaseData()
        
    },
    mounted() {
        
    },
    watch: {
        
    },
    computed: {
    },
    methods:{
        // 上一步
        prev(){
            if (this.active < 1) return false;
            if (this.active-- < 1) return false;
        },
        // 下一步
        next(){
            if (this.active ==3 ) return false;
            if (this.active++ > 2) return false;
            if (this.active == 1){
                // this.dialogVisible_user = true;
                this.dialogStatus = 'useragree'
            }

        },
        // 第二步选择服务类型
        selStepType(item){
            this.stepTypeList.forEach(function(obj,ind){
                obj.sel = false
            })
            const index = this.stepTypeList.indexOf(item)
            this.stepTypeList[index].sel= true
        },
        // 获取服务分类
        getBaseData(){
            var query = {group:'servType'}
            dicty.getBaseData(query).then(response => {
                this.servTypeList = response.data
            });
            dicty.getdbTypes().then(response => {
                this.dbTypes = response.data
            });
            dicty.getOptTypes().then(response => {
                this.OptTypes = response.data
                console.log(this.OptTypes)
            });
            
        },
        // 添加接口列表
        addTab(targetName) {
            let tabInd = ++this.tabIndex + '';
            this.editableTabs.push({
                title: '接口'+tabInd,
                tabInd: tabInd,
                opt:"query",
            });
            this.editableTabsValue = tabInd;
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
                });          }
            
            this.editableTabsValue = activeName;
            this.editableTabs = tabs.filter(tab => tab.tabInd !== targetName);
        },

        selOpt(val){
            console.log(val)
        }
    }
}
</script>