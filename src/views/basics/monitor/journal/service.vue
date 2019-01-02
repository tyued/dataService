<template>
  <div class="journal-service">
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
      <el-form-item label="服务类型">
        <ActiveBtn
          @handleClick="handleServType"
          :btnArr="servTypeArr"
          :activeIndex="act"
          activeName="act1"
        />
      </el-form-item>
      <el-form-item label="服务分类">
        <ActiveBtn
          @handleClick="handleServTag"
          :btnArr="servTagArr"
          :activeIndex="act"
          activeName="act1"
        />
      </el-form-item>
      <el-form-item label="访问状态">
        <ActiveBtn
          @handleClick="handleStatus"
          :btnArr="status"
          :activeIndex="act"
          activeName="act1"
        />
      </el-form-item>
      <el-form-item label="关键字">
        <el-input size="small" clearable :maxlength="50" prefix-icon="el-icon-search" placeholder="请输入服务名称关键字" v-model.trim="typeObj.inputValue" style="width: 300px;"></el-input>
      </el-form-item>
      <el-button size="small" type="primary" @click="handleSearch"><i class="el-icon-search"></i> 查询</el-button>
    </el-form>

    <el-row style="margin: 10px 0;">
      <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="userName" label="用户名称">
        </el-table-column>
        <el-table-column prop="appName" label="应用名称">
        </el-table-column>
        <el-table-column prop="reqAddr" label="来源IP">
        </el-table-column>
        <el-table-column prop="reqURI" label="URI地址">
        </el-table-column>
        <el-table-column prop="type" label="异常类型">
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
        <el-table-column prop="duration" label="执行时间">
        </el-table-column>
        <el-table-column prop="exception" label="异常信息">
          <template slot-scope="scope">
            <span v-if="!scope.row.exception">无</span>
            <el-button v-else class="exception" type="text" @click="showException(scope.row.exception)">{{scope.row.exception}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="respCode" label="错误代码">
        </el-table-column>
        <el-table-column prop="respMsg" label="错误信息">
          <template slot-scope="scope">
            <span v-if="!scope.row.exception">无</span>
            <el-button v-else class="exception" type="text" @click="showRespMsg(scope.row.respMsg)">{{scope.row.respMsg}}</el-button>
          </template>
        </el-table-column>
        <el-table-column width="170" prop="timestamp" label="系统异常发生时间">
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
import * as dicty from "api/dictionary";
import * as api from "api/monitor";
import PageBar from "components/PageBar/index";
import moment from "utils/moment";
export default {
  name: "journal-service",
  created() {
    // api
    //   .postServTypes()
    //   .then(data => {
    //     data.forEach((item, index) => {
    //       this.servTagArr.push({
    //         id: ++index,
    //         name: item.desc,
    //         show: false,
    //         value: item.key
    //       });
    //     });
    //   })
    //   .then(() => {
    //     this.getList();
    //   });
    dicty
      .getBaseData({ group: "servType" })
      .then(data => {
        data.push({
          key: "sub",
          value: "已订阅"
        });
        data.forEach((item, index) => {
          this.servTagArr.push({
            id: ++index,
            name: item.value,
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
      servTagArr: [
        {
          name: "全部",
          value: null
        }
      ],
      servTypeArr: [
        {
          name: "全部",
          value: null
        },
        {
          name: "HTTP API",
          value: "1"
        },
        {
          name: "WebService API",
          value: "2"
        },
        {
          name: "通过数据源发布",
          value: "3"
        }
        // {name:'上传服务接口',type:'4'},
      ],
      status: [
        {
          name: "全部",
          value: null
        },
        {
          name: "成功",
          value: "1"
        },
        {
          name: "异常",
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
    showException(data) {
      this.dialog.tip = '异常信息'
      this.dialog.data = data
      this.dialogVisible = true
    },
    showRespMsg(data) {
      this.dialog.tip = '错误信息'
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
      api.postServiceLog(query).then(data => {
        this.loading = false;
        data.rows.forEach((item) => {
          // item.exception = item.exception ? item.exception : '无'
          item.type = item.type ? item.type : '无'
          // item.respMsg = item.respMsg ? item.respMsg : '无'
          item.status = item.status == '1' ? '成功' : '异常'
          item.duration = item.duration + 'ms'
        })
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
    handleServType({ value }) {
      this.typeObj.servType = value || '';
    },
    handleServTag({ value }) {
      this.typeObj.servTag = value || '';
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
</style>
