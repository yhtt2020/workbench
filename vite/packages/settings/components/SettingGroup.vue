<template>
  <div class="settings-container" v-for="itemGroup in itemGroups">
    <h3>{{itemGroup.title}}</h3>
    <div v-if="itemGroup.tip" class="item-group-tip">{{itemGroup.tip}}</div>
    <img v-if="itemGroup.img" style="width: 220px;margin-bottom: 10px" :src="itemGroup.img"/>
    <div v-for="item in itemGroup.items">
      <span class="item-title">- {{item.title}}：</span> &nbsp;&nbsp;
      <span v-if="item.type==='switch'">
                <a-switch style="margin-bottom: 4px" @change="item.onChange($event)" size="small" v-model:checked="item.value" />
              </span>
      <span v-if="item.type==='number'">
                <a-input-number @change="item.onChange" style="width: 50px;text-align: center" size="small" id="inputNumber" v-model:value="item.value" :min="0" :max="item.max" /> {{item.unit}}
              </span>
      <span v-if="item.type==='button'">
               <a-button :type="item.buttonType" @click="item.click" :size="item.buttonSize">{{item.title}}</a-button>
              </span>
      <p class="tip"><exclamation-circle-outlined /> {{item.tip}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingGroup',
  props:['itemGroups'],
  mounted () {

  }
}
</script>

<style scoped>

</style>
