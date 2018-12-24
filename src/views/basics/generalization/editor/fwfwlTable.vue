<template>
    <el-table :data="tableData" style="width: 100%" height="340">
      <el-table-column prop="name" label="服务名称"></el-table-column>
      <el-table-column prop="producer" label="服务提供方"></el-table-column>
      <el-table-column label="调用次数">
        <template slot-scope="scope">
          <div>{{scope.row.count}}</div>
          <el-progress :percentage="scope.row.percentage" :show-text="false" :color="scope.row.color"></el-progress>
        </template>
      </el-table-column>
      
    </el-table>

</template>

<script>
import * as api from 'api/generalization/index'
export default {
    name:'FwfwlTable',
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
            // 服务访问量Top5
            api.pvTop5().then(data => {
                this.tableData = data
            })
        }
    },
}
</script>
    
<style scope>
.el-table__row:nth-child(1) .el-progress-bar__inner{background-color: #409EFF!important;}
.el-table__row:nth-child(2) .el-progress-bar__inner{background-color: #aa94d2!important;}
.el-table__row:nth-child(3) .el-progress-bar__inner{background-color: #63c249!important;}
.el-table__row:nth-child(4) .el-progress-bar__inner{background-color: #f66b6b!important;}
.el-table__row:nth-child(5) .el-progress-bar__inner{background-color: #f19149!important;}

</style>