import useMark from "./hooks/mark.js";
import useAnnotation from "./hooks/annotation.js";
import {
  setLocal,
  getLocal,
  clearItemLocal,
} from "./js/localStorage.js";

const cssStyle = [
  "annotator-h1",
  "annotator-hl",
  "annotator-h2",
  "annotator-h3",
];

const { ref, onMounted, nextTick } = Vue;
let activeUid;

const App = {
  setup() {

    const settingOpen = ref(false);
    const textDesc = ref("");
    const searchValue = ref("");
    const activeClassName = ref(cssStyle[0]);

    const { renderStore, search, initMark, replaceMarkClass, deleteMark } =
      useMark();

    const {
      antRecords,
      addAntRecords,
      addEditRecord,
      removeAnt,
      setAntBorderColor,
    } = useAnnotation();

    onMounted(() => {
      const markContainer = document.querySelector("#reader-main");

      initMark(markContainer, activeClassName, {
        onSelected({ uid, offsetTop, desc, hasStoreRender }) {
          textDesc.value = "";
          if (hasStoreRender) {
            addAntRecords({
              uid,
              desc,
              offsetTop,
            });
          } else {
            addEditRecord(uid, offsetTop);
            activeUid = uid;
          }

          nextTick(() => {
            setAntBorderColor(uid);
          });
          //   const ele = document.createElement("span");
          //   ele.textContent = "";
          //   ele.classList = "ignore";
          //   ele.id = uuid;
          //   const endTextNode = res.textNodes[res.textNodes.length - 1];
          //   endTextNode.parentNode.append(ele);
        },
        onClick({ uid }) {
          console.log(uid)
          if(activeUid==uid)return;
          activeUid = uid;
          const marked = document.querySelector(`[data-uid="${uid}"]`);
          console.log(marked)
          textDesc.value = marked.textContent;
          addAntRecords({
            uid,
            isEdit: true,
          });
        },
      });

      renderStore(getLocal());
    });

    function setMarkClass(_, className, uid) {
      activeClassName.value = className;

      replaceMarkClass(uid, className);
      setLocal({ uid, className: className });

      nextTick(() => {
        setAntBorderColor(uid);
      });
    }
    function searchWord(value) {
      search(value);
    }

    function next() {
      let eleArr = document.querySelectorAll(`span[data-selector="2323"]`);
      eleArr[100].scrollIntoView();
    }

    function deleteAnnotation(uid) {
      deleteMark(uid);
      removeAnt(uid);
      clearItemLocal(uid);
    }

    function save(uid) {
      activeUid=0;
      addAntRecords({
        uid,
        desc: textDesc.value,
      });
      setLocal({ uid, desc: textDesc.value });
    }

    return {
      settingOpen,
      textDesc,
      antRecords,
      searchValue,
      cssStyle,
      searchWord,
      next,
      deleteAnnotation,
      setMarkClass,
      save,
    };
  },
};
const app = Vue.createApp(App);
app.use(ElementPlus);
app.mount("#app");
