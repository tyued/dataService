<template>
  <el-card class="box-card management">
    <el-row>
      <el-button :class="{activeBtn:isActive1}" @click="goSubscription">已订阅(34)</el-button>
      <el-button :class="{activeBtn:isActive2}" @click="goPublication">已发布(34)</el-button>
      <el-button :class="{activeBtn:isActive3}" @click="goChecked">待审核(15)</el-button>
      <el-button :class="{activeBtn:isActive4}" @click="goForbidden">已禁用(15)</el-button>
    </el-row>

    <component :is="listId"></component>
  </el-card>

</template>

<script>
import subscription from "./subscription/index";
import publication from "./publication/index";
import checked from "./checked/index";
import forbidden from "./forbidden/index";

export default {
  name: "pageManagement",
  components: {
    subscription,
    publication,
    checked,
    forbidden
  },
  data() {
    return {
      listLoading: true,
      listId: subscription,
      isActive1: true,
      isActive2: false,
      isActive3: false,
      isActive4: false
    };
  },
  methods: {
    goSubscription() {
      this.listId = subscription;
      this.isActive1 = true;
      this.isActive2 = false;
      this.isActive3 = false;
      this.isActive4 = false;
    },
    goPublication() {
      this.listId = publication;
      this.isActive1 = false;
      this.isActive2 = true;
      this.isActive3 = false;
      this.isActive4 = false;
    },
    goChecked() {
      this.listId = checked;
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = true;
      this.isActive4 = false;
    },
    goForbidden() {
      this.listId = forbidden;
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = false;
      this.isActive4 = true;
    }
  }
};
</script>

<style lang="scss">
.management {
  // .el-tag {
  //   color: #303133;
  //   background-color: #fff;
  //   cursor: pointer;
  // }
  .activeBtn {
    background-color: #449afc;
    color: #fff;
  }
}
</style>

