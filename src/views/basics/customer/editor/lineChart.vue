<template>
    <div :ref="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts';
import { debounce } from 'utils';
import * as api from 'api/generalization/index'

export default {
    name:'LineChart',
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
            default: '320px'
        },
        autoResize: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            chart: null,
            lineData:[],
            titleList:[],
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
        const sidebarElm = this.$refs[this.className]
        sidebarElm.addEventListener('transitionend', this.__resizeHanlder)

    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        if (this.autoResize) {
            window.removeEventListener('resize', this.__resizeHanlder)
        }

        const sidebarElm = this.$refs[this.className]
        sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

        this.chart.dispose()
        this.chart = null
    },
    methods: {
        init(){
            var that = this
            // 服务订阅量Top5
            api.subTop5().then(response => {
                var dataList = response.data
                dataList.forEach(function(item,index){
                    that.lineData.push({value:item.count,name:item.name})
                    that.titleList.push(item.name)
                })
                this.titleList.push("")
                this.initChart();
            })
        },
        initChart() {
            this.chart = echarts.init(this.$el, 'macarons');

            this.chart.setOption({
                xAxis: {
                    // data: ['学生信息查询', '教师信息查询',''].map(function (str) {
                    //         return str.replace('查询', '\n查询')
                    //     }),
                    data: this.titleList,
                    axisLabel: {
                        interval:0
                    },
                    boundaryGap: false
                },
                grid: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 0,
                    containLabel: true
                },

                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                yAxis: {},
                series: [{
                    name: 'visitors',
                    smooth: true,
                    type: 'line',
                    symbol:'circle',
                    symbolSize:'8',
                    data: this.lineData,
                    itemStyle: {
                        normal: {
                            color: '#a081f2',
                            lineStyle: {
                                color: '#a081f2'
                            },
                            areaStyle: {
                                color: '#f1ecfd'
                            }
                        }
                    },
                    animationDuration: 2000,
                    animationEasing: 'cubicInOut'
                }]
            })
        }
    }
}
</script>
