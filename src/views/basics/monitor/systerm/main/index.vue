<template>
  <div class="main">
    <el-row :gutter="20">
      <el-col v-for="(item,index) in list" :key="index" :lg="12" :sm="24" style="margin-bottom:20px;">
        <el-card class="box-card" :body-style="{padding: 0}">
          <div slot="header" class="clearfix">
            <span>{{item.registration.name}}</span>
            <span class="fr">状态：
              <span :style="{color: item.statusInfo.status === 'UP' ? 'rgb(19, 206, 102)' : 'rgb(255, 73, 73)'}">{{item.statusInfo.status}}</span>
            </span>

          </div>
          <div style="padding: 0 20px;">
            <li>
              <span>接口介绍：</span>{{item.registration.metadata.intro}}
            </li>
            <li>
              <span>接口详情：</span>{{item.registration.metadata.detail}}
            </li>
            <li>
              <span>启动时间：</span>{{item.registration.metadata.startup}}
            </li>
            <el-row :gutter="20" class="flbox">
              <el-col :span="8">
                <el-progress :width="120" type="circle" :percentage="item.p1" :color="item.p1 < 30 ? 'rgb(19, 206, 102)' : item.p1 < 60 ? 'rgb(32, 160, 255)' : 'rgb(255, 73, 73)'"></el-progress>
                <p>CPU使用率</p>
              </el-col>
              <el-col :span="8">
                <el-progress :width="120" type="circle" :percentage="item.p2" :color="item.p2 < 30 ? 'rgb(19, 206, 102)' : item.p2 < 60 ? 'rgb(32, 160, 255)' : 'rgb(255, 73, 73)'"></el-progress>
                <p>堆内存使用率</p>
              </el-col>
              <el-col :span="8">
                <el-progress :width="120" type="circle" :percentage="item.p3" :color="item.p3 < 30 ? 'rgb(19, 206, 102)' : item.p3 < 60 ? 'rgb(32, 160, 255)' : 'rgb(255, 73, 73)'"></el-progress>
                <p>非堆内存使用率</p>
              </el-col>
            </el-row>
          </div>
          <div class="footer">
            <span>服务版本：</span>{{item.registration.metadata.version}}
            <el-button style="float: right; padding: 3px 0" type="text" @click="goToDetail(item)">更多详情</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-if="empty">
      <el-card class="emptybox">
        <p>暂无数据</p>
      </el-card>
    </el-row>
  </div>
</template>
<script>
import * as api from "api/monitor";
export default {
  created() {
    this.getInstance();
    if (!this.queryTimer) {
      this.queryTimer = setInterval(() => {
        this.list.forEach(item => {
          this.circleData(item);
        });
      }, 60000);
    }
  },
  beforeDestroy() {
    window.clearInterval(this.queryTimer);
  },
  data() {
    return {
      list: [],
      empty: false,
      queryTimer: null
    };
  },
  methods: {
    getInstance() {
      api.getInstance().then(res => {
        const { status, data } = res;
        if (status === 200 && data) {
          if (data.length === 0) {
            this.empty = true;
          }
          data.forEach(item => {
            this.circleData(item);
          });

          this.list = data;
        }
      });
    },
    circleData(item) {
      api
        .getDetail({
          id: item.id,
          type: "system.cpu.usage"
        })
        .then(res => {
          const { data, status } = res;
          if (status === 200 && data) {
            this.$set(
              item,
              "p1",
              parseInt(Number(data.measurements[0].value.toFixed(2)) * 100)
            );
          }
        });
      // 堆内存信息
      Promise.all([
        api.getDetail({
          id: item.id,
          type: "jvm.memory.used?tag=area:heap"
        }),
        api.getDetail({
          id: item.id,
          type: "jvm.memory.committed?tag=area:heap"
        })
      ]).then(resArr => {
        this.$set(
          item,
          "p2",
          parseInt(
            (resArr[0].data.measurements[0].value /
              resArr[1].data.measurements[0].value) *
              100
          )
        );
      });
      // noheap
      Promise.all([
        api.getDetail({
          id: item.id,
          type: "jvm.memory.used?tag=area:nonheap"
        }),
        api.getDetail({
          id: item.id,
          type: "jvm.memory.committed?tag=area:nonheap"
        })
      ]).then(resArr => {
        this.$set(
          item,
          "p3",
          parseInt(
            (resArr[0].data.measurements[0].value /
              resArr[1].data.measurements[0].value) *
              100
          )
        );
      });
    },
    goToDetail(item) {
      this.$router.push({
        path: "/monitor/detail",
        query: {
          id: item.id
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  min-height: 460px;
}
.flbox {
  padding: 20px 0;
  text-align: center;
  p {
    font-size: 14px;
    line-height: 2em;
  }
}
li {
  padding: 10px 0;
  line-height: 1.6em;
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
}
.footer {
  padding: 12px 20px;
  box-sizing: border-box;
  border-top: 1px solid #ebeef5;
  font-size: 14px;
}
.emptybox {
  text-align: center;
  padding: 140px 0;
  font-size: 14px;
  color: #9a9a9a;
}
</style>

