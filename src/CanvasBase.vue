<script>
import CanvasBaseElement from './CanvasBaseElement.vue'
import CanvasSelector from './CanvasSelector.vue'

const KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
}

export default {
  components: {
    CanvasBaseElement,
    CanvasSelector
  },

  props: {
    // Children
    value: {
      type: Array,
      default () {
        return [
          // { type: 'node', x: 10, y: 50 },
        ]
      }
    },
    light: { type: Boolean, default: false },
    width: { type: [Number, String], default: '100%' },
    height: { type: [Number, String], default: '100%' },
    // zoom: { type: Number, default: 100 }
    scale: { type: Number, default: 1 }
  },

  data () {
    return {
      dragSelector: null,
      selecting: [],
      selection: [],
      pressedKeys: {
        shift: false,
        ctrl: false,
        alt: false
      },
      mouse: { x: 0, y: 0, isDown: false }
    }
  },

  watch: {
    // Clear selection on value change
    value (value) {
      this.selection = []
      this.selecting = []
    },

    selected (value) {
      // Tell parent
      this.$emit('selection', value)
    },

    selection (value) {
      // Tell parent
      this.$emit('update:selection', value)
    },

    selecting (value) {
      // Tell parent
      this.$emit('update:selecting', value)
    }
  },

  // See root element, trick is to use tabindex
  // mounted () {
  //   // const el = window
  //   this.$refs.canvas.addEventListener('keydown', this.keydown)
  //   this.$refs.canvas.addEventListener('keyup', this.keyup)
  // },
  // destroyed () {
  //   this.$refs.canvas.removeEventListener('keydown', this.keydown)
  //   this.$refs.canvas.removeEventListener('keyup', this.keyup)
  // },

  methods: {
    emitInput (children) {
      this.$emit('input', children)
    },

    // Mutations
    deleteSelected () {
      // Clone
      const newList = this.value.filter(elem => {
        return !this.selection.includes(elem)
      })

      // Tell parent
      this.$emit('delete', this.selection)
      this.$emit('update:value', newList)
    },

    // Internal state change only
    moveGroup ($event) {
      const { selection } = this

      // Move all selected items
      selection.forEach(elem => {
        elem.x += $event.movementX
        elem.y += $event.movementY
      })
    },

    moveDone () {
      // Inform parent
      this.emitInput(this.value)
    },

    keydown (e) {
      this.pressedKeys.shift = e.shiftKey
      this.pressedKeys.ctrl = e.ctrlKey
      this.pressedKeys.alt = e.altKey

      const { keyCode } = e
      if (keyCode === 8) {
        this.deleteSelected()
        // vm.$emit('delete', vm.selection)
      }

      this.handleMove(e)
    },

    keyup (e) {
      this.pressedKeys.shift = e.shiftKey
      this.pressedKeys.ctrl = e.ctrlKey
      this.pressedKeys.alt = e.altKey
    },

    handleMove (e) {
      // Handle move
      const { keyCode } = e

      const MOVESPEED = 20

      const moveSelection = (x = 0, y = 0) => {
        this.selection.map(element => {
          element.x += x
          element.y += y
        })
      }

      if (keyCode === KEYS.up) {
        moveSelection(0, -MOVESPEED)
      }

      if (keyCode === KEYS.right) {
        moveSelection(MOVESPEED, 0)
      }

      if (keyCode === KEYS.down) {
        moveSelection(0, MOVESPEED)
      }

      if (keyCode === KEYS.left) {
        moveSelection(-MOVESPEED, 0)
      }
    },

    selectItem (item) {
      // Clear selecting
      this.selecting = []

      // Handle selection
      if (this.pressedKeys.shift) {
        // Toggle selection if already added
        const isSelected = this.selection.find(elem => elem === item)

        if (isSelected) {
          this.selection = this.selection.filter(elem => elem !== item)
        } else {
          this.selection.push(item)
        }
      } else {
        // New item?
        const isInSelection = this.selection.find(elem => elem === item)

        this.selection = isInSelection ? this.selection : [item]
      }
    },

    dblClick (item) {
      this.$emit('dblClick', item)
    },

    // onMousedownItem
    moveItem (e) {
      this.moveGroup(e)
    },

    moveItemEnd (e) {
      this.$refs.canvas.removeEventListener('mousemove', this.moveItem)
      this.$refs.canvas.removeEventListener('mouseup', this.moveItemEnd)
    },

    onMousedownItem (item) {
      this.$refs.canvas.addEventListener('mousemove', this.moveItem)
      this.$refs.canvas.addEventListener('mouseup', this.moveItemEnd)

      this.selectItem(item)
    },

    onMouseupItem (item) {
      // this.selectItem(item)
    },

    clearAll ($event) {
      this.selection = []
      this.selecting = []
    },

    mousedown ($event) {
      this.mouse.isDown = true

      this.dragSelector = true
      this.clearAll()
    },

    mouseup ($event) {
      this.mouse.isDown = false
    },

    mousemove (e) {
      this.mouse.x = e.offsetX
      this.mouse.y = e.offsetY
    },

    onUpdateHover (item, $event) {
    },

    drop (e) {
      // Tell parent
      this.$emit('drop', e)
    },

    onSelectFinish () {
      // Convert selecting to selection
      this.selection = this.selecting
        .map((elem, index) => elem ? this.value[index] : false)
        .filter(elem => elem)
    },

    onSelectWindow (s = { }) {
      const absBox = (element) => {
        const box = element.getBoundingClientRect()
        return {
          top: box.top + window.pageYOffset,
          left: box.left + window.pageXOffset,
          width: box.width,
          height: box.height
        }
      }

      const WINDOW = {
        left: 0,
        top: 0,
        width: 1000,
        height: 1000
      }

      const withinSelection = (s = WINDOW) => (b = WINDOW) =>
        (Math.abs((s.left - b.left) * 2 + s.width - b.width) < (s.width + b.width)) &&
            (Math.abs((s.top - b.top) * 2 + s.height - b.height) < (s.height + b.height))

      const selectables = this.$refs.child
        .map(VueComponent => VueComponent.$el)
        .map(absBox)

      // Detect matches in selectable elements
      const selecting = selectables
        .map((elem, index) => withinSelection(s)(elem))

      this.selecting = selecting
    }
  }
}
</script>

