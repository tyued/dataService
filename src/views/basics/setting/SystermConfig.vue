<template>
  <div class='sys'>
    <el-row>
      <el-form :model="form" ref="ruleFormEdit" :label-width="labelWidth" class="demo-ruleForm">
        <el-form-item v-for="(item, index) in arr" :key="index" :label="item.label" :prop="item.key" :rules="item.rules">
          <el-input v-if="item.type === 'text'" clearable maxlength="50" v-model.trim="form[item.key]" :placeholder="item.placeholder"></el-input>
          <el-input :autosize="{ minRows: 2, maxRows: 6 }" v-if="item.type === 'textarea'" clearable maxlength="1000" type="textarea" v-model.trim="form[item.key]" :placeholder="item.placeholder"></el-input>
          <template v-if="item.type === 'radio'">
            <el-radio v-for="(ra, indexRa) in item.source" :key="indexRa" v-model="form[item.key]" :label="ra.key">{{ra.value}}</el-radio>
          </template>
          <el-checkbox-group v-if="item.type === 'checkbox'" v-model="form[item.key]">
            <el-checkbox v-for="(ch, indexCh) in item.source" :key="indexCh">{{ch.value}}</el-checkbox>
          </el-checkbox-group>
          <el-select v-if="item.type === 'select'" v-model="form[item.key]" :placeholder="item.placeholder">
            <el-option v-for="(ch, indexCh) in item.source" :key="indexCh" :label="ch.value" :value="ch.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-if="rightInfoObj['sets']['sets:reset']" type="primary" @click="submitFormEdit('ruleFormEdit')">确定提交</el-button>
          <el-button @click="resetForm('ruleFormEdit')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { getSys, updateSys } from "api/setting.js";
import { mapGetters } from "vuex";
export default {
  name: "sys",
  data() {
    return {
      labelWidth: "220px",
      arr: [],
      form: {}
    };
  },
  computed: {
    ...mapGetters(["rightInfoObj"])
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getSys().then(({ status, data }) => {
        if (status === 200 && data) {
          data.rows.forEach(item => {
            item.key = item.key.replace(/\./g, "_");
            if (item.source) {
              item.source = JSON.parse(item.source);
            }
            if (item.type === "checkbox") {
              item.value = item.value.split(",");
            }
            if (item.rules) {
              item.rules = JSON.parse(item.rules);
            } else {
              item.rules = [];
            }
            this.$set(this.form, item.key, item.value);
          });
          this.arr = data.rows;
        }
      });
    },
    submitFormEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 验证通过
          this.$confirm("确定要提交表单吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              // 同意提交
              // 组装数据
              let query = this.arr.map(item => {
                let val = "";
                if (typeof this.form[item.key] === "string") {
                  val = this.form[item.key];
                } else {
                  val = this.form[item.key].join(",");
                }
                return {
                  id: item.id,
                  value: val
                };
              });
              updateSys({
                datas: query
              }).then(({ status, data }) => {
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
                message: "已取消"
              });
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$confirm("确定要重置表单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$refs[formName].resetFields();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>

<style lang='scss' scoped>
.demo-ruleForm {
  width: 70%;
  margin: 15px auto;
}
</style>