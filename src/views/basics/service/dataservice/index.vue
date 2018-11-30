<template>
  <el-col :span="24">
    <el-card class="box-card">
      <el-col :span="24">
        <div class="colLeft">
          <el-button v-if="rightInfoObj['serv-ds']['serv-ds:new']" type="primary" icon="el-icon-plus" @click="handleCreate">新建数据源</el-button>
        </div>
        <div class="colRight">
          <el-select v-model="typeSel" placeholder="请选择" clearable @change="handleType">
            <el-option v-for='(item,index) in dbTypes' v-bind:key="index" :label="item.vendor" :value="item.key"></el-option>
          </el-select>
          <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model.trim="listQuery.name" class="input-with-select" style="width: 280px;">
            <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
          </el-input>
          <!--<el-button icon="el-icon-download">下载</el-button>
                    <el-button icon="el-icon-tickets">筛选</el-button>
                    <div class="ticksxTab">
                        
                    </div>-->
        </div>
      </el-col>
      <el-table v-loading.body="listLoading" :data="tableData" style="width: 100%" height="580">
        <el-table-column prop="name" label="数据源名称"></el-table-column>
        <el-table-column prop="dbtype" label="数据库类型"></el-table-column>
        <el-table-column prop="timestamp" label="创建时间"></el-table-column>
        <el-table-column prop="desc" label="摘要"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button v-if="rightInfoObj['serv-ds']['serv-ds:edit']" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="rightInfoObj['serv-ds']['serv-ds:del']" size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </el-card>
    <el-dialog center :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="670px">
      <el-form :rules="rules" :model="form" ref="form" label-width="122px">
        <el-form-item label="数据源名称" prop="name">
          <el-input v-model.trim="form.name"></el-input>
        </el-form-item>
        <el-form-item label="数据库类型" prop="dbtype">
          <el-select v-model="form.dbtype" placeholder="请数据库类型" @change="change_dbType">
            <el-option v-for='(item,index) in dbTypes' v-bind:key="index" :label="item.vendor" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.ipv4Active" label="数据库IP" prop="ipv4">
          <el-input v-model="form.ipv4"></el-input>
        </el-form-item>
        <el-form-item v-if="form.portActive" label="数据库访问端口" prop="port">
          <el-input v-model="form.port"></el-input>
        </el-form-item>
        <el-form-item v-if="form.dbnameActive" label="数据库实例名称" prop="dbname">
          <el-input v-model="form.dbname"></el-input>
        </el-form-item>
        <el-form-item v-show="form.dbtype" label="连接字符串" class="linkBlock">
          <el-input type="textarea" :autosize="true" :value="url" disabled style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="form.password"></el-input>
        </el-form-item>
        <el-form-item label="数据库摘要" prop="desc">
          <el-input :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" v-model.trim="form.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>

  </el-col>
</template>


