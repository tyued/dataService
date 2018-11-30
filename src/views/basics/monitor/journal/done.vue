<template>
  <div class="journal-done">
    <el-form label-position="left" label-width="70px">
      <el-form-item label="时间">
        <el-button size="small" v-for="(item,index) in timeArr" :key="index" :class="{active: item.show}" @click="handleTime(item)">{{item.name}}</el-button>
        <el-date-picker size="small" @change="handleTimeChange" value-format="yyyy-MM-dd" style="margin-left:10px;" v-model="valueT" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="操作类型">
        <el-button size="small" v-for="(item,index) in optArr" :key="index" :class="{active: item.show}" @click="handleOptArr(item)">{{item.name}}</el-button>
      </el-form-item>
      <el-form-item label="日志级别">
        <el-button size="small" v-for="(item,index) in errorArr" :key="index" :class="{active: item.show}" @click="handleErrorArr(item)">{{item.name}}</el-button>
      </el-form-item>
      <el-form-item label="业务名称">
        <el-input size="small" clearable :maxlength="50" prefix-icon="el-icon-search" placeholder="请输入业务名称关键字" v-model.trim="typeObj.business" style="width: 300px;"></el-input>
      </el-form-item>
      <el-button size="small" type="primary" @click="handleSearch"><i class="el-icon-search"></i> 查询</el-button>
    </el-form>

    <el-row style="margin: 10px 0;">
      <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="module" label="功能模块">
        </el-table-column>
        <el-table-column prop="business" label="业务名称">
        </el-table-column>
        <el-table-column prop="opt" label="操作类型">
          <template slot-scope="scope">
            <el-tag type="primary" size="small">{{scope.row.opt}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="操作描述">
        </el-table-column>
        <el-table-column prop="addr" label="来源IP地址">
        </el-table-column>
        <el-table-column prop="exception" label="异常信息">
        </el-table-column>
        <el-table-column prop="level" label="日志级别">
        </el-table-column>
        <el-table-column prop="userName" label="操作人">
        </el-table-column>
        <el-table-column width="170" prop="timestamp" label="操作发生时间">
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
  name: "journal-done",
  created() {
    api
      .postOptTypes()
      .then(res => {
        const { data, status } = res;
        if (status === 200 && data) {
          data.forEach((item, index) => {
            this.optArr.push({
              id: ++index,
              name: item.desc,
              show: false,
              value: item.key
            });
          });
        }
      })
      .then(() => {
        this.getList();
      });
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
      typeObj: {
        // 请求参数对象
        timeValue: "",
        opt: "",
        errorValue: "", //  此次服务接口访问结果状态   1：成功|0:异常
        business: ""
      }
    };
  },
  methods: {
    handleSearch() {
      this.getList(this.current, this.size);
    },
    getList(pageNo = 1, limit = this.size) {
      let query = {
        pageNo,
        limit
      };
      if (this.typeObj.timeValue.length !== 0) {
        query.begintime = this.typeObj.timeValue[0];
        query.endtime = this.typeObj.timeValue[1];
      }
      if (this.typeObj.opt.length !== 0) {
        query.opt = this.typeObj.opt;
      }
      if (this.typeObj.errorValue.length !== 0) {
        query.level = this.typeObj.errorValue;
      }
      if (this.typeObj.business.length !== 0) {
        query.business = this.typeObj.business;
      }
      api.postDoneLog(query).then(res => {
        const { status, data } = res;
        if (status === 200 && data) {
          this.loading = false;
          data.rows.forEach(ele => {
            ele.exception = ele.exception ? ele.exception : '无'
            this.optArr.forEach(item => {
              if (item.value == ele.opt) {
                ele.opt = item.name;
              }
            });
          });
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
    handleOptArr(item) {
      const { id, value } = item;
      this.optArr.forEach(item => (item.show = false));
      this.optArr[id].show = true;
      if (id === 0) {
        this.typeObj.opt = "";
      } else {
        this.typeObj.opt = value;
      }
    },
    handleErrorArr(item) {
      const { id, value } = item;
      this.errorArr.forEach(item => (item.show = false));
      this.errorArr[id].show = true;
      if (id === 0) {
        this.typeObj.errorValue = "";
      } else {
        this.typeObj.errorValue = value;
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
