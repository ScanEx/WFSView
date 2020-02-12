'use strict';

function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function stop_propagation(fn) {
    return function (event) {
        event.stopPropagation();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.data !== data)
        text.data = data;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        callbacks.slice().forEach(fn => fn(event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
const seen_callbacks = new Set();
function flush() {
    do {
        // first, call beforeUpdate functions
        // and update components
        while (dirty_components.length) {
            const component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if ($$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(children(options.target));
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}

const parse_node = node => {
  let r = {
    name: node.localName
  };
  const attributes = {};

  for (const a of node.attributes) {
    const value = parseFloat(a.value);
    attributes[a.name] = isNaN(value) ? a.value : value;
  }

  if (Object.keys(attributes).length) {
    r.attributes = attributes;
  }

  const children = [];

  for (const n of node.children) {
    children.push(parse_node(n));
  }

  if (children.length) {
    r.children = children;
  } else if (node.textContent) {
    const value = parseFloat(node.textContent);
    r.value = isNaN(value) ? node.textContent : value;
  }

  return r;
};

const parse = xml => {
  const [root] = xml.children;
  return parse_node(root);
};

const uncap = str => `${str.substr(0, 1).toLowerCase()}${str.substr(1)}`;

const parseNode = node => {
  let r = {};

  for (const n of node.children) {
    r[uncap(n.name)] = n.value;
  }

  return r;
};

const toLayer = node => {
  let r = {};

  for (const n of node.children) {
    const {
      name
    } = n;

    if (name === 'Title') {
      r.title = n.value;
    }

    switch (name) {
      case 'Title':
      case 'Name':
        r[uncap(name)] = n.value;
        break;

      case 'Layer':
        if (r.children) {
          r.children.push(toLayer(n));
        } else {
          r.children = [toLayer(n)];
        }

        break;

      case 'CRS':
        if (r.crs) {
          r.crs.push(n.value);
        } else {
          r.crs = [n.value];
        }

        break;

      case 'EX_GeographicBoundingBox':
        r.exGeographicBoundingBox = parseNode(n);
        break;

      case 'BoundingBox':
        if (r.boundingBoxes) {
          r.boundingBoxes.push(n.attributes);
        } else {
          r.boundingBoxes = [n.attributes];
        }

        break;
    }
  }

  return r;
};

const toLayers = ({
  children
}) => {
  return children.reduce((a, n) => {
    switch (n.name) {
      case 'Capability':
        n.children.filter(x => x.name === 'Layer').map(toLayer).forEach(x => a.layers = a.layers ? a.layers.concat(x) : [x]);
        break;

      case 'Service':
        a = { ...a,
          ...parseNode(n)
        };
        break;
    }

    return a;
  }, {});
};

const toFeature = node => {
  let r = {};

  for (const n of node.children) {
    const {
      name
    } = n;

    switch (name) {
      case 'Title':
      case 'Name':
      case 'Abstract':
      case 'DefaultSRS':
        r[uncap(name)] = n.value;
        break;

      case 'OtherSRS':
        if (r.otherSRS) {
          r.otherSRS.push(n.value);
        } else {
          r.otherSRS = [n.value];
        }

        break;

      case 'WGS84BoundingBox':
        r.wgs84BoundingBox = parseNode(n);
        break;
    }
  }

  return r;
};

const toFeatures = ({
  children
}) => {
  return children.reduce((a, n) => {
    const {
      name
    } = n;

    switch (name) {
      case 'FeatureTypeList':
        n.children.filter(x => x.name === 'FeatureType').map(toFeature).forEach(x => a.features = a.features ? a.features.concat(x) : [x]);
        break;

      case 'ServiceIdentification':
        a = { ...a,
          ...parseNode(n)
        };
        break;
    }

    return a;
  }, []);
};

/* src\Feature.svelte generated by Svelte v3.18.1 */

function create_fragment(ctx) {
	let div;
	let i;
	let t0;
	let t1;
	let dispose;

	return {
		c() {
			div = element("div");
			i = element("i");
			t0 = space();
			t1 = text(/*title*/ ctx[1]);
			attr(i, "class", "scanex-svc-view-visible icon");
			toggle_class(i, "check-square", /*visible*/ ctx[0]);
			toggle_class(i, "square", !/*visible*/ ctx[0]);
			attr(div, "class", "feature");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, i);
			append(div, t0);
			append(div, t1);
			dispose = listen(i, "click", stop_propagation(/*toggleVisibility*/ ctx[2]));
		},
		p(ctx, [dirty]) {
			if (dirty & /*visible*/ 1) {
				toggle_class(i, "check-square", /*visible*/ ctx[0]);
			}

			if (dirty & /*visible*/ 1) {
				toggle_class(i, "square", !/*visible*/ ctx[0]);
			}

			if (dirty & /*title*/ 2) set_data(t1, /*title*/ ctx[1]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	const dispatch = createEventDispatcher();
	let { name = "" } = $$props;
	let { title = "" } = $$props;
	let { abstract = "" } = $$props;
	let { visible = false } = $$props;

	function toggleVisibility() {
		$$invalidate(0, visible = !visible);
		dispatch("change:visible", { title, name, abstract, visible });
	}

	$$self.$set = $$props => {
		if ("name" in $$props) $$invalidate(3, name = $$props.name);
		if ("title" in $$props) $$invalidate(1, title = $$props.title);
		if ("abstract" in $$props) $$invalidate(4, abstract = $$props.abstract);
		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
	};

	return [visible, title, toggleVisibility, name, abstract];
}

class Feature extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance, create_fragment, safe_not_equal, {
			name: 3,
			title: 1,
			abstract: 4,
			visible: 0
		});
	}
}

/* src\WfsLink.svelte generated by Svelte v3.18.1 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	return child_ctx;
}

// (19:8) {#each features as f}
function create_each_block(ctx) {
	let current;
	const feature_spread_levels = [/*f*/ ctx[5]];
	let feature_props = {};

	for (let i = 0; i < feature_spread_levels.length; i += 1) {
		feature_props = assign(feature_props, feature_spread_levels[i]);
	}

	const feature = new Feature({ props: feature_props });
	feature.$on("change:visible", /*change_visible_handler*/ ctx[4]);

	return {
		c() {
			create_component(feature.$$.fragment);
		},
		m(target, anchor) {
			mount_component(feature, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const feature_changes = (dirty & /*features*/ 2)
			? get_spread_update(feature_spread_levels, [get_spread_object(/*f*/ ctx[5])])
			: {};

			feature.$set(feature_changes);
		},
		i(local) {
			if (current) return;
			transition_in(feature.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(feature.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(feature, detaching);
		}
	};
}

function create_fragment$1(ctx) {
	let div2;
	let div0;
	let i;
	let t0;
	let t1;
	let t2;
	let div1;
	let current;
	let dispose;
	let each_value = /*features*/ ctx[1];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			i = element("i");
			t0 = space();
			t1 = text(/*title*/ ctx[0]);
			t2 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(i, "class", "icon close");
			attr(div0, "class", "header");
			attr(div1, "class", "content");
			attr(div2, "class", "scanex-svc-view-link");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div0, i);
			append(div0, t0);
			append(div0, t1);
			append(div2, t2);
			append(div2, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			current = true;
			dispose = listen(i, "click", /*click_handler*/ ctx[3]);
		},
		p(ctx, [dirty]) {
			if (!current || dirty & /*title*/ 1) set_data(t1, /*title*/ ctx[0]);

			if (dirty & /*features*/ 2) {
				each_value = /*features*/ ctx[1];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div1, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(div2);
			destroy_each(each_blocks, detaching);
			dispose();
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { title = "" } = $$props;
	let { features = [] } = $$props;
	const dispatch = createEventDispatcher();
	const click_handler = () => dispatch("close");

	function change_visible_handler(event) {
		bubble($$self, event);
	}

	$$self.$set = $$props => {
		if ("title" in $$props) $$invalidate(0, title = $$props.title);
		if ("features" in $$props) $$invalidate(1, features = $$props.features);
	};

	return [title, features, dispatch, click_handler, change_visible_handler];
}

class WfsLink extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { title: 0, features: 1 });
	}
}

/* src\Layer.svelte generated by Svelte v3.18.1 */

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[16] = list[i];
	child_ctx[18] = i;
	return child_ctx;
}

// (68:12) {#if hasChildren}
function create_if_block_1(ctx) {
	let i;

	return {
		c() {
			i = element("i");
			attr(i, "class", "scanex-svc-view-folder icon");
			toggle_class(i, "folder-open", /*expanded*/ ctx[2]);
			toggle_class(i, "folder", !/*expanded*/ ctx[2]);
		},
		m(target, anchor) {
			insert(target, i, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*expanded*/ 4) {
				toggle_class(i, "folder-open", /*expanded*/ ctx[2]);
			}

			if (dirty & /*expanded*/ 4) {
				toggle_class(i, "folder", !/*expanded*/ ctx[2]);
			}
		},
		d(detaching) {
			if (detaching) detach(i);
		}
	};
}

// (73:4) {#if Array.isArray(children) && children.length > 0}
function create_if_block(ctx) {
	let div;
	let current;
	let each_value = /*children*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "children");
			toggle_class(div, "collapsed", !/*expanded*/ ctx[2]);
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*children, onChangeState*/ 257) {
				each_value = /*children*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (dirty & /*expanded*/ 4) {
				toggle_class(div, "collapsed", !/*expanded*/ ctx[2]);
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
		}
	};
}

