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
        <el-row class="gl-rowbox" :gutter="20">
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
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">
                        服务订阅量
                        <el-tag type="danger">TOP5</el-tag>
					</div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { barChart } from 'views/basics/generalization';

export default {
    name:'generalization',
    components: {
        barChart
    },
}
</script>