groupTpl=`
<div style="width: 100%">
<a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <template>
            <div>
              <a-page-header style="border: none;" title="团队导航"
                             sub-title="我的全部团队">
              </a-page-header>
              <br/>
            </div>
          </template>
        </a-layout-header>
        <a-layout-content>
          <template>
            <div style="background-color: white; padding: 20px;" class="group-apps">
              <groups :myGroups="myGroups"></groups>
            </div>
          </template>
        </a-layout-content>
</a-layout>
</div>
  `
require('../comp/groups.js')

const groupModel = require('../../util/model/groupModel')
module.exports = Vue.component('group-page', {
  name: 'group-page',
  template: groupTpl,
  component: {groups:"groups"},
  beforeRouteUpdate (to, from, next) {
    this.listId = to.query.listId
  },
  data () {
    return {
      myGroups:[]
    }
  },
  computed: {

  },
  mounted () {
    const that=this
    groupModel.getMyList().then(data=>{
      data.data.forEach(item=>{
        that.myGroups.push(item)
      })
    })
  },
  beforeCreate () {

  },
  methods: {


  }
})
