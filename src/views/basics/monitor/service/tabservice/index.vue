<template>
  <el-row id="monitor-tabbox">
    <el-col :span="5">
      <ul class="io-tree">
        <li v-for="(item, index) in tabData" :key="index" @click="changeTab(item)" :class="{'active': item.active}">{{item.name}}</li>
      </ul>
    </el-col>
    <el-col :span="19">
      <el-card :v-loading="flag" class="tabbox-card">
        <el-row class="row">
          <el-radio-group v-model="tabDateValue">
            <el-radio-button label="小时报"></el-radio-button>
            <el-radio-button label="日报"></el-radio-button>
          </el-radio-group>
        </el-row>
        <el-row v-if="tabDateValue == '日报'" class="row">
          <el-card :body-style="{padding: '0'}">
            <div slot="header" class="clearfix">
              <span>昨日关键指标</span>
            </div>
            <el-row style="padding: 30px 0;">
              <el-col class="keybox" :span="6">
                <p>调用次数</p>
                <h2>{{yesObj.calltimes}}</h2>
                <div>
                  <p>日&emsp;
                    <span>
                      <i></i>{{yesObj.calltimesPctDay}}</span>
                  </p>
                  <p>周&emsp;
                    <span>
                      <i></i>{{yesObj.calltimesPctWeek}}</span>
                  </p>
                  <p>月&emsp;
                    <span>{{yesObj.calltimesPctMonth}}</span>
                  </p>
                </div>
              </el-col>
              <el-col class="keybox" :span="6">
                <p>失败率</p>
                <h2>{{yesObj.failurePct}}</h2>
                <div>
                  <p>日&emsp;
                    <span>
                      <i></i>{{yesObj.failurePctDay}}</span>
                  </p>
                  <p>周&emsp;
                    <span>
                      <i></i>{{yesObj.failurePctWeek}}</span>
                  </p>
                  <p>月&emsp;
                    <span>{{yesObj.failurePctMonth}}</span>
                  </p>
                </div>
              </el-col>
              <el-col class="keybox" :span="6">
                <p>平均耗时(毫秒)</p>
                <h2>{{yesObj.avgdur}}</h2>
                <div>
                  <p>日&emsp;
                    <span>
                      <i></i>{{yesObj.avgdurPctDay}}</span>
                  </p>
                  <p>周&emsp;
                    <span>
                      <i></i>{{yesObj.avgdurPctWeek}}</span>
                  </p>
                  <p>月&emsp;
                    <span>{{yesObj.avgdurPctMonth}}</span>
                  </p>
                </div>
              </el-col>
              <el-col class="keybox" :span="6">
                <p>最大耗时(毫秒)</p>
                <h2>{{yesObj.maxdur}}</h2>
                <div>
                  <p>日&emsp;
                    <span>
                      <i></i>{{yesObj.maxdurPctDay}}</span>
                  </p>
                  <p>周&emsp;
                    <span>
                      <i></i>{{yesObj.maxdurPctWeek}}</span>
                  </p>
                  <p>月&emsp;
                    <span>{{yesObj.maxdurPctMonth}}</span>
                  </p>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-row>
        <el-row class="row">
          <el-tabs @tab-click="changeTabs" v-model="activeNameTable" type="border-card">
            <!-- <el-tab-pane label="关键指标详解" name="0">
                <Key :servId="servId" :apiId="apiId" :byType="byType" />
              </el-tab-pane> -->
            <el-tab-pane label="调用次数" name="0">
              <Uses ref="uses" :tabName="tabName" :servId="servId" :apiId="apiId" :byType="byType" />
            </el-tab-pane>
            <el-tab-pane label="失败率" name="1">
              <Fail ref="fail" :tabName="tabName" :servId="servId" :apiId="apiId" :byType="byType" />
            </el-tab-pane>
            <el-tab-pane label="平均耗时" name="2">
              <Avg ref="avg" :tabName="tabName" :servId="servId" :apiId="apiId" :byType="byType" />
            </el-tab-pane>
            <el-tab-pane label="最大耗时" name="3">
              <Max ref="max" :tabName="tabName" :servId="servId" :apiId="apiId" :byType="byType" />
            </el-tab-pane>
          </el-tabs>
        </el-row>
        <el-row class="row">
          <el-card class="main-table">
            <p class="tab-title">
              <span class="fl" style="line-height:40px;">
                <i class="el-icon-menu"></i> 详细数据</span>
              <span class="fr">
                <el-button type="text" @click="outputExcel">导出Excel</el-button>
              </span>
            </p>
            <el-table id="out-table" :data="tableData" stripe style="width: 100%;margin: 10px 0;">
              <el-table-column prop="date" label="时间" sortable>
              </el-table-column>
              <el-table-column v-if="byType === '1'" prop="hour" label="小时">
              </el-table-column>
              <el-table-column prop="calltimes" label="调用次数">
              </el-table-column>
              <el-table-column prop="failures" label="失败次数">
              </el-table-column>
              <el-table-column prop="failurePct" label="失败率">
              </el-table-column>
              <el-table-column prop="sumdur" label="总共耗时(毫秒)">
              </el-table-column>
              <el-table-column prop="avgdur" label="平均耗时(毫秒)">
              </el-table-column>
              <el-table-column prop="maxdur" label="最大耗时(毫秒)">
              </el-table-column>
            </el-table>
            <!-- 分页 组件-->
            <el-row>
              <PageBar :total="total" :currentpage="current" @handlePage="handlePage" @handlePageSize="handlePageSize" />
            </el-row>
          </el-card>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import * as api from "api/monitor";
