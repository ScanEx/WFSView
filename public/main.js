(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var isPure = false;

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.4',
	  mode:  'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }
	  if (O === global_1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

	var toString$1 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return nativeGetOwnPropertyNames(it);
	  } catch (error) {
	    return windowNames.slice();
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$5 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : nativeGetOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$5
	};

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var f$6 = wellKnownSymbol;

	var wellKnownSymbolWrapped = {
		f: f$6
	};

	var defineProperty = objectDefineProperty.f;

	var defineWellKnownSymbol = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
	    value: wellKnownSymbolWrapped.f(NAME)
	  });
	};

	var defineProperty$1 = objectDefineProperty.f;



	var TO_STRING_TAG = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
	    defineProperty$1(it, TO_STRING_TAG, { configurable: true, value: TAG });
	  }
	};

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push.call(target, value); // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};

	var $forEach = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(SYMBOL);
	var ObjectPrototype = Object[PROTOTYPE$1];
	var $Symbol = global_1.Symbol;
	var $stringify = getBuiltIn('JSON', 'stringify');
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty$1 = objectDefineProperty.f;
	var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');
	var WellKnownSymbolsStore$1 = shared('wks');
	var QObject = global_1.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty$1({}, 'a', {
	    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
	  nativeDefineProperty$1(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
	    nativeDefineProperty$1(ObjectPrototype, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty$1;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
	  setInternalState(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var isSymbol = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return Object(it) instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject(O);
	  var key = toPrimitive(P, true);
	  anObject(Attributes);
	  if (has(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty$1(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach(keys, function (key) {
	    if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(V) {
	  var P = toPrimitive(V, true);
	  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
	  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPrimitive(P, true);
	  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
	  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
	  var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
	      result.push(AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.github.io/ecma262/#sec-symbol-constructor
	if (!nativeSymbol) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
	    return wrap(tag, description);
	  };

	  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
	    return getInternalState(this).tag;
	  });

	  redefine($Symbol, 'withoutSetter', function (description) {
	    return wrap(uid(description), description);
	  });

	  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
	  objectDefineProperty.f = $defineProperty;
	  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
	  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

	  wellKnownSymbolWrapped.f = function (name) {
	    return wrap(wellKnownSymbol(name), name);
	  };

	  if (descriptors) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState(this).description;
	      }
	    });
	    {
	      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
	    }
	  }
	}

	_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
	  Symbol: $Symbol
	});

	$forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
	  defineWellKnownSymbol(name);
	});

	_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
	  // `Symbol.for` method
	  // https://tc39.github.io/ecma262/#sec-symbol.for
	  'for': function (key) {
	    var string = String(key);
	    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = $Symbol(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  },
	  // `Symbol.keyFor` method
	  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
	    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
	  },
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
	  // `Object.create` method
	  // https://tc39.github.io/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // `Object.getOwnPropertySymbols` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return objectGetOwnPropertySymbols.f(toObject(it));
	  }
	});

	// `JSON.stringify` method behavior with symbols
	// https://tc39.github.io/ecma262/#sec-json.stringify
	if ($stringify) {
	  var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
	    var symbol = $Symbol();
	    // MS Edge converts symbol values to JSON as {}
	    return $stringify([symbol]) != '[null]'
	      // WebKit converts symbol values to JSON as null
	      || $stringify({ a: symbol }) != '{}'
	      // V8 throws on boxed symbols
	      || $stringify(Object(symbol)) != '{}';
	  });

	  _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
	    // eslint-disable-next-line no-unused-vars
	    stringify: function stringify(it, replacer, space) {
	      var args = [it];
	      var index = 1;
	      var $replacer;
	      while (arguments.length > index) args.push(arguments[index++]);
	      $replacer = replacer;
	      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	      if (!isArray(replacer)) replacer = function (key, value) {
	        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	        if (!isSymbol(value)) return value;
	      };
	      args[1] = replacer;
	      return $stringify.apply(null, args);
	    }
	  });
	}

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
	if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
	  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
	}
	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys[HIDDEN] = true;

	var defineProperty$2 = objectDefineProperty.f;


	var NativeSymbol = global_1.Symbol;

	if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
	  // Safari 12 bug
	  NativeSymbol().description !== undefined
	)) {
	  var EmptyStringDescriptionStore = {};
	  // wrap Symbol constructor for correct work with undefined description
	  var SymbolWrapper = function Symbol() {
	    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var result = this instanceof SymbolWrapper
	      ? new NativeSymbol(description)
	      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
	      : description === undefined ? NativeSymbol() : NativeSymbol(description);
	    if (description === '') EmptyStringDescriptionStore[result] = true;
	    return result;
	  };
	  copyConstructorProperties(SymbolWrapper, NativeSymbol);
	  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
	  symbolPrototype.constructor = SymbolWrapper;

	  var symbolToString = symbolPrototype.toString;
	  var native = String(NativeSymbol('test')) == 'Symbol(test)';
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  defineProperty$2(symbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = isObject(this) ? this.valueOf() : this;
	      var string = symbolToString.call(symbol);
	      if (has(EmptyStringDescriptionStore, symbol)) return '';
	      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  _export({ global: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	// `Symbol.asyncIterator` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.asynciterator
	defineWellKnownSymbol('asyncIterator');

	// `Symbol.hasInstance` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.hasinstance
	defineWellKnownSymbol('hasInstance');

	// `Symbol.isConcatSpreadable` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
	defineWellKnownSymbol('isConcatSpreadable');

	// `Symbol.iterator` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.iterator
	defineWellKnownSymbol('iterator');

	// `Symbol.match` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.match
	defineWellKnownSymbol('match');

	// `Symbol.matchAll` well-known symbol
	defineWellKnownSymbol('matchAll');

	// `Symbol.replace` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.replace
	defineWellKnownSymbol('replace');

	// `Symbol.search` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.search
	defineWellKnownSymbol('search');

	// `Symbol.species` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.species
	defineWellKnownSymbol('species');

	// `Symbol.split` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.split
	defineWellKnownSymbol('split');

	// `Symbol.toPrimitive` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.toprimitive
	defineWellKnownSymbol('toPrimitive');

	// `Symbol.toStringTag` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.tostringtag
	defineWellKnownSymbol('toStringTag');

	// `Symbol.unscopables` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.unscopables
	defineWellKnownSymbol('unscopables');

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var min$2 = Math.min;

	// `Array.prototype.copyWithin` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
	var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
	  var O = toObject(this);
	  var len = toLength(O.length);
	  var to = toAbsoluteIndex(target, len);
	  var from = toAbsoluteIndex(start, len);
	  var end = arguments.length > 2 ? arguments[2] : undefined;
	  var count = min$2((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
	  var inc = 1;
	  if (from < to && to < from + count) {
	    inc = -1;
	    from += count - 1;
	    to += count - 1;
	  }
	  while (count-- > 0) {
	    if (from in O) O[to] = O[from];
	    else delete O[to];
	    to += inc;
	    from += inc;
	  } return O;
	};

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	// `Array.prototype.copyWithin` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
	_export({ target: 'Array', proto: true }, {
	  copyWithin: arrayCopyWithin
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('copyWithin');

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var defineProperty$3 = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty$3(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var $every = arrayIteration.every;



	var STRICT_METHOD = arrayMethodIsStrict('every');
	var USES_TO_LENGTH = arrayMethodUsesToLength('every');

	// `Array.prototype.every` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.every
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD || !USES_TO_LENGTH }, {
	  every: function every(callbackfn /* , thisArg */) {
	    return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// `Array.prototype.fill` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.fill
	var arrayFill = function fill(value /* , start = 0, end = @length */) {
	  var O = toObject(this);
	  var length = toLength(O.length);
	  var argumentsLength = arguments.length;
	  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
	  var end = argumentsLength > 2 ? arguments[2] : undefined;
	  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
	  while (endPos > index) O[index++] = value;
	  return O;
	};

	// `Array.prototype.fill` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.fill
	_export({ target: 'Array', proto: true }, {
	  fill: arrayFill
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('fill');

	var $filter = arrayIteration.filter;



	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
	// Edge 14- issue
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('filter');

	// `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$1 }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $find = arrayIteration.find;



	var FIND = 'find';
	var SKIPS_HOLES = true;

	var USES_TO_LENGTH$2 = arrayMethodUsesToLength(FIND);

	// Shouldn't skip holes
	if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

	// `Array.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.find
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH$2 }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND);

	var $findIndex = arrayIteration.findIndex;



	var FIND_INDEX = 'findIndex';
	var SKIPS_HOLES$1 = true;

	var USES_TO_LENGTH$3 = arrayMethodUsesToLength(FIND_INDEX);

	// Shouldn't skip holes
	if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES$1 = false; });

	// `Array.prototype.findIndex` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 || !USES_TO_LENGTH$3 }, {
	  findIndex: function findIndex(callbackfn /* , that = undefined */) {
	    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND_INDEX);

	// `FlattenIntoArray` abstract operation
	// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
	var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
	  var targetIndex = start;
	  var sourceIndex = 0;
	  var mapFn = mapper ? functionBindContext(mapper, thisArg, 3) : false;
	  var element;

	  while (sourceIndex < sourceLen) {
	    if (sourceIndex in source) {
	      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

	      if (depth > 0 && isArray(element)) {
	        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
	      } else {
	        if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
	        target[targetIndex] = element;
	      }

	      targetIndex++;
	    }
	    sourceIndex++;
	  }
	  return targetIndex;
	};

	var flattenIntoArray_1 = flattenIntoArray;

	// `Array.prototype.flat` method
	// https://github.com/tc39/proposal-flatMap
	_export({ target: 'Array', proto: true }, {
	  flat: function flat(/* depthArg = 1 */) {
	    var depthArg = arguments.length ? arguments[0] : undefined;
	    var O = toObject(this);
	    var sourceLen = toLength(O.length);
	    var A = arraySpeciesCreate(O, 0);
	    A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
	    return A;
	  }
	});

	// `Array.prototype.flatMap` method
	// https://github.com/tc39/proposal-flatMap
	_export({ target: 'Array', proto: true }, {
	  flatMap: function flatMap(callbackfn /* , thisArg */) {
	    var O = toObject(this);
	    var sourceLen = toLength(O.length);
	    var A;
	    aFunction$1(callbackfn);
	    A = arraySpeciesCreate(O, 0);
	    A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    return A;
	  }
	});

	var $forEach$1 = arrayIteration.forEach;



	var STRICT_METHOD$1 = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH$4 = arrayMethodUsesToLength('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = (!STRICT_METHOD$1 || !USES_TO_LENGTH$4) ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (error) {
	    var returnMethod = iterator['return'];
	    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
	    throw error;
	  }
	};

	var iterators = {};

	var ITERATOR = wellKnownSymbol('iterator');
	var ArrayPrototype$1 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR] === it);
	};

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG$1] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	var ITERATOR$1 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$1]
	    || it['@@iterator']
	    || iterators[classof(it)];
	};

	// `Array.from` method implementation
	// https://tc39.github.io/ecma262/#sec-array.from
	var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject(arrayLike);
	  var C = typeof this == 'function' ? this : Array;
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
	    iterator = iteratorMethod.call(O);
	    next = iterator.next;
	    result = new C();
	    for (;!(step = next.call(iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty(result, index, value);
	    }
	  } else {
	    length = toLength(O.length);
	    result = new C(length);
	    for (;length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty(result, index, value);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$2] = function () {
	    return this;
	  };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$2] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.github.io/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: arrayFrom
	});

	var $includes = arrayIncludes.includes;



	var USES_TO_LENGTH$5 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes
	_export({ target: 'Array', proto: true, forced: !USES_TO_LENGTH$5 }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('includes');

	var $indexOf = arrayIncludes.indexOf;



	var nativeIndexOf = [].indexOf;

	var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var STRICT_METHOD$2 = arrayMethodIsStrict('indexOf');
	var USES_TO_LENGTH$6 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$2 || !USES_TO_LENGTH$6 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? nativeIndexOf.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var ObjectPrototype$1 = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype$1 : null;
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	var returnThis = function () { return this; };

	// `%IteratorPrototype%` object
	// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	if (IteratorPrototype == undefined) IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	if ( !has(IteratorPrototype, ITERATOR$3)) {
	  createNonEnumerableProperty(IteratorPrototype, ITERATOR$3, returnThis);
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis$1 = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  } return it;
	};

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$4 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$2 = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$4]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
	      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
	          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    INCORRECT_VALUES_NAME = true;
	    defaultIterator = function values() { return nativeIterator.call(this); };
	  }

	  // define iterator
	  if ( IterablePrototype[ITERATOR$4] !== defaultIterator) {
	    createNonEnumerableProperty(IterablePrototype, ITERATOR$4, defaultIterator);
	  }
	  iterators[NAME] = defaultIterator;

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
	  }

	  return methods;
	};

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$1 = internalState.set;
	var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.github.io/ecma262/#sec-createarrayiterator
	var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState$1(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$1(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return { value: undefined, done: true };
	  }
	  if (kind == 'keys') return { value: index, done: false };
	  if (kind == 'values') return { value: target[index], done: false };
	  return { value: [index, target[index]], done: false };
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
	iterators.Arguments = iterators.Array;

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	var nativeJoin = [].join;

	var ES3_STRINGS = indexedObject != Object;
	var STRICT_METHOD$3 = arrayMethodIsStrict('join', ',');

	// `Array.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.join
	_export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$3 }, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var min$3 = Math.min;
	var nativeLastIndexOf = [].lastIndexOf;
	var NEGATIVE_ZERO$1 = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
	var STRICT_METHOD$4 = arrayMethodIsStrict('lastIndexOf');
	// For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method
	var USES_TO_LENGTH$7 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });
	var FORCED$1 = NEGATIVE_ZERO$1 || !STRICT_METHOD$4 || !USES_TO_LENGTH$7;

	// `Array.prototype.lastIndexOf` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
	var arrayLastIndexOf = FORCED$1 ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
	  // convert -0 to +0
	  if (NEGATIVE_ZERO$1) return nativeLastIndexOf.apply(this, arguments) || 0;
	  var O = toIndexedObject(this);
	  var length = toLength(O.length);
	  var index = length - 1;
	  if (arguments.length > 1) index = min$3(index, toInteger(arguments[1]));
	  if (index < 0) index = length + index;
	  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
	  return -1;
	} : nativeLastIndexOf;

	// `Array.prototype.lastIndexOf` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
	_export({ target: 'Array', proto: true, forced: arrayLastIndexOf !== [].lastIndexOf }, {
	  lastIndexOf: arrayLastIndexOf
	});

	var $map = arrayIteration.map;



	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('map');
	// FF49- issue
	var USES_TO_LENGTH$8 = arrayMethodUsesToLength('map');

	// `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$8 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var ISNT_GENERIC = fails(function () {
	  function F() { /* empty */ }
	  return !(Array.of.call(F) instanceof F);
	});

	// `Array.of` method
	// https://tc39.github.io/ecma262/#sec-array.of
	// WebKit Array.of isn't generic
	_export({ target: 'Array', stat: true, forced: ISNT_GENERIC }, {
	  of: function of(/* ...args */) {
	    var index = 0;
	    var argumentsLength = arguments.length;
	    var result = new (typeof this == 'function' ? this : Array)(argumentsLength);
	    while (argumentsLength > index) createProperty(result, index, arguments[index++]);
	    result.length = argumentsLength;
	    return result;
	  }
	});

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod$2 = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aFunction$1(callbackfn);
	    var O = toObject(that);
	    var self = indexedObject(O);
	    var length = toLength(O.length);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }
	      index += i;
	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw TypeError('Reduce of empty array with no initial value');
	      }
	    }
	    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }
	    return memo;
	  };
	};

	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
	  left: createMethod$2(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
	  right: createMethod$2(true)
	};

	var $reduce = arrayReduce.left;



	var STRICT_METHOD$5 = arrayMethodIsStrict('reduce');
	var USES_TO_LENGTH$9 = arrayMethodUsesToLength('reduce', { 1: 0 });

	// `Array.prototype.reduce` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$5 || !USES_TO_LENGTH$9 }, {
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $reduceRight = arrayReduce.right;



	var STRICT_METHOD$6 = arrayMethodIsStrict('reduceRight');
	// For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method
	var USES_TO_LENGTH$a = arrayMethodUsesToLength('reduce', { 1: 0 });

	// `Array.prototype.reduceRight` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$6 || !USES_TO_LENGTH$a }, {
	  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
	    return $reduceRight(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH$b = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

	var SPECIES$2 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$b }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$2];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var $some = arrayIteration.some;



	var STRICT_METHOD$7 = arrayMethodIsStrict('some');
	var USES_TO_LENGTH$c = arrayMethodUsesToLength('some');

	// `Array.prototype.some` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.some
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$7 || !USES_TO_LENGTH$c }, {
	  some: function some(callbackfn /* , thisArg */) {
	    return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var SPECIES$3 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$3]) {
	    defineProperty(Constructor, SPECIES$3, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	// `Array[@@species]` getter
	// https://tc39.github.io/ecma262/#sec-get-array-@@species
	setSpecies('Array');

	var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('splice');
	var USES_TO_LENGTH$d = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

	var max$2 = Math.max;
	var min$4 = Math.min;
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 || !USES_TO_LENGTH$d }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject(this);
	    var len = toLength(O.length);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$4(max$2(toInteger(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }
	    A = arraySpeciesCreate(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	// this method was added to unscopables after implementation
	// in popular engines, so it's moved to a separate module


	addToUnscopables('flat');

	// this method was added to unscopables after implementation
	// in popular engines, so it's moved to a separate module


	addToUnscopables('flatMap');

	var arrayBufferNative = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';

	var redefineAll = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);
	  return target;
	};

	var anInstance = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) {
	    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	  } return it;
	};

	// `ToIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-toindex
	var toIndex = function (it) {
	  if (it === undefined) return 0;
	  var number = toInteger(it);
	  var length = toLength(number);
	  if (number !== length) throw RangeError('Wrong length or index');
	  return length;
	};

	// IEEE754 conversions based on https://github.com/feross/ieee754
	// eslint-disable-next-line no-shadow-restricted-names
	var Infinity$1 = 1 / 0;
	var abs = Math.abs;
	var pow = Math.pow;
	var floor$1 = Math.floor;
	var log = Math.log;
	var LN2 = Math.LN2;

	var pack = function (number, mantissaLength, bytes) {
	  var buffer = new Array(bytes);
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
	  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
	  var index = 0;
	  var exponent, mantissa, c;
	  number = abs(number);
	  // eslint-disable-next-line no-self-compare
	  if (number != number || number === Infinity$1) {
	    // eslint-disable-next-line no-self-compare
	    mantissa = number != number ? 1 : 0;
	    exponent = eMax;
	  } else {
	    exponent = floor$1(log(number) / LN2);
	    if (number * (c = pow(2, -exponent)) < 1) {
	      exponent--;
	      c *= 2;
	    }
	    if (exponent + eBias >= 1) {
	      number += rt / c;
	    } else {
	      number += rt * pow(2, 1 - eBias);
	    }
	    if (number * c >= 2) {
	      exponent++;
	      c /= 2;
	    }
	    if (exponent + eBias >= eMax) {
	      mantissa = 0;
	      exponent = eMax;
	    } else if (exponent + eBias >= 1) {
	      mantissa = (number * c - 1) * pow(2, mantissaLength);
	      exponent = exponent + eBias;
	    } else {
	      mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
	      exponent = 0;
	    }
	  }
	  for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
	  exponent = exponent << mantissaLength | mantissa;
	  exponentLength += mantissaLength;
	  for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
	  buffer[--index] |= sign * 128;
	  return buffer;
	};

	var unpack = function (buffer, mantissaLength) {
	  var bytes = buffer.length;
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var nBits = exponentLength - 7;
	  var index = bytes - 1;
	  var sign = buffer[index--];
	  var exponent = sign & 127;
	  var mantissa;
	  sign >>= 7;
	  for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
	  mantissa = exponent & (1 << -nBits) - 1;
	  exponent >>= -nBits;
	  nBits += mantissaLength;
	  for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
	  if (exponent === 0) {
	    exponent = 1 - eBias;
	  } else if (exponent === eMax) {
	    return mantissa ? NaN : sign ? -Infinity$1 : Infinity$1;
	  } else {
	    mantissa = mantissa + pow(2, mantissaLength);
	    exponent = exponent - eBias;
	  } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
	};

	var ieee754 = {
	  pack: pack,
	  unpack: unpack
	};

	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var defineProperty$4 = objectDefineProperty.f;




	var getInternalState$2 = internalState.get;
	var setInternalState$2 = internalState.set;
	var ARRAY_BUFFER = 'ArrayBuffer';
	var DATA_VIEW = 'DataView';
	var PROTOTYPE$2 = 'prototype';
	var WRONG_LENGTH = 'Wrong length';
	var WRONG_INDEX = 'Wrong index';
	var NativeArrayBuffer = global_1[ARRAY_BUFFER];
	var $ArrayBuffer = NativeArrayBuffer;
	var $DataView = global_1[DATA_VIEW];
	var $DataViewPrototype = $DataView && $DataView[PROTOTYPE$2];
	var ObjectPrototype$2 = Object.prototype;
	var RangeError$1 = global_1.RangeError;

	var packIEEE754 = ieee754.pack;
	var unpackIEEE754 = ieee754.unpack;

	var packInt8 = function (number) {
	  return [number & 0xFF];
	};

	var packInt16 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF];
	};

	var packInt32 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
	};

	var unpackInt32 = function (buffer) {
	  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
	};

	var packFloat32 = function (number) {
	  return packIEEE754(number, 23, 4);
	};

	var packFloat64 = function (number) {
	  return packIEEE754(number, 52, 8);
	};

	var addGetter = function (Constructor, key) {
	  defineProperty$4(Constructor[PROTOTYPE$2], key, { get: function () { return getInternalState$2(this)[key]; } });
	};

	var get$1 = function (view, count, index, isLittleEndian) {
	  var intIndex = toIndex(index);
	  var store = getInternalState$2(view);
	  if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
	  var bytes = getInternalState$2(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = bytes.slice(start, start + count);
	  return isLittleEndian ? pack : pack.reverse();
	};

	var set$1 = function (view, count, index, conversion, value, isLittleEndian) {
	  var intIndex = toIndex(index);
	  var store = getInternalState$2(view);
	  if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
	  var bytes = getInternalState$2(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = conversion(+value);
	  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
	};

	if (!arrayBufferNative) {
	  $ArrayBuffer = function ArrayBuffer(length) {
	    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
	    var byteLength = toIndex(length);
	    setInternalState$2(this, {
	      bytes: arrayFill.call(new Array(byteLength), 0),
	      byteLength: byteLength
	    });
	    if (!descriptors) this.byteLength = byteLength;
	  };

	  $DataView = function DataView(buffer, byteOffset, byteLength) {
	    anInstance(this, $DataView, DATA_VIEW);
	    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
	    var bufferLength = getInternalState$2(buffer).byteLength;
	    var offset = toInteger(byteOffset);
	    if (offset < 0 || offset > bufferLength) throw RangeError$1('Wrong offset');
	    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
	    if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH);
	    setInternalState$2(this, {
	      buffer: buffer,
	      byteLength: byteLength,
	      byteOffset: offset
	    });
	    if (!descriptors) {
	      this.buffer = buffer;
	      this.byteLength = byteLength;
	      this.byteOffset = offset;
	    }
	  };

	  if (descriptors) {
	    addGetter($ArrayBuffer, 'byteLength');
	    addGetter($DataView, 'buffer');
	    addGetter($DataView, 'byteLength');
	    addGetter($DataView, 'byteOffset');
	  }

	  redefineAll($DataView[PROTOTYPE$2], {
	    getInt8: function getInt8(byteOffset) {
	      return get$1(this, 1, byteOffset)[0] << 24 >> 24;
	    },
	    getUint8: function getUint8(byteOffset) {
	      return get$1(this, 1, byteOffset)[0];
	    },
	    getInt16: function getInt16(byteOffset /* , littleEndian */) {
	      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
	    },
	    getUint16: function getUint16(byteOffset /* , littleEndian */) {
	      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	      return bytes[1] << 8 | bytes[0];
	    },
	    getInt32: function getInt32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
	    },
	    getUint32: function getUint32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
	    },
	    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
	    },
	    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get$1(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
	    },
	    setInt8: function setInt8(byteOffset, value) {
	      set$1(this, 1, byteOffset, packInt8, value);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      set$1(this, 1, byteOffset, packInt8, value);
	    },
	    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
	      set$1(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
	      set$1(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
	      set$1(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
	      set$1(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
	      set$1(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
	      set$1(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
	    }
	  });
	} else {
	  if (!fails(function () {
	    NativeArrayBuffer(1);
	  }) || !fails(function () {
	    new NativeArrayBuffer(-1); // eslint-disable-line no-new
	  }) || fails(function () {
	    new NativeArrayBuffer(); // eslint-disable-line no-new
	    new NativeArrayBuffer(1.5); // eslint-disable-line no-new
	    new NativeArrayBuffer(NaN); // eslint-disable-line no-new
	    return NativeArrayBuffer.name != ARRAY_BUFFER;
	  })) {
	    $ArrayBuffer = function ArrayBuffer(length) {
	      anInstance(this, $ArrayBuffer);
	      return new NativeArrayBuffer(toIndex(length));
	    };
	    var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE$2] = NativeArrayBuffer[PROTOTYPE$2];
	    for (var keys$1 = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys$1.length > j;) {
	      if (!((key = keys$1[j++]) in $ArrayBuffer)) {
	        createNonEnumerableProperty($ArrayBuffer, key, NativeArrayBuffer[key]);
	      }
	    }
	    ArrayBufferPrototype.constructor = $ArrayBuffer;
	  }

	  // WebKit bug - the same parent prototype for typed arrays and data view
	  if (objectSetPrototypeOf && objectGetPrototypeOf($DataViewPrototype) !== ObjectPrototype$2) {
	    objectSetPrototypeOf($DataViewPrototype, ObjectPrototype$2);
	  }

	  // iOS Safari 7.x bug
	  var testView = new $DataView(new $ArrayBuffer(2));
	  var nativeSetInt8 = $DataViewPrototype.setInt8;
	  testView.setInt8(0, 2147483648);
	  testView.setInt8(1, 2147483649);
	  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataViewPrototype, {
	    setInt8: function setInt8(byteOffset, value) {
	      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
	    }
	  }, { unsafe: true });
	}

	setToStringTag($ArrayBuffer, ARRAY_BUFFER);
	setToStringTag($DataView, DATA_VIEW);

	var arrayBuffer = {
	  ArrayBuffer: $ArrayBuffer,
	  DataView: $DataView
	};

	var ARRAY_BUFFER$1 = 'ArrayBuffer';
	var ArrayBuffer$1 = arrayBuffer[ARRAY_BUFFER$1];
	var NativeArrayBuffer$1 = global_1[ARRAY_BUFFER$1];

	// `ArrayBuffer` constructor
	// https://tc39.github.io/ecma262/#sec-arraybuffer-constructor
	_export({ global: true, forced: NativeArrayBuffer$1 !== ArrayBuffer$1 }, {
	  ArrayBuffer: ArrayBuffer$1
	});

	setSpecies(ARRAY_BUFFER$1);

	var defineProperty$5 = objectDefineProperty.f;





	var Int8Array$1 = global_1.Int8Array;
	var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
	var Uint8ClampedArray = global_1.Uint8ClampedArray;
	var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
	var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
	var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
	var ObjectPrototype$3 = Object.prototype;
	var isPrototypeOf = ObjectPrototype$3.isPrototypeOf;

	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
	// Fixing native typed arrays in Opera Presto crashes the browser, see #595
	var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferNative && !!objectSetPrototypeOf && classof(global_1.opera) !== 'Opera';
	var TYPED_ARRAY_TAG_REQIRED = false;
	var NAME;

	var TypedArrayConstructorsList = {
	  Int8Array: 1,
	  Uint8Array: 1,
	  Uint8ClampedArray: 1,
	  Int16Array: 2,
	  Uint16Array: 2,
	  Int32Array: 4,
	  Uint32Array: 4,
	  Float32Array: 4,
	  Float64Array: 8
	};

	var isView = function isView(it) {
	  var klass = classof(it);
	  return klass === 'DataView' || has(TypedArrayConstructorsList, klass);
	};

	var isTypedArray = function (it) {
	  return isObject(it) && has(TypedArrayConstructorsList, classof(it));
	};

	var aTypedArray = function (it) {
	  if (isTypedArray(it)) return it;
	  throw TypeError('Target is not a typed array');
	};

	var aTypedArrayConstructor = function (C) {
	  if (objectSetPrototypeOf) {
	    if (isPrototypeOf.call(TypedArray, C)) return C;
	  } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME)) {
	    var TypedArrayConstructor = global_1[ARRAY];
	    if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
	      return C;
	    }
	  } throw TypeError('Target is not a typed array constructor');
	};

	var exportTypedArrayMethod = function (KEY, property, forced) {
	  if (!descriptors) return;
	  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
	    var TypedArrayConstructor = global_1[ARRAY];
	    if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
	      delete TypedArrayConstructor.prototype[KEY];
	    }
	  }
	  if (!TypedArrayPrototype[KEY] || forced) {
	    redefine(TypedArrayPrototype, KEY, forced ? property
	      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
	  }
	};

	var exportTypedArrayStaticMethod = function (KEY, property, forced) {
	  var ARRAY, TypedArrayConstructor;
	  if (!descriptors) return;
	  if (objectSetPrototypeOf) {
	    if (forced) for (ARRAY in TypedArrayConstructorsList) {
	      TypedArrayConstructor = global_1[ARRAY];
	      if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
	        delete TypedArrayConstructor[KEY];
	      }
	    }
	    if (!TypedArray[KEY] || forced) {
	      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
	      try {
	        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array$1[KEY] || property);
	      } catch (error) { /* empty */ }
	    } else return;
	  }
	  for (ARRAY in TypedArrayConstructorsList) {
	    TypedArrayConstructor = global_1[ARRAY];
	    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
	      redefine(TypedArrayConstructor, KEY, property);
	    }
	  }
	};

	for (NAME in TypedArrayConstructorsList) {
	  if (!global_1[NAME]) NATIVE_ARRAY_BUFFER_VIEWS = false;
	}

	// WebKit bug - typed arrays constructors prototype is Object.prototype
	if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
	  // eslint-disable-next-line no-shadow
	  TypedArray = function TypedArray() {
	    throw TypeError('Incorrect invocation');
	  };
	  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
	    if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME], TypedArray);
	  }
	}

	if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$3) {
	  TypedArrayPrototype = TypedArray.prototype;
	  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
	    if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME].prototype, TypedArrayPrototype);
	  }
	}

	// WebKit bug - one more object in Uint8ClampedArray prototype chain
	if (NATIVE_ARRAY_BUFFER_VIEWS && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
	  objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
	}

	if (descriptors && !has(TypedArrayPrototype, TO_STRING_TAG$3)) {
	  TYPED_ARRAY_TAG_REQIRED = true;
	  defineProperty$5(TypedArrayPrototype, TO_STRING_TAG$3, { get: function () {
	    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
	  } });
	  for (NAME in TypedArrayConstructorsList) if (global_1[NAME]) {
	    createNonEnumerableProperty(global_1[NAME], TYPED_ARRAY_TAG, NAME);
	  }
	}

	var arrayBufferViewCore = {
	  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
	  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
	  aTypedArray: aTypedArray,
	  aTypedArrayConstructor: aTypedArrayConstructor,
	  exportTypedArrayMethod: exportTypedArrayMethod,
	  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
	  isView: isView,
	  isTypedArray: isTypedArray,
	  TypedArray: TypedArray,
	  TypedArrayPrototype: TypedArrayPrototype
	};

	var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

	// `ArrayBuffer.isView` method
	// https://tc39.github.io/ecma262/#sec-arraybuffer.isview
	_export({ target: 'ArrayBuffer', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS$1 }, {
	  isView: arrayBufferViewCore.isView
	});

	var SPECIES$4 = wellKnownSymbol('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor
	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$4]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var ArrayBuffer$2 = arrayBuffer.ArrayBuffer;
	var DataView$1 = arrayBuffer.DataView;
	var nativeArrayBufferSlice = ArrayBuffer$2.prototype.slice;

	var INCORRECT_SLICE = fails(function () {
	  return !new ArrayBuffer$2(2).slice(1, undefined).byteLength;
	});

	// `ArrayBuffer.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice
	_export({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
	  slice: function slice(start, end) {
	    if (nativeArrayBufferSlice !== undefined && end === undefined) {
	      return nativeArrayBufferSlice.call(anObject(this), start); // FF fix
	    }
	    var length = anObject(this).byteLength;
	    var first = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    var result = new (speciesConstructor(this, ArrayBuffer$2))(toLength(fin - first));
	    var viewSource = new DataView$1(this);
	    var viewTarget = new DataView$1(result);
	    var index = 0;
	    while (first < fin) {
	      viewTarget.setUint8(index++, viewSource.getUint8(first++));
	    } return result;
	  }
	});

	var dateToPrimitive = function (hint) {
	  if (hint !== 'string' && hint !== 'number' && hint !== 'default') {
	    throw TypeError('Incorrect hint');
	  } return toPrimitive(anObject(this), hint !== 'number');
	};

	var TO_PRIMITIVE$1 = wellKnownSymbol('toPrimitive');
	var DatePrototype = Date.prototype;

	// `Date.prototype[@@toPrimitive]` method
	// https://tc39.github.io/ecma262/#sec-date.prototype-@@toprimitive
	if (!(TO_PRIMITIVE$1 in DatePrototype)) {
	  createNonEnumerableProperty(DatePrototype, TO_PRIMITIVE$1, dateToPrimitive);
	}

	var HAS_INSTANCE = wellKnownSymbol('hasInstance');
	var FunctionPrototype = Function.prototype;

	// `Function.prototype[@@hasInstance]` method
	// https://tc39.github.io/ecma262/#sec-function.prototype-@@hasinstance
	if (!(HAS_INSTANCE in FunctionPrototype)) {
	  objectDefineProperty.f(FunctionPrototype, HAS_INSTANCE, { value: function (O) {
	    if (typeof this != 'function' || !isObject(O)) return false;
	    if (!isObject(this.prototype)) return O instanceof this;
	    // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
	    while (O = objectGetPrototypeOf(O)) if (this.prototype === O) return true;
	    return false;
	  } });
	}

	var defineProperty$6 = objectDefineProperty.f;

	var FunctionPrototype$1 = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype$1.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME$1 = 'name';

	// Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name
	if (descriptors && !(NAME$1 in FunctionPrototype$1)) {
	  defineProperty$6(FunctionPrototype$1, NAME$1, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	// `globalThis` object
	// https://github.com/tc39/proposal-global
	_export({ global: true }, {
	  globalThis: global_1
	});

	var $stringify$1 = getBuiltIn('JSON', 'stringify');
	var re = /[\uD800-\uDFFF]/g;
	var low = /^[\uD800-\uDBFF]$/;
	var hi = /^[\uDC00-\uDFFF]$/;

	var fix = function (match, offset, string) {
	  var prev = string.charAt(offset - 1);
	  var next = string.charAt(offset + 1);
	  if ((low.test(match) && !hi.test(next)) || (hi.test(match) && !low.test(prev))) {
	    return '\\u' + match.charCodeAt(0).toString(16);
	  } return match;
	};

	var FORCED$2 = fails(function () {
	  return $stringify$1('\uDF06\uD834') !== '"\\udf06\\ud834"'
	    || $stringify$1('\uDEAD') !== '"\\udead"';
	});

	if ($stringify$1) {
	  // https://github.com/tc39/proposal-well-formed-stringify
	  _export({ target: 'JSON', stat: true, forced: FORCED$2 }, {
	    // eslint-disable-next-line no-unused-vars
	    stringify: function stringify(it, replacer, space) {
	      var result = $stringify$1.apply(null, arguments);
	      return typeof result == 'string' ? result.replace(re, fix) : result;
	    }
	  });
	}

	// JSON[@@toStringTag] property
	// https://tc39.github.io/ecma262/#sec-json-@@tostringtag
	setToStringTag(global_1.JSON, 'JSON', true);

	var freezing = !fails(function () {
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var internalMetadata = createCommonjsModule(function (module) {
	var defineProperty = objectDefineProperty.f;



	var METADATA = uid('meta');
	var id = 0;

	var isExtensible = Object.isExtensible || function () {
	  return true;
	};

	var setMetadata = function (it) {
	  defineProperty(it, METADATA, { value: {
	    objectID: 'O' + ++id, // object ID
	    weakData: {}          // weak collections IDs
	  } });
	};

	var fastKey = function (it, create) {
	  // return a primitive with prefix
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMetadata(it);
	  // return object ID
	  } return it[METADATA].objectID;
	};

	var getWeakData = function (it, create) {
	  if (!has(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMetadata(it);
	  // return the store of weak collections IDs
	  } return it[METADATA].weakData;
	};

	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
	  return it;
	};

	var meta = module.exports = {
	  REQUIRED: false,
	  fastKey: fastKey,
	  getWeakData: getWeakData,
	  onFreeze: onFreeze
	};

	hiddenKeys[METADATA] = true;
	});
	var internalMetadata_1 = internalMetadata.REQUIRED;
	var internalMetadata_2 = internalMetadata.fastKey;
	var internalMetadata_3 = internalMetadata.getWeakData;
	var internalMetadata_4 = internalMetadata.onFreeze;

	var iterate_1 = createCommonjsModule(function (module) {
	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
	  var boundFunction = functionBindContext(fn, that, AS_ENTRIES ? 2 : 1);
	  var iterator, iterFn, index, length, result, next, step;

	  if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = toLength(iterable.length); length > index; index++) {
	        result = AS_ENTRIES
	          ? boundFunction(anObject(step = iterable[index])[0], step[1])
	          : boundFunction(iterable[index]);
	        if (result && result instanceof Result) return result;
	      } return new Result(false);
	    }
	    iterator = iterFn.call(iterable);
	  }

	  next = iterator.next;
	  while (!(step = next.call(iterator)).done) {
	    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
	    if (typeof result == 'object' && result && result instanceof Result) return result;
	  } return new Result(false);
	};

	iterate.stop = function (result) {
	  return new Result(true, result);
	};
	});

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    objectSetPrototypeOf &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    typeof (NewTarget = dummy.constructor) == 'function' &&
	    NewTarget !== Wrapper &&
	    isObject(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
	  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
	  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var NativeConstructor = global_1[CONSTRUCTOR_NAME];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  var Constructor = NativeConstructor;
	  var exported = {};

	  var fixMethod = function (KEY) {
	    var nativeMethod = NativePrototype[KEY];
	    redefine(NativePrototype, KEY,
	      KEY == 'add' ? function add(value) {
	        nativeMethod.call(this, value === 0 ? 0 : value);
	        return this;
	      } : KEY == 'delete' ? function (key) {
	        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : KEY == 'get' ? function get(key) {
	        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : KEY == 'has' ? function has(key) {
	        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : function set(key, value) {
	        nativeMethod.call(this, key === 0 ? 0 : key, value);
	        return this;
	      }
	    );
	  };

	  // eslint-disable-next-line max-len
	  if (isForced_1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
	    new NativeConstructor().entries().next();
	  })))) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    internalMetadata.REQUIRED = true;
	  } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
	    var instance = new Constructor();
	    // early implementations not supports chaining
	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
	    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
	    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    // eslint-disable-next-line no-new
	    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
	    // for early implementations -0 and +0 not the same
	    var BUGGY_ZERO = !IS_WEAK && fails(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new NativeConstructor();
	      var index = 5;
	      while (index--) $instance[ADDER](index, index);
	      return !$instance.has(-0);
	    });

	    if (!ACCEPT_ITERABLES) {
	      Constructor = wrapper(function (dummy, iterable) {
	        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
	        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
	        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
	        return that;
	      });
	      Constructor.prototype = NativePrototype;
	      NativePrototype.constructor = Constructor;
	    }

	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }

	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

	    // weak collections should not contains .clear method
	    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
	  }

	  exported[CONSTRUCTOR_NAME] = Constructor;
	  _export({ global: true, forced: Constructor != NativeConstructor }, exported);

	  setToStringTag(Constructor, CONSTRUCTOR_NAME);

	  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

	  return Constructor;
	};

	var defineProperty$7 = objectDefineProperty.f;








	var fastKey = internalMetadata.fastKey;


	var setInternalState$3 = internalState.set;
	var internalStateGetterFor = internalState.getterFor;

	var collectionStrong = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance(that, C, CONSTRUCTOR_NAME);
	      setInternalState$3(that, {
	        type: CONSTRUCTOR_NAME,
	        index: objectCreate(null),
	        first: undefined,
	        last: undefined,
	        size: 0
	      });
	      if (!descriptors) that.size = 0;
	      if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
	    });

	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var entry = getEntry(that, key);
	      var previous, index;
	      // change existing entry
	      if (entry) {
	        entry.value = value;
	      // create new entry
	      } else {
	        state.last = entry = {
	          index: index = fastKey(key, true),
	          key: key,
	          value: value,
	          previous: previous = state.last,
	          next: undefined,
	          removed: false
	        };
	        if (!state.first) state.first = entry;
	        if (previous) previous.next = entry;
	        if (descriptors) state.size++;
	        else that.size++;
	        // add to index
	        if (index !== 'F') state.index[index] = entry;
	      } return that;
	    };

	    var getEntry = function (that, key) {
	      var state = getInternalState(that);
	      // fast case
	      var index = fastKey(key);
	      var entry;
	      if (index !== 'F') return state.index[index];
	      // frozen object case
	      for (entry = state.first; entry; entry = entry.next) {
	        if (entry.key == key) return entry;
	      }
	    };

	    redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear() {
	        var that = this;
	        var state = getInternalState(that);
	        var data = state.index;
	        var entry = state.first;
	        while (entry) {
	          entry.removed = true;
	          if (entry.previous) entry.previous = entry.previous.next = undefined;
	          delete data[entry.index];
	          entry = entry.next;
	        }
	        state.first = state.last = undefined;
	        if (descriptors) state.size = 0;
	        else that.size = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function (key) {
	        var that = this;
	        var state = getInternalState(that);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.next;
	          var prev = entry.previous;
	          delete state.index[entry.index];
	          entry.removed = true;
	          if (prev) prev.next = next;
	          if (next) next.previous = prev;
	          if (state.first == entry) state.first = next;
	          if (state.last == entry) state.last = prev;
	          if (descriptors) state.size--;
	          else that.size--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        var state = getInternalState(this);
	        var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
	        var entry;
	        while (entry = entry ? entry.next : state.first) {
	          boundFunction(entry.value, entry.key, this);
	          // revert to the last existing entry
	          while (entry && entry.removed) entry = entry.previous;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key) {
	        return !!getEntry(this, key);
	      }
	    });

	    redefineAll(C.prototype, IS_MAP ? {
	      // 23.1.3.6 Map.prototype.get(key)
	      get: function get(key) {
	        var entry = getEntry(this, key);
	        return entry && entry.value;
	      },
	      // 23.1.3.9 Map.prototype.set(key, value)
	      set: function set(key, value) {
	        return define(this, key === 0 ? 0 : key, value);
	      }
	    } : {
	      // 23.2.3.1 Set.prototype.add(value)
	      add: function add(value) {
	        return define(this, value = value === 0 ? 0 : value, value);
	      }
	    });
	    if (descriptors) defineProperty$7(C.prototype, 'size', {
	      get: function () {
	        return getInternalState(this).size;
	      }
	    });
	    return C;
	  },
	  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
	    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
	    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
	    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
	      setInternalState$3(this, {
	        type: ITERATOR_NAME,
	        target: iterated,
	        state: getInternalCollectionState(iterated),
	        kind: kind,
	        last: undefined
	      });
	    }, function () {
	      var state = getInternalIteratorState(this);
	      var kind = state.kind;
	      var entry = state.last;
	      // revert to the last existing entry
	      while (entry && entry.removed) entry = entry.previous;
	      // get next entry
	      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
	        // or finish the iteration
	        state.target = undefined;
	        return { value: undefined, done: true };
	      }
	      // return step by kind
	      if (kind == 'keys') return { value: entry.key, done: false };
	      if (kind == 'values') return { value: entry.value, done: false };
	      return { value: [entry.key, entry.value], done: false };
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies(CONSTRUCTOR_NAME);
	  }
	};

	// `Map` constructor
	// https://tc39.github.io/ecma262/#sec-map-objects
	var es_map = collection('Map', function (init) {
	  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	var log$1 = Math.log;

	// `Math.log1p` method implementation
	// https://tc39.github.io/ecma262/#sec-math.log1p
	var mathLog1p = Math.log1p || function log1p(x) {
	  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log$1(1 + x);
	};

	var nativeAcosh = Math.acosh;
	var log$2 = Math.log;
	var sqrt = Math.sqrt;
	var LN2$1 = Math.LN2;

	var FORCED$3 = !nativeAcosh
	  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
	  || Math.floor(nativeAcosh(Number.MAX_VALUE)) != 710
	  // Tor Browser bug: Math.acosh(Infinity) -> NaN
	  || nativeAcosh(Infinity) != Infinity;

	// `Math.acosh` method
	// https://tc39.github.io/ecma262/#sec-math.acosh
	_export({ target: 'Math', stat: true, forced: FORCED$3 }, {
	  acosh: function acosh(x) {
	    return (x = +x) < 1 ? NaN : x > 94906265.62425156
	      ? log$2(x) + LN2$1
	      : mathLog1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
	  }
	});

	var nativeAsinh = Math.asinh;
	var log$3 = Math.log;
	var sqrt$1 = Math.sqrt;

	function asinh(x) {
	  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log$3(x + sqrt$1(x * x + 1));
	}

	// `Math.asinh` method
	// https://tc39.github.io/ecma262/#sec-math.asinh
	// Tor Browser bug: Math.asinh(0) -> -0
	_export({ target: 'Math', stat: true, forced: !(nativeAsinh && 1 / nativeAsinh(0) > 0) }, {
	  asinh: asinh
	});

	var nativeAtanh = Math.atanh;
	var log$4 = Math.log;

	// `Math.atanh` method
	// https://tc39.github.io/ecma262/#sec-math.atanh
	// Tor Browser bug: Math.atanh(-0) -> 0
	_export({ target: 'Math', stat: true, forced: !(nativeAtanh && 1 / nativeAtanh(-0) < 0) }, {
	  atanh: function atanh(x) {
	    return (x = +x) == 0 ? x : log$4((1 + x) / (1 - x)) / 2;
	  }
	});

	// `Math.sign` method implementation
	// https://tc39.github.io/ecma262/#sec-math.sign
	var mathSign = Math.sign || function sign(x) {
	  // eslint-disable-next-line no-self-compare
	  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
	};

	var abs$1 = Math.abs;
	var pow$1 = Math.pow;

	// `Math.cbrt` method
	// https://tc39.github.io/ecma262/#sec-math.cbrt
	_export({ target: 'Math', stat: true }, {
	  cbrt: function cbrt(x) {
	    return mathSign(x = +x) * pow$1(abs$1(x), 1 / 3);
	  }
	});

	var floor$2 = Math.floor;
	var log$5 = Math.log;
	var LOG2E = Math.LOG2E;

	// `Math.clz32` method
	// https://tc39.github.io/ecma262/#sec-math.clz32
	_export({ target: 'Math', stat: true }, {
	  clz32: function clz32(x) {
	    return (x >>>= 0) ? 31 - floor$2(log$5(x + 0.5) * LOG2E) : 32;
	  }
	});

	var nativeExpm1 = Math.expm1;
	var exp = Math.exp;

	// `Math.expm1` method implementation
	// https://tc39.github.io/ecma262/#sec-math.expm1
	var mathExpm1 = (!nativeExpm1
	  // Old FF bug
	  || nativeExpm1(10) > 22025.465794806719 || nativeExpm1(10) < 22025.4657948067165168
	  // Tor Browser bug
	  || nativeExpm1(-2e-17) != -2e-17
	) ? function expm1(x) {
	  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
	} : nativeExpm1;

	var nativeCosh = Math.cosh;
	var abs$2 = Math.abs;
	var E = Math.E;

	// `Math.cosh` method
	// https://tc39.github.io/ecma262/#sec-math.cosh
	_export({ target: 'Math', stat: true, forced: !nativeCosh || nativeCosh(710) === Infinity }, {
	  cosh: function cosh(x) {
	    var t = mathExpm1(abs$2(x) - 1) + 1;
	    return (t + 1 / (t * E * E)) * (E / 2);
	  }
	});

	// `Math.expm1` method
	// https://tc39.github.io/ecma262/#sec-math.expm1
	_export({ target: 'Math', stat: true, forced: mathExpm1 != Math.expm1 }, { expm1: mathExpm1 });

	var abs$3 = Math.abs;
	var pow$2 = Math.pow;
	var EPSILON = pow$2(2, -52);
	var EPSILON32 = pow$2(2, -23);
	var MAX32 = pow$2(2, 127) * (2 - EPSILON32);
	var MIN32 = pow$2(2, -126);

	var roundTiesToEven = function (n) {
	  return n + 1 / EPSILON - 1 / EPSILON;
	};

	// `Math.fround` method implementation
	// https://tc39.github.io/ecma262/#sec-math.fround
	var mathFround = Math.fround || function fround(x) {
	  var $abs = abs$3(x);
	  var $sign = mathSign(x);
	  var a, result;
	  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
	  a = (1 + EPSILON32 / EPSILON) * $abs;
	  result = a - (a - $abs);
	  // eslint-disable-next-line no-self-compare
	  if (result > MAX32 || result != result) return $sign * Infinity;
	  return $sign * result;
	};

	// `Math.fround` method
	// https://tc39.github.io/ecma262/#sec-math.fround
	_export({ target: 'Math', stat: true }, { fround: mathFround });

	var $hypot = Math.hypot;
	var abs$4 = Math.abs;
	var sqrt$2 = Math.sqrt;

	// Chrome 77 bug
	// https://bugs.chromium.org/p/v8/issues/detail?id=9546
	var BUGGY = !!$hypot && $hypot(Infinity, NaN) !== Infinity;

	// `Math.hypot` method
	// https://tc39.github.io/ecma262/#sec-math.hypot
	_export({ target: 'Math', stat: true, forced: BUGGY }, {
	  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
	    var sum = 0;
	    var i = 0;
	    var aLen = arguments.length;
	    var larg = 0;
	    var arg, div;
	    while (i < aLen) {
	      arg = abs$4(arguments[i++]);
	      if (larg < arg) {
	        div = larg / arg;
	        sum = sum * div * div + 1;
	        larg = arg;
	      } else if (arg > 0) {
	        div = arg / larg;
	        sum += div * div;
	      } else sum += arg;
	    }
	    return larg === Infinity ? Infinity : larg * sqrt$2(sum);
	  }
	});

	var nativeImul = Math.imul;

	var FORCED$4 = fails(function () {
	  return nativeImul(0xFFFFFFFF, 5) != -5 || nativeImul.length != 2;
	});

	// `Math.imul` method
	// https://tc39.github.io/ecma262/#sec-math.imul
	// some WebKit versions fails with big numbers, some has wrong arity
	_export({ target: 'Math', stat: true, forced: FORCED$4 }, {
	  imul: function imul(x, y) {
	    var UINT16 = 0xFFFF;
	    var xn = +x;
	    var yn = +y;
	    var xl = UINT16 & xn;
	    var yl = UINT16 & yn;
	    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
	  }
	});

	var log$6 = Math.log;
	var LOG10E = Math.LOG10E;

	// `Math.log10` method
	// https://tc39.github.io/ecma262/#sec-math.log10
	_export({ target: 'Math', stat: true }, {
	  log10: function log10(x) {
	    return log$6(x) * LOG10E;
	  }
	});

	// `Math.log1p` method
	// https://tc39.github.io/ecma262/#sec-math.log1p
	_export({ target: 'Math', stat: true }, { log1p: mathLog1p });

	var log$7 = Math.log;
	var LN2$2 = Math.LN2;

	// `Math.log2` method
	// https://tc39.github.io/ecma262/#sec-math.log2
	_export({ target: 'Math', stat: true }, {
	  log2: function log2(x) {
	    return log$7(x) / LN2$2;
	  }
	});

	// `Math.sign` method
	// https://tc39.github.io/ecma262/#sec-math.sign
	_export({ target: 'Math', stat: true }, {
	  sign: mathSign
	});

	var abs$5 = Math.abs;
	var exp$1 = Math.exp;
	var E$1 = Math.E;

	var FORCED$5 = fails(function () {
	  return Math.sinh(-2e-17) != -2e-17;
	});

	// `Math.sinh` method
	// https://tc39.github.io/ecma262/#sec-math.sinh
	// V8 near Chromium 38 has a problem with very small numbers
	_export({ target: 'Math', stat: true, forced: FORCED$5 }, {
	  sinh: function sinh(x) {
	    return abs$5(x = +x) < 1 ? (mathExpm1(x) - mathExpm1(-x)) / 2 : (exp$1(x - 1) - exp$1(-x - 1)) * (E$1 / 2);
	  }
	});

	var exp$2 = Math.exp;

	// `Math.tanh` method
	// https://tc39.github.io/ecma262/#sec-math.tanh
	_export({ target: 'Math', stat: true }, {
	  tanh: function tanh(x) {
	    var a = mathExpm1(x = +x);
	    var b = mathExpm1(-x);
	    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp$2(x) + exp$2(-x));
	  }
	});

	// Math[@@toStringTag] property
	// https://tc39.github.io/ecma262/#sec-math-@@tostringtag
	setToStringTag(Math, 'Math', true);

	var ceil$1 = Math.ceil;
	var floor$3 = Math.floor;

	// `Math.trunc` method
	// https://tc39.github.io/ecma262/#sec-math.trunc
	_export({ target: 'Math', stat: true }, {
	  trunc: function trunc(it) {
	    return (it > 0 ? floor$3 : ceil$1)(it);
	  }
	});

	// a string of all valid unicode whitespaces
	// eslint-disable-next-line max-len
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$3 = function (TYPE) {
	  return function ($this) {
	    var string = String(requireObjectCoercible($this));
	    if (TYPE & 1) string = string.replace(ltrim, '');
	    if (TYPE & 2) string = string.replace(rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$3(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
	  end: createMethod$3(2),
	  // `String.prototype.trim` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
	  trim: createMethod$3(3)
	};

	var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
	var defineProperty$8 = objectDefineProperty.f;
	var trim = stringTrim.trim;

	var NUMBER = 'Number';
	var NativeNumber = global_1[NUMBER];
	var NumberPrototype = NativeNumber.prototype;

	// Opera ~12 has broken Object#toString
	var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

	// `ToNumber` abstract operation
	// https://tc39.github.io/ecma262/#sec-tonumber
	var toNumber = function (argument) {
	  var it = toPrimitive(argument, false);
	  var first, third, radix, maxCode, digits, length, index, code;
	  if (typeof it == 'string' && it.length > 2) {
	    it = trim(it);
	    first = it.charCodeAt(0);
	    if (first === 43 || first === 45) {
	      third = it.charCodeAt(2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (it.charCodeAt(1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
	        default: return +it;
	      }
	      digits = it.slice(2);
	      length = digits.length;
	      for (index = 0; index < length; index++) {
	        code = digits.charCodeAt(index);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	// `Number` constructor
	// https://tc39.github.io/ecma262/#sec-number-constructor
	if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
	  var NumberWrapper = function Number(value) {
	    var it = arguments.length < 1 ? 0 : value;
	    var dummy = this;
	    return dummy instanceof NumberWrapper
	      // check on 1..constructor(foo) case
	      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
	        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
	  };
	  for (var keys$2 = descriptors ? getOwnPropertyNames$1(NativeNumber) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j$1 = 0, key$1; keys$2.length > j$1; j$1++) {
	    if (has(NativeNumber, key$1 = keys$2[j$1]) && !has(NumberWrapper, key$1)) {
	      defineProperty$8(NumberWrapper, key$1, getOwnPropertyDescriptor$2(NativeNumber, key$1));
	    }
	  }
	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  redefine(global_1, NUMBER, NumberWrapper);
	}

	// `Number.EPSILON` constant
	// https://tc39.github.io/ecma262/#sec-number.epsilon
	_export({ target: 'Number', stat: true }, {
	  EPSILON: Math.pow(2, -52)
	});

	var globalIsFinite = global_1.isFinite;

	// `Number.isFinite` method
	// https://tc39.github.io/ecma262/#sec-number.isfinite
	var numberIsFinite = Number.isFinite || function isFinite(it) {
	  return typeof it == 'number' && globalIsFinite(it);
	};

	// `Number.isFinite` method
	// https://tc39.github.io/ecma262/#sec-number.isfinite
	_export({ target: 'Number', stat: true }, { isFinite: numberIsFinite });

	var floor$4 = Math.floor;

	// `Number.isInteger` method implementation
	// https://tc39.github.io/ecma262/#sec-number.isinteger
	var isInteger = function isInteger(it) {
	  return !isObject(it) && isFinite(it) && floor$4(it) === it;
	};

	// `Number.isInteger` method
	// https://tc39.github.io/ecma262/#sec-number.isinteger
	_export({ target: 'Number', stat: true }, {
	  isInteger: isInteger
	});

	// `Number.isNaN` method
	// https://tc39.github.io/ecma262/#sec-number.isnan
	_export({ target: 'Number', stat: true }, {
	  isNaN: function isNaN(number) {
	    // eslint-disable-next-line no-self-compare
	    return number != number;
	  }
	});

	var abs$6 = Math.abs;

	// `Number.isSafeInteger` method
	// https://tc39.github.io/ecma262/#sec-number.issafeinteger
	_export({ target: 'Number', stat: true }, {
	  isSafeInteger: function isSafeInteger(number) {
	    return isInteger(number) && abs$6(number) <= 0x1FFFFFFFFFFFFF;
	  }
	});

	// `Number.MAX_SAFE_INTEGER` constant
	// https://tc39.github.io/ecma262/#sec-number.max_safe_integer
	_export({ target: 'Number', stat: true }, {
	  MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
	});

	// `Number.MIN_SAFE_INTEGER` constant
	// https://tc39.github.io/ecma262/#sec-number.min_safe_integer
	_export({ target: 'Number', stat: true }, {
	  MIN_SAFE_INTEGER: -0x1FFFFFFFFFFFFF
	});

	var trim$1 = stringTrim.trim;


	var $parseFloat = global_1.parseFloat;
	var FORCED$6 = 1 / $parseFloat(whitespaces + '-0') !== -Infinity;

	// `parseFloat` method
	// https://tc39.github.io/ecma262/#sec-parsefloat-string
	var numberParseFloat = FORCED$6 ? function parseFloat(string) {
	  var trimmedString = trim$1(String(string));
	  var result = $parseFloat(trimmedString);
	  return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
	} : $parseFloat;

	// `Number.parseFloat` method
	// https://tc39.github.io/ecma262/#sec-number.parseFloat
	_export({ target: 'Number', stat: true, forced: Number.parseFloat != numberParseFloat }, {
	  parseFloat: numberParseFloat
	});

	var trim$2 = stringTrim.trim;


	var $parseInt = global_1.parseInt;
	var hex = /^[+-]?0[Xx]/;
	var FORCED$7 = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22;

	// `parseInt` method
	// https://tc39.github.io/ecma262/#sec-parseint-string-radix
	var numberParseInt = FORCED$7 ? function parseInt(string, radix) {
	  var S = trim$2(String(string));
	  return $parseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
	} : $parseInt;

	// `Number.parseInt` method
	// https://tc39.github.io/ecma262/#sec-number.parseint
	_export({ target: 'Number', stat: true, forced: Number.parseInt != numberParseInt }, {
	  parseInt: numberParseInt
	});

	// `thisNumberValue` abstract operation
	// https://tc39.github.io/ecma262/#sec-thisnumbervalue
	var thisNumberValue = function (value) {
	  if (typeof value != 'number' && classofRaw(value) != 'Number') {
	    throw TypeError('Incorrect invocation');
	  }
	  return +value;
	};

	// `String.prototype.repeat` method implementation
	// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
	var stringRepeat = ''.repeat || function repeat(count) {
	  var str = String(requireObjectCoercible(this));
	  var result = '';
	  var n = toInteger(count);
	  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
	  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
	  return result;
	};

	var nativeToFixed = 1.0.toFixed;
	var floor$5 = Math.floor;

	var pow$3 = function (x, n, acc) {
	  return n === 0 ? acc : n % 2 === 1 ? pow$3(x, n - 1, acc * x) : pow$3(x * x, n / 2, acc);
	};

	var log$8 = function (x) {
	  var n = 0;
	  var x2 = x;
	  while (x2 >= 4096) {
	    n += 12;
	    x2 /= 4096;
	  }
	  while (x2 >= 2) {
	    n += 1;
	    x2 /= 2;
	  } return n;
	};

	var FORCED$8 = nativeToFixed && (
	  0.00008.toFixed(3) !== '0.000' ||
	  0.9.toFixed(0) !== '1' ||
	  1.255.toFixed(2) !== '1.25' ||
	  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
	) || !fails(function () {
	  // V8 ~ Android 4.3-
	  nativeToFixed.call({});
	});

	// `Number.prototype.toFixed` method
	// https://tc39.github.io/ecma262/#sec-number.prototype.tofixed
	_export({ target: 'Number', proto: true, forced: FORCED$8 }, {
	  // eslint-disable-next-line max-statements
	  toFixed: function toFixed(fractionDigits) {
	    var number = thisNumberValue(this);
	    var fractDigits = toInteger(fractionDigits);
	    var data = [0, 0, 0, 0, 0, 0];
	    var sign = '';
	    var result = '0';
	    var e, z, j, k;

	    var multiply = function (n, c) {
	      var index = -1;
	      var c2 = c;
	      while (++index < 6) {
	        c2 += n * data[index];
	        data[index] = c2 % 1e7;
	        c2 = floor$5(c2 / 1e7);
	      }
	    };

	    var divide = function (n) {
	      var index = 6;
	      var c = 0;
	      while (--index >= 0) {
	        c += data[index];
	        data[index] = floor$5(c / n);
	        c = (c % n) * 1e7;
	      }
	    };

	    var dataToString = function () {
	      var index = 6;
	      var s = '';
	      while (--index >= 0) {
	        if (s !== '' || index === 0 || data[index] !== 0) {
	          var t = String(data[index]);
	          s = s === '' ? t : s + stringRepeat.call('0', 7 - t.length) + t;
	        }
	      } return s;
	    };

	    if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
	    // eslint-disable-next-line no-self-compare
	    if (number != number) return 'NaN';
	    if (number <= -1e21 || number >= 1e21) return String(number);
	    if (number < 0) {
	      sign = '-';
	      number = -number;
	    }
	    if (number > 1e-21) {
	      e = log$8(number * pow$3(2, 69, 1)) - 69;
	      z = e < 0 ? number * pow$3(2, -e, 1) : number / pow$3(2, e, 1);
	      z *= 0x10000000000000;
	      e = 52 - e;
	      if (e > 0) {
	        multiply(0, z);
	        j = fractDigits;
	        while (j >= 7) {
	          multiply(1e7, 0);
	          j -= 7;
	        }
	        multiply(pow$3(10, j, 1), 0);
	        j = e - 1;
	        while (j >= 23) {
	          divide(1 << 23);
	          j -= 23;
	        }
	        divide(1 << j);
	        multiply(1, 1);
	        divide(2);
	        result = dataToString();
	      } else {
	        multiply(0, z);
	        multiply(1 << -e, 0);
	        result = dataToString() + stringRepeat.call('0', fractDigits);
	      }
	    }
	    if (fractDigits > 0) {
	      k = result.length;
	      result = sign + (k <= fractDigits
	        ? '0.' + stringRepeat.call('0', fractDigits - k) + result
	        : result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits));
	    } else {
	      result = sign + result;
	    } return result;
	  }
	});

	var nativeAssign = Object.assign;
	var defineProperty$9 = Object.defineProperty;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	var objectAssign = !nativeAssign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty$9({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$9(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
	    }
	  } return T;
	} : nativeAssign;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	// Forced replacement object prototype accessors methods
	var objectPrototypeAccessorsForced =  !fails(function () {
	  var key = Math.random();
	  // In FF throws only define methods
	  // eslint-disable-next-line no-undef, no-useless-call
	  __defineSetter__.call(null, key, function () { /* empty */ });
	  delete global_1[key];
	});

	// `Object.prototype.__defineGetter__` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.__defineGetter__
	if (descriptors) {
	  _export({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
	    __defineGetter__: function __defineGetter__(P, getter) {
	      objectDefineProperty.f(toObject(this), P, { get: aFunction$1(getter), enumerable: true, configurable: true });
	    }
	  });
	}

	// `Object.prototype.__defineSetter__` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.__defineSetter__
	if (descriptors) {
	  _export({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
	    __defineSetter__: function __defineSetter__(P, setter) {
	      objectDefineProperty.f(toObject(this), P, { set: aFunction$1(setter), enumerable: true, configurable: true });
	    }
	  });
	}

	var propertyIsEnumerable = objectPropertyIsEnumerable.f;

	// `Object.{ entries, values }` methods implementation
	var createMethod$4 = function (TO_ENTRIES) {
	  return function (it) {
	    var O = toIndexedObject(it);
	    var keys = objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) {
	      key = keys[i++];
	      if (!descriptors || propertyIsEnumerable.call(O, key)) {
	        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
	      }
	    }
	    return result;
	  };
	};

	var objectToArray = {
	  // `Object.entries` method
	  // https://tc39.github.io/ecma262/#sec-object.entries
	  entries: createMethod$4(true),
	  // `Object.values` method
	  // https://tc39.github.io/ecma262/#sec-object.values
	  values: createMethod$4(false)
	};

	var $entries = objectToArray.entries;

	// `Object.entries` method
	// https://tc39.github.io/ecma262/#sec-object.entries
	_export({ target: 'Object', stat: true }, {
	  entries: function entries(O) {
	    return $entries(O);
	  }
	});

	var onFreeze = internalMetadata.onFreeze;

	var nativeFreeze = Object.freeze;
	var FAILS_ON_PRIMITIVES = fails(function () { nativeFreeze(1); });

	// `Object.freeze` method
	// https://tc39.github.io/ecma262/#sec-object.freeze
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !freezing }, {
	  freeze: function freeze(it) {
	    return nativeFreeze && isObject(it) ? nativeFreeze(onFreeze(it)) : it;
	  }
	});

	// `Object.fromEntries` method
	// https://github.com/tc39/proposal-object-from-entries
	_export({ target: 'Object', stat: true }, {
	  fromEntries: function fromEntries(iterable) {
	    var obj = {};
	    iterate_1(iterable, function (k, v) {
	      createProperty(obj, k, v);
	    }, undefined, true);
	    return obj;
	  }
	});

	var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;


	var FAILS_ON_PRIMITIVES$1 = fails(function () { nativeGetOwnPropertyDescriptor$2(1); });
	var FORCED$9 = !descriptors || FAILS_ON_PRIMITIVES$1;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	_export({ target: 'Object', stat: true, forced: FORCED$9, sham: !descriptors }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
	    return nativeGetOwnPropertyDescriptor$2(toIndexedObject(it), key);
	  }
	});

	// `Object.getOwnPropertyDescriptors` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
	_export({ target: 'Object', stat: true, sham: !descriptors }, {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
	    var O = toIndexedObject(object);
	    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	    var keys = ownKeys(O);
	    var result = {};
	    var index = 0;
	    var key, descriptor;
	    while (keys.length > index) {
	      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
	      if (descriptor !== undefined) createProperty(result, key, descriptor);
	    }
	    return result;
	  }
	});

	var nativeGetOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;

	var FAILS_ON_PRIMITIVES$2 = fails(function () { return !Object.getOwnPropertyNames(1); });

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
	  getOwnPropertyNames: nativeGetOwnPropertyNames$2
	});

	var FAILS_ON_PRIMITIVES$3 = fails(function () { objectGetPrototypeOf(1); });

	// `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3, sham: !correctPrototypeGetter }, {
	  getPrototypeOf: function getPrototypeOf(it) {
	    return objectGetPrototypeOf(toObject(it));
	  }
	});

	// `SameValue` abstract operation
	// https://tc39.github.io/ecma262/#sec-samevalue
	var sameValue = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

	// `Object.is` method
	// https://tc39.github.io/ecma262/#sec-object.is
	_export({ target: 'Object', stat: true }, {
	  is: sameValue
	});

	var nativeIsExtensible = Object.isExtensible;
	var FAILS_ON_PRIMITIVES$4 = fails(function () { nativeIsExtensible(1); });

	// `Object.isExtensible` method
	// https://tc39.github.io/ecma262/#sec-object.isextensible
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$4 }, {
	  isExtensible: function isExtensible(it) {
	    return isObject(it) ? nativeIsExtensible ? nativeIsExtensible(it) : true : false;
	  }
	});

	var nativeIsFrozen = Object.isFrozen;
	var FAILS_ON_PRIMITIVES$5 = fails(function () { nativeIsFrozen(1); });

	// `Object.isFrozen` method
	// https://tc39.github.io/ecma262/#sec-object.isfrozen
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$5 }, {
	  isFrozen: function isFrozen(it) {
	    return isObject(it) ? nativeIsFrozen ? nativeIsFrozen(it) : false : true;
	  }
	});

	var nativeIsSealed = Object.isSealed;
	var FAILS_ON_PRIMITIVES$6 = fails(function () { nativeIsSealed(1); });

	// `Object.isSealed` method
	// https://tc39.github.io/ecma262/#sec-object.issealed
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$6 }, {
	  isSealed: function isSealed(it) {
	    return isObject(it) ? nativeIsSealed ? nativeIsSealed(it) : false : true;
	  }
	});

	var FAILS_ON_PRIMITIVES$7 = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$7 }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;

	// `Object.prototype.__lookupGetter__` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.__lookupGetter__
	if (descriptors) {
	  _export({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
	    __lookupGetter__: function __lookupGetter__(P) {
	      var O = toObject(this);
	      var key = toPrimitive(P, true);
	      var desc;
	      do {
	        if (desc = getOwnPropertyDescriptor$3(O, key)) return desc.get;
	      } while (O = objectGetPrototypeOf(O));
	    }
	  });
	}

	var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;

	// `Object.prototype.__lookupSetter__` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.__lookupSetter__
	if (descriptors) {
	  _export({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
	    __lookupSetter__: function __lookupSetter__(P) {
	      var O = toObject(this);
	      var key = toPrimitive(P, true);
	      var desc;
	      do {
	        if (desc = getOwnPropertyDescriptor$4(O, key)) return desc.set;
	      } while (O = objectGetPrototypeOf(O));
	    }
	  });
	}

	var onFreeze$1 = internalMetadata.onFreeze;



	var nativePreventExtensions = Object.preventExtensions;
	var FAILS_ON_PRIMITIVES$8 = fails(function () { nativePreventExtensions(1); });

	// `Object.preventExtensions` method
	// https://tc39.github.io/ecma262/#sec-object.preventextensions
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$8, sham: !freezing }, {
	  preventExtensions: function preventExtensions(it) {
	    return nativePreventExtensions && isObject(it) ? nativePreventExtensions(onFreeze$1(it)) : it;
	  }
	});

	var onFreeze$2 = internalMetadata.onFreeze;



	var nativeSeal = Object.seal;
	var FAILS_ON_PRIMITIVES$9 = fails(function () { nativeSeal(1); });

	// `Object.seal` method
	// https://tc39.github.io/ecma262/#sec-object.seal
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$9, sham: !freezing }, {
	  seal: function seal(it) {
	    return nativeSeal && isObject(it) ? nativeSeal(onFreeze$2(it)) : it;
	  }
	});

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	_export({ target: 'Object', stat: true }, {
	  setPrototypeOf: objectSetPrototypeOf
	});

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	var $values = objectToArray.values;

	// `Object.values` method
	// https://tc39.github.io/ecma262/#sec-object.values
	_export({ target: 'Object', stat: true }, {
	  values: function values(O) {
	    return $values(O);
	  }
	});

	var nativePromiseConstructor = global_1.Promise;

	var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

	var location = global_1.location;
	var set$2 = global_1.setImmediate;
	var clear = global_1.clearImmediate;
	var process$1 = global_1.process;
	var MessageChannel = global_1.MessageChannel;
	var Dispatch = global_1.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;

	var run = function (id) {
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global_1.postMessage(id + '', location.protocol + '//' + location.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set$2 || !clear) {
	  set$2 = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (classofRaw(process$1) == 'process') {
	    defer = function (id) {
	      process$1.nextTick(runner(id));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  // except iOS - https://github.com/zloirock/core-js/issues/624
	  } else if (MessageChannel && !engineIsIos) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = functionBindContext(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (global_1.addEventListener && typeof postMessage == 'function' && !global_1.importScripts && !fails(post)) {
	    defer = post;
	    global_1.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
	    defer = function (id) {
	      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task = {
	  set: set$2,
	  clear: clear
	};

	var getOwnPropertyDescriptor$5 = objectGetOwnPropertyDescriptor.f;

	var macrotask = task.set;


	var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
	var process$2 = global_1.process;
	var Promise$1 = global_1.Promise;
	var IS_NODE = classofRaw(process$2) == 'process';
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$5(global_1, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

	var flush, head, last, notify, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (IS_NODE && (parent = process$2.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (error) {
	        if (head) notify();
	        else last = undefined;
	        throw error;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // Node.js
	  if (IS_NODE) {
	    notify = function () {
	      process$2.nextTick(flush);
	    };
	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  } else if (MutationObserver && !engineIsIos) {
	    toggle = true;
	    node = document.createTextNode('');
	    new MutationObserver(flush).observe(node, { characterData: true });
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$1.resolve(undefined);
	    then = promise.then;
	    notify = function () {
	      then.call(promise, flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global_1, flush);
	    };
	  }
	}

	var microtask = queueMicrotask || function (fn) {
	  var task = { fn: fn, next: undefined };
	  if (last) last.next = task;
	  if (!head) {
	    head = task;
	    notify();
	  } last = task;
	};

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction$1(resolve);
	  this.reject = aFunction$1(reject);
	};

	// 25.4.1.5 NewPromiseCapability(C)
	var f$7 = function (C) {
	  return new PromiseCapability(C);
	};

	var newPromiseCapability = {
		f: f$7
	};

	var promiseResolve = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var hostReportErrors = function (a, b) {
	  var console = global_1.console;
	  if (console && console.error) {
	    arguments.length === 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform = function (exec) {
	  try {
	    return { error: false, value: exec() };
	  } catch (error) {
	    return { error: true, value: error };
	  }
	};

	var task$1 = task.set;










	var SPECIES$5 = wellKnownSymbol('species');
	var PROMISE = 'Promise';
	var getInternalState$3 = internalState.get;
	var setInternalState$4 = internalState.set;
	var getInternalPromiseState = internalState.getterFor(PROMISE);
	var PromiseConstructor = nativePromiseConstructor;
	var TypeError$1 = global_1.TypeError;
	var document$2 = global_1.document;
	var process$3 = global_1.process;
	var $fetch = getBuiltIn('fetch');
	var newPromiseCapability$1 = newPromiseCapability.f;
	var newGenericPromiseCapability = newPromiseCapability$1;
	var IS_NODE$1 = classofRaw(process$3) == 'process';
	var DISPATCH_EVENT = !!(document$2 && document$2.createEvent && global_1.dispatchEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;
	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

	var FORCED$a = isForced_1(PROMISE, function () {
	  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
	  if (!GLOBAL_CORE_JS_PROMISE) {
	    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	    // We can't detect it synchronously, so just check versions
	    if (engineV8Version === 66) return true;
	    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    if (!IS_NODE$1 && typeof PromiseRejectionEvent != 'function') return true;
	  }
	  // We can't use @@species feature detection in V8 since it causes
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if (engineV8Version >= 51 && /native code/.test(PromiseConstructor)) return false;
	  // Detect correctness of subclassing with @@species support
	  var promise = PromiseConstructor.resolve(1);
	  var FakePromise = function (exec) {
	    exec(function () { /* empty */ }, function () { /* empty */ });
	  };
	  var constructor = promise.constructor = {};
	  constructor[SPECIES$5] = FakePromise;
	  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
	});

	var INCORRECT_ITERATION$1 = FORCED$a || !checkCorrectnessOfIteration(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
	});

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};

	var notify$1 = function (promise, state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  var chain = state.reactions;
	  microtask(function () {
	    var value = state.value;
	    var ok = state.state == FULFILLED;
	    var index = 0;
	    // variable length - can't use forEach
	    while (chain.length > index) {
	      var reaction = chain[index++];
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
	            state.rejection = HANDLED;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // can throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError$1('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (error) {
	        if (domain && !exited) domain.exit();
	        reject(error);
	      }
	    }
	    state.reactions = [];
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(promise, state);
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;
	  if (DISPATCH_EVENT) {
	    event = document$2.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global_1.dispatchEvent(event);
	  } else event = { promise: promise, reason: reason };
	  if (handler = global_1['on' + name]) handler(event);
	  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (promise, state) {
	  task$1.call(global_1, function () {
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform(function () {
	        if (IS_NODE$1) {
	          process$3.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (promise, state) {
	  task$1.call(global_1, function () {
	    if (IS_NODE$1) {
	      process$3.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};

	var bind = function (fn, promise, state, unwrap) {
	  return function (value) {
	    fn(promise, state, value, unwrap);
	  };
	};

	var internalReject = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify$1(promise, state, true);
	};

	var internalResolve = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  try {
	    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
	    var then = isThenable(value);
	    if (then) {
	      microtask(function () {
	        var wrapper = { done: false };
	        try {
	          then.call(value,
	            bind(internalResolve, promise, wrapper, state),
	            bind(internalReject, promise, wrapper, state)
	          );
	        } catch (error) {
	          internalReject(promise, wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify$1(promise, state, false);
	    }
	  } catch (error) {
	    internalReject(promise, { done: false }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED$a) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromiseConstructor, PROMISE);
	    aFunction$1(executor);
	    Internal.call(this);
	    var state = getInternalState$3(this);
	    try {
	      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
	    } catch (error) {
	      internalReject(this, state, error);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal = function Promise(executor) {
	    setInternalState$4(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: [],
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };
	  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState(this);
	      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = IS_NODE$1 ? process$3.domain : undefined;
	      state.parent = true;
	      state.reactions.push(reaction);
	      if (state.state != PENDING) notify$1(this, state, false);
	      return reaction.promise;
	    },
	    // `Promise.prototype.catch` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalState$3(promise);
	    this.promise = promise;
	    this.resolve = bind(internalResolve, promise, state);
	    this.reject = bind(internalReject, promise, state);
	  };
	  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };

	  if ( typeof nativePromiseConstructor == 'function') {
	    nativeThen = nativePromiseConstructor.prototype.then;

	    // wrap native Promise#then for native async functions
	    redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
	      var that = this;
	      return new PromiseConstructor(function (resolve, reject) {
	        nativeThen.call(that, resolve, reject);
	      }).then(onFulfilled, onRejected);
	    // https://github.com/zloirock/core-js/issues/640
	    }, { unsafe: true });

	    // wrap fetch result
	    if (typeof $fetch == 'function') _export({ global: true, enumerable: true, forced: true }, {
	      // eslint-disable-next-line no-unused-vars
	      fetch: function fetch(input /* , init */) {
	        return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
	      }
	    });
	  }
	}

	_export({ global: true, wrap: true, forced: FORCED$a }, {
	  Promise: PromiseConstructor
	});

	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);

	PromiseWrapper = getBuiltIn(PROMISE);

	// statics
	_export({ target: PROMISE, stat: true, forced: FORCED$a }, {
	  // `Promise.reject` method
	  // https://tc39.github.io/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability$1(this);
	    capability.reject.call(undefined, r);
	    return capability.promise;
	  }
	});

	_export({ target: PROMISE, stat: true, forced:  FORCED$a }, {
	  // `Promise.resolve` method
	  // https://tc39.github.io/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve( this, x);
	  }
	});

	_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION$1 }, {
	  // `Promise.all` method
	  // https://tc39.github.io/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate_1(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        $promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  },
	  // `Promise.race` method
	  // https://tc39.github.io/ecma262/#sec-promise.race
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      iterate_1(iterable, function (promise) {
	        $promiseResolve.call(C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	// `Promise.allSettled` method
	// https://github.com/tc39/proposal-promise-allSettled
	_export({ target: 'Promise', stat: true }, {
	  allSettled: function allSettled(iterable) {
	    var C = this;
	    var capability = newPromiseCapability.f(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var promiseResolve = aFunction$1(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate_1(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = { status: 'fulfilled', value: value };
	          --remaining || resolve(values);
	        }, function (e) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = { status: 'rejected', reason: e };
	          --remaining || resolve(values);
	        });
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
	var NON_GENERIC = !!nativePromiseConstructor && fails(function () {
	  nativePromiseConstructor.prototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
	});

	// `Promise.prototype.finally` method
	// https://tc39.github.io/ecma262/#sec-promise.prototype.finally
	_export({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
	  'finally': function (onFinally) {
	    var C = speciesConstructor(this, getBuiltIn('Promise'));
	    var isFunction = typeof onFinally == 'function';
	    return this.then(
	      isFunction ? function (x) {
	        return promiseResolve(C, onFinally()).then(function () { return x; });
	      } : onFinally,
	      isFunction ? function (e) {
	        return promiseResolve(C, onFinally()).then(function () { throw e; });
	      } : onFinally
	    );
	  }
	});

	// patch native Promise.prototype for native async functions
	if ( typeof nativePromiseConstructor == 'function' && !nativePromiseConstructor.prototype['finally']) {
	  redefine(nativePromiseConstructor.prototype, 'finally', getBuiltIn('Promise').prototype['finally']);
	}

	var nativeApply = getBuiltIn('Reflect', 'apply');
	var functionApply = Function.apply;

	// MS Edge argumentsList argument is optional
	var OPTIONAL_ARGUMENTS_LIST = !fails(function () {
	  nativeApply(function () { /* empty */ });
	});

	// `Reflect.apply` method
	// https://tc39.github.io/ecma262/#sec-reflect.apply
	_export({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
	  apply: function apply(target, thisArgument, argumentsList) {
	    aFunction$1(target);
	    anObject(argumentsList);
	    return nativeApply
	      ? nativeApply(target, thisArgument, argumentsList)
	      : functionApply.call(target, thisArgument, argumentsList);
	  }
	});

	var slice = [].slice;
	var factories = {};

	var construct = function (C, argsLength, args) {
	  if (!(argsLength in factories)) {
	    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
	    // eslint-disable-next-line no-new-func
	    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
	  } return factories[argsLength](C, args);
	};

	// `Function.prototype.bind` method implementation
	// https://tc39.github.io/ecma262/#sec-function.prototype.bind
	var functionBind = Function.bind || function bind(that /* , ...args */) {
	  var fn = aFunction$1(this);
	  var partArgs = slice.call(arguments, 1);
	  var boundFunction = function bound(/* args... */) {
	    var args = partArgs.concat(slice.call(arguments));
	    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
	  };
	  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
	  return boundFunction;
	};

	var nativeConstruct = getBuiltIn('Reflect', 'construct');

	// `Reflect.construct` method
	// https://tc39.github.io/ecma262/#sec-reflect.construct
	// MS Edge supports only 2 arguments and argumentsList argument is optional
	// FF Nightly sets third argument as `new.target`, but does not create `this` from it
	var NEW_TARGET_BUG = fails(function () {
	  function F() { /* empty */ }
	  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
	});
	var ARGS_BUG = !fails(function () {
	  nativeConstruct(function () { /* empty */ });
	});
	var FORCED$b = NEW_TARGET_BUG || ARGS_BUG;

	_export({ target: 'Reflect', stat: true, forced: FORCED$b, sham: FORCED$b }, {
	  construct: function construct(Target, args /* , newTarget */) {
	    aFunction$1(Target);
	    anObject(args);
	    var newTarget = arguments.length < 3 ? Target : aFunction$1(arguments[2]);
	    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
	    if (Target == newTarget) {
	      // w/o altered newTarget, optimization for 0-4 arguments
	      switch (args.length) {
	        case 0: return new Target();
	        case 1: return new Target(args[0]);
	        case 2: return new Target(args[0], args[1]);
	        case 3: return new Target(args[0], args[1], args[2]);
	        case 4: return new Target(args[0], args[1], args[2], args[3]);
	      }
	      // w/o altered newTarget, lot of arguments case
	      var $args = [null];
	      $args.push.apply($args, args);
	      return new (functionBind.apply(Target, $args))();
	    }
	    // with altered newTarget, not support built-in constructors
	    var proto = newTarget.prototype;
	    var instance = objectCreate(isObject(proto) ? proto : Object.prototype);
	    var result = Function.apply.call(Target, instance, args);
	    return isObject(result) ? result : instance;
	  }
	});

	// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
	var ERROR_INSTEAD_OF_FALSE = fails(function () {
	  // eslint-disable-next-line no-undef
	  Reflect.defineProperty(objectDefineProperty.f({}, 1, { value: 1 }), 1, { value: 2 });
	});

	// `Reflect.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-reflect.defineproperty
	_export({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !descriptors }, {
	  defineProperty: function defineProperty(target, propertyKey, attributes) {
	    anObject(target);
	    var key = toPrimitive(propertyKey, true);
	    anObject(attributes);
	    try {
	      objectDefineProperty.f(target, key, attributes);
	      return true;
	    } catch (error) {
	      return false;
	    }
	  }
	});

	var getOwnPropertyDescriptor$6 = objectGetOwnPropertyDescriptor.f;

	// `Reflect.deleteProperty` method
	// https://tc39.github.io/ecma262/#sec-reflect.deleteproperty
	_export({ target: 'Reflect', stat: true }, {
	  deleteProperty: function deleteProperty(target, propertyKey) {
	    var descriptor = getOwnPropertyDescriptor$6(anObject(target), propertyKey);
	    return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
	  }
	});

	// `Reflect.get` method
	// https://tc39.github.io/ecma262/#sec-reflect.get
	function get$2(target, propertyKey /* , receiver */) {
	  var receiver = arguments.length < 3 ? target : arguments[2];
	  var descriptor, prototype;
	  if (anObject(target) === receiver) return target[propertyKey];
	  if (descriptor = objectGetOwnPropertyDescriptor.f(target, propertyKey)) return has(descriptor, 'value')
	    ? descriptor.value
	    : descriptor.get === undefined
	      ? undefined
	      : descriptor.get.call(receiver);
	  if (isObject(prototype = objectGetPrototypeOf(target))) return get$2(prototype, propertyKey, receiver);
	}

	_export({ target: 'Reflect', stat: true }, {
	  get: get$2
	});

	// `Reflect.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-reflect.getownpropertydescriptor
	_export({ target: 'Reflect', stat: true, sham: !descriptors }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
	    return objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
	  }
	});

	// `Reflect.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-reflect.getprototypeof
	_export({ target: 'Reflect', stat: true, sham: !correctPrototypeGetter }, {
	  getPrototypeOf: function getPrototypeOf(target) {
	    return objectGetPrototypeOf(anObject(target));
	  }
	});

	// `Reflect.has` method
	// https://tc39.github.io/ecma262/#sec-reflect.has
	_export({ target: 'Reflect', stat: true }, {
	  has: function has(target, propertyKey) {
	    return propertyKey in target;
	  }
	});

	var objectIsExtensible = Object.isExtensible;

	// `Reflect.isExtensible` method
	// https://tc39.github.io/ecma262/#sec-reflect.isextensible
	_export({ target: 'Reflect', stat: true }, {
	  isExtensible: function isExtensible(target) {
	    anObject(target);
	    return objectIsExtensible ? objectIsExtensible(target) : true;
	  }
	});

	// `Reflect.ownKeys` method
	// https://tc39.github.io/ecma262/#sec-reflect.ownkeys
	_export({ target: 'Reflect', stat: true }, {
	  ownKeys: ownKeys
	});

	// `Reflect.preventExtensions` method
	// https://tc39.github.io/ecma262/#sec-reflect.preventextensions
	_export({ target: 'Reflect', stat: true, sham: !freezing }, {
	  preventExtensions: function preventExtensions(target) {
	    anObject(target);
	    try {
	      var objectPreventExtensions = getBuiltIn('Object', 'preventExtensions');
	      if (objectPreventExtensions) objectPreventExtensions(target);
	      return true;
	    } catch (error) {
	      return false;
	    }
	  }
	});

	// `Reflect.set` method
	// https://tc39.github.io/ecma262/#sec-reflect.set
	function set$3(target, propertyKey, V /* , receiver */) {
	  var receiver = arguments.length < 4 ? target : arguments[3];
	  var ownDescriptor = objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
	  var existingDescriptor, prototype;
	  if (!ownDescriptor) {
	    if (isObject(prototype = objectGetPrototypeOf(target))) {
	      return set$3(prototype, propertyKey, V, receiver);
	    }
	    ownDescriptor = createPropertyDescriptor(0);
	  }
	  if (has(ownDescriptor, 'value')) {
	    if (ownDescriptor.writable === false || !isObject(receiver)) return false;
	    if (existingDescriptor = objectGetOwnPropertyDescriptor.f(receiver, propertyKey)) {
	      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
	      existingDescriptor.value = V;
	      objectDefineProperty.f(receiver, propertyKey, existingDescriptor);
	    } else objectDefineProperty.f(receiver, propertyKey, createPropertyDescriptor(0, V));
	    return true;
	  }
	  return ownDescriptor.set === undefined ? false : (ownDescriptor.set.call(receiver, V), true);
	}

	// MS Edge 17-18 Reflect.set allows setting the property to object
	// with non-writable property on the prototype
	var MS_EDGE_BUG = fails(function () {
	  var object = objectDefineProperty.f({}, 'a', { configurable: true });
	  // eslint-disable-next-line no-undef
	  return Reflect.set(objectGetPrototypeOf(object), 'a', 1, object) !== false;
	});

	_export({ target: 'Reflect', stat: true, forced: MS_EDGE_BUG }, {
	  set: set$3
	});

	// `Reflect.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-reflect.setprototypeof
	if (objectSetPrototypeOf) _export({ target: 'Reflect', stat: true }, {
	  setPrototypeOf: function setPrototypeOf(target, proto) {
	    anObject(target);
	    aPossiblePrototype(proto);
	    try {
	      objectSetPrototypeOf(target, proto);
	      return true;
	    } catch (error) {
	      return false;
	    }
	  }
	});

	var MATCH = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
	// so we use an intermediate function.
	function RE(s, f) {
	  return RegExp(s, f);
	}

	var UNSUPPORTED_Y = fails(function () {
	  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	  var re = RE('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	var BROKEN_CARET = fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = RE('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
		UNSUPPORTED_Y: UNSUPPORTED_Y,
		BROKEN_CARET: BROKEN_CARET
	};

	var defineProperty$a = objectDefineProperty.f;
	var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;





	var setInternalState$5 = internalState.set;



	var MATCH$1 = wellKnownSymbol('match');
	var NativeRegExp = global_1.RegExp;
	var RegExpPrototype = NativeRegExp.prototype;
	var re1 = /a/g;
	var re2 = /a/g;

	// "new" should create a new object, old webkit bug
	var CORRECT_NEW = new NativeRegExp(re1) !== re1;

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y;

	var FORCED$c = descriptors && isForced_1('RegExp', (!CORRECT_NEW || UNSUPPORTED_Y$1 || fails(function () {
	  re2[MATCH$1] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
	})));

	// `RegExp` constructor
	// https://tc39.github.io/ecma262/#sec-regexp-constructor
	if (FORCED$c) {
	  var RegExpWrapper = function RegExp(pattern, flags) {
	    var thisIsRegExp = this instanceof RegExpWrapper;
	    var patternIsRegExp = isRegexp(pattern);
	    var flagsAreUndefined = flags === undefined;
	    var sticky;

	    if (!thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined) {
	      return pattern;
	    }

	    if (CORRECT_NEW) {
	      if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
	    } else if (pattern instanceof RegExpWrapper) {
	      if (flagsAreUndefined) flags = regexpFlags.call(pattern);
	      pattern = pattern.source;
	    }

	    if (UNSUPPORTED_Y$1) {
	      sticky = !!flags && flags.indexOf('y') > -1;
	      if (sticky) flags = flags.replace(/y/g, '');
	    }

	    var result = inheritIfRequired(
	      CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags),
	      thisIsRegExp ? this : RegExpPrototype,
	      RegExpWrapper
	    );

	    if (UNSUPPORTED_Y$1 && sticky) setInternalState$5(result, { sticky: sticky });

	    return result;
	  };
	  var proxy = function (key) {
	    key in RegExpWrapper || defineProperty$a(RegExpWrapper, key, {
	      configurable: true,
	      get: function () { return NativeRegExp[key]; },
	      set: function (it) { NativeRegExp[key] = it; }
	    });
	  };
	  var keys$3 = getOwnPropertyNames$2(NativeRegExp);
	  var index = 0;
	  while (keys$3.length > index) proxy(keys$3[index++]);
	  RegExpPrototype.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype;
	  redefine(global_1, 'RegExp', RegExpWrapper);
	}

	// https://tc39.github.io/ecma262/#sec-get-regexp-@@species
	setSpecies('RegExp');

	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$2;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	    var sticky = UNSUPPORTED_Y$2 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');
	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = String(str).slice(re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
	  exec: regexpExec
	});

	var UNSUPPORTED_Y$3 = regexpStickyHelpers.UNSUPPORTED_Y;

	// `RegExp.prototype.flags` getter
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	if (descriptors && (/./g.flags != 'g' || UNSUPPORTED_Y$3)) {
	  objectDefineProperty.f(RegExp.prototype, 'flags', {
	    configurable: true,
	    get: regexpFlags
	  });
	}

	var UNSUPPORTED_Y$4 = regexpStickyHelpers.UNSUPPORTED_Y;
	var defineProperty$b = objectDefineProperty.f;
	var getInternalState$4 = internalState.get;
	var RegExpPrototype$1 = RegExp.prototype;

	// `RegExp.prototype.sticky` getter
	if (descriptors && UNSUPPORTED_Y$4) {
	  defineProperty$b(RegExp.prototype, 'sticky', {
	    configurable: true,
	    get: function () {
	      if (this === RegExpPrototype$1) return undefined;
	      // We can't use InternalStateModule.getterFor because
	      // we don't add metadata for regexps created by a literal.
	      if (this instanceof RegExp) {
	        return !!getInternalState$4(this).sticky;
	      }
	      throw TypeError('Incompatible receiver, RegExp required');
	    }
	  });
	}

	// TODO: Remove from `core-js@4` since it's moved to entry points




	var DELEGATES_TO_EXEC = function () {
	  var execCalled = false;
	  var re = /[ac]/;
	  re.exec = function () {
	    execCalled = true;
	    return /./.exec.apply(this, arguments);
	  };
	  return re.test('abc') === true && execCalled;
	}();

	var nativeTest = /./.test;

	_export({ target: 'RegExp', proto: true, forced: !DELEGATES_TO_EXEC }, {
	  test: function (str) {
	    if (typeof this.exec !== 'function') {
	      return nativeTest.call(this, str);
	    }
	    var result = this.exec(str);
	    if (result !== null && !isObject(result)) {
	      throw new Error('RegExp exec method returned something other than an Object or null');
	    }
	    return !!result;
	  }
	});

	var TO_STRING = 'toString';
	var RegExpPrototype$2 = RegExp.prototype;
	var nativeToString = RegExpPrototype$2[TO_STRING];

	var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME = nativeToString.name != TO_STRING;

	// `RegExp.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$2) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

	// `Set` constructor
	// https://tc39.github.io/ecma262/#sec-set-objects
	var es_set = collection('Set', function (init) {
	  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$5 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING ? S.charAt(position) : first
	        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$5(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$5(true)
	};

	var codeAt = stringMultibyte.codeAt;

	// `String.prototype.codePointAt` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	_export({ target: 'String', proto: true }, {
	  codePointAt: function codePointAt(pos) {
	    return codeAt(this, pos);
	  }
	});

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  } return it;
	};

	var MATCH$2 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (e) {
	    try {
	      regexp[MATCH$2] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (f) { /* empty */ }
	  } return false;
	};

	var getOwnPropertyDescriptor$7 = objectGetOwnPropertyDescriptor.f;






	var nativeEndsWith = ''.endsWith;
	var min$5 = Math.min;

	var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('endsWith');
	// https://github.com/zloirock/core-js/pull/702
	var MDN_POLYFILL_BUG =  !CORRECT_IS_REGEXP_LOGIC && !!function () {
	  var descriptor = getOwnPropertyDescriptor$7(String.prototype, 'endsWith');
	  return descriptor && !descriptor.writable;
	}();

	// `String.prototype.endsWith` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.endswith
	_export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
	  endsWith: function endsWith(searchString /* , endPosition = @length */) {
	    var that = String(requireObjectCoercible(this));
	    notARegexp(searchString);
	    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
	    var len = toLength(that.length);
	    var end = endPosition === undefined ? len : min$5(toLength(endPosition), len);
	    var search = String(searchString);
	    return nativeEndsWith
	      ? nativeEndsWith.call(that, search, end)
	      : that.slice(end - search.length, end) === search;
	  }
	});

	var fromCharCode = String.fromCharCode;
	var nativeFromCodePoint = String.fromCodePoint;

	// length should be 1, old FF problem
	var INCORRECT_LENGTH = !!nativeFromCodePoint && nativeFromCodePoint.length != 1;

	// `String.fromCodePoint` method
	// https://tc39.github.io/ecma262/#sec-string.fromcodepoint
	_export({ target: 'String', stat: true, forced: INCORRECT_LENGTH }, {
	  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
	    var elements = [];
	    var length = arguments.length;
	    var i = 0;
	    var code;
	    while (length > i) {
	      code = +arguments[i++];
	      if (toAbsoluteIndex(code, 0x10FFFF) !== code) throw RangeError(code + ' is not a valid code point');
	      elements.push(code < 0x10000
	        ? fromCharCode(code)
	        : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00)
	      );
	    } return elements.join('');
	  }
	});

	// `String.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.includes
	_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~String(requireObjectCoercible(this))
	      .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var charAt = stringMultibyte.charAt;



	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$6 = internalState.set;
	var getInternalState$5 = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState$6(this, {
	    type: STRING_ITERATOR,
	    string: String(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$5(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points







	var SPECIES$6 = wellKnownSymbol('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	var REPLACE = wellKnownSymbol('replace');
	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }
	  return false;
	})();

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$6] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !(
	      REPLACE_SUPPORTS_NAMED_GROUPS &&
	      REPLACE_KEEPS_$0 &&
	      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    )) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	        }
	        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	      }
	      return { done: false };
	    }, {
	      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
	      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];

	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return regexMethod.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return regexMethod.call(string, this); }
	    );
	  }

	  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
	};

	var charAt$1 = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt$1(S, index).length : 1);
	};

	// `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	// @@match logic
	fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = requireObjectCoercible(this);
	      var matcher = regexp == undefined ? undefined : regexp[MATCH];
	      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
	    function (regexp) {
	      var res = maybeCallNative(nativeMatch, regexp, this);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);

	      if (!rx.global) return regexpExecAbstract(rx, S);

	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regexpExecAbstract(rx, S)) !== null) {
	        var matchStr = String(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	var MATCH_ALL = wellKnownSymbol('matchAll');
	var REGEXP_STRING = 'RegExp String';
	var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
	var setInternalState$7 = internalState.set;
	var getInternalState$6 = internalState.getterFor(REGEXP_STRING_ITERATOR);
	var RegExpPrototype$3 = RegExp.prototype;
	var regExpBuiltinExec = RegExpPrototype$3.exec;
	var nativeMatchAll = ''.matchAll;

	var WORKS_WITH_NON_GLOBAL_REGEX = !!nativeMatchAll && !fails(function () {
	  'a'.matchAll(/./);
	});

	var regExpExec = function (R, S) {
	  var exec = R.exec;
	  var result;
	  if (typeof exec == 'function') {
	    result = exec.call(R, S);
	    if (typeof result != 'object') throw TypeError('Incorrect exec result');
	    return result;
	  } return regExpBuiltinExec.call(R, S);
	};

	// eslint-disable-next-line max-len
	var $RegExpStringIterator = createIteratorConstructor(function RegExpStringIterator(regexp, string, global, fullUnicode) {
	  setInternalState$7(this, {
	    type: REGEXP_STRING_ITERATOR,
	    regexp: regexp,
	    string: string,
	    global: global,
	    unicode: fullUnicode,
	    done: false
	  });
	}, REGEXP_STRING, function next() {
	  var state = getInternalState$6(this);
	  if (state.done) return { value: undefined, done: true };
	  var R = state.regexp;
	  var S = state.string;
	  var match = regExpExec(R, S);
	  if (match === null) return { value: undefined, done: state.done = true };
	  if (state.global) {
	    if (String(match[0]) == '') R.lastIndex = advanceStringIndex(S, toLength(R.lastIndex), state.unicode);
	    return { value: match, done: false };
	  }
	  state.done = true;
	  return { value: match, done: false };
	});

	var $matchAll = function (string) {
	  var R = anObject(this);
	  var S = String(string);
	  var C, flagsValue, flags, matcher, global, fullUnicode;
	  C = speciesConstructor(R, RegExp);
	  flagsValue = R.flags;
	  if (flagsValue === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$3)) {
	    flagsValue = regexpFlags.call(R);
	  }
	  flags = flagsValue === undefined ? '' : String(flagsValue);
	  matcher = new C(C === RegExp ? R.source : R, flags);
	  global = !!~flags.indexOf('g');
	  fullUnicode = !!~flags.indexOf('u');
	  matcher.lastIndex = toLength(R.lastIndex);
	  return new $RegExpStringIterator(matcher, S, global, fullUnicode);
	};

	// `String.prototype.matchAll` method
	// https://github.com/tc39/proposal-string-matchall
	_export({ target: 'String', proto: true, forced: WORKS_WITH_NON_GLOBAL_REGEX }, {
	  matchAll: function matchAll(regexp) {
	    var O = requireObjectCoercible(this);
	    var flags, S, matcher, rx;
	    if (regexp != null) {
	      if (isRegexp(regexp)) {
	        flags = String(requireObjectCoercible('flags' in RegExpPrototype$3
	          ? regexp.flags
	          : regexpFlags.call(regexp)
	        ));
	        if (!~flags.indexOf('g')) throw TypeError('`.matchAll` does not allow non-global regexes');
	      }
	      if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
	      matcher = regexp[MATCH_ALL];
	      if (matcher === undefined && isPure && classofRaw(regexp) == 'RegExp') matcher = $matchAll;
	      if (matcher != null) return aFunction$1(matcher).call(regexp, O);
	    } else if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
	    S = String(O);
	    rx = new RegExp(regexp, 'g');
	    return  rx[MATCH_ALL](S);
	  }
	});

	 MATCH_ALL in RegExpPrototype$3 || createNonEnumerableProperty(RegExpPrototype$3, MATCH_ALL, $matchAll);

	// https://github.com/tc39/proposal-string-pad-start-end




	var ceil$2 = Math.ceil;

	// `String.prototype.{ padStart, padEnd }` methods implementation
	var createMethod$6 = function (IS_END) {
	  return function ($this, maxLength, fillString) {
	    var S = String(requireObjectCoercible($this));
	    var stringLength = S.length;
	    var fillStr = fillString === undefined ? ' ' : String(fillString);
	    var intMaxLength = toLength(maxLength);
	    var fillLen, stringFiller;
	    if (intMaxLength <= stringLength || fillStr == '') return S;
	    fillLen = intMaxLength - stringLength;
	    stringFiller = stringRepeat.call(fillStr, ceil$2(fillLen / fillStr.length));
	    if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
	    return IS_END ? S + stringFiller : stringFiller + S;
	  };
	};

	var stringPad = {
	  // `String.prototype.padStart` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.padstart
	  start: createMethod$6(false),
	  // `String.prototype.padEnd` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.padend
	  end: createMethod$6(true)
	};

	// https://github.com/zloirock/core-js/issues/280


	// eslint-disable-next-line unicorn/no-unsafe-regex
	var stringPadWebkitBug = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(engineUserAgent);

	var $padEnd = stringPad.end;


	// `String.prototype.padEnd` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.padend
	_export({ target: 'String', proto: true, forced: stringPadWebkitBug }, {
	  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
	    return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $padStart = stringPad.start;


	// `String.prototype.padStart` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.padstart
	_export({ target: 'String', proto: true, forced: stringPadWebkitBug }, {
	  padStart: function padStart(maxLength /* , fillString = ' ' */) {
	    return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// `String.raw` method
	// https://tc39.github.io/ecma262/#sec-string.raw
	_export({ target: 'String', stat: true }, {
	  raw: function raw(template) {
	    var rawTemplate = toIndexedObject(template.raw);
	    var literalSegments = toLength(rawTemplate.length);
	    var argumentsLength = arguments.length;
	    var elements = [];
	    var i = 0;
	    while (literalSegments > i) {
	      elements.push(String(rawTemplate[i++]));
	      if (i < argumentsLength) elements.push(String(arguments[i]));
	    } return elements.join('');
	  }
	});

	// `String.prototype.repeat` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
	_export({ target: 'String', proto: true }, {
	  repeat: stringRepeat
	});

	var max$3 = Math.max;
	var min$6 = Math.min;
	var floor$6 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// @@replace logic
	fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
	  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
	  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

	  return [
	    // `String.prototype.replace` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible(this);
	      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	      return replacer !== undefined
	        ? replacer.call(searchValue, O, replaceValue)
	        : nativeReplace.call(String(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	    function (regexp, replaceValue) {
	      if (
	        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
	        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
	      ) {
	        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
	        if (res.done) return res.value;
	      }

	      var rx = anObject(regexp);
	      var S = String(this);

	      var functionalReplace = typeof replaceValue === 'function';
	      if (!functionalReplace) replaceValue = String(replaceValue);

	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regexpExecAbstract(rx, S);
	        if (result === null) break;

	        results.push(result);
	        if (!global) break;

	        var matchStr = String(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = String(result[0]);
	        var position = max$3(min$6(toInteger(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = String(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];

	  // https://tc39.github.io/ecma262/#sec-getsubstitution
	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	    if (namedCaptures !== undefined) {
	      namedCaptures = toObject(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }
	    return nativeReplace.call(replacement, symbols, function (match, ch) {
	      var capture;
	      switch (ch.charAt(0)) {
	        case '$': return '$';
	        case '&': return matched;
	        case '`': return str.slice(0, position);
	        case "'": return str.slice(tailPos);
	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;
	        default: // \d\d?
	          var n = +ch;
	          if (n === 0) return match;
	          if (n > m) {
	            var f = floor$6(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }
	          capture = captures[n - 1];
	      }
	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	// @@search logic
	fixRegexpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
	  return [
	    // `String.prototype.search` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.search
	    function search(regexp) {
	      var O = requireObjectCoercible(this);
	      var searcher = regexp == undefined ? undefined : regexp[SEARCH];
	      return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
	    },
	    // `RegExp.prototype[@@search]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
	    function (regexp) {
	      var res = maybeCallNative(nativeSearch, regexp, this);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);

	      var previousLastIndex = rx.lastIndex;
	      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
	      var result = regexpExecAbstract(rx, S);
	      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
	      return result === null ? -1 : result.index;
	    }
	  ];
	});

	var arrayPush = [].push;
	var min$7 = Math.min;
	var MAX_UINT32 = 0xFFFFFFFF;

	// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
	var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

	// @@split logic
	fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;
	  if (
	    'abbc'.split(/(b)*/)[1] == 'c' ||
	    'test'.split(/(?:)/, -1).length != 4 ||
	    'ab'.split(/(?:ab)*/).length != 2 ||
	    '.'.split(/(.?)(.?)/).length != 4 ||
	    '.'.split(/()()/).length > 1 ||
	    ''.split(/.?/).length
	  ) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(requireObjectCoercible(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string];
	      // If `separator` is not a regex, use native split
	      if (!isRegexp(separator)) {
	        return nativeSplit.call(string, separator, lim);
	      }
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;
	      while (match = regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;
	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }
	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string.length) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));
	      return output.length > lim ? output.slice(0, lim) : output;
	    };
	  // Chakra, V8
	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [
	    // `String.prototype.split` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.split
	    function split(separator, limit) {
	      var O = requireObjectCoercible(this);
	      var splitter = separator == undefined ? undefined : separator[SPLIT];
	      return splitter !== undefined
	        ? splitter.call(separator, O, limit)
	        : internalSplit.call(String(O), separator, limit);
	    },
	    // `RegExp.prototype[@@split]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	    //
	    // NOTE: This cannot be properly polyfilled in engines that don't support
	    // the 'y' flag.
	    function (regexp, limit) {
	      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);
	      var C = speciesConstructor(rx, RegExp);

	      var unicodeMatching = rx.unicode;
	      var flags = (rx.ignoreCase ? 'i' : '') +
	                  (rx.multiline ? 'm' : '') +
	                  (rx.unicode ? 'u' : '') +
	                  (SUPPORTS_Y ? 'y' : 'g');

	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = SUPPORTS_Y ? q : 0;
	        var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
	        var e;
	        if (
	          z === null ||
	          (e = min$7(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
	        ) {
	          q = advanceStringIndex(S, q, unicodeMatching);
	        } else {
	          A.push(S.slice(p, q));
	          if (A.length === lim) return A;
	          for (var i = 1; i <= z.length - 1; i++) {
	            A.push(z[i]);
	            if (A.length === lim) return A;
	          }
	          q = p = e;
	        }
	      }
	      A.push(S.slice(p));
	      return A;
	    }
	  ];
	}, !SUPPORTS_Y);

	var getOwnPropertyDescriptor$8 = objectGetOwnPropertyDescriptor.f;






	var nativeStartsWith = ''.startsWith;
	var min$8 = Math.min;

	var CORRECT_IS_REGEXP_LOGIC$1 = correctIsRegexpLogic('startsWith');
	// https://github.com/zloirock/core-js/pull/702
	var MDN_POLYFILL_BUG$1 =  !CORRECT_IS_REGEXP_LOGIC$1 && !!function () {
	  var descriptor = getOwnPropertyDescriptor$8(String.prototype, 'startsWith');
	  return descriptor && !descriptor.writable;
	}();

	// `String.prototype.startsWith` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.startswith
	_export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG$1 && !CORRECT_IS_REGEXP_LOGIC$1 }, {
	  startsWith: function startsWith(searchString /* , position = 0 */) {
	    var that = String(requireObjectCoercible(this));
	    notARegexp(searchString);
	    var index = toLength(min$8(arguments.length > 1 ? arguments[1] : undefined, that.length));
	    var search = String(searchString);
	    return nativeStartsWith
	      ? nativeStartsWith.call(that, search, index)
	      : that.slice(index, index + search.length) === search;
	  }
	});

	var non = '\u200B\u0085\u180E';

	// check that a method works with the correct list
	// of whitespaces and has a correct name
	var stringTrimForced = function (METHOD_NAME) {
	  return fails(function () {
	    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
	  });
	};

	var $trim = stringTrim.trim;


	// `String.prototype.trim` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.trim
	_export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	var $trimEnd = stringTrim.end;


	var FORCED$d = stringTrimForced('trimEnd');

	var trimEnd = FORCED$d ? function trimEnd() {
	  return $trimEnd(this);
	} : ''.trimEnd;

	// `String.prototype.{ trimEnd, trimRight }` methods
	// https://github.com/tc39/ecmascript-string-left-right-trim
	_export({ target: 'String', proto: true, forced: FORCED$d }, {
	  trimEnd: trimEnd,
	  trimRight: trimEnd
	});

	var $trimStart = stringTrim.start;


	var FORCED$e = stringTrimForced('trimStart');

	var trimStart = FORCED$e ? function trimStart() {
	  return $trimStart(this);
	} : ''.trimStart;

	// `String.prototype.{ trimStart, trimLeft }` methods
	// https://github.com/tc39/ecmascript-string-left-right-trim
	_export({ target: 'String', proto: true, forced: FORCED$e }, {
	  trimStart: trimStart,
	  trimLeft: trimStart
	});

	var quot = /"/g;

	// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
	// https://tc39.github.io/ecma262/#sec-createhtml
	var createHtml = function (string, tag, attribute, value) {
	  var S = String(requireObjectCoercible(string));
	  var p1 = '<' + tag;
	  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};

	// check the existence of a method, lowercase
	// of a tag and escaping quotes in arguments
	var stringHtmlForced = function (METHOD_NAME) {
	  return fails(function () {
	    var test = ''[METHOD_NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  });
	};

	// `String.prototype.anchor` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.anchor
	_export({ target: 'String', proto: true, forced: stringHtmlForced('anchor') }, {
	  anchor: function anchor(name) {
	    return createHtml(this, 'a', 'name', name);
	  }
	});

	// `String.prototype.big` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.big
	_export({ target: 'String', proto: true, forced: stringHtmlForced('big') }, {
	  big: function big() {
	    return createHtml(this, 'big', '', '');
	  }
	});

	// `String.prototype.blink` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.blink
	_export({ target: 'String', proto: true, forced: stringHtmlForced('blink') }, {
	  blink: function blink() {
	    return createHtml(this, 'blink', '', '');
	  }
	});

	// `String.prototype.bold` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.bold
	_export({ target: 'String', proto: true, forced: stringHtmlForced('bold') }, {
	  bold: function bold() {
	    return createHtml(this, 'b', '', '');
	  }
	});

	// `String.prototype.fixed` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.fixed
	_export({ target: 'String', proto: true, forced: stringHtmlForced('fixed') }, {
	  fixed: function fixed() {
	    return createHtml(this, 'tt', '', '');
	  }
	});

	// `String.prototype.fontcolor` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.fontcolor
	_export({ target: 'String', proto: true, forced: stringHtmlForced('fontcolor') }, {
	  fontcolor: function fontcolor(color) {
	    return createHtml(this, 'font', 'color', color);
	  }
	});

	// `String.prototype.fontsize` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.fontsize
	_export({ target: 'String', proto: true, forced: stringHtmlForced('fontsize') }, {
	  fontsize: function fontsize(size) {
	    return createHtml(this, 'font', 'size', size);
	  }
	});

	// `String.prototype.italics` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.italics
	_export({ target: 'String', proto: true, forced: stringHtmlForced('italics') }, {
	  italics: function italics() {
	    return createHtml(this, 'i', '', '');
	  }
	});

	// `String.prototype.link` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.link
	_export({ target: 'String', proto: true, forced: stringHtmlForced('link') }, {
	  link: function link(url) {
	    return createHtml(this, 'a', 'href', url);
	  }
	});

	// `String.prototype.small` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.small
	_export({ target: 'String', proto: true, forced: stringHtmlForced('small') }, {
	  small: function small() {
	    return createHtml(this, 'small', '', '');
	  }
	});

	// `String.prototype.strike` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.strike
	_export({ target: 'String', proto: true, forced: stringHtmlForced('strike') }, {
	  strike: function strike() {
	    return createHtml(this, 'strike', '', '');
	  }
	});

	// `String.prototype.sub` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.sub
	_export({ target: 'String', proto: true, forced: stringHtmlForced('sub') }, {
	  sub: function sub() {
	    return createHtml(this, 'sub', '', '');
	  }
	});

	// `String.prototype.sup` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.sup
	_export({ target: 'String', proto: true, forced: stringHtmlForced('sup') }, {
	  sup: function sup() {
	    return createHtml(this, 'sup', '', '');
	  }
	});

	/* eslint-disable no-new */



	var NATIVE_ARRAY_BUFFER_VIEWS$2 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

	var ArrayBuffer$3 = global_1.ArrayBuffer;
	var Int8Array$2 = global_1.Int8Array;

	var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$2 || !fails(function () {
	  Int8Array$2(1);
	}) || !fails(function () {
	  new Int8Array$2(-1);
	}) || !checkCorrectnessOfIteration(function (iterable) {
	  new Int8Array$2();
	  new Int8Array$2(null);
	  new Int8Array$2(1.5);
	  new Int8Array$2(iterable);
	}, true) || fails(function () {
	  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
	  return new Int8Array$2(new ArrayBuffer$3(2), 1, undefined).length !== 1;
	});

	var toPositiveInteger = function (it) {
	  var result = toInteger(it);
	  if (result < 0) throw RangeError("The argument can't be less than 0");
	  return result;
	};

	var toOffset = function (it, BYTES) {
	  var offset = toPositiveInteger(it);
	  if (offset % BYTES) throw RangeError('Wrong offset');
	  return offset;
	};

	var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

	var typedArrayFrom = function from(source /* , mapfn, thisArg */) {
	  var O = toObject(source);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod(O);
	  var i, length, result, step, iterator, next;
	  if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
	    iterator = iteratorMethod.call(O);
	    next = iterator.next;
	    O = [];
	    while (!(step = next.call(iterator)).done) {
	      O.push(step.value);
	    }
	  }
	  if (mapping && argumentsLength > 2) {
	    mapfn = functionBindContext(mapfn, arguments[2], 2);
	  }
	  length = toLength(O.length);
	  result = new (aTypedArrayConstructor$1(this))(length);
	  for (i = 0; length > i; i++) {
	    result[i] = mapping ? mapfn(O[i], i) : O[i];
	  }
	  return result;
	};

	var typedArrayConstructor = createCommonjsModule(function (module) {


















	var getOwnPropertyNames = objectGetOwnPropertyNames.f;

	var forEach = arrayIteration.forEach;






	var getInternalState = internalState.get;
	var setInternalState = internalState.set;
	var nativeDefineProperty = objectDefineProperty.f;
	var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var round = Math.round;
	var RangeError = global_1.RangeError;
	var ArrayBuffer = arrayBuffer.ArrayBuffer;
	var DataView = arrayBuffer.DataView;
	var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
	var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
	var TypedArray = arrayBufferViewCore.TypedArray;
	var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
	var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
	var isTypedArray = arrayBufferViewCore.isTypedArray;
	var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
	var WRONG_LENGTH = 'Wrong length';

	var fromList = function (C, list) {
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	};

	var addGetter = function (it, key) {
	  nativeDefineProperty(it, key, { get: function () {
	    return getInternalState(this)[key];
	  } });
	};

	var isArrayBuffer = function (it) {
	  var klass;
	  return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
	};

	var isTypedArrayIndex = function (target, key) {
	  return isTypedArray(target)
	    && typeof key != 'symbol'
	    && key in target
	    && String(+key) == String(key);
	};

	var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
	  return isTypedArrayIndex(target, key = toPrimitive(key, true))
	    ? createPropertyDescriptor(2, target[key])
	    : nativeGetOwnPropertyDescriptor(target, key);
	};

	var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
	  if (isTypedArrayIndex(target, key = toPrimitive(key, true))
	    && isObject(descriptor)
	    && has(descriptor, 'value')
	    && !has(descriptor, 'get')
	    && !has(descriptor, 'set')
	    // TODO: add validation descriptor w/o calling accessors
	    && !descriptor.configurable
	    && (!has(descriptor, 'writable') || descriptor.writable)
	    && (!has(descriptor, 'enumerable') || descriptor.enumerable)
	  ) {
	    target[key] = descriptor.value;
	    return target;
	  } return nativeDefineProperty(target, key, descriptor);
	};

	if (descriptors) {
	  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	    objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
	    objectDefineProperty.f = wrappedDefineProperty;
	    addGetter(TypedArrayPrototype, 'buffer');
	    addGetter(TypedArrayPrototype, 'byteOffset');
	    addGetter(TypedArrayPrototype, 'byteLength');
	    addGetter(TypedArrayPrototype, 'length');
	  }

	  _export({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
	    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
	    defineProperty: wrappedDefineProperty
	  });

	  module.exports = function (TYPE, wrapper, CLAMPED) {
	    var BYTES = TYPE.match(/\d+$/)[0] / 8;
	    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
	    var GETTER = 'get' + TYPE;
	    var SETTER = 'set' + TYPE;
	    var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
	    var TypedArrayConstructor = NativeTypedArrayConstructor;
	    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
	    var exported = {};

	    var getter = function (that, index) {
	      var data = getInternalState(that);
	      return data.view[GETTER](index * BYTES + data.byteOffset, true);
	    };

	    var setter = function (that, index, value) {
	      var data = getInternalState(that);
	      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
	      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
	    };

	    var addElement = function (that, index) {
	      nativeDefineProperty(that, index, {
	        get: function () {
	          return getter(this, index);
	        },
	        set: function (value) {
	          return setter(this, index, value);
	        },
	        enumerable: true
	      });
	    };

	    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
	        anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
	        var index = 0;
	        var byteOffset = 0;
	        var buffer, byteLength, length;
	        if (!isObject(data)) {
	          length = toIndex(data);
	          byteLength = length * BYTES;
	          buffer = new ArrayBuffer(byteLength);
	        } else if (isArrayBuffer(data)) {
	          buffer = data;
	          byteOffset = toOffset(offset, BYTES);
	          var $len = data.byteLength;
	          if ($length === undefined) {
	            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
	            byteLength = $len - byteOffset;
	            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
	          } else {
	            byteLength = toLength($length) * BYTES;
	            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
	          }
	          length = byteLength / BYTES;
	        } else if (isTypedArray(data)) {
	          return fromList(TypedArrayConstructor, data);
	        } else {
	          return typedArrayFrom.call(TypedArrayConstructor, data);
	        }
	        setInternalState(that, {
	          buffer: buffer,
	          byteOffset: byteOffset,
	          byteLength: byteLength,
	          length: length,
	          view: new DataView(buffer)
	        });
	        while (index < length) addElement(that, index++);
	      });

	      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
	      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
	    } else if (typedArrayConstructorsRequireWrappers) {
	      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
	        anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
	        return inheritIfRequired(function () {
	          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
	          if (isArrayBuffer(data)) return $length !== undefined
	            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
	            : typedArrayOffset !== undefined
	              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
	              : new NativeTypedArrayConstructor(data);
	          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
	          return typedArrayFrom.call(TypedArrayConstructor, data);
	        }(), dummy, TypedArrayConstructor);
	      });

	      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
	      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
	        if (!(key in TypedArrayConstructor)) {
	          createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
	        }
	      });
	      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
	    }

	    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
	      createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
	    }

	    if (TYPED_ARRAY_TAG) {
	      createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
	    }

	    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

	    _export({
	      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
	    }, exported);

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
	      createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
	    }

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
	      createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
	    }

	    setSpecies(CONSTRUCTOR_NAME);
	  };
	} else module.exports = function () { /* empty */ };
	});

	// `Float32Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Float32', function (init) {
	  return function Float32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Float64Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Float64', function (init) {
	  return function Float64Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Int8Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Int8', function (init) {
	  return function Int8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Int16Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Int16', function (init) {
	  return function Int16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Int32Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Int32', function (init) {
	  return function Int32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Uint8Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Uint8', function (init) {
	  return function Uint8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Uint8ClampedArray` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Uint8', function (init) {
	  return function Uint8ClampedArray(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	}, true);

	// `Uint16Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Uint16', function (init) {
	  return function Uint16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Uint32Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Uint32', function (init) {
	  return function Uint32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var aTypedArray$1 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.copyWithin` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin
	exportTypedArrayMethod$1('copyWithin', function copyWithin(target, start /* , end */) {
	  return arrayCopyWithin.call(aTypedArray$1(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	});

	var $every$1 = arrayIteration.every;

	var aTypedArray$2 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.every` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every
	exportTypedArrayMethod$2('every', function every(callbackfn /* , thisArg */) {
	  return $every$1(aTypedArray$2(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$3 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.fill` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
	// eslint-disable-next-line no-unused-vars
	exportTypedArrayMethod$3('fill', function fill(value /* , start, end */) {
	  return arrayFill.apply(aTypedArray$3(this), arguments);
	});

	var $filter$1 = arrayIteration.filter;


	var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;
	var exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter
	exportTypedArrayMethod$4('filter', function filter(callbackfn /* , thisArg */) {
	  var list = $filter$1(aTypedArray$4(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  var C = speciesConstructor(this, this.constructor);
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor$2(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	});

	var $find$1 = arrayIteration.find;

	var aTypedArray$5 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find
	exportTypedArrayMethod$5('find', function find(predicate /* , thisArg */) {
	  return $find$1(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $findIndex$1 = arrayIteration.findIndex;

	var aTypedArray$6 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.findIndex` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex
	exportTypedArrayMethod$6('findIndex', function findIndex(predicate /* , thisArg */) {
	  return $findIndex$1(aTypedArray$6(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $forEach$2 = arrayIteration.forEach;

	var aTypedArray$7 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach
	exportTypedArrayMethod$7('forEach', function forEach(callbackfn /* , thisArg */) {
	  $forEach$2(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var exportTypedArrayStaticMethod$1 = arrayBufferViewCore.exportTypedArrayStaticMethod;


	// `%TypedArray%.from` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.from
	exportTypedArrayStaticMethod$1('from', typedArrayFrom, typedArrayConstructorsRequireWrappers);

	var $includes$1 = arrayIncludes.includes;

	var aTypedArray$8 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes
	exportTypedArrayMethod$8('includes', function includes(searchElement /* , fromIndex */) {
	  return $includes$1(aTypedArray$8(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $indexOf$1 = arrayIncludes.indexOf;

	var aTypedArray$9 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof
	exportTypedArrayMethod$9('indexOf', function indexOf(searchElement /* , fromIndex */) {
	  return $indexOf$1(aTypedArray$9(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var Uint8Array$1 = global_1.Uint8Array;
	var arrayValues = es_array_iterator.values;
	var arrayKeys = es_array_iterator.keys;
	var arrayEntries = es_array_iterator.entries;
	var aTypedArray$a = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod;
	var nativeTypedArrayIterator = Uint8Array$1 && Uint8Array$1.prototype[ITERATOR$5];

	var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
	  && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

	var typedArrayValues = function values() {
	  return arrayValues.call(aTypedArray$a(this));
	};

	// `%TypedArray%.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries
	exportTypedArrayMethod$a('entries', function entries() {
	  return arrayEntries.call(aTypedArray$a(this));
	});
	// `%TypedArray%.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys
	exportTypedArrayMethod$a('keys', function keys() {
	  return arrayKeys.call(aTypedArray$a(this));
	});
	// `%TypedArray%.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values
	exportTypedArrayMethod$a('values', typedArrayValues, !CORRECT_ITER_NAME);
	// `%TypedArray%.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator
	exportTypedArrayMethod$a(ITERATOR$5, typedArrayValues, !CORRECT_ITER_NAME);

	var aTypedArray$b = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod;
	var $join = [].join;

	// `%TypedArray%.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
	// eslint-disable-next-line no-unused-vars
	exportTypedArrayMethod$b('join', function join(separator) {
	  return $join.apply(aTypedArray$b(this), arguments);
	});

	var aTypedArray$c = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.lastIndexOf` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
	// eslint-disable-next-line no-unused-vars
	exportTypedArrayMethod$c('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
	  return arrayLastIndexOf.apply(aTypedArray$c(this), arguments);
	});

	var $map$1 = arrayIteration.map;


	var aTypedArray$d = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;
	var exportTypedArrayMethod$d = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map
	exportTypedArrayMethod$d('map', function map(mapfn /* , thisArg */) {
	  return $map$1(aTypedArray$d(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
	    return new (aTypedArrayConstructor$3(speciesConstructor(O, O.constructor)))(length);
	  });
	});

	var aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor;
	var exportTypedArrayStaticMethod$2 = arrayBufferViewCore.exportTypedArrayStaticMethod;

	// `%TypedArray%.of` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.of
	exportTypedArrayStaticMethod$2('of', function of(/* ...items */) {
	  var index = 0;
	  var length = arguments.length;
	  var result = new (aTypedArrayConstructor$4(this))(length);
	  while (length > index) result[index] = arguments[index++];
	  return result;
	}, typedArrayConstructorsRequireWrappers);

	var $reduce$1 = arrayReduce.left;

	var aTypedArray$e = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$e = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduce` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce
	exportTypedArrayMethod$e('reduce', function reduce(callbackfn /* , initialValue */) {
	  return $reduce$1(aTypedArray$e(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $reduceRight$1 = arrayReduce.right;

	var aTypedArray$f = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$f = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduceRicht` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright
	exportTypedArrayMethod$f('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
	  return $reduceRight$1(aTypedArray$f(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$g = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$g = arrayBufferViewCore.exportTypedArrayMethod;
	var floor$7 = Math.floor;

	// `%TypedArray%.prototype.reverse` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse
	exportTypedArrayMethod$g('reverse', function reverse() {
	  var that = this;
	  var length = aTypedArray$g(that).length;
	  var middle = floor$7(length / 2);
	  var index = 0;
	  var value;
	  while (index < middle) {
	    value = that[index];
	    that[index++] = that[--length];
	    that[length] = value;
	  } return that;
	});

	var aTypedArray$h = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$h = arrayBufferViewCore.exportTypedArrayMethod;

	var FORCED$f = fails(function () {
	  // eslint-disable-next-line no-undef
	  new Int8Array(1).set({});
	});

	// `%TypedArray%.prototype.set` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set
	exportTypedArrayMethod$h('set', function set(arrayLike /* , offset */) {
	  aTypedArray$h(this);
	  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
	  var length = this.length;
	  var src = toObject(arrayLike);
	  var len = toLength(src.length);
	  var index = 0;
	  if (len + offset > length) throw RangeError('Wrong length');
	  while (index < len) this[offset + index] = src[index++];
	}, FORCED$f);

	var aTypedArray$i = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$5 = arrayBufferViewCore.aTypedArrayConstructor;
	var exportTypedArrayMethod$i = arrayBufferViewCore.exportTypedArrayMethod;
	var $slice = [].slice;

	var FORCED$g = fails(function () {
	  // eslint-disable-next-line no-undef
	  new Int8Array(1).slice();
	});

	// `%TypedArray%.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
	exportTypedArrayMethod$i('slice', function slice(start, end) {
	  var list = $slice.call(aTypedArray$i(this), start, end);
	  var C = speciesConstructor(this, this.constructor);
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor$5(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	}, FORCED$g);

	var $some$1 = arrayIteration.some;

	var aTypedArray$j = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$j = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.some` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some
	exportTypedArrayMethod$j('some', function some(callbackfn /* , thisArg */) {
	  return $some$1(aTypedArray$j(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$k = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$k = arrayBufferViewCore.exportTypedArrayMethod;
	var $sort = [].sort;

	// `%TypedArray%.prototype.sort` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort
	exportTypedArrayMethod$k('sort', function sort(comparefn) {
	  return $sort.call(aTypedArray$k(this), comparefn);
	});

	var aTypedArray$l = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$l = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.subarray` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray
	exportTypedArrayMethod$l('subarray', function subarray(begin, end) {
	  var O = aTypedArray$l(this);
	  var length = O.length;
	  var beginIndex = toAbsoluteIndex(begin, length);
	  return new (speciesConstructor(O, O.constructor))(
	    O.buffer,
	    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
	    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
	  );
	});

	var Int8Array$3 = global_1.Int8Array;
	var aTypedArray$m = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$m = arrayBufferViewCore.exportTypedArrayMethod;
	var $toLocaleString = [].toLocaleString;
	var $slice$1 = [].slice;

	// iOS Safari 6.x fails here
	var TO_LOCALE_STRING_BUG = !!Int8Array$3 && fails(function () {
	  $toLocaleString.call(new Int8Array$3(1));
	});

	var FORCED$h = fails(function () {
	  return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString();
	}) || !fails(function () {
	  Int8Array$3.prototype.toLocaleString.call([1, 2]);
	});

	// `%TypedArray%.prototype.toLocaleString` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring
	exportTypedArrayMethod$m('toLocaleString', function toLocaleString() {
	  return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice$1.call(aTypedArray$m(this)) : aTypedArray$m(this), arguments);
	}, FORCED$h);

	var exportTypedArrayMethod$n = arrayBufferViewCore.exportTypedArrayMethod;



	var Uint8Array$2 = global_1.Uint8Array;
	var Uint8ArrayPrototype = Uint8Array$2 && Uint8Array$2.prototype || {};
	var arrayToString = [].toString;
	var arrayJoin = [].join;

	if (fails(function () { arrayToString.call({}); })) {
	  arrayToString = function toString() {
	    return arrayJoin.call(this);
	  };
	}

	var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

	// `%TypedArray%.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring
	exportTypedArrayMethod$n('toString', arrayToString, IS_NOT_ARRAY_METHOD);

	var getWeakData = internalMetadata.getWeakData;








	var setInternalState$8 = internalState.set;
	var internalStateGetterFor$1 = internalState.getterFor;
	var find = arrayIteration.find;
	var findIndex = arrayIteration.findIndex;
	var id$1 = 0;

	// fallback for uncaught frozen keys
	var uncaughtFrozenStore = function (store) {
	  return store.frozen || (store.frozen = new UncaughtFrozenStore());
	};

	var UncaughtFrozenStore = function () {
	  this.entries = [];
	};

	var findUncaughtFrozen = function (store, key) {
	  return find(store.entries, function (it) {
	    return it[0] === key;
	  });
	};

	UncaughtFrozenStore.prototype = {
	  get: function (key) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) return entry[1];
	  },
	  has: function (key) {
	    return !!findUncaughtFrozen(this, key);
	  },
	  set: function (key, value) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) entry[1] = value;
	    else this.entries.push([key, value]);
	  },
	  'delete': function (key) {
	    var index = findIndex(this.entries, function (it) {
	      return it[0] === key;
	    });
	    if (~index) this.entries.splice(index, 1);
	    return !!~index;
	  }
	};

	var collectionWeak = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance(that, C, CONSTRUCTOR_NAME);
	      setInternalState$8(that, {
	        type: CONSTRUCTOR_NAME,
	        id: id$1++,
	        frozen: undefined
	      });
	      if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
	    });

	    var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var data = getWeakData(anObject(key), true);
	      if (data === true) uncaughtFrozenStore(state).set(key, value);
	      else data[state.id] = value;
	      return that;
	    };

	    redefineAll(C.prototype, {
	      // 23.3.3.2 WeakMap.prototype.delete(key)
	      // 23.4.3.3 WeakSet.prototype.delete(value)
	      'delete': function (key) {
	        var state = getInternalState(this);
	        if (!isObject(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
	        return data && has(data, state.id) && delete data[state.id];
	      },
	      // 23.3.3.4 WeakMap.prototype.has(key)
	      // 23.4.3.4 WeakSet.prototype.has(value)
	      has: function has$1(key) {
	        var state = getInternalState(this);
	        if (!isObject(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state).has(key);
	        return data && has(data, state.id);
	      }
	    });

	    redefineAll(C.prototype, IS_MAP ? {
	      // 23.3.3.3 WeakMap.prototype.get(key)
	      get: function get(key) {
	        var state = getInternalState(this);
	        if (isObject(key)) {
	          var data = getWeakData(key);
	          if (data === true) return uncaughtFrozenStore(state).get(key);
	          return data ? data[state.id] : undefined;
	        }
	      },
	      // 23.3.3.5 WeakMap.prototype.set(key, value)
	      set: function set(key, value) {
	        return define(this, key, value);
	      }
	    } : {
	      // 23.4.3.1 WeakSet.prototype.add(value)
	      add: function add(value) {
	        return define(this, value, true);
	      }
	    });

	    return C;
	  }
	};

	var es_weakMap = createCommonjsModule(function (module) {






	var enforceIternalState = internalState.enforce;


	var IS_IE11 = !global_1.ActiveXObject && 'ActiveXObject' in global_1;
	var isExtensible = Object.isExtensible;
	var InternalWeakMap;

	var wrapper = function (init) {
	  return function WeakMap() {
	    return init(this, arguments.length ? arguments[0] : undefined);
	  };
	};

	// `WeakMap` constructor
	// https://tc39.github.io/ecma262/#sec-weakmap-constructor
	var $WeakMap = module.exports = collection('WeakMap', wrapper, collectionWeak);

	// IE11 WeakMap frozen keys fix
	// We can't use feature detection because it crash some old IE builds
	// https://github.com/zloirock/core-js/issues/485
	if (nativeWeakMap && IS_IE11) {
	  InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
	  internalMetadata.REQUIRED = true;
	  var WeakMapPrototype = $WeakMap.prototype;
	  var nativeDelete = WeakMapPrototype['delete'];
	  var nativeHas = WeakMapPrototype.has;
	  var nativeGet = WeakMapPrototype.get;
	  var nativeSet = WeakMapPrototype.set;
	  redefineAll(WeakMapPrototype, {
	    'delete': function (key) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeDelete.call(this, key) || state.frozen['delete'](key);
	      } return nativeDelete.call(this, key);
	    },
	    has: function has(key) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas.call(this, key) || state.frozen.has(key);
	      } return nativeHas.call(this, key);
	    },
	    get: function get(key) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
	      } return nativeGet.call(this, key);
	    },
	    set: function set(key, value) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
	      } else nativeSet.call(this, key, value);
	      return this;
	    }
	  });
	}
	});

	// `WeakSet` constructor
	// https://tc39.github.io/ecma262/#sec-weakset-constructor
	collection('WeakSet', function (init) {
	  return function WeakSet() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionWeak);

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

	var ITERATOR$6 = wellKnownSymbol('iterator');
	var TO_STRING_TAG$4 = wellKnownSymbol('toStringTag');
	var ArrayValues = es_array_iterator.values;

	for (var COLLECTION_NAME$1 in domIterables) {
	  var Collection$1 = global_1[COLLECTION_NAME$1];
	  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
	  if (CollectionPrototype$1) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype$1[ITERATOR$6] !== ArrayValues) try {
	      createNonEnumerableProperty(CollectionPrototype$1, ITERATOR$6, ArrayValues);
	    } catch (error) {
	      CollectionPrototype$1[ITERATOR$6] = ArrayValues;
	    }
	    if (!CollectionPrototype$1[TO_STRING_TAG$4]) {
	      createNonEnumerableProperty(CollectionPrototype$1, TO_STRING_TAG$4, COLLECTION_NAME$1);
	    }
	    if (domIterables[COLLECTION_NAME$1]) for (var METHOD_NAME in es_array_iterator) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
	        createNonEnumerableProperty(CollectionPrototype$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
	      }
	    }
	  }
	}

	var process$4 = global_1.process;
	var isNode = classofRaw(process$4) == 'process';

	// `queueMicrotask` method
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
	_export({ global: true, enumerable: true, noTargetGet: true }, {
	  queueMicrotask: function queueMicrotask(fn) {
	    var domain = isNode && process$4.domain;
	    microtask(domain ? domain.bind(fn) : fn);
	  }
	});

	var ITERATOR$7 = wellKnownSymbol('iterator');

	var nativeUrl = !fails(function () {
	  var url = new URL('b?a=1&b=2&c=3', 'http://a');
	  var searchParams = url.searchParams;
	  var result = '';
	  url.pathname = 'c%20d';
	  searchParams.forEach(function (value, key) {
	    searchParams['delete']('b');
	    result += key + value;
	  });
	  return (isPure && !url.toJSON)
	    || !searchParams.sort
	    || url.href !== 'http://a/c%20d?a=1&c=3'
	    || searchParams.get('c') !== '3'
	    || String(new URLSearchParams('?a=1')) !== 'a=1'
	    || !searchParams[ITERATOR$7]
	    // throws in Edge
	    || new URL('https://a@b').username !== 'a'
	    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
	    // not punycoded in Edge
	    || new URL('http://тест').host !== 'xn--e1aybc'
	    // not escaped in Chrome 62-
	    || new URL('http://a#б').hash !== '#%D0%B1'
	    // fails in Chrome 66-
	    || result !== 'a1c3'
	    // throws in Safari
	    || new URL('http://x', undefined).host !== 'x';
	});

	// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
	var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
	var base = 36;
	var tMin = 1;
	var tMax = 26;
	var skew = 38;
	var damp = 700;
	var initialBias = 72;
	var initialN = 128; // 0x80
	var delimiter = '-'; // '\x2D'
	var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
	var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
	var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
	var baseMinusTMin = base - tMin;
	var floor$8 = Math.floor;
	var stringFromCharCode = String.fromCharCode;

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 */
	var ucs2decode = function (string) {
	  var output = [];
	  var counter = 0;
	  var length = string.length;
	  while (counter < length) {
	    var value = string.charCodeAt(counter++);
	    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
	      // It's a high surrogate, and there is a next character.
	      var extra = string.charCodeAt(counter++);
	      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
	        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
	      } else {
	        // It's an unmatched surrogate; only append this code unit, in case the
	        // next code unit is the high surrogate of a surrogate pair.
	        output.push(value);
	        counter--;
	      }
	    } else {
	      output.push(value);
	    }
	  }
	  return output;
	};

	/**
	 * Converts a digit/integer into a basic code point.
	 */
	var digitToBasic = function (digit) {
	  //  0..25 map to ASCII a..z or A..Z
	  // 26..35 map to ASCII 0..9
	  return digit + 22 + 75 * (digit < 26);
	};

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 */
	var adapt = function (delta, numPoints, firstTime) {
	  var k = 0;
	  delta = firstTime ? floor$8(delta / damp) : delta >> 1;
	  delta += floor$8(delta / numPoints);
	  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
	    delta = floor$8(delta / baseMinusTMin);
	  }
	  return floor$8(k + (baseMinusTMin + 1) * delta / (delta + skew));
	};

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 */
	// eslint-disable-next-line  max-statements
	var encode = function (input) {
	  var output = [];

	  // Convert the input in UCS-2 to an array of Unicode code points.
	  input = ucs2decode(input);

	  // Cache the length.
	  var inputLength = input.length;

	  // Initialize the state.
	  var n = initialN;
	  var delta = 0;
	  var bias = initialBias;
	  var i, currentValue;

	  // Handle the basic code points.
	  for (i = 0; i < input.length; i++) {
	    currentValue = input[i];
	    if (currentValue < 0x80) {
	      output.push(stringFromCharCode(currentValue));
	    }
	  }

	  var basicLength = output.length; // number of basic code points.
	  var handledCPCount = basicLength; // number of code points that have been handled;

	  // Finish the basic string with a delimiter unless it's empty.
	  if (basicLength) {
	    output.push(delimiter);
	  }

	  // Main encoding loop:
	  while (handledCPCount < inputLength) {
	    // All non-basic code points < n have been handled already. Find the next larger one:
	    var m = maxInt;
	    for (i = 0; i < input.length; i++) {
	      currentValue = input[i];
	      if (currentValue >= n && currentValue < m) {
	        m = currentValue;
	      }
	    }

	    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
	    var handledCPCountPlusOne = handledCPCount + 1;
	    if (m - n > floor$8((maxInt - delta) / handledCPCountPlusOne)) {
	      throw RangeError(OVERFLOW_ERROR);
	    }

	    delta += (m - n) * handledCPCountPlusOne;
	    n = m;

	    for (i = 0; i < input.length; i++) {
	      currentValue = input[i];
	      if (currentValue < n && ++delta > maxInt) {
	        throw RangeError(OVERFLOW_ERROR);
	      }
	      if (currentValue == n) {
	        // Represent delta as a generalized variable-length integer.
	        var q = delta;
	        for (var k = base; /* no condition */; k += base) {
	          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
	          if (q < t) break;
	          var qMinusT = q - t;
	          var baseMinusT = base - t;
	          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
	          q = floor$8(qMinusT / baseMinusT);
	        }

	        output.push(stringFromCharCode(digitToBasic(q)));
	        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
	        delta = 0;
	        ++handledCPCount;
	      }
	    }

	    ++delta;
	    ++n;
	  }
	  return output.join('');
	};

	var stringPunycodeToAscii = function (input) {
	  var encoded = [];
	  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
	  var i, label;
	  for (i = 0; i < labels.length; i++) {
	    label = labels[i];
	    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
	  }
	  return encoded.join('.');
	};

	var getIterator = function (it) {
	  var iteratorMethod = getIteratorMethod(it);
	  if (typeof iteratorMethod != 'function') {
	    throw TypeError(String(it) + ' is not iterable');
	  } return anObject(iteratorMethod.call(it));
	};

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`





















	var $fetch$1 = getBuiltIn('fetch');
	var Headers = getBuiltIn('Headers');
	var ITERATOR$8 = wellKnownSymbol('iterator');
	var URL_SEARCH_PARAMS = 'URLSearchParams';
	var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
	var setInternalState$9 = internalState.set;
	var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
	var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

	var plus = /\+/g;
	var sequences = Array(4);

	var percentSequence = function (bytes) {
	  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
	};

	var percentDecode = function (sequence) {
	  try {
	    return decodeURIComponent(sequence);
	  } catch (error) {
	    return sequence;
	  }
	};

	var deserialize = function (it) {
	  var result = it.replace(plus, ' ');
	  var bytes = 4;
	  try {
	    return decodeURIComponent(result);
	  } catch (error) {
	    while (bytes) {
	      result = result.replace(percentSequence(bytes--), percentDecode);
	    }
	    return result;
	  }
	};

	var find$1 = /[!'()~]|%20/g;

	var replace = {
	  '!': '%21',
	  "'": '%27',
	  '(': '%28',
	  ')': '%29',
	  '~': '%7E',
	  '%20': '+'
	};

	var replacer = function (match) {
	  return replace[match];
	};

	var serialize = function (it) {
	  return encodeURIComponent(it).replace(find$1, replacer);
	};

	var parseSearchParams = function (result, query) {
	  if (query) {
	    var attributes = query.split('&');
	    var index = 0;
	    var attribute, entry;
	    while (index < attributes.length) {
	      attribute = attributes[index++];
	      if (attribute.length) {
	        entry = attribute.split('=');
	        result.push({
	          key: deserialize(entry.shift()),
	          value: deserialize(entry.join('='))
	        });
	      }
	    }
	  }
	};

	var updateSearchParams = function (query) {
	  this.entries.length = 0;
	  parseSearchParams(this.entries, query);
	};

	var validateArgumentsLength = function (passed, required) {
	  if (passed < required) throw TypeError('Not enough arguments');
	};

	var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
	  setInternalState$9(this, {
	    type: URL_SEARCH_PARAMS_ITERATOR,
	    iterator: getIterator(getInternalParamsState(params).entries),
	    kind: kind
	  });
	}, 'Iterator', function next() {
	  var state = getInternalIteratorState(this);
	  var kind = state.kind;
	  var step = state.iterator.next();
	  var entry = step.value;
	  if (!step.done) {
	    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
	  } return step;
	});

	// `URLSearchParams` constructor
	// https://url.spec.whatwg.org/#interface-urlsearchparams
	var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
	  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
	  var init = arguments.length > 0 ? arguments[0] : undefined;
	  var that = this;
	  var entries = [];
	  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

	  setInternalState$9(that, {
	    type: URL_SEARCH_PARAMS,
	    entries: entries,
	    updateURL: function () { /* empty */ },
	    updateSearchParams: updateSearchParams
	  });

	  if (init !== undefined) {
	    if (isObject(init)) {
	      iteratorMethod = getIteratorMethod(init);
	      if (typeof iteratorMethod === 'function') {
	        iterator = iteratorMethod.call(init);
	        next = iterator.next;
	        while (!(step = next.call(iterator)).done) {
	          entryIterator = getIterator(anObject(step.value));
	          entryNext = entryIterator.next;
	          if (
	            (first = entryNext.call(entryIterator)).done ||
	            (second = entryNext.call(entryIterator)).done ||
	            !entryNext.call(entryIterator).done
	          ) throw TypeError('Expected sequence with length 2');
	          entries.push({ key: first.value + '', value: second.value + '' });
	        }
	      } else for (key in init) if (has(init, key)) entries.push({ key: key, value: init[key] + '' });
	    } else {
	      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
	    }
	  }
	};

	var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

	redefineAll(URLSearchParamsPrototype, {
	  // `URLSearchParams.prototype.appent` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
	  append: function append(name, value) {
	    validateArgumentsLength(arguments.length, 2);
	    var state = getInternalParamsState(this);
	    state.entries.push({ key: name + '', value: value + '' });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.delete` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
	  'delete': function (name) {
	    validateArgumentsLength(arguments.length, 1);
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    var key = name + '';
	    var index = 0;
	    while (index < entries.length) {
	      if (entries[index].key === key) entries.splice(index, 1);
	      else index++;
	    }
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.get` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
	  get: function get(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = name + '';
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) return entries[index].value;
	    }
	    return null;
	  },
	  // `URLSearchParams.prototype.getAll` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
	  getAll: function getAll(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = name + '';
	    var result = [];
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) result.push(entries[index].value);
	    }
	    return result;
	  },
	  // `URLSearchParams.prototype.has` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
	  has: function has(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = name + '';
	    var index = 0;
	    while (index < entries.length) {
	      if (entries[index++].key === key) return true;
	    }
	    return false;
	  },
	  // `URLSearchParams.prototype.set` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
	  set: function set(name, value) {
	    validateArgumentsLength(arguments.length, 1);
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    var found = false;
	    var key = name + '';
	    var val = value + '';
	    var index = 0;
	    var entry;
	    for (; index < entries.length; index++) {
	      entry = entries[index];
	      if (entry.key === key) {
	        if (found) entries.splice(index--, 1);
	        else {
	          found = true;
	          entry.value = val;
	        }
	      }
	    }
	    if (!found) entries.push({ key: key, value: val });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.sort` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
	  sort: function sort() {
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    // Array#sort is not stable in some engines
	    var slice = entries.slice();
	    var entry, entriesIndex, sliceIndex;
	    entries.length = 0;
	    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
	      entry = slice[sliceIndex];
	      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
	        if (entries[entriesIndex].key > entry.key) {
	          entries.splice(entriesIndex, 0, entry);
	          break;
	        }
	      }
	      if (entriesIndex === sliceIndex) entries.push(entry);
	    }
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.forEach` method
	  forEach: function forEach(callback /* , thisArg */) {
	    var entries = getInternalParamsState(this).entries;
	    var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
	    var index = 0;
	    var entry;
	    while (index < entries.length) {
	      entry = entries[index++];
	      boundFunction(entry.value, entry.key, this);
	    }
	  },
	  // `URLSearchParams.prototype.keys` method
	  keys: function keys() {
	    return new URLSearchParamsIterator(this, 'keys');
	  },
	  // `URLSearchParams.prototype.values` method
	  values: function values() {
	    return new URLSearchParamsIterator(this, 'values');
	  },
	  // `URLSearchParams.prototype.entries` method
	  entries: function entries() {
	    return new URLSearchParamsIterator(this, 'entries');
	  }
	}, { enumerable: true });

	// `URLSearchParams.prototype[@@iterator]` method
	redefine(URLSearchParamsPrototype, ITERATOR$8, URLSearchParamsPrototype.entries);

	// `URLSearchParams.prototype.toString` method
	// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
	redefine(URLSearchParamsPrototype, 'toString', function toString() {
	  var entries = getInternalParamsState(this).entries;
	  var result = [];
	  var index = 0;
	  var entry;
	  while (index < entries.length) {
	    entry = entries[index++];
	    result.push(serialize(entry.key) + '=' + serialize(entry.value));
	  } return result.join('&');
	}, { enumerable: true });

	setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

	_export({ global: true, forced: !nativeUrl }, {
	  URLSearchParams: URLSearchParamsConstructor
	});

	// Wrap `fetch` for correct work with polyfilled `URLSearchParams`
	// https://github.com/zloirock/core-js/issues/674
	if (!nativeUrl && typeof $fetch$1 == 'function' && typeof Headers == 'function') {
	  _export({ global: true, enumerable: true, forced: true }, {
	    fetch: function fetch(input /* , init */) {
	      var args = [input];
	      var init, body, headers;
	      if (arguments.length > 1) {
	        init = arguments[1];
	        if (isObject(init)) {
	          body = init.body;
	          if (classof(body) === URL_SEARCH_PARAMS) {
	            headers = init.headers ? new Headers(init.headers) : new Headers();
	            if (!headers.has('content-type')) {
	              headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	            }
	            init = objectCreate(init, {
	              body: createPropertyDescriptor(0, String(body)),
	              headers: createPropertyDescriptor(0, headers)
	            });
	          }
	        }
	        args.push(init);
	      } return $fetch$1.apply(this, args);
	    }
	  });
	}

	var web_urlSearchParams = {
	  URLSearchParams: URLSearchParamsConstructor,
	  getState: getInternalParamsState
	};

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











	var codeAt$1 = stringMultibyte.codeAt;





	var NativeURL = global_1.URL;
	var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
	var getInternalSearchParamsState = web_urlSearchParams.getState;
	var setInternalState$a = internalState.set;
	var getInternalURLState = internalState.getterFor('URL');
	var floor$9 = Math.floor;
	var pow$4 = Math.pow;

	var INVALID_AUTHORITY = 'Invalid authority';
	var INVALID_SCHEME = 'Invalid scheme';
	var INVALID_HOST = 'Invalid host';
	var INVALID_PORT = 'Invalid port';

	var ALPHA = /[A-Za-z]/;
	var ALPHANUMERIC = /[\d+\-.A-Za-z]/;
	var DIGIT = /\d/;
	var HEX_START = /^(0x|0X)/;
	var OCT = /^[0-7]+$/;
	var DEC = /^\d+$/;
	var HEX = /^[\dA-Fa-f]+$/;
	// eslint-disable-next-line no-control-regex
	var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
	// eslint-disable-next-line no-control-regex
	var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
	// eslint-disable-next-line no-control-regex
	var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
	// eslint-disable-next-line no-control-regex
	var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
	var EOF;

	var parseHost = function (url, input) {
	  var result, codePoints, index;
	  if (input.charAt(0) == '[') {
	    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
	    result = parseIPv6(input.slice(1, -1));
	    if (!result) return INVALID_HOST;
	    url.host = result;
	  // opaque host
	  } else if (!isSpecial(url)) {
	    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
	    result = '';
	    codePoints = arrayFrom(input);
	    for (index = 0; index < codePoints.length; index++) {
	      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
	    }
	    url.host = result;
	  } else {
	    input = stringPunycodeToAscii(input);
	    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
	    result = parseIPv4(input);
	    if (result === null) return INVALID_HOST;
	    url.host = result;
	  }
	};

	var parseIPv4 = function (input) {
	  var parts = input.split('.');
	  var partsLength, numbers, index, part, radix, number, ipv4;
	  if (parts.length && parts[parts.length - 1] == '') {
	    parts.pop();
	  }
	  partsLength = parts.length;
	  if (partsLength > 4) return input;
	  numbers = [];
	  for (index = 0; index < partsLength; index++) {
	    part = parts[index];
	    if (part == '') return input;
	    radix = 10;
	    if (part.length > 1 && part.charAt(0) == '0') {
	      radix = HEX_START.test(part) ? 16 : 8;
	      part = part.slice(radix == 8 ? 1 : 2);
	    }
	    if (part === '') {
	      number = 0;
	    } else {
	      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
	      number = parseInt(part, radix);
	    }
	    numbers.push(number);
	  }
	  for (index = 0; index < partsLength; index++) {
	    number = numbers[index];
	    if (index == partsLength - 1) {
	      if (number >= pow$4(256, 5 - partsLength)) return null;
	    } else if (number > 255) return null;
	  }
	  ipv4 = numbers.pop();
	  for (index = 0; index < numbers.length; index++) {
	    ipv4 += numbers[index] * pow$4(256, 3 - index);
	  }
	  return ipv4;
	};

	// eslint-disable-next-line max-statements
	var parseIPv6 = function (input) {
	  var address = [0, 0, 0, 0, 0, 0, 0, 0];
	  var pieceIndex = 0;
	  var compress = null;
	  var pointer = 0;
	  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

	  var char = function () {
	    return input.charAt(pointer);
	  };

	  if (char() == ':') {
	    if (input.charAt(1) != ':') return;
	    pointer += 2;
	    pieceIndex++;
	    compress = pieceIndex;
	  }
	  while (char()) {
	    if (pieceIndex == 8) return;
	    if (char() == ':') {
	      if (compress !== null) return;
	      pointer++;
	      pieceIndex++;
	      compress = pieceIndex;
	      continue;
	    }
	    value = length = 0;
	    while (length < 4 && HEX.test(char())) {
	      value = value * 16 + parseInt(char(), 16);
	      pointer++;
	      length++;
	    }
	    if (char() == '.') {
	      if (length == 0) return;
	      pointer -= length;
	      if (pieceIndex > 6) return;
	      numbersSeen = 0;
	      while (char()) {
	        ipv4Piece = null;
	        if (numbersSeen > 0) {
	          if (char() == '.' && numbersSeen < 4) pointer++;
	          else return;
	        }
	        if (!DIGIT.test(char())) return;
	        while (DIGIT.test(char())) {
	          number = parseInt(char(), 10);
	          if (ipv4Piece === null) ipv4Piece = number;
	          else if (ipv4Piece == 0) return;
	          else ipv4Piece = ipv4Piece * 10 + number;
	          if (ipv4Piece > 255) return;
	          pointer++;
	        }
	        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
	        numbersSeen++;
	        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
	      }
	      if (numbersSeen != 4) return;
	      break;
	    } else if (char() == ':') {
	      pointer++;
	      if (!char()) return;
	    } else if (char()) return;
	    address[pieceIndex++] = value;
	  }
	  if (compress !== null) {
	    swaps = pieceIndex - compress;
	    pieceIndex = 7;
	    while (pieceIndex != 0 && swaps > 0) {
	      swap = address[pieceIndex];
	      address[pieceIndex--] = address[compress + swaps - 1];
	      address[compress + --swaps] = swap;
	    }
	  } else if (pieceIndex != 8) return;
	  return address;
	};

	var findLongestZeroSequence = function (ipv6) {
	  var maxIndex = null;
	  var maxLength = 1;
	  var currStart = null;
	  var currLength = 0;
	  var index = 0;
	  for (; index < 8; index++) {
	    if (ipv6[index] !== 0) {
	      if (currLength > maxLength) {
	        maxIndex = currStart;
	        maxLength = currLength;
	      }
	      currStart = null;
	      currLength = 0;
	    } else {
	      if (currStart === null) currStart = index;
	      ++currLength;
	    }
	  }
	  if (currLength > maxLength) {
	    maxIndex = currStart;
	    maxLength = currLength;
	  }
	  return maxIndex;
	};

	var serializeHost = function (host) {
	  var result, index, compress, ignore0;
	  // ipv4
	  if (typeof host == 'number') {
	    result = [];
	    for (index = 0; index < 4; index++) {
	      result.unshift(host % 256);
	      host = floor$9(host / 256);
	    } return result.join('.');
	  // ipv6
	  } else if (typeof host == 'object') {
	    result = '';
	    compress = findLongestZeroSequence(host);
	    for (index = 0; index < 8; index++) {
	      if (ignore0 && host[index] === 0) continue;
	      if (ignore0) ignore0 = false;
	      if (compress === index) {
	        result += index ? ':' : '::';
	        ignore0 = true;
	      } else {
	        result += host[index].toString(16);
	        if (index < 7) result += ':';
	      }
	    }
	    return '[' + result + ']';
	  } return host;
	};

	var C0ControlPercentEncodeSet = {};
	var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
	  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
	});
	var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
	  '#': 1, '?': 1, '{': 1, '}': 1
	});
	var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
	  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
	});

	var percentEncode = function (char, set) {
	  var code = codeAt$1(char, 0);
	  return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
	};

	var specialSchemes = {
	  ftp: 21,
	  file: null,
	  http: 80,
	  https: 443,
	  ws: 80,
	  wss: 443
	};

	var isSpecial = function (url) {
	  return has(specialSchemes, url.scheme);
	};

	var includesCredentials = function (url) {
	  return url.username != '' || url.password != '';
	};

	var cannotHaveUsernamePasswordPort = function (url) {
	  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
	};

	var isWindowsDriveLetter = function (string, normalized) {
	  var second;
	  return string.length == 2 && ALPHA.test(string.charAt(0))
	    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
	};

	var startsWithWindowsDriveLetter = function (string) {
	  var third;
	  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
	    string.length == 2 ||
	    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
	  );
	};

	var shortenURLsPath = function (url) {
	  var path = url.path;
	  var pathSize = path.length;
	  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
	    path.pop();
	  }
	};

	var isSingleDot = function (segment) {
	  return segment === '.' || segment.toLowerCase() === '%2e';
	};

	var isDoubleDot = function (segment) {
	  segment = segment.toLowerCase();
	  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
	};

	// States:
	var SCHEME_START = {};
	var SCHEME = {};
	var NO_SCHEME = {};
	var SPECIAL_RELATIVE_OR_AUTHORITY = {};
	var PATH_OR_AUTHORITY = {};
	var RELATIVE = {};
	var RELATIVE_SLASH = {};
	var SPECIAL_AUTHORITY_SLASHES = {};
	var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
	var AUTHORITY = {};
	var HOST = {};
	var HOSTNAME = {};
	var PORT = {};
	var FILE = {};
	var FILE_SLASH = {};
	var FILE_HOST = {};
	var PATH_START = {};
	var PATH = {};
	var CANNOT_BE_A_BASE_URL_PATH = {};
	var QUERY = {};
	var FRAGMENT = {};

	// eslint-disable-next-line max-statements
	var parseURL = function (url, input, stateOverride, base) {
	  var state = stateOverride || SCHEME_START;
	  var pointer = 0;
	  var buffer = '';
	  var seenAt = false;
	  var seenBracket = false;
	  var seenPasswordToken = false;
	  var codePoints, char, bufferCodePoints, failure;

	  if (!stateOverride) {
	    url.scheme = '';
	    url.username = '';
	    url.password = '';
	    url.host = null;
	    url.port = null;
	    url.path = [];
	    url.query = null;
	    url.fragment = null;
	    url.cannotBeABaseURL = false;
	    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
	  }

	  input = input.replace(TAB_AND_NEW_LINE, '');

	  codePoints = arrayFrom(input);

	  while (pointer <= codePoints.length) {
	    char = codePoints[pointer];
	    switch (state) {
	      case SCHEME_START:
	        if (char && ALPHA.test(char)) {
	          buffer += char.toLowerCase();
	          state = SCHEME;
	        } else if (!stateOverride) {
	          state = NO_SCHEME;
	          continue;
	        } else return INVALID_SCHEME;
	        break;

	      case SCHEME:
	        if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
	          buffer += char.toLowerCase();
	        } else if (char == ':') {
	          if (stateOverride && (
	            (isSpecial(url) != has(specialSchemes, buffer)) ||
	            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
	            (url.scheme == 'file' && !url.host)
	          )) return;
	          url.scheme = buffer;
	          if (stateOverride) {
	            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
	            return;
	          }
	          buffer = '';
	          if (url.scheme == 'file') {
	            state = FILE;
	          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
	            state = SPECIAL_RELATIVE_OR_AUTHORITY;
	          } else if (isSpecial(url)) {
	            state = SPECIAL_AUTHORITY_SLASHES;
	          } else if (codePoints[pointer + 1] == '/') {
	            state = PATH_OR_AUTHORITY;
	            pointer++;
	          } else {
	            url.cannotBeABaseURL = true;
	            url.path.push('');
	            state = CANNOT_BE_A_BASE_URL_PATH;
	          }
	        } else if (!stateOverride) {
	          buffer = '';
	          state = NO_SCHEME;
	          pointer = 0;
	          continue;
	        } else return INVALID_SCHEME;
	        break;

	      case NO_SCHEME:
	        if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
	        if (base.cannotBeABaseURL && char == '#') {
	          url.scheme = base.scheme;
	          url.path = base.path.slice();
	          url.query = base.query;
	          url.fragment = '';
	          url.cannotBeABaseURL = true;
	          state = FRAGMENT;
	          break;
	        }
	        state = base.scheme == 'file' ? FILE : RELATIVE;
	        continue;

	      case SPECIAL_RELATIVE_OR_AUTHORITY:
	        if (char == '/' && codePoints[pointer + 1] == '/') {
	          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	          pointer++;
	        } else {
	          state = RELATIVE;
	          continue;
	        } break;

	      case PATH_OR_AUTHORITY:
	        if (char == '/') {
	          state = AUTHORITY;
	          break;
	        } else {
	          state = PATH;
	          continue;
	        }

	      case RELATIVE:
	        url.scheme = base.scheme;
	        if (char == EOF) {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.query = base.query;
	        } else if (char == '/' || (char == '\\' && isSpecial(url))) {
	          state = RELATIVE_SLASH;
	        } else if (char == '?') {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.query = '';
	          state = QUERY;
	        } else if (char == '#') {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.query = base.query;
	          url.fragment = '';
	          state = FRAGMENT;
	        } else {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.path.pop();
	          state = PATH;
	          continue;
	        } break;

	      case RELATIVE_SLASH:
	        if (isSpecial(url) && (char == '/' || char == '\\')) {
	          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	        } else if (char == '/') {
	          state = AUTHORITY;
	        } else {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          state = PATH;
	          continue;
	        } break;

	      case SPECIAL_AUTHORITY_SLASHES:
	        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	        if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
	        pointer++;
	        break;

	      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
	        if (char != '/' && char != '\\') {
	          state = AUTHORITY;
	          continue;
	        } break;

	      case AUTHORITY:
	        if (char == '@') {
	          if (seenAt) buffer = '%40' + buffer;
	          seenAt = true;
	          bufferCodePoints = arrayFrom(buffer);
	          for (var i = 0; i < bufferCodePoints.length; i++) {
	            var codePoint = bufferCodePoints[i];
	            if (codePoint == ':' && !seenPasswordToken) {
	              seenPasswordToken = true;
	              continue;
	            }
	            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
	            if (seenPasswordToken) url.password += encodedCodePoints;
	            else url.username += encodedCodePoints;
	          }
	          buffer = '';
	        } else if (
	          char == EOF || char == '/' || char == '?' || char == '#' ||
	          (char == '\\' && isSpecial(url))
	        ) {
	          if (seenAt && buffer == '') return INVALID_AUTHORITY;
	          pointer -= arrayFrom(buffer).length + 1;
	          buffer = '';
	          state = HOST;
	        } else buffer += char;
	        break;

	      case HOST:
	      case HOSTNAME:
	        if (stateOverride && url.scheme == 'file') {
	          state = FILE_HOST;
	          continue;
	        } else if (char == ':' && !seenBracket) {
	          if (buffer == '') return INVALID_HOST;
	          failure = parseHost(url, buffer);
	          if (failure) return failure;
	          buffer = '';
	          state = PORT;
	          if (stateOverride == HOSTNAME) return;
	        } else if (
	          char == EOF || char == '/' || char == '?' || char == '#' ||
	          (char == '\\' && isSpecial(url))
	        ) {
	          if (isSpecial(url) && buffer == '') return INVALID_HOST;
	          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
	          failure = parseHost(url, buffer);
	          if (failure) return failure;
	          buffer = '';
	          state = PATH_START;
	          if (stateOverride) return;
	          continue;
	        } else {
	          if (char == '[') seenBracket = true;
	          else if (char == ']') seenBracket = false;
	          buffer += char;
	        } break;

	      case PORT:
	        if (DIGIT.test(char)) {
	          buffer += char;
	        } else if (
	          char == EOF || char == '/' || char == '?' || char == '#' ||
	          (char == '\\' && isSpecial(url)) ||
	          stateOverride
	        ) {
	          if (buffer != '') {
	            var port = parseInt(buffer, 10);
	            if (port > 0xFFFF) return INVALID_PORT;
	            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
	            buffer = '';
	          }
	          if (stateOverride) return;
	          state = PATH_START;
	          continue;
	        } else return INVALID_PORT;
	        break;

	      case FILE:
	        url.scheme = 'file';
	        if (char == '/' || char == '\\') state = FILE_SLASH;
	        else if (base && base.scheme == 'file') {
	          if (char == EOF) {
	            url.host = base.host;
	            url.path = base.path.slice();
	            url.query = base.query;
	          } else if (char == '?') {
	            url.host = base.host;
	            url.path = base.path.slice();
	            url.query = '';
	            state = QUERY;
	          } else if (char == '#') {
	            url.host = base.host;
	            url.path = base.path.slice();
	            url.query = base.query;
	            url.fragment = '';
	            state = FRAGMENT;
	          } else {
	            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
	              url.host = base.host;
	              url.path = base.path.slice();
	              shortenURLsPath(url);
	            }
	            state = PATH;
	            continue;
	          }
	        } else {
	          state = PATH;
	          continue;
	        } break;

	      case FILE_SLASH:
	        if (char == '/' || char == '\\') {
	          state = FILE_HOST;
	          break;
	        }
	        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
	          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
	          else url.host = base.host;
	        }
	        state = PATH;
	        continue;

	      case FILE_HOST:
	        if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
	          if (!stateOverride && isWindowsDriveLetter(buffer)) {
	            state = PATH;
	          } else if (buffer == '') {
	            url.host = '';
	            if (stateOverride) return;
	            state = PATH_START;
	          } else {
	            failure = parseHost(url, buffer);
	            if (failure) return failure;
	            if (url.host == 'localhost') url.host = '';
	            if (stateOverride) return;
	            buffer = '';
	            state = PATH_START;
	          } continue;
	        } else buffer += char;
	        break;

	      case PATH_START:
	        if (isSpecial(url)) {
	          state = PATH;
	          if (char != '/' && char != '\\') continue;
	        } else if (!stateOverride && char == '?') {
	          url.query = '';
	          state = QUERY;
	        } else if (!stateOverride && char == '#') {
	          url.fragment = '';
	          state = FRAGMENT;
	        } else if (char != EOF) {
	          state = PATH;
	          if (char != '/') continue;
	        } break;

	      case PATH:
	        if (
	          char == EOF || char == '/' ||
	          (char == '\\' && isSpecial(url)) ||
	          (!stateOverride && (char == '?' || char == '#'))
	        ) {
	          if (isDoubleDot(buffer)) {
	            shortenURLsPath(url);
	            if (char != '/' && !(char == '\\' && isSpecial(url))) {
	              url.path.push('');
	            }
	          } else if (isSingleDot(buffer)) {
	            if (char != '/' && !(char == '\\' && isSpecial(url))) {
	              url.path.push('');
	            }
	          } else {
	            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
	              if (url.host) url.host = '';
	              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
	            }
	            url.path.push(buffer);
	          }
	          buffer = '';
	          if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
	            while (url.path.length > 1 && url.path[0] === '') {
	              url.path.shift();
	            }
	          }
	          if (char == '?') {
	            url.query = '';
	            state = QUERY;
	          } else if (char == '#') {
	            url.fragment = '';
	            state = FRAGMENT;
	          }
	        } else {
	          buffer += percentEncode(char, pathPercentEncodeSet);
	        } break;

	      case CANNOT_BE_A_BASE_URL_PATH:
	        if (char == '?') {
	          url.query = '';
	          state = QUERY;
	        } else if (char == '#') {
	          url.fragment = '';
	          state = FRAGMENT;
	        } else if (char != EOF) {
	          url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
	        } break;

	      case QUERY:
	        if (!stateOverride && char == '#') {
	          url.fragment = '';
	          state = FRAGMENT;
	        } else if (char != EOF) {
	          if (char == "'" && isSpecial(url)) url.query += '%27';
	          else if (char == '#') url.query += '%23';
	          else url.query += percentEncode(char, C0ControlPercentEncodeSet);
	        } break;

	      case FRAGMENT:
	        if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
	        break;
	    }

	    pointer++;
	  }
	};

	// `URL` constructor
	// https://url.spec.whatwg.org/#url-class
	var URLConstructor = function URL(url /* , base */) {
	  var that = anInstance(this, URLConstructor, 'URL');
	  var base = arguments.length > 1 ? arguments[1] : undefined;
	  var urlString = String(url);
	  var state = setInternalState$a(that, { type: 'URL' });
	  var baseState, failure;
	  if (base !== undefined) {
	    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
	    else {
	      failure = parseURL(baseState = {}, String(base));
	      if (failure) throw TypeError(failure);
	    }
	  }
	  failure = parseURL(state, urlString, null, baseState);
	  if (failure) throw TypeError(failure);
	  var searchParams = state.searchParams = new URLSearchParams$1();
	  var searchParamsState = getInternalSearchParamsState(searchParams);
	  searchParamsState.updateSearchParams(state.query);
	  searchParamsState.updateURL = function () {
	    state.query = String(searchParams) || null;
	  };
	  if (!descriptors) {
	    that.href = serializeURL.call(that);
	    that.origin = getOrigin.call(that);
	    that.protocol = getProtocol.call(that);
	    that.username = getUsername.call(that);
	    that.password = getPassword.call(that);
	    that.host = getHost.call(that);
	    that.hostname = getHostname.call(that);
	    that.port = getPort.call(that);
	    that.pathname = getPathname.call(that);
	    that.search = getSearch.call(that);
	    that.searchParams = getSearchParams.call(that);
	    that.hash = getHash.call(that);
	  }
	};

	var URLPrototype = URLConstructor.prototype;

	var serializeURL = function () {
	  var url = getInternalURLState(this);
	  var scheme = url.scheme;
	  var username = url.username;
	  var password = url.password;
	  var host = url.host;
	  var port = url.port;
	  var path = url.path;
	  var query = url.query;
	  var fragment = url.fragment;
	  var output = scheme + ':';
	  if (host !== null) {
	    output += '//';
	    if (includesCredentials(url)) {
	      output += username + (password ? ':' + password : '') + '@';
	    }
	    output += serializeHost(host);
	    if (port !== null) output += ':' + port;
	  } else if (scheme == 'file') output += '//';
	  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
	  if (query !== null) output += '?' + query;
	  if (fragment !== null) output += '#' + fragment;
	  return output;
	};

	var getOrigin = function () {
	  var url = getInternalURLState(this);
	  var scheme = url.scheme;
	  var port = url.port;
	  if (scheme == 'blob') try {
	    return new URL(scheme.path[0]).origin;
	  } catch (error) {
	    return 'null';
	  }
	  if (scheme == 'file' || !isSpecial(url)) return 'null';
	  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
	};

	var getProtocol = function () {
	  return getInternalURLState(this).scheme + ':';
	};

	var getUsername = function () {
	  return getInternalURLState(this).username;
	};

	var getPassword = function () {
	  return getInternalURLState(this).password;
	};

	var getHost = function () {
	  var url = getInternalURLState(this);
	  var host = url.host;
	  var port = url.port;
	  return host === null ? ''
	    : port === null ? serializeHost(host)
	    : serializeHost(host) + ':' + port;
	};

	var getHostname = function () {
	  var host = getInternalURLState(this).host;
	  return host === null ? '' : serializeHost(host);
	};

	var getPort = function () {
	  var port = getInternalURLState(this).port;
	  return port === null ? '' : String(port);
	};

	var getPathname = function () {
	  var url = getInternalURLState(this);
	  var path = url.path;
	  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
	};

	var getSearch = function () {
	  var query = getInternalURLState(this).query;
	  return query ? '?' + query : '';
	};

	var getSearchParams = function () {
	  return getInternalURLState(this).searchParams;
	};

	var getHash = function () {
	  var fragment = getInternalURLState(this).fragment;
	  return fragment ? '#' + fragment : '';
	};

	var accessorDescriptor = function (getter, setter) {
	  return { get: getter, set: setter, configurable: true, enumerable: true };
	};

	if (descriptors) {
	  objectDefineProperties(URLPrototype, {
	    // `URL.prototype.href` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-href
	    href: accessorDescriptor(serializeURL, function (href) {
	      var url = getInternalURLState(this);
	      var urlString = String(href);
	      var failure = parseURL(url, urlString);
	      if (failure) throw TypeError(failure);
	      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
	    }),
	    // `URL.prototype.origin` getter
	    // https://url.spec.whatwg.org/#dom-url-origin
	    origin: accessorDescriptor(getOrigin),
	    // `URL.prototype.protocol` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-protocol
	    protocol: accessorDescriptor(getProtocol, function (protocol) {
	      var url = getInternalURLState(this);
	      parseURL(url, String(protocol) + ':', SCHEME_START);
	    }),
	    // `URL.prototype.username` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-username
	    username: accessorDescriptor(getUsername, function (username) {
	      var url = getInternalURLState(this);
	      var codePoints = arrayFrom(String(username));
	      if (cannotHaveUsernamePasswordPort(url)) return;
	      url.username = '';
	      for (var i = 0; i < codePoints.length; i++) {
	        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
	      }
	    }),
	    // `URL.prototype.password` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-password
	    password: accessorDescriptor(getPassword, function (password) {
	      var url = getInternalURLState(this);
	      var codePoints = arrayFrom(String(password));
	      if (cannotHaveUsernamePasswordPort(url)) return;
	      url.password = '';
	      for (var i = 0; i < codePoints.length; i++) {
	        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
	      }
	    }),
	    // `URL.prototype.host` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-host
	    host: accessorDescriptor(getHost, function (host) {
	      var url = getInternalURLState(this);
	      if (url.cannotBeABaseURL) return;
	      parseURL(url, String(host), HOST);
	    }),
	    // `URL.prototype.hostname` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-hostname
	    hostname: accessorDescriptor(getHostname, function (hostname) {
	      var url = getInternalURLState(this);
	      if (url.cannotBeABaseURL) return;
	      parseURL(url, String(hostname), HOSTNAME);
	    }),
	    // `URL.prototype.port` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-port
	    port: accessorDescriptor(getPort, function (port) {
	      var url = getInternalURLState(this);
	      if (cannotHaveUsernamePasswordPort(url)) return;
	      port = String(port);
	      if (port == '') url.port = null;
	      else parseURL(url, port, PORT);
	    }),
	    // `URL.prototype.pathname` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-pathname
	    pathname: accessorDescriptor(getPathname, function (pathname) {
	      var url = getInternalURLState(this);
	      if (url.cannotBeABaseURL) return;
	      url.path = [];
	      parseURL(url, pathname + '', PATH_START);
	    }),
	    // `URL.prototype.search` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-search
	    search: accessorDescriptor(getSearch, function (search) {
	      var url = getInternalURLState(this);
	      search = String(search);
	      if (search == '') {
	        url.query = null;
	      } else {
	        if ('?' == search.charAt(0)) search = search.slice(1);
	        url.query = '';
	        parseURL(url, search, QUERY);
	      }
	      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
	    }),
	    // `URL.prototype.searchParams` getter
	    // https://url.spec.whatwg.org/#dom-url-searchparams
	    searchParams: accessorDescriptor(getSearchParams),
	    // `URL.prototype.hash` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-hash
	    hash: accessorDescriptor(getHash, function (hash) {
	      var url = getInternalURLState(this);
	      hash = String(hash);
	      if (hash == '') {
	        url.fragment = null;
	        return;
	      }
	      if ('#' == hash.charAt(0)) hash = hash.slice(1);
	      url.fragment = '';
	      parseURL(url, hash, FRAGMENT);
	    })
	  });
	}

	// `URL.prototype.toJSON` method
	// https://url.spec.whatwg.org/#dom-url-tojson
	redefine(URLPrototype, 'toJSON', function toJSON() {
	  return serializeURL.call(this);
	}, { enumerable: true });

	// `URL.prototype.toString` method
	// https://url.spec.whatwg.org/#URL-stringification-behavior
	redefine(URLPrototype, 'toString', function toString() {
	  return serializeURL.call(this);
	}, { enumerable: true });

	if (NativeURL) {
	  var nativeCreateObjectURL = NativeURL.createObjectURL;
	  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
	  // `URL.createObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
	  // eslint-disable-next-line no-unused-vars
	  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
	    return nativeCreateObjectURL.apply(NativeURL, arguments);
	  });
	  // `URL.revokeObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
	  // eslint-disable-next-line no-unused-vars
	  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
	    return nativeRevokeObjectURL.apply(NativeURL, arguments);
	  });
	}

	setToStringTag(URLConstructor, 'URL');

	_export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
	  URL: URLConstructor
	});

	// `URL.prototype.toJSON` method
	// https://url.spec.whatwg.org/#dom-url-tojson
	_export({ target: 'URL', proto: true, enumerable: true }, {
	  toJSON: function toJSON() {
	    return URL.prototype.toString.call(this);
	  }
	});

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function ownKeys$1(object, enumerableOnly) {
	  var keys = Object.keys(object);

	  if (Object.getOwnPropertySymbols) {
	    var symbols = Object.getOwnPropertySymbols(object);
	    if (enumerableOnly) symbols = symbols.filter(function (sym) {
	      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
	    });
	    keys.push.apply(keys, symbols);
	  }

	  return keys;
	}

	function _objectSpread2(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};

	    if (i % 2) {
	      ownKeys$1(Object(source), true).forEach(function (key) {
	        _defineProperty(target, key, source[key]);
	      });
	    } else if (Object.getOwnPropertyDescriptors) {
	      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
	    } else {
	      ownKeys$1(Object(source)).forEach(function (key) {
	        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
	      });
	    }
	  }

	  return target;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _construct(Parent, args, Class) {
	  if (isNativeReflectConstruct()) {
	    _construct = Reflect.construct;
	  } else {
	    _construct = function _construct(Parent, args, Class) {
	      var a = [null];
	      a.push.apply(a, args);
	      var Constructor = Function.bind.apply(Parent, a);
	      var instance = new Constructor();
	      if (Class) _setPrototypeOf(instance, Class.prototype);
	      return instance;
	    };
	  }

	  return _construct.apply(null, arguments);
	}

	function _isNativeFunction(fn) {
	  return Function.toString.call(fn).indexOf("[native code]") !== -1;
	}

	function _wrapNativeSuper(Class) {
	  var _cache = typeof Map === "function" ? new Map() : undefined;

	  _wrapNativeSuper = function _wrapNativeSuper(Class) {
	    if (Class === null || !_isNativeFunction(Class)) return Class;

	    if (typeof Class !== "function") {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    if (typeof _cache !== "undefined") {
	      if (_cache.has(Class)) return _cache.get(Class);

	      _cache.set(Class, Wrapper);
	    }

	    function Wrapper() {
	      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
	    }

	    Wrapper.prototype = Object.create(Class.prototype, {
	      constructor: {
	        value: Wrapper,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	    return _setPrototypeOf(Wrapper, Class);
	  };

	  return _wrapNativeSuper(Class);
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _possibleConstructorReturn(self, call) {
	  if (call && (typeof call === "object" || typeof call === "function")) {
	    return call;
	  }

	  return _assertThisInitialized(self);
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  }
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArray(iter) {
	  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
	}

	function _iterableToArrayLimit(arr, i) {
	  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
	    return;
	  }

	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance");
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance");
	}

	function noop() {}

	function assign(tar, src) {
	  // @ts-ignore
	  for (var k in src) {
	    tar[k] = src[k];
	  }

	  return tar;
	}

	function run$1(fn) {
	  return fn();
	}

	function blank_object() {
	  return Object.create(null);
	}

	function run_all(fns) {
	  fns.forEach(run$1);
	}

	function is_function(thing) {
	  return typeof thing === 'function';
	}

	function safe_not_equal(a, b) {
	  return a != a ? b == b : a !== b || a && _typeof(a) === 'object' || typeof a === 'function';
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
	  for (var i = 0; i < iterations.length; i += 1) {
	    if (iterations[i]) iterations[i].d(detaching);
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
	  return function () {
	    return node.removeEventListener(event, handler, options);
	  };
	}

	function stop_propagation(fn) {
	  return function (event) {
	    event.stopPropagation(); // @ts-ignore

	    return fn.call(this, event);
	  };
	}

	function attr(node, attribute, value) {
	  if (value == null) node.removeAttribute(attribute);else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}

	function children(element) {
	  return Array.from(element.childNodes);
	}

	function set_data(text, data) {
	  data = '' + data;
	  if (text.data !== data) text.data = data;
	}

	function set_input_value(input, value) {
	  if (value != null || input.value) {
	    input.value = value;
	  }
	}

	function toggle_class(element, name, toggle) {
	  element.classList[toggle ? 'add' : 'remove'](name);
	}

	function custom_event(type, detail) {
	  var e = document.createEvent('CustomEvent');
	  e.initCustomEvent(type, false, false, detail);
	  return e;
	}

	var current_component;

	function set_current_component(component) {
	  current_component = component;
	}

	function get_current_component() {
	  if (!current_component) throw new Error("Function called outside component initialization");
	  return current_component;
	}

	function onMount(fn) {
	  get_current_component().$$.on_mount.push(fn);
	}

	function createEventDispatcher() {
	  var component = get_current_component();
	  return function (type, detail) {
	    var callbacks = component.$$.callbacks[type];

	    if (callbacks) {
	      // TODO are there situations where events could be dispatched
	      // in a server (non-DOM) environment?
	      var event = custom_event(type, detail);
	      callbacks.slice().forEach(function (fn) {
	        fn.call(component, event);
	      });
	    }
	  };
	}
	// shorthand events, or if we want to implement
	// a real bubbling mechanism


	function bubble(component, event) {
	  var callbacks = component.$$.callbacks[event.type];

	  if (callbacks) {
	    callbacks.slice().forEach(function (fn) {
	      return fn(event);
	    });
	  }
	}

	var dirty_components = [];
	var binding_callbacks = [];
	var render_callbacks = [];
	var flush_callbacks = [];
	var resolved_promise = Promise.resolve();
	var update_scheduled = false;

	function schedule_update() {
	  if (!update_scheduled) {
	    update_scheduled = true;
	    resolved_promise.then(flush$1);
	  }
	}

	function add_render_callback(fn) {
	  render_callbacks.push(fn);
	}

	var flushing = false;
	var seen_callbacks = new Set();

	function flush$1() {
	  if (flushing) return;
	  flushing = true;

	  do {
	    // first, call beforeUpdate functions
	    // and update components
	    for (var i = 0; i < dirty_components.length; i += 1) {
	      var component = dirty_components[i];
	      set_current_component(component);
	      update(component.$$);
	    }

	    dirty_components.length = 0;

	    while (binding_callbacks.length) {
	      binding_callbacks.pop()();
	    } // then, once components are updated, call
	    // afterUpdate functions. This may cause
	    // subsequent updates...


	    for (var _i = 0; _i < render_callbacks.length; _i += 1) {
	      var callback = render_callbacks[_i];

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
	  flushing = false;
	  seen_callbacks.clear();
	}

	function update($$) {
	  if ($$.fragment !== null) {
	    $$.update();
	    run_all($$.before_update);
	    var dirty = $$.dirty;
	    $$.dirty = [-1];
	    $$.fragment && $$.fragment.p($$.ctx, dirty);
	    $$.after_update.forEach(add_render_callback);
	  }
	}

	var outroing = new Set();
	var outros;

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
	    if (outroing.has(block)) return;
	    outroing.add(block);
	    outros.c.push(function () {
	      outroing.delete(block);

	      if (callback) {
	        if (detach) block.d(1);
	        callback();
	      }
	    });
	    block.o(local);
	  }
	}

	function get_spread_update(levels, updates) {
	  var update = {};
	  var to_null_out = {};
	  var accounted_for = {
	    $$scope: 1
	  };
	  var i = levels.length;

	  while (i--) {
	    var o = levels[i];
	    var n = updates[i];

	    if (n) {
	      for (var key in o) {
	        if (!(key in n)) to_null_out[key] = 1;
	      }

	      for (var _key3 in n) {
	        if (!accounted_for[_key3]) {
	          update[_key3] = n[_key3];
	          accounted_for[_key3] = 1;
	        }
	      }

	      levels[i] = n;
	    } else {
	      for (var _key4 in o) {
	        accounted_for[_key4] = 1;
	      }
	    }
	  }

	  for (var _key5 in to_null_out) {
	    if (!(_key5 in update)) update[_key5] = undefined;
	  }

	  return update;
	}

	function get_spread_object(spread_props) {
	  return _typeof(spread_props) === 'object' && spread_props !== null ? spread_props : {};
	} // source: https://html.spec.whatwg.org/multipage/indices.html

	function create_component(block) {
	  block && block.c();
	}

	function mount_component(component, target, anchor) {
	  var _component$$$ = component.$$,
	      fragment = _component$$$.fragment,
	      on_mount = _component$$$.on_mount,
	      on_destroy = _component$$$.on_destroy,
	      after_update = _component$$$.after_update;
	  fragment && fragment.m(target, anchor); // onMount happens before the initial afterUpdate

	  add_render_callback(function () {
	    var new_on_destroy = on_mount.map(run$1).filter(is_function);

	    if (on_destroy) {
	      on_destroy.push.apply(on_destroy, _toConsumableArray(new_on_destroy));
	    } else {
	      // Edge case - component was destroyed immediately,
	      // most likely as a result of a binding initialising
	      run_all(new_on_destroy);
	    }

	    component.$$.on_mount = [];
	  });
	  after_update.forEach(add_render_callback);
	}

	function destroy_component(component, detaching) {
	  var $$ = component.$$;

	  if ($$.fragment !== null) {
	    run_all($$.on_destroy);
	    $$.fragment && $$.fragment.d(detaching); // TODO null out other refs, including component.$$ (but need to
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

	  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
	}

	function init(component, options, instance, create_fragment, not_equal, props) {
	  var dirty = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [-1];
	  var parent_component = current_component;
	  set_current_component(component);
	  var prop_values = options.props || {};
	  var $$ = component.$$ = {
	    fragment: null,
	    ctx: null,
	    // state
	    props: props,
	    update: noop,
	    not_equal: not_equal,
	    bound: blank_object(),
	    // lifecycle
	    on_mount: [],
	    on_destroy: [],
	    before_update: [],
	    after_update: [],
	    context: new Map(parent_component ? parent_component.$$.context : []),
	    // everything else
	    callbacks: blank_object(),
	    dirty: dirty
	  };
	  var ready = false;
	  $$.ctx = instance ? instance(component, prop_values, function (i, ret) {
	    var value = (arguments.length <= 2 ? 0 : arguments.length - 2) ? arguments.length <= 2 ? undefined : arguments[2] : ret;

	    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
	      if ($$.bound[i]) $$.bound[i](value);
	      if (ready) make_dirty(component, i);
	    }

	    return ret;
	  }) : [];
	  $$.update();
	  ready = true;
	  run_all($$.before_update); // `false` as a special case of no DOM component

	  $$.fragment = create_fragment ? create_fragment($$.ctx) : false;

	  if (options.target) {
	    if (options.hydrate) {
	      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	      $$.fragment && $$.fragment.l(children(options.target));
	    } else {
	      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	      $$.fragment && $$.fragment.c();
	    }

	    if (options.intro) transition_in(component.$$.fragment);
	    mount_component(component, options.target, options.anchor);
	    flush$1();
	  }

	  set_current_component(parent_component);
	}

	var SvelteElement;

	if (typeof HTMLElement === 'function') {
	  SvelteElement =
	  /*#__PURE__*/
	  function (_HTMLElement) {
	    _inherits(SvelteElement, _HTMLElement);

	    function SvelteElement() {
	      var _this;

	      _classCallCheck(this, SvelteElement);

	      _this = _possibleConstructorReturn(this, _getPrototypeOf(SvelteElement).call(this));

	      _this.attachShadow({
	        mode: 'open'
	      });

	      return _this;
	    }

	    _createClass(SvelteElement, [{
	      key: "connectedCallback",
	      value: function connectedCallback() {
	        // @ts-ignore todo: improve typings
	        for (var key in this.$$.slotted) {
	          // @ts-ignore todo: improve typings
	          this.appendChild(this.$$.slotted[key]);
	        }
	      }
	    }, {
	      key: "attributeChangedCallback",
	      value: function attributeChangedCallback(attr, _oldValue, newValue) {
	        this[attr] = newValue;
	      }
	    }, {
	      key: "$destroy",
	      value: function $destroy() {
	        destroy_component(this, 1);
	        this.$destroy = noop;
	      }
	    }, {
	      key: "$on",
	      value: function $on(type, callback) {
	        // TODO should this delegate to addEventListener?
	        var callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
	        callbacks.push(callback);
	        return function () {
	          var index = callbacks.indexOf(callback);
	          if (index !== -1) callbacks.splice(index, 1);
	        };
	      }
	    }, {
	      key: "$set",
	      value: function $set() {// overridden by instance, if it has props
	      }
	    }]);

	    return SvelteElement;
	  }(_wrapNativeSuper(HTMLElement));
	}

	var SvelteComponent =
	/*#__PURE__*/
	function () {
	  function SvelteComponent() {
	    _classCallCheck(this, SvelteComponent);
	  }

	  _createClass(SvelteComponent, [{
	    key: "$destroy",
	    value: function $destroy() {
	      destroy_component(this, 1);
	      this.$destroy = noop;
	    }
	  }, {
	    key: "$on",
	    value: function $on(type, callback) {
	      var callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
	      callbacks.push(callback);
	      return function () {
	        var index = callbacks.indexOf(callback);
	        if (index !== -1) callbacks.splice(index, 1);
	      };
	    }
	  }, {
	    key: "$set",
	    value: function $set() {// overridden by instance, if it has props
	    }
	  }]);

	  return SvelteComponent;
	}();

	var uncap = function uncap(str) {
	  return "".concat(str.substr(0, 1).toLowerCase()).concat(str.substr(1));
	};

	var parseNode = function parseNode(node) {
	  var children = node.children;

	  if (Array.isArray(children)) {
	    return children.reduce(function (a, e) {
	      return _objectSpread2({}, a, _defineProperty({}, uncap(e.name), e.value));
	    }, {});
	  } else {
	    return null;
	  }
	};

	var parseExGeographicBoundingBox = function parseExGeographicBoundingBox(node) {
	  var _parseNode = parseNode(node),
	      eastBoundLongitude = _parseNode.eastBoundLongitude,
	      northBoundLatitude = _parseNode.northBoundLatitude,
	      southBoundLatitude = _parseNode.southBoundLatitude,
	      westBoundLongitude = _parseNode.westBoundLongitude;

	  return {
	    eastBoundLongitude: parseFloat(eastBoundLongitude),
	    northBoundLatitude: parseFloat(northBoundLatitude),
	    southBoundLatitude: parseFloat(southBoundLatitude),
	    westBoundLongitude: parseFloat(westBoundLongitude)
	  };
	};

	var parseStyle = function parseStyle(node) {
	  var children = node.children;

	  if (Array.isArray(children)) {
	    return children.reduce(function (a, e) {
	      if (e.localName === 'LegendURL' && e.attributes) {
	        var _e$attributes = e.attributes,
	            width = _e$attributes.width,
	            height = _e$attributes.height;

	        if (width) {
	          a.width = parseInt(width, 10);
	        }

	        if (height) {
	          a.height = parseInt(height, 10);
	        }
	      }

	      return a;
	    }, {});
	  } else {
	    return null;
	  }
	};

	var toLayer = function toLayer(node) {
	  var children = node.children;

	  if (Array.isArray(children)) {
	    return children.reduce(function (a, e) {
	      var localName = e.localName,
	          name = e.name;

	      switch (localName) {
	        case 'Layer':
	          if (a.children) {
	            a.children.push(toLayer(e));
	          } else {
	            a.children = [toLayer(e)];
	          }

	          break;

	        case 'Style':
	          a = _objectSpread2({}, a, {}, parseStyle(e));
	          break;

	        case 'CRS':
	          if (a.crs) {
	            a.crs.push(e.value);
	          } else {
	            a.crs = [e.value];
	          }

	          break;

	        case 'EX_GeographicBoundingBox':
	          a.exGeographicBoundingBox = parseExGeographicBoundingBox(e);
	          break;

	        case 'BoundingBox':
	          if (a[uncap(name)]) {
	            a[uncap(name)].push(e.attributes);
	          } else {
	            a[uncap(name)] = [e.attributes];
	          }

	          break;

	        default:
	          a[uncap(name)] = e.value;
	          break;
	      }

	      return a;
	    }, {});
	  } else {
	    return null;
	  }
	};

	var toLayers = function toLayers(_ref) {
	  var children = _ref.children;
	  return children.reduce(function (a, n) {
	    switch (n.localName) {
	      case 'Capability':
	        n.children.filter(function (x) {
	          return x.localName === 'Layer';
	        }).map(toLayer).forEach(function (x) {
	          return a.layers = a.layers ? a.layers.concat(x) : [x];
	        });
	        break;

	      case 'Service':
	        a = _objectSpread2({}, a, {}, parseNode(n));
	        break;
	    }

	    return a;
	  }, {});
	};

	var toFeature = function toFeature(node) {
	  var children = node.children;

	  if (Array.isArray(children)) {
	    return children.reduce(function (a, e) {
	      var localName = e.localName,
	          name = e.name;

	      switch (localName) {
	        case 'Title':
	          a.title = e.value;
	          a[uncap(name)] = e.value;
	          break;

	        case 'Name':
	        case 'Abstract':
	        case 'DefaultSRS':
	          a[uncap(name)] = e.value;
	          break;

	        case 'OtherSRS':
	          if (a[uncap(name)]) {
	            a[uncap(name)].push(e.value);
	          } else {
	            a[uncap(name)] = [e.value];
	          }

	          break;

	        case 'WGS84BoundingBox':
	          a.wgs84BoundingBox = parseNode(e);
	          break;
	      }

	      return a;
	    }, {});
	  } else {
	    return null;
	  }
	};

	var parseServiceIdentification = function parseServiceIdentification(node) {
	  var children = node.children;

	  if (Array.isArray(children)) {
	    return children.reduce(function (a, e) {
	      switch (e.name) {
	        case 'ows:Title':
	          a.title = e.value;
	          break;

	        default:
	          a[uncap(e.name)] = e.value;
	          break;
	      }

	      return a;
	    }, {});
	  } else {
	    return null;
	  }
	};

	var toFeatures = function toFeatures(_ref2) {
	  var children = _ref2.children;
	  return children.reduce(function (a, n) {
	    var localName = n.localName;

	    switch (localName) {
	      case 'FeatureTypeList':
	        n.children.filter(function (x) {
	          return x.localName === 'FeatureType';
	        }).map(toFeature).forEach(function (x) {
	          return a.features = a.features ? a.features.concat(x) : [x];
	        });
	        break;

	      case 'ServiceIdentification':
	        a = _objectSpread2({}, a, {}, parseServiceIdentification(n));
	        break;
	    }

	    return a;
	  }, []);
	};

	function create_fragment(ctx) {
	  var div;
	  var i;
	  var t0;
	  var t1;
	  var dispose;
	  return {
	    c: function c() {
	      div = element("div");
	      i = element("i");
	      t0 = space();
	      t1 = text(
	      /*title*/
	      ctx[1]);
	      attr(i, "class", "scanex-svc-view-visible icon");
	      toggle_class(i, "check-square",
	      /*visible*/
	      ctx[0]);
	      toggle_class(i, "square", !
	      /*visible*/
	      ctx[0]);
	      attr(div, "class", "feature");
	    },
	    m: function m(target, anchor) {
	      insert(target, div, anchor);
	      append(div, i);
	      append(div, t0);
	      append(div, t1);
	      dispose = listen(i, "click", stop_propagation(
	      /*toggleVisibility*/
	      ctx[2]));
	    },
	    p: function p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (dirty &
	      /*visible*/
	      1) {
	        toggle_class(i, "check-square",
	        /*visible*/
	        ctx[0]);
	      }

	      if (dirty &
	      /*visible*/
	      1) {
	        toggle_class(i, "square", !
	        /*visible*/
	        ctx[0]);
	      }

	      if (dirty &
	      /*title*/
	      2) set_data(t1,
	      /*title*/
	      ctx[1]);
	    },
	    i: noop,
	    o: noop,
	    d: function d(detaching) {
	      if (detaching) detach(div);
	      dispose();
	    }
	  };
	}

	function instance($$self, $$props, $$invalidate) {
	  var dispatch = createEventDispatcher();
	  var _$$props$name = $$props.name,
	      name = _$$props$name === void 0 ? "" : _$$props$name;
	  var _$$props$title = $$props.title,
	      title = _$$props$title === void 0 ? "" : _$$props$title;
	  var _$$props$abstract = $$props.abstract,
	      abstract = _$$props$abstract === void 0 ? "" : _$$props$abstract;
	  var _$$props$visible = $$props.visible,
	      visible = _$$props$visible === void 0 ? false : _$$props$visible;

	  function toggleVisibility() {
	    $$invalidate(0, visible = !visible);
	    dispatch("change:visible", {
	      title: title,
	      name: name,
	      abstract: abstract,
	      visible: visible
	    });
	  }

	  $$self.$set = function ($$props) {
	    if ("name" in $$props) $$invalidate(3, name = $$props.name);
	    if ("title" in $$props) $$invalidate(1, title = $$props.title);
	    if ("abstract" in $$props) $$invalidate(4, abstract = $$props.abstract);
	    if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
	  };

	  return [visible, title, toggleVisibility, name, abstract];
	}

	var Feature =
	/*#__PURE__*/
	function (_SvelteComponent) {
	  _inherits(Feature, _SvelteComponent);

	  function Feature(options) {
	    var _this;

	    _classCallCheck(this, Feature);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(Feature).call(this));
	    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {
	      name: 3,
	      title: 1,
	      abstract: 4,
	      visible: 0
	    });
	    return _this;
	  }

	  return Feature;
	}(SvelteComponent);

	function get_each_context(ctx, list, i) {
	  var child_ctx = ctx.slice();
	  child_ctx[5] = list[i];
	  return child_ctx;
	} // (28:8) {#each features as f}


	function create_each_block(ctx) {
	  var current;
	  var feature_spread_levels = [
	  /*f*/
	  ctx[5]];
	  var feature_props = {};

	  for (var i = 0; i < feature_spread_levels.length; i += 1) {
	    feature_props = assign(feature_props, feature_spread_levels[i]);
	  }

	  var feature = new Feature({
	    props: feature_props
	  });
	  feature.$on("change:visible",
	  /*change_visible_handler*/
	  ctx[4]);
	  return {
	    c: function c() {
	      create_component(feature.$$.fragment);
	    },
	    m: function m(target, anchor) {
	      mount_component(feature, target, anchor);
	      current = true;
	    },
	    p: function p(ctx, dirty) {
	      var feature_changes = dirty &
	      /*features*/
	      2 ? get_spread_update(feature_spread_levels, [get_spread_object(
	      /*f*/
	      ctx[5])]) : {};
	      feature.$set(feature_changes);
	    },
	    i: function i(local) {
	      if (current) return;
	      transition_in(feature.$$.fragment, local);
	      current = true;
	    },
	    o: function o(local) {
	      transition_out(feature.$$.fragment, local);
	      current = false;
	    },
	    d: function d(detaching) {
	      destroy_component(feature, detaching);
	    }
	  };
	}

	function create_fragment$1(ctx) {
	  var div3;
	  var div1;
	  var table;
	  var tr;
	  var td0;
	  var t1;
	  var td1;
	  var t2;
	  var t3;
	  var td2;
	  var i;
	  var t4;
	  var div2;
	  var current;
	  var dispose;
	  var each_value =
	  /*features*/
	  ctx[1];
	  var each_blocks = [];

	  for (var _i = 0; _i < each_value.length; _i += 1) {
	    each_blocks[_i] = create_each_block(get_each_context(ctx, each_value, _i));
	  }

	  var out = function out(i) {
	    return transition_out(each_blocks[i], 1, 1, function () {
	      each_blocks[i] = null;
	    });
	  };

	  return {
	    c: function c() {
	      div3 = element("div");
	      div1 = element("div");
	      table = element("table");
	      tr = element("tr");
	      td0 = element("td");
	      td0.innerHTML = "<div class=\"service\">WFS</div>";
	      t1 = space();
	      td1 = element("td");
	      t2 = text(
	      /*title*/
	      ctx[0]);
	      t3 = space();
	      td2 = element("td");
	      i = element("i");
	      t4 = space();
	      div2 = element("div");

	      for (var _i2 = 0; _i2 < each_blocks.length; _i2 += 1) {
	        each_blocks[_i2].c();
	      }

	      attr(td1, "class", "title");
	      attr(i, "class", "icon close");
	      attr(table, "cellspacing", "0");
	      attr(table, "cellpadding", "0");
	      attr(div1, "class", "header");
	      attr(div2, "class", "content");
	      attr(div3, "class", "scanex-svc-view-link");
	    },
	    m: function m(target, anchor) {
	      insert(target, div3, anchor);
	      append(div3, div1);
	      append(div1, table);
	      append(table, tr);
	      append(tr, td0);
	      append(tr, t1);
	      append(tr, td1);
	      append(td1, t2);
	      append(tr, t3);
	      append(tr, td2);
	      append(td2, i);
	      append(div3, t4);
	      append(div3, div2);

	      for (var _i3 = 0; _i3 < each_blocks.length; _i3 += 1) {
	        each_blocks[_i3].m(div2, null);
	      }

	      current = true;
	      dispose = listen(i, "click",
	      /*click_handler*/
	      ctx[3]);
	    },
	    p: function p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (!current || dirty &
	      /*title*/
	      1) set_data(t2,
	      /*title*/
	      ctx[0]);

	      if (dirty &
	      /*features*/
	      2) {
	        each_value =
	        /*features*/
	        ctx[1];

	        var _i4;

	        for (_i4 = 0; _i4 < each_value.length; _i4 += 1) {
	          var child_ctx = get_each_context(ctx, each_value, _i4);

	          if (each_blocks[_i4]) {
	            each_blocks[_i4].p(child_ctx, dirty);

	            transition_in(each_blocks[_i4], 1);
	          } else {
	            each_blocks[_i4] = create_each_block(child_ctx);

	            each_blocks[_i4].c();

	            transition_in(each_blocks[_i4], 1);

	            each_blocks[_i4].m(div2, null);
	          }
	        }

	        group_outros();

	        for (_i4 = each_value.length; _i4 < each_blocks.length; _i4 += 1) {
	          out(_i4);
	        }

	        check_outros();
	      }
	    },
	    i: function i(local) {
	      if (current) return;

	      for (var _i5 = 0; _i5 < each_value.length; _i5 += 1) {
	        transition_in(each_blocks[_i5]);
	      }

	      current = true;
	    },
	    o: function o(local) {
	      each_blocks = each_blocks.filter(Boolean);

	      for (var _i6 = 0; _i6 < each_blocks.length; _i6 += 1) {
	        transition_out(each_blocks[_i6]);
	      }

	      current = false;
	    },
	    d: function d(detaching) {
	      if (detaching) detach(div3);
	      destroy_each(each_blocks, detaching);
	      dispose();
	    }
	  };
	}

	function instance$1($$self, $$props, $$invalidate) {
	  var _$$props$title = $$props.title,
	      title = _$$props$title === void 0 ? "" : _$$props$title;
	  var _$$props$features = $$props.features,
	      features = _$$props$features === void 0 ? [] : _$$props$features;
	  var dispatch = createEventDispatcher();

	  var click_handler = function click_handler() {
	    return dispatch("close");
	  };

	  function change_visible_handler(event) {
	    bubble($$self, event);
	  }

	  $$self.$set = function ($$props) {
	    if ("title" in $$props) $$invalidate(0, title = $$props.title);
	    if ("features" in $$props) $$invalidate(1, features = $$props.features);
	  };

	  return [title, features, dispatch, click_handler, change_visible_handler];
	}

	var WFS =
	/*#__PURE__*/
	function (_SvelteComponent) {
	  _inherits(WFS, _SvelteComponent);

	  function WFS(options) {
	    var _this;

	    _classCallCheck(this, WFS);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(WFS).call(this));
	    init(_assertThisInitialized(_this), options, instance$1, create_fragment$1, safe_not_equal, {
	      title: 0,
	      features: 1
	    });
	    return _this;
	  }

	  return WFS;
	}(SvelteComponent);

	function get_each_context$1(ctx, list, i) {
	  var child_ctx = ctx.slice();
	  child_ctx[20] = list[i];
	  child_ctx[22] = i;
	  return child_ctx;
	} // (72:12) {#if hasChildren}


	function create_if_block_1(ctx) {
	  var i;
	  return {
	    c: function c() {
	      i = element("i");
	      attr(i, "class", "scanex-svc-view-folder icon");
	      toggle_class(i, "folder-open",
	      /*expanded*/
	      ctx[2]);
	      toggle_class(i, "folder", !
	      /*expanded*/
	      ctx[2]);
	    },
	    m: function m(target, anchor) {
	      insert(target, i, anchor);
	    },
	    p: function p(ctx, dirty) {
	      if (dirty &
	      /*expanded*/
	      4) {
	        toggle_class(i, "folder-open",
	        /*expanded*/
	        ctx[2]);
	      }

	      if (dirty &
	      /*expanded*/
	      4) {
	        toggle_class(i, "folder", !
	        /*expanded*/
	        ctx[2]);
	      }
	    },
	    d: function d(detaching) {
	      if (detaching) detach(i);
	    }
	  };
	} // (77:4) {#if Array.isArray(children) && children.length > 0}


	function create_if_block(ctx) {
	  var div;
	  var current;
	  var each_value =
	  /*children*/
	  ctx[0];
	  var each_blocks = [];

	  for (var i = 0; i < each_value.length; i += 1) {
	    each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	  }

	  var out = function out(i) {
	    return transition_out(each_blocks[i], 1, 1, function () {
	      each_blocks[i] = null;
	    });
	  };

	  return {
	    c: function c() {
	      div = element("div");

	      for (var _i = 0; _i < each_blocks.length; _i += 1) {
	        each_blocks[_i].c();
	      }

	      attr(div, "class", "children");
	      toggle_class(div, "collapsed", !
	      /*expanded*/
	      ctx[2]);
	    },
	    m: function m(target, anchor) {
	      insert(target, div, anchor);

	      for (var _i2 = 0; _i2 < each_blocks.length; _i2 += 1) {
	        each_blocks[_i2].m(div, null);
	      }

	      current = true;
	    },
	    p: function p(ctx, dirty) {
	      if (dirty &
	      /*children, onChangeState*/
	      257) {
	        each_value =
	        /*children*/
	        ctx[0];

	        var _i3;

	        for (_i3 = 0; _i3 < each_value.length; _i3 += 1) {
	          var child_ctx = get_each_context$1(ctx, each_value, _i3);

	          if (each_blocks[_i3]) {
	            each_blocks[_i3].p(child_ctx, dirty);

	            transition_in(each_blocks[_i3], 1);
	          } else {
	            each_blocks[_i3] = create_each_block$1(child_ctx);

	            each_blocks[_i3].c();

	            transition_in(each_blocks[_i3], 1);

	            each_blocks[_i3].m(div, null);
	          }
	        }

	        group_outros();

	        for (_i3 = each_value.length; _i3 < each_blocks.length; _i3 += 1) {
	          out(_i3);
	        }

	        check_outros();
	      }

	      if (dirty &
	      /*expanded*/
	      4) {
	        toggle_class(div, "collapsed", !
	        /*expanded*/
	        ctx[2]);
	      }
	    },
	    i: function i(local) {
	      if (current) return;

	      for (var _i4 = 0; _i4 < each_value.length; _i4 += 1) {
	        transition_in(each_blocks[_i4]);
	      }

	      current = true;
	    },
	    o: function o(local) {
	      each_blocks = each_blocks.filter(Boolean);

	      for (var _i5 = 0; _i5 < each_blocks.length; _i5 += 1) {
	        transition_out(each_blocks[_i5]);
	      }

	      current = false;
	    },
	    d: function d(detaching) {
	      if (detaching) detach(div);
	      destroy_each(each_blocks, detaching);
	    }
	  };
	} // (79:8) {#each children as layer, i}


	function create_each_block$1(ctx) {
	  var current;
	  var layer_spread_levels = [
	  /*layer*/
	  ctx[20]];

	  function change_state_handler() {
	    var _ctx;

	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return (
	      /*change_state_handler*/
	      (_ctx = ctx)[19].apply(_ctx, [
	      /*i*/
	      ctx[22]].concat(args))
	    );
	  }

	  var layer_props = {};

	  for (var i = 0; i < layer_spread_levels.length; i += 1) {
	    layer_props = assign(layer_props, layer_spread_levels[i]);
	  }

	  var layer = new Layer({
	    props: layer_props
	  });
	  layer.$on("change:visible",
	  /*change_visible_handler*/
	  ctx[18]);
	  layer.$on("change:state", change_state_handler);
	  return {
	    c: function c() {
	      create_component(layer.$$.fragment);
	    },
	    m: function m(target, anchor) {
	      mount_component(layer, target, anchor);
	      current = true;
	    },
	    p: function p(new_ctx, dirty) {
	      ctx = new_ctx;
	      var layer_changes = dirty &
	      /*children*/
	      1 ? get_spread_update(layer_spread_levels, [get_spread_object(
	      /*layer*/
	      ctx[20])]) : {};
	      layer.$set(layer_changes);
	    },
	    i: function i(local) {
	      if (current) return;
	      transition_in(layer.$$.fragment, local);
	      current = true;
	    },
	    o: function o(local) {
	      transition_out(layer.$$.fragment, local);
	      current = false;
	    },
	    d: function d(detaching) {
	      destroy_component(layer, detaching);
	    }
	  };
	}

	function create_fragment$2(ctx) {
	  var div1;
	  var div0;
	  var i;
	  var t0;
	  var t1;
	  var t2;
	  var t3;
	  var show_if = Array.isArray(
	  /*children*/
	  ctx[0]) &&
	  /*children*/
	  ctx[0].length > 0;
	  var current;
	  var dispose;
	  var if_block0 =
	  /*hasChildren*/
	  ctx[5] && create_if_block_1(ctx);
	  var if_block1 = show_if && create_if_block(ctx);
	  return {
	    c: function c() {
	      div1 = element("div");
	      div0 = element("div");
	      i = element("i");
	      t0 = space();
	      if (if_block0) if_block0.c();
	      t1 = space();
	      t2 = text(
	      /*title*/
	      ctx[1]);
	      t3 = space();
	      if (if_block1) if_block1.c();
	      attr(i, "class", "scanex-svc-view-visible icon");
	      toggle_class(i, "check-square",
	      /*state*/
	      ctx[3] === 1);
	      toggle_class(i, "square",
	      /*state*/
	      ctx[3] === 0);
	      toggle_class(i, "minus-square",
	      /*state*/
	      ctx[3] === -1);
	      attr(div0, "class", "header");
	      attr(div1, "class", "layer");
	    },
	    m: function m(target, anchor) {
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
	      dispose = [listen(i, "click", stop_propagation(
	      /*toggleVisibility*/
	      ctx[7])), listen(div0, "mouseenter", stop_propagation(
	      /*mouseenter_handler*/
	      ctx[16])), listen(div0, "mouseleave", stop_propagation(
	      /*mouseleave_handler*/
	      ctx[17])), listen(div0, "click", stop_propagation(
	      /*toggleChildren*/
	      ctx[6]))];
	    },
	    p: function p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (dirty &
	      /*state*/
	      8) {
	        toggle_class(i, "check-square",
	        /*state*/
	        ctx[3] === 1);
	      }

	      if (dirty &
	      /*state*/
	      8) {
	        toggle_class(i, "square",
	        /*state*/
	        ctx[3] === 0);
	      }

	      if (dirty &
	      /*state*/
	      8) {
	        toggle_class(i, "minus-square",
	        /*state*/
	        ctx[3] === -1);
	      }

	      if (
	      /*hasChildren*/
	      ctx[5]) {
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

	      if (!current || dirty &
	      /*title*/
	      2) set_data(t2,
	      /*title*/
	      ctx[1]);
	      if (dirty &
	      /*children*/
	      1) show_if = Array.isArray(
	      /*children*/
	      ctx[0]) &&
	      /*children*/
	      ctx[0].length > 0;

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
	        transition_out(if_block1, 1, 1, function () {
	          if_block1 = null;
	        });
	        check_outros();
	      }
	    },
	    i: function i(local) {
	      if (current) return;
	      transition_in(if_block1);
	      current = true;
	    },
	    o: function o(local) {
	      transition_out(if_block1);
	      current = false;
	    },
	    d: function d(detaching) {
	      if (detaching) detach(div1);
	      if (if_block0) if_block0.d();
	      if (if_block1) if_block1.d();
	      run_all(dispose);
	    }
	  };
	}

	function instance$2($$self, $$props, $$invalidate) {
	  var _$$props$title = $$props.title,
	      title = _$$props$title === void 0 ? "" : _$$props$title;
	  var _$$props$name = $$props.name,
	      name = _$$props$name === void 0 ? "" : _$$props$name;
	  var _$$props$children = $$props.children,
	      children = _$$props$children === void 0 ? [] : _$$props$children;
	  var _$$props$visible = $$props.visible,
	      visible = _$$props$visible === void 0 ? false : _$$props$visible;
	  var _$$props$crs = $$props.crs,
	      crs = _$$props$crs === void 0 ? [] : _$$props$crs;
	  var width = $$props.width;
	  var height = $$props.height;
	  var exGeographicBoundingBox = $$props.exGeographicBoundingBox;
	  var expanded = false;
	  var state = 0;
	  var infoVisible = false;
	  var dispatch = createEventDispatcher();

	  function toggleChildren() {
	    $$invalidate(2, expanded = !expanded);
	  }

	  function toggleVisibility() {
	    $$invalidate(9, visible = !visible);
	    dispatch("change:visible", {
	      title: title,
	      name: name,
	      exGeographicBoundingBox: exGeographicBoundingBox,
	      width: width,
	      height: height,
	      crs: crs,
	      visible: visible
	    });
	    dispatch("change:state", {
	      title: title,
	      name: name,
	      visible: visible
	    });
	  }

	  function onChangeState(detail, i) {
	    if (hasChildren) {
	      $$invalidate(0, children[i].visible = detail.visible, children);

	      if (children.every(function (_ref3) {
	        var visible = _ref3.visible;
	        return visible === true;
	      })) {
	        $$invalidate(9, visible = true);
	      } else if (children.every(function (_ref4) {
	        var visible = _ref4.visible;
	        return visible === false;
	      })) {
	        $$invalidate(9, visible = false);
	      } else {
	        $$invalidate(9, visible = undefined);
	      }

	      dispatch("change:state", {
	        title: title,
	        name: name,
	        visible: visible
	      });
	    }
	  }

	  var mouseenter_handler = function mouseenter_handler() {
	    return $$invalidate(4, infoVisible = true);
	  };

	  var mouseleave_handler = function mouseleave_handler() {
	    return $$invalidate(4, infoVisible = false);
	  };

	  function change_visible_handler(event) {
	    bubble($$self, event);
	  }

	  var change_state_handler = function change_state_handler(i, _ref5) {
	    var detail = _ref5.detail;
	    return onChangeState(detail, i);
	  };

	  $$self.$set = function ($$props) {
	    if ("title" in $$props) $$invalidate(1, title = $$props.title);
	    if ("name" in $$props) $$invalidate(10, name = $$props.name);
	    if ("children" in $$props) $$invalidate(0, children = $$props.children);
	    if ("visible" in $$props) $$invalidate(9, visible = $$props.visible);
	    if ("crs" in $$props) $$invalidate(11, crs = $$props.crs);
	    if ("width" in $$props) $$invalidate(12, width = $$props.width);
	    if ("height" in $$props) $$invalidate(13, height = $$props.height);
	    if ("exGeographicBoundingBox" in $$props) $$invalidate(14, exGeographicBoundingBox = $$props.exGeographicBoundingBox);
	  };

	  var hasChildren;

	  $$self.$$.update = function () {
	    if ($$self.$$.dirty &
	    /*visible, children*/
	    513) {
	       {
	        if (visible === true) {
	          $$invalidate(3, state = 1);
	        } else if (visible === false) {
	          $$invalidate(3, state = 0);
	        } else {
	          $$invalidate(3, state = -1);
	        }

	        if (Array.isArray(children) && typeof visible !== "undefined") {
	          for (var i = 0; i < children.length; i++) {
	            $$invalidate(0, children[i].visible = visible, children);
	            dispatch("change:visible", _objectSpread2({}, children[i], {
	              visible: visible
	            }));
	          }
	        }
	      }
	    }

	    if ($$self.$$.dirty &
	    /*children*/
	    1) {
	       $$invalidate(5, hasChildren = Array.isArray(children) && children.length > 0);
	    }
	  };

	  return [children, title, expanded, state, infoVisible, hasChildren, toggleChildren, toggleVisibility, onChangeState, visible, name, crs, width, height, exGeographicBoundingBox, dispatch, mouseenter_handler, mouseleave_handler, change_visible_handler, change_state_handler];
	}

	var Layer =
	/*#__PURE__*/
	function (_SvelteComponent) {
	  _inherits(Layer, _SvelteComponent);

	  function Layer(options) {
	    var _this;

	    _classCallCheck(this, Layer);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(Layer).call(this));
	    init(_assertThisInitialized(_this), options, instance$2, create_fragment$2, safe_not_equal, {
	      title: 1,
	      name: 10,
	      children: 0,
	      visible: 9,
	      crs: 11,
	      width: 12,
	      height: 13,
	      exGeographicBoundingBox: 14
	    });
	    return _this;
	  }

	  return Layer;
	}(SvelteComponent);

	function get_each_context$2(ctx, list, i) {
	  var child_ctx = ctx.slice();
	  child_ctx[5] = list[i];
	  return child_ctx;
	} // (28:8) {#each layers as layer}


	function create_each_block$2(ctx) {
	  var current;
	  var layer_spread_levels = [
	  /*layer*/
	  ctx[5]];
	  var layer_props = {};

	  for (var i = 0; i < layer_spread_levels.length; i += 1) {
	    layer_props = assign(layer_props, layer_spread_levels[i]);
	  }

	  var layer = new Layer({
	    props: layer_props
	  });
	  layer.$on("change:visible",
	  /*change_visible_handler*/
	  ctx[4]);
	  return {
	    c: function c() {
	      create_component(layer.$$.fragment);
	    },
	    m: function m(target, anchor) {
	      mount_component(layer, target, anchor);
	      current = true;
	    },
	    p: function p(ctx, dirty) {
	      var layer_changes = dirty &
	      /*layers*/
	      2 ? get_spread_update(layer_spread_levels, [get_spread_object(
	      /*layer*/
	      ctx[5])]) : {};
	      layer.$set(layer_changes);
	    },
	    i: function i(local) {
	      if (current) return;
	      transition_in(layer.$$.fragment, local);
	      current = true;
	    },
	    o: function o(local) {
	      transition_out(layer.$$.fragment, local);
	      current = false;
	    },
	    d: function d(detaching) {
	      destroy_component(layer, detaching);
	    }
	  };
	}

	function create_fragment$3(ctx) {
	  var div3;
	  var div1;
	  var table;
	  var tr;
	  var td0;
	  var t1;
	  var td1;
	  var t2;
	  var t3;
	  var td2;
	  var i;
	  var t4;
	  var div2;
	  var current;
	  var dispose;
	  var each_value =
	  /*layers*/
	  ctx[1];
	  var each_blocks = [];

	  for (var _i = 0; _i < each_value.length; _i += 1) {
	    each_blocks[_i] = create_each_block$2(get_each_context$2(ctx, each_value, _i));
	  }

	  var out = function out(i) {
	    return transition_out(each_blocks[i], 1, 1, function () {
	      each_blocks[i] = null;
	    });
	  };

	  return {
	    c: function c() {
	      div3 = element("div");
	      div1 = element("div");
	      table = element("table");
	      tr = element("tr");
	      td0 = element("td");
	      td0.innerHTML = "<div class=\"service\">WMS</div>";
	      t1 = space();
	      td1 = element("td");
	      t2 = text(
	      /*title*/
	      ctx[0]);
	      t3 = space();
	      td2 = element("td");
	      i = element("i");
	      t4 = space();
	      div2 = element("div");

	      for (var _i2 = 0; _i2 < each_blocks.length; _i2 += 1) {
	        each_blocks[_i2].c();
	      }

	      attr(td1, "class", "title");
	      attr(i, "class", "icon close");
	      attr(table, "cellspacing", "0");
	      attr(table, "cellpadding", "0");
	      attr(div1, "class", "header");
	      attr(div2, "class", "content");
	      attr(div3, "class", "scanex-svc-view-link");
	    },
	    m: function m(target, anchor) {
	      insert(target, div3, anchor);
	      append(div3, div1);
	      append(div1, table);
	      append(table, tr);
	      append(tr, td0);
	      append(tr, t1);
	      append(tr, td1);
	      append(td1, t2);
	      append(tr, t3);
	      append(tr, td2);
	      append(td2, i);
	      append(div3, t4);
	      append(div3, div2);

	      for (var _i3 = 0; _i3 < each_blocks.length; _i3 += 1) {
	        each_blocks[_i3].m(div2, null);
	      }

	      current = true;
	      dispose = listen(i, "click",
	      /*click_handler*/
	      ctx[3]);
	    },
	    p: function p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (!current || dirty &
	      /*title*/
	      1) set_data(t2,
	      /*title*/
	      ctx[0]);

	      if (dirty &
	      /*layers*/
	      2) {
	        each_value =
	        /*layers*/
	        ctx[1];

	        var _i4;

	        for (_i4 = 0; _i4 < each_value.length; _i4 += 1) {
	          var child_ctx = get_each_context$2(ctx, each_value, _i4);

	          if (each_blocks[_i4]) {
	            each_blocks[_i4].p(child_ctx, dirty);

	            transition_in(each_blocks[_i4], 1);
	          } else {
	            each_blocks[_i4] = create_each_block$2(child_ctx);

	            each_blocks[_i4].c();

	            transition_in(each_blocks[_i4], 1);

	            each_blocks[_i4].m(div2, null);
	          }
	        }

	        group_outros();

	        for (_i4 = each_value.length; _i4 < each_blocks.length; _i4 += 1) {
	          out(_i4);
	        }

	        check_outros();
	      }
	    },
	    i: function i(local) {
	      if (current) return;

	      for (var _i5 = 0; _i5 < each_value.length; _i5 += 1) {
	        transition_in(each_blocks[_i5]);
	      }

	      current = true;
	    },
	    o: function o(local) {
	      each_blocks = each_blocks.filter(Boolean);

	      for (var _i6 = 0; _i6 < each_blocks.length; _i6 += 1) {
	        transition_out(each_blocks[_i6]);
	      }

	      current = false;
	    },
	    d: function d(detaching) {
	      if (detaching) detach(div3);
	      destroy_each(each_blocks, detaching);
	      dispose();
	    }
	  };
	}

	function instance$3($$self, $$props, $$invalidate) {
	  var _$$props$title = $$props.title,
	      title = _$$props$title === void 0 ? "" : _$$props$title;
	  var _$$props$layers = $$props.layers,
	      layers = _$$props$layers === void 0 ? [] : _$$props$layers;
	  var dispatch = createEventDispatcher();

	  var click_handler = function click_handler() {
	    return dispatch("close");
	  };

	  function change_visible_handler(event) {
	    bubble($$self, event);
	  }

	  $$self.$set = function ($$props) {
	    if ("title" in $$props) $$invalidate(0, title = $$props.title);
	    if ("layers" in $$props) $$invalidate(1, layers = $$props.layers);
	  };

	  return [title, layers, dispatch, click_handler, change_visible_handler];
	}

	var WMS =
	/*#__PURE__*/
	function (_SvelteComponent) {
	  _inherits(WMS, _SvelteComponent);

	  function WMS(options) {
	    var _this;

	    _classCallCheck(this, WMS);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(WMS).call(this));
	    init(_assertThisInitialized(_this), options, instance$3, create_fragment$3, safe_not_equal, {
	      title: 0,
	      layers: 1
	    });
	    return _this;
	  }

	  return WMS;
	}(SvelteComponent);

	function create_fragment$4(ctx) {
	  var div2;
	  var div0;
	  var i;
	  var t0;
	  var t1;
	  var t2;
	  var div1;
	  var input;
	  var dispose;
	  return {
	    c: function c() {
	      div2 = element("div");
	      div0 = element("div");
	      i = element("i");
	      t0 = space();
	      t1 = text(
	      /*title*/
	      ctx[0]);
	      t2 = space();
	      div1 = element("div");
	      input = element("input");
	      attr(i, "class", "icon close");
	      attr(div0, "class", "header");
	      attr(input, "type", "text");
	      attr(div1, "class", "content");
	      attr(div2, "class", "scanex-svc-view-dialog");
	    },
	    m: function m(target, anchor) {
	      insert(target, div2, anchor);
	      append(div2, div0);
	      append(div0, i);
	      append(div0, t0);
	      append(div0, t1);
	      append(div2, t2);
	      append(div2, div1);
	      append(div1, input);
	      set_input_value(input,
	      /*value*/
	      ctx[2]);
	      /*div2_binding*/

	      ctx[9](div2);
	      dispose = [listen(i, "click", stop_propagation(
	      /*click_handler*/
	      ctx[7])), listen(input, "keydown", stop_propagation(
	      /*keydown*/
	      ctx[4])), listen(input, "input",
	      /*input_input_handler*/
	      ctx[8])];
	    },
	    p: function p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (dirty &
	      /*title*/
	      1) set_data(t1,
	      /*title*/
	      ctx[0]);

	      if (dirty &
	      /*value*/
	      4 && input.value !==
	      /*value*/
	      ctx[2]) {
	        set_input_value(input,
	        /*value*/
	        ctx[2]);
	      }
	    },
	    i: noop,
	    o: noop,
	    d: function d(detaching) {
	      if (detaching) detach(div2);
	      /*div2_binding*/

	      ctx[9](null);
	      run_all(dispose);
	    }
	  };
	}

	function instance$4($$self, $$props, $$invalidate) {
	  var dispatch = createEventDispatcher();
	  var container;
	  var _$$props$title = $$props.title,
	      title = _$$props$title === void 0 ? "" : _$$props$title;
	  var _$$props$top = $$props.top,
	      top = _$$props$top === void 0 ? 0 : _$$props$top;
	  var _$$props$left = $$props.left,
	      left = _$$props$left === void 0 ? 0 : _$$props$left;
	  var value = "";

	  function keydown(e) {
	    if (e.keyCode === 13) {
	      dispatch("ok", value);
	    }
	  }

	  onMount(function () {
	    $$invalidate(1, container.style.top = "".concat(top, "px"), container);
	    $$invalidate(1, container.style.left = "".concat(left, "px"), container);
	  });

	  var click_handler = function click_handler() {
	    return dispatch("close");
	  };

	  function input_input_handler() {
	    value = this.value;
	    $$invalidate(2, value);
	  }

	  function div2_binding($$value) {
	    binding_callbacks[$$value ? "unshift" : "push"](function () {
	      $$invalidate(1, container = $$value);
	    });
	  }

	  $$self.$set = function ($$props) {
	    if ("title" in $$props) $$invalidate(0, title = $$props.title);
	    if ("top" in $$props) $$invalidate(5, top = $$props.top);
	    if ("left" in $$props) $$invalidate(6, left = $$props.left);
	  };

	  return [title, container, value, dispatch, keydown, top, left, click_handler, input_input_handler, div2_binding];
	}

	var Dialog =
	/*#__PURE__*/
	function (_SvelteComponent) {
	  _inherits(Dialog, _SvelteComponent);

	  function Dialog(options) {
	    var _this;

	    _classCallCheck(this, Dialog);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(Dialog).call(this));
	    init(_assertThisInitialized(_this), options, instance$4, create_fragment$4, safe_not_equal, {
	      title: 0,
	      top: 5,
	      left: 6
	    });
	    return _this;
	  }

	  return Dialog;
	}(SvelteComponent);

	var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	var copy = function copy(source) {
	    switch (typeof source === 'undefined' ? 'undefined' : _typeof$1(source)) {
	        case 'number':
	        case 'string':
	        case 'function':
	        default:
	            return source;
	        case 'object':
	            if (source === null) {
	                return null;
	            } else if (Array.isArray(source)) {
	                return source.map(function (item) {
	                    return copy(item);
	                });
	            } else if (source instanceof Date) {
	                return source;
	            } else {
	                return Object.keys(source).reduce(function (a, k) {
	                    a[k] = copy(source[k]);
	                    return a;
	                }, {});
	            }
	    }
	};

	var extend = function extend(target, source) {
	    if (target === source) {
	        return target;
	    } else {
	        return Object.keys(source).reduce(function (a, k) {
	            var value = source[k];
	            if (_typeof$1(a[k]) === 'object' && k in a) {
	                a[k] = extend(a[k], value);
	            } else {
	                a[k] = copy(value);
	            }
	            return a;
	        }, copy(target));
	    }
	};

	var DEFAULT_LANGUAGE = 'rus';

	var Translations = function () {
	    function Translations() {
	        classCallCheck(this, Translations);

	        this._hash = {};
	    }

	    createClass(Translations, [{
	        key: 'setLanguage',
	        value: function setLanguage(lang) {
	            this._language = lang;
	        }
	    }, {
	        key: 'getLanguage',
	        value: function getLanguage() {
	            return window.language || this._language || DEFAULT_LANGUAGE;
	        }
	    }, {
	        key: 'addText',
	        value: function addText(lang, tran) {
	            this._hash[lang] = extend(this._hash[lang] || {}, tran);
	            return this;
	        }
	    }, {
	        key: 'getText',
	        value: function getText(key) {
	            if (key && typeof key === 'string') {
	                var locale = this._hash[this.getLanguage()];
	                if (locale) {
	                    return key.split('.').reduce(function (a, k) {
	                        return a[k];
	                    }, locale);
	                }
	            }
	            return null;
	        }
	    }]);
	    return Translations;
	}();

	window.Scanex = window.Scanex || {};
	window.Scanex.Translations = window.Scanex.Translations || {};
	window.Scanex.translations = window.Scanex.translations || new Translations();

	var index$1 = window.Scanex.translations;

	var scanexTranslations_cjs = index$1;

	var serviceProxy = "//maps.kosmosnimki.ru/proxy";

	var getxml = function getxml(url) {
	  return new Promise(function (resolve, reject) {
	    try {
	      var xhr = new XMLHttpRequest();
	      xhr.addEventListener('load', function () {
	        if (xhr.status === 200) {
	          resolve(xhr.responseXML);
	        } else {
	          reject(xhr);
	        }
	      });
	      xhr.addEventListener('error', function (e) {
	        reject(e);
	      });
	      xhr.open('GET', "".concat(serviceProxy, "?").concat(encodeURIComponent(url)));
	      xhr.send();
	    } catch (e) {
	      reject(e);
	    }
	  });
	};

	function parse_node(node) {
	  var nodeName = node.nodeName,
	      localName = node.localName;
	  var r = {
	    name: nodeName,
	    localName: localName
	  };
	  var attributes = {};

	  for (var i = 0; i < node.attributes.length; ++i) {
	    var a = node.attributes[i];
	    attributes[a.name] = a.value;
	  }

	  if (Object.keys(attributes).length) {
	    r.attributes = attributes;
	  }

	  var children = [];

	  for (var _i = 0; _i < node.childNodes.length; ++_i) {
	    var n = node.childNodes[_i];

	    if (n.nodeType === 1) {
	      children.push(parse_node(n));
	    }
	  }

	  if (children.length) {
	    r.children = children;
	  } else if (node.textContent) {
	    r.value = node.textContent;
	  }

	  return r;
	}

	function parse(xml) {
	  return parse_node(xml.childNodes[0]);
	}

	var leafletSrc = createCommonjsModule(function (module, exports) {
	/* @preserve
	 * Leaflet 1.6.0, a JS library for interactive maps. http://leafletjs.com
	 * (c) 2010-2019 Vladimir Agafonkin, (c) 2010-2011 CloudMade
	 */

	(function (global, factory) {
		 factory(exports) ;
	}(commonjsGlobal, (function (exports) {
	var version = "1.6.0";

	/*
	 * @namespace Util
	 *
	 * Various utility functions, used by Leaflet internally.
	 */

	var freeze = Object.freeze;
	Object.freeze = function (obj) { return obj; };

	// @function extend(dest: Object, src?: Object): Object
	// Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `L.extend` shortcut.
	function extend(dest) {
		var i, j, len, src;

		for (j = 1, len = arguments.length; j < len; j++) {
			src = arguments[j];
			for (i in src) {
				dest[i] = src[i];
			}
		}
		return dest;
	}

	// @function create(proto: Object, properties?: Object): Object
	// Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
	var create = Object.create || (function () {
		function F() {}
		return function (proto) {
			F.prototype = proto;
			return new F();
		};
	})();

	// @function bind(fn: Function, …): Function
	// Returns a new function bound to the arguments passed, like [Function.prototype.bind](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
	// Has a `L.bind()` shortcut.
	function bind(fn, obj) {
		var slice = Array.prototype.slice;

		if (fn.bind) {
			return fn.bind.apply(fn, slice.call(arguments, 1));
		}

		var args = slice.call(arguments, 2);

		return function () {
			return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
		};
	}

	// @property lastId: Number
	// Last unique ID used by [`stamp()`](#util-stamp)
	var lastId = 0;

	// @function stamp(obj: Object): Number
	// Returns the unique ID of an object, assigning it one if it doesn't have it.
	function stamp(obj) {
		/*eslint-disable */
		obj._leaflet_id = obj._leaflet_id || ++lastId;
		return obj._leaflet_id;
		/* eslint-enable */
	}

	// @function throttle(fn: Function, time: Number, context: Object): Function
	// Returns a function which executes function `fn` with the given scope `context`
	// (so that the `this` keyword refers to `context` inside `fn`'s code). The function
	// `fn` will be called no more than one time per given amount of `time`. The arguments
	// received by the bound function will be any arguments passed when binding the
	// function, followed by any arguments passed when invoking the bound function.
	// Has an `L.throttle` shortcut.
	function throttle(fn, time, context) {
		var lock, args, wrapperFn, later;

		later = function () {
			// reset lock and call if queued
			lock = false;
			if (args) {
				wrapperFn.apply(context, args);
				args = false;
			}
		};

		wrapperFn = function () {
			if (lock) {
				// called too soon, queue to call later
				args = arguments;

			} else {
				// call and lock until later
				fn.apply(context, arguments);
				setTimeout(later, time);
				lock = true;
			}
		};

		return wrapperFn;
	}

	// @function wrapNum(num: Number, range: Number[], includeMax?: Boolean): Number
	// Returns the number `num` modulo `range` in such a way so it lies within
	// `range[0]` and `range[1]`. The returned value will be always smaller than
	// `range[1]` unless `includeMax` is set to `true`.
	function wrapNum(x, range, includeMax) {
		var max = range[1],
		    min = range[0],
		    d = max - min;
		return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
	}

	// @function falseFn(): Function
	// Returns a function which always returns `false`.
	function falseFn() { return false; }

	// @function formatNum(num: Number, digits?: Number): Number
	// Returns the number `num` rounded to `digits` decimals, or to 6 decimals by default.
	function formatNum(num, digits) {
		var pow = Math.pow(10, (digits === undefined ? 6 : digits));
		return Math.round(num * pow) / pow;
	}

	// @function trim(str: String): String
	// Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
	function trim(str) {
		return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	}

	// @function splitWords(str: String): String[]
	// Trims and splits the string on whitespace and returns the array of parts.
	function splitWords(str) {
		return trim(str).split(/\s+/);
	}

	// @function setOptions(obj: Object, options: Object): Object
	// Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
	function setOptions(obj, options) {
		if (!obj.hasOwnProperty('options')) {
			obj.options = obj.options ? create(obj.options) : {};
		}
		for (var i in options) {
			obj.options[i] = options[i];
		}
		return obj.options;
	}

	// @function getParamString(obj: Object, existingUrl?: String, uppercase?: Boolean): String
	// Converts an object into a parameter URL string, e.g. `{a: "foo", b: "bar"}`
	// translates to `'?a=foo&b=bar'`. If `existingUrl` is set, the parameters will
	// be appended at the end. If `uppercase` is `true`, the parameter names will
	// be uppercased (e.g. `'?A=foo&B=bar'`)
	function getParamString(obj, existingUrl, uppercase) {
		var params = [];
		for (var i in obj) {
			params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
		}
		return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
	}

	var templateRe = /\{ *([\w_-]+) *\}/g;

	// @function template(str: String, data: Object): String
	// Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
	// and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
	// `('Hello foo, bar')`. You can also specify functions instead of strings for
	// data values — they will be evaluated passing `data` as an argument.
	function template(str, data) {
		return str.replace(templateRe, function (str, key) {
			var value = data[key];

			if (value === undefined) {
				throw new Error('No value provided for variable ' + str);

			} else if (typeof value === 'function') {
				value = value(data);
			}
			return value;
		});
	}

	// @function isArray(obj): Boolean
	// Compatibility polyfill for [Array.isArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
	var isArray = Array.isArray || function (obj) {
		return (Object.prototype.toString.call(obj) === '[object Array]');
	};

	// @function indexOf(array: Array, el: Object): Number
	// Compatibility polyfill for [Array.prototype.indexOf](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
	function indexOf(array, el) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] === el) { return i; }
		}
		return -1;
	}

	// @property emptyImageUrl: String
	// Data URI string containing a base64-encoded empty GIF image.
	// Used as a hack to free memory from unused images on WebKit-powered
	// mobile devices (by setting image `src` to this string).
	var emptyImageUrl = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

	// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

	function getPrefixed(name) {
		return window['webkit' + name] || window['moz' + name] || window['ms' + name];
	}

	var lastTime = 0;

	// fallback for IE 7-8
	function timeoutDefer(fn) {
		var time = +new Date(),
		    timeToCall = Math.max(0, 16 - (time - lastTime));

		lastTime = time + timeToCall;
		return window.setTimeout(fn, timeToCall);
	}

	var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer;
	var cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
			getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };

	// @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
	// Schedules `fn` to be executed when the browser repaints. `fn` is bound to
	// `context` if given. When `immediate` is set, `fn` is called immediately if
	// the browser doesn't have native support for
	// [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
	// otherwise it's delayed. Returns a request ID that can be used to cancel the request.
	function requestAnimFrame(fn, context, immediate) {
		if (immediate && requestFn === timeoutDefer) {
			fn.call(context);
		} else {
			return requestFn.call(window, bind(fn, context));
		}
	}

	// @function cancelAnimFrame(id: Number): undefined
	// Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
	function cancelAnimFrame(id) {
		if (id) {
			cancelFn.call(window, id);
		}
	}


	var Util = (Object.freeze || Object)({
		freeze: freeze,
		extend: extend,
		create: create,
		bind: bind,
		lastId: lastId,
		stamp: stamp,
		throttle: throttle,
		wrapNum: wrapNum,
		falseFn: falseFn,
		formatNum: formatNum,
		trim: trim,
		splitWords: splitWords,
		setOptions: setOptions,
		getParamString: getParamString,
		template: template,
		isArray: isArray,
		indexOf: indexOf,
		emptyImageUrl: emptyImageUrl,
		requestFn: requestFn,
		cancelFn: cancelFn,
		requestAnimFrame: requestAnimFrame,
		cancelAnimFrame: cancelAnimFrame
	});

	// @class Class
	// @aka L.Class

	// @section
	// @uninheritable

	// Thanks to John Resig and Dean Edwards for inspiration!

	function Class() {}

	Class.extend = function (props) {

		// @function extend(props: Object): Function
		// [Extends the current class](#class-inheritance) given the properties to be included.
		// Returns a Javascript function that is a class constructor (to be called with `new`).
		var NewClass = function () {

			// call the constructor
			if (this.initialize) {
				this.initialize.apply(this, arguments);
			}

			// call all constructor hooks
			this.callInitHooks();
		};

		var parentProto = NewClass.__super__ = this.prototype;

		var proto = create(parentProto);
		proto.constructor = NewClass;

		NewClass.prototype = proto;

		// inherit parent's statics
		for (var i in this) {
			if (this.hasOwnProperty(i) && i !== 'prototype' && i !== '__super__') {
				NewClass[i] = this[i];
			}
		}

		// mix static properties into the class
		if (props.statics) {
			extend(NewClass, props.statics);
			delete props.statics;
		}

		// mix includes into the prototype
		if (props.includes) {
			checkDeprecatedMixinEvents(props.includes);
			extend.apply(null, [proto].concat(props.includes));
			delete props.includes;
		}

		// merge options
		if (proto.options) {
			props.options = extend(create(proto.options), props.options);
		}

		// mix given properties into the prototype
		extend(proto, props);

		proto._initHooks = [];

		// add method for calling all hooks
		proto.callInitHooks = function () {

			if (this._initHooksCalled) { return; }

			if (parentProto.callInitHooks) {
				parentProto.callInitHooks.call(this);
			}

			this._initHooksCalled = true;

			for (var i = 0, len = proto._initHooks.length; i < len; i++) {
				proto._initHooks[i].call(this);
			}
		};

		return NewClass;
	};


	// @function include(properties: Object): this
	// [Includes a mixin](#class-includes) into the current class.
	Class.include = function (props) {
		extend(this.prototype, props);
		return this;
	};

	// @function mergeOptions(options: Object): this
	// [Merges `options`](#class-options) into the defaults of the class.
	Class.mergeOptions = function (options) {
		extend(this.prototype.options, options);
		return this;
	};

	// @function addInitHook(fn: Function): this
	// Adds a [constructor hook](#class-constructor-hooks) to the class.
	Class.addInitHook = function (fn) { // (Function) || (String, args...)
		var args = Array.prototype.slice.call(arguments, 1);

		var init = typeof fn === 'function' ? fn : function () {
			this[fn].apply(this, args);
		};

		this.prototype._initHooks = this.prototype._initHooks || [];
		this.prototype._initHooks.push(init);
		return this;
	};

	function checkDeprecatedMixinEvents(includes) {
		if (typeof L === 'undefined' || !L || !L.Mixin) { return; }

		includes = isArray(includes) ? includes : [includes];

		for (var i = 0; i < includes.length; i++) {
			if (includes[i] === L.Mixin.Events) {
				console.warn('Deprecated include of L.Mixin.Events: ' +
					'this property will be removed in future releases, ' +
					'please inherit from L.Evented instead.', new Error().stack);
			}
		}
	}

	/*
	 * @class Evented
	 * @aka L.Evented
	 * @inherits Class
	 *
	 * A set of methods shared between event-powered classes (like `Map` and `Marker`). Generally, events allow you to execute some function when something happens with an object (e.g. the user clicks on the map, causing the map to fire `'click'` event).
	 *
	 * @example
	 *
	 * ```js
	 * map.on('click', function(e) {
	 * 	alert(e.latlng);
	 * } );
	 * ```
	 *
	 * Leaflet deals with event listeners by reference, so if you want to add a listener and then remove it, define it as a function:
	 *
	 * ```js
	 * function onClick(e) { ... }
	 *
	 * map.on('click', onClick);
	 * map.off('click', onClick);
	 * ```
	 */

	var Events = {
		/* @method on(type: String, fn: Function, context?: Object): this
		 * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
		 *
		 * @alternative
		 * @method on(eventMap: Object): this
		 * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
		 */
		on: function (types, fn, context) {

			// types can be a map of types/handlers
			if (typeof types === 'object') {
				for (var type in types) {
					// we don't process space-separated events here for performance;
					// it's a hot path since Layer uses the on(obj) syntax
					this._on(type, types[type], fn);
				}

			} else {
				// types can be a string of space-separated words
				types = splitWords(types);

				for (var i = 0, len = types.length; i < len; i++) {
					this._on(types[i], fn, context);
				}
			}

			return this;
		},

		/* @method off(type: String, fn?: Function, context?: Object): this
		 * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
		 *
		 * @alternative
		 * @method off(eventMap: Object): this
		 * Removes a set of type/listener pairs.
		 *
		 * @alternative
		 * @method off: this
		 * Removes all listeners to all events on the object. This includes implicitly attached events.
		 */
		off: function (types, fn, context) {

			if (!types) {
				// clear all listeners if called without arguments
				delete this._events;

			} else if (typeof types === 'object') {
				for (var type in types) {
					this._off(type, types[type], fn);
				}

			} else {
				types = splitWords(types);

				for (var i = 0, len = types.length; i < len; i++) {
					this._off(types[i], fn, context);
				}
			}

			return this;
		},

		// attach listener (without syntactic sugar now)
		_on: function (type, fn, context) {
			this._events = this._events || {};

			/* get/init listeners for type */
			var typeListeners = this._events[type];
			if (!typeListeners) {
				typeListeners = [];
				this._events[type] = typeListeners;
			}

			if (context === this) {
				// Less memory footprint.
				context = undefined;
			}
			var newListener = {fn: fn, ctx: context},
			    listeners = typeListeners;

			// check if fn already there
			for (var i = 0, len = listeners.length; i < len; i++) {
				if (listeners[i].fn === fn && listeners[i].ctx === context) {
					return;
				}
			}

			listeners.push(newListener);
		},

		_off: function (type, fn, context) {
			var listeners,
			    i,
			    len;

			if (!this._events) { return; }

			listeners = this._events[type];

			if (!listeners) {
				return;
			}

			if (!fn) {
				// Set all removed listeners to noop so they are not called if remove happens in fire
				for (i = 0, len = listeners.length; i < len; i++) {
					listeners[i].fn = falseFn;
				}
				// clear all listeners for a type if function isn't specified
				delete this._events[type];
				return;
			}

			if (context === this) {
				context = undefined;
			}

			if (listeners) {

				// find fn and remove it
				for (i = 0, len = listeners.length; i < len; i++) {
					var l = listeners[i];
					if (l.ctx !== context) { continue; }
					if (l.fn === fn) {

						// set the removed listener to noop so that's not called if remove happens in fire
						l.fn = falseFn;

						if (this._firingCount) {
							/* copy array in case events are being fired */
							this._events[type] = listeners = listeners.slice();
						}
						listeners.splice(i, 1);

						return;
					}
				}
			}
		},

		// @method fire(type: String, data?: Object, propagate?: Boolean): this
		// Fires an event of the specified type. You can optionally provide an data
		// object — the first argument of the listener function will contain its
		// properties. The event can optionally be propagated to event parents.
		fire: function (type, data, propagate) {
			if (!this.listens(type, propagate)) { return this; }

			var event = extend({}, data, {
				type: type,
				target: this,
				sourceTarget: data && data.sourceTarget || this
			});

			if (this._events) {
				var listeners = this._events[type];

				if (listeners) {
					this._firingCount = (this._firingCount + 1) || 1;
					for (var i = 0, len = listeners.length; i < len; i++) {
						var l = listeners[i];
						l.fn.call(l.ctx || this, event);
					}

					this._firingCount--;
				}
			}

			if (propagate) {
				// propagate the event to parents (set with addEventParent)
				this._propagateEvent(event);
			}

			return this;
		},

		// @method listens(type: String): Boolean
		// Returns `true` if a particular event type has any listeners attached to it.
		listens: function (type, propagate) {
			var listeners = this._events && this._events[type];
			if (listeners && listeners.length) { return true; }

			if (propagate) {
				// also check parents for listeners if event propagates
				for (var id in this._eventParents) {
					if (this._eventParents[id].listens(type, propagate)) { return true; }
				}
			}
			return false;
		},

		// @method once(…): this
		// Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
		once: function (types, fn, context) {

			if (typeof types === 'object') {
				for (var type in types) {
					this.once(type, types[type], fn);
				}
				return this;
			}

			var handler = bind(function () {
				this
				    .off(types, fn, context)
				    .off(types, handler, context);
			}, this);

			// add a listener that's executed once and removed after that
			return this
			    .on(types, fn, context)
			    .on(types, handler, context);
		},

		// @method addEventParent(obj: Evented): this
		// Adds an event parent - an `Evented` that will receive propagated events
		addEventParent: function (obj) {
			this._eventParents = this._eventParents || {};
			this._eventParents[stamp(obj)] = obj;
			return this;
		},

		// @method removeEventParent(obj: Evented): this
		// Removes an event parent, so it will stop receiving propagated events
		removeEventParent: function (obj) {
			if (this._eventParents) {
				delete this._eventParents[stamp(obj)];
			}
			return this;
		},

		_propagateEvent: function (e) {
			for (var id in this._eventParents) {
				this._eventParents[id].fire(e.type, extend({
					layer: e.target,
					propagatedFrom: e.target
				}, e), true);
			}
		}
	};

	// aliases; we should ditch those eventually

	// @method addEventListener(…): this
	// Alias to [`on(…)`](#evented-on)
	Events.addEventListener = Events.on;

	// @method removeEventListener(…): this
	// Alias to [`off(…)`](#evented-off)

	// @method clearAllEventListeners(…): this
	// Alias to [`off()`](#evented-off)
	Events.removeEventListener = Events.clearAllEventListeners = Events.off;

	// @method addOneTimeEventListener(…): this
	// Alias to [`once(…)`](#evented-once)
	Events.addOneTimeEventListener = Events.once;

	// @method fireEvent(…): this
	// Alias to [`fire(…)`](#evented-fire)
	Events.fireEvent = Events.fire;

	// @method hasEventListeners(…): Boolean
	// Alias to [`listens(…)`](#evented-listens)
	Events.hasEventListeners = Events.listens;

	var Evented = Class.extend(Events);

	/*
	 * @class Point
	 * @aka L.Point
	 *
	 * Represents a point with `x` and `y` coordinates in pixels.
	 *
	 * @example
	 *
	 * ```js
	 * var point = L.point(200, 300);
	 * ```
	 *
	 * All Leaflet methods and options that accept `Point` objects also accept them in a simple Array form (unless noted otherwise), so these lines are equivalent:
	 *
	 * ```js
	 * map.panBy([200, 300]);
	 * map.panBy(L.point(200, 300));
	 * ```
	 *
	 * Note that `Point` does not inherit from Leafet's `Class` object,
	 * which means new classes can't inherit from it, and new methods
	 * can't be added to it with the `include` function.
	 */

	function Point(x, y, round) {
		// @property x: Number; The `x` coordinate of the point
		this.x = (round ? Math.round(x) : x);
		// @property y: Number; The `y` coordinate of the point
		this.y = (round ? Math.round(y) : y);
	}

	var trunc = Math.trunc || function (v) {
		return v > 0 ? Math.floor(v) : Math.ceil(v);
	};

	Point.prototype = {

		// @method clone(): Point
		// Returns a copy of the current point.
		clone: function () {
			return new Point(this.x, this.y);
		},

		// @method add(otherPoint: Point): Point
		// Returns the result of addition of the current and the given points.
		add: function (point) {
			// non-destructive, returns a new point
			return this.clone()._add(toPoint(point));
		},

		_add: function (point) {
			// destructive, used directly for performance in situations where it's safe to modify existing point
			this.x += point.x;
			this.y += point.y;
			return this;
		},

		// @method subtract(otherPoint: Point): Point
		// Returns the result of subtraction of the given point from the current.
		subtract: function (point) {
			return this.clone()._subtract(toPoint(point));
		},

		_subtract: function (point) {
			this.x -= point.x;
			this.y -= point.y;
			return this;
		},

		// @method divideBy(num: Number): Point
		// Returns the result of division of the current point by the given number.
		divideBy: function (num) {
			return this.clone()._divideBy(num);
		},

		_divideBy: function (num) {
			this.x /= num;
			this.y /= num;
			return this;
		},

		// @method multiplyBy(num: Number): Point
		// Returns the result of multiplication of the current point by the given number.
		multiplyBy: function (num) {
			return this.clone()._multiplyBy(num);
		},

		_multiplyBy: function (num) {
			this.x *= num;
			this.y *= num;
			return this;
		},

		// @method scaleBy(scale: Point): Point
		// Multiply each coordinate of the current point by each coordinate of
		// `scale`. In linear algebra terms, multiply the point by the
		// [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
		// defined by `scale`.
		scaleBy: function (point) {
			return new Point(this.x * point.x, this.y * point.y);
		},

		// @method unscaleBy(scale: Point): Point
		// Inverse of `scaleBy`. Divide each coordinate of the current point by
		// each coordinate of `scale`.
		unscaleBy: function (point) {
			return new Point(this.x / point.x, this.y / point.y);
		},

		// @method round(): Point
		// Returns a copy of the current point with rounded coordinates.
		round: function () {
			return this.clone()._round();
		},

		_round: function () {
			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			return this;
		},

		// @method floor(): Point
		// Returns a copy of the current point with floored coordinates (rounded down).
		floor: function () {
			return this.clone()._floor();
		},

		_floor: function () {
			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			return this;
		},

		// @method ceil(): Point
		// Returns a copy of the current point with ceiled coordinates (rounded up).
		ceil: function () {
			return this.clone()._ceil();
		},

		_ceil: function () {
			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);
			return this;
		},

		// @method trunc(): Point
		// Returns a copy of the current point with truncated coordinates (rounded towards zero).
		trunc: function () {
			return this.clone()._trunc();
		},

		_trunc: function () {
			this.x = trunc(this.x);
			this.y = trunc(this.y);
			return this;
		},

		// @method distanceTo(otherPoint: Point): Number
		// Returns the cartesian distance between the current and the given points.
		distanceTo: function (point) {
			point = toPoint(point);

			var x = point.x - this.x,
			    y = point.y - this.y;

			return Math.sqrt(x * x + y * y);
		},

		// @method equals(otherPoint: Point): Boolean
		// Returns `true` if the given point has the same coordinates.
		equals: function (point) {
			point = toPoint(point);

			return point.x === this.x &&
			       point.y === this.y;
		},

		// @method contains(otherPoint: Point): Boolean
		// Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
		contains: function (point) {
			point = toPoint(point);

			return Math.abs(point.x) <= Math.abs(this.x) &&
			       Math.abs(point.y) <= Math.abs(this.y);
		},

		// @method toString(): String
		// Returns a string representation of the point for debugging purposes.
		toString: function () {
			return 'Point(' +
			        formatNum(this.x) + ', ' +
			        formatNum(this.y) + ')';
		}
	};

	// @factory L.point(x: Number, y: Number, round?: Boolean)
	// Creates a Point object with the given `x` and `y` coordinates. If optional `round` is set to true, rounds the `x` and `y` values.

	// @alternative
	// @factory L.point(coords: Number[])
	// Expects an array of the form `[x, y]` instead.

	// @alternative
	// @factory L.point(coords: Object)
	// Expects a plain object of the form `{x: Number, y: Number}` instead.
	function toPoint(x, y, round) {
		if (x instanceof Point) {
			return x;
		}
		if (isArray(x)) {
			return new Point(x[0], x[1]);
		}
		if (x === undefined || x === null) {
			return x;
		}
		if (typeof x === 'object' && 'x' in x && 'y' in x) {
			return new Point(x.x, x.y);
		}
		return new Point(x, y, round);
	}

	/*
	 * @class Bounds
	 * @aka L.Bounds
	 *
	 * Represents a rectangular area in pixel coordinates.
	 *
	 * @example
	 *
	 * ```js
	 * var p1 = L.point(10, 10),
	 * p2 = L.point(40, 60),
	 * bounds = L.bounds(p1, p2);
	 * ```
	 *
	 * All Leaflet methods that accept `Bounds` objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
	 *
	 * ```js
	 * otherBounds.intersects([[10, 10], [40, 60]]);
	 * ```
	 *
	 * Note that `Bounds` does not inherit from Leafet's `Class` object,
	 * which means new classes can't inherit from it, and new methods
	 * can't be added to it with the `include` function.
	 */

	function Bounds(a, b) {
		if (!a) { return; }

		var points = b ? [a, b] : a;

		for (var i = 0, len = points.length; i < len; i++) {
			this.extend(points[i]);
		}
	}

	Bounds.prototype = {
		// @method extend(point: Point): this
		// Extends the bounds to contain the given point.
		extend: function (point) { // (Point)
			point = toPoint(point);

			// @property min: Point
			// The top left corner of the rectangle.
			// @property max: Point
			// The bottom right corner of the rectangle.
			if (!this.min && !this.max) {
				this.min = point.clone();
				this.max = point.clone();
			} else {
				this.min.x = Math.min(point.x, this.min.x);
				this.max.x = Math.max(point.x, this.max.x);
				this.min.y = Math.min(point.y, this.min.y);
				this.max.y = Math.max(point.y, this.max.y);
			}
			return this;
		},

		// @method getCenter(round?: Boolean): Point
		// Returns the center point of the bounds.
		getCenter: function (round) {
			return new Point(
			        (this.min.x + this.max.x) / 2,
			        (this.min.y + this.max.y) / 2, round);
		},

		// @method getBottomLeft(): Point
		// Returns the bottom-left point of the bounds.
		getBottomLeft: function () {
			return new Point(this.min.x, this.max.y);
		},

		// @method getTopRight(): Point
		// Returns the top-right point of the bounds.
		getTopRight: function () { // -> Point
			return new Point(this.max.x, this.min.y);
		},

		// @method getTopLeft(): Point
		// Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
		getTopLeft: function () {
			return this.min; // left, top
		},

		// @method getBottomRight(): Point
		// Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
		getBottomRight: function () {
			return this.max; // right, bottom
		},

		// @method getSize(): Point
		// Returns the size of the given bounds
		getSize: function () {
			return this.max.subtract(this.min);
		},

		// @method contains(otherBounds: Bounds): Boolean
		// Returns `true` if the rectangle contains the given one.
		// @alternative
		// @method contains(point: Point): Boolean
		// Returns `true` if the rectangle contains the given point.
		contains: function (obj) {
			var min, max;

			if (typeof obj[0] === 'number' || obj instanceof Point) {
				obj = toPoint(obj);
			} else {
				obj = toBounds(obj);
			}

			if (obj instanceof Bounds) {
				min = obj.min;
				max = obj.max;
			} else {
				min = max = obj;
			}

			return (min.x >= this.min.x) &&
			       (max.x <= this.max.x) &&
			       (min.y >= this.min.y) &&
			       (max.y <= this.max.y);
		},

		// @method intersects(otherBounds: Bounds): Boolean
		// Returns `true` if the rectangle intersects the given bounds. Two bounds
		// intersect if they have at least one point in common.
		intersects: function (bounds) { // (Bounds) -> Boolean
			bounds = toBounds(bounds);

			var min = this.min,
			    max = this.max,
			    min2 = bounds.min,
			    max2 = bounds.max,
			    xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
			    yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

			return xIntersects && yIntersects;
		},

		// @method overlaps(otherBounds: Bounds): Boolean
		// Returns `true` if the rectangle overlaps the given bounds. Two bounds
		// overlap if their intersection is an area.
		overlaps: function (bounds) { // (Bounds) -> Boolean
			bounds = toBounds(bounds);

			var min = this.min,
			    max = this.max,
			    min2 = bounds.min,
			    max2 = bounds.max,
			    xOverlaps = (max2.x > min.x) && (min2.x < max.x),
			    yOverlaps = (max2.y > min.y) && (min2.y < max.y);

			return xOverlaps && yOverlaps;
		},

		isValid: function () {
			return !!(this.min && this.max);
		}
	};


	// @factory L.bounds(corner1: Point, corner2: Point)
	// Creates a Bounds object from two corners coordinate pairs.
	// @alternative
	// @factory L.bounds(points: Point[])
	// Creates a Bounds object from the given array of points.
	function toBounds(a, b) {
		if (!a || a instanceof Bounds) {
			return a;
		}
		return new Bounds(a, b);
	}

	/*
	 * @class LatLngBounds
	 * @aka L.LatLngBounds
	 *
	 * Represents a rectangular geographical area on a map.
	 *
	 * @example
	 *
	 * ```js
	 * var corner1 = L.latLng(40.712, -74.227),
	 * corner2 = L.latLng(40.774, -74.125),
	 * bounds = L.latLngBounds(corner1, corner2);
	 * ```
	 *
	 * All Leaflet methods that accept LatLngBounds objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
	 *
	 * ```js
	 * map.fitBounds([
	 * 	[40.712, -74.227],
	 * 	[40.774, -74.125]
	 * ]);
	 * ```
	 *
	 * Caution: if the area crosses the antimeridian (often confused with the International Date Line), you must specify corners _outside_ the [-180, 180] degrees longitude range.
	 *
	 * Note that `LatLngBounds` does not inherit from Leafet's `Class` object,
	 * which means new classes can't inherit from it, and new methods
	 * can't be added to it with the `include` function.
	 */

	function LatLngBounds(corner1, corner2) { // (LatLng, LatLng) or (LatLng[])
		if (!corner1) { return; }

		var latlngs = corner2 ? [corner1, corner2] : corner1;

		for (var i = 0, len = latlngs.length; i < len; i++) {
			this.extend(latlngs[i]);
		}
	}

	LatLngBounds.prototype = {

		// @method extend(latlng: LatLng): this
		// Extend the bounds to contain the given point

		// @alternative
		// @method extend(otherBounds: LatLngBounds): this
		// Extend the bounds to contain the given bounds
		extend: function (obj) {
			var sw = this._southWest,
			    ne = this._northEast,
			    sw2, ne2;

			if (obj instanceof LatLng) {
				sw2 = obj;
				ne2 = obj;

			} else if (obj instanceof LatLngBounds) {
				sw2 = obj._southWest;
				ne2 = obj._northEast;

				if (!sw2 || !ne2) { return this; }

			} else {
				return obj ? this.extend(toLatLng(obj) || toLatLngBounds(obj)) : this;
			}

			if (!sw && !ne) {
				this._southWest = new LatLng(sw2.lat, sw2.lng);
				this._northEast = new LatLng(ne2.lat, ne2.lng);
			} else {
				sw.lat = Math.min(sw2.lat, sw.lat);
				sw.lng = Math.min(sw2.lng, sw.lng);
				ne.lat = Math.max(ne2.lat, ne.lat);
				ne.lng = Math.max(ne2.lng, ne.lng);
			}

			return this;
		},

		// @method pad(bufferRatio: Number): LatLngBounds
		// Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
		// For example, a ratio of 0.5 extends the bounds by 50% in each direction.
		// Negative values will retract the bounds.
		pad: function (bufferRatio) {
			var sw = this._southWest,
			    ne = this._northEast,
			    heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
			    widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

			return new LatLngBounds(
			        new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
			        new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
		},

		// @method getCenter(): LatLng
		// Returns the center point of the bounds.
		getCenter: function () {
			return new LatLng(
			        (this._southWest.lat + this._northEast.lat) / 2,
			        (this._southWest.lng + this._northEast.lng) / 2);
		},

		// @method getSouthWest(): LatLng
		// Returns the south-west point of the bounds.
		getSouthWest: function () {
			return this._southWest;
		},

		// @method getNorthEast(): LatLng
		// Returns the north-east point of the bounds.
		getNorthEast: function () {
			return this._northEast;
		},

		// @method getNorthWest(): LatLng
		// Returns the north-west point of the bounds.
		getNorthWest: function () {
			return new LatLng(this.getNorth(), this.getWest());
		},

		// @method getSouthEast(): LatLng
		// Returns the south-east point of the bounds.
		getSouthEast: function () {
			return new LatLng(this.getSouth(), this.getEast());
		},

		// @method getWest(): Number
		// Returns the west longitude of the bounds
		getWest: function () {
			return this._southWest.lng;
		},

		// @method getSouth(): Number
		// Returns the south latitude of the bounds
		getSouth: function () {
			return this._southWest.lat;
		},

		// @method getEast(): Number
		// Returns the east longitude of the bounds
		getEast: function () {
			return this._northEast.lng;
		},

		// @method getNorth(): Number
		// Returns the north latitude of the bounds
		getNorth: function () {
			return this._northEast.lat;
		},

		// @method contains(otherBounds: LatLngBounds): Boolean
		// Returns `true` if the rectangle contains the given one.

		// @alternative
		// @method contains (latlng: LatLng): Boolean
		// Returns `true` if the rectangle contains the given point.
		contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
			if (typeof obj[0] === 'number' || obj instanceof LatLng || 'lat' in obj) {
				obj = toLatLng(obj);
			} else {
				obj = toLatLngBounds(obj);
			}

			var sw = this._southWest,
			    ne = this._northEast,
			    sw2, ne2;

			if (obj instanceof LatLngBounds) {
				sw2 = obj.getSouthWest();
				ne2 = obj.getNorthEast();
			} else {
				sw2 = ne2 = obj;
			}

			return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
			       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
		},

		// @method intersects(otherBounds: LatLngBounds): Boolean
		// Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
		intersects: function (bounds) {
			bounds = toLatLngBounds(bounds);

			var sw = this._southWest,
			    ne = this._northEast,
			    sw2 = bounds.getSouthWest(),
			    ne2 = bounds.getNorthEast(),

			    latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
			    lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

			return latIntersects && lngIntersects;
		},

		// @method overlaps(otherBounds: Bounds): Boolean
		// Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
		overlaps: function (bounds) {
			bounds = toLatLngBounds(bounds);

			var sw = this._southWest,
			    ne = this._northEast,
			    sw2 = bounds.getSouthWest(),
			    ne2 = bounds.getNorthEast(),

			    latOverlaps = (ne2.lat > sw.lat) && (sw2.lat < ne.lat),
			    lngOverlaps = (ne2.lng > sw.lng) && (sw2.lng < ne.lng);

			return latOverlaps && lngOverlaps;
		},

		// @method toBBoxString(): String
		// Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
		toBBoxString: function () {
			return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
		},

		// @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
		// Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
		equals: function (bounds, maxMargin) {
			if (!bounds) { return false; }

			bounds = toLatLngBounds(bounds);

			return this._southWest.equals(bounds.getSouthWest(), maxMargin) &&
			       this._northEast.equals(bounds.getNorthEast(), maxMargin);
		},

		// @method isValid(): Boolean
		// Returns `true` if the bounds are properly initialized.
		isValid: function () {
			return !!(this._southWest && this._northEast);
		}
	};

	// TODO International date line?

	// @factory L.latLngBounds(corner1: LatLng, corner2: LatLng)
	// Creates a `LatLngBounds` object by defining two diagonally opposite corners of the rectangle.

	// @alternative
	// @factory L.latLngBounds(latlngs: LatLng[])
	// Creates a `LatLngBounds` object defined by the geographical points it contains. Very useful for zooming the map to fit a particular set of locations with [`fitBounds`](#map-fitbounds).
	function toLatLngBounds(a, b) {
		if (a instanceof LatLngBounds) {
			return a;
		}
		return new LatLngBounds(a, b);
	}

	/* @class LatLng
	 * @aka L.LatLng
	 *
	 * Represents a geographical point with a certain latitude and longitude.
	 *
	 * @example
	 *
	 * ```
	 * var latlng = L.latLng(50.5, 30.5);
	 * ```
	 *
	 * All Leaflet methods that accept LatLng objects also accept them in a simple Array form and simple object form (unless noted otherwise), so these lines are equivalent:
	 *
	 * ```
	 * map.panTo([50, 30]);
	 * map.panTo({lon: 30, lat: 50});
	 * map.panTo({lat: 50, lng: 30});
	 * map.panTo(L.latLng(50, 30));
	 * ```
	 *
	 * Note that `LatLng` does not inherit from Leaflet's `Class` object,
	 * which means new classes can't inherit from it, and new methods
	 * can't be added to it with the `include` function.
	 */

	function LatLng(lat, lng, alt) {
		if (isNaN(lat) || isNaN(lng)) {
			throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
		}

		// @property lat: Number
		// Latitude in degrees
		this.lat = +lat;

		// @property lng: Number
		// Longitude in degrees
		this.lng = +lng;

		// @property alt: Number
		// Altitude in meters (optional)
		if (alt !== undefined) {
			this.alt = +alt;
		}
	}

	LatLng.prototype = {
		// @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
		// Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
		equals: function (obj, maxMargin) {
			if (!obj) { return false; }

			obj = toLatLng(obj);

			var margin = Math.max(
			        Math.abs(this.lat - obj.lat),
			        Math.abs(this.lng - obj.lng));

			return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
		},

		// @method toString(): String
		// Returns a string representation of the point (for debugging purposes).
		toString: function (precision) {
			return 'LatLng(' +
			        formatNum(this.lat, precision) + ', ' +
			        formatNum(this.lng, precision) + ')';
		},

		// @method distanceTo(otherLatLng: LatLng): Number
		// Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
		distanceTo: function (other) {
			return Earth.distance(this, toLatLng(other));
		},

		// @method wrap(): LatLng
		// Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
		wrap: function () {
			return Earth.wrapLatLng(this);
		},

		// @method toBounds(sizeInMeters: Number): LatLngBounds
		// Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
		toBounds: function (sizeInMeters) {
			var latAccuracy = 180 * sizeInMeters / 40075017,
			    lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

			return toLatLngBounds(
			        [this.lat - latAccuracy, this.lng - lngAccuracy],
			        [this.lat + latAccuracy, this.lng + lngAccuracy]);
		},

		clone: function () {
			return new LatLng(this.lat, this.lng, this.alt);
		}
	};



	// @factory L.latLng(latitude: Number, longitude: Number, altitude?: Number): LatLng
	// Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).

	// @alternative
	// @factory L.latLng(coords: Array): LatLng
	// Expects an array of the form `[Number, Number]` or `[Number, Number, Number]` instead.

	// @alternative
	// @factory L.latLng(coords: Object): LatLng
	// Expects an plain object of the form `{lat: Number, lng: Number}` or `{lat: Number, lng: Number, alt: Number}` instead.

	function toLatLng(a, b, c) {
		if (a instanceof LatLng) {
			return a;
		}
		if (isArray(a) && typeof a[0] !== 'object') {
			if (a.length === 3) {
				return new LatLng(a[0], a[1], a[2]);
			}
			if (a.length === 2) {
				return new LatLng(a[0], a[1]);
			}
			return null;
		}
		if (a === undefined || a === null) {
			return a;
		}
		if (typeof a === 'object' && 'lat' in a) {
			return new LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
		}
		if (b === undefined) {
			return null;
		}
		return new LatLng(a, b, c);
	}

	/*
	 * @namespace CRS
	 * @crs L.CRS.Base
	 * Object that defines coordinate reference systems for projecting
	 * geographical points into pixel (screen) coordinates and back (and to
	 * coordinates in other units for [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services). See
	 * [spatial reference system](http://en.wikipedia.org/wiki/Coordinate_reference_system).
	 *
	 * Leaflet defines the most usual CRSs by default. If you want to use a
	 * CRS not defined by default, take a look at the
	 * [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet) plugin.
	 *
	 * Note that the CRS instances do not inherit from Leafet's `Class` object,
	 * and can't be instantiated. Also, new classes can't inherit from them,
	 * and methods can't be added to them with the `include` function.
	 */

	var CRS = {
		// @method latLngToPoint(latlng: LatLng, zoom: Number): Point
		// Projects geographical coordinates into pixel coordinates for a given zoom.
		latLngToPoint: function (latlng, zoom) {
			var projectedPoint = this.projection.project(latlng),
			    scale = this.scale(zoom);

			return this.transformation._transform(projectedPoint, scale);
		},

		// @method pointToLatLng(point: Point, zoom: Number): LatLng
		// The inverse of `latLngToPoint`. Projects pixel coordinates on a given
		// zoom into geographical coordinates.
		pointToLatLng: function (point, zoom) {
			var scale = this.scale(zoom),
			    untransformedPoint = this.transformation.untransform(point, scale);

			return this.projection.unproject(untransformedPoint);
		},

		// @method project(latlng: LatLng): Point
		// Projects geographical coordinates into coordinates in units accepted for
		// this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
		project: function (latlng) {
			return this.projection.project(latlng);
		},

		// @method unproject(point: Point): LatLng
		// Given a projected coordinate returns the corresponding LatLng.
		// The inverse of `project`.
		unproject: function (point) {
			return this.projection.unproject(point);
		},

		// @method scale(zoom: Number): Number
		// Returns the scale used when transforming projected coordinates into
		// pixel coordinates for a particular zoom. For example, it returns
		// `256 * 2^zoom` for Mercator-based CRS.
		scale: function (zoom) {
			return 256 * Math.pow(2, zoom);
		},

		// @method zoom(scale: Number): Number
		// Inverse of `scale()`, returns the zoom level corresponding to a scale
		// factor of `scale`.
		zoom: function (scale) {
			return Math.log(scale / 256) / Math.LN2;
		},

		// @method getProjectedBounds(zoom: Number): Bounds
		// Returns the projection's bounds scaled and transformed for the provided `zoom`.
		getProjectedBounds: function (zoom) {
			if (this.infinite) { return null; }

			var b = this.projection.bounds,
			    s = this.scale(zoom),
			    min = this.transformation.transform(b.min, s),
			    max = this.transformation.transform(b.max, s);

			return new Bounds(min, max);
		},

		// @method distance(latlng1: LatLng, latlng2: LatLng): Number
		// Returns the distance between two geographical coordinates.

		// @property code: String
		// Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
		//
		// @property wrapLng: Number[]
		// An array of two numbers defining whether the longitude (horizontal) coordinate
		// axis wraps around a given range and how. Defaults to `[-180, 180]` in most
		// geographical CRSs. If `undefined`, the longitude axis does not wrap around.
		//
		// @property wrapLat: Number[]
		// Like `wrapLng`, but for the latitude (vertical) axis.

		// wrapLng: [min, max],
		// wrapLat: [min, max],

		// @property infinite: Boolean
		// If true, the coordinate space will be unbounded (infinite in both axes)
		infinite: false,

		// @method wrapLatLng(latlng: LatLng): LatLng
		// Returns a `LatLng` where lat and lng has been wrapped according to the
		// CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
		wrapLatLng: function (latlng) {
			var lng = this.wrapLng ? wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
			    lat = this.wrapLat ? wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat,
			    alt = latlng.alt;

			return new LatLng(lat, lng, alt);
		},

		// @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
		// Returns a `LatLngBounds` with the same size as the given one, ensuring
		// that its center is within the CRS's bounds.
		// Only accepts actual `L.LatLngBounds` instances, not arrays.
		wrapLatLngBounds: function (bounds) {
			var center = bounds.getCenter(),
			    newCenter = this.wrapLatLng(center),
			    latShift = center.lat - newCenter.lat,
			    lngShift = center.lng - newCenter.lng;

			if (latShift === 0 && lngShift === 0) {
				return bounds;
			}

			var sw = bounds.getSouthWest(),
			    ne = bounds.getNorthEast(),
			    newSw = new LatLng(sw.lat - latShift, sw.lng - lngShift),
			    newNe = new LatLng(ne.lat - latShift, ne.lng - lngShift);

			return new LatLngBounds(newSw, newNe);
		}
	};

	/*
	 * @namespace CRS
	 * @crs L.CRS.Earth
	 *
	 * Serves as the base for CRS that are global such that they cover the earth.
	 * Can only be used as the base for other CRS and cannot be used directly,
	 * since it does not have a `code`, `projection` or `transformation`. `distance()` returns
	 * meters.
	 */

	var Earth = extend({}, CRS, {
		wrapLng: [-180, 180],

		// Mean Earth Radius, as recommended for use by
		// the International Union of Geodesy and Geophysics,
		// see http://rosettacode.org/wiki/Haversine_formula
		R: 6371000,

		// distance between two geographical points using spherical law of cosines approximation
		distance: function (latlng1, latlng2) {
			var rad = Math.PI / 180,
			    lat1 = latlng1.lat * rad,
			    lat2 = latlng2.lat * rad,
			    sinDLat = Math.sin((latlng2.lat - latlng1.lat) * rad / 2),
			    sinDLon = Math.sin((latlng2.lng - latlng1.lng) * rad / 2),
			    a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon,
			    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			return this.R * c;
		}
	});

	/*
	 * @namespace Projection
	 * @projection L.Projection.SphericalMercator
	 *
	 * Spherical Mercator projection — the most common projection for online maps,
	 * used by almost all free and commercial tile providers. Assumes that Earth is
	 * a sphere. Used by the `EPSG:3857` CRS.
	 */

	var earthRadius = 6378137;

	var SphericalMercator = {

		R: earthRadius,
		MAX_LATITUDE: 85.0511287798,

		project: function (latlng) {
			var d = Math.PI / 180,
			    max = this.MAX_LATITUDE,
			    lat = Math.max(Math.min(max, latlng.lat), -max),
			    sin = Math.sin(lat * d);

			return new Point(
				this.R * latlng.lng * d,
				this.R * Math.log((1 + sin) / (1 - sin)) / 2);
		},

		unproject: function (point) {
			var d = 180 / Math.PI;

			return new LatLng(
				(2 * Math.atan(Math.exp(point.y / this.R)) - (Math.PI / 2)) * d,
				point.x * d / this.R);
		},

		bounds: (function () {
			var d = earthRadius * Math.PI;
			return new Bounds([-d, -d], [d, d]);
		})()
	};

	/*
	 * @class Transformation
	 * @aka L.Transformation
	 *
	 * Represents an affine transformation: a set of coefficients `a`, `b`, `c`, `d`
	 * for transforming a point of a form `(x, y)` into `(a*x + b, c*y + d)` and doing
	 * the reverse. Used by Leaflet in its projections code.
	 *
	 * @example
	 *
	 * ```js
	 * var transformation = L.transformation(2, 5, -1, 10),
	 * 	p = L.point(1, 2),
	 * 	p2 = transformation.transform(p), //  L.point(7, 8)
	 * 	p3 = transformation.untransform(p2); //  L.point(1, 2)
	 * ```
	 */


	// factory new L.Transformation(a: Number, b: Number, c: Number, d: Number)
	// Creates a `Transformation` object with the given coefficients.
	function Transformation(a, b, c, d) {
		if (isArray(a)) {
			// use array properties
			this._a = a[0];
			this._b = a[1];
			this._c = a[2];
			this._d = a[3];
			return;
		}
		this._a = a;
		this._b = b;
		this._c = c;
		this._d = d;
	}

	Transformation.prototype = {
		// @method transform(point: Point, scale?: Number): Point
		// Returns a transformed point, optionally multiplied by the given scale.
		// Only accepts actual `L.Point` instances, not arrays.
		transform: function (point, scale) { // (Point, Number) -> Point
			return this._transform(point.clone(), scale);
		},

		// destructive transform (faster)
		_transform: function (point, scale) {
			scale = scale || 1;
			point.x = scale * (this._a * point.x + this._b);
			point.y = scale * (this._c * point.y + this._d);
			return point;
		},

		// @method untransform(point: Point, scale?: Number): Point
		// Returns the reverse transformation of the given point, optionally divided
		// by the given scale. Only accepts actual `L.Point` instances, not arrays.
		untransform: function (point, scale) {
			scale = scale || 1;
			return new Point(
			        (point.x / scale - this._b) / this._a,
			        (point.y / scale - this._d) / this._c);
		}
	};

	// factory L.transformation(a: Number, b: Number, c: Number, d: Number)

	// @factory L.transformation(a: Number, b: Number, c: Number, d: Number)
	// Instantiates a Transformation object with the given coefficients.

	// @alternative
	// @factory L.transformation(coefficients: Array): Transformation
	// Expects an coefficients array of the form
	// `[a: Number, b: Number, c: Number, d: Number]`.

	function toTransformation(a, b, c, d) {
		return new Transformation(a, b, c, d);
	}

	/*
	 * @namespace CRS
	 * @crs L.CRS.EPSG3857
	 *
	 * The most common CRS for online maps, used by almost all free and commercial
	 * tile providers. Uses Spherical Mercator projection. Set in by default in
	 * Map's `crs` option.
	 */

	var EPSG3857 = extend({}, Earth, {
		code: 'EPSG:3857',
		projection: SphericalMercator,

		transformation: (function () {
			var scale = 0.5 / (Math.PI * SphericalMercator.R);
			return toTransformation(scale, 0.5, -scale, 0.5);
		}())
	});

	var EPSG900913 = extend({}, EPSG3857, {
		code: 'EPSG:900913'
	});

	// @namespace SVG; @section
	// There are several static functions which can be called without instantiating L.SVG:

	// @function create(name: String): SVGElement
	// Returns a instance of [SVGElement](https://developer.mozilla.org/docs/Web/API/SVGElement),
	// corresponding to the class name passed. For example, using 'line' will return
	// an instance of [SVGLineElement](https://developer.mozilla.org/docs/Web/API/SVGLineElement).
	function svgCreate(name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
	}

	// @function pointsToPath(rings: Point[], closed: Boolean): String
	// Generates a SVG path string for multiple rings, with each ring turning
	// into "M..L..L.." instructions
	function pointsToPath(rings, closed) {
		var str = '',
		i, j, len, len2, points, p;

		for (i = 0, len = rings.length; i < len; i++) {
			points = rings[i];

			for (j = 0, len2 = points.length; j < len2; j++) {
				p = points[j];
				str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
			}

			// closes the ring for polygons; "x" is VML syntax
			str += closed ? (svg ? 'z' : 'x') : '';
		}

		// SVG complains about empty path strings
		return str || 'M0 0';
	}

	/*
	 * @namespace Browser
	 * @aka L.Browser
	 *
	 * A namespace with static properties for browser/feature detection used by Leaflet internally.
	 *
	 * @example
	 *
	 * ```js
	 * if (L.Browser.ielt9) {
	 *   alert('Upgrade your browser, dude!');
	 * }
	 * ```
	 */

	var style$1 = document.documentElement.style;

	// @property ie: Boolean; `true` for all Internet Explorer versions (not Edge).
	var ie = 'ActiveXObject' in window;

	// @property ielt9: Boolean; `true` for Internet Explorer versions less than 9.
	var ielt9 = ie && !document.addEventListener;

	// @property edge: Boolean; `true` for the Edge web browser.
	var edge = 'msLaunchUri' in navigator && !('documentMode' in document);

	// @property webkit: Boolean;
	// `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
	var webkit = userAgentContains('webkit');

	// @property android: Boolean
	// `true` for any browser running on an Android platform.
	var android = userAgentContains('android');

	// @property android23: Boolean; `true` for browsers running on Android 2 or Android 3.
	var android23 = userAgentContains('android 2') || userAgentContains('android 3');

	/* See https://stackoverflow.com/a/17961266 for details on detecting stock Android */
	var webkitVer = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10); // also matches AppleWebKit
	// @property androidStock: Boolean; `true` for the Android stock browser (i.e. not Chrome)
	var androidStock = android && userAgentContains('Google') && webkitVer < 537 && !('AudioNode' in window);

	// @property opera: Boolean; `true` for the Opera browser
	var opera = !!window.opera;

	// @property chrome: Boolean; `true` for the Chrome browser.
	var chrome = userAgentContains('chrome');

	// @property gecko: Boolean; `true` for gecko-based browsers like Firefox.
	var gecko = userAgentContains('gecko') && !webkit && !opera && !ie;

	// @property safari: Boolean; `true` for the Safari browser.
	var safari = !chrome && userAgentContains('safari');

	var phantom = userAgentContains('phantom');

	// @property opera12: Boolean
	// `true` for the Opera browser supporting CSS transforms (version 12 or later).
	var opera12 = 'OTransition' in style$1;

	// @property win: Boolean; `true` when the browser is running in a Windows platform
	var win = navigator.platform.indexOf('Win') === 0;

	// @property ie3d: Boolean; `true` for all Internet Explorer versions supporting CSS transforms.
	var ie3d = ie && ('transition' in style$1);

	// @property webkit3d: Boolean; `true` for webkit-based browsers supporting CSS transforms.
	var webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23;

	// @property gecko3d: Boolean; `true` for gecko-based browsers supporting CSS transforms.
	var gecko3d = 'MozPerspective' in style$1;

	// @property any3d: Boolean
	// `true` for all browsers supporting CSS transforms.
	var any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantom;

	// @property mobile: Boolean; `true` for all browsers running in a mobile device.
	var mobile = typeof orientation !== 'undefined' || userAgentContains('mobile');

	// @property mobileWebkit: Boolean; `true` for all webkit-based browsers in a mobile device.
	var mobileWebkit = mobile && webkit;

	// @property mobileWebkit3d: Boolean
	// `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
	var mobileWebkit3d = mobile && webkit3d;

	// @property msPointer: Boolean
	// `true` for browsers implementing the Microsoft touch events model (notably IE10).
	var msPointer = !window.PointerEvent && window.MSPointerEvent;

	// @property pointer: Boolean
	// `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
	var pointer = !webkit && !!(window.PointerEvent || msPointer);

	// @property touch: Boolean
	// `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
	// This does not necessarily mean that the browser is running in a computer with
	// a touchscreen, it only means that the browser is capable of understanding
	// touch events.
	var touch = !window.L_NO_TOUCH && (pointer || 'ontouchstart' in window ||
			(window.DocumentTouch && document instanceof window.DocumentTouch));

	// @property mobileOpera: Boolean; `true` for the Opera browser in a mobile device.
	var mobileOpera = mobile && opera;

	// @property mobileGecko: Boolean
	// `true` for gecko-based browsers running in a mobile device.
	var mobileGecko = mobile && gecko;

	// @property retina: Boolean
	// `true` for browsers on a high-resolution "retina" screen or on any screen when browser's display zoom is more than 100%.
	var retina = (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1;

	// @property passiveEvents: Boolean
	// `true` for browsers that support passive events.
	var passiveEvents = (function () {
		var supportsPassiveOption = false;
		try {
			var opts = Object.defineProperty({}, 'passive', {
				get: function () {
					supportsPassiveOption = true;
				}
			});
			window.addEventListener('testPassiveEventSupport', falseFn, opts);
			window.removeEventListener('testPassiveEventSupport', falseFn, opts);
		} catch (e) {
			// Errors can safely be ignored since this is only a browser support test.
		}
		return supportsPassiveOption;
	});

	// @property canvas: Boolean
	// `true` when the browser supports [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
	var canvas = (function () {
		return !!document.createElement('canvas').getContext;
	}());

	// @property svg: Boolean
	// `true` when the browser supports [SVG](https://developer.mozilla.org/docs/Web/SVG).
	var svg = !!(document.createElementNS && svgCreate('svg').createSVGRect);

	// @property vml: Boolean
	// `true` if the browser supports [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language).
	var vml = !svg && (function () {
		try {
			var div = document.createElement('div');
			div.innerHTML = '<v:shape adj="1"/>';

			var shape = div.firstChild;
			shape.style.behavior = 'url(#default#VML)';

			return shape && (typeof shape.adj === 'object');

		} catch (e) {
			return false;
		}
	}());


	function userAgentContains(str) {
		return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
	}


	var Browser = (Object.freeze || Object)({
		ie: ie,
		ielt9: ielt9,
		edge: edge,
		webkit: webkit,
		android: android,
		android23: android23,
		androidStock: androidStock,
		opera: opera,
		chrome: chrome,
		gecko: gecko,
		safari: safari,
		phantom: phantom,
		opera12: opera12,
		win: win,
		ie3d: ie3d,
		webkit3d: webkit3d,
		gecko3d: gecko3d,
		any3d: any3d,
		mobile: mobile,
		mobileWebkit: mobileWebkit,
		mobileWebkit3d: mobileWebkit3d,
		msPointer: msPointer,
		pointer: pointer,
		touch: touch,
		mobileOpera: mobileOpera,
		mobileGecko: mobileGecko,
		retina: retina,
		passiveEvents: passiveEvents,
		canvas: canvas,
		svg: svg,
		vml: vml
	});

	/*
	 * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
	 */


	var POINTER_DOWN =   msPointer ? 'MSPointerDown'   : 'pointerdown';
	var POINTER_MOVE =   msPointer ? 'MSPointerMove'   : 'pointermove';
	var POINTER_UP =     msPointer ? 'MSPointerUp'     : 'pointerup';
	var POINTER_CANCEL = msPointer ? 'MSPointerCancel' : 'pointercancel';
	var TAG_WHITE_LIST = ['INPUT', 'SELECT', 'OPTION'];

	var _pointers = {};
	var _pointerDocListener = false;

	// DomEvent.DoubleTap needs to know about this
	var _pointersCount = 0;

	// Provides a touch events wrapper for (ms)pointer events.
	// ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

	function addPointerListener(obj, type, handler, id) {
		if (type === 'touchstart') {
			_addPointerStart(obj, handler, id);

		} else if (type === 'touchmove') {
			_addPointerMove(obj, handler, id);

		} else if (type === 'touchend') {
			_addPointerEnd(obj, handler, id);
		}

		return this;
	}

	function removePointerListener(obj, type, id) {
		var handler = obj['_leaflet_' + type + id];

		if (type === 'touchstart') {
			obj.removeEventListener(POINTER_DOWN, handler, false);

		} else if (type === 'touchmove') {
			obj.removeEventListener(POINTER_MOVE, handler, false);

		} else if (type === 'touchend') {
			obj.removeEventListener(POINTER_UP, handler, false);
			obj.removeEventListener(POINTER_CANCEL, handler, false);
		}

		return this;
	}

	function _addPointerStart(obj, handler, id) {
		var onDown = bind(function (e) {
			if (e.pointerType !== 'mouse' && e.MSPOINTER_TYPE_MOUSE && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
				// In IE11, some touch events needs to fire for form controls, or
				// the controls will stop working. We keep a whitelist of tag names that
				// need these events. For other target tags, we prevent default on the event.
				if (TAG_WHITE_LIST.indexOf(e.target.tagName) < 0) {
					preventDefault(e);
				} else {
					return;
				}
			}

			_handlePointer(e, handler);
		});

		obj['_leaflet_touchstart' + id] = onDown;
		obj.addEventListener(POINTER_DOWN, onDown, false);

		// need to keep track of what pointers and how many are active to provide e.touches emulation
		if (!_pointerDocListener) {
			// we listen documentElement as any drags that end by moving the touch off the screen get fired there
			document.documentElement.addEventListener(POINTER_DOWN, _globalPointerDown, true);
			document.documentElement.addEventListener(POINTER_MOVE, _globalPointerMove, true);
			document.documentElement.addEventListener(POINTER_UP, _globalPointerUp, true);
			document.documentElement.addEventListener(POINTER_CANCEL, _globalPointerUp, true);

			_pointerDocListener = true;
		}
	}

	function _globalPointerDown(e) {
		_pointers[e.pointerId] = e;
		_pointersCount++;
	}

	function _globalPointerMove(e) {
		if (_pointers[e.pointerId]) {
			_pointers[e.pointerId] = e;
		}
	}

	function _globalPointerUp(e) {
		delete _pointers[e.pointerId];
		_pointersCount--;
	}

	function _handlePointer(e, handler) {
		e.touches = [];
		for (var i in _pointers) {
			e.touches.push(_pointers[i]);
		}
		e.changedTouches = [e];

		handler(e);
	}

	function _addPointerMove(obj, handler, id) {
		var onMove = function (e) {
			// don't fire touch moves when mouse isn't down
			if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === 'mouse') && e.buttons === 0) { return; }

			_handlePointer(e, handler);
		};

		obj['_leaflet_touchmove' + id] = onMove;
		obj.addEventListener(POINTER_MOVE, onMove, false);
	}

	function _addPointerEnd(obj, handler, id) {
		var onUp = function (e) {
			_handlePointer(e, handler);
		};

		obj['_leaflet_touchend' + id] = onUp;
		obj.addEventListener(POINTER_UP, onUp, false);
		obj.addEventListener(POINTER_CANCEL, onUp, false);
	}

	/*
	 * Extends the event handling code with double tap support for mobile browsers.
	 */

	var _touchstart = msPointer ? 'MSPointerDown' : pointer ? 'pointerdown' : 'touchstart';
	var _touchend = msPointer ? 'MSPointerUp' : pointer ? 'pointerup' : 'touchend';
	var _pre = '_leaflet_';

	// inspired by Zepto touch code by Thomas Fuchs
	function addDoubleTapListener(obj, handler, id) {
		var last, touch$$1,
		    doubleTap = false,
		    delay = 250;

		function onTouchStart(e) {
			var count;

			if (pointer) {
				if ((!edge) || e.pointerType === 'mouse') { return; }
				count = _pointersCount;
			} else {
				count = e.touches.length;
			}

			if (count > 1) { return; }

			var now = Date.now(),
			    delta = now - (last || now);

			touch$$1 = e.touches ? e.touches[0] : e;
			doubleTap = (delta > 0 && delta <= delay);
			last = now;
		}

		function onTouchEnd(e) {
			if (doubleTap && !touch$$1.cancelBubble) {
				if (pointer) {
					if ((!edge) || e.pointerType === 'mouse') { return; }
					// work around .type being readonly with MSPointer* events
					var newTouch = {},
					    prop, i;

					for (i in touch$$1) {
						prop = touch$$1[i];
						newTouch[i] = prop && prop.bind ? prop.bind(touch$$1) : prop;
					}
					touch$$1 = newTouch;
				}
				touch$$1.type = 'dblclick';
				touch$$1.button = 0;
				handler(touch$$1);
				last = null;
			}
		}

		obj[_pre + _touchstart + id] = onTouchStart;
		obj[_pre + _touchend + id] = onTouchEnd;
		obj[_pre + 'dblclick' + id] = handler;

		obj.addEventListener(_touchstart, onTouchStart, passiveEvents ? {passive: false} : false);
		obj.addEventListener(_touchend, onTouchEnd, passiveEvents ? {passive: false} : false);

		// On some platforms (notably, chrome<55 on win10 + touchscreen + mouse),
		// the browser doesn't fire touchend/pointerup events but does fire
		// native dblclicks. See #4127.
		// Edge 14 also fires native dblclicks, but only for pointerType mouse, see #5180.
		obj.addEventListener('dblclick', handler, false);

		return this;
	}

	function removeDoubleTapListener(obj, id) {
		var touchstart = obj[_pre + _touchstart + id],
		    touchend = obj[_pre + _touchend + id],
		    dblclick = obj[_pre + 'dblclick' + id];

		obj.removeEventListener(_touchstart, touchstart, passiveEvents ? {passive: false} : false);
		obj.removeEventListener(_touchend, touchend, passiveEvents ? {passive: false} : false);
		if (!edge) {
			obj.removeEventListener('dblclick', dblclick, false);
		}

		return this;
	}

	/*
	 * @namespace DomUtil
	 *
	 * Utility functions to work with the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
	 * tree, used by Leaflet internally.
	 *
	 * Most functions expecting or returning a `HTMLElement` also work for
	 * SVG elements. The only difference is that classes refer to CSS classes
	 * in HTML and SVG classes in SVG.
	 */


	// @property TRANSFORM: String
	// Vendor-prefixed transform style name (e.g. `'webkitTransform'` for WebKit).
	var TRANSFORM = testProp(
		['transform', 'webkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

	// webkitTransition comes first because some browser versions that drop vendor prefix don't do
	// the same for the transitionend event, in particular the Android 4.1 stock browser

	// @property TRANSITION: String
	// Vendor-prefixed transition style name.
	var TRANSITION = testProp(
		['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

	// @property TRANSITION_END: String
	// Vendor-prefixed transitionend event name.
	var TRANSITION_END =
		TRANSITION === 'webkitTransition' || TRANSITION === 'OTransition' ? TRANSITION + 'End' : 'transitionend';


	// @function get(id: String|HTMLElement): HTMLElement
	// Returns an element given its DOM id, or returns the element itself
	// if it was passed directly.
	function get(id) {
		return typeof id === 'string' ? document.getElementById(id) : id;
	}

	// @function getStyle(el: HTMLElement, styleAttrib: String): String
	// Returns the value for a certain style attribute on an element,
	// including computed values or values set through CSS.
	function getStyle(el, style) {
		var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

		if ((!value || value === 'auto') && document.defaultView) {
			var css = document.defaultView.getComputedStyle(el, null);
			value = css ? css[style] : null;
		}
		return value === 'auto' ? null : value;
	}

	// @function create(tagName: String, className?: String, container?: HTMLElement): HTMLElement
	// Creates an HTML element with `tagName`, sets its class to `className`, and optionally appends it to `container` element.
	function create$1(tagName, className, container) {
		var el = document.createElement(tagName);
		el.className = className || '';

		if (container) {
			container.appendChild(el);
		}
		return el;
	}

	// @function remove(el: HTMLElement)
	// Removes `el` from its parent element
	function remove(el) {
		var parent = el.parentNode;
		if (parent) {
			parent.removeChild(el);
		}
	}

	// @function empty(el: HTMLElement)
	// Removes all of `el`'s children elements from `el`
	function empty(el) {
		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}
	}

	// @function toFront(el: HTMLElement)
	// Makes `el` the last child of its parent, so it renders in front of the other children.
	function toFront(el) {
		var parent = el.parentNode;
		if (parent && parent.lastChild !== el) {
			parent.appendChild(el);
		}
	}

	// @function toBack(el: HTMLElement)
	// Makes `el` the first child of its parent, so it renders behind the other children.
	function toBack(el) {
		var parent = el.parentNode;
		if (parent && parent.firstChild !== el) {
			parent.insertBefore(el, parent.firstChild);
		}
	}

	// @function hasClass(el: HTMLElement, name: String): Boolean
	// Returns `true` if the element's class attribute contains `name`.
	function hasClass(el, name) {
		if (el.classList !== undefined) {
			return el.classList.contains(name);
		}
		var className = getClass(el);
		return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
	}

	// @function addClass(el: HTMLElement, name: String)
	// Adds `name` to the element's class attribute.
	function addClass(el, name) {
		if (el.classList !== undefined) {
			var classes = splitWords(name);
			for (var i = 0, len = classes.length; i < len; i++) {
				el.classList.add(classes[i]);
			}
		} else if (!hasClass(el, name)) {
			var className = getClass(el);
			setClass(el, (className ? className + ' ' : '') + name);
		}
	}

	// @function removeClass(el: HTMLElement, name: String)
	// Removes `name` from the element's class attribute.
	function removeClass(el, name) {
		if (el.classList !== undefined) {
			el.classList.remove(name);
		} else {
			setClass(el, trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
		}
	}

	// @function setClass(el: HTMLElement, name: String)
	// Sets the element's class.
	function setClass(el, name) {
		if (el.className.baseVal === undefined) {
			el.className = name;
		} else {
			// in case of SVG element
			el.className.baseVal = name;
		}
	}

	// @function getClass(el: HTMLElement): String
	// Returns the element's class.
	function getClass(el) {
		// Check if the element is an SVGElementInstance and use the correspondingElement instead
		// (Required for linked SVG elements in IE11.)
		if (el.correspondingElement) {
			el = el.correspondingElement;
		}
		return el.className.baseVal === undefined ? el.className : el.className.baseVal;
	}

	// @function setOpacity(el: HTMLElement, opacity: Number)
	// Set the opacity of an element (including old IE support).
	// `opacity` must be a number from `0` to `1`.
	function setOpacity(el, value) {
		if ('opacity' in el.style) {
			el.style.opacity = value;
		} else if ('filter' in el.style) {
			_setOpacityIE(el, value);
		}
	}

	function _setOpacityIE(el, value) {
		var filter = false,
		    filterName = 'DXImageTransform.Microsoft.Alpha';

		// filters collection throws an error if we try to retrieve a filter that doesn't exist
		try {
			filter = el.filters.item(filterName);
		} catch (e) {
			// don't set opacity to 1 if we haven't already set an opacity,
			// it isn't needed and breaks transparent pngs.
			if (value === 1) { return; }
		}

		value = Math.round(value * 100);

		if (filter) {
			filter.Enabled = (value !== 100);
			filter.Opacity = value;
		} else {
			el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
		}
	}

	// @function testProp(props: String[]): String|false
	// Goes through the array of style names and returns the first name
	// that is a valid style name for an element. If no such name is found,
	// it returns false. Useful for vendor-prefixed styles like `transform`.
	function testProp(props) {
		var style = document.documentElement.style;

		for (var i = 0; i < props.length; i++) {
			if (props[i] in style) {
				return props[i];
			}
		}
		return false;
	}

	// @function setTransform(el: HTMLElement, offset: Point, scale?: Number)
	// Resets the 3D CSS transform of `el` so it is translated by `offset` pixels
	// and optionally scaled by `scale`. Does not have an effect if the
	// browser doesn't support 3D CSS transforms.
	function setTransform(el, offset, scale) {
		var pos = offset || new Point(0, 0);

		el.style[TRANSFORM] =
			(ie3d ?
				'translate(' + pos.x + 'px,' + pos.y + 'px)' :
				'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
			(scale ? ' scale(' + scale + ')' : '');
	}

	// @function setPosition(el: HTMLElement, position: Point)
	// Sets the position of `el` to coordinates specified by `position`,
	// using CSS translate or top/left positioning depending on the browser
	// (used by Leaflet internally to position its layers).
	function setPosition(el, point) {

		/*eslint-disable */
		el._leaflet_pos = point;
		/* eslint-enable */

		if (any3d) {
			setTransform(el, point);
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	}

	// @function getPosition(el: HTMLElement): Point
	// Returns the coordinates of an element previously positioned with setPosition.
	function getPosition(el) {
		// this method is only used for elements previously positioned using setPosition,
		// so it's safe to cache the position for performance

		return el._leaflet_pos || new Point(0, 0);
	}

	// @function disableTextSelection()
	// Prevents the user from generating `selectstart` DOM events, usually generated
	// when the user drags the mouse through a page with text. Used internally
	// by Leaflet to override the behaviour of any click-and-drag interaction on
	// the map. Affects drag interactions on the whole document.

	// @function enableTextSelection()
	// Cancels the effects of a previous [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection).
	var disableTextSelection;
	var enableTextSelection;
	var _userSelect;
	if ('onselectstart' in document) {
		disableTextSelection = function () {
			on(window, 'selectstart', preventDefault);
		};
		enableTextSelection = function () {
			off(window, 'selectstart', preventDefault);
		};
	} else {
		var userSelectProperty = testProp(
			['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

		disableTextSelection = function () {
			if (userSelectProperty) {
				var style = document.documentElement.style;
				_userSelect = style[userSelectProperty];
				style[userSelectProperty] = 'none';
			}
		};
		enableTextSelection = function () {
			if (userSelectProperty) {
				document.documentElement.style[userSelectProperty] = _userSelect;
				_userSelect = undefined;
			}
		};
	}

	// @function disableImageDrag()
	// As [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection), but
	// for `dragstart` DOM events, usually generated when the user drags an image.
	function disableImageDrag() {
		on(window, 'dragstart', preventDefault);
	}

	// @function enableImageDrag()
	// Cancels the effects of a previous [`L.DomUtil.disableImageDrag`](#domutil-disabletextselection).
	function enableImageDrag() {
		off(window, 'dragstart', preventDefault);
	}

	var _outlineElement;
	var _outlineStyle;
	// @function preventOutline(el: HTMLElement)
	// Makes the [outline](https://developer.mozilla.org/docs/Web/CSS/outline)
	// of the element `el` invisible. Used internally by Leaflet to prevent
	// focusable elements from displaying an outline when the user performs a
	// drag interaction on them.
	function preventOutline(element) {
		while (element.tabIndex === -1) {
			element = element.parentNode;
		}
		if (!element.style) { return; }
		restoreOutline();
		_outlineElement = element;
		_outlineStyle = element.style.outline;
		element.style.outline = 'none';
		on(window, 'keydown', restoreOutline);
	}

	// @function restoreOutline()
	// Cancels the effects of a previous [`L.DomUtil.preventOutline`]().
	function restoreOutline() {
		if (!_outlineElement) { return; }
		_outlineElement.style.outline = _outlineStyle;
		_outlineElement = undefined;
		_outlineStyle = undefined;
		off(window, 'keydown', restoreOutline);
	}

	// @function getSizedParentNode(el: HTMLElement): HTMLElement
	// Finds the closest parent node which size (width and height) is not null.
	function getSizedParentNode(element) {
		do {
			element = element.parentNode;
		} while ((!element.offsetWidth || !element.offsetHeight) && element !== document.body);
		return element;
	}

	// @function getScale(el: HTMLElement): Object
	// Computes the CSS scale currently applied on the element.
	// Returns an object with `x` and `y` members as horizontal and vertical scales respectively,
	// and `boundingClientRect` as the result of [`getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).
	function getScale(element) {
		var rect = element.getBoundingClientRect(); // Read-only in old browsers.

		return {
			x: rect.width / element.offsetWidth || 1,
			y: rect.height / element.offsetHeight || 1,
			boundingClientRect: rect
		};
	}


	var DomUtil = (Object.freeze || Object)({
		TRANSFORM: TRANSFORM,
		TRANSITION: TRANSITION,
		TRANSITION_END: TRANSITION_END,
		get: get,
		getStyle: getStyle,
		create: create$1,
		remove: remove,
		empty: empty,
		toFront: toFront,
		toBack: toBack,
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		setClass: setClass,
		getClass: getClass,
		setOpacity: setOpacity,
		testProp: testProp,
		setTransform: setTransform,
		setPosition: setPosition,
		getPosition: getPosition,
		disableTextSelection: disableTextSelection,
		enableTextSelection: enableTextSelection,
		disableImageDrag: disableImageDrag,
		enableImageDrag: enableImageDrag,
		preventOutline: preventOutline,
		restoreOutline: restoreOutline,
		getSizedParentNode: getSizedParentNode,
		getScale: getScale
	});

	/*
	 * @namespace DomEvent
	 * Utility functions to work with the [DOM events](https://developer.mozilla.org/docs/Web/API/Event), used by Leaflet internally.
	 */

	// Inspired by John Resig, Dean Edwards and YUI addEvent implementations.

	// @function on(el: HTMLElement, types: String, fn: Function, context?: Object): this
	// Adds a listener function (`fn`) to a particular DOM event type of the
	// element `el`. You can optionally specify the context of the listener
	// (object the `this` keyword will point to). You can also pass several
	// space-separated types (e.g. `'click dblclick'`).

	// @alternative
	// @function on(el: HTMLElement, eventMap: Object, context?: Object): this
	// Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
	function on(obj, types, fn, context) {

		if (typeof types === 'object') {
			for (var type in types) {
				addOne(obj, type, types[type], fn);
			}
		} else {
			types = splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				addOne(obj, types[i], fn, context);
			}
		}

		return this;
	}

	var eventsKey = '_leaflet_events';

	// @function off(el: HTMLElement, types: String, fn: Function, context?: Object): this
	// Removes a previously added listener function.
	// Note that if you passed a custom context to on, you must pass the same
	// context to `off` in order to remove the listener.

	// @alternative
	// @function off(el: HTMLElement, eventMap: Object, context?: Object): this
	// Removes a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
	function off(obj, types, fn, context) {

		if (typeof types === 'object') {
			for (var type in types) {
				removeOne(obj, type, types[type], fn);
			}
		} else if (types) {
			types = splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				removeOne(obj, types[i], fn, context);
			}
		} else {
			for (var j in obj[eventsKey]) {
				removeOne(obj, j, obj[eventsKey][j]);
			}
			delete obj[eventsKey];
		}

		return this;
	}

	function addOne(obj, type, fn, context) {
		var id = type + stamp(fn) + (context ? '_' + stamp(context) : '');

		if (obj[eventsKey] && obj[eventsKey][id]) { return this; }

		var handler = function (e) {
			return fn.call(context || obj, e || window.event);
		};

		var originalHandler = handler;

		if (pointer && type.indexOf('touch') === 0) {
			// Needs DomEvent.Pointer.js
			addPointerListener(obj, type, handler, id);

		} else if (touch && (type === 'dblclick') && addDoubleTapListener &&
		           !(pointer && chrome)) {
			// Chrome >55 does not need the synthetic dblclicks from addDoubleTapListener
			// See #5180
			addDoubleTapListener(obj, handler, id);

		} else if ('addEventListener' in obj) {

			if (type === 'mousewheel') {
				obj.addEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, passiveEvents ? {passive: false} : false);

			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				handler = function (e) {
					e = e || window.event;
					if (isExternalTarget(obj, e)) {
						originalHandler(e);
					}
				};
				obj.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);

			} else {
				if (type === 'click' && android) {
					handler = function (e) {
						filterClick(e, originalHandler);
					};
				}
				obj.addEventListener(type, handler, false);
			}

		} else if ('attachEvent' in obj) {
			obj.attachEvent('on' + type, handler);
		}

		obj[eventsKey] = obj[eventsKey] || {};
		obj[eventsKey][id] = handler;
	}

	function removeOne(obj, type, fn, context) {

		var id = type + stamp(fn) + (context ? '_' + stamp(context) : ''),
		    handler = obj[eventsKey] && obj[eventsKey][id];

		if (!handler) { return this; }

		if (pointer && type.indexOf('touch') === 0) {
			removePointerListener(obj, type, id);

		} else if (touch && (type === 'dblclick') && removeDoubleTapListener &&
		           !(pointer && chrome)) {
			removeDoubleTapListener(obj, id);

		} else if ('removeEventListener' in obj) {

			if (type === 'mousewheel') {
				obj.removeEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, passiveEvents ? {passive: false} : false);

			} else {
				obj.removeEventListener(
					type === 'mouseenter' ? 'mouseover' :
					type === 'mouseleave' ? 'mouseout' : type, handler, false);
			}

		} else if ('detachEvent' in obj) {
			obj.detachEvent('on' + type, handler);
		}

		obj[eventsKey][id] = null;
	}

	// @function stopPropagation(ev: DOMEvent): this
	// Stop the given event from propagation to parent elements. Used inside the listener functions:
	// ```js
	// L.DomEvent.on(div, 'click', function (ev) {
	// 	L.DomEvent.stopPropagation(ev);
	// });
	// ```
	function stopPropagation(e) {

		if (e.stopPropagation) {
			e.stopPropagation();
		} else if (e.originalEvent) {  // In case of Leaflet event.
			e.originalEvent._stopped = true;
		} else {
			e.cancelBubble = true;
		}
		skipped(e);

		return this;
	}

	// @function disableScrollPropagation(el: HTMLElement): this
	// Adds `stopPropagation` to the element's `'mousewheel'` events (plus browser variants).
	function disableScrollPropagation(el) {
		addOne(el, 'mousewheel', stopPropagation);
		return this;
	}

	// @function disableClickPropagation(el: HTMLElement): this
	// Adds `stopPropagation` to the element's `'click'`, `'doubleclick'`,
	// `'mousedown'` and `'touchstart'` events (plus browser variants).
	function disableClickPropagation(el) {
		on(el, 'mousedown touchstart dblclick', stopPropagation);
		addOne(el, 'click', fakeStop);
		return this;
	}

	// @function preventDefault(ev: DOMEvent): this
	// Prevents the default action of the DOM Event `ev` from happening (such as
	// following a link in the href of the a element, or doing a POST request
	// with page reload when a `<form>` is submitted).
	// Use it inside listener functions.
	function preventDefault(e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		return this;
	}

	// @function stop(ev: DOMEvent): this
	// Does `stopPropagation` and `preventDefault` at the same time.
	function stop(e) {
		preventDefault(e);
		stopPropagation(e);
		return this;
	}

	// @function getMousePosition(ev: DOMEvent, container?: HTMLElement): Point
	// Gets normalized mouse position from a DOM event relative to the
	// `container` (border excluded) or to the whole page if not specified.
	function getMousePosition(e, container) {
		if (!container) {
			return new Point(e.clientX, e.clientY);
		}

		var scale = getScale(container),
		    offset = scale.boundingClientRect; // left and top  values are in page scale (like the event clientX/Y)

		return new Point(
			// offset.left/top values are in page scale (like clientX/Y),
			// whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
			(e.clientX - offset.left) / scale.x - container.clientLeft,
			(e.clientY - offset.top) / scale.y - container.clientTop
		);
	}

	// Chrome on Win scrolls double the pixels as in other platforms (see #4538),
	// and Firefox scrolls device pixels, not CSS pixels
	var wheelPxFactor =
		(win && chrome) ? 2 * window.devicePixelRatio :
		gecko ? window.devicePixelRatio : 1;

	// @function getWheelDelta(ev: DOMEvent): Number
	// Gets normalized wheel delta from a mousewheel DOM event, in vertical
	// pixels scrolled (negative if scrolling down).
	// Events from pointing devices without precise scrolling are mapped to
	// a best guess of 60 pixels.
	function getWheelDelta(e) {
		return (edge) ? e.wheelDeltaY / 2 : // Don't trust window-geometry-based delta
		       (e.deltaY && e.deltaMode === 0) ? -e.deltaY / wheelPxFactor : // Pixels
		       (e.deltaY && e.deltaMode === 1) ? -e.deltaY * 20 : // Lines
		       (e.deltaY && e.deltaMode === 2) ? -e.deltaY * 60 : // Pages
		       (e.deltaX || e.deltaZ) ? 0 :	// Skip horizontal/depth wheel events
		       e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : // Legacy IE pixels
		       (e.detail && Math.abs(e.detail) < 32765) ? -e.detail * 20 : // Legacy Moz lines
		       e.detail ? e.detail / -32765 * 60 : // Legacy Moz pages
		       0;
	}

	var skipEvents = {};

	function fakeStop(e) {
		// fakes stopPropagation by setting a special event flag, checked/reset with skipped(e)
		skipEvents[e.type] = true;
	}

	function skipped(e) {
		var events = skipEvents[e.type];
		// reset when checking, as it's only used in map container and propagates outside of the map
		skipEvents[e.type] = false;
		return events;
	}

	// check if element really left/entered the event target (for mouseenter/mouseleave)
	function isExternalTarget(el, e) {

		var related = e.relatedTarget;

		if (!related) { return true; }

		try {
			while (related && (related !== el)) {
				related = related.parentNode;
			}
		} catch (err) {
			return false;
		}
		return (related !== el);
	}

	var lastClick;

	// this is a horrible workaround for a bug in Android where a single touch triggers two click events
	function filterClick(e, handler) {
		var timeStamp = (e.timeStamp || (e.originalEvent && e.originalEvent.timeStamp)),
		    elapsed = lastClick && (timeStamp - lastClick);

		// are they closer together than 500ms yet more than 100ms?
		// Android typically triggers them ~300ms apart while multiple listeners
		// on the same event should be triggered far faster;
		// or check if click is simulated on the element, and if it is, reject any non-simulated events

		if ((elapsed && elapsed > 100 && elapsed < 500) || (e.target._simulatedClick && !e._simulated)) {
			stop(e);
			return;
		}
		lastClick = timeStamp;

		handler(e);
	}




	var DomEvent = (Object.freeze || Object)({
		on: on,
		off: off,
		stopPropagation: stopPropagation,
		disableScrollPropagation: disableScrollPropagation,
		disableClickPropagation: disableClickPropagation,
		preventDefault: preventDefault,
		stop: stop,
		getMousePosition: getMousePosition,
		getWheelDelta: getWheelDelta,
		fakeStop: fakeStop,
		skipped: skipped,
		isExternalTarget: isExternalTarget,
		addListener: on,
		removeListener: off
	});

	/*
	 * @class PosAnimation
	 * @aka L.PosAnimation
	 * @inherits Evented
	 * Used internally for panning animations, utilizing CSS3 Transitions for modern browsers and a timer fallback for IE6-9.
	 *
	 * @example
	 * ```js
	 * var fx = new L.PosAnimation();
	 * fx.run(el, [300, 500], 0.5);
	 * ```
	 *
	 * @constructor L.PosAnimation()
	 * Creates a `PosAnimation` object.
	 *
	 */

	var PosAnimation = Evented.extend({

		// @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
		// Run an animation of a given element to a new position, optionally setting
		// duration in seconds (`0.25` by default) and easing linearity factor (3rd
		// argument of the [cubic bezier curve](http://cubic-bezier.com/#0,0,.5,1),
		// `0.5` by default).
		run: function (el, newPos, duration, easeLinearity) {
			this.stop();

			this._el = el;
			this._inProgress = true;
			this._duration = duration || 0.25;
			this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);

			this._startPos = getPosition(el);
			this._offset = newPos.subtract(this._startPos);
			this._startTime = +new Date();

			// @event start: Event
			// Fired when the animation starts
			this.fire('start');

			this._animate();
		},

		// @method stop()
		// Stops the animation (if currently running).
		stop: function () {
			if (!this._inProgress) { return; }

			this._step(true);
			this._complete();
		},

		_animate: function () {
			// animation loop
			this._animId = requestAnimFrame(this._animate, this);
			this._step();
		},

		_step: function (round) {
			var elapsed = (+new Date()) - this._startTime,
			    duration = this._duration * 1000;

			if (elapsed < duration) {
				this._runFrame(this._easeOut(elapsed / duration), round);
			} else {
				this._runFrame(1);
				this._complete();
			}
		},

		_runFrame: function (progress, round) {
			var pos = this._startPos.add(this._offset.multiplyBy(progress));
			if (round) {
				pos._round();
			}
			setPosition(this._el, pos);

			// @event step: Event
			// Fired continuously during the animation.
			this.fire('step');
		},

		_complete: function () {
			cancelAnimFrame(this._animId);

			this._inProgress = false;
			// @event end: Event
			// Fired when the animation ends.
			this.fire('end');
		},

		_easeOut: function (t) {
			return 1 - Math.pow(1 - t, this._easeOutPower);
		}
	});

	/*
	 * @class Map
	 * @aka L.Map
	 * @inherits Evented
	 *
	 * The central class of the API — it is used to create a map on a page and manipulate it.
	 *
	 * @example
	 *
	 * ```js
	 * // initialize the map on the "map" div with a given center and zoom
	 * var map = L.map('map', {
	 * 	center: [51.505, -0.09],
	 * 	zoom: 13
	 * });
	 * ```
	 *
	 */

	var Map = Evented.extend({

		options: {
			// @section Map State Options
			// @option crs: CRS = L.CRS.EPSG3857
			// The [Coordinate Reference System](#crs) to use. Don't change this if you're not
			// sure what it means.
			crs: EPSG3857,

			// @option center: LatLng = undefined
			// Initial geographic center of the map
			center: undefined,

			// @option zoom: Number = undefined
			// Initial map zoom level
			zoom: undefined,

			// @option minZoom: Number = *
			// Minimum zoom level of the map.
			// If not specified and at least one `GridLayer` or `TileLayer` is in the map,
			// the lowest of their `minZoom` options will be used instead.
			minZoom: undefined,

			// @option maxZoom: Number = *
			// Maximum zoom level of the map.
			// If not specified and at least one `GridLayer` or `TileLayer` is in the map,
			// the highest of their `maxZoom` options will be used instead.
			maxZoom: undefined,

			// @option layers: Layer[] = []
			// Array of layers that will be added to the map initially
			layers: [],

			// @option maxBounds: LatLngBounds = null
			// When this option is set, the map restricts the view to the given
			// geographical bounds, bouncing the user back if the user tries to pan
			// outside the view. To set the restriction dynamically, use
			// [`setMaxBounds`](#map-setmaxbounds) method.
			maxBounds: undefined,

			// @option renderer: Renderer = *
			// The default method for drawing vector layers on the map. `L.SVG`
			// or `L.Canvas` by default depending on browser support.
			renderer: undefined,


			// @section Animation Options
			// @option zoomAnimation: Boolean = true
			// Whether the map zoom animation is enabled. By default it's enabled
			// in all browsers that support CSS3 Transitions except Android.
			zoomAnimation: true,

			// @option zoomAnimationThreshold: Number = 4
			// Won't animate zoom if the zoom difference exceeds this value.
			zoomAnimationThreshold: 4,

			// @option fadeAnimation: Boolean = true
			// Whether the tile fade animation is enabled. By default it's enabled
			// in all browsers that support CSS3 Transitions except Android.
			fadeAnimation: true,

			// @option markerZoomAnimation: Boolean = true
			// Whether markers animate their zoom with the zoom animation, if disabled
			// they will disappear for the length of the animation. By default it's
			// enabled in all browsers that support CSS3 Transitions except Android.
			markerZoomAnimation: true,

			// @option transform3DLimit: Number = 2^23
			// Defines the maximum size of a CSS translation transform. The default
			// value should not be changed unless a web browser positions layers in
			// the wrong place after doing a large `panBy`.
			transform3DLimit: 8388608, // Precision limit of a 32-bit float

			// @section Interaction Options
			// @option zoomSnap: Number = 1
			// Forces the map's zoom level to always be a multiple of this, particularly
			// right after a [`fitBounds()`](#map-fitbounds) or a pinch-zoom.
			// By default, the zoom level snaps to the nearest integer; lower values
			// (e.g. `0.5` or `0.1`) allow for greater granularity. A value of `0`
			// means the zoom level will not be snapped after `fitBounds` or a pinch-zoom.
			zoomSnap: 1,

			// @option zoomDelta: Number = 1
			// Controls how much the map's zoom level will change after a
			// [`zoomIn()`](#map-zoomin), [`zoomOut()`](#map-zoomout), pressing `+`
			// or `-` on the keyboard, or using the [zoom controls](#control-zoom).
			// Values smaller than `1` (e.g. `0.5`) allow for greater granularity.
			zoomDelta: 1,

			// @option trackResize: Boolean = true
			// Whether the map automatically handles browser window resize to update itself.
			trackResize: true
		},

		initialize: function (id, options) { // (HTMLElement or String, Object)
			options = setOptions(this, options);

			// Make sure to assign internal flags at the beginning,
			// to avoid inconsistent state in some edge cases.
			this._handlers = [];
			this._layers = {};
			this._zoomBoundLayers = {};
			this._sizeChanged = true;

			this._initContainer(id);
			this._initLayout();

			// hack for https://github.com/Leaflet/Leaflet/issues/1980
			this._onResize = bind(this._onResize, this);

			this._initEvents();

			if (options.maxBounds) {
				this.setMaxBounds(options.maxBounds);
			}

			if (options.zoom !== undefined) {
				this._zoom = this._limitZoom(options.zoom);
			}

			if (options.center && options.zoom !== undefined) {
				this.setView(toLatLng(options.center), options.zoom, {reset: true});
			}

			this.callInitHooks();

			// don't animate on browsers without hardware-accelerated transitions or old Android/Opera
			this._zoomAnimated = TRANSITION && any3d && !mobileOpera &&
					this.options.zoomAnimation;

			// zoom transitions run with the same duration for all layers, so if one of transitionend events
			// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
			if (this._zoomAnimated) {
				this._createAnimProxy();
				on(this._proxy, TRANSITION_END, this._catchTransitionEnd, this);
			}

			this._addLayers(this.options.layers);
		},


		// @section Methods for modifying map state

		// @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
		// Sets the view of the map (geographical center and zoom) with the given
		// animation options.
		setView: function (center, zoom, options) {

			zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);
			center = this._limitCenter(toLatLng(center), zoom, this.options.maxBounds);
			options = options || {};

			this._stop();

			if (this._loaded && !options.reset && options !== true) {

				if (options.animate !== undefined) {
					options.zoom = extend({animate: options.animate}, options.zoom);
					options.pan = extend({animate: options.animate, duration: options.duration}, options.pan);
				}

				// try animating pan or zoom
				var moved = (this._zoom !== zoom) ?
					this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom, options.zoom) :
					this._tryAnimatedPan(center, options.pan);

				if (moved) {
					// prevent resize handler call, the view will refresh after animation anyway
					clearTimeout(this._sizeTimer);
					return this;
				}
			}

			// animation didn't start, just reset the map view
			this._resetView(center, zoom);

			return this;
		},

		// @method setZoom(zoom: Number, options?: Zoom/pan options): this
		// Sets the zoom of the map.
		setZoom: function (zoom, options) {
			if (!this._loaded) {
				this._zoom = zoom;
				return this;
			}
			return this.setView(this.getCenter(), zoom, {zoom: options});
		},

		// @method zoomIn(delta?: Number, options?: Zoom options): this
		// Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
		zoomIn: function (delta, options) {
			delta = delta || (any3d ? this.options.zoomDelta : 1);
			return this.setZoom(this._zoom + delta, options);
		},

		// @method zoomOut(delta?: Number, options?: Zoom options): this
		// Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
		zoomOut: function (delta, options) {
			delta = delta || (any3d ? this.options.zoomDelta : 1);
			return this.setZoom(this._zoom - delta, options);
		},

		// @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
		// Zooms the map while keeping a specified geographical point on the map
		// stationary (e.g. used internally for scroll zoom and double-click zoom).
		// @alternative
		// @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
		// Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
		setZoomAround: function (latlng, zoom, options) {
			var scale = this.getZoomScale(zoom),
			    viewHalf = this.getSize().divideBy(2),
			    containerPoint = latlng instanceof Point ? latlng : this.latLngToContainerPoint(latlng),

			    centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
			    newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));

			return this.setView(newCenter, zoom, {zoom: options});
		},

		_getBoundsCenterZoom: function (bounds, options) {

			options = options || {};
			bounds = bounds.getBounds ? bounds.getBounds() : toLatLngBounds(bounds);

			var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]),
			    paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]),

			    zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));

			zoom = (typeof options.maxZoom === 'number') ? Math.min(options.maxZoom, zoom) : zoom;

			if (zoom === Infinity) {
				return {
					center: bounds.getCenter(),
					zoom: zoom
				};
			}

			var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

			    swPoint = this.project(bounds.getSouthWest(), zoom),
			    nePoint = this.project(bounds.getNorthEast(), zoom),
			    center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

			return {
				center: center,
				zoom: zoom
			};
		},

		// @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
		// Sets a map view that contains the given geographical bounds with the
		// maximum zoom level possible.
		fitBounds: function (bounds, options) {

			bounds = toLatLngBounds(bounds);

			if (!bounds.isValid()) {
				throw new Error('Bounds are not valid.');
			}

			var target = this._getBoundsCenterZoom(bounds, options);
			return this.setView(target.center, target.zoom, options);
		},

		// @method fitWorld(options?: fitBounds options): this
		// Sets a map view that mostly contains the whole world with the maximum
		// zoom level possible.
		fitWorld: function (options) {
			return this.fitBounds([[-90, -180], [90, 180]], options);
		},

		// @method panTo(latlng: LatLng, options?: Pan options): this
		// Pans the map to a given center.
		panTo: function (center, options) { // (LatLng)
			return this.setView(center, this._zoom, {pan: options});
		},

		// @method panBy(offset: Point, options?: Pan options): this
		// Pans the map by a given number of pixels (animated).
		panBy: function (offset, options) {
			offset = toPoint(offset).round();
			options = options || {};

			if (!offset.x && !offset.y) {
				return this.fire('moveend');
			}
			// If we pan too far, Chrome gets issues with tiles
			// and makes them disappear or appear in the wrong place (slightly offset) #2602
			if (options.animate !== true && !this.getSize().contains(offset)) {
				this._resetView(this.unproject(this.project(this.getCenter()).add(offset)), this.getZoom());
				return this;
			}

			if (!this._panAnim) {
				this._panAnim = new PosAnimation();

				this._panAnim.on({
					'step': this._onPanTransitionStep,
					'end': this._onPanTransitionEnd
				}, this);
			}

			// don't fire movestart if animating inertia
			if (!options.noMoveStart) {
				this.fire('movestart');
			}

			// animate pan unless animate: false specified
			if (options.animate !== false) {
				addClass(this._mapPane, 'leaflet-pan-anim');

				var newPos = this._getMapPanePos().subtract(offset).round();
				this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
			} else {
				this._rawPanBy(offset);
				this.fire('move').fire('moveend');
			}

			return this;
		},

		// @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
		// Sets the view of the map (geographical center and zoom) performing a smooth
		// pan-zoom animation.
		flyTo: function (targetCenter, targetZoom, options) {

			options = options || {};
			if (options.animate === false || !any3d) {
				return this.setView(targetCenter, targetZoom, options);
			}

			this._stop();

			var from = this.project(this.getCenter()),
			    to = this.project(targetCenter),
			    size = this.getSize(),
			    startZoom = this._zoom;

			targetCenter = toLatLng(targetCenter);
			targetZoom = targetZoom === undefined ? startZoom : targetZoom;

			var w0 = Math.max(size.x, size.y),
			    w1 = w0 * this.getZoomScale(startZoom, targetZoom),
			    u1 = (to.distanceTo(from)) || 1,
			    rho = 1.42,
			    rho2 = rho * rho;

			function r(i) {
				var s1 = i ? -1 : 1,
				    s2 = i ? w1 : w0,
				    t1 = w1 * w1 - w0 * w0 + s1 * rho2 * rho2 * u1 * u1,
				    b1 = 2 * s2 * rho2 * u1,
				    b = t1 / b1,
				    sq = Math.sqrt(b * b + 1) - b;

				    // workaround for floating point precision bug when sq = 0, log = -Infinite,
				    // thus triggering an infinite loop in flyTo
				    var log = sq < 0.000000001 ? -18 : Math.log(sq);

				return log;
			}

			function sinh(n) { return (Math.exp(n) - Math.exp(-n)) / 2; }
			function cosh(n) { return (Math.exp(n) + Math.exp(-n)) / 2; }
			function tanh(n) { return sinh(n) / cosh(n); }

			var r0 = r(0);

			function w(s) { return w0 * (cosh(r0) / cosh(r0 + rho * s)); }
			function u(s) { return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2; }

			function easeOut(t) { return 1 - Math.pow(1 - t, 1.5); }

			var start = Date.now(),
			    S = (r(1) - r0) / rho,
			    duration = options.duration ? 1000 * options.duration : 1000 * S * 0.8;

			function frame() {
				var t = (Date.now() - start) / duration,
				    s = easeOut(t) * S;

				if (t <= 1) {
					this._flyToFrame = requestAnimFrame(frame, this);

					this._move(
						this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1)), startZoom),
						this.getScaleZoom(w0 / w(s), startZoom),
						{flyTo: true});

				} else {
					this
						._move(targetCenter, targetZoom)
						._moveEnd(true);
				}
			}

			this._moveStart(true, options.noMoveStart);

			frame.call(this);
			return this;
		},

		// @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
		// Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
		// but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
		flyToBounds: function (bounds, options) {
			var target = this._getBoundsCenterZoom(bounds, options);
			return this.flyTo(target.center, target.zoom, options);
		},

		// @method setMaxBounds(bounds: Bounds): this
		// Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
		setMaxBounds: function (bounds) {
			bounds = toLatLngBounds(bounds);

			if (!bounds.isValid()) {
				this.options.maxBounds = null;
				return this.off('moveend', this._panInsideMaxBounds);
			} else if (this.options.maxBounds) {
				this.off('moveend', this._panInsideMaxBounds);
			}

			this.options.maxBounds = bounds;

			if (this._loaded) {
				this._panInsideMaxBounds();
			}

			return this.on('moveend', this._panInsideMaxBounds);
		},

		// @method setMinZoom(zoom: Number): this
		// Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
		setMinZoom: function (zoom) {
			var oldZoom = this.options.minZoom;
			this.options.minZoom = zoom;

			if (this._loaded && oldZoom !== zoom) {
				this.fire('zoomlevelschange');

				if (this.getZoom() < this.options.minZoom) {
					return this.setZoom(zoom);
				}
			}

			return this;
		},

		// @method setMaxZoom(zoom: Number): this
		// Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
		setMaxZoom: function (zoom) {
			var oldZoom = this.options.maxZoom;
			this.options.maxZoom = zoom;

			if (this._loaded && oldZoom !== zoom) {
				this.fire('zoomlevelschange');

				if (this.getZoom() > this.options.maxZoom) {
					return this.setZoom(zoom);
				}
			}

			return this;
		},

		// @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
		// Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
		panInsideBounds: function (bounds, options) {
			this._enforcingBounds = true;
			var center = this.getCenter(),
			    newCenter = this._limitCenter(center, this._zoom, toLatLngBounds(bounds));

			if (!center.equals(newCenter)) {
				this.panTo(newCenter, options);
			}

			this._enforcingBounds = false;
			return this;
		},

		// @method panInside(latlng: LatLng, options?: options): this
		// Pans the map the minimum amount to make the `latlng` visible. Use
		// `padding`, `paddingTopLeft` and `paddingTopRight` options to fit
		// the display to more restricted bounds, like [`fitBounds`](#map-fitbounds).
		// If `latlng` is already within the (optionally padded) display bounds,
		// the map will not be panned.
		panInside: function (latlng, options) {
			options = options || {};

			var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]),
			    paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]),
			    center = this.getCenter(),
			    pixelCenter = this.project(center),
			    pixelPoint = this.project(latlng),
			    pixelBounds = this.getPixelBounds(),
			    halfPixelBounds = pixelBounds.getSize().divideBy(2),
			    paddedBounds = toBounds([pixelBounds.min.add(paddingTL), pixelBounds.max.subtract(paddingBR)]);

			if (!paddedBounds.contains(pixelPoint)) {
				this._enforcingBounds = true;
				var diff = pixelCenter.subtract(pixelPoint),
				    newCenter = toPoint(pixelPoint.x + diff.x, pixelPoint.y + diff.y);

				if (pixelPoint.x < paddedBounds.min.x || pixelPoint.x > paddedBounds.max.x) {
					newCenter.x = pixelCenter.x - diff.x;
					if (diff.x > 0) {
						newCenter.x += halfPixelBounds.x - paddingTL.x;
					} else {
						newCenter.x -= halfPixelBounds.x - paddingBR.x;
					}
				}
				if (pixelPoint.y < paddedBounds.min.y || pixelPoint.y > paddedBounds.max.y) {
					newCenter.y = pixelCenter.y - diff.y;
					if (diff.y > 0) {
						newCenter.y += halfPixelBounds.y - paddingTL.y;
					} else {
						newCenter.y -= halfPixelBounds.y - paddingBR.y;
					}
				}
				this.panTo(this.unproject(newCenter), options);
				this._enforcingBounds = false;
			}
			return this;
		},

		// @method invalidateSize(options: Zoom/pan options): this
		// Checks if the map container size changed and updates the map if so —
		// call it after you've changed the map size dynamically, also animating
		// pan by default. If `options.pan` is `false`, panning will not occur.
		// If `options.debounceMoveend` is `true`, it will delay `moveend` event so
		// that it doesn't happen often even if the method is called many
		// times in a row.

		// @alternative
		// @method invalidateSize(animate: Boolean): this
		// Checks if the map container size changed and updates the map if so —
		// call it after you've changed the map size dynamically, also animating
		// pan by default.
		invalidateSize: function (options) {
			if (!this._loaded) { return this; }

			options = extend({
				animate: false,
				pan: true
			}, options === true ? {animate: true} : options);

			var oldSize = this.getSize();
			this._sizeChanged = true;
			this._lastCenter = null;

			var newSize = this.getSize(),
			    oldCenter = oldSize.divideBy(2).round(),
			    newCenter = newSize.divideBy(2).round(),
			    offset = oldCenter.subtract(newCenter);

			if (!offset.x && !offset.y) { return this; }

			if (options.animate && options.pan) {
				this.panBy(offset);

			} else {
				if (options.pan) {
					this._rawPanBy(offset);
				}

				this.fire('move');

				if (options.debounceMoveend) {
					clearTimeout(this._sizeTimer);
					this._sizeTimer = setTimeout(bind(this.fire, this, 'moveend'), 200);
				} else {
					this.fire('moveend');
				}
			}

			// @section Map state change events
			// @event resize: ResizeEvent
			// Fired when the map is resized.
			return this.fire('resize', {
				oldSize: oldSize,
				newSize: newSize
			});
		},

		// @section Methods for modifying map state
		// @method stop(): this
		// Stops the currently running `panTo` or `flyTo` animation, if any.
		stop: function () {
			this.setZoom(this._limitZoom(this._zoom));
			if (!this.options.zoomSnap) {
				this.fire('viewreset');
			}
			return this._stop();
		},

		// @section Geolocation methods
		// @method locate(options?: Locate options): this
		// Tries to locate the user using the Geolocation API, firing a [`locationfound`](#map-locationfound)
		// event with location data on success or a [`locationerror`](#map-locationerror) event on failure,
		// and optionally sets the map view to the user's location with respect to
		// detection accuracy (or to the world view if geolocation failed).
		// Note that, if your page doesn't use HTTPS, this method will fail in
		// modern browsers ([Chrome 50 and newer](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins))
		// See `Locate options` for more details.
		locate: function (options) {

			options = this._locateOptions = extend({
				timeout: 10000,
				watch: false
				// setView: false
				// maxZoom: <Number>
				// maximumAge: 0
				// enableHighAccuracy: false
			}, options);

			if (!('geolocation' in navigator)) {
				this._handleGeolocationError({
					code: 0,
					message: 'Geolocation not supported.'
				});
				return this;
			}

			var onResponse = bind(this._handleGeolocationResponse, this),
			    onError = bind(this._handleGeolocationError, this);

			if (options.watch) {
				this._locationWatchId =
				        navigator.geolocation.watchPosition(onResponse, onError, options);
			} else {
				navigator.geolocation.getCurrentPosition(onResponse, onError, options);
			}
			return this;
		},

		// @method stopLocate(): this
		// Stops watching location previously initiated by `map.locate({watch: true})`
		// and aborts resetting the map view if map.locate was called with
		// `{setView: true}`.
		stopLocate: function () {
			if (navigator.geolocation && navigator.geolocation.clearWatch) {
				navigator.geolocation.clearWatch(this._locationWatchId);
			}
			if (this._locateOptions) {
				this._locateOptions.setView = false;
			}
			return this;
		},

		_handleGeolocationError: function (error) {
			var c = error.code,
			    message = error.message ||
			            (c === 1 ? 'permission denied' :
			            (c === 2 ? 'position unavailable' : 'timeout'));

			if (this._locateOptions.setView && !this._loaded) {
				this.fitWorld();
			}

			// @section Location events
			// @event locationerror: ErrorEvent
			// Fired when geolocation (using the [`locate`](#map-locate) method) failed.
			this.fire('locationerror', {
				code: c,
				message: 'Geolocation error: ' + message + '.'
			});
		},

		_handleGeolocationResponse: function (pos) {
			var lat = pos.coords.latitude,
			    lng = pos.coords.longitude,
			    latlng = new LatLng(lat, lng),
			    bounds = latlng.toBounds(pos.coords.accuracy * 2),
			    options = this._locateOptions;

			if (options.setView) {
				var zoom = this.getBoundsZoom(bounds);
				this.setView(latlng, options.maxZoom ? Math.min(zoom, options.maxZoom) : zoom);
			}

			var data = {
				latlng: latlng,
				bounds: bounds,
				timestamp: pos.timestamp
			};

			for (var i in pos.coords) {
				if (typeof pos.coords[i] === 'number') {
					data[i] = pos.coords[i];
				}
			}

			// @event locationfound: LocationEvent
			// Fired when geolocation (using the [`locate`](#map-locate) method)
			// went successfully.
			this.fire('locationfound', data);
		},

		// TODO Appropriate docs section?
		// @section Other Methods
		// @method addHandler(name: String, HandlerClass: Function): this
		// Adds a new `Handler` to the map, given its name and constructor function.
		addHandler: function (name, HandlerClass) {
			if (!HandlerClass) { return this; }

			var handler = this[name] = new HandlerClass(this);

			this._handlers.push(handler);

			if (this.options[name]) {
				handler.enable();
			}

			return this;
		},

		// @method remove(): this
		// Destroys the map and clears all related event listeners.
		remove: function () {

			this._initEvents(true);

			if (this._containerId !== this._container._leaflet_id) {
				throw new Error('Map container is being reused by another instance');
			}

			try {
				// throws error in IE6-8
				delete this._container._leaflet_id;
				delete this._containerId;
			} catch (e) {
				/*eslint-disable */
				this._container._leaflet_id = undefined;
				/* eslint-enable */
				this._containerId = undefined;
			}

			if (this._locationWatchId !== undefined) {
				this.stopLocate();
			}

			this._stop();

			remove(this._mapPane);

			if (this._clearControlPos) {
				this._clearControlPos();
			}
			if (this._resizeRequest) {
				cancelAnimFrame(this._resizeRequest);
				this._resizeRequest = null;
			}

			this._clearHandlers();

			if (this._loaded) {
				// @section Map state change events
				// @event unload: Event
				// Fired when the map is destroyed with [remove](#map-remove) method.
				this.fire('unload');
			}

			var i;
			for (i in this._layers) {
				this._layers[i].remove();
			}
			for (i in this._panes) {
				remove(this._panes[i]);
			}

			this._layers = [];
			this._panes = [];
			delete this._mapPane;
			delete this._renderer;

			return this;
		},

		// @section Other Methods
		// @method createPane(name: String, container?: HTMLElement): HTMLElement
		// Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
		// then returns it. The pane is created as a child of `container`, or
		// as a child of the main map pane if not set.
		createPane: function (name, container) {
			var className = 'leaflet-pane' + (name ? ' leaflet-' + name.replace('Pane', '') + '-pane' : ''),
			    pane = create$1('div', className, container || this._mapPane);

			if (name) {
				this._panes[name] = pane;
			}
			return pane;
		},

		// @section Methods for Getting Map State

		// @method getCenter(): LatLng
		// Returns the geographical center of the map view
		getCenter: function () {
			this._checkIfLoaded();

			if (this._lastCenter && !this._moved()) {
				return this._lastCenter;
			}
			return this.layerPointToLatLng(this._getCenterLayerPoint());
		},

		// @method getZoom(): Number
		// Returns the current zoom level of the map view
		getZoom: function () {
			return this._zoom;
		},

		// @method getBounds(): LatLngBounds
		// Returns the geographical bounds visible in the current map view
		getBounds: function () {
			var bounds = this.getPixelBounds(),
			    sw = this.unproject(bounds.getBottomLeft()),
			    ne = this.unproject(bounds.getTopRight());

			return new LatLngBounds(sw, ne);
		},

		// @method getMinZoom(): Number
		// Returns the minimum zoom level of the map (if set in the `minZoom` option of the map or of any layers), or `0` by default.
		getMinZoom: function () {
			return this.options.minZoom === undefined ? this._layersMinZoom || 0 : this.options.minZoom;
		},

		// @method getMaxZoom(): Number
		// Returns the maximum zoom level of the map (if set in the `maxZoom` option of the map or of any layers).
		getMaxZoom: function () {
			return this.options.maxZoom === undefined ?
				(this._layersMaxZoom === undefined ? Infinity : this._layersMaxZoom) :
				this.options.maxZoom;
		},

		// @method getBoundsZoom(bounds: LatLngBounds, inside?: Boolean, padding?: Point): Number
		// Returns the maximum zoom level on which the given bounds fit to the map
		// view in its entirety. If `inside` (optional) is set to `true`, the method
		// instead returns the minimum zoom level on which the map view fits into
		// the given bounds in its entirety.
		getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
			bounds = toLatLngBounds(bounds);
			padding = toPoint(padding || [0, 0]);

			var zoom = this.getZoom() || 0,
			    min = this.getMinZoom(),
			    max = this.getMaxZoom(),
			    nw = bounds.getNorthWest(),
			    se = bounds.getSouthEast(),
			    size = this.getSize().subtract(padding),
			    boundsSize = toBounds(this.project(se, zoom), this.project(nw, zoom)).getSize(),
			    snap = any3d ? this.options.zoomSnap : 1,
			    scalex = size.x / boundsSize.x,
			    scaley = size.y / boundsSize.y,
			    scale = inside ? Math.max(scalex, scaley) : Math.min(scalex, scaley);

			zoom = this.getScaleZoom(scale, zoom);

			if (snap) {
				zoom = Math.round(zoom / (snap / 100)) * (snap / 100); // don't jump if within 1% of a snap level
				zoom = inside ? Math.ceil(zoom / snap) * snap : Math.floor(zoom / snap) * snap;
			}

			return Math.max(min, Math.min(max, zoom));
		},

		// @method getSize(): Point
		// Returns the current size of the map container (in pixels).
		getSize: function () {
			if (!this._size || this._sizeChanged) {
				this._size = new Point(
					this._container.clientWidth || 0,
					this._container.clientHeight || 0);

				this._sizeChanged = false;
			}
			return this._size.clone();
		},

		// @method getPixelBounds(): Bounds
		// Returns the bounds of the current map view in projected pixel
		// coordinates (sometimes useful in layer and overlay implementations).
		getPixelBounds: function (center, zoom) {
			var topLeftPoint = this._getTopLeftPoint(center, zoom);
			return new Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
		},

		// TODO: Check semantics - isn't the pixel origin the 0,0 coord relative to
		// the map pane? "left point of the map layer" can be confusing, specially
		// since there can be negative offsets.
		// @method getPixelOrigin(): Point
		// Returns the projected pixel coordinates of the top left point of
		// the map layer (useful in custom layer and overlay implementations).
		getPixelOrigin: function () {
			this._checkIfLoaded();
			return this._pixelOrigin;
		},

		// @method getPixelWorldBounds(zoom?: Number): Bounds
		// Returns the world's bounds in pixel coordinates for zoom level `zoom`.
		// If `zoom` is omitted, the map's current zoom level is used.
		getPixelWorldBounds: function (zoom) {
			return this.options.crs.getProjectedBounds(zoom === undefined ? this.getZoom() : zoom);
		},

		// @section Other Methods

		// @method getPane(pane: String|HTMLElement): HTMLElement
		// Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
		getPane: function (pane) {
			return typeof pane === 'string' ? this._panes[pane] : pane;
		},

		// @method getPanes(): Object
		// Returns a plain object containing the names of all [panes](#map-pane) as keys and
		// the panes as values.
		getPanes: function () {
			return this._panes;
		},

		// @method getContainer: HTMLElement
		// Returns the HTML element that contains the map.
		getContainer: function () {
			return this._container;
		},


		// @section Conversion Methods

		// @method getZoomScale(toZoom: Number, fromZoom: Number): Number
		// Returns the scale factor to be applied to a map transition from zoom level
		// `fromZoom` to `toZoom`. Used internally to help with zoom animations.
		getZoomScale: function (toZoom, fromZoom) {
			// TODO replace with universal implementation after refactoring projections
			var crs = this.options.crs;
			fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
			return crs.scale(toZoom) / crs.scale(fromZoom);
		},

		// @method getScaleZoom(scale: Number, fromZoom: Number): Number
		// Returns the zoom level that the map would end up at, if it is at `fromZoom`
		// level and everything is scaled by a factor of `scale`. Inverse of
		// [`getZoomScale`](#map-getZoomScale).
		getScaleZoom: function (scale, fromZoom) {
			var crs = this.options.crs;
			fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
			var zoom = crs.zoom(scale * crs.scale(fromZoom));
			return isNaN(zoom) ? Infinity : zoom;
		},

		// @method project(latlng: LatLng, zoom: Number): Point
		// Projects a geographical coordinate `LatLng` according to the projection
		// of the map's CRS, then scales it according to `zoom` and the CRS's
		// `Transformation`. The result is pixel coordinate relative to
		// the CRS origin.
		project: function (latlng, zoom) {
			zoom = zoom === undefined ? this._zoom : zoom;
			return this.options.crs.latLngToPoint(toLatLng(latlng), zoom);
		},

		// @method unproject(point: Point, zoom: Number): LatLng
		// Inverse of [`project`](#map-project).
		unproject: function (point, zoom) {
			zoom = zoom === undefined ? this._zoom : zoom;
			return this.options.crs.pointToLatLng(toPoint(point), zoom);
		},

		// @method layerPointToLatLng(point: Point): LatLng
		// Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
		// returns the corresponding geographical coordinate (for the current zoom level).
		layerPointToLatLng: function (point) {
			var projectedPoint = toPoint(point).add(this.getPixelOrigin());
			return this.unproject(projectedPoint);
		},

		// @method latLngToLayerPoint(latlng: LatLng): Point
		// Given a geographical coordinate, returns the corresponding pixel coordinate
		// relative to the [origin pixel](#map-getpixelorigin).
		latLngToLayerPoint: function (latlng) {
			var projectedPoint = this.project(toLatLng(latlng))._round();
			return projectedPoint._subtract(this.getPixelOrigin());
		},

		// @method wrapLatLng(latlng: LatLng): LatLng
		// Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
		// map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
		// CRS's bounds.
		// By default this means longitude is wrapped around the dateline so its
		// value is between -180 and +180 degrees.
		wrapLatLng: function (latlng) {
			return this.options.crs.wrapLatLng(toLatLng(latlng));
		},

		// @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
		// Returns a `LatLngBounds` with the same size as the given one, ensuring that
		// its center is within the CRS's bounds.
		// By default this means the center longitude is wrapped around the dateline so its
		// value is between -180 and +180 degrees, and the majority of the bounds
		// overlaps the CRS's bounds.
		wrapLatLngBounds: function (latlng) {
			return this.options.crs.wrapLatLngBounds(toLatLngBounds(latlng));
		},

		// @method distance(latlng1: LatLng, latlng2: LatLng): Number
		// Returns the distance between two geographical coordinates according to
		// the map's CRS. By default this measures distance in meters.
		distance: function (latlng1, latlng2) {
			return this.options.crs.distance(toLatLng(latlng1), toLatLng(latlng2));
		},

		// @method containerPointToLayerPoint(point: Point): Point
		// Given a pixel coordinate relative to the map container, returns the corresponding
		// pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
		containerPointToLayerPoint: function (point) { // (Point)
			return toPoint(point).subtract(this._getMapPanePos());
		},

		// @method layerPointToContainerPoint(point: Point): Point
		// Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
		// returns the corresponding pixel coordinate relative to the map container.
		layerPointToContainerPoint: function (point) { // (Point)
			return toPoint(point).add(this._getMapPanePos());
		},

		// @method containerPointToLatLng(point: Point): LatLng
		// Given a pixel coordinate relative to the map container, returns
		// the corresponding geographical coordinate (for the current zoom level).
		containerPointToLatLng: function (point) {
			var layerPoint = this.containerPointToLayerPoint(toPoint(point));
			return this.layerPointToLatLng(layerPoint);
		},

		// @method latLngToContainerPoint(latlng: LatLng): Point
		// Given a geographical coordinate, returns the corresponding pixel coordinate
		// relative to the map container.
		latLngToContainerPoint: function (latlng) {
			return this.layerPointToContainerPoint(this.latLngToLayerPoint(toLatLng(latlng)));
		},

		// @method mouseEventToContainerPoint(ev: MouseEvent): Point
		// Given a MouseEvent object, returns the pixel coordinate relative to the
		// map container where the event took place.
		mouseEventToContainerPoint: function (e) {
			return getMousePosition(e, this._container);
		},

		// @method mouseEventToLayerPoint(ev: MouseEvent): Point
		// Given a MouseEvent object, returns the pixel coordinate relative to
		// the [origin pixel](#map-getpixelorigin) where the event took place.
		mouseEventToLayerPoint: function (e) {
			return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
		},

		// @method mouseEventToLatLng(ev: MouseEvent): LatLng
		// Given a MouseEvent object, returns geographical coordinate where the
		// event took place.
		mouseEventToLatLng: function (e) { // (MouseEvent)
			return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
		},


		// map initialization methods

		_initContainer: function (id) {
			var container = this._container = get(id);

			if (!container) {
				throw new Error('Map container not found.');
			} else if (container._leaflet_id) {
				throw new Error('Map container is already initialized.');
			}

			on(container, 'scroll', this._onScroll, this);
			this._containerId = stamp(container);
		},

		_initLayout: function () {
			var container = this._container;

			this._fadeAnimated = this.options.fadeAnimation && any3d;

			addClass(container, 'leaflet-container' +
				(touch ? ' leaflet-touch' : '') +
				(retina ? ' leaflet-retina' : '') +
				(ielt9 ? ' leaflet-oldie' : '') +
				(safari ? ' leaflet-safari' : '') +
				(this._fadeAnimated ? ' leaflet-fade-anim' : ''));

			var position = getStyle(container, 'position');

			if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
				container.style.position = 'relative';
			}

			this._initPanes();

			if (this._initControlPos) {
				this._initControlPos();
			}
		},

		_initPanes: function () {
			var panes = this._panes = {};
			this._paneRenderers = {};

			// @section
			//
			// Panes are DOM elements used to control the ordering of layers on the map. You
			// can access panes with [`map.getPane`](#map-getpane) or
			// [`map.getPanes`](#map-getpanes) methods. New panes can be created with the
			// [`map.createPane`](#map-createpane) method.
			//
			// Every map has the following default panes that differ only in zIndex.
			//
			// @pane mapPane: HTMLElement = 'auto'
			// Pane that contains all other map panes

			this._mapPane = this.createPane('mapPane', this._container);
			setPosition(this._mapPane, new Point(0, 0));

			// @pane tilePane: HTMLElement = 200
			// Pane for `GridLayer`s and `TileLayer`s
			this.createPane('tilePane');
			// @pane overlayPane: HTMLElement = 400
			// Pane for vectors (`Path`s, like `Polyline`s and `Polygon`s), `ImageOverlay`s and `VideoOverlay`s
			this.createPane('shadowPane');
			// @pane shadowPane: HTMLElement = 500
			// Pane for overlay shadows (e.g. `Marker` shadows)
			this.createPane('overlayPane');
			// @pane markerPane: HTMLElement = 600
			// Pane for `Icon`s of `Marker`s
			this.createPane('markerPane');
			// @pane tooltipPane: HTMLElement = 650
			// Pane for `Tooltip`s.
			this.createPane('tooltipPane');
			// @pane popupPane: HTMLElement = 700
			// Pane for `Popup`s.
			this.createPane('popupPane');

			if (!this.options.markerZoomAnimation) {
				addClass(panes.markerPane, 'leaflet-zoom-hide');
				addClass(panes.shadowPane, 'leaflet-zoom-hide');
			}
		},


		// private methods that modify map state

		// @section Map state change events
		_resetView: function (center, zoom) {
			setPosition(this._mapPane, new Point(0, 0));

			var loading = !this._loaded;
			this._loaded = true;
			zoom = this._limitZoom(zoom);

			this.fire('viewprereset');

			var zoomChanged = this._zoom !== zoom;
			this
				._moveStart(zoomChanged, false)
				._move(center, zoom)
				._moveEnd(zoomChanged);

			// @event viewreset: Event
			// Fired when the map needs to redraw its content (this usually happens
			// on map zoom or load). Very useful for creating custom overlays.
			this.fire('viewreset');

			// @event load: Event
			// Fired when the map is initialized (when its center and zoom are set
			// for the first time).
			if (loading) {
				this.fire('load');
			}
		},

		_moveStart: function (zoomChanged, noMoveStart) {
			// @event zoomstart: Event
			// Fired when the map zoom is about to change (e.g. before zoom animation).
			// @event movestart: Event
			// Fired when the view of the map starts changing (e.g. user starts dragging the map).
			if (zoomChanged) {
				this.fire('zoomstart');
			}
			if (!noMoveStart) {
				this.fire('movestart');
			}
			return this;
		},

		_move: function (center, zoom, data) {
			if (zoom === undefined) {
				zoom = this._zoom;
			}
			var zoomChanged = this._zoom !== zoom;

			this._zoom = zoom;
			this._lastCenter = center;
			this._pixelOrigin = this._getNewPixelOrigin(center);

			// @event zoom: Event
			// Fired repeatedly during any change in zoom level, including zoom
			// and fly animations.
			if (zoomChanged || (data && data.pinch)) {	// Always fire 'zoom' if pinching because #3530
				this.fire('zoom', data);
			}

			// @event move: Event
			// Fired repeatedly during any movement of the map, including pan and
			// fly animations.
			return this.fire('move', data);
		},

		_moveEnd: function (zoomChanged) {
			// @event zoomend: Event
			// Fired when the map has changed, after any animations.
			if (zoomChanged) {
				this.fire('zoomend');
			}

			// @event moveend: Event
			// Fired when the center of the map stops changing (e.g. user stopped
			// dragging the map).
			return this.fire('moveend');
		},

		_stop: function () {
			cancelAnimFrame(this._flyToFrame);
			if (this._panAnim) {
				this._panAnim.stop();
			}
			return this;
		},

		_rawPanBy: function (offset) {
			setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
		},

		_getZoomSpan: function () {
			return this.getMaxZoom() - this.getMinZoom();
		},

		_panInsideMaxBounds: function () {
			if (!this._enforcingBounds) {
				this.panInsideBounds(this.options.maxBounds);
			}
		},

		_checkIfLoaded: function () {
			if (!this._loaded) {
				throw new Error('Set map center and zoom first.');
			}
		},

		// DOM event handling

		// @section Interaction events
		_initEvents: function (remove$$1) {
			this._targets = {};
			this._targets[stamp(this._container)] = this;

			var onOff = remove$$1 ? off : on;

			// @event click: MouseEvent
			// Fired when the user clicks (or taps) the map.
			// @event dblclick: MouseEvent
			// Fired when the user double-clicks (or double-taps) the map.
			// @event mousedown: MouseEvent
			// Fired when the user pushes the mouse button on the map.
			// @event mouseup: MouseEvent
			// Fired when the user releases the mouse button on the map.
			// @event mouseover: MouseEvent
			// Fired when the mouse enters the map.
			// @event mouseout: MouseEvent
			// Fired when the mouse leaves the map.
			// @event mousemove: MouseEvent
			// Fired while the mouse moves over the map.
			// @event contextmenu: MouseEvent
			// Fired when the user pushes the right mouse button on the map, prevents
			// default browser context menu from showing if there are listeners on
			// this event. Also fired on mobile when the user holds a single touch
			// for a second (also called long press).
			// @event keypress: KeyboardEvent
			// Fired when the user presses a key from the keyboard that produces a character value while the map is focused.
			// @event keydown: KeyboardEvent
			// Fired when the user presses a key from the keyboard while the map is focused. Unlike the `keypress` event,
			// the `keydown` event is fired for keys that produce a character value and for keys
			// that do not produce a character value.
			// @event keyup: KeyboardEvent
			// Fired when the user releases a key from the keyboard while the map is focused.
			onOff(this._container, 'click dblclick mousedown mouseup ' +
				'mouseover mouseout mousemove contextmenu keypress keydown keyup', this._handleDOMEvent, this);

			if (this.options.trackResize) {
				onOff(window, 'resize', this._onResize, this);
			}

			if (any3d && this.options.transform3DLimit) {
				(remove$$1 ? this.off : this.on).call(this, 'moveend', this._onMoveEnd);
			}
		},

		_onResize: function () {
			cancelAnimFrame(this._resizeRequest);
			this._resizeRequest = requestAnimFrame(
			        function () { this.invalidateSize({debounceMoveend: true}); }, this);
		},

		_onScroll: function () {
			this._container.scrollTop  = 0;
			this._container.scrollLeft = 0;
		},

		_onMoveEnd: function () {
			var pos = this._getMapPanePos();
			if (Math.max(Math.abs(pos.x), Math.abs(pos.y)) >= this.options.transform3DLimit) {
				// https://bugzilla.mozilla.org/show_bug.cgi?id=1203873 but Webkit also have
				// a pixel offset on very high values, see: http://jsfiddle.net/dg6r5hhb/
				this._resetView(this.getCenter(), this.getZoom());
			}
		},

		_findEventTargets: function (e, type) {
			var targets = [],
			    target,
			    isHover = type === 'mouseout' || type === 'mouseover',
			    src = e.target || e.srcElement,
			    dragging = false;

			while (src) {
				target = this._targets[stamp(src)];
				if (target && (type === 'click' || type === 'preclick') && !e._simulated && this._draggableMoved(target)) {
					// Prevent firing click after you just dragged an object.
					dragging = true;
					break;
				}
				if (target && target.listens(type, true)) {
					if (isHover && !isExternalTarget(src, e)) { break; }
					targets.push(target);
					if (isHover) { break; }
				}
				if (src === this._container) { break; }
				src = src.parentNode;
			}
			if (!targets.length && !dragging && !isHover && isExternalTarget(src, e)) {
				targets = [this];
			}
			return targets;
		},

		_handleDOMEvent: function (e) {
			if (!this._loaded || skipped(e)) { return; }

			var type = e.type;

			if (type === 'mousedown' || type === 'keypress' || type === 'keyup' || type === 'keydown') {
				// prevents outline when clicking on keyboard-focusable element
				preventOutline(e.target || e.srcElement);
			}

			this._fireDOMEvent(e, type);
		},

		_mouseEvents: ['click', 'dblclick', 'mouseover', 'mouseout', 'contextmenu'],

		_fireDOMEvent: function (e, type, targets) {

			if (e.type === 'click') {
				// Fire a synthetic 'preclick' event which propagates up (mainly for closing popups).
				// @event preclick: MouseEvent
				// Fired before mouse click on the map (sometimes useful when you
				// want something to happen on click before any existing click
				// handlers start running).
				var synth = extend({}, e);
				synth.type = 'preclick';
				this._fireDOMEvent(synth, synth.type, targets);
			}

			if (e._stopped) { return; }

			// Find the layer the event is propagating from and its parents.
			targets = (targets || []).concat(this._findEventTargets(e, type));

			if (!targets.length) { return; }

			var target = targets[0];
			if (type === 'contextmenu' && target.listens(type, true)) {
				preventDefault(e);
			}

			var data = {
				originalEvent: e
			};

			if (e.type !== 'keypress' && e.type !== 'keydown' && e.type !== 'keyup') {
				var isMarker = target.getLatLng && (!target._radius || target._radius <= 10);
				data.containerPoint = isMarker ?
					this.latLngToContainerPoint(target.getLatLng()) : this.mouseEventToContainerPoint(e);
				data.layerPoint = this.containerPointToLayerPoint(data.containerPoint);
				data.latlng = isMarker ? target.getLatLng() : this.layerPointToLatLng(data.layerPoint);
			}

			for (var i = 0; i < targets.length; i++) {
				targets[i].fire(type, data, true);
				if (data.originalEvent._stopped ||
					(targets[i].options.bubblingMouseEvents === false && indexOf(this._mouseEvents, type) !== -1)) { return; }
			}
		},

		_draggableMoved: function (obj) {
			obj = obj.dragging && obj.dragging.enabled() ? obj : this;
			return (obj.dragging && obj.dragging.moved()) || (this.boxZoom && this.boxZoom.moved());
		},

		_clearHandlers: function () {
			for (var i = 0, len = this._handlers.length; i < len; i++) {
				this._handlers[i].disable();
			}
		},

		// @section Other Methods

		// @method whenReady(fn: Function, context?: Object): this
		// Runs the given function `fn` when the map gets initialized with
		// a view (center and zoom) and at least one layer, or immediately
		// if it's already initialized, optionally passing a function context.
		whenReady: function (callback, context) {
			if (this._loaded) {
				callback.call(context || this, {target: this});
			} else {
				this.on('load', callback, context);
			}
			return this;
		},


		// private methods for getting map state

		_getMapPanePos: function () {
			return getPosition(this._mapPane) || new Point(0, 0);
		},

		_moved: function () {
			var pos = this._getMapPanePos();
			return pos && !pos.equals([0, 0]);
		},

		_getTopLeftPoint: function (center, zoom) {
			var pixelOrigin = center && zoom !== undefined ?
				this._getNewPixelOrigin(center, zoom) :
				this.getPixelOrigin();
			return pixelOrigin.subtract(this._getMapPanePos());
		},

		_getNewPixelOrigin: function (center, zoom) {
			var viewHalf = this.getSize()._divideBy(2);
			return this.project(center, zoom)._subtract(viewHalf)._add(this._getMapPanePos())._round();
		},

		_latLngToNewLayerPoint: function (latlng, zoom, center) {
			var topLeft = this._getNewPixelOrigin(center, zoom);
			return this.project(latlng, zoom)._subtract(topLeft);
		},

		_latLngBoundsToNewLayerBounds: function (latLngBounds, zoom, center) {
			var topLeft = this._getNewPixelOrigin(center, zoom);
			return toBounds([
				this.project(latLngBounds.getSouthWest(), zoom)._subtract(topLeft),
				this.project(latLngBounds.getNorthWest(), zoom)._subtract(topLeft),
				this.project(latLngBounds.getSouthEast(), zoom)._subtract(topLeft),
				this.project(latLngBounds.getNorthEast(), zoom)._subtract(topLeft)
			]);
		},

		// layer point of the current center
		_getCenterLayerPoint: function () {
			return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
		},

		// offset of the specified place to the current center in pixels
		_getCenterOffset: function (latlng) {
			return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
		},

		// adjust center for view to get inside bounds
		_limitCenter: function (center, zoom, bounds) {

			if (!bounds) { return center; }

			var centerPoint = this.project(center, zoom),
			    viewHalf = this.getSize().divideBy(2),
			    viewBounds = new Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)),
			    offset = this._getBoundsOffset(viewBounds, bounds, zoom);

			// If offset is less than a pixel, ignore.
			// This prevents unstable projections from getting into
			// an infinite loop of tiny offsets.
			if (offset.round().equals([0, 0])) {
				return center;
			}

			return this.unproject(centerPoint.add(offset), zoom);
		},

		// adjust offset for view to get inside bounds
		_limitOffset: function (offset, bounds) {
			if (!bounds) { return offset; }

			var viewBounds = this.getPixelBounds(),
			    newBounds = new Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));

			return offset.add(this._getBoundsOffset(newBounds, bounds));
		},

		// returns offset needed for pxBounds to get inside maxBounds at a specified zoom
		_getBoundsOffset: function (pxBounds, maxBounds, zoom) {
			var projectedMaxBounds = toBounds(
			        this.project(maxBounds.getNorthEast(), zoom),
			        this.project(maxBounds.getSouthWest(), zoom)
			    ),
			    minOffset = projectedMaxBounds.min.subtract(pxBounds.min),
			    maxOffset = projectedMaxBounds.max.subtract(pxBounds.max),

			    dx = this._rebound(minOffset.x, -maxOffset.x),
			    dy = this._rebound(minOffset.y, -maxOffset.y);

			return new Point(dx, dy);
		},

		_rebound: function (left, right) {
			return left + right > 0 ?
				Math.round(left - right) / 2 :
				Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
		},

		_limitZoom: function (zoom) {
			var min = this.getMinZoom(),
			    max = this.getMaxZoom(),
			    snap = any3d ? this.options.zoomSnap : 1;
			if (snap) {
				zoom = Math.round(zoom / snap) * snap;
			}
			return Math.max(min, Math.min(max, zoom));
		},

		_onPanTransitionStep: function () {
			this.fire('move');
		},

		_onPanTransitionEnd: function () {
			removeClass(this._mapPane, 'leaflet-pan-anim');
			this.fire('moveend');
		},

		_tryAnimatedPan: function (center, options) {
			// difference between the new and current centers in pixels
			var offset = this._getCenterOffset(center)._trunc();

			// don't animate too far unless animate: true specified in options
			if ((options && options.animate) !== true && !this.getSize().contains(offset)) { return false; }

			this.panBy(offset, options);

			return true;
		},

		_createAnimProxy: function () {

			var proxy = this._proxy = create$1('div', 'leaflet-proxy leaflet-zoom-animated');
			this._panes.mapPane.appendChild(proxy);

			this.on('zoomanim', function (e) {
				var prop = TRANSFORM,
				    transform = this._proxy.style[prop];

				setTransform(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1));

				// workaround for case when transform is the same and so transitionend event is not fired
				if (transform === this._proxy.style[prop] && this._animatingZoom) {
					this._onZoomTransitionEnd();
				}
			}, this);

			this.on('load moveend', this._animMoveEnd, this);

			this._on('unload', this._destroyAnimProxy, this);
		},

		_destroyAnimProxy: function () {
			remove(this._proxy);
			this.off('load moveend', this._animMoveEnd, this);
			delete this._proxy;
		},

		_animMoveEnd: function () {
			var c = this.getCenter(),
			    z = this.getZoom();
			setTransform(this._proxy, this.project(c, z), this.getZoomScale(z, 1));
		},

		_catchTransitionEnd: function (e) {
			if (this._animatingZoom && e.propertyName.indexOf('transform') >= 0) {
				this._onZoomTransitionEnd();
			}
		},

		_nothingToAnimate: function () {
			return !this._container.getElementsByClassName('leaflet-zoom-animated').length;
		},

		_tryAnimatedZoom: function (center, zoom, options) {

			if (this._animatingZoom) { return true; }

			options = options || {};

			// don't animate if disabled, not supported or zoom difference is too large
			if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() ||
			        Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) { return false; }

			// offset is the pixel coords of the zoom origin relative to the current center
			var scale = this.getZoomScale(zoom),
			    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale);

			// don't animate if the zoom origin isn't within one screen from the current center, unless forced
			if (options.animate !== true && !this.getSize().contains(offset)) { return false; }

			requestAnimFrame(function () {
				this
				    ._moveStart(true, false)
				    ._animateZoom(center, zoom, true);
			}, this);

			return true;
		},

		_animateZoom: function (center, zoom, startAnim, noUpdate) {
			if (!this._mapPane) { return; }

			if (startAnim) {
				this._animatingZoom = true;

				// remember what center/zoom to set after animation
				this._animateToCenter = center;
				this._animateToZoom = zoom;

				addClass(this._mapPane, 'leaflet-zoom-anim');
			}

			// @section Other Events
			// @event zoomanim: ZoomAnimEvent
			// Fired at least once per zoom animation. For continuous zoom, like pinch zooming, fired once per frame during zoom.
			this.fire('zoomanim', {
				center: center,
				zoom: zoom,
				noUpdate: noUpdate
			});

			// Work around webkit not firing 'transitionend', see https://github.com/Leaflet/Leaflet/issues/3689, 2693
			setTimeout(bind(this._onZoomTransitionEnd, this), 250);
		},

		_onZoomTransitionEnd: function () {
			if (!this._animatingZoom) { return; }

			if (this._mapPane) {
				removeClass(this._mapPane, 'leaflet-zoom-anim');
			}

			this._animatingZoom = false;

			this._move(this._animateToCenter, this._animateToZoom);

			// This anim frame should prevent an obscure iOS webkit tile loading race condition.
			requestAnimFrame(function () {
				this._moveEnd(true);
			}, this);
		}
	});

	// @section

	// @factory L.map(id: String, options?: Map options)
	// Instantiates a map object given the DOM ID of a `<div>` element
	// and optionally an object literal with `Map options`.
	//
	// @alternative
	// @factory L.map(el: HTMLElement, options?: Map options)
	// Instantiates a map object given an instance of a `<div>` HTML element
	// and optionally an object literal with `Map options`.
	function createMap(id, options) {
		return new Map(id, options);
	}

	/*
	 * @class Control
	 * @aka L.Control
	 * @inherits Class
	 *
	 * L.Control is a base class for implementing map controls. Handles positioning.
	 * All other controls extend from this class.
	 */

	var Control = Class.extend({
		// @section
		// @aka Control options
		options: {
			// @option position: String = 'topright'
			// The position of the control (one of the map corners). Possible values are `'topleft'`,
			// `'topright'`, `'bottomleft'` or `'bottomright'`
			position: 'topright'
		},

		initialize: function (options) {
			setOptions(this, options);
		},

		/* @section
		 * Classes extending L.Control will inherit the following methods:
		 *
		 * @method getPosition: string
		 * Returns the position of the control.
		 */
		getPosition: function () {
			return this.options.position;
		},

		// @method setPosition(position: string): this
		// Sets the position of the control.
		setPosition: function (position) {
			var map = this._map;

			if (map) {
				map.removeControl(this);
			}

			this.options.position = position;

			if (map) {
				map.addControl(this);
			}

			return this;
		},

		// @method getContainer: HTMLElement
		// Returns the HTMLElement that contains the control.
		getContainer: function () {
			return this._container;
		},

		// @method addTo(map: Map): this
		// Adds the control to the given map.
		addTo: function (map) {
			this.remove();
			this._map = map;

			var container = this._container = this.onAdd(map),
			    pos = this.getPosition(),
			    corner = map._controlCorners[pos];

			addClass(container, 'leaflet-control');

			if (pos.indexOf('bottom') !== -1) {
				corner.insertBefore(container, corner.firstChild);
			} else {
				corner.appendChild(container);
			}

			this._map.on('unload', this.remove, this);

			return this;
		},

		// @method remove: this
		// Removes the control from the map it is currently active on.
		remove: function () {
			if (!this._map) {
				return this;
			}

			remove(this._container);

			if (this.onRemove) {
				this.onRemove(this._map);
			}

			this._map.off('unload', this.remove, this);
			this._map = null;

			return this;
		},

		_refocusOnMap: function (e) {
			// if map exists and event is not a keyboard event
			if (this._map && e && e.screenX > 0 && e.screenY > 0) {
				this._map.getContainer().focus();
			}
		}
	});

	var control = function (options) {
		return new Control(options);
	};

	/* @section Extension methods
	 * @uninheritable
	 *
	 * Every control should extend from `L.Control` and (re-)implement the following methods.
	 *
	 * @method onAdd(map: Map): HTMLElement
	 * Should return the container DOM element for the control and add listeners on relevant map events. Called on [`control.addTo(map)`](#control-addTo).
	 *
	 * @method onRemove(map: Map)
	 * Optional method. Should contain all clean up code that removes the listeners previously added in [`onAdd`](#control-onadd). Called on [`control.remove()`](#control-remove).
	 */

	/* @namespace Map
	 * @section Methods for Layers and Controls
	 */
	Map.include({
		// @method addControl(control: Control): this
		// Adds the given control to the map
		addControl: function (control) {
			control.addTo(this);
			return this;
		},

		// @method removeControl(control: Control): this
		// Removes the given control from the map
		removeControl: function (control) {
			control.remove();
			return this;
		},

		_initControlPos: function () {
			var corners = this._controlCorners = {},
			    l = 'leaflet-',
			    container = this._controlContainer =
			            create$1('div', l + 'control-container', this._container);

			function createCorner(vSide, hSide) {
				var className = l + vSide + ' ' + l + hSide;

				corners[vSide + hSide] = create$1('div', className, container);
			}

			createCorner('top', 'left');
			createCorner('top', 'right');
			createCorner('bottom', 'left');
			createCorner('bottom', 'right');
		},

		_clearControlPos: function () {
			for (var i in this._controlCorners) {
				remove(this._controlCorners[i]);
			}
			remove(this._controlContainer);
			delete this._controlCorners;
			delete this._controlContainer;
		}
	});

	/*
	 * @class Control.Layers
	 * @aka L.Control.Layers
	 * @inherits Control
	 *
	 * The layers control gives users the ability to switch between different base layers and switch overlays on/off (check out the [detailed example](http://leafletjs.com/examples/layers-control/)). Extends `Control`.
	 *
	 * @example
	 *
	 * ```js
	 * var baseLayers = {
	 * 	"Mapbox": mapbox,
	 * 	"OpenStreetMap": osm
	 * };
	 *
	 * var overlays = {
	 * 	"Marker": marker,
	 * 	"Roads": roadsLayer
	 * };
	 *
	 * L.control.layers(baseLayers, overlays).addTo(map);
	 * ```
	 *
	 * The `baseLayers` and `overlays` parameters are object literals with layer names as keys and `Layer` objects as values:
	 *
	 * ```js
	 * {
	 *     "<someName1>": layer1,
	 *     "<someName2>": layer2
	 * }
	 * ```
	 *
	 * The layer names can contain HTML, which allows you to add additional styling to the items:
	 *
	 * ```js
	 * {"<img src='my-layer-icon' /> <span class='my-layer-item'>My Layer</span>": myLayer}
	 * ```
	 */

	var Layers = Control.extend({
		// @section
		// @aka Control.Layers options
		options: {
			// @option collapsed: Boolean = true
			// If `true`, the control will be collapsed into an icon and expanded on mouse hover or touch.
			collapsed: true,
			position: 'topright',

			// @option autoZIndex: Boolean = true
			// If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
			autoZIndex: true,

			// @option hideSingleBase: Boolean = false
			// If `true`, the base layers in the control will be hidden when there is only one.
			hideSingleBase: false,

			// @option sortLayers: Boolean = false
			// Whether to sort the layers. When `false`, layers will keep the order
			// in which they were added to the control.
			sortLayers: false,

			// @option sortFunction: Function = *
			// A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
			// that will be used for sorting the layers, when `sortLayers` is `true`.
			// The function receives both the `L.Layer` instances and their names, as in
			// `sortFunction(layerA, layerB, nameA, nameB)`.
			// By default, it sorts layers alphabetically by their name.
			sortFunction: function (layerA, layerB, nameA, nameB) {
				return nameA < nameB ? -1 : (nameB < nameA ? 1 : 0);
			}
		},

		initialize: function (baseLayers, overlays, options) {
			setOptions(this, options);

			this._layerControlInputs = [];
			this._layers = [];
			this._lastZIndex = 0;
			this._handlingClick = false;

			for (var i in baseLayers) {
				this._addLayer(baseLayers[i], i);
			}

			for (i in overlays) {
				this._addLayer(overlays[i], i, true);
			}
		},

		onAdd: function (map) {
			this._initLayout();
			this._update();

			this._map = map;
			map.on('zoomend', this._checkDisabledLayers, this);

			for (var i = 0; i < this._layers.length; i++) {
				this._layers[i].layer.on('add remove', this._onLayerChange, this);
			}

			return this._container;
		},

		addTo: function (map) {
			Control.prototype.addTo.call(this, map);
			// Trigger expand after Layers Control has been inserted into DOM so that is now has an actual height.
			return this._expandIfNotCollapsed();
		},

		onRemove: function () {
			this._map.off('zoomend', this._checkDisabledLayers, this);

			for (var i = 0; i < this._layers.length; i++) {
				this._layers[i].layer.off('add remove', this._onLayerChange, this);
			}
		},

		// @method addBaseLayer(layer: Layer, name: String): this
		// Adds a base layer (radio button entry) with the given name to the control.
		addBaseLayer: function (layer, name) {
			this._addLayer(layer, name);
			return (this._map) ? this._update() : this;
		},

		// @method addOverlay(layer: Layer, name: String): this
		// Adds an overlay (checkbox entry) with the given name to the control.
		addOverlay: function (layer, name) {
			this._addLayer(layer, name, true);
			return (this._map) ? this._update() : this;
		},

		// @method removeLayer(layer: Layer): this
		// Remove the given layer from the control.
		removeLayer: function (layer) {
			layer.off('add remove', this._onLayerChange, this);

			var obj = this._getLayer(stamp(layer));
			if (obj) {
				this._layers.splice(this._layers.indexOf(obj), 1);
			}
			return (this._map) ? this._update() : this;
		},

		// @method expand(): this
		// Expand the control container if collapsed.
		expand: function () {
			addClass(this._container, 'leaflet-control-layers-expanded');
			this._section.style.height = null;
			var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);
			if (acceptableHeight < this._section.clientHeight) {
				addClass(this._section, 'leaflet-control-layers-scrollbar');
				this._section.style.height = acceptableHeight + 'px';
			} else {
				removeClass(this._section, 'leaflet-control-layers-scrollbar');
			}
			this._checkDisabledLayers();
			return this;
		},

		// @method collapse(): this
		// Collapse the control container if expanded.
		collapse: function () {
			removeClass(this._container, 'leaflet-control-layers-expanded');
			return this;
		},

		_initLayout: function () {
			var className = 'leaflet-control-layers',
			    container = this._container = create$1('div', className),
			    collapsed = this.options.collapsed;

			// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
			container.setAttribute('aria-haspopup', true);

			disableClickPropagation(container);
			disableScrollPropagation(container);

			var section = this._section = create$1('section', className + '-list');

			if (collapsed) {
				this._map.on('click', this.collapse, this);

				if (!android) {
					on(container, {
						mouseenter: this.expand,
						mouseleave: this.collapse
					}, this);
				}
			}

			var link = this._layersLink = create$1('a', className + '-toggle', container);
			link.href = '#';
			link.title = 'Layers';

			if (touch) {
				on(link, 'click', stop);
				on(link, 'click', this.expand, this);
			} else {
				on(link, 'focus', this.expand, this);
			}

			if (!collapsed) {
				this.expand();
			}

			this._baseLayersList = create$1('div', className + '-base', section);
			this._separator = create$1('div', className + '-separator', section);
			this._overlaysList = create$1('div', className + '-overlays', section);

			container.appendChild(section);
		},

		_getLayer: function (id) {
			for (var i = 0; i < this._layers.length; i++) {

				if (this._layers[i] && stamp(this._layers[i].layer) === id) {
					return this._layers[i];
				}
			}
		},

		_addLayer: function (layer, name, overlay) {
			if (this._map) {
				layer.on('add remove', this._onLayerChange, this);
			}

			this._layers.push({
				layer: layer,
				name: name,
				overlay: overlay
			});

			if (this.options.sortLayers) {
				this._layers.sort(bind(function (a, b) {
					return this.options.sortFunction(a.layer, b.layer, a.name, b.name);
				}, this));
			}

			if (this.options.autoZIndex && layer.setZIndex) {
				this._lastZIndex++;
				layer.setZIndex(this._lastZIndex);
			}

			this._expandIfNotCollapsed();
		},

		_update: function () {
			if (!this._container) { return this; }

			empty(this._baseLayersList);
			empty(this._overlaysList);

			this._layerControlInputs = [];
			var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;

			for (i = 0; i < this._layers.length; i++) {
				obj = this._layers[i];
				this._addItem(obj);
				overlaysPresent = overlaysPresent || obj.overlay;
				baseLayersPresent = baseLayersPresent || !obj.overlay;
				baseLayersCount += !obj.overlay ? 1 : 0;
			}

			// Hide base layers section if there's only one layer.
			if (this.options.hideSingleBase) {
				baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
				this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
			}

			this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

			return this;
		},

		_onLayerChange: function (e) {
			if (!this._handlingClick) {
				this._update();
			}

			var obj = this._getLayer(stamp(e.target));

			// @namespace Map
			// @section Layer events
			// @event baselayerchange: LayersControlEvent
			// Fired when the base layer is changed through the [layer control](#control-layers).
			// @event overlayadd: LayersControlEvent
			// Fired when an overlay is selected through the [layer control](#control-layers).
			// @event overlayremove: LayersControlEvent
			// Fired when an overlay is deselected through the [layer control](#control-layers).
			// @namespace Control.Layers
			var type = obj.overlay ?
				(e.type === 'add' ? 'overlayadd' : 'overlayremove') :
				(e.type === 'add' ? 'baselayerchange' : null);

			if (type) {
				this._map.fire(type, obj);
			}
		},

		// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
		_createRadioElement: function (name, checked) {

			var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' +
					name + '"' + (checked ? ' checked="checked"' : '') + '/>';

			var radioFragment = document.createElement('div');
			radioFragment.innerHTML = radioHtml;

			return radioFragment.firstChild;
		},

		_addItem: function (obj) {
			var label = document.createElement('label'),
			    checked = this._map.hasLayer(obj.layer),
			    input;

			if (obj.overlay) {
				input = document.createElement('input');
				input.type = 'checkbox';
				input.className = 'leaflet-control-layers-selector';
				input.defaultChecked = checked;
			} else {
				input = this._createRadioElement('leaflet-base-layers_' + stamp(this), checked);
			}

			this._layerControlInputs.push(input);
			input.layerId = stamp(obj.layer);

			on(input, 'click', this._onInputClick, this);

			var name = document.createElement('span');
			name.innerHTML = ' ' + obj.name;

			// Helps from preventing layer control flicker when checkboxes are disabled
			// https://github.com/Leaflet/Leaflet/issues/2771
			var holder = document.createElement('div');

			label.appendChild(holder);
			holder.appendChild(input);
			holder.appendChild(name);

			var container = obj.overlay ? this._overlaysList : this._baseLayersList;
			container.appendChild(label);

			this._checkDisabledLayers();
			return label;
		},

		_onInputClick: function () {
			var inputs = this._layerControlInputs,
			    input, layer;
			var addedLayers = [],
			    removedLayers = [];

			this._handlingClick = true;

			for (var i = inputs.length - 1; i >= 0; i--) {
				input = inputs[i];
				layer = this._getLayer(input.layerId).layer;

				if (input.checked) {
					addedLayers.push(layer);
				} else if (!input.checked) {
					removedLayers.push(layer);
				}
			}

			// Bugfix issue 2318: Should remove all old layers before readding new ones
			for (i = 0; i < removedLayers.length; i++) {
				if (this._map.hasLayer(removedLayers[i])) {
					this._map.removeLayer(removedLayers[i]);
				}
			}
			for (i = 0; i < addedLayers.length; i++) {
				if (!this._map.hasLayer(addedLayers[i])) {
					this._map.addLayer(addedLayers[i]);
				}
			}

			this._handlingClick = false;

			this._refocusOnMap();
		},

		_checkDisabledLayers: function () {
			var inputs = this._layerControlInputs,
			    input,
			    layer,
			    zoom = this._map.getZoom();

			for (var i = inputs.length - 1; i >= 0; i--) {
				input = inputs[i];
				layer = this._getLayer(input.layerId).layer;
				input.disabled = (layer.options.minZoom !== undefined && zoom < layer.options.minZoom) ||
				                 (layer.options.maxZoom !== undefined && zoom > layer.options.maxZoom);

			}
		},

		_expandIfNotCollapsed: function () {
			if (this._map && !this.options.collapsed) {
				this.expand();
			}
			return this;
		},

		_expand: function () {
			// Backward compatibility, remove me in 1.1.
			return this.expand();
		},

		_collapse: function () {
			// Backward compatibility, remove me in 1.1.
			return this.collapse();
		}

	});


	// @factory L.control.layers(baselayers?: Object, overlays?: Object, options?: Control.Layers options)
	// Creates a layers control with the given layers. Base layers will be switched with radio buttons, while overlays will be switched with checkboxes. Note that all base layers should be passed in the base layers object, but only one should be added to the map during map instantiation.
	var layers = function (baseLayers, overlays, options) {
		return new Layers(baseLayers, overlays, options);
	};

	/*
	 * @class Control.Zoom
	 * @aka L.Control.Zoom
	 * @inherits Control
	 *
	 * A basic zoom control with two buttons (zoom in and zoom out). It is put on the map by default unless you set its [`zoomControl` option](#map-zoomcontrol) to `false`. Extends `Control`.
	 */

	var Zoom = Control.extend({
		// @section
		// @aka Control.Zoom options
		options: {
			position: 'topleft',

			// @option zoomInText: String = '+'
			// The text set on the 'zoom in' button.
			zoomInText: '+',

			// @option zoomInTitle: String = 'Zoom in'
			// The title set on the 'zoom in' button.
			zoomInTitle: 'Zoom in',

			// @option zoomOutText: String = '&#x2212;'
			// The text set on the 'zoom out' button.
			zoomOutText: '&#x2212;',

			// @option zoomOutTitle: String = 'Zoom out'
			// The title set on the 'zoom out' button.
			zoomOutTitle: 'Zoom out'
		},

		onAdd: function (map) {
			var zoomName = 'leaflet-control-zoom',
			    container = create$1('div', zoomName + ' leaflet-bar'),
			    options = this.options;

			this._zoomInButton  = this._createButton(options.zoomInText, options.zoomInTitle,
			        zoomName + '-in',  container, this._zoomIn);
			this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
			        zoomName + '-out', container, this._zoomOut);

			this._updateDisabled();
			map.on('zoomend zoomlevelschange', this._updateDisabled, this);

			return container;
		},

		onRemove: function (map) {
			map.off('zoomend zoomlevelschange', this._updateDisabled, this);
		},

		disable: function () {
			this._disabled = true;
			this._updateDisabled();
			return this;
		},

		enable: function () {
			this._disabled = false;
			this._updateDisabled();
			return this;
		},

		_zoomIn: function (e) {
			if (!this._disabled && this._map._zoom < this._map.getMaxZoom()) {
				this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
			}
		},

		_zoomOut: function (e) {
			if (!this._disabled && this._map._zoom > this._map.getMinZoom()) {
				this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
			}
		},

		_createButton: function (html, title, className, container, fn) {
			var link = create$1('a', className, container);
			link.innerHTML = html;
			link.href = '#';
			link.title = title;

			/*
			 * Will force screen readers like VoiceOver to read this as "Zoom in - button"
			 */
			link.setAttribute('role', 'button');
			link.setAttribute('aria-label', title);

			disableClickPropagation(link);
			on(link, 'click', stop);
			on(link, 'click', fn, this);
			on(link, 'click', this._refocusOnMap, this);

			return link;
		},

		_updateDisabled: function () {
			var map = this._map,
			    className = 'leaflet-disabled';

			removeClass(this._zoomInButton, className);
			removeClass(this._zoomOutButton, className);

			if (this._disabled || map._zoom === map.getMinZoom()) {
				addClass(this._zoomOutButton, className);
			}
			if (this._disabled || map._zoom === map.getMaxZoom()) {
				addClass(this._zoomInButton, className);
			}
		}
	});

	// @namespace Map
	// @section Control options
	// @option zoomControl: Boolean = true
	// Whether a [zoom control](#control-zoom) is added to the map by default.
	Map.mergeOptions({
		zoomControl: true
	});

	Map.addInitHook(function () {
		if (this.options.zoomControl) {
			// @section Controls
			// @property zoomControl: Control.Zoom
			// The default zoom control (only available if the
			// [`zoomControl` option](#map-zoomcontrol) was `true` when creating the map).
			this.zoomControl = new Zoom();
			this.addControl(this.zoomControl);
		}
	});

	// @namespace Control.Zoom
	// @factory L.control.zoom(options: Control.Zoom options)
	// Creates a zoom control
	var zoom = function (options) {
		return new Zoom(options);
	};

	/*
	 * @class Control.Scale
	 * @aka L.Control.Scale
	 * @inherits Control
	 *
	 * A simple scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems. Extends `Control`.
	 *
	 * @example
	 *
	 * ```js
	 * L.control.scale().addTo(map);
	 * ```
	 */

	var Scale = Control.extend({
		// @section
		// @aka Control.Scale options
		options: {
			position: 'bottomleft',

			// @option maxWidth: Number = 100
			// Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
			maxWidth: 100,

			// @option metric: Boolean = True
			// Whether to show the metric scale line (m/km).
			metric: true,

			// @option imperial: Boolean = True
			// Whether to show the imperial scale line (mi/ft).
			imperial: true

			// @option updateWhenIdle: Boolean = false
			// If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
		},

		onAdd: function (map) {
			var className = 'leaflet-control-scale',
			    container = create$1('div', className),
			    options = this.options;

			this._addScales(options, className + '-line', container);

			map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
			map.whenReady(this._update, this);

			return container;
		},

		onRemove: function (map) {
			map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
		},

		_addScales: function (options, className, container) {
			if (options.metric) {
				this._mScale = create$1('div', className, container);
			}
			if (options.imperial) {
				this._iScale = create$1('div', className, container);
			}
		},

		_update: function () {
			var map = this._map,
			    y = map.getSize().y / 2;

			var maxMeters = map.distance(
				map.containerPointToLatLng([0, y]),
				map.containerPointToLatLng([this.options.maxWidth, y]));

			this._updateScales(maxMeters);
		},

		_updateScales: function (maxMeters) {
			if (this.options.metric && maxMeters) {
				this._updateMetric(maxMeters);
			}
			if (this.options.imperial && maxMeters) {
				this._updateImperial(maxMeters);
			}
		},

		_updateMetric: function (maxMeters) {
			var meters = this._getRoundNum(maxMeters),
			    label = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';

			this._updateScale(this._mScale, label, meters / maxMeters);
		},

		_updateImperial: function (maxMeters) {
			var maxFeet = maxMeters * 3.2808399,
			    maxMiles, miles, feet;

			if (maxFeet > 5280) {
				maxMiles = maxFeet / 5280;
				miles = this._getRoundNum(maxMiles);
				this._updateScale(this._iScale, miles + ' mi', miles / maxMiles);

			} else {
				feet = this._getRoundNum(maxFeet);
				this._updateScale(this._iScale, feet + ' ft', feet / maxFeet);
			}
		},

		_updateScale: function (scale, text, ratio) {
			scale.style.width = Math.round(this.options.maxWidth * ratio) + 'px';
			scale.innerHTML = text;
		},

		_getRoundNum: function (num) {
			var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
			    d = num / pow10;

			d = d >= 10 ? 10 :
			    d >= 5 ? 5 :
			    d >= 3 ? 3 :
			    d >= 2 ? 2 : 1;

			return pow10 * d;
		}
	});


	// @factory L.control.scale(options?: Control.Scale options)
	// Creates an scale control with the given options.
	var scale = function (options) {
		return new Scale(options);
	};

	/*
	 * @class Control.Attribution
	 * @aka L.Control.Attribution
	 * @inherits Control
	 *
	 * The attribution control allows you to display attribution data in a small text box on a map. It is put on the map by default unless you set its [`attributionControl` option](#map-attributioncontrol) to `false`, and it fetches attribution texts from layers with the [`getAttribution` method](#layer-getattribution) automatically. Extends Control.
	 */

	var Attribution = Control.extend({
		// @section
		// @aka Control.Attribution options
		options: {
			position: 'bottomright',

			// @option prefix: String = 'Leaflet'
			// The HTML text shown before the attributions. Pass `false` to disable.
			prefix: '<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
		},

		initialize: function (options) {
			setOptions(this, options);

			this._attributions = {};
		},

		onAdd: function (map) {
			map.attributionControl = this;
			this._container = create$1('div', 'leaflet-control-attribution');
			disableClickPropagation(this._container);

			// TODO ugly, refactor
			for (var i in map._layers) {
				if (map._layers[i].getAttribution) {
					this.addAttribution(map._layers[i].getAttribution());
				}
			}

			this._update();

			return this._container;
		},

		// @method setPrefix(prefix: String): this
		// Sets the text before the attributions.
		setPrefix: function (prefix) {
			this.options.prefix = prefix;
			this._update();
			return this;
		},

		// @method addAttribution(text: String): this
		// Adds an attribution text (e.g. `'Vector data &copy; Mapbox'`).
		addAttribution: function (text) {
			if (!text) { return this; }

			if (!this._attributions[text]) {
				this._attributions[text] = 0;
			}
			this._attributions[text]++;

			this._update();

			return this;
		},

		// @method removeAttribution(text: String): this
		// Removes an attribution text.
		removeAttribution: function (text) {
			if (!text) { return this; }

			if (this._attributions[text]) {
				this._attributions[text]--;
				this._update();
			}

			return this;
		},

		_update: function () {
			if (!this._map) { return; }

			var attribs = [];

			for (var i in this._attributions) {
				if (this._attributions[i]) {
					attribs.push(i);
				}
			}

			var prefixAndAttribs = [];

			if (this.options.prefix) {
				prefixAndAttribs.push(this.options.prefix);
			}
			if (attribs.length) {
				prefixAndAttribs.push(attribs.join(', '));
			}

			this._container.innerHTML = prefixAndAttribs.join(' | ');
		}
	});

	// @namespace Map
	// @section Control options
	// @option attributionControl: Boolean = true
	// Whether a [attribution control](#control-attribution) is added to the map by default.
	Map.mergeOptions({
		attributionControl: true
	});

	Map.addInitHook(function () {
		if (this.options.attributionControl) {
			new Attribution().addTo(this);
		}
	});

	// @namespace Control.Attribution
	// @factory L.control.attribution(options: Control.Attribution options)
	// Creates an attribution control.
	var attribution = function (options) {
		return new Attribution(options);
	};

	Control.Layers = Layers;
	Control.Zoom = Zoom;
	Control.Scale = Scale;
	Control.Attribution = Attribution;

	control.layers = layers;
	control.zoom = zoom;
	control.scale = scale;
	control.attribution = attribution;

	/*
		L.Handler is a base class for handler classes that are used internally to inject
		interaction features like dragging to classes like Map and Marker.
	*/

	// @class Handler
	// @aka L.Handler
	// Abstract class for map interaction handlers

	var Handler = Class.extend({
		initialize: function (map) {
			this._map = map;
		},

		// @method enable(): this
		// Enables the handler
		enable: function () {
			if (this._enabled) { return this; }

			this._enabled = true;
			this.addHooks();
			return this;
		},

		// @method disable(): this
		// Disables the handler
		disable: function () {
			if (!this._enabled) { return this; }

			this._enabled = false;
			this.removeHooks();
			return this;
		},

		// @method enabled(): Boolean
		// Returns `true` if the handler is enabled
		enabled: function () {
			return !!this._enabled;
		}

		// @section Extension methods
		// Classes inheriting from `Handler` must implement the two following methods:
		// @method addHooks()
		// Called when the handler is enabled, should add event hooks.
		// @method removeHooks()
		// Called when the handler is disabled, should remove the event hooks added previously.
	});

	// @section There is static function which can be called without instantiating L.Handler:
	// @function addTo(map: Map, name: String): this
	// Adds a new Handler to the given map with the given name.
	Handler.addTo = function (map, name) {
		map.addHandler(name, this);
		return this;
	};

	var Mixin = {Events: Events};

	/*
	 * @class Draggable
	 * @aka L.Draggable
	 * @inherits Evented
	 *
	 * A class for making DOM elements draggable (including touch support).
	 * Used internally for map and marker dragging. Only works for elements
	 * that were positioned with [`L.DomUtil.setPosition`](#domutil-setposition).
	 *
	 * @example
	 * ```js
	 * var draggable = new L.Draggable(elementToDrag);
	 * draggable.enable();
	 * ```
	 */

	var START = touch ? 'touchstart mousedown' : 'mousedown';
	var END = {
		mousedown: 'mouseup',
		touchstart: 'touchend',
		pointerdown: 'touchend',
		MSPointerDown: 'touchend'
	};
	var MOVE = {
		mousedown: 'mousemove',
		touchstart: 'touchmove',
		pointerdown: 'touchmove',
		MSPointerDown: 'touchmove'
	};


	var Draggable = Evented.extend({

		options: {
			// @section
			// @aka Draggable options
			// @option clickTolerance: Number = 3
			// The max number of pixels a user can shift the mouse pointer during a click
			// for it to be considered a valid click (as opposed to a mouse drag).
			clickTolerance: 3
		},

		// @constructor L.Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline?: Boolean, options?: Draggable options)
		// Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
		initialize: function (element, dragStartTarget, preventOutline$$1, options) {
			setOptions(this, options);

			this._element = element;
			this._dragStartTarget = dragStartTarget || element;
			this._preventOutline = preventOutline$$1;
		},

		// @method enable()
		// Enables the dragging ability
		enable: function () {
			if (this._enabled) { return; }

			on(this._dragStartTarget, START, this._onDown, this);

			this._enabled = true;
		},

		// @method disable()
		// Disables the dragging ability
		disable: function () {
			if (!this._enabled) { return; }

			// If we're currently dragging this draggable,
			// disabling it counts as first ending the drag.
			if (Draggable._dragging === this) {
				this.finishDrag();
			}

			off(this._dragStartTarget, START, this._onDown, this);

			this._enabled = false;
			this._moved = false;
		},

		_onDown: function (e) {
			// Ignore simulated events, since we handle both touch and
			// mouse explicitly; otherwise we risk getting duplicates of
			// touch events, see #4315.
			// Also ignore the event if disabled; this happens in IE11
			// under some circumstances, see #3666.
			if (e._simulated || !this._enabled) { return; }

			this._moved = false;

			if (hasClass(this._element, 'leaflet-zoom-anim')) { return; }

			if (Draggable._dragging || e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }
			Draggable._dragging = this;  // Prevent dragging multiple objects at once.

			if (this._preventOutline) {
				preventOutline(this._element);
			}

			disableImageDrag();
			disableTextSelection();

			if (this._moving) { return; }

			// @event down: Event
			// Fired when a drag is about to start.
			this.fire('down');

			var first = e.touches ? e.touches[0] : e,
			    sizedParent = getSizedParentNode(this._element);

			this._startPoint = new Point(first.clientX, first.clientY);

			// Cache the scale, so that we can continuously compensate for it during drag (_onMove).
			this._parentScale = getScale(sizedParent);

			on(document, MOVE[e.type], this._onMove, this);
			on(document, END[e.type], this._onUp, this);
		},

		_onMove: function (e) {
			// Ignore simulated events, since we handle both touch and
			// mouse explicitly; otherwise we risk getting duplicates of
			// touch events, see #4315.
			// Also ignore the event if disabled; this happens in IE11
			// under some circumstances, see #3666.
			if (e._simulated || !this._enabled) { return; }

			if (e.touches && e.touches.length > 1) {
				this._moved = true;
				return;
			}

			var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
			    offset = new Point(first.clientX, first.clientY)._subtract(this._startPoint);

			if (!offset.x && !offset.y) { return; }
			if (Math.abs(offset.x) + Math.abs(offset.y) < this.options.clickTolerance) { return; }

			// We assume that the parent container's position, border and scale do not change for the duration of the drag.
			// Therefore there is no need to account for the position and border (they are eliminated by the subtraction)
			// and we can use the cached value for the scale.
			offset.x /= this._parentScale.x;
			offset.y /= this._parentScale.y;

			preventDefault(e);

			if (!this._moved) {
				// @event dragstart: Event
				// Fired when a drag starts
				this.fire('dragstart');

				this._moved = true;
				this._startPos = getPosition(this._element).subtract(offset);

				addClass(document.body, 'leaflet-dragging');

				this._lastTarget = e.target || e.srcElement;
				// IE and Edge do not give the <use> element, so fetch it
				// if necessary
				if ((window.SVGElementInstance) && (this._lastTarget instanceof SVGElementInstance)) {
					this._lastTarget = this._lastTarget.correspondingUseElement;
				}
				addClass(this._lastTarget, 'leaflet-drag-target');
			}

			this._newPos = this._startPos.add(offset);
			this._moving = true;

			cancelAnimFrame(this._animRequest);
			this._lastEvent = e;
			this._animRequest = requestAnimFrame(this._updatePosition, this, true);
		},

		_updatePosition: function () {
			var e = {originalEvent: this._lastEvent};

			// @event predrag: Event
			// Fired continuously during dragging *before* each corresponding
			// update of the element's position.
			this.fire('predrag', e);
			setPosition(this._element, this._newPos);

			// @event drag: Event
			// Fired continuously during dragging.
			this.fire('drag', e);
		},

		_onUp: function (e) {
			// Ignore simulated events, since we handle both touch and
			// mouse explicitly; otherwise we risk getting duplicates of
			// touch events, see #4315.
			// Also ignore the event if disabled; this happens in IE11
			// under some circumstances, see #3666.
			if (e._simulated || !this._enabled) { return; }
			this.finishDrag();
		},

		finishDrag: function () {
			removeClass(document.body, 'leaflet-dragging');

			if (this._lastTarget) {
				removeClass(this._lastTarget, 'leaflet-drag-target');
				this._lastTarget = null;
			}

			for (var i in MOVE) {
				off(document, MOVE[i], this._onMove, this);
				off(document, END[i], this._onUp, this);
			}

			enableImageDrag();
			enableTextSelection();

			if (this._moved && this._moving) {
				// ensure drag is not fired after dragend
				cancelAnimFrame(this._animRequest);

				// @event dragend: DragEndEvent
				// Fired when the drag ends.
				this.fire('dragend', {
					distance: this._newPos.distanceTo(this._startPos)
				});
			}

			this._moving = false;
			Draggable._dragging = false;
		}

	});

	/*
	 * @namespace LineUtil
	 *
	 * Various utility functions for polyline points processing, used by Leaflet internally to make polylines lightning-fast.
	 */

	// Simplify polyline with vertex reduction and Douglas-Peucker simplification.
	// Improves rendering performance dramatically by lessening the number of points to draw.

	// @function simplify(points: Point[], tolerance: Number): Point[]
	// Dramatically reduces the number of points in a polyline while retaining
	// its shape and returns a new array of simplified points, using the
	// [Douglas-Peucker algorithm](http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm).
	// Used for a huge performance boost when processing/displaying Leaflet polylines for
	// each zoom level and also reducing visual noise. tolerance affects the amount of
	// simplification (lesser value means higher quality but slower and with more points).
	// Also released as a separated micro-library [Simplify.js](http://mourner.github.com/simplify-js/).
	function simplify(points, tolerance) {
		if (!tolerance || !points.length) {
			return points.slice();
		}

		var sqTolerance = tolerance * tolerance;

		    // stage 1: vertex reduction
		    points = _reducePoints(points, sqTolerance);

		    // stage 2: Douglas-Peucker simplification
		    points = _simplifyDP(points, sqTolerance);

		return points;
	}

	// @function pointToSegmentDistance(p: Point, p1: Point, p2: Point): Number
	// Returns the distance between point `p` and segment `p1` to `p2`.
	function pointToSegmentDistance(p, p1, p2) {
		return Math.sqrt(_sqClosestPointOnSegment(p, p1, p2, true));
	}

	// @function closestPointOnSegment(p: Point, p1: Point, p2: Point): Number
	// Returns the closest point from a point `p` on a segment `p1` to `p2`.
	function closestPointOnSegment(p, p1, p2) {
		return _sqClosestPointOnSegment(p, p1, p2);
	}

	// Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
	function _simplifyDP(points, sqTolerance) {

		var len = points.length,
		    ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
		    markers = new ArrayConstructor(len);

		    markers[0] = markers[len - 1] = 1;

		_simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

		var i,
		    newPoints = [];

		for (i = 0; i < len; i++) {
			if (markers[i]) {
				newPoints.push(points[i]);
			}
		}

		return newPoints;
	}

	function _simplifyDPStep(points, markers, sqTolerance, first, last) {

		var maxSqDist = 0,
		index, i, sqDist;

		for (i = first + 1; i <= last - 1; i++) {
			sqDist = _sqClosestPointOnSegment(points[i], points[first], points[last], true);

			if (sqDist > maxSqDist) {
				index = i;
				maxSqDist = sqDist;
			}
		}

		if (maxSqDist > sqTolerance) {
			markers[index] = 1;

			_simplifyDPStep(points, markers, sqTolerance, first, index);
			_simplifyDPStep(points, markers, sqTolerance, index, last);
		}
	}

	// reduce points that are too close to each other to a single point
	function _reducePoints(points, sqTolerance) {
		var reducedPoints = [points[0]];

		for (var i = 1, prev = 0, len = points.length; i < len; i++) {
			if (_sqDist(points[i], points[prev]) > sqTolerance) {
				reducedPoints.push(points[i]);
				prev = i;
			}
		}
		if (prev < len - 1) {
			reducedPoints.push(points[len - 1]);
		}
		return reducedPoints;
	}

	var _lastCode;

	// @function clipSegment(a: Point, b: Point, bounds: Bounds, useLastCode?: Boolean, round?: Boolean): Point[]|Boolean
	// Clips the segment a to b by rectangular bounds with the
	// [Cohen-Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm)
	// (modifying the segment points directly!). Used by Leaflet to only show polyline
	// points that are on the screen or near, increasing performance.
	function clipSegment(a, b, bounds, useLastCode, round) {
		var codeA = useLastCode ? _lastCode : _getBitCode(a, bounds),
		    codeB = _getBitCode(b, bounds),

		    codeOut, p, newCode;

		    // save 2nd code to avoid calculating it on the next segment
		    _lastCode = codeB;

		while (true) {
			// if a,b is inside the clip window (trivial accept)
			if (!(codeA | codeB)) {
				return [a, b];
			}

			// if a,b is outside the clip window (trivial reject)
			if (codeA & codeB) {
				return false;
			}

			// other cases
			codeOut = codeA || codeB;
			p = _getEdgeIntersection(a, b, codeOut, bounds, round);
			newCode = _getBitCode(p, bounds);

			if (codeOut === codeA) {
				a = p;
				codeA = newCode;
			} else {
				b = p;
				codeB = newCode;
			}
		}
	}

	function _getEdgeIntersection(a, b, code, bounds, round) {
		var dx = b.x - a.x,
		    dy = b.y - a.y,
		    min = bounds.min,
		    max = bounds.max,
		    x, y;

		if (code & 8) { // top
			x = a.x + dx * (max.y - a.y) / dy;
			y = max.y;

		} else if (code & 4) { // bottom
			x = a.x + dx * (min.y - a.y) / dy;
			y = min.y;

		} else if (code & 2) { // right
			x = max.x;
			y = a.y + dy * (max.x - a.x) / dx;

		} else if (code & 1) { // left
			x = min.x;
			y = a.y + dy * (min.x - a.x) / dx;
		}

		return new Point(x, y, round);
	}

	function _getBitCode(p, bounds) {
		var code = 0;

		if (p.x < bounds.min.x) { // left
			code |= 1;
		} else if (p.x > bounds.max.x) { // right
			code |= 2;
		}

		if (p.y < bounds.min.y) { // bottom
			code |= 4;
		} else if (p.y > bounds.max.y) { // top
			code |= 8;
		}

		return code;
	}

	// square distance (to avoid unnecessary Math.sqrt calls)
	function _sqDist(p1, p2) {
		var dx = p2.x - p1.x,
		    dy = p2.y - p1.y;
		return dx * dx + dy * dy;
	}

	// return closest point on segment or distance to that point
	function _sqClosestPointOnSegment(p, p1, p2, sqDist) {
		var x = p1.x,
		    y = p1.y,
		    dx = p2.x - x,
		    dy = p2.y - y,
		    dot = dx * dx + dy * dy,
		    t;

		if (dot > 0) {
			t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

			if (t > 1) {
				x = p2.x;
				y = p2.y;
			} else if (t > 0) {
				x += dx * t;
				y += dy * t;
			}
		}

		dx = p.x - x;
		dy = p.y - y;

		return sqDist ? dx * dx + dy * dy : new Point(x, y);
	}


	// @function isFlat(latlngs: LatLng[]): Boolean
	// Returns true if `latlngs` is a flat array, false is nested.
	function isFlat(latlngs) {
		return !isArray(latlngs[0]) || (typeof latlngs[0][0] !== 'object' && typeof latlngs[0][0] !== 'undefined');
	}

	function _flat(latlngs) {
		console.warn('Deprecated use of _flat, please use L.LineUtil.isFlat instead.');
		return isFlat(latlngs);
	}


	var LineUtil = (Object.freeze || Object)({
		simplify: simplify,
		pointToSegmentDistance: pointToSegmentDistance,
		closestPointOnSegment: closestPointOnSegment,
		clipSegment: clipSegment,
		_getEdgeIntersection: _getEdgeIntersection,
		_getBitCode: _getBitCode,
		_sqClosestPointOnSegment: _sqClosestPointOnSegment,
		isFlat: isFlat,
		_flat: _flat
	});

	/*
	 * @namespace PolyUtil
	 * Various utility functions for polygon geometries.
	 */

	/* @function clipPolygon(points: Point[], bounds: Bounds, round?: Boolean): Point[]
	 * Clips the polygon geometry defined by the given `points` by the given bounds (using the [Sutherland-Hodgman algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm)).
	 * Used by Leaflet to only show polygon points that are on the screen or near, increasing
	 * performance. Note that polygon points needs different algorithm for clipping
	 * than polyline, so there's a separate method for it.
	 */
	function clipPolygon(points, bounds, round) {
		var clippedPoints,
		    edges = [1, 4, 2, 8],
		    i, j, k,
		    a, b,
		    len, edge, p;

		for (i = 0, len = points.length; i < len; i++) {
			points[i]._code = _getBitCode(points[i], bounds);
		}

		// for each edge (left, bottom, right, top)
		for (k = 0; k < 4; k++) {
			edge = edges[k];
			clippedPoints = [];

			for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
				a = points[i];
				b = points[j];

				// if a is inside the clip window
				if (!(a._code & edge)) {
					// if b is outside the clip window (a->b goes out of screen)
					if (b._code & edge) {
						p = _getEdgeIntersection(b, a, edge, bounds, round);
						p._code = _getBitCode(p, bounds);
						clippedPoints.push(p);
					}
					clippedPoints.push(a);

				// else if b is inside the clip window (a->b enters the screen)
				} else if (!(b._code & edge)) {
					p = _getEdgeIntersection(b, a, edge, bounds, round);
					p._code = _getBitCode(p, bounds);
					clippedPoints.push(p);
				}
			}
			points = clippedPoints;
		}

		return points;
	}


	var PolyUtil = (Object.freeze || Object)({
		clipPolygon: clipPolygon
	});

	/*
	 * @namespace Projection
	 * @section
	 * Leaflet comes with a set of already defined Projections out of the box:
	 *
	 * @projection L.Projection.LonLat
	 *
	 * Equirectangular, or Plate Carree projection — the most simple projection,
	 * mostly used by GIS enthusiasts. Directly maps `x` as longitude, and `y` as
	 * latitude. Also suitable for flat worlds, e.g. game maps. Used by the
	 * `EPSG:4326` and `Simple` CRS.
	 */

	var LonLat = {
		project: function (latlng) {
			return new Point(latlng.lng, latlng.lat);
		},

		unproject: function (point) {
			return new LatLng(point.y, point.x);
		},

		bounds: new Bounds([-180, -90], [180, 90])
	};

	/*
	 * @namespace Projection
	 * @projection L.Projection.Mercator
	 *
	 * Elliptical Mercator projection — more complex than Spherical Mercator. Assumes that Earth is an ellipsoid. Used by the EPSG:3395 CRS.
	 */

	var Mercator = {
		R: 6378137,
		R_MINOR: 6356752.314245179,

		bounds: new Bounds([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),

		project: function (latlng) {
			var d = Math.PI / 180,
			    r = this.R,
			    y = latlng.lat * d,
			    tmp = this.R_MINOR / r,
			    e = Math.sqrt(1 - tmp * tmp),
			    con = e * Math.sin(y);

			var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
			y = -r * Math.log(Math.max(ts, 1E-10));

			return new Point(latlng.lng * d * r, y);
		},

		unproject: function (point) {
			var d = 180 / Math.PI,
			    r = this.R,
			    tmp = this.R_MINOR / r,
			    e = Math.sqrt(1 - tmp * tmp),
			    ts = Math.exp(-point.y / r),
			    phi = Math.PI / 2 - 2 * Math.atan(ts);

			for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
				con = e * Math.sin(phi);
				con = Math.pow((1 - con) / (1 + con), e / 2);
				dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
				phi += dphi;
			}

			return new LatLng(phi * d, point.x * d / r);
		}
	};

	/*
	 * @class Projection

	 * An object with methods for projecting geographical coordinates of the world onto
	 * a flat surface (and back). See [Map projection](http://en.wikipedia.org/wiki/Map_projection).

	 * @property bounds: Bounds
	 * The bounds (specified in CRS units) where the projection is valid

	 * @method project(latlng: LatLng): Point
	 * Projects geographical coordinates into a 2D point.
	 * Only accepts actual `L.LatLng` instances, not arrays.

	 * @method unproject(point: Point): LatLng
	 * The inverse of `project`. Projects a 2D point into a geographical location.
	 * Only accepts actual `L.Point` instances, not arrays.

	 * Note that the projection instances do not inherit from Leafet's `Class` object,
	 * and can't be instantiated. Also, new classes can't inherit from them,
	 * and methods can't be added to them with the `include` function.

	 */




	var index = (Object.freeze || Object)({
		LonLat: LonLat,
		Mercator: Mercator,
		SphericalMercator: SphericalMercator
	});

	/*
	 * @namespace CRS
	 * @crs L.CRS.EPSG3395
	 *
	 * Rarely used by some commercial tile providers. Uses Elliptical Mercator projection.
	 */
	var EPSG3395 = extend({}, Earth, {
		code: 'EPSG:3395',
		projection: Mercator,

		transformation: (function () {
			var scale = 0.5 / (Math.PI * Mercator.R);
			return toTransformation(scale, 0.5, -scale, 0.5);
		}())
	});

	/*
	 * @namespace CRS
	 * @crs L.CRS.EPSG4326
	 *
	 * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
	 *
	 * Leaflet 1.0.x complies with the [TMS coordinate scheme for EPSG:4326](https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#global-geodetic),
	 * which is a breaking change from 0.7.x behaviour.  If you are using a `TileLayer`
	 * with this CRS, ensure that there are two 256x256 pixel tiles covering the
	 * whole earth at zoom level zero, and that the tile coordinate origin is (-180,+90),
	 * or (-180,-90) for `TileLayer`s with [the `tms` option](#tilelayer-tms) set.
	 */

	var EPSG4326 = extend({}, Earth, {
		code: 'EPSG:4326',
		projection: LonLat,
		transformation: toTransformation(1 / 180, 1, -1 / 180, 0.5)
	});

	/*
	 * @namespace CRS
	 * @crs L.CRS.Simple
	 *
	 * A simple CRS that maps longitude and latitude into `x` and `y` directly.
	 * May be used for maps of flat surfaces (e.g. game maps). Note that the `y`
	 * axis should still be inverted (going from bottom to top). `distance()` returns
	 * simple euclidean distance.
	 */

	var Simple = extend({}, CRS, {
		projection: LonLat,
		transformation: toTransformation(1, 0, -1, 0),

		scale: function (zoom) {
			return Math.pow(2, zoom);
		},

		zoom: function (scale) {
			return Math.log(scale) / Math.LN2;
		},

		distance: function (latlng1, latlng2) {
			var dx = latlng2.lng - latlng1.lng,
			    dy = latlng2.lat - latlng1.lat;

			return Math.sqrt(dx * dx + dy * dy);
		},

		infinite: true
	});

	CRS.Earth = Earth;
	CRS.EPSG3395 = EPSG3395;
	CRS.EPSG3857 = EPSG3857;
	CRS.EPSG900913 = EPSG900913;
	CRS.EPSG4326 = EPSG4326;
	CRS.Simple = Simple;

	/*
	 * @class Layer
	 * @inherits Evented
	 * @aka L.Layer
	 * @aka ILayer
	 *
	 * A set of methods from the Layer base class that all Leaflet layers use.
	 * Inherits all methods, options and events from `L.Evented`.
	 *
	 * @example
	 *
	 * ```js
	 * var layer = L.marker(latlng).addTo(map);
	 * layer.addTo(map);
	 * layer.remove();
	 * ```
	 *
	 * @event add: Event
	 * Fired after the layer is added to a map
	 *
	 * @event remove: Event
	 * Fired after the layer is removed from a map
	 */


	var Layer = Evented.extend({

		// Classes extending `L.Layer` will inherit the following options:
		options: {
			// @option pane: String = 'overlayPane'
			// By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
			pane: 'overlayPane',

			// @option attribution: String = null
			// String to be shown in the attribution control, e.g. "© OpenStreetMap contributors". It describes the layer data and is often a legal obligation towards copyright holders and tile providers.
			attribution: null,

			bubblingMouseEvents: true
		},

		/* @section
		 * Classes extending `L.Layer` will inherit the following methods:
		 *
		 * @method addTo(map: Map|LayerGroup): this
		 * Adds the layer to the given map or layer group.
		 */
		addTo: function (map) {
			map.addLayer(this);
			return this;
		},

		// @method remove: this
		// Removes the layer from the map it is currently active on.
		remove: function () {
			return this.removeFrom(this._map || this._mapToAdd);
		},

		// @method removeFrom(map: Map): this
		// Removes the layer from the given map
		removeFrom: function (obj) {
			if (obj) {
				obj.removeLayer(this);
			}
			return this;
		},

		// @method getPane(name? : String): HTMLElement
		// Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
		getPane: function (name) {
			return this._map.getPane(name ? (this.options[name] || name) : this.options.pane);
		},

		addInteractiveTarget: function (targetEl) {
			this._map._targets[stamp(targetEl)] = this;
			return this;
		},

		removeInteractiveTarget: function (targetEl) {
			delete this._map._targets[stamp(targetEl)];
			return this;
		},

		// @method getAttribution: String
		// Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
		getAttribution: function () {
			return this.options.attribution;
		},

		_layerAdd: function (e) {
			var map = e.target;

			// check in case layer gets added and then removed before the map is ready
			if (!map.hasLayer(this)) { return; }

			this._map = map;
			this._zoomAnimated = map._zoomAnimated;

			if (this.getEvents) {
				var events = this.getEvents();
				map.on(events, this);
				this.once('remove', function () {
					map.off(events, this);
				}, this);
			}

			this.onAdd(map);

			if (this.getAttribution && map.attributionControl) {
				map.attributionControl.addAttribution(this.getAttribution());
			}

			this.fire('add');
			map.fire('layeradd', {layer: this});
		}
	});

	/* @section Extension methods
	 * @uninheritable
	 *
	 * Every layer should extend from `L.Layer` and (re-)implement the following methods.
	 *
	 * @method onAdd(map: Map): this
	 * Should contain code that creates DOM elements for the layer, adds them to `map panes` where they should belong and puts listeners on relevant map events. Called on [`map.addLayer(layer)`](#map-addlayer).
	 *
	 * @method onRemove(map: Map): this
	 * Should contain all clean up code that removes the layer's elements from the DOM and removes listeners previously added in [`onAdd`](#layer-onadd). Called on [`map.removeLayer(layer)`](#map-removelayer).
	 *
	 * @method getEvents(): Object
	 * This optional method should return an object like `{ viewreset: this._reset }` for [`addEventListener`](#evented-addeventlistener). The event handlers in this object will be automatically added and removed from the map with your layer.
	 *
	 * @method getAttribution(): String
	 * This optional method should return a string containing HTML to be shown on the `Attribution control` whenever the layer is visible.
	 *
	 * @method beforeAdd(map: Map): this
	 * Optional method. Called on [`map.addLayer(layer)`](#map-addlayer), before the layer is added to the map, before events are initialized, without waiting until the map is in a usable state. Use for early initialization only.
	 */


	/* @namespace Map
	 * @section Layer events
	 *
	 * @event layeradd: LayerEvent
	 * Fired when a new layer is added to the map.
	 *
	 * @event layerremove: LayerEvent
	 * Fired when some layer is removed from the map
	 *
	 * @section Methods for Layers and Controls
	 */
	Map.include({
		// @method addLayer(layer: Layer): this
		// Adds the given layer to the map
		addLayer: function (layer) {
			if (!layer._layerAdd) {
				throw new Error('The provided object is not a Layer.');
			}

			var id = stamp(layer);
			if (this._layers[id]) { return this; }
			this._layers[id] = layer;

			layer._mapToAdd = this;

			if (layer.beforeAdd) {
				layer.beforeAdd(this);
			}

			this.whenReady(layer._layerAdd, layer);

			return this;
		},

		// @method removeLayer(layer: Layer): this
		// Removes the given layer from the map.
		removeLayer: function (layer) {
			var id = stamp(layer);

			if (!this._layers[id]) { return this; }

			if (this._loaded) {
				layer.onRemove(this);
			}

			if (layer.getAttribution && this.attributionControl) {
				this.attributionControl.removeAttribution(layer.getAttribution());
			}

			delete this._layers[id];

			if (this._loaded) {
				this.fire('layerremove', {layer: layer});
				layer.fire('remove');
			}

			layer._map = layer._mapToAdd = null;

			return this;
		},

		// @method hasLayer(layer: Layer): Boolean
		// Returns `true` if the given layer is currently added to the map
		hasLayer: function (layer) {
			return !!layer && (stamp(layer) in this._layers);
		},

		/* @method eachLayer(fn: Function, context?: Object): this
		 * Iterates over the layers of the map, optionally specifying context of the iterator function.
		 * ```
		 * map.eachLayer(function(layer){
		 *     layer.bindPopup('Hello');
		 * });
		 * ```
		 */
		eachLayer: function (method, context) {
			for (var i in this._layers) {
				method.call(context, this._layers[i]);
			}
			return this;
		},

		_addLayers: function (layers) {
			layers = layers ? (isArray(layers) ? layers : [layers]) : [];

			for (var i = 0, len = layers.length; i < len; i++) {
				this.addLayer(layers[i]);
			}
		},

		_addZoomLimit: function (layer) {
			if (isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom)) {
				this._zoomBoundLayers[stamp(layer)] = layer;
				this._updateZoomLevels();
			}
		},

		_removeZoomLimit: function (layer) {
			var id = stamp(layer);

			if (this._zoomBoundLayers[id]) {
				delete this._zoomBoundLayers[id];
				this._updateZoomLevels();
			}
		},

		_updateZoomLevels: function () {
			var minZoom = Infinity,
			    maxZoom = -Infinity,
			    oldZoomSpan = this._getZoomSpan();

			for (var i in this._zoomBoundLayers) {
				var options = this._zoomBoundLayers[i].options;

				minZoom = options.minZoom === undefined ? minZoom : Math.min(minZoom, options.minZoom);
				maxZoom = options.maxZoom === undefined ? maxZoom : Math.max(maxZoom, options.maxZoom);
			}

			this._layersMaxZoom = maxZoom === -Infinity ? undefined : maxZoom;
			this._layersMinZoom = minZoom === Infinity ? undefined : minZoom;

			// @section Map state change events
			// @event zoomlevelschange: Event
			// Fired when the number of zoomlevels on the map is changed due
			// to adding or removing a layer.
			if (oldZoomSpan !== this._getZoomSpan()) {
				this.fire('zoomlevelschange');
			}

			if (this.options.maxZoom === undefined && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom) {
				this.setZoom(this._layersMaxZoom);
			}
			if (this.options.minZoom === undefined && this._layersMinZoom && this.getZoom() < this._layersMinZoom) {
				this.setZoom(this._layersMinZoom);
			}
		}
	});

	/*
	 * @class LayerGroup
	 * @aka L.LayerGroup
	 * @inherits Layer
	 *
	 * Used to group several layers and handle them as one. If you add it to the map,
	 * any layers added or removed from the group will be added/removed on the map as
	 * well. Extends `Layer`.
	 *
	 * @example
	 *
	 * ```js
	 * L.layerGroup([marker1, marker2])
	 * 	.addLayer(polyline)
	 * 	.addTo(map);
	 * ```
	 */

	var LayerGroup = Layer.extend({

		initialize: function (layers, options) {
			setOptions(this, options);

			this._layers = {};

			var i, len;

			if (layers) {
				for (i = 0, len = layers.length; i < len; i++) {
					this.addLayer(layers[i]);
				}
			}
		},

		// @method addLayer(layer: Layer): this
		// Adds the given layer to the group.
		addLayer: function (layer) {
			var id = this.getLayerId(layer);

			this._layers[id] = layer;

			if (this._map) {
				this._map.addLayer(layer);
			}

			return this;
		},

		// @method removeLayer(layer: Layer): this
		// Removes the given layer from the group.
		// @alternative
		// @method removeLayer(id: Number): this
		// Removes the layer with the given internal ID from the group.
		removeLayer: function (layer) {
			var id = layer in this._layers ? layer : this.getLayerId(layer);

			if (this._map && this._layers[id]) {
				this._map.removeLayer(this._layers[id]);
			}

			delete this._layers[id];

			return this;
		},

		// @method hasLayer(layer: Layer): Boolean
		// Returns `true` if the given layer is currently added to the group.
		// @alternative
		// @method hasLayer(id: Number): Boolean
		// Returns `true` if the given internal ID is currently added to the group.
		hasLayer: function (layer) {
			return !!layer && (layer in this._layers || this.getLayerId(layer) in this._layers);
		},

		// @method clearLayers(): this
		// Removes all the layers from the group.
		clearLayers: function () {
			return this.eachLayer(this.removeLayer, this);
		},

		// @method invoke(methodName: String, …): this
		// Calls `methodName` on every layer contained in this group, passing any
		// additional parameters. Has no effect if the layers contained do not
		// implement `methodName`.
		invoke: function (methodName) {
			var args = Array.prototype.slice.call(arguments, 1),
			    i, layer;

			for (i in this._layers) {
				layer = this._layers[i];

				if (layer[methodName]) {
					layer[methodName].apply(layer, args);
				}
			}

			return this;
		},

		onAdd: function (map) {
			this.eachLayer(map.addLayer, map);
		},

		onRemove: function (map) {
			this.eachLayer(map.removeLayer, map);
		},

		// @method eachLayer(fn: Function, context?: Object): this
		// Iterates over the layers of the group, optionally specifying context of the iterator function.
		// ```js
		// group.eachLayer(function (layer) {
		// 	layer.bindPopup('Hello');
		// });
		// ```
		eachLayer: function (method, context) {
			for (var i in this._layers) {
				method.call(context, this._layers[i]);
			}
			return this;
		},

		// @method getLayer(id: Number): Layer
		// Returns the layer with the given internal ID.
		getLayer: function (id) {
			return this._layers[id];
		},

		// @method getLayers(): Layer[]
		// Returns an array of all the layers added to the group.
		getLayers: function () {
			var layers = [];
			this.eachLayer(layers.push, layers);
			return layers;
		},

		// @method setZIndex(zIndex: Number): this
		// Calls `setZIndex` on every layer contained in this group, passing the z-index.
		setZIndex: function (zIndex) {
			return this.invoke('setZIndex', zIndex);
		},

		// @method getLayerId(layer: Layer): Number
		// Returns the internal ID for a layer
		getLayerId: function (layer) {
			return stamp(layer);
		}
	});


	// @factory L.layerGroup(layers?: Layer[], options?: Object)
	// Create a layer group, optionally given an initial set of layers and an `options` object.
	var layerGroup = function (layers, options) {
		return new LayerGroup(layers, options);
	};

	/*
	 * @class FeatureGroup
	 * @aka L.FeatureGroup
	 * @inherits LayerGroup
	 *
	 * Extended `LayerGroup` that makes it easier to do the same thing to all its member layers:
	 *  * [`bindPopup`](#layer-bindpopup) binds a popup to all of the layers at once (likewise with [`bindTooltip`](#layer-bindtooltip))
	 *  * Events are propagated to the `FeatureGroup`, so if the group has an event
	 * handler, it will handle events from any of the layers. This includes mouse events
	 * and custom events.
	 *  * Has `layeradd` and `layerremove` events
	 *
	 * @example
	 *
	 * ```js
	 * L.featureGroup([marker1, marker2, polyline])
	 * 	.bindPopup('Hello world!')
	 * 	.on('click', function() { alert('Clicked on a member of the group!'); })
	 * 	.addTo(map);
	 * ```
	 */

	var FeatureGroup = LayerGroup.extend({

		addLayer: function (layer) {
			if (this.hasLayer(layer)) {
				return this;
			}

			layer.addEventParent(this);

			LayerGroup.prototype.addLayer.call(this, layer);

			// @event layeradd: LayerEvent
			// Fired when a layer is added to this `FeatureGroup`
			return this.fire('layeradd', {layer: layer});
		},

		removeLayer: function (layer) {
			if (!this.hasLayer(layer)) {
				return this;
			}
			if (layer in this._layers) {
				layer = this._layers[layer];
			}

			layer.removeEventParent(this);

			LayerGroup.prototype.removeLayer.call(this, layer);

			// @event layerremove: LayerEvent
			// Fired when a layer is removed from this `FeatureGroup`
			return this.fire('layerremove', {layer: layer});
		},

		// @method setStyle(style: Path options): this
		// Sets the given path options to each layer of the group that has a `setStyle` method.
		setStyle: function (style) {
			return this.invoke('setStyle', style);
		},

		// @method bringToFront(): this
		// Brings the layer group to the top of all other layers
		bringToFront: function () {
			return this.invoke('bringToFront');
		},

		// @method bringToBack(): this
		// Brings the layer group to the back of all other layers
		bringToBack: function () {
			return this.invoke('bringToBack');
		},

		// @method getBounds(): LatLngBounds
		// Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
		getBounds: function () {
			var bounds = new LatLngBounds();

			for (var id in this._layers) {
				var layer = this._layers[id];
				bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
			}
			return bounds;
		}
	});

	// @factory L.featureGroup(layers: Layer[])
	// Create a feature group, optionally given an initial set of layers.
	var featureGroup = function (layers) {
		return new FeatureGroup(layers);
	};

	/*
	 * @class Icon
	 * @aka L.Icon
	 *
	 * Represents an icon to provide when creating a marker.
	 *
	 * @example
	 *
	 * ```js
	 * var myIcon = L.icon({
	 *     iconUrl: 'my-icon.png',
	 *     iconRetinaUrl: 'my-icon@2x.png',
	 *     iconSize: [38, 95],
	 *     iconAnchor: [22, 94],
	 *     popupAnchor: [-3, -76],
	 *     shadowUrl: 'my-icon-shadow.png',
	 *     shadowRetinaUrl: 'my-icon-shadow@2x.png',
	 *     shadowSize: [68, 95],
	 *     shadowAnchor: [22, 94]
	 * });
	 *
	 * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
	 * ```
	 *
	 * `L.Icon.Default` extends `L.Icon` and is the blue icon Leaflet uses for markers by default.
	 *
	 */

	var Icon = Class.extend({

		/* @section
		 * @aka Icon options
		 *
		 * @option iconUrl: String = null
		 * **(required)** The URL to the icon image (absolute or relative to your script path).
		 *
		 * @option iconRetinaUrl: String = null
		 * The URL to a retina sized version of the icon image (absolute or relative to your
		 * script path). Used for Retina screen devices.
		 *
		 * @option iconSize: Point = null
		 * Size of the icon image in pixels.
		 *
		 * @option iconAnchor: Point = null
		 * The coordinates of the "tip" of the icon (relative to its top left corner). The icon
		 * will be aligned so that this point is at the marker's geographical location. Centered
		 * by default if size is specified, also can be set in CSS with negative margins.
		 *
		 * @option popupAnchor: Point = [0, 0]
		 * The coordinates of the point from which popups will "open", relative to the icon anchor.
		 *
		 * @option tooltipAnchor: Point = [0, 0]
		 * The coordinates of the point from which tooltips will "open", relative to the icon anchor.
		 *
		 * @option shadowUrl: String = null
		 * The URL to the icon shadow image. If not specified, no shadow image will be created.
		 *
		 * @option shadowRetinaUrl: String = null
		 *
		 * @option shadowSize: Point = null
		 * Size of the shadow image in pixels.
		 *
		 * @option shadowAnchor: Point = null
		 * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same
		 * as iconAnchor if not specified).
		 *
		 * @option className: String = ''
		 * A custom class name to assign to both icon and shadow images. Empty by default.
		 */

		options: {
			popupAnchor: [0, 0],
			tooltipAnchor: [0, 0]
		},

		initialize: function (options) {
			setOptions(this, options);
		},

		// @method createIcon(oldIcon?: HTMLElement): HTMLElement
		// Called internally when the icon has to be shown, returns a `<img>` HTML element
		// styled according to the options.
		createIcon: function (oldIcon) {
			return this._createIcon('icon', oldIcon);
		},

		// @method createShadow(oldIcon?: HTMLElement): HTMLElement
		// As `createIcon`, but for the shadow beneath it.
		createShadow: function (oldIcon) {
			return this._createIcon('shadow', oldIcon);
		},

		_createIcon: function (name, oldIcon) {
			var src = this._getIconUrl(name);

			if (!src) {
				if (name === 'icon') {
					throw new Error('iconUrl not set in Icon options (see the docs).');
				}
				return null;
			}

			var img = this._createImg(src, oldIcon && oldIcon.tagName === 'IMG' ? oldIcon : null);
			this._setIconStyles(img, name);

			return img;
		},

		_setIconStyles: function (img, name) {
			var options = this.options;
			var sizeOption = options[name + 'Size'];

			if (typeof sizeOption === 'number') {
				sizeOption = [sizeOption, sizeOption];
			}

			var size = toPoint(sizeOption),
			    anchor = toPoint(name === 'shadow' && options.shadowAnchor || options.iconAnchor ||
			            size && size.divideBy(2, true));

			img.className = 'leaflet-marker-' + name + ' ' + (options.className || '');

			if (anchor) {
				img.style.marginLeft = (-anchor.x) + 'px';
				img.style.marginTop  = (-anchor.y) + 'px';
			}

			if (size) {
				img.style.width  = size.x + 'px';
				img.style.height = size.y + 'px';
			}
		},

		_createImg: function (src, el) {
			el = el || document.createElement('img');
			el.src = src;
			return el;
		},

		_getIconUrl: function (name) {
			return retina && this.options[name + 'RetinaUrl'] || this.options[name + 'Url'];
		}
	});


	// @factory L.icon(options: Icon options)
	// Creates an icon instance with the given options.
	function icon(options) {
		return new Icon(options);
	}

	/*
	 * @miniclass Icon.Default (Icon)
	 * @aka L.Icon.Default
	 * @section
	 *
	 * A trivial subclass of `Icon`, represents the icon to use in `Marker`s when
	 * no icon is specified. Points to the blue marker image distributed with Leaflet
	 * releases.
	 *
	 * In order to customize the default icon, just change the properties of `L.Icon.Default.prototype.options`
	 * (which is a set of `Icon options`).
	 *
	 * If you want to _completely_ replace the default icon, override the
	 * `L.Marker.prototype.options.icon` with your own icon instead.
	 */

	var IconDefault = Icon.extend({

		options: {
			iconUrl:       'marker-icon.png',
			iconRetinaUrl: 'marker-icon-2x.png',
			shadowUrl:     'marker-shadow.png',
			iconSize:    [25, 41],
			iconAnchor:  [12, 41],
			popupAnchor: [1, -34],
			tooltipAnchor: [16, -28],
			shadowSize:  [41, 41]
		},

		_getIconUrl: function (name) {
			if (!IconDefault.imagePath) {	// Deprecated, backwards-compatibility only
				IconDefault.imagePath = this._detectIconPath();
			}

			// @option imagePath: String
			// `Icon.Default` will try to auto-detect the location of the
			// blue icon images. If you are placing these images in a non-standard
			// way, set this option to point to the right path.
			return (this.options.imagePath || IconDefault.imagePath) + Icon.prototype._getIconUrl.call(this, name);
		},

		_detectIconPath: function () {
			var el = create$1('div',  'leaflet-default-icon-path', document.body);
			var path = getStyle(el, 'background-image') ||
			           getStyle(el, 'backgroundImage');	// IE8

			document.body.removeChild(el);

			if (path === null || path.indexOf('url') !== 0) {
				path = '';
			} else {
				path = path.replace(/^url\(["']?/, '').replace(/marker-icon\.png["']?\)$/, '');
			}

			return path;
		}
	});

	/*
	 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
	 */


	/* @namespace Marker
	 * @section Interaction handlers
	 *
	 * Interaction handlers are properties of a marker instance that allow you to control interaction behavior in runtime, enabling or disabling certain features such as dragging (see `Handler` methods). Example:
	 *
	 * ```js
	 * marker.dragging.disable();
	 * ```
	 *
	 * @property dragging: Handler
	 * Marker dragging handler (by both mouse and touch). Only valid when the marker is on the map (Otherwise set [`marker.options.draggable`](#marker-draggable)).
	 */

	var MarkerDrag = Handler.extend({
		initialize: function (marker) {
			this._marker = marker;
		},

		addHooks: function () {
			var icon = this._marker._icon;

			if (!this._draggable) {
				this._draggable = new Draggable(icon, icon, true);
			}

			this._draggable.on({
				dragstart: this._onDragStart,
				predrag: this._onPreDrag,
				drag: this._onDrag,
				dragend: this._onDragEnd
			}, this).enable();

			addClass(icon, 'leaflet-marker-draggable');
		},

		removeHooks: function () {
			this._draggable.off({
				dragstart: this._onDragStart,
				predrag: this._onPreDrag,
				drag: this._onDrag,
				dragend: this._onDragEnd
			}, this).disable();

			if (this._marker._icon) {
				removeClass(this._marker._icon, 'leaflet-marker-draggable');
			}
		},

		moved: function () {
			return this._draggable && this._draggable._moved;
		},

		_adjustPan: function (e) {
			var marker = this._marker,
			    map = marker._map,
			    speed = this._marker.options.autoPanSpeed,
			    padding = this._marker.options.autoPanPadding,
			    iconPos = getPosition(marker._icon),
			    bounds = map.getPixelBounds(),
			    origin = map.getPixelOrigin();

			var panBounds = toBounds(
				bounds.min._subtract(origin).add(padding),
				bounds.max._subtract(origin).subtract(padding)
			);

			if (!panBounds.contains(iconPos)) {
				// Compute incremental movement
				var movement = toPoint(
					(Math.max(panBounds.max.x, iconPos.x) - panBounds.max.x) / (bounds.max.x - panBounds.max.x) -
					(Math.min(panBounds.min.x, iconPos.x) - panBounds.min.x) / (bounds.min.x - panBounds.min.x),

					(Math.max(panBounds.max.y, iconPos.y) - panBounds.max.y) / (bounds.max.y - panBounds.max.y) -
					(Math.min(panBounds.min.y, iconPos.y) - panBounds.min.y) / (bounds.min.y - panBounds.min.y)
				).multiplyBy(speed);

				map.panBy(movement, {animate: false});

				this._draggable._newPos._add(movement);
				this._draggable._startPos._add(movement);

				setPosition(marker._icon, this._draggable._newPos);
				this._onDrag(e);

				this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
			}
		},

		_onDragStart: function () {
			// @section Dragging events
			// @event dragstart: Event
			// Fired when the user starts dragging the marker.

			// @event movestart: Event
			// Fired when the marker starts moving (because of dragging).

			this._oldLatLng = this._marker.getLatLng();
			this._marker
			    .closePopup()
			    .fire('movestart')
			    .fire('dragstart');
		},

		_onPreDrag: function (e) {
			if (this._marker.options.autoPan) {
				cancelAnimFrame(this._panRequest);
				this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
			}
		},

		_onDrag: function (e) {
			var marker = this._marker,
			    shadow = marker._shadow,
			    iconPos = getPosition(marker._icon),
			    latlng = marker._map.layerPointToLatLng(iconPos);

			// update shadow position
			if (shadow) {
				setPosition(shadow, iconPos);
			}

			marker._latlng = latlng;
			e.latlng = latlng;
			e.oldLatLng = this._oldLatLng;

			// @event drag: Event
			// Fired repeatedly while the user drags the marker.
			marker
			    .fire('move', e)
			    .fire('drag', e);
		},

		_onDragEnd: function (e) {
			// @event dragend: DragEndEvent
			// Fired when the user stops dragging the marker.

			 cancelAnimFrame(this._panRequest);

			// @event moveend: Event
			// Fired when the marker stops moving (because of dragging).
			delete this._oldLatLng;
			this._marker
			    .fire('moveend')
			    .fire('dragend', e);
		}
	});

	/*
	 * @class Marker
	 * @inherits Interactive layer
	 * @aka L.Marker
	 * L.Marker is used to display clickable/draggable icons on the map. Extends `Layer`.
	 *
	 * @example
	 *
	 * ```js
	 * L.marker([50.5, 30.5]).addTo(map);
	 * ```
	 */

	var Marker = Layer.extend({

		// @section
		// @aka Marker options
		options: {
			// @option icon: Icon = *
			// Icon instance to use for rendering the marker.
			// See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
			// If not specified, a common instance of `L.Icon.Default` is used.
			icon: new IconDefault(),

			// Option inherited from "Interactive layer" abstract class
			interactive: true,

			// @option keyboard: Boolean = true
			// Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
			keyboard: true,

			// @option title: String = ''
			// Text for the browser tooltip that appear on marker hover (no tooltip by default).
			title: '',

			// @option alt: String = ''
			// Text for the `alt` attribute of the icon image (useful for accessibility).
			alt: '',

			// @option zIndexOffset: Number = 0
			// By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
			zIndexOffset: 0,

			// @option opacity: Number = 1.0
			// The opacity of the marker.
			opacity: 1,

			// @option riseOnHover: Boolean = false
			// If `true`, the marker will get on top of others when you hover the mouse over it.
			riseOnHover: false,

			// @option riseOffset: Number = 250
			// The z-index offset used for the `riseOnHover` feature.
			riseOffset: 250,

			// @option pane: String = 'markerPane'
			// `Map pane` where the markers icon will be added.
			pane: 'markerPane',

			// @option pane: String = 'shadowPane'
			// `Map pane` where the markers shadow will be added.
			shadowPane: 'shadowPane',

			// @option bubblingMouseEvents: Boolean = false
			// When `true`, a mouse event on this marker will trigger the same event on the map
			// (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
			bubblingMouseEvents: false,

			// @section Draggable marker options
			// @option draggable: Boolean = false
			// Whether the marker is draggable with mouse/touch or not.
			draggable: false,

			// @option autoPan: Boolean = false
			// Whether to pan the map when dragging this marker near its edge or not.
			autoPan: false,

			// @option autoPanPadding: Point = Point(50, 50)
			// Distance (in pixels to the left/right and to the top/bottom) of the
			// map edge to start panning the map.
			autoPanPadding: [50, 50],

			// @option autoPanSpeed: Number = 10
			// Number of pixels the map should pan by.
			autoPanSpeed: 10
		},

		/* @section
		 *
		 * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
		 */

		initialize: function (latlng, options) {
			setOptions(this, options);
			this._latlng = toLatLng(latlng);
		},

		onAdd: function (map) {
			this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;

			if (this._zoomAnimated) {
				map.on('zoomanim', this._animateZoom, this);
			}

			this._initIcon();
			this.update();
		},

		onRemove: function (map) {
			if (this.dragging && this.dragging.enabled()) {
				this.options.draggable = true;
				this.dragging.removeHooks();
			}
			delete this.dragging;

			if (this._zoomAnimated) {
				map.off('zoomanim', this._animateZoom, this);
			}

			this._removeIcon();
			this._removeShadow();
		},

		getEvents: function () {
			return {
				zoom: this.update,
				viewreset: this.update
			};
		},

		// @method getLatLng: LatLng
		// Returns the current geographical position of the marker.
		getLatLng: function () {
			return this._latlng;
		},

		// @method setLatLng(latlng: LatLng): this
		// Changes the marker position to the given point.
		setLatLng: function (latlng) {
			var oldLatLng = this._latlng;
			this._latlng = toLatLng(latlng);
			this.update();

			// @event move: Event
			// Fired when the marker is moved via [`setLatLng`](#marker-setlatlng) or by [dragging](#marker-dragging). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
			return this.fire('move', {oldLatLng: oldLatLng, latlng: this._latlng});
		},

		// @method setZIndexOffset(offset: Number): this
		// Changes the [zIndex offset](#marker-zindexoffset) of the marker.
		setZIndexOffset: function (offset) {
			this.options.zIndexOffset = offset;
			return this.update();
		},

		// @method getIcon: Icon
		// Returns the current icon used by the marker
		getIcon: function () {
			return this.options.icon;
		},

		// @method setIcon(icon: Icon): this
		// Changes the marker icon.
		setIcon: function (icon) {

			this.options.icon = icon;

			if (this._map) {
				this._initIcon();
				this.update();
			}

			if (this._popup) {
				this.bindPopup(this._popup, this._popup.options);
			}

			return this;
		},

		getElement: function () {
			return this._icon;
		},

		update: function () {

			if (this._icon && this._map) {
				var pos = this._map.latLngToLayerPoint(this._latlng).round();
				this._setPos(pos);
			}

			return this;
		},

		_initIcon: function () {
			var options = this.options,
			    classToAdd = 'leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

			var icon = options.icon.createIcon(this._icon),
			    addIcon = false;

			// if we're not reusing the icon, remove the old one and init new one
			if (icon !== this._icon) {
				if (this._icon) {
					this._removeIcon();
				}
				addIcon = true;

				if (options.title) {
					icon.title = options.title;
				}

				if (icon.tagName === 'IMG') {
					icon.alt = options.alt || '';
				}
			}

			addClass(icon, classToAdd);

			if (options.keyboard) {
				icon.tabIndex = '0';
			}

			this._icon = icon;

			if (options.riseOnHover) {
				this.on({
					mouseover: this._bringToFront,
					mouseout: this._resetZIndex
				});
			}

			var newShadow = options.icon.createShadow(this._shadow),
			    addShadow = false;

			if (newShadow !== this._shadow) {
				this._removeShadow();
				addShadow = true;
			}

			if (newShadow) {
				addClass(newShadow, classToAdd);
				newShadow.alt = '';
			}
			this._shadow = newShadow;


			if (options.opacity < 1) {
				this._updateOpacity();
			}


			if (addIcon) {
				this.getPane().appendChild(this._icon);
			}
			this._initInteraction();
			if (newShadow && addShadow) {
				this.getPane(options.shadowPane).appendChild(this._shadow);
			}
		},

		_removeIcon: function () {
			if (this.options.riseOnHover) {
				this.off({
					mouseover: this._bringToFront,
					mouseout: this._resetZIndex
				});
			}

			remove(this._icon);
			this.removeInteractiveTarget(this._icon);

			this._icon = null;
		},

		_removeShadow: function () {
			if (this._shadow) {
				remove(this._shadow);
			}
			this._shadow = null;
		},

		_setPos: function (pos) {

			if (this._icon) {
				setPosition(this._icon, pos);
			}

			if (this._shadow) {
				setPosition(this._shadow, pos);
			}

			this._zIndex = pos.y + this.options.zIndexOffset;

			this._resetZIndex();
		},

		_updateZIndex: function (offset) {
			if (this._icon) {
				this._icon.style.zIndex = this._zIndex + offset;
			}
		},

		_animateZoom: function (opt) {
			var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

			this._setPos(pos);
		},

		_initInteraction: function () {

			if (!this.options.interactive) { return; }

			addClass(this._icon, 'leaflet-interactive');

			this.addInteractiveTarget(this._icon);

			if (MarkerDrag) {
				var draggable = this.options.draggable;
				if (this.dragging) {
					draggable = this.dragging.enabled();
					this.dragging.disable();
				}

				this.dragging = new MarkerDrag(this);

				if (draggable) {
					this.dragging.enable();
				}
			}
		},

		// @method setOpacity(opacity: Number): this
		// Changes the opacity of the marker.
		setOpacity: function (opacity) {
			this.options.opacity = opacity;
			if (this._map) {
				this._updateOpacity();
			}

			return this;
		},

		_updateOpacity: function () {
			var opacity = this.options.opacity;

			if (this._icon) {
				setOpacity(this._icon, opacity);
			}

			if (this._shadow) {
				setOpacity(this._shadow, opacity);
			}
		},

		_bringToFront: function () {
			this._updateZIndex(this.options.riseOffset);
		},

		_resetZIndex: function () {
			this._updateZIndex(0);
		},

		_getPopupAnchor: function () {
			return this.options.icon.options.popupAnchor;
		},

		_getTooltipAnchor: function () {
			return this.options.icon.options.tooltipAnchor;
		}
	});


	// factory L.marker(latlng: LatLng, options? : Marker options)

	// @factory L.marker(latlng: LatLng, options? : Marker options)
	// Instantiates a Marker object given a geographical point and optionally an options object.
	function marker(latlng, options) {
		return new Marker(latlng, options);
	}

	/*
	 * @class Path
	 * @aka L.Path
	 * @inherits Interactive layer
	 *
	 * An abstract class that contains options and constants shared between vector
	 * overlays (Polygon, Polyline, Circle). Do not use it directly. Extends `Layer`.
	 */

	var Path = Layer.extend({

		// @section
		// @aka Path options
		options: {
			// @option stroke: Boolean = true
			// Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles.
			stroke: true,

			// @option color: String = '#3388ff'
			// Stroke color
			color: '#3388ff',

			// @option weight: Number = 3
			// Stroke width in pixels
			weight: 3,

			// @option opacity: Number = 1.0
			// Stroke opacity
			opacity: 1,

			// @option lineCap: String= 'round'
			// A string that defines [shape to be used at the end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
			lineCap: 'round',

			// @option lineJoin: String = 'round'
			// A string that defines [shape to be used at the corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
			lineJoin: 'round',

			// @option dashArray: String = null
			// A string that defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
			dashArray: null,

			// @option dashOffset: String = null
			// A string that defines the [distance into the dash pattern to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
			dashOffset: null,

			// @option fill: Boolean = depends
			// Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles.
			fill: false,

			// @option fillColor: String = *
			// Fill color. Defaults to the value of the [`color`](#path-color) option
			fillColor: null,

			// @option fillOpacity: Number = 0.2
			// Fill opacity.
			fillOpacity: 0.2,

			// @option fillRule: String = 'evenodd'
			// A string that defines [how the inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
			fillRule: 'evenodd',

			// className: '',

			// Option inherited from "Interactive layer" abstract class
			interactive: true,

			// @option bubblingMouseEvents: Boolean = true
			// When `true`, a mouse event on this path will trigger the same event on the map
			// (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
			bubblingMouseEvents: true
		},

		beforeAdd: function (map) {
			// Renderer is set here because we need to call renderer.getEvents
			// before this.getEvents.
			this._renderer = map.getRenderer(this);
		},

		onAdd: function () {
			this._renderer._initPath(this);
			this._reset();
			this._renderer._addPath(this);
		},

		onRemove: function () {
			this._renderer._removePath(this);
		},

		// @method redraw(): this
		// Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
		redraw: function () {
			if (this._map) {
				this._renderer._updatePath(this);
			}
			return this;
		},

		// @method setStyle(style: Path options): this
		// Changes the appearance of a Path based on the options in the `Path options` object.
		setStyle: function (style) {
			setOptions(this, style);
			if (this._renderer) {
				this._renderer._updateStyle(this);
				if (this.options.stroke && style && style.hasOwnProperty('weight')) {
					this._updateBounds();
				}
			}
			return this;
		},

		// @method bringToFront(): this
		// Brings the layer to the top of all path layers.
		bringToFront: function () {
			if (this._renderer) {
				this._renderer._bringToFront(this);
			}
			return this;
		},

		// @method bringToBack(): this
		// Brings the layer to the bottom of all path layers.
		bringToBack: function () {
			if (this._renderer) {
				this._renderer._bringToBack(this);
			}
			return this;
		},

		getElement: function () {
			return this._path;
		},

		_reset: function () {
			// defined in child classes
			this._project();
			this._update();
		},

		_clickTolerance: function () {
			// used when doing hit detection for Canvas layers
			return (this.options.stroke ? this.options.weight / 2 : 0) + this._renderer.options.tolerance;
		}
	});

	/*
	 * @class CircleMarker
	 * @aka L.CircleMarker
	 * @inherits Path
	 *
	 * A circle of a fixed size with radius specified in pixels. Extends `Path`.
	 */

	var CircleMarker = Path.extend({

		// @section
		// @aka CircleMarker options
		options: {
			fill: true,

			// @option radius: Number = 10
			// Radius of the circle marker, in pixels
			radius: 10
		},

		initialize: function (latlng, options) {
			setOptions(this, options);
			this._latlng = toLatLng(latlng);
			this._radius = this.options.radius;
		},

		// @method setLatLng(latLng: LatLng): this
		// Sets the position of a circle marker to a new location.
		setLatLng: function (latlng) {
			var oldLatLng = this._latlng;
			this._latlng = toLatLng(latlng);
			this.redraw();

			// @event move: Event
			// Fired when the marker is moved via [`setLatLng`](#circlemarker-setlatlng). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
			return this.fire('move', {oldLatLng: oldLatLng, latlng: this._latlng});
		},

		// @method getLatLng(): LatLng
		// Returns the current geographical position of the circle marker
		getLatLng: function () {
			return this._latlng;
		},

		// @method setRadius(radius: Number): this
		// Sets the radius of a circle marker. Units are in pixels.
		setRadius: function (radius) {
			this.options.radius = this._radius = radius;
			return this.redraw();
		},

		// @method getRadius(): Number
		// Returns the current radius of the circle
		getRadius: function () {
			return this._radius;
		},

		setStyle : function (options) {
			var radius = options && options.radius || this._radius;
			Path.prototype.setStyle.call(this, options);
			this.setRadius(radius);
			return this;
		},

		_project: function () {
			this._point = this._map.latLngToLayerPoint(this._latlng);
			this._updateBounds();
		},

		_updateBounds: function () {
			var r = this._radius,
			    r2 = this._radiusY || r,
			    w = this._clickTolerance(),
			    p = [r + w, r2 + w];
			this._pxBounds = new Bounds(this._point.subtract(p), this._point.add(p));
		},

		_update: function () {
			if (this._map) {
				this._updatePath();
			}
		},

		_updatePath: function () {
			this._renderer._updateCircle(this);
		},

		_empty: function () {
			return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
		},

		// Needed by the `Canvas` renderer for interactivity
		_containsPoint: function (p) {
			return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
		}
	});


	// @factory L.circleMarker(latlng: LatLng, options?: CircleMarker options)
	// Instantiates a circle marker object given a geographical point, and an optional options object.
	function circleMarker(latlng, options) {
		return new CircleMarker(latlng, options);
	}

	/*
	 * @class Circle
	 * @aka L.Circle
	 * @inherits CircleMarker
	 *
	 * A class for drawing circle overlays on a map. Extends `CircleMarker`.
	 *
	 * It's an approximation and starts to diverge from a real circle closer to poles (due to projection distortion).
	 *
	 * @example
	 *
	 * ```js
	 * L.circle([50.5, 30.5], {radius: 200}).addTo(map);
	 * ```
	 */

	var Circle = CircleMarker.extend({

		initialize: function (latlng, options, legacyOptions) {
			if (typeof options === 'number') {
				// Backwards compatibility with 0.7.x factory (latlng, radius, options?)
				options = extend({}, legacyOptions, {radius: options});
			}
			setOptions(this, options);
			this._latlng = toLatLng(latlng);

			if (isNaN(this.options.radius)) { throw new Error('Circle radius cannot be NaN'); }

			// @section
			// @aka Circle options
			// @option radius: Number; Radius of the circle, in meters.
			this._mRadius = this.options.radius;
		},

		// @method setRadius(radius: Number): this
		// Sets the radius of a circle. Units are in meters.
		setRadius: function (radius) {
			this._mRadius = radius;
			return this.redraw();
		},

		// @method getRadius(): Number
		// Returns the current radius of a circle. Units are in meters.
		getRadius: function () {
			return this._mRadius;
		},

		// @method getBounds(): LatLngBounds
		// Returns the `LatLngBounds` of the path.
		getBounds: function () {
			var half = [this._radius, this._radiusY || this._radius];

			return new LatLngBounds(
				this._map.layerPointToLatLng(this._point.subtract(half)),
				this._map.layerPointToLatLng(this._point.add(half)));
		},

		setStyle: Path.prototype.setStyle,

		_project: function () {

			var lng = this._latlng.lng,
			    lat = this._latlng.lat,
			    map = this._map,
			    crs = map.options.crs;

			if (crs.distance === Earth.distance) {
				var d = Math.PI / 180,
				    latR = (this._mRadius / Earth.R) / d,
				    top = map.project([lat + latR, lng]),
				    bottom = map.project([lat - latR, lng]),
				    p = top.add(bottom).divideBy(2),
				    lat2 = map.unproject(p).lat,
				    lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) /
				            (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;

				if (isNaN(lngR) || lngR === 0) {
					lngR = latR / Math.cos(Math.PI / 180 * lat); // Fallback for edge case, #2425
				}

				this._point = p.subtract(map.getPixelOrigin());
				this._radius = isNaN(lngR) ? 0 : p.x - map.project([lat2, lng - lngR]).x;
				this._radiusY = p.y - top.y;

			} else {
				var latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._mRadius, 0]));

				this._point = map.latLngToLayerPoint(this._latlng);
				this._radius = this._point.x - map.latLngToLayerPoint(latlng2).x;
			}

			this._updateBounds();
		}
	});

	// @factory L.circle(latlng: LatLng, options?: Circle options)
	// Instantiates a circle object given a geographical point, and an options object
	// which contains the circle radius.
	// @alternative
	// @factory L.circle(latlng: LatLng, radius: Number, options?: Circle options)
	// Obsolete way of instantiating a circle, for compatibility with 0.7.x code.
	// Do not use in new applications or plugins.
	function circle(latlng, options, legacyOptions) {
		return new Circle(latlng, options, legacyOptions);
	}

	/*
	 * @class Polyline
	 * @aka L.Polyline
	 * @inherits Path
	 *
	 * A class for drawing polyline overlays on a map. Extends `Path`.
	 *
	 * @example
	 *
	 * ```js
	 * // create a red polyline from an array of LatLng points
	 * var latlngs = [
	 * 	[45.51, -122.68],
	 * 	[37.77, -122.43],
	 * 	[34.04, -118.2]
	 * ];
	 *
	 * var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
	 *
	 * // zoom the map to the polyline
	 * map.fitBounds(polyline.getBounds());
	 * ```
	 *
	 * You can also pass a multi-dimensional array to represent a `MultiPolyline` shape:
	 *
	 * ```js
	 * // create a red polyline from an array of arrays of LatLng points
	 * var latlngs = [
	 * 	[[45.51, -122.68],
	 * 	 [37.77, -122.43],
	 * 	 [34.04, -118.2]],
	 * 	[[40.78, -73.91],
	 * 	 [41.83, -87.62],
	 * 	 [32.76, -96.72]]
	 * ];
	 * ```
	 */


	var Polyline = Path.extend({

		// @section
		// @aka Polyline options
		options: {
			// @option smoothFactor: Number = 1.0
			// How much to simplify the polyline on each zoom level. More means
			// better performance and smoother look, and less means more accurate representation.
			smoothFactor: 1.0,

			// @option noClip: Boolean = false
			// Disable polyline clipping.
			noClip: false
		},

		initialize: function (latlngs, options) {
			setOptions(this, options);
			this._setLatLngs(latlngs);
		},

		// @method getLatLngs(): LatLng[]
		// Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
		getLatLngs: function () {
			return this._latlngs;
		},

		// @method setLatLngs(latlngs: LatLng[]): this
		// Replaces all the points in the polyline with the given array of geographical points.
		setLatLngs: function (latlngs) {
			this._setLatLngs(latlngs);
			return this.redraw();
		},

		// @method isEmpty(): Boolean
		// Returns `true` if the Polyline has no LatLngs.
		isEmpty: function () {
			return !this._latlngs.length;
		},

		// @method closestLayerPoint(p: Point): Point
		// Returns the point closest to `p` on the Polyline.
		closestLayerPoint: function (p) {
			var minDistance = Infinity,
			    minPoint = null,
			    closest = _sqClosestPointOnSegment,
			    p1, p2;

			for (var j = 0, jLen = this._parts.length; j < jLen; j++) {
				var points = this._parts[j];

				for (var i = 1, len = points.length; i < len; i++) {
					p1 = points[i - 1];
					p2 = points[i];

					var sqDist = closest(p, p1, p2, true);

					if (sqDist < minDistance) {
						minDistance = sqDist;
						minPoint = closest(p, p1, p2);
					}
				}
			}
			if (minPoint) {
				minPoint.distance = Math.sqrt(minDistance);
			}
			return minPoint;
		},

		// @method getCenter(): LatLng
		// Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the polyline.
		getCenter: function () {
			// throws error when not yet added to map as this center calculation requires projected coordinates
			if (!this._map) {
				throw new Error('Must add layer to map before using getCenter()');
			}

			var i, halfDist, segDist, dist, p1, p2, ratio,
			    points = this._rings[0],
			    len = points.length;

			if (!len) { return null; }

			// polyline centroid algorithm; only uses the first ring if there are multiple

			for (i = 0, halfDist = 0; i < len - 1; i++) {
				halfDist += points[i].distanceTo(points[i + 1]) / 2;
			}

			// The line is so small in the current view that all points are on the same pixel.
			if (halfDist === 0) {
				return this._map.layerPointToLatLng(points[0]);
			}

			for (i = 0, dist = 0; i < len - 1; i++) {
				p1 = points[i];
				p2 = points[i + 1];
				segDist = p1.distanceTo(p2);
				dist += segDist;

				if (dist > halfDist) {
					ratio = (dist - halfDist) / segDist;
					return this._map.layerPointToLatLng([
						p2.x - ratio * (p2.x - p1.x),
						p2.y - ratio * (p2.y - p1.y)
					]);
				}
			}
		},

		// @method getBounds(): LatLngBounds
		// Returns the `LatLngBounds` of the path.
		getBounds: function () {
			return this._bounds;
		},

		// @method addLatLng(latlng: LatLng, latlngs? LatLng[]): this
		// Adds a given point to the polyline. By default, adds to the first ring of
		// the polyline in case of a multi-polyline, but can be overridden by passing
		// a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
		addLatLng: function (latlng, latlngs) {
			latlngs = latlngs || this._defaultShape();
			latlng = toLatLng(latlng);
			latlngs.push(latlng);
			this._bounds.extend(latlng);
			return this.redraw();
		},

		_setLatLngs: function (latlngs) {
			this._bounds = new LatLngBounds();
			this._latlngs = this._convertLatLngs(latlngs);
		},

		_defaultShape: function () {
			return isFlat(this._latlngs) ? this._latlngs : this._latlngs[0];
		},

		// recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
		_convertLatLngs: function (latlngs) {
			var result = [],
			    flat = isFlat(latlngs);

			for (var i = 0, len = latlngs.length; i < len; i++) {
				if (flat) {
					result[i] = toLatLng(latlngs[i]);
					this._bounds.extend(result[i]);
				} else {
					result[i] = this._convertLatLngs(latlngs[i]);
				}
			}

			return result;
		},

		_project: function () {
			var pxBounds = new Bounds();
			this._rings = [];
			this._projectLatlngs(this._latlngs, this._rings, pxBounds);

			if (this._bounds.isValid() && pxBounds.isValid()) {
				this._rawPxBounds = pxBounds;
				this._updateBounds();
			}
		},

		_updateBounds: function () {
			var w = this._clickTolerance(),
			    p = new Point(w, w);
			this._pxBounds = new Bounds([
				this._rawPxBounds.min.subtract(p),
				this._rawPxBounds.max.add(p)
			]);
		},

		// recursively turns latlngs into a set of rings with projected coordinates
		_projectLatlngs: function (latlngs, result, projectedBounds) {
			var flat = latlngs[0] instanceof LatLng,
			    len = latlngs.length,
			    i, ring;

			if (flat) {
				ring = [];
				for (i = 0; i < len; i++) {
					ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
					projectedBounds.extend(ring[i]);
				}
				result.push(ring);
			} else {
				for (i = 0; i < len; i++) {
					this._projectLatlngs(latlngs[i], result, projectedBounds);
				}
			}
		},

		// clip polyline by renderer bounds so that we have less to render for performance
		_clipPoints: function () {
			var bounds = this._renderer._bounds;

			this._parts = [];
			if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
				return;
			}

			if (this.options.noClip) {
				this._parts = this._rings;
				return;
			}

			var parts = this._parts,
			    i, j, k, len, len2, segment, points;

			for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
				points = this._rings[i];

				for (j = 0, len2 = points.length; j < len2 - 1; j++) {
					segment = clipSegment(points[j], points[j + 1], bounds, j, true);

					if (!segment) { continue; }

					parts[k] = parts[k] || [];
					parts[k].push(segment[0]);

					// if segment goes out of screen, or it's the last one, it's the end of the line part
					if ((segment[1] !== points[j + 1]) || (j === len2 - 2)) {
						parts[k].push(segment[1]);
						k++;
					}
				}
			}
		},

		// simplify each clipped part of the polyline for performance
		_simplifyPoints: function () {
			var parts = this._parts,
			    tolerance = this.options.smoothFactor;

			for (var i = 0, len = parts.length; i < len; i++) {
				parts[i] = simplify(parts[i], tolerance);
			}
		},

		_update: function () {
			if (!this._map) { return; }

			this._clipPoints();
			this._simplifyPoints();
			this._updatePath();
		},

		_updatePath: function () {
			this._renderer._updatePoly(this);
		},

		// Needed by the `Canvas` renderer for interactivity
		_containsPoint: function (p, closed) {
			var i, j, k, len, len2, part,
			    w = this._clickTolerance();

			if (!this._pxBounds || !this._pxBounds.contains(p)) { return false; }

			// hit detection for polylines
			for (i = 0, len = this._parts.length; i < len; i++) {
				part = this._parts[i];

				for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
					if (!closed && (j === 0)) { continue; }

					if (pointToSegmentDistance(p, part[k], part[j]) <= w) {
						return true;
					}
				}
			}
			return false;
		}
	});

	// @factory L.polyline(latlngs: LatLng[], options?: Polyline options)
	// Instantiates a polyline object given an array of geographical points and
	// optionally an options object. You can create a `Polyline` object with
	// multiple separate lines (`MultiPolyline`) by passing an array of arrays
	// of geographic points.
	function polyline(latlngs, options) {
		return new Polyline(latlngs, options);
	}

	// Retrocompat. Allow plugins to support Leaflet versions before and after 1.1.
	Polyline._flat = _flat;

	/*
	 * @class Polygon
	 * @aka L.Polygon
	 * @inherits Polyline
	 *
	 * A class for drawing polygon overlays on a map. Extends `Polyline`.
	 *
	 * Note that points you pass when creating a polygon shouldn't have an additional last point equal to the first one — it's better to filter out such points.
	 *
	 *
	 * @example
	 *
	 * ```js
	 * // create a red polygon from an array of LatLng points
	 * var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
	 *
	 * var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
	 *
	 * // zoom the map to the polygon
	 * map.fitBounds(polygon.getBounds());
	 * ```
	 *
	 * You can also pass an array of arrays of latlngs, with the first array representing the outer shape and the other arrays representing holes in the outer shape:
	 *
	 * ```js
	 * var latlngs = [
	 *   [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
	 *   [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
	 * ];
	 * ```
	 *
	 * Additionally, you can pass a multi-dimensional array to represent a MultiPolygon shape.
	 *
	 * ```js
	 * var latlngs = [
	 *   [ // first polygon
	 *     [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
	 *     [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
	 *   ],
	 *   [ // second polygon
	 *     [[41, -111.03],[45, -111.04],[45, -104.05],[41, -104.05]]
	 *   ]
	 * ];
	 * ```
	 */

	var Polygon = Polyline.extend({

		options: {
			fill: true
		},

		isEmpty: function () {
			return !this._latlngs.length || !this._latlngs[0].length;
		},

		getCenter: function () {
			// throws error when not yet added to map as this center calculation requires projected coordinates
			if (!this._map) {
				throw new Error('Must add layer to map before using getCenter()');
			}

			var i, j, p1, p2, f, area, x, y, center,
			    points = this._rings[0],
			    len = points.length;

			if (!len) { return null; }

			// polygon centroid algorithm; only uses the first ring if there are multiple

			area = x = y = 0;

			for (i = 0, j = len - 1; i < len; j = i++) {
				p1 = points[i];
				p2 = points[j];

				f = p1.y * p2.x - p2.y * p1.x;
				x += (p1.x + p2.x) * f;
				y += (p1.y + p2.y) * f;
				area += f * 3;
			}

			if (area === 0) {
				// Polygon is so small that all points are on same pixel.
				center = points[0];
			} else {
				center = [x / area, y / area];
			}
			return this._map.layerPointToLatLng(center);
		},

		_convertLatLngs: function (latlngs) {
			var result = Polyline.prototype._convertLatLngs.call(this, latlngs),
			    len = result.length;

			// remove last point if it equals first one
			if (len >= 2 && result[0] instanceof LatLng && result[0].equals(result[len - 1])) {
				result.pop();
			}
			return result;
		},

		_setLatLngs: function (latlngs) {
			Polyline.prototype._setLatLngs.call(this, latlngs);
			if (isFlat(this._latlngs)) {
				this._latlngs = [this._latlngs];
			}
		},

		_defaultShape: function () {
			return isFlat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
		},

		_clipPoints: function () {
			// polygons need a different clipping algorithm so we redefine that

			var bounds = this._renderer._bounds,
			    w = this.options.weight,
			    p = new Point(w, w);

			// increase clip padding by stroke width to avoid stroke on clip edges
			bounds = new Bounds(bounds.min.subtract(p), bounds.max.add(p));

			this._parts = [];
			if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
				return;
			}

			if (this.options.noClip) {
				this._parts = this._rings;
				return;
			}

			for (var i = 0, len = this._rings.length, clipped; i < len; i++) {
				clipped = clipPolygon(this._rings[i], bounds, true);
				if (clipped.length) {
					this._parts.push(clipped);
				}
			}
		},

		_updatePath: function () {
			this._renderer._updatePoly(this, true);
		},

		// Needed by the `Canvas` renderer for interactivity
		_containsPoint: function (p) {
			var inside = false,
			    part, p1, p2, i, j, k, len, len2;

			if (!this._pxBounds || !this._pxBounds.contains(p)) { return false; }

			// ray casting algorithm for detecting if point is in polygon
			for (i = 0, len = this._parts.length; i < len; i++) {
				part = this._parts[i];

				for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
					p1 = part[j];
					p2 = part[k];

					if (((p1.y > p.y) !== (p2.y > p.y)) && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
						inside = !inside;
					}
				}
			}

			// also check if it's on polygon stroke
			return inside || Polyline.prototype._containsPoint.call(this, p, true);
		}

	});


	// @factory L.polygon(latlngs: LatLng[], options?: Polyline options)
	function polygon(latlngs, options) {
		return new Polygon(latlngs, options);
	}

	/*
	 * @class GeoJSON
	 * @aka L.GeoJSON
	 * @inherits FeatureGroup
	 *
	 * Represents a GeoJSON object or an array of GeoJSON objects. Allows you to parse
	 * GeoJSON data and display it on the map. Extends `FeatureGroup`.
	 *
	 * @example
	 *
	 * ```js
	 * L.geoJSON(data, {
	 * 	style: function (feature) {
	 * 		return {color: feature.properties.color};
	 * 	}
	 * }).bindPopup(function (layer) {
	 * 	return layer.feature.properties.description;
	 * }).addTo(map);
	 * ```
	 */

	var GeoJSON = FeatureGroup.extend({

		/* @section
		 * @aka GeoJSON options
		 *
		 * @option pointToLayer: Function = *
		 * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
		 * called when data is added, passing the GeoJSON point feature and its `LatLng`.
		 * The default is to spawn a default `Marker`:
		 * ```js
		 * function(geoJsonPoint, latlng) {
		 * 	return L.marker(latlng);
		 * }
		 * ```
		 *
		 * @option style: Function = *
		 * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
		 * called internally when data is added.
		 * The default value is to not override any defaults:
		 * ```js
		 * function (geoJsonFeature) {
		 * 	return {}
		 * }
		 * ```
		 *
		 * @option onEachFeature: Function = *
		 * A `Function` that will be called once for each created `Feature`, after it has
		 * been created and styled. Useful for attaching events and popups to features.
		 * The default is to do nothing with the newly created layers:
		 * ```js
		 * function (feature, layer) {}
		 * ```
		 *
		 * @option filter: Function = *
		 * A `Function` that will be used to decide whether to include a feature or not.
		 * The default is to include all features:
		 * ```js
		 * function (geoJsonFeature) {
		 * 	return true;
		 * }
		 * ```
		 * Note: dynamically changing the `filter` option will have effect only on newly
		 * added data. It will _not_ re-evaluate already included features.
		 *
		 * @option coordsToLatLng: Function = *
		 * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
		 * The default is the `coordsToLatLng` static method.
		 *
		 * @option markersInheritOptions: Boolean = false
		 * Whether default Markers for "Point" type Features inherit from group options.
		 */

		initialize: function (geojson, options) {
			setOptions(this, options);

			this._layers = {};

			if (geojson) {
				this.addData(geojson);
			}
		},

		// @method addData( <GeoJSON> data ): this
		// Adds a GeoJSON object to the layer.
		addData: function (geojson) {
			var features = isArray(geojson) ? geojson : geojson.features,
			    i, len, feature;

			if (features) {
				for (i = 0, len = features.length; i < len; i++) {
					// only add this if geometry or geometries are set and not null
					feature = features[i];
					if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
						this.addData(feature);
					}
				}
				return this;
			}

			var options = this.options;

			if (options.filter && !options.filter(geojson)) { return this; }

			var layer = geometryToLayer(geojson, options);
			if (!layer) {
				return this;
			}
			layer.feature = asFeature(geojson);

			layer.defaultOptions = layer.options;
			this.resetStyle(layer);

			if (options.onEachFeature) {
				options.onEachFeature(geojson, layer);
			}

			return this.addLayer(layer);
		},

		// @method resetStyle( <Path> layer? ): this
		// Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
		// If `layer` is omitted, the style of all features in the current layer is reset.
		resetStyle: function (layer) {
			if (layer === undefined) {
				return this.eachLayer(this.resetStyle, this);
			}
			// reset any custom styles
			layer.options = extend({}, layer.defaultOptions);
			this._setLayerStyle(layer, this.options.style);
			return this;
		},

		// @method setStyle( <Function> style ): this
		// Changes styles of GeoJSON vector layers with the given style function.
		setStyle: function (style) {
			return this.eachLayer(function (layer) {
				this._setLayerStyle(layer, style);
			}, this);
		},

		_setLayerStyle: function (layer, style) {
			if (layer.setStyle) {
				if (typeof style === 'function') {
					style = style(layer.feature);
				}
				layer.setStyle(style);
			}
		}
	});

	// @section
	// There are several static functions which can be called without instantiating L.GeoJSON:

	// @function geometryToLayer(featureData: Object, options?: GeoJSON options): Layer
	// Creates a `Layer` from a given GeoJSON feature. Can use a custom
	// [`pointToLayer`](#geojson-pointtolayer) and/or [`coordsToLatLng`](#geojson-coordstolatlng)
	// functions if provided as options.
	function geometryToLayer(geojson, options) {

		var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
		    coords = geometry ? geometry.coordinates : null,
		    layers = [],
		    pointToLayer = options && options.pointToLayer,
		    _coordsToLatLng = options && options.coordsToLatLng || coordsToLatLng,
		    latlng, latlngs, i, len;

		if (!coords && !geometry) {
			return null;
		}

		switch (geometry.type) {
		case 'Point':
			latlng = _coordsToLatLng(coords);
			return _pointToLayer(pointToLayer, geojson, latlng, options);

		case 'MultiPoint':
			for (i = 0, len = coords.length; i < len; i++) {
				latlng = _coordsToLatLng(coords[i]);
				layers.push(_pointToLayer(pointToLayer, geojson, latlng, options));
			}
			return new FeatureGroup(layers);

		case 'LineString':
		case 'MultiLineString':
			latlngs = coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, _coordsToLatLng);
			return new Polyline(latlngs, options);

		case 'Polygon':
		case 'MultiPolygon':
			latlngs = coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, _coordsToLatLng);
			return new Polygon(latlngs, options);

		case 'GeometryCollection':
			for (i = 0, len = geometry.geometries.length; i < len; i++) {
				var layer = geometryToLayer({
					geometry: geometry.geometries[i],
					type: 'Feature',
					properties: geojson.properties
				}, options);

				if (layer) {
					layers.push(layer);
				}
			}
			return new FeatureGroup(layers);

		default:
			throw new Error('Invalid GeoJSON object.');
		}
	}

	function _pointToLayer(pointToLayerFn, geojson, latlng, options) {
		return pointToLayerFn ?
			pointToLayerFn(geojson, latlng) :
			new Marker(latlng, options && options.markersInheritOptions && options);
	}

	// @function coordsToLatLng(coords: Array): LatLng
	// Creates a `LatLng` object from an array of 2 numbers (longitude, latitude)
	// or 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
	function coordsToLatLng(coords) {
		return new LatLng(coords[1], coords[0], coords[2]);
	}

	// @function coordsToLatLngs(coords: Array, levelsDeep?: Number, coordsToLatLng?: Function): Array
	// Creates a multidimensional array of `LatLng`s from a GeoJSON coordinates array.
	// `levelsDeep` specifies the nesting level (0 is for an array of points, 1 for an array of arrays of points, etc., 0 by default).
	// Can use a custom [`coordsToLatLng`](#geojson-coordstolatlng) function.
	function coordsToLatLngs(coords, levelsDeep, _coordsToLatLng) {
		var latlngs = [];

		for (var i = 0, len = coords.length, latlng; i < len; i++) {
			latlng = levelsDeep ?
				coordsToLatLngs(coords[i], levelsDeep - 1, _coordsToLatLng) :
				(_coordsToLatLng || coordsToLatLng)(coords[i]);

			latlngs.push(latlng);
		}

		return latlngs;
	}

	// @function latLngToCoords(latlng: LatLng, precision?: Number): Array
	// Reverse of [`coordsToLatLng`](#geojson-coordstolatlng)
	function latLngToCoords(latlng, precision) {
		precision = typeof precision === 'number' ? precision : 6;
		return latlng.alt !== undefined ?
			[formatNum(latlng.lng, precision), formatNum(latlng.lat, precision), formatNum(latlng.alt, precision)] :
			[formatNum(latlng.lng, precision), formatNum(latlng.lat, precision)];
	}

	// @function latLngsToCoords(latlngs: Array, levelsDeep?: Number, closed?: Boolean): Array
	// Reverse of [`coordsToLatLngs`](#geojson-coordstolatlngs)
	// `closed` determines whether the first point should be appended to the end of the array to close the feature, only used when `levelsDeep` is 0. False by default.
	function latLngsToCoords(latlngs, levelsDeep, closed, precision) {
		var coords = [];

		for (var i = 0, len = latlngs.length; i < len; i++) {
			coords.push(levelsDeep ?
				latLngsToCoords(latlngs[i], levelsDeep - 1, closed, precision) :
				latLngToCoords(latlngs[i], precision));
		}

		if (!levelsDeep && closed) {
			coords.push(coords[0]);
		}

		return coords;
	}

	function getFeature(layer, newGeometry) {
		return layer.feature ?
			extend({}, layer.feature, {geometry: newGeometry}) :
			asFeature(newGeometry);
	}

	// @function asFeature(geojson: Object): Object
	// Normalize GeoJSON geometries/features into GeoJSON features.
	function asFeature(geojson) {
		if (geojson.type === 'Feature' || geojson.type === 'FeatureCollection') {
			return geojson;
		}

		return {
			type: 'Feature',
			properties: {},
			geometry: geojson
		};
	}

	var PointToGeoJSON = {
		toGeoJSON: function (precision) {
			return getFeature(this, {
				type: 'Point',
				coordinates: latLngToCoords(this.getLatLng(), precision)
			});
		}
	};

	// @namespace Marker
	// @section Other methods
	// @method toGeoJSON(precision?: Number): Object
	// `precision` is the number of decimal places for coordinates.
	// The default value is 6 places.
	// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the marker (as a GeoJSON `Point` Feature).
	Marker.include(PointToGeoJSON);

	// @namespace CircleMarker
	// @method toGeoJSON(precision?: Number): Object
	// `precision` is the number of decimal places for coordinates.
	// The default value is 6 places.
	// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the circle marker (as a GeoJSON `Point` Feature).
	Circle.include(PointToGeoJSON);
	CircleMarker.include(PointToGeoJSON);


	// @namespace Polyline
	// @method toGeoJSON(precision?: Number): Object
	// `precision` is the number of decimal places for coordinates.
	// The default value is 6 places.
	// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polyline (as a GeoJSON `LineString` or `MultiLineString` Feature).
	Polyline.include({
		toGeoJSON: function (precision) {
			var multi = !isFlat(this._latlngs);

			var coords = latLngsToCoords(this._latlngs, multi ? 1 : 0, false, precision);

			return getFeature(this, {
				type: (multi ? 'Multi' : '') + 'LineString',
				coordinates: coords
			});
		}
	});

	// @namespace Polygon
	// @method toGeoJSON(precision?: Number): Object
	// `precision` is the number of decimal places for coordinates.
	// The default value is 6 places.
	// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polygon (as a GeoJSON `Polygon` or `MultiPolygon` Feature).
	Polygon.include({
		toGeoJSON: function (precision) {
			var holes = !isFlat(this._latlngs),
			    multi = holes && !isFlat(this._latlngs[0]);

			var coords = latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true, precision);

			if (!holes) {
				coords = [coords];
			}

			return getFeature(this, {
				type: (multi ? 'Multi' : '') + 'Polygon',
				coordinates: coords
			});
		}
	});


	// @namespace LayerGroup
	LayerGroup.include({
		toMultiPoint: function (precision) {
			var coords = [];

			this.eachLayer(function (layer) {
				coords.push(layer.toGeoJSON(precision).geometry.coordinates);
			});

			return getFeature(this, {
				type: 'MultiPoint',
				coordinates: coords
			});
		},

		// @method toGeoJSON(precision?: Number): Object
		// `precision` is the number of decimal places for coordinates.
		// The default value is 6 places.
		// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
		toGeoJSON: function (precision) {

			var type = this.feature && this.feature.geometry && this.feature.geometry.type;

			if (type === 'MultiPoint') {
				return this.toMultiPoint(precision);
			}

			var isGeometryCollection = type === 'GeometryCollection',
			    jsons = [];

			this.eachLayer(function (layer) {
				if (layer.toGeoJSON) {
					var json = layer.toGeoJSON(precision);
					if (isGeometryCollection) {
						jsons.push(json.geometry);
					} else {
						var feature = asFeature(json);
						// Squash nested feature collections
						if (feature.type === 'FeatureCollection') {
							jsons.push.apply(jsons, feature.features);
						} else {
							jsons.push(feature);
						}
					}
				}
			});

			if (isGeometryCollection) {
				return getFeature(this, {
					geometries: jsons,
					type: 'GeometryCollection'
				});
			}

			return {
				type: 'FeatureCollection',
				features: jsons
			};
		}
	});

	// @namespace GeoJSON
	// @factory L.geoJSON(geojson?: Object, options?: GeoJSON options)
	// Creates a GeoJSON layer. Optionally accepts an object in
	// [GeoJSON format](https://tools.ietf.org/html/rfc7946) to display on the map
	// (you can alternatively add it later with `addData` method) and an `options` object.
	function geoJSON(geojson, options) {
		return new GeoJSON(geojson, options);
	}

	// Backward compatibility.
	var geoJson = geoJSON;

	/*
	 * @class ImageOverlay
	 * @aka L.ImageOverlay
	 * @inherits Interactive layer
	 *
	 * Used to load and display a single image over specific bounds of the map. Extends `Layer`.
	 *
	 * @example
	 *
	 * ```js
	 * var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
	 * 	imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
	 * L.imageOverlay(imageUrl, imageBounds).addTo(map);
	 * ```
	 */

	var ImageOverlay = Layer.extend({

		// @section
		// @aka ImageOverlay options
		options: {
			// @option opacity: Number = 1.0
			// The opacity of the image overlay.
			opacity: 1,

			// @option alt: String = ''
			// Text for the `alt` attribute of the image (useful for accessibility).
			alt: '',

			// @option interactive: Boolean = false
			// If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
			interactive: false,

			// @option crossOrigin: Boolean|String = false
			// Whether the crossOrigin attribute will be added to the image.
			// If a String is provided, the image will have its crossOrigin attribute set to the String provided. This is needed if you want to access image pixel data.
			// Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
			crossOrigin: false,

			// @option errorOverlayUrl: String = ''
			// URL to the overlay image to show in place of the overlay that failed to load.
			errorOverlayUrl: '',

			// @option zIndex: Number = 1
			// The explicit [zIndex](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index) of the overlay layer.
			zIndex: 1,

			// @option className: String = ''
			// A custom class name to assign to the image. Empty by default.
			className: ''
		},

		initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
			this._url = url;
			this._bounds = toLatLngBounds(bounds);

			setOptions(this, options);
		},

		onAdd: function () {
			if (!this._image) {
				this._initImage();

				if (this.options.opacity < 1) {
					this._updateOpacity();
				}
			}

			if (this.options.interactive) {
				addClass(this._image, 'leaflet-interactive');
				this.addInteractiveTarget(this._image);
			}

			this.getPane().appendChild(this._image);
			this._reset();
		},

		onRemove: function () {
			remove(this._image);
			if (this.options.interactive) {
				this.removeInteractiveTarget(this._image);
			}
		},

		// @method setOpacity(opacity: Number): this
		// Sets the opacity of the overlay.
		setOpacity: function (opacity) {
			this.options.opacity = opacity;

			if (this._image) {
				this._updateOpacity();
			}
			return this;
		},

		setStyle: function (styleOpts) {
			if (styleOpts.opacity) {
				this.setOpacity(styleOpts.opacity);
			}
			return this;
		},

		// @method bringToFront(): this
		// Brings the layer to the top of all overlays.
		bringToFront: function () {
			if (this._map) {
				toFront(this._image);
			}
			return this;
		},

		// @method bringToBack(): this
		// Brings the layer to the bottom of all overlays.
		bringToBack: function () {
			if (this._map) {
				toBack(this._image);
			}
			return this;
		},

		// @method setUrl(url: String): this
		// Changes the URL of the image.
		setUrl: function (url) {
			this._url = url;

			if (this._image) {
				this._image.src = url;
			}
			return this;
		},

		// @method setBounds(bounds: LatLngBounds): this
		// Update the bounds that this ImageOverlay covers
		setBounds: function (bounds) {
			this._bounds = toLatLngBounds(bounds);

			if (this._map) {
				this._reset();
			}
			return this;
		},

		getEvents: function () {
			var events = {
				zoom: this._reset,
				viewreset: this._reset
			};

			if (this._zoomAnimated) {
				events.zoomanim = this._animateZoom;
			}

			return events;
		},

		// @method setZIndex(value: Number): this
		// Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
		setZIndex: function (value) {
			this.options.zIndex = value;
			this._updateZIndex();
			return this;
		},

		// @method getBounds(): LatLngBounds
		// Get the bounds that this ImageOverlay covers
		getBounds: function () {
			return this._bounds;
		},

		// @method getElement(): HTMLElement
		// Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
		// used by this overlay.
		getElement: function () {
			return this._image;
		},

		_initImage: function () {
			var wasElementSupplied = this._url.tagName === 'IMG';
			var img = this._image = wasElementSupplied ? this._url : create$1('img');

			addClass(img, 'leaflet-image-layer');
			if (this._zoomAnimated) { addClass(img, 'leaflet-zoom-animated'); }
			if (this.options.className) { addClass(img, this.options.className); }

			img.onselectstart = falseFn;
			img.onmousemove = falseFn;

			// @event load: Event
			// Fired when the ImageOverlay layer has loaded its image
			img.onload = bind(this.fire, this, 'load');
			img.onerror = bind(this._overlayOnError, this, 'error');

			if (this.options.crossOrigin || this.options.crossOrigin === '') {
				img.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin;
			}

			if (this.options.zIndex) {
				this._updateZIndex();
			}

			if (wasElementSupplied) {
				this._url = img.src;
				return;
			}

			img.src = this._url;
			img.alt = this.options.alt;
		},

		_animateZoom: function (e) {
			var scale = this._map.getZoomScale(e.zoom),
			    offset = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;

			setTransform(this._image, offset, scale);
		},

		_reset: function () {
			var image = this._image,
			    bounds = new Bounds(
			        this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
			        this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
			    size = bounds.getSize();

			setPosition(image, bounds.min);

			image.style.width  = size.x + 'px';
			image.style.height = size.y + 'px';
		},

		_updateOpacity: function () {
			setOpacity(this._image, this.options.opacity);
		},

		_updateZIndex: function () {
			if (this._image && this.options.zIndex !== undefined && this.options.zIndex !== null) {
				this._image.style.zIndex = this.options.zIndex;
			}
		},

		_overlayOnError: function () {
			// @event error: Event
			// Fired when the ImageOverlay layer fails to load its image
			this.fire('error');

			var errorUrl = this.options.errorOverlayUrl;
			if (errorUrl && this._url !== errorUrl) {
				this._url = errorUrl;
				this._image.src = errorUrl;
			}
		}
	});

	// @factory L.imageOverlay(imageUrl: String, bounds: LatLngBounds, options?: ImageOverlay options)
	// Instantiates an image overlay object given the URL of the image and the
	// geographical bounds it is tied to.
	var imageOverlay = function (url, bounds, options) {
		return new ImageOverlay(url, bounds, options);
	};

	/*
	 * @class VideoOverlay
	 * @aka L.VideoOverlay
	 * @inherits ImageOverlay
	 *
	 * Used to load and display a video player over specific bounds of the map. Extends `ImageOverlay`.
	 *
	 * A video overlay uses the [`<video>`](https://developer.mozilla.org/docs/Web/HTML/Element/video)
	 * HTML5 element.
	 *
	 * @example
	 *
	 * ```js
	 * var videoUrl = 'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
	 * 	videoBounds = [[ 32, -130], [ 13, -100]];
	 * L.videoOverlay(videoUrl, videoBounds ).addTo(map);
	 * ```
	 */

	var VideoOverlay = ImageOverlay.extend({

		// @section
		// @aka VideoOverlay options
		options: {
			// @option autoplay: Boolean = true
			// Whether the video starts playing automatically when loaded.
			autoplay: true,

			// @option loop: Boolean = true
			// Whether the video will loop back to the beginning when played.
			loop: true,

			// @option keepAspectRatio: Boolean = true
			// Whether the video will save aspect ratio after the projection.
			// Relevant for supported browsers. Browser compatibility- https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
			keepAspectRatio: true
		},

		_initImage: function () {
			var wasElementSupplied = this._url.tagName === 'VIDEO';
			var vid = this._image = wasElementSupplied ? this._url : create$1('video');

			addClass(vid, 'leaflet-image-layer');
			if (this._zoomAnimated) { addClass(vid, 'leaflet-zoom-animated'); }
			if (this.options.className) { addClass(vid, this.options.className); }

			vid.onselectstart = falseFn;
			vid.onmousemove = falseFn;

			// @event load: Event
			// Fired when the video has finished loading the first frame
			vid.onloadeddata = bind(this.fire, this, 'load');

			if (wasElementSupplied) {
				var sourceElements = vid.getElementsByTagName('source');
				var sources = [];
				for (var j = 0; j < sourceElements.length; j++) {
					sources.push(sourceElements[j].src);
				}

				this._url = (sourceElements.length > 0) ? sources : [vid.src];
				return;
			}

			if (!isArray(this._url)) { this._url = [this._url]; }

			if (!this.options.keepAspectRatio && vid.style.hasOwnProperty('objectFit')) { vid.style['objectFit'] = 'fill'; }
			vid.autoplay = !!this.options.autoplay;
			vid.loop = !!this.options.loop;
			for (var i = 0; i < this._url.length; i++) {
				var source = create$1('source');
				source.src = this._url[i];
				vid.appendChild(source);
			}
		}

		// @method getElement(): HTMLVideoElement
		// Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
		// used by this overlay.
	});


	// @factory L.videoOverlay(video: String|Array|HTMLVideoElement, bounds: LatLngBounds, options?: VideoOverlay options)
	// Instantiates an image overlay object given the URL of the video (or array of URLs, or even a video element) and the
	// geographical bounds it is tied to.

	function videoOverlay(video, bounds, options) {
		return new VideoOverlay(video, bounds, options);
	}

	/*
	 * @class SVGOverlay
	 * @aka L.SVGOverlay
	 * @inherits ImageOverlay
	 *
	 * Used to load, display and provide DOM access to an SVG file over specific bounds of the map. Extends `ImageOverlay`.
	 *
	 * An SVG overlay uses the [`<svg>`](https://developer.mozilla.org/docs/Web/SVG/Element/svg) element.
	 *
	 * @example
	 *
	 * ```js
	 * var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	 * svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	 * svgElement.setAttribute('viewBox', "0 0 200 200");
	 * svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>';
	 * var svgElementBounds = [ [ 32, -130 ], [ 13, -100 ] ];
	 * L.svgOverlay(svgElement, svgElementBounds).addTo(map);
	 * ```
	 */

	var SVGOverlay = ImageOverlay.extend({
		_initImage: function () {
			var el = this._image = this._url;

			addClass(el, 'leaflet-image-layer');
			if (this._zoomAnimated) { addClass(el, 'leaflet-zoom-animated'); }
			if (this.options.className) { addClass(el, this.options.className); }

			el.onselectstart = falseFn;
			el.onmousemove = falseFn;
		}

		// @method getElement(): SVGElement
		// Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
		// used by this overlay.
	});


	// @factory L.svgOverlay(svg: String|SVGElement, bounds: LatLngBounds, options?: SVGOverlay options)
	// Instantiates an image overlay object given an SVG element and the geographical bounds it is tied to.
	// A viewBox attribute is required on the SVG element to zoom in and out properly.

	function svgOverlay(el, bounds, options) {
		return new SVGOverlay(el, bounds, options);
	}

	/*
	 * @class DivOverlay
	 * @inherits Layer
	 * @aka L.DivOverlay
	 * Base model for L.Popup and L.Tooltip. Inherit from it for custom popup like plugins.
	 */

	// @namespace DivOverlay
	var DivOverlay = Layer.extend({

		// @section
		// @aka DivOverlay options
		options: {
			// @option offset: Point = Point(0, 7)
			// The offset of the popup position. Useful to control the anchor
			// of the popup when opening it on some overlays.
			offset: [0, 7],

			// @option className: String = ''
			// A custom CSS class name to assign to the popup.
			className: '',

			// @option pane: String = 'popupPane'
			// `Map pane` where the popup will be added.
			pane: 'popupPane'
		},

		initialize: function (options, source) {
			setOptions(this, options);

			this._source = source;
		},

		onAdd: function (map) {
			this._zoomAnimated = map._zoomAnimated;

			if (!this._container) {
				this._initLayout();
			}

			if (map._fadeAnimated) {
				setOpacity(this._container, 0);
			}

			clearTimeout(this._removeTimeout);
			this.getPane().appendChild(this._container);
			this.update();

			if (map._fadeAnimated) {
				setOpacity(this._container, 1);
			}

			this.bringToFront();
		},

		onRemove: function (map) {
			if (map._fadeAnimated) {
				setOpacity(this._container, 0);
				this._removeTimeout = setTimeout(bind(remove, undefined, this._container), 200);
			} else {
				remove(this._container);
			}
		},

		// @namespace Popup
		// @method getLatLng: LatLng
		// Returns the geographical point of popup.
		getLatLng: function () {
			return this._latlng;
		},

		// @method setLatLng(latlng: LatLng): this
		// Sets the geographical point where the popup will open.
		setLatLng: function (latlng) {
			this._latlng = toLatLng(latlng);
			if (this._map) {
				this._updatePosition();
				this._adjustPan();
			}
			return this;
		},

		// @method getContent: String|HTMLElement
		// Returns the content of the popup.
		getContent: function () {
			return this._content;
		},

		// @method setContent(htmlContent: String|HTMLElement|Function): this
		// Sets the HTML content of the popup. If a function is passed the source layer will be passed to the function. The function should return a `String` or `HTMLElement` to be used in the popup.
		setContent: function (content) {
			this._content = content;
			this.update();
			return this;
		},

		// @method getElement: String|HTMLElement
		// Alias for [getContent()](#popup-getcontent)
		getElement: function () {
			return this._container;
		},

		// @method update: null
		// Updates the popup content, layout and position. Useful for updating the popup after something inside changed, e.g. image loaded.
		update: function () {
			if (!this._map) { return; }

			this._container.style.visibility = 'hidden';

			this._updateContent();
			this._updateLayout();
			this._updatePosition();

			this._container.style.visibility = '';

			this._adjustPan();
		},

		getEvents: function () {
			var events = {
				zoom: this._updatePosition,
				viewreset: this._updatePosition
			};

			if (this._zoomAnimated) {
				events.zoomanim = this._animateZoom;
			}
			return events;
		},

		// @method isOpen: Boolean
		// Returns `true` when the popup is visible on the map.
		isOpen: function () {
			return !!this._map && this._map.hasLayer(this);
		},

		// @method bringToFront: this
		// Brings this popup in front of other popups (in the same map pane).
		bringToFront: function () {
			if (this._map) {
				toFront(this._container);
			}
			return this;
		},

		// @method bringToBack: this
		// Brings this popup to the back of other popups (in the same map pane).
		bringToBack: function () {
			if (this._map) {
				toBack(this._container);
			}
			return this;
		},

		_prepareOpen: function (parent, layer, latlng) {
			if (!(layer instanceof Layer)) {
				latlng = layer;
				layer = parent;
			}

			if (layer instanceof FeatureGroup) {
				for (var id in parent._layers) {
					layer = parent._layers[id];
					break;
				}
			}

			if (!latlng) {
				if (layer.getCenter) {
					latlng = layer.getCenter();
				} else if (layer.getLatLng) {
					latlng = layer.getLatLng();
				} else {
					throw new Error('Unable to get source layer LatLng.');
				}
			}

			// set overlay source to this layer
			this._source = layer;

			// update the overlay (content, layout, ect...)
			this.update();

			return latlng;
		},

		_updateContent: function () {
			if (!this._content) { return; }

			var node = this._contentNode;
			var content = (typeof this._content === 'function') ? this._content(this._source || this) : this._content;

			if (typeof content === 'string') {
				node.innerHTML = content;
			} else {
				while (node.hasChildNodes()) {
					node.removeChild(node.firstChild);
				}
				node.appendChild(content);
			}
			this.fire('contentupdate');
		},

		_updatePosition: function () {
			if (!this._map) { return; }

			var pos = this._map.latLngToLayerPoint(this._latlng),
			    offset = toPoint(this.options.offset),
			    anchor = this._getAnchor();

			if (this._zoomAnimated) {
				setPosition(this._container, pos.add(anchor));
			} else {
				offset = offset.add(pos).add(anchor);
			}

			var bottom = this._containerBottom = -offset.y,
			    left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

			// bottom position the popup in case the height of the popup changes (images loading etc)
			this._container.style.bottom = bottom + 'px';
			this._container.style.left = left + 'px';
		},

		_getAnchor: function () {
			return [0, 0];
		}

	});

	/*
	 * @class Popup
	 * @inherits DivOverlay
	 * @aka L.Popup
	 * Used to open popups in certain places of the map. Use [Map.openPopup](#map-openpopup) to
	 * open popups while making sure that only one popup is open at one time
	 * (recommended for usability), or use [Map.addLayer](#map-addlayer) to open as many as you want.
	 *
	 * @example
	 *
	 * If you want to just bind a popup to marker click and then open it, it's really easy:
	 *
	 * ```js
	 * marker.bindPopup(popupContent).openPopup();
	 * ```
	 * Path overlays like polylines also have a `bindPopup` method.
	 * Here's a more complicated way to open a popup on a map:
	 *
	 * ```js
	 * var popup = L.popup()
	 * 	.setLatLng(latlng)
	 * 	.setContent('<p>Hello world!<br />This is a nice popup.</p>')
	 * 	.openOn(map);
	 * ```
	 */


	// @namespace Popup
	var Popup = DivOverlay.extend({

		// @section
		// @aka Popup options
		options: {
			// @option maxWidth: Number = 300
			// Max width of the popup, in pixels.
			maxWidth: 300,

			// @option minWidth: Number = 50
			// Min width of the popup, in pixels.
			minWidth: 50,

			// @option maxHeight: Number = null
			// If set, creates a scrollable container of the given height
			// inside a popup if its content exceeds it.
			maxHeight: null,

			// @option autoPan: Boolean = true
			// Set it to `false` if you don't want the map to do panning animation
			// to fit the opened popup.
			autoPan: true,

			// @option autoPanPaddingTopLeft: Point = null
			// The margin between the popup and the top left corner of the map
			// view after autopanning was performed.
			autoPanPaddingTopLeft: null,

			// @option autoPanPaddingBottomRight: Point = null
			// The margin between the popup and the bottom right corner of the map
			// view after autopanning was performed.
			autoPanPaddingBottomRight: null,

			// @option autoPanPadding: Point = Point(5, 5)
			// Equivalent of setting both top left and bottom right autopan padding to the same value.
			autoPanPadding: [5, 5],

			// @option keepInView: Boolean = false
			// Set it to `true` if you want to prevent users from panning the popup
			// off of the screen while it is open.
			keepInView: false,

			// @option closeButton: Boolean = true
			// Controls the presence of a close button in the popup.
			closeButton: true,

			// @option autoClose: Boolean = true
			// Set it to `false` if you want to override the default behavior of
			// the popup closing when another popup is opened.
			autoClose: true,

			// @option closeOnEscapeKey: Boolean = true
			// Set it to `false` if you want to override the default behavior of
			// the ESC key for closing of the popup.
			closeOnEscapeKey: true,

			// @option closeOnClick: Boolean = *
			// Set it if you want to override the default behavior of the popup closing when user clicks
			// on the map. Defaults to the map's [`closePopupOnClick`](#map-closepopuponclick) option.

			// @option className: String = ''
			// A custom CSS class name to assign to the popup.
			className: ''
		},

		// @namespace Popup
		// @method openOn(map: Map): this
		// Adds the popup to the map and closes the previous one. The same as `map.openPopup(popup)`.
		openOn: function (map) {
			map.openPopup(this);
			return this;
		},

		onAdd: function (map) {
			DivOverlay.prototype.onAdd.call(this, map);

			// @namespace Map
			// @section Popup events
			// @event popupopen: PopupEvent
			// Fired when a popup is opened in the map
			map.fire('popupopen', {popup: this});

			if (this._source) {
				// @namespace Layer
				// @section Popup events
				// @event popupopen: PopupEvent
				// Fired when a popup bound to this layer is opened
				this._source.fire('popupopen', {popup: this}, true);
				// For non-path layers, we toggle the popup when clicking
				// again the layer, so prevent the map to reopen it.
				if (!(this._source instanceof Path)) {
					this._source.on('preclick', stopPropagation);
				}
			}
		},

		onRemove: function (map) {
			DivOverlay.prototype.onRemove.call(this, map);

			// @namespace Map
			// @section Popup events
			// @event popupclose: PopupEvent
			// Fired when a popup in the map is closed
			map.fire('popupclose', {popup: this});

			if (this._source) {
				// @namespace Layer
				// @section Popup events
				// @event popupclose: PopupEvent
				// Fired when a popup bound to this layer is closed
				this._source.fire('popupclose', {popup: this}, true);
				if (!(this._source instanceof Path)) {
					this._source.off('preclick', stopPropagation);
				}
			}
		},

		getEvents: function () {
			var events = DivOverlay.prototype.getEvents.call(this);

			if (this.options.closeOnClick !== undefined ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
				events.preclick = this._close;
			}

			if (this.options.keepInView) {
				events.moveend = this._adjustPan;
			}

			return events;
		},

		_close: function () {
			if (this._map) {
				this._map.closePopup(this);
			}
		},

		_initLayout: function () {
			var prefix = 'leaflet-popup',
			    container = this._container = create$1('div',
				prefix + ' ' + (this.options.className || '') +
				' leaflet-zoom-animated');

			var wrapper = this._wrapper = create$1('div', prefix + '-content-wrapper', container);
			this._contentNode = create$1('div', prefix + '-content', wrapper);

			disableClickPropagation(wrapper);
			disableScrollPropagation(this._contentNode);
			on(wrapper, 'contextmenu', stopPropagation);

			this._tipContainer = create$1('div', prefix + '-tip-container', container);
			this._tip = create$1('div', prefix + '-tip', this._tipContainer);

			if (this.options.closeButton) {
				var closeButton = this._closeButton = create$1('a', prefix + '-close-button', container);
				closeButton.href = '#close';
				closeButton.innerHTML = '&#215;';

				on(closeButton, 'click', this._onCloseButtonClick, this);
			}
		},

		_updateLayout: function () {
			var container = this._contentNode,
			    style = container.style;

			style.width = '';
			style.whiteSpace = 'nowrap';

			var width = container.offsetWidth;
			width = Math.min(width, this.options.maxWidth);
			width = Math.max(width, this.options.minWidth);

			style.width = (width + 1) + 'px';
			style.whiteSpace = '';

			style.height = '';

			var height = container.offsetHeight,
			    maxHeight = this.options.maxHeight,
			    scrolledClass = 'leaflet-popup-scrolled';

			if (maxHeight && height > maxHeight) {
				style.height = maxHeight + 'px';
				addClass(container, scrolledClass);
			} else {
				removeClass(container, scrolledClass);
			}

			this._containerWidth = this._container.offsetWidth;
		},

		_animateZoom: function (e) {
			var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
			    anchor = this._getAnchor();
			setPosition(this._container, pos.add(anchor));
		},

		_adjustPan: function () {
			if (!this.options.autoPan) { return; }
			if (this._map._panAnim) { this._map._panAnim.stop(); }

			var map = this._map,
			    marginBottom = parseInt(getStyle(this._container, 'marginBottom'), 10) || 0,
			    containerHeight = this._container.offsetHeight + marginBottom,
			    containerWidth = this._containerWidth,
			    layerPos = new Point(this._containerLeft, -containerHeight - this._containerBottom);

			layerPos._add(getPosition(this._container));

			var containerPos = map.layerPointToContainerPoint(layerPos),
			    padding = toPoint(this.options.autoPanPadding),
			    paddingTL = toPoint(this.options.autoPanPaddingTopLeft || padding),
			    paddingBR = toPoint(this.options.autoPanPaddingBottomRight || padding),
			    size = map.getSize(),
			    dx = 0,
			    dy = 0;

			if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
				dx = containerPos.x + containerWidth - size.x + paddingBR.x;
			}
			if (containerPos.x - dx - paddingTL.x < 0) { // left
				dx = containerPos.x - paddingTL.x;
			}
			if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
				dy = containerPos.y + containerHeight - size.y + paddingBR.y;
			}
			if (containerPos.y - dy - paddingTL.y < 0) { // top
				dy = containerPos.y - paddingTL.y;
			}

			// @namespace Map
			// @section Popup events
			// @event autopanstart: Event
			// Fired when the map starts autopanning when opening a popup.
			if (dx || dy) {
				map
				    .fire('autopanstart')
				    .panBy([dx, dy]);
			}
		},

		_onCloseButtonClick: function (e) {
			this._close();
			stop(e);
		},

		_getAnchor: function () {
			// Where should we anchor the popup on the source layer?
			return toPoint(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
		}

	});

	// @namespace Popup
	// @factory L.popup(options?: Popup options, source?: Layer)
	// Instantiates a `Popup` object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the popup with a reference to the Layer to which it refers.
	var popup = function (options, source) {
		return new Popup(options, source);
	};


	/* @namespace Map
	 * @section Interaction Options
	 * @option closePopupOnClick: Boolean = true
	 * Set it to `false` if you don't want popups to close when user clicks the map.
	 */
	Map.mergeOptions({
		closePopupOnClick: true
	});


	// @namespace Map
	// @section Methods for Layers and Controls
	Map.include({
		// @method openPopup(popup: Popup): this
		// Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
		// @alternative
		// @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
		// Creates a popup with the specified content and options and opens it in the given point on a map.
		openPopup: function (popup, latlng, options) {
			if (!(popup instanceof Popup)) {
				popup = new Popup(options).setContent(popup);
			}

			if (latlng) {
				popup.setLatLng(latlng);
			}

			if (this.hasLayer(popup)) {
				return this;
			}

			if (this._popup && this._popup.options.autoClose) {
				this.closePopup();
			}

			this._popup = popup;
			return this.addLayer(popup);
		},

		// @method closePopup(popup?: Popup): this
		// Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
		closePopup: function (popup) {
			if (!popup || popup === this._popup) {
				popup = this._popup;
				this._popup = null;
			}
			if (popup) {
				this.removeLayer(popup);
			}
			return this;
		}
	});

	/*
	 * @namespace Layer
	 * @section Popup methods example
	 *
	 * All layers share a set of methods convenient for binding popups to it.
	 *
	 * ```js
	 * var layer = L.Polygon(latlngs).bindPopup('Hi There!').addTo(map);
	 * layer.openPopup();
	 * layer.closePopup();
	 * ```
	 *
	 * Popups will also be automatically opened when the layer is clicked on and closed when the layer is removed from the map or another popup is opened.
	 */

	// @section Popup methods
	Layer.include({

		// @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
		// Binds a popup to the layer with the passed `content` and sets up the
		// necessary event listeners. If a `Function` is passed it will receive
		// the layer as the first argument and should return a `String` or `HTMLElement`.
		bindPopup: function (content, options) {

			if (content instanceof Popup) {
				setOptions(content, options);
				this._popup = content;
				content._source = this;
			} else {
				if (!this._popup || options) {
					this._popup = new Popup(options, this);
				}
				this._popup.setContent(content);
			}

			if (!this._popupHandlersAdded) {
				this.on({
					click: this._openPopup,
					keypress: this._onKeyPress,
					remove: this.closePopup,
					move: this._movePopup
				});
				this._popupHandlersAdded = true;
			}

			return this;
		},

		// @method unbindPopup(): this
		// Removes the popup previously bound with `bindPopup`.
		unbindPopup: function () {
			if (this._popup) {
				this.off({
					click: this._openPopup,
					keypress: this._onKeyPress,
					remove: this.closePopup,
					move: this._movePopup
				});
				this._popupHandlersAdded = false;
				this._popup = null;
			}
			return this;
		},

		// @method openPopup(latlng?: LatLng): this
		// Opens the bound popup at the specified `latlng` or at the default popup anchor if no `latlng` is passed.
		openPopup: function (layer, latlng) {
			if (this._popup && this._map) {
				latlng = this._popup._prepareOpen(this, layer, latlng);

				// open the popup on the map
				this._map.openPopup(this._popup, latlng);
			}

			return this;
		},

		// @method closePopup(): this
		// Closes the popup bound to this layer if it is open.
		closePopup: function () {
			if (this._popup) {
				this._popup._close();
			}
			return this;
		},

		// @method togglePopup(): this
		// Opens or closes the popup bound to this layer depending on its current state.
		togglePopup: function (target) {
			if (this._popup) {
				if (this._popup._map) {
					this.closePopup();
				} else {
					this.openPopup(target);
				}
			}
			return this;
		},

		// @method isPopupOpen(): boolean
		// Returns `true` if the popup bound to this layer is currently open.
		isPopupOpen: function () {
			return (this._popup ? this._popup.isOpen() : false);
		},

		// @method setPopupContent(content: String|HTMLElement|Popup): this
		// Sets the content of the popup bound to this layer.
		setPopupContent: function (content) {
			if (this._popup) {
				this._popup.setContent(content);
			}
			return this;
		},

		// @method getPopup(): Popup
		// Returns the popup bound to this layer.
		getPopup: function () {
			return this._popup;
		},

		_openPopup: function (e) {
			var layer = e.layer || e.target;

			if (!this._popup) {
				return;
			}

			if (!this._map) {
				return;
			}

			// prevent map click
			stop(e);

			// if this inherits from Path its a vector and we can just
			// open the popup at the new location
			if (layer instanceof Path) {
				this.openPopup(e.layer || e.target, e.latlng);
				return;
			}

			// otherwise treat it like a marker and figure out
			// if we should toggle it open/closed
			if (this._map.hasLayer(this._popup) && this._popup._source === layer) {
				this.closePopup();
			} else {
				this.openPopup(layer, e.latlng);
			}
		},

		_movePopup: function (e) {
			this._popup.setLatLng(e.latlng);
		},

		_onKeyPress: function (e) {
			if (e.originalEvent.keyCode === 13) {
				this._openPopup(e);
			}
		}
	});

	/*
	 * @class Tooltip
	 * @inherits DivOverlay
	 * @aka L.Tooltip
	 * Used to display small texts on top of map layers.
	 *
	 * @example
	 *
	 * ```js
	 * marker.bindTooltip("my tooltip text").openTooltip();
	 * ```
	 * Note about tooltip offset. Leaflet takes two options in consideration
	 * for computing tooltip offsetting:
	 * - the `offset` Tooltip option: it defaults to [0, 0], and it's specific to one tooltip.
	 *   Add a positive x offset to move the tooltip to the right, and a positive y offset to
	 *   move it to the bottom. Negatives will move to the left and top.
	 * - the `tooltipAnchor` Icon option: this will only be considered for Marker. You
	 *   should adapt this value if you use a custom icon.
	 */


	// @namespace Tooltip
	var Tooltip = DivOverlay.extend({

		// @section
		// @aka Tooltip options
		options: {
			// @option pane: String = 'tooltipPane'
			// `Map pane` where the tooltip will be added.
			pane: 'tooltipPane',

			// @option offset: Point = Point(0, 0)
			// Optional offset of the tooltip position.
			offset: [0, 0],

			// @option direction: String = 'auto'
			// Direction where to open the tooltip. Possible values are: `right`, `left`,
			// `top`, `bottom`, `center`, `auto`.
			// `auto` will dynamically switch between `right` and `left` according to the tooltip
			// position on the map.
			direction: 'auto',

			// @option permanent: Boolean = false
			// Whether to open the tooltip permanently or only on mouseover.
			permanent: false,

			// @option sticky: Boolean = false
			// If true, the tooltip will follow the mouse instead of being fixed at the feature center.
			sticky: false,

			// @option interactive: Boolean = false
			// If true, the tooltip will listen to the feature events.
			interactive: false,

			// @option opacity: Number = 0.9
			// Tooltip container opacity.
			opacity: 0.9
		},

		onAdd: function (map) {
			DivOverlay.prototype.onAdd.call(this, map);
			this.setOpacity(this.options.opacity);

			// @namespace Map
			// @section Tooltip events
			// @event tooltipopen: TooltipEvent
			// Fired when a tooltip is opened in the map.
			map.fire('tooltipopen', {tooltip: this});

			if (this._source) {
				// @namespace Layer
				// @section Tooltip events
				// @event tooltipopen: TooltipEvent
				// Fired when a tooltip bound to this layer is opened.
				this._source.fire('tooltipopen', {tooltip: this}, true);
			}
		},

		onRemove: function (map) {
			DivOverlay.prototype.onRemove.call(this, map);

			// @namespace Map
			// @section Tooltip events
			// @event tooltipclose: TooltipEvent
			// Fired when a tooltip in the map is closed.
			map.fire('tooltipclose', {tooltip: this});

			if (this._source) {
				// @namespace Layer
				// @section Tooltip events
				// @event tooltipclose: TooltipEvent
				// Fired when a tooltip bound to this layer is closed.
				this._source.fire('tooltipclose', {tooltip: this}, true);
			}
		},

		getEvents: function () {
			var events = DivOverlay.prototype.getEvents.call(this);

			if (touch && !this.options.permanent) {
				events.preclick = this._close;
			}

			return events;
		},

		_close: function () {
			if (this._map) {
				this._map.closeTooltip(this);
			}
		},

		_initLayout: function () {
			var prefix = 'leaflet-tooltip',
			    className = prefix + ' ' + (this.options.className || '') + ' leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

			this._contentNode = this._container = create$1('div', className);
		},

		_updateLayout: function () {},

		_adjustPan: function () {},

		_setPosition: function (pos) {
			var map = this._map,
			    container = this._container,
			    centerPoint = map.latLngToContainerPoint(map.getCenter()),
			    tooltipPoint = map.layerPointToContainerPoint(pos),
			    direction = this.options.direction,
			    tooltipWidth = container.offsetWidth,
			    tooltipHeight = container.offsetHeight,
			    offset = toPoint(this.options.offset),
			    anchor = this._getAnchor();

			if (direction === 'top') {
				pos = pos.add(toPoint(-tooltipWidth / 2 + offset.x, -tooltipHeight + offset.y + anchor.y, true));
			} else if (direction === 'bottom') {
				pos = pos.subtract(toPoint(tooltipWidth / 2 - offset.x, -offset.y, true));
			} else if (direction === 'center') {
				pos = pos.subtract(toPoint(tooltipWidth / 2 + offset.x, tooltipHeight / 2 - anchor.y + offset.y, true));
			} else if (direction === 'right' || direction === 'auto' && tooltipPoint.x < centerPoint.x) {
				direction = 'right';
				pos = pos.add(toPoint(offset.x + anchor.x, anchor.y - tooltipHeight / 2 + offset.y, true));
			} else {
				direction = 'left';
				pos = pos.subtract(toPoint(tooltipWidth + anchor.x - offset.x, tooltipHeight / 2 - anchor.y - offset.y, true));
			}

			removeClass(container, 'leaflet-tooltip-right');
			removeClass(container, 'leaflet-tooltip-left');
			removeClass(container, 'leaflet-tooltip-top');
			removeClass(container, 'leaflet-tooltip-bottom');
			addClass(container, 'leaflet-tooltip-' + direction);
			setPosition(container, pos);
		},

		_updatePosition: function () {
			var pos = this._map.latLngToLayerPoint(this._latlng);
			this._setPosition(pos);
		},

		setOpacity: function (opacity) {
			this.options.opacity = opacity;

			if (this._container) {
				setOpacity(this._container, opacity);
			}
		},

		_animateZoom: function (e) {
			var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
			this._setPosition(pos);
		},

		_getAnchor: function () {
			// Where should we anchor the tooltip on the source layer?
			return toPoint(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
		}

	});

	// @namespace Tooltip
	// @factory L.tooltip(options?: Tooltip options, source?: Layer)
	// Instantiates a Tooltip object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the tooltip with a reference to the Layer to which it refers.
	var tooltip = function (options, source) {
		return new Tooltip(options, source);
	};

	// @namespace Map
	// @section Methods for Layers and Controls
	Map.include({

		// @method openTooltip(tooltip: Tooltip): this
		// Opens the specified tooltip.
		// @alternative
		// @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
		// Creates a tooltip with the specified content and options and open it.
		openTooltip: function (tooltip, latlng, options) {
			if (!(tooltip instanceof Tooltip)) {
				tooltip = new Tooltip(options).setContent(tooltip);
			}

			if (latlng) {
				tooltip.setLatLng(latlng);
			}

			if (this.hasLayer(tooltip)) {
				return this;
			}

			return this.addLayer(tooltip);
		},

		// @method closeTooltip(tooltip?: Tooltip): this
		// Closes the tooltip given as parameter.
		closeTooltip: function (tooltip) {
			if (tooltip) {
				this.removeLayer(tooltip);
			}
			return this;
		}

	});

	/*
	 * @namespace Layer
	 * @section Tooltip methods example
	 *
	 * All layers share a set of methods convenient for binding tooltips to it.
	 *
	 * ```js
	 * var layer = L.Polygon(latlngs).bindTooltip('Hi There!').addTo(map);
	 * layer.openTooltip();
	 * layer.closeTooltip();
	 * ```
	 */

	// @section Tooltip methods
	Layer.include({

		// @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
		// Binds a tooltip to the layer with the passed `content` and sets up the
		// necessary event listeners. If a `Function` is passed it will receive
		// the layer as the first argument and should return a `String` or `HTMLElement`.
		bindTooltip: function (content, options) {

			if (content instanceof Tooltip) {
				setOptions(content, options);
				this._tooltip = content;
				content._source = this;
			} else {
				if (!this._tooltip || options) {
					this._tooltip = new Tooltip(options, this);
				}
				this._tooltip.setContent(content);

			}

			this._initTooltipInteractions();

			if (this._tooltip.options.permanent && this._map && this._map.hasLayer(this)) {
				this.openTooltip();
			}

			return this;
		},

		// @method unbindTooltip(): this
		// Removes the tooltip previously bound with `bindTooltip`.
		unbindTooltip: function () {
			if (this._tooltip) {
				this._initTooltipInteractions(true);
				this.closeTooltip();
				this._tooltip = null;
			}
			return this;
		},

		_initTooltipInteractions: function (remove$$1) {
			if (!remove$$1 && this._tooltipHandlersAdded) { return; }
			var onOff = remove$$1 ? 'off' : 'on',
			    events = {
				remove: this.closeTooltip,
				move: this._moveTooltip
			    };
			if (!this._tooltip.options.permanent) {
				events.mouseover = this._openTooltip;
				events.mouseout = this.closeTooltip;
				if (this._tooltip.options.sticky) {
					events.mousemove = this._moveTooltip;
				}
				if (touch) {
					events.click = this._openTooltip;
				}
			} else {
				events.add = this._openTooltip;
			}
			this[onOff](events);
			this._tooltipHandlersAdded = !remove$$1;
		},

		// @method openTooltip(latlng?: LatLng): this
		// Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
		openTooltip: function (layer, latlng) {
			if (this._tooltip && this._map) {
				latlng = this._tooltip._prepareOpen(this, layer, latlng);

				// open the tooltip on the map
				this._map.openTooltip(this._tooltip, latlng);

				// Tooltip container may not be defined if not permanent and never
				// opened.
				if (this._tooltip.options.interactive && this._tooltip._container) {
					addClass(this._tooltip._container, 'leaflet-clickable');
					this.addInteractiveTarget(this._tooltip._container);
				}
			}

			return this;
		},

		// @method closeTooltip(): this
		// Closes the tooltip bound to this layer if it is open.
		closeTooltip: function () {
			if (this._tooltip) {
				this._tooltip._close();
				if (this._tooltip.options.interactive && this._tooltip._container) {
					removeClass(this._tooltip._container, 'leaflet-clickable');
					this.removeInteractiveTarget(this._tooltip._container);
				}
			}
			return this;
		},

		// @method toggleTooltip(): this
		// Opens or closes the tooltip bound to this layer depending on its current state.
		toggleTooltip: function (target) {
			if (this._tooltip) {
				if (this._tooltip._map) {
					this.closeTooltip();
				} else {
					this.openTooltip(target);
				}
			}
			return this;
		},

		// @method isTooltipOpen(): boolean
		// Returns `true` if the tooltip bound to this layer is currently open.
		isTooltipOpen: function () {
			return this._tooltip.isOpen();
		},

		// @method setTooltipContent(content: String|HTMLElement|Tooltip): this
		// Sets the content of the tooltip bound to this layer.
		setTooltipContent: function (content) {
			if (this._tooltip) {
				this._tooltip.setContent(content);
			}
			return this;
		},

		// @method getTooltip(): Tooltip
		// Returns the tooltip bound to this layer.
		getTooltip: function () {
			return this._tooltip;
		},

		_openTooltip: function (e) {
			var layer = e.layer || e.target;

			if (!this._tooltip || !this._map) {
				return;
			}
			this.openTooltip(layer, this._tooltip.options.sticky ? e.latlng : undefined);
		},

		_moveTooltip: function (e) {
			var latlng = e.latlng, containerPoint, layerPoint;
			if (this._tooltip.options.sticky && e.originalEvent) {
				containerPoint = this._map.mouseEventToContainerPoint(e.originalEvent);
				layerPoint = this._map.containerPointToLayerPoint(containerPoint);
				latlng = this._map.layerPointToLatLng(layerPoint);
			}
			this._tooltip.setLatLng(latlng);
		}
	});

	/*
	 * @class DivIcon
	 * @aka L.DivIcon
	 * @inherits Icon
	 *
	 * Represents a lightweight icon for markers that uses a simple `<div>`
	 * element instead of an image. Inherits from `Icon` but ignores the `iconUrl` and shadow options.
	 *
	 * @example
	 * ```js
	 * var myIcon = L.divIcon({className: 'my-div-icon'});
	 * // you can set .my-div-icon styles in CSS
	 *
	 * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
	 * ```
	 *
	 * By default, it has a 'leaflet-div-icon' CSS class and is styled as a little white square with a shadow.
	 */

	var DivIcon = Icon.extend({
		options: {
			// @section
			// @aka DivIcon options
			iconSize: [12, 12], // also can be set through CSS

			// iconAnchor: (Point),
			// popupAnchor: (Point),

			// @option html: String|HTMLElement = ''
			// Custom HTML code to put inside the div element, empty by default. Alternatively,
			// an instance of `HTMLElement`.
			html: false,

			// @option bgPos: Point = [0, 0]
			// Optional relative position of the background, in pixels
			bgPos: null,

			className: 'leaflet-div-icon'
		},

		createIcon: function (oldIcon) {
			var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
			    options = this.options;

			if (options.html instanceof Element) {
				empty(div);
				div.appendChild(options.html);
			} else {
				div.innerHTML = options.html !== false ? options.html : '';
			}

			if (options.bgPos) {
				var bgPos = toPoint(options.bgPos);
				div.style.backgroundPosition = (-bgPos.x) + 'px ' + (-bgPos.y) + 'px';
			}
			this._setIconStyles(div, 'icon');

			return div;
		},

		createShadow: function () {
			return null;
		}
	});

	// @factory L.divIcon(options: DivIcon options)
	// Creates a `DivIcon` instance with the given options.
	function divIcon(options) {
		return new DivIcon(options);
	}

	Icon.Default = IconDefault;

	/*
	 * @class GridLayer
	 * @inherits Layer
	 * @aka L.GridLayer
	 *
	 * Generic class for handling a tiled grid of HTML elements. This is the base class for all tile layers and replaces `TileLayer.Canvas`.
	 * GridLayer can be extended to create a tiled grid of HTML elements like `<canvas>`, `<img>` or `<div>`. GridLayer will handle creating and animating these DOM elements for you.
	 *
	 *
	 * @section Synchronous usage
	 * @example
	 *
	 * To create a custom layer, extend GridLayer and implement the `createTile()` method, which will be passed a `Point` object with the `x`, `y`, and `z` (zoom level) coordinates to draw your tile.
	 *
	 * ```js
	 * var CanvasLayer = L.GridLayer.extend({
	 *     createTile: function(coords){
	 *         // create a <canvas> element for drawing
	 *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
	 *
	 *         // setup tile width and height according to the options
	 *         var size = this.getTileSize();
	 *         tile.width = size.x;
	 *         tile.height = size.y;
	 *
	 *         // get a canvas context and draw something on it using coords.x, coords.y and coords.z
	 *         var ctx = tile.getContext('2d');
	 *
	 *         // return the tile so it can be rendered on screen
	 *         return tile;
	 *     }
	 * });
	 * ```
	 *
	 * @section Asynchronous usage
	 * @example
	 *
	 * Tile creation can also be asynchronous, this is useful when using a third-party drawing library. Once the tile is finished drawing it can be passed to the `done()` callback.
	 *
	 * ```js
	 * var CanvasLayer = L.GridLayer.extend({
	 *     createTile: function(coords, done){
	 *         var error;
	 *
	 *         // create a <canvas> element for drawing
	 *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
	 *
	 *         // setup tile width and height according to the options
	 *         var size = this.getTileSize();
	 *         tile.width = size.x;
	 *         tile.height = size.y;
	 *
	 *         // draw something asynchronously and pass the tile to the done() callback
	 *         setTimeout(function() {
	 *             done(error, tile);
	 *         }, 1000);
	 *
	 *         return tile;
	 *     }
	 * });
	 * ```
	 *
	 * @section
	 */


	var GridLayer = Layer.extend({

		// @section
		// @aka GridLayer options
		options: {
			// @option tileSize: Number|Point = 256
			// Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
			tileSize: 256,

			// @option opacity: Number = 1.0
			// Opacity of the tiles. Can be used in the `createTile()` function.
			opacity: 1,

			// @option updateWhenIdle: Boolean = (depends)
			// Load new tiles only when panning ends.
			// `true` by default on mobile browsers, in order to avoid too many requests and keep smooth navigation.
			// `false` otherwise in order to display new tiles _during_ panning, since it is easy to pan outside the
			// [`keepBuffer`](#gridlayer-keepbuffer) option in desktop browsers.
			updateWhenIdle: mobile,

			// @option updateWhenZooming: Boolean = true
			// By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
			updateWhenZooming: true,

			// @option updateInterval: Number = 200
			// Tiles will not update more than once every `updateInterval` milliseconds when panning.
			updateInterval: 200,

			// @option zIndex: Number = 1
			// The explicit zIndex of the tile layer.
			zIndex: 1,

			// @option bounds: LatLngBounds = undefined
			// If set, tiles will only be loaded inside the set `LatLngBounds`.
			bounds: null,

			// @option minZoom: Number = 0
			// The minimum zoom level down to which this layer will be displayed (inclusive).
			minZoom: 0,

			// @option maxZoom: Number = undefined
			// The maximum zoom level up to which this layer will be displayed (inclusive).
			maxZoom: undefined,

			// @option maxNativeZoom: Number = undefined
			// Maximum zoom number the tile source has available. If it is specified,
			// the tiles on all zoom levels higher than `maxNativeZoom` will be loaded
			// from `maxNativeZoom` level and auto-scaled.
			maxNativeZoom: undefined,

			// @option minNativeZoom: Number = undefined
			// Minimum zoom number the tile source has available. If it is specified,
			// the tiles on all zoom levels lower than `minNativeZoom` will be loaded
			// from `minNativeZoom` level and auto-scaled.
			minNativeZoom: undefined,

			// @option noWrap: Boolean = false
			// Whether the layer is wrapped around the antimeridian. If `true`, the
			// GridLayer will only be displayed once at low zoom levels. Has no
			// effect when the [map CRS](#map-crs) doesn't wrap around. Can be used
			// in combination with [`bounds`](#gridlayer-bounds) to prevent requesting
			// tiles outside the CRS limits.
			noWrap: false,

			// @option pane: String = 'tilePane'
			// `Map pane` where the grid layer will be added.
			pane: 'tilePane',

			// @option className: String = ''
			// A custom class name to assign to the tile layer. Empty by default.
			className: '',

			// @option keepBuffer: Number = 2
			// When panning the map, keep this many rows and columns of tiles before unloading them.
			keepBuffer: 2
		},

		initialize: function (options) {
			setOptions(this, options);
		},

		onAdd: function () {
			this._initContainer();

			this._levels = {};
			this._tiles = {};

			this._resetView();
			this._update();
		},

		beforeAdd: function (map) {
			map._addZoomLimit(this);
		},

		onRemove: function (map) {
			this._removeAllTiles();
			remove(this._container);
			map._removeZoomLimit(this);
			this._container = null;
			this._tileZoom = undefined;
		},

		// @method bringToFront: this
		// Brings the tile layer to the top of all tile layers.
		bringToFront: function () {
			if (this._map) {
				toFront(this._container);
				this._setAutoZIndex(Math.max);
			}
			return this;
		},

		// @method bringToBack: this
		// Brings the tile layer to the bottom of all tile layers.
		bringToBack: function () {
			if (this._map) {
				toBack(this._container);
				this._setAutoZIndex(Math.min);
			}
			return this;
		},

		// @method getContainer: HTMLElement
		// Returns the HTML element that contains the tiles for this layer.
		getContainer: function () {
			return this._container;
		},

		// @method setOpacity(opacity: Number): this
		// Changes the [opacity](#gridlayer-opacity) of the grid layer.
		setOpacity: function (opacity) {
			this.options.opacity = opacity;
			this._updateOpacity();
			return this;
		},

		// @method setZIndex(zIndex: Number): this
		// Changes the [zIndex](#gridlayer-zindex) of the grid layer.
		setZIndex: function (zIndex) {
			this.options.zIndex = zIndex;
			this._updateZIndex();

			return this;
		},

		// @method isLoading: Boolean
		// Returns `true` if any tile in the grid layer has not finished loading.
		isLoading: function () {
			return this._loading;
		},

		// @method redraw: this
		// Causes the layer to clear all the tiles and request them again.
		redraw: function () {
			if (this._map) {
				this._removeAllTiles();
				this._update();
			}
			return this;
		},

		getEvents: function () {
			var events = {
				viewprereset: this._invalidateAll,
				viewreset: this._resetView,
				zoom: this._resetView,
				moveend: this._onMoveEnd
			};

			if (!this.options.updateWhenIdle) {
				// update tiles on move, but not more often than once per given interval
				if (!this._onMove) {
					this._onMove = throttle(this._onMoveEnd, this.options.updateInterval, this);
				}

				events.move = this._onMove;
			}

			if (this._zoomAnimated) {
				events.zoomanim = this._animateZoom;
			}

			return events;
		},

		// @section Extension methods
		// Layers extending `GridLayer` shall reimplement the following method.
		// @method createTile(coords: Object, done?: Function): HTMLElement
		// Called only internally, must be overridden by classes extending `GridLayer`.
		// Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
		// is specified, it must be called when the tile has finished loading and drawing.
		createTile: function () {
			return document.createElement('div');
		},

		// @section
		// @method getTileSize: Point
		// Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method.
		getTileSize: function () {
			var s = this.options.tileSize;
			return s instanceof Point ? s : new Point(s, s);
		},

		_updateZIndex: function () {
			if (this._container && this.options.zIndex !== undefined && this.options.zIndex !== null) {
				this._container.style.zIndex = this.options.zIndex;
			}
		},

		_setAutoZIndex: function (compare) {
			// go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)

			var layers = this.getPane().children,
			    edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min

			for (var i = 0, len = layers.length, zIndex; i < len; i++) {

				zIndex = layers[i].style.zIndex;

				if (layers[i] !== this._container && zIndex) {
					edgeZIndex = compare(edgeZIndex, +zIndex);
				}
			}

			if (isFinite(edgeZIndex)) {
				this.options.zIndex = edgeZIndex + compare(-1, 1);
				this._updateZIndex();
			}
		},

		_updateOpacity: function () {
			if (!this._map) { return; }

			// IE doesn't inherit filter opacity properly, so we're forced to set it on tiles
			if (ielt9) { return; }

			setOpacity(this._container, this.options.opacity);

			var now = +new Date(),
			    nextFrame = false,
			    willPrune = false;

			for (var key in this._tiles) {
				var tile = this._tiles[key];
				if (!tile.current || !tile.loaded) { continue; }

				var fade = Math.min(1, (now - tile.loaded) / 200);

				setOpacity(tile.el, fade);
				if (fade < 1) {
					nextFrame = true;
				} else {
					if (tile.active) {
						willPrune = true;
					} else {
						this._onOpaqueTile(tile);
					}
					tile.active = true;
				}
			}

			if (willPrune && !this._noPrune) { this._pruneTiles(); }

			if (nextFrame) {
				cancelAnimFrame(this._fadeFrame);
				this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
			}
		},

		_onOpaqueTile: falseFn,

		_initContainer: function () {
			if (this._container) { return; }

			this._container = create$1('div', 'leaflet-layer ' + (this.options.className || ''));
			this._updateZIndex();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}

			this.getPane().appendChild(this._container);
		},

		_updateLevels: function () {

			var zoom = this._tileZoom,
			    maxZoom = this.options.maxZoom;

			if (zoom === undefined) { return undefined; }

			for (var z in this._levels) {
				if (this._levels[z].el.children.length || z === zoom) {
					this._levels[z].el.style.zIndex = maxZoom - Math.abs(zoom - z);
					this._onUpdateLevel(z);
				} else {
					remove(this._levels[z].el);
					this._removeTilesAtZoom(z);
					this._onRemoveLevel(z);
					delete this._levels[z];
				}
			}

			var level = this._levels[zoom],
			    map = this._map;

			if (!level) {
				level = this._levels[zoom] = {};

				level.el = create$1('div', 'leaflet-tile-container leaflet-zoom-animated', this._container);
				level.el.style.zIndex = maxZoom;

				level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
				level.zoom = zoom;

				this._setZoomTransform(level, map.getCenter(), map.getZoom());

				// force the browser to consider the newly added element for transition
				falseFn(level.el.offsetWidth);

				this._onCreateLevel(level);
			}

			this._level = level;

			return level;
		},

		_onUpdateLevel: falseFn,

		_onRemoveLevel: falseFn,

		_onCreateLevel: falseFn,

		_pruneTiles: function () {
			if (!this._map) {
				return;
			}

			var key, tile;

			var zoom = this._map.getZoom();
			if (zoom > this.options.maxZoom ||
				zoom < this.options.minZoom) {
				this._removeAllTiles();
				return;
			}

			for (key in this._tiles) {
				tile = this._tiles[key];
				tile.retain = tile.current;
			}

			for (key in this._tiles) {
				tile = this._tiles[key];
				if (tile.current && !tile.active) {
					var coords = tile.coords;
					if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
						this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
					}
				}
			}

			for (key in this._tiles) {
				if (!this._tiles[key].retain) {
					this._removeTile(key);
				}
			}
		},

		_removeTilesAtZoom: function (zoom) {
			for (var key in this._tiles) {
				if (this._tiles[key].coords.z !== zoom) {
					continue;
				}
				this._removeTile(key);
			}
		},

		_removeAllTiles: function () {
			for (var key in this._tiles) {
				this._removeTile(key);
			}
		},

		_invalidateAll: function () {
			for (var z in this._levels) {
				remove(this._levels[z].el);
				this._onRemoveLevel(z);
				delete this._levels[z];
			}
			this._removeAllTiles();

			this._tileZoom = undefined;
		},

		_retainParent: function (x, y, z, minZoom) {
			var x2 = Math.floor(x / 2),
			    y2 = Math.floor(y / 2),
			    z2 = z - 1,
			    coords2 = new Point(+x2, +y2);
			coords2.z = +z2;

			var key = this._tileCoordsToKey(coords2),
			    tile = this._tiles[key];

			if (tile && tile.active) {
				tile.retain = true;
				return true;

			} else if (tile && tile.loaded) {
				tile.retain = true;
			}

			if (z2 > minZoom) {
				return this._retainParent(x2, y2, z2, minZoom);
			}

			return false;
		},

		_retainChildren: function (x, y, z, maxZoom) {

			for (var i = 2 * x; i < 2 * x + 2; i++) {
				for (var j = 2 * y; j < 2 * y + 2; j++) {

					var coords = new Point(i, j);
					coords.z = z + 1;

					var key = this._tileCoordsToKey(coords),
					    tile = this._tiles[key];

					if (tile && tile.active) {
						tile.retain = true;
						continue;

					} else if (tile && tile.loaded) {
						tile.retain = true;
					}

					if (z + 1 < maxZoom) {
						this._retainChildren(i, j, z + 1, maxZoom);
					}
				}
			}
		},

		_resetView: function (e) {
			var animating = e && (e.pinch || e.flyTo);
			this._setView(this._map.getCenter(), this._map.getZoom(), animating, animating);
		},

		_animateZoom: function (e) {
			this._setView(e.center, e.zoom, true, e.noUpdate);
		},

		_clampZoom: function (zoom) {
			var options = this.options;

			if (undefined !== options.minNativeZoom && zoom < options.minNativeZoom) {
				return options.minNativeZoom;
			}

			if (undefined !== options.maxNativeZoom && options.maxNativeZoom < zoom) {
				return options.maxNativeZoom;
			}

			return zoom;
		},

		_setView: function (center, zoom, noPrune, noUpdate) {
			var tileZoom = this._clampZoom(Math.round(zoom));
			if ((this.options.maxZoom !== undefined && tileZoom > this.options.maxZoom) ||
			    (this.options.minZoom !== undefined && tileZoom < this.options.minZoom)) {
				tileZoom = undefined;
			}

			var tileZoomChanged = this.options.updateWhenZooming && (tileZoom !== this._tileZoom);

			if (!noUpdate || tileZoomChanged) {

				this._tileZoom = tileZoom;

				if (this._abortLoading) {
					this._abortLoading();
				}

				this._updateLevels();
				this._resetGrid();

				if (tileZoom !== undefined) {
					this._update(center);
				}

				if (!noPrune) {
					this._pruneTiles();
				}

				// Flag to prevent _updateOpacity from pruning tiles during
				// a zoom anim or a pinch gesture
				this._noPrune = !!noPrune;
			}

			this._setZoomTransforms(center, zoom);
		},

		_setZoomTransforms: function (center, zoom) {
			for (var i in this._levels) {
				this._setZoomTransform(this._levels[i], center, zoom);
			}
		},

		_setZoomTransform: function (level, center, zoom) {
			var scale = this._map.getZoomScale(zoom, level.zoom),
			    translate = level.origin.multiplyBy(scale)
			        .subtract(this._map._getNewPixelOrigin(center, zoom)).round();

			if (any3d) {
				setTransform(level.el, translate, scale);
			} else {
				setPosition(level.el, translate);
			}
		},

		_resetGrid: function () {
			var map = this._map,
			    crs = map.options.crs,
			    tileSize = this._tileSize = this.getTileSize(),
			    tileZoom = this._tileZoom;

			var bounds = this._map.getPixelWorldBounds(this._tileZoom);
			if (bounds) {
				this._globalTileRange = this._pxBoundsToTileRange(bounds);
			}

			this._wrapX = crs.wrapLng && !this.options.noWrap && [
				Math.floor(map.project([0, crs.wrapLng[0]], tileZoom).x / tileSize.x),
				Math.ceil(map.project([0, crs.wrapLng[1]], tileZoom).x / tileSize.y)
			];
			this._wrapY = crs.wrapLat && !this.options.noWrap && [
				Math.floor(map.project([crs.wrapLat[0], 0], tileZoom).y / tileSize.x),
				Math.ceil(map.project([crs.wrapLat[1], 0], tileZoom).y / tileSize.y)
			];
		},

		_onMoveEnd: function () {
			if (!this._map || this._map._animatingZoom) { return; }

			this._update();
		},

		_getTiledPixelBounds: function (center) {
			var map = this._map,
			    mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(),
			    scale = map.getZoomScale(mapZoom, this._tileZoom),
			    pixelCenter = map.project(center, this._tileZoom).floor(),
			    halfSize = map.getSize().divideBy(scale * 2);

			return new Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
		},

		// Private method to load tiles in the grid's active zoom level according to map bounds
		_update: function (center) {
			var map = this._map;
			if (!map) { return; }
			var zoom = this._clampZoom(map.getZoom());

			if (center === undefined) { center = map.getCenter(); }
			if (this._tileZoom === undefined) { return; }	// if out of minzoom/maxzoom

			var pixelBounds = this._getTiledPixelBounds(center),
			    tileRange = this._pxBoundsToTileRange(pixelBounds),
			    tileCenter = tileRange.getCenter(),
			    queue = [],
			    margin = this.options.keepBuffer,
			    noPruneRange = new Bounds(tileRange.getBottomLeft().subtract([margin, -margin]),
			                              tileRange.getTopRight().add([margin, -margin]));

			// Sanity check: panic if the tile range contains Infinity somewhere.
			if (!(isFinite(tileRange.min.x) &&
			      isFinite(tileRange.min.y) &&
			      isFinite(tileRange.max.x) &&
			      isFinite(tileRange.max.y))) { throw new Error('Attempted to load an infinite number of tiles'); }

			for (var key in this._tiles) {
				var c = this._tiles[key].coords;
				if (c.z !== this._tileZoom || !noPruneRange.contains(new Point(c.x, c.y))) {
					this._tiles[key].current = false;
				}
			}

			// _update just loads more tiles. If the tile zoom level differs too much
			// from the map's, let _setView reset levels and prune old tiles.
			if (Math.abs(zoom - this._tileZoom) > 1) { this._setView(center, zoom); return; }

			// create a queue of coordinates to load tiles from
			for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
				for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
					var coords = new Point(i, j);
					coords.z = this._tileZoom;

					if (!this._isValidTile(coords)) { continue; }

					var tile = this._tiles[this._tileCoordsToKey(coords)];
					if (tile) {
						tile.current = true;
					} else {
						queue.push(coords);
					}
				}
			}

			// sort tile queue to load tiles in order of their distance to center
			queue.sort(function (a, b) {
				return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
			});

			if (queue.length !== 0) {
				// if it's the first batch of tiles to load
				if (!this._loading) {
					this._loading = true;
					// @event loading: Event
					// Fired when the grid layer starts loading tiles.
					this.fire('loading');
				}

				// create DOM fragment to append tiles in one batch
				var fragment = document.createDocumentFragment();

				for (i = 0; i < queue.length; i++) {
					this._addTile(queue[i], fragment);
				}

				this._level.el.appendChild(fragment);
			}
		},

		_isValidTile: function (coords) {
			var crs = this._map.options.crs;

			if (!crs.infinite) {
				// don't load tile if it's out of bounds and not wrapped
				var bounds = this._globalTileRange;
				if ((!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
				    (!crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y))) { return false; }
			}

			if (!this.options.bounds) { return true; }

			// don't load tile if it doesn't intersect the bounds in options
			var tileBounds = this._tileCoordsToBounds(coords);
			return toLatLngBounds(this.options.bounds).overlaps(tileBounds);
		},

		_keyToBounds: function (key) {
			return this._tileCoordsToBounds(this._keyToTileCoords(key));
		},

		_tileCoordsToNwSe: function (coords) {
			var map = this._map,
			    tileSize = this.getTileSize(),
			    nwPoint = coords.scaleBy(tileSize),
			    sePoint = nwPoint.add(tileSize),
			    nw = map.unproject(nwPoint, coords.z),
			    se = map.unproject(sePoint, coords.z);
			return [nw, se];
		},

		// converts tile coordinates to its geographical bounds
		_tileCoordsToBounds: function (coords) {
			var bp = this._tileCoordsToNwSe(coords),
			    bounds = new LatLngBounds(bp[0], bp[1]);

			if (!this.options.noWrap) {
				bounds = this._map.wrapLatLngBounds(bounds);
			}
			return bounds;
		},
		// converts tile coordinates to key for the tile cache
		_tileCoordsToKey: function (coords) {
			return coords.x + ':' + coords.y + ':' + coords.z;
		},

		// converts tile cache key to coordinates
		_keyToTileCoords: function (key) {
			var k = key.split(':'),
			    coords = new Point(+k[0], +k[1]);
			coords.z = +k[2];
			return coords;
		},

		_removeTile: function (key) {
			var tile = this._tiles[key];
			if (!tile) { return; }

			remove(tile.el);

			delete this._tiles[key];

			// @event tileunload: TileEvent
			// Fired when a tile is removed (e.g. when a tile goes off the screen).
			this.fire('tileunload', {
				tile: tile.el,
				coords: this._keyToTileCoords(key)
			});
		},

		_initTile: function (tile) {
			addClass(tile, 'leaflet-tile');

			var tileSize = this.getTileSize();
			tile.style.width = tileSize.x + 'px';
			tile.style.height = tileSize.y + 'px';

			tile.onselectstart = falseFn;
			tile.onmousemove = falseFn;

			// update opacity on tiles in IE7-8 because of filter inheritance problems
			if (ielt9 && this.options.opacity < 1) {
				setOpacity(tile, this.options.opacity);
			}

			// without this hack, tiles disappear after zoom on Chrome for Android
			// https://github.com/Leaflet/Leaflet/issues/2078
			if (android && !android23) {
				tile.style.WebkitBackfaceVisibility = 'hidden';
			}
		},

		_addTile: function (coords, container) {
			var tilePos = this._getTilePos(coords),
			    key = this._tileCoordsToKey(coords);

			var tile = this.createTile(this._wrapCoords(coords), bind(this._tileReady, this, coords));

			this._initTile(tile);

			// if createTile is defined with a second argument ("done" callback),
			// we know that tile is async and will be ready later; otherwise
			if (this.createTile.length < 2) {
				// mark tile as ready, but delay one frame for opacity animation to happen
				requestAnimFrame(bind(this._tileReady, this, coords, null, tile));
			}

			setPosition(tile, tilePos);

			// save tile in cache
			this._tiles[key] = {
				el: tile,
				coords: coords,
				current: true
			};

			container.appendChild(tile);
			// @event tileloadstart: TileEvent
			// Fired when a tile is requested and starts loading.
			this.fire('tileloadstart', {
				tile: tile,
				coords: coords
			});
		},

		_tileReady: function (coords, err, tile) {
			if (err) {
				// @event tileerror: TileErrorEvent
				// Fired when there is an error loading a tile.
				this.fire('tileerror', {
					error: err,
					tile: tile,
					coords: coords
				});
			}

			var key = this._tileCoordsToKey(coords);

			tile = this._tiles[key];
			if (!tile) { return; }

			tile.loaded = +new Date();
			if (this._map._fadeAnimated) {
				setOpacity(tile.el, 0);
				cancelAnimFrame(this._fadeFrame);
				this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
			} else {
				tile.active = true;
				this._pruneTiles();
			}

			if (!err) {
				addClass(tile.el, 'leaflet-tile-loaded');

				// @event tileload: TileEvent
				// Fired when a tile loads.
				this.fire('tileload', {
					tile: tile.el,
					coords: coords
				});
			}

			if (this._noTilesToLoad()) {
				this._loading = false;
				// @event load: Event
				// Fired when the grid layer loaded all visible tiles.
				this.fire('load');

				if (ielt9 || !this._map._fadeAnimated) {
					requestAnimFrame(this._pruneTiles, this);
				} else {
					// Wait a bit more than 0.2 secs (the duration of the tile fade-in)
					// to trigger a pruning.
					setTimeout(bind(this._pruneTiles, this), 250);
				}
			}
		},

		_getTilePos: function (coords) {
			return coords.scaleBy(this.getTileSize()).subtract(this._level.origin);
		},

		_wrapCoords: function (coords) {
			var newCoords = new Point(
				this._wrapX ? wrapNum(coords.x, this._wrapX) : coords.x,
				this._wrapY ? wrapNum(coords.y, this._wrapY) : coords.y);
			newCoords.z = coords.z;
			return newCoords;
		},

		_pxBoundsToTileRange: function (bounds) {
			var tileSize = this.getTileSize();
			return new Bounds(
				bounds.min.unscaleBy(tileSize).floor(),
				bounds.max.unscaleBy(tileSize).ceil().subtract([1, 1]));
		},

		_noTilesToLoad: function () {
			for (var key in this._tiles) {
				if (!this._tiles[key].loaded) { return false; }
			}
			return true;
		}
	});

	// @factory L.gridLayer(options?: GridLayer options)
	// Creates a new instance of GridLayer with the supplied options.
	function gridLayer(options) {
		return new GridLayer(options);
	}

	/*
	 * @class TileLayer
	 * @inherits GridLayer
	 * @aka L.TileLayer
	 * Used to load and display tile layers on the map. Note that most tile servers require attribution, which you can set under `Layer`. Extends `GridLayer`.
	 *
	 * @example
	 *
	 * ```js
	 * L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}).addTo(map);
	 * ```
	 *
	 * @section URL template
	 * @example
	 *
	 * A string of the following form:
	 *
	 * ```
	 * 'http://{s}.somedomain.com/blabla/{z}/{x}/{y}{r}.png'
	 * ```
	 *
	 * `{s}` means one of the available subdomains (used sequentially to help with browser parallel requests per domain limitation; subdomain values are specified in options; `a`, `b` or `c` by default, can be omitted), `{z}` — zoom level, `{x}` and `{y}` — tile coordinates. `{r}` can be used to add "&commat;2x" to the URL to load retina tiles.
	 *
	 * You can use custom keys in the template, which will be [evaluated](#util-template) from TileLayer options, like this:
	 *
	 * ```
	 * L.tileLayer('http://{s}.somedomain.com/{foo}/{z}/{x}/{y}.png', {foo: 'bar'});
	 * ```
	 */


	var TileLayer = GridLayer.extend({

		// @section
		// @aka TileLayer options
		options: {
			// @option minZoom: Number = 0
			// The minimum zoom level down to which this layer will be displayed (inclusive).
			minZoom: 0,

			// @option maxZoom: Number = 18
			// The maximum zoom level up to which this layer will be displayed (inclusive).
			maxZoom: 18,

			// @option subdomains: String|String[] = 'abc'
			// Subdomains of the tile service. Can be passed in the form of one string (where each letter is a subdomain name) or an array of strings.
			subdomains: 'abc',

			// @option errorTileUrl: String = ''
			// URL to the tile image to show in place of the tile that failed to load.
			errorTileUrl: '',

			// @option zoomOffset: Number = 0
			// The zoom number used in tile URLs will be offset with this value.
			zoomOffset: 0,

			// @option tms: Boolean = false
			// If `true`, inverses Y axis numbering for tiles (turn this on for [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
			tms: false,

			// @option zoomReverse: Boolean = false
			// If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`)
			zoomReverse: false,

			// @option detectRetina: Boolean = false
			// If `true` and user is on a retina display, it will request four tiles of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
			detectRetina: false,

			// @option crossOrigin: Boolean|String = false
			// Whether the crossOrigin attribute will be added to the tiles.
			// If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
			// Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
			crossOrigin: false
		},

		initialize: function (url, options) {

			this._url = url;

			options = setOptions(this, options);

			// detecting retina displays, adjusting tileSize and zoom levels
			if (options.detectRetina && retina && options.maxZoom > 0) {

				options.tileSize = Math.floor(options.tileSize / 2);

				if (!options.zoomReverse) {
					options.zoomOffset++;
					options.maxZoom--;
				} else {
					options.zoomOffset--;
					options.minZoom++;
				}

				options.minZoom = Math.max(0, options.minZoom);
			}

			if (typeof options.subdomains === 'string') {
				options.subdomains = options.subdomains.split('');
			}

			// for https://github.com/Leaflet/Leaflet/issues/137
			if (!android) {
				this.on('tileunload', this._onTileRemove);
			}
		},

		// @method setUrl(url: String, noRedraw?: Boolean): this
		// Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
		// If the URL does not change, the layer will not be redrawn unless
		// the noRedraw parameter is set to false.
		setUrl: function (url, noRedraw) {
			if (this._url === url && noRedraw === undefined) {
				noRedraw = true;
			}

			this._url = url;

			if (!noRedraw) {
				this.redraw();
			}
			return this;
		},

		// @method createTile(coords: Object, done?: Function): HTMLElement
		// Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
		// to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
		// callback is called when the tile has been loaded.
		createTile: function (coords, done) {
			var tile = document.createElement('img');

			on(tile, 'load', bind(this._tileOnLoad, this, done, tile));
			on(tile, 'error', bind(this._tileOnError, this, done, tile));

			if (this.options.crossOrigin || this.options.crossOrigin === '') {
				tile.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin;
			}

			/*
			 Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
			 http://www.w3.org/TR/WCAG20-TECHS/H67
			*/
			tile.alt = '';

			/*
			 Set role="presentation" to force screen readers to ignore this
			 https://www.w3.org/TR/wai-aria/roles#textalternativecomputation
			*/
			tile.setAttribute('role', 'presentation');

			tile.src = this.getTileUrl(coords);

			return tile;
		},

		// @section Extension methods
		// @uninheritable
		// Layers extending `TileLayer` might reimplement the following method.
		// @method getTileUrl(coords: Object): String
		// Called only internally, returns the URL for a tile given its coordinates.
		// Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
		getTileUrl: function (coords) {
			var data = {
				r: retina ? '@2x' : '',
				s: this._getSubdomain(coords),
				x: coords.x,
				y: coords.y,
				z: this._getZoomForUrl()
			};
			if (this._map && !this._map.options.crs.infinite) {
				var invertedY = this._globalTileRange.max.y - coords.y;
				if (this.options.tms) {
					data['y'] = invertedY;
				}
				data['-y'] = invertedY;
			}

			return template(this._url, extend(data, this.options));
		},

		_tileOnLoad: function (done, tile) {
			// For https://github.com/Leaflet/Leaflet/issues/3332
			if (ielt9) {
				setTimeout(bind(done, this, null, tile), 0);
			} else {
				done(null, tile);
			}
		},

		_tileOnError: function (done, tile, e) {
			var errorUrl = this.options.errorTileUrl;
			if (errorUrl && tile.getAttribute('src') !== errorUrl) {
				tile.src = errorUrl;
			}
			done(e, tile);
		},

		_onTileRemove: function (e) {
			e.tile.onload = null;
		},

		_getZoomForUrl: function () {
			var zoom = this._tileZoom,
			maxZoom = this.options.maxZoom,
			zoomReverse = this.options.zoomReverse,
			zoomOffset = this.options.zoomOffset;

			if (zoomReverse) {
				zoom = maxZoom - zoom;
			}

			return zoom + zoomOffset;
		},

		_getSubdomain: function (tilePoint) {
			var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
			return this.options.subdomains[index];
		},

		// stops loading all tiles in the background layer
		_abortLoading: function () {
			var i, tile;
			for (i in this._tiles) {
				if (this._tiles[i].coords.z !== this._tileZoom) {
					tile = this._tiles[i].el;

					tile.onload = falseFn;
					tile.onerror = falseFn;

					if (!tile.complete) {
						tile.src = emptyImageUrl;
						remove(tile);
						delete this._tiles[i];
					}
				}
			}
		},

		_removeTile: function (key) {
			var tile = this._tiles[key];
			if (!tile) { return; }

			// Cancels any pending http requests associated with the tile
			// unless we're on Android's stock browser,
			// see https://github.com/Leaflet/Leaflet/issues/137
			if (!androidStock) {
				tile.el.setAttribute('src', emptyImageUrl);
			}

			return GridLayer.prototype._removeTile.call(this, key);
		},

		_tileReady: function (coords, err, tile) {
			if (!this._map || (tile && tile.getAttribute('src') === emptyImageUrl)) {
				return;
			}

			return GridLayer.prototype._tileReady.call(this, coords, err, tile);
		}
	});


	// @factory L.tilelayer(urlTemplate: String, options?: TileLayer options)
	// Instantiates a tile layer object given a `URL template` and optionally an options object.

	function tileLayer(url, options) {
		return new TileLayer(url, options);
	}

	/*
	 * @class TileLayer.WMS
	 * @inherits TileLayer
	 * @aka L.TileLayer.WMS
	 * Used to display [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services as tile layers on the map. Extends `TileLayer`.
	 *
	 * @example
	 *
	 * ```js
	 * var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
	 * 	layers: 'nexrad-n0r-900913',
	 * 	format: 'image/png',
	 * 	transparent: true,
	 * 	attribution: "Weather data © 2012 IEM Nexrad"
	 * });
	 * ```
	 */

	var TileLayerWMS = TileLayer.extend({

		// @section
		// @aka TileLayer.WMS options
		// If any custom options not documented here are used, they will be sent to the
		// WMS server as extra parameters in each request URL. This can be useful for
		// [non-standard vendor WMS parameters](http://docs.geoserver.org/stable/en/user/services/wms/vendor.html).
		defaultWmsParams: {
			service: 'WMS',
			request: 'GetMap',

			// @option layers: String = ''
			// **(required)** Comma-separated list of WMS layers to show.
			layers: '',

			// @option styles: String = ''
			// Comma-separated list of WMS styles.
			styles: '',

			// @option format: String = 'image/jpeg'
			// WMS image format (use `'image/png'` for layers with transparency).
			format: 'image/jpeg',

			// @option transparent: Boolean = false
			// If `true`, the WMS service will return images with transparency.
			transparent: false,

			// @option version: String = '1.1.1'
			// Version of the WMS service to use
			version: '1.1.1'
		},

		options: {
			// @option crs: CRS = null
			// Coordinate Reference System to use for the WMS requests, defaults to
			// map CRS. Don't change this if you're not sure what it means.
			crs: null,

			// @option uppercase: Boolean = false
			// If `true`, WMS request parameter keys will be uppercase.
			uppercase: false
		},

		initialize: function (url, options) {

			this._url = url;

			var wmsParams = extend({}, this.defaultWmsParams);

			// all keys that are not TileLayer options go to WMS params
			for (var i in options) {
				if (!(i in this.options)) {
					wmsParams[i] = options[i];
				}
			}

			options = setOptions(this, options);

			var realRetina = options.detectRetina && retina ? 2 : 1;
			var tileSize = this.getTileSize();
			wmsParams.width = tileSize.x * realRetina;
			wmsParams.height = tileSize.y * realRetina;

			this.wmsParams = wmsParams;
		},

		onAdd: function (map) {

			this._crs = this.options.crs || map.options.crs;
			this._wmsVersion = parseFloat(this.wmsParams.version);

			var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
			this.wmsParams[projectionKey] = this._crs.code;

			TileLayer.prototype.onAdd.call(this, map);
		},

		getTileUrl: function (coords) {

			var tileBounds = this._tileCoordsToNwSe(coords),
			    crs = this._crs,
			    bounds = toBounds(crs.project(tileBounds[0]), crs.project(tileBounds[1])),
			    min = bounds.min,
			    max = bounds.max,
			    bbox = (this._wmsVersion >= 1.3 && this._crs === EPSG4326 ?
			    [min.y, min.x, max.y, max.x] :
			    [min.x, min.y, max.x, max.y]).join(','),
			    url = TileLayer.prototype.getTileUrl.call(this, coords);
			return url +
				getParamString(this.wmsParams, url, this.options.uppercase) +
				(this.options.uppercase ? '&BBOX=' : '&bbox=') + bbox;
		},

		// @method setParams(params: Object, noRedraw?: Boolean): this
		// Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
		setParams: function (params, noRedraw) {

			extend(this.wmsParams, params);

			if (!noRedraw) {
				this.redraw();
			}

			return this;
		}
	});


	// @factory L.tileLayer.wms(baseUrl: String, options: TileLayer.WMS options)
	// Instantiates a WMS tile layer object given a base URL of the WMS service and a WMS parameters/options object.
	function tileLayerWMS(url, options) {
		return new TileLayerWMS(url, options);
	}

	TileLayer.WMS = TileLayerWMS;
	tileLayer.wms = tileLayerWMS;

	/*
	 * @class Renderer
	 * @inherits Layer
	 * @aka L.Renderer
	 *
	 * Base class for vector renderer implementations (`SVG`, `Canvas`). Handles the
	 * DOM container of the renderer, its bounds, and its zoom animation.
	 *
	 * A `Renderer` works as an implicit layer group for all `Path`s - the renderer
	 * itself can be added or removed to the map. All paths use a renderer, which can
	 * be implicit (the map will decide the type of renderer and use it automatically)
	 * or explicit (using the [`renderer`](#path-renderer) option of the path).
	 *
	 * Do not use this class directly, use `SVG` and `Canvas` instead.
	 *
	 * @event update: Event
	 * Fired when the renderer updates its bounds, center and zoom, for example when
	 * its map has moved
	 */

	var Renderer = Layer.extend({

		// @section
		// @aka Renderer options
		options: {
			// @option padding: Number = 0.1
			// How much to extend the clip area around the map view (relative to its size)
			// e.g. 0.1 would be 10% of map view in each direction
			padding: 0.1,

			// @option tolerance: Number = 0
			// How much to extend click tolerance round a path/object on the map
			tolerance : 0
		},

		initialize: function (options) {
			setOptions(this, options);
			stamp(this);
			this._layers = this._layers || {};
		},

		onAdd: function () {
			if (!this._container) {
				this._initContainer(); // defined by renderer implementations

				if (this._zoomAnimated) {
					addClass(this._container, 'leaflet-zoom-animated');
				}
			}

			this.getPane().appendChild(this._container);
			this._update();
			this.on('update', this._updatePaths, this);
		},

		onRemove: function () {
			this.off('update', this._updatePaths, this);
			this._destroyContainer();
		},

		getEvents: function () {
			var events = {
				viewreset: this._reset,
				zoom: this._onZoom,
				moveend: this._update,
				zoomend: this._onZoomEnd
			};
			if (this._zoomAnimated) {
				events.zoomanim = this._onAnimZoom;
			}
			return events;
		},

		_onAnimZoom: function (ev) {
			this._updateTransform(ev.center, ev.zoom);
		},

		_onZoom: function () {
			this._updateTransform(this._map.getCenter(), this._map.getZoom());
		},

		_updateTransform: function (center, zoom) {
			var scale = this._map.getZoomScale(zoom, this._zoom),
			    position = getPosition(this._container),
			    viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding),
			    currentCenterPoint = this._map.project(this._center, zoom),
			    destCenterPoint = this._map.project(center, zoom),
			    centerOffset = destCenterPoint.subtract(currentCenterPoint),

			    topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);

			if (any3d) {
				setTransform(this._container, topLeftOffset, scale);
			} else {
				setPosition(this._container, topLeftOffset);
			}
		},

		_reset: function () {
			this._update();
			this._updateTransform(this._center, this._zoom);

			for (var id in this._layers) {
				this._layers[id]._reset();
			}
		},

		_onZoomEnd: function () {
			for (var id in this._layers) {
				this._layers[id]._project();
			}
		},

		_updatePaths: function () {
			for (var id in this._layers) {
				this._layers[id]._update();
			}
		},

		_update: function () {
			// Update pixel bounds of renderer container (for positioning/sizing/clipping later)
			// Subclasses are responsible of firing the 'update' event.
			var p = this.options.padding,
			    size = this._map.getSize(),
			    min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();

			this._bounds = new Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());

			this._center = this._map.getCenter();
			this._zoom = this._map.getZoom();
		}
	});

	/*
	 * @class Canvas
	 * @inherits Renderer
	 * @aka L.Canvas
	 *
	 * Allows vector layers to be displayed with [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
	 * Inherits `Renderer`.
	 *
	 * Due to [technical limitations](http://caniuse.com/#search=canvas), Canvas is not
	 * available in all web browsers, notably IE8, and overlapping geometries might
	 * not display properly in some edge cases.
	 *
	 * @example
	 *
	 * Use Canvas by default for all paths in the map:
	 *
	 * ```js
	 * var map = L.map('map', {
	 * 	renderer: L.canvas()
	 * });
	 * ```
	 *
	 * Use a Canvas renderer with extra padding for specific vector geometries:
	 *
	 * ```js
	 * var map = L.map('map');
	 * var myRenderer = L.canvas({ padding: 0.5 });
	 * var line = L.polyline( coordinates, { renderer: myRenderer } );
	 * var circle = L.circle( center, { renderer: myRenderer } );
	 * ```
	 */

	var Canvas = Renderer.extend({
		getEvents: function () {
			var events = Renderer.prototype.getEvents.call(this);
			events.viewprereset = this._onViewPreReset;
			return events;
		},

		_onViewPreReset: function () {
			// Set a flag so that a viewprereset+moveend+viewreset only updates&redraws once
			this._postponeUpdatePaths = true;
		},

		onAdd: function () {
			Renderer.prototype.onAdd.call(this);

			// Redraw vectors since canvas is cleared upon removal,
			// in case of removing the renderer itself from the map.
			this._draw();
		},

		_initContainer: function () {
			var container = this._container = document.createElement('canvas');

			on(container, 'mousemove', this._onMouseMove, this);
			on(container, 'click dblclick mousedown mouseup contextmenu', this._onClick, this);
			on(container, 'mouseout', this._handleMouseOut, this);

			this._ctx = container.getContext('2d');
		},

		_destroyContainer: function () {
			cancelAnimFrame(this._redrawRequest);
			delete this._ctx;
			remove(this._container);
			off(this._container);
			delete this._container;
		},

		_updatePaths: function () {
			if (this._postponeUpdatePaths) { return; }

			var layer;
			this._redrawBounds = null;
			for (var id in this._layers) {
				layer = this._layers[id];
				layer._update();
			}
			this._redraw();
		},

		_update: function () {
			if (this._map._animatingZoom && this._bounds) { return; }

			Renderer.prototype._update.call(this);

			var b = this._bounds,
			    container = this._container,
			    size = b.getSize(),
			    m = retina ? 2 : 1;

			setPosition(container, b.min);

			// set canvas size (also clearing it); use double size on retina
			container.width = m * size.x;
			container.height = m * size.y;
			container.style.width = size.x + 'px';
			container.style.height = size.y + 'px';

			if (retina) {
				this._ctx.scale(2, 2);
			}

			// translate so we use the same path coordinates after canvas element moves
			this._ctx.translate(-b.min.x, -b.min.y);

			// Tell paths to redraw themselves
			this.fire('update');
		},

		_reset: function () {
			Renderer.prototype._reset.call(this);

			if (this._postponeUpdatePaths) {
				this._postponeUpdatePaths = false;
				this._updatePaths();
			}
		},

		_initPath: function (layer) {
			this._updateDashArray(layer);
			this._layers[stamp(layer)] = layer;

			var order = layer._order = {
				layer: layer,
				prev: this._drawLast,
				next: null
			};
			if (this._drawLast) { this._drawLast.next = order; }
			this._drawLast = order;
			this._drawFirst = this._drawFirst || this._drawLast;
		},

		_addPath: function (layer) {
			this._requestRedraw(layer);
		},

		_removePath: function (layer) {
			var order = layer._order;
			var next = order.next;
			var prev = order.prev;

			if (next) {
				next.prev = prev;
			} else {
				this._drawLast = prev;
			}
			if (prev) {
				prev.next = next;
			} else {
				this._drawFirst = next;
			}

			delete layer._order;

			delete this._layers[stamp(layer)];

			this._requestRedraw(layer);
		},

		_updatePath: function (layer) {
			// Redraw the union of the layer's old pixel
			// bounds and the new pixel bounds.
			this._extendRedrawBounds(layer);
			layer._project();
			layer._update();
			// The redraw will extend the redraw bounds
			// with the new pixel bounds.
			this._requestRedraw(layer);
		},

		_updateStyle: function (layer) {
			this._updateDashArray(layer);
			this._requestRedraw(layer);
		},

		_updateDashArray: function (layer) {
			if (typeof layer.options.dashArray === 'string') {
				var parts = layer.options.dashArray.split(/[, ]+/),
				    dashArray = [],
				    dashValue,
				    i;
				for (i = 0; i < parts.length; i++) {
					dashValue = Number(parts[i]);
					// Ignore dash array containing invalid lengths
					if (isNaN(dashValue)) { return; }
					dashArray.push(dashValue);
				}
				layer.options._dashArray = dashArray;
			} else {
				layer.options._dashArray = layer.options.dashArray;
			}
		},

		_requestRedraw: function (layer) {
			if (!this._map) { return; }

			this._extendRedrawBounds(layer);
			this._redrawRequest = this._redrawRequest || requestAnimFrame(this._redraw, this);
		},

		_extendRedrawBounds: function (layer) {
			if (layer._pxBounds) {
				var padding = (layer.options.weight || 0) + 1;
				this._redrawBounds = this._redrawBounds || new Bounds();
				this._redrawBounds.extend(layer._pxBounds.min.subtract([padding, padding]));
				this._redrawBounds.extend(layer._pxBounds.max.add([padding, padding]));
			}
		},

		_redraw: function () {
			this._redrawRequest = null;

			if (this._redrawBounds) {
				this._redrawBounds.min._floor();
				this._redrawBounds.max._ceil();
			}

			this._clear(); // clear layers in redraw bounds
			this._draw(); // draw layers

			this._redrawBounds = null;
		},

		_clear: function () {
			var bounds = this._redrawBounds;
			if (bounds) {
				var size = bounds.getSize();
				this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y);
			} else {
				this._ctx.clearRect(0, 0, this._container.width, this._container.height);
			}
		},

		_draw: function () {
			var layer, bounds = this._redrawBounds;
			this._ctx.save();
			if (bounds) {
				var size = bounds.getSize();
				this._ctx.beginPath();
				this._ctx.rect(bounds.min.x, bounds.min.y, size.x, size.y);
				this._ctx.clip();
			}

			this._drawing = true;

			for (var order = this._drawFirst; order; order = order.next) {
				layer = order.layer;
				if (!bounds || (layer._pxBounds && layer._pxBounds.intersects(bounds))) {
					layer._updatePath();
				}
			}

			this._drawing = false;

			this._ctx.restore();  // Restore state before clipping.
		},

		_updatePoly: function (layer, closed) {
			if (!this._drawing) { return; }

			var i, j, len2, p,
			    parts = layer._parts,
			    len = parts.length,
			    ctx = this._ctx;

			if (!len) { return; }

			ctx.beginPath();

			for (i = 0; i < len; i++) {
				for (j = 0, len2 = parts[i].length; j < len2; j++) {
					p = parts[i][j];
					ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);
				}
				if (closed) {
					ctx.closePath();
				}
			}

			this._fillStroke(ctx, layer);

			// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
		},

		_updateCircle: function (layer) {

			if (!this._drawing || layer._empty()) { return; }

			var p = layer._point,
			    ctx = this._ctx,
			    r = Math.max(Math.round(layer._radius), 1),
			    s = (Math.max(Math.round(layer._radiusY), 1) || r) / r;

			if (s !== 1) {
				ctx.save();
				ctx.scale(1, s);
			}

			ctx.beginPath();
			ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);

			if (s !== 1) {
				ctx.restore();
			}

			this._fillStroke(ctx, layer);
		},

		_fillStroke: function (ctx, layer) {
			var options = layer.options;

			if (options.fill) {
				ctx.globalAlpha = options.fillOpacity;
				ctx.fillStyle = options.fillColor || options.color;
				ctx.fill(options.fillRule || 'evenodd');
			}

			if (options.stroke && options.weight !== 0) {
				if (ctx.setLineDash) {
					ctx.setLineDash(layer.options && layer.options._dashArray || []);
				}
				ctx.globalAlpha = options.opacity;
				ctx.lineWidth = options.weight;
				ctx.strokeStyle = options.color;
				ctx.lineCap = options.lineCap;
				ctx.lineJoin = options.lineJoin;
				ctx.stroke();
			}
		},

		// Canvas obviously doesn't have mouse events for individual drawn objects,
		// so we emulate that by calculating what's under the mouse on mousemove/click manually

		_onClick: function (e) {
			var point = this._map.mouseEventToLayerPoint(e), layer, clickedLayer;

			for (var order = this._drawFirst; order; order = order.next) {
				layer = order.layer;
				if (layer.options.interactive && layer._containsPoint(point) && !this._map._draggableMoved(layer)) {
					clickedLayer = layer;
				}
			}
			if (clickedLayer)  {
				fakeStop(e);
				this._fireEvent([clickedLayer], e);
			}
		},

		_onMouseMove: function (e) {
			if (!this._map || this._map.dragging.moving() || this._map._animatingZoom) { return; }

			var point = this._map.mouseEventToLayerPoint(e);
			this._handleMouseHover(e, point);
		},


		_handleMouseOut: function (e) {
			var layer = this._hoveredLayer;
			if (layer) {
				// if we're leaving the layer, fire mouseout
				removeClass(this._container, 'leaflet-interactive');
				this._fireEvent([layer], e, 'mouseout');
				this._hoveredLayer = null;
				this._mouseHoverThrottled = false;
			}
		},

		_handleMouseHover: function (e, point) {
			if (this._mouseHoverThrottled) {
				return;
			}

			var layer, candidateHoveredLayer;

			for (var order = this._drawFirst; order; order = order.next) {
				layer = order.layer;
				if (layer.options.interactive && layer._containsPoint(point)) {
					candidateHoveredLayer = layer;
				}
			}

			if (candidateHoveredLayer !== this._hoveredLayer) {
				this._handleMouseOut(e);

				if (candidateHoveredLayer) {
					addClass(this._container, 'leaflet-interactive'); // change cursor
					this._fireEvent([candidateHoveredLayer], e, 'mouseover');
					this._hoveredLayer = candidateHoveredLayer;
				}
			}

			if (this._hoveredLayer) {
				this._fireEvent([this._hoveredLayer], e);
			}

			this._mouseHoverThrottled = true;
			setTimeout(L.bind(function () {
				this._mouseHoverThrottled = false;
			}, this), 32);
		},

		_fireEvent: function (layers, e, type) {
			this._map._fireDOMEvent(e, type || e.type, layers);
		},

		_bringToFront: function (layer) {
			var order = layer._order;

			if (!order) { return; }

			var next = order.next;
			var prev = order.prev;

			if (next) {
				next.prev = prev;
			} else {
				// Already last
				return;
			}
			if (prev) {
				prev.next = next;
			} else if (next) {
				// Update first entry unless this is the
				// single entry
				this._drawFirst = next;
			}

			order.prev = this._drawLast;
			this._drawLast.next = order;

			order.next = null;
			this._drawLast = order;

			this._requestRedraw(layer);
		},

		_bringToBack: function (layer) {
			var order = layer._order;

			if (!order) { return; }

			var next = order.next;
			var prev = order.prev;

			if (prev) {
				prev.next = next;
			} else {
				// Already first
				return;
			}
			if (next) {
				next.prev = prev;
			} else if (prev) {
				// Update last entry unless this is the
				// single entry
				this._drawLast = prev;
			}

			order.prev = null;

			order.next = this._drawFirst;
			this._drawFirst.prev = order;
			this._drawFirst = order;

			this._requestRedraw(layer);
		}
	});

	// @factory L.canvas(options?: Renderer options)
	// Creates a Canvas renderer with the given options.
	function canvas$1(options) {
		return canvas ? new Canvas(options) : null;
	}

	/*
	 * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
	 */


	var vmlCreate = (function () {
		try {
			document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
			return function (name) {
				return document.createElement('<lvml:' + name + ' class="lvml">');
			};
		} catch (e) {
			return function (name) {
				return document.createElement('<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
			};
		}
	})();


	/*
	 * @class SVG
	 *
	 *
	 * VML was deprecated in 2012, which means VML functionality exists only for backwards compatibility
	 * with old versions of Internet Explorer.
	 */

	// mixin to redefine some SVG methods to handle VML syntax which is similar but with some differences
	var vmlMixin = {

		_initContainer: function () {
			this._container = create$1('div', 'leaflet-vml-container');
		},

		_update: function () {
			if (this._map._animatingZoom) { return; }
			Renderer.prototype._update.call(this);
			this.fire('update');
		},

		_initPath: function (layer) {
			var container = layer._container = vmlCreate('shape');

			addClass(container, 'leaflet-vml-shape ' + (this.options.className || ''));

			container.coordsize = '1 1';

			layer._path = vmlCreate('path');
			container.appendChild(layer._path);

			this._updateStyle(layer);
			this._layers[stamp(layer)] = layer;
		},

		_addPath: function (layer) {
			var container = layer._container;
			this._container.appendChild(container);

			if (layer.options.interactive) {
				layer.addInteractiveTarget(container);
			}
		},

		_removePath: function (layer) {
			var container = layer._container;
			remove(container);
			layer.removeInteractiveTarget(container);
			delete this._layers[stamp(layer)];
		},

		_updateStyle: function (layer) {
			var stroke = layer._stroke,
			    fill = layer._fill,
			    options = layer.options,
			    container = layer._container;

			container.stroked = !!options.stroke;
			container.filled = !!options.fill;

			if (options.stroke) {
				if (!stroke) {
					stroke = layer._stroke = vmlCreate('stroke');
				}
				container.appendChild(stroke);
				stroke.weight = options.weight + 'px';
				stroke.color = options.color;
				stroke.opacity = options.opacity;

				if (options.dashArray) {
					stroke.dashStyle = isArray(options.dashArray) ?
					    options.dashArray.join(' ') :
					    options.dashArray.replace(/( *, *)/g, ' ');
				} else {
					stroke.dashStyle = '';
				}
				stroke.endcap = options.lineCap.replace('butt', 'flat');
				stroke.joinstyle = options.lineJoin;

			} else if (stroke) {
				container.removeChild(stroke);
				layer._stroke = null;
			}

			if (options.fill) {
				if (!fill) {
					fill = layer._fill = vmlCreate('fill');
				}
				container.appendChild(fill);
				fill.color = options.fillColor || options.color;
				fill.opacity = options.fillOpacity;

			} else if (fill) {
				container.removeChild(fill);
				layer._fill = null;
			}
		},

		_updateCircle: function (layer) {
			var p = layer._point.round(),
			    r = Math.round(layer._radius),
			    r2 = Math.round(layer._radiusY || r);

			this._setPath(layer, layer._empty() ? 'M0 0' :
				'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r2 + ' 0,' + (65535 * 360));
		},

		_setPath: function (layer, path) {
			layer._path.v = path;
		},

		_bringToFront: function (layer) {
			toFront(layer._container);
		},

		_bringToBack: function (layer) {
			toBack(layer._container);
		}
	};

	var create$2 = vml ? vmlCreate : svgCreate;

	/*
	 * @class SVG
	 * @inherits Renderer
	 * @aka L.SVG
	 *
	 * Allows vector layers to be displayed with [SVG](https://developer.mozilla.org/docs/Web/SVG).
	 * Inherits `Renderer`.
	 *
	 * Due to [technical limitations](http://caniuse.com/#search=svg), SVG is not
	 * available in all web browsers, notably Android 2.x and 3.x.
	 *
	 * Although SVG is not available on IE7 and IE8, these browsers support
	 * [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language)
	 * (a now deprecated technology), and the SVG renderer will fall back to VML in
	 * this case.
	 *
	 * @example
	 *
	 * Use SVG by default for all paths in the map:
	 *
	 * ```js
	 * var map = L.map('map', {
	 * 	renderer: L.svg()
	 * });
	 * ```
	 *
	 * Use a SVG renderer with extra padding for specific vector geometries:
	 *
	 * ```js
	 * var map = L.map('map');
	 * var myRenderer = L.svg({ padding: 0.5 });
	 * var line = L.polyline( coordinates, { renderer: myRenderer } );
	 * var circle = L.circle( center, { renderer: myRenderer } );
	 * ```
	 */

	var SVG = Renderer.extend({

		getEvents: function () {
			var events = Renderer.prototype.getEvents.call(this);
			events.zoomstart = this._onZoomStart;
			return events;
		},

		_initContainer: function () {
			this._container = create$2('svg');

			// makes it possible to click through svg root; we'll reset it back in individual paths
			this._container.setAttribute('pointer-events', 'none');

			this._rootGroup = create$2('g');
			this._container.appendChild(this._rootGroup);
		},

		_destroyContainer: function () {
			remove(this._container);
			off(this._container);
			delete this._container;
			delete this._rootGroup;
			delete this._svgSize;
		},

		_onZoomStart: function () {
			// Drag-then-pinch interactions might mess up the center and zoom.
			// In this case, the easiest way to prevent this is re-do the renderer
			//   bounds and padding when the zooming starts.
			this._update();
		},

		_update: function () {
			if (this._map._animatingZoom && this._bounds) { return; }

			Renderer.prototype._update.call(this);

			var b = this._bounds,
			    size = b.getSize(),
			    container = this._container;

			// set size of svg-container if changed
			if (!this._svgSize || !this._svgSize.equals(size)) {
				this._svgSize = size;
				container.setAttribute('width', size.x);
				container.setAttribute('height', size.y);
			}

			// movement: update container viewBox so that we don't have to change coordinates of individual layers
			setPosition(container, b.min);
			container.setAttribute('viewBox', [b.min.x, b.min.y, size.x, size.y].join(' '));

			this.fire('update');
		},

		// methods below are called by vector layers implementations

		_initPath: function (layer) {
			var path = layer._path = create$2('path');

			// @namespace Path
			// @option className: String = null
			// Custom class name set on an element. Only for SVG renderer.
			if (layer.options.className) {
				addClass(path, layer.options.className);
			}

			if (layer.options.interactive) {
				addClass(path, 'leaflet-interactive');
			}

			this._updateStyle(layer);
			this._layers[stamp(layer)] = layer;
		},

		_addPath: function (layer) {
			if (!this._rootGroup) { this._initContainer(); }
			this._rootGroup.appendChild(layer._path);
			layer.addInteractiveTarget(layer._path);
		},

		_removePath: function (layer) {
			remove(layer._path);
			layer.removeInteractiveTarget(layer._path);
			delete this._layers[stamp(layer)];
		},

		_updatePath: function (layer) {
			layer._project();
			layer._update();
		},

		_updateStyle: function (layer) {
			var path = layer._path,
			    options = layer.options;

			if (!path) { return; }

			if (options.stroke) {
				path.setAttribute('stroke', options.color);
				path.setAttribute('stroke-opacity', options.opacity);
				path.setAttribute('stroke-width', options.weight);
				path.setAttribute('stroke-linecap', options.lineCap);
				path.setAttribute('stroke-linejoin', options.lineJoin);

				if (options.dashArray) {
					path.setAttribute('stroke-dasharray', options.dashArray);
				} else {
					path.removeAttribute('stroke-dasharray');
				}

				if (options.dashOffset) {
					path.setAttribute('stroke-dashoffset', options.dashOffset);
				} else {
					path.removeAttribute('stroke-dashoffset');
				}
			} else {
				path.setAttribute('stroke', 'none');
			}

			if (options.fill) {
				path.setAttribute('fill', options.fillColor || options.color);
				path.setAttribute('fill-opacity', options.fillOpacity);
				path.setAttribute('fill-rule', options.fillRule || 'evenodd');
			} else {
				path.setAttribute('fill', 'none');
			}
		},

		_updatePoly: function (layer, closed) {
			this._setPath(layer, pointsToPath(layer._parts, closed));
		},

		_updateCircle: function (layer) {
			var p = layer._point,
			    r = Math.max(Math.round(layer._radius), 1),
			    r2 = Math.max(Math.round(layer._radiusY), 1) || r,
			    arc = 'a' + r + ',' + r2 + ' 0 1,0 ';

			// drawing a circle with two half-arcs
			var d = layer._empty() ? 'M0 0' :
				'M' + (p.x - r) + ',' + p.y +
				arc + (r * 2) + ',0 ' +
				arc + (-r * 2) + ',0 ';

			this._setPath(layer, d);
		},

		_setPath: function (layer, path) {
			layer._path.setAttribute('d', path);
		},

		// SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
		_bringToFront: function (layer) {
			toFront(layer._path);
		},

		_bringToBack: function (layer) {
			toBack(layer._path);
		}
	});

	if (vml) {
		SVG.include(vmlMixin);
	}

	// @namespace SVG
	// @factory L.svg(options?: Renderer options)
	// Creates a SVG renderer with the given options.
	function svg$1(options) {
		return svg || vml ? new SVG(options) : null;
	}

	Map.include({
		// @namespace Map; @method getRenderer(layer: Path): Renderer
		// Returns the instance of `Renderer` that should be used to render the given
		// `Path`. It will ensure that the `renderer` options of the map and paths
		// are respected, and that the renderers do exist on the map.
		getRenderer: function (layer) {
			// @namespace Path; @option renderer: Renderer
			// Use this specific instance of `Renderer` for this path. Takes
			// precedence over the map's [default renderer](#map-renderer).
			var renderer = layer.options.renderer || this._getPaneRenderer(layer.options.pane) || this.options.renderer || this._renderer;

			if (!renderer) {
				renderer = this._renderer = this._createRenderer();
			}

			if (!this.hasLayer(renderer)) {
				this.addLayer(renderer);
			}
			return renderer;
		},

		_getPaneRenderer: function (name) {
			if (name === 'overlayPane' || name === undefined) {
				return false;
			}

			var renderer = this._paneRenderers[name];
			if (renderer === undefined) {
				renderer = this._createRenderer({pane: name});
				this._paneRenderers[name] = renderer;
			}
			return renderer;
		},

		_createRenderer: function (options) {
			// @namespace Map; @option preferCanvas: Boolean = false
			// Whether `Path`s should be rendered on a `Canvas` renderer.
			// By default, all `Path`s are rendered in a `SVG` renderer.
			return (this.options.preferCanvas && canvas$1(options)) || svg$1(options);
		}
	});

	/*
	 * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
	 */

	/*
	 * @class Rectangle
	 * @aka L.Rectangle
	 * @inherits Polygon
	 *
	 * A class for drawing rectangle overlays on a map. Extends `Polygon`.
	 *
	 * @example
	 *
	 * ```js
	 * // define rectangle geographical bounds
	 * var bounds = [[54.559322, -5.767822], [56.1210604, -3.021240]];
	 *
	 * // create an orange rectangle
	 * L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
	 *
	 * // zoom the map to the rectangle bounds
	 * map.fitBounds(bounds);
	 * ```
	 *
	 */


	var Rectangle = Polygon.extend({
		initialize: function (latLngBounds, options) {
			Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
		},

		// @method setBounds(latLngBounds: LatLngBounds): this
		// Redraws the rectangle with the passed bounds.
		setBounds: function (latLngBounds) {
			return this.setLatLngs(this._boundsToLatLngs(latLngBounds));
		},

		_boundsToLatLngs: function (latLngBounds) {
			latLngBounds = toLatLngBounds(latLngBounds);
			return [
				latLngBounds.getSouthWest(),
				latLngBounds.getNorthWest(),
				latLngBounds.getNorthEast(),
				latLngBounds.getSouthEast()
			];
		}
	});


	// @factory L.rectangle(latLngBounds: LatLngBounds, options?: Polyline options)
	function rectangle(latLngBounds, options) {
		return new Rectangle(latLngBounds, options);
	}

	SVG.create = create$2;
	SVG.pointsToPath = pointsToPath;

	GeoJSON.geometryToLayer = geometryToLayer;
	GeoJSON.coordsToLatLng = coordsToLatLng;
	GeoJSON.coordsToLatLngs = coordsToLatLngs;
	GeoJSON.latLngToCoords = latLngToCoords;
	GeoJSON.latLngsToCoords = latLngsToCoords;
	GeoJSON.getFeature = getFeature;
	GeoJSON.asFeature = asFeature;

	/*
	 * L.Handler.BoxZoom is used to add shift-drag zoom interaction to the map
	 * (zoom to a selected bounding box), enabled by default.
	 */

	// @namespace Map
	// @section Interaction Options
	Map.mergeOptions({
		// @option boxZoom: Boolean = true
		// Whether the map can be zoomed to a rectangular area specified by
		// dragging the mouse while pressing the shift key.
		boxZoom: true
	});

	var BoxZoom = Handler.extend({
		initialize: function (map) {
			this._map = map;
			this._container = map._container;
			this._pane = map._panes.overlayPane;
			this._resetStateTimeout = 0;
			map.on('unload', this._destroy, this);
		},

		addHooks: function () {
			on(this._container, 'mousedown', this._onMouseDown, this);
		},

		removeHooks: function () {
			off(this._container, 'mousedown', this._onMouseDown, this);
		},

		moved: function () {
			return this._moved;
		},

		_destroy: function () {
			remove(this._pane);
			delete this._pane;
		},

		_resetState: function () {
			this._resetStateTimeout = 0;
			this._moved = false;
		},

		_clearDeferredResetState: function () {
			if (this._resetStateTimeout !== 0) {
				clearTimeout(this._resetStateTimeout);
				this._resetStateTimeout = 0;
			}
		},

		_onMouseDown: function (e) {
			if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

			// Clear the deferred resetState if it hasn't executed yet, otherwise it
			// will interrupt the interaction and orphan a box element in the container.
			this._clearDeferredResetState();
			this._resetState();

			disableTextSelection();
			disableImageDrag();

			this._startPoint = this._map.mouseEventToContainerPoint(e);

			on(document, {
				contextmenu: stop,
				mousemove: this._onMouseMove,
				mouseup: this._onMouseUp,
				keydown: this._onKeyDown
			}, this);
		},

		_onMouseMove: function (e) {
			if (!this._moved) {
				this._moved = true;

				this._box = create$1('div', 'leaflet-zoom-box', this._container);
				addClass(this._container, 'leaflet-crosshair');

				this._map.fire('boxzoomstart');
			}

			this._point = this._map.mouseEventToContainerPoint(e);

			var bounds = new Bounds(this._point, this._startPoint),
			    size = bounds.getSize();

			setPosition(this._box, bounds.min);

			this._box.style.width  = size.x + 'px';
			this._box.style.height = size.y + 'px';
		},

		_finish: function () {
			if (this._moved) {
				remove(this._box);
				removeClass(this._container, 'leaflet-crosshair');
			}

			enableTextSelection();
			enableImageDrag();

			off(document, {
				contextmenu: stop,
				mousemove: this._onMouseMove,
				mouseup: this._onMouseUp,
				keydown: this._onKeyDown
			}, this);
		},

		_onMouseUp: function (e) {
			if ((e.which !== 1) && (e.button !== 1)) { return; }

			this._finish();

			if (!this._moved) { return; }
			// Postpone to next JS tick so internal click event handling
			// still see it as "moved".
			this._clearDeferredResetState();
			this._resetStateTimeout = setTimeout(bind(this._resetState, this), 0);

			var bounds = new LatLngBounds(
			        this._map.containerPointToLatLng(this._startPoint),
			        this._map.containerPointToLatLng(this._point));

			this._map
				.fitBounds(bounds)
				.fire('boxzoomend', {boxZoomBounds: bounds});
		},

		_onKeyDown: function (e) {
			if (e.keyCode === 27) {
				this._finish();
			}
		}
	});

	// @section Handlers
	// @property boxZoom: Handler
	// Box (shift-drag with mouse) zoom handler.
	Map.addInitHook('addHandler', 'boxZoom', BoxZoom);

	/*
	 * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
	 */

	// @namespace Map
	// @section Interaction Options

	Map.mergeOptions({
		// @option doubleClickZoom: Boolean|String = true
		// Whether the map can be zoomed in by double clicking on it and
		// zoomed out by double clicking while holding shift. If passed
		// `'center'`, double-click zoom will zoom to the center of the
		//  view regardless of where the mouse was.
		doubleClickZoom: true
	});

	var DoubleClickZoom = Handler.extend({
		addHooks: function () {
			this._map.on('dblclick', this._onDoubleClick, this);
		},

		removeHooks: function () {
			this._map.off('dblclick', this._onDoubleClick, this);
		},

		_onDoubleClick: function (e) {
			var map = this._map,
			    oldZoom = map.getZoom(),
			    delta = map.options.zoomDelta,
			    zoom = e.originalEvent.shiftKey ? oldZoom - delta : oldZoom + delta;

			if (map.options.doubleClickZoom === 'center') {
				map.setZoom(zoom);
			} else {
				map.setZoomAround(e.containerPoint, zoom);
			}
		}
	});

	// @section Handlers
	//
	// Map properties include interaction handlers that allow you to control
	// interaction behavior in runtime, enabling or disabling certain features such
	// as dragging or touch zoom (see `Handler` methods). For example:
	//
	// ```js
	// map.doubleClickZoom.disable();
	// ```
	//
	// @property doubleClickZoom: Handler
	// Double click zoom handler.
	Map.addInitHook('addHandler', 'doubleClickZoom', DoubleClickZoom);

	/*
	 * L.Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
	 */

	// @namespace Map
	// @section Interaction Options
	Map.mergeOptions({
		// @option dragging: Boolean = true
		// Whether the map be draggable with mouse/touch or not.
		dragging: true,

		// @section Panning Inertia Options
		// @option inertia: Boolean = *
		// If enabled, panning of the map will have an inertia effect where
		// the map builds momentum while dragging and continues moving in
		// the same direction for some time. Feels especially nice on touch
		// devices. Enabled by default unless running on old Android devices.
		inertia: !android23,

		// @option inertiaDeceleration: Number = 3000
		// The rate with which the inertial movement slows down, in pixels/second².
		inertiaDeceleration: 3400, // px/s^2

		// @option inertiaMaxSpeed: Number = Infinity
		// Max speed of the inertial movement, in pixels/second.
		inertiaMaxSpeed: Infinity, // px/s

		// @option easeLinearity: Number = 0.2
		easeLinearity: 0.2,

		// TODO refactor, move to CRS
		// @option worldCopyJump: Boolean = false
		// With this option enabled, the map tracks when you pan to another "copy"
		// of the world and seamlessly jumps to the original one so that all overlays
		// like markers and vector layers are still visible.
		worldCopyJump: false,

		// @option maxBoundsViscosity: Number = 0.0
		// If `maxBounds` is set, this option will control how solid the bounds
		// are when dragging the map around. The default value of `0.0` allows the
		// user to drag outside the bounds at normal speed, higher values will
		// slow down map dragging outside bounds, and `1.0` makes the bounds fully
		// solid, preventing the user from dragging outside the bounds.
		maxBoundsViscosity: 0.0
	});

	var Drag = Handler.extend({
		addHooks: function () {
			if (!this._draggable) {
				var map = this._map;

				this._draggable = new Draggable(map._mapPane, map._container);

				this._draggable.on({
					dragstart: this._onDragStart,
					drag: this._onDrag,
					dragend: this._onDragEnd
				}, this);

				this._draggable.on('predrag', this._onPreDragLimit, this);
				if (map.options.worldCopyJump) {
					this._draggable.on('predrag', this._onPreDragWrap, this);
					map.on('zoomend', this._onZoomEnd, this);

					map.whenReady(this._onZoomEnd, this);
				}
			}
			addClass(this._map._container, 'leaflet-grab leaflet-touch-drag');
			this._draggable.enable();
			this._positions = [];
			this._times = [];
		},

		removeHooks: function () {
			removeClass(this._map._container, 'leaflet-grab');
			removeClass(this._map._container, 'leaflet-touch-drag');
			this._draggable.disable();
		},

		moved: function () {
			return this._draggable && this._draggable._moved;
		},

		moving: function () {
			return this._draggable && this._draggable._moving;
		},

		_onDragStart: function () {
			var map = this._map;

			map._stop();
			if (this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
				var bounds = toLatLngBounds(this._map.options.maxBounds);

				this._offsetLimit = toBounds(
					this._map.latLngToContainerPoint(bounds.getNorthWest()).multiplyBy(-1),
					this._map.latLngToContainerPoint(bounds.getSouthEast()).multiplyBy(-1)
						.add(this._map.getSize()));

				this._viscosity = Math.min(1.0, Math.max(0.0, this._map.options.maxBoundsViscosity));
			} else {
				this._offsetLimit = null;
			}

			map
			    .fire('movestart')
			    .fire('dragstart');

			if (map.options.inertia) {
				this._positions = [];
				this._times = [];
			}
		},

		_onDrag: function (e) {
			if (this._map.options.inertia) {
				var time = this._lastTime = +new Date(),
				    pos = this._lastPos = this._draggable._absPos || this._draggable._newPos;

				this._positions.push(pos);
				this._times.push(time);

				this._prunePositions(time);
			}

			this._map
			    .fire('move', e)
			    .fire('drag', e);
		},

		_prunePositions: function (time) {
			while (this._positions.length > 1 && time - this._times[0] > 50) {
				this._positions.shift();
				this._times.shift();
			}
		},

		_onZoomEnd: function () {
			var pxCenter = this._map.getSize().divideBy(2),
			    pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);

			this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
			this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
		},

		_viscousLimit: function (value, threshold) {
			return value - (value - threshold) * this._viscosity;
		},

		_onPreDragLimit: function () {
			if (!this._viscosity || !this._offsetLimit) { return; }

			var offset = this._draggable._newPos.subtract(this._draggable._startPos);

			var limit = this._offsetLimit;
			if (offset.x < limit.min.x) { offset.x = this._viscousLimit(offset.x, limit.min.x); }
			if (offset.y < limit.min.y) { offset.y = this._viscousLimit(offset.y, limit.min.y); }
			if (offset.x > limit.max.x) { offset.x = this._viscousLimit(offset.x, limit.max.x); }
			if (offset.y > limit.max.y) { offset.y = this._viscousLimit(offset.y, limit.max.y); }

			this._draggable._newPos = this._draggable._startPos.add(offset);
		},

		_onPreDragWrap: function () {
			// TODO refactor to be able to adjust map pane position after zoom
			var worldWidth = this._worldWidth,
			    halfWidth = Math.round(worldWidth / 2),
			    dx = this._initialWorldOffset,
			    x = this._draggable._newPos.x,
			    newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
			    newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
			    newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;

			this._draggable._absPos = this._draggable._newPos.clone();
			this._draggable._newPos.x = newX;
		},

		_onDragEnd: function (e) {
			var map = this._map,
			    options = map.options,

			    noInertia = !options.inertia || this._times.length < 2;

			map.fire('dragend', e);

			if (noInertia) {
				map.fire('moveend');

			} else {
				this._prunePositions(+new Date());

				var direction = this._lastPos.subtract(this._positions[0]),
				    duration = (this._lastTime - this._times[0]) / 1000,
				    ease = options.easeLinearity,

				    speedVector = direction.multiplyBy(ease / duration),
				    speed = speedVector.distanceTo([0, 0]),

				    limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
				    limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),

				    decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
				    offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();

				if (!offset.x && !offset.y) {
					map.fire('moveend');

				} else {
					offset = map._limitOffset(offset, map.options.maxBounds);

					requestAnimFrame(function () {
						map.panBy(offset, {
							duration: decelerationDuration,
							easeLinearity: ease,
							noMoveStart: true,
							animate: true
						});
					});
				}
			}
		}
	});

	// @section Handlers
	// @property dragging: Handler
	// Map dragging handler (by both mouse and touch).
	Map.addInitHook('addHandler', 'dragging', Drag);

	/*
	 * L.Map.Keyboard is handling keyboard interaction with the map, enabled by default.
	 */

	// @namespace Map
	// @section Keyboard Navigation Options
	Map.mergeOptions({
		// @option keyboard: Boolean = true
		// Makes the map focusable and allows users to navigate the map with keyboard
		// arrows and `+`/`-` keys.
		keyboard: true,

		// @option keyboardPanDelta: Number = 80
		// Amount of pixels to pan when pressing an arrow key.
		keyboardPanDelta: 80
	});

	var Keyboard = Handler.extend({

		keyCodes: {
			left:    [37],
			right:   [39],
			down:    [40],
			up:      [38],
			zoomIn:  [187, 107, 61, 171],
			zoomOut: [189, 109, 54, 173]
		},

		initialize: function (map) {
			this._map = map;

			this._setPanDelta(map.options.keyboardPanDelta);
			this._setZoomDelta(map.options.zoomDelta);
		},

		addHooks: function () {
			var container = this._map._container;

			// make the container focusable by tabbing
			if (container.tabIndex <= 0) {
				container.tabIndex = '0';
			}

			on(container, {
				focus: this._onFocus,
				blur: this._onBlur,
				mousedown: this._onMouseDown
			}, this);

			this._map.on({
				focus: this._addHooks,
				blur: this._removeHooks
			}, this);
		},

		removeHooks: function () {
			this._removeHooks();

			off(this._map._container, {
				focus: this._onFocus,
				blur: this._onBlur,
				mousedown: this._onMouseDown
			}, this);

			this._map.off({
				focus: this._addHooks,
				blur: this._removeHooks
			}, this);
		},

		_onMouseDown: function () {
			if (this._focused) { return; }

			var body = document.body,
			    docEl = document.documentElement,
			    top = body.scrollTop || docEl.scrollTop,
			    left = body.scrollLeft || docEl.scrollLeft;

			this._map._container.focus();

			window.scrollTo(left, top);
		},

		_onFocus: function () {
			this._focused = true;
			this._map.fire('focus');
		},

		_onBlur: function () {
			this._focused = false;
			this._map.fire('blur');
		},

		_setPanDelta: function (panDelta) {
			var keys = this._panKeys = {},
			    codes = this.keyCodes,
			    i, len;

			for (i = 0, len = codes.left.length; i < len; i++) {
				keys[codes.left[i]] = [-1 * panDelta, 0];
			}
			for (i = 0, len = codes.right.length; i < len; i++) {
				keys[codes.right[i]] = [panDelta, 0];
			}
			for (i = 0, len = codes.down.length; i < len; i++) {
				keys[codes.down[i]] = [0, panDelta];
			}
			for (i = 0, len = codes.up.length; i < len; i++) {
				keys[codes.up[i]] = [0, -1 * panDelta];
			}
		},

		_setZoomDelta: function (zoomDelta) {
			var keys = this._zoomKeys = {},
			    codes = this.keyCodes,
			    i, len;

			for (i = 0, len = codes.zoomIn.length; i < len; i++) {
				keys[codes.zoomIn[i]] = zoomDelta;
			}
			for (i = 0, len = codes.zoomOut.length; i < len; i++) {
				keys[codes.zoomOut[i]] = -zoomDelta;
			}
		},

		_addHooks: function () {
			on(document, 'keydown', this._onKeyDown, this);
		},

		_removeHooks: function () {
			off(document, 'keydown', this._onKeyDown, this);
		},

		_onKeyDown: function (e) {
			if (e.altKey || e.ctrlKey || e.metaKey) { return; }

			var key = e.keyCode,
			    map = this._map,
			    offset;

			if (key in this._panKeys) {
				if (!map._panAnim || !map._panAnim._inProgress) {
					offset = this._panKeys[key];
					if (e.shiftKey) {
						offset = toPoint(offset).multiplyBy(3);
					}

					map.panBy(offset);

					if (map.options.maxBounds) {
						map.panInsideBounds(map.options.maxBounds);
					}
				}
			} else if (key in this._zoomKeys) {
				map.setZoom(map.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[key]);

			} else if (key === 27 && map._popup && map._popup.options.closeOnEscapeKey) {
				map.closePopup();

			} else {
				return;
			}

			stop(e);
		}
	});

	// @section Handlers
	// @section Handlers
	// @property keyboard: Handler
	// Keyboard navigation handler.
	Map.addInitHook('addHandler', 'keyboard', Keyboard);

	/*
	 * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
	 */

	// @namespace Map
	// @section Interaction Options
	Map.mergeOptions({
		// @section Mousewheel options
		// @option scrollWheelZoom: Boolean|String = true
		// Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
		// it will zoom to the center of the view regardless of where the mouse was.
		scrollWheelZoom: true,

		// @option wheelDebounceTime: Number = 40
		// Limits the rate at which a wheel can fire (in milliseconds). By default
		// user can't zoom via wheel more often than once per 40 ms.
		wheelDebounceTime: 40,

		// @option wheelPxPerZoomLevel: Number = 60
		// How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
		// mean a change of one full zoom level. Smaller values will make wheel-zooming
		// faster (and vice versa).
		wheelPxPerZoomLevel: 60
	});

	var ScrollWheelZoom = Handler.extend({
		addHooks: function () {
			on(this._map._container, 'mousewheel', this._onWheelScroll, this);

			this._delta = 0;
		},

		removeHooks: function () {
			off(this._map._container, 'mousewheel', this._onWheelScroll, this);
		},

		_onWheelScroll: function (e) {
			var delta = getWheelDelta(e);

			var debounce = this._map.options.wheelDebounceTime;

			this._delta += delta;
			this._lastMousePos = this._map.mouseEventToContainerPoint(e);

			if (!this._startTime) {
				this._startTime = +new Date();
			}

			var left = Math.max(debounce - (+new Date() - this._startTime), 0);

			clearTimeout(this._timer);
			this._timer = setTimeout(bind(this._performZoom, this), left);

			stop(e);
		},

		_performZoom: function () {
			var map = this._map,
			    zoom = map.getZoom(),
			    snap = this._map.options.zoomSnap || 0;

			map._stop(); // stop panning and fly animations if any

			// map the delta with a sigmoid function to -4..4 range leaning on -1..1
			var d2 = this._delta / (this._map.options.wheelPxPerZoomLevel * 4),
			    d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2,
			    d4 = snap ? Math.ceil(d3 / snap) * snap : d3,
			    delta = map._limitZoom(zoom + (this._delta > 0 ? d4 : -d4)) - zoom;

			this._delta = 0;
			this._startTime = null;

			if (!delta) { return; }

			if (map.options.scrollWheelZoom === 'center') {
				map.setZoom(zoom + delta);
			} else {
				map.setZoomAround(this._lastMousePos, zoom + delta);
			}
		}
	});

	// @section Handlers
	// @property scrollWheelZoom: Handler
	// Scroll wheel zoom handler.
	Map.addInitHook('addHandler', 'scrollWheelZoom', ScrollWheelZoom);

	/*
	 * L.Map.Tap is used to enable mobile hacks like quick taps and long hold.
	 */

	// @namespace Map
	// @section Interaction Options
	Map.mergeOptions({
		// @section Touch interaction options
		// @option tap: Boolean = true
		// Enables mobile hacks for supporting instant taps (fixing 200ms click
		// delay on iOS/Android) and touch holds (fired as `contextmenu` events).
		tap: true,

		// @option tapTolerance: Number = 15
		// The max number of pixels a user can shift his finger during touch
		// for it to be considered a valid tap.
		tapTolerance: 15
	});

	var Tap = Handler.extend({
		addHooks: function () {
			on(this._map._container, 'touchstart', this._onDown, this);
		},

		removeHooks: function () {
			off(this._map._container, 'touchstart', this._onDown, this);
		},

		_onDown: function (e) {
			if (!e.touches) { return; }

			preventDefault(e);

			this._fireClick = true;

			// don't simulate click or track longpress if more than 1 touch
			if (e.touches.length > 1) {
				this._fireClick = false;
				clearTimeout(this._holdTimeout);
				return;
			}

			var first = e.touches[0],
			    el = first.target;

			this._startPos = this._newPos = new Point(first.clientX, first.clientY);

			// if touching a link, highlight it
			if (el.tagName && el.tagName.toLowerCase() === 'a') {
				addClass(el, 'leaflet-active');
			}

			// simulate long hold but setting a timeout
			this._holdTimeout = setTimeout(bind(function () {
				if (this._isTapValid()) {
					this._fireClick = false;
					this._onUp();
					this._simulateEvent('contextmenu', first);
				}
			}, this), 1000);

			this._simulateEvent('mousedown', first);

			on(document, {
				touchmove: this._onMove,
				touchend: this._onUp
			}, this);
		},

		_onUp: function (e) {
			clearTimeout(this._holdTimeout);

			off(document, {
				touchmove: this._onMove,
				touchend: this._onUp
			}, this);

			if (this._fireClick && e && e.changedTouches) {

				var first = e.changedTouches[0],
				    el = first.target;

				if (el && el.tagName && el.tagName.toLowerCase() === 'a') {
					removeClass(el, 'leaflet-active');
				}

				this._simulateEvent('mouseup', first);

				// simulate click if the touch didn't move too much
				if (this._isTapValid()) {
					this._simulateEvent('click', first);
				}
			}
		},

		_isTapValid: function () {
			return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
		},

		_onMove: function (e) {
			var first = e.touches[0];
			this._newPos = new Point(first.clientX, first.clientY);
			this._simulateEvent('mousemove', first);
		},

		_simulateEvent: function (type, e) {
			var simulatedEvent = document.createEvent('MouseEvents');

			simulatedEvent._simulated = true;
			e.target._simulatedClick = true;

			simulatedEvent.initMouseEvent(
			        type, true, true, window, 1,
			        e.screenX, e.screenY,
			        e.clientX, e.clientY,
			        false, false, false, false, 0, null);

			e.target.dispatchEvent(simulatedEvent);
		}
	});

	// @section Handlers
	// @property tap: Handler
	// Mobile touch hacks (quick tap and touch hold) handler.
	if (touch && !pointer) {
		Map.addInitHook('addHandler', 'tap', Tap);
	}

	/*
	 * L.Handler.TouchZoom is used by L.Map to add pinch zoom on supported mobile browsers.
	 */

	// @namespace Map
	// @section Interaction Options
	Map.mergeOptions({
		// @section Touch interaction options
		// @option touchZoom: Boolean|String = *
		// Whether the map can be zoomed by touch-dragging with two fingers. If
		// passed `'center'`, it will zoom to the center of the view regardless of
		// where the touch events (fingers) were. Enabled for touch-capable web
		// browsers except for old Androids.
		touchZoom: touch && !android23,

		// @option bounceAtZoomLimits: Boolean = true
		// Set it to false if you don't want the map to zoom beyond min/max zoom
		// and then bounce back when pinch-zooming.
		bounceAtZoomLimits: true
	});

	var TouchZoom = Handler.extend({
		addHooks: function () {
			addClass(this._map._container, 'leaflet-touch-zoom');
			on(this._map._container, 'touchstart', this._onTouchStart, this);
		},

		removeHooks: function () {
			removeClass(this._map._container, 'leaflet-touch-zoom');
			off(this._map._container, 'touchstart', this._onTouchStart, this);
		},

		_onTouchStart: function (e) {
			var map = this._map;
			if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }

			var p1 = map.mouseEventToContainerPoint(e.touches[0]),
			    p2 = map.mouseEventToContainerPoint(e.touches[1]);

			this._centerPoint = map.getSize()._divideBy(2);
			this._startLatLng = map.containerPointToLatLng(this._centerPoint);
			if (map.options.touchZoom !== 'center') {
				this._pinchStartLatLng = map.containerPointToLatLng(p1.add(p2)._divideBy(2));
			}

			this._startDist = p1.distanceTo(p2);
			this._startZoom = map.getZoom();

			this._moved = false;
			this._zooming = true;

			map._stop();

			on(document, 'touchmove', this._onTouchMove, this);
			on(document, 'touchend', this._onTouchEnd, this);

			preventDefault(e);
		},

		_onTouchMove: function (e) {
			if (!e.touches || e.touches.length !== 2 || !this._zooming) { return; }

			var map = this._map,
			    p1 = map.mouseEventToContainerPoint(e.touches[0]),
			    p2 = map.mouseEventToContainerPoint(e.touches[1]),
			    scale = p1.distanceTo(p2) / this._startDist;

			this._zoom = map.getScaleZoom(scale, this._startZoom);

			if (!map.options.bounceAtZoomLimits && (
				(this._zoom < map.getMinZoom() && scale < 1) ||
				(this._zoom > map.getMaxZoom() && scale > 1))) {
				this._zoom = map._limitZoom(this._zoom);
			}

			if (map.options.touchZoom === 'center') {
				this._center = this._startLatLng;
				if (scale === 1) { return; }
			} else {
				// Get delta from pinch to center, so centerLatLng is delta applied to initial pinchLatLng
				var delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);
				if (scale === 1 && delta.x === 0 && delta.y === 0) { return; }
				this._center = map.unproject(map.project(this._pinchStartLatLng, this._zoom).subtract(delta), this._zoom);
			}

			if (!this._moved) {
				map._moveStart(true, false);
				this._moved = true;
			}

			cancelAnimFrame(this._animRequest);

			var moveFn = bind(map._move, map, this._center, this._zoom, {pinch: true, round: false});
			this._animRequest = requestAnimFrame(moveFn, this, true);

			preventDefault(e);
		},

		_onTouchEnd: function () {
			if (!this._moved || !this._zooming) {
				this._zooming = false;
				return;
			}

			this._zooming = false;
			cancelAnimFrame(this._animRequest);

			off(document, 'touchmove', this._onTouchMove);
			off(document, 'touchend', this._onTouchEnd);

			// Pinch updates GridLayers' levels only when zoomSnap is off, so zoomSnap becomes noUpdate.
			if (this._map.options.zoomAnimation) {
				this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), true, this._map.options.zoomSnap);
			} else {
				this._map._resetView(this._center, this._map._limitZoom(this._zoom));
			}
		}
	});

	// @section Handlers
	// @property touchZoom: Handler
	// Touch zoom handler.
	Map.addInitHook('addHandler', 'touchZoom', TouchZoom);

	Map.BoxZoom = BoxZoom;
	Map.DoubleClickZoom = DoubleClickZoom;
	Map.Drag = Drag;
	Map.Keyboard = Keyboard;
	Map.ScrollWheelZoom = ScrollWheelZoom;
	Map.Tap = Tap;
	Map.TouchZoom = TouchZoom;

	Object.freeze = freeze;

	exports.version = version;
	exports.Control = Control;
	exports.control = control;
	exports.Browser = Browser;
	exports.Evented = Evented;
	exports.Mixin = Mixin;
	exports.Util = Util;
	exports.Class = Class;
	exports.Handler = Handler;
	exports.extend = extend;
	exports.bind = bind;
	exports.stamp = stamp;
	exports.setOptions = setOptions;
	exports.DomEvent = DomEvent;
	exports.DomUtil = DomUtil;
	exports.PosAnimation = PosAnimation;
	exports.Draggable = Draggable;
	exports.LineUtil = LineUtil;
	exports.PolyUtil = PolyUtil;
	exports.Point = Point;
	exports.point = toPoint;
	exports.Bounds = Bounds;
	exports.bounds = toBounds;
	exports.Transformation = Transformation;
	exports.transformation = toTransformation;
	exports.Projection = index;
	exports.LatLng = LatLng;
	exports.latLng = toLatLng;
	exports.LatLngBounds = LatLngBounds;
	exports.latLngBounds = toLatLngBounds;
	exports.CRS = CRS;
	exports.GeoJSON = GeoJSON;
	exports.geoJSON = geoJSON;
	exports.geoJson = geoJson;
	exports.Layer = Layer;
	exports.LayerGroup = LayerGroup;
	exports.layerGroup = layerGroup;
	exports.FeatureGroup = FeatureGroup;
	exports.featureGroup = featureGroup;
	exports.ImageOverlay = ImageOverlay;
	exports.imageOverlay = imageOverlay;
	exports.VideoOverlay = VideoOverlay;
	exports.videoOverlay = videoOverlay;
	exports.SVGOverlay = SVGOverlay;
	exports.svgOverlay = svgOverlay;
	exports.DivOverlay = DivOverlay;
	exports.Popup = Popup;
	exports.popup = popup;
	exports.Tooltip = Tooltip;
	exports.tooltip = tooltip;
	exports.Icon = Icon;
	exports.icon = icon;
	exports.DivIcon = DivIcon;
	exports.divIcon = divIcon;
	exports.Marker = Marker;
	exports.marker = marker;
	exports.TileLayer = TileLayer;
	exports.tileLayer = tileLayer;
	exports.GridLayer = GridLayer;
	exports.gridLayer = gridLayer;
	exports.SVG = SVG;
	exports.svg = svg$1;
	exports.Renderer = Renderer;
	exports.Canvas = Canvas;
	exports.canvas = canvas$1;
	exports.Path = Path;
	exports.CircleMarker = CircleMarker;
	exports.circleMarker = circleMarker;
	exports.Circle = Circle;
	exports.circle = circle;
	exports.Polyline = Polyline;
	exports.polyline = polyline;
	exports.Polygon = Polygon;
	exports.polygon = polygon;
	exports.Rectangle = Rectangle;
	exports.rectangle = rectangle;
	exports.Map = Map;
	exports.map = createMap;

	var oldL = window.L;
	exports.noConflict = function() {
		window.L = oldL;
		return this;
	};

	// Always export us to window global (see #2364)
	window.L = exports;

	})));
	//# sourceMappingURL=leaflet-src.js.map
	});

	function parseLinearRing(linearRing) {
	  var children = linearRing.children;

	  if (Array.isArray(children)) {
	    return children.reduce(function (a, e) {
	      switch (e.name) {
	        case 'gml:coordinates':
	          a = a.concat(parseCoordinates(e));
	          break;
	      }

	      return a;
	    }, []);
	  } else {
	    return null;
	  }
	}

	function parseBoundary(outerBoundary) {
	  var children = outerBoundary.children;

	  if (Array.isArray(children)) {
	    return children.reduce(function (a, e) {
	      switch (e.name) {
	        case 'gml:LinearRing':
	          a = a.concat(parseLinearRing(e));
	          break;
	      }

	      return a;
	    }, []);
	  } else {
	    return null;
	  }
	}

	function parsePolygon(polygon) {
	  var children = polygon.children;

	  if (Array.isArray(children)) {
	    var coordinates = children.reduce(function (a, e) {
	      switch (e.name) {
	        case 'gml:outerBoundaryIs':
	          a.push(parseBoundary(e));
	          break;

	        case 'gml:innerBoundaryIs':
	          a.push(parseBoundary(e));
	          break;
	      }

	      return a;
	    }, []);
	    return {
	      type: 'Polygon',
	      coordinates: coordinates
	    };
	  } else {
	    return null;
	  }
	}

	function parsePolygonMember(polygon) {
	  var children = polygon.children;

	  if (Array.isArray(children) && children.length === 1) {
	    var _children = _slicedToArray(children, 1),
	        e = _children[0];

	    switch (e.name) {
	      case 'gml:Polygon':
	        return parsePolygon(e).coordinates;

	      default:
	        return null;
	    }
	  } else {
	    return null;
	  }
	}

	function parseMultiPolygon(multiPolygon) {
	  var children = multiPolygon.children;

	  if (Array.isArray(children)) {
	    var coordinates = children.reduce(function (a, e) {
	      switch (e.name) {
	        case 'gml:polygonMember':
	          a.push(parsePolygonMember(e));
	          break;
	      }

	      return a;
	    }, []);
	    return {
	      type: 'MultiPolygon',
	      coordinates: coordinates
	    };
	  } else {
	    return null;
	  }
	}

	function parseGeometry(geometry) {
	  var children = geometry.children;

	  if (Array.isArray(children) && children.length === 1) {
	    var _children2 = _slicedToArray(children, 1),
	        e = _children2[0];

	    switch (e.name) {
	      case 'gml:Polygon':
	        return parsePolygon(e);

	      case 'gml:MultiPolygon':
	        return parseMultiPolygon(e);

	      default:
	        return null;
	    }
	  } else {
	    return null;
	  }
	}

	var parseCoordinates = function parseCoordinates(coordinates) {
	  return coordinates.value.split(/\s+/g).filter(function (e) {
	    return e;
	  }).map(function (e) {
	    return e.split(',').map(function (v) {
	      return parseFloat(v);
	    });
	  });
	};

	function parseBox(box) {
	  var children = box.children;

	  if (Array.isArray(children)) {
	    var _children3 = _slicedToArray(children, 1),
	        e = _children3[0];

	    switch (e.name) {
	      case 'gml:coordinates':
	        return parseCoordinates(e).reduce(function (b, p) {
	          return b.concat(p);
	        }, []);

	      default:
	        return null;
	    }
	  } else {
	    return null;
	  }
	}

	function parseBoundedBy(boundedBy) {
	  var children = boundedBy.children;

	  if (Array.isArray(children) && children.length === 1) {
	    var _children4 = _slicedToArray(children, 1),
	        e = _children4[0];

	    switch (e.name) {
	      case 'gml:Box':
	        return parseBox(e);

	      default:
	        return null;
	    }
	  } else {
	    return null;
	  }
	}

	function parseFeature(feature) {
	  var name = feature.name,
	      children = feature.children;

	  if (Array.isArray(children)) {
	    return children.reduce(function (a, e) {
	      switch (e.name) {
	        case 'gml:boundedBy':
	          a.bbox = parseBoundedBy(e);
	          break;

	        case 'ms:msGeometry':
	          a.geometry = parseGeometry(e);
	          break;

	        case 'ms:id':
	        case 'ms:layer':
	        case 'ms:border_color':
	        case 'ms:body_fore_color':
	        case 'ms:body_back_color':
	        case 'ms:symbol':
	        case 'ms:angle':
	        case 'ms:size':
	        case 'ms:width':
	        case 'ms:border_width':
	          a.properties[e.name] = e.value;
	          break;
	      }

	      return a;
	    }, {
	      type: 'Feature',
	      properties: {
	        name: name
	      }
	    });
	  } else {
	    return null;
	  }
	}

	function parseFeatureMember(featureMember) {
	  var children = featureMember.children;

	  if (Array.isArray(children) && children.length === 1) {
	    var _children5 = _slicedToArray(children, 1),
	        e = _children5[0];

	    return parseFeature(e);
	  } else {
	    return null;
	  }
	}

	function parseGmx(gmx) {
	  var children = gmx.children;

	  if (Array.isArray(children)) {
	    return children.reduce(function (a, e) {
	      switch (e.name) {
	        case 'gmx:NAME':
	          a.properties.name = e.value;
	          break;

	        case 'gmx:wkb_geometry':
	          a.geometry = parseGeometry(e);
	          break;

	        default:
	          a.properties[e.name] = e.value;
	          break;
	      }

	      return a;
	    }, {
	      properties: {}
	    });
	  } else {
	    return null;
	  }
	}

	function parseWfsMember(wfsMember) {
	  var children = wfsMember.children,
	      localName = wfsMember.localName;

	  if (Array.isArray(children)) {
	    return children.reduce(function (a, e) {
	      return _objectSpread2({}, a, {}, parseGmx(e));
	    }, {
	      type: 'Feature',
	      properties: {
	        name: localName
	      }
	    });
	  } else {
	    return null;
	  }
	}

	function parseFeatures(featureCollection) {
	  var children = featureCollection.children;

	  if (Array.isArray(children)) {
	    return children.reduce(function (a, e) {
	      if (e.name === 'gml:featureMember') {
	        var f = parseFeatureMember(e);

	        if (f) {
	          a.features.push(f);
	        }
	      } else if (e.name === 'gml:boundedBy') {
	        a.bbox = parseBoundedBy(e);
	      } else if (e.name === 'wfs:member') {
	        a.features.push(parseWfsMember(e));
	      }

	      return a;
	    }, {
	      type: 'FeatureCollection',
	      features: []
	    });
	  } else {
	    return null;
	  }
	}

	var runtime_1 = createCommonjsModule(function (module) {
	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var runtime = (function (exports) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined$1; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  exports.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] =
	    GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  exports.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  exports.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      if (!(toStringTagSymbol in genFun)) {
	        genFun[toStringTagSymbol] = "GeneratorFunction";
	      }
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  exports.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return Promise.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return Promise.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration.
	          result.value = unwrapped;
	          resolve(result);
	        }, function(error) {
	          // If a rejected Promise was yielded, throw the rejection back
	          // into the async generator function so it can be handled there.
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new Promise(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	    return this;
	  };
	  exports.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  exports.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );

	    return exports.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      context.method = method;
	      context.arg = arg;

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }

	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;

	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }

	          context.dispatchException(context.arg);

	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }

	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined$1) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        // Note: ["return"] must be used for ES3 parsing compatibility.
	        if (delegate.iterator["return"]) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined$1;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }

	      return ContinueSentinel;
	    }

	    var record = tryCatch(method, delegate.iterator, context.arg);

	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    var info = record.arg;

	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;

	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;

	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined$1;
	      }

	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }

	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[toStringTagSymbol] = "Generator";

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  exports.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined$1;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  exports.values = values;

	  function doneResult() {
	    return { value: undefined$1, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined$1;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined$1;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined$1;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;

	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined$1;
	        }

	        return !! caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }

	      return this.complete(record);
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }

	      return ContinueSentinel;
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined$1;
	      }

	      return ContinueSentinel;
	    }
	  };

	  // Regardless of whether this script is executing as a CommonJS module
	  // or not, return the runtime object so that we can declare the variable
	  // regeneratorRuntime in the outer scope, which allows this module to be
	  // injected easily by `bin/regenerator --include-runtime script.js`.
	  return exports;

	}(
	  // If this script is executing as a CommonJS module, use module.exports
	  // as the regeneratorRuntime namespace. Otherwise create a new empty
	  // object. Either way, the resulting object will be used to initialize
	  // the regeneratorRuntime variable at the top of this file.
	   module.exports 
	));

	try {
	  regeneratorRuntime = runtime;
	} catch (accidentalStrictMode) {
	  // This module should not be running in strict mode, so the above
	  // assignment should always work unless something is misconfigured. Just
	  // in case runtime.js accidentally runs in strict mode, we can escape
	  // strict mode using a global Function call. This could conceivably fail
	  // if a Content Security Policy forbids using Function, but in that case
	  // the proper solution is to fix the accidental strict mode problem. If
	  // you've misconfigured your bundler to force strict mode and applied a
	  // CSP to forbid Function, and you're not willing to fix either of those
	  // problems, please detail your unique predicament in a GitHub issue.
	  Function("r", "regeneratorRuntime = r")(runtime);
	}
	});

	var support = {
	  searchParams: 'URLSearchParams' in self,
	  iterable: 'Symbol' in self && 'iterator' in Symbol,
	  blob:
	    'FileReader' in self &&
	    'Blob' in self &&
	    (function() {
	      try {
	        new Blob();
	        return true
	      } catch (e) {
	        return false
	      }
	    })(),
	  formData: 'FormData' in self,
	  arrayBuffer: 'ArrayBuffer' in self
	};

	function isDataView(obj) {
	  return obj && DataView.prototype.isPrototypeOf(obj)
	}

	if (support.arrayBuffer) {
	  var viewClasses = [
	    '[object Int8Array]',
	    '[object Uint8Array]',
	    '[object Uint8ClampedArray]',
	    '[object Int16Array]',
	    '[object Uint16Array]',
	    '[object Int32Array]',
	    '[object Uint32Array]',
	    '[object Float32Array]',
	    '[object Float64Array]'
	  ];

	  var isArrayBufferView =
	    ArrayBuffer.isView ||
	    function(obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	    };
	}

	function normalizeName(name) {
	  if (typeof name !== 'string') {
	    name = String(name);
	  }
	  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
	    throw new TypeError('Invalid character in header field name')
	  }
	  return name.toLowerCase()
	}

	function normalizeValue(value) {
	  if (typeof value !== 'string') {
	    value = String(value);
	  }
	  return value
	}

	// Build a destructive iterator for the value list
	function iteratorFor(items) {
	  var iterator = {
	    next: function() {
	      var value = items.shift();
	      return {done: value === undefined, value: value}
	    }
	  };

	  if (support.iterable) {
	    iterator[Symbol.iterator] = function() {
	      return iterator
	    };
	  }

	  return iterator
	}

	function Headers$1(headers) {
	  this.map = {};

	  if (headers instanceof Headers$1) {
	    headers.forEach(function(value, name) {
	      this.append(name, value);
	    }, this);
	  } else if (Array.isArray(headers)) {
	    headers.forEach(function(header) {
	      this.append(header[0], header[1]);
	    }, this);
	  } else if (headers) {
	    Object.getOwnPropertyNames(headers).forEach(function(name) {
	      this.append(name, headers[name]);
	    }, this);
	  }
	}

	Headers$1.prototype.append = function(name, value) {
	  name = normalizeName(name);
	  value = normalizeValue(value);
	  var oldValue = this.map[name];
	  this.map[name] = oldValue ? oldValue + ', ' + value : value;
	};

	Headers$1.prototype['delete'] = function(name) {
	  delete this.map[normalizeName(name)];
	};

	Headers$1.prototype.get = function(name) {
	  name = normalizeName(name);
	  return this.has(name) ? this.map[name] : null
	};

	Headers$1.prototype.has = function(name) {
	  return this.map.hasOwnProperty(normalizeName(name))
	};

	Headers$1.prototype.set = function(name, value) {
	  this.map[normalizeName(name)] = normalizeValue(value);
	};

	Headers$1.prototype.forEach = function(callback, thisArg) {
	  for (var name in this.map) {
	    if (this.map.hasOwnProperty(name)) {
	      callback.call(thisArg, this.map[name], name, this);
	    }
	  }
	};

	Headers$1.prototype.keys = function() {
	  var items = [];
	  this.forEach(function(value, name) {
	    items.push(name);
	  });
	  return iteratorFor(items)
	};

	Headers$1.prototype.values = function() {
	  var items = [];
	  this.forEach(function(value) {
	    items.push(value);
	  });
	  return iteratorFor(items)
	};

	Headers$1.prototype.entries = function() {
	  var items = [];
	  this.forEach(function(value, name) {
	    items.push([name, value]);
	  });
	  return iteratorFor(items)
	};

	if (support.iterable) {
	  Headers$1.prototype[Symbol.iterator] = Headers$1.prototype.entries;
	}

	function consumed(body) {
	  if (body.bodyUsed) {
	    return Promise.reject(new TypeError('Already read'))
	  }
	  body.bodyUsed = true;
	}

	function fileReaderReady(reader) {
	  return new Promise(function(resolve, reject) {
	    reader.onload = function() {
	      resolve(reader.result);
	    };
	    reader.onerror = function() {
	      reject(reader.error);
	    };
	  })
	}

	function readBlobAsArrayBuffer(blob) {
	  var reader = new FileReader();
	  var promise = fileReaderReady(reader);
	  reader.readAsArrayBuffer(blob);
	  return promise
	}

	function readBlobAsText(blob) {
	  var reader = new FileReader();
	  var promise = fileReaderReady(reader);
	  reader.readAsText(blob);
	  return promise
	}

	function readArrayBufferAsText(buf) {
	  var view = new Uint8Array(buf);
	  var chars = new Array(view.length);

	  for (var i = 0; i < view.length; i++) {
	    chars[i] = String.fromCharCode(view[i]);
	  }
	  return chars.join('')
	}

	function bufferClone(buf) {
	  if (buf.slice) {
	    return buf.slice(0)
	  } else {
	    var view = new Uint8Array(buf.byteLength);
	    view.set(new Uint8Array(buf));
	    return view.buffer
	  }
	}

	function Body() {
	  this.bodyUsed = false;

	  this._initBody = function(body) {
	    this._bodyInit = body;
	    if (!body) {
	      this._bodyText = '';
	    } else if (typeof body === 'string') {
	      this._bodyText = body;
	    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	      this._bodyBlob = body;
	    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	      this._bodyFormData = body;
	    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	      this._bodyText = body.toString();
	    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	      this._bodyArrayBuffer = bufferClone(body.buffer);
	      // IE 10-11 can't handle a DataView body.
	      this._bodyInit = new Blob([this._bodyArrayBuffer]);
	    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	      this._bodyArrayBuffer = bufferClone(body);
	    } else {
	      this._bodyText = body = Object.prototype.toString.call(body);
	    }

	    if (!this.headers.get('content-type')) {
	      if (typeof body === 'string') {
	        this.headers.set('content-type', 'text/plain;charset=UTF-8');
	      } else if (this._bodyBlob && this._bodyBlob.type) {
	        this.headers.set('content-type', this._bodyBlob.type);
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	      }
	    }
	  };

	  if (support.blob) {
	    this.blob = function() {
	      var rejected = consumed(this);
	      if (rejected) {
	        return rejected
	      }

	      if (this._bodyBlob) {
	        return Promise.resolve(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as blob')
	      } else {
	        return Promise.resolve(new Blob([this._bodyText]))
	      }
	    };

	    this.arrayBuffer = function() {
	      if (this._bodyArrayBuffer) {
	        return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
	      } else {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }
	    };
	  }

	  this.text = function() {
	    var rejected = consumed(this);
	    if (rejected) {
	      return rejected
	    }

	    if (this._bodyBlob) {
	      return readBlobAsText(this._bodyBlob)
	    } else if (this._bodyArrayBuffer) {
	      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	    } else if (this._bodyFormData) {
	      throw new Error('could not read FormData body as text')
	    } else {
	      return Promise.resolve(this._bodyText)
	    }
	  };

	  if (support.formData) {
	    this.formData = function() {
	      return this.text().then(decode)
	    };
	  }

	  this.json = function() {
	    return this.text().then(JSON.parse)
	  };

	  return this
	}

	// HTTP methods whose capitalization should be normalized
	var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

	function normalizeMethod(method) {
	  var upcased = method.toUpperCase();
	  return methods.indexOf(upcased) > -1 ? upcased : method
	}

	function Request(input, options) {
	  options = options || {};
	  var body = options.body;

	  if (input instanceof Request) {
	    if (input.bodyUsed) {
	      throw new TypeError('Already read')
	    }
	    this.url = input.url;
	    this.credentials = input.credentials;
	    if (!options.headers) {
	      this.headers = new Headers$1(input.headers);
	    }
	    this.method = input.method;
	    this.mode = input.mode;
	    this.signal = input.signal;
	    if (!body && input._bodyInit != null) {
	      body = input._bodyInit;
	      input.bodyUsed = true;
	    }
	  } else {
	    this.url = String(input);
	  }

	  this.credentials = options.credentials || this.credentials || 'same-origin';
	  if (options.headers || !this.headers) {
	    this.headers = new Headers$1(options.headers);
	  }
	  this.method = normalizeMethod(options.method || this.method || 'GET');
	  this.mode = options.mode || this.mode || null;
	  this.signal = options.signal || this.signal;
	  this.referrer = null;

	  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	    throw new TypeError('Body not allowed for GET or HEAD requests')
	  }
	  this._initBody(body);
	}

	Request.prototype.clone = function() {
	  return new Request(this, {body: this._bodyInit})
	};

	function decode(body) {
	  var form = new FormData();
	  body
	    .trim()
	    .split('&')
	    .forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=');
	        var name = split.shift().replace(/\+/g, ' ');
	        var value = split.join('=').replace(/\+/g, ' ');
	        form.append(decodeURIComponent(name), decodeURIComponent(value));
	      }
	    });
	  return form
	}

	function parseHeaders(rawHeaders) {
	  var headers = new Headers$1();
	  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
	  // https://tools.ietf.org/html/rfc7230#section-3.2
	  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
	  preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
	    var parts = line.split(':');
	    var key = parts.shift().trim();
	    if (key) {
	      var value = parts.join(':').trim();
	      headers.append(key, value);
	    }
	  });
	  return headers
	}

	Body.call(Request.prototype);

	function Response(bodyInit, options) {
	  if (!options) {
	    options = {};
	  }

	  this.type = 'default';
	  this.status = options.status === undefined ? 200 : options.status;
	  this.ok = this.status >= 200 && this.status < 300;
	  this.statusText = 'statusText' in options ? options.statusText : 'OK';
	  this.headers = new Headers$1(options.headers);
	  this.url = options.url || '';
	  this._initBody(bodyInit);
	}

	Body.call(Response.prototype);

	Response.prototype.clone = function() {
	  return new Response(this._bodyInit, {
	    status: this.status,
	    statusText: this.statusText,
	    headers: new Headers$1(this.headers),
	    url: this.url
	  })
	};

	Response.error = function() {
	  var response = new Response(null, {status: 0, statusText: ''});
	  response.type = 'error';
	  return response
	};

	var redirectStatuses = [301, 302, 303, 307, 308];

	Response.redirect = function(url, status) {
	  if (redirectStatuses.indexOf(status) === -1) {
	    throw new RangeError('Invalid status code')
	  }

	  return new Response(null, {status: status, headers: {location: url}})
	};

	var DOMException = self.DOMException;
	try {
	  new DOMException();
	} catch (err) {
	  DOMException = function(message, name) {
	    this.message = message;
	    this.name = name;
	    var error = Error(message);
	    this.stack = error.stack;
	  };
	  DOMException.prototype = Object.create(Error.prototype);
	  DOMException.prototype.constructor = DOMException;
	}

	function fetch(input, init) {
	  return new Promise(function(resolve, reject) {
	    var request = new Request(input, init);

	    if (request.signal && request.signal.aborted) {
	      return reject(new DOMException('Aborted', 'AbortError'))
	    }

	    var xhr = new XMLHttpRequest();

	    function abortXhr() {
	      xhr.abort();
	    }

	    xhr.onload = function() {
	      var options = {
	        status: xhr.status,
	        statusText: xhr.statusText,
	        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	      };
	      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
	      var body = 'response' in xhr ? xhr.response : xhr.responseText;
	      resolve(new Response(body, options));
	    };

	    xhr.onerror = function() {
	      reject(new TypeError('Network request failed'));
	    };

	    xhr.ontimeout = function() {
	      reject(new TypeError('Network request failed'));
	    };

	    xhr.onabort = function() {
	      reject(new DOMException('Aborted', 'AbortError'));
	    };

	    xhr.open(request.method, request.url, true);

	    if (request.credentials === 'include') {
	      xhr.withCredentials = true;
	    } else if (request.credentials === 'omit') {
	      xhr.withCredentials = false;
	    }

	    if ('responseType' in xhr && support.blob) {
	      xhr.responseType = 'blob';
	    }

	    request.headers.forEach(function(value, name) {
	      xhr.setRequestHeader(name, value);
	    });

	    if (request.signal) {
	      request.signal.addEventListener('abort', abortXhr);

	      xhr.onreadystatechange = function() {
	        // DONE (success or failure)
	        if (xhr.readyState === 4) {
	          request.signal.removeEventListener('abort', abortXhr);
	        }
	      };
	    }

	    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	  })
	}

	fetch.polyfill = true;

	if (!self.fetch) {
	  self.fetch = fetch;
	  self.Headers = Headers$1;
	  self.Request = Request;
	  self.Response = Response;
	}

	/**
	 *
	 *
	 * @author Jerry Bendy <jerry@icewingcc.com>
	 * @licence MIT
	 *
	 */

	(function(self) {

	    var nativeURLSearchParams = (self.URLSearchParams && self.URLSearchParams.prototype.get) ? self.URLSearchParams : null,
	        isSupportObjectConstructor = nativeURLSearchParams && (new nativeURLSearchParams({a: 1})).toString() === 'a=1',
	        // There is a bug in safari 10.1 (and earlier) that incorrectly decodes `%2B` as an empty space and not a plus.
	        decodesPlusesCorrectly = nativeURLSearchParams && (new nativeURLSearchParams('s=%2B').get('s') === '+'),
	        __URLSearchParams__ = "__URLSearchParams__",
	        // Fix bug in Edge which cannot encode ' &' correctly
	        encodesAmpersandsCorrectly = nativeURLSearchParams ? (function() {
	            var ampersandTest = new nativeURLSearchParams();
	            ampersandTest.append('s', ' &');
	            return ampersandTest.toString() === 's=+%26';
	        })() : true,
	        prototype = URLSearchParamsPolyfill.prototype,
	        iterable = !!(self.Symbol && self.Symbol.iterator);

	    if (nativeURLSearchParams && isSupportObjectConstructor && decodesPlusesCorrectly && encodesAmpersandsCorrectly) {
	        return;
	    }


	    /**
	     * Make a URLSearchParams instance
	     *
	     * @param {object|string|URLSearchParams} search
	     * @constructor
	     */
	    function URLSearchParamsPolyfill(search) {
	        search = search || "";

	        // support construct object with another URLSearchParams instance
	        if (search instanceof URLSearchParams || search instanceof URLSearchParamsPolyfill) {
	            search = search.toString();
	        }
	        this [__URLSearchParams__] = parseToDict(search);
	    }


	    /**
	     * Appends a specified key/value pair as a new search parameter.
	     *
	     * @param {string} name
	     * @param {string} value
	     */
	    prototype.append = function(name, value) {
	        appendTo(this [__URLSearchParams__], name, value);
	    };

	    /**
	     * Deletes the given search parameter, and its associated value,
	     * from the list of all search parameters.
	     *
	     * @param {string} name
	     */
	    prototype['delete'] = function(name) {
	        delete this [__URLSearchParams__] [name];
	    };

	    /**
	     * Returns the first value associated to the given search parameter.
	     *
	     * @param {string} name
	     * @returns {string|null}
	     */
	    prototype.get = function(name) {
	        var dict = this [__URLSearchParams__];
	        return this.has(name) ? dict[name][0] : null;
	    };

	    /**
	     * Returns all the values association with a given search parameter.
	     *
	     * @param {string} name
	     * @returns {Array}
	     */
	    prototype.getAll = function(name) {
	        var dict = this [__URLSearchParams__];
	        return this.has(name) ? dict [name].slice(0) : [];
	    };

	    /**
	     * Returns a Boolean indicating if such a search parameter exists.
	     *
	     * @param {string} name
	     * @returns {boolean}
	     */
	    prototype.has = function(name) {
	        return hasOwnProperty(this [__URLSearchParams__], name);
	    };

	    /**
	     * Sets the value associated to a given search parameter to
	     * the given value. If there were several values, delete the
	     * others.
	     *
	     * @param {string} name
	     * @param {string} value
	     */
	    prototype.set = function set(name, value) {
	        this [__URLSearchParams__][name] = ['' + value];
	    };

	    /**
	     * Returns a string containg a query string suitable for use in a URL.
	     *
	     * @returns {string}
	     */
	    prototype.toString = function() {
	        var dict = this[__URLSearchParams__], query = [], i, key, name, value;
	        for (key in dict) {
	            name = encode(key);
	            for (i = 0, value = dict[key]; i < value.length; i++) {
	                query.push(name + '=' + encode(value[i]));
	            }
	        }
	        return query.join('&');
	    };

	    // There is a bug in Safari 10.1 and `Proxy`ing it is not enough.
	    var forSureUsePolyfill = !decodesPlusesCorrectly;
	    var useProxy = (!forSureUsePolyfill && nativeURLSearchParams && !isSupportObjectConstructor && self.Proxy);
	    /*
	     * Apply polifill to global object and append other prototype into it
	     */
	    Object.defineProperty(self, 'URLSearchParams', {
	        value: (useProxy ?
	            // Safari 10.0 doesn't support Proxy, so it won't extend URLSearchParams on safari 10.0
	            new Proxy(nativeURLSearchParams, {
	                construct: function(target, args) {
	                    return new target((new URLSearchParamsPolyfill(args[0]).toString()));
	                }
	            }) :
	            URLSearchParamsPolyfill)
	    });

	    var USPProto = self.URLSearchParams.prototype;

	    USPProto.polyfill = true;

	    /**
	     *
	     * @param {function} callback
	     * @param {object} thisArg
	     */
	    USPProto.forEach = USPProto.forEach || function(callback, thisArg) {
	        var dict = parseToDict(this.toString());
	        Object.getOwnPropertyNames(dict).forEach(function(name) {
	            dict[name].forEach(function(value) {
	                callback.call(thisArg, value, name, this);
	            }, this);
	        }, this);
	    };

	    /**
	     * Sort all name-value pairs
	     */
	    USPProto.sort = USPProto.sort || function() {
	        var dict = parseToDict(this.toString()), keys = [], k, i, j;
	        for (k in dict) {
	            keys.push(k);
	        }
	        keys.sort();

	        for (i = 0; i < keys.length; i++) {
	            this['delete'](keys[i]);
	        }
	        for (i = 0; i < keys.length; i++) {
	            var key = keys[i], values = dict[key];
	            for (j = 0; j < values.length; j++) {
	                this.append(key, values[j]);
	            }
	        }
	    };

	    /**
	     * Returns an iterator allowing to go through all keys of
	     * the key/value pairs contained in this object.
	     *
	     * @returns {function}
	     */
	    USPProto.keys = USPProto.keys || function() {
	        var items = [];
	        this.forEach(function(item, name) {
	            items.push(name);
	        });
	        return makeIterator(items);
	    };

	    /**
	     * Returns an iterator allowing to go through all values of
	     * the key/value pairs contained in this object.
	     *
	     * @returns {function}
	     */
	    USPProto.values = USPProto.values || function() {
	        var items = [];
	        this.forEach(function(item) {
	            items.push(item);
	        });
	        return makeIterator(items);
	    };

	    /**
	     * Returns an iterator allowing to go through all key/value
	     * pairs contained in this object.
	     *
	     * @returns {function}
	     */
	    USPProto.entries = USPProto.entries || function() {
	        var items = [];
	        this.forEach(function(item, name) {
	            items.push([name, item]);
	        });
	        return makeIterator(items);
	    };


	    if (iterable) {
	        USPProto[self.Symbol.iterator] = USPProto[self.Symbol.iterator] || USPProto.entries;
	    }


	    function encode(str) {
	        var replace = {
	            '!': '%21',
	            "'": '%27',
	            '(': '%28',
	            ')': '%29',
	            '~': '%7E',
	            '%20': '+',
	            '%00': '\x00'
	        };
	        return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function(match) {
	            return replace[match];
	        });
	    }

	    function decode(str) {
	        return str
	            .replace(/[ +]/g, '%20')
	            .replace(/(%[a-f0-9]{2})+/ig, function(match) {
	                return decodeURIComponent(match);
	            });
	    }

	    function makeIterator(arr) {
	        var iterator = {
	            next: function() {
	                var value = arr.shift();
	                return {done: value === undefined, value: value};
	            }
	        };

	        if (iterable) {
	            iterator[self.Symbol.iterator] = function() {
	                return iterator;
	            };
	        }

	        return iterator;
	    }

	    function parseToDict(search) {
	        var dict = {};

	        if (typeof search === "object") {
	            // if `search` is an array, treat it as a sequence
	            if (isArray(search)) {
	                for (var i = 0; i < search.length; i++) {
	                    var item = search[i];
	                    if (isArray(item) && item.length === 2) {
	                        appendTo(dict, item[0], item[1]);
	                    } else {
	                        throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");
	                    }
	                }

	            } else {
	                for (var key in search) {
	                    if (search.hasOwnProperty(key)) {
	                        appendTo(dict, key, search[key]);
	                    }
	                }
	            }

	        } else {
	            // remove first '?'
	            if (search.indexOf("?") === 0) {
	                search = search.slice(1);
	            }

	            var pairs = search.split("&");
	            for (var j = 0; j < pairs.length; j++) {
	                var value = pairs [j],
	                    index = value.indexOf('=');

	                if (-1 < index) {
	                    appendTo(dict, decode(value.slice(0, index)), decode(value.slice(index + 1)));

	                } else {
	                    if (value) {
	                        appendTo(dict, decode(value), '');
	                    }
	                }
	            }
	        }

	        return dict;
	    }

	    function appendTo(dict, name, value) {
	        var val = typeof value === 'string' ? value : (
	            value !== null && value !== undefined && typeof value.toString === 'function' ? value.toString() : JSON.stringify(value)
	        );

	        // #47 Prevent using `hasOwnProperty` as a property name
	        if (hasOwnProperty(dict, name)) {
	            dict[name].push(val);
	        } else {
	            dict[name] = [val];
	        }
	    }

	    function isArray(val) {
	        return !!val && '[object Array]' === Object.prototype.toString.call(val);
	    }

	    function hasOwnProperty(obj, prop) {
	        return Object.prototype.hasOwnProperty.call(obj, prop);
	    }

	})(typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : (typeof window !== 'undefined' ? window : commonjsGlobal));

	function create_fragment$5(ctx) {
	  var div2;
	  var div0;
	  var button0;
	  var t1;
	  var button1;
	  var t3;
	  var div1;
	  var dispose;
	  return {
	    c: function c() {
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
	    m: function m(target, anchor) {
	      insert(target, div2, anchor);
	      append(div2, div0);
	      append(div0, button0);
	      append(div0, t1);
	      append(div0, button1);
	      /*div0_binding*/

	      ctx[17](div0);
	      append(div2, t3);
	      append(div2, div1);
	      /*div1_binding*/

	      ctx[18](div1);
	      dispose = [listen(button0, "click", stop_propagation(
	      /*getwfs*/
	      ctx[2])), listen(button1, "click", stop_propagation(
	      /*getwms*/
	      ctx[3]))];
	    },
	    p: noop,
	    i: noop,
	    o: noop,
	    d: function d(detaching) {
	      if (detaching) detach(div2);
	      /*div0_binding*/

	      ctx[17](null);
	      /*div1_binding*/

	      ctx[18](null);
	      run_all(dispose);
	    }
	  };
	}

	function getScale(z) {
	  return Math.pow(2, -z) * 156543.033928041;
	}

	function instance$5($$self, $$props, $$invalidate) {
	  var translate = scanexTranslations_cjs.getText.bind(scanexTranslations_cjs);
	  var dispatch = createEventDispatcher();
	  scanexTranslations_cjs.addText("eng", {
	    link: {
	      wfs: "Add WFS link",
	      wms: "Add WMS link"
	    }
	  });
	  scanexTranslations_cjs.addText("rus", {
	    link: {
	      wfs: "Добавить ссылку на WFS-сервис",
	      wms: "Добавить ссылку на WMS-сервис"
	    }
	  });
	  var linksContainer;
	  var links = {};
	  var map = $$props.map;

	  function closeLink(url) {
	    var u = "".concat(url.origin).concat(url.pathname);
	    var link = links[u];

	    if (link) {
	      Object.keys(link).forEach(function (k) {
	        var layer = link[k].layer;

	        if (layer) {
	          layer.remove();
	        }
	      });
	      delete links[u];
	    }
	  }

	  var renderer = leafletSrc.canvas();

	  function createFeature(feature) {
	    try {
	      var geometry = feature.geometry,
	          properties = feature.properties;
	      var layer = leafletSrc.geoJSON(feature, {
	        style: function style(x) {
	          return {
	            color: properties["ms:border_color"],
	            fillColor: properties["body_back_color"],
	            weight: properties["ms:border_width"]
	          };
	        },
	        renderer: renderer
	      });
	      return layer;
	    } catch (e) {
	      console.log(e);
	      return null;
	    }
	  }

	  function drawFeatures(data) {
	    if (data.name === "wfs:FeatureCollection") {
	      var featureCollection = parseFeatures(data);

	      if (featureCollection) {
	        var features = featureCollection.features,
	            bbox = featureCollection.bbox;
	        var layers = features.map(function (f) {
	          return createFeature(f);
	        }).filter(function (e) {
	          return e;
	        });
	        var fg = leafletSrc.featureGroup(layers).bindPopup(function (_ref) {
	          var properties = _ref.feature.properties;
	          return "<table class=\"scanex-svc-view-attr\">\n                            <tr>\n                                <td>name:</td>\n                                <td>".concat(properties["name"], "</td>\n                            </tr>\n                            <tr>\n                                <td>ms:id:</td>\n                                <td>").concat(properties["ms:id"], "</td>\n                            </tr>\n                            <tr>\n                                <td>ms:layer:</td>\n                                <td>").concat(properties["ms:layer"], "</td>\n                            </tr>\n                        </table");
	        }).addTo(map);
	        return fg;
	      }
	    } else {
	      return [];
	    }
	  }

	  function getFeature(name, visible, url) {
	    return new Promise(function (resolve, reject) {
	      if (map) {
	        var u = "".concat(url.origin).concat(url.pathname);
	        var link = links[u];

	        if (visible) {
	          if (link && link[name]) {
	            var layer = link[name].layer;

	            if (layer && !link[name].visible) {
	              layer.addTo(map);
	              var bounds = layer.getBounds();
	              map.fitBounds(bounds);
	              links[u][name].visible = true;
	            }

	            resolve();
	          } else {
	            if (url.searchParams.has("request")) {
	              url.searchParams.set("request", "GetFeature");
	            } else {
	              url.searchParams.append("request", "GetFeature");
	            }

	            if (url.searchParams.has("service")) {
	              url.searchParams.set("service", "WFS");
	            } else {
	              url.searchParams.append("service", "WFS");
	            }

	            if (url.searchParams.has("typeName")) {
	              url.searchParams.set("typeName", name);
	            } else {
	              url.searchParams.append("typeName", name);
	            }

	            if (url.searchParams.has("version")) {
	              url.searchParams.set("version", "1.0.0");
	            } else {
	              url.searchParams.append("version", "1.0.0");
	            }

	            getxml(url.toString()).then(function (data) {
	              var featureCollection = parse(data);
	              var layer = drawFeatures(featureCollection);
	              var bounds = layer.getBounds();
	              map.fitBounds(bounds);
	              links[u] = links[u] || {};
	              links[u][name] = {
	                data: data,
	                layer: layer,
	                visible: true
	              };
	              resolve();
	            }).catch(function (e) {
	              reject(e);
	            });
	          }
	        } else if (link && link[name]) {
	          var _layer = link[name].layer;

	          if (_layer) {
	            _layer.remove();

	            links[u][name].visible = false;
	          }

	          resolve();
	        }
	      } else {
	        reject(new Error("map not defined"));
	      }
	    });
	  } // function getFeatureInfo (name, visible, url, width, height, crs) {
	  //     return new Promise((resolve, reject) => {
	  //         if (map) {            
	  //             const u = `${url.origin}${url.pathname}`;
	  //             const link = links[u];
	  //             if (visible) {                
	  //                 if (link && link[name]) {                    
	  //                     const {layer} = link[name];
	  //                     if (layer && !link[name].visible) {
	  //                         layer.addTo(map);
	  //                         const bounds = layer.getBounds();
	  //                         map.fitBounds(bounds);
	  //                         links[u][name].visible = true;
	  //                     }
	  //                     resolve();
	  //                 }
	  //                 else {                    
	  //                     if(url.searchParams.has('request')) {
	  //                         url.searchParams.set('request', 'GetFeatureInfo');
	  //                     }
	  //                     else {                        
	  //                         url.searchParams.append('request', 'GetFeatureInfo');
	  //                     }
	  //                     if (url.searchParams.has('service')) {
	  //                         url.searchParams.set('service', 'WMS');
	  //                     }
	  //                     else {
	  //                         url.searchParams.append('service', 'WMS');
	  //                     }
	  //                     if (url.searchParams.has('layers')) {
	  //                         url.searchParams.set('layers', name);
	  //                     }
	  //                     else {
	  //                         url.searchParams.append('layers', name);
	  //                     }
	  //                     if (url.searchParams.has('query_layers')) {
	  //                         url.searchParams.set('query_layers', name);
	  //                     }
	  //                     else {
	  //                         url.searchParams.append('query_layers', name);
	  //                     }
	  //                     if (url.searchParams.has('version')) {
	  //                         url.searchParams.set('version', '1.3.0');
	  //                     }
	  //                     else {
	  //                         url.searchParams.append('version', '1.3.0');
	  //                     }
	  //                     if (url.searchParams.has('info_format')) {
	  //                         url.searchParams.set('info_format', 'JSON');
	  //                     }
	  //                     else {
	  //                         url.searchParams.append('info_format', 'JSON');
	  //                     }
	  //                     if (url.searchParams.has('i')) {
	  //                         url.searchParams.set('i', '0');
	  //                     }
	  //                     else {
	  //                         url.searchParams.append('i', '0');
	  //                     }
	  //                     if (url.searchParams.has('j')) {
	  //                         url.searchParams.set('j', '0');
	  //                     }
	  //                     else {
	  //                         url.searchParams.append('j', '0');
	  //                     }
	  //                     if (url.searchParams.has('width')) {
	  //                         url.searchParams.set('width', width);
	  //                     }
	  //                     else {
	  //                         url.searchParams.append('width', width);
	  //                     }
	  //                     if (url.searchParams.has('height')) {
	  //                         url.searchParams.set('height', height);
	  //                     }
	  //                     else {
	  //                         url.searchParams.append('height', height);
	  //                     }
	  //                     if (url.searchParams.has('crs')) {
	  //                         url.searchParams.set('crs', 'EPSG:3857');
	  //                     }
	  //                     else {
	  //                         url.searchParams.append('crs', 'EPSG:3857');
	  //                     }
	  //                     getxml(url.toString())
	  //                     .then(data => {
	  //                         const featureCollection = xml2json(data);
	  //                         // const layer = drawFeatures(featureCollection);
	  //                         // const bounds = layer.getBounds();
	  //                         // map.fitBounds(bounds);
	  //                         // links[u] = links[u] || {};
	  //                         // links[u][name] = { data, layer, visible: true };
	  //                         resolve();
	  //                     })
	  //                     .catch(e => {
	  //                         reject(e);
	  //                     });                        
	  //                 }                
	  //             }
	  //             else if (link && link[name]) {                
	  //                 const {layer} = link[name];
	  //                 if (layer) {
	  //                     layer.remove();
	  //                     links[u][name].visible = false;
	  //                 }
	  //                 resolve();
	  //             }                
	  //         }
	  //         else {
	  //             reject(new Error('map not defined'));
	  //         }
	  //     });  
	  // }


	  function getMap(_ref2) {
	    var name = _ref2.name,
	        bbox = _ref2.bbox,
	        visible = _ref2.visible,
	        url = _ref2.url;

	    if (map) {
	      var u = "".concat(url.origin).concat(url.pathname);
	      var link = links[u];

	      if (visible) {
	        if (link && link[name]) {
	          var layer = link[name].layer;

	          if (layer && !link[name].visible) {
	            layer.addTo(map);
	            links[u][name].visible = true;
	            map.fitBounds([[bbox.maxy, bbox.minx], [bbox.miny, bbox.maxx]]);
	          }
	        } else {
	          var bs = map.getBounds();
	          var miny = Math.max(bs.getSouth(), -90);
	          var maxy = Math.min(bs.getNorth(), 90);
	          var minx = Math.max(bs.getWest(), -180);
	          var maxx = Math.min(bs.getEast(), 180);

	          if (bbox) {
	            minx = Math.min(bbox.minx, minx);
	            miny = Math.min(bbox.miny, miny);
	            maxx = Math.max(bbox.maxx, maxx);
	            maxy = Math.max(bbox.maxy, maxy);
	            if (minx >= maxx || miny >= maxy) return;
	          }

	          var mercMin = leafletSrc.Projection.Mercator.project({
	            lat: miny,
	            lng: minx
	          });
	          var mercMax = leafletSrc.Projection.Mercator.project({
	            lat: maxy,
	            lng: maxx
	          });
	          var scale = getScale(map.getZoom());
	          var width = Math.round((mercMax.x - mercMin.x) / scale);
	          var height = Math.round((mercMax.y - mercMin.y) / scale);

	          if (url.searchParams.has("request")) {
	            url.searchParams.delete("request");
	          }

	          if (url.searchParams.has("service")) {
	            url.searchParams.delete("service");
	          }

	          if (url.searchParams.has("version")) {
	            url.searchParams.delete("version");
	          }

	          var _layer2 = leafletSrc.tileLayer.wms("".concat(serviceProxy, "?").concat(encodeURIComponent(url.toString())), {
	            layers: name,
	            styles: "",
	            width: width,
	            height: height,
	            format: "image/png",
	            transparent: true,
	            attribution: ""
	          });

	          _layer2.addTo(map);

	          map.fitBounds([[bbox.maxy, bbox.minx], [bbox.miny, bbox.maxx]]);
	          links[u] = links[u] || {};
	          links[u][name] = {
	            layer: _layer2,
	            visible: visible
	          };
	        }
	      } else if (link && link[name]) {
	        var _link$name = link[name],
	            _layer3 = _link$name.layer,
	            _visible = _link$name.visible;

	        if (_layer3 && _visible) {
	          _layer3.remove();

	          links[u][name].visible = false;
	        }
	      }
	    }
	  }

	  function addwfs(value) {
	    return new Promise(function (resolve, reject) {
	      var url = new URL(value);

	      if (url.searchParams.has("service")) {
	        url.searchParams.set("service", "WFS");
	      } else {
	        url.searchParams.append("service", "WFS");
	      }

	      if (url.searchParams.has("request")) {
	        url.searchParams.set("request", "GetCapabilities");
	      } else {
	        url.searchParams.append("request", "GetCapabilities");
	      }

	      if (!url.searchParams.has("version")) {
	        url.searchParams.append("version", "1.3.0");
	      }

	      var u = url.toString();
	      getxml(u).then(function (data) {
	        var featureCollection = parse(data);

	        var _toFeatures = toFeatures(featureCollection),
	            title = _toFeatures.title,
	            features = _toFeatures.features;

	        var lnk = new WFS({
	          target: linksContainer,
	          props: {
	            features: features,
	            title: title
	          }
	        });
	        lnk.$on("close", function () {
	          lnk.$destroy();
	          closeLink(url);
	        });
	        lnk.$on("change:visible", function (_ref3) {
	          var detail = _ref3.detail;
	          var name = detail.name,
	              visible = detail.visible;
	          dispatch("request:start");
	          getFeature(name, visible, url).then(function () {
	            return dispatch("request:end");
	          }).catch(function (e) {
	            return dispatch("request:error");
	          });
	        });
	        resolve();
	      }).catch(function (e) {
	        return reject(e);
	      });
	    });
	  }

	  function addwms(value) {
	    return new Promise(function (resolve, reject) {
	      var url = new URL(value);

	      if (!url.searchParams.has("service")) {
	        url.searchParams.append("service", "WMS");
	      }

	      if (!url.searchParams.has("request")) {
	        url.searchParams.append("request", "GetCapabilities");
	      }

	      if (!url.searchParams.has("version")) {
	        url.searchParams.append("version", "1.3.0");
	      }

	      getxml(url.toString()).then(function (data) {
	        var layerCollection = parse(data);

	        var _toLayers = toLayers(layerCollection),
	            title = _toLayers.title,
	            layers = _toLayers.layers;

	        var lnk = new WMS({
	          target: linksContainer,
	          props: {
	            layers: layers,
	            title: title
	          }
	        });
	        lnk.$on("close", function () {
	          lnk.$destroy();
	          closeLink(url);
	        });
	        lnk.$on("change:visible", function (_ref4) {
	          var detail = _ref4.detail;
	          var name = detail.name,
	              visible = detail.visible,
	              exGeographicBoundingBox = detail.exGeographicBoundingBox,
	              crs = detail.crs;

	          if (exGeographicBoundingBox) {
	            var eastBoundLongitude = exGeographicBoundingBox.eastBoundLongitude,
	                northBoundLatitude = exGeographicBoundingBox.northBoundLatitude,
	                southBoundLatitude = exGeographicBoundingBox.southBoundLatitude,
	                westBoundLongitude = exGeographicBoundingBox.westBoundLongitude;
	            var bbox = {
	              miny: southBoundLatitude,
	              maxy: northBoundLatitude,
	              minx: westBoundLongitude,
	              maxx: eastBoundLongitude
	            };

	            try {
	              dispatch("request:start");
	              getMap({
	                name: name,
	                visible: visible,
	                bbox: bbox,
	                url: url,
	                crs: crs
	              });
	              dispatch("request:end");
	            } catch (e) {
	              dispatch("request:error");
	            }
	          }
	        }); // else if (width && height) {
	        //     dispatch('request:start');
	        //     getFeatureInfo(name, visible, url, width, height, crs)
	        //     .then(() => dispatch('request:end'))
	        //     .catch(e => dispatch('request:error'));
	        // }                                      

	        resolve();
	      }).catch(function (e) {
	        return reject(e);
	      });
	    });
	  }

	  var header;
	  var dlg;

	  function getwfs() {
	    if (dlg) {
	      dlg.$destroy();
	    }

	    var _header$getBoundingCl = header.getBoundingClientRect(),
	        top = _header$getBoundingCl.top,
	        left = _header$getBoundingCl.left;

	    dlg = new Dialog({
	      target: document.body,
	      props: {
	        title: translate("link.wfs"),
	        top: top,
	        left: left
	      }
	    });
	    dlg.$on("close", function () {
	      return dlg.$destroy();
	    });
	    dlg.$on("ok", function (_ref5) {
	      var detail = _ref5.detail;
	      var value = detail;
	      dlg.$destroy();

	      if (value) {
	        dispatch("request:start");
	        addwfs(value).then(function () {
	          return dispatch("request:end");
	        }).catch(function (e) {
	          return dispatch("request:error", e);
	        });
	      }
	    });
	  }

	  function getwms() {
	    if (dlg) {
	      dlg.$destroy();
	    }

	    var _header$getBoundingCl2 = header.getBoundingClientRect(),
	        top = _header$getBoundingCl2.top,
	        left = _header$getBoundingCl2.left;

	    dlg = new Dialog({
	      target: document.body,
	      props: {
	        title: translate("link.wms"),
	        top: top,
	        left: left
	      }
	    });
	    dlg.$on("close", function () {
	      return dlg.$destroy();
	    });
	    dlg.$on("ok", function (_ref6) {
	      var detail = _ref6.detail;
	      var value = detail;
	      dlg.$destroy();

	      if (value) {
	        dispatch("request:start");
	        addwms(value).then(function () {
	          return dispatch("request:end");
	        }).catch(function (e) {
	          return dispatch("request:error", e);
	        });
	      }
	    });
	  }

	  function div0_binding($$value) {
	    binding_callbacks[$$value ? "unshift" : "push"](function () {
	      $$invalidate(1, header = $$value);
	    });
	  }

	  function div1_binding($$value) {
	    binding_callbacks[$$value ? "unshift" : "push"](function () {
	      $$invalidate(0, linksContainer = $$value);
	    });
	  }

	  $$self.$set = function ($$props) {
	    if ("map" in $$props) $$invalidate(4, map = $$props.map);
	  };

	  return [linksContainer, header, getwfs, getwms, map, links, dlg, translate, dispatch, closeLink, renderer, createFeature, drawFeatures, getFeature, getMap, addwfs, addwms, div0_binding, div1_binding];
	}

	var View =
	/*#__PURE__*/
	function (_SvelteComponent) {
	  _inherits(View, _SvelteComponent);

	  function View(options) {
	    var _this;

	    _classCallCheck(this, View);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(View).call(this));
	    init(_assertThisInitialized(_this), options, instance$5, create_fragment$5, safe_not_equal, {
	      map: 4
	    });
	    return _this;
	  }

	  return View;
	}(SvelteComponent);

	window.addEventListener('load', function () {
	  var map = leafletSrc.map('map').setView([55, 38], 4);
	  leafletSrc.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	  }).addTo(map);
	  new View({
	    target: document.querySelector('#sidebar'),
	    props: {
	      map: map
	    }
	  });
	});

}());
//# sourceMappingURL=main.js.map
