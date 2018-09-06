<template>
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts';
import { debounce } from 'utils';
import * as api from 'api/generalization/index'
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
        titleList:[],
        barList:[],
      };
    },
    mounted() {
        this.init()
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
      init(){
          // 用户订阅量Top5
          api.userTop5().then(response => {
              var that = this
              var dataList = response.data;
              dataList.forEach(function(item,index){
                  that.barList.push({value:item.count,name:item.username})
                  that.titleList.push(item.username)
              })
              this.initChart();
          })
      },
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
            data: this.titleList,
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
                  type: 'bar',
                  stack: 'vistors',
                  barWidth: '20',
                  data:this.barList,
                  itemStyle:{
                    barBorderRadius:[0,20,20,0],
                      //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                    color: function (params){
                        var colorList = ['#f66b6b','#63c249','#aa94d2','#449afc','#eaedf4'];
                        return colorList[params.dataIndex];
                    }
                  },
                  animationDuration
              },
          ], 


        })
      }
    }
}

</script>