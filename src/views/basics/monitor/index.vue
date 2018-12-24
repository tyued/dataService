<template>
  <div class="monitor" id="monitor">
    <el-tabs @tab-click="changeTabs" v-model="activeName">
      <el-tab-pane v-if="rightInfoObj['sys-monitor']" label="系统监控" name="1">
        <Systerm :activeName="activeName" />
      </el-tab-pane>
      <el-tab-pane v-if="rightInfoObj['serv-monitor']" label="服务监控" name="2">
        <Service />
      </el-tab-pane>
      <el-tab-pane v-if="rightInfoObj['sys-logs']" label="系统日志" name="3">
        <Journal />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Systerm from "./systerm/index";
import Service from "./service/index";
import Journal from "./journal/index";
import { mapGetters } from "vuex";
export default {
  name: "monitor",
  components: {
    Systerm,
    Service,
    Journal
  },
  computed: {
    ...mapGetters(["rightInfoObj"]),
    act() {
      let n = 4
      if (this.rightInfoObj['sys-monitor']) n--
      if (this.rightInfoObj['serv-monitor']) n--
      if (this.rightInfoObj['sys-logs']) n--
      return n + ''
    }
  },
  data() {
    return {
      activeName: ''
    }
  },
  created() {
    // 从其他页面跳过来高亮
    if (this.$route.params.activeName) {
      this.activeName = this.$route.params.activeName;
    } else {
      this.activeName = this.act
    }
  },
  methods: {
    changeTabs({index}) {
      this.$store.commit('SET_sysEchartsActIndex', index) 
    }
  }
};
</script>