import Max from "./max";
import Uses from "./uses";
import Avg from "./avg";
import Fail from "./fail";
import formatData from "utils/formatData";
import PageBar from "components/PageBar/index"; // 分页组件
import FileSaver from "file-saver"; // 导出Excel
import XLSX from "xlsx"; // Excel

export default {
  name: "tabservice",
  props: ["servId", "servType", "date"], // 服务的id和服务的类型
  components: {
    Uses,
    Max,
    Avg,
    Fail,
    PageBar
  },
  created() {
    this.init();
  },
  watch: {
    servId(id) {
      // 更新试图   切换服务重新拉去服务器信息
      this.init();
    }
  },
  computed: {
    byType() {
      return this.tabDateValue === "日报" ? "2" : "1"; // 1：按小时、2：按日 默认为日报，
    }
  },
  data() {
    return {
      total: 0, // 分页
      current: 0, // 分页
      size: 10, // 缓存一下每页大小
      tableData: [], // 表格数据
      tabData: [],
      activeName: "0", // 默认展示第一个tab栏
      activeNameTable: "0", // 默认展示第一个tab栏
      tabDateValue: "日报", // 默认为日报
      yesObj: {},
      apiId: "",
      tabName: "0",
      flag: true
    };
  },
  methods: {
    init() {
      // 初始化弹出层
      // 改变左侧tab
      this.activeName = "0"; // 重置高亮左侧导航
      // 先获取接口List
      api
        .postInterfaceList({
          servId: this.servId,
          type: this.servType
        })
        .then(data => {
          data.forEach(item => {
            item.active = false;
          });
          data[0].active = true; // 默认第一个高亮
          this.tabData = data;
          // 初始化第一个tab 把第一个id传进去
          this.initTab(data[0].id);
        });
      // // 重置tabs为第一个
      this.activeNameTable = "0";
    },
    changeTab(item) {
      if (this.flag) {
        return;
      }
      this.flag = true;
      // 改变接口tab
      if (!item) {
        // 防止报错
        return;
      }
      this.tabData.forEach(item => {
        item.active = false;
      });
      item.active = true;
      let id = item.id;
      this.initTab(id);
    },
    async initEcharts() {
      // 请求太多，控制频繁请求
      await this.$refs.uses.init();
      await this.$refs.max.init();
      await this.$refs.fail.init();
      await this.$refs.avg.init();
    },
    async initTab(id) {
      // 每个接口tab的初始化及切换
      this.apiId = id;
      // // 改变小时和日报
      this.tabDateValue = "日报"; // 重置默认为日报 改变type
      // 昨日信息
      await this.getYesterday(id);
      // 获取下面表格
      await this.getTable();
      // 获取4 个 echarts
      await this.initEcharts();

      this.flag = false;
    },
    async getYesterday(id) {
      // 昨日信息
      let data = await api.postYesterday({
        servId: this.servId,
        apiId: id
      });
      formatData(data);
      this.yesObj = data;
    },
    changeTabs(tab) {
      // 改变echarts tab
      this.tabName = tab.name;
    },
    async getTable(pageNo = 1, limit = this.size) {
      // 渲染表格
      let data = await api.postDetail({
        pageNo,
        limit,
        byType: this.byType,
        servId: this.servId,
        apiId: this.apiId
      });
      this.tableData = data.rows;
      this.total = parseInt(data.total);
      this.current = parseInt(data.current);
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
    outputExcel() {
      // 导出Excel
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "导出表格.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tabs__content {
  overflow: auto;
}
.tab-circle {
  text-align: center;
  font-size: 14px;
  p {
    margin-top: 4px;
  }
}
.keybox {
  border-right: 1px solid #ebeef5;
  text-align: center;
  &:last-child {
    border-right: none;
  }
  h2 {
    line-height: 2em;
    font-size: 30px;
    font-weight: normal;
    color: #303133;
  }
  div {
    display: inline-block;
    text-align: left;
    margin: 0 auto;
  }
}
.io-tree {
  padding: 10px 0px;
  li {
    cursor: pointer;
    line-height: 1em;
    font-size: 14px;
    text-align: center;
    padding-right: 20px;
    padding-bottom: 10px;
    padding-top: 10px;
    &:hover {
      background-color: #f5f7fa;
    }
    &.active {
      color: #409eff;
    }
    transition: all 0.2s;
  }
}
</style>

