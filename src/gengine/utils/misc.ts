/**
 * misc utilities
 * @class misc
 * @static
 */
const misc = {} as {[key: string]: any}

// misc.propertyDefine = function (ctor, sameNameGetSets, diffNameGetSets) {
//   function define (np, propName, getter, setter) {
//     var pd = Object.getOwnPropertyDescriptor(np, propName);
//     if (pd) {
//       if (pd.get) np[getter] = pd.get;
//       if (pd.set && setter) np[setter] = pd.set;
//     }
//     else {
//       var getterFunc = np[getter];
//       if (CC_DEV && !getterFunc) {
//         var clsName = (cc.Class._isCCClass(ctor) && js.getClassName(ctor)) ||
//           ctor.name ||
//           '(anonymous class)';
//         cc.warnID(5700, propName, getter, clsName);
//       }
//       else {
//         js.getset(np, propName, getterFunc, np[setter]);
//       }
//     }
//   }
//   var propName, np = ctor.prototype;
//   for (var i = 0; i < sameNameGetSets.length; i++) {
//     propName = sameNameGetSets[i];
//     var suffix = propName[0].toUpperCase() + propName.slice(1);
//     define(np, propName, 'get' + suffix, 'set' + suffix);
//   }
//   for (propName in diffNameGetSets) {
//     var getset = diffNameGetSets[propName];
//     define(np, propName, getset[0], getset[1]);
//   }
// };

/**
 * @param {Number} x
 * @return {Number}
 * Constructor
 */
misc.NextPOT = function (x: number) {
  x = x - 1
  x = x | (x >> 1)
  x = x | (x >> 2)
  x = x | (x >> 4)
  x = x | (x >> 8)
  x = x | (x >> 16)
  return x + 1
}

// var DirtyFlags = m.DirtyFlags = {
//    TRANSFORM: 1 << 0,
//    SIZE: 1 << 1,
//    //Visible:
//    //Color:
//    //Opacity
//    //Cache
//    //Order
//    //Text
//    //Gradient
//    ALL: (1 << 2) - 1
// };
//
// DirtyFlags.WIDGET = DirtyFlags.TRANSFORM | DirtyFlags.SIZE;

// if (CC_EDITOR) {
//   // use anonymous function here to ensure it will not being hoisted without CC_EDITOR
//
//   misc.tryCatchFunctor_EDITOR = function (funcName) {
//     return Function('target',
//       'try {\n' +
//       '  target.' + funcName + '();\n' +
//       '}\n' +
//       'catch (e) {\n' +
//       '  cc._throw(e);\n' +
//       '}')
//   }
// }

misc.BUILTIN_CLASSID_RE = /^(?:cc|dragonBones|sp|ccsg)\..+/

var BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
var BASE64_VALUES = new Array(123) // max char code in base64Keys
for (let i = 0; i < 123; ++i) BASE64_VALUES[i] = 64 // fill with placeholder('=') index
for (let i = 0; i < 64; ++i) BASE64_VALUES[BASE64_KEYS.charCodeAt(i)] = i

// decoded value indexed by base64 char code
misc.BASE64_VALUES = BASE64_VALUES

// set value to map, if key exists, push to array
misc.pushToMap = function (map: any, key: string, value: any, pushFront: boolean) {
  var exists = map[key]
  if (exists) {
    if (Array.isArray(exists)) {
      if (pushFront) {
        exists.push(exists[0])
        exists[0] = value
      } else {
        exists.push(value)
      }
    } else {
      map[key] = (pushFront ? [value, exists] : [exists, value])
    }
  } else {
    map[key] = value
  }
}

/**
 * !#en Clamp a value between from and to.
 * !#zh
 * 限定浮点数的最大最小值。<br/>
 * 数值大于 maxInclusive 则返回 maxInclusive。<br/>
 * 数值小于 minInclusive 则返回 minInclusive。<br/>
 * 否则返回自身。
 * @method clampf
 * @param {Number} value
 * @param {Number} minInclusive
 * @param {Number} maxInclusive
 * @return {Number}
 * @example
 * var v1 = cc.misc.clampf(20, 0, 20); // 20;
 * var v2 = cc.misc.clampf(-1, 0, 20); //  0;
 * var v3 = cc.misc.clampf(10, 0, 20); // 10;
 */
misc.clampf = function (value: number, minInclusive: number, maxInclusive: number) {
  if (minInclusive > maxInclusive) {
    var temp = minInclusive
    minInclusive = maxInclusive
    maxInclusive = temp
  }
  return value < minInclusive ? minInclusive : value < maxInclusive ? value : maxInclusive
}

/**
 * !#en Clamp a value between 0 and 1.
 * !#zh 限定浮点数的取值范围为 0 ~ 1 之间。
 * @method clamp01
 * @param {Number} value
 * @return {Number}
 * @example
 * var v1 = cc.misc.clamp01(20);  // 1;
 * var v2 = cc.misc.clamp01(-1);  // 0;
 * var v3 = cc.misc.clamp01(0.5); // 0.5;
 */
misc.clamp01 = function (value: number) {
  return value < 0 ? 0 : value < 1 ? value : 1
}

/**
 * Linear interpolation between 2 numbers, the ratio sets how much it is biased to each end
 * @method lerp
 * @param {Number} a number A
 * @param {Number} b number B
 * @param {Number} r ratio between 0 and 1
 * @return {Number}
 * @example {@link cocos2d/core/platform/CCMacro/lerp.js}
 */
misc.lerp = function (a: number, b: number, r: number) {
  return a + (b - a) * r
}

/**
 * converts degrees to radians
 * @param {Number} angle
 * @return {Number}
 * @method degreesToRadians
 */
misc.degreesToRadians = function (angle: number) {
  return angle * (Math.PI / 180)
}

/**
 * converts radians to degrees
 * @param {Number} angle
 * @return {Number}
 * @method radiansToDegrees
 */
misc.radiansToDegrees = function (angle: number) {
  return angle * (180 / Math.PI)
}

export default misc
