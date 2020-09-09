interface PoolItem {
  index: any
  value: any
}
export type IteratorFunc = (value: any, index: any, callback: (err: any | undefined) => void, target?: any) => void
export type FinishCallbackFunc = (err: any, results: any) => void
/**
 * Async Pool class, a helper of cc.async
 * @param {Object|Array} srcObj
 * @param {Number} limit the limit of parallel number
 * @param {function} iterator
 * @param {function} onEnd
 * @param {object} target
 * @constructor
 */
export default class AsyncPool {
  private _srcObj: any
  private _limit: number
  private _iterator: IteratorFunc
  private _onEnd: FinishCallbackFunc
  private _target: any
  private _pool = [] as PoolItem[]
  private _iteratorTarget: any
  private _onEndTarget: any
  private _results: any
  private _isErr = false

  private _workingSize: number

  public size: number
  public finishedSize: number

  constructor(srcObj: any, limit: number, iterator: IteratorFunc, onEnd: FinishCallbackFunc, target: any) {
    this._srcObj = srcObj;
    this._limit = limit;
    this._pool = [];
    this._iterator = iterator;
    this._iteratorTarget = target;
    this._onEnd = onEnd;
    this._onEndTarget = target;
    this._results = srcObj instanceof Array ? [] : {};

    if (this._srcObj) {
      if (this._srcObj instanceof Array) {
        this._srcObj.forEach(((value, index) => {
          this._pool.push({index, value})
        }))
      } else {
        for (let key of Object.keys(this._srcObj)) {
          this._pool.push({index: key, value: this._srcObj[key]})
        }
      }
    }

    this.size = this._pool.length
    this.finishedSize = 0
    this._workingSize = 0

    this._limit = this._limit || this.size
  }

  onIterator(iterator: IteratorFunc, target: any) {
    this._iterator = iterator;
    this._iteratorTarget = target;
  }

  onEnd(endCb: FinishCallbackFunc, endCbTarget: any){
    this._onEnd = endCb;
    this._onEndTarget = endCbTarget;
  };

  private _handleItem() {
    const self = this
    if (self._pool.length === 0 || self._workingSize >= self._limit) {
      return
    }

    const item = self._pool.shift()!
    const { index, value } = item

    self._workingSize++;
    self._iterator.call(self._iteratorTarget, value, index,
      function(err: any | undefined) {
        if (self._isErr)
          return;

        self.finishedSize++;
        self._workingSize--;
        if (err) {
          self._isErr = true;
          if (self._onEnd)
            self._onEnd.call(self._onEndTarget, err, null);
          return;
        }

        const arr = Array.prototype.slice.call(arguments, 1);
        // @ts-ignore
        self._results[this.index] = arr[0];
        if (self.finishedSize === self.size) {
          if (self._onEnd)
            self._onEnd.call(self._onEndTarget, null, self._results);
          return;
        }
        self._handleItem();
      }.bind(item), self);
  }

  flow() {
    if(this._pool.length === 0) {
      if(this._onEnd)
        this._onEnd.call(this._onEndTarget, null, []);
      return;
    }
    for(let i = 0; i < this._limit; i++)
      this._handleItem();
  }

}
