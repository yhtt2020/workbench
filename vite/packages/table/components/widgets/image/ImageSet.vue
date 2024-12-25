<template>
  <xt-modal
    v-model="visible"
    v-if="visible"
    :footer="0"
    style="width: 600px"
    @close="close"
    :index="index"
    :maskIndex="maskIndex"
  >
    <template #header-right>
      <xt-button @click="save" w="60" h="32" radius="8" type="theme"
      >保存
      </xt-button>
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
    <div style="height: 600px;width: 680px" class="flex w-full gap-2">


        <xt-scrollbar :y="true" :x="false" style="height: 100%;">
          <div class="flex flex-col image-list gap-1" style="width: 180px;min-width: 18px;">
        <div @dblclick="changeAndUpload" @click="changeIndex(index)" v-for="(img,index) in imgList" :class="{'active':activeIndex===index}">
          <img shape="square" :style="{'object-fit':img.objectFit}"
               :src="img.src"/>
          <div>{{ img.title }}</div>
        </div>
        <div @click="addNew">
          <img shape="square"
               src="https://wwp.opensns.cn/wp-content/uploads/2024/07/%E5%B9%B3%E5%8F%B0banner2024-1200x368.jpg"/>
          <div>点击添加新图片</div>
        </div>
          </div>
        </xt-scrollbar>

      <div class="flex-1 w-0">
        <xt-scrollbar :y="true" :x="false" style="height: 100%;">
          <div v-if="currentTab == 'attribute'">
            <xt-option-box v-if="form.open.type == 'systemApp'">
              <xt-text class="mb-3" center> 当前图标为「系统功能」类型。</xt-text>
            </xt-option-box>
            <template v-else>
              <xt-option-form :options="attributeOptions" :data="form">
                <template #custom>
                  <div @click="openLocalApp()">
                    <xt-option-input
                      v-model:input="form.value"
                      readonly
                      v-if="form.value"
                    />
                  </div>
                  <div v-show="!form.value">
                    <LocalApp ref="localApp" @onLocalApp="updateApp"/>
                  </div>
                </template>
                <template #mode>
                  <xt-option-tab
                    v-model="mode"
                    :list="modeList"
                    circle
                    style="height: 40px"
                  />
                </template>
                <template #displayMode>
                  <xt-option-tab
                    v-model="displayMode"
                    :list="displayModeList"
                    circle
                    style="height: 40px"
                  />
                </template>
              </xt-option-form>
            </template>
          </div>
          <div v-else style="width: 452px">
            <div @click="showUpload" class="flex justify-center mb-3" style="zoom: 0.8">
              <!--          <Icon @onEdit="showUpload"  v-bind="edit" :edit="true"></Icon>-->
            </div>
            <div class="p-4 mb-4 xt-bg-2 rounded-xl">
              <xt-option-info
                title="图标和名称"
                info="支持自定义图标和名称。"
                icon="fluent:arrow-clockwise-16-regular"
                @onIconClick="refreshIcon"
              />
              <xt-option-icon ref="iconRef"
                              v-model:icon="form.src"
                              v-model:input="form.title"
              />
            </div>
            <!-- systemApp -->
            <Form :options="appearanceNameOptions" :data="form"/>
            <Form :options="appearanceOptions" :data="form"/>
            <Form :options="appearanceColorOptions" :data="form"/>
          </div>
        </xt-scrollbar>
      </div>


    </div>
  </xt-modal>
</template>

<script setup>
import {storeToRefs} from "pinia";
import {message} from "ant-design-vue";
import {nextTick} from "vue";
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  defineAsyncComponent,
} from "vue";
import {image} from "./image";
// import Icon from "../components/icon.vue";
import LocalApp from "./LocalApp.vue";
import {
  attributeOptions,
  appearanceNameOptions,
  appearanceOptions,
  appearanceColorOptions,
} from "./options";
import {getHostAddress} from "../../../util";

// 手动引入通用表单组件
const Form = defineAsyncComponent(() =>
  import("../../../ui/new/optionForm/src/Form.vue")
);
const iconRef = ref()
const {proxy} = getCurrentInstance();
const showUpload = () => {
  iconRef.value.showUpload()
}

