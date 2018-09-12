import icons from './icons';
import { select, stringToDOM, bytesToSize } from './utils';

class Dropper {
  constructor (selector, settings) {
    this.el = select(selector);
    this.settings = {
      ...Dropper.defaults,
      ...settings
    }
    this._init();
    this._initEvents();
  }


  _init () {
    this.files = [];
    this.events = {};
    this.input = stringToDOM('<input type="file" class="dropper__input" />');
    this.label = stringToDOM(`
      <label class="dropper__label">
        Drag & Drop your files or Browse
      </label>`
    );
    this.filesWrapper = stringToDOM('<div class="dropper__files"></div>');
    if (this.settings.multiple) {
      this.input.multiple = true;
    }
    this.el.appendChild(this.input);
    this.el.appendChild(this.label);
    this.el.appendChild(this.filesWrapper);
  }

  _initEvents () {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      this.el.addEventListener(eventName, this.preventActions.bind(this), false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
      this.el.addEventListener(eventName, this.highlight.bind(this) , false)
    });

    ['dragleave', 'drop'].forEach(eventName => {
      this.el.addEventListener(eventName, this.unhighlight.bind(this), false)
    });

    this.el.addEventListener('drop', this.handleDrop.bind(this), false)
    this.el.addEventListener('click', () => { this.input.click(); });
    this.input.addEventListener('change', () => this.addFiles(this.input.files), false);
  }

  preventActions (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  highlight () {
    this.form.classList.add('dropper__highlight');
  }

  unhighlight () {
    this.form.classList.remove('dropper__highlight');
  }

  handleDrop (event) {
    const files = event.dataTransfer.files
    this.addFiles(files);
  }

  addFiles (files) {
    for (const file of files) {
      const fileBlob = window.URL.createObjectURL(file);
      const index = this.files.length;
      const [type, ext] = file.type.split('/');
      this.files.push({
        file,
        type,
        ext,
        id: Dropper.id++
      });
      this.uploadFile(this.files[index]);
      this.previewFile(this.files[index]);
    }
    this.input.value = '';
  }

  previewFile (fileObj) {
    const reader = new FileReader();
    reader.readAsDataURL(fileObj.file);
    reader.addEventListener('load', () => {
      fileObj.name = fileObj.file.name;
      fileObj.size = bytesToSize(fileObj.file.size);
      fileObj.path = reader.result;
      fileObj.isDirectory = false;
      fileObj.type = fileObj.file.type.split('/')[0];
      fileObj.progressBar = stringToDOM(`
        <progress class="dropper-file__progress" max=100 value=0 id="progress__${fileObj.id}"></progress>
      `);
      this.createFile(fileObj);
      fileObj.el.appendChild(fileObj.progressBar);
      fileObj.el.addEventListener('click', e => this.preventActions(e));
      this.filesWrapper.appendChild(fileObj.el);
    });
  }

  createFile (fileObj) {
    fileObj.el = stringToDOM(`
      <button href="#" type="button" class="dropper-file dropper-file--${fileObj.type}">
        <div class="dropper-file__info">
          <span class="dropper-file__info-name">${fileObj.name}</span>
          <span class="dropper-file__info-size">${fileObj.size}</span>
        </div>
        ${this.getFileIcon(fileObj)}
      </button>
    `);
    fileObj.delete = stringToDOM(`
      <a class="dropper-file__delete">
        <svg class="dropper__icon" viewBox="0 0 24 24">
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </a>
    `);
    fileObj.delete.addEventListener('click', () => {
      this.deleteFile(fileObj);
    })
    fileObj.el.appendChild(fileObj.delete);
    return fileObj.el;
  }

  getFileIcon (fileObj) {
    if (fileObj.type === 'image') {
      return `<img class="dropper-file__image" src="${fileObj.path}"/>`
    }
    return icons('file');
  }

  uploadFile (fileObj) {
    const url = this.settings.url;
    if (!url) {
      return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.open('POST', url, true);
    xhr.upload.addEventListener('progress', e => {
      this.updateProgress(fileObj.progressBar, (e.loaded * 100.0 / e.total) || 100)
    })

    xhr.addEventListener('readystatechange', e => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.emit('uploadSucceed', fileObj)
      }
      if (xhr.readyState === 4 && xhr.status !== 200) {
        this.emit('uploadFailed', fileObj)
      }
    });
  
    formData.append('file', fileObj.file);
    xhr.send(formData);
  }


  deleteFile (fileObj) {
    const url = this.settings.url;
    if (!url) {
      return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.open('DELETE', `${url}/${fileObj.name}`, true);
    xhr.addEventListener('readystatechange', e => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.emit('fileDeleted', fileObj);
      }
    });

    fileObj.el.remove();
    this.files = this.files.filter(e => e !== fileObj);
    formData.append('file', fileObj.file);
    xhr.send(formData);
  }

  updateProgress(progressBar, percent) {
    window.requestAnimationFrame(() => {
      progressBar.value = percent;
      if (percent === 100) {
        progressBar.classList.add('dropper-file__progress--hidden')
      }
    })
  }

  on (eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    const idx = this.events[eventName].length;
    this.events[eventName].push(callback);

    return () => {
      this.events[eventName].splice(idx, 1);
    };
  }

  emit (eventName, args) {
    if (!this.events[eventName] || !this.events[eventName].length) {
      return;
    }

    setTimeout(() => {
      this.events[eventName].forEach(cb => cb(args));
    }, 0);
  }

  static defaults = {
    multiple: true,
    url: null
  }
  static id = 0
}

export default Dropper;