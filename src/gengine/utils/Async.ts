/**
 * @class
 */
import AsyncPool, {FinishCallbackFunc, IteratorFunc} from '@/gengine/AsyncPool'

interface IteratorObj {
  cb: FinishCallbackFunc
  iteratorTarget: any
  iterator: IteratorFunc
}

const async = {
  /**
   * Do tasks series.
   * @param {Array|Object} tasks
   * @param {function} [cb] callback
   * @param {Object} [target]
   * @return {AsyncPool}
   */
  series(tasks: any, cb: FinishCallbackFunc, target?: any): AsyncPool {
    const asyncPool = new AsyncPool(tasks, 1, function(func, index, cb1) {
      func.call(target, cb1);
    }, cb, target);
    asyncPool.flow();
    return asyncPool;
  },

  /**
   * Do tasks parallel.
   * @param {Array|Object} tasks
   * @param {function} cb callback
   * @param {Object} [target]
   * @return {AsyncPool}
   */
  parallel(tasks: any, cb: FinishCallbackFunc, target?: any): AsyncPool {
    const asyncPool = new AsyncPool(tasks, 0, function(func, index, cb1){
      func.call(target, cb1);
    }, cb, target);
    asyncPool.flow();
    return asyncPool;
  },

  /**
   * Do tasks waterfall.
   * @param {Array|Object} tasks
   * @param {function} cb callback
   * @param {Object} [target]
   * @return {AsyncPool}
   */
  waterfall(tasks: any, cb: FinishCallbackFunc, target?: any): AsyncPool {
    let args = [] as any[]
    //the array to store the last results
    let lastResults = [null]

    const asyncPool = new AsyncPool(tasks, 1,
      function (func, index, cb1) {
        args.push(function (err: any | undefined) {
          args = Array.prototype.slice.call(arguments, 1);

          //while the last task
          if(tasks.length - 1 === index) {
            lastResults = lastResults.concat(args);
          }

          // @ts-ignore
          cb1.apply(null, arguments);
        });
        func.apply(target, args);
      }, function (err) {
        if (!cb)
          return;
        if (err)
          return cb.call(target, err, null);
        // @ts-ignore
        cb.apply(target, lastResults);
      }, null);
    asyncPool.flow();
    return asyncPool;
  },

  /**
   * Do tasks by iterator.
   * @param {Array|Object} tasks
   * @param {function|Object} iterator
   * @param {function} [callback]
   * @param {Object} [target]
   * @return {AsyncPool}
   */
  map(tasks: any, iterator: IteratorObj | IteratorFunc, callback: FinishCallbackFunc, target?: any) {
    let locIterator
    if(typeof(iterator) === "object") {
      callback = iterator.cb;
      target = iterator.iteratorTarget;
      locIterator = iterator.iterator;
    } else {
      locIterator = iterator
    }

    const asyncPool = new AsyncPool(tasks, 0, locIterator, callback, target);
    asyncPool.flow();
    return asyncPool;
  },

  /**
   * Do tasks by iterator limit.
   * @param {Array|Object} tasks
   * @param {Number} limit
   * @param {function} iterator
   * @param {function} cb callback
   * @param {Object} [target]
   */
  mapLimit(tasks: any, limit: number, iterator: IteratorFunc, cb: FinishCallbackFunc, target?: any) {
    const asyncPool = new AsyncPool(tasks, limit, iterator, cb, target);
    asyncPool.flow();
    return asyncPool;
  }
};

export default async
