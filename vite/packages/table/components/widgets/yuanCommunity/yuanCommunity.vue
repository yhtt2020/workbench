<template>
    <div>
        <xt-container
            @leftClick="settingVisible = true"
            v-model:customSize="customData.customSize"
            :header="header"
            :desk="desk"
            :options="options"
            :customIndex="customIndex"
            :envLimit="['guest', 'offline', 'single']"
            :menuList="menuList"
            ref="cardSlot"
            :env="env"
            :sizeList="sizeList"
            :customData="customData"
            @delete="deleteCard">
            <div v-if="showForumList.length > 0" class="flex flex-col flex-1 " style="height: calc(100%);">
                <xt-option-tab
                    v-if="showForumList.length > 1"
                    :list="showForumList"
                    :circle="true"
                    v-model="defaultForum"
                    style="height: 40px;">
                </xt-option-tab>
            <div  v-if="showForumPost.length > 0" class="flex flex-col flex-1 w-full h-0">
                <vue-custom-scrollbar ref="threadListRef"  :settings="outerSettings"
                    style="overflow: hidden;width: 100%;" class="flex-1">
                    <div v-if="isLoading">
                        <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 25%" />
                    </div>
                    <div class="content" v-else>
                        <div v-for="(item, index) in showForumPost" style="display: flex;" class="">
                            <div class="item" @click="showDetail(item)">
                                <communItem :key="index" :showForumPost="item" />
                            </div>
                        </div>
                        <!-- <div class="flex items-center justify-center w-full h-[40px] mt-3">
                            <xt-button :w="84" :h="32"
                                style="
                                backend:var(--primary-bg);
                                color:var(--secondary-text);
                                border-radius: 8px;">查看更多
                            </xt-button>
                        </div> -->
            </div>
          </vue-custom-scrollbar>
        </div>
        <Unusual
          v-else
          :newIcon="'fluent-emoji:magnifying-glass-tilted-right'"
          :title="'没有找到相关内容'"
          :description="'没有找到相关内容'"
          :disableEdit="options.disableEdit"
          :normalButtonTitle="'设置'"
          @back="backSetting"
        ></Unusual>
      </div>
      <Unusual
        v-else
        :newIcon="'fluent-emoji:magnifying-glass-tilted-right'"
        :title="'没有找到相关内容'"
        :description="'没有找到相关内容'"
        :normalButtonTitle="'设置'"
        :disableEdit="options.disableEdit"
        @back="backSetting"
      ></Unusual>
    </xt-container>
    <teleport to="body" :disabled="false">
      <PublishModal
        v-if="showPublishModal"
        :visible="showPublishModal"
        @close="showPublishModal = false"
        @refreshDefaultForum="refresh"
        :section="forumList"
        :defaultSection="defaultForum"
      >
      </PublishModal>
      <div v-if="showDetailModal">
        <DetailModal
          v-if="toggleDetail"
          :cardData="cardData"
          :showDetailModal="showDetailModal"
          @closeDetail="closeDetail"
        />
        <MinDetailModal
          v-else
          :cardData="cardData"
          :showDetailModal="showDetailModal"
          @closeDetail="closeDetail"
        />
      </div>
    </teleport>
    <CommunitySetting
      v-if="settingVisible"
      :settingVisible="settingVisible"
      :forumList="forumList"
      :defaultForum="customData.selectList"
      @forumList="updateForumList"
      @close="this.settingVisible = false"
    >
    </CommunitySetting>
  </div>
</template>
<script>
import Widget from "../../card/Widget.vue";
import { Icon as YuanIcon } from "@iconify/vue";
import communItem from "./CommunItem.vue";
import RadioTab from "../../RadioTab.vue";
import { mapWritableState, mapActions } from "pinia";
import { useCommunityStore } from "../../../apps/chat/store/commun";
import { yuanCommunityStore } from "../../../store/yuanCommunity";
import Unusual from "../Unusual.vue";
import DetailModal from "../../sns/int/DetailModal.vue";
import MinDetailModal from "../../sns/int/MinDetailModal.vue";
import CommunitySetting from "./CommunitySetting.vue";
import PublishModal from "./Detail/PublishModal.vue";
import { communityNavStore } from "../../bottomPanel/store/communityNavStore";

