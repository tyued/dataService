<template>
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts';
import * as api from 'api/generalization/index'

export default {
    name: 'PieChart',
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
            piedata:[],
            chart: null
        };
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose();
        this.chart = null;
    },
    methods: {
        init(){
            var that = this
            // 异常类型汇总
            api.errorRatio().then(data => {
                data.forEach((item,index) => {
                    this.piedata.push({value:item.count,name:item.code})
                })
                this.initChart();
            })
        },
        initChart() {
            this.chart = echarts.init(this.$el, 'macarons');
            this.chart.setOption({
                legend: {
                    right: '40',
                    y: 'center',
                    orient:'vertical'
                },
                calculable: true,   
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },   
                color:['#f66b6b','#e6a23c','#a081f2','#42d3a5','#209cee'],
                series: [
                    {
                        type: 'pie',
                        // roseType: 'radius',
                        // radius : '55%',
                        center: ['40%', '50%'],
                        label:{
                            show:false
                        },
                        data:this.piedata,
                        animationEasing: 'cubicInOut',
                        animationDuration: 2600
                    }
                ]
            })
        }
    }
}
</script>
