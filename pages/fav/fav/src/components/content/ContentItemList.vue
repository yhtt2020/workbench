<template>
  <div class="hello">
    <h3 style="margin-bottom:10px;margin-top: 20px">内容（{{ contents.length }}）</h3>
    <div style="min-height:150px">
      <div class="sub-folder-wrapper" :style="{width:itemSize+'px',height:itemSize+50+'px'}"  v-for="content in contents" v-bind:key="content">
        <TypePwd v-if="content.type==='pwd'" v-bind:content="content"/>
        <TypePic v-if="content.type==='pic'" v-bind:content="content"/>
      </div>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TypePwd from '@/components/content/type/TypePwd'
import TypePic from '@/components/content/type/TypePic'
export default {
  name: 'ContentItemList',
  components: { TypePwd ,TypePic},
  props: {
    msg: String
  },
  computed:{
    ...mapState([
      'subFolders',
      'itemSize',
      'contents'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
