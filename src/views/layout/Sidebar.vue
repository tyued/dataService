<template>
  <el-menu 
  default-active="/" 
  @select="handleClick" 
  class="el-menu-vertical-demo" 
  @open="handleOpen" 
  @close="handleClose" 
  router
  >
    <el-menu-item index="/">
      <i class="menuico menu_gl"></i>
      <span slot="title">概览</span>
    </el-menu-item>
    <el-menu-item index="/service">
      <i class="menuico menu_fw"></i>
      <span slot="title">服务</span>
    </el-menu-item>
    <el-menu-item index="/monitor">
      <i class="menuico menu_jk"></i>
      <span slot="title">监控</span>
    </el-menu-item>

    <el-menu-item index="/setting">
      <i class="menuico menu_set"></i>
      <span slot="title">设置</span>
    </el-menu-item>

  </el-menu>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClick(index, indexPath) {
      console.log(index, indexPath);
    }
  }
};
</script>