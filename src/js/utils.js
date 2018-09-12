/**
 * Utilities
 */
export function select (element) {
  if (typeof element === 'string') {
    return document.querySelector(element);
  }
  return element;
}


export function stringToDOM (string) {
  return document.createRange().createContextualFragment(string).firstElementChild;
}

export function bytesToSize (bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return '0 Byte';
  }
  const  i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};