// (75:8) {#each children as layer, i}
function create_each_block$1(ctx) {
	let current;
	const layer_spread_levels = [/*layer*/ ctx[16]];

	function change_state_handler(...args) {
		return /*change_state_handler*/ ctx[15](/*i*/ ctx[18], ...args);
	}

	let layer_props = {};

	for (let i = 0; i < layer_spread_levels.length; i += 1) {
		layer_props = assign(layer_props, layer_spread_levels[i]);
	}

	const layer = new Layer({ props: layer_props });
	layer.$on("change:visible", /*change_visible_handler*/ ctx[14]);
	layer.$on("change:state", change_state_handler);

	return {
		c() {
			create_component(layer.$$.fragment);
		},
		m(target, anchor) {
			mount_component(layer, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			const layer_changes = (dirty & /*children*/ 1)
			? get_spread_update(layer_spread_levels, [get_spread_object(/*layer*/ ctx[16])])
			: {};

			layer.$set(layer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(layer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(layer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(layer, detaching);
		}
	};
}

function create_fragment$2(ctx) {
	let div1;
	let div0;
	let i;
	let t0;
	let t1;
	let t2;
	let t3;
	let show_if = Array.isArray(/*children*/ ctx[0]) && /*children*/ ctx[0].length > 0;
	let current;
	let dispose;
	let if_block0 = /*hasChildren*/ ctx[5] && create_if_block_1(ctx);
	let if_block1 = show_if && create_if_block(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			i = element("i");
			t0 = space();
			if (if_block0) if_block0.c();
			t1 = space();
			t2 = text(/*title*/ ctx[1]);
			t3 = space();
			if (if_block1) if_block1.c();
			attr(i, "class", "scanex-svc-view-visible icon");
			toggle_class(i, "check-square", /*state*/ ctx[3] === 1);
			toggle_class(i, "square", /*state*/ ctx[3] === 0);
			toggle_class(i, "minus-square", /*state*/ ctx[3] === -1);
			attr(div0, "class", "header");
			attr(div1, "class", "layer");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, i);
			append(div0, t0);
			if (if_block0) if_block0.m(div0, null);
			append(div0, t1);
			append(div0, t2);
			append(div1, t3);
			if (if_block1) if_block1.m(div1, null);
			current = true;

			dispose = [
				listen(i, "click", stop_propagation(/*toggleVisibility*/ ctx[7])),
				listen(div0, "mouseenter", stop_propagation(/*mouseenter_handler*/ ctx[12])),
				listen(div0, "mouseleave", stop_propagation(/*mouseleave_handler*/ ctx[13])),
				listen(div0, "click", stop_propagation(/*toggleChildren*/ ctx[6]))
			];
		},
		p(ctx, [dirty]) {
			if (dirty & /*state*/ 8) {
				toggle_class(i, "check-square", /*state*/ ctx[3] === 1);
			}

			if (dirty & /*state*/ 8) {
				toggle_class(i, "square", /*state*/ ctx[3] === 0);
			}

			if (dirty & /*state*/ 8) {
				toggle_class(i, "minus-square", /*state*/ ctx[3] === -1);
			}

			if (/*hasChildren*/ ctx[5]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(div0, t1);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (!current || dirty & /*title*/ 2) set_data(t2, /*title*/ ctx[1]);
			if (dirty & /*children*/ 1) show_if = Array.isArray(/*children*/ ctx[0]) && /*children*/ ctx[0].length > 0;

			if (show_if) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
					transition_in(if_block1, 1);
				} else {
					if_block1 = create_if_block(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(div1, null);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block1);
			current = true;
		},
		o(local) {
			transition_out(if_block1);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			run_all(dispose);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { title = "" } = $$props;
	let { name = "" } = $$props;
	let { children = [] } = $$props;
	let { visible = false } = $$props;
	let expanded = false;
	let state = 0;
	let infoVisible = false;
	const dispatch = createEventDispatcher();

	function toggleChildren() {
		$$invalidate(2, expanded = !expanded);
	}

	function toggleVisibility() {
		$$invalidate(9, visible = !visible);
		dispatch("change:visible", { title, name, visible });
		dispatch("change:state", { title, name, visible });
	}

	function onChangeState(detail, i) {
		if (hasChildren) {
			$$invalidate(0, children[i].visible = detail.visible, children);

			if (children.every(({ visible }) => visible === true)) {
				$$invalidate(9, visible = true);
			} else if (children.every(({ visible }) => visible === false)) {
				$$invalidate(9, visible = false);
			} else {
				$$invalidate(9, visible = undefined);
			}

			dispatch("change:state", { title, name, visible });
		}
	}

	const mouseenter_handler = () => $$invalidate(4, infoVisible = true);
	const mouseleave_handler = () => $$invalidate(4, infoVisible = false);

	function change_visible_handler(event) {
		bubble($$self, event);
	}

	const change_state_handler = (i, { detail }) => onChangeState(detail, i);

	$$self.$set = $$props => {
		if ("title" in $$props) $$invalidate(1, title = $$props.title);
		if ("name" in $$props) $$invalidate(10, name = $$props.name);
		if ("children" in $$props) $$invalidate(0, children = $$props.children);
		if ("visible" in $$props) $$invalidate(9, visible = $$props.visible);
	};

	let hasChildren;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*visible, children*/ 513) {
			 {
				if (visible === true) {
					$$invalidate(3, state = 1);
				} else if (visible === false) {
					$$invalidate(3, state = 0);
				} else {
					$$invalidate(3, state = -1);
				}

				if (Array.isArray(children) && typeof visible !== "undefined") {
					for (let i = 0; i < children.length; i++) {
						$$invalidate(0, children[i].visible = visible, children);
						dispatch("change:visible", { ...children[i], visible });
					}
				}
			}
		}

		if ($$self.$$.dirty & /*children*/ 1) {
			 $$invalidate(5, hasChildren = Array.isArray(children) && children.length > 0);
		}
	};

	return [
		children,
		title,
		expanded,
		state,
		infoVisible,
		hasChildren,
		toggleChildren,
		toggleVisibility,
		onChangeState,
		visible,
		name,
		dispatch,
		mouseenter_handler,
		mouseleave_handler,
		change_visible_handler,
		change_state_handler
	];
}

class Layer extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			title: 1,
			name: 10,
			children: 0,
			visible: 9
		});
	}
}

