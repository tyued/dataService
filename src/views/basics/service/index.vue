<template>
  <div class="fw-container">
    <el-row v-if="n !== 1" class="fw-rowbox fw-rowbox-part" :gutter="20">
      <el-col :span="24/n" v-if="rightInfoObj['serv-home']">
        <div @click="clickIndex" :class="{'on':getfuwindex_on[0]}">
          <el-card class="box-card">
            <i class="fuwindex-ico fw-topico"></i>
            <div class="fw-toppart">服务首页</div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="24/n" v-if="rightInfoObj['serv-registry']">
        <div @click="clickRegister" :class="{'on':getfuwindex_on[1]}">
          <el-card class="box-card">
            <i class="zhuc-ico fw-topico"></i>
            <div class="fw-toppart">服务注册</div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="24/n" v-if="rightInfoObj['serv-mgr']">
        <div @click="clickServiceManegement" :class="{'on':getfuwindex_on[2]}">
          <el-card class="box-card">
            <i class="guanl-ico fw-topico"></i>
            <div class="fw-toppart">服务管理</div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="24/n" v-if="rightInfoObj['serv-ds']">
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
    ...mapGetters([
      "getfuwindex_on",
      "rightInfoObj",
      "getServiceComponentName",
      "formLeave"
    ])
  },
  methods: {
    clickIndex() {
      // 如果当前高亮了，就不用再设置高亮以及其他操作了
      if (this.getfuwindex_on[0]) {
        return 
      }
      //服务首页
      if (this.formLeave) {
        // 如果有标记，提问
        this.$confirm("数据尚未保存，确定要离开吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: '取消',
          type: "warning"
        }).then(() => {
          this.$store.commit("SET_compName", "mainService");
          this.$store.commit("SET_fuwindex_on", [true, false, false, false]);
          this.toggleCompo(this.getServiceComponentName);
          this.$store.commit('SET_formLeave', false)
        });
      } else {
        this.$store.commit("SET_compName", "mainService");
        this.$store.commit("SET_fuwindex_on", [true, false, false, false]);
        this.toggleCompo(this.getServiceComponentName);
      }
    },
    clickRegister() {
      //注册
      if (this.getfuwindex_on[1]) {
        return 
      }
      if (this.formLeave) {
        // 如果有标记，提问
        this.$confirm("数据尚未保存，确定要离开吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: '取消',
          type: "warning"
        }).then(() => {
          this.$store.commit("SET_compName", "register");
          this.$store.commit("SET_fuwindex_on", [false, true, false, false]);
          this.toggleCompo(this.getServiceComponentName);
          this.$store.commit('SET_formLeave', false)
        });
      } else {
        this.$store.commit("SET_compName", "register");
        this.$store.commit("SET_fuwindex_on", [false, true, false, false]);
        this.toggleCompo(this.getServiceComponentName);
      }
    },
    clickServiceManegement() {
      // 管理
      if (this.getfuwindex_on[2]) {
        return 
      }
      if (this.formLeave) {
        // 如果有标记，提问
        this.$confirm("数据尚未保存，确定要离开吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: '取消',
          type: "warning"
        }).then(() => {
          this.$store.commit("SET_compName", "management");
          this.$store.commit("SET_fuwindex_on", [false, false, true, false]);
          this.toggleCompo(this.getServiceComponentName);
          this.$store.commit('SET_formLeave', false)
        });
      } else {
        this.$store.commit("SET_compName", "management");
        this.$store.commit("SET_fuwindex_on", [false, false, true, false]);
        this.toggleCompo(this.getServiceComponentName);
      }
    },
    clickDataservice() {
      //数据源
      if (this.getfuwindex_on[3]) {
        return 
      }
      if (this.formLeave) {
        // 如果有标记，提问
        this.$confirm("数据尚未保存，确定要离开吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: '取消',
          type: "warning"
        }).then(() => {
          this.$store.commit("SET_compName", "dataService");
          this.$store.commit("SET_fuwindex_on", [false, false, false, true]);
          this.toggleCompo(this.getServiceComponentName);
          this.$store.commit('SET_formLeave', false)
        });
      } else {
        this.$store.commit("SET_compName", "dataService");
        this.$store.commit("SET_fuwindex_on", [false, false, false, true]);
        this.toggleCompo(this.getServiceComponentName);
      }
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
      ).then(data => {
        this.editDataObj = data;
        this.pageMB = edit;
      });
    }
  }
};
</script>
