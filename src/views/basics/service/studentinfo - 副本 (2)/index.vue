<template>   
    <div class="info-container" v-loading.body="listLoading">
        <h1>{{infoData.name}}</h1>
        <el-row class="top-nav">
            <el-col :span="14">
                <ul class="zt-top-nav">
                    <li>&emsp;服务商：
                        <a href="javascript:;">天音智慧校园</a>
                    </li>
                    <li>分&emsp;类:&nbsp;
                        <el-tag type="success">{{infoData.tagname}}</el-tag> 
                    </li>
                    <li>123456</li>
                    <li>123456</li>
                    <li>123456</li>
                    <li><el-rate v-model="valRate" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></li>
                </ul>
            </el-col>
            <el-col :span="10">
                <ul class="cz-top-nav">
                    <li @click="$router.back(-1)">返回</li>
                    <li>禁用/发布</li>
                    <li>监控</li>
                    <li>&nbsp;订阅/取消</li>
                    <li>意见反馈</li>
                    <li>加入收藏</li>
                </ul>
            </el-col>
        </el-row>
        <el-row :gutter="12">
            <el-col :span="16">
                <el-card shadow="always" class="card-item">
                    <div slot="header" class="box-card-header">
                        服务简介    
                    </div>
                    <section>{{infoData.detail}}</section>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="always" class="card-item">
                    <div slot="header" class="box-card-header">
                        猜你喜欢
                        <a href="javascript:;">换一批</a>    
                    </div>
                    <div class="card-itembox">
                        <div class="card-item-top">
                            <span>学生分数查询</span>
                            <el-button type="success" size="small">查看</el-button>
                        </div>
                        <div class="card-item-bottom">
                            <li>天音智慧教育</li>
                            <li>123455</li>
                            <li>123455</li>
                            <li>
                                <el-rate v-model="valRate" disabled show-score text-color="#ff9900" score-template="{value}">
                                </el-rate>
                            </li>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>

</template>


<script>
import * as api from 'api/service/dataservice/index';
import * as infoapi from 'api/service/studentinfo/index';
import * as dicty from 'api/dictionary';

export default {
    name:'studentinfo',
    data() {
        return {
            listLoading:true,
            type:'',                //1. HTTP API(rest)  2. WebService API   3.  通过数据源发布
            servId:'',
            detail:true,
            DetailQuery:{
                detail: true
            },
            infoData:[],            //详细信息
            servTypeList:[],        //服务分类
            valRate: 0,             //评分
    
        }
    },
    created(){ 
        this.type =  this.$route.query.type
        this.servId =  this.$route.query.servId
        this.DetailQuery.servId = this.servId
        this.getBaseData()
    },
    mounted() {
        this.init()       
    },
    watch: {
        // servTypeList(){
        //     this.init()
        // }
    },
    computed: {
    },
    methods:{
        init(){
            if(this.type=='1'){                 //HTTP API(rest)
                infoapi.getRest(this.DetailQuery).then(response => {
                    this.infoData = response.data
                    this.infoData.tagname = ''
                    var that = this
                    this.servTypeList.forEach(function(item,index){
                        if(that.infoData.tag == item.key){
                            that.infoData.tagname = item.value    
                        }
                    })
                    this.infoData.tagname = this.infoData.tagname ? this.infoData.tagname : '其他'
                    this.listLoading = false

                });         
            }

        },
        // 获取服务分类
        getBaseData(){
            var query = {group:'servType'}
            dicty.getBaseData(query).then(response => {
                this.servTypeList = response.data
            });         
            
        },
        
    }
}
</script>
<style scoped>
.zt-top-nav li:nth-child(3){background: url("./img/info_wifi.png") no-repeat left center;}
.zt-top-nav li:nth-child(4){background: url("./img/info_heart.png") no-repeat left center;}
.zt-top-nav li:nth-child(5){background: url("./img/info_message.png") no-repeat left center;}
.zt-top-nav li:nth-child(6){background: url("./img/info_good.png") no-repeat left center;}
.cz-top-nav li:nth-child(1){background: url("./img/info_back.png") no-repeat left center;}
.cz-top-nav li:nth-child(2){background: url("./img/info_forbidden.png") no-repeat left center;}
.cz-top-nav li:nth-child(3){background: url("./img/info_watch.png") no-repeat left center;}
.cz-top-nav li:nth-child(4){background: url("./img/info_wifi.png") no-repeat left center;}
.cz-top-nav li:nth-child(5){background: url("./img/info_edit.png") no-repeat left center;}
.cz-top-nav li:nth-child(6){background: url("./img/info_add.png") no-repeat left center;}

.info-container .card-item .card-item-bottom li:nth-child(2) {
padding-left: 30px;
background: url("./img/info_wifi.png") no-repeat left center; }
.info-container .card-item .card-item-bottom li:nth-child(3) {
padding-left: 30px;
background: url("./img/info_message.png") no-repeat left center; }
.info-container .card-item .card-item-bottom li:nth-child(4) {
padding-left: 30px;
background: url("./img/info_good.png") no-repeat left center; }    

</style>