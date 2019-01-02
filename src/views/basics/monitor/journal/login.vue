<template>
  <div class="journal-login">
    <el-form label-position="left" label-width="70px">
      <el-form-item label="时间">
        <ActiveBtn
          @handleClick="handleTimeBtn"
          :btnArr="timeArr"
          :activeIndex="act"
          :cancel="cancel"
          activeName="act1"
        />
        <el-date-picker size="small" @change="handleTimeChange" value-format="yyyy-MM-dd" style="margin-left:10px;" v-model="valueT" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="认证类型">
        <ActiveBtn
          @handleClick="handleOptType"
          :btnArr="optArr"
          :activeIndex="act"
          activeName="act1"
        />
      </el-form-item>
      <el-form-item label="认证协议">
        <ActiveBtn
          @handleClick="handleProtocolType"
          :btnArr="protocolArr"
          :activeIndex="act"
          activeName="act1"
        />
      </el-form-item>
      <el-form-item label="认证结果">
        <ActiveBtn
          @handleClick="handleStatus"
          :btnArr="status"
          :activeIndex="act"
          activeName="act1"
        />
      </el-form-item>
      <el-button size="small" type="primary" @click="handleSearch"><i class="el-icon-search"></i> 查询</el-button>
    </el-form>

    <el-row style="margin: 10px 0;">
      <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
        <!-- <el-table-column prop="id" label="日志ID" sortable>
        </el-table-column> -->
        <el-table-column prop="userName" label="认证对象">
          <template slot-scope="scope">
            <span :class="{'red': scope.row.red}">{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="opt" label="认证类型">
        </el-table-column>
        <el-table-column prop="protocol" label="认证协议">
        </el-table-column>
        <el-table-column prop="realm" label="Realm名称">
        </el-table-column>
        <el-table-column prop="level" label="日志级别">
        </el-table-column>
        <el-table-column prop="addr" label="来源IP地址">
        </el-table-column>
        <el-table-column prop="status" label="认证结果">
        </el-table-column>
        <el-table-column prop="msg" label="请求信息">
        </el-table-column>
        <el-table-column prop="exception" label="异常信息">
          <template slot-scope="scope">
            <span v-if="!scope.row.exception">无</span>
            <el-button v-else class="exception" type="text" @click="showException(scope.row.exception)">{{scope.row.exception}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="respCode" label="错误对照码">
        </el-table-column>
        <el-table-column width="170" prop="timestamp" label="认证时间">
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <!-- 分页组件here -->
      <PageBar :total="total" :currentpage="current" @handlePage="handlePage" @handlePageSize="handlePageSize" />
    </el-row>
    <el-dialog
      :title="dialog.tip"
      :visible.sync="dialogVisible"
      >
      <pre>{{dialog.data}}</pre>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ActiveBtn from "components/ActiveBtn";
import * as api from "api/monitor";
import PageBar from "components/PageBar/index";
import moment from "utils/moment";
export default {
  name: "journal-login",
  created() {
    this.getList();
  },
  components: {
    PageBar,
    ActiveBtn
  },
  data() {
    return {
      act: 0,
      cancel: -1,
      dialogVisible: false,
      dialog: {
        tip: '',
        data: ''
      },
      loading: true,
      total: 0, // 分页
      current: 1, // 分页
      size: 10, // 缓存一下每页大小
      tableData: [], // 表格数据
      valueT: [], // 日期选择器数据
      timeArr: [
        // 日期-‘全部’ 高亮
        {
          name: "全部",
          value: null
        },
        {
          name: "当日",
          value: 1
        },
        {
          name: "7日内",
          value: 7
        },
        {
          name: "30日内",
          value: 30
        }
      ],
      optArr: [
        {
          name: "全部",
          value: null
        },
        {
          name: "登录认证",
          value: "login"
        },
        {
          name: "会话注销",
          value: "logout"
        }
      ],
      protocolArr: [
        {
          name: "全部",
          value: null
        },
        {
          name: "CAS",
          value: "CAS"
        },
        {
          name: "HTTP",
          value: "HTTP"
        },
        {
          name: "JWT",
          value: "JWT"
        },
        {
          name: "LDAP",
          value: "LDAP"
        },
        {
          name: "OAuth2",
          value: "OAuth2"
        },
        {
          name: "OpenID",
          value: "OpenID"
        },
        {
          name: "SMAL",
          value: "SMAL"
        }
      ],
      status: [
        {
          name: "全部",
          value: null
        },
        {
          name: "成功",
          value: "success"
        },
        {
          name: "失败",
          value: "fail"
        }
      ],
      typeObj: {
        // 请求参数对象
        timeValue: "",
        opt: "",
        protocol: "", // 认证协议
        status: "" //  此次服务接口访问结果状态   1：成功|0:异常
      }
    };
  },
  methods: {
    showException(data) {
      this.dialog.tip = '异常信息'
      this.dialog.data = data
      this.dialogVisible = true
    },
    handleSearch() {
      this.getList(this.current, this.size);
    },
    getList(pageNo = 1, limit = this.size) {
      let query = {
        pageNo,
        limit,
      };
      if (this.typeObj.timeValue.length !== 0) {
        query.begintime = this.typeObj.timeValue[0];
        query.endtime = this.typeObj.timeValue[1];
      }
      if (this.typeObj.opt.length !== 0) {
        query.opt = this.typeObj.opt;
      }
      if (this.typeObj.protocol.length !== 0) {
        query.protocol = this.typeObj.protocol;
      }
      if (this.typeObj.status.length !== 0) {
        query.status = this.typeObj.status;
      }
      api.postLoginLog(query).then(data => {
        this.loading = false;
        data.rows.forEach(ele => {
          if (!ele.userName) {
            ele.userName = '异常账户'
            ele.red = true
          }
          ele.respCode = ele.respCode ? ele.respCode : '无'
        });
        this.tableData = data.rows;
        this.current = data.current;
        this.total = data.total;
      });
    },
    handlePage(number) {
      // 分页
      this.getList(number);
      this.current = number;
    },
    handlePageSize(number) {
      // 分页大小
      this.size = number;
      this.getList(1, number);
      this.current = 1;
    },
    handleTimeChange(data) {
      // 日期组件change事件
      this.typeObj.timeValue = data;
      // 解除其余日期按钮高亮
      this.cancel = -Math.random();
    },
    handleTimeBtn({ value }) {
      this.valueT = [] // 日期选择器清空
      this.typeObj.timeValue = value || "";
    },
    handleOptType({ value }) {
      this.typeObj.opt = value || '';
    },
    handleProtocolType({ value }) {
      this.typeObj.protocol = value || '';
    },
    handleStatus({ value }) {
      this.typeObj.status = value || '';
    }
  }
};
</script>

<style lang="scss" scoped>
pre {
  height: 500px;
  overflow-y: auto;
}
.exception {
  text-align: left;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.red {
  color: #F56C6C;
}
</style>
