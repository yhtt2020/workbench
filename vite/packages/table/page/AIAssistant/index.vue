<template>
  <XtView v-model:full="isFull" :spacing="3">
    <template #left> <Tab></Tab> </template>
    <template #header> <HeaderView></HeaderView> </template>
    <MainView></MainView>
  </XtView>
</template>

<script>
import HeaderView from "./core/HeaderView.vue";
import MainView from "./core/MainView.vue";
import Tab from "./components/Tab.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../store/ai";

// import {gpt3} from "./service/api/ai"

const getGpt =async ()=>{
//let res = await gpt3()
console.log('res :>> ', res);
}
getGpt()
export default {
  computed: {
    ...mapWritableState(aiStore, ["isFull"]),
  },
  components: { Tab, HeaderView, MainView },
};
</script>

<style lang="scss" scoped></style>
