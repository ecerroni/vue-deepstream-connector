(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueDeepstramConnector"] = factory();
	else
		root["VueDeepstramConnector"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);
	var dsMethods = __webpack_require__(2)

	/**
	 *
	 * A good chunk is based on Zhuojie Zhou's awesome meteor-vue package @ https://github.com/zhouzhuojie/meteor-vue/blob/master/lib/main.js
	 */

	exports.install = function (Vue, options){
	    var Vue = Vue;

	    options = options || {}
	    var builtInDeepstream = Vue.util.extend(__webpack_require__(3), dsMethods.processMethod(options.methods))

	    var p = Vue.prototype;

	    p.__callHook = p._callHook;
	    p._callHook = function (hook) {
	        if(hook == 'created') {
	            var self = this;

	            // On every object use the $sync function to get the value
	            _.each(this.$options.sync, function (rxFunc, key) {
	                self.$sync(key, rxFunc);
	            });
	        }
	        this.__callHook(hook);
	    }

	    /**
	     * "Overwrite" of the Vue _init function
	     * @param Array option Vue options
	     */
	    p.__init = p._init;
	    p._init = function (option) {
	        // Dict
	        this.$$syncDict = {};

	        // Init data field to avoid warning
	        option = option || {};
	        option.data = option.data || {};
	        option.sync = option.sync || {};

	        var sync = _.extend({}, this.constructor.options.sync || {}, option.sync);
	        _.extend(option.data, sync);

	        option.init = option.init
	            ? [initDs].concat(option.init)
	            : initDs

	        // Default init
	        this.__init(option);
	    };

	    // Stop the key from syncDict
	    p.$unsync = function (key) {
	        var ref = this.$$syncDict[key];

	        if (ref && typeof ref.stop === 'function') {
	            ref.stop();
	        }
	    };

	// Sync key in syncDict with value = rxFunc
	    p.$sync = function (key, rxFunc) {
	        this.$unsync(key);

	        if (typeof rxFunc === 'function') {
	            var self = this;



	            this.$$syncDict[key] = (function () {//IIF
	                var val;
	                self._callingKey = key
	                val = rxFunc.call(self);
	                return self.$set(key, val);
	            })()
	        }
	    };

	    Vue.config.optionMergeStrategies.sync = Vue.config.optionMergeStrategies.computed

	    p.$dsListFetch = builtInDeepstream['vueListFetch']
	    p.$dsConnect = builtInDeepstream['vDs']
	    p.$dsLogin = builtInDeepstream['vdsLogin']
	    p.$dsLogout = builtInDeepstream['vdsLogout']
	    p.$dsRecordFieldFetch = builtInDeepstream['vueRecordFieldFetch']
	    p.$dsRecordCreate = builtInDeepstream['vueRecordCreate']

	    Vue.filter('ds-sync', {
	        read: function(value, key) {
	            if (value!=undefined) this.$emit('ds-sync', value, key);
	            return value
	        },
	        write: function(val, oldVal) {
	            return val
	        }
	    })

	    function initDs () {

	        // init deepstream
	        if ((this.$options.ds) && (this.$root == this)) {
	            this.$ds = p.$dsConnect(this.$options.ds).login()
	        } else if (this.$root.$ds) {
	            this.$ds = this.$root.$ds
	            }

	    }
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.

	(function() {

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;

	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;

	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};

	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };

	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }

	  // Current version.
	  _.VERSION = '1.8.3';

	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };

	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };

	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };

	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };

	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };

	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };

	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };

	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }

	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);

	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };

	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };

	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };

	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };

	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };

	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };

	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };

	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };

	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };

	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });

	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });

	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });

	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };

	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };

	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };

	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };

	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };

	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };

	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);

	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };

	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };

	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }

	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };

	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }

	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;

	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);

	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }

	    return range;
	  };

	  // Function (ahem) Functions
	  // ------------------

	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };

	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };

	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);

	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;

	    var later = function() {
	      var last = _.now() - timestamp;

	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };

	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }

	      return result;
	    };
	  };

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };

	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };

	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };

	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);

	  // Object Functions
	  // ----------------

	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }

	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };

	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };

	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };

	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };

	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };

	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);

	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);

	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };

	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };

	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };

	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);

	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };

	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };

	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };

	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };


	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }

	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;

	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }

	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);

	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };

	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };

	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };

	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });

	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }

	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }

	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };

	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };

	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };

	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };

	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };

	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };

	  // Utility Functions
	  // -----------------

	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };

	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };

	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };

	  _.noop = function(){};

	  _.property = property;

	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };

	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };

	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };

	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };

	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };

	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);

	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);

	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };

	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };

	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;

	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }

	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';

	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	  };

	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };

	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.

	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };

	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };

	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);

	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };

	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };

	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ },
