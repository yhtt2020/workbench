<template>
  <div class="cover-wrapper" style="position: relative" :style="{width:itemSize+'px',height:itemSize+'px'}">
    <div class="type-label">图片</div>
    <a-image :style="{width:itemSize+'px',height:itemSize+'px',objectFit:'cover'}"
              style="background: #f1f1f1"
             class="sub-folder-cover"
             :src="content.cover">
    </a-image>

  </div>
  <div class="folder-name">{{content.name}}.{{content.ext}}</div>
  <div class="ext">{{ content.extData.width}} X {{content.extData.height}}</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TypePic',
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
