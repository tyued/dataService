<template>
    <el-table  :data="tableData" style="width: 100%" height="340">
      <el-table-column prop="date" label="服务名称"></el-table-column>
      <el-table-column prop="name" label="服务提供方"></el-table-column>
      <el-table-column label="调用次数">
        <template slot-scope="scope">
          <div>{{scope.row.part}}</div>
          <el-progress :percentage="scope.row.percentage" :show-text="false" :color="scope.row.color"></el-progress>
        </template>
      </el-table-column>
      
    </el-table>

</template>

<script>
export default {
    name:'fwfwlTable',
    data() {
        return {
          tableData: [{
            date: '学生信息查询',
            name: '天音智慧校园',
            part: '5624215',
            percentage: 100,
            color:'#449afc'
          }, {
            date: '学生信息查询',
            name: '天音智慧校园',
            part: '5624215',
            percentage: 80,
            color:'#aa94d2'
          },{
            date: '学生信息查询',
            name: '天音智慧校园',
            part: '5624215',
            percentage: 60,
            color:'#63c249'
          },{
            date: '学生信息查询',
            name: '天音智慧校园',
            part: '5624215',
            percentage: 40,
            color:'#f66b6b'
          },{
            date: '学生信息查询',
            name: '天音智慧校园',
            part: '5624215',
            percentage: 20,
            color:'#f19149'
          },]
        }
      }
}
</script>
    
