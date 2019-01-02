<template>
  <div class="btnbox">
    <el-button
      @click="handleLight(item, index)"
      v-for="(item, index) in btnArr"
      :key="index"
      :class="{[activeName]: index == act}"
      :type="type"
      :icon="item.icon"
      :size="size"
    >{{item.name}}</el-button>
  </div>
</template>
<script>
export default {
  props: {
    btnArr: {
      type: Array,
      default: []
    },
    activeIndex: {},
    activeName: {
      type: String,
      default: "act1"
    },
    size: {
      type: String,
      default: "small"
    },
    type: {
      type: String
    },
    cancel: {}
  },
  name: "activeBtn",
  created() {
    this.act = this.activeIndex;
  },
  watch: {
    cancel() {
      // 控制取消高亮
      this.act = -1;
    }
  },
  data() {
    return {
      act: ""
    };
  },
  methods: {
    handleLight(item, index) {
      this.act = index;
      this.$emit("handleClick", item);
    }
  }
};
</script>
<style lang='scss' scoped>
.btnbox {
  display: inline-block;
}
.act1 {
  color: #fff;
  background-color: #409eff;
}
.act2 {
  color: yellow;
  background-color: green;
}
</style>

