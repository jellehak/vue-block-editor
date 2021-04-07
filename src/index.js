import CanvasBase from './CanvasBase.vue'
import CanvasToolbar from './CanvasToolbar.vue'
import CanvasSelector from './CanvasSelector.vue'

export {
    CanvasBase,
    CanvasToolbar,
    CanvasSelector
}

export default function plugin(Vue) {
    Vue.component('CanvasBase',CanvasBase)
}