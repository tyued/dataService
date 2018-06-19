<template>
    <el-table  :data="tableData" style="width: 100%" height="340">
        <el-table-column prop="date" label="服务名称" width="120"></el-table-column>
        <el-table-column prop="name" label="服务提供方" width="120"></el-table-column>
        <el-table-column label="数据分类" width="150">
            <template slot-scope="scope">
                <el-tag>{{scope.row.part}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="type" label="接口协议" width="80"></el-table-column>
        <el-table-column prop="way" label="返回模式" width="80"></el-table-column>        
        <el-table-column prop="time" label="请求时间"></el-table-column>
        <el-table-column label="操作" width="150">
            <template slot-scope="scope">
                <el-button size="small" type="success">编辑</el-button>
                <el-button size="small" type="danger">删除</el-button>
            </template> 
        </el-table-column>
    
    </el-table>

</template>

<script>
export default {
    name:'sqjrlistTable',
    data() {
        return {
            tableData: [{
                date: '学生信息查询',
                name: '天音智慧校园',
                part: '信息查询',
                type: '身份验证',
                way:  '整权失败',
                time: '2018-03-15 13:01:24'
            }, {
                date: '学生信息查询',
                name: '天音智慧校园',
                part: 'XXX小学',
                type: '身份验证',
                way:  '整权失败',
                time: '2018-03-15 13:01:24'
            },{
                date: '学生信息查询',
                name: '天音智慧校园',
                part: 'XXX小学',
                type: '身份验证',
                way:  '整权失败',
                time: '2018-03-15 13:01:24'
            },{
                date: '学生信息查询',
                name: '天音智慧校园',
                part: 'XXX小学',
                type: '身份验证',
                way:  '整权失败',
                time: '2018-03-15 13:01:24'
            },{
                date: '学生信息查询',
                name: '天音智慧校园',
                part: 'XXX小学',
                type: '身份验证',
                way:  '整权失败',
                time: '2018-03-15 13:01:24'
            },]
        }
      }
}
</script>
    
