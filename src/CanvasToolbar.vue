<script>
export default {
  props: {
    selections: { type: Array, default: () => ([]) },
    scale: { type: Number, default: 1 },
    step: { type: Number, default: 0.1 }
  },

  methods: {
    // Toolbar
    setScale (factor, minZoom = 0.3) {
      // Clamp newScale
      const newScale = factor < minZoom ? minZoom : factor

      // Tell parent
      this.$emit('update:scale', newScale)
      this.$emit('update:zoom', newScale * 100)
    },

    deltaZoom (step = 0) {
      const newScale = this.scale + step
      this.setScale(newScale)
    },

    zoomIn () {
      this.deltaZoom(this.step)
    },

    zoomOut () {
      this.deltaZoom(-this.step)
    }
  }
}
</script>

<template>
  <div class="CanvasToolbar">
    <slot />

    <div v-if="selections.length" class="ml-2">
      {{ selections.length }} items selected
    </div>

    <v-btn icon @click="setScale(1)">
      <v-icon>aspect_ratio</v-icon>
    </v-btn>
    <v-btn icon @click="zoomIn">
      <v-icon>zoom_in</v-icon>
    </v-btn>
    <v-btn icon @click="zoomOut">
      <v-icon>zoom_out</v-icon>
    </v-btn>
    <div>{{ Math.round(scale * 100) }} %</div>
  </div>
</template>

