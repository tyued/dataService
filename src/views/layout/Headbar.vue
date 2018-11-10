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
              <!-- <img class="user-icon" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjMiIGhlaWdodD0iNTkiIHZpZXdCb3g9IjAgMCA2MyA1OSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KPGcgaWQ9IkNhbnZhcyIgZmlsbD0ibm9uZSI+CjxnIGlkPSJkdW90YWktaWNvbiI+CjxnIGlkPSJSZWN0YW5nbGUiPgo8cmVjdCB3aWR0aD0iNDEuMTQwMiIgaGVpZ2h0PSI0Mi4xNDI5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMS41OTg3IDE2Ljg1NzEpIiBmaWxsPSIjRkY3MjYyIi8+CjwvZz4KPGcgaWQ9IlZlY3RvciAyIj4KPHBhdGggZD0iTSAwIDI1LjI4NTdMIDIxLjU5ODYgMEwgNDMuMTk3MiAyNS4yODU3TCAwIDI1LjI4NTdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDMzLjcxNDIpIiBmaWxsPSIjMEFDRjgzIi8+CjwvZz4KPGcgaWQ9IkVsbGlwc2UiPgo8ZWxsaXBzZSBjeD0iMTYuNDU2MSIgY3k9IjE2Ljg1NzIiIHJ4PSIxNi40NTYxIiByeT0iMTYuODU3MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS4xNDI0OSAwKSIgZmlsbD0iIzFBQkNGRSIvPgo8L2c+CjwvZz4KPC9nPgo8L3N2Zz4KCg==" alt="">  -->
              {{$store.getters.userInfoObj.username}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">个人信息</el-dropdown-item>
              <el-dropdown-item command="b">密码修改</el-dropdown-item>
              <el-dropdown-item command="c">我的应用</el-dropdown-item>
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
      <!-- <li>
        <el-input clearable :maxlength="50" prefix-icon="el-icon-search" size="mini" v-model="inputValue" placeholder="服务检索"></el-input>
      </li> -->
    </ul>
    <!-- 个人信息弹出层 -->
    <el-dialog width="700px" title="个人信息" :visible.sync="personInfoVisible">
      <el-form :model="personInfoForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="roleId" label="我的角色" :label-width="formLabelWidth">
          <el-select style="width:280px;" v-model="personInfoForm.roleId">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option disabled label="普通管理员" value="2"></el-option>
            <el-option disabled label="普通用户" value="3"></el-option>
          </el-select>
          <span>&nbsp;当前角色不可更改为其它角色</span>
        </el-form-item>
        <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model.trim="personInfoForm.username" auto-complete="off" disabled></el-input>
          <span>&nbsp;不可修改。一般用于后台登入名</span>
        </el-form-item>
        <el-form-item prop="alias" label="昵称" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model.trim="personInfoForm.alias" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="gender" label="性别" :label-width="formLabelWidth">
          <el-radio v-model="personInfoForm.gender" label="male">男</el-radio>
          <el-radio v-model="personInfoForm.gender" label="female">女</el-radio>
        </el-form-item>
        <!-- <el-form-item label="头像" :label-width="formLabelWidth">
          <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="personInfoForm.url" :src="personInfoForm.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
        <el-form-item prop="phone" label="手机" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model.trim="personInfoForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model.trim="personInfoForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="备注" :label-width="formLabelWidth">
          <el-input clearable :maxlength="250" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" v-model.trim="personInfoForm.remark" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateUserInfo('ruleForm')">确认修改</el-button>
        <el-button @click="personInfoVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- /个人信息弹出层 -->

    <!-- 修改密码弹出层 -->
    <el-dialog width="560px" title="修改密码" :visible.sync="changePasswordVisible">
      <el-form :model="passwordInfoForm" :rules="rulesPwd" ref="ruleFormPwd">
        <el-form-item prop="currentPassword" label="当前密码" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model.trim="passwordInfoForm.currentPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model.trim="passwordInfoForm.newPassword" auto-complete="off"></el-input>
          <span>&nbsp;6-16个字符</span>
        </el-form-item>
        <el-form-item prop="checkNewPassword" label="确认新密码" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model.trim="passwordInfoForm.checkNewPassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePassWord('ruleFormPwd')">确认修改</el-button>
      </div>
    </el-dialog>
    <!-- /修改密码弹出层 -->
  </div>
</template>

<script>
import * as api from "api/login";
import Base64 from "utils/base64";
export default {
  data() {
    var checkPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordInfoForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      inputValue: "",
      formLabelWidth: "120px",
      personInfoVisible: false,
      changePasswordVisible: false,
      personInfoForm: {
        avatar: "", // 头像
        roleId: "",
        remark: "", // 备注
        email: "",
        phone: "",
        gender: "",
        alias: "",
        username: "",
        birthday: ""
      },
      rules: {
        alias: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        phone: [{ required: true, message: "请填写手机", trigger: "blur" }],
        email: [{ required: true, message: "请填写邮箱", trigger: "blur" }],
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }]
      },
      rulesPwd: {
        currentPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ],
        checkNewPassword: [
          { required: true, validator: checkPwd, trigger: "blur" }
        ]
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
  computed: {
    number() {
      // 待处理通知数
      // return this.$store.state.login.noticeNumber // 根据依赖实时变化
      return this.$store.getters.noticeNumber; // 根据依赖实时变化
    }
  },
  created() {
    this.$store.dispatch("getNoticeNumber"); // 获取通知数
    // this.$store.dispatch("getUserInfo"); // 获取用户信息
    // this.$store.dispatch("getRightObj"); // 获取能查看的权限对象
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "e":
          this.$store.commit('LOG_OUT')
          location.reload()
          // this.$store.dispatch("logOut").then(() => {
          //   // this.$router.push("/login");
          //   location.reload()
          // });
          break;
        case "a": // 个人信息
          this.personInfoVisible = true;
          this.$store.dispatch("getUserInfo").then(data => {
            this.personInfoForm = data;
          });
          break;
        case "b": // 修改密码
          this.changePasswordVisible = true;
          this.passwordInfoForm = {
            currentPassword: "",
            newPassword: "",
            checkNewPassword: ""
          };
          break;
        case "c": // 我的应用
          this.$router.push("/application");
          break;
      }
    },
    updateUserInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const {
            alias,
            birthday,
            email,
            gender,
            phone,
            remark,
            roleId,
            username
          } = this.personInfoForm;
          let query = {
            alias,
            birthday,
            email,
            gender,
            phone,
            remark,
            roleId,
            username
          };
          // 更新用户信息
          api.postUserInfo(query).then(res => {
            const { status, data } = res;
            if (status === 200 && data) {
              if (data.status === "success") {
                this.$message({
                  type: "success",
                  message: data.message
                });
              } else {
                this.$message.error(data.message);
              }
              this.personInfoVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    updatePassWord(formName) {
      // 更新密码
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = {
            oldPassword: Base64.encode(this.passwordInfoForm.currentPassword),
            password: Base64.encode(this.passwordInfoForm.checkNewPassword)
          };
          api.postPassWord(query).then(res => {
            const { status, data } = res;
            if (status === 200 && data) {
              if (data.status === "success") {
                this.$message({
                  type: "success",
                  message: data.message
                });
              } else {
                this.$message.error(data.message);
              }
            }
          });
          this.changePasswordVisible = false;
        } else {
          return false;
        }
      });
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
