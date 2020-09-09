// /**
//  * cc.textureCache is a singleton object, it's the global cache for cc.Texture2D
//  * @class
//  * @name textureCache
//  */
// import Texture2D from '@/gengine/textures/Texture2D'
// import {_LogInfos, Logger} from '@/gengine/Debugger'
// import {loader} from '@/gengine/Loader'
//
// export const textureCache = {
//   _textures: {} as { [key: string]: Texture2D },
//   _textureColorsCache: {} as { [key: string]: string[] },
//   _textureKeySeq: (0 | Math.random() * 1000),
//
//   _loadedTexturesBefore: {} as { [key: string]: Texture2D },
//
//   //handleLoadedTexture move to Canvas/WebGL
//
//   _initializingRenderer: function () {
//     let selPath
//     //init texture from _loadedTexturesBefore
//     const locLoadedTexturesBefore = this._loadedTexturesBefore,
//       locTextures = this._textures
//     for (selPath of Object.keys(locLoadedTexturesBefore)) {
//       const tex2d = locLoadedTexturesBefore[selPath]
//       tex2d.handleLoadedTexture();
//       locTextures[selPath] = tex2d;
//     }
//     this._loadedTexturesBefore = {};
//   },
//
//   /**
//    * Description
//    * @return {String}
//    */
//   description: function () {
//     return "<TextureCache | Number of textures = " + this._textures.length + ">";
//   },
//
//   /**
//    * Returns an already created texture. Returns null if the texture doesn't exist.
//    * @param {String} textureKeyName
//    * @return {Texture2D|Null}
//    * @example
//    * //example
//    * var key = cc.textureCache.getTextureForKey("hello.png");
//    */
//   getTextureForKey: function(textureKeyName: string): Texture2D | null{
//     return this._textures[textureKeyName] || this._textures[loader._aliases[textureKeyName]];
//   },
//
//   /**
//    * @param {Image} texture
//    * @return {String|Null}
//    * @example
//    * //example
//    * var key = cc.textureCache.getKeyByTexture(texture);
//    */
//   getKeyByTexture: function (texture: Texture2D) {
//     for (const key of Object.keys(this._textures)) {
//       if (this._textures[key] === texture) {
//         return key;
//       }
//     }
//     return null;
//   },
//
//   _generalTextureKey: function () {
//     this._textureKeySeq++;
//     return "_textureKey_" + this._textureKeySeq;
//   },
//
//   /**
//    * @param {Image} texture
//    * @return {Array}
//    * @example
//    * //example
//    * var cacheTextureForColor = cc.textureCache.getTextureColors(texture);
//    */
//   // getTextureColors: function (texture: Texture2D | HTMLImageElement) {
//   //   let key = this.getKeyByTexture(texture as Texture2D)
//   //   if (!key) {
//   //     if (texture instanceof HTMLImageElement)
//   //       key = texture.src;
//   //     else
//   //       key = this._generalTextureKey();
//   //   }
//   //
//   //   if (!this._textureColorsCache[key])
//   //     this._textureColorsCache[key] = cc.Sprite.CanvasRenderCmd._generateTextureCacheForColor(texture);
//   //   return this._textureColorsCache[key];
//   // },
//
//   /**
//    * <p>Purges the dictionary of loaded textures. <br />
//    * Call this method if you receive the "Memory Warning"  <br />
//    * In the short term: it will free some resources preventing your app from being killed  <br />
//    * In the medium term: it will allocate more resources <br />
//    * In the long term: it will be the same</p>
//    * @example
//    * //example
//    * cc.textureCache.removeAllTextures();
//    */
//   removeAllTextures: function () {
//     const locTextures = this._textures
//     for (const selKey of Object.keys(locTextures)) {
//       if (locTextures[selKey])
//         locTextures[selKey].releaseTexture();
//     }
//     this._textures = {};
//   },
//
//   /**
//    * Deletes a texture from the cache given a texture
//    * @param {Image} texture
//    * @example
//    * //example
//    * cc.textureCache.removeTexture(texture);
//    */
//   removeTexture: function (texture: Texture2D) {
//     if (!texture)
//       return;
//
//     const locTextures = this._textures
//     for (const selKey of Object.keys(locTextures)) {
//       if (locTextures[selKey] === texture) {
//         locTextures[selKey].releaseTexture();
//         delete(locTextures[selKey]);
//       }
//     }
//   },
//
//   /**
//    * Deletes a texture from the cache given a its key name
//    * @param {String} textureKeyName
//    * @example
//    * //example
//    * cc.textureCache.removeTexture("hello.png");
//    */
//   removeTextureForKey: function (textureKeyName: string) {
//     if (textureKeyName == null)
//       return;
//     if (this._textures[textureKeyName])
//       delete(this._textures[textureKeyName]);
//   },
//
//   //addImage move to Canvas/WebGL
//
//   /**
//    *  Cache the image data
//    * @param {String} path
//    * @param {Image|HTMLImageElement|HTMLCanvasElement} texture
//    */
//   cacheImage: function (path: string, texture: Texture2D | HTMLImageElement | HTMLCanvasElement) {
//     if (texture instanceof Texture2D) {
//       this._textures[path] = texture;
//       return;
//     }
//     const texture2d = new Texture2D()
//     texture2d.initWithElement(texture);
//     texture2d.handleLoadedTexture();
//     this._textures[path] = texture2d;
//   },
//
//   /**
//    * <p>Returns a Texture2D object given an UIImage image<br />
//    * If the image was not previously loaded, it will create a new Texture2D object and it will return it.<br />
//    * Otherwise it will return a reference of a previously loaded image<br />
//    * The "key" parameter will be used as the "key" for the cache.<br />
//    * If "key" is null, then a new texture will be created each time.</p>
//    * @param {HTMLImageElement|HTMLCanvasElement} image
//    * @param {String} key
//    * @return {Texture2D}
//    */
//   addUIImage: function (image: HTMLImageElement | HTMLCanvasElement, key: string): Texture2D {
//     if (!image) {
//       console.log(_LogInfos.textureCache_addUIImage_2)
//     }
//
//     if (key) {
//       if (this._textures[key])
//         return this._textures[key];
//     }
//
//     // prevents overloading the autorelease pool
//     const texture = new Texture2D()
//     texture.initWithImage(image);
//     if (key != null) {
//       this._textures[key] = texture;
//     } else {
//       console.log(_LogInfos.textureCache_addUIImage);
//     }
//     return texture;
//   },
//
//   /**
//    * <p>Output to Logger.log the current contents of this TextureCache <br />
//    * This will attempt to calculate the size of each texture, and the total texture memory in use. </p>
//    */
//   dumpCachedTextureInfo: function () {
//     let count = 0
//     let totalBytes = 0, locTextures = this._textures
//
//     for (const key of Object.keys(locTextures)) {
//       const selTexture = locTextures[key]
//       count++
//       if (selTexture.getHtmlElementObj() instanceof  HTMLImageElement)
//         Logger.log(_LogInfos.textureCache_dumpCachedTextureInfo,
//           key,
//           (selTexture.getHtmlElementObj() as HTMLImageElement).src, selTexture.pixelsWidth, selTexture.pixelsHeight);
//       else {
//         Logger.log(_LogInfos.textureCache_dumpCachedTextureInfo_2, key, selTexture.pixelsWidth, selTexture.pixelsHeight);
//       }
//       totalBytes += selTexture.pixelsWidth * selTexture.pixelsHeight * 4;
//     }
//
//     const locTextureColorsCache = this._textureColorsCache
//     for (const key of Object.keys(locTextureColorsCache)) {
//       const selCanvasColorsArr = locTextureColorsCache[key]
//       for (const selCanvasKey in selCanvasColorsArr) {
//         const selCanvas = selCanvasColorsArr[selCanvasKey]
//         count++;
//         Logger.log(_LogInfos.textureCache_dumpCachedTextureInfo_2, key, selCanvas.width, selCanvas.height);
//         totalBytes += selCanvas.width * selCanvas.height * 4;
//       }
//
//     }
//     Logger.log(_LogInfos.textureCache_dumpCachedTextureInfo_3, count, totalBytes / 1024, (totalBytes / (1024.0 * 1024.0)).toFixed(2));
//   },
//
//   _clear: function () {
//     this._textures = {};
//     this._textureColorsCache = {};
//     this._textureKeySeq = (0 | Math.random() * 1000);
//     this._loadedTexturesBefore = {};
//   }
// };
//
// if (cc._renderType === cc._RENDER_TYPE_CANVAS) {
//
//   var _p = cc.textureCache;
//
//   _p.handleLoadedTexture = function (url) {
//     var locTexs = this._textures;
//     //remove judge
//     var tex = locTexs[url];
//     if (!tex) {
//       tex = locTexs[url] = new cc.Texture2D();
//       tex.url = url;
//     }
//     tex.handleLoadedTexture();
//   };
//
//   /**
//    * <p>Returns a Texture2D object given an file image <br />
//    * If the file image was not previously loaded, it will create a new Texture2D <br />
//    *  object and it will return it. It will use the filename as a key.<br />
//    * Otherwise it will return a reference of a previously loaded image. <br />
//    * Supported image extensions: .png, .jpg, .gif</p>
//    * @param {String} url
//    * @param {Function} cb
//    * @param {Object} target
//    * @return {cc.Texture2D}
//    * @example
//    * //example
//    * cc.textureCache.addImage("hello.png");
//    */
//   _p.addImage = function (url, cb, target) {
//
//     cc.assert(url, _LogInfos.Texture2D_addImage);
//
//     var locTexs = this._textures;
//     //remove judge
//     var tex = locTexs[url] || locTexs[cc.loader._aliases[url]];
//     if (tex) {
//       cb && cb.call(target, tex);
//       return tex;
//     }
//
//     tex = locTexs[url] = new cc.Texture2D();
//     tex.url = url;
//     var loadFunc = cc.loader._checkIsImageURL(url) ? cc.loader.load : cc.loader.loadImg;
//     loadFunc.call(cc.loader, url, function (err, img) {
//       if (err)
//         return cb && cb.call(target, err);
//       cc.textureCache.handleLoadedTexture(url);
//
//       var texResult = locTexs[url];
//       cb && cb.call(target, texResult);
//     });
//
//     return tex;
//   };
//
//   _p.addImageAsync = _p.addImage;
//   _p = null;
//
// } else {
//   cc.assert(cc.isFunction(cc._tmp.WebGLTextureCache), _LogInfos.MissingFile, "TexturesWebGL.js");
//   cc._tmp.WebGLTextureCache();
//   delete cc._tmp.WebGLTextureCache;
// }
