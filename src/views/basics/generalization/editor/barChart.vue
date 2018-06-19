<template>
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts';
import { debounce } from 'utils';
const animationDuration = 3000;
export default {
    name:'barChart',
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '280px'
      },
      autoResize: {
          type: Boolean,
          default: true
      }
    },
    data() {
      return {
        chart: null,
      };
    },
    mounted() {
        this.initChart();
        if (this.autoResize) {
            this.__resizeHanlder = debounce(() => {
            if (this.chart) {
                this.chart.resize()
            }
            }, 100)
            window.addEventListener('resize', this.__resizeHanlder)
        }

        // 监听侧边栏的变化
        const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
        sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        if (this.autoResize) {
            window.removeEventListener('resize', this.__resizeHanlder)
        }

        const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
        sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

        this.chart.dispose()
        this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons');
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            top:'0',
            bottom:'0',
            containLabel: true
          },
          xAxis: [{
            type: 'value',
            nameTextStyle:{
              color:'#449afc'
            },
            splitLine:{
              lineStyle:{
                color:'#f2f6fc'
              }
            },
            axisLine:{
              lineStyle:{
                color:'#606266'
              }
            }
          }],
          yAxis: [{
            type: 'category',
            data: ['客户A', '客户A', '客户A', '客户A', '客户A'],
            axisTick: {
              alignWithLabel: true
            },
            axisLine:{
              lineStyle:{
                color:'#606266'
              }
            }
          }],
          series: [
              {
                  name: '客户A',
                  type: 'bar',
                  stack: 'vistors',
                  barWidth: '20',
                  data:[
                      {
                          value : 13,
                          itemStyle:{
                            color: '#f66b6b',
                          },
                      },{
                          value : 34,
                          itemStyle:{
                            color: '#63c249',
                          }
                      },{
                          value : 20,
                          itemStyle:{
                            color: '#aa94d2',
                          }
                      },{
                          value : 28,
                          itemStyle:{
                            color: '#449afc',
                          }
                      }, {
                          value : 39,
                          itemStyle:{
                            color: '#eaedf4',
                          }
                      }
                  ],
                  itemStyle:{
                    barBorderRadius:[0,20,20,0]
                  },
                  animationDuration
              },
          ], 


        })
      }
    }
}

</script>