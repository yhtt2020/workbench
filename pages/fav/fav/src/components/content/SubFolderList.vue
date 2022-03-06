<template>
  <div>
    <h3 style="margin-bottom:10px">文件夹（{{ subFolders.length }}）

    </h3>
    <div style="min-height:150px">
      <div class="sub-folder-wrapper" :style="{width:itemSize+'px',height:itemSize+50+'px'}" style="" v-for="folder in subFolders" v-bind:key="folder">
        <div class="cover-wrapper" style="position: relative" :style="{width:itemSize+'px',height:itemSize+'px'}">
          <div class="sub-folder-frame" :style="{width:itemSize+'px',height:itemSize+'px'}" ></div>
          <a-image :style="{width:itemSize+'px',height:itemSize+'px'}" :preview="false"  class="sub-folder-cover"  :src="folder.cover">
          </a-image>
        </div>
        <div class="folder-name">{{folder.name}}</div>
        <div class="inner-content-count">{{folder.contentsCount}} 内容</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SubFolderList',
  props: {
    msg: String
  },
  computed:{
    ...mapState([
      'subFolders',
      'itemSize'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
