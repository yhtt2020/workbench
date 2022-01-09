const tpls = `
<div>
  <a-row :gutter="24">
    <a-col v-for="(item, index) in Clouds" :key="index" :span="6">
      <a-card hoverable style="margin-bottom: 10px" @click.native="clickCard(item)">
        <a-card-meta :title="item.name">
          <a-avatar slot="avatar" shape="square" src="../../icons/svg/plan.svg"></a-avatar>
        </a-card-meta>
      </a-card>
    </a-col>
  </a-row>
</div>
`

Vue.component('CloudNavsComp', {
  props:{
    Clouds:[],

  },
  data () {
    return {
    }
  },
  template: tpls,
  mounted(){},
  methods: {
    clickCard(item) {
      if(item.groupId) {
        this.$router.push({ name: 'group', query: { groupId: item.groupId, listId: item.id, t: Date.now(), type: item.type, name: item.name, summary: item.summary } })
        const spliceStr = `L2-${item.groupId}-${item.id}`
        resetOtherTree('group', [spliceStr])
      } else {
        this.$router.push({ name: 'cloud', query: { listId: item.id, t: Date.now(), type: item.type, name: item.name, summary: item.summary } })
        resetOtherTree('cloud', [item.id])
      }
    }
  }
})
