<template>
  <div class="fail">
    <el-row class="pd5">
      <span class="label">时间</span>

      <ActiveBtn
        @handleClick="handleTimeBtn"
        :btnArr="btnArr"
        :activeIndex="act"
        :cancel="cancel"
        activeName="act1"
        size="small"
      />

      <el-date-picker
        size="small"
        @change="handleTimeChange"
        value-format="yyyy-MM-dd"
        style="margin:0 10px;"
        v-model="valueT"
        type="daterange"
        align="right"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <el-button
        size="small"
        @click="handleSearch"
        type="primary"
        class="fr"
      ><i class="el-icon-search"></i> 查询</el-button>
    </el-row>
    <el-row class="pd5">
      <p class="tab-title"><i class="el-icon-menu"></i> 趋势图</p>
      <!-- echarts -->
      <LineChart
        v-if="tabName === '1'"
        :arr="echartsArr"
        type="fail"
      />
      <p class="tips"><i
          style="color:#209cee"
          class="fa fa-square"
        ></i> 失败率</p>
    </el-row>
  </div>
</template>

<script>
import LineChart from "components/LineChart/index"; // echart组件
import * as api from "api/monitor";
import ActiveBtn from "components/ActiveBtn";
import moment from "utils/moment";
export default {
  name: "fail", // 关键指标详解
  props: ["byType", "servId", "apiId", "tabName"],
  components: {
    LineChart,
    ActiveBtn
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
  created() {
    this.init();
  },
  data() {
    return {
      valueT: [], // 日期选择器数据
      valueTime: [], // 最终的日期数据
      btnArr: [
        {
          name: "7日",
          value: 7
        },
        {
          name: "14日",
          value: 14
        },
        {
          name: "30日",
          value: 30
        }
      ],
      act: 2,
      cancel: -1,
      chart: null, // echarts
      echartsArr: []
    };
  },
  methods: {
    async init(time = moment(-30)) {
      // 获取echarts数据并props down
      let data = await api.postFailCount({
        servId: this.servId,
        apiId: this.apiId,
        byType: this.byType,
        begintime: time[0],
        endtime: time[1]
      });
      data.forEach(i => (i.value = +i.value * 100 + ""));
      this.echartsArr = data;
      this.$emit("handleComplete");
    },
    handleSearch() {
      this.init(this.valueTime);
      this.$emit("handleEmitTable");
    },
    handleTimeChange(data) {
      // 日期组件change事件
      this.valueTime = data;
      this.cancel = -Math.random();
    },
    handleTimeBtn({ value }) {
      this.valueT = [];
      this.valueTime = moment(-value);
    }
  }
};
</script>
<style lang="scss" scoped>
.label {
  margin-right: 10px;
}
.tab-title {
  line-height: 40px;
}
.pd5 {
  padding: 5px;
}

.tips {
  text-align: center;
  line-height: 1.7em;
}
</style>

