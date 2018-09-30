<template>
  <div class="systerm">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "systerm",
  data() {
    return {};
  }
};
</script>
