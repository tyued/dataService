<template>
  <div class="user">
    <el-row class="row">
      <el-button v-if="rightInfoObj['user']['user:new']" type="primary" @click="addUser">添加用户</el-button>
    </el-row>
    <el-row class="row">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="pdName" label="所属供应商" sortable>
        </el-table-column>
        <el-table-column prop="username" label="用户名称">
        </el-table-column>
        <el-table-column prop="alias" label="用户别名">
        </el-table-column>
        <el-table-column prop="genderX" label="性别">
          <template slot-scope="{row}">
            {{row.gender === "male" ? "男" : "女"}}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="phone" label="手机">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-show="scope.row.status == '0'" type="info">不可用</el-tag>
            <el-tag size="small" v-show="scope.row.status == '1'" type="success">正常</el-tag>
            <el-tag size="small" v-show="scope.row.status == '2'" type="warning">锁定</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="150" label="操作">
          <template slot-scope="scope">
            <el-button v-if="rightInfoObj['user']['user:edit']" size="small" type="success" @click="editItem(scope.row)">编辑</el-button>
            <el-button v-if="rightInfoObj['user']['user:del']" size="small" type="danger" @click="deleteItem(scope.row)" :disabled="scope.row.username === 'admin'">删除</el-button>
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
          <el-input clearable maxlength="50" v-model.trim="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input clearable maxlength="50" v-model.trim="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleId">
          <el-select clearable v-model="ruleForm.roleId" placeholder="请选择用户角色">
            <el-option v-for="(item, index) in roleArr" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属供应商" prop="pdId">
          <el-select clearable v-model="ruleForm.pdId" placeholder="请选择所属供应商">
            <el-option v-for="(item, index) in valueArr" :key="index" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户别名" prop="alias">
          <el-input clearable maxlength="50" v-model.trim="ruleForm.alias"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input clearable maxlength="50" v-model.trim="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input clearable maxlength="50" v-model.trim="ruleForm.email"></el-input>
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
          <el-input disabled clearable maxlength="50" v-model.trim="ruleFormEdit.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input clearable maxlength="50" v-model.trim="ruleFormEdit.password"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleId">
          <el-select clearable v-model="ruleFormEdit.roleId" placeholder="请选择用户角色">
            <el-option v-for="(item, index) in roleArr" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属供应商" prop="pdId">
          <el-select clearable v-model="ruleFormEdit.pdId" placeholder="请选择所属供应商">
            <el-option v-for="(item, index) in valueArr" :key="index" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户别名" prop="alias">
          <el-input clearable maxlength="50" v-model.trim="ruleFormEdit.alias"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input clearable maxlength="50" v-model.trim="ruleFormEdit.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input clearable maxlength="50" v-model.trim="ruleFormEdit.email"></el-input>
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
import * as api from "api/right";
import PageBar from "components/PageBar/index";
import Base64 from "utils/base64";
import { phoneCheck, emailCheck, checkUsernameForUser, validatePass } from "utils/rules";
import { mapGetters } from "vuex";
export default {
  name: "user",
  components: {
    PageBar
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters(["rightInfoObj"])
  },
  data() {
    return {
      roleArr: [], // 角色数组
      valueArr: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      ruleForm: {
        id: "",
        pdName: "",
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
          {
            required: true,
            validator: checkUsernameForUser,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            validator: validatePass,
            trigger: "blur"
          }
        ],
        alias: [{ required: true, message: "请输入用户别名", trigger: "blur" },{ min: 2, max: 20, message: "长度为2-20个字符", trigger: "blur" }],
        phone: [{ required: true, validator: phoneCheck, trigger: "blur" }],
        email: [{ required: true, validator: emailCheck, trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        pdId: [{ required: true, message: "请选择所属供应商", trigger: "change" }]
      },
      ruleFormEdit: {
        id: "",
        pdName: "",
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
          {
            required: true,
            validator: checkUsernameForUser,
            trigger: "blur"
          }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        alias: [{ required: true, message: "请输入用户别名", trigger: "blur" },{ min: 2, max: 20, message: "长度为2-20个字符", trigger: "blur" }],
        phone: [{ required: true, validator: phoneCheck, trigger: "blur" }],
        email: [{ required: true, validator: emailCheck, trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        pdId: [{ required: true, message: "请选择所属供应商", trigger: "change" }]
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
    getList(pageNo = 1, limit = this.size) {
      let query = {
        pageNo,
        limit
      };
      api.getUser(query).then(data => {
        this.loading = false;
        this.tableData = data.rows;
        this.current = data.current;
        this.total = data.total;
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
          api.addUser({
            username: this.ruleForm.username,
            password: Base64.encode(this.ruleForm.password),
            alias: this.ruleForm.alias,
            phone: this.ruleForm.phone,
            email: this.ruleForm.email,
            gender: this.ruleForm.gender,
            pdId: this.ruleForm.pdId,
            roleId: this.ruleForm.roleId
          }).then(data => {
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
          api.updateUser({
            username: this.ruleFormEdit.username,
            password: this.ruleFormEdit.password,
            alias: this.ruleFormEdit.alias,
            phone: this.ruleFormEdit.phone,
            email: this.ruleFormEdit.email,
            gender: this.ruleFormEdit.gender,
            pdId: this.ruleFormEdit.pdId,
            roleId: this.ruleFormEdit.roleId,
            id: this.ruleFormEdit.id
          }).then(data => {
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
              id: row.id
            })
            .then(data => {
              if (data.status === "success") {
                this.getList();
                this.$message({
                  type: "success",
                  message: data.message
                });
              } else {
                this.$message.error(data.message);
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
      api.getRoleArr().then(data => {
        this.roleArr = data.data;
      });
    },
    getProducerValueList() {
      api.getProducerValueList().then(data => {
        this.valueArr = data;
      });
    },
    editItem(row) {
      this.getProducerValueList();
      this.getRoleArr();
      this.dialogFormVisibleEdit = true;
      api
        .getUserListById({
          id: row.id
        })
        .then(data => {
          this.ruleFormEdit = data;
        });
    },
    addUser() {
      this.getProducerValueList();
      this.getRoleArr();
      this.dialogFormVisible = true;
      this.ruleForm = {
        id: "",
        pdId: "",
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
