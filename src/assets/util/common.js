export default {
  reqType: {
    sendGetGlobalStatREQ: "sendGetGlobalStatREQ",
    sendTellActiveREQ: "sendTellActiveREQ",
    sendGetPeersREQ: "sendGetPeersREQ",
    sendTellWaitREQ: "sendTellWaitREQ",
    sendTellFinishREQ: "sendTellFinishREQ",
    sendGetGlobalOptionREQ: "sendGetGlobalOptionREQ",
    sendAddUriREQ: "sendAddUriREQ",
    sendAddBtREQ:"sendAddBtREQ",
    sendAddMetalinkREQ:'sendAddMetalinkREQ',
    sendPauseREQ:"sendPauseREQ",
    sendUnpauseREQ:"sendUnpauseREQ",
    sendRemoveREQ:"sendRemoveREQ",
    sendForceRemoveREQ:"sendForceRemoveREQ",
    sendRemoveDownloadResultREQ:"sendRemoveDownloadResultREQ",
    sendRestartREQ:"sendRestartREQ",
    sendChangeOptionResultREQ:"sendChangeOptionResultREQ",
    sendChangeGlobalOptionREQ:"sendChangeGlobalOptionREQ",
    sendShutdownREQ:"sendShutdownREQ"
  },
  getReqId(type) {
    return type + "_" + new Date().getTime();
  },
  readyState: {
    //正在建立连接连接，还没有完成。The connection has not yet been established.
    CONNECTING: 0,
    //连接成功建立，可以进行通信。The WebSocket connection is established and communication is possible.
    OPEN: 1,
    //连接正在进行关闭握手，即将关闭。The connection is going through the closing handshake.
    CLOSING: 2,
    //连接已经关闭或者根本没有建立。The connection has been closed or could not be opened.
    CLOSED: 3,
  },
  Aria2ErrorCode: {
    // If all downloads were successful.
    0: '下载已完成',
    // If an unknown error occurred.
    1: '未知异常',
    // If time out occurred.
    2: '超时异常',
    // If a resource was not found.
    3: '资源无法找到',
    // If aria2 saw the specified number of “resource not found” error. See --max-file-not-found option.
    4: '资源无法找到，特殊情况，参考：--max-file-not-found参数',
    // If a download aborted because download speed was too slow. See --lowest-speed-limit option.
    5: '因速度过慢，下载中断，参考：--lowest-speed-limit参数',
    // If network problem occurred.
    6: '网络异常',
    // If there were unfinished downloads. This error is only reported if all finished downloads were successful and there were unfinished downloads in a queue when aria2 exited by pressing Ctrl-C by an user or sending TERM or INT signal.
    7: '存在未完成标识，但文件已全部下载完成',
    // If remote server did not support resume when resume was required to complete download.
    8: '远端服务器不支持继续下载',
    // If there was not enough disk space available.
    9: '下载路径磁盘空间不足',
    // If piece length was different from one in .aria2 control file. See --allow-piece-length-change option.
    10: '下载文件碎片和标识长度不一致,参考：--allow-piece-length-change参数',
    // If aria2 was downloading same file at that moment.
    11: '文件已被占有',
    // If aria2 was downloading same info hash torrent at that moment.
    12: '种子已被占有',
    // If file already existed. See --allow-overwrite option.
    13: '文件已存在，参考：--allow-overwrite参数',
    // If renaming file failed. See --auto-file-renaming option.
    14: '重命名文件失败，参考：--auto-file-renaming参数',
    // If aria2 could not open existing file.
    15: '无法打开文件',
    // If aria2 could not create new file or truncate existing file.
    16: '无法创建新文件或清空已存在文件',
    // If file I/O error occurred.
    17: '文件I/O异常',
    // If aria2 could not create directory.
    18: '无法创建文件夹',
    // If name resolution failed.
    19: '名称决议失败',
    // If aria2 could not parse Metalink document.
    20: '无法解析Metalink',
    // If FTP command failed.
    21: 'FTP命令失败',
    // If HTTP response header was bad or unexpected.
    22: 'HTTP返回头不合法',
    // If too many redirects occurred.
    23: '大量重定向',
    // If HTTP authorization failed.
    24: 'HTTP认证失败',
    // If aria2 could not parse bencoded file (usually “.torrent” file).
    25: '无法解析已编码文件',
    // If “.torrent” file was corrupted or missing information that aria2 needed.
    26: '种子文件缺少相关信息',
    // If Magnet URI was bad.
    27: 'Magnet地址异常',
    // If bad/unrecognized option was given or unexpected option argument was given.
    28: '不合法参数',
    // If the remote server was unable to handle the request due to a temporary overloading or maintenance.
    29: '远程服务无法处理请求',
    // If aria2 could not parse JSON-RPC request.
    30: 'aria2无法解析JSON-RPC亲求',
    // Reserved. Not used.
    31: '已预约，未使用',
    // If checksum validation failed.
    32: '校验失败'
  },
  getSize(size, replace) {
    if (isNaN(Number(size))) {
      return replace || ' -- ';
    }
    if (size > 1024 * 1024 * 1024) {
      return Math.round(size * 100 / 1024 / 1024 / 1024) / 100 + "G";
    } else if (size > 1024 * 1024) {
      return Math.round(size * 100 / 1024 / 1024) / 100 + "M";
    } else if (size > 1024) {
      return Math.round(size * 100 / 1024) / 100 + "K";
    } else {
      return size + "B";
    }
  },
  parseHexStringToBitArray(str) {
    let arr = str.split("");
    var arr1 = [];
    arr.forEach(it => {
      if (it === "0") {
        arr1 = arr1.concat(0, 0, 0, 0);
      } else if (it === "8") {
        arr1 = arr1.concat(1, 0, 0, 0)
      } else if (it === "c") {
        arr1 = arr1.concat(1, 1, 0, 0)
      } else if (it === "e") {
        arr1 = arr1.concat(1, 1, 1, 0)
      } else if (it === "f") {
        arr1 = arr1.concat(1, 1, 1, 1)
      }
    });
    return arr1;
  }
}