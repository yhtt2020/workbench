<template>
  <div @click="setSelectedContent(content)" class="cover-wrapper" style="position: relative" :style="{width:itemSize+'px',height:itemSize+'px'}">
    <div class="type-label">图片</div>
    <a-image :style="{width:itemSize+'px',height:itemSize+'px',objectFit:'cover'}"
             :preview="false" style="background: #f1f1f1"
             class="sub-folder-cover"
             :src="content.cover">
    </a-image>

  </div>
  <div class="folder-name">{{ content.name }}.{{ content.ext }}</div>
  <div class="ext">{{ content.extData.width }} X {{ content.extData.height }}</div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'

export default {
  name: 'TypePic',
  props: {
    content: Object
  },
  computed: {
    ...mapState(
      {
        itemSize: state => state.ui.itemSize
      }
    )
  },
  methods:{
    ...mapMutations({
      setSelectedContent:'ui/setSelectedContent'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
