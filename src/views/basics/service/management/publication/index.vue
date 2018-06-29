<template>
  <div>
    <!--<template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" size="mini" @click="openChange(scope.row.id, scope.row.userId)">修改</el-button>
          <el-button v-if="scope.row.status == 2" size="mini" @click="openCancel(scope.row.id, scope.row.userId)">撤销审核</el-button>
          <el-button v-if="scope.row.status == 0" size="mini" @click="openStart(scope.row.id, scope.row.userId)" class="activeBtn">启用</el-button>
        </template>-->
    <el-table v-loading.body="listLoading" :data="tableData" height="580px" :default-sort="{prop: 'name', order: 'descending'}">
      <el-table-column prop="servName" label="接口名称" sortable></el-table-column>
      <el-table-column prop="_servType" label="所属服务" sortable></el-table-column>
      <el-table-column prop="apiVer" label="版本"></el-table-column>
      <el-table-column prop="timestamp" label="申请时间" width="180px"></el-table-column>
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">           
            <el-tag type="success">{{scope.row.apiStatus==1?'在线':(scope.row.apiStatus==2?'暂停':'下线')}}</el-tag> 
          </template>
      </el-table-column>
      <el-table-column prop="action" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="openChange(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>  
    <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>

    <el-dialog class="review-layer" :title="textMap" :visible.sync="dialogFormVisible" width="720px">
      <el-form :model="form" ref="form" label-width="122px">
          <el-form-item required label="接口中文名称">
              <el-input v-model="form.name" placeholder="3-20个字符"></el-input>
          </el-form-item>
          <el-form-item required label="接口英文名称">
              <el-input v-model="form.ename" placeholder="3-20个字符"></el-input>
          </el-form-item>
          <el-form-item required label="接口地址" v-if="curRow.servType!=4">
              <el-input v-model="form.url" placeholder="3-20个字符"></el-input>
          </el-form-item>
      </el-form>
      <!--<el-row class="layer-container">
        <el-col :span="12" class="left-box">
          <h3>基本信息</h3>
          <ol>
            <li>服务名称：{{ ckRow._servType }}</li>
            <li>服务分类：
              <el-tag size="small">{{ckRow.servTag}}</el-tag> 
            </li>
            <li>接口中文名称：{{ contentData.name }}</li>
            <li>接口地址：{{ contentData.url }}</li>
            <li>返回格式：
              <el-tag size="small" type="success">{{ contentData.resp }}</el-tag> 
            </li>
            <li>请求方式：
              <el-tag size="small">{{ contentData.method }}</el-tag> 
            </li>
            <li>请求示例：{{expUrl}}</li>
            <li>接口备注：{{ contentData.intro }}</li>
          </ol>
          <h3>参数说明</h3>
          <el-tabs type="border-card">
            <el-tab-pane label="输入参数">
              <template>
                <el-table :data="contentData.params" height="200">
                  <el-table-column prop="name" label="名称"></el-table-column>
                  <el-table-column label="必填">
                    <template slot-scope="scope">           
                      {{scope.row.required=='1'?'是':'否'}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="类型"></el-table-column>
                  <el-table-column prop="desc" label="说明" width="150"></el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
            <el-tab-pane label="返回参数">
              <template>
                <el-table :data="contentData.responses" height="200">
                  <el-table-column prop="name" label="名称"></el-table-column>
                  <el-table-column prop="key" label="类型"></el-table-column>
                  <el-table-column prop="desc" label="说明" width="150"></el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
            <el-tab-pane label="错误代码">
              <template>
                <el-table :data="contentData.errors" style="width: 100%" height="200">
                  <el-table-column prop="code" label="错误码"></el-table-column>
                  <el-table-column prop="text" label="说明" width="200"></el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="12" class="right-box">
          <el-button type="primary">{{contentData.resp}}</el-button>
          <h3>返回示例</h3>
          <pre>{{ contentData.example }}</pre>
        </el-col>
      </el-row>-->
      <!--<el-row class="layer-btns">
        <el-button type="primary" @click="innerVisible = true">审核通过</el-button>
        <el-button type="danger" @click="innerAnotherVisible = true">驳 回</el-button>
      </el-row>-->
    </el-dialog>
  </div>

</template>

<script>
import * as api from "api/service/management";

export default {
  name: "publication",
  data() {
    return {
      listLoading: true,
      listQuery:{
        apiStatus: "",
        limit: 10,
        pageNo: 1,
        pubStatus: "0",
        sortName: "",
        sortOrder: "desc"
      },
      total: null,
      tableData: [],
      dialogFormVisible:false,
      textMap:'',
      form:{},
      curRow:[],

    };
  },
  created() {
    this.init()


  },
  methods: {
    init(){
      api.getApiList(this.listQuery).then((res) => {
        res.data.rows.map(item => {
          switch (item.servType) {
            case "1":
              item._servType = "Rest服务";
              break;
            case "2":
              item._servType = "Soap服务";
              break;
            case "3":
              item._servType = "数据源服务";
              break;
            case "4":
              item._servType = "OSGi规范服务";
              break;
          }
          return item;
        });  
        this.listLoading = false
        this.tableData = res.data.rows
        this.total = res.data.total
      })

    },   
    //分页       
      handleSizeChange(val) {
          this.listQuery.limit = val;
          this.init();
      },
      handleCurrentChange(val) {
          this.listQuery.pageNo = val;
          this.init();
      }, 
    // 修改 
    openChange(row) {
      this.dialogFormVisible = true;
      this.textMap = row.servName;
      this.curRow = row
      console.log(row)
      var params = {
        servId:row.servId,
        type:row.servType,
        apiId:row.apiId
      }
      api.getApiParamForms(params).then((res) => {
        this.form = res.data
        console.log(res.data)
      })
    },




    // openStart(id, userId) {
    //   this.$confirm("您是否要启用改服务?", "启用提醒", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).then(() => {
    //       // 增加一个新的服务发布申请记录 提交服务发布申请
    //       api.submitService({
    //           servId: id,
    //           userId: userId
    //         }).then(res => {
    //           const { data } = res;
    //           if (data.status === "success") {
    //             this.tips = data.message;
    //             this.$message({
    //               type: "success",
    //               message: this.tips
    //             });
    //           }
    //         });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消"
    //       });
    //     });
    // },
    // openCancle(id, userId) {
    //   console.log("cancel");
    // },

  }
};
</script>

<style lang="scss">
.change-page {
  overflow: hidden;
}
.pagebox {
  // float: right;
  margin-top: 10px;
}
</style>

