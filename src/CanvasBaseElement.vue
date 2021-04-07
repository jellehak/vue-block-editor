<script>
// https://www.w3schools.com/jsref/obj_mouseevent.asp
// http://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
export default {
  props: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    selected: { type: Boolean, default: false },
    selecting: { type: Boolean, default: false }
  },

  data: vm => ({
    hover: false,
    down: false,
    startDrag: false
    // selected: false
  }),

  methods: {
    // Handle hover
    mouseenter () {
      this.setHover(true)
    },
    // Handle hover
    mouseleave () {
      this.setHover(false)
    },

    setHover (value) {
      this.hover = value
      // console.log('Update hover')
      // Tell parent
      // this.$emit('update:hover', value)
    }
  }
}
</script>

<template>
  <g
    v-bind="$attrs"
    class="canvas_base_element draggable"
    :transform="`translate(${x || 0},${y || 0})`"
    :class="[selected && 'selected', selecting && 'selecting', hover && 'hover']"
    v-on="$listeners"
  >
    <slot :hover="hover" :selected="selected" :selecting="selecting" />

    <!-- Debug -->
    <!-- <text transform="translate(40,20)" fill="blue">
      {{ selecting }}
    </text> -->
  </g>
</template>

