<template>
  <div>
    <SubFolderList/>
  </div>
  <div>
    <ContentItemList/>
  </div>
</template>

<script>
import SubFolderList from './content/SubFolderList.vue'
import ContentItemList from './content/ContentItemList.vue'
export default {
  name: 'ContentList',
  props: {
    msg: String
  },
  components:{
    SubFolderList,
    ContentItemList
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
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
