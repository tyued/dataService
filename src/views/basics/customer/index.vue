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
              <span class="xtgsdata">{{survey.usable?survey.usable:'0'}}</span>
              <span class="xtgsname">可用服务</span>
            </el-col>
            <el-col :span="4">
              <span class="xtgsdata">{{survey.latest?survey.latest:'0'}}</span>
              <span class="xtgsname">最新服务</span>
            </el-col>
            <el-col :span="4">
              <span class="xtgsdata">{{survey.auditing?survey.auditing:'0'}}</span>
              <span class="xtgsname">待审服务</span>
            </el-col>
            <el-col :span="4">
              <span class="xtgsdata">{{survey.stoped?survey.stoped:'0'}}</span>
              <span class="xtgsname">停用服务</span>
            </el-col>
            <el-col :span="4">
              <span class="xtgsdata">{{survey.subscribed?survey.subscribed:'0'}}</span>
              <span class="xtgsname">已订阅</span>
            </el-col>
            <el-col :span="4">
              <span class="xtgsdata">{{survey.reviewing?survey.reviewing:'0'}}</span>
              <span class="xtgsname">待审订阅</span>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="gl-rowbox gl-partbox" :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="box-card-header">
            应用访问量
            <el-tag type="danger">TOP5</el-tag>
          </div>
          <BarChart :responseData="appTop5"></BarChart>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="box-card-header">
            服务访问量
            <el-tag type="danger">TOP5</el-tag>
          </div>
          <FwfwlTable :responseData="servTop5"></FwfwlTable>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="box-card-header">
            接口访问量
            <el-tag type="danger">TOP5</el-tag>
          </div>
          <LineChart :responseData="apiTop5"></LineChart>
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
          <ZxfwycTable :responseData="zxfwyc"></ZxfwycTable>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="box-card-header">
            异常类型汇总
          </div>
          <PieChart :responseData="yclxhz"></PieChart>
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
  PieChart
} from "views/basics/customer";
import { getAllInfoForCustomer } from "api/generalization/index";

export default {
  name: "customer",
  components: {
    BarChart,
    FwfwlTable,
    LineChart,
    ZxfwycTable,
    PieChart
  },
  data() {
    return {
      survey: [], //系统概况
      appTop5: [],
      servTop5: [],
      apiTop5: [],
      zxfwyc: [],
      yclxhz: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // 系统概况
      getAllInfoForCustomer().then((data) => {
        this.survey = data.survey;
        this.servTop5 = data.servTop5;
        this.zxfwyc = data.error.latest;
        this.apiTop5 = data.apiTop5;
        this.appTop5 = data.appTop5;
        this.yclxhz = data.error.ratio;
      });
    },
    goToServiceMonitor() {
      this.$store.commit("SET_SIDEBAR", "3");
      this.$router.push({
        name: "main",
        params: {
          activeName: "2"
        }
      });
    }
  }
};
</script>

<style scoped>
.pb20 {
  padding-bottom: 20px;
}
</style>
