<template>
  <div class="fw-container">
    <el-row v-if="isLastOne" class="fw-rowbox fw-rowbox-part" :gutter="20" type="flex" justify="space-between">
      <el-col v-if="rightInfoObj['serv-home']">
        <div @click="clickIndex" :class="{'on':getfuwindex_on[0]}">
          <el-card class="box-card">
            <i class="fuwindex-ico fw-topico"></i>
            <div class="fw-toppart">服务首页</div>
          </el-card>
        </div>
      </el-col>
      <el-col v-if="rightInfoObj['serv-register']">
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
      <component :editDataObj="editDataObj" @clickServiceManegement="clickServiceManegement" @handleEdit="handleEdit" :is="pageMB"></component>
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
      editDataObj: ""
    };
  },
  created() {
    this.$store.dispatch("GET_fuwindex_on", [true, false, false, false]);
  },
  computed: {
    ...mapGetters(["getfuwindex_on", "rightInfoObj"]),
    // ???????????????????????????????????????????????????????????????????????????????????????????????????
    isLastOne() {
      return (
        this.rightInfoObj["serv-home"] &&
        this.rightInfoObj["serv-register"] &&
        this.rightInfoObj["serv-mgr"] &&
        this.rightInfoObj["serv-ds"]
      );
    }
  },
  methods: {
    clickIndex() {
      //服务首页
      this.pageMB = mainService;
      this.$store.dispatch("GET_fuwindex_on", [true, false, false, false]);
    },
    clickRegister() {
      //注册
      this.pageMB = register;
      this.$store.dispatch("GET_fuwindex_on", [false, true, false, false]);
    },
    clickServiceManegement() {
      // 管理
      this.pageMB = management;
      this.$store.dispatch("GET_fuwindex_on", [false, false, true, false]);
    },
    clickDataservice() {
      //数据源
      this.pageMB = dataService;
      this.$store.dispatch("GET_fuwindex_on", [false, false, false, true]);
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
    },
  }
};
</script>
