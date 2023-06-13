const fs = require('fs');
const excelJS = require('exceljs');
const { performance } = require('perf_hooks');


const inputFile = './src/t8.shakespeare.txt';

const outputFile = './output/t8.shakespeare.translated.txt';

const dictionaryFile = './src/french_dictionary.csv';
const frequency = {};
const startTime = performance.now();

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  const workbook = new excelJS.Workbook();
  workbook.csv.readFile(dictionaryFile)
    .then(() => {
      const worksheet = workbook.getWorksheet(1);

      const dictionary = {};
      worksheet.eachRow((row) => {
        const [empty ,english, french] = row.values;
        dictionary[english] = french;
      });

      const words = data.split(' ');
      let wordStack = {}
      const translatedWords = words.map((word) => {
        const frenchTranslation = dictionary[word];
           if(frenchTranslation==undefined){
            return word
           }
           else{ 
            if(wordStack[`${word},${frenchTranslation}`]){
                wordStack[`${word},${frenchTranslation}`]++
            }
            else{
                wordStack[`${word},${frenchTranslation}`] = 1
            }
            return frenchTranslation
           }
      });
      
      const translatedContent = translatedWords.join(' ');

      fs.writeFile(outputFile, translatedContent, (err) => {
        if (err) {
          console.error('Error writing the file:', err);
          return;
        }
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        
        console.log('File converted successfully. and time taken is ', elapsedTime);
        
      });
    })
    .catch((error) => {
      console.error('Error reading the dictionary file:', error);
    });
});
