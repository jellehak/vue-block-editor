import * as components from './index.js'

if (typeof Vue !== 'undefined') {
  for (const name in components) {
    Vue.component(name, components[name])
  }
}
// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

