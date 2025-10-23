import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractActivities } from "../prompts/extractionPrompt.js";
import fs from "fs";
import path from "path";
import { fromPath } from 'pdf2pic';
import { PDFDocument } from "pdf-lib";
import { createWorker } from "tesseract.js";
import Tesseract from "tesseract.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest="static/uploads/";
    if (file.mimetype.startsWith("image/")) {
      dest = "static/images/";
    } else if (file.mimetype === "application/pdf") {
      dest = "static/pdfs/";
    }
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
    console.log(file.originalname)
  },
});

const upload = multer({ storage });

export const handleMessage = async (req, res) => {
  try {
    const { message } = req.body; 
    const file = req.file; 
    let imageAd=[];

    console.log("message message:", message);
    console.log("Uploaded file info:", file);

    let activitiesObject={};
    if (message.length>0 && message.length)
    {
        activitiesObject=await identifyActivitiesText(message)
    }
    else if (file.mimetype==="application/pdf")
    {
        imageAd= await convertToImage(file.filename)
    }
    else {
        const address='static/image/'+file.filename;
        imageAd.push(address)
        convertToText([imageAd])
    }

    res.status(200).json({
      success: true,
      body: activitiesObject,
    });
  } catch (error) {
    console.error("Error in handleMessage:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const uploadMiddleware = upload.single("file");

export const identifyActivitiesText = async (message) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMMA_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" }); // or gemini-1.5-flash
        const result = await model.generateContent(extractActivities(message));

        const activitiesString = result.response.text().replace(/```json/g, '')
                                        .replace(/```/g, '')
                                        .trim()
        const activitiesObject = JSON.parse(activitiesString)

        return activitiesObject;
    } catch (error) {
        console.error(error)
    }
}

export const convertToImage = async (originalname) => {
    const filepath='static/pdfs/'+originalname
    const dataBuffer = fs.readFileSync(filepath);
    const pdfDoc = await PDFDocument.load(dataBuffer);
    const pages=pdfDoc.getPageCount();

    const imageAd=[];

    for (let i=1; i<=pages; i++) {
        console.log("Page first console", i)
        const options = {
            density: 400,
            saveFilename: 'static/images/pdftoimage'+i,
            format: 'png',
            width: 600,
            height: 600,
        };

        const convert = fromPath(filepath, options);
        console.log("Page second console", i)

        try {
            const result = await convert(i, {
                responseType: 'image',
            });
            console.log(result);
        } catch (error) {
            console.error('Conversion error:', error);
        }
        console.log('Page'+i+'is now converted as an image');
        const ad='static/images/pdftoimage'+i
        imageAd.push(ad);
    }
    convertToText(imageAd)
    return imageAd

}


// export const convertToText = async (imagePaths) => {
//   const worker = createWorker({
//     logger: (m) => console.log(m), 
//   });

//   await worker.load();
//   await worker.loadLanguage("eng");
//   await worker.initialize("eng");

//   const textArray = [];

//   for (const img of imagePaths) {
//     const imagePath = path.resolve(img); 
//     try {
//       const { data: { text } } = await worker.recognize(imagePath);
//       textArray.push(text);
//       console.log("Extracted Text:", text);
//     } catch (error) {
//       console.error("Error recognizing image:", error);
//       textArray.push(""); 
//     }
//   }

//   await worker.terminate();
//   return textArray;
// };

// const convertToText = (imageAd) => {
//   const textArray = [];
//   for (let i = 0; i < imageAd.length; i++) {
//     const imagePath = imageAd[i];
//     console.log("first log");
//     Tesseract.recognize(imagePath, 'eng', {
//       logger: (m) =>console.log(m),
//     }).then(({
//       data: {
//         text
//       }
//     }) =>{
//       textArray.push(text);
//       console.log('Extracted Text:', text);
//     }).
//     catch((error) =>{
//       console.error('Error:', error);
//     });
//   }
//   console.log(textArray);
//   return textArray;
// }


