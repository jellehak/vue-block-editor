> Canvas drawing for Vue

# Installation
```js
import Vue from 'vue'
import VueBlockEditor from "@/modules/vue-block-editor"
Vue.use(VueBlockEditor)
```

# Usage
```html
<canvas-base
:value="[
  { type: 'node', x: 10, y: 50 }
]"
:width="800"
:height="300"
>
    <!-- Node slot -->
    <template #node="props">
        <rect
            :width="100"
            :height="30"
            rx="3" ry="3"
            :fill="'white'"
            class="rect"
        />
    </template>
</canvas-base>
```