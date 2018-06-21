export default {
  name: 'pageManagement',
  data() {
    return {
      tableData: [{
        name: '学生基本信息查询',
        key: 'sdfsdzbzbsdafedfsdafsf',
        ishide: '已加密',
        time: '2018-01-01',
        source: '天音智慧教育'
      }, {
        name: '学生基本信息查询',
        key: 'sdfsdzbzbsdafedfsdafsf',
        ishide: '已加密',
        time: '2018-01-01',
        source: '天音智慧教育'
      }, {
        name: '学生基本信息查询',
        key: 'sdfsdzbzbsdafedfsdafsfdsfsfsfssdfsdfs',
        ishide: '已加密',
        time: '2018-01-01',
        source: '天音智慧教育'
      }, {
        name: '学生基本信息查询',
        key: 'sdfsdzbzbsdafedfsdafsf',
        ishide: '已加密',
        time: '2018-01-01',
        source: '天音智慧教育'
      }, {
        name: '学生基本信息查询',
        key: 'sdfsdzbzbsdafedfsdafsf',
        ishide: '已加密',
        time: '2018-01-01',
        source: '天音智慧教育'
      }, {
        name: '学生基本信息查询',
        key: 'sdfsdzbzbsdafedfsdafsf',
        ishide: '已加密',
        time: '2018-01-01',
        source: '天音智慧教育'
      }, {
        name: '学生基本信息查询',
        key: 'sdfsdzbzbsdafedfsdafsf',
        ishide: '已加密',
        time: '2018-01-01',
        source: '天音智慧教育'
      }, {
        name: '学生基本信息查询',
        key: 'sdfsdzbzbsdafedfsdafsf',
        ishide: '已加密',
        time: '2018-01-01',
        source: '天音智慧教育'
      }, {
        name: '学生基本信息查询',
        key: 'sdfsdzbzbsdafedfsdafsf',
        ishide: '已加密',
        time: '2018-01-01',
        source: '天音智慧教育'
      }],
      isActive: true,
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4
    }
  },
  methods: {
    formatter(row, column) {
      // return row.address;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
}
