import { fromPath } from 'pdf2pic';

const options = {
  density: 100,
  saveFilename: 'untitled',
  format: 'png',
  width: 600,
  height: 600,
};

const convert = fromPath('tt.pdf', options);
const pageToConvertAsImage = 1;

async function convertPdfPageToImage() {
  try {
    const result = await convert(pageToConvertAsImage, {
      responseType: 'image',
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error('Conversion error:', error);
  }
  console.log('Page 1 is now converted as an image');
}

convertPdfPageToImage();