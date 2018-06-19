<template>
    <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <router-link :to="'/'">
            <el-menu-item index="1">
                <i class="menuico menu_gl"></i>
                <span slot="title">概览</span>
            </el-menu-item>
        </router-link>
        <router-link :to="'/service'">
            <el-menu-item index="2">
                <i class="menuico menu_fw"></i>
                <span slot="title">服务</span>
            </el-menu-item>
        </router-link>
        <el-menu-item index="3">
            <i class="menuico menu_jk"></i>
            <span slot="title">监控</span>
        </el-menu-item>
        <el-menu-item index="4">
            <i class="menuico menu_set"></i>
            <span slot="title">设置</span>
        </el-menu-item>

    </el-menu>
</template>

<script>
export default {
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
}
</script>