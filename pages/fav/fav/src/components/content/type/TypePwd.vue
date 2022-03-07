<template>
  <div class="cover-wrapper" style="position: relative" :style="{width:itemSize+'px',height:itemSize+'px'}">
    <div class="type-label">密码</div>
    <a-image :style="{width:itemSize+'px',height:itemSize+'px'}"
             :preview="false" style="background: #f1f1f1"
             class="sub-folder-cover"
             src="./img/type/pwd.svg">
    </a-image>

  </div>
  <div class="folder-name">{{content.name}}<br>{{content.extData.username}}</div>
  <div class="inner-content-count">{{content.extData.domain}}</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TypePwd',
  props: {
    content: Object
  },
  computed:{
    ...mapState(['itemSize'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
