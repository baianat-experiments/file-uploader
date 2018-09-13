const fs = require('fs');
const chalk = require('chalk');
const stylus = require('stylus');
const path = require('path');
const uglifycss = require('uglifycss');

const { style } = require('./config');

const isProduction = process.env.MODE === 'production';

async function buildStyles () {
  console.log(chalk.cyan('📦 Generating Stylesheet...'));
  const str = fs.readFileSync(style.input, 'utf8');
  stylus(str)
    .set('paths', [style.src])
    .set('include css', true)
    .render((err, css) => {
      if (err) throw err;
      fs.writeFileSync(style.output, css);
      console.log(chalk.green('👍 Stylesheet built successfully.'));
      if (!isProduction) return
      const filePath = path.join(style.dist, 'dropper.min.css');
      fs.writeFileSync(filePath, uglifycss.processString(css));
    });
}

buildStyles();

module.exports = { buildStyles }
