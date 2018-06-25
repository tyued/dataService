import * as api from 'api/service/management'
export default {
  name: 'subcription',
  data() {
    return {
      tableDataPub: [],
      tips: '禁用成功!',
      totalItem: 0,
      currentPage: 1,
      warning: 'warning',
      success: 'success',
      danger: 'danger'
    }
  },
  created() {
    this.getSubscribeList({
      "limit": '10',
      "pageNo": '1'
    })
  },
  methods: {
    openForbidden() {
      this.$confirm('您是否要禁用改服务?', '禁用提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        // 禁用接口?????
        api.forbiddenService({
          servId: '001'
        }).then((res) => {
          this.tips = res.message
        })


        this.$message({
          type: 'success',
          message: this.tips
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    handleRedFont(data) {
      if (data.rowIndex <= 4) {
        if (data.columnIndex === 2) {
          return 'red-font'
        }
      }
    },
    getSubscribeList(params) {
      api.getSubscribeList(params).then((res) => {
        const {
          status,
          statusText,
          data
        } = res
        if (status === 200 && statusText === 'OK') {
          this.tableDataPub = data.rows
          this.totalItem = data.total
        }
      })
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.getSubscribeList({
        "limit": val,
        "pageNo": '1'
      })
    },
    handleCurrentChange(val) {
      this.getSubscribeList({
        "limit": '10',
        "pageNo": val
      })
    },
  }
}
