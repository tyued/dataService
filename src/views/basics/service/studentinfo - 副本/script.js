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
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        }],
        desc: [{
          required: true,
          message: '请填写评论',
          trigger: 'blur'
        }]
      },
      isBottom: false,
      isMiddle: true,
      isP1: true,
      isP2: false
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
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
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
    }
  }
};
