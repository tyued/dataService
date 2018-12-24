<template>
  <div class="application">
    <el-row class="row">
      <el-button type="primary" @click="addUser">添加应用</el-button>
    </el-row>
    <el-row class="row">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <!-- <el-table-column  prop="appUid" label="应用UID">
        </el-table-column> -->
        <el-table-column type="expand" sortable>
          <template slot-scope="props" class="template">
            <el-row style="padding: 10px 0">
              <div class="template-row">
                <div class="template-title">应用UID</div>{{ props.row.appUid }}
              </div>
            </el-row>
            <el-row style="padding: 10px 0">
              <div class="template-row">
                <div class="template-title">应用Key</div>{{ props.row.appKey }}
              </div>
            </el-row>
            <el-row style="padding: 10px 0">
              <div class="template-row">
                <div class="template-title">应用Secret</div>{{ props.row.appSecret }}
              </div>
            </el-row>
            <!-- <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="应用UID">
                <span>{{ props.row.appUid }}</span>
              </el-form-item>
              <el-form-item label="应用Key">
                <span>{{ props.row.appKey }}</span>
              </el-form-item>
              <el-form-item label="应用Secret">
                <span>{{ props.row.appSecret }}</span>
              </el-form-item>
            </el-form> -->
          </template>
        </el-table-column>
        <el-table-column prop="name" label="应用名称">
        </el-table-column>
        <el-table-column prop="desc" label="应用描述">
        </el-table-column>
        <el-table-column prop="lang" label="应用开发语言">
        </el-table-column>
        <el-table-column prop="addr" label="应用部署地址">
        </el-table-column>
        <!-- <el-table-column  prop="appKey" label="应用Key">
        </el-table-column>
        <el-table-column  prop="appSecret" label="应用Secret">
        </el-table-column> -->
        <el-table-column prop="subSum" label="应用服务订阅量">
        </el-table-column>

        <el-table-column min-width="150" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="editItem(scope.row)">编辑</el-button>
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
    <el-dialog title="添加应用" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="应用名称" prop="name">
          <el-input clearable maxlength="50" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="应用描述" prop="desc">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" clearable maxlength="50" v-model.trim="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="应用开发语言" prop="lang">
          <el-select v-model="ruleForm.lang" placeholder="请选择应用开发语言">
            <el-option label="C#" value="csharp"></el-option>
            <el-option label="Go" value="go"></el-option>
            <el-option label="Groovy" value="groovy"></el-option>
            <el-option label="Java" value="java"></el-option>
            <el-option label="JavaScript" value="javascript"></el-option>
            <el-option label="Kotlin" value="kotlin"></el-option>
            <el-option label="PHP" value="php"></el-option>
            <el-option label="Python" value="python"></el-option>
            <el-option label="Ruby" value="ruby"></el-option>
            <el-option label="Swift" value="swift"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用部署地址" prop="addr">
          <el-input clearable maxlength="50" v-model.trim="ruleForm.addr"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- /添加弹层 -->

    <!-- 修改弹层 -->
    <el-dialog title="修改应用" :visible.sync="dialogFormVisibleEdit" width="500px">
      <el-form :model="ruleFormEdit" :rules="rulesEdit" ref="ruleFormEdit" label-width="120px" class="demo-ruleForm">
        <el-form-item label="应用名称" prop="name">
          <el-input clearable v-model.trim="ruleFormEdit.name"></el-input>
        </el-form-item>
        <el-form-item label="应用描述" prop="desc">
          <el-input clearable v-model.trim="ruleFormEdit.desc"></el-input>
        </el-form-item>
        <el-form-item label="应用开发语言" prop="lang">
          <el-select v-model="ruleFormEdit.lang" placeholder="请选择应用开发语言">
            <el-option label="C#" value="csharp"></el-option>
            <el-option label="Go" value="go"></el-option>
            <el-option label="Groovy" value="groovy"></el-option>
            <el-option label="Java" value="java"></el-option>
            <el-option label="JavaScript" value="javascript"></el-option>
            <el-option label="Kotlin" value="kotlin"></el-option>
            <el-option label="PHP" value="php"></el-option>
            <el-option label="Python" value="python"></el-option>
            <el-option label="Ruby" value="ruby"></el-option>
            <el-option label="Swift" value="swift"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用部署地址" prop="addr">
          <el-input clearable v-model.trim="ruleFormEdit.addr"></el-input>
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
import { nameCheck, descCheck } from 'utils/rules'
import { noticeResponse } from 'utils'
export default {
  name: "application",
  components: {
    PageBar
  },
  created() {
    this.getList();
  },
  data() {
    return {
      ruleForm: {
        name: "",
        desc: "",
        lang: "",
        addr: ""
      },
      rules: {
        name: [{ required: true, validator: nameCheck, trigger: "blur" }],
        desc: [{ required: true, validator: descCheck, trigger: "blur" }],
        lang: [
          { required: true, message: "请输入应用开发语言", trigger: "change" }
        ],
        addr: [
          {
            required: true,
            type: "url",
            message: "请输入有效的应用部署地址",
            trigger: "blur"
          }
        ]
      },
      ruleFormEdit: {
        name: "",
        desc: "",
        lang: "",
        addr: ""
      },
      rulesEdit: {
        name: [{ required: true, validator: nameCheck, trigger: "blur" }],
        desc: [{ required: true, validator: descCheck, trigger: "blur" }],
        lang: [
          { required: true, message: "请输入应用开发语言", trigger: "change" }
        ],
        addr: [
          {
            required: true,
            type: "url",
            message: "请输入有效的应用部署地址",
            trigger: "blur"
          }
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
    getList(pageNo = 1, limit = this.size) {
      let query = {
        pageNo,
        limit
      };
      api.getAppList(query).then(res => {
        this.loading = false;
        this.tableData = res.rows;
        this.current = res.current;
        this.total = res.total;
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
          api.addApp({
            name: this.ruleForm.name,
            desc: this.ruleForm.desc,
            lang: this.ruleForm.lang,
            addr: this.ruleForm.addr
          }).then(res => {
            if (res.status === "success") {
              this.$message({
                type: "success",
                message: res.message
              });
              this.dialogFormVisible = false;
              this.getList();
            } else {
              this.$message.error(res.message);
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
            name: this.ruleFormEdit.name,
            desc: this.ruleFormEdit.desc,
            lang: this.ruleFormEdit.lang,
            addr: this.ruleFormEdit.addr,
            id: this.ruleFormEdit.id
          };
          api.updateApp(query).then(res => {
            if (res.status === "success") {
              this.$message({
                type: "success",
                message: res.message
              });
              this.dialogFormVisibleEdit = false;
              this.getList();
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    deleteItem(row) {
      this.$confirm("此操作将永久删除该应用, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .deleteApp({
              appId: row.id
            })
            .then(res => {
              if (res.status === "success") {
                this.getList();
                this.$message({
                  type: "success",
                  message: res.message
                });
              } else {
                this.$message.error(res.message);
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
        .getAppListById({
          id: row.id
        })
        .then(res => {
          this.ruleFormEdit = res;
        });
    },
    addUser() {
      this.dialogFormVisible = true;
      this.ruleForm = {
        name: "",
        desc: "",
        lang: "",
        addr: "",
        appKey: "",
        appSecret: ""
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.template-row {
  line-height: 1.6em;
  position: relative;
  padding-left: 100px;
}
.template-title {
  position: absolute;
  top: 0;
  left: 0;
  color: #99a9bf;
}
</style>

