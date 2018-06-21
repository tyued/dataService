import * as http from 'api/service/studentinfo'
import axios from 'axios'
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
      tableData: [{
        name: 'Key',
        require: '是',
        type: 'String',
        state: '申请调用的Key'
      }, {
        name: 'Key',
        require: '是',
        type: 'String',
        state: '申请调用的Key'
      }, {
        name: 'Key',
        require: '是',
        type: 'String',
        state: '申请调用的Key'
      }, {
        name: 'Key',
        require: '是',
        type: 'String',
        state: '申请调用的Key'
      }],
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

    // this.getToken();
  },
  mounted() {
    
  },
  methods: {
    // 获取token请求
    async getToken() {
      const params = {}
      const res = await http.getToken(params)
      console.log(res)
    },
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
    }
  }
};
