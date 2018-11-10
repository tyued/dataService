<template>
  <div class="monitor" id="monitor">
    <el-tabs v-model="activeName">
      <el-tab-pane v-if="rightInfoObj['sys-monitor']" label="系统监控" name="first">
        <Systerm />
      </el-tab-pane>
      <el-tab-pane v-if="rightInfoObj['serv-monitor']" label="服务监控" name="second">
        <Service />
      </el-tab-pane>
      <el-tab-pane v-if="rightInfoObj['sys-logs']" label="系统日志" name="third">
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
    ...mapGetters(["rightInfoObj"])
  },
  created() {
    if (this.$route.params.activeName) {
      this.activeName = this.$route.params.activeName;
    }
  },
  data() {
    return {
      activeName: "first"
    };
  }
};
</script>

<style lang="scss" scoped>
</style>

