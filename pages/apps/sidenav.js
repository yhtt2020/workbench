const tpl = `
<div>
<div class="logo">
<img src="../../icons/apps.svg" style="width: 1.2em">
网址导航
</div>
      <template >
        <a-tree style="padding: 10px" :tree-data="treeData" :block-node="true" show-icon default-expand-all :default-selected-keys="['local']"
        @select="onSelect"
        >
          <a-icon slot="user" type="user" > </a-icon>
          <a-icon slot="appstore" type="appstore" > </a-icon>
          <a-icon slot="meh" type="smile-o"> </a-icon>
          <a-icon slot="global" type="global"> </a-icon>
          <a-icon slot="team" type="team"> </a-icon>
          <a-icon slot="lock" type="lock"> </a-icon>
          <a-icon slot="star" type="star"> </a-icon>
          <a-icon slot="cloud" type="cloud"> </a-icon>


          <template slot="custom" slot-scope="{ selected }">
            <a-icon :type="selected ? 'frown' : 'frown-o'" ></a-icon>
          </template>
          <template #title="{ key: treeKey, title }">
      <a-dropdown :trigger="['contextmenu']">
        <span>{{ title }}</span>
        <template #overlay>
          <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
            <a-menu-item key="1">创建列表</a-menu-item>
            <a-menu-item key="2">复制列表</a-menu-item>
            <a-menu-item key="3">重命名列表</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
        </a-tree>
      </template>
</div>

`

const treeData = [
  {
    title: '本地导航',
    key: 'myapp',
    slots: {
      icon: 'star',
    },
    children: [
      {
        title: '开发专用'
      },
      {
        title: '视频剪辑'
      },
      {
        title: '12大框架'
      }
    ]
  }, {
    title: '个人云导航',
    key: 'cloud',
    slots: {
      icon: 'cloud',
    },
    children: [
      {
        title: '开发专用'
      },
      {
        title: '视频剪辑'
      },
      {
        title: '12大框架'
      }
    ]
  }, {
    title: '网络导航',
    key: 'appstore',
    slots: {
      icon: 'appstore',
    },
    children: [
      { title: '程序员', key: 'developer' },
      { title: '视频后期', key: 'video' },
      { title: '前端', key: 'frontend' },
    ],
  }, {
    title: '团队导航',
    key: 'group',
    slots: {
      icon: 'team',
    },
    children: [
          { title: '人人都是产品经理', key: '3' ,slots: { icon: 'global' }},
          { title: '少数派Plus', key: '4' ,slots: { icon: 'global' }},
          { title: '产研部', key: '1000' ,slots: { icon: 'lock' }},
          { title: '销售部', key: '41000',slots: { icon: 'lock' } },
    ],
  },
]
Vue.component('sidenav', {
  name: 'sidenav',
  data () {
    return {
      current: ['myapp'],
      treeData
    }
  },
  template: tpl,
  methods: {

    titleClick (e) {
      console.log('titleClick', e)
    },

    onSelect (selectedKeys, info) {
      window.tab = selectedKeys[0]
      this.$emit('gettab', window.tab)
    },
    onCheck (checkedKeys, info) {
      console.log('onCheck', checkedKeys, info)
    }
  }
})
