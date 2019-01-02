<template>
  <div class="journal-done">
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
      <el-form-item label="操作类型">
        <ActiveBtn
          @handleClick="handleOptArr"
          :btnArr="optArr"
          :activeIndex="act"
          activeName="act1"
        />
      </el-form-item>
      <el-form-item label="日志级别">
        <ActiveBtn
          @handleClick="handleErrorArr"
          :btnArr="errorArr"
          :activeIndex="act"
          activeName="act1"
        />
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
          <template slot-scope="scope">
            <span v-if="!scope.row.exception">无</span>
            <el-button v-else class="exception" type="text" @click="showException(scope.row.exception)">{{scope.row.exception}}</el-button>
          </template>
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
  name: "journal-done",
  created() {
    api
      .postOptTypes()
      .then(data => {
        data.forEach((item, index) => {
          this.optArr.push({
            id: ++index,
            name: item.desc,
            show: false,
            value: item.key
          });
        });
      })
      .then(() => {
        this.getList();
      });
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
        }
      ],
      errorArr: [
        // 类别
        {
          name: "全部",
          value: null
        },
        {
          name: "调试",
          value: "debug"
        },
        {
          name: "信息",
          value: "info"
        },
        {
          name: "警告",
          value: "warn"
        },
        {
          name: "错误",
          value: "error"
        },
        {
          name: "严重错误",
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
      api.postDoneLog(query).then(data => {
        this.loading = false;
        data.rows.forEach(ele => {
          this.optArr.forEach(item => {
            if (item.value == ele.opt) {
              ele.opt = item.name;
            }
          });
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
    handleOptArr({ value }) {
      this.typeObj.opt = value || '';
    },
    handleErrorArr({ value }) {
      this.typeObj.errorValue = value || '';
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
</style>
