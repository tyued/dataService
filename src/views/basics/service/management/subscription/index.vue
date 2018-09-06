<template>
  <div>
    <el-table v-loading.body="listLoading" :data="tableDataPub" height="580" :default-sort="{prop: 'name', order: 'descending'}">
      <el-table-column prop="name" label="服务名称" sortable>
      </el-table-column>
      <!-- <el-table-column prop="detail" label="请求秘钥" sortable>
      </el-table-column>
      <el-table-column prop="type" label="是否加密" sortable>
      </el-table-column> -->
      <el-table-column prop="timestamp" label="申请时间" sortable>
      </el-table-column>
      <el-table-column prop="producer" label="服务来源" sortable>
      </el-table-column>
      <el-table-column prop="tag" label="分类">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain>{{scope.row.tag}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" width="260">
        <template slot-scope="scope">
          <el-button size="mini">查看</el-button>
          <el-button size="mini" type="danger" @click="openForbidden">禁用</el-button>
          <!-- <el-button size="mini">
            <i class="el-icon-download"></i>下载私钥</el-button> -->
          <el-button size="mini" @click="dialogTableVisible = true">授权管理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row class="change-page">
      <el-pagination class="pagebox" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="totalItem">
      </el-pagination>
    </el-row>
    <!-- 管理员-授权管理-弹层 -->
    <el-dialog title="服务授权管理" :visible.sync="dialogTableVisible">
      <el-container>
        <el-aside width="50%">
          <el-table :data="gridData" height="380">
            <el-table-column property="username" label="用户名"></el-table-column>
            <el-table-column property="centername" label="机构名称"></el-table-column>
            <el-table-column property="time" label="申请时间"></el-table-column>
          </el-table>
        </el-aside>
        <el-main>
          <el-input placeholder="请输入用户或机构名称" prefix-icon="el-icon-search" v-model="inputValue">
          </el-input>
          <el-form label-position="left" label-width="86px" style="padding: 20px;">
            <el-form-item label="申请时间：">
              2018-01-01
            </el-form-item>
            <el-form-item label="服务密钥：">
              sfdsfds987790f7sd97f9dfs78979
            </el-form-item>
            <el-form-item label="私钥管理：">
              <el-popover placement="top" width="160" v-model="visible1">
                <p>确定要重置密钥吗？</p>
                <div style="text-align: right; margin: 4px 0">
                  <el-button size="mini" type="text" @click="visible1 = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="visible1 = false">确定</el-button>
                </div>
                <el-button slot="reference" size="mini" type="danger" plain>重置私钥</el-button>
              </el-popover>
              &nbsp;
              <el-popover placement="top" width="160" v-model="visible2">
                <p>确定要禁用私钥吗？</p>
                <div style="text-align: right; margin: 4px 0">
                  <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button>
                </div>
                <el-button slot="reference" size="mini" type="danger" plain>禁用私钥</el-button>
              </el-popover>
              
              
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>

    </el-dialog>

  </div>

</template>

<script>
import * as api from "api/service/management";
export default {
  name: "subcription",
  data() {
    return {
      visible1: false,
      visible2: false,
      inputValue: "",
      gridData: [
        {
          username: "zz",
          centername: "z",
          time: "234-34-2344"
        },
        {
          username: "zz",
          centername: "z",
          time: "234-34-2344"
        },
        {
          username: "zz",
          centername: "z",
          time: "234-34-2344"
        },
        {
          username: "zz",
          centername: "z",
          time: "234-34-2344"
        },
        {
          username: "zz",
          centername: "z",
          time: "234-34-2344"
        },
        {
          username: "zz",
          centername: "z",
          time: "234-34-2344"
        },
        {
          username: "zz",
          centername: "z",
          time: "234-34-2344"
        },
        {
          username: "zz",
          centername: "z",
          time: "234-34-2344"
        },
        {
          username: "zz",
          centername: "z",
          time: "234-34-2344"
        },
        {
          username: "zz",
          centername: "z",
          time: "234-34-2344"
        },
        {
          username: "zz",
          centername: "z",
          time: "234-34-2344"
        },
        {
          username: "zz",
          centername: "z",
          time: "234-34-2344"
        },
        {
          username: "zz",
          centername: "z",
          time: "234-34-2344"
        },
        {
          username: "zz",
          centername: "z",
          time: "234-34-2344"
        }
      ],
      dialogTableVisible: false,
      listLoading: true,
      tableDataPub: [],
      tips: "禁用成功!",
      totalItem: 0,
      currentPage: 1,
      warning: "warning",
      success: "success",
      danger: "danger"
    };
  },
  created() {
    this.getSubscribeList({
      limit: "10",
      pageNo: "1",
      hasOrder: "1" // 是否订阅的标记：1：已有订阅，0：无订阅
    });
  },
  methods: {
    // 获取列表
    getSubscribeList(params) {
      api.getSubscribeList(params).then(res => {
        console.log(res);
        const { status, statusText, data } = res;
        if (status === 200 && statusText === "OK") {
          this.listLoading = false;
          this.tableDataPub = data.rows;
          this.totalItem = data.total;
          // this.$emit("gettotal", data.total);
        }
      });
    },

    openForbidden() {
      this.$confirm("您是否要禁用改服务?", "禁用提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 禁用接口?????
          api.forbiddenService({ servId: "001" }).then(res => {
            this.tips = res.message;
          });

          this.$message({
            type: "success",
            message: this.tips
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // handleRedFont(data) {  // 设置字体为红色
    //   if (data.rowIndex <= 4) {
    //     if (data.columnIndex === 2) {
    //       return "red-font";
    //     }
    //   }
    // },

    // 分页
    handleSizeChange(val) {
      this.currentPage = 1;
      this.getSubscribeList({
        limit: val,
        pageNo: "1"
      });
    },
    handleCurrentChange(val) {
      this.getSubscribeList({
        limit: "10",
        pageNo: val
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.red-font {
  color: #f77878;
}

.change-page {
  overflow: hidden;
}
.pagebox {
  // float: right;
  margin-top: 10px;
}
</style>

