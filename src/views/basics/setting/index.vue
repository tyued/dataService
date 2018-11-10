<template>
  <div class="setting">
    <el-tabs v-model="activeName">
      <el-tab-pane v-if="rightInfoObj['sets']" label="系统参数" name="1">
        <SystermConfig />
      </el-tab-pane>
      <el-tab-pane v-if="rightInfoObj['basedata']" label="基础数据" name="2">
        <BaseConfig />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SystermConfig from "./SystermConfig.vue";
import BaseConfig from "./BaseConfig.vue";
import { mapGetters } from "vuex";
export default {
  name: "setting",
  components: {
    BaseConfig,
    SystermConfig,
  },
  computed: {
    ...mapGetters(["rightInfoObj"])
  },
  created() {

  },
  data() {
    return {
      activeName: "1"
    };
  }
};
</script>

<style lang="scss" scoped>
</style>


