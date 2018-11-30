<template>
  <el-card class="box-card management">
    <el-row>
      <el-button v-if="rightInfoObj['serv-examining']" :class="{activeBtn:showArr[0]}" @click="goUncommit">待提交</el-button>
      <el-button v-if="rightInfoObj['serv-subscribe']" :class="{activeBtn:showArr[1]}" @click="goSubscription">订阅审核</el-button>
      <el-button v-if="rightInfoObj['serv-api']" :class="{activeBtn:showArr[2]}" @click="goIO">服务接口</el-button>
    </el-row>
    <component @handleEdit="handleEdit" :is="listId"></component>
  </el-card>
</template>

<script>
import subscription from "./subscription/index";
import uncommit from "./uncommit/index";
import iomanagement from "./iomanagement/index";
import { mapGetters } from "vuex";

export default {
  name: "management",
  props: ["act"],
  components: {
    subscription,
    uncommit,
    iomanagement,
  },
  computed: {
    ...mapGetters(["rightInfoObj"])
  },
  created() {
    if (this.act === '1') {
      this.goSubscription()
    }
  },
  data() {
    return {
      servTagArr: [],
      listLoading: true,
      listId: uncommit,
      showArr: [true, false, false]
    };
  },
  methods: {
    goUncommit() {
      this.listId = uncommit;
      this.showArr = [true, false, false];
    },
    goSubscription() {
      this.listId = subscription;
      this.showArr = [false, true, false];
    },
    goIO() {
      this.listId = iomanagement;
      this.showArr = [false, false, true];
    },
    handleEdit(data) {
      this.$emit("handleEdit", data);
    },
    
  }
};
</script>

<style lang="scss" scoped>
.activeBtn {
  background-color: #449afc;
  color: #fff;
}
</style>

