<template>
  <div class="right">
    <el-tabs v-model="activeName">
      <el-tab-pane v-if="rightInfoObj['user']" label="用户管理" name="1">
        <User />
      </el-tab-pane>
      <el-tab-pane v-if="rightInfoObj['role']" label="角色管理" name="2">
        <Role />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Role from "./role.vue";
import User from "./user.vue";
import { mapGetters } from "vuex";
export default {
  name: "right",
  components: {
    Role,
    User
  },
  computed: {
    ...mapGetters(["rightInfoObj"])
  },
  data() {
    return {
      activeName: "1"
    };
  },
  methods: {}
};
</script>
