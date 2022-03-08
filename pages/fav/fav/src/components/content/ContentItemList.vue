<template>
  <div class="hello">
    <h3 style="margin-bottom:10px;margin-top: 20px">内容（{{ contents.length }}）</h3>
    <div style="min-height:150px">
      <div class="sub-folder-wrapper" :class="{'selected':selectedKey===content}" @click="selectedKey=content" :style="{width:itemSize+'px',height:itemSize+50+'px'}"  v-for="content in contentsOrderByCreateTime" v-bind:key="content">
        <TypePwd v-if="content.type==='pwd'" v-bind:content="content"/>
        <TypePic v-if="content.type==='pic'" v-bind:content="content"/>
      </div>
      </div>
  </div>
</template>

<script>
import { mapState,mapGetters } from 'vuex'
import TypePwd from '@/components/content/type/TypePwd'
import TypePic from '@/components/content/type/TypePic'
export default {
  name: 'ContentItemList',
  components: { TypePwd ,TypePic},
  props: {
    msg: String
  },
  data(){
    return {
      selectedKey:null
    }
  },
  computed:{
    ...mapState(
      {
        subFolders:state=>state.subFolder.subFolders,
        itemSize:state=>state.ui.itemSize,
        contents:state=>state.content.contents
      }
    ),
    ...mapGetters('content',
      ['contentsOrderByCreateTime']
    )
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
