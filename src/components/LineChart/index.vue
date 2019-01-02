<template>
  <div class="area-chart">
    <div ref="monitorEcharts" class="echarts-line-monitor" :style="{width: '100%', height: height}"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import { debounce } from "utils";
export default {
  name: "areaChart",
  props: {
    height: {
      type: String,
      default: "200px"
    },
    type: {
      type: String,
      default: ""
    },
    arr: {
      type: Array,
      required: true,
      default: []
    }
  },
  watch: {
    arr() {
      this.chart.setOption({
        xAxis: {
          type: "category",
          data: this.timeArr
        },
        series: [
          {
            data: this.dataArr,
            type: "line"
          }
        ]
      });
    },
  },
  computed: {
    timeArr() {
      return this.arr.map(item => item.key);
    },
    dataArr() {
      return this.arr.map(item => item.value);
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.monitorEcharts, "macarons");
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        color: ["#209cee"],
        grid: {
          top: "14px",
          left: "14px",
          right: "14px",
          bottom: "10px",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: this.timeArr
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.dataArr,
            type: "line"
          }
        ]
      }
      switch (this.type) {
        case 'fail':
          option.yAxis.axisLabel = {
            formatter: '{value}%'
          }
          break;
        // case 'avg':
        //   option.yAxis.axisLabel = {
        //     formatter: '{value}ms'
        //   }
        //   break;
        // case 'max':
        //   option.yAxis.axisLabel = {
        //     formatter: '{value}ms'
        //   }
        //   break;
      }
      this.chart.setOption(option);
    },
    __resizeHanlder() {
      debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100)();
    }
  },
  mounted() {
    this.initChart();
    // 页面缩放实时变化
    window.addEventListener("resize", this.__resizeHanlder);

    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName("sidebar-container")[0];
    sidebarElm.addEventListener("transitionend", this.__resizeHanlder);
  },
  beforeDestroy() {
    // 解除echarts调用
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHanlder);
    const sidebarElm = document.getElementsByClassName("sidebar-container")[0];
    sidebarElm.removeEventListener("transitionend", this.__resizeHanlder);
    this.chart.dispose();
    this.chart = null;
  }
};
</script>
