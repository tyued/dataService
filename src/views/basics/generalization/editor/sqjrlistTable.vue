<template>
    <el-table  :data="tableData" style="width: 100%" height="340">
        <el-table-column prop="name" label="服务名称" width="120"></el-table-column>
        <el-table-column prop="producer" label="服务提供方" width="120"></el-table-column>
        <el-table-column label="数据分类" width="120">
            <template slot-scope="scope">
                <el-tag size="small">{{scope.row.tagname}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="type" label="接口协议" width="80"></el-table-column>
        <el-table-column prop="way" label="返回模式" width="80"></el-table-column>        
        <el-table-column prop="timestamp" label="请求时间"></el-table-column>
        <el-table-column label="操作" width="150">
            <template slot-scope="scope">
                <el-button size="small" type="success">编辑</el-button>
                <el-button size="small" type="danger">删除</el-button>
            </template> 
        </el-table-column>
    
    </el-table>

</template>

<script>
import * as api from 'api/generalization/index'
import * as dicty from 'api/dictionary'
export default {
    name:'sqjrlistTable',
    data() {
        return {
            tableData:[],
            servTypeList:[],
            
        }
    },
    created(){
        this.getBaseData()
    },
    mounted(){        
        this.init()

    },
    methods:{
        // 获取服务分类
        getBaseData(){
            var query = {group:'servType'}
            dicty.getBaseData(query).then(response => {
                this.servTypeList = response.data
            });         
            
        },
        // 最近10条服务发布申请记录
        init(){          
            api.pubTop10().then(response => {
                this.tableData = response.data
                var that = this;
                this.tableData.forEach(function(item,index){
                    item.tagname = '';
                    that.servTypeList.forEach(function(obj,ind){
                        if(item.tag == obj.key){                          
                            item.tagname = obj.value
                        }
                    })
                })
            })
        },
    },
}
</script>
    
