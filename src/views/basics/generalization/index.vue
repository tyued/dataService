<template>
    <div class="gl-container">
        <el-row class="gl-rowbox">
            <el-col :span="24">
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">
                        系统概述
					</div>
                    <el-row :gutter="20">
                        <el-col :span="4">
                            <span class="xtgsdata">1340</span>
                            <span class="xtgsname">可用服务</span>
                        </el-col>
                        <el-col :span="4">
                            <span class="xtgsdata">233465</span>
                            <span class="xtgsname">最新服务</span>
                        </el-col>
                        <el-col :span="4">
                            <span class="xtgsdata">1078</span>
                            <span class="xtgsname">待审服务</span>
                        </el-col>
                        <el-col :span="4">
                            <span class="xtgsdata">9999999999+</span>
                            <span class="xtgsname">停用服务</span>
                        </el-col>
                        <el-col :span="4">
                            <span class="xtgsdata">173</span>
                            <span class="xtgsname">授权用户</span>
                        </el-col>
                        <el-col :span="4">
                            <span class="xtgsdata">9</span>
                            <span class="xtgsname">最新用户</span>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <el-row class="gl-rowbox gl-partbox" :gutter="20">
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">
                        用户订阅量
                        <el-tag type="danger">TOP5</el-tag>
					</div>
                    <bar-chart></bar-chart>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">
                        服务访问量
                        <el-tag type="danger">TOP5</el-tag>
					</div>
                    <fwfwl-table></fwfwl-table>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">
                        服务订阅量
                        <el-tag type="danger">TOP5</el-tag>
					</div>
                    <line-chart></line-chart>
                </el-card>
            </el-col>
        </el-row>
        <el-row class="gl-rowbox gl-partbox" :gutter="20">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">
                        最新服务异常
                        <span class="more">更多</span>
					</div>
                    <zxfwyc-table></zxfwyc-table>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">
                        异常类型汇总
					</div>
                    <pie-chart></pie-chart>
                </el-card>
            </el-col>
        </el-row>      
        <el-row class="gl-rowbox gl-partbox">
            <el-col :span="24   ">
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">
                        申请接入列表
                        <span class="more">更多</span>
					</div>
                    <sqjrlist-table></sqjrlist-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { barChart , fwfwlTable , lineChart , zxfwycTable , pieChart , sqjrlistTable } from 'views/basics/generalization';
import * as api from 'api/generalization/index'

export default {
    name:'generalization',
    components: {
        barChart,fwfwlTable,lineChart,zxfwycTable,pieChart,sqjrlistTable
    },
    data() {
        return {
            
        }
    },
    created(){
        // this.init()
    },
    methods:{
        init(){
            var data = {
                pageNo:1,
                limit:15
            }
            api.page(data).then(response => {
                console.log(res)
            })
        }
    },

}
</script>