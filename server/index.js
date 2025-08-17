import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync("uploads", { recursive: true });
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json"
  }
});


function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    },
  };
}


async function analyzeResume(filePath, jobDesc = "") {
  try {
    const prompt = `Analyze this resume and provide detailed feedback in JSON format. 
    Focus on identifying key qualifications, skills gaps, and improvement suggestions.
    ${jobDesc ? `\n\nJob Description Requirements:\n${jobDesc}` : ''}
    
    Return JSON in this exact structure:
    {
      "overallScore": 0-100,
      "summary": "brief overview",
      "strengths": [],
      "weaknesses": [],
      "missingSkills": [],
      "suggestions": [],
      "actionItems": []
    }`;

    const fileExtension = filePath.split('.').pop().toLowerCase();
    const mimeType = fileExtension === 'pdf' ? 'application/pdf' : 
                    fileExtension === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                    'text/plain';

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            fileToGenerativePart(filePath, mimeType)
          ]
        }
      ]
    });

    const response = result.response;
    const jsonResponse = JSON.parse(response.text());
    return jsonResponse;

  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error(`Gemini analysis failed: ${error.message}`);
  }
}


app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: "No file uploaded" 
      });
    }

    const jobDescription = req.body.jobDescription || "";
    const analysisResult = await analyzeResume(req.file.path, jobDescription);


    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      analysis: analysisResult,
      model: "gemini-1.5-flash",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error in analysis:", error);
    

    if (req.file?.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      success: false,
      error: "Error processing resume",
      details: error.message,
      model: "gemini-1.5-flash"
    });
  }
});


app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    model: 'gemini-1.5-flash',
    timestamp: new Date().toISOString() 
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);

});