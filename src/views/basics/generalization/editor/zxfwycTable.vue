<template>
    <el-table :data="tableData" style="width: 100%" height="340">
        <el-table-column prop="servName" label="服务名称" min-width="100"></el-table-column>
        <el-table-column prop="name" label="服务提供方" min-width="100"></el-table-column>
        <el-table-column prop="part" label="数据使用方" min-width="100"></el-table-column>
        <el-table-column prop="exception" label="异常类型" min-width="80"></el-table-column>
        <el-table-column prop="respMsg" label="错误原因" min-width="80"></el-table-column>        
        <el-table-column prop="timestamp" label="请求时间" min-width="120"></el-table-column>
    
    </el-table>

</template>

<script>
import * as api from 'api/generalization/index'
export default {
    name:'zxfwycTable',
    data() {
        return {
            tableData:[],
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            // 最新服务访问异常数据
            api.errorLastest().then(response => {
                this.tableData = response.data
            })
        }
    },
}
</script>
    
