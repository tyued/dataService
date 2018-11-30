<template>
  <div class="baseconfig">
    <el-row class="row">
      <el-button v-if="rightInfoObj['basedata']['basedata:new']" type="primary" @click="addUser">添加数据</el-button>
    </el-row>
    <el-row class="row">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="group" label="基础数据分组" sortable>
        </el-table-column>
        <el-table-column prop="label" label="基础数据标签">
        </el-table-column>
        <el-table-column prop="key" label="基础数据键">
        </el-table-column>
        <el-table-column prop="text" label="基础数据值">
        </el-table-column>
        <el-table-column prop="order" label="数据排序">
        </el-table-column>
        <el-table-column prop="status" label="数据状态">
          <template slot-scope="scope">
            <el-tag size="small" v-show="scope.row.status == '0'" type="info">不可用</el-tag>
            <el-tag size="small" v-show="scope.row.status == '1'" type="success">可用</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="220" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == '0'" size="small" type="success" @click="startItem(scope.row)">启用</el-button>
            <el-button v-if="scope.row.status == '1'" size="small" type="danger" @click="forbiddenItem(scope.row)">禁用</el-button>
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
    <el-dialog title="添加数据" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="基础数据分组" prop="group">
          <!-- <el-input clearable maxlength="50" v-model="ruleForm.group"></el-input> -->
          <el-autocomplete clearable maxlength="50" class="inline-input" v-model.trim="ruleForm.group" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete>
        </el-form-item>
        <el-form-item label="基础数据标签" prop="label">
          <el-input clearable maxlength="50" v-model.trim="ruleForm.label"></el-input>
        </el-form-item>
        <el-form-item label="基础数据键" prop="key">
          <el-input clearable maxlength="50" v-model.trim="ruleForm.key"></el-input>
        </el-form-item>
        <el-form-item label="基础数据值" prop="text">
          <el-input clearable maxlength="50" v-model.trim="ruleForm.text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- /添加弹层 -->

    <!-- 修改弹层 -->
    <el-dialog title="修改数据" :visible.sync="dialogFormVisibleEdit" width="600px">
      <el-form :model="ruleFormEdit" :rules="rulesEdit" ref="ruleFormEdit" label-width="120px" class="demo-ruleForm">
        <el-form-item label="基础数据ID" prop="id">
          <el-input disabled maxlength="50" v-model.trim="ruleFormEdit.id"></el-input>
        </el-form-item>
        <el-form-item label="基础数据标签" prop="label">
          <el-input clearable maxlength="50" v-model.trim="ruleFormEdit.label"></el-input>
        </el-form-item>
        <el-form-item label="基础数据值" prop="text">
          <el-input clearable maxlength="50" v-model.trim="ruleFormEdit.text"></el-input>
        </el-form-item>
        <el-form-item label="数据状态" prop="status">
          <el-radio-group v-model="ruleFormEdit.status">
            <el-radio label="0">不可用</el-radio>
            <el-radio label="1">可用</el-radio>
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
import * as api from "api/setting.js";
import PageBar from "components/PageBar/index";
import { mapGetters } from "vuex";
export default {
  name: "baseconfig",
  components: {
    PageBar
  },
  computed: {
    ...mapGetters(["rightInfoObj"])
  },
  created() {
    this.getList();
  },

  data() {
    return {
      typeArr: [], // 类型数组
      ruleForm: {
        group: "",
        label: "",
        key: "",
        text: ""
      },
      rules: {
        group: [
          { required: true, message: "请输入基础数据分组", trigger: "blur" }
        ],
        label: [
          { required: true, message: "请输入基础数据标签", trigger: "blur" }
        ],
        key: [{ required: true, message: "请输入基础数据键", trigger: "blur" }],
        text: [{ required: true, message: "请输入基础数据值", trigger: "blur" }]
      },
      ruleFormEdit: {
        id: "",
        label: "",
        text: "",
        status: ""
      },
      rulesEdit: {
        id: [{ required: true, message: "请输入基础数据ID", trigger: "blur" }],
        label: [
          { required: true, message: "请输入基础数据标签", trigger: "blur" }
        ],
        text: [
          { required: true, message: "请输入基础数据值", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择基础数据状态", trigger: "blur" }
        ]
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
    querySearch(queryString, cb) {
      var typeArr = this.typeArr;
      var results = queryString
        ? typeArr.filter(this.createFilter(queryString))
        : typeArr;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    getList(pageNo = 1, limit = this.size) {
      let query = {
        pageNo,
        limit
      };
      api.getBase(query).then(res => {
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 添加数据请求
          let query = {
            group: this.ruleForm.group,
            label: this.ruleForm.label,
            key: this.ruleForm.key,
            text: this.ruleForm.text
          };
          api.addBase(query).then(res => {
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
            id: this.ruleFormEdit.id,
            label: this.ruleFormEdit.label,
            status: this.ruleFormEdit.status,
            text: this.ruleFormEdit.text
          };
          api.updateBase(query).then(res => {
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
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .delBase({
              ids: row.id
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
      api
        .getBaseById({
          id: row.id
        })
        .then(res => {
          const { status, data } = res;
          if (status === 200 && data) {
            this.ruleFormEdit = data;
          }
        });
    },
    startItem(row) {
      this.$confirm("确定要启用吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .toggleBase({
              id: row.id,
              status: "1"
            })
            .then(({ status, data }) => {
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
            message: "已取消启用"
          });
        });
    },
    forbiddenItem(row) {
      this.$confirm("确定要禁用吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .toggleBase({
              id: row.id,
              status: "0"
            })
            .then(({ status, data }) => {
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
            message: "已取消禁用"
          });
        });
    },
    addUser() {
      api.getTypes().then(({ status, data }) => {
        this.typeArr = data;
        this.dialogFormVisible = true;
      });
      this.ruleForm = {
        group: "",
        label: "",
        key: "",
        text: ""
      };
    }
  }
};
</script>