/* 2 */
/***/ function(module, exports) {

	function processMethod(methods) {
	    if (!methods) {
	        return {}
	    }

	    function process(method) {
	        if (!method) {
	            return null
	        }
	        if (typeof method === 'function') {
	            return {priority: 100, fn: method}
	        }

	        if (!Vue.util.isObject(method)) {
	            return null
	        }
	        if (typeof method.fn != "function") {
	            return null
	        }
	        var priority = method.priority
	        if (!priority) {
	            return {priority: 100, fn: method.fn}
	        }
	        if (typeof priority != 'number' || priority < 1 || priority > 100) {
	            return null
	        }
	        return {priority: priority, fn: method.fn}

	    }

	    var result = {}
	    Object.keys(methods).forEach(function (key) {
	        var value = methods[key]
	        var method = process(value)
	        if (!method) {
	            console.log("can not accept method \"" + key + "\"", value)
	            throw "can not accept method \"" + key + "\""
	        } else {
	            result[key] = method
	        }
	    })
	    return result
	}


	module.exports = {
	    processMethod: processMethod
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var deepstream = __webpack_require__(4)


	/**
	 *
	 * @param params
	 * @returns {*}
	 */


	function vDs(params){
	    var ds = deepstream(params.connectionUrl, params.options);
	    ds.on('connectionStateChanged', function(connectionState) {
	        // will be called with 'CLOSED' once the connection is successfully closed.
	        //console.log('connectionStateChanged', connectionState)
	    })
	    return ds
	}


	/**
	 *
	 * @param params
	 * @param fn
	 */
	function vdsLogin(params, fn){
	    var ds = this.$ds
	    ds.close()
	    var status = false
	    function login (params, ds, fn){
	        ds.login(params, function(success, data){
	            if (success) {
	                status = true
	                fn(status, data)
	            } else {
	                fn(status, data)
	            }
	        })
	    }
	    var cbFn = fn
	    login(params, ds, function(login, data){
	        cbFn(login, data)
	    })

	}

	function vdsLogout () {
	    var status = false
	    var ds = this.$ds
	    ds.close()
	    return status
	}

	/* Array containing all the list subscribtions made*/
	var gloList = [];

	/* HELPERS */
	function _arrayObjectIndexOf(myArray, property, searchTerm) {
	    for(var i = 0, len = myArray.length; i < len; i++) {
	        if (myArray[i][property] === searchTerm) return i;
	    }
	    return -1;
	}

	/**
	 *
	 * @param list
	 * @returns {*}
	 * @private
	 */
	function _vdsList(list, ds) {
	  var subscribedList = ds.record.getList(list);
	    var listArr = []
	  //console.log('I have subscribed you to the >> '+ list + ' List')
	  gloList.push({listName: list, listData: subscribedList});

	  console.log('# OF LIST SUBSCRIBED TO ', gloList.length, gloList.map(function(ln){return ln.listName}))

	    //console.log('List Names: ', gloList.map(function(ln){return ln.listName}))
	  return _arrayObjectIndexOf(gloList, 'listName', list);
	}

	function vueListDiscard (listName) {
	    var ds = this.$ds
	    //var listToFetch = params.listName;
	    //var key = params.syncData
	    var list = ds.record.getList(listName);
	    console.log('ready to get rid of ', listName, list)
	    /*list.unsubscribe(function(){
	        console.log('unsubscribed from ', listName)
	    })*/
	    list.discard()

	}

	/**
	 *
	 * @param params
	 * @returns {Array}
	 */
	function vueListFetch (listName) {

	    var ds = this.$ds
	    var listToFetch = listName;
	    var key = this._callingKey
	    var list = gloList[_vdsList(listToFetch, ds)].listData;
	    var self = this // This is Vue sync caller
	    var data = [];

	    var k = key

	       // console.log('connectivity ', ds.getConnectionState())

	    // this.$on('beforeDestroy', function(){console.log('now destroy the list')})
	    list.whenReady(function onListReady() {
	        list.getEntries().forEach(function (entry, index) {
	            var item = ds.record.getRecord(entry);
	            item.subscribe(function (data) {
	                console.log('[DS] EVENT: {SUBSCRIBE} ITEM [', data._uid, ']')
	                var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
	                var update = null;

	                if (keyExists > -1) {
	                    var idx = -1
	                    update = self.$data[k].find(function (item, index) {
	                        idx = index
	                        return (item._uid == data._uid);
	                    })

	                    if (update) {
	                        console.log('[DS] FROM {SUBSCRIBE} HAVE ITEM [', update._uid, '] TO INSERT @ ', idx)
	                        self.$data[k].$set(idx, data)
	                    }
	                }
	            })// end item.subscribe

	            item.whenReady(function () {
	                data.safePush(item.get())
	            })
	        })
	        console.log('[DS] FETCH LIST ENTRIES FOR /'+listName+'/: ', list.getEntries())
	    })

	    list.on('entry-added', function (recordChanged) {
	        var item = ds.record.getRecord(recordChanged)
	        item.subscribe(function (data) {
	            console.log('[DS] EVENT: {SUBSCRIBE} ITEM (LIST) [', data._uid, ']')
	            var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
	            var update = null;
	            if (keyExists > -1) {
	                var idx = -1
	                update = self.$data[k].find(function (item, index) {
	                    idx = index
	                    return (item._uid == data._uid);
	                })

	                if (update) {
	                    console.log('[DS] FROM {SUBSCRIBE} FOUND ITEM [', update._uid, '] TO UPDATE @ ', idx)
	                    self.$data[k].$set(idx, data)
	                }
	            }
	        })// end item.subscribe

	        item.whenReady(function () {
	            // there is a latency compensation problem. tempObj is used a sort of OptimisticUI
	            var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
	            var tempObj = {_uid: recordChanged};
	            var obj = item.get()._uid == null ? tempObj : item.get()
	            var idx = -1
	            var update = self.$data[k].find(function (item, index) {
	                idx = index
	                return (item._uid == obj._uid);
	            })

	            if (!update) self.$data[k].$safeSet(self.$data[k].length, obj)
	            console.log('[DS] EVENT: {ENTRY-ADDED} (LIST) | ITEM[', obj._uid, ']')
	        })
	    }) // end list.on.entryAdded

	    list.on('entry-removed', function (recordChanged) {
	        var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
	        if (keyExists > -1) {
	            var remove = self.$data[k].find(function (item) {
	                return item._uid == recordChanged;
	            })
	            remove ? self.$data[k].$remove(remove) : null;
	            if (remove) console.log('[DS] EVENT: {ENTRY-REMOVED} (LIST) | ITEM[', recordChanged, ']')
	        }
	    })// end list.on.entryRemoved

	    data._list = listToFetch
	    data._key = key
	    var self = this
	    data.push = function (arr) {
	        var pushMessage = '[CONNECTOR] Push intercepted | Checking... [ FRESH UID ]'
	        console.log(pushMessage)
	        var uid = ds.getUid();
	        var record = data._key + '/' + uid;
	        var timestamp = Date.now()
	        var newEntry = ds.record.getRecord(record)
	        var objData = {_uid: record, _timestamp: timestamp}
	        for (var k in arr) {
	            if (arr.hasOwnProperty(k)) {
	                objData[k] = arr[k];
	            }
	        }

	        arguments[0]._uid = record
	        arguments[0]._timestamp = timestamp

	        newEntry.whenReady(function () {
	            newEntry.set(objData)
	        })

	        var keyExists = Object.keys(self.$$syncDict).indexOf(key) > -1 ? Object.keys(self.$$syncDict).indexOf(key) : -1;
	        if (keyExists > -1) {
	            gloList[_arrayObjectIndexOf(gloList, 'listName', data._list)].listData.addEntry(record)
	        }

	        console.log('[CONNECTOR] Pushed! Complete', [data._list, record, newEntry])
	        return this.__proto__.push.apply(this, arguments);
	    }//end data.push

	    data.safePush = function (arr) {
	        return this.__proto__.push.apply(this, arguments);
	    }

	    data.$set = function (idx, toUpdate) {
	        console.log('[CONNECTOR] $set intercepted | Checking... [', toUpdate._uid, '] @', idx)
	        if (idx >= data.length) {
	            data.length = Number(idx) + 1
	        }

	        data.splice(idx, 1, toUpdate)[0]
	        console.log('[CONNECTOR] $set complete | Commit... [', toUpdate._uid, ']')

	        var updateRecord = ds.record.getRecord(toUpdate._uid)
	        updateRecord.whenReady(function () {
	            updateRecord.set(toUpdate)
	        })
	    }//end data.$set

	    data.$safeSet = function (idx, toUpdate) {
	        console.log('[CONNECTOR] $safeSet intercepted | Checking... [', toUpdate._uid, '] @', idx)
	        if (idx >= data.length) {
	            data.length = Number(idx) + 1
	        }

	        data.splice(idx, 1, toUpdate)[0]
	        console.log('[CONNECTOR] $safeSet complete | Commit... [', toUpdate._uid, ']')
	    }//end data.$set

	    data.$remove = function (toUpdate) {
	        console.log('[CONNECTOR] $remove intercepted | Deleting... [', toUpdate._uid, '] ')
	        gloList[_arrayObjectIndexOf(gloList, 'listName', data._list)].listData.removeEntry(toUpdate._uid)
	        return this.__proto__.$remove.apply(this, arguments);
	    }//end data.$set

	    return data
	}
	// this library assumes and works only if records have unique Ids
	// If not it may broke.
	// This library, when you're creating either list or records, uses the following format to produce and id: 'recordName/'+ds.getUid()

	/**
	 *
	 * @param listName
	 * @param rec
	 * @param obj
	 */
	function vueListAddEntry(listName, rec, obj){
	    gloList[_arrayObjectIndexOf(gloList, 'listName', listName)].listData.addEntry(rec)
	}

	/**
	 *
	 * @param listName
	 * @param id
	 */
	function vueListRemoveEntry(listName, id){
	  gloList[_arrayObjectIndexOf(gloList, 'listName', listName)].listData.removeEntry(id)
	}

	/**
	 *
	 * @param recordName
	 * @param defVal
	 * @param genId
	 */
	function vueRecordCreate(recordName, defVal, genId) {
	    var ds = this.$ds
	    var uid = ds.getUid();


	    var genId = genId === false ? genId : true
	    var record = genId === true ? recordName+'/'+uid : recordName;
	    var entry = ds.record.getRecord(record)

	    var data = ''

	    entry.whenReady(function(){
	        if (defVal && entry.get().id != '' ) {
	            //var newEntry = {}
	            var objData = {id: record, timestamp: Date.now()}

	            for (var k in defVal) {
	                if (defVal.hasOwnProperty(k)) {
	                    objData[k] = defVal[k];
	                }
	            }

	            entry.set(objData);
	            //console.log('inner entry ', entry, record, recordName)
	            return entry
	        } else {
	            console.log('Either something went wrong during "create" or object data are missing')
	        }

	    })
	}

	/**
	 *
	 * @param k
	 * @param record
	 */
	function vueRecordFetch(record) {
	    var ds = this.$ds;
	    var k = this._callingKey
	    var self = this
	    var item = ds.record.getRecord(record);

	    item.subscribe(function(value){
	        console.log('[DS] EVENT: {SUBSCRIBE} ITEM (SINGLE ITEM) ', value)

	        var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;

	        if (keyExists > -1) {
	            for (var key in value) {
	                if (Object.hasOwnProperty(key)) {
	                    console.log(key);self.$set(key, value[key])
	                }
	            }
	        }

	        self.$data[k] = keyExists > -1 ? value : null
	    })// end item.subscribe

	    item.whenReady(function(){
	        self.$set(k, item.get())
	    })
	}

	/**
	 *
	 * @param k
	 * @param record
	 * @param field
	 * @param id
	 * @returns {*}
	 */
	function vueRecordFieldFetch(record, field) {
	    var k = this._callingKey
	    var ds = this.$ds
	    //var getList = this.$ds != null ? ds.getConnectionState() : 'WAIT'
	    //console.log('get list ', getList, ds.getConnectionState())
	    //if (getList !== 'WAIT') {

	        var item = ds.record.getRecord(record);
	        var self = this
	        var data;

	        item.subscribe(field, function (value) {
	            var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
	            if ((keyExists > -1) /*&& (self.$data[k])*/) {
	                self.$set(k, value)
	                console.log('[DS] EVENT: {SUBSCRIBE} FIELD ["' + field + '"]', 'IN RECORD (SINGLE ITEM): ', value)
	            }
	            ;
	        });

	        item.whenReady(function () {
	            var value = item.get()


	            self.$set(k, item.get()[field])
	            data = item.get()[field]
	        })// end item.whenReady

	        this.$on('ds-sync', function (newVal, keySent) {
	            if (k == keySent) {
	                console.log('[CONNECTOR] v-model change interecepted | Checking...', 'record[', record, '] field[', field, '] value[', newVal, ']')
	                var rec = ds.record.getRecord(record)

	                rec.whenReady(function () {
	                    if (newVal != rec.get(field)) {
	                        rec.set(field, newVal)
	                    }
	                })
	            }
	        })//end this.$on


	  //  }
	    return data
	}

	module.exports = {
	    vDs: vDs,
	    vueRecordFieldFetch: vueRecordFieldFetch,
	    vueRecordFetch: vueRecordFetch,
	    vueListFetch: vueListFetch,
	    vueListDiscard: vueListDiscard,
	    vdsLogin: vdsLogin,
	    vdsLogout: vdsLogout,
	    vueRecordCreate: vueRecordCreate
	    }


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__( 5 ),
		MS = __webpack_require__( 6 ),
		Emitter = __webpack_require__( 7 ),
		Connection = __webpack_require__( 8 ),
		EventHandler = __webpack_require__( 55 ),
		RpcHandler = __webpack_require__( 59 ),
		RecordHandler = __webpack_require__( 62 ),
		WebRtcHandler = __webpack_require__( 68 ),
		defaultOptions = __webpack_require__( 71 );

	/**
	 * deepstream.io javascript client - works in
	 * node.js and browsers (using engine.io)
	 *
	 * @copyright 2016 deepstreamHub GmbH
	 * @author deepstreamHub GmbH
	 *
	 *
	 * @{@link http://deepstream.io}
	 *
	 *
	 * @param {String} url     URL to connect to. The protocoll can be ommited, e.g. <host>:<port>. Use TCP URL for node.js
	 * @param {Object} options A map of options that extend the ones specified in default-options.js
	 *
	 * @public
	 * @constructor
	 */
	var Client = function( url, options ) {
		this._url = url;
		this._options = this._getOptions( options || {} );

		this._connection = new Connection( this, this._url, this._options );

		this.event = new EventHandler( this._options, this._connection, this );
		this.rpc = new RpcHandler( this._options, this._connection, this );
		this.record = new RecordHandler( this._options, this._connection, this );
		this.webrtc = new WebRtcHandler( this._options, this._connection, this );

		this._messageCallbacks = {};
		this._messageCallbacks[ C.TOPIC.WEBRTC ] = this.webrtc._$handle.bind( this.webrtc );
		this._messageCallbacks[ C.TOPIC.EVENT ] = this.event._$handle.bind( this.event );
		this._messageCallbacks[ C.TOPIC.RPC ] = this.rpc._$handle.bind( this.rpc );
		this._messageCallbacks[ C.TOPIC.RECORD ] = this.record._$handle.bind( this.record );
		this._messageCallbacks[ C.TOPIC.ERROR ] = this._onErrorMessage.bind( this );
	};

	Emitter( Client.prototype );

	/**
	 * Send authentication parameters to the client to fully open
	 * the connection.
	 *
	 * Please note: Authentication parameters are send over an already established
	 * connection, rather than appended to the server URL. This means the parameters
	 * will be encrypted when used with a WSS / HTTPS connection. If the deepstream server
	 * on the other side has message logging enabled it will however be written to the logs in
	 * plain text. If additional security is a requirement it might therefor make sense to hash
	 * the password on the client.
	 *
	 * If the connection is not yet established the authentication parameter will be
	 * stored and send once it becomes available
	 *
	 * authParams can be any JSON serializable data structure and its up for the
	 * permission handler on the server to make sense of them, although something
	 * like { username: 'someName', password: 'somePass' } will probably make the most sense.
	 *
	 * login can be called multiple times until either the connection is authenticated or
	 * forcefully closed by the server since its maxAuthAttempts threshold has been exceeded
	 *
	 * @param   {Object}   authParams JSON.serializable authentication data
	 * @param   {Function} callback   Will be called with either (true) or (false, data)
	 *
	 * @public
	 * @returns {Client}
	 */
	Client.prototype.login = function( authParams, callback ) {
		this._connection.authenticate( authParams || {}, callback );
		return this;
	};

	/**
	 * Closes the connection to the server.
	 *
	 * @public
	 * @returns {void}
	 */
	Client.prototype.close = function() {
		this._connection.close();
	};

	/**
	 * Returns the current state of the connection.
	 *
	 * connectionState is one of CONSTANTS.CONNECTION_STATE
	 *
	 * @returns {[type]} [description]
	 */
	Client.prototype.getConnectionState = function() {
		return this._connection.getState();
	};

	/**
	 * Returns a random string. The first block of characters
	 * is a timestamp, in order to allow databases to optimize for semi-
	 * sequentuel numberings
	 *
	 * @public
	 * @returns {String} unique id
	 */
	Client.prototype.getUid = function() {
		var timestamp = (new Date()).getTime().toString(36),
			randomString = (Math.random() * 10000000000000000).toString(36).replace( '.', '' );

		return timestamp + '-' + randomString;
	};

	/**
	 * Package private callback for parsed incoming messages. Will be invoked
	 * by the connection class
	 *
	 * @param   {Object} message parsed deepstream message
	 *
	 * @package private
	 * @returns {void}
	 */
	Client.prototype._$onMessage = function( message ) {
		if( this._messageCallbacks[ message.topic ] ) {
			this._messageCallbacks[ message.topic ]( message );
		} else {
			message.processedError = true;
			this._$onError( message.topic, C.EVENT.MESSAGE_PARSE_ERROR, 'Received message for unknown topic ' + message.topic );
		}

		if( message.action === C.ACTIONS.ERROR && !message.processedError ) {
			this._$onError( message.topic, message.data[ 0 ],  message.data.slice( 0 ) );
		}
	};

	/**
	 * Package private error callback. This is the single point at which
	 * errors are thrown in the client. (Well... that's the intention anyways)
	 *
	 * The expectations would be for implementations to subscribe
	 * to the client's error event to prevent errors from being thrown
	 * and then decide based on the event and topic parameters how
	 * to handle the errors
	 *
	 * IMPORTANT: Errors that are specific to a request, e.g. a RPC
	 * timing out or a record not being permissioned are passed directly
	 * to the method that requested them
	 *
	 * @param   {String} topic One of CONSTANTS.TOPIC
	 * @param   {String} event One of CONSTANTS.EVENT
	 * @param   {String} msg   Error dependent message
	 *
	 * @package private
	 * @returns {void}
	 */
	Client.prototype._$onError = function( topic, event, msg ) {
		var errorMsg;

		/*
		 * Help to diagnose the problem quicker by checking for
		 * some common problems
		 */
		if( event === C.EVENT.ACK_TIMEOUT || event === C.EVENT.RESPONSE_TIMEOUT ) {
			if( this.getConnectionState() === C.CONNECTION_STATE.AWAITING_AUTHENTICATION ) {
				errorMsg = 'Your message timed out because you\'re not authenticated. Have you called login()?';
				setTimeout( this._$onError.bind( this, C.EVENT.NOT_AUTHENTICATED, C.TOPIC.ERROR, errorMsg ), 1 );
			}
		}

		if( this.hasListeners( 'error' ) ) {
			this.emit( 'error', msg, event, topic );
			this.emit( event, topic, msg );
		} else {
			console.log( '--- You can catch all deepstream errors by subscribing to the error event ---' );

			errorMsg = event + ': ' + msg;

			if( topic ) {
				errorMsg += ' (' + topic + ')';
			}

			throw new Error( errorMsg );
		}
	};

	/**
	 * Passes generic messages from the error topic
	 * to the _$onError handler
	 *
	 * @param {Object} errorMessage parsed deepstream error message
	 *
	 * @private
	 * @returns {void}
	 */
	Client.prototype._onErrorMessage = function( errorMessage ) {
		this._$onError( errorMessage.topic, errorMessage.data[ 0 ], errorMessage.data[ 1 ] );
	};

	/**
	 * Creates a new options map by extending default
	 * options with the passed in options
	 *
	 * @param   {Object} options The user specified client configuration options
	 *
	 * @private
	 * @returns {Object}	merged options
	 */
	Client.prototype._getOptions = function( options ) {
		var mergedOptions = {},
			key;

		for( key in defaultOptions ) {
			if( typeof options[ key ] === 'undefined' ) {
				mergedOptions[ key ] = defaultOptions[ key ];
			} else {
				mergedOptions[ key ] = options[ key ];
			}
		}

		return mergedOptions;
	};

	/**
	 * Exports factory function to adjust to the current JS style of
	 * disliking 'new' :-)
	 *
	 * @param {String} url     URL to connect to. The protocoll can be ommited, e.g. <host>:<port>. Use TCP URL for node.js
	 * @param {Object} options A map of options that extend the ones specified in default-options.js
	 *
	 * @public
	 * @returns {void}
	 */
	function createDeepstream( url, options ) {
		return new Client( url, options );
	}

	/**
	 * Expose constants to allow consumers to access them
	*/
	Client.prototype.CONSTANTS = C;
	createDeepstream.CONSTANTS = C;

	/**
	 * Expose merge strategies to allow consumers to access them
	*/
	Client.prototype.MERGE_STRATEGIES = MS;
	createDeepstream.MERGE_STRATEGIES = MS;

	module.exports = createDeepstream;


/***/ },
/* 5 */
/***/ function(module, exports) {

	exports.CONNECTION_STATE = {};

	exports.CONNECTION_STATE.CLOSED = 'CLOSED';
	exports.CONNECTION_STATE.AWAITING_CONNECTION = 'AWAITING_CONNECTION';
	exports.CONNECTION_STATE.CHALLENGING = 'CHALLENGING';
	exports.CONNECTION_STATE.AWAITING_AUTHENTICATION = 'AWAITING_AUTHENTICATION';
	exports.CONNECTION_STATE.AUTHENTICATING = 'AUTHENTICATING';
	exports.CONNECTION_STATE.OPEN = 'OPEN';
	exports.CONNECTION_STATE.ERROR = 'ERROR';
	exports.CONNECTION_STATE.RECONNECTING = 'RECONNECTING';

	exports.MESSAGE_SEPERATOR = String.fromCharCode( 30 ); // ASCII Record Seperator 1E
	exports.MESSAGE_PART_SEPERATOR = String.fromCharCode( 31 ); // ASCII Unit Separator 1F

	exports.TYPES = {};
	exports.TYPES.STRING = 'S';
	exports.TYPES.OBJECT = 'O';
	exports.TYPES.NUMBER = 'N';
	exports.TYPES.NULL = 'L';
	exports.TYPES.TRUE = 'T';
	exports.TYPES.FALSE = 'F';
	exports.TYPES.UNDEFINED = 'U';

	exports.TOPIC = {};
	exports.TOPIC.CONNECTION = 'C';
	exports.TOPIC.AUTH = 'A';
	exports.TOPIC.ERROR = 'X';
	exports.TOPIC.EVENT = 'E';
	exports.TOPIC.RECORD = 'R';
	exports.TOPIC.RPC = 'P';
	exports.TOPIC.WEBRTC = 'W';
	exports.TOPIC.PRIVATE = 'PRIVATE/';

	exports.EVENT = {};
	exports.EVENT.CONNECTION_ERROR = 'connectionError';
	exports.EVENT.CONNECTION_STATE_CHANGED = 'connectionStateChanged';
	exports.EVENT.MAX_RECONNECTION_ATTEMPTS_REACHED = 'MAX_RECONNECTION_ATTEMPTS_REACHED';
	exports.EVENT.CONNECTION_AUTHENTICATION_TIMEOUT = 'CONNECTION_AUTHENTICATION_TIMEOUT';
	exports.EVENT.ACK_TIMEOUT = 'ACK_TIMEOUT';
	exports.EVENT.NO_RPC_PROVIDER = 'NO_RPC_PROVIDER';
	exports.EVENT.RESPONSE_TIMEOUT = 'RESPONSE_TIMEOUT';
	exports.EVENT.DELETE_TIMEOUT = 'DELETE_TIMEOUT';
	exports.EVENT.UNSOLICITED_MESSAGE = 'UNSOLICITED_MESSAGE';
	exports.EVENT.MESSAGE_DENIED = 'MESSAGE_DENIED';
	exports.EVENT.MESSAGE_PARSE_ERROR = 'MESSAGE_PARSE_ERROR';
	exports.EVENT.VERSION_EXISTS = 'VERSION_EXISTS';
	exports.EVENT.NOT_AUTHENTICATED = 'NOT_AUTHENTICATED';
	exports.EVENT.MESSAGE_PERMISSION_ERROR = 'MESSAGE_PERMISSION_ERROR';
	exports.EVENT.LISTENER_EXISTS = 'LISTENER_EXISTS';
	exports.EVENT.NOT_LISTENING = 'NOT_LISTENING';
	exports.EVENT.TOO_MANY_AUTH_ATTEMPTS = 'TOO_MANY_AUTH_ATTEMPTS';
	exports.EVENT.IS_CLOSED = 'IS_CLOSED';
	exports.EVENT.UNKNOWN_CALLEE = 'UNKNOWN_CALLEE';
	exports.EVENT.RECORD_NOT_FOUND = 'RECORD_NOT_FOUND';

	exports.ACTIONS = {};
	exports.ACTIONS.ACK = 'A';
	exports.ACTIONS.REDIRECT = 'RED';
	exports.ACTIONS.CHALLENGE = 'CH';
	exports.ACTIONS.CHALLENGE_RESPONSE = 'CHR';
	exports.ACTIONS.READ = 'R';
	exports.ACTIONS.CREATE = 'C';
	exports.ACTIONS.UPDATE = 'U';
	exports.ACTIONS.PATCH = 'P';
	exports.ACTIONS.DELETE = 'D';
	exports.ACTIONS.SUBSCRIBE = 'S';
	exports.ACTIONS.UNSUBSCRIBE = 'US';
	exports.ACTIONS.HAS = 'H';
	exports.ACTIONS.SNAPSHOT = 'SN';
	exports.ACTIONS.INVOKE = 'I';
	exports.ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND = 'SP';
	exports.ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED = 'SR';
	exports.ACTIONS.LISTEN = 'L';
	exports.ACTIONS.UNLISTEN = 'UL';
	exports.ACTIONS.PROVIDER_UPDATE = 'PU';
	exports.ACTIONS.QUERY = 'Q';
	exports.ACTIONS.CREATEORREAD = 'CR';
	exports.ACTIONS.EVENT = 'EVT';
	exports.ACTIONS.ERROR = 'E';
	exports.ACTIONS.REQUEST = 'REQ';
	exports.ACTIONS.RESPONSE = 'RES';
	exports.ACTIONS.REJECTION = 'REJ';

	//WebRtc
	exports.ACTIONS.WEBRTC_REGISTER_CALLEE = 'RC';
	exports.ACTIONS.WEBRTC_UNREGISTER_CALLEE = 'URC';
	exports.ACTIONS.WEBRTC_OFFER = 'OF';
	exports.ACTIONS.WEBRTC_ANSWER = 'AN';
	exports.ACTIONS.WEBRTC_ICE_CANDIDATE = 'IC';
	exports.ACTIONS.WEBRTC_CALL_DECLINED = 'CD';
	exports.ACTIONS.WEBRTC_CALL_ENDED = 'CE';
	exports.ACTIONS.WEBRTC_LISTEN_FOR_CALLEES = 'LC';
	exports.ACTIONS.WEBRTC_UNLISTEN_FOR_CALLEES = 'ULC';
	exports.ACTIONS.WEBRTC_ALL_CALLEES = 'WAC';
	exports.ACTIONS.WEBRTC_CALLEE_ADDED = 'WCA';
	exports.ACTIONS.WEBRTC_CALLEE_REMOVED = 'WCR';
	exports.ACTIONS.WEBRTC_IS_ALIVE = 'WIA';

	exports.CALL_STATE = {};
	exports.CALL_STATE.INITIAL = 'INITIAL';
	exports.CALL_STATE.CONNECTING = 'CONNECTING';
	exports.CALL_STATE.ESTABLISHED = 'ESTABLISHED';
	exports.CALL_STATE.ACCEPTED = 'ACCEPTED';
	exports.CALL_STATE.DECLINED = 'DECLINED';
	exports.CALL_STATE.ENDED = 'ENDED';
	exports.CALL_STATE.ERROR = 'ERROR';


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
		/**
		*	Choose the server's state over the client's
		**/
		REMOTE_WINS: function( record, remoteValue, remoteVersion, callback ) {
			callback( null, remoteValue );
		},
		/**
		*	Choose the local state over the server's
		**/
		LOCAL_WINS: function( record, remoteValue, remoteVersion, callback ) {
			callback( null, record.get() );
		}
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Emitter`.
	 */

	module.exports = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks[event] = this._callbacks[event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  var self = this;
	  this._callbacks = this._callbacks || {};

	  function on() {
	    self.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks[event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks[event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks[event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks[event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var engineIoClient = __webpack_require__( 9 ),
		messageParser = __webpack_require__( 40 ),
		messageBuilder = __webpack_require__( 41 ),
		TcpConnection = __webpack_require__( 42 ),
		utils = __webpack_require__( 54 ),
		C = __webpack_require__( 5 );

	/**
	 * Establishes a connection to a deepstream server, either
	 * using TCP in node or engine.io in the browser.
	 *
	 * @param {Client} client
	 * @param {String} url     Short url, e.g. <host>:<port>. Deepstream works out the protocol
	 * @param {Object} options connection options
	 *
	 * @constructor
	 */
	var Connection = function( client, url, options ) {
		this._client = client;
		this._originalUrl = url;
		this._url = url;
		this._options = options;
		this._authParams = null;
		this._authCallback = null;
		this._deliberateClose = false;
		this._redirecting = false;
		this._tooManyAuthAttempts = false;
		this._connectionAuthenticationTimeout = false;
		this._challengeDenied = false;
		this._queuedMessages = [];
		this._reconnectTimeout = null;
		this._reconnectionAttempt = 0;
		this._currentPacketMessageCount = 0;
		this._sendNextPacketTimeout = null;
		this._currentMessageResetTimeout = null;
		this._endpoint = null;

		this._state = C.CONNECTION_STATE.CLOSED;
		this._createEndpoint();
	};

	/**
	 * Returns the current connection state.
	 * (One of constants.CONNECTION_STATE)
	 *
	 * @public
	 * @returns {String} connectionState
	 */
	Connection.prototype.getState = function() {
		return this._state;
	};

	/**
	 * Sends the specified authentication parameters
	 * to the server. Can be called up to <maxAuthAttempts>
	 * times for the same connection.
	 *
	 * @param   {Object}   authParams A map of user defined auth parameters. E.g. { username:<String>, password:<String> }
	 * @param   {Function} callback   A callback that will be invoked with the authenticationr result
	 *
	 * @public
	 * @returns {void}
	 */
	Connection.prototype.authenticate = function( authParams, callback ) {
		this._authParams = authParams;
		this._authCallback = callback;

		if( this._tooManyAuthAttempts || this._challengeDenied || this._connectionAuthenticationTimeout ) {
			this._client._$onError( C.TOPIC.ERROR, C.EVENT.IS_CLOSED, 'this client\'s connection was closed' );
			return;
		}
		else if( this._deliberateClose === true && this._state === C.CONNECTION_STATE.CLOSED ) {
			this._createEndpoint();
			this._deliberateClose = false;
			return;
		}

		if( this._state === C.CONNECTION_STATE.AWAITING_AUTHENTICATION ) {
			this._sendAuthParams();
		}
	};

	/**
	 * High level send message method. Creates a deepstream message
	 * string and invokes the actual send method.
	 *
	 * @param   {String} topic  One of C.TOPIC
	 * @param   {String} action One of C.ACTIONS
	 * @param   {[Mixed]} data 	Date that will be added to the message. Primitive values will
	 *                          be appended directly, objects and arrays will be serialized as JSON
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype.sendMsg = function( topic, action, data ) {
		this.send( messageBuilder.getMsg( topic, action, data ) );
	};

	/**
	 * Main method for sending messages. Doesn't send messages instantly,
	 * but instead achieves conflation by adding them to the message
	 * buffer that will be drained on the next tick
	 *
	 * @param   {String} message deepstream message
	 *
	 * @public
	 * @returns {void}
	 */
	Connection.prototype.send = function( message ) {
		this._queuedMessages.push( message );
		this._currentPacketMessageCount++;

		if( this._currentMessageResetTimeout === null ) {
			this._currentMessageResetTimeout = utils.nextTick( this._resetCurrentMessageCount.bind( this ) );
		}

		if( this._state === C.CONNECTION_STATE.OPEN &&
			this._queuedMessages.length < this._options.maxMessagesPerPacket &&
			this._currentPacketMessageCount < this._options.maxMessagesPerPacket ) {
			this._sendQueuedMessages();
		}
		else if( this._sendNextPacketTimeout === null ) {
			this._queueNextPacket();
		}
	};

	/**
	 * Closes the connection. Using this method
	 * sets a _deliberateClose flag that will prevent the client from
	 * reconnecting.
	 *
	 * @public
	 * @returns {void}
	 */
	Connection.prototype.close = function() {
		this._deliberateClose = true;
		this._endpoint.close();
	};

	/**
	 * Creates the endpoint to connect to using the url deepstream
	 * was initialised with. If running in node automatically uses TCP
	 * for better performance
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._createEndpoint = function() {
		if( utils.isNode ) {
			this._endpoint = new TcpConnection( this._url );
		} else {
			this._endpoint = engineIoClient( this._url, this._options );
		}

		this._endpoint.on( 'open', this._onOpen.bind( this ) );
		this._endpoint.on( 'error', this._onError.bind( this ) );
		this._endpoint.on( 'close', this._onClose.bind( this ) );
		this._endpoint.on( 'message', this._onMessage.bind( this ) );
	};

	/**
	 * When the implementation tries to send a large
	 * number of messages in one execution thread, the first
	 * <maxMessagesPerPacket> are send straight away.
	 *
	 * _currentPacketMessageCount keeps track of how many messages
	 * went into that first packet. Once this number has been exceeded
	 * the remaining messages are written to a queue and this message
	 * is invoked on a timeout to reset the count.
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._resetCurrentMessageCount = function() {
		this._currentPacketMessageCount = 0;
		this._currentMessageResetTimeout = null;
	};

	/**
	 * Concatenates the messages in the current message queue
	 * and sends them as a single package. This will also
	 * empty the message queue and conclude the send process.
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._sendQueuedMessages = function() {
		if( this._state !== C.CONNECTION_STATE.OPEN ) {
			return;
		}

		if( this._queuedMessages.length === 0 ) {
			this._sendNextPacketTimeout = null;
			return;
		}

		var message = this._queuedMessages.splice( 0, this._options.maxMessagesPerPacket ).join( '' );

		if( this._queuedMessages.length !== 0 ) {
			this._queueNextPacket();
		} else {
			this._sendNextPacketTimeout = null;
		}

		this._endpoint.send( message );
	};

	/**
	 * Schedules the next packet whilst the connection is under
	 * heavy load.
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._queueNextPacket = function() {
		var fn = this._sendQueuedMessages.bind( this ),
			delay = this._options.timeBetweenSendingQueuedPackages;

		this._sendNextPacketTimeout = setTimeout( fn, delay );
	};

	/**
	 * Sends authentication params to the server. Please note, this
	 * doesn't use the queued message mechanism, but rather sends the message directly
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._sendAuthParams = function() {
		this._setState( C.CONNECTION_STATE.AUTHENTICATING );
		var authMessage = messageBuilder.getMsg( C.TOPIC.AUTH, C.ACTIONS.REQUEST, [ this._authParams ] );
		this._endpoint.send( authMessage );
	};

	/**
	 * Will be invoked once the connection is established. The client
	 * can't send messages yet, and needs to get a connection ACK or REDIRECT
	 * from the server before authenticating
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._onOpen = function() {
		this._clearReconnect();
		this._setState( C.CONNECTION_STATE.AWAITING_CONNECTION );
	};

	/**
	 * Callback for generic connection errors. Forwards
	 * the error to the client.
	 *
	 * The connection is considered broken once this method has been
	 * invoked.
	 *
	 * @param   {String|Error} error connection error
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._onError = function( error ) {
		this._setState( C.CONNECTION_STATE.ERROR );

		/*
		 * If the implementation isn't listening on the error event this will throw
		 * an error. So let's defer it to allow the reconnection to kick in.
		 */
		setTimeout(function(){
			this._client._$onError( null, C.EVENT.CONNECTION_ERROR, error.toString() );
		}.bind( this ), 1);
	};

	/**
	 * Callback when the connection closes. This might have been a deliberate
	 * close triggered by the client or the result of the connection getting
	 * lost.
	 *
	 * In the latter case the client will try to reconnect using the configured
	 * strategy.
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._onClose = function() {
		if( this._redirecting === true ) {
			this._redirecting = false;
			this._createEndpoint();
		}
		else if( this._deliberateClose === true ) {
			this._setState( C.CONNECTION_STATE.CLOSED );
		}
		else {
			if( this._originalUrl !== this._url ) {
				this._url = this._originalUrl;
				this._createEndpoint();
			}

			this._tryReconnect();
		}
	};

	/**
	 * Callback for messages received on the connection.
	 *
	 * @param   {String} message deepstream message
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._onMessage = function( message ) {
		var parsedMessages = messageParser.parse( message, this._client ),
			i;

		for( i = 0; i < parsedMessages.length; i++ ) {
			if( parsedMessages[ i ] === null ) {
				continue;
			}
			else if( parsedMessages[ i ].topic === C.TOPIC.CONNECTION ) {
				this._handleConnectionResponse( parsedMessages[ i ] );
			}
			else if( parsedMessages[ i ].topic === C.TOPIC.AUTH ) {
				this._handleAuthResponse( parsedMessages[ i ] );
			} else {
				this._client._$onMessage( parsedMessages[ i ] );
			}
		}
	};

	/**
	 * The connection response will indicate whether the deepstream connection
	 * can be used or if it should be forwarded to another instance. This
	 * allows us to introduce load-balancing if needed.
	 *
	 * If authentication parameters are already provided this will kick of
	 * authentication immediately. The actual 'open' event won't be emitted
	 * by the client until the authentication is successful.
	 *
	 * If a challenge is recieved, the user will send the url to the server
	 * in response to get the appropriate redirect. If the URL is invalid the
	 * server will respond with a REJECTION resulting in the client connection
	 * being permanently closed.
	 *
	 * If a redirect is recieved, this connection is closed and updated with
	 * a connection to the url supplied in the message.
	 *
	 * @param   {Object} message parsed connection message
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._handleConnectionResponse = function( message ) {
		var data;

		if( message.action === C.ACTIONS.ACK ) {
			this._setState( C.CONNECTION_STATE.AWAITING_AUTHENTICATION );
			if( this._authParams ) {
				this._sendAuthParams();
			}
		}
		else if( message.action === C.ACTIONS.CHALLENGE ) {
			this._setState( C.CONNECTION_STATE.CHALLENGING );
			this._endpoint.send( messageBuilder.getMsg( C.TOPIC.CONNECTION, C.ACTIONS.CHALLENGE_RESPONSE, [ this._originalUrl ] ) );
		}
		else if( message.action === C.ACTIONS.REJECTION ) {
			this._challengeDenied = true;
			this.close();
		}
		else if( message.action === C.ACTIONS.REDIRECT ) {
			this._url = message.data[ 0 ];
			this._redirecting = true;
			this._endpoint.close();
		}
		else if( message.action === C.ACTIONS.ERROR ) {
			if( message.data[ 0 ] === C.EVENT.CONNECTION_AUTHENTICATION_TIMEOUT ) {
				this._deliberateClose = true;
				this._connectionAuthenticationTimeout = true;
				this._client._$onError( C.TOPIC.CONNECTION, message.data[ 0 ], message.data[ 1 ] );
			}
		}
	};

	/**
	 * Callback for messages received for the AUTH topic. If
	 * the authentication was successful this method will
	 * open the connection and send all messages that the client
	 * tried to send so far.
	 *
	 * @param   {Object} message parsed auth message
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._handleAuthResponse = function( message ) {
		var data;

		if( message.action === C.ACTIONS.ERROR ) {

			if( message.data[ 0 ] === C.EVENT.TOO_MANY_AUTH_ATTEMPTS ) {
				this._deliberateClose = true;
				this._tooManyAuthAttempts = true;
			} else {
				this._setState( C.CONNECTION_STATE.AWAITING_AUTHENTICATION );
			}

			if( this._authCallback ) {
				this._authCallback( false, this._getAuthData( message.data[ 1 ] ) );
			}

		} else if( message.action === C.ACTIONS.ACK ) {
			this._setState( C.CONNECTION_STATE.OPEN );

			if( this._authCallback ) {
				this._authCallback( true, this._getAuthData( message.data[ 0 ] ) );
			}

			this._sendQueuedMessages();
		}
	};

	/**
	 * Checks if data is present with login ack and converts it
	 * to the correct type
	 *
	 * @param {Object} message parsed and validated deepstream message
	 *
	 * @private
	 * @returns {object}
	 */
	Connection.prototype._getAuthData = function( data ) {
		if( data === undefined ) {
			return null;
		} else {
			return messageParser.convertTyped( data, this._client );
		}
	};

	/**
	 * Updates the connection state and emits the
	 * connectionStateChanged event on the client
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._setState = function( state ) {
		this._state = state;
		this._client.emit( C.EVENT.CONNECTION_STATE_CHANGED, state );
	};

	/**
	 * If the connection drops or is closed in error this
	 * method schedules increasing reconnection intervals
	 *
	 * If the number of failed reconnection attempts exceeds
	 * options.maxReconnectAttempts the connection is closed
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._tryReconnect = function() {
		if( this._reconnectTimeout !== null ) {
			return;
		}

		if( this._reconnectionAttempt < this._options.maxReconnectAttempts ) {
			this._setState( C.CONNECTION_STATE.RECONNECTING );
			this._reconnectTimeout = setTimeout(
				this._tryOpen.bind( this ),
				Math.min(
					this._options.maxReconnectInterval,
					this._options.reconnectIntervalIncrement * this._reconnectionAttempt
				)
			);
			this._reconnectionAttempt++;
		} else {
			this._clearReconnect();
			this.close();
			this._client.emit( C.MAX_RECONNECTION_ATTEMPTS_REACHED, this._reconnectionAttempt );
		}
	};

	/**
	 * Attempts to open a errourosly closed connection
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._tryOpen = function() {
		this._endpoint.open();
		this._reconnectTimeout = null;
	};

	/**
	 * Stops all further reconnection attempts,
	 * either because the connection is open again
	 * or because the maximal number of reconnection
	 * attempts has been exceeded
	 *
	 * @private
	 * @returns {void}
	 */
	Connection.prototype._clearReconnect = function() {
		clearTimeout( this._reconnectTimeout );
		this._reconnectTimeout = null;
		this._reconnectionAttempt = 0;
	};

	module.exports = Connection;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports =  __webpack_require__(10);


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = __webpack_require__(11);

	/**
	 * Exports parser
	 *
	 * @api public
	 *
	 */
	module.exports.parser = __webpack_require__(18);


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */

	var transports = __webpack_require__(12);
	var Emitter = __webpack_require__(7);
	var debug = __webpack_require__(31)('engine.io-client:socket');
	var index = __webpack_require__(37);
	var parser = __webpack_require__(18);
	var parseuri = __webpack_require__(38);
	var parsejson = __webpack_require__(39);
	var parseqs = __webpack_require__(28);

	/**
	 * Module exports.
	 */

	module.exports = Socket;

	/**
	 * Noop function.
	 *
	 * @api private
	 */

	function noop(){}

	/**
	 * Socket constructor.
	 *
	 * @param {String|Object} uri or options
	 * @param {Object} options
	 * @api public
	 */

	function Socket(uri, opts){
	  if (!(this instanceof Socket)) return new Socket(uri, opts);

	  opts = opts || {};

	  if (uri && 'object' == typeof uri) {
	    opts = uri;
	    uri = null;
	  }

	  if (uri) {
	    uri = parseuri(uri);
	    opts.hostname = uri.host;
	    opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
	    opts.port = uri.port;
	    if (uri.query) opts.query = uri.query;
	  } else if (opts.host) {
	    opts.hostname = parseuri(opts.host).host;
	  }

	  this.secure = null != opts.secure ? opts.secure :
	    (global.location && 'https:' == location.protocol);

	  if (opts.hostname && !opts.port) {
	    // if no port is specified manually, use the protocol default
	    opts.port = this.secure ? '443' : '80';
	  }

	  this.agent = opts.agent || false;
	  this.hostname = opts.hostname ||
	    (global.location ? location.hostname : 'localhost');
	  this.port = opts.port || (global.location && location.port ?
	       location.port :
	       (this.secure ? 443 : 80));
	  this.query = opts.query || {};
	  if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
	  this.upgrade = false !== opts.upgrade;
	  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
	  this.forceJSONP = !!opts.forceJSONP;
	  this.jsonp = false !== opts.jsonp;
	  this.forceBase64 = !!opts.forceBase64;
	  this.enablesXDR = !!opts.enablesXDR;
	  this.timestampParam = opts.timestampParam || 't';
	  this.timestampRequests = opts.timestampRequests;
	  this.transports = opts.transports || ['polling', 'websocket'];
	  this.readyState = '';
	  this.writeBuffer = [];
	  this.policyPort = opts.policyPort || 843;
	  this.rememberUpgrade = opts.rememberUpgrade || false;
	  this.binaryType = null;
	  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
	  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

	  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
	  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
	    this.perMessageDeflate.threshold = 1024;
	  }

	  // SSL options for Node.js client
	  this.pfx = opts.pfx || null;
	  this.key = opts.key || null;
	  this.passphrase = opts.passphrase || null;
	  this.cert = opts.cert || null;
	  this.ca = opts.ca || null;
	  this.ciphers = opts.ciphers || null;
	  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;

	  // other options for Node.js client
	  var freeGlobal = typeof global == 'object' && global;
	  if (freeGlobal.global === freeGlobal) {
	    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
	      this.extraHeaders = opts.extraHeaders;
	    }
	  }

	  this.open();
	}

	Socket.priorWebsocketSuccess = false;

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Socket.prototype);

	/**
	 * Protocol version.
	 *
	 * @api public
	 */

	Socket.protocol = parser.protocol; // this is an int

	/**
	 * Expose deps for legacy compatibility
	 * and standalone browser access.
	 */

	Socket.Socket = Socket;
	Socket.Transport = __webpack_require__(17);
	Socket.transports = __webpack_require__(12);
	Socket.parser = __webpack_require__(18);

	/**
	 * Creates transport of the given type.
	 *
	 * @param {String} transport name
	 * @return {Transport}
	 * @api private
	 */

	Socket.prototype.createTransport = function (name) {
	  debug('creating transport "%s"', name);
	  var query = clone(this.query);

	  // append engine.io protocol identifier
	  query.EIO = parser.protocol;

	  // transport name
	  query.transport = name;

	  // session id if we already have one
	  if (this.id) query.sid = this.id;

	  var transport = new transports[name]({
	    agent: this.agent,
	    hostname: this.hostname,
	    port: this.port,
	    secure: this.secure,
	    path: this.path,
	    query: query,
	    forceJSONP: this.forceJSONP,
	    jsonp: this.jsonp,
	    forceBase64: this.forceBase64,
	    enablesXDR: this.enablesXDR,
	    timestampRequests: this.timestampRequests,
	    timestampParam: this.timestampParam,
	    policyPort: this.policyPort,
	    socket: this,
	    pfx: this.pfx,
	    key: this.key,
	    passphrase: this.passphrase,
	    cert: this.cert,
	    ca: this.ca,
	    ciphers: this.ciphers,
	    rejectUnauthorized: this.rejectUnauthorized,
	    perMessageDeflate: this.perMessageDeflate,
	    extraHeaders: this.extraHeaders
	  });

	  return transport;
	};

	function clone (obj) {
	  var o = {};
	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      o[i] = obj[i];
	    }
	  }
	  return o;
	}

	/**
	 * Initializes transport to use and starts probe.
	 *
	 * @api private
	 */
	Socket.prototype.open = function () {
	  var transport;
	  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
	    transport = 'websocket';
	  } else if (0 === this.transports.length) {
	    // Emit error on next tick so it can be listened to
	    var self = this;
	    setTimeout(function() {
	      self.emit('error', 'No transports available');
	    }, 0);
	    return;
	  } else {
	    transport = this.transports[0];
	  }
	  this.readyState = 'opening';

	  // Retry with the next transport if the transport is disabled (jsonp: false)
	  try {
	    transport = this.createTransport(transport);
	  } catch (e) {
	    this.transports.shift();
	    this.open();
	    return;
	  }

	  transport.open();
	  this.setTransport(transport);
	};

	/**
	 * Sets the current transport. Disables the existing one (if any).
	 *
	 * @api private
	 */

	Socket.prototype.setTransport = function(transport){
	  debug('setting transport %s', transport.name);
	  var self = this;

	  if (this.transport) {
	    debug('clearing existing transport %s', this.transport.name);
	    this.transport.removeAllListeners();
	  }

	  // set up transport
	  this.transport = transport;

	  // set up transport listeners
	  transport
	  .on('drain', function(){
	    self.onDrain();
	  })
	  .on('packet', function(packet){
	    self.onPacket(packet);
	  })
	  .on('error', function(e){
	    self.onError(e);
	  })
	  .on('close', function(){
	    self.onClose('transport close');
	  });
	};

	/**
	 * Probes a transport.
	 *
	 * @param {String} transport name
	 * @api private
	 */

	Socket.prototype.probe = function (name) {
	  debug('probing transport "%s"', name);
	  var transport = this.createTransport(name, { probe: 1 })
	    , failed = false
	    , self = this;

	  Socket.priorWebsocketSuccess = false;

	  function onTransportOpen(){
	    if (self.onlyBinaryUpgrades) {
	      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
	      failed = failed || upgradeLosesBinary;
	    }
	    if (failed) return;

	    debug('probe transport "%s" opened', name);
	    transport.send([{ type: 'ping', data: 'probe' }]);
	    transport.once('packet', function (msg) {
	      if (failed) return;
	      if ('pong' == msg.type && 'probe' == msg.data) {
	        debug('probe transport "%s" pong', name);
	        self.upgrading = true;
	        self.emit('upgrading', transport);
	        if (!transport) return;
	        Socket.priorWebsocketSuccess = 'websocket' == transport.name;

	        debug('pausing current transport "%s"', self.transport.name);
	        self.transport.pause(function () {
	          if (failed) return;
	          if ('closed' == self.readyState) return;
	          debug('changing transport and sending upgrade packet');

	          cleanup();

	          self.setTransport(transport);
	          transport.send([{ type: 'upgrade' }]);
	          self.emit('upgrade', transport);
	          transport = null;
	          self.upgrading = false;
	          self.flush();
	        });
	      } else {
	        debug('probe transport "%s" failed', name);
	        var err = new Error('probe error');
	        err.transport = transport.name;
	        self.emit('upgradeError', err);
	      }
	    });
	  }

	  function freezeTransport() {
	    if (failed) return;

	    // Any callback called by transport should be ignored since now
	    failed = true;

	    cleanup();

	    transport.close();
	    transport = null;
	  }

	  //Handle any error that happens while probing
	  function onerror(err) {
	    var error = new Error('probe error: ' + err);
	    error.transport = transport.name;

	    freezeTransport();

	    debug('probe transport "%s" failed because of error: %s', name, err);

	    self.emit('upgradeError', error);
	  }

	  function onTransportClose(){
	    onerror("transport closed");
	  }

	  //When the socket is closed while we're probing
	  function onclose(){
	    onerror("socket closed");
	  }

	  //When the socket is upgraded while we're probing
	  function onupgrade(to){
	    if (transport && to.name != transport.name) {
	      debug('"%s" works - aborting "%s"', to.name, transport.name);
	      freezeTransport();
	    }
	  }

	  //Remove all listeners on the transport and on self
	  function cleanup(){
	    transport.removeListener('open', onTransportOpen);
	    transport.removeListener('error', onerror);
	    transport.removeListener('close', onTransportClose);
	    self.removeListener('close', onclose);
	    self.removeListener('upgrading', onupgrade);
	  }

	  transport.once('open', onTransportOpen);
	  transport.once('error', onerror);
	  transport.once('close', onTransportClose);

	  this.once('close', onclose);
	  this.once('upgrading', onupgrade);

	  transport.open();

	};

	/**
	 * Called when connection is deemed open.
	 *
	 * @api public
	 */

	Socket.prototype.onOpen = function () {
	  debug('socket open');
	  this.readyState = 'open';
	  Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
	  this.emit('open');
	  this.flush();

	  // we check for `readyState` in case an `open`
	  // listener already closed the socket
	  if ('open' == this.readyState && this.upgrade && this.transport.pause) {
	    debug('starting upgrade probes');
	    for (var i = 0, l = this.upgrades.length; i < l; i++) {
	      this.probe(this.upgrades[i]);
	    }
	  }
	};

	/**
	 * Handles a packet.
	 *
	 * @api private
	 */

	Socket.prototype.onPacket = function (packet) {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

	    this.emit('packet', packet);

	    // Socket is live - any packet counts
	    this.emit('heartbeat');

	    switch (packet.type) {
	      case 'open':
	        this.onHandshake(parsejson(packet.data));
	        break;

	      case 'pong':
	        this.setPing();
	        this.emit('pong');
	        break;

	      case 'error':
	        var err = new Error('server error');
	        err.code = packet.data;
	        this.onError(err);
	        break;

	      case 'message':
	        this.emit('data', packet.data);
	        this.emit('message', packet.data);
	        break;
	    }
	  } else {
	    debug('packet received with socket readyState "%s"', this.readyState);
	  }
	};

	/**
	 * Called upon handshake completion.
	 *
	 * @param {Object} handshake obj
	 * @api private
	 */

	Socket.prototype.onHandshake = function (data) {
	  this.emit('handshake', data);
	  this.id = data.sid;
	  this.transport.query.sid = data.sid;
	  this.upgrades = this.filterUpgrades(data.upgrades);
	  this.pingInterval = data.pingInterval;
	  this.pingTimeout = data.pingTimeout;
	  this.onOpen();
	  // In case open handler closes socket
	  if  ('closed' == this.readyState) return;
	  this.setPing();

	  // Prolong liveness of socket on heartbeat
	  this.removeListener('heartbeat', this.onHeartbeat);
	  this.on('heartbeat', this.onHeartbeat);
	};

	/**
	 * Resets ping timeout.
	 *
	 * @api private
	 */

	Socket.prototype.onHeartbeat = function (timeout) {
	  clearTimeout(this.pingTimeoutTimer);
	  var self = this;
	  self.pingTimeoutTimer = setTimeout(function () {
	    if ('closed' == self.readyState) return;
	    self.onClose('ping timeout');
	  }, timeout || (self.pingInterval + self.pingTimeout));
	};

	/**
	 * Pings server every `this.pingInterval` and expects response
	 * within `this.pingTimeout` or closes connection.
	 *
	 * @api private
	 */

	Socket.prototype.setPing = function () {
	  var self = this;
	  clearTimeout(self.pingIntervalTimer);
	  self.pingIntervalTimer = setTimeout(function () {
	    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
	    self.ping();
	    self.onHeartbeat(self.pingTimeout);
	  }, self.pingInterval);
	};

	/**
	* Sends a ping packet.
	*
	* @api private
	*/

	Socket.prototype.ping = function () {
	  var self = this;
	  this.sendPacket('ping', function(){
	    self.emit('ping');
	  });
	};

	/**
	 * Called on `drain` event
	 *
	 * @api private
	 */

	Socket.prototype.onDrain = function() {
	  this.writeBuffer.splice(0, this.prevBufferLen);

	  // setting prevBufferLen = 0 is very important
	  // for example, when upgrading, upgrade packet is sent over,
	  // and a nonzero prevBufferLen could cause problems on `drain`
	  this.prevBufferLen = 0;

	  if (0 === this.writeBuffer.length) {
	    this.emit('drain');
	  } else {
	    this.flush();
	  }
	};

	/**
	 * Flush write buffers.
	 *
	 * @api private
	 */

	Socket.prototype.flush = function () {
	  if ('closed' != this.readyState && this.transport.writable &&
	    !this.upgrading && this.writeBuffer.length) {
	    debug('flushing %d packets in socket', this.writeBuffer.length);
	    this.transport.send(this.writeBuffer);
	    // keep track of current length of writeBuffer
	    // splice writeBuffer and callbackBuffer on `drain`
	    this.prevBufferLen = this.writeBuffer.length;
	    this.emit('flush');
	  }
	};

	/**
	 * Sends a message.
	 *
	 * @param {String} message.
	 * @param {Function} callback function.
	 * @param {Object} options.
	 * @return {Socket} for chaining.
	 * @api public
	 */

	Socket.prototype.write =
	Socket.prototype.send = function (msg, options, fn) {
	  this.sendPacket('message', msg, options, fn);
	  return this;
	};

	/**
	 * Sends a packet.
	 *
	 * @param {String} packet type.
	 * @param {String} data.
	 * @param {Object} options.
	 * @param {Function} callback function.
	 * @api private
	 */

	Socket.prototype.sendPacket = function (type, data, options, fn) {
	  if('function' == typeof data) {
	    fn = data;
	    data = undefined;
	  }

	  if ('function' == typeof options) {
	    fn = options;
	    options = null;
	  }

	  if ('closing' == this.readyState || 'closed' == this.readyState) {
	    return;
	  }

	  options = options || {};
	  options.compress = false !== options.compress;

	  var packet = {
	    type: type,
	    data: data,
	    options: options
	  };
	  this.emit('packetCreate', packet);
	  this.writeBuffer.push(packet);
	  if (fn) this.once('flush', fn);
	  this.flush();
	};

	/**
	 * Closes the connection.
	 *
	 * @api private
	 */

	Socket.prototype.close = function () {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    this.readyState = 'closing';

	    var self = this;

	    if (this.writeBuffer.length) {
	      this.once('drain', function() {
	        if (this.upgrading) {
	          waitForUpgrade();
	        } else {
	          close();
	        }
	      });
	    } else if (this.upgrading) {
	      waitForUpgrade();
	    } else {
	      close();
	    }
	  }

	  function close() {
	    self.onClose('forced close');
	    debug('socket closing - telling transport to close');
	    self.transport.close();
	  }

	  function cleanupAndClose() {
	    self.removeListener('upgrade', cleanupAndClose);
	    self.removeListener('upgradeError', cleanupAndClose);
	    close();
	  }

	  function waitForUpgrade() {
	    // wait for upgrade to finish since we can't send packets while pausing a transport
	    self.once('upgrade', cleanupAndClose);
	    self.once('upgradeError', cleanupAndClose);
	  }

	  return this;
	};

	/**
	 * Called upon transport error
	 *
	 * @api private
	 */

	Socket.prototype.onError = function (err) {
	  debug('socket error %j', err);
	  Socket.priorWebsocketSuccess = false;
	  this.emit('error', err);
	  this.onClose('transport error', err);
	};

	/**
	 * Called upon transport close.
	 *
	 * @api private
	 */

	Socket.prototype.onClose = function (reason, desc) {
	  if ('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState) {
	    debug('socket close with reason: "%s"', reason);
	    var self = this;

	    // clear timers
	    clearTimeout(this.pingIntervalTimer);
	    clearTimeout(this.pingTimeoutTimer);

	    // stop event from firing again for transport
	    this.transport.removeAllListeners('close');

	    // ensure transport won't stay open
	    this.transport.close();

	    // ignore further transport communication
	    this.transport.removeAllListeners();

	    // set ready state
	    this.readyState = 'closed';

	    // clear session id
	    this.id = null;

	    // emit close event
	    this.emit('close', reason, desc);

	    // clean buffers after, so users can still
	    // grab the buffers on `close` event
	    self.writeBuffer = [];
	    self.prevBufferLen = 0;
	  }
	};

	/**
	 * Filters upgrades, returning only those matching client transports.
	 *
	 * @param {Array} server upgrades
	 * @api private
	 *
	 */

	Socket.prototype.filterUpgrades = function (upgrades) {
	  var filteredUpgrades = [];
	  for (var i = 0, j = upgrades.length; i<j; i++) {
	    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
	  }
	  return filteredUpgrades;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies
	 */

	var XMLHttpRequest = __webpack_require__(13);
	var XHR = __webpack_require__(15);
	var JSONP = __webpack_require__(34);
	var websocket = __webpack_require__(35);

	/**
	 * Export transports.
	 */

	exports.polling = polling;
	exports.websocket = websocket;

	/**
	 * Polling transport polymorphic constructor.
	 * Decides on xhr vs jsonp based on feature detection.
	 *
	 * @api private
	 */

	function polling(opts){
	  var xhr;
	  var xd = false;
	  var xs = false;
	  var jsonp = false !== opts.jsonp;

	  if (global.location) {
	    var isSSL = 'https:' == location.protocol;
	    var port = location.port;

	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }

	    xd = opts.hostname != location.hostname || port != opts.port;
	    xs = opts.secure != isSSL;
	  }

	  opts.xdomain = xd;
	  opts.xscheme = xs;
	  xhr = new XMLHttpRequest(opts);

	  if ('open' in xhr && !opts.forceJSONP) {
	    return new XHR(opts);
	  } else {
	    if (!jsonp) throw new Error('JSONP disabled');
	    return new JSONP(opts);
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// browser shim for xmlhttprequest module
	var hasCORS = __webpack_require__(14);

	module.exports = function(opts) {
	  var xdomain = opts.xdomain;

	  // scheme must be same when usign XDomainRequest
	  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
	  var xscheme = opts.xscheme;

	  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
	  // https://github.com/Automattic/engine.io-client/pull/217
	  var enablesXDR = opts.enablesXDR;

	  // XMLHttpRequest can be disabled on IE
	  try {
	    if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
	      return new XMLHttpRequest();
	    }
	  } catch (e) { }

	  // Use XDomainRequest for IE8 if enablesXDR is true
	  // because loading bar keeps flashing when using jsonp-polling
	  // https://github.com/yujiosaka/socke.io-ie8-loading-example
	  try {
	    if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
	      return new XDomainRequest();
	    }
	  } catch (e) { }

	  if (!xdomain) {
	    try {
	      return new ActiveXObject('Microsoft.XMLHTTP');
	    } catch(e) { }
	  }
	}


/***/ },
/* 14 */
/***/ function(module, exports) {

	
	/**
	 * Module exports.
	 *
	 * Logic borrowed from Modernizr:
	 *
	 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
	 */

	try {
	  module.exports = typeof XMLHttpRequest !== 'undefined' &&
	    'withCredentials' in new XMLHttpRequest();
	} catch (err) {
	  // if XMLHttp support is disabled in IE then it will throw
	  // when trying to create
	  module.exports = false;
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module requirements.
	 */

	var XMLHttpRequest = __webpack_require__(13);
	var Polling = __webpack_require__(16);
	var Emitter = __webpack_require__(7);
	var inherit = __webpack_require__(29);
	var debug = __webpack_require__(31)('engine.io-client:polling-xhr');

	/**
	 * Module exports.
	 */

	module.exports = XHR;
	module.exports.Request = Request;

	/**
	 * Empty function
	 */

	function empty(){}

	/**
	 * XHR Polling constructor.
	 *
	 * @param {Object} opts
	 * @api public
	 */

	function XHR(opts){
	  Polling.call(this, opts);

	  if (global.location) {
	    var isSSL = 'https:' == location.protocol;
	    var port = location.port;

	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }

	    this.xd = opts.hostname != global.location.hostname ||
	      port != opts.port;
	    this.xs = opts.secure != isSSL;
	  } else {
	    this.extraHeaders = opts.extraHeaders;
	  }
	}

	/**
	 * Inherits from Polling.
	 */

	inherit(XHR, Polling);

	/**
	 * XHR supports binary
	 */

	XHR.prototype.supportsBinary = true;

	/**
	 * Creates a request.
	 *
	 * @param {String} method
	 * @api private
	 */

	XHR.prototype.request = function(opts){
	  opts = opts || {};
	  opts.uri = this.uri();
	  opts.xd = this.xd;
	  opts.xs = this.xs;
	  opts.agent = this.agent || false;
	  opts.supportsBinary = this.supportsBinary;
	  opts.enablesXDR = this.enablesXDR;

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;

	  // other options for Node.js client
	  opts.extraHeaders = this.extraHeaders;

	  return new Request(opts);
	};

	/**
	 * Sends data.
	 *
	 * @param {String} data to send.
	 * @param {Function} called upon flush.
	 * @api private
	 */

	XHR.prototype.doWrite = function(data, fn){
	  var isBinary = typeof data !== 'string' && data !== undefined;
	  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
	  var self = this;
	  req.on('success', fn);
	  req.on('error', function(err){
	    self.onError('xhr post error', err);
	  });
	  this.sendXhr = req;
	};

	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */

	XHR.prototype.doPoll = function(){
	  debug('xhr poll');
	  var req = this.request();
	  var self = this;
	  req.on('data', function(data){
	    self.onData(data);
	  });
	  req.on('error', function(err){
	    self.onError('xhr poll error', err);
	  });
	  this.pollXhr = req;
	};

	/**
	 * Request constructor
	 *
	 * @param {Object} options
	 * @api public
	 */

	function Request(opts){
	  this.method = opts.method || 'GET';
	  this.uri = opts.uri;
	  this.xd = !!opts.xd;
	  this.xs = !!opts.xs;
	  this.async = false !== opts.async;
	  this.data = undefined != opts.data ? opts.data : null;
	  this.agent = opts.agent;
	  this.isBinary = opts.isBinary;
	  this.supportsBinary = opts.supportsBinary;
	  this.enablesXDR = opts.enablesXDR;

	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;

	  // other options for Node.js client
	  this.extraHeaders = opts.extraHeaders;

	  this.create();
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Request.prototype);

	/**
	 * Creates the XHR object and sends the request.
	 *
	 * @api private
	 */

	Request.prototype.create = function(){
	  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;

	  var xhr = this.xhr = new XMLHttpRequest(opts);
	  var self = this;

	  try {
	    debug('xhr open %s: %s', this.method, this.uri);
	    xhr.open(this.method, this.uri, this.async);
	    try {
	      if (this.extraHeaders) {
	        xhr.setDisableHeaderCheck(true);
	        for (var i in this.extraHeaders) {
	          if (this.extraHeaders.hasOwnProperty(i)) {
	            xhr.setRequestHeader(i, this.extraHeaders[i]);
	          }
	        }
	      }
	    } catch (e) {}
	    if (this.supportsBinary) {
	      // This has to be done after open because Firefox is stupid
	      // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
	      xhr.responseType = 'arraybuffer';
	    }

	    if ('POST' == this.method) {
	      try {
	        if (this.isBinary) {
	          xhr.setRequestHeader('Content-type', 'application/octet-stream');
	        } else {
	          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
	        }
	      } catch (e) {}
	    }

	    // ie6 check
	    if ('withCredentials' in xhr) {
	      xhr.withCredentials = true;
	    }

	    if (this.hasXDR()) {
	      xhr.onload = function(){
	        self.onLoad();
	      };
	      xhr.onerror = function(){
	        self.onError(xhr.responseText);
	      };
	    } else {
	      xhr.onreadystatechange = function(){
	        if (4 != xhr.readyState) return;
	        if (200 == xhr.status || 1223 == xhr.status) {
	          self.onLoad();
	        } else {
	          // make sure the `error` event handler that's user-set
	          // does not throw in the same tick and gets caught here
	          setTimeout(function(){
	            self.onError(xhr.status);
	          }, 0);
	        }
	      };
	    }

	    debug('xhr data %s', this.data);
	    xhr.send(this.data);
	  } catch (e) {
	    // Need to defer since .create() is called directly fhrom the constructor
	    // and thus the 'error' event can only be only bound *after* this exception
	    // occurs.  Therefore, also, we cannot throw here at all.
	    setTimeout(function() {
	      self.onError(e);
	    }, 0);
	    return;
	  }

	  if (global.document) {
	    this.index = Request.requestsCount++;
	    Request.requests[this.index] = this;
	  }
	};

	/**
	 * Called upon successful response.
	 *
	 * @api private
	 */

	Request.prototype.onSuccess = function(){
	  this.emit('success');
	  this.cleanup();
	};

	/**
	 * Called if we have data.
	 *
	 * @api private
	 */

	Request.prototype.onData = function(data){
	  this.emit('data', data);
	  this.onSuccess();
	};

	/**
	 * Called upon error.
	 *
	 * @api private
	 */

	Request.prototype.onError = function(err){
	  this.emit('error', err);
	  this.cleanup(true);
	};

	/**
	 * Cleans up house.
	 *
	 * @api private
	 */

	Request.prototype.cleanup = function(fromError){
	  if ('undefined' == typeof this.xhr || null === this.xhr) {
	    return;
	  }
	  // xmlhttprequest
	  if (this.hasXDR()) {
	    this.xhr.onload = this.xhr.onerror = empty;
	  } else {
	    this.xhr.onreadystatechange = empty;
	  }

	  if (fromError) {
	    try {
	      this.xhr.abort();
	    } catch(e) {}
	  }

	  if (global.document) {
	    delete Request.requests[this.index];
	  }

	  this.xhr = null;
	};

	/**
	 * Called upon load.
	 *
	 * @api private
	 */

	Request.prototype.onLoad = function(){
	  var data;
	  try {
	    var contentType;
	    try {
	      contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];
	    } catch (e) {}
	    if (contentType === 'application/octet-stream') {
	      data = this.xhr.response;
	    } else {
	      if (!this.supportsBinary) {
	        data = this.xhr.responseText;
	      } else {
	        try {
	          data = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response));
	        } catch (e) {
	          var ui8Arr = new Uint8Array(this.xhr.response);
	          var dataArray = [];
	          for (var idx = 0, length = ui8Arr.length; idx < length; idx++) {
	            dataArray.push(ui8Arr[idx]);
	          }

	          data = String.fromCharCode.apply(null, dataArray);
	        }
	      }
	    }
	  } catch (e) {
	    this.onError(e);
	  }
	  if (null != data) {
	    this.onData(data);
	  }
	};

	/**
	 * Check if it has XDomainRequest.
	 *
	 * @api private
	 */

	Request.prototype.hasXDR = function(){
	  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
	};

	/**
	 * Aborts the request.
	 *
	 * @api public
	 */

	Request.prototype.abort = function(){
	  this.cleanup();
	};

	/**
	 * Aborts pending requests when unloading the window. This is needed to prevent
	 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
	 * emitted.
	 */

	if (global.document) {
	  Request.requestsCount = 0;
	  Request.requests = {};
	  if (global.attachEvent) {
	    global.attachEvent('onunload', unloadHandler);
	  } else if (global.addEventListener) {
	    global.addEventListener('beforeunload', unloadHandler, false);
	  }
	}

	function unloadHandler() {
	  for (var i in Request.requests) {
	    if (Request.requests.hasOwnProperty(i)) {
	      Request.requests[i].abort();
	    }
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Transport = __webpack_require__(17);
	var parseqs = __webpack_require__(28);
	var parser = __webpack_require__(18);
	var inherit = __webpack_require__(29);
	var yeast = __webpack_require__(30);
	var debug = __webpack_require__(31)('engine.io-client:polling');

	/**
	 * Module exports.
	 */

	module.exports = Polling;

	/**
	 * Is XHR2 supported?
	 */

	var hasXHR2 = (function() {
	  var XMLHttpRequest = __webpack_require__(13);
	  var xhr = new XMLHttpRequest({ xdomain: false });
	  return null != xhr.responseType;
	})();

	/**
	 * Polling interface.
	 *
	 * @param {Object} opts
	 * @api private
	 */

	function Polling(opts){
	  var forceBase64 = (opts && opts.forceBase64);
	  if (!hasXHR2 || forceBase64) {
	    this.supportsBinary = false;
	  }
	  Transport.call(this, opts);
	}

	/**
	 * Inherits from Transport.
	 */

	inherit(Polling, Transport);

	/**
	 * Transport name.
	 */

	Polling.prototype.name = 'polling';

	/**
	 * Opens the socket (triggers polling). We write a PING message to determine
	 * when the transport is open.
	 *
	 * @api private
	 */

	Polling.prototype.doOpen = function(){
	  this.poll();
	};

	/**
	 * Pauses polling.
	 *
	 * @param {Function} callback upon buffers are flushed and transport is paused
	 * @api private
	 */

	Polling.prototype.pause = function(onPause){
	  var pending = 0;
	  var self = this;

	  this.readyState = 'pausing';

	  function pause(){
	    debug('paused');
	    self.readyState = 'paused';
	    onPause();
	  }

	  if (this.polling || !this.writable) {
	    var total = 0;

	    if (this.polling) {
	      debug('we are currently polling - waiting to pause');
	      total++;
	      this.once('pollComplete', function(){
	        debug('pre-pause polling complete');
	        --total || pause();
	      });
	    }

	    if (!this.writable) {
	      debug('we are currently writing - waiting to pause');
	      total++;
	      this.once('drain', function(){
	        debug('pre-pause writing complete');
	        --total || pause();
	      });
	    }
	  } else {
	    pause();
	  }
	};

	/**
	 * Starts polling cycle.
	 *
	 * @api public
	 */

	Polling.prototype.poll = function(){
	  debug('polling');
	  this.polling = true;
	  this.doPoll();
	  this.emit('poll');
	};

	/**
	 * Overloads onData to detect payloads.
	 *
	 * @api private
	 */

	Polling.prototype.onData = function(data){
	  var self = this;
	  debug('polling got data %s', data);
	  var callback = function(packet, index, total) {
	    // if its the first message we consider the transport open
	    if ('opening' == self.readyState) {
	      self.onOpen();
	    }

	    // if its a close packet, we close the ongoing requests
	    if ('close' == packet.type) {
	      self.onClose();
	      return false;
	    }

	    // otherwise bypass onData and handle the message
	    self.onPacket(packet);
	  };

	  // decode payload
	  parser.decodePayload(data, this.socket.binaryType, callback);

	  // if an event did not trigger closing
	  if ('closed' != this.readyState) {
	    // if we got data we're not polling
	    this.polling = false;
	    this.emit('pollComplete');

	    if ('open' == this.readyState) {
	      this.poll();
	    } else {
	      debug('ignoring poll - transport state "%s"', this.readyState);
	    }
	  }
	};

	/**
	 * For polling, send a close packet.
	 *
	 * @api private
	 */

	Polling.prototype.doClose = function(){
	  var self = this;

	  function close(){
	    debug('writing close packet');
	    self.write([{ type: 'close' }]);
	  }

	  if ('open' == this.readyState) {
	    debug('transport open - closing');
	    close();
	  } else {
	    // in case we're trying to close while
	    // handshaking is in progress (GH-164)
	    debug('transport not open - deferring close');
	    this.once('open', close);
	  }
	};

	/**
	 * Writes a packets payload.
	 *
	 * @param {Array} data packets
	 * @param {Function} drain callback
	 * @api private
	 */

	Polling.prototype.write = function(packets){
	  var self = this;
	  this.writable = false;
	  var callbackfn = function() {
	    self.writable = true;
	    self.emit('drain');
	  };

	  var self = this;
	  parser.encodePayload(packets, this.supportsBinary, function(data) {
	    self.doWrite(data, callbackfn);
	  });
	};

	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */

	Polling.prototype.uri = function(){
	  var query = this.query || {};
	  var schema = this.secure ? 'https' : 'http';
	  var port = '';

	  // cache busting is forced
	  if (false !== this.timestampRequests) {
	    query[this.timestampParam] = yeast();
	  }

	  if (!this.supportsBinary && !query.sid) {
	    query.b64 = 1;
	  }

	  query = parseqs.encode(query);

	  // avoid port if default for schema
	  if (this.port && (('https' == schema && this.port != 443) ||
	     ('http' == schema && this.port != 80))) {
	    port = ':' + this.port;
	  }

	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }

	  var ipv6 = this.hostname.indexOf(':') !== -1;
	  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var parser = __webpack_require__(18);
	var Emitter = __webpack_require__(7);

	/**
	 * Module exports.
	 */

	module.exports = Transport;

	/**
	 * Transport abstract constructor.
	 *
	 * @param {Object} options.
	 * @api private
	 */

	function Transport (opts) {
	  this.path = opts.path;
	  this.hostname = opts.hostname;
	  this.port = opts.port;
	  this.secure = opts.secure;
	  this.query = opts.query;
	  this.timestampParam = opts.timestampParam;
	  this.timestampRequests = opts.timestampRequests;
	  this.readyState = '';
	  this.agent = opts.agent || false;
	  this.socket = opts.socket;
	  this.enablesXDR = opts.enablesXDR;

	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;

	  // other options for Node.js client
	  this.extraHeaders = opts.extraHeaders;
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Transport.prototype);

	/**
	 * Emits an error.
	 *
	 * @param {String} str
	 * @return {Transport} for chaining
	 * @api public
	 */

	Transport.prototype.onError = function (msg, desc) {
	  var err = new Error(msg);
	  err.type = 'TransportError';
	  err.description = desc;
	  this.emit('error', err);
	  return this;
	};

	/**
	 * Opens the transport.
	 *
	 * @api public
	 */

	Transport.prototype.open = function () {
	  if ('closed' == this.readyState || '' == this.readyState) {
	    this.readyState = 'opening';
	    this.doOpen();
	  }

	  return this;
	};

	/**
	 * Closes the transport.
	 *
	 * @api private
	 */

	Transport.prototype.close = function () {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    this.doClose();
	    this.onClose();
	  }

	  return this;
	};

	/**
	 * Sends multiple packets.
	 *
	 * @param {Array} packets
	 * @api private
	 */

	Transport.prototype.send = function(packets){
	  if ('open' == this.readyState) {
	    this.write(packets);
	  } else {
	    throw new Error('Transport not open');
	  }
	};

	/**
	 * Called upon open
	 *
	 * @api private
	 */

	Transport.prototype.onOpen = function () {
	  this.readyState = 'open';
	  this.writable = true;
	  this.emit('open');
	};

	/**
	 * Called with data.
	 *
	 * @param {String} data
	 * @api private
	 */

	Transport.prototype.onData = function(data){
	  var packet = parser.decodePacket(data, this.socket.binaryType);
	  this.onPacket(packet);
	};

	/**
	 * Called with a decoded packet.
	 */

	Transport.prototype.onPacket = function (packet) {
	  this.emit('packet', packet);
	};

	/**
	 * Called upon close.
	 *
	 * @api private
	 */

	Transport.prototype.onClose = function () {
	  this.readyState = 'closed';
	  this.emit('close');
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */

	var keys = __webpack_require__(19);
	var hasBinary = __webpack_require__(20);
	var sliceBuffer = __webpack_require__(22);
	var base64encoder = __webpack_require__(23);
	var after = __webpack_require__(24);
	var utf8 = __webpack_require__(25);

	/**
	 * Check if we are running an android browser. That requires us to use
	 * ArrayBuffer with polling transports...
	 *
	 * http://ghinda.net/jpeg-blob-ajax-android/
	 */

	var isAndroid = navigator.userAgent.match(/Android/i);

	/**
	 * Check if we are running in PhantomJS.
	 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
	 * https://github.com/ariya/phantomjs/issues/11395
	 * @type boolean
	 */
	var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);

	/**
	 * When true, avoids using Blobs to encode payloads.
	 * @type boolean
	 */
	var dontSendBlobs = isAndroid || isPhantomJS;

	/**
	 * Current protocol version.
	 */

	exports.protocol = 3;

	/**
	 * Packet types.
	 */

	var packets = exports.packets = {
	    open:     0    // non-ws
	  , close:    1    // non-ws
	  , ping:     2
	  , pong:     3
	  , message:  4
	  , upgrade:  5
	  , noop:     6
	};

	var packetslist = keys(packets);

	/**
	 * Premade error packet.
	 */

	var err = { type: 'error', data: 'parser error' };

	/**
	 * Create a blob api even for blob builder when vendor prefixes exist
	 */

	var Blob = __webpack_require__(27);

	/**
	 * Encodes a packet.
	 *
	 *     <packet type id> [ <data> ]
	 *
	 * Example:
	 *
	 *     5hello world
	 *     3
	 *     4
	 *
	 * Binary is encoded in an identical principle
	 *
	 * @api private
	 */

	exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
	  if ('function' == typeof supportsBinary) {
	    callback = supportsBinary;
	    supportsBinary = false;
	  }

	  if ('function' == typeof utf8encode) {
	    callback = utf8encode;
	    utf8encode = null;
	  }

	  var data = (packet.data === undefined)
	    ? undefined
	    : packet.data.buffer || packet.data;

	  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
	    return encodeArrayBuffer(packet, supportsBinary, callback);
	  } else if (Blob && data instanceof global.Blob) {
	    return encodeBlob(packet, supportsBinary, callback);
	  }

	  // might be an object with { base64: true, data: dataAsBase64String }
	  if (data && data.base64) {
	    return encodeBase64Object(packet, callback);
	  }

	  // Sending data as a utf-8 string
	  var encoded = packets[packet.type];

	  // data fragment is optional
	  if (undefined !== packet.data) {
	    encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
	  }

	  return callback('' + encoded);

	};

	function encodeBase64Object(packet, callback) {
	  // packet data is an object { base64: true, data: dataAsBase64String }
	  var message = 'b' + exports.packets[packet.type] + packet.data.data;
	  return callback(message);
	}

	/**
	 * Encode packet helpers for binary types
	 */

	function encodeArrayBuffer(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  var data = packet.data;
	  var contentArray = new Uint8Array(data);
	  var resultBuffer = new Uint8Array(1 + data.byteLength);

	  resultBuffer[0] = packets[packet.type];
	  for (var i = 0; i < contentArray.length; i++) {
	    resultBuffer[i+1] = contentArray[i];
	  }

	  return callback(resultBuffer.buffer);
	}

	function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  var fr = new FileReader();
	  fr.onload = function() {
	    packet.data = fr.result;
	    exports.encodePacket(packet, supportsBinary, true, callback);
	  };
	  return fr.readAsArrayBuffer(packet.data);
	}

	function encodeBlob(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  if (dontSendBlobs) {
	    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
	  }

	  var length = new Uint8Array(1);
	  length[0] = packets[packet.type];
	  var blob = new Blob([length.buffer, packet.data]);

	  return callback(blob);
	}

	/**
	 * Encodes a packet with binary data in a base64 string
	 *
	 * @param {Object} packet, has `type` and `data`
	 * @return {String} base64 encoded message
	 */

	exports.encodeBase64Packet = function(packet, callback) {
	  var message = 'b' + exports.packets[packet.type];
	  if (Blob && packet.data instanceof global.Blob) {
	    var fr = new FileReader();
	    fr.onload = function() {
	      var b64 = fr.result.split(',')[1];
	      callback(message + b64);
	    };
	    return fr.readAsDataURL(packet.data);
	  }

	  var b64data;
	  try {
	    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
	  } catch (e) {
	    // iPhone Safari doesn't let you apply with typed arrays
	    var typed = new Uint8Array(packet.data);
	    var basic = new Array(typed.length);
	    for (var i = 0; i < typed.length; i++) {
	      basic[i] = typed[i];
	    }
	    b64data = String.fromCharCode.apply(null, basic);
	  }
	  message += global.btoa(b64data);
	  return callback(message);
	};

	/**
	 * Decodes a packet. Changes format to Blob if requested.
	 *
	 * @return {Object} with `type` and `data` (if any)
	 * @api private
	 */

	exports.decodePacket = function (data, binaryType, utf8decode) {
	  // String data
	  if (typeof data == 'string' || data === undefined) {
	    if (data.charAt(0) == 'b') {
	      return exports.decodeBase64Packet(data.substr(1), binaryType);
	    }

	    if (utf8decode) {
	      try {
	        data = utf8.decode(data);
	      } catch (e) {
	        return err;
	      }
	    }
	    var type = data.charAt(0);

	    if (Number(type) != type || !packetslist[type]) {
	      return err;
	    }

	    if (data.length > 1) {
	      return { type: packetslist[type], data: data.substring(1) };
	    } else {
	      return { type: packetslist[type] };
	    }
	  }

	  var asArray = new Uint8Array(data);
	  var type = asArray[0];
	  var rest = sliceBuffer(data, 1);
	  if (Blob && binaryType === 'blob') {
	    rest = new Blob([rest]);
	  }
	  return { type: packetslist[type], data: rest };
	};

	/**
	 * Decodes a packet encoded in a base64 string
	 *
	 * @param {String} base64 encoded message
	 * @return {Object} with `type` and `data` (if any)
	 */

	exports.decodeBase64Packet = function(msg, binaryType) {
	  var type = packetslist[msg.charAt(0)];
	  if (!global.ArrayBuffer) {
	    return { type: type, data: { base64: true, data: msg.substr(1) } };
	  }

	  var data = base64encoder.decode(msg.substr(1));

	  if (binaryType === 'blob' && Blob) {
	    data = new Blob([data]);
	  }

	  return { type: type, data: data };
	};

	/**
	 * Encodes multiple messages (payload).
	 *
	 *     <length>:data
	 *
	 * Example:
	 *
	 *     11:hello world2:hi
	 *
	 * If any contents are binary, they will be encoded as base64 strings. Base64
	 * encoded strings are marked with a b before the length specifier
	 *
	 * @param {Array} packets
	 * @api private
	 */

	exports.encodePayload = function (packets, supportsBinary, callback) {
	  if (typeof supportsBinary == 'function') {
	    callback = supportsBinary;
	    supportsBinary = null;
	  }

	  var isBinary = hasBinary(packets);

	  if (supportsBinary && isBinary) {
	    if (Blob && !dontSendBlobs) {
	      return exports.encodePayloadAsBlob(packets, callback);
	    }

	    return exports.encodePayloadAsArrayBuffer(packets, callback);
	  }

	  if (!packets.length) {
	    return callback('0:');
	  }

	  function setLengthHeader(message) {
	    return message.length + ':' + message;
	  }

	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function(message) {
	      doneCallback(null, setLengthHeader(message));
	    });
	  }

	  map(packets, encodeOne, function(err, results) {
	    return callback(results.join(''));
	  });
	};

	/**
	 * Async array map using after
	 */

	function map(ary, each, done) {
	  var result = new Array(ary.length);
	  var next = after(ary.length, done);

	  var eachWithIndex = function(i, el, cb) {
	    each(el, function(error, msg) {
	      result[i] = msg;
	      cb(error, result);
	    });
	  };

	  for (var i = 0; i < ary.length; i++) {
	    eachWithIndex(i, ary[i], next);
	  }
	}

	/*
	 * Decodes data when a payload is maybe expected. Possible binary contents are
	 * decoded from their base64 representation
	 *
	 * @param {String} data, callback method
	 * @api public
	 */

	exports.decodePayload = function (data, binaryType, callback) {
	  if (typeof data != 'string') {
	    return exports.decodePayloadAsBinary(data, binaryType, callback);
	  }

	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }

	  var packet;
	  if (data == '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }

	  var length = ''
	    , n, msg;

	  for (var i = 0, l = data.length; i < l; i++) {
	    var chr = data.charAt(i);

	    if (':' != chr) {
	      length += chr;
	    } else {
	      if ('' == length || (length != (n = Number(length)))) {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	      }

	      msg = data.substr(i + 1, n);

	      if (length != msg.length) {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	      }

	      if (msg.length) {
	        packet = exports.decodePacket(msg, binaryType, true);

	        if (err.type == packet.type && err.data == packet.data) {
	          // parser error in individual packet - ignoring payload
	          return callback(err, 0, 1);
	        }

	        var ret = callback(packet, i + n, l);
	        if (false === ret) return;
	      }

	      // advance cursor
	      i += n;
	      length = '';
	    }
	  }

	  if (length != '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }

	};

	/**
	 * Encodes multiple messages (payload) as binary.
	 *
	 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
	 * 255><data>
	 *
	 * Example:
	 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
	 *
	 * @param {Array} packets
	 * @return {ArrayBuffer} encoded payload
	 * @api private
	 */

	exports.encodePayloadAsArrayBuffer = function(packets, callback) {
	  if (!packets.length) {
	    return callback(new ArrayBuffer(0));
	  }

	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, true, true, function(data) {
	      return doneCallback(null, data);
	    });
	  }

	  map(packets, encodeOne, function(err, encodedPackets) {
	    var totalLength = encodedPackets.reduce(function(acc, p) {
	      var len;
	      if (typeof p === 'string'){
	        len = p.length;
	      } else {
	        len = p.byteLength;
	      }
	      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
	    }, 0);

	    var resultArray = new Uint8Array(totalLength);

	    var bufferIndex = 0;
	    encodedPackets.forEach(function(p) {
	      var isString = typeof p === 'string';
	      var ab = p;
	      if (isString) {
	        var view = new Uint8Array(p.length);
	        for (var i = 0; i < p.length; i++) {
	          view[i] = p.charCodeAt(i);
	        }
	        ab = view.buffer;
	      }

	      if (isString) { // not true binary
	        resultArray[bufferIndex++] = 0;
	      } else { // true binary
	        resultArray[bufferIndex++] = 1;
	      }

	      var lenStr = ab.byteLength.toString();
	      for (var i = 0; i < lenStr.length; i++) {
	        resultArray[bufferIndex++] = parseInt(lenStr[i]);
	      }
	      resultArray[bufferIndex++] = 255;

	      var view = new Uint8Array(ab);
	      for (var i = 0; i < view.length; i++) {
	        resultArray[bufferIndex++] = view[i];
	      }
	    });

	    return callback(resultArray.buffer);
	  });
	};

	/**
	 * Encode as Blob
	 */

	exports.encodePayloadAsBlob = function(packets, callback) {
	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, true, true, function(encoded) {
	      var binaryIdentifier = new Uint8Array(1);
	      binaryIdentifier[0] = 1;
	      if (typeof encoded === 'string') {
	        var view = new Uint8Array(encoded.length);
	        for (var i = 0; i < encoded.length; i++) {
	          view[i] = encoded.charCodeAt(i);
	        }
	        encoded = view.buffer;
	        binaryIdentifier[0] = 0;
	      }

	      var len = (encoded instanceof ArrayBuffer)
	        ? encoded.byteLength
	        : encoded.size;

	      var lenStr = len.toString();
	      var lengthAry = new Uint8Array(lenStr.length + 1);
	      for (var i = 0; i < lenStr.length; i++) {
	        lengthAry[i] = parseInt(lenStr[i]);
	      }
	      lengthAry[lenStr.length] = 255;

	      if (Blob) {
	        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
	        doneCallback(null, blob);
	      }
	    });
	  }

	  map(packets, encodeOne, function(err, results) {
	    return callback(new Blob(results));
	  });
	};

	/*
	 * Decodes data when a payload is maybe expected. Strings are decoded by
	 * interpreting each byte as a key code for entries marked to start with 0. See
	 * description of encodePayloadAsBinary
	 *
	 * @param {ArrayBuffer} data, callback method
	 * @api public
	 */

	exports.decodePayloadAsBinary = function (data, binaryType, callback) {
	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }

	  var bufferTail = data;
	  var buffers = [];

	  var numberTooLong = false;
	  while (bufferTail.byteLength > 0) {
	    var tailArray = new Uint8Array(bufferTail);
	    var isString = tailArray[0] === 0;
	    var msgLength = '';

	    for (var i = 1; ; i++) {
	      if (tailArray[i] == 255) break;

	      if (msgLength.length > 310) {
	        numberTooLong = true;
	        break;
	      }

	      msgLength += tailArray[i];
	    }

	    if(numberTooLong) return callback(err, 0, 1);

	    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
	    msgLength = parseInt(msgLength);

	    var msg = sliceBuffer(bufferTail, 0, msgLength);
	    if (isString) {
	      try {
	        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
	      } catch (e) {
	        // iPhone Safari doesn't let you apply to typed arrays
	        var typed = new Uint8Array(msg);
	        msg = '';
	        for (var i = 0; i < typed.length; i++) {
	          msg += String.fromCharCode(typed[i]);
	        }
	      }
	    }

	    buffers.push(msg);
	    bufferTail = sliceBuffer(bufferTail, msgLength);
	  }

	  var total = buffers.length;
	  buffers.forEach(function(buffer, i) {
	    callback(exports.decodePacket(buffer, binaryType, true), i, total);
	  });
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 19 */
/***/ function(module, exports) {

	
	/**
	 * Gets the keys for an object.
	 *
	 * @return {Array} keys
	 * @api private
	 */

	module.exports = Object.keys || function keys (obj){
	  var arr = [];
	  var has = Object.prototype.hasOwnProperty;

	  for (var i in obj) {
	    if (has.call(obj, i)) {
	      arr.push(i);
	    }
	  }
	  return arr;
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/*
	 * Module requirements.
	 */

	var isArray = __webpack_require__(21);

	/**
	 * Module exports.
	 */

	module.exports = hasBinary;

	/**
	 * Checks for binary data.
	 *
	 * Right now only Buffer and ArrayBuffer are supported..
	 *
	 * @param {Object} anything
	 * @api public
	 */

	function hasBinary(data) {

	  function _hasBinary(obj) {
	    if (!obj) return false;

	    if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
	         (global.Blob && obj instanceof Blob) ||
	         (global.File && obj instanceof File)
	        ) {
	      return true;
	    }

	    if (isArray(obj)) {
	      for (var i = 0; i < obj.length; i++) {
	          if (_hasBinary(obj[i])) {
	              return true;
	          }
	      }
	    } else if (obj && 'object' == typeof obj) {
	      if (obj.toJSON) {
	        obj = obj.toJSON();
	      }

	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
	          return true;
	        }
	      }
	    }

	    return false;
	  }

	  return _hasBinary(data);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	/**
	 * An abstraction for slicing an arraybuffer even when
	 * ArrayBuffer.prototype.slice is not supported
	 *
	 * @api public
	 */

	module.exports = function(arraybuffer, start, end) {
	  var bytes = arraybuffer.byteLength;
	  start = start || 0;
	  end = end || bytes;

	  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

	  if (start < 0) { start += bytes; }
	  if (end < 0) { end += bytes; }
	  if (end > bytes) { end = bytes; }

	  if (start >= bytes || start >= end || bytes === 0) {
	    return new ArrayBuffer(0);
	  }

	  var abv = new Uint8Array(arraybuffer);
	  var result = new Uint8Array(end - start);
	  for (var i = start, ii = 0; i < end; i++, ii++) {
	    result[ii] = abv[i];
	  }
	  return result.buffer;
	};


/***/ },
/* 23 */
/***/ function(module, exports) {

	/*
	 * base64-arraybuffer
	 * https://github.com/niklasvh/base64-arraybuffer
	 *
	 * Copyright (c) 2012 Niklas von Hertzen
	 * Licensed under the MIT license.
	 */
	(function(chars){
	  "use strict";

	  exports.encode = function(arraybuffer) {
	    var bytes = new Uint8Array(arraybuffer),
	    i, len = bytes.length, base64 = "";

	    for (i = 0; i < len; i+=3) {
	      base64 += chars[bytes[i] >> 2];
	      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
	      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
	      base64 += chars[bytes[i + 2] & 63];
	    }

	    if ((len % 3) === 2) {
	      base64 = base64.substring(0, base64.length - 1) + "=";
	    } else if (len % 3 === 1) {
	      base64 = base64.substring(0, base64.length - 2) + "==";
	    }

	    return base64;
	  };

	  exports.decode =  function(base64) {
	    var bufferLength = base64.length * 0.75,
	    len = base64.length, i, p = 0,
	    encoded1, encoded2, encoded3, encoded4;

	    if (base64[base64.length - 1] === "=") {
	      bufferLength--;
	      if (base64[base64.length - 2] === "=") {
	        bufferLength--;
	      }
	    }

	    var arraybuffer = new ArrayBuffer(bufferLength),
	    bytes = new Uint8Array(arraybuffer);

	    for (i = 0; i < len; i+=4) {
	      encoded1 = chars.indexOf(base64[i]);
	      encoded2 = chars.indexOf(base64[i+1]);
	      encoded3 = chars.indexOf(base64[i+2]);
	      encoded4 = chars.indexOf(base64[i+3]);

	      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
	      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
	      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
	    }

	    return arraybuffer;
	  };
	})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");


/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = after

	function after(count, callback, err_cb) {
	    var bail = false
	    err_cb = err_cb || noop
	    proxy.count = count

	    return (count === 0) ? callback() : proxy

	    function proxy(err, result) {
	        if (proxy.count <= 0) {
	            throw new Error('after called too many times')
	        }
	        --proxy.count

	        // after first error, rest are passed to err_cb
	        if (err) {
	            bail = true
	            callback(err)
	            // future error callbacks will go to error handler
	            callback = err_cb
	        } else if (proxy.count === 0 && !bail) {
	            callback(null, result)
	        }
	    }
	}

	function noop() {}


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/utf8js v2.0.0 by @mathias */
	;(function(root) {

		// Detect free variables `exports`
		var freeExports = typeof exports == 'object' && exports;

		// Detect free variable `module`
		var freeModule = typeof module == 'object' && module &&
			module.exports == freeExports && module;

		// Detect free variable `global`, from Node.js or Browserified code,
		// and use it as `root`
		var freeGlobal = typeof global == 'object' && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
			root = freeGlobal;
		}

		/*--------------------------------------------------------------------------*/

		var stringFromCharCode = String.fromCharCode;

		// Taken from https://mths.be/punycode
		function ucs2decode(string) {
			var output = [];
			var counter = 0;
			var length = string.length;
			var value;
			var extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		// Taken from https://mths.be/punycode
		function ucs2encode(array) {
			var length = array.length;
			var index = -1;
			var value;
			var output = '';
			while (++index < length) {
				value = array[index];
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
			}
			return output;
		}

		function checkScalarValue(codePoint) {
			if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
				throw Error(
					'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
					' is not a scalar value'
				);
			}
		}
		/*--------------------------------------------------------------------------*/

		function createByte(codePoint, shift) {
			return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
		}

		function encodeCodePoint(codePoint) {
			if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
				return stringFromCharCode(codePoint);
			}
			var symbol = '';
			if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
				symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
			}
			else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
				checkScalarValue(codePoint);
				symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
				symbol += createByte(codePoint, 6);
			}
			else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
				symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
				symbol += createByte(codePoint, 12);
				symbol += createByte(codePoint, 6);
			}
			symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
			return symbol;
		}

		function utf8encode(string) {
			var codePoints = ucs2decode(string);
			var length = codePoints.length;
			var index = -1;
			var codePoint;
			var byteString = '';
			while (++index < length) {
				codePoint = codePoints[index];
				byteString += encodeCodePoint(codePoint);
			}
			return byteString;
		}

		/*--------------------------------------------------------------------------*/

		function readContinuationByte() {
			if (byteIndex >= byteCount) {
				throw Error('Invalid byte index');
			}

			var continuationByte = byteArray[byteIndex] & 0xFF;
			byteIndex++;

			if ((continuationByte & 0xC0) == 0x80) {
				return continuationByte & 0x3F;
			}

			// If we end up here, it’s not a continuation byte
			throw Error('Invalid continuation byte');
		}

		function decodeSymbol() {
			var byte1;
			var byte2;
			var byte3;
			var byte4;
			var codePoint;

			if (byteIndex > byteCount) {
				throw Error('Invalid byte index');
			}

			if (byteIndex == byteCount) {
				return false;
			}

			// Read first byte
			byte1 = byteArray[byteIndex] & 0xFF;
			byteIndex++;

			// 1-byte sequence (no continuation bytes)
			if ((byte1 & 0x80) == 0) {
				return byte1;
			}

			// 2-byte sequence
			if ((byte1 & 0xE0) == 0xC0) {
				var byte2 = readContinuationByte();
				codePoint = ((byte1 & 0x1F) << 6) | byte2;
				if (codePoint >= 0x80) {
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}

			// 3-byte sequence (may include unpaired surrogates)
			if ((byte1 & 0xF0) == 0xE0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
				if (codePoint >= 0x0800) {
					checkScalarValue(codePoint);
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}

			// 4-byte sequence
			if ((byte1 & 0xF8) == 0xF0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				byte4 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
					(byte3 << 0x06) | byte4;
				if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
					return codePoint;
				}
			}

			throw Error('Invalid UTF-8 detected');
		}

		var byteArray;
		var byteCount;
		var byteIndex;
		function utf8decode(byteString) {
			byteArray = ucs2decode(byteString);
			byteCount = byteArray.length;
			byteIndex = 0;
			var codePoints = [];
			var tmp;
			while ((tmp = decodeSymbol()) !== false) {
				codePoints.push(tmp);
			}
			return ucs2encode(codePoints);
		}

		/*--------------------------------------------------------------------------*/

		var utf8 = {
			'version': '2.0.0',
			'encode': utf8encode,
			'decode': utf8decode
		};

		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return utf8;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}	else if (freeExports && !freeExports.nodeType) {
			if (freeModule) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = utf8;
			} else { // in Narwhal or RingoJS v0.7.0-
				var object = {};
				var hasOwnProperty = object.hasOwnProperty;
				for (var key in utf8) {
					hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.utf8 = utf8;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(26)(module), (function() { return this; }())))

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 27 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Create a blob builder even when vendor prefixes exist
	 */

	var BlobBuilder = global.BlobBuilder
	  || global.WebKitBlobBuilder
	  || global.MSBlobBuilder
	  || global.MozBlobBuilder;

	/**
	 * Check if Blob constructor is supported
	 */

	var blobSupported = (function() {
	  try {
	    var a = new Blob(['hi']);
	    return a.size === 2;
	  } catch(e) {
	    return false;
	  }
	})();

	/**
	 * Check if Blob constructor supports ArrayBufferViews
	 * Fails in Safari 6, so we need to map to ArrayBuffers there.
	 */

	var blobSupportsArrayBufferView = blobSupported && (function() {
	  try {
	    var b = new Blob([new Uint8Array([1,2])]);
	    return b.size === 2;
	  } catch(e) {
	    return false;
	  }
	})();

	/**
	 * Check if BlobBuilder is supported
	 */

	var blobBuilderSupported = BlobBuilder
	  && BlobBuilder.prototype.append
	  && BlobBuilder.prototype.getBlob;

	/**
	 * Helper function that maps ArrayBufferViews to ArrayBuffers
	 * Used by BlobBuilder constructor and old browsers that didn't
	 * support it in the Blob constructor.
	 */

	function mapArrayBufferViews(ary) {
	  for (var i = 0; i < ary.length; i++) {
	    var chunk = ary[i];
	    if (chunk.buffer instanceof ArrayBuffer) {
	      var buf = chunk.buffer;

	      // if this is a subarray, make a copy so we only
	      // include the subarray region from the underlying buffer
	      if (chunk.byteLength !== buf.byteLength) {
	        var copy = new Uint8Array(chunk.byteLength);
	        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
	        buf = copy.buffer;
	      }

	      ary[i] = buf;
	    }
	  }
	}

	function BlobBuilderConstructor(ary, options) {
	  options = options || {};

	  var bb = new BlobBuilder();
	  mapArrayBufferViews(ary);

	  for (var i = 0; i < ary.length; i++) {
	    bb.append(ary[i]);
	  }

	  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
	};

	function BlobConstructor(ary, options) {
	  mapArrayBufferViews(ary);
	  return new Blob(ary, options || {});
	};

	module.exports = (function() {
	  if (blobSupported) {
	    return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
	  } else if (blobBuilderSupported) {
	    return BlobBuilderConstructor;
	  } else {
	    return undefined;
	  }
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 28 */
/***/ function(module, exports) {

	/**
	 * Compiles a querystring
	 * Returns string representation of the object
	 *
	 * @param {Object}
	 * @api private
	 */

	exports.encode = function (obj) {
	  var str = '';

	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      if (str.length) str += '&';
	      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
	    }
	  }

	  return str;
	};

	/**
	 * Parses a simple querystring into an object
	 *
	 * @param {String} qs
	 * @api private
	 */

	exports.decode = function(qs){
	  var qry = {};
	  var pairs = qs.split('&');
	  for (var i = 0, l = pairs.length; i < l; i++) {
	    var pair = pairs[i].split('=');
	    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	  }
	  return qry;
	};


/***/ },
/* 29 */
/***/ function(module, exports) {

	
	module.exports = function(a, b){
	  var fn = function(){};
	  fn.prototype = b.prototype;
	  a.prototype = new fn;
	  a.prototype.constructor = a;
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';

	var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
	  , length = 64
	  , map = {}
	  , seed = 0
	  , i = 0
	  , prev;

	/**
	 * Return a string representing the specified number.
	 *
	 * @param {Number} num The number to convert.
	 * @returns {String} The string representation of the number.
	 * @api public
	 */
	function encode(num) {
	  var encoded = '';

	  do {
	    encoded = alphabet[num % length] + encoded;
	    num = Math.floor(num / length);
	  } while (num > 0);

	  return encoded;
	}

	/**
	 * Return the integer value specified by the given string.
	 *
	 * @param {String} str The string to convert.
	 * @returns {Number} The integer value represented by the string.
	 * @api public
	 */
	function decode(str) {
	  var decoded = 0;

	  for (i = 0; i < str.length; i++) {
	    decoded = decoded * length + map[str.charAt(i)];
	  }

	  return decoded;
	}

	/**
	 * Yeast: A tiny growing id generator.
	 *
	 * @returns {String} A unique id.
	 * @api public
	 */
	function yeast() {
	  var now = encode(+new Date());

	  if (now !== prev) return seed = 0, prev = now;
	  return now +'.'+ encode(seed++);
	}

	//
	// Map each character to its index.
	//
	for (; i < length; i++) map[alphabet[i]] = i;

	//
	// Expose the `yeast`, `encode` and `decode` functions.
	//
	yeast.encode = encode;
	yeast.decode = decode;
	module.exports = yeast;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(32);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}
	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(33);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = Array.prototype.slice.call(arguments);

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 33 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module requirements.
	 */

	var Polling = __webpack_require__(16);
	var inherit = __webpack_require__(29);

	/**
	 * Module exports.
	 */

	module.exports = JSONPPolling;

	/**
	 * Cached regular expressions.
	 */

	var rNewline = /\n/g;
	var rEscapedNewline = /\\n/g;

	/**
	 * Global JSONP callbacks.
	 */

	var callbacks;

	/**
	 * Callbacks count.
	 */

	var index = 0;

	/**
	 * Noop.
	 */

	function empty () { }

	/**
	 * JSONP Polling constructor.
	 *
	 * @param {Object} opts.
	 * @api public
	 */

	function JSONPPolling (opts) {
	  Polling.call(this, opts);

	  this.query = this.query || {};

	  // define global callbacks array if not present
	  // we do this here (lazily) to avoid unneeded global pollution
	  if (!callbacks) {
	    // we need to consider multiple engines in the same page
	    if (!global.___eio) global.___eio = [];
	    callbacks = global.___eio;
	  }

	  // callback identifier
	  this.index = callbacks.length;

	  // add callback to jsonp global
	  var self = this;
	  callbacks.push(function (msg) {
	    self.onData(msg);
	  });

	  // append to query string
	  this.query.j = this.index;

	  // prevent spurious errors from being emitted when the window is unloaded
	  if (global.document && global.addEventListener) {
	    global.addEventListener('beforeunload', function () {
	      if (self.script) self.script.onerror = empty;
	    }, false);
	  }
	}

	/**
	 * Inherits from Polling.
	 */

	inherit(JSONPPolling, Polling);

	/*
	 * JSONP only supports binary as base64 encoded strings
	 */

	JSONPPolling.prototype.supportsBinary = false;

	/**
	 * Closes the socket.
	 *
	 * @api private
	 */

	JSONPPolling.prototype.doClose = function () {
	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }

	  if (this.form) {
	    this.form.parentNode.removeChild(this.form);
	    this.form = null;
	    this.iframe = null;
	  }

	  Polling.prototype.doClose.call(this);
	};

	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */

	JSONPPolling.prototype.doPoll = function () {
	  var self = this;
	  var script = document.createElement('script');

	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }

	  script.async = true;
	  script.src = this.uri();
	  script.onerror = function(e){
	    self.onError('jsonp poll error',e);
	  };

	  var insertAt = document.getElementsByTagName('script')[0];
	  if (insertAt) {
	    insertAt.parentNode.insertBefore(script, insertAt);
	  }
	  else {
	    (document.head || document.body).appendChild(script);
	  }
	  this.script = script;

	  var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);
	  
	  if (isUAgecko) {
	    setTimeout(function () {
	      var iframe = document.createElement('iframe');
	      document.body.appendChild(iframe);
	      document.body.removeChild(iframe);
	    }, 100);
	  }
	};

	/**
	 * Writes with a hidden iframe.
	 *
	 * @param {String} data to send
	 * @param {Function} called upon flush.
	 * @api private
	 */

	JSONPPolling.prototype.doWrite = function (data, fn) {
	  var self = this;

	  if (!this.form) {
	    var form = document.createElement('form');
	    var area = document.createElement('textarea');
	    var id = this.iframeId = 'eio_iframe_' + this.index;
	    var iframe;

	    form.className = 'socketio';
	    form.style.position = 'absolute';
	    form.style.top = '-1000px';
	    form.style.left = '-1000px';
	    form.target = id;
	    form.method = 'POST';
	    form.setAttribute('accept-charset', 'utf-8');
	    area.name = 'd';
	    form.appendChild(area);
	    document.body.appendChild(form);

	    this.form = form;
	    this.area = area;
	  }

	  this.form.action = this.uri();

	  function complete () {
	    initIframe();
	    fn();
	  }

	  function initIframe () {
	    if (self.iframe) {
	      try {
	        self.form.removeChild(self.iframe);
	      } catch (e) {
	        self.onError('jsonp polling iframe removal error', e);
	      }
	    }

	    try {
	      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
	      var html = '<iframe src="javascript:0" name="'+ self.iframeId +'">';
	      iframe = document.createElement(html);
	    } catch (e) {
	      iframe = document.createElement('iframe');
	      iframe.name = self.iframeId;
	      iframe.src = 'javascript:0';
	    }

	    iframe.id = self.iframeId;

	    self.form.appendChild(iframe);
	    self.iframe = iframe;
	  }

	  initIframe();

	  // escape \n to prevent it from being converted into \r\n by some UAs
	  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
	  data = data.replace(rEscapedNewline, '\\\n');
	  this.area.value = data.replace(rNewline, '\\n');

	  try {
	    this.form.submit();
	  } catch(e) {}

	  if (this.iframe.attachEvent) {
	    this.iframe.onreadystatechange = function(){
	      if (self.iframe.readyState == 'complete') {
	        complete();
	      }
	    };
	  } else {
	    this.iframe.onload = complete;
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */

	var Transport = __webpack_require__(17);
	var parser = __webpack_require__(18);
	var parseqs = __webpack_require__(28);
	var inherit = __webpack_require__(29);
	var yeast = __webpack_require__(30);
	var debug = __webpack_require__(31)('engine.io-client:websocket');
	var BrowserWebSocket = global.WebSocket || global.MozWebSocket;

	/**
	 * Get either the `WebSocket` or `MozWebSocket` globals
	 * in the browser or try to resolve WebSocket-compatible
	 * interface exposed by `ws` for Node-like environment.
	 */

	var WebSocket = BrowserWebSocket;
	if (!WebSocket && typeof window === 'undefined') {
	  try {
	    WebSocket = __webpack_require__(36);
	  } catch (e) { }
	}

	/**
	 * Module exports.
	 */

	module.exports = WS;

	/**
	 * WebSocket transport constructor.
	 *
	 * @api {Object} connection options
	 * @api public
	 */

	function WS(opts){
	  var forceBase64 = (opts && opts.forceBase64);
	  if (forceBase64) {
	    this.supportsBinary = false;
	  }
	  this.perMessageDeflate = opts.perMessageDeflate;
	  Transport.call(this, opts);
	}

	/**
	 * Inherits from Transport.
	 */

	inherit(WS, Transport);

	/**
	 * Transport name.
	 *
	 * @api public
	 */

	WS.prototype.name = 'websocket';

	/*
	 * WebSockets support binary
	 */

	WS.prototype.supportsBinary = true;

	/**
	 * Opens socket.
	 *
	 * @api private
	 */

	WS.prototype.doOpen = function(){
	  if (!this.check()) {
	    // let probe timeout
	    return;
	  }

	  var self = this;
	  var uri = this.uri();
	  var protocols = void(0);
	  var opts = {
	    agent: this.agent,
	    perMessageDeflate: this.perMessageDeflate
	  };

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;
	  if (this.extraHeaders) {
	    opts.headers = this.extraHeaders;
	  }

	  this.ws = BrowserWebSocket ? new WebSocket(uri) : new WebSocket(uri, protocols, opts);

	  if (this.ws.binaryType === undefined) {
	    this.supportsBinary = false;
	  }

	  if (this.ws.supports && this.ws.supports.binary) {
	    this.supportsBinary = true;
	    this.ws.binaryType = 'buffer';
	  } else {
	    this.ws.binaryType = 'arraybuffer';
	  }

	  this.addEventListeners();
	};

	/**
	 * Adds event listeners to the socket
	 *
	 * @api private
	 */

	WS.prototype.addEventListeners = function(){
	  var self = this;

	  this.ws.onopen = function(){
	    self.onOpen();
	  };
	  this.ws.onclose = function(){
	    self.onClose();
	  };
	  this.ws.onmessage = function(ev){
	    self.onData(ev.data);
	  };
	  this.ws.onerror = function(e){
	    self.onError('websocket error', e);
	  };
	};

	/**
	 * Override `onData` to use a timer on iOS.
	 * See: https://gist.github.com/mloughran/2052006
	 *
	 * @api private
	 */

	if ('undefined' != typeof navigator
	  && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
	  WS.prototype.onData = function(data){
	    var self = this;
	    setTimeout(function(){
	      Transport.prototype.onData.call(self, data);
	    }, 0);
	  };
	}

	/**
	 * Writes data to socket.
	 *
	 * @param {Array} array of packets.
	 * @api private
	 */

	WS.prototype.write = function(packets){
	  var self = this;
	  this.writable = false;

	  // encodePacket efficient as it uses WS framing
	  // no need for encodePayload
	  var total = packets.length;
	  for (var i = 0, l = total; i < l; i++) {
	    (function(packet) {
	      parser.encodePacket(packet, self.supportsBinary, function(data) {
	        if (!BrowserWebSocket) {
	          // always create a new object (GH-437)
	          var opts = {};
	          if (packet.options) {
	            opts.compress = packet.options.compress;
	          }

	          if (self.perMessageDeflate) {
	            var len = 'string' == typeof data ? global.Buffer.byteLength(data) : data.length;
	            if (len < self.perMessageDeflate.threshold) {
	              opts.compress = false;
	            }
	          }
	        }

	        //Sometimes the websocket has already been closed but the browser didn't
	        //have a chance of informing us about it yet, in that case send will
	        //throw an error
	        try {
	          if (BrowserWebSocket) {
	            // TypeError is thrown when passing the second argument on Safari
	            self.ws.send(data);
	          } else {
	            self.ws.send(data, opts);
	          }
	        } catch (e){
	          debug('websocket closed before onclose event');
	        }

	        --total || done();
	      });
	    })(packets[i]);
	  }

	  function done(){
	    self.emit('flush');

	    // fake drain
	    // defer to next tick to allow Socket to clear writeBuffer
	    setTimeout(function(){
	      self.writable = true;
	      self.emit('drain');
	    }, 0);
	  }
	};

	/**
	 * Called upon close
	 *
	 * @api private
	 */

	WS.prototype.onClose = function(){
	  Transport.prototype.onClose.call(this);
	};

	/**
	 * Closes socket.
	 *
	 * @api private
	 */

	WS.prototype.doClose = function(){
	  if (typeof this.ws !== 'undefined') {
	    this.ws.close();
	  }
	};

	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */

	WS.prototype.uri = function(){
	  var query = this.query || {};
	  var schema = this.secure ? 'wss' : 'ws';
	  var port = '';

	  // avoid port if default for schema
	  if (this.port && (('wss' == schema && this.port != 443)
	    || ('ws' == schema && this.port != 80))) {
	    port = ':' + this.port;
	  }

	  // append timestamp to URI
	  if (this.timestampRequests) {
	    query[this.timestampParam] = yeast();
	  }

	  // communicate binary support capabilities
	  if (!this.supportsBinary) {
	    query.b64 = 1;
	  }

	  query = parseqs.encode(query);

	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }

	  var ipv6 = this.hostname.indexOf(':') !== -1;
	  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
	};

	/**
	 * Feature detection for WebSocket.
	 *
	 * @return {Boolean} whether this transport is available.
	 * @api public
	 */

	WS.prototype.check = function(){
	  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 36 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 37 */
/***/ function(module, exports) {

	
	var indexOf = [].indexOf;

	module.exports = function(arr, obj){
	  if (indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	/**
	 * Parses an URI
	 *
	 * @author Steven Levithan <stevenlevithan.com> (MIT license)
	 * @api private
	 */

	var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

	var parts = [
	    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
	];

	module.exports = function parseuri(str) {
	    var src = str,
	        b = str.indexOf('['),
	        e = str.indexOf(']');

	    if (b != -1 && e != -1) {
	        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
	    }

	    var m = re.exec(str || ''),
	        uri = {},
	        i = 14;

	    while (i--) {
	        uri[parts[i]] = m[i] || '';
	    }

	    if (b != -1 && e != -1) {
	        uri.source = src;
	        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
	        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
	        uri.ipv6uri = true;
	    }

	    return uri;
	};


/***/ },
/* 39 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * JSON parse.
	 *
	 * @see Based on jQuery#parseJSON (MIT) and JSON2
	 * @api private
	 */

	var rvalidchars = /^[\],:{}\s]*$/;
	var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
	var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
	var rtrimLeft = /^\s+/;
	var rtrimRight = /\s+$/;

	module.exports = function parsejson(data) {
	  if ('string' != typeof data || !data) {
	    return null;
	  }

	  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

	  // Attempt to parse using the native JSON parser first
	  if (global.JSON && JSON.parse) {
	    return JSON.parse(data);
	  }

	  if (rvalidchars.test(data.replace(rvalidescape, '@')
	      .replace(rvalidtokens, ']')
	      .replace(rvalidbraces, ''))) {
	    return (new Function('return ' + data))();
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__( 5 );

	/**
	 * Parses ASCII control character seperated
	 * message strings into digestable maps
	 *
	 * @constructor
	 */
	var MessageParser = function() {
		this._actions = this._getActions();
	};

	/**
	 * Main interface method. Receives a raw message
	 * string, containing one or more messages
	 * and returns an array of parsed message objects
	 * or null for invalid messages
	 *
	 * @param   {String} message raw message
	 *
	 * @public
	 *
	 * @returns {Array} array of parsed message objects
	 *                  following the format
	 *                  {
	 *                  	raw: <original message string>
	 *                  	topic: <string>
	 *                  	action: <string - shortcode>
	 *                  	data: <array of strings>
	 *                  }
	 */
	MessageParser.prototype.parse = function( message, client ) {
		var parsedMessages = [],
			rawMessages = message.split( C.MESSAGE_SEPERATOR ),
			i;

		for( i = 0; i < rawMessages.length; i++ ) {
			if( rawMessages[ i ].length > 2 ) {
				parsedMessages.push( this._parseMessage( rawMessages[ i ], client ) );
			}
		}

		return parsedMessages;
	};

	/**
	 * Deserializes values created by MessageBuilder.typed to
	 * their original format
	 * 
	 * @param {String} value
	 *
	 * @public
	 * @returns {Mixed} original value
	 */
	MessageParser.prototype.convertTyped = function( value, client ) {
		var type = value.charAt( 0 );
		
		if( type === C.TYPES.STRING ) {
			return value.substr( 1 );
		}
		
		if( type === C.TYPES.OBJECT ) {
			try {
				return JSON.parse( value.substr( 1 ) );
			} catch( e ) {
				client._$onError( C.TOPIC.ERROR, C.EVENT.MESSAGE_PARSE_ERROR, e.toString() + '(' + value + ')' );
				return;
			}
		}
		
		if( type === C.TYPES.NUMBER ) {
			return parseFloat( value.substr( 1 ) );
		}
		
		if( type === C.TYPES.NULL ) {
			return null;
		}
		
		if( type === C.TYPES.TRUE ) {
			return true;
		}
		
		if( type === C.TYPES.FALSE ) {
			return false;
		}
		
		if( type === C.TYPES.UNDEFINED ) {
			return undefined;
		}
		
		client._$onError( C.TOPIC.ERROR, C.EVENT.MESSAGE_PARSE_ERROR, 'UNKNOWN_TYPE (' + value + ')' );
	};

	/**
	 * Turns the ACTION:SHORTCODE constants map
	 * around to facilitate shortcode lookup
	 *
	 * @private
	 *
	 * @returns {Object} actions
	 */
	MessageParser.prototype._getActions = function() {
		var actions = {},
			key;

		for( key in C.ACTIONS ) {
			actions[ C.ACTIONS[ key ] ] = key;
		}

		return actions;
	};

	/**
	 * Parses an individual message (as oposed to a 
	 * block of multiple messages as is processed by .parse())
	 *
	 * @param   {String} message
	 *
	 * @private
	 * 
	 * @returns {Object} parsedMessage
	 */
	MessageParser.prototype._parseMessage = function( message, client ) {
		var parts = message.split( C.MESSAGE_PART_SEPERATOR ), 
			messageObject = {};

		if( parts.length < 2 ) {
			message.processedError = true;
			client._$onError( C.TOPIC.ERROR, C.EVENT.MESSAGE_PARSE_ERROR, 'Insufficiant message parts' );
			return null;
		}

		if( this._actions[ parts[ 1 ] ] === undefined ) {
			message.processedError = true;
			client._$onError( C.TOPIC.ERROR, C.EVENT.MESSAGE_PARSE_ERROR, 'Unknown action ' + parts[ 1 ] );
			return null;
		}

		messageObject.raw = message;
		messageObject.topic = parts[ 0 ];
		messageObject.action = parts[ 1 ];
		messageObject.data = parts.splice( 2 );

		return messageObject;
	};

	module.exports = new MessageParser();

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__( 5 ),
		SEP = C.MESSAGE_PART_SEPERATOR;

	/**
	 * Creates a deepstream message string, based on the 
	 * provided parameters
	 *
	 * @param   {String} topic  One of CONSTANTS.TOPIC
	 * @param   {String} action One of CONSTANTS.ACTIONS
	 * @param   {Array} data An array of strings or JSON-serializable objects
	 *
	 * @returns {String} deepstream message string
	 */
	exports.getMsg = function( topic, action, data ) {
		if( data && !( data instanceof Array ) ) {
			throw new Error( 'data must be an array' );
		}
		var sendData = [ topic, action ],
			i;

		if( data ) {
			for( i = 0; i < data.length; i++ ) {
				if( typeof data[ i ] === 'object' ) {
					sendData.push( JSON.stringify( data[ i ] ) );
				} else {
					sendData.push( data[ i ] );
				}
			}
		}

		return sendData.join( SEP ) + C.MESSAGE_SEPERATOR;
	};

	/**
	 * Converts a serializable value into its string-representation and adds
	 * a flag that provides instructions on how to deserialize it.
	 * 
	 * Please see messageParser.convertTyped for the counterpart of this method
	 * 
	 * @param {Mixed} value
	 * 
	 * @public
	 * @returns {String} string representation of the value
	 */
	exports.typed = function( value ) {
		var type = typeof value;
		
		if( type === 'string' ) {
			return C.TYPES.STRING + value;
		}
		
		if( value === null ) {
			return C.TYPES.NULL;
		}
		
		if( type === 'object' ) {
			return C.TYPES.OBJECT + JSON.stringify( value );
		}
		
		if( type === 'number' ) {
			return C.TYPES.NUMBER + value.toString();
		}
		
		if( value === true ) {
			return C.TYPES.TRUE;
		}
		
		if( value === false ) {
			return C.TYPES.FALSE;
		}
		
		if( value === undefined ) {
			return C.TYPES.UNDEFINED;
		}
		
		throw new Error( 'Can\'t serialize type ' + value );
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var net = __webpack_require__( 44 ),
		URL = __webpack_require__( 45 ),
		events = __webpack_require__( 50 ),
		util = __webpack_require__( 51 ),
		C = __webpack_require__( 5 );

	/**
	 * An alternative to the engine.io connection for backend processes (or 
	 * other clients that speak TCP). Exposes the same interface as the engine.io
	 * client
	 *
	 * @param   {String} url (or short version without protocol, e.g. host:port )
	 *
	 * @emits error
	 * @emits open
	 * @emits close
	 * @emits message
	 * 
	 * @constructor
	 */
	var TcpConnection = function( url ) {
		this._socket = null;
		this._url = url;
		this._messageBuffer = '';
		this._destroyFn = this._destroy.bind( this );
		process.on( 'exit', this._destroyFn );
		this.open();
		this._isOpen = false;
	};

	util.inherits( TcpConnection, events.EventEmitter );

	/**
	 * Creates the connection. Can be called multiple times to
	 * facilitate reconnecting.
	 *
	 * @private
	 * @returns {void}
	 */
	TcpConnection.prototype.open = function() {
		this._socket = net.createConnection( this._getOptions() );

		this._socket.setEncoding( 'utf8' );
		this._socket.setKeepAlive( true, 5000 );
		this._socket.setNoDelay( true );

		this._socket.on( 'data', this._onData.bind( this ) );
		this._socket.on( 'error', this._onError.bind( this ) );
		this._socket.on( 'connect', this._onConnect.bind( this ) );
		this._socket.on( 'close', this._onClose.bind( this ) );
	};

	/**
	 * Sends a message over the socket. Sending happens immediatly,
	 * conflation takes place on a higher level
	 *
	 * @param   {String} message
	 *
	 * @private
	 * @returns {void}
	 */
	TcpConnection.prototype.send = function( message ) {
		if( this._isOpen === true ) {
			this._socket.write( message );
		} else {
			this.emit( 'error', 'attempt to send message on closed socket: ' + message );
		}
	};

	/**
	 * Closes the connection. Please note: messages that
	 * are already in-flight might still be received
	 * after the socket is closed. The _onData method
	 * therefor has an additional check for this.
	 *
	 * @todo  set flag for deliberateClose
	 *
	 * @returns {[type]} [description]
	 */
	TcpConnection.prototype.close = function() {
		this._isOpen = false;
		process.removeListener( 'exit', this._destroyFn );
		this._socket.end();
	};

	/**
	 * Callbacks for errors emitted from the underlying
	 * net.Socket
	 *
	 * @param   {String} error
	 *
	 * @private
	 * @returns {void}
	 */
	TcpConnection.prototype._onError = function( error ) {
		var msg;
		
		if( error.code === 'ECONNREFUSED' ) {
			msg = 'Can\'t connect! Deepstream server unreachable on ' + this._url;
		} else {
			msg = error.toString();
		}
		
		this.emit( 'error', msg );
	};

	/**
	 * Callbacks for connect events emitted from the underlying
	 * net.Socket
	 *
	 * @private
	 * @returns {void}
	 */
	TcpConnection.prototype._onConnect = function() {
		this._isOpen = true;
		this.emit( 'open' );
	};

	/**
	 * Callbacks for close events emitted from the underlying
	 * net.Socket.
	 *
	 * @todo  check for deliberateClose flag do decide whether to
	 * try to reconnect
	 *
	 * @private
	 * @returns {void}
	 */
	TcpConnection.prototype._onClose = function() {
		this._isOpen = false;
		this.emit( 'close' );
	};

	/**
	 * Callback for messages received on the socket. The socket
	 * is set to utf-8 by both the client and the server, so the
	 * message parameter should always be a string. Let's make sure that
	 * no binary data / buffers get into the message pipeline though.
	 * 
	 * IMPORTANT: There is no guarantee that this method is invoked for complete
	 * messages only. Especially under heavy load, packets are written as quickly
	 * as possible. Therefor every message ends with a MESSAGE_SEPERATOR charactor
	 * and it is this methods responsibility to buffer and concatenate the messages
	 * accordingly
	 * 
	 * @param   {String} packet
	 *
	 * @private
	 * @returns {void}
	 */
	TcpConnection.prototype._onData = function( packet ) {
		if( typeof packet !== 'string' ) {
			this.emit( 'error', 'received non-string message from socket' );
			return;
		}

		if( this._isOpen === false ) {
			this.emit( 'error', 'received message on half closed socket: ' + packet );
			return;
		}

		var message;

		// Incomplete message, write to buffer
		if( packet.charAt( packet.length - 1 ) !== C.MESSAGE_SEPERATOR ) {
			this._messageBuffer += packet;
			return;
		}
		
		// Message that completes previously received message
		if( this._messageBuffer.length !== 0 ) {
			message = this._messageBuffer + packet;
			this._messageBuffer = '';

		// Complete message
		} else {
			message = packet;
		}

		this.emit( 'message', message );
	};

	/**
	 * Returns the options for net.Socket, based
	 * on the provided URL
	 *
	 * @todo  - test what happens if URL doesn't have a port
	 *
	 *
	 * @private
	 * @returns {Object} options
	 */
	TcpConnection.prototype._getOptions = function() {
		var parsedUrl = {};
		
		if( this._url.indexOf( '/' ) === -1 ) {
			parsedUrl.hostname = this._url.split( ':' )[ 0 ];
			parsedUrl.port = this._url.split( ':' )[ 1 ];
		} else {
			parsedUrl = URL.parse( this._url );
		}

		return {
			host: parsedUrl.hostname,
			port: parseInt( parsedUrl.port, 10 ),
			allowHalfOpen: false
		};
	};

	/**
	 * Closes the socket as a last resort before the
	 * process exits
	 *
	 * @private
	 * @returns {void}
	 */
	TcpConnection.prototype._destroy = function() {
		this._socket.destroy();
	};

	module.exports = TcpConnection;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(43)))

/***/ },
/* 43 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = cachedSetTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    cachedClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        cachedSetTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 44 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var punycode = __webpack_require__(46);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(47);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a puny coded representation of "domain".
	      // It only converts the part of the domain name that
	      // has non ASCII characters. I.e. it dosent matter if
	      // you call it with a domain that already is in ASCII.
	      var domainArray = this.hostname.split('.');
	      var newOut = [];
	      for (var i = 0; i < domainArray.length; ++i) {
	        var s = domainArray[i];
	        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
	            'xn--' + punycode.encode(s) : s);
	      }
	      this.hostname = newOut.join('.');
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  Object.keys(this).forEach(function(k) {
	    result[k] = this[k];
	  }, this);

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    Object.keys(relative).forEach(function(k) {
	      if (k !== 'protocol')
	        result[k] = relative[k];
	    });

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      Object.keys(relative).forEach(function(k) {
	        result[k] = relative[k];
	      });
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especialy happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!isNull(result.pathname) || !isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host) && (last === '.' || last === '..') ||
	      last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last == '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especialy happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!isNull(result.pathname) || !isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};

	function isString(arg) {
	  return typeof arg === "string";
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isNull(arg) {
	  return arg === null;
	}
	function isNullOrUndefined(arg) {
	  return  arg == null;
	}


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(26)(module), (function() { return this; }())))

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(48);
	exports.encode = exports.stringify = __webpack_require__(49);


/***/ },
/* 48 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};


/***/ },
/* 49 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ },
/* 50 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(52);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(53);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(43)))

/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 53 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * A regular expression that matches whitespace on either side, but
	 * not in the center of a string
	 *
	 * @type {RegExp}
	 */
	var TRIM_REGULAR_EXPRESSION = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

	/**
	 * Used in typeof comparisons
	 *
	 * @type {String}
	 */
	var OBJECT = 'object';

	/**
	 * True if environment is node, false if it's a browser
	 * This seems somewhat inelegant, if anyone knows a better solution,
	 * let's change this (must identify browserify's pseudo node implementation though)
	 *
	 * @public
	 * @type {Boolean}
	 */
	exports.isNode = typeof process !== 'undefined' && process.toString() === '[object process]';

	/**
	 * Provides as soon as possible async execution in a cross
	 * platform way
	 *
	 * @param   {Function} fn the function to be executed in an asynchronous fashion
	 *
	 * @public
	 * @returns {void}
	 */
	exports.nextTick = function( fn ) {
		if( exports.isNode ) {
			process.nextTick( fn );
		} else {
			setTimeout( fn, 0 );
		}
	};

	/**
	 * Removes whitespace from the beginning and end of a string
	 *
	 * @param   {String} inputString
	 *
	 * @public
	 * @returns {String} trimmedString
	 */
	exports.trim = function( inputString ) {
		if( inputString.trim ) {
			return inputString.trim();
		} else {
			return inputString.replace( TRIM_REGULAR_EXPRESSION, '' );
		}
	};

	/**
	 * Compares two objects for deep (recoursive) equality
	 *
	 * This used to be a significantly more complex custom implementation,
	 * but JSON.stringify has gotten so fast that it now outperforms the custom
	 * way by a factor of 1.5 to 3.
	 *
	 * In IE11 / Edge the custom implementation is still slightly faster, but for
	 * consistencies sake and the upsides of leaving edge-case handling to the native
	 * browser / node implementation we'll go for JSON.stringify from here on.
	 *
	 * Please find performance test results here
	 *
	 * http://jsperf.com/deep-equals-code-vs-json
	 *
	 * @param   {Mixed} objA
	 * @param   {Mixed} objB
	 *
	 * @public
	 * @returns {Boolean} isEqual
	 */
	exports.deepEquals= function( objA, objB ) {
		if( typeof objA !== OBJECT || typeof objB !== OBJECT ) {
			return objA === objB;
		} else {
			return JSON.stringify( objA ) === JSON.stringify( objB );
		}
	};

	/**
	 * Similar to deepEquals above, tests have shown that JSON stringify outperforms any attempt of
	 * a code based implementation by 50% - 100% whilst also handling edge-cases and keeping implementation
	 * complexity low.
	 *
	 * If ES6/7 ever decides to implement deep copying natively (what happened to Object.clone? that was briefly
	 * a thing...), let's switch it for the native implementation. For now though, even Object.assign({}, obj) only
	 * provides a shallow copy.
	 *
	 * Please find performance test results backing these statements here:
	 *
	 * http://jsperf.com/object-deep-copy-assign
	 *
	 * @param   {Mixed} obj the object that should be cloned
	 *
	 * @public
	 * @returns {Mixed} clone
	 */
	exports.deepCopy = function( obj ) {
		if( typeof obj === OBJECT ) {
			return JSON.parse( JSON.stringify( obj ) );
		} else {
			return obj;
		}
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(43)))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var messageBuilder = __webpack_require__( 41 ),
		messageParser = __webpack_require__( 40 ),
		AckTimeoutRegistry = __webpack_require__( 56 ),
		ResubscribeNotifier = __webpack_require__( 57 ),
		C = __webpack_require__( 5 ),
		Listener = __webpack_require__( 58 ),
		EventEmitter = __webpack_require__( 7 );

	/**
	 * This class handles incoming and outgoing messages in relation
	 * to deepstream events. It basically acts like an event-hub that's
	 * replicated across all connected clients.
	 *
	 * @param {Object} options    deepstream options
	 * @param {Connection} connection
	 * @param {Client} client
	 * @public
	 * @constructor
	 */
	var EventHandler = function( options, connection, client ) {
		this._options = options;
		this._connection = connection;
		this._client = client;
		this._emitter = new EventEmitter();
		this._listener = {};
		this._ackTimeoutRegistry = new AckTimeoutRegistry( client, C.TOPIC.EVENT, this._options.subscriptionTimeout );
		this._resubscribeNotifier = new ResubscribeNotifier( this._client, this._resubscribe.bind( this ) );
	};

	/**
	 * Subscribe to an event. This will receive both locally emitted events
	 * as well as events emitted by other connected clients.
	 *
	 * @param   {String}   eventName
	 * @param   {Function} callback
	 *
	 * @public
	 * @returns {void}
	 */
	EventHandler.prototype.subscribe = function( eventName, callback ) {
		if( !this._emitter.hasListeners( eventName ) ) {
			this._ackTimeoutRegistry.add( eventName, C.ACTIONS.SUBSCRIBE );
			this._connection.sendMsg( C.TOPIC.EVENT, C.ACTIONS.SUBSCRIBE, [ eventName ] );
		}

		this._emitter.on( eventName, callback );
	};

	/**
	 * Removes a callback for a specified event. If all callbacks
	 * for an event have been removed, the server will be notified
	 * that the client is unsubscribed as a listener
	 *
	 * @param   {String}   eventName
	 * @param   {Function} callback
	 *
	 * @public
	 * @returns {void}
	 */
	EventHandler.prototype.unsubscribe = function( eventName, callback ) {
		this._emitter.off( eventName, callback );
		
		if( !this._emitter.hasListeners( eventName ) ) {
			this._ackTimeoutRegistry.add( eventName, C.ACTIONS.UNSUBSCRIBE );
			this._connection.sendMsg( C.TOPIC.EVENT, C.ACTIONS.UNSUBSCRIBE, [ eventName ] );
		}
	};

	/**
	 * Emits an event locally and sends a message to the server to 
	 * broadcast the event to the other connected clients
	 *
	 * @param   {String} name 
	 * @param   {Mixed} data will be serialized and deserialized to its original type.
	 *
	 * @public
	 * @returns {void}
	 */
	EventHandler.prototype.emit = function( name, data ) {
		this._connection.sendMsg( C.TOPIC.EVENT, C.ACTIONS.EVENT, [ name, messageBuilder.typed( data ) ] );
		this._emitter.emit( name, data );
	};

	/**
	 * Allows to listen for event subscriptions made by this or other clients. This
	 * is useful to create "active" data providers, e.g. providers that only provide
	 * data for a particular event if a user is actually interested in it
	 *
	 * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
	 * @param   {Function} callback
	 *
	 * @public
	 * @returns {void}
	 */
	EventHandler.prototype.listen = function( pattern, callback ) {
		if( this._listener[ pattern ] ) {
			this._client._$onError( C.TOPIC.EVENT, C.EVENT.LISTENER_EXISTS, pattern );
		} else {
			this._listener[ pattern ] = new Listener( C.TOPIC.EVENT, pattern, callback, this._options, this._client, this._connection );
		}
	};

	/**
	 * Removes a listener that was previously registered with listenForSubscriptions
	 *
	 * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
	 * @param   {Function} callback
	 *
	 * @public
	 * @returns {void}
	 */
	EventHandler.prototype.unlisten = function( pattern ) {
		if( this._listener[ pattern ] ) {
			this._ackTimeoutRegistry.add( pattern, C.EVENT.UNLISTEN );
			this._listener[ pattern ].destroy();
			delete this._listener[ pattern ];
		} else {
			this._client._$onError( C.TOPIC.EVENT, C.EVENT.NOT_LISTENING, pattern );
		}
	};

	/**
	 * Handles incoming messages from the server
	 *
	 * @param   {Object} message parsed deepstream message
	 *
	 * @package private
	 * @returns {void}
	 */
	EventHandler.prototype._$handle = function( message ) {
		var name = message.data[ message.action === C.ACTIONS.ACK ? 1 : 0 ];

		if( message.action === C.ACTIONS.EVENT ) {
			if( message.data && message.data.length === 2 ) {
				this._emitter.emit( name, messageParser.convertTyped( message.data[ 1 ], this._client ) );
			} else {
				this._emitter.emit( name );
			}
			return;
		}

		if( this._listener[ name ] ) {
			this._listener[ name ]._$onMessage( message );
			return;
		}

		if( message.action === C.ACTIONS.ACK ) {
			this._ackTimeoutRegistry.clear( message );
			return;
		}
		
		if( message.action === C.ACTIONS.ERROR ) {
			message.processedError = true;
			this._client._$onError( C.TOPIC.EVENT, message.data[ 0 ], message.data[ 1 ] );
			return;
		}

		this._client._$onError( C.TOPIC.EVENT, C.EVENT.UNSOLICITED_MESSAGE, name );
	};


	/**
	 * Resubscribes to events when connection is lost
	 *
	 * @package private
	 * @returns {void}
	 */
	EventHandler.prototype._resubscribe = function() {
		var callbacks = this._emitter._callbacks;
		for( var eventName in callbacks ) {
			this._connection.sendMsg( C.TOPIC.EVENT, C.ACTIONS.SUBSCRIBE, [ eventName ] );
		}
	};

	module.exports = EventHandler;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__( 5 ),
		EventEmitter = __webpack_require__( 7 );

	/**
	 * Subscriptions to events are in a pending state until deepstream acknowledges
	 * them. This is a pattern that's used by numerour classes. This registry aims
	 * to centralise the functionality necessary to keep track of subscriptions and
	 * their respective timeouts.
	 *
	 * @param {Client} client          The deepstream client
	 * @param {String} topic           Constant. One of C.TOPIC
	 * @param {Number} timeoutDuration The duration of the timeout in milliseconds
	 *
	 * @extends {EventEmitter}
	 * @constructor
	 */
	var AckTimeoutRegistry = function( client, topic, timeoutDuration ) {
		this._client = client;
		this._topic = topic;
		this._timeoutDuration = timeoutDuration;
		this._register = {};
	};

	EventEmitter( AckTimeoutRegistry.prototype );

	/**
	 * Add an entry
	 *
	 * @param {String} name An identifier for the subscription, e.g. a record name, an event name,
	 *                      the name of a webrtc callee etc.
	 *
	 * @public
	 * @returns {void}
	 */
	AckTimeoutRegistry.prototype.add = function( name, action ) {
		var uniqueName = action ? action + name : name;
		
		if( this._register[ uniqueName ] ) {
			this.clear( {
				data: [ action, name ]
			} );
		}

		this._register[ uniqueName ] = setTimeout( this._onTimeout.bind( this, uniqueName, name ), this._timeoutDuration );
	};

	/**
	 * Processes an incoming ACK-message and removes the corresponding subscription
	 *
	 * @param   {Object} message A parsed deepstream ACK message
	 *
	 * @public
	 * @returns {void}
	 */
	AckTimeoutRegistry.prototype.clear = function( message ) {
		var name = message.data[ 1 ];
		var uniqueName = message.data[ 0 ] + name;
		var timeout =  this._register[ uniqueName ] || this._register[ name ];

		if( timeout ) {
			clearTimeout( timeout );
		} else {
			this._client._$onError( this._topic, C.EVENT.UNSOLICITED_MESSAGE, message.raw );
		}
	};

	/**
	 * Will be invoked if the timeout has occured before the ack message was received
	 *
	 * @param {String} name An identifier for the subscription, e.g. a record name, an event name,
	 *                      the name of a webrtc callee etc.
	 *
	 * @private
	 * @returns {void}
	 */
	AckTimeoutRegistry.prototype._onTimeout = function( uniqueName, name ) {
		delete this._register[ uniqueName ];
		var msg = 'No ACK message received in time for ' + name;
		this._client._$onError( this._topic, C.EVENT.ACK_TIMEOUT, msg );
		this.emit( 'timeout', name );
	};

	module.exports = AckTimeoutRegistry;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__( 5 );

	/**
	 * Makes sure that all functionality is resubscribed on reconnect. Subscription is called
	 * when the connection drops - which seems counterintuitive, but in fact just means
	 * that the re-subscription message will be added to the queue of messages that
	 * need re-sending as soon as the connection is re-established.
	 * 
	 * Resubscribe logic should only occur once per connection loss
	 *
	 * @param {Client} client          The deepstream client
	 * @param {Function} reconnect     Function to call to allow resubscribing
	 *
	 * @constructor
	 */
	var ResubscribeNotifier = function( client, resubscribe ) {
		this._client = client;
		this._resubscribe = resubscribe;

		this._isReconnecting = false;
		this._connectionStateChangeHandler = this._handleConnectionStateChanges.bind( this );
		this._client.on( 'connectionStateChanged', this._connectionStateChangeHandler );
	};

	/**
	 * Call this whenever this functionality is no longer needed to remove links
	 * 
	 * @returns {void}
	 */
	ResubscribeNotifier.prototype.destroy = function() {
		this._client.removeListener( 'connectionStateChanged', this._connectionStateChangeHandler );
		this._connectionStateChangeHandler = null;
		this._client = null;
	};

	 /**
	 * Check whenever the connection state changes if it is in reconnecting to resubscribe
	 * @private
	 * @returns {void}
	 */
	 ResubscribeNotifier.prototype._handleConnectionStateChanges = function() {
		var state = this._client.getConnectionState();
			
		if( state === C.CONNECTION_STATE.RECONNECTING && this._isReconnecting === false ) {
			this._isReconnecting = true;
		}
		if( state === C.CONNECTION_STATE.OPEN && this._isReconnecting === true ) {
			this._isReconnecting = false;
			this._resubscribe();
		}
	 };

	module.exports = ResubscribeNotifier;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__( 5 );
	var ResubscribeNotifier = __webpack_require__( 57 );

	var Listener = function( type, pattern, callback, options, client, connection ) {
	    this._type = type;
	    this._callback = callback;
	    this._pattern = pattern;
	    this._options = options;
	    this._client = client;
	    this._connection = connection;
	    this._ackTimeout = setTimeout( this._onAckTimeout.bind( this ), this._options.subscriptionTimeout );
	    this._resubscribeNotifier = new ResubscribeNotifier( client, this._sendListen.bind( this ) );
	    this._sendListen();
	};

	Listener.prototype.destroy = function() {
	    this._connection.sendMsg( this._type, C.ACTIONS.UNLISTEN, [ this._pattern ] );
	    this._resubscribeNotifier.destroy();
	    this._callback = null;
	    this._pattern = null;
	    this._client = null;
	    this._connection = null;
	};

	Listener.prototype._$onMessage = function( message ) {
	    if( message.action === C.ACTIONS.ACK ) {
	        clearTimeout( this._ackTimeout );
	    } else {
	        var isFound = message.action === C.ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND;
	        this._callback( message.data[ 1 ], isFound );
	    }
	};

	Listener.prototype._sendListen = function() {
	    this._connection.sendMsg( this._type, C.ACTIONS.LISTEN, [ this._pattern ] );   
	};

	Listener.prototype._onAckTimeout = function() {
	    this._client._$onError( this._type, C.EVENT.ACK_TIMEOUT, 'No ACK message received in time for ' + this._pattern );
	};

	module.exports = Listener;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__( 5 ),
		AckTimeoutRegistry = __webpack_require__( 56 ),
		ResubscribeNotifier = __webpack_require__( 57 ),
		RpcResponse = __webpack_require__( 60 ),
		Rpc = __webpack_require__( 61 ),
		messageParser= __webpack_require__( 40 ),
		messageBuilder = __webpack_require__( 41 );

	/**
	 * The main class for remote procedure calls
	 *
	 * Provides the rpc interface and handles incoming messages
	 * on the rpc topic
	 *
	 * @param {Object} options deepstream configuration options
	 * @param {Connection} connection
	 * @param {Client} client
	 *
	 * @constructor
	 * @public
	 */
	var RpcHandler = function( options, connection, client ) {
		this._options = options;
		this._connection = connection;
		this._client = client;
		this._rpcs = {};
		this._providers = {};
		this._provideAckTimeouts = {};
		this._ackTimeoutRegistry = new AckTimeoutRegistry( client, C.TOPIC.RPC, this._options.subscriptionTimeout );
		this._resubscribeNotifier = new ResubscribeNotifier( this._client, this._reprovide.bind( this ) );
	};

	/**
	 * Registers a callback function as a RPC provider. If another connected client calls
	 * client.rpc.make() the request will be routed to this method
	 *
	 * The callback will be invoked with two arguments:
	 * 		{Mixed} data The data passed to the client.rpc.make function
	 *   	{RpcResponse} rpcResponse An object with methods to respons, acknowledge or reject the request
	 *
	 * Only one callback can be registered for a RPC at a time
	 *
	 * Please note: Deepstream tries to deliver data in its original format. Data passed to client.rpc.make as a String will arrive as a String,
	 * numbers or implicitly JSON serialized objects will arrive in their respective format as well
	 *
	 * @public
	 * @returns void
	 */
	RpcHandler.prototype.provide = function( name, callback ) {
		if( this._providers[ name ] ) {
			throw new Error( 'RPC ' + name + ' already registered' );
		}

		this._ackTimeoutRegistry.add( name, C.ACTIONS.SUBSCRIBE );
		this._providers[ name ] = callback;
		this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.SUBSCRIBE, [ name ] );
	};

	/**
	 * Unregisters this client as a provider for a remote procedure call
	 *
	 * @param   {String} name the name of the rpc
	 *
	 * @public
	 * @returns {void}
	 */
	RpcHandler.prototype.unprovide = function( name ) {
		if( this._providers[ name ] ) {
			delete this._providers[ name ];
			this._ackTimeoutRegistry.add( name, C.ACTIONS.UNSUBSCRIBE );
			this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.UNSUBSCRIBE, [ name ] );
		}
	};

	/**
	 * Executes the actual remote procedure call
	 *
	 * @param   {String}   name     The name of the rpc
	 * @param   {Mixed}    data     Serializable data that will be passed to the provider
	 * @param   {Function} callback Will be invoked with the returned result or if the rpc failed
	 *                              receives to arguments: error or null and the result
	 *
	 * @public
	 * @returns {void}
	 */
	RpcHandler.prototype.make = function( name, data, callback ) {
		var uid = this._client.getUid(),
			typedData = messageBuilder.typed( data );

		this._rpcs[ uid ] = new Rpc( this._options, callback, this._client );
		this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.REQUEST, [ name, uid, typedData ] );
	};

	/**
	 * Retrieves a RPC instance for a correlationId or throws an error
	 * if it can't be found (which should never happen)
	 *
	 * @param {String} correlationId
	 * @param {String} rpcName
	 *
	 * @private
	 * @returns {Rpc}
	 */
	RpcHandler.prototype._getRpc = function( correlationId, rpcName, rawMessage ) {
		var rpc = this._rpcs[ correlationId ];

		if( !rpc ) {
			this._client._$onError( C.TOPIC.RPC, C.EVENT.UNSOLICITED_MESSAGE, rawMessage );
			return null;
		}

		return rpc;
	};

	/**
	 * Handles incoming rpc REQUEST messages. Instantiates a new response object
	 * and invokes the provider callback or rejects the request if no rpc provider
	 * is present (which shouldn't really happen, but might be the result of a race condition
	 * if this client sends a unprovide message whilst an incoming request is already in flight)
	 *
	 * @param   {Object} message The parsed deepstream RPC request message.
	 *
	 * @private
	 * @returns {void}
	 */
	RpcHandler.prototype._respondToRpc = function( message ) {
		var name = message.data[ 0 ],
			correlationId = message.data[ 1 ],
			data = null,
			response;

		if( message.data[ 2 ] ) {
			data = messageParser.convertTyped( message.data[ 2 ], this._client );
		}

		if( this._providers[ name ] ) {
			response = new RpcResponse( this._connection,name, correlationId );
			this._providers[ name ]( data, response );
		} else {
			this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.REJECTION, [ name, correlationId ] );
		}
	};

	/**
	 * Distributes incoming messages from the server
	 * based on their action
	 *
	 * @param   {Object} message A parsed deepstream message
	 *
	 * @private
	 * @returns {void}
	 */
	RpcHandler.prototype._$handle = function( message ) {
		var rpcName, correlationId, rpc;

		// RPC Requests
		if( message.action === C.ACTIONS.REQUEST ) {
			this._respondToRpc( message );
			return;
		}

		// RPC subscription Acks
		if( message.action === C.ACTIONS.ACK &&
			( message.data[ 0 ] === C.ACTIONS.SUBSCRIBE  || message.data[ 0 ] === C.ACTIONS.UNSUBSCRIBE ) ) {
			this._ackTimeoutRegistry.clear( message );
			return;
		}


		/*
		 * Error messages always have the error as first parameter. So the
		 * order is different to ack and response messages
		 */
		if( message.action === C.ACTIONS.ERROR ) {
			if( message.data[ 0 ] === C.EVENT.MESSAGE_PERMISSION_ERROR ) {
				return;
			}
			else if( message.data[ 0 ] === C.EVENT.MESSAGE_DENIED ) {
				if( message.data[ 2 ] === C.ACTIONS.SUBSCRIBE ) {
					return;
				}
				else if( message.data[ 2 ] === C.ACTIONS.REQUEST ) {
					rpcName = message.data[ 1 ];
					correlationId = message.data[ 3 ];
				}
			} else {
				rpcName = message.data[ 1 ];
				correlationId = message.data[ 2 ];
			}

		} else {
			rpcName = message.data[ 0 ];
			correlationId = message.data[ 1 ];
		}

		/*
		* Retrieve the rpc object
		*/
		rpc = this._getRpc( correlationId, rpcName, message.raw );
		if( rpc === null ) {
			return;
		}

		// RPC Responses
		if( message.action === C.ACTIONS.ACK ) {
			rpc.ack();
		}
		else if( message.action === C.ACTIONS.RESPONSE ) {
			rpc.respond( message.data[ 2 ] );
			delete this._rpcs[ correlationId ];
		}
		else if( message.action === C.ACTIONS.ERROR ) {
			message.processedError = true;
			rpc.error( message.data[ 0 ] );
			delete this._rpcs[ correlationId ];
		}
	};

	/**
	 * Reregister providers to events when connection is lost
	 *
	 * @package private
	 * @returns {void}
	 */
	RpcHandler.prototype._reprovide = function() {
		for( var rpcName in this._providers ) {
			this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.SUBSCRIBE, [ rpcName ] );
		}
	};


	module.exports = RpcHandler;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__( 5 ),
		utils = __webpack_require__( 54 ),
		messageBuilder = __webpack_require__( 41 );

	/**
	 * This object provides a number of methods that allow a rpc provider
	 * to respond to a request
	 * 
	 * @param {Connection} connection - the clients connection object
	 * @param {String} name the name of the rpc
	 * @param {String} correlationId the correlationId for the RPC
	 */
	var RpcResponse = function( connection, name, correlationId ) {
		this._connection = connection;
		this._name = name;
		this._correlationId = correlationId;
		this._isAcknowledged = false;
		this._isComplete = false;
		this.autoAck = true;
		utils.nextTick( this._performAutoAck.bind( this ) );
	};

	/**
	 * Acknowledges the receipt of the request. This
	 * will happen implicitly unless the request callback
	 * explicitly sets autoAck to false
	 * 
	 * @public
	 * @returns 	{void}
	 */
	RpcResponse.prototype.ack = function() {
		if( this._isAcknowledged === false ) {
			this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.ACK, [ this._name, this._correlationId ] );
			this._isAcknowledged = true;
		}
	};

	/**
	 * Reject the request. This might be necessary if the client
	 * is already processing a large number of requests. If deepstream
	 * receives a rejection message it will try to route the request to
	 * another provider - or return a NO_RPC_PROVIDER error if there are no
	 * providers left
	 * 
	 * @public
	 * @returns	{void}
	 */
	RpcResponse.prototype.reject = function() {
		this.autoAck = false;
		this._isComplete = true;
		this._isAcknowledged = true;
		this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.REJECTION, [ this._name, this._correlationId ] );
	};

	/**
	 * Notifies the server that an error has occured while trying to process the request. 
	 * This will complete the rpc.
	 *
	 * @param {String} errorMsg the message used to describe the error that occured
	 * @public
	 * @returns	{void}
	 */
	RpcResponse.prototype.error = function( errorMsg ) {
		this.autoAck = false;
		this._isComplete = true;
		this._isAcknowledged = true;
		this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.ERROR, [ errorMsg, this._name, this._correlationId ] );
	};

	/**
	 * Completes the request by sending the response data
	 * to the server. If data is an array or object it will
	 * automatically be serialised.
	 * If autoAck is disabled and the response is sent before
	 * the ack message the request will still be completed and the
	 * ack message ignored
	 * 
	 * @param {String} data the data send by the provider. Might be JSON serialized
	 * 
	 * @public
	 * @returns {void}
	 */
	RpcResponse.prototype.send = function( data ) {
		if( this._isComplete === true ) {
			throw new Error( 'Rpc ' + this._name + ' already completed' );
		}
		
		var typedData = messageBuilder.typed( data );
		this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.RESPONSE, [ this._name, this._correlationId, typedData ] );
		this._isComplete = true;
	};

	/**
	 * Callback for the autoAck timeout. Executes ack
	 * if autoAck is not disabled
	 * 
	 * @private
	 * @returns {void}
	 */
	RpcResponse.prototype._performAutoAck = function() {
		if( this.autoAck === true ) {
			this.ack();
		}
	};

	module.exports = RpcResponse;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__( 5 ),
		messageParser = __webpack_require__( 40 );

	/**
	 * This class represents a single remote procedure
	 * call made from the client to the server. It's main function
	 * is to encapsulate the logic around timeouts and to convert the
	 * incoming response data
	 *
	 * @param {Object}   options  deepstream client config
	 * @param {Function} callback the function that will be called once the request is complete or failed
	 * @param {Client} client
	 *
	 * @constructor
	 */
	var Rpc = function( options, callback, client ) {
		this._options = options;
		this._callback = callback;
		this._client = client;
		this._ackTimeout = setTimeout( this.error.bind( this, C.EVENT.ACK_TIMEOUT ), this._options.rpcAckTimeout );
		this._responseTimeout = setTimeout( this.error.bind( this, C.EVENT.RESPONSE_TIMEOUT ), this._options.rpcResponseTimeout );
	};

	/**
	 * Called once an ack message is received from the server
	 *
	 * @public
	 * @returns {void}
	 */
	Rpc.prototype.ack = function() {
		clearTimeout( this._ackTimeout );
	};

	/**
	 * Called once a response message is received from the server.
	 * Converts the typed data and completes the request
	 *
	 * @param   {String} data typed value
	 *
	 * @public
	 * @returns {void}
	 */
	Rpc.prototype.respond = function( data ) {
		var convertedData = messageParser.convertTyped( data, this._client );
		this._callback( null, convertedData );
		this._complete();
	};

	/**
	 * Callback for error messages received from the server. Once
	 * an error is received the request is considered completed. Even
	 * if a response arrives later on it will be ignored / cause an
	 * UNSOLICITED_MESSAGE error
	 *
	 * @param   {String} errorMsg @TODO should be CODE and message
	 *
	 * @public
	 * @returns {void}
	 */
	Rpc.prototype.error = function( errorMsg ) {
		this._callback( errorMsg );
		this._complete();
	};

	/**
	 * Called after either an error or a response
	 * was received
	 *
	 * @private
	 * @returns {void}
	 */
	Rpc.prototype._complete = function() {
		clearTimeout( this._ackTimeout );
		clearTimeout( this._responseTimeout );
	};

	module.exports = Rpc;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var Record = __webpack_require__( 63 ),
		AnonymousRecord = __webpack_require__( 65 ),
		List = __webpack_require__( 66 ),
		Listener = __webpack_require__( 58 ),
		SingleNotifier = __webpack_require__( 67 ),
		C = __webpack_require__( 5 ),
		messageParser = __webpack_require__( 40 ),
		EventEmitter = __webpack_require__( 7 );

	/**
	 * A collection of factories for records. This class
	 * is exposed as client.record
	 *
	 * @param {Object} options    deepstream options
	 * @param {Connection} connection
	 * @param {Client} client
	 */
	var RecordHandler = function( options, connection, client ) {
		this._options = options;
		this._connection = connection;
		this._client = client;
		this._records = {};
		this._lists = {};
		this._listener = {};
		this._destroyEventEmitter = new EventEmitter();

		this._hasRegistry = new SingleNotifier( client, connection, C.TOPIC.RECORD, C.ACTIONS.HAS, this._options.recordReadTimeout );
		this._snapshotRegistry = new SingleNotifier( client, connection, C.TOPIC.RECORD, C.ACTIONS.SNAPSHOT, this._options.recordReadTimeout );
	};

	/**
	 * Returns an existing record or creates a new one.
	 *
	 * @param   {String} name          		the unique name of the record
	 * @param   {[Object]} recordOptions 	A map of parameters for this particular record.
	 *                                    	{ persist: true }
	 *
	 * @public
	 * @returns {Record}
	 */
	RecordHandler.prototype.getRecord = function( name, recordOptions ) {
		if( !this._records[ name ] ) {
			this._records[ name ] = new Record( name, recordOptions || {}, this._connection, this._options, this._client );
			this._records[ name ].on( 'error', this._onRecordError.bind( this, name ) );
			this._records[ name ].on( 'destroyPending', this._onDestroyPending.bind( this, name ) );
			this._records[ name ].on( 'delete', this._removeRecord.bind( this, name ) );
			this._records[ name ].on( 'discard', this._removeRecord.bind( this, name ) );
		}

		this._records[ name ].usages++;

		return this._records[ name ];
	};

	/**
	 * Returns an existing List or creates a new one. A list is a specialised
	 * type of record that holds an array of recordNames.
	 *
	 * @param   {String} name       the unique name of the list
	 * @param   {[Object]} options 	A map of parameters for this particular list.
	 *                              { persist: true }
	 *
	 * @public
	 * @returns {List}
	 */
	RecordHandler.prototype.getList = function( name, options ) {
		if( !this._lists[ name ] ) {
			this._lists[ name ] = new List( this, name, options );
		} else {
			this._records[ name ].usages++;
		}
		return this._lists[ name ];
	};

	/**
	 * Returns an anonymous record. A anonymous record is effectively
	 * a wrapper that mimicks the API of a record, but allows for the
	 * underlying record to be swapped without loosing subscriptions etc.
	 *
	 * This is particularly useful when selecting from a number of similarly
	 * structured records. E.g. a list of users that can be choosen from a list
	 *
	 * The only API difference to a normal record is an additional setName( name ) method.
	 *
	 *
	 * @public
	 * @returns {AnonymousRecord}
	 */
	RecordHandler.prototype.getAnonymousRecord = function() {
		return new AnonymousRecord( this );
	};

	/**
	 * Allows to listen for record subscriptions made by this or other clients. This
	 * is useful to create "active" data providers, e.g. providers that only provide
	 * data for a particular record if a user is actually interested in it
	 *
	 * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
	 * @param   {Function} callback
	 *
	 * @public
	 * @returns {void}
	 */
	RecordHandler.prototype.listen = function( pattern, callback ) {
		if( this._listener[ pattern ] ) {
			this._client._$onError( C.TOPIC.RECORD, C.EVENT.LISTENER_EXISTS, pattern );
		} else {
			this._listener[ pattern ] = new Listener( C.TOPIC.RECORD, pattern, callback, this._options, this._client, this._connection );
		}
	};

	/**
	 * Removes a listener that was previously registered with listenForSubscriptions
	 *
	 * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
	 * @param   {Function} callback
	 *
	 * @public
	 * @returns {void}
	 */
	RecordHandler.prototype.unlisten = function( pattern ) {
		if( this._listener[ pattern ] ) {
			this._listener[ pattern ].destroy();
			delete this._listener[ pattern ];
		} else {
			this._client._$onError( C.TOPIC.RECORD, C.EVENT.NOT_LISTENING, pattern );
		}
	};

	/**
	 * Retrieve the current record data without subscribing to changes
	 *
	 * @param   {String}	name the unique name of the record
	 * @param   {Function}	callback
	 *
	 * @public
	 */
	RecordHandler.prototype.snapshot = function( name, callback ) {
		if( this._records[ name ] && this._records[ name ].isReady ) {
			callback( null, this._records[ name ].get() );
		} else {
			this._snapshotRegistry.request( name, callback );
		}
	};

	/**
	 * Allows the user to query to see whether or not the record exists.
	 *
	 * @param   {String}	name the unique name of the record
	 * @param   {Function}	callback
	 *
	 * @public
	 */
	RecordHandler.prototype.has = function( name, callback ) {
		if( this._records[ name ] ) {
			callback( null, true );
		} else {
			this._hasRegistry.request( name, callback );
		}
	};

	/**
	 * Will be called by the client for incoming messages on the RECORD topic
	 *
	 * @param   {Object} message parsed and validated deepstream message
	 *
	 * @package private
	 * @returns {void}
	 */
	RecordHandler.prototype._$handle = function( message ) {
		var name;

		if( message.action === C.ACTIONS.ERROR &&
			( message.data[ 0 ] !== C.EVENT.VERSION_EXISTS &&
				message.data[ 0 ] !== C.ACTIONS.SNAPSHOT &&
				message.data[ 0 ] !== C.ACTIONS.HAS  &&
				message.data[ 0 ] !== C.EVENT.MESSAGE_DENIED
			)
		) {
			message.processedError = true;
			this._client._$onError( C.TOPIC.RECORD, message.data[ 0 ], message.data[ 1 ] );
			return;
		}

		if( message.action === C.ACTIONS.ACK || message.action === C.ACTIONS.ERROR ) {
			name = message.data[ 1 ];

			/*
			 * The following prevents errors that occur when a record is discarded or deleted and
			 * recreated before the discard / delete ack message is received.
			 *
			 * A (presumably unsolvable) problem remains when a client deletes a record in the exact moment
			 * between another clients creation and read message for the same record
			 */
			if( message.data[ 0 ] === C.ACTIONS.DELETE ||
				  message.data[ 0 ] === C.ACTIONS.UNSUBSCRIBE ||
				 ( message.data[ 0 ] === C.EVENT.MESSAGE_DENIED && message.data[ 2 ] === C.ACTIONS.DELETE  )
				) {
				this._destroyEventEmitter.emit( 'destroy_ack_' + name, message );

				if( message.data[ 0 ] === C.ACTIONS.DELETE && this._records[ name ] ) {
					this._records[ name ]._$onMessage( message );
				}

				return;
			}

			if( message.data[ 0 ] === C.ACTIONS.SNAPSHOT ) {
				message.processedError = true;
				this._snapshotRegistry.recieve( name, message.data[ 2 ] );
				return;
			}

			if( message.data[ 0 ] === C.ACTIONS.HAS ) {
				message.processedError = true;
				this._snapshotRegistry.recieve( name, message.data[ 2 ] );
				return;
			}

		} else {
			name = message.data[ 0 ];
		}

		var processed = false;

		if( this._records[ name ] ) {
			processed = true;
			this._records[ name ]._$onMessage( message );
		}

		if( message.action === C.ACTIONS.READ && this._snapshotRegistry.hasRequest( name ) ) {
			processed = true;
			this._snapshotRegistry.recieve( name, null, JSON.parse( message.data[ 2 ] ) );
		}

		if( message.action === C.ACTIONS.HAS && this._hasRegistry.hasRequest( name ) ) {
			processed = true;
			this._hasRegistry.recieve( name, null, messageParser.convertTyped( message.data[ 1 ] ) );
		}

		if( this._listener[ name ] ) {
			processed = true;
			this._listener[ name ]._$onMessage( message );
		}

		if( !processed ) {
			this._client._$onError( C.TOPIC.RECORD, C.EVENT.UNSOLICITED_MESSAGE, name );
		}
	};

	/**
	 * Callback for 'error' events from the record.
	 *
	 * @param   {String} recordName
	 * @param   {String} error
	 *
	 * @private
	 * @returns {void}
	 */
	RecordHandler.prototype._onRecordError = function( recordName, error ) {
		this._client._$onError( C.TOPIC.RECORD, error, recordName );
	};

	/**
	 * When the client calls discard or delete on a record, there is a short delay
	 * before the corresponding ACK message is received from the server. To avoid
	 * race conditions if the record is re-requested straight away the old record is
	 * removed from the cache straight awy and will only listen for one last ACK message
	 *
	 * @param   {String} recordName The name of the record that was just deleted / discarded
	 *
	 * @private
	 * @returns {void}
	 */
	RecordHandler.prototype._onDestroyPending = function( recordName ) {
		var onMessage = this._records[ recordName ]._$onMessage.bind( this._records[ recordName ] );
		this._destroyEventEmitter.once( 'destroy_ack_' + recordName, onMessage );
		this._removeRecord( recordName );
	};

	/**
	 * Callback for 'deleted' and 'discard' events from a record. Removes the record from
	 * the registry
	 *
	 * @param   {String} recordName
	 *
	 * @returns {void}
	 */
	RecordHandler.prototype._removeRecord = function( recordName ) {
		delete this._records[ recordName ];
		delete this._lists[ recordName ];
	};

	module.exports = RecordHandler;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var JsonPath = __webpack_require__( 64 ),
		utils = __webpack_require__( 54 ),
		ResubscribeNotifier = __webpack_require__( 57 ),
		EventEmitter = __webpack_require__( 7 ),
		C = __webpack_require__( 5 ),
		messageBuilder = __webpack_require__( 41 ),
		messageParser = __webpack_require__( 40 ),
		ALL_EVENT = 'ALL_EVENT';

	/**
	 * This class represents a single record - an observable
	 * dataset returned by client.record.getRecord()
	 *
	 * @extends {EventEmitter}
	 *
	 * @param {String} name          		The unique name of the record
	 * @param {Object} recordOptions 		A map of options, e.g. { persist: true }
	 * @param {Connection} Connection		The instance of the server connection
	 * @param {Object} options				Deepstream options
	 * @param {Client} client				deepstream.io client
	 *
	 * @constructor
	 */
	var Record = function( name, recordOptions, connection, options, client ) {
		this.name = name;
		this.usages = 0;
		this._recordOptions = recordOptions;
		this._connection = connection;
		this._client = client;
		this._options = options;
		this.isReady = false;
		this.isDestroyed = false;
		this._$data = {};
		this.version = null;
		this._paths = {};
		this._oldValue = null;
		this._oldPathValues = null;
		this._eventEmitter = new EventEmitter();
		this._queuedMethodCalls = [];

		this._mergeStrategy = null;
		if( options.mergeStrategy ) {
			this.setMergeStrategy( options.mergeStrategy );
		}

		this._resubscribeNotifier = new ResubscribeNotifier( this._client, this._sendRead.bind( this ) );
		this._readAckTimeout = setTimeout( this._onTimeout.bind( this, C.EVENT.ACK_TIMEOUT ), this._options.recordReadAckTimeout );
		this._readTimeout = setTimeout( this._onTimeout.bind( this, C.EVENT.RESPONSE_TIMEOUT ), this._options.recordReadTimeout );
		this._sendRead();
	};

	EventEmitter( Record.prototype );

	/**
	 * Set a merge strategy to resolve any merge conflicts that may occur due
	 * to offline work or write conflicts. The function will be called with the
	 * local record, the remote version/data and a callback to call once the merge has
	 * completed or if an error occurs ( which leaves it in an inconsistent state until
	 * the next update merge attempt ).
	 *
	 * @param   {Function} mergeStrategy A Function that can resolve merge issues.
	 *
	 * @public
	 * @returns {void}
	 */
	Record.prototype.setMergeStrategy = function( mergeStrategy ) {
		if( typeof mergeStrategy === 'function' ) {
			this._mergeStrategy = mergeStrategy;
		} else {
			throw new Error( 'Invalid merge strategy: Must be a Function' );
		}
	};


	/**
	 * Returns a copy of either the entire dataset of the record
	 * or - if called with a path - the value of that path within
	 * the record's dataset.
	 *
	 * Returning a copy rather than the actual value helps to prevent
	 * the record getting out of sync due to unintentional changes to
	 * its data
	 *
	 * @param   {[String]} path A JSON path, e.g. users[ 2 ].firstname
	 *
	 * @public
	 * @returns {Mixed} value
	 */
	Record.prototype.get = function( path ) {
		var value;

		if( path ) {
			value = this._getPath( path ).getValue();
		} else {
			value = this._$data;
		}

		return utils.deepCopy( value );
	};

	/**
	 * Sets the value of either the entire dataset
	 * or of a specific path within the record
	 * and submits the changes to the server
	 *
	 * If the new data is equal to the current data, nothing will happen
	 *
	 * @param {[String|Object]} pathOrData Either a JSON path when called with two arguments or the data itself
	 * @param {Object} data     The data that should be stored in the record
	 *
	 * @public
	 * @returns {void}
	 */
	Record.prototype.set = function( pathOrData, data ) {
		if( arguments.length === 1 && typeof pathOrData !== 'object' ) {
			throw new Error( 'Invalid record data ' + pathOrData + ': Record data must be an object' );
		}

		if( this._checkDestroyed( 'set' ) ) {
			return this;
		}

		if( !this.isReady ) {
			this._queuedMethodCalls.push({ method: 'set', args: arguments });
			return this;
		}

		if( arguments.length === 2 && utils.deepEquals( this._getPath( pathOrData ).getValue(), data ) ) {
			return this;
		}
		else if( arguments.length === 1 && utils.deepEquals( this._$data, pathOrData ) ) {
			return this;
		}

		this._beginChange();
		this.version++;

		if( arguments.length === 1 ) {
			this._$data = ( typeof pathOrData == 'object' ) ? utils.deepCopy( pathOrData ) : pathOrData;
			this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.UPDATE, [
				this.name,
				this.version,
				this._$data
			]);
		} else {
			this._getPath( pathOrData ).setValue( ( typeof data == 'object' ) ? utils.deepCopy( data ): data );
			this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.PATCH, [
				this.name,
				this.version,
				pathOrData,
				messageBuilder.typed( data )
			]);
		}

		this._completeChange();
		return this;
	};

	/**
	 * Subscribes to changes to the records dataset.
	 *
	 * Callback is the only mandatory argument.
	 *
	 * When called with a path, it will only subscribe to updates
	 * to that path, rather than the entire record
	 *
	 * If called with true for triggerNow, the callback will
	 * be called immediatly with the current value
	 *
	 * @param   {[String]}		path			A JSON path within the record to subscribe to
	 * @param   {Function} 		callback       	Callback function to notify on changes
	 * @param   {[Boolean]}		triggerNow      A flag to specify whether the callback should be invoked immediatly
	 *                                       	with the current value
	 *
	 * @public
	 * @returns {void}
	 */
	Record.prototype.subscribe = function( path, callback, triggerNow ) {
		var args = this._normalizeArguments( arguments );

		if( this._checkDestroyed( 'subscribe' ) ) {
			return;
		}

		if( args.triggerNow ) {
			this.whenReady(function () {
				this._eventEmitter.on( args.path || ALL_EVENT, args.callback );
				if( args.path ) {
					args.callback( this._getPath( args.path ).getValue() );
				} else {
					args.callback( this._$data );
				}
			}.bind(this));
		} else {
			this._eventEmitter.on( args.path || ALL_EVENT, args.callback );
		}
	};

	/**
	 * Removes a subscription that was previously made using record.subscribe()
	 *
	 * Can be called with a path to remove the callback for this specific
	 * path or only with a callback which removes it from the generic subscriptions
	 *
	 * Please Note: unsubscribe is a purely client side operation. If the app is no longer
	 * interested in receiving updates for this record from the server it needs to call
	 * discard instead
	 *
	 * @param   {[String|Function]}   pathOrCallback A JSON path
	 * @param   {Function} 			  callback   	The callback method. Please note, if a bound method was passed to
	 *                                	   			subscribe, the same method must be passed to unsubscribe as well.
	 *
	 * @public
	 * @returns {void}
	 */
	Record.prototype.unsubscribe = function( pathOrCallback, callback ) {
		var args = this._normalizeArguments( arguments );

		if( this._checkDestroyed( 'unsubscribe' ) ) {
			return;
		}
		if ( args.path ) {
			this._eventEmitter.off( args.path, args.callback );
		} else {
			this._eventEmitter.off( ALL_EVENT, args.callback );
		}
	};

	/**
	 * Removes all change listeners and notifies the server that the client is
	 * no longer interested in updates for this record
	 *
	 * @public
	 * @returns {void}
	 */
	Record.prototype.discard = function() {
		this.whenReady( function() {
			this.usages--;
			if( this.usages <= 0 ) {
					this.emit( 'destroyPending' );
					this._discardTimeout = setTimeout( this._onTimeout.bind( this, C.EVENT.ACK_TIMEOUT ), this._options.subscriptionTimeout );
					this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.UNSUBSCRIBE, [ this.name ] );
			}
		}.bind( this ) );
	};

	/**
	 * Deletes the record on the server.
	 *
	 * @public
	 * @returns {void}
	 */
	Record.prototype.delete = function() {
		if( this._checkDestroyed( 'delete' ) ) {
			return;
		}
		this.whenReady( function() {
			this.emit( 'destroyPending' );
			this._deleteAckTimeout = setTimeout( this._onTimeout.bind( this, C.EVENT.DELETE_TIMEOUT ), this._options.recordDeleteTimeout );
			this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.DELETE, [ this.name ] );
		}.bind( this ) );
	};

	/**
	 * Convenience method, similar to promises. Executes callback
	 * whenever the record is ready, either immediatly or once the ready
	 * event is fired
	 *
	 * @param   {Function} callback Will be called when the record is ready
	 *
	 * @returns {void}
	 */
	Record.prototype.whenReady = function( callback ) {
		if( this.isReady === true ) {
			callback( this );
		} else {
			this.once( 'ready', callback.bind( this, this ) );
		}
	};

	/**
	 * Callback for incoming messages from the message handler
	 *
	 * @param   {Object} message parsed and validated deepstream message
	 *
	 * @package private
	 * @returns {void}
	 */
	Record.prototype._$onMessage = function( message ) {
		if( message.action === C.ACTIONS.READ ) {
			if( this.version === null ) {
				clearTimeout( this._readTimeout );
				this._onRead( message );
			} else {
				this._applyUpdate( message, this._client );
			}
		}
		else if( message.action === C.ACTIONS.ACK ) {
			this._processAckMessage( message );
		}
		else if( message.action === C.ACTIONS.UPDATE || message.action === C.ACTIONS.PATCH ) {
			this._applyUpdate( message, this._client );
		}
		// Otherwise it should be an error, and dealt with accordingly
		else if( message.data[ 0 ] === C.EVENT.VERSION_EXISTS ) {
			this._recoverRecord( message.data[ 2 ], JSON.parse( message.data[ 3 ] ), message );
		}
		else if( message.data[ 0 ] === C.EVENT.MESSAGE_DENIED ) {
			clearInterval( this._readAckTimeout );
			clearInterval( this._readTimeout );
		}
	};

	/**
	 * Called when a merge conflict is detected by a VERSION_EXISTS error or if an update recieved
	 * is directly after the clients. If no merge strategy is configure it will emit a VERSION_EXISTS
	 * error and the record will remain in an inconsistent state.
	 *
	 * @param   {Number} remoteVersion The remote version number
	 * @param   {Object} remoteData The remote object data
	 * @param   {Object} message parsed and validated deepstream message
	 *
	 * @private
	 * @returns {void}
	 */
	Record.prototype._recoverRecord = function( remoteVersion, remoteData, message ) {
		message.processedError = true;
		if( this._mergeStrategy ) {
			this._mergeStrategy( this, remoteData, remoteVersion, this._onRecordRecovered.bind( this, remoteVersion ) );
		}
		else {
			this.emit( 'error', C.EVENT.VERSION_EXISTS, 'received update for ' + remoteVersion + ' but version is ' + this.version );
		}
	};

	/**
	 * Callback once the record merge has completed. If successful it will set the
	 * record state, else emit and error and the record will remain in an
	 * inconsistent state until the next update.
	 *
	 * @param   {Number} remoteVersion The remote version number
	 * @param   {Object} remoteData The remote object data
	 * @param   {Object} message parsed and validated deepstream message
	 *
	 * @private
	 * @returns {void}
	 */
	Record.prototype._onRecordRecovered = function( remoteVersion, error, data ) {
		if( !error ) {
			this.version = remoteVersion;
			this.set( data );
		} else {
			this.emit( 'error', C.EVENT.VERSION_EXISTS, 'received update for ' + remoteVersion + ' but version is ' + this.version );
		}
	};

	/**
	 * Callback for ack-messages. Acks can be received for
	 * subscriptions, discards and deletes
	 *
	 * @param   {Object} message parsed and validated deepstream message
	 *
	 * @private
	 * @returns {void}
	 */
	Record.prototype._processAckMessage = function( message ) {
		var acknowledgedAction = message.data[ 0 ];

		if( acknowledgedAction === C.ACTIONS.SUBSCRIBE ) {
			clearTimeout( this._readAckTimeout );
		}

		else if( acknowledgedAction === C.ACTIONS.DELETE ) {
			this.emit( 'delete' );
			this._destroy();
		}

		else if( acknowledgedAction === C.ACTIONS.UNSUBSCRIBE ) {
			this.emit( 'discard' );
			this._destroy();
		}
	};

	/**
	 * Applies incoming updates and patches to the record's dataset
	 *
	 * @param   {Object} message parsed and validated deepstream message
	 *
	 * @private
	 * @returns {void}
	 */
	Record.prototype._applyUpdate = function( message ) {
		var version = parseInt( message.data[ 1 ], 10 );
		var data;

		if( message.action === C.ACTIONS.PATCH ) {
			data = messageParser.convertTyped( message.data[ 3 ], this._client );
		} else {
			data = JSON.parse( message.data[ 2 ] );
		}

		if( this.version === null ) {
			this.version = version;
		}
		else if( this.version + 1 !== version ) {
			if( message.action === C.ACTIONS.PATCH ) {
				/**
				* Request a snapshot so that a merge can be done with the read reply which contains
				* the full state of the record
				**/
				this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.SNAPSHOT, [ this.name ] );
			} else {
				this._recoverRecord( version, data, message );
			}
			return;
		}

		this._beginChange();
		this.version = version;

		if( message.action === C.ACTIONS.PATCH ) {
			this._getPath( message.data[ 2 ] ).setValue( data );
		} else {
			this._$data = data;
		}

		this._completeChange();
	};

	/**
	 * Callback for incoming read messages
	 *
	 * @param   {Object} message parsed and validated deepstream message
	 *
	 * @private
	 * @returns {void}
	 */
	Record.prototype._onRead = function( message ) {
		this._beginChange();
		this.version = parseInt( message.data[ 1 ], 10 );
		this._$data = JSON.parse( message.data[ 2 ] );
		this._completeChange();
		this._setReady();
	};

	/**
	 * Invokes method calls that where queued while the record wasn't ready
	 * and emits the ready event
	 *
	 * @private
	 * @returns {void}
	 */
	Record.prototype._setReady = function() {
		this.isReady = true;
		for( var i = 0; i < this._queuedMethodCalls.length; i++ ) {
			this[ this._queuedMethodCalls[ i ].method ].apply( this, this._queuedMethodCalls[ i ].args );
		}
		this._queuedMethodCalls = [];
		this.emit( 'ready' );
	};

	/**
	 * Sends the read message, either initially at record
	 * creation or after a lost connection has been re-established
	 *
	 * @private
	 * @returns {void}
	 */
	 Record.prototype._sendRead = function() {
	 	this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.CREATEORREAD, [ this.name ] );
	 };


	/**
	 * Returns an instance of JsonPath for a specific path. Creates the instance if it doesn't
	 * exist yet
	 *
	 * @param   {String} path
	 *
	 * @returns {JsonPath}
	 */
	Record.prototype._getPath = function( path ) {
		if( !this._paths[ path ] ) {
			this._paths[ path ] = new JsonPath( this, path );
		}

		return this._paths[ path ];
	};

	/**
	 * First of two steps that are called for incoming and outgoing updates.
	 * Saves the current value of all paths the app is subscribed to.
	 *
	 * @private
	 * @returns {void}
	 */
	Record.prototype._beginChange = function() {
		if( !this._eventEmitter._callbacks ) {
			return;
		}

		var paths = Object.keys( this._eventEmitter._callbacks ),
			i;

		this._oldPathValues = {};

		if( this._eventEmitter.hasListeners( ALL_EVENT ) ) {
			this._oldValue = this.get();
		}

		for( i = 0; i < paths.length; i++ ) {
			if( paths[ i ] !== ALL_EVENT ) {
				this._oldPathValues[ paths[ i ] ] = this._getPath( paths[ i ] ).getValue();
			}
		}
	};

	/**
	 * Second of two steps that are called for incoming and outgoing updates.
	 * Compares the new values for every path with the previously stored ones and
	 * updates the subscribers if the value has changed
	 *
	 * @private
	 * @returns {void}
	 */
	Record.prototype._completeChange = function() {
		if( this._eventEmitter.hasListeners( ALL_EVENT ) && !utils.deepEquals( this._oldValue, this._$data ) ) {
			this._eventEmitter.emit( ALL_EVENT, this.get() );
		}

		this._oldValue = null;

		if( this._oldPathValues === null ) {
			return;
		}

		var path, currentValue;

		for( path in this._oldPathValues ) {
			currentValue = this._getPath( path ).getValue();

			if( currentValue !== this._oldPathValues[ path ] ) {
				this._eventEmitter.emit( path, currentValue );
			}
		}

		this._oldPathValues = null;
	};

	/**
	 * Creates a map based on the types of the provided arguments
	 *
	 * @param {Arguments} args
	 *
	 * @private
	 * @returns {Object} arguments map
	 */
	Record.prototype._normalizeArguments = function( args ) {
		var result = {},
			i;

		// If arguments is already a map of normalized parameters
		// (e.g. when called by AnonymousRecord), just return it.
		if( args.length === 1 && typeof args[ 0 ] === 'object' ) {
			return args[ 0 ];
		}

		for( i = 0; i < args.length; i++ ) {
			if( typeof args[ i ] === 'string' ) {
				result.path = args[ i ];
			}
			else if( typeof args[ i ] === 'function' ) {
				result.callback = args[ i ];
			}
			else if( typeof args[ i ] === 'boolean' ) {
				result.triggerNow = args[ i ];
			}
		}

		return result;
	};

	/**
	 * Clears all timeouts that are set when the record is created
	 *
	 * @private
	 * @returns {void}
	 */
	Record.prototype._clearTimeouts = function() {
		clearTimeout( this._readAckTimeout );
		clearTimeout( this._deleteAckTimeout );
		clearTimeout( this._discardTimeout );
	};

	/**
	 * A quick check that's carried out by most methods that interact with the record
	 * to make sure it hasn't been destroyed yet - and to handle it gracefully if it has.
	 *
	 * @param   {String} methodName The name of the method that invoked this check
	 *
	 * @private
	 * @returns {Boolean} is destroyed
	 */
	Record.prototype._checkDestroyed = function( methodName ) {
		if( this.isDestroyed ) {
			this.emit( 'error', 'Can\'t invoke \'' + methodName + '\'. Record \'' + this.name + '\' is already destroyed' );
			return true;
		}

		return false;
	};
	/**
	 * Generic handler for ack, read and delete timeouts
	 *
	 * @private
	 * @returns {void}
	 */
	Record.prototype._onTimeout = function( timeoutType ) {
		this._clearTimeouts();
		this.emit( 'error', timeoutType );
	};

	/**
	 * Destroys the record and nulls all
	 * its dependencies
	 *
	 * @private
	 * @returns {void}
	 */
	 Record.prototype._destroy = function() {
	 	this._clearTimeouts();
	 	this._eventEmitter.off();
	 	this._resubscribeNotifier.destroy();
	 	this.isDestroyed = true;
	 	this.isReady = false;
	 	this._client = null;
		this._eventEmitter = null;
		this._connection = null;
	 };

	module.exports = Record;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__( 54 ),
		SPLIT_REG_EXP = /[\.\[\]]/g,
		ASTERISK = '*';

	/**
	 * This class allows to set or get specific
	 * values within a json data structure using
	 * string-based paths
	 *
	 * @param {Record} record
	 * @param {String} path A path, e.g. users[2].firstname
	 *
	 * @constructor
	 */
	var JsonPath = function( record, path ) {
		this._record = record;
		this._path = String( path );
		this._tokens = [];

		this._tokenize();
	};

	/**
	 * Returns the value of the path or
	 * undefined if the path can't be resolved
	 *
	 * @public
	 * @returns {Mixed}
	 */
	JsonPath.prototype.getValue = function() {
		var node = this._record._$data,
			i;

		for( i = 0; i < this._tokens.length; i++ ) {
			if( node[ this._tokens[ i ] ] !== undefined ) {
				node = node[ this._tokens[ i ] ];
			} else {
				return undefined;
			}
		}

		return node;
	};

	/**
	 * Sets the value of the path. If the path (or parts
	 * of it) doesn't exist yet, it will be created
	 *
	 * @param {Mixed} value
	 *
	 * @public
	 * @returns {void}
	 */
	JsonPath.prototype.setValue = function( value ) {
		var node = this._record._$data,
			i;

		for( i = 0; i < this._tokens.length - 1; i++ ) {
			if( node[ this._tokens[ i ] ] !== undefined ) {
				node = node[ this._tokens[ i ] ];
			}
			else if( this._tokens[ i + 1 ] && !isNaN( this._tokens[ i + 1 ] ) ){
				node = node[ this._tokens[ i ] ] = [];
			}
			else {
				node = node[ this._tokens[ i ] ] = {};
			}
		}

		node[ this._tokens[ i ] ] = value;
	};

	/**
	 * Parses the path. Splits it into
	 * keys for objects and indices for arrays.
	 *
	 * @private
	 * @returns {void}
	 */
	JsonPath.prototype._tokenize = function() {
		var parts = this._path.split( SPLIT_REG_EXP ),
			part,
			i;

		for( i = 0; i < parts.length; i++ ) {
			part = utils.trim( parts[ i ] );

			if( part.length === 0 ) {
				continue;
			}

			if( !isNaN( part ) ) {
				this._tokens.push( parseInt( part, 10 ) );
				continue;
			}

			if( part === ASTERISK ) {
				this._tokens.push( true );
				continue;
			}

			this._tokens.push( part );
		}
	};

	module.exports = JsonPath;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var Record = __webpack_require__( 63 ),
		EventEmitter = __webpack_require__( 7 );

	/**
	 * An AnonymousRecord is a record without a predefined name. It
	 * acts like a wrapper around an actual record that can
	 * be swapped out for another one whilst keeping all bindings intact.
	 *
	 * Imagine a customer relationship management system with a list of users
	 * on the left and a user detail panel on the right. The user detail
	 * panel could use the anonymous record to set up its bindings, yet whenever
	 * a user is chosen from the list of existing users the anonymous record's
	 * setName method is called and the detail panel will update to
	 * show the selected user's details
	 *
	 * @param {RecordHandler} recordHandler
	 * 
	 * @constructor
	 */
	var AnonymousRecord = function( recordHandler ) {
		this.name = null;
		this._recordHandler = recordHandler;
		this._record = null;
		this._subscriptions = [];
		this._proxyMethod( 'delete' );
		this._proxyMethod( 'set' );
		this._proxyMethod( 'unsubscribe' );
		this._proxyMethod( 'discard' );
	};

	EventEmitter( AnonymousRecord.prototype );

	/**
	 * Proxies the actual record's get method. It is valid
	 * to call get prior to setName - if no record exists,
	 * the method returns undefined
	 *
	 * @param   {[String]} path A json path. If non is provided,
	 *                          the entire record is returned.
	 *
	 * @public
	 * @returns {mixed}    the value of path or the entire object
	 */
	AnonymousRecord.prototype.get = function( path ) {
		if( this._record === null ) {
			return undefined;
		}

		return this._record.get( path );
	};

	/**
	 * Proxies the actual record's subscribe method. The same parameters
	 * can be used. Can be called prior to setName(). Please note, triggerIfReady
	 * will always be set to true to reflect changes in the underlying record.
	 *
	 * @param   {[String]} path 	A json path. If non is provided,
	 *	                          	it subscribes to changes for the entire record.
	 *
	 * @param 	{Function} callback A callback function that will be invoked whenever
	 *                              the subscribed path or record updates
	 *
	 * @public
	 * @returns {void}
	 */
	AnonymousRecord.prototype.subscribe = function() {
		var parameters = Record.prototype._normalizeArguments( arguments );
		parameters.triggerNow = true;
		this._subscriptions.push( parameters );

		if( this._record !== null ) {
			this._record.subscribe( parameters );
		}
	};

	/**
	 * Proxies the actual record's unsubscribe method. The same parameters
	 * can be used. Can be called prior to setName()
	 *
	 * @param   {[String]} path 	A json path. If non is provided,
	 *	                          	it subscribes to changes for the entire record.
	 *
	 * @param 	{Function} callback A callback function that will be invoked whenever
	 *                              the subscribed path or record updates
	 *
	 * @public
	 * @returns {void}
	 */
	AnonymousRecord.prototype.unsubscribe = function() {
		var parameters = Record.prototype._normalizeArguments( arguments ),
			subscriptions = [],
			i;

		for( i = 0; i < this._subscriptions.length; i++ ) {
			if(
				this._subscriptions[ i ].path !== parameters.path ||
				this._subscriptions[ i ].callback !== parameters.callback
			) {
				subscriptions.push( this._subscriptions[ i ] );
			}
		}

		this._subscriptions = subscriptions;

		if( this._record !== null ) {
			this._record.unsubscribe( parameters );
		}
	};

	/**
	 * Sets the underlying record the anonymous record is boud
	 * to. Can be called multiple times.
	 *
	 * @param {String} recordName
	 *
	 * @public
	 * @returns {void}
	 */
	AnonymousRecord.prototype.setName = function( recordName ) {
		this.name = recordName;
		
		var i;

		if( this._record !== null && !this._record.isDestroyed) {
			for( i = 0; i < this._subscriptions.length; i++ ) {
				this._record.unsubscribe( this._subscriptions[ i ] );
			}
			this._record.discard();
		}

		this._record = this._recordHandler.getRecord( recordName );

		for( i = 0; i < this._subscriptions.length; i++ ) {
			this._record.subscribe( this._subscriptions[ i ] );
		}

		this._record.whenReady( this.emit.bind( this, 'ready' ) );
		this.emit( 'nameChanged', recordName );
	};

	/**
	 * Adds the specified method to this method and forwards it
	 * to _callMethodOnRecord
	 *
	 * @param   {String} methodName
	 *
	 * @private
	 * @returns {void}
	 */
	AnonymousRecord.prototype._proxyMethod = function( methodName ) {
		this[ methodName ] = this._callMethodOnRecord.bind( this, methodName );
	};

	/**
	 * Invokes the specified method with the provided parameters on
	 * the underlying record. Throws erros if the method is not
	 * specified yet or doesn't expose the method in question
	 *
	 * @param   {String} methodName
	 *
	 * @private
	 * @returns {Mixed} the return value of the actual method
	 */
	AnonymousRecord.prototype._callMethodOnRecord = function( methodName ) {
		if( this._record === null ) {
			throw new Error( 'Can`t invoke ' + methodName + '. AnonymousRecord not initialised. Call setName first' );
		}

		if( typeof this._record[ methodName ] !== 'function' ) {
			throw new Error( methodName + ' is not a method on the record' );
		}

		var args = Array.prototype.slice.call( arguments, 1 );

		return this._record[ methodName ].apply( this._record, args );
	};

	module.exports = AnonymousRecord;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var EventEmitter = __webpack_require__( 7 ),
		Record = __webpack_require__( 63 ),
		C = __webpack_require__( 5 ),
		ENTRY_ADDED_EVENT = 'entry-added',
		ENTRY_REMOVED_EVENT = 'entry-removed',
		ENTRY_MOVED_EVENT = 'entry-moved';

	/**
	 * A List is a specialised Record that contains
	 * an Array of recordNames and provides a number
	 * of convinience methods for interacting with them.
	 *
	 * @param {RecordHanlder} recordHandler
	 * @param {String} name    The name of the list
	 *
	 * @constructor
	 */
	var List = function( recordHandler, name, options ) {
		this._recordHandler = recordHandler;
		this._record = this._recordHandler.getRecord( name, options );
		this._record._applyUpdate = this._applyUpdate.bind( this );

		this._record.on( 'delete', this.emit.bind( this, 'delete' ) );
		this._record.on( 'discard', this._onDiscard.bind( this ) );
		this._record.on( 'ready', this._onReady.bind( this ) );

		this.isDestroyed = this._record.isDestroyed;
		this.isReady = this._record.isReady;
		this.name = name;
		this._queuedMethods = [];
		this._beforeStructure = null;
		this._hasAddListener = null;
		this._hasRemoveListener = null;
		this._hasMoveListener = null;

		this.delete = this._record.delete.bind( this._record );
		this.discard = this._record.discard.bind( this._record );
		this.whenReady = this._record.whenReady.bind( this );
	};

	EventEmitter( List.prototype );

	/**
	 * Returns the array of list entries or an
	 * empty array if the list hasn't been populated yet.
	 *
	 * @public
	 * @returns {Array} entries
	 */
	List.prototype.getEntries = function() {
		var entries = this._record.get();

		if( !( entries instanceof Array ) ) {
			return [];
		}

		return entries;
	};

	/**
	 * Returns true if the list is empty
	 *
	 * @public
	 * @returns {Boolean} isEmpty
	 */
	List.prototype.isEmpty = function() {
		return this.getEntries().length === 0;
	};

	/**
	 * Updates the list with a new set of entries
	 *
	 * @public
	 * @param {Array} entries
	 */
	List.prototype.setEntries = function( entries ) {
		var errorMsg = 'entries must be an array of record names',
			i;

		if( !( entries instanceof Array ) ) {
			throw new Error( errorMsg );
		}

		for( i = 0; i < entries.length; i++ ) {
			if( typeof entries[ i ] !== 'string' ) {
				throw new Error( errorMsg );
			}
		}

		if( this._record.isReady === false ) {
			this._queuedMethods.push( this.setEntries.bind( this, entries ) );
		} else {
			this._beforeChange();
			this._record.set( entries );
			this._afterChange();
		}
	};

	/**
	 * Removes an entry from the list
	 *
	 * @param   {String} entry
	 * @param {Number} [index]
	 *
	 * @public
	 * @returns {void}
	 */
	List.prototype.removeEntry = function( entry, index ) {
		if( this._record.isReady === false ) {
			this._queuedMethods.push( this.removeEntry.bind( this, entry ) );
			return;
		}

		var currentEntries = this._record.get(),
			hasIndex = this._hasIndex( index ),
			entries = [],
			i;

		for( i = 0; i < currentEntries.length; i++ ) {
			if( currentEntries[i] !== entry || ( hasIndex && index !== i ) ) {
				entries.push( currentEntries[i] );
			}
		}
		this._beforeChange();
		this._record.set( entries );
		this._afterChange();
	};

	/**
	 * Adds an entry to the list
	 *
	 * @param {String} entry
	 * @param {Number} [index]
	 *
	 * @public
	 * @returns {void}
	 */
	List.prototype.addEntry = function( entry, index ) {
		if( typeof entry !== 'string' ) {
			throw new Error( 'Entry must be a recordName' );
		}

		if( this._record.isReady === false ) {
			this._queuedMethods.push( this.addEntry.bind( this, entry ) );
			return;
		}

		var hasIndex = this._hasIndex( index );
		var entries = this.getEntries();
		if( hasIndex ) {
			entries.splice( index, 0, entry );
		} else {
			entries.push( entry );
		}
		this._beforeChange();
		this._record.set( entries );
		this._afterChange();
	};

	/**
	 * Proxies the underlying Record's subscribe method. Makes sure
	 * that no path is provided
	 *
	 * @public
	 * @returns {void}
	 */
	List.prototype.subscribe = function() {
		var parameters = Record.prototype._normalizeArguments( arguments );

		if( parameters.path ) {
			throw new Error( 'path is not supported for List.subscribe' );
		}

		//Make sure the callback is invoked with an empty array for new records
		var listCallback = function( callback ) {
			callback( this.getEntries() );
		}.bind( this, parameters.callback );

		/**
		* Adding a property onto a function directly is terrible practice,
		* and we will change this as soon as we have a more seperate approach
		* of creating lists that doesn't have records default state.
		*
		* The reason we are holding a referencing to wrapped array is so that
		* on unsubscribe it can provide a reference to the actual method the
		* record is subscribed too.
		**/
		parameters.callback.wrappedCallback = listCallback;
		parameters.callback = listCallback;

		this._record.subscribe( parameters );
	};

	/**
	 * Proxies the underlying Record's unsubscribe method. Makes sure
	 * that no path is provided
	 *
	 * @public
	 * @returns {void}
	 */
	List.prototype.unsubscribe = function() {
		var parameters = Record.prototype._normalizeArguments( arguments );

		if( parameters.path ) {
			throw new Error( 'path is not supported for List.unsubscribe' );
		}

		parameters.callback = parameters.callback.wrappedCallback;
		this._record.unsubscribe( parameters );
	};

	/**
	 * Listens for changes in the Record's ready state
	 * and applies them to this list
	 *
	 * @private
	 * @returns {void}
	 */
	List.prototype._onReady = function() {
		this.isReady = true;

		for( var i = 0; i < this._queuedMethods.length; i++ ) {
			this._queuedMethods[ i ]();
		}

		this.emit( 'ready' );
	};

	/**
	 * Listens for the record discard event and applies
	 * changes to list
	 *
	 * @private
	 * @returns {void}
	 */
	List.prototype._onDiscard = function() {
		this.isDestroyed = true;
		this.emit( 'discard' );
	};

	/**
	 * Proxies the underlying Record's _update method. Set's
	 * data to an empty array if no data is provided.
	 *
	 * @param   {null}   path must (should :-)) be null
	 * @param   {Array}  data
	 *
	 * @private
	 * @returns {void}
	 */
	List.prototype._applyUpdate = function( message ) {
		if( message.action === C.ACTIONS.PATCH ) {
			throw new Error( 'PATCH is not supported for Lists' );
		}

		if( message.data[ 2 ].charAt( 0 ) !== '[' ) {
			message.data[ 2 ] = '[]';
		}

		this._beforeChange();
		Record.prototype._applyUpdate.call( this._record, message );
		this._afterChange();
	};

	/**
	 * Validates that the index provided is within the current set of entries.
	 *
	 * @param {Number} index
	 *
	 * @private
	 * @returns {Number}
	 */
	List.prototype._hasIndex = function( index ) {
		var hasIndex = false;
		var entries = this.getEntries();
		if( index !== undefined ) {
			if( isNaN( index ) ) {
				throw new Error( 'Index must be a number' );
			}
			if( index !== entries.length && ( index >= entries.length || index < 0 ) ) {
				throw new Error( 'Index must be within current entries' );
			}
			hasIndex = true;
		}
		return hasIndex;
	};

	/**
	 * Establishes the current structure of the list, provided the client has attached any
	 * add / move / remove listener
	 *
	 * This will be called before any change to the list, regardsless if the change was triggered
	 * by an incoming message from the server or by the client
	 *
	 * @private
	 * @returns {void}
	 */
	List.prototype._beforeChange = function() {
		this._hasAddListener = this.listeners( ENTRY_ADDED_EVENT ).length > 0;
		this._hasRemoveListener = this.listeners( ENTRY_REMOVED_EVENT ).length > 0;
		this._hasMoveListener = this.listeners( ENTRY_MOVED_EVENT ).length > 0;

		if( this._hasAddListener || this._hasRemoveListener || this._hasMoveListener ) {
			this._beforeStructure = this._getStructure();
		} else {
			this._beforeStructure = null;
		}
	};

	/**
	 * Compares the structure of the list after a change to its previous structure and notifies
	 * any add / move / remove listener. Won't do anything if no listeners are attached.
	 *
	 * @private
	 * @returns {void}
	 */
	List.prototype._afterChange = function() {
		if( this._beforeStructure === null ) {
			return;
		}

		var after = this._getStructure();
		var before = this._beforeStructure;
		var entry, i;

		if( this._hasRemoveListener ) {
			for( entry in before ) {
				for( i = 0; i < before[ entry ].length; i++ ) {
					if( after[ entry ] === undefined || after[ entry ][ i ] === undefined ) {
						this.emit( ENTRY_REMOVED_EVENT, entry, before[ entry ][ i ] );
					}
				}
			}
		}

		if( this._hasAddListener || this._hasMoveListener ) {
			for( entry in after ) {
				if( before[ entry ] === undefined ) {
					for( i = 0; i < after[ entry ].length; i++ ) {
						this.emit( ENTRY_ADDED_EVENT, entry, after[ entry ][ i ] );
					}
				} else {
					for( i = 0; i < after[ entry ].length; i++ ) {
						if( before[ entry ][ i ] !== after[ entry ][ i ] ) {
							if( before[ entry ][ i ] === undefined ) {
								this.emit( ENTRY_ADDED_EVENT, entry, after[ entry ][ i ] );
							} else {
								this.emit( ENTRY_MOVED_EVENT, entry, after[ entry ][ i ] );
							}
						}
					}
				}
			}
		}
	};

	/**
	 * Iterates through the list and creates a map with the entry as a key
	 * and an array of its position(s) within the list as a value, e.g.
	 *
	 * {
	 * 	'recordA': [ 0, 3 ],
	 * 	'recordB': [ 1 ],
	 * 	'recordC': [ 2 ]
	 * }
	 *
	 * @private
	 * @returns {Array} structure
	 */
	List.prototype._getStructure = function() {
		var structure = {};
		var i;
		var entries = this._record.get();

		for( i = 0; i < entries.length; i++ ) {
			if( structure[ entries[ i ] ] === undefined ) {
				structure[ entries[ i ] ] = [ i ];
			} else {
				structure[ entries[ i ] ].push( i );
			}
		}

		return structure;
	};

	module.exports = List;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__( 5 ),
		ResubscribeNotifier = __webpack_require__( 57 );

	/**
	 * Provides a scaffold for subscriptionless requests to deepstream, such as the SNAPSHOT 
	 * and HAS functionality. The SingleNotifier multiplexes all the client requests so 
	 * that they can can be notified at once, and also includes reconnection funcionality 
	 * incase the connection drops.
	 *
	 * @param {Client} client          The deepstream client
	 * @param {Connection} connection  The deepstream connection
	 * @param {String} topic           Constant. One of C.TOPIC
	 * @param {String} action          Constant. One of C.ACTIONS
	 * @param {Number} timeoutDuration The duration of the timeout in milliseconds
	 *
	 * @constructor
	 */
	var SingleNotifier = function( client, connection, topic, action, timeoutDuration ) {
		this._client = client;
		this._connection = connection;
		this._topic = topic;
		this._action = action;
		this._timeoutDuration = timeoutDuration;
		this._requests = {};
		this._resubscribeNotifier = new ResubscribeNotifier( this._client, this._resendRequests.bind( this ) );
	};

	/**
	 * Check if there is a request pending with a specified name
	 *
	 * @param {String} name An identifier for the request, e.g. a record name
	 *
	 * @public
	 * @returns {void}
	 */
	SingleNotifier.prototype.hasRequest = function( name ) {		
		return !!this._requests[ name ]; 
	};

	/**
	 * Add a request. If one has already been made it will skip the server request
	 * and multiplex the response
	 *
	 * @param {String} name An identifier for the request, e.g. a record name

	 *
	 * @public
	 * @returns {void}
	 */
	SingleNotifier.prototype.request = function( name, callback ) {	
		var responseTimeout;

		if( !this._requests[ name ] ) {
			this._requests[ name ] = [];
			this._connection.sendMsg( this._topic, this._action, [ name ] );
		}

		responseTimeout = setTimeout( this._onResponseTimeout.bind( this, name ), this._timeoutDuration );
		this._requests[ name ].push( { timeout: responseTimeout, callback: callback } );
	};

	/**
	 * Process a response for a request. This has quite a flexible API since callback functions
	 * differ greatly and helps maximise reuse.
	 *
	 * @param {String} name An identifier for the request, e.g. a record name
	 * @param {String} error Error message
	 * @param {Object} data If successful, the response data
	 *
	 * @public
	 * @returns {void}
	 */
	SingleNotifier.prototype.recieve = function( name, error, data ) {
		var entries = this._requests[ name ];
		for( i=0; i < entries.length; i++ ) {
			entry = entries[ i ];
			clearTimeout( entry.timeout );
			entry.callback( error, data );
		}
		delete this._requests[ name ];
	};

	/**
	 * Will be invoked if a timeout occurs before a response arrives from the server
	 *
	 * @param {String} name An identifier for the request, e.g. a record name
	 *
	 * @private
	 * @returns {void}
	 */
	SingleNotifier.prototype._onResponseTimeout = function( name ) {
		var msg = 'No response received in time for ' + this._topic + '|' + this._action + '|' + name;
		this._client._$onError( this._topic, C.EVENT.RESPONSE_TIMEOUT, msg );
	};

	/**
	 * Resends all the requests once the connection is back up
	 *
	 * @private
	 * @returns {void}
	 */
	SingleNotifier.prototype._resendRequests = function() {
		for( var request in this._requests ) {
			this._connection.sendMsg( this._topic, this._action, [ this._requests[ request ] ] );
		}
	};

	module.exports = SingleNotifier;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__( 5 ),
		WebRtcConnection = __webpack_require__( 69 ),
		WebRtcCall = __webpack_require__( 70 ),
		AckTimeoutRegistry = __webpack_require__( 56 ),
		CALLEE_UPDATE_EVENT = 'callee-update';

	/**
	 * The main class for webrtc operations
	 * 
	 * Provides an interface to register callees, make calls and listen 
	 * for callee registrations
	 *
	 * WebRTC (Web Real Time Communication) is a standard that allows browsers
	 * to share video, audio and data-streams via a peer connection. A server is only
	 * used to establish and end calls
	 *
	 * To learn more, please have a look at the WebRTC documentation on MDN
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
	 * 
	 * @param {Object} options deepstream configuration options
	 * @param {Connection} connection
	 * @param {Client} client
	 * 
	 * @constructor
	 * @public
	 */
	var WebRtcHandler = function( options, connection, client ) {
		this._options = options;
		this._connection = connection;
		this._client = client;
		this._localCallees = {};
		this._remoteCallees = [];
		this._remoteCalleesCallback = null;
		this._ackTimeoutRegistry = new AckTimeoutRegistry( client, C.TOPIC.WEBRTC, this._options.calleeAckTimeout );
		this._ackTimeoutRegistry.on( 'timeout', this._removeCallee.bind( this ) );
		this._calls = {};
	};

	/**
	 * Register a "callee" (an endpoint that can receive incoming audio and video streams). Callees are comparable
	 * to entries in a phonebook. They have a unique identifier (their name) and an on-call function that will be invoked
	 * whenever another client calls makeCall.
	 *
	 * @param   {String} 	name     A name that can be used in makeCall to establish a connection to this callee
	 * @param   {Function} 	onCallFn Callback for incoming calls. Will be invoked with a <webrtc-call> object and meta-data
	 *
	 * @public
	 * @returns {void}
	 */
	WebRtcHandler.prototype.registerCallee = function( name, onCallFn ) {
		this._checkCompatibility();

		if( typeof name !== 'string' ) {
			throw new Error( 'Invalid callee name ' + name );
		}

		if( typeof onCallFn !== 'function' ) {
			throw new Error( 'Callback is not a function' );
		}

		if( this._localCallees[ name ] ) {
			throw new Error( 'Callee ' + name + ' is already registered' );
		}

		this._localCallees[ name ] = onCallFn;
		this._ackTimeoutRegistry.add( name );
		this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_REGISTER_CALLEE, [ name ] );
	};

	/**
	 * Removes a callee that was previously registered with WebRtcHandler.registerCallee
	 *
	 * @param   {String} name calleeName
	 *
	 * @public
	 * @returns {void}
	 */
	WebRtcHandler.prototype.unregisterCallee = function( name ) {
		if( !this._localCallees[ name ] ) {
			throw new Error( 'Callee is not registered' );
		}
		
		this._removeCallee( name );
		this._ackTimeoutRegistry.add( name );
		this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_UNREGISTER_CALLEE, [ name ] );
	};

	/**
	 * Creates a call to another registered callee. This call can still be declined or remain unanswered. The call
	 * object that this method returns will emit an 'established' event once the other side has accepted it and shares
	 * its video/audio stream.
	 *
	 * @param   {String} calleeName  The name of a previously registered callee
	 * @param 	{Object} metaData	Additional information that will be passed to the receiver's onCall function
	 * @param   {[MediaStream]} localStream A local media stream. Can be ommited if the call is used purely for data.

	 * @public
	 * @returns {WebRtcCall}
	 */
	WebRtcHandler.prototype.makeCall = function( calleeName, metaData, localStream ) {
		this._checkCompatibility();

		if( typeof calleeName !== 'string' ) {
			throw new Error( 'Callee must be provided as string' );
		}

		if( typeof metaData !== 'object' ) {
			throw new Error( 'metaData must be provided' );
		}

		if( this._calls[ calleeName ] ) {
			throw new Error( 'Call with ' + calleeName + ' is already in progress' );
		}

		var localId = this._client.getUid();

		this._ackTimeoutRegistry.add( localId );

		return this._createCall( calleeName, {
			isOutgoing: true,
			connection: this._connection, 
			localId: localId, 
			remoteId: calleeName, 
			localStream: localStream,
			offer: null,
			metaData: metaData
		});
	};
	 
	/**
	 * Register a listener that will be invoked with all callees that are currently registered. This is
	 * useful to create a "phone-book" display. Only one listener can be registered at a time
	 *
	 * @param   {Function} callback Will be invoked initially and every time a callee is added or removed
	 *
	 * @public
	 * @returns {void}
	 */
	WebRtcHandler.prototype.listenForCallees = function( callback ) {
		if( this._remoteCalleesCallback !== null ) {
			throw new Error( 'Already listening for callees' );
		}
		this._remoteCalleesCallback = callback;
		this._ackTimeoutRegistry.add( CALLEE_UPDATE_EVENT );
		this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_LISTEN_FOR_CALLEES );
	};

	/**
	 * Removes the listener that was previously registered with listenForCallees
	 *
	 * @public
	 * @returns {void}
	 */
	WebRtcHandler.prototype.unlistenForCallees = function() {
		if( !this._remoteCalleesCallback ) {
			throw new Error( 'Not listening for callees' );
		}
		this._remoteCalleesCallback = null;
		this._ackTimeoutRegistry.add( CALLEE_UPDATE_EVENT );
		this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_UNLISTEN_FOR_CALLEES );
	};

	/**
	 * This method is invoked whenever an incoming call message is received. It constracts
	 * a call object and passes it to the callback function that was registered with registerCallee
	 *
	 * @param   {Object} message parsed deepstream message
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcHandler.prototype._handleIncomingCall = function( message ) {
		var remoteId = message.data[ 0 ],
			localId = message.data[ 1 ],
			offer = JSON.parse( message.data[ 2 ] ),
			call = this._createCall( remoteId, {
				isOutgoing: false,
				connection: this._connection, 
				localId: localId, 
				remoteId: remoteId, 
				localStream: null,
				metaData: offer.meta,
				offer: offer
			});

		this._localCallees[ localId ]( call, offer.meta );
	};

	/**
	 * Removes a call from the internal cache. This can be the result of a call ending, being
	 * declined or erroring.
	 *
	 * @param   {String} id The temporary id (receiverName for incoming-, senderName for outgoing calls)
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcHandler.prototype._removeCall = function( id ) {
		delete this._calls[ id ];
	};

	/**
	 * Creates a new instance of WebRtcCall
	 *
	 * @param   {String} id The temporary id (receiverName for incoming-, senderName for outgoing calls)
	 * @param   {Object} settings Call settings. Please see WebRtcCall for details
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcHandler.prototype._createCall = function( id, settings ) {
		this._calls[ id ] = new WebRtcCall( settings, this._options );
		this._calls[ id ].on( 'ended', this._removeCall.bind( this, id ) );
		return this._calls[ id ];
	};

	/**
	 * All call-related messages (offer, answer, ice candidate, decline, end etc.) share the same data signature.
	 *
	 * [ senderName, receiverName, arbitrary data string ]
	 *
	 * This method makes sure the message is in the correct format.
	 *
	 * @param   {Object}  message A parsed deepstream message
	 *
	 * @private
	 * @returns {Boolean}
	 */
	WebRtcHandler.prototype._isValidMessage = function( message ) {
		return message.data.length === 3 &&
		typeof message.data[ 0 ] === 'string' &&
		typeof message.data[ 1 ] === 'string' &&
		typeof message.data[ 2 ] === 'string';
	};

	/**
	 * Returns true if the messages is an update to the list of updated callees
	 *
	 * @param   {Object}  message A parsed deepstream message
	 *
	 * @private
	 * @returns {Boolean}
	 */
	WebRtcHandler.prototype._isCalleeUpdate = function( message ) {
		return 	message.action === C.ACTIONS.WEBRTC_ALL_CALLEES ||
				message.action === C.ACTIONS.WEBRTC_CALLEE_ADDED ||
				message.action === C.ACTIONS.WEBRTC_CALLEE_REMOVED;
	};

	/**
	 * The WebRTC specification is still very much in flux and implementations are fairly unstandardized. To
	 * get WebRTC to work across all supporting browsers it is therefor crucial to use a shim / adapter script
	 * to normalize implementation specifities.
	 *
	 * This adapter script however is not included with the client. This is for three reasons:
	 * 
	 * - Whilst WebRTC is a great feature of deepstream, it is not a central one. Most usecases will probably
	 *   focus on Records, Events and RPCs. We've therefor choosen to rather reduce the client size and leave
	 *   it to WebRTC users to include the script themselves
	 *
	 * - Since the API differences are still subject to frequent change it is likely that updates to the WebRTC
	 *   adapter script will be quite frequent. By making it a seperate dependency it can be updated individually
	 *   as soon as it is released.
	 *
	 * - Whilst working well, the code quality of adapter is rather poor. It lives in the global namespace, adds
	 *   console logs etc.
	 *
	 * This method checks if all the WebRTC related objects that it will use further down the line are present
	 * and if not recommends usage of the WebRTC adapter script
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcHandler.prototype._checkCompatibility = function() {
		if(
			typeof RTCPeerConnection === 'undefined' ||
			typeof RTCSessionDescription === 'undefined' ||
			typeof RTCIceCandidate === 'undefined'
		){
			var msg =  'RTC global objects not detected. \n';
				msg += 'deepstream expects a standardized WebRtc implementation (e.g. no vendor prefixes etc.) \n';
				msg += 'until WebRtc is fully supported, we recommend including the official WebRTC adapter script \n';
				msg += 'which can be found at https://github.com/webrtc/adapter';

			throw new Error( msg );
		}
	};

	/**
	 * Removes a callee from the internal cache as a result of an ACK timeout or the callee being unregistered.
	 *
	 * @param   {String} calleeName A local callee that was previously registered using registerCallee
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcHandler.prototype._removeCallee = function( calleeName ) {
		delete this._localCallees[ calleeName ];
	};

	/**
	 * Processes an update to the list of callees that are registered with deepstream. When listenForCallees
	 * is initally called, it receives a full list of all registered callees. From there on it is only
	 * send deltas. This method merges the delta updates into the full array of registered callees and
	 * invokes the listener callback with the result.
	 *
	 * @param   {Object} message a parsed deepstream message
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcHandler.prototype._processCalleeUpdate = function( message ) {
		if( this._remoteCalleesCallback === null ) {
			this._client._$onError( C.TOPIC.WEBRTC, C.EVENT.UNSOLICITED_MESSAGE, message.raw );
			return;
		}

		if( message.action === C.ACTIONS.WEBRTC_ALL_CALLEES ) {
			this._remoteCallees = message.data;
		}

		var index = this._remoteCallees.indexOf( message.data[ 0 ] );
		
		if( message.action === C.ACTIONS.WEBRTC_CALLEE_ADDED ) {
			if( index !== -1 ) {
				return;
			}
			this._remoteCallees.push( message.data[ 0 ] );
		}
		else if ( message.action === C.ACTIONS.WEBRTC_CALLEE_REMOVED ) {
			if( index === -1 ) {
				return;
			}
			this._remoteCallees.splice( index, 1 );
		}

		this._remoteCalleesCallback( this._remoteCallees );
	};

	/**
	 * The main method for incoming WebRTC messages.
	 *
	 * @param   {Object} message a parsed deepstream message
	 *
	 *
	 * @private
	 * 
	 * @returns {void}
	 */
	WebRtcHandler.prototype._$handle = function( message ) {
		var call,
			sessionDescription,
			iceCandidate;

		if( message.action === C.ACTIONS.ERROR ) {
			this._client._$onError( C.TOPIC.WEBRTC, message.data[ 0 ], message.data[ 1 ] );
			return;
		}

		if( message.action === C.ACTIONS.ACK ) {
			this._ackTimeoutRegistry.clear( message );
			return;
		}

		if( this._isCalleeUpdate( message ) ) {
			this._processCalleeUpdate( message );
			return;	
		}

		if( message.action === C.ACTIONS.WEBRTC_IS_ALIVE ) {
			if( message.data[ 1 ] === 'false' && this._calls[ message.data[ 0 ] ] ) {
				this._calls[ message.data[ 0 ] ]._$close();
			}
			return;
		}

		if( !this._isValidMessage( message ) ) {
			this._client._$onError( C.TOPIC.WEBRTC, C.EVENT.MESSAGE_PARSE_ERROR, message );
			return;
		}

		if( message.action === C.ACTIONS.WEBRTC_OFFER ) {
			this._handleIncomingCall( message );
			return;
		}

		call = this._calls[ message.data[ 0 ] ] || this._calls[ message.data[ 1 ] ];

		if( !call ) {
			this._client._$onError( C.TOPIC.WEBRTC, C.EVENT.UNSOLICITED_MESSAGE, message.raw );
			return;
		}
		
		if ( message.action === C.ACTIONS.WEBRTC_ANSWER ) {
			sessionDescription = new RTCSessionDescription( JSON.parse( message.data[ 2 ] ) );
			call._$webRtcConnection.setRemoteDescription( sessionDescription );
			return;
		}
		
		if( message.action === C.ACTIONS.WEBRTC_ICE_CANDIDATE ) {
			iceCandidate = new RTCIceCandidate( JSON.parse( message.data[ 2 ] ) );
			call._$addIceCandidate( iceCandidate );
			return;
		}

		if( message.action === C.ACTIONS.WEBRTC_CALL_DECLINED ) {
			call._$declineReceived( message.data[ 2 ] );
			return;
		}
		
		if( message.action === C.ACTIONS.WEBRTC_CALL_ENDED ) {
			call._$close();
			return;
		}

		this._client._$onError( C.TOPIC.WEBRTC, C.EVENT.EVENT.MESSAGE_PARSE_ERROR, 'unsupported action ' + message.action );
	};

	module.exports = WebRtcHandler;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var Emitter = __webpack_require__( 7 );
	var C = __webpack_require__( 5 );
	var noop = function(){};

	/**
	 * This class wraps around the native RTCPeerConnection
	 * object (https://developer.mozilla.org/en/docs/Web/API/RTCPeerConnection)
	 * and provides a thin layer of deepstream integration
	 *
	 * @constructor
	 * 
	 * @event error {Error}
	 * @event stream {MediaStream}
	 * 
	 * @param {Connection} connection deepstream connection
	 * @param {Object} options deepstream options
	 * @param {String} localId    either a random id for outgoing calls or a callee name for incoming calls
	 * @param {String} remoteId   either a random id for incoming calls or a callee name for outgoing calls
	 */
	var WebRtcConnection = function( connection, options, localId, remoteId ) {
		this._connection = connection;
		this._remoteId = remoteId;
		this._localId = localId;

		this._peerConnection = new RTCPeerConnection( options.rtcPeerConnectionConfig );
		this._peerConnection.onaddstream = this._onStream.bind( this );
		this._peerConnection.onicecandidate = this._onIceCandidate.bind( this );
		this._peerConnection.oniceconnectionstatechange = this._onIceConnectionStateChange.bind( this );
		this._constraints = { mandatory: { OfferToReceiveAudio: true, OfferToReceiveVideo: true } };
	};

	Emitter( WebRtcConnection.prototype );

	/**
	 * Initiates a connection if this is an outgoing call
	 *
	 * @param   {MediaStream} stream   the local media stream
	 * @param   {Mixed} metaData metaData will be attached to the offer
	 *
	 * @public
	 * @returns {void}
	 */
	WebRtcConnection.prototype.initiate = function( stream, metaData ) {
		this._peerConnection.addStream( stream );
		this._peerConnection.createOffer( this._onOfferCreated.bind( this, metaData ), this._onError.bind( this ) );
	};

	/**
	 * Closes the connection
	 *
	 * @public
	 * @returns {void}
	 */
	WebRtcConnection.prototype.close = function() {
		this._peerConnection.close();
	};

	/**
	 * Add a Media Stream to the connection
	 *
	 * @param   {MediaStream} stream   the local media stream
	 *
	 * @public
	 * @returns {void}
	 */
	WebRtcConnection.prototype.addStream = function( stream ) {
		this._peerConnection.addStream( stream );
	};

	/**
	 * Adds a remote description SDP
	 *
	 * @param {RTCSessionDescription} remoteDescription A session description SDP (https://developer.mozilla.org/en/docs/Web/API/RTCSessionDescription)
	 * 
	 * @public
	 * @returns {void}
	 */
	WebRtcConnection.prototype.setRemoteDescription = function( remoteDescription ) {
		this._peerConnection.setRemoteDescription( remoteDescription, noop, this._onError.bind( this ) );
	};

	/**
	 * Create an answer SDP
	 *
	 * @public
	 * @returns {void}
	 */
	WebRtcConnection.prototype.createAnswer = function() {
		this._peerConnection.createAnswer( this._onAnswerCreated.bind( this ), this._onError.bind( this ), this._constraints );
	};

	/**
	 * Adds an RTCIceCandidate to the peerConnection
	 *
	 * @param {RTCIceCandidate} iceCandidate
	 *
	 * @public
	 * @returns {void}
	 */
	WebRtcConnection.prototype.addIceCandidate = function( iceCandidate ) {
		this._peerConnection.addIceCandidate( iceCandidate, noop, this._onError.bind( this ) );
	};

	/**
	 * Callback for incoming stream
	 *
	 * @param   {MediaStreamEvent} event (https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamEvent)
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcConnection.prototype._onStream = function( event ) {
		this.emit( 'stream', event.stream );
	};

	/**
	 * Callback once the offer was created (why does this happen asynchronously?)
	 *
	 * @param   {Mixed} metaData
	 * @param   {RTCSessionDescription} offer
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcConnection.prototype._onOfferCreated = function( metaData, offer ) {
		this._sendMsg( C.ACTIONS.WEBRTC_OFFER, JSON.stringify({
			sdp: offer.sdp,
			type: offer.type,
			meta: metaData
		}));
		this._peerConnection.setLocalDescription( offer, noop, this._onError.bind( this ) );
	};

	/**
	 * Callback once the answer was created (why does this happen asynchronously?)
	 *
	 * @param   {Mixed} metaData
	 * @param   {RTCSessionDescription} answer
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcConnection.prototype._onAnswerCreated = function( answer ) {
		this._sendMsg( C.ACTIONS.WEBRTC_ANSWER, answer.toJSON() );
		this._peerConnection.setLocalDescription( answer, noop, this._onError.bind( this ) );
	};	

	/**
	 * Sends a message via deepstream
	 *
	 * @param   {String} action one of C.ACTIONS
	 * @param   {String} data
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcConnection.prototype._sendMsg = function( action, data ) {
		this._connection.sendMsg( 
			C.TOPIC.WEBRTC,
			action,
			[ this._localId, this._remoteId, data ]
		);
	};

	/**
	 * Callback for incoming ICECandidates
	 *
	 * @param   {RTCPeerConnectionIceEvent} event https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnectionIceEvent
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcConnection.prototype._onIceCandidate = function( event ) {
		if( event.candidate ) {
			this._sendMsg( C.ACTIONS.WEBRTC_ICE_CANDIDATE, event.candidate.toJSON() );
		}
	};

	/**
	 *  Callback for changes to the ICE connection state
	 *  
	 *  Available states are
	 *  
	 * "new": the ICE agent is gathering addresses or waiting for remote candidates (or both).
	 * "checking": the ICE agent has remote candidates, on at least one component, and is check them, though it has not found a connection yet. At the same time, it may still be gathering candidates.
	 * "connected": the ICE agent has found a usable connection for each component, but is still testing more remote candidates for a better connection. At the same time, it may still be gathering candidates.
	 * "completed": the ICE agent has found a usable connection for each component, and is no more testing remote candidates.
	 * "failed": the ICE agent has checked all the remote candidates and didn't find a match for at least one component. Connections may have been found for some components.
	 * "disconnected": liveness check has failed for at least one component. This may be a transient state, e. g. on a flaky network, that can recover by itself.
	 * "closed": the ICE agent has shutdown and is not answering to requests.
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcConnection.prototype._onIceConnectionStateChange = function() {
		if( this._peerConnection.iceConnectionState === 'disconnected' ) {
			this._connection.sendMsg( 
				C.TOPIC.WEBRTC,
				C.ACTIONS.WEBRTC_IS_ALIVE,
				[ this._remoteId ]
			);
		}
	};

	/**
	 * Error callback
	 *
	 * @param   {Error} error
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcConnection.prototype._onError = function( error ) {
		this.emit( 'error', error );
	};

	module.exports = WebRtcConnection;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var WebRtcConnection = __webpack_require__( 69 ),
		EventEmitter = __webpack_require__( 7 ),
		C = __webpack_require__( 5 );

	/**
	 * This class represents a single call between two peers
	 * in all its states. It's returned by ds.webrtc.makeCall
	 * as well as passed to the callback of 
	 * ds.webrtc.registerCallee( name, callback );
	 *
	 * @constructor
	 * @extends {EventEmitter}
	 *
	 * @event established <remoteStream>
	 * @event declined <reason>
	 * @event error <error>
	 * @event stateChange <state>
	 * @event ended
	 *
	 * @param {Object} settings
	 *
	 * {
	 * 		isOutgoing: <Boolean>, 
	 * 		connection: <Deepstream Connection>,
	 * 		localId: <String>,
	 * 		remoteId: <String>,
	 * 		localStream: <MediaStream>,
	 * 		offer: <Offer SDP>
	 * }
	 *
	 * @param {Object} options deepstream options
	 */
	var WebRtcCall = function( settings, options ) {
		this._connection = settings.connection;
		this._localId = settings.localId;
		this._remoteId = settings.remoteId;
		this._localStream = settings.localStream;
		this._offer = settings.offer;
		this._$webRtcConnection = null;
		this._bufferedIceCandidates = [];
		this._options = options;

		this.state = C.CALL_STATE.INITIAL;
		this.metaData = settings.metaData || null;
		this.callee = settings.isOutgoing ? settings.remoteId : settings.localId;
		this.isOutgoing = settings.isOutgoing;
		this.isIncoming = !settings.isOutgoing;
		this.isAccepted = false;
		this.isDeclined = false;
		
		if( this.isOutgoing ) {
			this._initiate();
		}
	};

	EventEmitter( WebRtcCall.prototype );

	/**
	 * Accept an incoming call
	 *
	 * @param   {MediaStream} localStream
	 *
	 * @public
	 * @returns {void}
	 */
	WebRtcCall.prototype.accept = function( localStream ) {
		if( this.isAccepted ) {
			throw new Error( 'Incoming call is already accepted' );
		}

		if( this.isDeclined ) {
			throw new Error( 'Can\'t accept incoming call. Call was already declined' );
		}

		this.isAccepted = true;

		this._$webRtcConnection = new WebRtcConnection( this._connection, this._options, this._localId, this._remoteId );
		
		if( localStream ) {
			this._$webRtcConnection.addStream( localStream );
		}
		
		this._$webRtcConnection.setRemoteDescription( new RTCSessionDescription( this._offer ) );
		this._$webRtcConnection.createAnswer();
		this._$webRtcConnection.on( 'stream', this._onEstablished.bind( this ) );
		this._$webRtcConnection.on( 'error', this.emit.bind( this, 'error' ) );

		for( var i = 0; i < this._bufferedIceCandidates.length; i++ ) {
			this._$webRtcConnection.addIceCandidate( this._bufferedIceCandidates[ i ] );
		}
		
		this._bufferedIceCandidates = [];
		this._stateChange( C.CALL_STATE.ACCEPTED );
	};

	/**
	 * Decline an incoming call
	 *
	 * @param   {[String]} reason An optional reason as to why the call was declined
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcCall.prototype.decline = function( reason ) {
		if( this.isAccepted ) {
			throw new Error( 'Can\'t decline incoming call. Call was already accepted' );
		}

		if( this.isDeclined ) {
			throw new Error( 'Incoming call was already declined' );
		}

		this.isDeclined = true;
		this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_CALL_DECLINED, [ this._localId, this._remoteId, reason || null ] );
		this._$declineReceived( reason || null );
	};

	/**
	 * Ends a call that's in progress.
	 *
	 * @public
	 * @returns {void}
	 */
	WebRtcCall.prototype.end = function() {
		this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_CALL_ENDED, [ this._localId, this._remoteId, null ] );
		this._$close();
	};

	/**
	 * Closes the connection and ends the call. This can be invoked from the
	 * outside as a result of an incoming end message as well as by calling end()
	 *
	 * @protected
	 * @returns {void}
	 */
	WebRtcCall.prototype._$close = function() {
		this._stateChange( C.CALL_STATE.ENDED );
		if( this._$webRtcConnection ) {
			this._$webRtcConnection.close();
		}
		this.emit( 'ended' );
	};

	/**
	 * Add an ICE (Interactive Connection Establishing) Candidate
	 *
	 * @param   {RTCIceCandidate} iceCandidate An object, describing a host and port combination
	 *                                         that the peers can try to connect on
	 *
	 * @protected
	 * @returns {void}
	 */
	WebRtcCall.prototype._$addIceCandidate = function( iceCandidate ) {
		if( this.isIncoming && this.isAccepted === false ) {
			this._bufferedIceCandidates.push( iceCandidate );
		} else {
			this._$webRtcConnection.addIceCandidate( iceCandidate );
		}
	};

	/**
	 * Will be invoked by the webrtcHandler if a decline message is received from the other party
	 *
	 * @param   {[String]} reason Optional reason as to why the call was declined
	 *
	 * @protected
	 * @returns {void}
	 */
	WebRtcCall.prototype._$declineReceived = function( reason ) {
		this.isDeclined = true;
		this.isAccepted = false;
		this._stateChange( C.CALL_STATE.DECLINED );
		this.emit( 'declined', reason );
	};

	/**
	 * Is invoked for every stateChange
	 *
	 * @param   {String} state one of C.CALL_STATE
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcCall.prototype._stateChange = function( state ) {
		this.state = state;
		this.emit( 'stateChange', state );
	};

	/**
	 * Initiates the an outgoing call
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcCall.prototype._initiate = function() {
		this._stateChange( C.CALL_STATE.CONNECTING );
		this._$webRtcConnection = new WebRtcConnection( this._connection, this._options, this._localId, this._remoteId );
		this._$webRtcConnection.initiate( this._localStream, this.metaData );
		this._$webRtcConnection.on( 'stream', this._onEstablished.bind( this ) );
	};

	/**
	 * Callback for accept messages. Sets the call to established and informs the client
	 *
	 * @param   {MediaStream} stream
	 *
	 * @private
	 * @returns {void}
	 */
	WebRtcCall.prototype._onEstablished = function( stream ) {
		this.isDeclined = false;
		this.isAccepted = true;
		this._stateChange( C.CALL_STATE.ESTABLISHED );
		this.emit( 'established', stream );
	};

	module.exports = WebRtcCall;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var MERGE_STRATEGIES = __webpack_require__( 6 );

	module.exports = {
		/************************************************
		* Deepstream									*
		************************************************/

		/**
		 * @param {Boolean} recordPersistDefault Whether records should be
		 *                                       persisted by default. Can be overwritten
		 *                                       for individual records when calling getRecord( name, persist );
		 */
		recordPersistDefault: true,

		/**
		 * @param {Number} reconnectIntervalIncrement Specifies the number of milliseconds by which the time until
		 *                                            the next reconnection attempt will be incremented after every
		 *                                            unsuccesful attempt.
		 *                                            E.g. for 1500: if the connection is lost, the client will attempt to reconnect
		 *                                            immediatly, if that fails it will try again after 1.5 seconds, if that fails
		 *                                            it will try again after 3 seconds and so on
		 */
		reconnectIntervalIncrement: 4000,

		/**
		 * @param {Number} maxReconnectInterval       Specifies the maximum number of milliseconds for the reconnectIntervalIncrement
		 *                                            The amount of reconnections will reach this value
		 *                                            then reconnectIntervalIncrement will be ignored.
		 */
		maxReconnectInterval: 180000,

		/**
		 * @param {Number} maxReconnectAttempts		The number of reconnection attempts until the client gives
		 *                                       	up and declares the connection closed
		 */
		maxReconnectAttempts: 5,

		/**
		 * @param {Number} rpcAckTimeout			The number of milliseconds after which a rpc will create an error if
		 * 											no Ack-message has been received
		 */
		 rpcAckTimeout: 6000,

		 /**
		 * @param {Number} rpcResponseTimeout		The number of milliseconds after which a rpc will create an error if
		 * 											no response-message has been received
		 */
		 rpcResponseTimeout: 10000,

		 /**
		 * @param {Number} subscriptionTimeout		The number of milliseconds that can pass after providing/unproviding a RPC or subscribing/unsubscribing/
		 * 											listening to a record before an error is thrown
		 */
		 subscriptionTimeout: 2000,

		 /**
		  * @param {Number} maxMessagesPerPacket	If the implementation tries to send a large number of messages at the same
		  *                                      	time, the deepstream client will try to split them into smaller packets and send
		  *                                      	these every <timeBetweenSendingQueuedPackages> ms.
		  *
		  *                                       	This parameter specifies the number of messages after which deepstream sends the
		  *                                       	packet and queues the remaining messages. Set to Infinity to turn the feature off.
		  *
		  */
		 maxMessagesPerPacket: 100,

		 /**
		  * @param {Number} timeBetweenSendingQueuedPackages Please see description for maxMessagesPerPacket. Sets the time in ms.
		  */
		 timeBetweenSendingQueuedPackages: 16,

		 /**
		  * @param {Number} recordReadAckTimeout 	The number of milliseconds from the moment client.record.getRecord() is called
		  *                                       	until an error is thrown since no ack message has been received.
		  */
		 recordReadAckTimeout: 1000,

		 /**
		  * @param {Number} recordReadTimeout 		The number of milliseconds from the moment client.record.getRecord() is called
		  *                                       	until an error is thrown since no data has been received.
		  */
		 recordReadTimeout: 3000,

		 /**
		  * @param {Number} recordDeleteTimeout 	The number of milliseconds from the moment record.delete() is called
		  *                                       	until an error is thrown since no delete ack message had been received. Please
		  *                                       	take into account that the deletion is only complete after the record has been
		  *                                       	deleted from both cache and storage
		  */
		 recordDeleteTimeout: 3000,

		 /**
		  * @param {Number} calleeAckTimeout 		The number of milliseconds from the moment webrtc.registerCallee has been
		  *                                    		called until an error is thrown since no ACK response has been received
		  */
		 calleeAckTimeout: 3000,

		 /**
		  * @param {Object} rtcPeerConnectionConfig An RTCConfiguration (https://developer.mozilla.org/en/docs/Web/API/RTCConfiguration). This
		  *                                         is used to establish your public IP address when behind a NAT (Network Address Translation)
		  *                                         Set to null if you only intend to use WebRTC within your local network
		  */
		 rtcPeerConnectionConfig: { iceServers: [
			{ url: 'stun:stun.services.mozilla.com' },
			{ url: 'stun:stun.l.google.com:19302' }
		]},

		/************************************************
		* Engine.io										*
		************************************************/

		/**
		 * @param {http.Agent} agent http.Agent to use, defaults to false (NodeJS only)
		 */
		agent: false,

		/**
		 * @param {Boolean} upgrade 	whether the client should try to upgrade the
		 *                          	transport from long-polling to something better
		 */
		upgrade: true,

		/**
		 * @param {Boolean} forceJSONP forces JSONP for polling transport
		 */
		forceJSONP: false,

		/**
		 * @param {Boolean} jsonp determines whether to use JSONP when
		 *                        necessary for polling. If disabled (by settings to false)
		 *                        an error will be emitted (saying "No transports available")
		 *                        if no other transports are available. If another transport
		 *                        is available for opening a connection (e.g. WebSocket)
		 *                        that transport will be used instead.
		 */
		jsonp: true,

		/**
		 * @param {Boolean} forceBase64 forces base 64 encoding for polling transport even when XHR2 responseType
		 *                              is available and WebSocket even if the used standard supports binary.
		 */
		forceBase64: false,

		/**
		 * @param {Boolean} enablesXDR 	enables XDomainRequest for IE8 to avoid loading bar flashing with click sound.
		 *                              default to false because XDomainRequest has a flaw of not sending cookie.
		 */
		enablesXDR: false,

		/**
		 * @param {Boolean} timestampRequests 	whether to add the timestamp with each transport request. Note: this is
		 *                                     	ignored if the browser is IE or Android, in which case requests are always stamped
		 */
		timestampRequests: false,

		/**
		 * @param {String} timestampParam timestamp parameter
		 */
		timestampParam: 't',

		/**
		 * @param {Number} policyPort ort the policy server listens on
		 */
		policyPort: 843,

		/**
		 * @param {String} path path to connect to
		 */
		path: '/deepstream',

		/**
		 * @param {Array} transports 	a list of transports to try (in order). Engine always
		 *                             	attempts to connect directly with the first one,
		 *                             	provided the feature detection test for it passes.
		 */
		transports: [ 'polling', 'websocket' ],

		/**
		 * @param {Boolean} rememberUpgrade 	If true and if the previous websocket connection to
		 *                                   	the server succeeded, the connection attempt will bypass the normal
		 *                                   	upgrade process and will initially try websocket. A connection
		 *                                   	attempt following a transport error will use the normal upgrade
		 *                                   	process. It is recommended you turn this on only when using
		 *                                   	SSL/TLS connections, or if you know that
		 *                                   	your network does not block websockets.
		 */
		rememberUpgrade: false,

		/**
	   *  @param {Function} mergeStrategy 	This provides the default strategy used to deal with merge conflicts.
		 *                                   If the merge strategy is not succesfull it will set an error, else set the
		 *                                   returned data as the latest revision. This can be overriden on a per record
		 *                                   basis by setting the `setMergeStrategy`.
		 */
		mergeStrategy: MERGE_STRATEGIES.REMOTE_WINS
	};


/***/ }
/******/ ])
});
;