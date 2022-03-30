const globalSearchTempl = /*html*/`
  <div class="gs-wrap" v-show="visible">
    <div class="gs-mask" @click="clkmask"></div>
    <div class="gs-dialog">
      <div class="search flex justify-between align-center">
        <a-icon class="search-lf" type="search" :style="{ fontSize: '26px' }"></a-icon>
        <input type="text" class="search-rg" :value="searchWord" @input="handleInput($event)" style="font-size: 20px" />
      </div>
      <div class="category flex justify-between align-center">
        <div class="category-lf">
          <template v-for="(tag, index) in tags">
            <a-tag :key="index" :color="tag.checked ? 'blue' : ''" @click="handleChange(tag, index)">
              {{tag.label}}
            </a-tag>
          </template>
        </div>
        <div class="category-rg flex justify-around align-center">
          <a-icon type="smile"></a-icon>
          <div class="flex align-center justify-center" style="padding-left: 5px">按下Tab键切换类型</div>
        </div>
      </div>
      <div class="content flex align-center justify-center">
        <template v-if="contentLoading">
          <div>
            <a-spin>
              <a-icon slot="indicator" type="loading" style="font-size: 60px" spin></a-icon>
            </a-spin>
          </div>
        </template>
        <ul v-else>
          <template v-for="(item, index) in compSearchResult">
            <li class="flex justify-start align-center" :key="index">
              <img :src="item.icon" style="width: 30px; height: 30px;">
              <div class="flex flex-direction justify-center align-start" style="padding-left: 20px">
                <div>{{item.title}}</div>
                <div>{{item.attached}}</div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
`

Vue.component("global-search", {
  template: globalSearchTempl,
  props: {
    visible: {
      type: Boolean,
    },
  },
  watch: {
    searchWord: {
      handler: tools.debounce(function (newValue, oldValue) {
        console.log(newValue)
        this.searchResult = []

        if(newValue.length > 0) {
          this.searchResult = this.searchResult.concat(this.searchTab(newValue), this.searchTask(newValue))
          console.log(this.searchResult)
        }
        this.contentLoading = false

      }, 500),
      deep: true
    }
  },
  data() {
    return {
      indicator: '<a-icon type="loading" style="font-size: 24px" spin />',
      contentLoading: false,
      searchWord: '',
      tags: [
        {
          label: '全部',
          checked: true
        },
        {
          label: '应用',
          checked: false
        },
        {
          label: '网页',
          checked: false
        },
        {
          label: '标签组',
          checked: false
        }
      ],
      searchResult: [],
      itemReadyedIndex: 0,
      itemReadyedItem: {}
    };
  },
  computed: {
    compSearchResult() {
      let findResult = this.tags.find(v => v.checked === true)
      if(findResult.label === '全部') {
        this.itemReadyedItem = this.searchResult[0]
        return this.searchResult
      } else if (findResult.label === '网页') {
        let filterRes = this.searchResult.filter(v => v.tag === 'tab')
        this.itemReadyedItem = filterRes[0]
        return filterRes
      } else if (findResult.label === '标签组') {
        let filterRes = this.searchResult.filter(v => v.tag === 'task')
        this.itemReadyedItem = filterRes[0]
        return filterRes
      }
    }
  },
  methods: {
    handleInput(e) {
      this.searchWord = e.target.value
      this.contentLoading = true
    },
    clkmask() {
      this.$emit("closeGlobalSearch");
    },
    handleChange(tag, index) {
      this.tags.forEach(e => {
        e.checked = false
      })
      this.tags[index].checked = !tag.checked
    },
    searchApp() {

    },
    searchTask(word) {
      let mapTasks = this.$store.getters.getItems.map(v => {
        return {
          title: v.name,
          icon: v.icon,
          id: v.id,
          url: v.hasOwnProperty('url') ? v.url : null,
          tag: 'task',
          attached: `标签组·${v.tabs.length}个标签`
        }
      })
      return mapTasks.filter(v => v.title.includes(word))
    },
    searchTab(word) {
      let mapTabs = []
      this.$store.getters.getItems.forEach(v => {
        v.tabs.forEach(k => {
          mapTabs.push({
            title: k.title,
            icon: k.icon,
            id: k.id,
            url: k.hasOwnProperty('url') ? k.url : null,
            tag: 'tab',
            attached: `${v.name}·` + tools.execDomain(k.url)
          })
        })
      })
      return mapTabs.filter(v => v.title.includes(word) || v.url.includes(word))
    }
  },
  mounted () {
    console.log(tools);
    setTimeout(() => {
      console.log(this.$store.getters.getItems)
    }, 2000)
  },
})
