<template>
  <div class="headbar">
    <h1>
      <img src="../../assets/logo.png" />
      <span class="logoname">数据服务总线</span>
    </h1>
    <ul class="header-li">
      <li>
        <div class="fr">
          <el-dropdown @command="handleCommand">
            <div class="el-dropdown-link">
              <img class="user-icon" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjMiIGhlaWdodD0iNTkiIHZpZXdCb3g9IjAgMCA2MyA1OSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KPGcgaWQ9IkNhbnZhcyIgZmlsbD0ibm9uZSI+CjxnIGlkPSJkdW90YWktaWNvbiI+CjxnIGlkPSJSZWN0YW5nbGUiPgo8cmVjdCB3aWR0aD0iNDEuMTQwMiIgaGVpZ2h0PSI0Mi4xNDI5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMS41OTg3IDE2Ljg1NzEpIiBmaWxsPSIjRkY3MjYyIi8+CjwvZz4KPGcgaWQ9IlZlY3RvciAyIj4KPHBhdGggZD0iTSAwIDI1LjI4NTdMIDIxLjU5ODYgMEwgNDMuMTk3MiAyNS4yODU3TCAwIDI1LjI4NTdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDMzLjcxNDIpIiBmaWxsPSIjMEFDRjgzIi8+CjwvZz4KPGcgaWQ9IkVsbGlwc2UiPgo8ZWxsaXBzZSBjeD0iMTYuNDU2MSIgY3k9IjE2Ljg1NzIiIHJ4PSIxNi40NTYxIiByeT0iMTYuODU3MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS4xNDI0OSAwKSIgZmlsbD0iIzFBQkNGRSIvPgo8L2c+CjwvZz4KPC9nPgo8L3N2Zz4KCg==" alt=""> Winnerwinnerchickdinner个人中心
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">我的信息</el-dropdown-item>
              <el-dropdown-item command="b">历史记录</el-dropdown-item>
              <el-dropdown-item command="e" divided>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </li>
      <li>
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-badge :value="12" class="item">
              <i class="el-icon-bell" @click="$router.push('/notice')"></i>
            </el-badge>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-alert title="成功提示的文案" type="success" description="文字说明文字说明文字说明文字说明文字说明文字说明" show-icon>
              </el-alert>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-alert title="消息提示的文案" type="info" description="文字说明文字说明文字说明文字说明文字说明文字说明" show-icon>
              </el-alert>
            </el-dropdown-item>
            <el-dropdown-item disabled>
              <el-alert title="错误提示的文案" type="error" description="文字说明文字说明文字说明文字说明文字说明文字说明" show-icon>
              </el-alert>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <el-alert title="警告提示的文案" type="warning" description="文字说明文字说明文字说明文字说明文字说明文字说明" show-icon>
              </el-alert>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <li>
        <el-autocomplete :maxlength="50" prefix-icon="el-icon-search" size="mini" v-model="state4" :fetch-suggestions="querySearchAsync" placeholder="服务检索" @select="handleSelect"></el-autocomplete>
      </li>
    </ul>
  </div>

</template>

