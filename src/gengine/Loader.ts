/**
 * Loader for resource loading process. It's a singleton object.
 * @class
 */
import path from '@/gengine/utils/Path'
import Env from '@/config/Env'

interface LoadOption {
  trigger?: (value: any, total: number, finished: number) => void
  triggerTarget?: any
}

export const loader = {
  // cache for js
  _jsCache: {} as { [key: string]: any },
  // register of loaders
  _register: {} as { [key: string]: Loader<any> },
  // cache for lang path
  _langPathCache: {} as { [key: string]: string },
  // aliases for res url
  _aliases: {} as { [key: string]: string },

  // root path of resource
  resPath: '',
  // root path of audio
  audioPath: '',
  // cache for data loaded
  cache: {} as { [key: string]: any },

  /**
   * Get XMLHttpRequest.
   * @returns {XMLHttpRequest}
   */
  getXMLHttpRequest: function (): XMLHttpRequest {
    return new XMLHttpRequest()
  },

  // <editor-fold desc="JS加载相关">
  // _getArgs4Js: function (args: any[] | IArguments): any[] {
  //   const a0 = args[0]
  //   const a1 = args[1]
  //   const a2 = args[2]
  //   const results = ["", null, null] as any[];
  //
  //   if (args.length === 1) {
  //     results[1] = a0 instanceof Array ? a0 : [a0];
  //   } else if (args.length === 2) {
  //     if (typeof a1 === "function") {
  //       results[1] = a0 instanceof Array ? a0 : [a0];
  //       results[2] = a1;
  //     } else {
  //       results[0] = a0 || "";
  //       results[1] = a1 instanceof Array ? a1 : [a1];
  //     }
  //   } else if (args.length === 3) {
  //     results[0] = a0 || "";
  //     results[1] = a1 instanceof Array ? a1 : [a1];
  //     results[2] = a2;
  //   } else throw "arguments error to load js!";
  //   return results;
  // },
  //
  // /**
  //  * Load js files.
  //  * If the third parameter doesn't exist, then the baseDir turns to be "".
  //  *
  //  * @param {string} [baseDir]   The pre path for jsList or the list of js path.
  //  * @param {array} jsList    List of js path.
  //  * @returns {*}
  //  */
  // loadJs: function (baseDir: string, jsList: string[], cb: FinishCallbackFunc): void {
  //   const localJsCache = this._jsCache
  //   const args = this._getArgs4Js(arguments);
  //
  //   const preDir = args[0]
  //   const list = args[1]
  //   const callback = args[2]
  //
  //   async.map(list, ((item, index, cb1) => {
  //     const jsPath = path.join(preDir, item)
  //     if (localJsCache[jsPath]) {
  //       return cb1(null);
  //     }
  //     this._createScript(jsPath, false, cb1);
  //   }), callback)
  // },
  // /**
  //  * Load js width loading image.
  //  *
  //  * @param {string} [baseDir]
  //  * @param {array} jsList
  //  * @param {function} [cb]
  //  */
  // loadJsWithImg: function (baseDir: string, jsList: string[], cb: FinishCallbackFunc): void {
  //   const self = this
  //   const jsLoadingImg = self._loadJsImg()
  //   const args = self._getArgs4Js(arguments)
  //
  //   this.loadJs(args[0], args[1], function (err) {
  //     if (err) throw err;
  //     //remove loading gif
  //     jsLoadingImg.parentNode.removeChild(jsLoadingImg);
  //     if (args[2]) args[2]();
  //   });
  // },
  // _createScript: function (jsPath, isAsync, cb) {
  //   var d = document, self = this, s = cc.newElement('script');
  //   s.async = isAsync;
  //   self._jsCache[jsPath] = true;
  //   if(cc.game.config["noCache"] && typeof jsPath === "string"){
  //     if(self._noCacheRex.test(jsPath))
  //       s.src = jsPath + "&_t=" + (new Date() - 0);
  //     else
  //       s.src = jsPath + "?_t=" + (new Date() - 0);
  //   }else{
  //     s.src = jsPath;
  //   }
  //   cc._addEventListener(s, 'load', function () {
  //     s.parentNode.removeChild(s);
  //     this.removeEventListener('load', arguments.callee, false);
  //     cb();
  //   }, false);
  //   cc._addEventListener(s, 'error', function () {
  //     s.parentNode.removeChild(s);
  //     cb("Load " + jsPath + " failed!");
  //   }, false);
  //   d.body.appendChild(s);
  // },
  // _loadJs4Dependency: function (baseDir, jsList, index, cb) {
  //   if (index >= jsList.length) {
  //     if (cb) cb();
  //     return;
  //   }
  //   var self = this;
  //   self._createScript(cc.path.join(baseDir, jsList[index]), false, function (err) {
  //     if (err) return cb(err);
  //     self._loadJs4Dependency(baseDir, jsList, index + 1, cb);
  //   });
  // },
  // _loadJsImg: function () {
  //   var d = document, jsLoadingImg = d.getElementById("cocos2d_loadJsImg");
  //   if (!jsLoadingImg) {
  //     jsLoadingImg = cc.newElement('img');
  //
  //     if (cc._loadingImage)
  //       jsLoadingImg.src = cc._loadingImage;
  //
  //     var canvasNode = d.getElementById(cc.game.config["id"]);
  //     canvasNode.style.backgroundColor = "black";
  //     canvasNode.parentNode.appendChild(jsLoadingImg);
  //
  //     var canvasStyle = getComputedStyle ? getComputedStyle(canvasNode) : canvasNode.currentStyle;
  //     if (!canvasStyle)
  //       canvasStyle = {width: canvasNode.width, height: canvasNode.height};
  //     jsLoadingImg.style.left = canvasNode.offsetLeft + (parseFloat(canvasStyle.width) - jsLoadingImg.width) / 2 + "px";
  //     jsLoadingImg.style.top = canvasNode.offsetTop + (parseFloat(canvasStyle.height) - jsLoadingImg.height) / 2 + "px";
  //     jsLoadingImg.style.position = "absolute";
  //   }
  //   return jsLoadingImg;
  // },
  // </editor-fold>

  /**
   * Load a single resource as txt.
   * @param {string} url
   */
  loadTxt(url: string): Promise<string> {
    if (!Env.isNodeJs) {
      return new Promise<string>((resolve, reject) => {
        const xhr = this.getXMLHttpRequest()
        const errInfo = 'load ' + url + ' failed!'
        xhr.open('GET', url, true)
        // eslint-disable-next-line no-useless-escape
        if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8')
        xhr.onload = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              return resolve(xhr.responseText)
            } else {
              return reject(errInfo)
            }
          }
        }
        xhr.send(null)
      })
    } else {
      const fs = require('fs')
      return new Promise<string>((resolve, reject) => {
        fs.readFile(url, function (err: any | null, data: any) {
          if (err) {
            return reject(err)
          } else {
            return resolve(data.toString())
          }
        })
      })
    }
  },
  _loadTxtSync: function (url: string): string | null {
    if (!Env.isNodeJs) {
      const xhr = this.getXMLHttpRequest()
      xhr.open('GET', url, false)
      // eslint-disable-next-line no-useless-escape
      if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8')
      xhr.send(null)
      if (xhr.readyState !== 4 || xhr.status !== 200) {
        return null
      }
      return xhr.responseText
    } else {
      const fs = require('fs')
      return fs.readFileSync(url).toString()
    }
  },

  // loadCsb: function(url, cb){
  //   var xhr = new XMLHttpRequest();
  //   xhr.open("GET", url, true);
  //   xhr.responseType = "arraybuffer";
  //
  //   xhr.onload = function () {
  //     var arrayBuffer = xhr.response; // Note: not oReq.responseText
  //     if (arrayBuffer) {
  //       window.msg = arrayBuffer;
  //     }
  //     if(xhr.readyState === 4)
  //       xhr.status === 200 ? cb(null, xhr.response) : cb("load " + url + " failed!");
  //   };
  //
  //   xhr.send(null);
  // },

  /**
   * Load a single resource as json.
   * @param {string} url
   */
  async loadJson(url: string): Promise<any> {
    const txt = await this.loadTxt(url)
    try {
      return JSON.parse(txt)
    } catch (e) {
      // eslint-disable-next-line no-throw-literal
      throw 'parse json [' + url + '] failed : ' + e
    }
  },

  _checkIsImageURL(url: string): boolean {
    const ext = /(\.png)|(\.jpg)|(\.bmp)|(\.jpeg)|(\.gif)/.exec(url)
    return (ext != null)
  },
  /**
   * Load a single image.
   * @param {!string} url
   * @param {object} [option]
   * @returns {Image}
   */
  loadImg(url: string, option: any = {}): Promise<HTMLImageElement> {
    const self = this

    return new Promise<HTMLImageElement>((resolve, reject) => {
      const loadCallback = function () {
        // @ts-ignore
        const img = (this as HTMLImageElement)
        img.removeEventListener('load', loadCallback, false)
        img.removeEventListener('error', errorCallback, false)

        loader.cache[url] = img
        return resolve(img)
      }

      const errorCallback = function () {
        // @ts-ignore
        const img = (this as HTMLImageElement)
        img.removeEventListener('error', errorCallback, false)

        if (img.crossOrigin && img.crossOrigin.toLowerCase() === 'anonymous') {
          opt.isCrossOrigin = false
          self.release(url)
          return loader.loadImg(url, opt)
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject('load image failed')
        }
      }

      const opt = {
        isCrossOrigin: option.isCrossOrigin || true
      }
      let img = this.getRes(url)
      if (img) {
        return resolve(img)
      }
      img = new Image()
      if (opt.isCrossOrigin && location.origin !== 'file://') {
        img.crossOrigin = 'Anonymous'
      }
      img.src = url
      img.addEventListener('load', loadCallback)
      img.addEventListener('error', errorCallback)
    })
  },
  loadImgFromFile(file: File): Promise<HTMLImageElement> {
    const url = file.name
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const loadCallback = function () {
        // @ts-ignore
        const img = (this as HTMLImageElement)
        img.removeEventListener('load', loadCallback, false)
        img.removeEventListener('error', errorCallback, false)

        loader.cache[url] = img
        return resolve(img)
      }

      const errorCallback = function () {
        // @ts-ignore
        const img = (this as HTMLImageElement)
        img.removeEventListener('error', errorCallback, false)
        // eslint-disable-next-line prefer-promise-reject-errors
        return reject('load image failed')
      }

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        const image = new Image()
        image.src = reader.result as string

        image.addEventListener('load', loadCallback)
        image.addEventListener('error', errorCallback)
      }
    })
  },

  /**
   * Iterator function to load res
   * @param {object} item
   * @param {number} index
   * @returns {*}
   * @private
   */
  async _loadResIterator(item: any, index: number): Promise<any> {
    const self = this
    let url: string
    let type = item.type
    if (type) {
      type = '.' + type.toLowerCase()
      url = item.src ? item.src : item.name + type
    } else {
      url = item
      type = path.extname(url)
    }

    const obj = self.getRes(url)
    if (obj) {
      return Promise.resolve(obj)
    }
    let loader: Loader<any> | null = null
    if (type) {
      loader = self._register[type.toLowerCase()]
    }
    if (!loader) {
      const errorMsg = 'loader for [' + type + '] not exists!'
      console.error(errorMsg)
      return Promise.reject(errorMsg)
    }
    const basePath = loader.getBasePath ? loader.getBasePath() : self.resPath
    let realUrl = self.getUrl(basePath, url)
    // if(cc.game.config["noCache"] && typeof realUrl === "string") {
    //   if(self._noCacheRex.test(realUrl))
    //     realUrl += "&_t=" + (new Date().getTime());
    //   else
    //     realUrl += "?_t=" + (new Date().getTime());
    // }

    try {
      const data = await loader.load(realUrl, url, item)
      this.cache[url] = data
      return Promise.resolve(data)
    } catch (err) {
      console.log(err)
      self.cache[url] = null
      delete self.cache[url]
      return Promise.reject(err)
    }
  },
  _noCacheRex: /\?/,

  /**
   * Get url with basePath.
   * @param {string} basePath
   * @param {string} [url]
   * @returns {*}
   */
  getUrl: function (basePath: string, url: string) {
    const self = this
    const langPathCache = self._langPathCache
    if (basePath !== undefined && url === undefined) {
      url = basePath
      let type = path.extname(url)
      type = type ? type.toLowerCase() : ''
      const loader = self._register[type]
      if (!loader) {
        basePath = self.resPath
      } else {
        basePath = loader.getBasePath ? loader.getBasePath() : self.resPath
      }
    }
    url = path.join(basePath || '', url)
    // eslint-disable-next-line no-useless-escape
    if (url.match(/[\/(\\\\)]lang[\/(\\\\)]/i)) {
      if (langPathCache[url]) {
        return langPathCache[url]
      }
      const extname = path.extname(url) || ''
      // url = langPathCache[url] = url.substring(0, url.length - extname.length) + "_" + 'zh' + extname;
      url = langPathCache[url] = url.substring(0, url.length - extname.length) + '_' + 'zh' + extname
    }
    return url
  },

  /**
   * Load resources then call the callback.
   * @param {string} resources
   * @param {function} [option] callback or trigger
   */
  load: function (resources: string | string[], option: LoadOption = {}): Promise<any[]> {
    // const self = this
    // const len = arguments.length
    // if(len === 0)
    //   throw "arguments error!";
    //
    // if(len === 3){
    //   if(typeof option === "function"){
    //     if(typeof loadCallback === "function")
    //       option = {trigger : option, cb : loadCallback };
    //     else
    //       option = { cb : option, cbTarget : loadCallback};
    //   }
    // }else if(len === 2){
    //   if(typeof option === "function")
    //     option = {cb : option};
    // }else if(len === 1){
    //   option = {};
    // }

    return new Promise<any[]>((resolve, reject) => {
      if (!(resources instanceof Array)) {
        resources = [resources]
      }
      let finishedSize = 0
      const resultList = [] as any[]
      resources.forEach((resource, index) => {
        this._loadResIterator(resource, index)
          .then(value => {
            finishedSize++
            resultList.push(value)
            if (option.trigger && option.triggerTarget) {
              option.trigger.call(option.triggerTarget, value, resources.length, finishedSize)
              if (finishedSize === resources.length) {
                return resolve(resultList)
              }
            }
          })
          .catch(err => {
            return reject(err)
          })
      })
    })

    // var asyncPool = new cc.AsyncPool(
    //   resources, 0,
    //   function (value, index, AsyncPoolCallback, aPool) {
    //     self._loadResIterator(value, index, function (err) {
    //       if (err)
    //         return AsyncPoolCallback(err);
    //       var arr = Array.prototype.slice.call(arguments, 1);
    //       if (option.trigger)
    //         option.trigger.call(option.triggerTarget, arr[0], aPool.size, aPool.finishedSize);   //call trigger
    //       AsyncPoolCallback(null, arr[0]);
    //     });
    //   },
    //   option.cb, option.cbTarget);
    // asyncPool.flow();
    // return asyncPool;
  },

  _handleAliases: function (fileNames: { [key: string]: string }): Promise<any> {
    const self = this
    const aliases = self._aliases
    const resList = [] as string[]
    for (const key of Object.keys(fileNames)) {
      const value = fileNames[key]
      aliases[key] = value
      resList.push(value)
    }
    return this.load(resList)
  },

  /**
   * <p>
   *     Loads alias map from the contents of a filename.                                        <br/>
   *                                                                                                                 <br/>
   *     @note The plist file name should follow the format below:                                                   <br/>
   *     <?xml version="1.0" encoding="UTF-8"?>                                                                      <br/>
   *         <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">  <br/>
   *             <plist version="1.0">                                                                               <br/>
   *                 <dict>                                                                                          <br/>
   *                     <key>filenames</key>                                                                        <br/>
   *                     <dict>                                                                                      <br/>
   *                         <key>sounds/click.wav</key>                                                             <br/>
   *                         <string>sounds/click.caf</string>                                                       <br/>
   *                         <key>sounds/endgame.wav</key>                                                           <br/>
   *                         <string>sounds/endgame.caf</string>                                                     <br/>
   *                         <key>sounds/gem-0.wav</key>                                                             <br/>
   *                         <string>sounds/gem-0.caf</string>                                                       <br/>
   *                     </dict>                                                                                     <br/>
   *                     <key>metadata</key>                                                                         <br/>
   *                     <dict>                                                                                      <br/>
   *                         <key>version</key>                                                                      <br/>
   *                         <integer>1</integer>                                                                    <br/>
   *                     </dict>                                                                                     <br/>
   *                 </dict>                                                                                         <br/>
   *              </plist>                                                                                           <br/>
   * </p>
   * @param {String} url  The plist file name.
   */
  async loadAliases(url: string): Promise<any> {
    const self = this
    let dict = self.getRes(url)
    if (!dict) {
      const resultList = await this.load(url)
      dict = resultList[0]
    }
    return this._handleAliases(dict['filenames'])
  },

  /**
   * Register a resource loader into loader.
   * @param {string} extNames
   * @param {function} loader
   */
  register: function (extNames: string[], loader: Loader<any>) {
    extNames.forEach(extName => {
      this._register['.' + extName.trim().toLowerCase()] = loader
    })
  },

  /**
   * Get resource data by url.
   * @param url
   * @returns {*}
   */
  getRes: function (url: string): any {
    return this.cache[url] || this.cache[this._aliases[url]]
  },

  /**
   * Release the cache of resource by url.
   * @param url
   */
  release: function (url: string) {
    const cache = this.cache
    const aliases = this._aliases
    delete cache[url]
    delete cache[aliases[url]]
    delete aliases[url]
  },

  /**
   * Resource cache of all resources.
   */
  releaseAll: function () {
    let key
    const locCache = this.cache
    const aliases = this._aliases
    for (key of Object.keys(locCache)) {
      delete locCache[key]
    }
    for (key of Object.keys(aliases)) {
      delete aliases[key]
    }
  }
}

