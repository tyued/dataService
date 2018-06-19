<template>
    <div class="fw-container">
        <el-row class="fw-rowbox fw-rowbox-part" :gutter="20">
            <el-col :span="6">
                <div @click="clickReview" :class="{'on':shenh_on}">
                    <el-card class="box-card">
                        <i class="shenh-ico fw-topico"></i>
                        <div class="fw-toppart">审核</div>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <i class="zhuc-ico fw-topico"></i>
                    <div class="fw-toppart">注册</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <i class="guanl-ico fw-topico"></i>
                    <div class="fw-toppart">管理</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <div @click="clickDataservice" :class="{'on':shujuy_on}">
                    <el-card class="box-card">
                        <i class="shujuy-ico fw-topico"></i>
                        <div class="fw-toppart">数据源</div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
        <el-row class="fw-rowbox">
            <component :is="pageMB" ></component>
        </el-row>
        
        
    </div>
</template>

<script>
import { mainService , pageReviewed , pageDataservice } from 'views/basics/service';

export default {
    name:'service',
    components: {
        mainService,pageReviewed,pageDataservice
    },
    data() {
        return {
            pageMB:'',
            shenh_on:false,
            zhuc_on:false,
            guanl_on:false,
            shujuy_on:false,
        }
    },
    created(){
        this.pageMB = mainService
    },
    methods:{
        clickReview(){              //审核页
            this.pageMB = pageReviewed
            this.shenh_on = true
            this.zhuc_on = false
            this.guanl_on = false
            this.shujuy_on = false
        },                          //数据源
        clickDataservice(){
            this.pageMB = pageDataservice
            this.shenh_on = false
            this.zhuc_on = false
            this.guanl_on = false
            this.shujuy_on = true
        },
    }
}
</script>
