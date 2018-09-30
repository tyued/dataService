<template>
  <el-pagination
    class="page-bar"
    @size-change="handleSizeChange"
    @current-change="handlePage"
    :current-page="currentpage"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="10"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</template>
<script>
  export default {
    name: 'PageBar',
    props: ['total', 'currentpage'],
    methods: {
      handlePage(number) {
        this.$emit('handlePage', number)
      },
      handleSizeChange(number) {
        this.$emit('handlePageSize', number)
      }
    }
  }
</script>
<style scoped>
.page-bar {
  margin-top: 10px;
}
</style>