/* src\WmsLink.svelte generated by Svelte v3.18.1 */

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	return child_ctx;
}

// (19:8) {#each layers as layer}
function create_each_block$2(ctx) {
	let current;
	const layer_spread_levels = [/*layer*/ ctx[6]];
	let layer_props = {};

	for (let i = 0; i < layer_spread_levels.length; i += 1) {
		layer_props = assign(layer_props, layer_spread_levels[i]);
	}

	const layer = new Layer({ props: layer_props });
	layer.$on("change:visible", /*change_visible_handler*/ ctx[4]);
	layer.$on("show:info", /*show_info_handler*/ ctx[5]);

	return {
		c() {
			create_component(layer.$$.fragment);
		},
		m(target, anchor) {
			mount_component(layer, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const layer_changes = (dirty & /*layers*/ 2)
			? get_spread_update(layer_spread_levels, [get_spread_object(/*layer*/ ctx[6])])
			: {};

			layer.$set(layer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(layer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(layer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(layer, detaching);
		}
	};
}

function create_fragment$3(ctx) {
	let div2;
	let div0;
	let i;
	let t0;
	let t1;
	let t2;
	let div1;
	let current;
	let dispose;
	let each_value = /*layers*/ ctx[1];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			i = element("i");
			t0 = space();
			t1 = text(/*title*/ ctx[0]);
			t2 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(i, "class", "icon close");
			attr(div0, "class", "header");
			attr(div1, "class", "content");
			attr(div2, "class", "scanex-svc-view-link");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div0, i);
			append(div0, t0);
			append(div0, t1);
			append(div2, t2);
			append(div2, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			current = true;
			dispose = listen(i, "click", /*click_handler*/ ctx[3]);
		},
		p(ctx, [dirty]) {
			if (!current || dirty & /*title*/ 1) set_data(t1, /*title*/ ctx[0]);

			if (dirty & /*layers*/ 2) {
				each_value = /*layers*/ ctx[1];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div1, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(div2);
			destroy_each(each_blocks, detaching);
			dispose();
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let { title = "" } = $$props;
	let { layers = [] } = $$props;
	const dispatch = createEventDispatcher();
	const click_handler = () => dispatch("close");

	function change_visible_handler(event) {
		bubble($$self, event);
	}

	function show_info_handler(event) {
		bubble($$self, event);
	}

	$$self.$set = $$props => {
		if ("title" in $$props) $$invalidate(0, title = $$props.title);
		if ("layers" in $$props) $$invalidate(1, layers = $$props.layers);
	};

	return [
		title,
		layers,
		dispatch,
		click_handler,
		change_visible_handler,
		show_info_handler
	];
}

class WmsLink extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { title: 0, layers: 1 });
	}
}

/* src\View.svelte generated by Svelte v3.18.1 */

function create_fragment$4(ctx) {
	let div2;
	let div0;
	let button0;
	let t1;
	let button1;
	let t3;
	let div1;
	let dispose;

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			button0 = element("button");
			button0.textContent = "WFS";
			t1 = space();
			button1 = element("button");
			button1.textContent = "WMS";
			t3 = space();
			div1 = element("div");
			attr(div0, "class", "header");
			attr(div1, "class", "links");
			attr(div2, "class", "scanex-svc-view");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div0, button0);
			append(div0, t1);
			append(div0, button1);
			append(div2, t3);
			append(div2, div1);
			/*div1_binding*/ ctx[4](div1);

			dispose = [
				listen(button0, "click", /*addWFS*/ ctx[1]),
				listen(button1, "click", /*addWMS*/ ctx[2])
			];
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div2);
			/*div1_binding*/ ctx[4](null);
			run_all(dispose);
		}
	};
}

