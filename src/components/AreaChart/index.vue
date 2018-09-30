<template>
  <div class="area-chart">
    <div ref="monitorEcharts" class="echarts-line-monitor" :style="{width: '100%', height: height}"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import { debounce } from "utils";
import moment from "moment";
export default {
  name: "areaChart",
  props: {
    height: {
      type: String,
      default: "200px"
    },
    types: {
      type: Array,
      required: true
    },
    arr: {
      type: Array,
      required: true
    },
    point: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // show: false
      time: [],
      dataArr: []
    };
  },
  computed: {},
  created() {
    this.dataArr = this.types.slice(0, -1).map((item, index) => {
      return {
        name: item, // 类型数据
        type: "line",
        stack: "总量",
        areaStyle: { normal: {} },
        // smooth: true,
        data: [] // 实时数据
      };
    });
  },
  watch: {
    arr() {
      let bool = this.arr.every(n => {
        return typeof n === "number";
      });
      if (!bool) {
        return;
      }
      // this.show = true
      this.dataArr.map((item, index) => {
        item.data.push(this.arr[index]);
      });
      this.time.push(moment().format("h:mm:ss")); // 更新时间数组
      this.chart.setOption({
        xAxis: [
          {
            data: this.time // 时间数据
          }
        ],
        series: this.dataArr
      });
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.monitorEcharts, "macarons");
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
          // formatter: '{a0}{c0}万'
        },
        color: ["#ffdd57", "#209cee","#42d3a5"],
        legend: {
          data: this.types // 类型数据
        },
        grid: {
          top: "17%",
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            // ["14:00:00", "14:30:00", "15:00:00", "15:30:00", "16:00:00"]
            data: this.time // 时间数据
          }
        ],
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: `{value} ${this.point}`
          }
        },
        series: this.dataArr
      });
      // if (this.point) {
      //   this.chart.setOption({
      //     yAxis: {
      //       type: "value",
      //       // axisLabel: {
      //       //   formatter: (value, index) => {
      //       //     // let txt = `{value} ${this.point}`;
      //       //     let txt = this.point;
      //       //     if (index === this.types.length - 1) {
      //       //       txt = "GB";
      //       //     }
      //       //     return txt;
      //       //   }
      //       // }
      //     }
      //   });
      // }
    }
  },
  mounted() {
    this.initChart();
    // 页面缩放实时变化
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
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
