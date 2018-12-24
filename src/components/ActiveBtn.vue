<template>
  <div class="btnbox">
    <el-button @click="handleLight(item, index)" v-for="(item, index) in btnArr" :key="index" :class="{[activeName]: index == act}" :type="type" :icon="item.icon" :size="size">{{item.name}}</el-button>
  </div>
</template>
<script>
  export default {
    props: ['btnArr', 'activeIndex', 'activeName', 'size', 'type'],
    name: 'activeBtn',
    created() {
      this.act = this.activeIndex
    },
    data() {
      return {
        act: ''
      }
    },
    methods: {
      handleLight(item, index) {
        this.act = index
        this.$emit('handleClick', item)
      }
    }
  }
</script>
<style lang='scss' scoped>
  .act1 {
    color: #fff;
    background-color: #409EFF;
  }
  .act2 {
    color: yellow;
    background-color: green;
  }
</style>

