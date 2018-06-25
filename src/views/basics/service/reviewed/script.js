export default {
  name: "pageReviewed",
  data() {
    return {
      dialogVisible1: false,
      dialogVisible2: false,
      value1: true,
      value2: true,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      total: null,
      tableData: [{
        date: "学生信息查询",
        name: "天音智慧校园",
        sfgk: "是",
        bb: "V1.1",
        zht: "更新",
        zhtgs: "success"
      },
      {
        date: "学生信息查询",
        name: "天音智慧校园",
        sfgk: "是",
        bb: "V1.1",
        zht: "新增",
        zhtgs: "warning"
      },
      {
        date: "学生信息查询",
        name: "天音智慧校园",
        sfgk: "是",
        bb: "V1.1",
        zht: "禁用",
        zhtgs: "danger"
      },
      {
        date: "学生信息查询",
        name: "天音智慧校园",
        sfgk: "是",
        bb: "V1.1",
        zht: "更新",
        zhtgs: "success"
      },
      {
        date: "学生信息查询",
        name: "天音智慧校园",
        sfgk: "是",
        bb: "V1.1",
        zht: "更新",
        zhtgs: "success"
      }
    ],
      requestTableData: [],
      responseTableData: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.listLoading = false;
    },
    //分页
    handleSizeChange() {},
    handleCurrentChange() {},
    // handleClose1(done) {
    //   this.$confirm("确认关闭？")
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // },
    // handleClose2() {
    //     this.$confirm("确认关闭？")
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // }
  }
};
