<template>
  <div class="right">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-if="rightInfoObj['user']" label="用户管理" name="1">
        <User ref="user" />
      </el-tab-pane>
      <el-tab-pane v-if="rightInfoObj['role']" label="角色管理" name="2">
        <Role ref="role" />
      </el-tab-pane>
      <el-tab-pane v-if="rightInfoObj['producer']" label="数据提供商" name="3">
        <Producer ref="pro" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Role from "./role.vue";
import User from "./user.vue";
import Producer from "./producer.vue";
import { mapGetters } from "vuex";
export default {
  name: "right",
  components: {
    Role,
    Producer,
    User
  },
  data() {
    return {
      activeName: ""
    };
  },
  created() {
    this.activeName = this.act;
  },
  computed: {
    ...mapGetters(["rightInfoObj"]),
    act() {
      let n = 4;
      if (this.rightInfoObj["user"]) n--;
      if (this.rightInfoObj["role"]) n--;
      if (this.rightInfoObj["producer"]) n--;
      return n + "";
    }
  },
  methods: {
    handleClick(tab, event) {
      const { index } = tab;
      // 刷新数据
      switch (index) {
        case "1":
          this.$refs.user.getList();
          break;
        case "2":
          this.$refs.role.getList();
          break;
        case "3":
          this.$refs.pro.getList();
          break;
      }
    }
  }
};
</script>
