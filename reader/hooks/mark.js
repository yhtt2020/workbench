import { setLocal } from "../js/localStorage.js";
let jsMark;
export default function () {
  function initMark(el, className, cb) {
    jsMark = new JsMark({
      el,
      options: {
        isCover: true,
        beautify: true,
        ignoreClass: ["ignore1", "ignore"],
      },
    });

    //选中文本后回调
    jsMark.onSelected = function (res) {
      let { uid, offsetTop } = jsMark.repaintRange({
        uuid: res.storeRenderOther.uid,
        textNodes: res.textNodes,
        className: res.storeRenderOther.className || className.value,
      });
      cb.onSelected &&
      cb.onSelected({
        uid,
        offsetTop,
        desc: res.storeRenderOther.desc,
        hasStoreRender: res.hasStoreRender,
      });

      if (!res.hasStoreRender) {
        setLocal({
          offset: res.offset,
          text: res.text,
          uid,
          desc: "",
          className:className.value,
        });
      }
    };
    //点击高亮节点后显示
    jsMark.onClick = function ({ uid, offsetTop, offsetLeft }) {
      cb.onClick && cb.onClick({ uid, offsetTop, offsetLeft });
    };
  }
  function deleteMark(uid) {
    jsMark.deleteMark(uid);
    const ignoreEle = document.getElementById(uid);
    if(ignoreEle){
      ignoreEle.parentNode.removeChild(ignoreEle);
    }
    jsMark.beautifyHTML();
  }
  function renderStore(data) {
    jsMark && jsMark.renderStore(data);
  }

  function search(value) {
    jsMark.repaintRange({
      uuid: 2323,
      className: "annotator-h3",
      textNodes: jsMark.findWord(value),
    });
  }

  function replaceMarkClass(uid, className) {
    jsMark.replaceMarkClass(uid, className);
  }

  return {
    initMark,
    search,
    deleteMark,
    renderStore,
    replaceMarkClass,
  };
}
