<template>
  <div  class="flex flex-col transfer"  :class="[isH5 ? 'transfer-h5' : '']" style="width: 650px;height: 534px; padding: 12px 16px !important;">
    <div class="flex w-full mb-4" style="color: var(--secondary-text);">
      <div style="width: 95%;color: var(--primary-text);" class="flex items-center justify-center font-16">选择联系人</div>
      <div class="flex items-center pointer rounded-lg active-button w-12 h-12 justify-center" @click="closeGroup" style="background: var(--secondary-bg)">
        <Icon icon="guanbi" style="font-size: 1.5em;"></Icon>
      </div>
    </div>
    <div class="flex justify-between">
      <div class="flex flex-col">
        <a-input class="rounded-lg h-11 mb-6"   @keyup.enter="handleInput"  enterkeyhint="search" placeholder="搜索" style="width: 293px;">
          <template #suffix>
            <SearchOutlined style="color:var(--secondary-text);font-size: 1.25em;" />
          </template>
        </a-input>
        <div class="flex">

        </div>
        <div class="flex flex-col">
          <span class="font-14 " style="color: var(--secondary-text);">最近聊天</span>
          <ul class="list mt-4">
            <li class="list-item" @click="selectedAll" v-if="optional.length > 1 && !isRadio">
              <i class="icon"  :class="[selectedList.length === optional.length ? 'icon-selected' : 'icon-unselected']"></i>
              <span class="all">{{ $t('component.全选') }}</span>
            </li>
          </ul>
          <!-- <ul class="list mb-4">
            <li class="list-item" @click="selectedAll" v-if="optional.length > 1 && !isRadio">
              <i
                class="icon"
                :class="[selectedList.length === optional.length ? 'icon-selected' : 'icon-unselected']"
              ></i>
              <span class="all">{{ $t('component.全选') }}</span>
            </li>
            <li class="list-item" v-for="(item, index) in list" :key="index" @click="selected(item)">
              <i
                class="icon"
                :class="[
                  item?.isDisabled && 'disabled',
                  selectedList.indexOf(item) > -1 ? 'icon-selected' : 'icon-unselected',
                ]"
              ></i>
              <template v-if="!isCustomItem">
                <img
                  class="avatar"
                  :src="item?.avatar || 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'"
                  onerror="this.src='https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'"
                />
                <span class="name">{{ item?.nick || item?.userID }}</span>
                <span v-if="item?.isDisabled">（{{ $t('component.已在群聊中') }}）</span>
              </template>
              <template v-else>
                <slot name="left" :data="item" />
              </template>
            </li>
          </ul> -->
          
          <!-- <div class="flex "> 
             
          </div> -->
          <!-- <div class="list-item" v-for="(item, index) in list" :key="index" @click="selected(item)">
            <span style="color: var(--primary-text);">{{ item }}</span>
          </div> -->
        </div>
      </div>
      <a-divider type="vertical" style="height:442px; background-color:var(--divider);" />
      <div class="flex flex-col" style="width: 293px;" >
        <!-- v-if="selectedList.length > 0 && !isH5" -->
        <p  class="font-400" style="color: var(--secondary-text);margin-bottom: 16px !important;">
          {{ $t('component.已选中') }}{{ selectedList.length }}{{ $t('component.人') }}
        </p>
        <div class="flex flex-col">
           <div class="list-item space-between" v-for="(item, index) in selectedList" :key="index">
            <!-- <span v-if="!isH5" class="font-16" style="color: var(--primary-text);">{{ item?.nick || item?.?userID }}</span> -->
           </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="transfer" :class="[isH5 ? 'transfer-h5' : '']">
    <header class="transfer-h5-header" v-if="isH5">
      <i class="icon icon-back" @click="cancel"></i>
      <span class="title">{{ title }}</span>
    </header>
    <main class="main">
      <div class="left">
        <header v-if="isSearch">
          <input
            type="text"
            @keyup.enter="handleInput"
            :placeholder="$t('component.请输入userID')"
            enterkeyhint="search"
          />
        </header>
        <main>
          <ul class="list">
            <li class="list-item" @click="selectedAll" v-if="optional.length > 1 && !isRadio">
              <i
                class="icon"
                :class="[selectedList.length === optional.length ? 'icon-selected' : 'icon-unselected']"
              ></i>
              <span class="all">{{ $t('component.全选') }}</span>
            </li>
            <li class="list-item" v-for="(item, index) in list" :key="index" @click="selected(item)">
              <i
                class="icon"
                :class="[
                  item?.isDisabled && 'disabled',
                  selectedList.indexOf(item) > -1 ? 'icon-selected' : 'icon-unselected',
                ]"
              ></i>
              <template v-if="!isCustomItem">
                <img
                  class="avatar"
                  :src="item?.avatar || 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'"
                  onerror="this.src='https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'"
                />
                <span class="name">{{ item?.nick || item?.userID }}</span>
                <span v-if="item?.isDisabled">（{{ $t('component.已在群聊中') }}）</span>
              </template>
              <template v-else>
                <slot name="left" :data="item" />
              </template>
            </li>
          </ul>
        </main>
      </div>
      <div class="right">
        <header v-if="!isH5">{{ title }}</header>
        <ul class="list" v-show="resultShow">
          <p v-if="selectedList.length > 0 && !isH5">
            {{ $t('component.已选中') }}{{ selectedList.length }}{{ $t('component.人') }}
          </p>
          <li class="list-item space-between" v-for="(item, index) in selectedList" :key="index">
            <aside>
              <template v-if="!isCustomItem">
                <img
                  class="avatar"
                  :src="item?.avatar || 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'"
                  onerror="this.src='https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'"
                />
                <span v-if="!isH5">{{ item.nick || item.userID }}</span>
              </template>
              <template v-else>
                <slot name="right" :data="item" />
              </template>
            </aside>
            <i class="icon icon-cancel" @click="selected(item)" v-if="!isH5"></i>
          </li>
        </ul>
        <footer>
          <button class="btn btn-cancel" @click="cancel">{{ $t('component.取消') }}</button>
          <button v-if="selectedList.length > 0" class="btn" @click="submit">{{ $t('component.完成') }}</button>
          <button v-else class="btn btn-no" @click="submit">{{ $t('component.完成') }}</button>
        </footer>
      </div>
    </main>
  </div> -->
