<template>
  <div class="journal-service">
    <el-form label-position="left" label-width="70px">
      <el-form-item label="时间">
        <el-button v-for="(item,index) in timeArr" :key="index" :class="{active: item.show}" @click="handleTime(item)">{{item.name}}</el-button>
        <el-date-picker @change="handleTimeChange" value-format="yyyy-MM-dd" style="margin-left:10px;" v-model="valueT" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="服务类型">
        <el-button v-for="(item,index) in servTypeArr" :key="index" :class="{active: item.show}" @click="handleServType(item)">{{item.name}}</el-button>
      </el-form-item>
      <el-form-item label="服务分类">
        <el-button v-for="(item,index) in servTagArr" :key="index" :class="{active: item.show}" @click="handleServTag(item)">{{item.name}}</el-button>
      </el-form-item>
      <el-form-item label="访问状态">
        <el-button v-for="(item,index) in status" :key="index" :class="{active: item.show}" @click="handleStatus(item)">{{item.name}}</el-button>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input clearable :maxlength="50" prefix-icon="el-icon-search" placeholder="请输入服务名称关键字" v-model="typeObj.inputValue" style="width: 300px;"></el-input>
      </el-form-item>
      <el-button type="primary" @click="handleSearch"><i class="el-icon-search"></i> 查询</el-button>
    </el-form>

    <el-row style="margin: 10px 0;">
      <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
        <el-table-column sortable prop="userId" label="接口的用户ID/服务创建人ID">
        </el-table-column>
        <el-table-column sortable prop="userName" label="用户名称">
        </el-table-column>
        <el-table-column sortable prop="appId" label="接口的应用ID">
        </el-table-column>
        <el-table-column sortable prop="appName" label="接口的应用名称">
        </el-table-column>

        <el-table-column sortable prop="reqAddr" label="来源IP">
        </el-table-column>
        <el-table-column sortable prop="reqURI" label="URI地址">
        </el-table-column>
        <el-table-column sortable prop="type" label="系统异常类型">
        </el-table-column>
        <el-table-column sortable prop="status" label="状态">
        </el-table-column>
        <el-table-column sortable prop="duration" label="执行时间">
        </el-table-column>
        <el-table-column sortable prop="exception" label="异常信息">
        </el-table-column>
        <el-table-column sortable prop="respCode" label="响应错误对照码">
        </el-table-column>
        <el-table-column sortable prop="respMsg" label="错误信息">
        </el-table-column>
        <el-table-column sortable prop="timestamp" label="系统异常发生时间">
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
  name: "journal-service",
  created() {
    api.postServTypes().then(res => {
      const { data, status } = res;
      if (status === 200 && data) {
        data.forEach((item, index) => {
          this.servTypeArr.push({
            id: ++index,
            name: item.desc,
            show: false,
            value: item.key
          });
        });
      }
    }).then(() => {
      this.getList()
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
      servTypeArr: [
        {
          id: 0,
          name: "全部",
          show: true,
          value: ""
        }
      ],
      servTagArr: [
        {
          id: 0,
          name: "全部",
          show: true,
          value: ""
        },
        {
          id: 1,
          name: "HTTP API",
          show: false,
          value: "1"
        },
        {
          id: 2,
          name: "WebService API",
          show: false,
          value: "2"
        },
        {
          id: 3,
          name: "通过数据源发布",
          show: false,
          value: "3"
        }
        // {name:'上传服务接口',type:'4'},
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
          value: "1"
        },
        {
          id: 2,
          name: "异常",
          show: false,
          value: "2"
        }
      ],
      typeObj: {
        // 请求参数对象
        // appId: "", // 此次访问服务接口的应用ID（后期应用管理有了后就可以加上）
        timeValue: "",
        servType: "",
        servTag: "",
        status: "", //  此次服务接口访问结果状态   1：成功|0:异常
        inputValue: ""
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
      if (this.typeObj.servType.length !== 0) {
        query.servType = this.typeObj.servType;
      }
      if (this.typeObj.servTag.length !== 0) {
        query.servTag = this.typeObj.servTag;
      }
      if (this.typeObj.status.length !== 0) {
        query.status = this.typeObj.status;
      }
      if (this.typeObj.inputValue.length !== 0) {
        query.servName = this.typeObj.inputValue;
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
    handleServType(item) {
      const { id, value } = item;
      this.servTypeArr.forEach(item => (item.show = false));
      this.servTypeArr[id].show = true;
      if (id === 0) {
        this.typeObj.servType = "";
      } else {
        this.typeObj.servType = value;
      }
    },
    handleServTag(item) {
      const { id, value } = item;
      this.servTagArr.forEach(item => (item.show = false));
      this.servTagArr[id].show = true;
      if (id === 0) {
        this.typeObj.servTag = "";
      } else {
        this.typeObj.servTag = value;
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