<script>
// <VueUEditor :ueditorConfig='editorConfig' @ready="editorReady"></VueUEditor>
import VueUEditor from "vue-ueditor";
import * as api from "api/service/dataservice/index";
import * as dicty from "api/dictionary";
import { mapGetters } from "vuex";
export default {
  name: "dataService",
  components: {
    VueUEditor
  },
  computed: {
    ...mapGetters(["rightInfoObj"]),
    url() {
      return `${this.form.p1}${this.form.ipv4Active ? this.form.ipv4 : ""}${
        this.form.p2
      }${this.form.portActive ? this.form.port : ""}${this.form.p3}${
        this.form.dbnameActive ? this.form.dbname : ""
      }${this.form.last}`;
    }
  },
  data() {
    var checkipv4 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入数据库IP"));
      } else if (
        !/^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/.test(
          value
        )
      ) {
        callback(new Error("请输入正确的IP地址"));
      } else {
        callback();
      }
    };
    var checkPort = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入端口号"));
      } else if (
        !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
          value
        )
      ) {
        callback(new Error("端口号范围为0-65535"));
      } else {
        callback();
      }
    };
    var checkUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名称"));
      } else if (!/^\w{1,50}$/.test(value)) {
        callback(new Error("请输入字母，数字或下划线, 长度在 1 到 50 个字符"));
      } else {
        callback();
      }
    };
    var validatePassNew = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!/^[a-zA-Z0-9]{6,30}$/.test(value)) {
        callback(new Error("请输入字母或数字，长度在 6 到 30 个字符"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        name: [
          { required: true, message: "请输入数据源名称", trigger: "blur" },
          { min: 1, max: 100, message: "长度为1-100个字符", trigger: "blur" }
        ],
        dbtype: [
          { required: true, message: "请选择数据库类型", trigger: "change" }
        ],
        ipv4: [
          {
            required: true,
            validator: checkipv4,
            trigger: "blur"
          }
        ],
        port: [{ required: true, validator: checkPort, trigger: "blur" }],

        dbname: [
          { required: true, message: "请输入数据库名称", trigger: "blur" },
          { min: 1, max: 100, message: "长度为1-100个字符", trigger: "blur" }
        ],

        username: [
          {
            required: true,
            validator: checkUsername,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            validator: validatePassNew,
            trigger: "blur"
          }
        ],
        desc: [
          { required: true, message: "请输入摘要", trigger: "blur" },
          { min: 1, max: 500, message: "长度为1-500个字符", trigger: "blur" }
        ]
      },
      beforeName: "", // url前缀
      listLoading: true,
      listQuery: {
        dbtype: "", //数据库类型
        pageNo: 1,
        limit: 20,
        name: undefined,
        // sortName:'time24',
        sortName: "",
        sortOrder: "" //asc  正序   desc 倒序
      },
      total: null, //总页数
      tableData: [],
      typeSel: "", //数据库类型选择

      dbTypes: [], //数据库类型信息

      dialogFormVisible: false, //弹层是否显示
      dialogStatus: "",
      textMap: {
        //判断弹层是添加还是编辑
        update: "编辑数据源",
        create: "新建数据源"
      },
      tabPosition: "left",
      form: {
        name: "",
        dbtype: "",
        ipv4: "",
        port: "",
        dbname: "",
        placeholder: "", // 返回的模板
        ipv4Active: true,
        portActive: true,
        dbnameActive: true,
        p1: "",
        p2: "",
        p3: "",
        last: ""
      },
      editorConfig: {
        toolbars: [
          [
            "bold",
            "italic",
            "underline",
            "forecolor",
            "|",
            "justifyleft",
            "justifycenter",
            "justifyright",
            "justifyjustify",
            "|",
            "link",
            "unlink",
            "removeformat",
            "formatmatch"
          ]
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getdbTypes();
  },
  methods: {
    getList() {
      api.getList(this.listQuery).then(response => {
        this.tableData = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    // 数据库类型信息
    getdbTypes() {
      dicty.getdbTypes().then(response => {
        this.dbTypes = response.data;
      });
    },
    // 富文本编辑器
    editorReady(editorInstance) {
      editorInstance.setContent("desc");
    },
    // 搜索
    handleFilter() {
      if (this.searchsel == "all") {
        this.listQuery = {
          dbtype: "",
          pageNo: 1,
          limit: 20,
          name: undefined,
          sortName: "time24",
          sortOrder: ""
        };
      }
      this.getList();
    },
    searchChange(val) {
      this.listQuery = {
        dbtype: "",
        pageNo: 1,
        limit: 20,
        name: undefined,
        sortName: "time24",
        sortOrder: ""
      };
    },
    // 数据库类型选择
    handleType(val) {
      this.listQuery.dbtype = val;
      this.getList();
    },
    //分页
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this.getList();
    },
    //添加
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    resetTemp() {
      this.form = {
        name: "",
        dbtype: "",
        ipv4: "",
        port: "",
        dbname: "",
        placeholder: "", // 返回的模板
        ipv4Active: true,
        portActive: true,
        dbnameActive: true,
        p1: "",
        p2: "",
        p3: "",
        last: ""
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
    change_dbType(val) {
      this.form.p1 = "";
      this.form.p2 = "";
      this.form.p3 = "";
      this.dbTypes.forEach((item, index) => {
        if (item.key == val) {
          this.form.last = item.placeholder;
          // 控制每个input的禁用 和 清空
          if (this.form.last.indexOf("[host-name]") === -1) {
            this.form.ipv4Active = false;
          } else {
            this.form.ipv4Active = true;
          }
          if (this.form.last.indexOf("[port]") === -1) {
            this.form.portActive = false;
          } else {
            this.form.portActive = true;
          }
          if (this.form.last.indexOf("[database-name]") === -1) {
            this.form.dbnameActive = false;
          } else {
            this.form.dbnameActive = true;
          }
          // 拆分各个部分 p1 p2 p3 last
          if (this.form.ipv4Active) {
            [this.form.p1, this.form.last] = this.form.last.split(
              "[host-name]"
            );
          }
          if (this.form.portActive) {
            // this.form.last 变了
            [this.form.p2, this.form.last] = this.form.last.split("[port]");
          }
          if (this.form.dbnameActive) {
            [this.form.p3, this.form.last] = this.form.last.split(
              "[database-name]"
            );
          }
        }
      });
    },
    //编辑
    handleUpdate(row) {
      var params = {
        id: row.id
      };
      api.getObj(params).then(res => {
        this.form = res.data;
        this.form.port = this.form.port.toString();
        this.dbTypes.forEach((item, index) => {
          if (item.key == this.form.dbtype) {
            this.form.last = this.form.url;
            // 控制每个input的禁用 和 清空
            if (this.form.last.indexOf(this.form.ipv4) === -1) {
              this.form.ipv4Active = false;
            } else {
              this.form.ipv4Active = true;
            }
            if (this.form.last.indexOf(this.form.port) === -1) {
              this.form.portActive = false;
            } else {
              this.form.portActive = true;
            }
            if (this.form.last.indexOf(this.form.dbname) === -1) {
              this.form.dbnameActive = false;
            } else {
              this.form.dbnameActive = true;
            }
            // 拆分各个部分 p1 p2 p3 last
            if (this.form.ipv4Active) {
              [this.form.p1, this.form.last] = this.form.last.split(this.form.ipv4);
            }
            if (this.form.portActive) {
              // this.form.last 变了
              [this.form.p2, this.form.last] = this.form.last.split(this.form.port);
            }
            if (this.form.dbnameActive) {
              [this.form.p3, this.form.last] = this.form.last.split(this.form.dbname);
            }
          }
        });
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
      });
    },
    // 取消按钮
    cancel() {
      this.dialogFormVisible = false;
      // this.$refs[formName].resetFields();
    },
    // 确定按钮--添加
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var testparams = {
            dbtype: this.form.dbtype,
            url: this.url,
            username: this.form.username,
            password: this.form.password
          };
          api.testObj(testparams).then(res => {
            if (res.status == "200") {
              if (res.data.status == "success") {
                api.addnew(this.form).then(res => {
                  if (res.status == "200") {
                    this.dialogFormVisible = false;
                    this.getList();
                    this.$notify({
                      title: "成功",
                      message: "创建成功",
                      type: "success",
                      duration: 2000
                    });
                  } else {
                    this.$notify({
                      title: "失败",
                      message: res.message,
                      type: "error",
                      duration: 2000
                    });
                  }
                });
              } else {
                this.$notify({
                  title: "失败",
                  message: res.data.message,
                  type: "error",
                  duration: 2000
                });
              }
            } else {
              this.$notify({
                title: "失败",
                message: res.message,
                type: "error",
                duration: 2000
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 确定按钮--编辑
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var testparams = {
            dbtype: this.form.dbtype,
            url: this.url,
            username: this.form.username,
            password: this.form.password
          };
          api.testObj(testparams).then(res => {
            if (res.status == "200") {
              if (res.data.status == "success") {
                var params = {
                  id: this.form.id
                };  
                api.editObj(params, this.form).then(res => {
                  if (res.status == "200") {
                    this.dialogFormVisible = false;
                    this.getList();
                    this.$notify({
                      title: "成功",
                      message: "创建成功",
                      type: "success",
                      duration: 2000
                    });
                  } else {
                    this.$notify({
                      title: "失败",
                      message: res.message,
                      type: "error",
                      duration: 2000
                    });
                  }
                });
              } else {
                this.$notify({
                  title: "失败",
                  message: res.data.message,
                  type: "error",
                  duration: 2000
                });
              }
            } else {
              this.$notify({
                title: "失败",
                message: res.message,
                type: "error",
                duration: 2000
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 删除
    handleDelete(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var params = {
          id: row.id
        };
        api.delObj(params).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
          const index = this.tableData.indexOf(row);
          this.tableData.splice(index, 1);
        });
      });
    }
  }
};
</script>
<style>
</style>