export default {
  name: "元社区",
  components: {
    Widget,
    YuanIcon,
    communItem,
    RadioTab,
    DetailModal,
    MinDetailModal,
    Unusual,
    CommunitySetting,
    PublishModal,
  },
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {},
    },
    desk: {
      type: Object,
    },
    openWay: {
      type: String,
      default: "desk",
    },
  },
  emits: ["delete"],
  data() {
    return {
      sizeList: [
        {
          value: "4x4",
          name: "4x4",
        },
        {
          value: "4x6",
          name: "4x6",
        },
      ],
      menuList: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
            this.$refs.cardSlot.visible = false;
          },
        },
      ],
      settingVisible: false,
      isLoading: false,
      browserUrl: "https://s.apps.vip/post/",
      showPublishModal: false,
      selectList: [],
      defaultForum: 100304,
      // defaultForum:  { name: '版本更新', value: 100304 } ,
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      showDetailModal: false,
      cardData: null,
      toggleDetail: true,
      selectValue: [],
      env: {
        web: false,
        mobile: false,
        client: false,
        single: true,
      },
      showForumPost: [],
      isClick: true,
    };
  },
  methods: {
    ...mapActions(yuanCommunityStore, ["getMyForumList", "getCommunityPost"]),
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),

    // 导航栏删除图标回调
    deleteCard() {
      this.$emit("delete");
    },
    // 刷新圈子
    async refreshPost() {
      this.isLoading = true;
      // console.log(this.defaultForum,'defaultForum')
      let value = 0;
      this.defaultForum.value
        ? (value = this.defaultForum.value)
        : (value = this.defaultForum);
      // console.log(value,'value')
      await this.getCommunityPost(value);
      this.showForumPost = this.communityPost;
      this.isLoading = false;
      this.isClick = false;
    },
    // 发文后刷新页面
    async refresh(value) {
      this.isLoading = true;
      this.defaultForum = value;
      await this.getCommunityPost(value);
      this.showForumPost = this.communityPost;
      this.isLoading = false;
    },
    // 查看内容详情
    showDetail(item) {
      // browser.openInUserSelect(`${this.browserUrl}${item.id}`)
      this.showDetailModal = true;
      this.cardData = item;
      this.isClick = false;
      // console.log(this.cardData);
    },
    // 关闭详情弹窗
    closeDetail(value) {
      this.communityPostDetail = [];
      this.communityReply = [];
      this.showDetailModal = value;
    },
    // 显示发布页是否可见
    publishModalVisible() {
      this.showPublishModal = !this.showPublishModal;
    },
    // 回调
    modalVisible(val) {
      this.showPublishModal = val;
    },
    handleResize() {
      if (window.innerWidth > 1200) {
        this.toggleDetail = true;
      } else {
        this.toggleDetail = false;
      }
    },
    backSetting() {
      this.settingVisible = true;
      this.$refs.cardSlot.visible = false;
    },
    updateForumList(list) {
      this.customData.selectList = list;
    },
    // 记忆帖子，当切换页面时记忆帖子，如果没有操作10S后更新帖子列表
    memoryPost() {
      const cachePost = JSON.parse(localStorage.getItem("communityContent"));
      // console.log(cachePost,'cachePost');
      if (cachePost) {
        this.showForumPost = cachePost;
        setTimeout(() => {
          if (this.isClick) {
            this.isLoading = true;
            this.refreshPost().then(() => {
              this.isLoading = false;
            });
          }
        }, 10000);
        // 当获取到帖子内容后，清除缓存
        localStorage.removeItem("communityContent");
      } else {
        this.showForumPost = this.communityPost;
      }
    },
  },
  computed: {
    ...mapWritableState(yuanCommunityStore, [
      "communityPost",
      "myForumList",
      "forumsList",
      "defaultSection",
    ]),
    ...mapWritableState(useCommunityStore, [
      "communityReply",
      "communityPostDetail",
    ]),
    // 卡片选项
    options() {
      return {
        customDel: this.openWay === "nav" ? true : false,
        title:
          this.customData.selectList.length === 1
            ? this.customData.selectList[0].name || "元社区"
            : "元社区",
        disableEdit: this.isCommunityDesktop(this.desk),
        cardName: '元社区'
      };
    },
    forumList() {
      if (this.customData && this.customData.forumList) {
        return this.customData.forumList;
      }
      return this.myForumList;
    },
    showForumList() {
      if (this.customData && this.customData.selectList) {
        return this.customData.selectList?.slice(0, 5);
      }
      return this.selectList.slice(0, 5);
    },
    header(){
            return {
                title: this.options.title,
                // ifyIcon:'fluent:chat-16-regular',
                showIcon:"/logo/community.svg",
                refresh:{
                    fn:this.refreshPost,
                    tip:"刷新",
                    state:this.isLoading ? true : false
                },
                leftHover: true,
                leftHoverName:"点击切换",
                leftHoverIcon: "fluent:open-16-regular",
                rightIcon:[
                    {
                        tip:"发布",
                        ifyIcon:'fluent:add-16-regular',
                        fn:this.publishModalVisible,
                    }
                ]
            }
        },
    },

  async beforeMount() {
    this.getMyForumList().then(() => {
      this.customData.forumList = this.myForumList;
    });
    // console.log(this.myForumList,'this.myForumList');
    // 判断是否刷新加载内容
    if (this.customData && this.customData.defaultForum) {
      this.defaultForum = this.customData.defaultForum;
    } else if (this.customData && this.customData.selectList) {
      this.defaultForum = this.customData.selectList[0];
    } else {
      this.selectList.push(this.defaultForum);
      this.customData.selectList = this.selectList;
      this.defaultForum = this.customData.selectList[0];
    }
  },
  async mounted() {
    window.addEventListener("resize", this.handleResize);
    this.memoryPost();
    if (this.customData.customSize === undefined) {
      this.customData.customSize = "4x4";
    }
    if (this.options.disableEdit) {
      this.sizeList = [];
      this.menuList = [];
    } else {
      this.sizeList = [
        {
          value: "4x4",
          name: "4x4",
        },
        {
          value: "4x6",
          name: "4x6",
        },
      ];
      this.menuList = [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
            this.$refs.cardSlot.visible = false;
          },
        },
      ];
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  watch: {
    customSize(newVal, oldVal) {
      this.customData.customSize = newVal;
    },
    showForumList(newValue) {
      // this.isLoading = true
      if (this.showForumList.length > 0) {
        this.getCommunityPost(this.showForumList[0].value);
      }
      // setTimeout(() => {
      //     this.isLoading = false
      // });
    },
    defaultForum(newValue) {
      this.customData.defaultForum = newValue;
      this.defaultSection = this.customData.defaultForum;
      this.isLoading = true;
      let target = "";
      if (this.customData.defaultForum?.index) {
        target = this.customData.defaultForum.value.id;
      } else if (this.customData.defaultForum?.value) {
        target = this.customData.defaultForum.value;
      } else {
        target = this.customData.defaultForum;
      }
      this.getCommunityPost(target).then(() => {
        this.showForumPost = this.communityPost;
        this.isLoading = false;
      });
      this.isClick = false;
    },
    // 切换频道和圈子时触发获取
    defaultType(newValue) {
      // console.log(newValue.name);
      if (newValue.name == "circle") {
        this.getMyForumList();
      } else {
        return;
      }
    },
    settingVisible() {
      // 加载已选择的模块
      this.isClick = false;
      if (
        this.customData &&
        this.customData.selectList &&
        this.settingVisible == true
      ) {
        this.selectValue = this.customData.selectList.map((item) => {
          return item.index;
        });
      }
    },
  },
  unmounted() {
    localStorage.setItem(
      "communityContent",
      JSON.stringify(this.showForumPost)
    );
  },
};
</script>
<style lang="scss"></style>../../../page/chat/commun.ts./YuanCommunity.vue/index.ts./YuanCommunity.vue
