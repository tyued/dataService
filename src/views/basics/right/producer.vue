<template>
  <div class="producer">
    <el-row class="row">
      <el-button type="primary" @click="addUser">信息注册</el-button>
    </el-row>
    <el-row class="row">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column  prop="id" label="ID编号" sortable>
        </el-table-column>
        <el-table-column  prop="code" label="企业代码">
        </el-table-column>
        <el-table-column  prop="name" label="企业名称">
        </el-table-column>
        <el-table-column  prop="addr" label="企业地址">
        </el-table-column>
        <el-table-column  prop="trade" label="企业行业">
        </el-table-column>
        <el-table-column  prop="contact" label="联系人姓名">
        </el-table-column>
        <el-table-column  prop="timestamp" label="注册时间">
        </el-table-column>
        <!-- <el-table-column  prop="status" label="账号状态">
          <template slot-scope="scope">
            <el-tag size="small" v-show="scope.row.status == '0'" type="info">不可用</el-tag>
            <el-tag size="small" v-show="scope.row.status == '1'" type="success">正常</el-tag>
            <el-tag size="small" v-show="scope.row.status == '2'" type="warning">锁定</el-tag>
          </template>
        </el-table-column> -->
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
    <el-dialog title="信息注册" :visible.sync="dialogFormVisible" width="460px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="企业名称" prop="name">
          <el-input clearable maxlength="100" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="企业代码" prop="code">
          <el-input clearable maxlength="100" v-model="ruleForm.code"></el-input>
        </el-form-item>
        <el-form-item label="企业地址" prop="addr">
          <el-input clearable maxlength="100" v-model="ruleForm.addr"></el-input>
        </el-form-item>
        <el-form-item label="企业行业" prop="trade">
          <el-input clearable maxlength="100" v-model="ruleForm.trade"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contact">
          <el-input clearable maxlength="50" v-model="ruleForm.contact"></el-input>
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
        <el-form-item label="企业名称" prop="name">
          <el-input clearable maxlength="100" v-model="ruleFormEdit.name"></el-input>
        </el-form-item>
        <el-form-item label="企业代码" prop="code">
          <el-input clearable maxlength="100" v-model="ruleFormEdit.code"></el-input>
        </el-form-item>
        <el-form-item label="企业地址" prop="addr">
          <el-input clearable maxlength="100" v-model="ruleFormEdit.addr"></el-input>
        </el-form-item>
        <el-form-item label="企业行业" prop="trade">
          <el-input clearable maxlength="100" v-model="ruleFormEdit.trade"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contact">
          <el-input clearable maxlength="50" v-model="ruleFormEdit.contact"></el-input>
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
export default {
  name: "producer",
  components: {
    PageBar
  },
  computed: {},
  created() {
    this.getList();
  },

  data() {
    return {
      ruleForm: {
        id: "",
        code: "",
        name: "",
        addr: "",
        trade: "",
        contact: "",
        status: ""
      },
      rules: {
        code: [{ required: true, message: "请输入企业代码", trigger: "blur" }],
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        addr: [{ required: true, message: "请输入企业地址", trigger: "blur" }],
        trade: [{ required: true, message: "请输入企业行业", trigger: "blur" }],
        contact: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" }
        ]
      },
      ruleFormEdit: {
        id: "",
        code: "",
        name: "",
        addr: "",
        trade: "",
        contact: "",
        status: ""
      },
      rulesEdit: {
        code: [{ required: true, message: "请输入企业代码", trigger: "blur" }],
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        addr: [{ required: true, message: "请输入企业地址", trigger: "blur" }],
        trade: [{ required: true, message: "请输入企业行业", trigger: "blur" }],
        contact: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" }
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
    getList(pageNo = 1, limit = 10) {
      let query = {
        pageNo,
        limit
      };
      api.getProducerList(query).then(res => {
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
          // 添加用户请求
          let query = {
            code: this.ruleForm.code,
            name: this.ruleForm.name,
            addr: this.ruleForm.addr,
            contact: this.ruleForm.contact,
            trade: this.ruleForm.trade
          };
          api.addProducer(query).then(res => {
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
            code: this.ruleFormEdit.code,
            name: this.ruleFormEdit.name,
            addr: this.ruleFormEdit.addr,
            contact: this.ruleFormEdit.contact,
            trade: this.ruleFormEdit.trade
          };
          api.updateProducer(query).then(res => {
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
      this.$confirm("此操作将永久删除该数据提供商, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .deleteProducer({
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

      api
        .getProducerListById({
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
      this.dialogFormVisible = true;
      this.ruleForm = {
        id: "",
        code: "",
        name: "",
        addr: "",
        trade: "",
        contact: "",
        status: ""
      };
    }
  }
};
</script>


