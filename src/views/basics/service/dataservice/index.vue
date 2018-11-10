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
            <el-button v-if="rightInfoObj['serv-ds']['serv-ds:eidt']" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="rightInfoObj['serv-ds']['serv-ds:del']" size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </el-card>
    <el-dialog center :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="670px">
      <el-form :model="form" ref="form" label-width="122px">
        <el-form-item label="数据源名称" prop="name" :rules="[{ required: true, message: '数据源名称不能为空'},{ max: 100, message: '100个字符以内', trigger: 'blur' }]">
          <el-input v-model.trim="form.name"></el-input>
        </el-form-item>
        <el-form-item label="数据库类型" prop="dbtype" :rules="[{ required: true, message: '数据库类型不能为空'}]">
          <el-select v-model="form.dbtype" placeholder="请数据库类型" @change="change_dbType">
            <el-option v-for='(item,index) in dbTypes' v-bind:key="index" :label="item.vendor" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据库IP" prop="ipv4" :rules="[{ required: true, message: '数据库IP不能为空'},{ max: 255, message: '255个字符以内', trigger: 'blur' }]">
          <el-input :value="form.ipv4" @input="handleReplace($event, 'ipv4')"></el-input>
        </el-form-item>
        <el-form-item label="数据库访问端口" prop="port" :rules="[{ required: true, message: '数据库访问端口不能为空'},{ max: 10, message: '10个字符以内'}]">
          <el-input :value="form.port" @input="handleReplace($event, 'port')"></el-input>
        </el-form-item>
        <el-form-item label="数据库实例名称" prop="dbname" :rules="[{ required: true, message: '数据库实例名称不能为空'},{ max: 50, message: '50个字符以内', trigger: 'blur' }]">
          <el-input :value="form.dbname" @input="handleReplace($event, 'dbname')"></el-input>
        </el-form-item>
        <el-form-item label="连接字符串" class="linkBlock">
          <el-input type="textarea" :autosize="true" :value="form.url" disabled style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username" :rules="[{ required: true, message: '用户名不能为空'},{ max: 50, message: '50个字符以内', trigger: 'blur' }]">
          <el-input v-model.trim="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '密码不能为空'},{ max: 50, message: '50个字符以内', trigger: 'blur' }]">
          <el-input v-model.trim="form.password"></el-input>
        </el-form-item>
        <el-form-item label="数据库摘要" prop="desc" :rules="[{ required: true, message: '数据库摘要不能为空'}]">
          <el-input :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" v-model.trim="form.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" :disabled="changeSure">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" :disabled="changeSure">确 定</el-button>
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
    ...mapGetters(["rightInfoObj"])
  },
  data() {
    return {
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
        placeholder: "",
        ipv4: "[host-name]",
        port: "[port]",
        dbname: "[database-name]",
        url: ""
      },
      changeSure: false,

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
      },
      url: ""
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
      editorInstance.addListener("contentChange", () => {
        console.log(editorInstance.getContent());
      });
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
        placeholder: "",
        url: "",
        ipv4: "",
        port: "",
        dbname: ""
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      this.changeSure = false;
    },
    change_dbType(val) {
      var that = this;
      this.dbTypes.forEach(function(item, index) {
        if (item.key == val) {
          that.form.placeholder = item.placeholder;
          var urlTmp = item.placeholder;
          if (that.form.ipv4) {
            urlTmp = urlTmp.replace("[host-name]", that.form.ipv4);
          }
          if (that.form.port) {
            urlTmp = urlTmp.replace("[port]", that.form.port);
          }
          if (that.form.dbname) {
            urlTmp = urlTmp.replace("[database-name]", that.form.dbname);
          }
          that.form.url = urlTmp;
        }
      });
    },
    //编辑
    handleUpdate(row) {
      this.changeSure = false;
      var params = {
        id: row.id
      };
      api.getObj(params).then(res => {
        this.form = res.data;
        this.form.port = this.form.port.toString();
        var that = this;
        this.dbTypes.forEach((item, index) => {
          if (item.key == that.form.dbtype) {
            // this.beforeName = item.placeholder.split(item.key)[0]
            that.form.placeholder = item.placeholder;
          }
        });
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
      });
    },
    // 取消按钮
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    // 确定按钮--添加
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeSure = true;
          //this.form.url = this.form.placeholder;
          var testparams = {
            dbtype: this.form.dbtype,
            url: this.form.url,
            username: this.form.username,
            password: this.form.password
          };
          api.testObj(testparams).then(res => {
            if (res.status == "200") {
              if (res.data.status == "success") {
                var that = this;
                var params = {
                  id: this.form.id
                };
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
          var that = this;
          setTimeout(function() {
            that.changeSure = false;
          }, 1500);
        } else {
          this.$notify({
            title: "失败",
            message: "还有未填项",
            type: "error",
            duration: 2000
          });
          return false;
        }
      });
    },
    // 确定按钮--编辑
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeSure = true;
          this.form.url = this.form.placeholder;
          var testparams = {
            dbtype: this.form.dbtype,
            url: this.form.url,
            username: this.form.username,
            password: this.form.password
          };
          api.testObj(testparams).then(res => {
            if (res.status == "200") {
              if (res.data.status == "success") {
                var that = this;
                var params = {
                  id: this.form.id
                };
                api.editObj(params, this.form).then(res => {
                  if (res.status == "200") {
                    that.dialogFormVisible = false;
                    that.getList();
                    that.$notify({
                      title: "成功",
                      message: "创建成功",
                      type: "success",
                      duration: 2000
                    });
                  } else {
                    that.$notify({
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

          var that = this;
          setTimeout(function() {
            that.changeSure = false;
          }, 1500);
        } else {
          this.$notify({
            title: "失败",
            message: "还有未填项",
            type: "error",
            duration: 2000
          });
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
    },
    handleReplace(e, type) {
      e = e.trim();
      // 赋值
      if (this.form.placeholder) {
        switch (type) {
          case "ipv4":
            if (e) {
              this.form.url = this.form.url.replace(this.form.ipv4, e);
              this.form.ipv4 = e;
            } else {
              this.form.ipv4 = "[host-name]";
            }
            break;
          case "port":
            if (e) {
              this.form.url = this.form.url.replace(this.form.port, e);
              this.form.port = e;
            } else {
              this.form.port = "[port]";
            }
            break;
          case "dbname":
            if (e) {
              this.form.url = this.form.url.replace(this.form.dbname, e);
              this.form.dbname = e;
            } else {
              this.form.dbname = "[database-name]";
            }
            break;
        }
      } else {
        switch (type) {
          case "ipv4":
            if (e) {
              this.form.ipv4 = e;
            } else {
              this.form.ipv4 = "[host-name]";
            }
            break;
          case "port":
            if (e) {
              this.form.port = e;
            } else {
              this.form.port = "[port]";
            }
            break;
          case "dbname":
            if (e) {
              this.form.dbname = e;
            } else {
              this.form.dbname = "[database-name]";
            }
            break;
        }
      }
    }
  }
};
</script>
<style>
</style>