<script>
import * as api from "api/login";
export default {
  data() {
    return {
      restaurants: [],
      state4: "",
      timeout: null
    };
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  methods: {
    loadAll() {
      return [
        { value: "三全鲜食（北新泾店）", address: "长宁区新渔路144号" },
        {
          value: "Hot honey 首尔炸鸡（仙霞路）",
          address: "上海市长宁区淞虹路661号"
        },
        {
          value: "新旺角茶餐厅",
          address: "上海市普陀区真北路988号创邑金沙谷6号楼113"
        },
        { value: "泷千家(天山西路店)", address: "天山西路438号" },
        {
          value: "胖仙女纸杯蛋糕（上海凌空店）",
          address: "上海市长宁区金钟路968号1幢18号楼一层商铺18-101"
        },
        { value: "贡茶", address: "上海市长宁区金钟路633号" },
        {
          value: "豪大大香鸡排超级奶爸",
          address: "上海市嘉定区曹安公路曹安路1685号"
        },
        {
          value: "茶芝兰（奶茶，手抓饼）",
          address: "上海市普陀区同普路1435号"
        },
        {
          value: "Merci Paul cafe",
          address: "上海市普陀区光复西路丹巴路28弄6号楼819"
        },
        {
          value: "猫山王（西郊百联店）",
          address: "上海市长宁区仙霞西路88号第一层G05-F01-1-306"
        },
        { value: "枪会山", address: "上海市普陀区棕榈路" },
        { value: "纵食", address: "元丰天山花园(东门) 双流路267号" },
        { value: "钱记", address: "上海市长宁区天山西路" },
        { value: "壹杯加", address: "上海市长宁区通协路" },
        {
          value: "唦哇嘀咖",
          address: "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元"
        },
        { value: "爱茜茜里(西郊百联)", address: "长宁区仙霞西路88号1305室" },
        {
          value: "爱茜茜里(近铁广场)",
          address:
            "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺"
        },
        {
          value: "鲜果榨汁（金沙江路和美广店）",
          address: "普陀区金沙江路2239号金沙和美广场B1-10-6"
        },
        {
          value: "开心丽果（缤谷店）",
          address: "上海市长宁区威宁路天山路341号"
        },
        { value: "超级鸡车（丰庄路店）", address: "上海市嘉定区丰庄路240号" },
        { value: "妙生活果园（北新泾店）", address: "长宁区新渔路144号" },
        { value: "香宜度麻辣香锅", address: "长宁区淞虹路148号" },
        {
          value: "凡仔汉堡（老真北路店）",
          address: "上海市普陀区老真北路160号"
        },
        { value: "港式小铺", address: "上海市长宁区金钟路968号15楼15-105室" },
        { value: "蜀香源麻辣香锅（剑河路店）", address: "剑河路443-1" },
        { value: "北京饺子馆", address: "长宁区北新泾街道天山西路490-1号" },
        {
          value: "饭典*新简餐（凌空SOHO店）",
          address: "上海市长宁区金钟路968号9号楼地下一层9-83室"
        },
        {
          value: "焦耳·川式快餐（金钟路店）",
          address: "上海市金钟路633号地下一层甲部"
        },
        { value: "动力鸡车", address: "长宁区仙霞西路299弄3号101B" },
        { value: "浏阳蒸菜", address: "天山西路430号" },
        { value: "四海游龙（天山西路店）", address: "上海市长宁区天山西路" },
        {
          value: "樱花食堂（凌空店）",
          address: "上海市长宁区金钟路968号15楼15-105室"
        },
        { value: "壹分米客家传统调制米粉(天山店)", address: "天山西路428号" },
        {
          value: "福荣祥烧腊（平溪路店）",
          address: "上海市长宁区协和路福泉路255弄57-73号"
        },
        {
          value: "速记黄焖鸡米饭",
          address: "上海市长宁区北新泾街道金钟路180号1层01号摊位"
        },
        { value: "红辣椒麻辣烫", address: "上海市长宁区天山西路492号" },
        {
          value: "(小杨生煎)西郊百联餐厅",
          address: "长宁区仙霞西路88号百联2楼"
        },
        { value: "阳阳麻辣烫", address: "天山西路389号" },
        {
          value: "南拳妈妈龙虾盖浇饭",
          address: "普陀区金沙江路1699号鑫乐惠美食广场A13"
        }
      ];
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    handleCommand(command) {
      switch (command) {
        case "e":
          this.$store.dispatch("logOut").then(() => {
            this.$router.push("/login");
          });
          break;

        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  display: block;
  height: 60px;
  line-height: 60px;
  padding-left: 14px;
  width: 300px;
  float: left;
  img {
    vertical-align: middle;
  }
  span {
    color: #fff;
    font-size: 20px;
    font-weight: normal;
  }
}
.header-li li {
  line-height: 60px;
  padding: 0 14px;
  float: right;
  height: 60px;
  & > div {
    display: block;
  }
}

.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-icon-bell {
  color: #fff;
  font-size: 1.6em;
  vertical-align: middle;
  cursor: pointer;
}
.el-badge .el-badge__content.is-fixed {
  bottom: 18px;
}
.user-icon {
  vertical-align: middle;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
}
</style>
