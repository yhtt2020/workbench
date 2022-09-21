<template>
<div class="box">

    <router-view></router-view>

</div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  components: {
  },
  mounted() {

  }
})
</script>

<style>
body{
  background-color: rgba(0,0,0,0);
  user-select:none;
}
.box{
  width: 400px;
  background-color: #323232;
  border-radius: 10px;
}
</style>
