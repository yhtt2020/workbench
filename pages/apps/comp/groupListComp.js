const tpls = `
<div>
  <a-row :gutter="24">
    <a-col v-for="(group,index) in myGroups" :key="index" :span="6">
      <a-card hoverable style="margin-bottom: 10px" @click.native="clickCard(group)">
        <!--                        <img-->
        <!--                          slot="cover"-->
        <!--                          alt="example"-->
        <!--                          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"-->
        <!--                        />-->
        <!--                        <template slot="actions" class="ant-card-actions">-->
        <!--                          <a-icon key="setting" title="查看导航" type="appstore" ></a-icon>-->
        <!--                          <a-icon key="power-off" type="poweroff" ></a-icon>-->
        <!--                          <a-icon key="ellipsis" type="ellipsis"></a-icon>-->
        <!--                        </template>-->
        <a-card-meta :title="group.name">
          <div slot="description">
            <a-icon :type="group.type=='public'?'global':'lock'"></a-icon>&nbsp;{{ group.type=='public'?'公开团队':'私密团队'}}
          </div>
          <a-avatar slot="avatar" shape="square" :src="group.logo"></a-avatar>
        </a-card-meta>
      </a-card>
    </a-col>
  </a-row>
</div>
`

Vue.component('GroupListComp', {
  props:{
      myGroups:[]
  },
  data () {
    return {
    }
  },
  template: tpls,
  mounted(){
  },
  methods: {
    clickCard(group) {
      this.$router.push({ name: 'groupNavs', query: {id: group.id, t: Date.now()}})
      const spliceStr = `L1-${group.id}`
      resetOtherTree('group', [spliceStr])
    }
  }
})
