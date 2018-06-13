<template>
    <el-container>
        <el-header height="60px"> 
            <headbar class="headbar-container"></headbar>
        </el-header>
        <el-container>
            <el-aside width="100px">
                <sidebar class="sidebar-container"></sidebar>
            </el-aside>
            <el-main>
                <app-main></app-main>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
import { Sidebar , Headbar , AppMain } from 'views/layout';

export default {
    name:'Layout',
    components: {
        Sidebar,Headbar,AppMain
    },
}
</script>








