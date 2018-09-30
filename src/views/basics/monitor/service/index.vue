<template>
  <div class="detail-service">
    <!-- ==========服务监控============ -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>服务信息</span>
      </div>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item v-loading="loading" v-for="(item, index) in tabData" :key="index" :name="index">
          <template slot="title">
            <span style="font-size: 14px;">{{item.servName}}</span>
            <el-button class="btn" type="text" @click.stop="showIOList(item.servId, item.servType)">点击查看接口信息</el-button>
          </template>
          <el-row>
            <el-col class="itembox" :span="7">
              <div class="name-box">服务名称：
                <span>{{item.servName}}</span>
              </div>
            </el-col>
            <el-col class="itembox" :span="5">
              <div class="number-box">
                <p>订阅用户数</p>
                <p>
                  <span>{{item.subscribers}}</span>
                </p>
                <p>七日内新增：
                  <span>{{item.incrementWeek}}</span>
                </p>
                <p>七日内退订：
                  <span>{{item.decrementWeek}}</span>
                </p>
              </div>
            </el-col>
            <el-col class="itembox" :span="12">
              <el-row style="padding: 30px 0;">
                <el-col class="keybox" :span="6">
                  <p>调用次数</p>
                  <h2>{{item.calltimes}}</h2>
                  <div>
                    <p>日&emsp;
                      <span>
                        <i></i>{{item.calltimesPctDay}}</span>
                    </p>
                    <p>周&emsp;
                      <span>
                        <i></i>{{item.calltimesPctWeek}}</span>
                    </p>
                    <p>月&emsp;
                      <span>
                        <i></i>{{item.calltimesPctMonth}}</span>
                    </p>
                  </div>
                </el-col>
                <el-col class="keybox" :span="6">
                  <p>失败率</p>
                  <h2>{{item.failurePct}}</h2>
                  <div>
                    <p>日&emsp;
                      <span>
                        <i></i>{{item.failurePctDay}}</span>
                    </p>
                    <p>周&emsp;
                      <span>
                        <i></i>{{item.failurePctWeek}}</span>
                    </p>
                    <p>月&emsp;
                      <span>
                        <i></i>{{item.failurePctMonth}}</span>
                    </p>
                  </div>
                </el-col>
                <el-col class="keybox" :span="6">
                  <p>平均耗时(毫秒)</p>
                  <h2>{{item.avgdur}}</h2>
                  <div>
                    <p>日&emsp;
                      <span>
                        <i></i>{{item.avgdurPctDay}}</span>
                    </p>
                    <p>周&emsp;
                      <span>
                        <i></i>{{item.avgdurPctWeek}}</span>
                    </p>
                    <p>月&emsp;
                      <span>
                        <i></i>{{item.avgdurPctMonth}}</span>
                    </p>
                  </div>
                </el-col>
                <el-col class="keybox" :span="6">
                  <p>最大耗时(毫秒)</p>
                  <h2>{{item.maxdur}}</h2>
                  <div>
                    <p>日&emsp;
                      <span>
                        <i></i>{{item.maxdurPctDay}}</span>
                    </p>
                    <p>周&emsp;
                      <span>
                        <i></i>{{item.maxdurPctWeek}}</span>
                    </p>
                    <p>月&emsp;
                      <span>
                        <i></i>{{item.maxdurPctMonth}}</span>
                    </p>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <PageBar :total="total" :currentpage="current" @handlePage="handlePage" @handlePageSize="handlePageSize" />
    </el-card>

    <!-- 接口的弹出层 -->
    <el-dialog width="76%" title="接口信息" :visible.sync="dialogIOVisible">
      <TabService :servId="servId" :servType="servType" />
    </el-dialog>
    <!-- /接口的弹出层 -->
  </div>
</template>
<script>
import * as api from "api/monitor";
import TabService from "./tabservice/index";
import PageBar from "components/PageBar/index";
import formatData from 'utils/formatData'

export default {
  name: "service",
  components: {
    TabService,
    PageBar
  },
  created() {
    this.id = this.$route.query.id; // 获取传过来的用户ID
    this.init();
  },
  data() {
    return {
      id: "", // 用户id
      servId: "", // 服务id
      servType: "", // 服务类型
      tabData: [],
      activeName: 0, // 默认展开第一个
      dialogIOVisible: false,
      total: 0,
      current: 0,
      loading: true
    };
  },
  methods: {
    init() {
      this.getList();
    },
    getList(pageNo = 1, limit = 10) {
      api
        .postQueryList({
          limit,
          pageNo
        })
        .then(res => {
          const { status, data } = res;
          if (status === 200 && data) {
            this.loading = false
            data.rows.forEach(item => {
              formatData(item)
            });
            this.tabData = data.rows;
            this.total = parseInt(data.total);
            this.current = parseInt(data.current);
          }
        });
    },
    showIOList(servId, servType) {
      this.servId = servId; // 挂起服务id，弹层根据此id来查询接口
      this.servType = servType
      this.dialogIOVisible = true;
    },
    handlePage(number) {
      // 分页
      this.getList(number);
      this.current = number;
    },
    handlePageSize(number) {
      this.getList(1, number);
      this.current = 1;
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  height: 40px;
  color: #303133;
  font-size: 18px;
  .title-span {
    vertical-align: bottom;
    display: inline-block;
    line-height: 32px;
  }
}
.name-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  font-size: 24px;
  // font-weight: bold;
  line-height: 2em;
  padding: 20px 40px 20px 20px;
}
.itembox {
  height: 210px;
  position: relative;
}
.itembox:nth-child(1) {
  border-right: 1px solid #ebeef5;
}
.number-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  span {
    color: #409eff;
  }
  p {
    line-height: 1.7em;
  }
  p:nth-child(1) {
    font-size: 20px;
  }
  p:nth-child(2) {
    font-size: 30px;
    margin-bottom: 30px;
  }
  p:nth-child(3),
  p:nth-child(4) {
    font-size: 14px;
  }
}
.el-collapse-item__content {
  padding-bottom: 0;
}

// =====================
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
.tab-title {
  line-height: 40px;
}
.status-ft {
  float: right;
  font-weight: bold;
}
.btn {
  padding: 0;
  float: right;
  line-height: 48px;
  border: none;
}
</style>
