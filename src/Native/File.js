/*

Json  =>  _elm_lang$core$Native_Json.
import Elm.Kernel.Json exposing (decodePrim, expecting)
List  =>  _elm_lang$core$Native_List.
import Elm.Kernel.List exposing (fromArray)
Scheduler  =>  _elm_lang$core$Native_Scheduler.
import Elm.Kernel.Scheduler exposing (binding, succeed)
Utils  =>  _elm_lang$core$Native_Utils.
import Elm.Kernel.Utils exposing (Tuple0, Tuple2)
Result  =>  _elm_lang$core$Result$
import Result exposing (Ok)
String  =>  _elm_lang$core$String$
import String exposing (join)
Time  =>  _elm_lang$core$Time$
import Time exposing (millisToPosix)

*/

// DECODER

var _proda_ai$elm_file$Native_File = function() {

    var decoder = _elm_lang$core$Native_Json.decodePrimitive('value');

   // METADATA
   
   function name(file) { return file.name; }
   function mime(file) { return file.type; }
   function size(file) { return file.size; }
   
   function lastModified(file)
   {
       return _proda_ai$elm_time$Compat_Time$millisToPosix(file.lastModified);
   }
   
   
   // DOWNLOAD
   
   var downloadNode;
   
   function getDownloadNode()
   {
       return downloadNode || (downloadNode = document.createElement('a'));
   }
   
   var download = F3(function(name, mime, content)
   {
       return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
       {
           var blob = new Blob([content], {type: mime});
   
           // for IE10+
           if (navigator.msSaveOrOpenBlob)
           {
               navigator.msSaveOrOpenBlob(blob, name);
               return;
           }
   
           // for HTML5
           var node = getDownloadNode();
           var objectUrl = URL.createObjectURL(blob);
           node.href = objectUrl;
           node.download = name;
           click(node);
           URL.revokeObjectURL(objectUrl);
       });
   });
   
   function downloadUrl(href)
   {
       return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
       {
           var node = getDownloadNode();
           node.href = href;
           node.download = '';
           node.origin === location.origin || (node.target = '_blank');
           click(node);
       });
   }
   
   
   // IE COMPATIBILITY
   
   function makeBytesSafeForInternetExplorer(bytes)
   {
       // only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
       // all other browsers can just run `new Blob([bytes])` directly with no problem
       //
       return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
   }
   
   function click(node)
   {
       // only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
       // all other browsers have MouseEvent and do not need this conditional stuff
       //
       if (typeof MouseEvent === 'function')
       {
           node.dispatchEvent(new MouseEvent('click'));
       }
       else
       {
           var event = document.createEvent('MouseEvents');
           event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
           document.body.appendChild(node);
           node.dispatchEvent(event);
           document.body.removeChild(node);
       }
   }
   
   
   // UPLOAD
   
   var node;
   
   function uploadOne(mimes)
   {
       return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
       {
           node = document.createElement('input');
           node.type = 'file';
           node.accept = A2(_elm_lang$core$String$join, ',', mimes);
           node.addEventListener('change', function(event)
           {
               callback(_elm_lang$core$Native_Scheduler.succeed(event.target.files[0]));
           });
           click(node);
       });
   }
   
   function uploadOneOrMore(mimes)
   {
       return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
       {
           node = document.createElement('input');
           node.type = 'file';
           node.multiple = true;
           node.accept = A2(_elm_lang$core$String$join, ',', mimes);
           node.addEventListener('change', function(event)
           {
               var elmFiles = _elm_lang$core$Native_List.fromArray(event.target.files);
               callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple2(elmFiles.a, elmFiles.b)));
           });
           click(node);
       });
   }
   
   
   // CONTENT
   
   function toString(blob)
   {
       return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
       {
           var reader = new FileReader();
           reader.addEventListener('loadend', function() {
               callback(_elm_lang$core$Native_Scheduler.succeed(reader.result));
           });
           reader.readAsText(blob);
           return function() { reader.abort(); };
       });
   }
   
   function toBytes(blob)
   {
       return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
       {
           var reader = new FileReader();
           reader.addEventListener('loadend', function() {
               callback(_elm_lang$core$Native_Scheduler.succeed(new DataView(reader.result)));
           });
           reader.readAsArrayBuffer(blob);
           return function() { reader.abort(); };
       });
   }
   
   function toUrl(blob)
   {
       return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
       {
           var reader = new FileReader();
           reader.addEventListener('loadend', function() {
               callback(_elm_lang$core$Native_Scheduler.succeed(reader.result));
           });
           reader.readAsDataURL(blob);
           return function() { reader.abort(); };
       });
   }
   

    return {
        toUrl: toUrl,
        getDownloadNode: getDownloadNode,
        download: download,
        toBytes: toBytes,
        uploadOne: uploadOne,
        mime: mime,
        toString: toString,
        name: name,
        uploadOneOrMore: uploadOneOrMore,
        lastModified: lastModified,
        decoder: decoder,
        click: click,
        size: size,
        makeBytesSafeForInternetExplorer: makeBytesSafeForInternetExplorer,
        downloadUrl: downloadUrl
   }
}();
