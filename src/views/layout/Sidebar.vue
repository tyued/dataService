<template>
  <el-menu :default-active="activePath" @select="handleClick" class="el-menu-vertical-demo">
    <el-menu-item v-if="rightInfoObj['survey-customer']" index="0">
      <i class="menuico menu_gl"></i>
      <span slot="title">概览</span>
    </el-menu-item>
    <el-menu-item v-if="rightInfoObj['survey-admin']" index="1">
      <i class="menuico menu_gl"></i>
      <span slot="title">概览</span>
    </el-menu-item>
    <el-menu-item v-if="rightInfoObj['servs']" index="2">
      <i class="menuico menu_fw"></i>
      <span slot="title">服务</span>
    </el-menu-item>
    <el-menu-item v-if="rightInfoObj['monitor']" index="3">
      <i class="menuico menu_jk"></i>
      <span slot="title">监控</span>
    </el-menu-item>
    <el-menu-item v-if="rightInfoObj['perms']" index="4">
      <i class="menuico menu_right"></i>
      <span slot="title">权限</span>
    </el-menu-item>
    <el-menu-item v-if="rightInfoObj['sets']" index="5">
      <i class="menuico menu_set"></i>
      <span slot="title">设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["rightInfoObj", "activePath", "formLeave"])
  },
  created() {
    let s = this.$route.path;
    switch (this.$route.path.slice(0, 3)) {
      case "/cu":
        s = "0";
        break;
      case "/ge":
        s = "1";
        break;
      case "/se":
        s = "2";
        break;
      case "/mo":
        s = "3";
        break;
      case "/ri":
        s = "4";
        break;
      case "/se":
        s = "5";
        break;
    }
    this.$store.commit("SET_SIDEBAR", s);
    // this.activePath = this.$route.path;
  },
  methods: {
    handleClick(index, indexPath) {
      if (this.formLeave) {
        // 是否数据注册表单页面，离开要进行提示
        this.$confirm("数据尚未保存，确定要离开吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$store.commit("SET_formLeave", false);

          this.$store.commit("SET_SIDEBAR", index);
          switch (index) {
            case "0":
              this.$router.push("/customer");
              break;
            case "1":
              this.$router.push("/generalization");
              break;
            case "2":
              this.$router.push("/service");
              break;
            case "3":
              this.$router.push("/monitor");
              break;
            case "4":
              this.$router.push("/right");
              break;
            case "5":
              this.$router.push("/setting");
              break;
          }
        });
      } else {
        this.$store.commit("SET_SIDEBAR", index);
        switch (index) {
          case "0":
            this.$router.push("/customer");
            break;
          case "1":
            this.$router.push("/generalization");
            break;
          case "2":
            this.$router.push("/service");
            break;
          case "3":
            this.$router.push("/monitor");
            break;
          case "4":
            this.$router.push("/right");
            break;
          case "5":
            this.$router.push("/setting");
            break;
        }
      }
    }
  }
};
</script>