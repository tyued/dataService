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
                            <span class="xtgsdata">{{listData.usable?listData.usable:'0'}}</span>
                            <span class="xtgsname">可用服务</span>
                        </el-col>
                        <el-col :span="4">
                            <span class="xtgsdata">{{listData.latest?listData.latest:'0'}}</span>
                            <span class="xtgsname">最新服务</span>
                        </el-col>
                        <el-col :span="4">
                            <span class="xtgsdata">{{listData.auditing?listData.auditing:'0'}}</span>
                            <span class="xtgsname">待审服务</span>
                        </el-col>
                        <el-col :span="4">
                            <span class="xtgsdata">{{listData.stoped?listData.stoped:'0'}}</span>
                            <span class="xtgsname">停用服务</span>
                        </el-col>
                        <el-col :span="4">
                            <span class="xtgsdata">{{listData.users?listData.users:'0'}}</span>
                            <span class="xtgsname">授权用户</span>
                        </el-col>
                        <el-col :span="4">
                            <span class="xtgsdata">{{listData.newUsers?listData.newUsers:'0'}}</span>
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
                    <BarChart></BarChart>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">
                        服务访问量
                        <el-tag type="danger">TOP5</el-tag>
                    </div>
                    <FwfwlTable></FwfwlTable>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">
                        服务订阅量
                        <el-tag type="danger">TOP5</el-tag>
                    </div>
                    <LineChart></LineChart>
                </el-card>
            </el-col>
        </el-row>
        <el-row class="gl-rowbox gl-partbox" :gutter="20">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">
                        最新服务异常
                        <span class="more" @click="goToServiceMonitor">更多</span>
                    </div>
                    <ZxfwycTable></ZxfwycTable>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">
                        异常类型汇总
                    </div>
                    <PieChart></PieChart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {
  BarChart,
  FwfwlTable,
  LineChart,
  ZxfwycTable,
  PieChart,
} from "views/basics/customer";
import * as api from "api/generalization/index";

export default {
  name: "customer",
  components: {
    BarChart,
    FwfwlTable,
    LineChart,
    ZxfwycTable,
    PieChart,
  },
  data() {
    return {
      listData: [] //系统概况
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // 系统概况
      api.survey().then(response => {
        this.listData = response.data;
      });
    },
    goToServiceMonitor() {
        this.$store.commit('SET_SIDEBAR', '3')
        this.$router.push({
            name: 'main',
            params: {
                activeName: 'second'
            }
        })
    }
  }
};
</script>

<style scoped>
.pb20 {
    padding-bottom: 20px;
}
</style>
