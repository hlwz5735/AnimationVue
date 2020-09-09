const path = {
  /**
   * Join strings to be a path.
   * @example
   cc.path.join("a", "b.png");//-->"a/b.png"
   cc.path.join("a", "b", "c.png");//-->"a/b/c.png"
   cc.path.join("a", "b");//-->"a/b"
   cc.path.join("a", "b", "/");//-->"a/b/"
   cc.path.join("a", "b/", "/");//-->"a/b/"
   * @returns {string}
   */
  join (...args: string[]): string {
    const l = args.length
    let result = ""
    for (let i = 0; i < l; i++) {
      result = (result + (result === "" ? "" : "/") + args[i]).replace(/(\/|\\\\)$/, "");
    }
    return result;
  },

  /**
   * Get the ext name of a path.
   * @example
   cc.path.extname("a/b.png");//-->".png"
   cc.path.extname("a/b.png?a=1&b=2");//-->".png"
   cc.path.extname("a/b");//-->null
   cc.path.extname("a/b?a=1&b=2");//-->null
   * @param {string} pathStr
   * @returns {*}
   */
  extname (pathStr: string): string | null {
    const temp = /(\.[^\.\/\?\\]*)(\?.*)?$/.exec(pathStr)
    return temp ? temp[1] : null
  },

  /**
   * Get the main name of a file name
   * @param {string} fileName
   * @returns {string}
   */
  mainFileName(fileName: string): string {
    if(fileName) {
      const idx = fileName.lastIndexOf(".")
      if(idx !== -1)
        return fileName.substring(0,idx)
    }
    return fileName
  },

  /**
   * Get the file name of a file path.
   * @example
   path.basename("a/b.png");//-->"b.png"
   path.basename("a/b.png?a=1&b=2");//-->"b.png"
   path.basename("a/b.png", ".png");//-->"b"
   path.basename("a/b.png?a=1&b=2", ".png");//-->"b"
   path.basename("a/b.png", ".txt");//-->"b.png"
   * @param {string} pathStr
   * @param {string} [extname]
   * @returns {*}
   */
  basename (pathStr: string, extname?: string): string | null {
    const index = pathStr.indexOf("?")
    if (index > 0) pathStr = pathStr.substring(0, index);
    const reg = /(\/|\\\\)([^(\/|\\\\)]+)$/g
    const result = reg.exec(pathStr.replace(/(\/|\\\\)$/, ""))
    if (!result) {
      return null
    }
    const baseName = result[2]
    if (extname && pathStr.substring(pathStr.length - extname.length).toLowerCase() === extname.toLowerCase()) {
      return baseName.substring(0, baseName.length - extname.length)
    }
    return baseName
  },

  /**
   * Get dirname of a file path.
   * @example
   * unix
   cc.path.driname("a/b/c.png");//-->"a/b"
   cc.path.driname("a/b/c.png?a=1&b=2");//-->"a/b"
   cc.path.dirname("a/b/");//-->"a/b"
   cc.path.dirname("c.png");//-->""
   * windows
   cc.path.driname("a\\b\\c.png");//-->"a\b"
   cc.path.driname("a\\b\\c.png?a=1&b=2");//-->"a\b"
   * @param {string} pathStr
   * @returns {*}
   */
  dirname (pathStr: string): string {
    return pathStr.replace(/((.*)(\/|\\|\\\\))?(.*?\..*$)?/, '$2');
  },

  /**
   * Change extname of a file path.
   * @example
   cc.path.changeExtname("a/b.png", ".plist");//-->"a/b.plist"
   cc.path.changeExtname("a/b.png?a=1&b=2", ".plist");//-->"a/b.plist?a=1&b=2"
   * @param {string} pathStr
   * @param {string} [extname]
   * @returns {string}
   */
  changeExtname (pathStr: string, extname: string): string {
    extname = extname || "";
    let index = pathStr.indexOf("?")
    let tempStr = ""
    if (index > 0) {
      tempStr = pathStr.substring(index);
      pathStr = pathStr.substring(0, index);
    }
    index = pathStr.lastIndexOf(".");
    if (index < 0) return pathStr + extname + tempStr;
    return pathStr.substring(0, index) + extname + tempStr;
  },
  /**
   * Change file name of a file path.
   * @example
   cc.path.changeBasename("a/b/c.plist", "b.plist");//-->"a/b/b.plist"
   cc.path.changeBasename("a/b/c.plist?a=1&b=2", "b.plist");//-->"a/b/b.plist?a=1&b=2"
   cc.path.changeBasename("a/b/c.plist", ".png");//-->"a/b/c.png"
   cc.path.changeBasename("a/b/c.plist", "b");//-->"a/b/b"
   cc.path.changeBasename("a/b/c.plist", "b", true);//-->"a/b/b.plist"
   * @param {String} pathStr
   * @param {String} basename
   * @param {Boolean} [isSameExt]
   * @returns {string}
   */
  changeBasename (pathStr: string, basename: string, isSameExt: boolean): string {
    if (basename.indexOf(".") === 0) return this.changeExtname(pathStr, basename);
    let index = pathStr.indexOf("?")
    let tempStr = ""
    const ext = isSameExt ? this.extname(pathStr) : ""
    if (index > 0) {
      tempStr = pathStr.substring(index);
      pathStr = pathStr.substring(0, index);
    }
    index = pathStr.lastIndexOf("/");
    index = index <= 0 ? 0 : index + 1;
    return pathStr.substring(0, index) + basename + ext + tempStr;
  }
};

export default path
