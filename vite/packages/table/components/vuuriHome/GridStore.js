/**
 * Simple memory store for Vuuri
 */
export class GridStore {
  constructor() {
    /**
     * @type {Map<string, Array<Muuri>>}
     */
    this._store = new Map();

    /**
     * @type {Map<string, Array<*>>}
     */
    this._itemStore = new Map();

    /**
     * @type {Muuri.Item}
     */
    this._draggingGridItem = null;

    /**
     * @type {*}
     */
    this._draggingItem = null;
  }

  /**
   * @param {number} gridId
   * @param {Array<*>} items
   */
  setItemsForGridId(gridId, items) {
    this._itemStore.set(gridId, items);
  }

  /**
   * @param {Muuri.Item} value
   */
  setDraggingGridItem(value) {
    this._draggingGridItem = value;
  }

  /**
   * @param {*} value
   */
  setDraggingItem(value) {
    this._draggingItem = value;
  }

  /**
   * @return {Muuri.Item}
   */
  getDraggingGridItem() {
    return this._draggingGridItem;
  }

  /**
   * @return {*}
   */
  getDraggingItem() {
    return this._draggingItem;
  }

  /**
   * @param {string} groupId
   * @param {Muuri} grid
   */
  addGrid(groupId, grid) {
    const groupIdString = groupId+'';
    if (!this._store.has(groupIdString)) {
      this._store.set(groupIdString+'', []);
    }
    this._store.get(groupIdString).push(grid);
  }

  /**
   * @param {Array<string>} groupIds
   * @param {Muuri} grid
   */
  addGridToGroups(groupIds, grid) {
    groupIds.forEach(groupId => this.addGrid(groupId, grid));
  }

  /**
   * @param {Array<string>} group
   * @returns {*}
   */
  getGrids(group) {
    let groups = [];
    group.forEach((groupy) => groups = groups.concat(this._store.get((groupy+''))));
    return groups;
  }
}

export default new GridStore();
