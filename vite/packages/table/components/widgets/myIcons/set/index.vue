<template>
  <xt-modal style="width:500px"
            v-model="visible"
            v-if="visible"
            :footer="0"
            @close="close"
            :index="index"
            :maskIndex="maskIndex"
  >
    <template #header-right>
      <xt-button @click="save" w="60" h="32" radius="8" type="theme"
      >保存
      </xt-button
      >
    </template>

    <template #header-center>
      <xt-tab
        v-model="currentTab"
        :list="TabList"
        style="width: 168px"
        class="p-1 xt-bg-t-2"
        :boxStyle="{ 'border-radius': '10px' }"
        :itemStyle="{ 'border-radius': '6px' }"
      />
    </template>
    <div style="height: 50vh">
      <div style="width: 452px" v-if="currentTab == 'attribute'">
        <!--   系统类的app则不允许修改      -->
        <template v-if="['systemApp','lightApp','coolApp'].includes(edit.open.type) ">
          <xt-option-box>
            <xt-text class="mb-3" center> 当前图标为「系统功能」类型。</xt-text>
          </xt-option-box>
          <SelectHome v-if="edit.open.value === 'home'" :editItem="edit.open"></SelectHome>
        </template>

        <template v-else>
          <!--    图标、app、快捷指令走这里       -->
          <xt-option-form :options="attributeOptions" :data="edit">
            <template #custom>
              <div @click="openLocalApp()">
                <xt-option-input
                  v-model:input="edit.open.value"
                  readonly
                  v-if="edit.open.value"
                />
              </div>
              <div v-show="!edit.open.value">
                <LocalApp ref="localApp" @onLocalApp="updateApp"/>
              </div>
            </template>
            <template #type>
              <!--此处为自定义表单部分              -->
              <xt-option-tab
                v-model="type"
                :list="typeList"
                circle
                style="height: 40px"
              />
            </template>
          </xt-option-form>
        </template>
      </div>
      <div v-else style="width: 452px">
        <div @click="showUpload" class="flex justify-center mb-3" style="zoom: 0.8">
          <Icon @onEdit="showUpload" v-bind="edit" :edit="true"></Icon>
        </div>
        <div class="p-4 mb-4 xt-bg-2 rounded-xl">
          <xt-option-info
            title="图标和名称"
            info="支持自定义图标和名称。"
            icon="fluent:arrow-clockwise-16-regular"
            @onIconClick="refreshIcon"
          />
          <xt-option-icon ref="iconRef"
                          v-model:icon="edit.src"
                          v-model:input="edit.titleValue"
          />
        </div>
        <!-- systemApp -->
        <Form :options="appearanceNameOptions" :data="edit"/>
        <Form :options="appearanceOptions" :data="edit"/>
        <Form :options="appearanceColorOptions" :data="edit"/>
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import {storeToRefs} from "pinia";
import {message} from "ant-design-vue";

import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  defineAsyncComponent,
} from "vue";
import {myIcons} from "../../../../store/myIcons";
import Icon from "../components/icon.vue";
import LocalApp from "./LocalApp.vue";
import {
  attributeOptions,
  appearanceNameOptions,
  appearanceOptions,
  appearanceColorOptions,
} from "./options";
import {getHostAddress} from "../edit/hooks/getHostAddress";
import SelectHome from "../../../desk/navigationBar/components/EditIcon/Children/SelectHome.vue";

// 手动引入通用表单组件
const Form = defineAsyncComponent(() =>
  import("../../../../ui/new/optionForm/src/Form.vue")
);
const iconRef = ref()
const {proxy} = getCurrentInstance();
const showUpload = () => {
  iconRef.value.showUpload()
}
const typeList = computed(() => {
  let res = [
    {
      name: "网站链接",
      value: "link",
    },
  ];
  if (window.$usePlat("client")) {
    res.push({
      name: "系统程序或文件",
      value: "app",
    });
    res.push({
      name: "快捷指令",
      value: "action",
    });
  }
  return res;
});
const iconStore = myIcons();
const {edit} = storeToRefs(iconStore);
const emits = defineEmits(["close", "update:modelValue", "save"]);
const props = defineProps({
  modelValue: {},
  index: {
    default: "1010",
  },
  maskIndex: {
    default: "888",
  },
});
const arr = ["default", "internal", "thinksky", "mob"];


onMounted(() => {
  //edit.value.type = edit.value.open.type;
  let tabMap = {
    'tableApp': 'app',
    'default': 'link'
  }
  edit.value['type']=edit.value['type']||'link'
  edit.value['mode']=edit.value['open']['mode']//因为存储在根节点上了，所以开始的时候要提取到上级
  type.value = edit.value['type'] || 'link'
  edit.value["value"] = edit.value.open.value;
  if (!edit.value["defaultIcon"]) {
    edit.value["defaultIcon"] = edit.value.src;
  }
  console.log('读取到当前的eidt', edit.value)
});
/**
 * 控制弹窗显示
 */
const visible = ref(props.modelValue);
watch(visible, (val) => {
  emits("update:modelValue", val);
});
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
  console.log('修改了app',data)
  edit.value = {
    ...edit.value,
    titleValue: data.name,
    value: data.value,
    type: 'app',
    src: data.icon,
  };
  edit.value.open.value=data.value;
};

const type = ref(edit.value.mode);
/**
 * watch 类型切换清空数据
 */
watch(
  () => type.value,
  (newVal, oldVal) => {
    if (!oldVal) return
    console.log("newVal,oldVal :>> ", newVal, oldVal);
    window.$ui.confirm("是否切换模式", "切换模式将清空数据，是否继续？", {
      okText: "切换",

      ok: () => {
        type.value = newVal;
        if (newVal == "link") {
          edit.value.open.mode = "default";
          edit.value.value=''
          edit.value.open.value=''
        }
        if (newVal === "app") {
          edit.value.open.mode = "app";
          edit.value.value=''
          edit.value.open.value=''
          edit.value.src =
            "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn";
        }
        if (newVal === "action") {
          edit.value.open.mode = "action";
          edit.value.value=''
          edit.value.open.value=''
          edit.value.actions = []
        }
        edit.value.type=newVal//同步编辑体
      },
      no: () => {
        edit.value.type = oldVal;
        type.value = oldVal;
      },
      type: "warning",
    });
  },
  {
    immediate: false
  }
)
onBeforeUnmount(() => {
});

// 监听图标路径
watch(
  () => edit.value.value,
  (newV, oldV) => {
    if (newV && edit.value.type == "link") {
      edit.value.src = getHostAddress(edit.value.value) + "/favicon.ico";
      edit.value.open.value = newV;
    }
  }
);

// 监听图标打开方式
watch(
  () => edit.value.mode,
  (newV, oldV) => {
    edit.value.open.mode = newV;
    console.log('更新mode',newV, edit.value.open.mode);
  }
);
watch(
  () => edit.value.open.home,
  (newV, oldV) => {
    if(!newV) return
    edit.value.titleValue = newV.name
  },
  {
    deep:true
  }
);
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

  edit.value.type=type.value
  console.log("save edit.value :>> ", edit.value);
  emits("save", {value: edit.value});
  // fileSetVisible
  message.success("保存成功");
};

const localApp = ref(null);
const openLocalApp = () => {
  console.log("localApp.value :>> ", localApp.value);

  localApp.value.localAppClick();
};
</script>

<style lang="scss" scoped></style>
