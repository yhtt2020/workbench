<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import {defineComponent, ref} from "vue";
import {
  EyeOutlined,
  LayoutOutlined,
  SearchOutlined,
  AimOutlined,
  ControlOutlined,
  CheckSquareOutlined,
  HomeOutlined,
  LockOutlined,
  NodeIndexOutlined,
  GoldOutlined,
  InsuranceOutlined
} from '@ant-design/icons-vue'
import settings from '../../src/settings/settingsContent'
import settingPage from '../../src/settings/settingPage.js'


export default defineComponent({
  components: {
    EyeOutlined, LayoutOutlined, SearchOutlined, AimOutlined, ControlOutlined, CheckSquareOutlined, HomeOutlined,
    LockOutlined, NodeIndexOutlined, GoldOutlined,InsuranceOutlined
  },
  mounted() {
    window.settings = settings
    // settings.load()
    settingPage.init()
  },
  setup() {

    const activeKey = ref('Privacy')
    return {
      activeKey
    }
  }
})
</script>

<template>
  <div
    class="banner yellow-background"
    id="restart-required-banner"
    role="alert"
    hidden
  >
    <div class="container">
      <i class="i carbon:information"></i>
      <span data-string="settingsRestartRequired"></span>
    </div>
  </div>
  <div style="margin:auto;width: 1200px;box-shadow:0 0 16px rgba(0,0,0,0.32)">
    <div style="background:white">
      <a-tabs :destroyInactiveTabPane="false"
              v-model:activeKey="activeKey"
              type="card"
              tabPosition="left"
              style="height: 100vh; "
      >
        <template #leftExtra>
          <div style="padding-top: 20px;padding-bottom: 20px;font-size: 20px">
            <a-avatar style="margin-right: 5px" src="/icons/logo128.png"></a-avatar>设置
          </div>
        </template>
        <a-tab-pane :forceRender="true" key="Privacy">
          <template #tab>
        <span>
          <eye-outlined/>
          隐私设置
        </span>
          </template>
          <div class="settings-container" id="privacy-settings-container">
            <h3 data-string="settingsPrivacyHeading"></h3>

            <div class="settings-info-subheading" id="content-blocking-statistics">
              <insurance-outlined style="font-size: 24px;vertical-align: middle" />
              <span
                data-string="settingsBlockedRequestCount"
                data-allowHTML
                id="content-blocking-blocked-requests"
              >
        </span>
            </div>

            <div class="setting-section" id="tracking-level-container">
              <div class="setting-option">
                <input type="radio" name="blockingLevel" id="blocking-allow-all"/>
                <label
                  for="blocking-allow-all"
                  data-string="settingsContentBlockingLevel0"
                ></label>
              </div>
              <div class="setting-option">
                <input type="radio" name="blockingLevel" id="blocking-third-party"/>
                <label
                  for="blocking-third-party"
                  data-string="settingsContentBlockingLevel1"
                ></label>
              </div>
              <div class="setting-option">
                <input type="radio" name="blockingLevel" id="blocking-block-all"/>
                <label
                  for="blocking-block-all"
                  data-string="settingsContentBlockingLevel2"
                ></label>
              </div>

              <div id="content-blocking-information" hidden>
                <div>
                  <label
                    for="content-blocking-exceptions"
                    data-string="settingsContentBlockingExceptions"
                  ></label>
                  <textarea
                    spellcheck="false"
                    id="content-blocking-exceptions"
                    style="width: 100%; max-width: 500px"
                    rows="1"
                  ></textarea>
                </div>
                <a
                  id="customize-filters-link"
                  target="_blank" href="https://www.yuque.com/tswork/ngd5zk/vch5wr"
                  data-string="settingsCustomizeFiltersLink"
                ></a>
              </div>
            </div>

            <div id="content-type-blocking"></div>
          </div>
        </a-tab-pane>
        <a-tab-pane :forceRender="true" key="Appearance">
          <template #tab>
        <span>
          <layout-outlined/>
          外观
        </span>

          </template>
          <div class="settings-container" id="appearance-settings-container">
            <h3 data-string="settingsAppearanceHeading"></h3>

            <label
              for="dark-mode-container"
              data-string="settingsEnableDarkMode"
            ></label>
            <div class="setting-section" id="dark-mode-container">
              <div class="setting-option">
                <input type="radio" name="darkMode" id="dark-mode-never"/>
                <label
                  for="dark-mode-never"
                  data-string="settingsDarkModeNever"
                ></label>
              </div>
              <div class="setting-option">
                <input type="radio" name="darkMode" id="dark-mode-night"/>
                <label
                  for="dark-mode-night"
                  data-string="settingsDarkModeNight"
                ></label>
              </div>
              <div class="setting-option">
                <input type="radio" name="darkMode" id="dark-mode-always"/>
                <label
                  for="dark-mode-always"
                  data-string="settingsDarkModeAlways"
                ></label>
              </div>
              <div class="setting-option">
                <input type="radio" name="darkMode" id="dark-mode-system"/>
                <label
                  for="dark-mode-system"
                  data-string="settingsDarkModeSystem"
                ></label>
              </div>
            </div>

            <div class="setting-section">
              <input type="checkbox" id="checkbox-site-theme"/>
              <label
                for="checkbox-site-theme"
                data-string="settingsSiteThemeToggle"
              ></label>
            </div>

            <div class="setting-section">
              <input type="checkbox" id="checkbox-show-divider"/>
              <label
                for="checkbox-show-divider"
                data-string="settingsShowDividerToggle"
              ></label>
            </div>
          </div>

        </a-tab-pane>
        <a-tab-pane :forceRender="true" key="Feature">
          <template #tab>
        <span>
          <ControlOutlined/>
          其他功能
        </span>
          </template>
          <div class="settings-container" id="additional-settings-container">
            <h3 data-string="settingsAdditionalFeaturesHeading"></h3>

            <div class="setting-section">
              <input type="checkbox" id="checkbox-userscripts" />
              <label
                for="checkbox-userscripts"
                data-string="settingsUserscriptsToggle"
              ></label>
              <div
                class="settings-info-subheading setting-secondary-label"
                data-string="settingsUserscriptsExplanation"
                data-allowHTML
              ></div>
            </div>

            <div class="setting-section" hidden id="section-separate-titlebar">
              <input type="checkbox" id="checkbox-separate-titlebar" />
              <label
                for="checkbox-separate-titlebar"
                data-string="settingsSeparateTitlebarToggle"
              ></label>
            </div>

            <div class="setting-section" id="section-open-tabs-in-foreground">
              <input type="checkbox" id="checkbox-open-tabs-in-foreground" />
              <label
                for="checkbox-open-tabs-in-foreground"
                data-string="settingsOpenTabsInForegroundToggle"
              ></label>
            </div>

            <div class="setting-section" id="section-user-agent">
              <input type="checkbox" id="checkbox-user-agent" />
              <label
                for="checkbox-user-agent"
                data-string="settingsUserAgentToggle"
              ></label>
              <input
                type="text"
                id="input-user-agent"
                style="
            vertical-align: middle;
            margin-left: 1em;
            width: 375px;
            max-width: 80vw;
            visibility: hidden;
          "
              />
            </div>

            <div class="setting-section">
              <input type="checkbox" id="checkbox-enable-autoplay">
              <label for="checkbox-enable-autoplay" data-string="settingsAutoplayToggle"></label>
            </div>

            <!-- 暂不支持自动检测更新关闭     <div class="setting-section">-->
            <!--        <input type="checkbox" id="checkbox-update-notifications" />-->
            <!--        <label-->
            <!--          for="checkbox-update-notifications"-->
            <!--          data-string="settingsUpdateNotificationsToggle"-->
            <!--        ></label>-->
            <!--      </div>-->
            <div class="setting-section">
              <input type="checkbox" id="checkbox-usage-statistics" />
              <label
                for="checkbox-usage-statistics"
                data-string="settingsUsageStatisticsToggle"
                data-allowHTML
              ></label>
            </div>
          </div>

        </a-tab-pane>
        <a-tab-pane :forceRender="true" key="SearchEngine">
          <template #tab>
        <span>
          <SearchOutlined/>
          搜索引擎
        </span>
          </template>
          <div class="settings-container" id="search-engine-settings-container">
            <h3 data-string="settingsSearchEngineHeading"></h3>

            <div class="setting-section">
              <label
                for="defaultSearchEngine"
                data-string="settingsDefaultSearchEngine"
              ></label>
              <select id="default-search-engine" name="defaultSearchEngine"></select>
              <input
                id="custom-search-engine"
                style="margin-left: 0.5em; min-width: 325px"
                hidden
              />

              <div
                class="settings-info-subheading"
                style="padding-top: 0.4em"
                data-string="settingsDDGExplanation"
              ></div>
            </div>
          </div>

        </a-tab-pane>
        <a-tab-pane :forceRender="true" key="Operation">
          <template #tab>
        <span>
          <AimOutlined/>
          操作
        </span>
          </template>
          <div class="settings-container" id="browser-settings-container">
            <h3>便捷操作</h3>
            <div class="setting-section">
              <label><input id="dropOpenLink" type="checkbox"> 拖拽链接以新标签页打开</label>
              <div class="settings-info-subheading">当拖拽网页中的链接时，以新标签页打开。</div>
            </div>
            <div class="setting-section">
              <label><input id="dbClickClose" type="checkbox"> 双击关闭标签</label>
              <div class="settings-info-subheading">当双击标签栏的标签时，直接将其关闭（非锁定标签）</div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane :forceRender="true" key="Default">
          <template #tab>
        <span>
          <check-square-outlined/>
          默认浏览器
        </span>
          </template>
          <div class="settings-container" id="browser-settings-container">
            <h3 data-string="settingsBrowserHeading"></h3>
            <p>当前：<span id="os_name"></span> <span id="os_type"></span></p>
            <div class="setting-section">
              <input id="custom-browser" style="margin-left: 0.5em; min-width: 325px" hidden />
              <button style="border-radius: 4px;border: solid 1px #ccc;padding: 5px " id="button-default-browser" onclick="callSetDefaultBrowser()"></button>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane :forceRender="true" key="NewTab">
          <template #tab>
        <span>
          <home-outlined/>
          起始页
        </span>
          </template>

          <div class="settings-container" id="browser-tab-container">
            <h3>起始页</h3>
            <div class="setting-section" id="tab-choose">
              <div class="setting-option">
                <input type="radio" name="tabChoosed" id="tstab-input" />
                <label
                  for="tstab-input"
                >想天桌面（官方尝鲜版）</label>
              </div>
              <div class="setting-option">
                <input type="radio" name="tabChoosed" id="qingning-input" />
                <label
                  for="qingning-input"
                >青柠起始页（极致简约）</label>
              </div>
              <div class="setting-option">
                <input type="radio" name="tabChoosed" id="infinity-input" />
                <label
                  for="infinity-input"
                >infinity（功能强大）</label>
              </div>
              <div class="setting-option">
                <input type="radio" name="tabChoosed" id="itab-input" />
                <label
                  for="itab-input"
                >iTab（热门新秀）</label>
              </div>
              <div class="setting-option">
                <input type="radio" name="tabChoosed" id="tab-custom-input" />
                <label
                  for="ab-custom-input"
                >自定义</label>
                <input
                  id="tab-text-input"
                  type="text"
                  placeholder="请输入"
                  style="width: 100%; max-width: 300px"
                  hidden
                />
              </div>
            </div>
          </div>

        </a-tab-pane>
        <a-tab-pane :forceRender="true" key="Password">
          <template #tab>
        <span>
         <lock-outlined/>
          密码管理
        </span>
          </template>
          <div class="settings-container" id="password-autofill-container">
            <h3 data-string="settingsPasswordAutoFillHeadline"></h3>

            <div class="setting-section">
              <label
                for="selectedPasswordManagers"
                data-string="settingsSelectPasswordManager"
              ></label>
              <select
                id="selected-password-manager"
                name="selectedPasswordManager"
              ></select>
            </div>

            <div class="setting-section" id="keychain-view-link" hidden>
              <a data-string="keychainViewPasswords"></a>
            </div>
          </div>

        </a-tab-pane>
        <a-tab-pane :forceRender="true" key="Proxy">
          <template #tab>
        <span>
          <NodeIndexOutlined/>
          代理
        </span>
          </template>
          <div class="settings-container" id="proxy-settings-container">
            <h3 data-string="settingsProxyHeading"></h3>

            <div class="setting-section" id="proxy-type-container">
              <select id="selected-proxy-type">
                <option data-string="settingsNoProxy"></option>
                <option data-string="settingsManualProxy"></option>
                <option data-string="settingsAutomaticProxy"></option>
                <option data-string="settingsSystemProxy"></option>
              </select>
            </div>

            <div class="setting-section" id="manual-proxy-section">
              <div class="setting-option">
                <label
                  for="proxy-rules-input"
                  data-string="settingsProxyRules"
                ></label>
                <input
                  id="proxy-rules-input"
                  type="text"
                  name="proxyRules"
                  placeholder="proxy.example.com:8080"
                />
              </div>

              <div class="setting-option">
                <label
                  for="proxy-bypass-rules-input"
                  data-string="settingsProxyBypassRules"
                ></label>
                <input
                  name="proxyBypassRules"
                  id="proxy-bypass-rules-input"
                  placeholder="localhost, 127.0.0.1/8, ::1"
                />
              </div>
            </div>

            <div class="setting-option" id="pac-option">
              <label
                for="pac-url-input"
                data-string="settingsProxyConfigurationURL"
              ></label>
              <input
                type="text"
                id="pac-url-input"
                placeholder="https://example.com/proxy.pac"
              />
            </div>
          </div>

        </a-tab-pane>
        <a-tab-pane :forceRender="true" key="ShortCuts">
          <template #tab>
        <span>
          <AimOutlined/>
          快捷键
        </span>
          </template>
          <div class="settings-container" id="keymap-settings-container">
            <h3 data-string="settingsKeyboardShortcutsHeading"></h3>
            <div
              class="settings-info-subheading"
              data-string="settingsKeyboardShortcutsHelp"
            ></div>

            <div class="setting-section">
              <ul id="key-map-list"></ul>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane :forceRender="true" key="Bangs">
          <template #tab>
        <span>
         <gold-outlined/>
          快捷指令
        </span>
          </template>

          <div class="settings-container" id="custom-bangs-container">
            <h3 data-string="settingsCustomBangs"></h3>
            <div class="setting-section">
              <ul id="custom-bangs"></ul>
              <button
                data-string="settingsCustomBangsAdd"
                id="add-custom-bang"
              ></button>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>

  </div>

</template>
currentTab
<style>
body {
  background: #f1f1f1
}
</style>
