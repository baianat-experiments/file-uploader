function getFileType (ext) {
  switch (ext) {
    case 'jpg':
    case 'jpge':
    case 'png':
    case 'gif':
      return 'image';
      break;
    case 'mp4':
      return 'video';
      break;
  }
}

module.exports = {
  getFileType
}
