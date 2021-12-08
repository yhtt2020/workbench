const tpls = `
<div>
  <a-row :gutter="24">
    <a-col v-for="(item,index) in Clouds" :key="index" :span="6">
      <a-card hoverable style="margin-bottom: 10px">
        <a-card-meta :title="item.name">
        </a-card-meta>
      </a-card>
    </a-col>
  </a-row>
</div>
`

Vue.component('CloudNavsComp', {
  props:{
      Clouds:[]
  },
  data () {
    return {
    }
  },
  template: tpls,
  mounted(){
  },
  methods: {

    titleClick (e) {
      console.log('titleClick', e)
    },

    onSelect (selectedKeys, info) {
      window.tab= selectedKeys[0]
      this.$emit('gettab',window.tab)
    },
    onCheck (checkedKeys, info) {
      console.log('onCheck', checkedKeys, info)
    }
  }
})
