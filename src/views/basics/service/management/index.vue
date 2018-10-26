<template>
  <el-card class="box-card management">
    <el-row>
      <el-button :class="{activeBtn:showArr[0]}" @click="goUncommit">未提交（服务）</el-button>
      <el-button v-if="rightInfoObj['serv-subscribe']" :class="{activeBtn:showArr[1]}" @click="goSubscription">已订阅（服务）</el-button>
      <el-button v-if="rightInfoObj['serv-auditing']" :class="{activeBtn:showArr[2]}" @click="goChecked">待审核（接口）</el-button>
      <el-button v-if="rightInfoObj['serv-release']" :class="{activeBtn:showArr[3]}" @click="goPublication">已发布（接口）</el-button>
      <el-button v-if="rightInfoObj['serv-disabled']" :class="{activeBtn:showArr[4]}" @click="goForbidden">已禁用（接口）</el-button>
      <el-button :class="{activeBtn:showArr[5]}" @click="goReject">已驳回（接口）</el-button>
    </el-row>
    <component @handleEdit="handleEdit" :is="listId"></component>
  </el-card>
</template>

<script>
import subscription from "./subscription/index";
import publication from "./publication/index";
import forbidden from "./forbidden/index";
import checked from "./checked/index";
import uncommit from "./uncommit/index";
import reject from "./reject/index";
import { mapGetters } from "vuex";
export default {
  name: "management",
  components: {
    subscription,
    publication,
    uncommit,
    checked,
    reject,
    forbidden
  },
  computed: {
    ...mapGetters(["rightInfoObj"])
  },
  data() {
    return {
      listLoading: true,
      listId: uncommit,
      showArr: [true, false, false, false, false, false]
    };
  },
  methods: {
    goUncommit() {
      this.listId = uncommit;
      this.showArr = [true, false, false, false, false, false];
    },
    goSubscription() {
      this.listId = subscription;
      this.showArr = [false, true, false, false, false, false];
    },
    goChecked() {
      this.listId = checked;
      this.showArr = [false, false, true, false, false, false];
    },
    goPublication() {
      this.listId = publication;
      this.showArr = [false, false, false, true, false, false];
    },
    goForbidden() {
      this.listId = forbidden;
      this.showArr = [false, false, false, false, true, false];
    },
    goReject() {
      this.listId = reject;
      this.showArr = [false, false, false, false, false, true];
    },
    handleEdit(data) {
      this.$emit('handleEdit', data)
    }
  }
};
</script>

<style lang="scss" scoped>
.activeBtn {
  background-color: #449afc;
  color: #fff;
}
</style>

