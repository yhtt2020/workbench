<template>
    <Widget :options="options" :customIndex="customIndex" :desk="desk">
        番茄时钟1
    </Widget>
  </template>
  
  <script>
  import Widget from "../../card/Widget.vue";
  export default {
    name: "Clock",
    components:{
      Widget
    },
    props: {
      customIndex: {
        type: Number,
        default: 0
      },
      customData: {
        type: Object,
        default: () => {}
      },
      desk: {
        type: Object,
      }
    },
    data(){
      return {
        options:{
          className:'card small',
          title:'sd',
          icon:'',
          type:'timer',
          noTitle:true
        },
      }
    },
    methods: {

    },
  };
  </script>
  
  <style scoped lang="scss">

  </style>
  