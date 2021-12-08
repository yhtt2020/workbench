const groupModel = {
  /**
   * 两层数组处理成AntDesign需要的树状形式(注意：整个树范围内的所有节点的 key 值不能重复！分级表示！)
   * @param {Array} list 两层数组，必须是两层！
   * @param {String} childNode 二级数据所属字段名
   * @param {String} firsetLevelIcon 一级图标(ant把图标设计成子组件的数据，可以用ant图库，要获取到子组件数据被设计成slot)
   * @param {String} secondLevelIcon 二级图标
   * @returns
   */
  convertTreeNode(list, childNode, firsetLevelIcon, secondLevelIcon) {
    let newArr = [];
    list.forEach((e) => {
      if (e[childNode]) {
        e.children = [];
        e[childNode].forEach((v) => {
          e.children.push({
            title: v.name,
            key: `L2-${v.id}`,
            scopedSlots: {
              icon: secondLevelIcon,
            },
          });
        });
        delete e[childNode];
      }
      let obj = {};
      for (const k in e) {
        if (k === "name") {
          obj.title = e[k]
        }
        if (k === "id") {
          obj.key = `L1-${e[k]}`
        }
        if (k === "logo" || k === 'children') {
          obj[k] = e[k]
        }
        obj.scopedSlots = {
          icon: firsetLevelIcon,
        };
      }
      newArr.push(obj);
    });
    return newArr;
  },
};

module.exports = groupModel;
