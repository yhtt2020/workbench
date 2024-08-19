<template>
  <xt-modal v-model="visible" v-if="visible" :footer="0" @close="close" :index="index" :maskIndex="maskIndex">
    <template #header-right>
      <xt-button @click="save" w="60" h="32" radius="8" type="theme">保存</xt-button>
    </template>
    <template #header-center>
      <xt-tab v-model="currentTab" :list="TabList" style="width: 168px" class="p-1 xt-bg-t-2" v-if="!linkLimit.hideTab"
        :boxStyle="{ 'border-radius': '10px' }" :itemStyle="{ 'border-radius': '6px' }" /></template>
    <div style="height: 50vh">
      <div @click="showUpload" class="flex justify-center mb-3" style="zoom: 0.8" v-if="!linkLimit.hideIcon">
        <Icon @onEdit="showUpload" v-if="visible" v-bind="edit" :edit="true"></Icon>
      </div>
      <div style="width: 452px"  v-if="currentTab == 'attribute'">
        <xt-option-form :options="attributeOptions" :data="edit">
          <template #custom>
            <LocalApp  @onLocalApp="updateApp"></LocalApp>
          </template>
        </xt-option-form>
        <div></div>
      </div>
      <div v-else style="width: 452px">
        <div class="p-4 mb-4 xt-bg-2 rounded-xl">
          <xt-option-info title="图标和名称" info="支持自定义图标和名称。" icon="fluent:arrow-clockwise-16-regular"
            @onIconClick="refreshIcon" />
          <xt-option-icon ref="iconRef" v-model:icon="edit.src" v-model:input="edit.titleValue" />
        </div>
        <xt-option-form :options="appearanceNameOptions" :data="edit" />
        <xt-option-form :options="appearanceOptions" :data="edit" />
        <xt-option-form :options="appearanceColorOptions" :data="edit" />
      </div>
    </div>
  </xt-modal>
</template>
<script setup>
  import { storeToRefs } from "pinia";
  import {
    ref,
    computed,
    watch,
    onMounted,
    onBeforeUnmount,
    getCurrentInstance,
    defineAsyncComponent
  } from "vue";
  import { myIcons } from "../../../../store/myIcons";
  // import Icon from "../../../../components/widgets/myIcons/components/icon.vue";
  const Icon = defineAsyncComponent(() => import("../../../../components/widgets/myIcons/components/icon.vue"));
  import LocalApp from "../../../../components/widgets/myIcons/set/LocalApp.vue";
  import {
    attributeOptions,
    appearanceNameOptions,
    appearanceOptions,
    appearanceColorOptions,
  } from "../../../../components/widgets/myIcons/set/options";
  import { getHostAddress } from "../../../widgets/myIcons/edit/hooks/getHostAddress";
  const { proxy } = getCurrentInstance();

  const iconRef=ref()
  const showUpload=()=>{
    iconRef.value.showUpload()
  }
  // const iconStore = myIcons();
  // const { edit } = storeToRefs(iconStore);
  const edit = ref({
    mode:'link',
    type:'default',
    radius: 6,
    imgState:'cover',
    imgShape:'square',
    size:'mini',
  })
  const emits = defineEmits(["close", "update:modelValue", "save"]);
  const props = defineProps({
    modelValue: {},
    index: {
      default: "1000",
    },
    maskIndex: {
      default: "999",
    },
    linkLimit:{
      hideTab:false,
      hideIcon:false,
    }
  });
  const arr = ["internal", "default", "thinksky",'mob'];

  onMounted(() => {});
  /**
   * 控制弹窗显示
   */
  const visible = ref(props.modelValue);
  watch(visible, (val) => {
    emits("update:modelValue", val);
  });
  watch(()=>edit.value.value,(newV,oldV)=>{
    console.log(oldV,'newV,oldV')
    if(edit.value.value && edit.value.mode === 'link'){
      edit.value.src = getHostAddress(edit.value.value) + '/favicon.ico'
    }
  },{deep:true})
  const close = () => {
    emits("close");
  };
  /**
   * 控制tab
   */
  const currentTab = ref("attribute");
  const TabList = [
    {
      name: "属性",
      value: "attribute",
    },
    {
      name: "外观",
      value: "appearance",
    },
  ];

  /**
   * 更新本地返回的应用数据
   */
  const updateApp = (data) => {
    edit.value = {
      ...edit.value,
      titleValue: data.name,
      value: data.value,
      type: data.type,
      src: data.icon,
    };
  };

  /**
   * watch 类型切换清空数据
   */
  watch(
    () => edit.value.mode,
    (newVal, oldVal) => {
      // edit.value.value = "";
      // if (newVal == "link") {
      //
      // }
      console.log("newVal,oldVal :>> ", newVal, oldVal);
      window.$ui.confirm("是否切换模式", "切换模式将清空数据，是否继续？", {
        okText: "切换",

        ok: () => {
          edit.value.value = "";
          if (newVal == "link") {
            edit.value.type = "default";
          }
          if(newVal === 'app'){
            edit.value.src = 'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn';
          }
        },
        no: () => {
          edit.value.mode = oldVal;
        },
        type: "warning",
      });
    }
  ),
    onBeforeUnmount(() => {});

  /**
   * 恢复默认图标
   */
  const refreshIcon = () => {
    if (edit.value["defaultIcon"]) {
      edit.value.src = edit.value["defaultIcon"];
    }
  };
  /**
   * 保存数据
   */
  const save = () => {
    edit.value = {
      name: edit.value.titleValue || edit.value.name || "",
      value: edit.value.value || "",
      type: edit.value.type || "",
      icon: edit.value.src || "",
      ...edit.value,
    }
    emits("save", edit.value);
  };
  </script>

<style lang="scss" scoped></style>
