<template>   
    <el-col :span="24">
        <el-card class="box-card">
            <el-col :span="24">
                <div class="colLeft">
                    <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新建数据源</el-button>
                </div>              
                <div class="colRight">
                    <el-input placeholder="请输入内容" class="input-with-select" style="width: 280px;" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <el-button icon="el-icon-download">下载</el-button>
                    <el-button icon="el-icon-tickets">筛选</el-button>
                    <div class="ticksxTab">
                        
                    </div>
                </div>
            </el-col>
            <el-table v-loading.body="listLoading" :data="tableData" style="width: 100%" height="580">
                <el-table-column prop="name" label="数据源名称"></el-table-column>
                <el-table-column prop="dbtype" label="数据库类型"></el-table-column>
                <el-table-column prop="timestamp" label="创建时间"></el-table-column>
                <el-table-column prop="desc" label="摘要"></el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" type="success" @click="handleUpdata">编辑</el-button>
                        <el-button size="small" type="danger">删除</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
            </div>
        </el-card>
        <el-dialog center :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="660px" >
            <el-form :model="form" ref="form" label-width="110px">
                <el-form-item label="数据源名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="数据库类型">
                    <el-select v-model="form.dbtype" placeholder="请数据库类型" @change="change_dbType">
                        <el-option v-for='(item,index) in dbTypes' v-bind:key="index" :label="item.vendor" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据库IP">
                    <el-input v-model="form.ipv4"></el-input>
                </el-form-item>
                <el-form-item label="数据库访问端口">
                    <el-input v-model="form.port"></el-input>
                </el-form-item>
                <el-form-item label="数据库实例名称">
                    <el-input v-model="form.uid"></el-input>
                </el-form-item>
                <el-form-item label="连接字符串" class="linkBlock">
                    <el-input v-model="form.dburl" style="width:165px;"></el-input>
                    <el-input v-model="form.ipv4"></el-input>
                    <el-input v-model="':'+form.port" style="width:80px;"></el-input>
                    <el-input v-model="form.uid"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>             
                <el-form-item label="数据库摘要">
                    <VueUEditor :ueditorConfig='editorConfig'></VueUEditor>
                </el-form-item>
            </el-form>         
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" :disabled="changeSure">确 定</el-button>
                <el-button v-else type="primary" @click="update('form')" :disabled="changeSure">确 定</el-button>
            </div>   
        </el-dialog>

    </el-col>
</template>


<script>
import VueUEditor from 'vue-ueditor'
import * as api from 'api/service/dataservice/index';

export default {
    name:'pageDataservice',
    components: {
        VueUEditor
    },
    data() {
        return {
            listLoading:true,
            listQuery: {    
                dbtype:'',              //数据库类型
                pageNo: 1,
                limit: 20,
                name: undefined,
                sortName:'',
                sortOrder:''
            },
            total:null,                 //总页数
            tableData: [],

            dbTypes:[],                 //数据库类型信息

            dialogFormVisible: false,               //弹层是否显示
            dialogStatus: '',   
            textMap: {                              //判断弹层是添加还是编辑
                update: '编辑数据源',
                create: '新建数据源'
            },          
            tabPosition:'left',
            form:{
                dburl:'',
                port:'',
            },    
            changeSure:false,

            
            editorConfig:{
                toolbars:[[
                    'bold', 'italic', 'underline', '|',
                    'justifyleft','justifycenter','justifyright','justifyjustify', '|',
                ]]
            },
    
        }
    },
    created(){
        this.getList();
        this.getdbTypes();

        
    },
    mounted() {
        
    },
    watch: {
        
    },
    computed: {
    },
    methods:{
        getList(){
            api.getList(this.listQuery).then(response => {
                this.tableData = response.data.rows;
                this.total = response.data.total; 
                this.listLoading = false
            });
        },
        // 数据库类型信息
        getdbTypes(){                           
            api.getdbTypes().then(response => {
                this.dbTypes = response.data
            });

        },
        //分页       
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNo = val;
            this.getList();
        }, 
        //添加
        handleCreate(){
            this.resetTemp();
            this.dialogStatus = 'create';
            this.dialogFormVisible = true;
        },
        resetTemp() {
            this.form = {
                dburl:'',
                port:'',
            };
            this.changeSure = false;
        },
        change_dbType(val){
            var that = this
            this.dbTypes.forEach(function(item,index){
                if(item.key==val){
                    that.form.url = item.url
                    that.form.dburl = item.url.substr(0, item.url.indexOf('%s'))
                    that.form.port = item.port
                }
            })
        },



        

        
        

        cancel(){

        },
        update(){

        },
        create(){

        }
    }
}
</script>
<style>

</style>