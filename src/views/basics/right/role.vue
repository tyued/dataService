<template>
  <div class="role">
    <el-row class="row">
      <el-button type="primary" @click="addUser">添加角色</el-button>
    </el-row>
    <el-row class="row">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column  prop="id" label="角色ID" sortable>
        </el-table-column>
        <el-table-column  prop="name" label="角色名称">
        </el-table-column>
        <!-- <el-table-column  prop="type" label="角色类型">
          <template slot-scope="scope">
            <el-tag size="small" v-show="scope.row.type == '1'" type="info">原生</el-tag>
            <el-tag size="small" v-show="scope.row.type == '2'" type="success">继承</el-tag>
            <el-tag size="small" v-show="scope.row.type == '3'" type="warning">复制</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column  prop="intro" label="角色简介">
        </el-table-column>
        <el-table-column  prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-show="scope.row.status == '0'" type="info">不可用</el-tag>
            <el-tag size="small" v-show="scope.row.status == '1'" type="success">正常</el-tag>
            <el-tag size="small" v-show="scope.row.status == '2'" type="warning">锁定</el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="150" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="warning" @click="editItem(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row class="row">
      <!-- 分页组件here -->
      <PageBar :total="total" :currentpage="current" @handlePage="handlePage" @handlePageSize="handlePageSize" />
    </el-row>

    <!-- 添加弹层 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible" width="660px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input maxlength="50" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="角色类型" prop="type">
          <el-select v-model="ruleForm.type" placeholder="请选择角色类型">
            <el-option label="原生" value="1"></el-option>
            <el-option label="继承" value="2"></el-option>
            <el-option label="复制" value="3"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="分配权限" prop="right">
          <!-- <el-tree ref="tree" :data="ruleForm.right" show-checkbox node-key="id" :props="defaultProps">
          </el-tree> -->
          <el-checkbox-group v-model="ruleForm.right">
            <el-checkbox v-for="(item, index) in checkboxArr" :key="index" :label="index">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="角色简介" prop="intro">
          <el-input type="textarea" v-model="ruleForm.intro"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- /添加弹层 -->

    <!-- 修改弹层 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEdit" width="660px">
      <el-form :model="ruleFormEdit" :rules="rulesEdit" ref="ruleFormEdit" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input maxlength="50" v-model="ruleFormEdit.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="角色类型" prop="type">
          <el-select v-model="ruleFormEdit.type" placeholder="请选择角色类型">
            <el-option label="原生" value="1"></el-option>
            <el-option label="继承" value="2"></el-option>
            <el-option label="复制" value="3"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="分配权限" prop="right">
          <!-- <el-tree ref="tree" :data="ruleFormEdit.right" show-checkbox node-key="id" :props="defaultProps">
          </el-tree> -->
          <el-checkbox-group v-model="ruleFormEdit.right">
            <el-checkbox v-for="(item, index) in checkboxArrEdit" :key="index" :label="index">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="角色简介" prop="intro">
          <el-input type="textarea" v-model="ruleFormEdit.intro"></el-input>
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
export default {
  name: "role",
  components: {
    PageBar
  },
  computed: {},
  created() {
    this.getList();
  },

  data() {
    return {
      // defaultProps: {
      //   children: "children",
      //   label: "label"
      // },
      checkboxArr: [],
      checkboxArrEdit: [],
      ruleForm: {
        name: "",
        // type: "",
        right: [],
        intro: ""
      },
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        // type: [
        //   { required: true, message: "请选择角色类型", trigger: "change" }
        // ],
        intro: [{ required: true, message: "请填写角色简介", trigger: "blur" }],
        right: [
          { required: true, message: "请指定角色权限", trigger: "change" }
        ]
      },
      ruleFormEdit: {
        name: "",
        // type: "",
        right: [],
        intro: "",
        id: ''
      },
      rulesEdit: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        // type: [
        //   { required: true, message: "请选择角色类型", trigger: "change" }
        // ],
        intro: [{ required: true, message: "请填写角色简介", trigger: "blur" }],
        right: [
          { required: true, message: "请指定角色权限", trigger: "change" }
        ]
      },
      loading: true,
      total: 0, // 分页
      current: 1, // 分页
      size: 10, // 缓存一下每页大小
      tableData: [],
      permsArr: [], // perms数组
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
      api.getRoleList(query).then(res => {
        const { status, data } = res;
        if (status === 200 && data) {
          this.loading = false;
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
    getPermsArr(indexArr, checkboxArr) {
      // 根据索引数组 来获取对应的perms数组
      return indexArr.map(item => {
        return checkboxArr[item].perms;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 添加用户请求
          let query = {
            intro: this.ruleForm.intro,
            name: this.ruleForm.name,
            perms: Array.from(
              new Set(this.getPermsArr(this.ruleForm.right, this.checkboxArr))
            ),
            type: "4"
          };
          api.addRole(query).then(res => {
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
            intro: this.ruleFormEdit.intro,
            name: this.ruleFormEdit.name,
            perms: Array.from(
              new Set(
                this.getPermsArr(this.ruleFormEdit.right, this.checkboxArrEdit)
              )
            ),
            type: "4",
            id: this.ruleFormEdit.id
          };
          api.updateRole(query).then(res => {
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
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .deleteRole({
              id: row.id
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
    editItem(row) {
      this.dialogFormVisibleEdit = true;
      this.ruleFormEdit.right = [];
      api
        .getRoleListById({
          id: row.id
        })
        .then(res => {
          const { status, data } = res;
          if (status === 200 && data) {
            this.ruleFormEdit.intro = data.intro;
            this.ruleFormEdit.name = data.name;
            this.ruleFormEdit.id = data.id;
          }
        });
      api
        .getRightTree({
          roleid: row.id
        })
        .then(res => {
          const { status, data } = res;
          if (status === 200 && data) {
            this.handleForEach(data, row.id);
            this.checkboxArrEdit = data;
          }
        });
    },
    handleForEach(arr, id) {
      api
        .getRoleRight({
          roleId: id
        })
        .then(res => {
          const { status, data } = res;
          if (status === 200 && data) {
            arr.forEach((x, idx) => {
              data.forEach(y => {
                if (x.code === y.code) {
                  this.ruleFormEdit.right.push(idx);
                }
              });
            });
          }
        });
    },
    addUser() {
      this.dialogFormVisible = true;
      this.ruleForm = {
        name: "",
        type: "",
        right: [],
        intro: ""
      };
      api.getRightTree().then(res => {
        const { status, data } = res;
        if (status === 200 && data) {
          this.checkboxArr = data;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

