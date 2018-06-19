<template>
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts';
import { debounce } from 'utils';

export default {
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
            chart: null
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
                xAxis: {
                    data: ['学生信息查询', '教师信息查询', '一卡通信息查询', '天气预告', '教师课表查询',''].map(function (str) {
                            return str.replace('查询', '\n查询')
                        }),
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
                    data: [150, 220, 170, 250, 280,150],
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
