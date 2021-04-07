// https://www.w3schools.com/jsref/obj_mouseevent.asp
// http://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
var script$3 = {
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
      this.setHover(true);
    },
    // Handle hover
    mouseleave () {
      this.setHover(false);
    },

    setHover (value) {
      this.hover = value;
      // console.log('Update hover')
      // Tell parent
      // this.$emit('update:hover', value)
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "g",
    _vm._g(
      _vm._b(
        {
          staticClass: "canvas_base_element draggable",
          class: [
            _vm.selected && "selected",
            _vm.selecting && "selecting",
            _vm.hover && "hover"
          ],
          attrs: {
            transform: "translate(" + (_vm.x || 0) + "," + (_vm.y || 0) + ")"
          }
        },
        "g",
        _vm.$attrs,
        false
      ),
      _vm.$listeners
    ),
    [
      _vm._t("default", null, {
        hover: _vm.hover,
        selected: _vm.selected,
        selecting: _vm.selecting
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$3 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    false,
    undefined,
    undefined,
    undefined
  );

var script$2 = {
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

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm.enabled
    ? _c("g", { ref: "selector", staticClass: "CanvasSelector" }, [
        _c("rect", {
          staticClass: "CanvasSelector",
          attrs: {
            rx: "5",
            ry: "5",
            x: _vm._x,
            y: _vm._y,
            width: _vm._width,
            height: _vm._height
          }
        })
      ])
    : _vm._e()
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$2 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    undefined,
    undefined,
    undefined
  );

const KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
};

var script$1 = {
  components: {
    CanvasBaseElement: __vue_component__$3,
    CanvasSelector: __vue_component__$2
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
      this.selection = [];
      this.selecting = [];
    },

    selected (value) {
      // Tell parent
      this.$emit('selection', value);
    },

    selection (value) {
      // Tell parent
      this.$emit('update:selection', value);
    },

    selecting (value) {
      // Tell parent
      this.$emit('update:selecting', value);
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
      this.$emit('input', children);
    },

    // Mutations
    deleteSelected () {
      // Clone
      const newList = this.value.filter(elem => {
        return !this.selection.includes(elem)
      });

      // Tell parent
      this.$emit('delete', this.selection);
      this.$emit('update:value', newList);
    },

    // Internal state change only
    moveGroup ($event) {
      const { selection } = this;

      // Move all selected items
      selection.forEach(elem => {
        elem.x += $event.movementX;
        elem.y += $event.movementY;
      });
    },

    moveDone () {
      // Inform parent
      this.emitInput(this.value);
    },

    keydown (e) {
      this.pressedKeys.shift = e.shiftKey;
      this.pressedKeys.ctrl = e.ctrlKey;
      this.pressedKeys.alt = e.altKey;

      const { keyCode } = e;
      if (keyCode === 8) {
        this.deleteSelected();
        // vm.$emit('delete', vm.selection)
      }

      this.handleMove(e);
    },

    keyup (e) {
      this.pressedKeys.shift = e.shiftKey;
      this.pressedKeys.ctrl = e.ctrlKey;
      this.pressedKeys.alt = e.altKey;
    },

    handleMove (e) {
      // Handle move
      const { keyCode } = e;

      const MOVESPEED = 20;

      const moveSelection = (x = 0, y = 0) => {
        this.selection.map(element => {
          element.x += x;
          element.y += y;
        });
      };

      if (keyCode === KEYS.up) {
        moveSelection(0, -MOVESPEED);
      }

      if (keyCode === KEYS.right) {
        moveSelection(MOVESPEED, 0);
      }

      if (keyCode === KEYS.down) {
        moveSelection(0, MOVESPEED);
      }

      if (keyCode === KEYS.left) {
        moveSelection(-MOVESPEED, 0);
      }
    },

    selectItem (item) {
      // Clear selecting
      this.selecting = [];

      // Handle selection
      if (this.pressedKeys.shift) {
        // Toggle selection if already added
        const isSelected = this.selection.find(elem => elem === item);

        if (isSelected) {
          this.selection = this.selection.filter(elem => elem !== item);
        } else {
          this.selection.push(item);
        }
      } else {
        // New item?
        const isInSelection = this.selection.find(elem => elem === item);

        this.selection = isInSelection ? this.selection : [item];
      }
    },

    dblClick (item) {
      this.$emit('dblClick', item);
    },

    // onMousedownItem
    moveItem (e) {
      this.moveGroup(e);
    },

    moveItemEnd (e) {
      this.$refs.canvas.removeEventListener('mousemove', this.moveItem);
      this.$refs.canvas.removeEventListener('mouseup', this.moveItemEnd);
    },

    onMousedownItem (item) {
      this.$refs.canvas.addEventListener('mousemove', this.moveItem);
      this.$refs.canvas.addEventListener('mouseup', this.moveItemEnd);

      this.selectItem(item);
    },

    onMouseupItem (item) {
      // this.selectItem(item)
    },

    clearAll ($event) {
      this.selection = [];
      this.selecting = [];
    },

    mousedown ($event) {
      this.mouse.isDown = true;

      this.dragSelector = true;
      this.clearAll();
    },

    mouseup ($event) {
      this.mouse.isDown = false;
    },

    mousemove (e) {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
    },

    onUpdateHover (item, $event) {
    },

    drop (e) {
      // Tell parent
      this.$emit('drop', e);
    },

    onSelectFinish () {
      // Convert selecting to selection
      this.selection = this.selecting
        .map((elem, index) => elem ? this.value[index] : false)
        .filter(elem => elem);
    },

    onSelectWindow (s = { }) {
      const absBox = (element) => {
        const box = element.getBoundingClientRect();
        return {
          top: box.top + window.pageYOffset,
          left: box.left + window.pageXOffset,
          width: box.width,
          height: box.height
        }
      };

      const WINDOW = {
        left: 0,
        top: 0,
        width: 1000,
        height: 1000
      };

      const withinSelection = (s = WINDOW) => (b = WINDOW) =>
        (Math.abs((s.left - b.left) * 2 + s.width - b.width) < (s.width + b.width)) &&
            (Math.abs((s.top - b.top) * 2 + s.height - b.height) < (s.height + b.height));

      const selectables = this.$refs.child
        .map(VueComponent => VueComponent.$el)
        .map(absBox);

      // Detect matches in selectable elements
      const selecting = selectables
        .map((elem, index) => withinSelection(s)(elem));

      this.selecting = selecting;
    }
  }
};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "span",
    _vm._g(
      {
        ref: "canvas",
        staticClass: "CanvasBase",
        attrs: { tabindex: "-1" },
        on: {
          mousedown: _vm.mousedown,
          mouseup: _vm.mouseup,
          mousemove: _vm.mousemove,
          keydown: _vm.keydown,
          keyup: _vm.keyup
        }
      },
      _vm.$listeners
    ),
    [
      _c("div", { staticClass: "CanvasBase__overlay" }, [_vm._t("overlay")], 2),
      _vm._v(" "),
      _c(
        "svg",
        { attrs: { width: _vm.width, height: _vm.height } },
        [
          _vm._t("background"),
          _vm._v(" "),
          _vm._t("default"),
          _vm._v(" "),
          _c(
            "g",
            {
              staticClass: "content",
              attrs: { transform: "scale(" + _vm.scale + ")" }
            },
            [
              _c(
                "g",
                { staticClass: "children" },
                _vm._l(_vm.value, function(item, index) {
                  return _c(
                    "g",
                    { key: "child-" + index },
                    [
                      _c("CanvasBaseElement", {
                        ref: "child",
                        refInFor: true,
                        class: _vm.selecting[index] ? "selecting" : "",
                        attrs: {
                          x: item.x,
                          y: item.y,
                          selecting: _vm.selecting[index],
                          selected: !!_vm.selection.find(function(elem) {
                            return elem === item
                          }),
                          element: _vm.$refs.canvas
                        },
                        on: {
                          mousedown: function($event) {
                            $event.stopPropagation();
                            return _vm.onMousedownItem(item)
                          },
                          mouseup: function($event) {
                            return _vm.onMouseupItem(item)
                          }
                        },
                        nativeOn: {
                          dblclick: function($event) {
                            return _vm.dblClick(item)
                          }
                        },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "default",
                              fn: function(props) {
                                return [
                                  _vm._t(
                                    item.type,
                                    [
                                      _c("text", { attrs: { fill: "white" } }, [
                                        _vm._v(
                                          'slot with type "' +
                                            _vm._s(item.type) +
                                            '" not found'
                                        )
                                      ])
                                    ],
                                    null,
                                    Object.assign({}, props, { item: item })
                                  )
                                ]
                              }
                            }
                          ],
                          null,
                          true
                        )
                      })
                    ],
                    1
                  )
                }),
                0
              )
            ]
          ),
          _vm._v(" "),
          _vm.dragSelector
            ? _c("CanvasSelector", {
                attrs: { element: _vm.$refs.canvas },
                on: { input: _vm.onSelectWindow, finish: _vm.onSelectFinish }
              })
            : _vm._e()
        ],
        2
      )
    ]
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    undefined,
    undefined,
    undefined
  );

