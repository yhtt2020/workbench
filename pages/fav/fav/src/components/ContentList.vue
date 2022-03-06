<template>
  <div>
    <SubFolderList/>
  </div>
  <div>
    <h3>内容(23)</h3>
    <div>

    </div>
  </div>
</template>

<script>
import SubFolderList from './content/SubFolderList.vue'
export default {
  name: 'ContentList',
  props: {
    msg: String
  },
  components:{
    SubFolderList
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
