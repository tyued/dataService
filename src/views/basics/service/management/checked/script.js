import * as api from 'api/service/management'
export default {
  name: 'checked',
  data() {
    return {
      tableDataCheck: [],
      tips: '启用成功!',
      totalItem: 0,
      warning: 'warning',
      success: 'success',
      danger: 'danger',
      currentPage: 1
    }
  },
  created() {
    this.getSubscribeList({
      "limit": '10',
      "pageNo": '1'
    })
  },
  methods: {
    openStart(id, userId) {
      this.$confirm('您是否要启用改服务?', '启用提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        // 增加一个新的服务发布申请记录 提交服务发布申请
        api.submitService({
          servId: id,
          userId: userId
        }).then((res) => {
          const {
            data
          } = res
          if (data.status === 'success') {
            this.tips = data.message
            this.$message({
              type: 'success',
              message: this.tips
            });
          }
        })


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    openChange(id, userId) {
      console.log('change')
    },
    openCancle(id, userId) {
      console.log('cancel')
    },
    getSubscribeList(params) {
      api.getSubscribeList(params).then((res) => {
        const {
          status,
          statusText,
          data
        } = res
        if (status === 200 && statusText === 'OK') {
          this.tableDataCheck = data.rows
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