interface Loader<T> {
  load(realUrl: string, url?: string, res?: string): Promise<T>

  getBasePath?: () => string
}

const _txtLoader: Loader<string> = {
  async load(realUrl) {
    return loader.loadTxt(realUrl)
  }
}
loader.register(['txt', 'xml', 'vsh', 'fsh', 'atlas'], _txtLoader)

const _jsonLoader: Loader<any> = {
  async load(realUrl: string) {
    return loader.loadJson(realUrl)
  }
}
loader.register(['json', 'ExportJson'], _jsonLoader)

// const _jsLoader = {
//   load : function(realUrl: string) {
//     return loader.loadJs(realUrl);
//   }
// };
// loader.register(["js"], _jsLoader);

const _imgLoader: Loader<HTMLImageElement> = {
  async load(realUrl: string, url: string) {
    try {
      const img = await loader.loadImg(realUrl)
      loader.cache[url] = img
      // textureCache.handleLoadedTexture(url)
      return Promise.resolve(img)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
loader.register(['png', 'jpg', 'bmp', 'jpeg', 'gif', 'ico'], _imgLoader)

// const _serverImgLoader = {
//   load : function(realUrl, url, res, cb){
//     loader.cache[url] =  loader.loadImg(res.src, function(err, img){
//       if(err)
//         return cb(err);
//       textureCache.handleLoadedTexture(url);
//       cb(null, img);
//     });
//   }
// };
// loader.register(["serverImg"], _serverImgLoader);

// const _plistLoader: Loader<any> = {
//   async load(realUrl: string){
//     loader.loadTxt(realUrl, function(err, txt){
//       if(err)
//         return cb(err);
//       cb(null, plistParser.parse(txt));
//     });
//   }
// };
// loader.register(["plist"], _plistLoader);
/*

cc._fontLoader = {
  TYPE : {
    ".eot" : "embedded-opentype",
    ".ttf" : "truetype",
    ".woff" : "woff",
    ".svg" : "svg"
  },
  _loadFont : function(name, srcs, type){
    var doc = document, path = cc.path, TYPE = this.TYPE, fontStyle = cc.newElement("style");
    fontStyle.type = "text/css";
    doc.body.appendChild(fontStyle);

    var fontStr = "@font-face { font-family:" + name + "; src:";
    if(srcs instanceof Array){
      for(var i = 0, li = srcs.length; i < li; i++){
        var src = srcs[i];
        type = path.extname(src).toLowerCase();
        fontStr += "url('" + srcs[i] + "') format('" + TYPE[type] + "')";
        fontStr += (i === li - 1) ? ";" : ",";
      }
    }else{
      fontStr += "url('" + srcs + "') format('" + TYPE[type] + "');";
    }
    fontStyle.textContent += fontStr + "};";

    //<div style="font-family: PressStart;">.</div>
    var preloadDiv = cc.newElement("div");
    var _divStyle =  preloadDiv.style;
    _divStyle.fontFamily = name;
    preloadDiv.innerHTML = ".";
    _divStyle.position = "absolute";
    _divStyle.left = "-100px";
    _divStyle.top = "-100px";
    doc.body.appendChild(preloadDiv);
  },
  load : function(realUrl, url, res, cb){
    var self = this;
    var type = res.type, name = res.name, srcs = res.srcs;
    if(cc.isString(res)){
      type = cc.path.extname(res);
      name = cc.path.basename(res, type);
      self._loadFont(name, res, type);
    }else{
      self._loadFont(name, srcs);
    }
    cb(null, true);
  }
};
cc.loader.register(["font", "eot", "ttf", "woff", "svg"], cc._fontLoader);
*/

// const _binaryLoader = {
//   load : function(realUrl, url, res, cb){
//     loader.loadBinary(realUrl, cb);
//   }
// };
//
// const _csbLoader = {
//   load: function(realUrl, url, res, cb){
//     loader.loadCsb(realUrl, cb);
//   }
// };
// loader.register(["csb"], _csbLoader);
