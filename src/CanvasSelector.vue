<script>
export default {
  props: {
    element: {}
  },

  data: vm => ({
    enabled: false,
    x: 100,
    y: 100,
    width: 100,
    height: 200
  }),

  computed: {
    _x: vm => (vm.width < 0 ? vm.x + vm.width : vm.x),
    _y: vm => (vm.height < 0 ? vm.y + vm.height : vm.y),
    _width: vm => Math.abs(vm.width),
    _height: vm => Math.abs(vm.height)
  },

  mounted() {
    this.element.addEventListener("mousedown", this.mousedown);
  },

  beforeDestroy() {
    // Remove also for better HMR
    this.element.removeEventListener("mousedown", this.mousedown);
  },

  methods: {
    mouseup(e) {
      e.preventDefault();

      this.element.removeEventListener("mousemove", this.mousemove);
      this.element.removeEventListener("mouseup", this.mouseup);

      // Nothing happend
      if (!this.enabled) {
        return;
      }

      // STOP
      this.enabled = false;
      this.$emit("finish");
      // Clear
      // this.$emit('input', {
      // // Relative
      //   x: 0,
      //   y: 0,
      //   // Absolute
      //   left: 0,
      //   top: 0,
      //   width: 0,
      //   height: 0
      // })
    },

    mousedown(e) {
      //   console.log('start')
      this.element.addEventListener("mousemove", this.mousemove);
      this.element.addEventListener("mouseup", this.mouseup);

      this.x = e.offsetX;
      this.y = e.offsetY;
      this.width = 0;
      this.height = 0;
    },

    mousemove(e) {
      this.width = e.offsetX - this.x;
      this.height = e.offsetY - this.y;

      this.enabled = true;

      const resp = this.element.getBoundingClientRect();

      this.$emit("input", {
        // Relative
        x: this._x,
        y: this._y,
        // Absolute
        left: this._x + resp.left,
        top: this._y + resp.top,
        width: this._width,
        height: this._height
      });
    }
  }
};
</script>

<template>
  <g v-if="enabled" ref="selector" class="CanvasSelector">
    <rect
      class="CanvasSelector"
      rx="5"
      ry="5"
      :x="_x"
      :y="_y"
      :width="_width"
      :height="_height"
    />
  </g>
</template>

