<template>
  <div class="user">
    <el-row class="row">
      <el-button type="primary" @click="addUser">添加用户</el-button>
    </el-row>
    <el-row class="row">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column sortable prop="id" label="用户ID">
        </el-table-column>
        <el-table-column sortable prop="username" label="用户名称">
        </el-table-column>
        <el-table-column sortable prop="alias" label="用户别名">
        </el-table-column>
        <el-table-column sortable prop="genderX" label="性别">
        </el-table-column>
        <el-table-column sortable prop="email" label="邮箱">
        </el-table-column>
        <el-table-column sortable prop="phone" label="手机">
        </el-table-column>
        <el-table-column sortable prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-show="scope.row.status == '0'" type="info">不可用</el-tag>
            <el-tag size="small" v-show="scope.row.status == '1'" type="success">正常</el-tag>
            <el-tag size="small" v-show="scope.row.status == '2'" type="warning">锁定</el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="150" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="warning" @click="editItem(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteItem(scope.row)" :disabled="scope.row.username === 'admin'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row class="row">
      <!-- 分页组件here -->
      <PageBar :total="total" :currentpage="current" @handlePage="handlePage" @handlePageSize="handlePageSize" />
    </el-row>

    <!-- 添加弹层 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="460px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名称" prop="username">
          <el-input clearable maxlength="50" v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input clearable maxlength="50" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleId">
          <el-select v-model="ruleForm.roleId" placeholder="请选择用户角色">
            <el-option v-for="(item, index) in roleArr" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户别名" prop="alias">
          <el-input clearable maxlength="50" v-model="ruleForm.alias"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input clearable maxlength="50" v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input clearable maxlength="50" v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="ruleForm.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- /添加弹层 -->

    <!-- 修改弹层 -->
    <el-dialog title="修改用户" :visible.sync="dialogFormVisibleEdit" width="460px">
      <el-form :model="ruleFormEdit" :rules="rulesEdit" ref="ruleFormEdit" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名称" prop="username">
          <el-input clearable maxlength="50" v-model="ruleFormEdit.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input clearable maxlength="50" v-model="ruleFormEdit.password"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleId">
          <el-select v-model="ruleFormEdit.roleId" placeholder="请选择用户角色">
            <el-option v-for="(item, index) in roleArr" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户别名" prop="alias">
          <el-input clearable maxlength="50" v-model="ruleFormEdit.alias"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input clearable maxlength="50" v-model="ruleFormEdit.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input clearable maxlength="50" v-model="ruleFormEdit.email"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="ruleFormEdit.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormEdit('ruleFormEdit')">确定</el-button>
          <el-button @click="dialogFormVisibleEdit = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- /修改弹层 -->
  </div>
</template>

<script>
import * as api from "api/login";
import PageBar from "components/PageBar/index";
import Base64 from "utils/base64";
export default {
  name: "user",
  components: {
    PageBar
  },
  computed: {},
  created() {
    this.getList();
  },

  data() {
    var phoneCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入号码"));
      } else if (!/^1[34578]\d{9}$/.test(Number(value))) {
        callback(new Error("请输入11位有效手机号码"));
      } else {
        callback();
      }
    };
    var emailCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else if (
        !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
          value
        )
      ) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    return {
      roleArr: [], // 角色数组
      defaultProps: {
        children: "children",
        label: "label"
      },
      ruleForm: {
        id: "",
        username: "",
        password: "",
        alias: "",
        gender: "",
        email: "",
        phone: "",
        status: "",
        roleId: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        alias: [{ required: true, message: "请输入用户别名", trigger: "blur" }],
        phone: [{ required: true, validator: phoneCheck, trigger: "blur" }],
        email: [{ required: true, validator: emailCheck, trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }]
      },
      ruleFormEdit: {
        id: "",
        username: "",
        password: "",
        alias: "",
        gender: "",
        email: "",
        phone: "",
        status: "",
        roleId: ""
      },
      rulesEdit: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        alias: [{ required: true, message: "请输入用户别名", trigger: "blur" }],
        phone: [{ required: true, validator: phoneCheck, trigger: "blur" }],
        email: [{ required: true, validator: emailCheck, trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }]
      },
      loading: true,
      total: 0, // 分页
      current: 1, // 分页
      size: 10, // 缓存一下每页大小
      tableData: [],
      dialogFormVisible: false,
      dialogFormVisibleEdit: false
    };
  },
  methods: {
    getList(pageNo = 1, limit = 10) {
      let query = {
        pageNo,
        limit
      };
      api.getUser(query).then(res => {
        const { status, data } = res;
        if (status === 200 && data) {
          this.loading = false;
          data.rows.forEach(item => {
            item.genderX = item.gender == "male" ? "男" : "女";
          });
          this.tableData = data.rows;
          this.current = data.current;
          this.total = data.total;
        }
      });
    },
    handlePage(number) {
      // 分页
      this.getList(number);
      this.current = number;
    },
    handlePageSize(number) {
      // 分页大小
      this.size = number;
      this.getList(1, number);
      this.current = 1;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 添加用户请求
          let query = {
            username: this.ruleForm.username,
            password: Base64.encode(this.ruleForm.password),
            alias: this.ruleForm.alias,
            phone: this.ruleForm.phone,
            email: this.ruleForm.email,
            gender: this.ruleForm.gender,
            roleId: this.ruleForm.roleId
          };
          api.addUser(query).then(res => {
            const { status, data } = res;
            if (status === 200 && data) {
              if (data.status === "success") {
                this.$message({
                  type: "success",
                  message: data.message
                });
                this.dialogFormVisible = false;
                this.getList();
              } else {
                this.$message.error(data.message);
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    submitFormEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 修改
          let query = {
            username: this.ruleFormEdit.username,
            password: this.ruleFormEdit.password,
            alias: this.ruleFormEdit.alias,
            phone: this.ruleFormEdit.phone,
            email: this.ruleFormEdit.email,
            gender: this.ruleFormEdit.gender,
            roleId: this.ruleFormEdit.roleId,
            id: this.ruleFormEdit.id
          };
          api.updateUser(query).then(res => {
            const { status, data } = res;
            if (status === 200 && data) {
              if (data.status === "success") {
                this.$message({
                  type: "success",
                  message: data.message
                });
                this.dialogFormVisibleEdit = false;
                this.getList();
              } else {
                this.$message.error(data.message);
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    deleteItem(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .deleteUser({
              userid: row.id
            })
            .then(res => {
              const { status, data } = res;
              if (status === 200 && data) {
                if (data.status === "success") {
                  this.getList();
                  this.$message({
                    type: "success",
                    message: data.message
                  });
                } else {
                  this.$message.error(data.message);
                }
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getRoleArr() {
      api.getRoleArr().then(res => {
        const { status, data } = res;
        if (status === 200 && data) {
          this.roleArr = data.data;
        }
      });
    },
    editItem(row) {
      this.getRoleArr();
      this.dialogFormVisibleEdit = true;

      api
        .getUserListById({
          id: row.id
        })
        .then(res => {
          const { status, data } = res;
          if (status === 200 && data) {
            this.ruleFormEdit = data;
          }
        });
    },
    addUser() {
      this.getRoleArr();
      this.dialogFormVisible = true;
      this.ruleForm = {
        id: "",
        username: "",
        password: "",
        alias: "",
        gender: "",
        email: "",
        phone: "",
        status: ""
      };
      this.ruleForm.password = "123456";
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

