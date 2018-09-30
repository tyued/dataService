<template>
  <div class="fail">
    <el-row class="pd5">
      <span class="label">时间</span>
      <el-button :class="{active: activeArr[0]}" @click="handleWeek">7日</el-button>
      <el-button :class="{active: activeArr[1]}" @click="handleDoubleWeek">14日</el-button>
      <el-button :class="{active: activeArr[2]}" @click="handleMonth">30日</el-button>
      <el-date-picker @change="handleTimeChange" value-format="yyyy-MM-dd" style="margin:0 10px;" v-model="valueT" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-button @click="handleSearch" type="primary" class="fr"><i class="el-icon-search"></i> 查询</el-button>
    </el-row>
    <el-row class="pd5">
      <p class="tab-title"><i class="el-icon-menu"></i> 趋势图</p>
      <!-- echarts -->
      <LineChart v-if="tabName === '1'" :arr="echartsArr" />
      <p class="tips"><i style="color:#209cee" class="fa fa-square"></i> 平均耗时(毫秒)</p>
    </el-row>
  </div>
</template>

<script>
import LineChart from "components/LineChart/index"; // echart组件
import * as api from "api/monitor";
import moment from "moment";
export default {
  name: "fail", // 关键指标详解
  props: ["byType", "servId", "apiId", "tabName"],
  components: {
    LineChart
  },
  watch: {
    byType() {
      // 改变小时和日报要重置表格
      this.init();
    },
    apiId() {
      // 改变接口时，也要重置表格 @ apiId  '' => '16' ： 第一次点击就会触发
      this.init();
    }
  },
  data() {
    return {
      valueT: [], // 日期选择器数据
      valueTime: [], // 最终的日期数据
      chart: null, // echarts
      activeArr: [false, false, true], // 默认展示30天
      echartsArr: []
    };
  },
  computed: {
    defaultValueTime() {
      // 一开始默认展示30天的数据
      let today = moment().format("YYYY-MM-DD");
      return [this.lastDay(today, -30), today];
    }
  },
  methods: {
    init(time = this.defaultValueTime) {
      // 获取echarts数据并props down
      api
        .postFailCount({
          servId: this.servId,
          apiId: this.apiId,
          byType: this.byType,
          begintime: time[0],
          endtime: time[1]
        })
        .then(res => {
          const { status, data } = res;
          if (status === 200 && data) {
            this.echartsArr = data;
          }
        });
    },
    lastDay(nowDay, n) {
      // 格式化日期-昨天
      return moment(nowDay)
        .add(n, "days")
        .format("YYYY-MM-DD");
    },
    handleSearch() {
      this.init(this.valueTime);
    },
    handleTimeChange(data) {
      // 日期组件change事件
      this.valueTime = data;
      // 解除其余日期按钮高亮
      this.activeArr = [false, false, false];
    },
    handleWeek() {
      const today = moment().format("YYYY-MM-DD");
      const beforeDay = this.lastDay(today, -7);
      this.valueTime = [beforeDay, today];
      // 高亮当前
      this.activeArr = [true, false, false];
    },
    handleDoubleWeek() {
      const today = moment().format("YYYY-MM-DD");
      const beforeDay = this.lastDay(today, -14);
      this.valueTime = [beforeDay, today];
      // 高亮当前
      this.activeArr = [false, true, false];
    },
    handleMonth() {
      const today = moment().format("YYYY-MM-DD");
      const beforeDay = this.lastDay(today, -30);
      this.valueTime = [beforeDay, today];
      // 高亮当前
      this.activeArr = [false, false, true];
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-title {
  line-height: 40px;
}
.active {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}
.pd5 {
  padding: 5px;
}
.label {
  margin-right: 10px;
}
.tips {
  text-align: center;
  line-height: 1.7em;
}
</style>

