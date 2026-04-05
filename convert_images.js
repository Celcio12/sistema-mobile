const jimp = require('jimp');

async function convertIcons() {
  const images = ['icon.png', 'splash.png', 'adaptive-icon.png'];
  for (const imgName of images) {
    try {
      const imgPath = './assets/' + imgName;
      console.log('Reading:', imgPath);
      const img = await jimp.read(imgPath);
      
      // Salvar temporariamente logo voltar para PNG
      const tempPath = './assets/temp_' + imgName;
      await img.writeAsync(tempPath);
      
      const fileExt = img.getExtension();
      console.log('Original was:', fileExt, 'Now saving as PNG');
      
      // Force rewrite to ensure it's a PNG
      await img.writeAsync(imgPath);
      console.log('Successfully rewrote', imgPath, 'as PNG');
    } catch(e) {
      console.error('Failed to parse', imgName, e);
    }
  }
}

convertIcons();
