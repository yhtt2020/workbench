<template>
  <div
    ref="muuri"
    class="muuri-grid xt-bg"
    :class="className"
    :data-grid-key="gridKey">
    <div
      v-for="item in copiedItems"
      :key="item[itemKey]"
      :style="_getItemStyles(item)"
      class="muuri-item"
      :data-item-key="item[itemKey]"
    >
      <div class="muuri-item-content">
        <slot name="item" :item="item"/>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce, differenceWith } from 'lodash-es'
import Muuri from 'muuri'
import { v4 as uuidv4 } from 'uuid'
import { GridEvent } from './GridEvent'
import GridStore from './GridStore'
import { ItemKey, ItemSize, ItemDragHandle } from './constants'
import { deckStore } from '../../apps/deck/store'
export default {
  name: 'Vuuri',
  props: {
    /**
     * Optional class name to add to the grid. If not, one will be provided
     */
    className: {
      type: String,
      required: false,
      default: () => `class${uuidv4().replace(/-/g, '')}`
    },
    /**
     * To set up options of the grid
     * https://github.com/haltu/muuri#grid-options
     */
    options: {
      type: Object,
      required: false,
      default: () => ({})
    },
    /**
     * Array input for items to display (via v-model)
     */
    modelValue: {
      type: Array,
      required: false
    },
    /**
     * Identifier property for each item
     */
    itemKey: {
      type: String,
      required: false,
      default: () => ItemKey.key
    },
    /**
     * Callback to fetch a dynamic width based on item
     */
    getItemWidth: {
      type: Function,
      required: false,
      default: () => ItemSize.width
    },
    /**
     * Callback to fetch a dynamic height based on item
     */
    getItemHeight: {
      type: Function,
      required: false,
      default: () => ItemSize.height
    },
    /**
     * Enable drag and drop feature on the grid
     */
    dragEnabled: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * Selector for determining the handle to activate dragging
     */
    dragHandle: {
      type: String,
      required: false,
      default: ItemDragHandle.select
    },
    /**
     * When dragEnabled is on, can control which other grid you can drag into
     */
    groupId: {
      type: [String, Number],
      required: false
    },
    /**
     * When dragEnabled is on, can control which other grid you can drag into
     */
    groupIds: {
      type: [Array],
      required: false
    }
  },
  data () {
    return {
      /**
       * Deep copy of props items
       * @type Array<*>
       */
      copiedItems: [],
      /**
       * Map of events with respective listener function
       * @type Object.<string, function>
       */
      events: {},
      /*
      * The generated Muuri Options object
      */
      muuriOptions: {}
    }
  },
  watch: {
    modelValue: {
      deep: true,
      handler (newItems, oldValue) {
        if (!this.internallySet) {
          this._sync(newItems, this.copiedItems)
        }
      }
    },
    'settings.iconSize':{
      deep:true,
      handler(){
        if (!this.internallySet) {
          this.update()
        }
      }
    }
  },
  computed: {
    selector () {
      return `.${this.className}`
    }
  },
  methods: {
    /**
     * Manually update the items in the muuri grid
     */
    update () {
      this.$nextTick(() => {
        this.muuri
          .refreshItems()
          .layout(true, () => this.$emit('updated')).synchronize()
      })
    },
    /**
     * Prepares the muuri instance
     * @private
     */
    _setup () {
      this.muuri = new Muuri(this.selector, this.muuriOptions)
      if (this.groupId) {
        GridStore.addGrid(this.groupId, this.muuri)
      }
      if (this.groupIds) {
        GridStore.addGridToGroups(this.groupIds, this.muuri)
      }
      this.observer = new ResizeObserver(() => {
        this._resizeOnLoad()
      })
      this.observer.observe(this.$refs.muuri)
      this._sync(this.modelValue, [])
      this.$nextTick(() => {
        GridStore.setItemsForGridId(this.gridKey, this.modelValue)
      })
    },
    /**
     * @private
     */
    _setupNonReactiveProps () {
      /**
       * @type {Muuri}
       */
      this.muuri = undefined
      /**
       * @type {ResizeObserver}
       */
      this.observer = undefined
      /**
       * @type {string}
       */
      this.gridKey = uuidv4().replace(/-/g, '')
    },
    /**
     * Creates the options object for Muuri
     * @private
     */
    _setupOptions () {
      if (this.dragEnabled) {
        this.muuriOptions = { ...this._generateDragOptions(), ...this.muuriOptions }
      }
      if (this.groupId || this.groupIds) {
        let groupIds = []
        if (this.groupId) {
          groupIds.push(this.groupId)
        }
        if (this.groupIds) {
          groupIds = groupIds.concat(this.groupIds)
        }
        this.muuriOptions.dragSort = () => {
          return GridStore.getGrids(groupIds)
        }
      }
      this.muuriOptions = { ...this.options, ...this.muuriOptions }
    },
    /**
     * @private
     */
    _generateDragOptions () {
      return {
        dragEnabled: true,
        dragHandle: this.dragHandle,
        dragContainer: document.querySelector(`.muuri-grid${this.selector}`),
        dragRelease: {
          duration: 400,
          easing: 'cubic-bezier(0.625, 0.225, 0.100, 0.890)',
          useDragContainer: true,
        },
        dragPlaceholder: {
          enabled: true,
          createElement (item) {
            return item.getElement().cloneNode(true)
          },
        },
        dragAutoScroll: {
          targets: [window],
          sortDuringScroll: false,
          syncAfterScroll: false,
        },
      }
    },
    /**
     * Registers Muuri events
     * @private
     */
    _registerEvents () {
      Object.values(GridEvent).forEach(event => {
        this.events[event] = (...args) => {
          this.$emit(event, ...args)
        }
        this.muuri.on(event, this.events[event])
        if (event === GridEvent.dragStart) {
          this.muuri.on(event, this._onDragStart)
        }
        if (event === GridEvent.send) {
          this.muuri.on(event, this._onItemSend)
        }
        if (event === GridEvent.receive) {
          this.muuri.on(event, this._onItemReceive)
        }
        if (event === GridEvent.move) {
          this.muuri.on(event, this._onItemMove)
        }
        if (event === GridEvent.dragEnd) {
          this.muuri.on(event, this._onDragEnd)
        }
      })
    },
    /**
     * Unregister Muuri events
     * @private
     */
    _unregisterEvents () {
      Object.values(GridEvent).forEach(event => {
        this.muuri.off(event, this.events[event])
        delete this.events[event]
      })
    },
    /**
     * Listener when dragging begins
     * @type {Muuri.Item} item
     * @private
     */
    _onDragStart (item) {
      GridStore.setDraggingGridItem(item)
    },
    /**
     * Listener when item moves within the same grid
     * @type {Muuri.Item} item
     * @private
     */
    _onItemMove ({ item }) {
      const value = this._reOrderWithItem(item)
      this._emitValue(value)
    },
    /**
     * Listener when item leaves its original grid
     * @type {Muuri.Item} item
     * @private
     */
    _onItemSend ({ item }) {
      const index = this.modelValue.findIndex(value => value[this.itemKey] == item.getElement().dataset.itemKey)
      const removedItem = this.modelValue.splice(index, 1)[0]
      GridStore.setDraggingItem(removedItem)
      this._emitValue(this.modelValue)
    },
    /**
     * Listener when item enters a new grid
     * @private
     */
    _onItemReceive () {
      const vuuriItem = GridStore.getDraggingItem()
      this.modelValue.push(vuuriItem)
      const value = this._reOrderWithItem(GridStore.getDraggingGridItem())
      this._emitValue(value)
    },
    /**
     * Listener when dragging ends
     */
    _onDragEnd () {
      GridStore.setDraggingGridItem(null)
      GridStore.setDraggingItem(null)
    },
    /**
     * Makes sure the items order is updated with value
     * @type {Muuri.Item} item
     * @private
     */
    _reOrderWithItem (item) {
      const $grid = item.getGrid()
      let i = 0
      const itemKeys = $grid.getItems().reduce((accum, item) => {
        accum[item.getElement().dataset.itemKey] = i
        i += 1
        return accum
      }, {})
      return this.modelValue.reduce((accum, a) => {
        accum[itemKeys[a[this.itemKey]]] = a
        // accum.push(a);
        return accum
      }, [])
    },
    /**
     * Styles for each grid item
     * @private
     */
    _getItemStyles (item) {
      return {
        width: this.getItemWidth(item),
        height: this.getItemHeight(item)
      }
    },
    /**
     * Creates a unique identifier for the item based its property values
     * and adds a uuid
     * @param item
     * @returns {string}
     * @private
     */
    _generateItemKey (item) {
      item._$muuri_id = uuidv4()
    },
    /**
     * Callback used to resize the muuri grid
     * @private
     */
    _resizeOnLoad: debounce(function () {
      this.$nextTick(() => {
        this.update()
      }, 100)
    }),
    /**
     * Returns the difference between the two arrays
     * @param {Array<*>} newValue
     * @param {Array<*>} oldValue
     * @returns {Array<*>}
     * @private
     */
    _getDiff (newValue, oldValue) {
      return differenceWith(newValue, oldValue, (a, b) => {
        return a[this.itemKey] === b[this.itemKey]
      })
    },
    /**
     * Apply items updates on muuri
     * @param {?Array<*>} newItems
     * @param {?Array<*>} oldItems
     * @private
     */
    _sync (newItems = null, oldItems = null) {
      if (!newItems || !oldItems) {
        return
      }
      this._remove(newItems, oldItems)
        .then(() => {
          this.update()
          this._add(newItems, oldItems)
          GridStore.setItemsForGridId(this.gridKey, this.copiedItems)
        })
    },
    /**
     * Remove deleted items from muuri
     * @param {Array<*>}  newItems
     * @param {Array<*>}  oldItems
     * @returns {Promise<void>}
     * @private
     */
    _remove (newItems, oldItems) {
      const valuesToRemove = this._getDiff(oldItems, newItems)
      if (!valuesToRemove.length) {
        return Promise.resolve()
      }
      const itemsToRemove = []
      valuesToRemove.forEach(value => {
        const itemToRemove = this.muuri.getItems().find(item => {
          return (
            value[this.itemKey] + '' ===
            item.getElement().dataset.itemKey
          )
        })
        if (itemToRemove) {
          itemsToRemove.push(itemToRemove)
        }
      })
      if (!itemsToRemove.length) {
        return Promise.resolve()
      }
      return new Promise((resolve) => {
        this.muuri.hide(itemsToRemove, {
          onFinish: () => {
            this.muuri.remove(itemsToRemove)
            valuesToRemove.forEach(value => {
              const index = this.copiedItems.findIndex(item => item.id === value.id)
              this.copiedItems.splice(index, 1)
            })
            resolve()
          }
        })
      })
    },
    /**
     * Add new items to muuri
     * @param newItems
     * @param oldItems
     * @private
     */
    _add (newItems, oldItems) {
      let valuesToAdd = this._getDiff(newItems, oldItems)
      valuesToAdd = this._getDiff(valuesToAdd, this.copiedItems) // sync from setup and watch may overlap
      if (!valuesToAdd.length) {
        return
      }
      if (this.itemKey === ItemKey.key) {
        valuesToAdd.forEach(item => this._generateItemKey(item))
      }
      // renders new elements
      this.copiedItems = this.copiedItems.concat(valuesToAdd)
      this.$nextTick(() => {
        valuesToAdd.forEach(value => {
          const $element = document.querySelector(`${this.selector} [data-item-key="${value[this.itemKey]}"]`)
          this.muuri.add($element, {
            layout: false,
            active: false
          })
        })
        this.muuri.filter(() => true)
      })
    },
    _emitValue (value) {
      this.internallySet = true
      this.$emit('update:modelValue', value)
      this.$nextTick(() => {
        this.internallySet = false
        GridStore.setItemsForGridId(this.gridKey, this.value)
      })
    }
  },
  created () {
    this._setupNonReactiveProps()
    this._setupOptions()
  },
  mounted () {
    this._setup()
    this._registerEvents()
  },
  beforeDestroy () {
    this._unregisterEvents()
    this.$emit('on-destroy', this)
  }
}
</script>

<style scoped>
* {
  color:red !important;
}
.muuri-grid {
  position: relative;
}

.muuri-item {
  display: block;
  position: absolute;
  z-index: 1;
}

.muuri-item.muuri-item-dragging {
  z-index: 3;
}

.muuri-item.muuri-item-releasing {
  z-index: 2;
}

.muuri-item.muuri-item-hidden {
  z-index: 0;
}

.muuri-item-content {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  color: #ffffff;
//min-width: 80px;
//min-height: 80px;
  border-radius: 0.4em;
}

.muuri-item-placeholder {
  opacity: 0.5;
  margin: 0 !important;
}
</style>
