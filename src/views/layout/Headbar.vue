<template>
  <div class="headbar">
    <h1>
      <img src="../../assets/logo.png" />
      <span class="logoname">数据服务总线</span>
    </h1>
    <ul class="header-li">
      <li>
        <div class="fr">
          <el-dropdown @command="handleCommand" trigger="click">
            <div class="el-dropdown-link">
              <img class="user-icon" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjMiIGhlaWdodD0iNTkiIHZpZXdCb3g9IjAgMCA2MyA1OSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KPGcgaWQ9IkNhbnZhcyIgZmlsbD0ibm9uZSI+CjxnIGlkPSJkdW90YWktaWNvbiI+CjxnIGlkPSJSZWN0YW5nbGUiPgo8cmVjdCB3aWR0aD0iNDEuMTQwMiIgaGVpZ2h0PSI0Mi4xNDI5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMS41OTg3IDE2Ljg1NzEpIiBmaWxsPSIjRkY3MjYyIi8+CjwvZz4KPGcgaWQ9IlZlY3RvciAyIj4KPHBhdGggZD0iTSAwIDI1LjI4NTdMIDIxLjU5ODYgMEwgNDMuMTk3MiAyNS4yODU3TCAwIDI1LjI4NTdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDMzLjcxNDIpIiBmaWxsPSIjMEFDRjgzIi8+CjwvZz4KPGcgaWQ9IkVsbGlwc2UiPgo8ZWxsaXBzZSBjeD0iMTYuNDU2MSIgY3k9IjE2Ljg1NzIiIHJ4PSIxNi40NTYxIiByeT0iMTYuODU3MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS4xNDI0OSAwKSIgZmlsbD0iIzFBQkNGRSIvPgo8L2c+CjwvZz4KPC9nPgo8L3N2Zz4KCg==" alt=""> Winnerwinnerchickdinner
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">个人信息</el-dropdown-item>
              <el-dropdown-item command="b">密码修改</el-dropdown-item>
              <el-dropdown-item command="e" divided>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </li>
      <li>
        <span class="el-dropdown-link">
          <el-badge :value="number" class="item">
            <i class="el-icon-bell" @click="$router.push('/notice')"></i>
          </el-badge>
        </span>
      </li>
      <li>
        <el-input clearable :maxlength="50" prefix-icon="el-icon-search" size="mini" v-model="inputValue" placeholder="服务检索"></el-input>
      </li>
    </ul>
    <!-- 个人信息弹出层 -->
    <el-dialog width="40%" title="个人信息" :visible.sync="personInfoVisible">
      <el-form :model="personInfoForm">
        <el-form-item label="我的角色" :label-width="formLabelWidth">
          <el-select style="width:280px;" v-model="personInfoForm.type">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option disabled label="普通管理员" value="2"></el-option>
            <el-option disabled label="普通用户" value="3"></el-option>
          </el-select>
          <span>&nbsp;当前角色不可更改为其它角色</span>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model="personInfoForm.name" auto-complete="off" disabled></el-input>
          <span>&nbsp;不可修改。一般用于后台登入名</span>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model="personInfoForm.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio v-model="personInfoForm.radio" label="1">男</el-radio>
          <el-radio v-model="personInfoForm.radio" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth">
          <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="personInfoForm.url" :src="personInfoForm.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model="personInfoForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model="personInfoForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input clearable :maxlength="250" type="textarea" v-model="personInfoForm.desc" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="personInfoVisible = false">确认修改</el-button>
        <el-button @click="personInfoVisible = false">重新填写</el-button>
      </div>
    </el-dialog>
    <!-- /个人信息弹出层 -->

    <!-- 修改密码弹出层 -->
    <el-dialog width="40%" title="修改密码" :visible.sync="changePasswordVisible">
      <el-form :model="passwordInfoForm">
        <el-form-item label="当前密码" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model="passwordInfoForm.currentPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model="passwordInfoForm.newPassword" auto-complete="off"></el-input>
          <span>&nbsp;6-16个字符</span>
        </el-form-item>
        <el-form-item label="确认新密码" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model="passwordInfoForm.checkNewPassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changePasswordVisible = false">确认修改</el-button>
      </div>
    </el-dialog>
    <!-- /修改密码弹出层 -->
  </div>
</template>

<script>
import * as api from "api/login";
export default {
  data() {
    return {
      inputValue: "",
      number: "", // 待处理通知数
      formLabelWidth: "120px",
      personInfoVisible: false,
      changePasswordVisible: false,
      personInfoForm: {
        type: "1",
        name: "zz",
        nickname: "",
        radio: "1",
        url: "",
        phone: "",
        email: "",
        desc: ""
      },
      passwordInfoForm: {
        currentPassword: "",
        newPassword: "",
        checkNewPassword: ""
      },
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  created() {
    api.postNoticeNumber().then(res => {
      const { data, status } = res;
      if (status === 200 && typeof data === "number") {
        this.number = data < 100 ? data : "99+";
      }
    });
  },
  methods: {
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
        case "a": // 个人信息
          this.personInfoVisible = true;
          break;
        case "b": // 修改密码
          this.changePasswordVisible = true;
          break;
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
  width: 180px;
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
  padding-right: 14px;
  padding-left: 10px;
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
