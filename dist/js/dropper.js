/**
    * v0.0.0
    * (c) 2018 Baianat
    * @license MIT
    */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Dropper = factory());
}(this, (function () { 'use strict';

  function icons(name) {
    return '\n    <svg class="dropper-file__icon" viewBox="0 0 24 24">\n      <path d="' + iconsPath[name] + '"/>\n    </svg>';
  }
  var iconsPath = {
    folder: 'M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z',
    file: 'M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z'
  };

  /**
   * Utilities
   */
  function select(element) {
    if (typeof element === 'string') {
      return document.querySelector(element);
    }
    return element;
  }

  function stringToDOM(string) {
    return document.createRange().createContextualFragment(string).firstElementChild;
  }

  function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return '0 Byte';
    }
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }

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

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
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
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var Dropper = function () {
    function Dropper(selector, settings) {
      classCallCheck(this, Dropper);

      this.el = select(selector);
      this.settings = Object.assign({}, Dropper.defaults, settings);
      this._init();
      this._initEvents();
    }

    createClass(Dropper, [{
      key: '_init',
      value: function _init() {
        this.files = [];
        this.events = {};
        this.input = stringToDOM('<input type="file" class="dropper__input" />');
        this.label = stringToDOM('\n      <label class="dropper__label">\n        Drag & Drop your files or Browse\n      </label>');
        this.filesWrapper = stringToDOM('<div class="dropper__files"></div>');
        if (this.settings.multiple) {
          this.input.multiple = true;
        }
        this.el.appendChild(this.input);
        this.el.appendChild(this.label);
        this.el.appendChild(this.filesWrapper);
      }
    }, {
      key: '_initEvents',
      value: function _initEvents() {
        var _this = this;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
          _this.el.addEventListener(eventName, _this.preventActions.bind(_this), false);
        });

        ['dragenter', 'dragover'].forEach(function (eventName) {
          _this.el.addEventListener(eventName, _this.highlight.bind(_this), false);
        });

        ['dragleave', 'drop'].forEach(function (eventName) {
          _this.el.addEventListener(eventName, _this.unhighlight.bind(_this), false);
        });

        this.el.addEventListener('drop', this.handleDrop.bind(this), false);
        this.el.addEventListener('click', function () {
          _this.input.click();
        });
        this.input.addEventListener('change', function () {
          return _this.addFiles(_this.input.files);
        }, false);
      }
    }, {
      key: 'preventActions',
      value: function preventActions(event) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, {
      key: 'highlight',
      value: function highlight() {
        this.form.classList.add('dropper__highlight');
      }
    }, {
      key: 'unhighlight',
      value: function unhighlight() {
        this.form.classList.remove('dropper__highlight');
      }
    }, {
      key: 'handleDrop',
      value: function handleDrop(event) {
        var files = event.dataTransfer.files;
        this.addFiles(files);
      }
    }, {
      key: 'addFiles',
      value: function addFiles(files) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var file = _step.value;

            var fileBlob = window.URL.createObjectURL(file);
            var index = this.files.length;

            var _file$type$split = file.type.split('/'),
                _file$type$split2 = slicedToArray(_file$type$split, 2),
                type = _file$type$split2[0],
                ext = _file$type$split2[1];

            this.files.push({
              file: file,
              type: type,
              ext: ext,
              id: Dropper.id++
            });
            this.uploadFile(this.files[index]);
            this.previewFile(this.files[index]);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.input.value = '';
      }
    }, {
      key: 'previewFile',
      value: function previewFile(fileObj) {
        var _this2 = this;

        var reader = new FileReader();
        reader.readAsDataURL(fileObj.file);
        reader.addEventListener('load', function () {
          fileObj.name = fileObj.file.name;
          fileObj.size = bytesToSize(fileObj.file.size);
          fileObj.path = reader.result;
          fileObj.isDirectory = false;
          fileObj.type = fileObj.file.type.split('/')[0];
          fileObj.progressBar = stringToDOM('\n        <progress class="dropper-file__progress" max=100 value=0 id="progress__' + fileObj.id + '"></progress>\n      ');
          _this2.createFile(fileObj);
          fileObj.el.appendChild(fileObj.progressBar);
          fileObj.el.addEventListener('click', function (e) {
            return _this2.preventActions(e);
          });
          _this2.filesWrapper.appendChild(fileObj.el);
        });
      }
    }, {
      key: 'createFile',
      value: function createFile(fileObj) {
        var _this3 = this;

        fileObj.el = stringToDOM('\n      <button href="#" type="button" class="dropper-file dropper-file--' + fileObj.type + '">\n        <div class="dropper-file__info">\n          <span class="dropper-file__info-name">' + fileObj.name + '</span>\n          <span class="dropper-file__info-size">' + fileObj.size + '</span>\n        </div>\n        ' + this.getFileIcon(fileObj) + '\n      </button>\n    ');
        fileObj.delete = stringToDOM('\n      <a class="dropper-file__delete">\n        <svg class="dropper__icon" viewBox="0 0 24 24">\n          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />\n        </svg>\n      </a>\n    ');
        fileObj.delete.addEventListener('click', function () {
          _this3.deleteFile(fileObj);
        });
        fileObj.el.appendChild(fileObj.delete);
        return fileObj.el;
      }
    }, {
      key: 'getFileIcon',
      value: function getFileIcon(fileObj) {
        if (fileObj.type === 'image') {
          return '<img class="dropper-file__image" src="' + fileObj.path + '"/>';
        }
        return icons('file');
      }
    }, {
      key: 'uploadFile',
      value: function uploadFile(fileObj) {
        var _this4 = this;

        var url = this.settings.url;
        if (!url) {
          return;
        }
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        xhr.open('POST', url, true);
        xhr.upload.addEventListener('progress', function (e) {
          _this4.updateProgress(fileObj.progressBar, e.loaded * 100.0 / e.total || 100);
        });

        xhr.addEventListener('readystatechange', function (e) {
          if (xhr.readyState === 4 && xhr.status === 200) {
            _this4.emit('uploadSucceed', fileObj);
          }
          if (xhr.readyState === 4 && xhr.status !== 200) {
            _this4.emit('uploadFailed', fileObj);
          }
        });

        formData.append('file', fileObj.file);
        xhr.send(formData);
      }
    }, {
      key: 'deleteFile',
      value: function deleteFile(fileObj) {
        var _this5 = this;

        var url = this.settings.url;
        if (!url) {
          return;
        }
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        xhr.open('DELETE', url + '/' + fileObj.name, true);
        xhr.addEventListener('readystatechange', function (e) {
          if (xhr.readyState === 4 && xhr.status === 200) {
            _this5.emit('fileDeleted', fileObj);
          }
        });

        fileObj.el.remove();
        this.files = this.files.filter(function (e) {
          return e !== fileObj;
        });
        formData.append('file', fileObj.file);
        xhr.send(formData);
      }
    }, {
      key: 'updateProgress',
      value: function updateProgress(progressBar, percent) {
        window.requestAnimationFrame(function () {
          progressBar.value = percent;
          if (percent === 100) {
            progressBar.classList.add('dropper-file__progress--hidden');
          }
        });
      }
    }, {
      key: 'on',
      value: function on(eventName, callback) {
        var _this6 = this;

        if (!this.events[eventName]) {
          this.events[eventName] = [];
        }

        var idx = this.events[eventName].length;
        this.events[eventName].push(callback);

        return function () {
          _this6.events[eventName].splice(idx, 1);
        };
      }
    }, {
      key: 'emit',
      value: function emit(eventName, args) {
        var _this7 = this;

        if (!this.events[eventName] || !this.events[eventName].length) {
          return;
        }

        setTimeout(function () {
          _this7.events[eventName].forEach(function (cb) {
            return cb(args);
          });
        }, 0);
      }
    }]);
    return Dropper;
  }();

  Dropper.defaults = {
    multiple: true,
    url: null
  };
  Dropper.id = 0;

  return Dropper;

})));
