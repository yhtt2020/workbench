import rearrangeAnt from "../js/IntervalAlgo.js";
import { deepCopy } from "../js/util.js";

let markedArr = [];

const { ref, nextTick } = Vue;
export default function () {
  const antRecords = ref([]);

  //清除编辑状态的备注器
  function clearEditAnt() {
    const noDescIdxS = [];
    antRecords.value.map((item, i) => {
      if (item.desc == "") {
        noDescIdxS.push(i);
      }
      item.isEdit = false;
    });
    // noDescIdxS.reverse().map((i) => {
    //   //删除无描述的dom
    //   antRecords.value.splice(i, 1);
    // });
  }

  //重新计算所有的位置
  function calcAntPositions({ offsetTop, hasEdit, uid }) {
    const marked = document.querySelector(`[data-uid="${uid}"]`);
    const height = marked.offsetHeight;
    let top = offsetTop;
    if (!offsetTop) {
      top = window.getComputedStyle(marked).top;
      top = Number(top.slice(0, top.length - 2));
    }
    let markedData = [];
    const data = [top, height + top, marked];
    const dataS = markedArr.filter((item) => item[2] !== marked);
    if (hasEdit) {
      markedData = rearrangeAnt(data, deepCopy(dataS), 2);
    } else {
      markedData = markedArr = rearrangeAnt(data, dataS, 2);
    }

    markedData.forEach((item) => {
      item[2].style.top = item[0] + "px";
    });
  }
  function addEditRecord(uid, top) {
    clearEditAnt();
    antRecords.value.push({
      uid,
      desc: "",
      isEdit: true,
    });
    nextTick(() => {
      // debugger
      calcAntPositions({ offsetTop: top, hasEdit: true, uid });
    });
  }
  function addAntRecords({ uid, desc, offsetTop, isEdit = false }) {
    // debugger
    const activeAntIndex = antRecords.value.findIndex(
      (item) => item.uid == uid
    );

    if (activeAntIndex > -1) {
      if (isEdit) {
        clearEditAnt();
        markedArr.forEach((item) => {
          item[2].style.top = item[0] + "px";
        });
      }
      const activeAnt = antRecords.value[activeAntIndex];
      desc && (activeAnt.desc = desc);
      activeAnt.isEdit = isEdit;
    } else {
      antRecords.value.push({
        uid,
        desc: desc,
        isEdit: false,
      });
    }

    nextTick(() => {
      // debugger
      calcAntPositions({ offsetTop, uid, hasEdit: isEdit });
    });
  }

  function removeAnt(uid) {
    const activeAntIndex = antRecords.value.findIndex(
      (item) => item.uid == uid
    );
    if (activeAntIndex > -1) {
      antRecords.value.splice(activeAntIndex, 1);
    }
    const marked = document.querySelector(`[data-uid="${uid}"]`);
    const markedIndex = markedArr.findIndex((item) => item[2] == marked);
    if (activeAntIndex > -1) {
      markedArr.splice(markedIndex, 1);
    }
  }
  //设置侧边颜色
  function setAntBorderColor(uid) {
    let eleArr = document.querySelector(`span[data-selector="${uid}"]`);
    const bg = window.getComputedStyle(eleArr).backgroundColor;
    const marked = document.querySelector(`[data-uid="${uid}"]`);
    marked.style.borderColor = bg;
  }
  return {
    setAntBorderColor,
    antRecords,
    addEditRecord,
    addAntRecords,
    removeAnt,
  };
}