let proxy = "//maps.kosmosnimki.ru/proxy";

function addLink(url) {
	return new Promise((resolve, reject) => {
			try {
				const xhr = new XMLHttpRequest();

				xhr.addEventListener("load", () => {
					if (xhr.status === 200) {
						resolve(parse(xhr.responseXML));
					} else {
						reject(xhr);
					}
				});

				xhr.addEventListener("error", e => {
					reject(e);
				});

				xhr.open("GET", `${proxy}?${encodeURIComponent(url)}`);
				xhr.send();
			} catch(e) {
				reject(e);
			}
		});
}

function instance$4($$self, $$props, $$invalidate) {
	let links;
	let info;

	async function addWFS() {
		const value = prompt("Добавить ссылку на WFS-сервис");

		if (value) {
			const url = new URL(value);

			if (!url.searchParams.has("service")) {
				url.searchParams.append("service", "WFS");
			}

			if (!url.searchParams.has("request")) {
				url.searchParams.append("request", "GetCapabilities");
			}

			if (!url.searchParams.has("version")) {
				url.searchParams.append("version", "1.3.0");
			}

			const data = await addLink(url.toString());
			const { title, features } = toFeatures(data);

			const lnk = new WfsLink({
					target: links,
					props: { features, title }
				});

			lnk.$on("close", () => lnk.$destroy());

			lnk.$on("change:visible", ({ detail }) => {
				console.log(detail);
			});
		}
	}

	async function addWMS() {
		const value = prompt("Добавить ссылку на WMS-сервис");

		if (value) {
			const url = new URL(value);

			if (!url.searchParams.has("service")) {
				url.searchParams.append("service", "WMS");
			}

			if (!url.searchParams.has("request")) {
				url.searchParams.append("request", "GetCapabilities");
			}

			if (!url.searchParams.has("version")) {
				url.searchParams.append("version", "1.3.0");
			}

			const data = await addLink(url.toString());
			const { title, layers } = toLayers(data);
			const lnk = new WmsLink({ target: links, props: { layers, title } });
			lnk.$on("close", () => lnk.$destroy());

			lnk.$on("change:visible", ({ detail }) => {
				console.log(detail);
			});
		}
	}

	function div1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(0, links = $$value);
		});
	}

	return [links, addWFS, addWMS, info, div1_binding];
}

class View extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});
	}
}

module.exports = View;
//# sourceMappingURL=main.cjs.js.map
