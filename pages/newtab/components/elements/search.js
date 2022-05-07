const searchTpl = `
<div>
 <a-dropdown :trigger="['contextmenu']" >
   <div class="top-search allow-drag flex justify-between align-center" @contextmenu.stop="" @mousedown.stop="">
            <a-popover placement="bottomLeft" style="margin-left: 20px" v-model="visible">
              <template slot="content">
                <div class="card-list flex flex-wrap justify-center align-center">
                  <div
                    v-for="(item, index) in mySearch"
                    :key="item.id"
                    class="card flex justify-start align-center"
                    @click="chooseSearch(item.id, index)"
                  >
                    <img :src="item.slinkLogo" alt=""/>
                    <div style="margin-left: 15px">{{item.name}}</div>
                  </div>
                </div>
              </template>
              <template slot="title">
                <div class="card-head flex justify-between">
                  <div class="left flex align-center justify-center">选择您的默认搜索引擎:</div>
                  <div class="right flex align-center justify-center" style="display: none">
                    <p>搜索热词:</p>
                    <a-switch size="small" default-checked style="margin-left: 5px;"></a-switch>
                  </div>
                </div>
              </template>
              <img :src="this.slinkLogo" alt="" style="width: 25px; cursor: pointer"/>
            </a-popover>
            <input

             :id="searchId"
              type="text"
              class="search ignore-drag"
              :value="searchWord"
              @input="searchWord = $event.target.value"
              style="font-size: 20px"
              @keypress.enter="enterSubmit"
            />
            <div @click="clklogo" style="color: #606266;width: 18px;margin-right: 10px" >
              <a-icon  type="search" class="search-logo"></a-icon>
            </div>
          </div>
           <a-menu slot="overlay">
                      <a-menu-item @click="removeElement" key="remove">
                        移除组件
                      </a-menu-item>
<!--                      <a-menu-item @click="editElement(item)" key="edit">-->
<!--                        编辑组件-->
<!--                      </a-menu-item>-->
                    </a-menu>
                  </a-dropdown>
</div>
  `
Vue.component('search', {
  template: searchTpl,
  name: 'search',
  props: [],
  components: {},
  data () {
    return {
      mySearch: [],
      searchWord: '',
      visible: false,
      slinkLogo: './assets/baidu.svg',
      sfrontLink: 'https://www.baidu.com/s?wd=',
      searchId: 0,
    }
  },
  computed: {},
  mounted () {
    this.loadMysearch()
    this.searchId = Date.now()
    setTimeout(() => {
      document.getElementById(this.searchId.toString()).focus()
    }, 200)
  },
  methods: {
    chooseSearch (id, index) {
      this.visible = false
      this.slinkLogo = this.mySearch[index].slinkLogo
      this.sfrontLink = this.mySearch[index].frontLink
      window.$newtabRestore
        .saveDefaultDB(id)
        .then(() => {
          // console.log('dexie设置默认搜索引擎成功')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    loadMysearch () {
      window.$newtabRestore
        .restoreFromDB()
        .then((res) => {
          this.mySearch = res
          //console.log(res, '___searchres___')
          res.forEach((element) => {
            if (element.sDefault == 1) {
              this.slinkLogo = element.slinkLogo
              this.sfrontLink = element.frontLink
            }
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    clklogo () {
      location.href = this.sfrontLink + this.searchWord
    },
    removeElement(){
      this.$emit('remove-element')
    },
    enterSubmit () {
      location.href = this.sfrontLink + this.searchWord
    }
  }

  ,
  destroyed () {
  }
})
