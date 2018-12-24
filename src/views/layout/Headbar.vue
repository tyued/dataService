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
              {{userInfoObj.alias}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">个人信息</el-dropdown-item>
              <el-dropdown-item command="b">密码修改</el-dropdown-item>
              <el-dropdown-item command="c">我的应用</el-dropdown-item>
              <el-dropdown-item class="out" command="e" divided>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </li>
      <li>
        <span class="el-dropdown-link">
          <el-badge :value="noticeNumber" class="item">
            <i class="el-icon-bell" @click="goToNotice"></i>
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
          <el-input clearable :maxlength="50" style="width:280px;" v-model.trim="personInfoForm.roleName" auto-complete="off" disabled></el-input>
          <!-- <el-select style="width:280px;" v-model="personInfoForm.roleId">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option disabled label="数据提供方" value="2"></el-option>
            <el-option disabled label="普通消费者" value="3"></el-option>
          </el-select> -->
          <span>&nbsp;由后台管理员统一设置</span>
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
          <el-input clearable :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" v-model.trim="personInfoForm.remark" placeholder="请输入内容"></el-input>
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
        </el-form-item>
        <el-form-item prop="checkNewPassword" label="确认新密码" :label-width="formLabelWidth">
          <el-input clearable :maxlength="50" style="width:280px;" v-model.trim="passwordInfoForm.checkNewPassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePassWord('ruleFormPwd')">确认修改</el-button>
        <el-button @click="changePasswordVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- /修改密码弹出层 -->
  </div>
</template>

<script>
import * as api from "api/login";
import Base64 from "utils/base64";
import { mapGetters } from "vuex";
import { checkPwd, validatePassNew, validatePassOld, phoneCheck, emailCheck } from 'utils/rules'
export default {
  data() {
    return {
      inputValue: "", // 输入框value 目前还没接口
      formLabelWidth: "120px", // 表单label宽度
      personInfoVisible: false, // 个人信息弹层
      changePasswordVisible: false, // 修改密码弹层
      personInfoForm: { // 个人信息表单对象
        avatar: "", // 头像
        roleId: "", // 角色id
        remark: "", // 备注
        email: "",
        phone: "",
        gender: "",
        alias: "",
        username: "",
        birthday: ""
      },
      rules: { // 个人信息表单验证对象
        alias: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 2, max: 20, message: "长度为2-20个字符", trigger: "blur" }
        ],
        phone: [{ required: true, validator: phoneCheck, trigger: "blur" }],
        email: [{ required: true, validator: emailCheck, trigger: "blur" }],
        remark: [
          { required: true, message: "请填写备注", trigger: "blur" },
          { min: 1, max: 500, message: "长度为1-500个字符", trigger: "blur" }
        ]
      },
      rulesPwd: {  // 修改密码表单验证对象
        currentPassword: [
          {
            required: true,
            validator: validatePassOld.bind(this),
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            validator: validatePassNew,
            trigger: "blur"
          },
        ],
        checkNewPassword: [
          { required: true, validator: checkPwd.bind(this), trigger: "blur" }
        ]
      },
      passwordInfoForm: { // 修改密码对象
        currentPassword: "",
        newPassword: "",
        checkNewPassword: ""
      },
    };
  },
  computed: {
    ...mapGetters(["formLeave", "userInfoObj", "noticeNumber"]),
  },
  created() {
    this.$store.dispatch("getNoticeNumber"); // 获取通知数
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "e": // 登出
          this.$store.dispatch("logOut").then(() => {
            // this.$router.push("/login");
            location.reload();
          });
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
          if (this.formLeave) { // 在注册时，填写表单，一不小心点击了我的应用，表单白填了，所以这里要加一个判断，状态formLeave已存全局vuex
            this.$confirm("数据尚未保存，确定要离开吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.$store.commit('SET_formLeave', false) // 离开了，要更新状态为false
              this.$router.push("/application");
              this.$store.commit("SET_SIDEBAR", ""); // 将左侧的sidebar高亮取消掉
            });
          } else {
            this.$router.push("/application");
            this.$store.commit("SET_SIDEBAR", "");
          }

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
          // 更新用户信息
          api.postUserInfo({
            alias,
            birthday,
            email,
            gender,
            phone,
            remark,
            roleId,
            username
          }).then(res => {
            const {status, message} = res
            if (status === "success") { 
              this.$message({
                type: "success",
                message
              });
              this.personInfoVisible = false;
            } else {
              this.$message.error(message);
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
          api.postPassWord({
            oldPassword: Base64.encode(this.passwordInfoForm.currentPassword),
            password: Base64.encode(this.passwordInfoForm.checkNewPassword)
          }).then(res => {
            const {status, message} = res
            if (status === "success") { 
              this.$message({
                type: "success",
                message
              });
              this.changePasswordVisible = false;
            } else {
              this.$message.error(message);
            }
          });
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
    },
    goToNotice() {
      if (this.formLeave) {
        this.$confirm("数据尚未保存，确定要离开吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$store.commit('SET_formLeave', false)
          this.$router.push("/notice");
          this.$store.commit("SET_SIDEBAR", "");
        });
      } else {
        this.$router.push("/notice");
        this.$store.commit("SET_SIDEBAR", "");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.out {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

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
