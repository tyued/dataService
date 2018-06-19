<template>
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts';

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
            default: '300px'
        }
    },
    data() {
        return {
            chart: null
        };
    },
    mounted() {
        this.initChart();
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose();
        this.chart = null;
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$el, 'macarons');

            this.chart.setOption({
                legend: {
                    right: '40',
                    y: 'center',
                    data: ['链接超时', '鉴权失败'],
                    orient:'vertical'
                },
                calculable: true,            
                series: [
                    {
                        type: 'pie',
                        roseType: 'radius',
                        // radius : '55%',
                        center: ['40%', '50%'],
                        label:{
                            show:false
                        },
                        data: [
                            { value: 320, name: '链接超时' , itemStyle:{
                                color:"#f66b6b"
                            } },
                            { value: 240, name: '鉴权失败' , itemStyle:{
                                color:"#e6a23c"
                            } },
                        ],
                        animationEasing: 'cubicInOut',
                        animationDuration: 2600
                    }
                ]
            })
        }
    }
}
</script>
