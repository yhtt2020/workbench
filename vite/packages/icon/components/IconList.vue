<script lang="ts">
import twoColor from '../../../public/iconLists/twoColor.json'
import fruit from '../../../public/iconLists/fruit.json'

const ipc = eval('require')('electron').ipcRenderer
export default {
  data() {
    return {
      callerId:0,
      activeKey: 'twoColor',

      iconLists: [
        twoColor,
        fruit
      ]
    }
  },
  mounted(){
     ipc.invoke('getPopCallerId').then((data)=>{
       console.log('got callerId',data)
      this.callerId=data
    })
  },
  methods: {
    selectIcon(icon,iconList) {
      let param={
        list:iconList.key,
        name:icon.name,
        alias:icon.alias
      }
      console.log(param)
      ipc.sendTo(this.callerId, 'selectedIcon',{
        icon:param
      })
    }
  }
}
</script>

<template>
  <div class="card-container">
    <a-tabs type="card" v-model:activeKey="activeKey">
      <a-tab-pane :key="iconList.key" v-for="iconList in iconLists">
        <template #tab>
        <span>
           <a-tooltip placement="bottom">
         <template #title>
            <span style="user-select: none">{{ iconList.alias }}</span>
          </template>
          <svg class="icon group-icon" aria-hidden="true">
            <use v-bind:xlink:href="'#icon-'+iconList.icon"></use>
          </svg>
           </a-tooltip>
        </span>
        </template>
        <p class="group-items" style="display: flex;flex-wrap: wrap">
          <a-tooltip placement="top" v-for="icon in iconList.list">
            <template #title>
              <span style="user-select: none">{{ icon.alias }}</span>
            </template>
        <div @click="selectIcon(icon,iconList)">
          <svg class="icon" aria-hidden="true">
            <use v-bind:xlink:href="'#icon-'+icon.name"></use>
          </svg>
        </div>
        </a-tooltip>
        </p>
      </a-tab-pane>
      <!--      <a-tab-pane key="2">-->
      <!--        <template #tab>-->
      <!--        <span>-->
      <!--          <android-outlined/>-->
      <!--        上传-->

      <!--        </span>-->
      <!--        </template>-->
      <!--        上传-->
      <!--      </a-tab-pane>-->
    </a-tabs>
  </div>
</template>
<style>

.card-container p {
  margin: 0;
}

.card-container > .ant-tabs-card .ant-tabs-content {
  height: calc(100vh - 45px);
  margin-top: -16px;
  overflow-y: auto;
  background: #fff;
}

.card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  padding: 16px;

}

.card-container > .ant-tabs-card > .ant-tabs-nav::before {
  display: none;
}

.card-container > .ant-tabs-card .ant-tabs-tab,
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}

.card-container > .ant-tabs-card .ant-tabs-tab-active,
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #fff;
  border-color: #fff;
}

#components-tabs-demo-card-top .code-box-demo {
  padding: 24px;
  overflow: hidden;
  background: #f5f5f5;
}

[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-content {
  height: 120px;
  margin-top: -8px;
}

[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}

[data-theme='dark'] #components-tabs-demo-card-top .code-box-demo {
  background: #000;
}

[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  background: #141414;
}

[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #141414;
  border-color: #141414;
}
</style>
<style scoped lang="scss">
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.group-icon {
  width: 1.6em;
  height: 1.6em;
  outline: none;
}

.group-items > div svg {
  width: 2em;
  height: 2em;
  transition: all 0.6s;
  cursor: pointer;

  &:hover {
    transform: scale(1.4);
  }
}

.group-items > div {
  padding: 5px;
}

.scrollbar {

}


</style>
