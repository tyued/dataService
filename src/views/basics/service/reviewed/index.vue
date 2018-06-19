<template>   
    <el-col :span="24">
        <el-card class="box-card">
            <el-button icon="el-icon-tickets">筛选</el-button>
            <el-table v-loading.body="listLoading" :data="tableData" style="width: 100%" height="580">
                <el-table-column prop="date" label="接口名称"></el-table-column>
                <el-table-column prop="name" label="所属服务"></el-table-column>
                <el-table-column prop="sfgk" label="是否公开"></el-table-column>
                <el-table-column prop="bb" label="版本"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.zhtgs">{{scope.row.zht}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary">查看</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
            </div>
        </el-card>
    </el-col>
</template>


<script>
export default {
    name:'pageReviewed',
    data() {
        return {
            listLoading:true,
            listQuery: {
                page: 1,
                limit: 20,
                name: undefined
            },
            total:null,
            tableData: [{
                date: '学生信息查询',
                name: '天音智慧校园',
                sfgk: '是',
                bb: 'V1.1',
                zht:'更新',
                zhtgs:'success'
            }, {
                date: '学生信息查询',
                name: '天音智慧校园',
                sfgk: '是',
                bb: 'V1.1',
                zht:'新增',
                zhtgs:'warning'
            },{
                date: '学生信息查询',
                name: '天音智慧校园',
                sfgk: '是',
                bb: 'V1.1',
                zht:'禁用',
                zhtgs:'danger'
            },{
                date: '学生信息查询',
                name: '天音智慧校园',
                sfgk: '是',
                bb: 'V1.1',
                zht:'更新',
                zhtgs:'success'
            },{
                date: '学生信息查询',
                name: '天音智慧校园',
                sfgk: '是',
                bb: 'V1.1',
                zht:'更新',
                zhtgs:'success'
            },]
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            this.listLoading = false
        },
        //分页
        handleSizeChange() {
        },
        handleCurrentChange() {
        }, 
    }
}
</script>