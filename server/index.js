import express from "express"
import cors from "cors"
import multer from "multer";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const upload = multer({ storage });






app.post("/upload", upload.single("resume"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  console.log("Uploaded file:", req.file);

  res.json({
    message: "Resume uploaded successfully",
    filePath: req.file.path,
  });
});

app.listen(port,()=>{
  console.log("Server is running on port", port);
})
