const tpls = `
<div>
<a-row :gutter="24">
                    <a-col v-for="group in groups" :span="6" >
                      <a-card   hoverable style="margin-bottom: 10px" >
<!--                        <img-->
<!--                          slot="cover"-->
<!--                          alt="example"-->
<!--                          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"-->
<!--                        />-->
                        <template slot="actions" class="ant-card-actions">
                          <a-icon key="setting" title="查看导航" type="appstore" ></a-icon>
                          <a-icon key="power-off" type="poweroff" ></a-icon>
                          <a-icon key="ellipsis" type="ellipsis"></a-icon>
                        </template>
                        <a-card-meta :title="group.name" >
                         <div slot="description">
                          <a-icon :type="group.type=='public'?'global':'lock'"></a-icon>&nbsp;{{ group.type=='public'?'公开团队':'私密团队'}}&nbsp;-&nbsp;{{group.user_nickname==null?'':group.user_nickname}}
                        </div>
                          <a-avatar
                            slot="avatar"
                            shape="square"
                            :src="group.logo"
                          ></a-avatar>
                        </a-card-meta>
                      </a-card>
                    </a-col>
</a-row>

</div>


  `
const groups=require('./groups.json')

Vue.component('groups', {
  name: 'groups',
  props:{

  },
  data () {
    return {
      groups
    }
  },
  template: tpls,
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