const activeIndex = ref(0)
const displayModeList = computed(() => {
  let res = [
    {
      name: "图标模式",
      value: "icon",
    },
    {
      name: '图片模式',
      value: 'img'
    }
  ];
  return res;
});
const modeList = computed(() => {
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
  }
  return res;
});
const {form, imgList,defaultImg} = storeToRefs(image());
const emits = defineEmits(["close", "update:modelValue", "save"]);
const props = defineProps({
  modelValue: {},
  index: {
    default: "1000",
  },
  maskIndex: {
    default: "999",
  },
});
const arr = [ "default","internal", "thinksky", "mob"];
const res = arr.includes(form.value.open.type);
form.value.type = form.value.open.type;

form.value["mode"] = res ? "link" : "app";
console.log('读入的表单', form.value)
form.value["displayMode"] = form.value["displayMode"] || 'icon'
form.value["value"] = form.value.open.value;
if (!form.value["defaultIcon"]) {
  form.value["defaultIcon"] = form.value.src;
}
console.log(form.value["mode"]);

{
}

onMounted(() => {
  form.value=imgList.value[0]
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
  form.value = {
    ...form.value,
    titleValue: data.name,
    value: data.value,
    type: data.type,
    src: data.icon,
    displayMode: data.displayMode
  };
};

const mode = ref(form.value.mode);
const displayMode = ref(form.value.displayMode)
const changeIndex = (index) => {
  activeIndex.value = index
  form.value=imgList.value[index]
}
const changeAndUpload=async (index) => {
  changeIndex(index);
  currentTab.value = 'appearance'
  await nextTick()
  showUpload()
}
/**
 * watch 类型切换清空数据
 */
watch(
  () => mode.value,
  (newVal, oldVal) => {
    console.log("newVal,oldVal :>> ", newVal, oldVal);
    window.$ui.confirm("是否切换模式", "切换模式将清空数据，是否继续？", {
      okText: "切换",

      ok: () => {
        form.value.value = "";
        if (newVal == "link") {
          form.value.type = "default";
          form.value.mode = "link";
        }
        if (newVal === "app") {
          form.value.mode = "app";
          form.value.src =
            "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn";
        }
      },
      no: () => {
        form.value.mode = oldVal;
        mode.value = oldVal;
      },
      type: "warning",
    });
  }
)
watch(
  () => displayMode.value,
  (newVal, oldVal) => {
    console.log('监听到变化', newVal)
    form.value.displayMode = newVal
  }
)
onBeforeUnmount(() => {
});

// 监听图标路径
watch(
  () => form.value.value,
  (newV, oldV) => {
    if (newV && form.value.mode == "link") {
      form.value.src = getHostAddress(form.value.value) + "/favicon.ico";
      form.value.open.value = newV;
    }
  }
);

// 监听图标打开方式
watch(
  () => form.value.type,
  (newV, oldV) => {
    form.value.open.type = newV;
    console.log(newV, form.value.open.type);
  }
);
/**
 * 恢复默认图标
 */
const refreshIcon = () => {
  if (form.value["defaultIcon"]) {
    form.value.src = form.value["defaultIcon"];
  }
};
const addNew=()=>{
  if(imgList.value.length>=9){
    return message.warn('最多不可添加超过9张图片')
  }
  imgList.value.push(defaultImg.value)
}
/**
 * 保存数据
 */
const save = () => {
  console.log(" edit.value :>> ", form.value);
  emits("save", form.value);
  // fileSetVisible
  message.success("保存成功");
  visible.value = false;
};

const localApp = ref(null);
const openLocalApp = () => {
  console.log("localApp.value :>> ", localApp.value);

  localApp.value.localAppClick();
};
</script>

<style lang="scss" scoped>
.image-list {
  & > div {
    &:hover, &.active {
      opacity: 1;
      cursor: pointer;
      border: solid 2px var(--active-bg);
    }

    opacity: 0.8;
    position: relative;
    border: solid 2px transparent;
    border-radius: 10px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100px;
      object-fit: cover;

    }

    & > div {
      background: rgba(0, 0, 0, 0.8);
      color: white;
      position: absolute;
      padding-left: 10px;
      padding-bottom: 5px;
      padding-top: 5px;
      bottom: 0;
      left: 0;
      right: 0;
      font-size: 14px;
    }

  }
}
</style>
