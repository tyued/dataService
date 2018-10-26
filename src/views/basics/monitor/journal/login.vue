<template>
  <div class="journal-login">
    <el-form label-position="left" label-width="100px">
      <el-form-item label="时间">
        <el-button v-for="(item,index) in timeArr" :key="index" :class="{active: item.show}" @click="handleTime(item)">{{item.name}}</el-button>
        <el-date-picker @change="handleTimeChange" value-format="yyyy-MM-dd" style="margin-left:10px;" v-model="valueT" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="认证授权类型">
        <el-button v-for="(item,index) in optArr" :key="index" :class="{active: item.show}" @click="handleOptType(item)">{{item.name}}</el-button>
      </el-form-item>
      <el-form-item label="认证协议">
        <el-button v-for="(item,index) in protocolArr" :key="index" :class="{active: item.show}" @click="handleProtocolType(item)">{{item.name}}</el-button>
      </el-form-item>
      <el-form-item label="认证授权结果">
        <el-button v-for="(item,index) in status" :key="index" :class="{active: item.show}" @click="handleStatus(item)">{{item.name}}</el-button>
      </el-form-item>
      <el-button type="primary" @click="handleSearch"><i class="el-icon-search"></i> 查询</el-button>
    </el-form>

    <el-row style="margin: 10px 0;">
      <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="日志ID" sortable>
        </el-table-column>
        <el-table-column prop="userId" label="认证授权对象ID">
        </el-table-column>
        <el-table-column prop="opt" label="认证授权类型">
        </el-table-column>
        <el-table-column prop="protocol" label="认证协议">
        </el-table-column>

        <el-table-column prop="realm" label="负责此次认证授权的realm名称">
        </el-table-column>
        <el-table-column prop="level" label="日志级别">
        </el-table-column>
        <el-table-column prop="addr" label="认证请求来源IP地址">
        </el-table-column>
        <el-table-column prop="status" label="认证授权结果">
        </el-table-column>
        <el-table-column prop="msg" label="认证授权请求信息">
        </el-table-column>
        <el-table-column prop="exception" label="认证授权异常信息">
        </el-table-column>
        <el-table-column prop="respCode" label="响应错误对照码">
        </el-table-column>
        <el-table-column prop="timestamp" label="认证授权发生时间">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <!-- 分页组件here -->
      <PageBar :total="total" :currentpage="current" @handlePage="handlePage" @handlePageSize="handlePageSize" />
    </el-row>
  </div>
</template>

<script>
import * as api from "api/monitor";
import PageBar from "components/PageBar/index";
import moment from "moment";
export default {
  name: "journal-login",
  created() {
    this.getList();
  },
  components: {
    PageBar
  },
  data() {
    return {
      loading: true,
      total: 0, // 分页
      current: 1, // 分页
      size: 10, // 缓存一下每页大小
      tableData: [], // 表格数据
      valueT: [], // 日期选择器数据
      timeArr: [
        // 日期-‘全部’ 高亮
        {
          id: 0,
          name: "全部",
          show: true,
          value: ""
        },
        {
          id: 1,
          name: "当日",
          show: false,
          value: this.outPutValue(1)
        },
        {
          id: 2,
          name: "7日内",
          show: false,
          value: this.outPutValue(7)
        },
        {
          id: 3,
          name: "30日内",
          show: false,
          value: this.outPutValue(30)
        }
      ],
      optArr: [
        {
          id: 0,
          name: "全部",
          show: true,
          value: ""
        },
        {
          id: 1,
          name: "登录认证",
          show: false,
          value: "login"
        },
        {
          id: 2,
          name: "会话注销",
          show: false,
          value: "logout"
        }
      ],
      protocolArr: [
        {
          id: 0,
          name: "全部",
          show: true,
          value: ""
        },
        {
          id: 1,
          name: "CAS",
          show: false,
          value: "CAS"
        },
        {
          id: 2,
          name: "HTTP",
          show: false,
          value: "HTTP"
        },
        {
          id: 3,
          name: "JWT",
          show: false,
          value: "JWT"
        },
        {
          id: 4,
          name: "LDAP",
          show: false,
          value: "LDAP"
        },
        {
          id: 5,
          name: "OAuth2",
          show: false,
          value: "OAuth2"
        },
        {
          id: 6,
          name: "OpenID",
          show: false,
          value: "OpenID"
        },
        {
          id: 7,
          name: "SMAL",
          show: false,
          value: "SMAL"
        }
      ],
      status: [
        {
          id: 0,
          name: "全部",
          show: true,
          value: ""
        },
        {
          id: 1,
          name: "成功",
          show: false,
          value: "success"
        },
        {
          id: 2,
          name: "失败",
          show: false,
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
    handleSearch() {
      this.getList(this.current, this.size);
    },
    getList(pageNo = 1, limit = 10) {
      let query = {};
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
      api.postServiceLog(query).then(res => {
        const { status, data } = res;
        if (status === 200 && data) {
          this.loading = false;
          this.tableData = data.rows;
          this.current = data.current;
          this.total = data.total;
        }
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
      this.timeArr.forEach(item => {
        item.show = false;
      });
    },
    outPutValue(long) {
      const today = moment().format("YYYY-MM-DD");
      const beforeDay = this.lastDay(today, -long);
      return [beforeDay, today];
    },
    lastDay(nowDay, n) {
      // 格式化日期-昨天
      return moment(nowDay)
        .add(n, "days")
        .format("YYYY-MM-DD");
    },
    handleTime(item) {
      const { id, value } = item;
      this.timeArr.forEach(item => (item.show = false));
      this.timeArr[id].show = true;
      if (id === 0) {
        this.typeObj.timeValue = "";
      } else {
        this.typeObj.timeValue = value;
      }
    },
    handleOptType(item) {
      const { id, value } = item;
      this.optArr.forEach(item => (item.show = false));
      this.optArr[id].show = true;
      if (id === 0) {
        this.typeObj.opt = "";
      } else {
        this.typeObj.opt = value;
      }
    },
    handleProtocolType(item) {
      const { id, value } = item;
      this.protocolArr.forEach(item => (item.show = false));
      this.protocolArr[id].show = true;
      if (id === 0) {
        this.typeObj.protocol = "";
      } else {
        this.typeObj.protocol = value;
      }
    },
    handleStatus(item) {
      const { id, value } = item;
      this.status.forEach(item => (item.show = false));
      this.status[id].show = true;
      if (id === 0) {
        this.typeObj.status = "";
      } else {
        this.typeObj.status = value;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.active {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}
</style>
