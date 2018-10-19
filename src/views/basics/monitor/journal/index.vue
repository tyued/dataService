<template>
  <div class="detail-journal">
    <!-- ===========系统日志=========== -->
    <el-tabs type="border-card">
      <el-tab-pane v-if="rightInfoObj['bizExcps']" label="系统异常">
        <Systerm />
      </el-tab-pane>
      <el-tab-pane v-if="rightInfoObj['servAccess']" label="服务异常">
        <Service />
      </el-tab-pane>
      <el-tab-pane v-if="rightInfoObj['authzs']" label="登录日志">
        <Login />
      </el-tab-pane>
      <el-tab-pane v-if="rightInfoObj['bizOpts']" label="操作日志">
        <Done />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Done from "./done";
import Login from "./login";
import Service from "./service";
import Systerm from "./systerm";
import { mapGetters } from "vuex";
export default {
  name: "journal",
  computed: {
    ...mapGetters(["rightInfoObj"])
  },
  components: {
    Systerm,
    Service,
    Done,
    Login
  },
  data() {
    return {};
  }
};
</script>
