import * as api from 'api/service/studentinfo'
export default {
  data() {
    return {
      navData: {
        wifi: 12321,
        heart: 12321,
        message: 12321,
        good: 5
      },
      value1: 3.7,
      value2: 5,
      value3: 4,
      centerDialogVisible: false,
      tabPosition: 'left',
      requestTableData: [],
      responseTableData: [],
      // ruleForm: {
      //   name: '',
      //   region: '',
      //   date1: '',
      //   date2: '',
      //   delivery: false,
      //   type: [],
      //   resource: '',
      //   desc: ''
      // },
      rules: {
        text: [{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        }],
        title: [{
          required: true,
          message: '请填写评论',
          trigger: 'blur'
        }]
      },
      isBottom: false,
      isMiddle: true,
      isP1: true,
      isP2: false,
      submitParams: {
        userId: '001',
        servId: '1',
        text: '',
        title: '',
        rank: 5
      },
      accessList: []
    };
  },
  created() {
    this.getParamForms()
    this.getRelationForms()
  },
  mounted() {

  },
  methods: {

    handledia() {
      console.log(11)
    },
    submitForm(formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {

          // 增加一个新的服务评价信息
          api.submitAssess(this.submitParams).then((res) => {
            if (res.status === 200) {
              this.$message({
                message: res.data.message,
                type: 'success'
              });
              this.centerDialogVisible = false
            }
          })

        } else {
          this.$message.error('提交失败');
          this.centerDialogVisible = false
          return false;
        }
      });
    },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // },
    handleCommand(command) {
      this.$message('click on item ' + command);
    },
    getParamForms() {
      api.getParamForms().then((res) => {
        this.requestTableData = res.data
      })
    },
    getRelationForms() {
      api.getRelationForms().then((res) => {
        this.responseTableData = res.data
      })
    },
    handleList() {
      this.isBottom = true
      this.isMiddle = false
      // 增加一个新的服务评价信息
      api.getAssessList({
        servId: this.submitParams.servId
      }).then((res) => {
        if (res.status === 200) {
          this.accessList = res.data.rows
        }
      })
    }
  }
};
