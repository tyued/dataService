<template>
  <div class="fw-container">
    <el-row v-if="n !== 1" class="fw-rowbox fw-rowbox-part" :gutter="20" type="flex" justify="space-between">
      <el-col v-if="rightInfoObj['serv-home']">
        <div @click="clickIndex" :class="{'on':getfuwindex_on[0]}">
          <el-card class="box-card">
            <i class="fuwindex-ico fw-topico"></i>
            <div class="fw-toppart">服务首页</div>
          </el-card>
        </div>
      </el-col>
      <el-col v-if="rightInfoObj['serv-registry']">
        <div @click="clickRegister" :class="{'on':getfuwindex_on[1]}">
          <el-card class="box-card">
            <i class="zhuc-ico fw-topico"></i>
            <div class="fw-toppart">服务注册</div>
          </el-card>
        </div>
      </el-col>
      <el-col v-if="rightInfoObj['serv-mgr']">
        <div @click="clickServiceManegement" :class="{'on':getfuwindex_on[2]}">
          <el-card class="box-card">
            <i class="guanl-ico fw-topico"></i>
            <div class="fw-toppart">服务管理</div>
          </el-card>
        </div>
      </el-col>
      <el-col v-if="rightInfoObj['serv-ds']">
        <div @click="clickDataservice" :class="{'on':getfuwindex_on[3]}">
          <el-card class="box-card">
            <i class="shujuy-ico fw-topico"></i>
            <div class="fw-toppart">数据源</div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row class="fw-rowbox">
      <component @clickServiceManegement="clickServiceManegement" :editDataObj="editDataObj" @handleEdit="handleEdit" :is="pageMB" :act="act"></component>
    </el-row>

  </div>
</template>

<script>
import { getRegistryDetail } from "api/service/register";
import mainService from "views/basics/service/mainService/index";
import register from "views/basics/service/register/index";
import edit from "views/basics/service/register/edit";
import management from "views/basics/service/management/index";
import dataService from "views/basics/service/dataService/index";
import { mapGetters } from "vuex";

export default {
  name: "service",
  components: {
    mainService,
    register,
    edit,
    management,
    dataService
  },
  data() {
    return {
      pageMB: mainService,
      showArr: [],
      editDataObj: "",
      n: 0, // 只有一个的时候消失掉
      act: "" // 是否要记住已订阅下的状态
    };
  },
  created() {
    if (this.$route.params.act === "1") {
      // 这个时候要返回到管理下的已订阅
      this.act = "1";
    }
    this.toggleCompo(this.getServiceComponentName);
    this.rightInfoObj["serv-home"] && this.n++;
    this.rightInfoObj["serv-registry"] && this.n++;
    this.rightInfoObj["serv-mgr"] && this.n++;
    this.rightInfoObj["serv-ds"] && this.n++;
  },
  computed: {
    ...mapGetters(["getfuwindex_on", "rightInfoObj", "getServiceComponentName"])
  },
  methods: {
    clickIndex() {
      //服务首页
      this.$store.commit("SET_compName", "mainService");
      this.$store.dispatch("GET_fuwindex_on", [true, false, false, false]);
      this.toggleCompo(this.getServiceComponentName);
    },
    clickRegister() {
      //注册
      this.$store.commit("SET_compName", "register");
      this.$store.dispatch("GET_fuwindex_on", [false, true, false, false]);
      this.toggleCompo(this.getServiceComponentName);
    },
    clickServiceManegement() {
      // 管理
      this.$store.commit("SET_compName", "management");
      this.$store.dispatch("GET_fuwindex_on", [false, false, true, false]);
      this.toggleCompo(this.getServiceComponentName);
    },
    clickDataservice() {
      //数据源
      this.$store.commit("SET_compName", "dataService");
      this.$store.dispatch("GET_fuwindex_on", [false, false, false, true]);
      this.toggleCompo(this.getServiceComponentName);
    },
    toggleCompo(name) {
      switch (name) {
        case "mainService":
          this.pageMB = mainService;
          break;
        case "register":
          this.pageMB = register;
          break;
        case "management":
          this.pageMB = management;
          break;
        case "dataService":
          this.pageMB = dataService;
          break;
      }
    },
    handleEdit(row) {
      let addr;
      switch (row.type) {
        case "1":
          addr = "rest";
          break;
        case "2":
          addr = "soap";
          break;
        case "3":
          addr = "dataset";
          break;
        case "4":
          addr = "osgi";
          break;
      }
      getRegistryDetail(
        {
          servId: row.id,
          detail: true
        },
        addr
      ).then(res => {
        const { status, data } = res;
        if (status === 200 && data) {
          this.editDataObj = data;
          this.pageMB = edit;
        }
      });
    }
  }
};
</script>
