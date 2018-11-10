<template>
  <div class="journal-systerm">
    <el-form label-position="left" label-width="100px">
      <el-form-item label="时间">
        <el-button v-for="(item,index) in timeArr" :key="index" :class="{active: item.show}" @click="handleTime(item)">{{item.name}}</el-button>
        <el-date-picker @change="handleTimeChange" value-format="yyyy-MM-dd" style="margin-left:10px;" v-model="valueT" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="系统异常类型">
        <el-button v-for="(item,index) in systermArr" :key="index" :class="{active: item.show}" @click="handleSystermArr(item)">{{item.name}}</el-button>
      </el-form-item>
      <el-form-item label="日志级别">
        <el-button v-for="(item,index) in errorArr" :key="index" :class="{active: item.show}" @click="handleError(item)">{{item.name}}</el-button>
      </el-form-item>
      <el-button type="primary" @click="handleSearch"><i class="el-icon-search"></i> 查询</el-button>
    </el-form>

    <el-row style="margin: 10px 0;">
      <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="userId" label="系统异常操作人ID" sortable>
        </el-table-column>
        <el-table-column prop="clazz" label="系统异常对象">
        </el-table-column>
        <el-table-column prop="type" label="系统异常类型">
        </el-table-column>
        <el-table-column prop="level" label="日志级别">
        </el-table-column>
        <el-table-column prop="addr" label="导致系统异常的请求来源IP地址">
        </el-table-column>
        <el-table-column prop="code" label="系统异常代码">
        </el-table-column>
        <el-table-column prop="msg" label="系统异常描述">
        </el-table-column>
        <el-table-column prop="exception" label="系统异常信息">
        </el-table-column>
        <el-table-column prop="timestamp" label="系统异常发生时间">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button size="small" type="primary">查看</el-button>
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
  name: "journal-systerm",
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
      errorArr: [
        // 类别
        {
          id: 0,
          name: "全部",
          show: true,
          value: ""
        },
        {
          id: 1,
          name: "调试",
          show: false,
          value: "debug"
        },
        {
          id: 2,
          name: "信息",
          show: false,
          value: "info"
        },
        {
          id: 3,
          name: "警告",
          show: false,
          value: "warn"
        },
        {
          id: 4,
          name: "错误",
          show: false,
          value: "error"
        },
        {
          id: 5,
          name: "严重错误",
          show: false,
          value: "fetal"
        }
      ],
      systermArr: [
        {
          id: 0,
          name: "全部",
          show: true,
          value: ""
        },
        {
          id: 1,
          name: "运行异常",
          show: false,
          value: "runtime"
        },
        {
          id: 2,
          name: "检查异常",
          show: false,
          value: "check"
        },
        {
          id: 3,
          name: "IO异常",
          show: false,
          value: "io"
        },
        {
          id: 4,
          name: "数据库异常",
          show: false,
          value: "dbaccess"
        }
      ],
      typeObj: {
        // 请求参数对象
        timeValue: "",
        errorValue: "",
        systermValue: ""
      }
    };
  },
  methods: {
    handleSearch() {
      this.getList(this.current, this.size);
    },
    getList(pageNo = 1, limit = this.size) {
      let query = {};
      if (this.typeObj.timeValue.length !== 0) {
        query.begintime = this.typeObj.timeValue[0];
        query.endtime = this.typeObj.timeValue[1];
      }
      if (this.typeObj.errorValue.length !== 0) {
        query.level = this.typeObj.errorValue;
      }
      if (this.typeObj.systermValue.length !== 0) {
        query.type = this.typeObj.systermValue;
      }
      api.postSystermLog(query).then(res => {
        const { status, data } = res;
        if (status === 200 && data) {
          this.loading = false;
          this.tableData = data.rows;
          this.current = data.current;
          this.total = data.total;
        }
      });
    },
    handleError(item) {
      const { id, value } = item;
      this.errorArr.forEach(item => (item.show = false));
      this.errorArr[id].show = true;
      if (id === 0) {
        this.typeObj.errorValue = "";
      } else {
        this.typeObj.errorValue = value;
      }
    },
    handleSystermArr(item) {
      const { id, value } = item;
      this.systermArr.forEach(item => (item.show = false));
      this.systermArr[id].show = true;
      if (id === 0) {
        this.typeObj.systermValue = "";
      } else {
        this.typeObj.systermValue = value;
      }
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

