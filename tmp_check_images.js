const fs = require('fs');
const files = ['icon.png', 'splash.png', 'adaptive-icon.png'];
files.forEach(f => {
  const b = fs.readFileSync('./assets/' + f);
  const sig = b.slice(0, 8).toString('hex');
  const isPNG = sig.startsWith('89504e47');
  const isJPG = sig.startsWith('ffd8');
  console.log(f + ' -> ' + (isPNG ? 'REAL PNG OK' : isJPG ? 'IS JPG!!! NEEDS FIX' : 'UNKNOWN: ' + sig));
});