<template>
  <span
    ref="canvas"
    class="CanvasBase"
    tabindex="-1"
    @mousedown="mousedown"
    @mouseup="mouseup"
    @mousemove="mousemove"
    @keydown="keydown"
    @keyup="keyup"
    v-on="$listeners"
  >
    <!-- Hidden defs -->
    <!-- <CanvasBackgroundSymbols /> -->

    <div class="CanvasBase__overlay">
      <slot name="overlay" />
    </div>

    <svg
      :width="width"
      :height="height"
    >
      <slot name="background">
        <!-- <g class="svggrid">
          <rect id="svggridbg" width="15000" height="15000" fill="url(#svggrid_dark)" />
        </g> -->
      </slot>

      <!-- Slot -->
      <slot />

      <!-- All content -->
      <g class="content" :transform="`scale(${scale})`">
        <g class="children">

          <!-- Loop children -->
          <g
            v-for="(item, index) in value"
             :key="`child-${index}`"
          >
            <!-- Base element to support dragging, hover, selecting in SVG world, etc -->
            <CanvasBaseElement
              ref="child"
              :x="item.x"
              :y="item.y"
              :class="selecting[index] ? 'selecting' : ''"
              :selecting="selecting[index]"
              :selected="!!selection.find(elem => elem === item)"
              :element="$refs.canvas"
              @dblclick.native="dblClick(item)"
              @mousedown.stop="onMousedownItem(item)"
              @mouseup="onMouseupItem(item)"
            >
              <template #default="props">
                <slot
                  :name="item.type"
                  v-bind="{...props,item}"
                >
                  <text fill="white">slot with type "{{ item.type }}" not found</text>
                </slot>
              </template>
            </CanvasBaseElement>
          </g>
        </g>
      </g>

      <!-- Drag selector -->
      <CanvasSelector
        v-if="dragSelector"
        :element="$refs.canvas"
        @input="onSelectWindow"
        @finish="onSelectFinish"
      />

    </svg>
  </span>
</template>

