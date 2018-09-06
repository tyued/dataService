<template>
  <div class="monitor">
    <el-row class="gl-rowbox">
      <el-card class="box-card">
        系统监控
      </el-card>
    </el-row>
    <el-row class="gl-rowbox" :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <el-row>
            <el-col :span="10" style="padding: 0px 20px;">
              <h2>192.168.0.189</h2>
              <el-progress style="padding: 6px 0;" :text-inside="true" :stroke-width="22" :percentage="80" color="rgba(142, 113, 199, 0.7)"></el-progress>
              <el-progress style="padding: 6px 0;" :text-inside="true" :stroke-width="22" :percentage="100" status="success"></el-progress>
              <el-progress style="padding: 6px 0;" :text-inside="true" :stroke-width="22" :percentage="50" status="exception"></el-progress>
            </el-col>
            <el-col :span="14">
              <div class="font-box">
                <li>CPU使用率&emsp;&emsp;
                  <span :style="{color: '#F56C6C'}">99%</span>
                </li>
                <li>内存使用率&emsp;&emsp;
                  <span :style="{color: '#E6A23C'}">60%</span>
                </li>
                <li>硬盘使用率&emsp;&emsp;
                  <span :style="{color: '#67C23A'}">20%</span>
                </li>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <el-row>
            <el-col :span="10" style="padding: 0px 20px;">
              <h2>192.168.0.189</h2>
              <el-progress style="padding: 6px 0;" :text-inside="true" :stroke-width="22" :percentage="80" color="rgba(142, 113, 199, 0.7)"></el-progress>
              <el-progress style="padding: 6px 0;" :text-inside="true" :stroke-width="22" :percentage="100" status="success"></el-progress>
              <el-progress style="padding: 6px 0;" :text-inside="true" :stroke-width="22" :percentage="50" status="exception"></el-progress>
            </el-col>
            <el-col :span="14">
              <div class="font-box">
                <li>CPU使用率&emsp;&emsp;
                  <span :style="{color: '#F56C6C'}">99%</span>
                </li>
                <li>内存使用率&emsp;&emsp;
                  <span :style="{color: '#E6A23C'}">60%</span>
                </li>
                <li>硬盘使用率&emsp;&emsp;
                  <span :style="{color: '#67C23A'}">20%</span>
                </li>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="gl-rowbox">
      <el-card>
        <div slot="header" class="clearfix">
          <span>访问量统计</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>

        <el-row>
          <el-radio-group v-model="radio3" class="fr">
            <el-radio-button label="当日分时统计"></el-radio-button>
            <el-radio-button label="7月统计"></el-radio-button>
            <el-radio-button label="月统计"></el-radio-button>
          </el-radio-group>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="14">
            echarts
          </el-col>
          <el-col :span="10">
            <el-card shadow="never">
              <p>当日服务访问量Top5</p>
              <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="date" label="服务名称">
                </el-table-column>
                <el-table-column prop="name" label="服务提供方">
                </el-table-column>
                <el-table-column prop="address" label="调用次数">
                  <template slot-scope="scope">
                    <el-row>
                      <el-col :span="15">
                        <el-progress :percentage="80" color="#8e71c7" :stroke-width="10" :show-text="false" style="margin-top: 6.5px;"></el-progress>
                      </el-col>
                      <el-col :span="9">&nbsp;121244</el-col>
                    </el-row>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row class="gl-rowbox">
      <el-card class="box-card">
        服务监控
      </el-card>
    </el-row>
    <el-row class="gl-rowbox">
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="box-card" shadow="never" :body-style="{height: '280px'}">
              <div slot="header" class="clearfix">
                <span>服务名称</span>
              </div>
              <p>天音智慧教育</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card" shadow="never" :body-style="{height: '280px'}">
              <div slot="header" class="clearfix">
                <span>用户订阅数</span>
              </div>
              <p>12345</p>
              <p>七日内新增： 4234</p>
              <p>七日内退订： 234242</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card" shadow="never" :body-style="{height: '280px'}">
              <div slot="header" class="clearfix">
                <span>用户订阅数</span>
              </div>
              <el-table :data="tableData" stripe style="width: 100%" height="240">
                <el-table-column prop="date" label="数据使用方">
                </el-table-column>
                <el-table-column prop="name" label="异常类型">
                </el-table-column>
                <el-table-column prop="address" label="错误原因">
                </el-table-column>
                <el-table-column prop="address" label="请求时间">
                </el-table-column>
              </el-table>
            </el-card>

          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-tabs tab-position="left" type="border-card">
            <el-tab-pane label="用户管理">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
          </el-tabs>
        </el-row>

      </el-card>
    </el-row>
    <el-row class="gl-rowbox">
      <el-card class="box-card">
        系统日志
      </el-card>
    </el-row>
    <el-row class="gl-rowbox">
      <el-card class="box-card">
        <el-row class="wx-box">
          <el-tabs tab-position="top" type="border-card">
            <el-tab-pane label="用户管理">
              <el-row style="margin-bottom: 20px;">时间：
                <el-button type="primary" plain>全部</el-button>
                <el-button type="primary" plain>当日</el-button>
                <el-button type="primary" plain>7日内</el-button>
                <el-button type="primary" plain>30日内</el-button>
                <el-date-picker style="margin-left: 10px;" v-model="value7" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
                </el-date-picker>
              </el-row>
              <el-row style="margin-bottom: 20px;">组件：
                <el-button type="primary" plain>全部</el-button>
                <el-button type="primary" plain>适配器</el-button>
                <el-button type="primary" plain>moven</el-button>
                <el-button type="primary" plain>RobbitMQ</el-button>
                <el-button type="primary" plain>服务器</el-button>
              </el-row>
              <el-row style="margin-bottom: 20px;">类别：
                <el-button type="primary" plain>全部</el-button>
                <el-button type="primary" plain>运行异常</el-button>
                <el-button type="primary" plain>运行警告</el-button>
              </el-row>
              <el-row>关键字：
                <el-input placeholder="search" v-model="input10" clearable style="width: 200px;"></el-input>
              </el-row>
              <el-row style="margin-bottom: 20px;">
                <el-button type="primary" class="fr" style="width: 200px;">查询</el-button>
              </el-row>
              <el-row>
                <el-table :data="tableData" stripe style="width: 100%;margin-bottom: 10px;">
                  <el-table-column prop="date" label="日期">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名">
                  </el-table-column>
                  <el-table-column prop="address" label="地址">
                  </el-table-column>
                  <el-table-column prop="address" label="地址">
                  </el-table-column>
                </el-table>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
                </el-pagination>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="配置管理">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
          </el-tabs>
        </el-row>

      </el-card>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "monitor",
  data() {
    return {
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value7: "",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区"
        }
      ],
      currentPage4: 5,
      radio3: "当日分时统计",
      input10: ""
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style lang="scss" scoped>
h2 {
  font-weight: normal;
  margin: 4px 0;
}
.box-card {
  color: #303133;
  font-size: 18px;
}
.font-box {
  color: #303133;
  padding: 20px 20px;
  text-align: center;
  li {
    padding: 6px 0;
    font-size: 16px;
  }
}
.wx-box {
  font-size: 16px;
}
</style>
