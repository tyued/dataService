<template>
  <el-menu :default-active="activePath" @select="handleClick" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" router>
    <el-menu-item index="/generalization">
      <i class="menuico menu_gl"></i>
      <span slot="title">概览</span>
    </el-menu-item>
    <el-menu-item v-if="rightInfoObj['servs']" index="/service">
      <i class="menuico menu_fw"></i>
      <span slot="title">服务</span>
    </el-menu-item>
    <el-menu-item v-if="rightInfoObj['monitor']" index="/monitor">
      <i class="menuico menu_jk"></i>
      <span slot="title">监控</span>
    </el-menu-item>
    <el-menu-item v-if="rightInfoObj['perms']" index="/right">
      <i class="menuico menu_right"></i>
      <span slot="title">权限</span>
    </el-menu-item>
    <el-menu-item v-if="rightInfoObj['sets']" index="/setting">
      <i class="menuico menu_set"></i>
      <span slot="title">设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      activePath: ""
    };
  },
  computed: {
    ...mapGetters(["rightInfoObj"])
  },
  created() {
    this.activePath = this.$route.path;
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClick(index, indexPath) {
      // console.log(index, indexPath);
      this.activePath = index;
    }
  }
};
</script>