var script = {
  props: {
    selections: { type: Array, default: () => ([]) },
    scale: { type: Number, default: 1 },
    step: { type: Number, default: 0.1 }
  },

  methods: {
    // Toolbar
    setScale (factor, minZoom = 0.3) {
      // Clamp newScale
      const newScale = factor < minZoom ? minZoom : factor;

      // Tell parent
      this.$emit('update:scale', newScale);
      this.$emit('update:zoom', newScale * 100);
    },

    deltaZoom (step = 0) {
      const newScale = this.scale + step;
      this.setScale(newScale);
    },

    zoomIn () {
      this.deltaZoom(this.step);
    },

    zoomOut () {
      this.deltaZoom(-this.step);
    }
  }
};

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "CanvasToolbar" },
    [
      _vm._t("default"),
      _vm._v(" "),
      _vm.selections.length
        ? _c("div", { staticClass: "ml-2" }, [
            _vm._v(
              "\n    " + _vm._s(_vm.selections.length) + " items selected\n  "
            )
          ])
        : _vm._e(),
      _vm._v(" "),
      _c(
        "v-btn",
        {
          attrs: { icon: "" },
          on: {
            click: function($event) {
              return _vm.setScale(1)
            }
          }
        },
        [_c("v-icon", [_vm._v("aspect_ratio")])],
        1
      ),
      _vm._v(" "),
      _c(
        "v-btn",
        { attrs: { icon: "" }, on: { click: _vm.zoomIn } },
        [_c("v-icon", [_vm._v("zoom_in")])],
        1
      ),
      _vm._v(" "),
      _c(
        "v-btn",
        { attrs: { icon: "" }, on: { click: _vm.zoomOut } },
        [_c("v-icon", [_vm._v("zoom_out")])],
        1
      ),
      _vm._v(" "),
      _c("div", [_vm._v(_vm._s(Math.round(_vm.scale * 100)) + " %")])
    ],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

function plugin(Vue) {
    Vue.component('CanvasBase',__vue_component__$1);
}

export default plugin;
export { __vue_component__$1 as CanvasBase, __vue_component__$2 as CanvasSelector, __vue_component__ as CanvasToolbar };
