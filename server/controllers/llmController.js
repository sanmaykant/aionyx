import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractActivities } from "../prompts/extractionPrompt.js";
import fs from "fs";
import { fromPath } from 'pdf2pic';
import { PDFDocument } from "pdf-lib";
import Tesseract from "tesseract.js";
import { promises as fsPromises } from 'fs';


const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    let dest="static/uploads/";
    if (file.mimetype.startsWith("image/")) {
      dest = "static/images/";
    } else if (file.mimetype === "application/pdf") {
      dest = "static/pdfs/";
      fs.mkdirSync("static/images/", { recursive: true });
    }
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
    console.log(file.originalname)
  },
});

const deleteFile = async(filePath) => {
    try {
        await fsPromises.unlink(filePath);
        console.log('File deleted successfully'+filePath);
    } catch (err) {
        console.error('Error deleting file with promises:', err);
    }
}

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
        const address='static/images/'+file.filename;
        imageAd.push(address)
    }

    if (!message.length)
    {
      const textFromImage=await convertToText(imageAd)
      activitiesObject=await identifyActivitiesText(textFromImage)
      console.log(activitiesObject)
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
            density: 800,
            saveFilename: 'static/images/pdftoimage',
            format: 'png',
            width: 1200,
            height: 1200,
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
        const ad='static/images/pdftoimage.'+i+".png"
        imageAd.push(ad);
    }
    deleteFile(filepath);
    return imageAd
}

const convertToText = async (imageAd) => {
  const textArray = [];
  for (let i = 0; i < imageAd.length; i++) {
    const imagePath = imageAd[i];
    console.log(imageAd[i]);
    console.log("first log");
    await Tesseract.recognize(imagePath, 'eng', {
        ocrEngineMode: 3, 
        tessedit_pageseg_mode: 6, 
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 
    }).then(({
      data: {
        text
      }
    }) =>{
      textArray.push(text);
      console.log('Extracted Text:', text);
    }).
    catch((error) =>{
      console.error('Error:', error);
    });
    deleteFile(imagePath)
  }
  console.log(textArray);
  return textArray;
}