</template>

<script>
import { defineComponent, reactive, watchEffect, toRefs, computed } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    selectedList: {
      type: Array,
      default: () => [],
    },
    isSearch: {
      type: Boolean,
      default: () => true,
    },
    isRadio: {
      type: Boolean,
      default: () => false,
    },
    isCustomItem: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
      default: () => '',
    },
    type: {
      type: String,
      default: () => '',
    },
    isH5: {
      type: Boolean,
      default: () => false,
    },
    resultShow: {
      type: Boolean,
      default: () => true,
    },
  },

  components:{ SearchOutlined },

  methods:{
    closeGroup(){
      this.$emit('close')
    }
  },

  setup(props, ctx) {
    const data = reactive({
      type: '',
      list: [],
      selectedList: [],
      isSearch: true,
      isCustomItem: false,
      title: '',
    });

    watchEffect(() => {
      if (props.isCustomItem) {
        for (let index = 0; index < props.list.length; index++) {
          if (props.list[index].conversationID.indexOf('@TIM#SYSTEM') > -1) {
            // eslint-disable-next-line vue/no-mutating-props
            props.list.splice(index, 1);
          }
          data.list = props.list;
        }
      } else {
        data.list = props.list;
      }
      data.selectedList = props.selectedList;
      data.isSearch = props.isSearch;
      data.isCustomItem = props.isCustomItem;
      data.title = props.title;
      data.type = props.type;
    });

    // 可选项
    const optional = computed(() => data.list.filter((item) => !item.isDisabled));

    const handleInput = (e) => {
      ctx.emit('search', e.target.value);
    };

    const selected = (item) => {
      if (item.isDisabled) {
        return;
      }
      let list = data.selectedList;
      const index = list.indexOf(item);
      if (index > -1) {
        return data.selectedList.splice(index, 1);
      }
      if (props.isRadio) {
        list = [];
      }
      list.push(item);
      data.selectedList = list;
    };

    const selectedAll = () => {
      if (data.selectedList.length === optional.value.length) {
        data.selectedList = [];
      } else {
        data.selectedList = [...optional.value];
      }
    };

    const submit = () => {
      ctx.emit('submit', data.selectedList);
    };

    const cancel = () => {
      ctx.emit('cancel');
    };

    return {
      ...toRefs(data),
      optional,
      handleInput,
      selected,
      selectedAll,
      submit,
      cancel,
    };
  },
});
</script>

<style lang="scss" scoped src="./style/transfer.scss"></style>
<style lang="scss" scoped>
.font-16{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500;
}

.active-button{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}

.font-400{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
}

:deep(.ant-input-affix-wrapper){
  border: 1px solid var(--divider) !important;
  background: var(--secondary-bg) !important;
}

.font-14{
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
}
</style>