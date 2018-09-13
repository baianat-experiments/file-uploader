# Dropper (wip) 🐛

A drag and drop file upload library that it friendly and fun to use. It offers great accessibility, validation and a smooth user experience.

## Getting Started

### Installation

You can install `dropper` using npm

```bash
npm install @baianat/dropper

# or using yarn
yarn add @baianat/dropper
```

### Include necessary files

``` html
<head>
  <link rel="stylesheet" href="dist/css/dropper.css">
</head>
<body>
    ...
    <script type="text/javascript" src="dist/js/dropper.js"></script>
</body>
```

### Make it work

You need a form element to bind `dropper` to it.

```html
<form class="dropper" id="dropper"></form>
```

Then create new `dropper` instance, you have to path uploading url to it

```js
let dropper = new Dropper('#dropper', {
  url: `${server}/upload`
});
```

### Events Listeners

`dropper` comes with may events that helps you to track file uploading and status

| event name      | description                             |
|-----------------|-----------------------------------------|
| `uploadFailed`  | emits when a file uploaded successfully |
| `uploadSuccees` | emits when a file failed to upload      |
| `fileDeleted`   | emits when an uploaded file deleted     |

```js
dropper.on('uploadFailed', ($file) => {
  console.log('😭', $file.name, 'uploading failed');
});
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017 [Baianat](http://baianat.com)