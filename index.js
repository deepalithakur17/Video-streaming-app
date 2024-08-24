import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { exec } from "child_process"; // watch out (dangerous command) advised not to use in servers

const app = express();

let v;
// Multer middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
  },
});

// Multer configuration
const upload = multer({ storage: storage });

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000, http://localhost:5173"); // Allow specific origins
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json()); // It allows JSON type data
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/", function (req, res) {
  res.json({ message: "hello get 1" });
});

app.post("/upload", upload.single("file"), function (req, res) {
  const lessonId = uuidv4();
  const videoPath = req.file.path;
  const outputPath = `./uploads/courses/${lessonId}`; // HLS is an unstiched video
  const hlsPath = `${outputPath}/index.m3u8`;

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // ffmpeg
  const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

  // not to be used in production ......in production--- it will run on a set of machines 
  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.log(`exec error: ${error}`);
      return res.status(500).json({ error: "Video processing failed." });
    }

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    const videoUrl = `http://localhost:3000/uploads/courses/${lessonId}/index.m3u8`;  
    v=videoUrl


    res.json({
      message: "Video converted to HLS format",
      videoUrl: videoUrl,
      lessonId: lessonId,
    });
  });
});

app.listen(3000, function () {
  console.log("App is listening on port 3000");
});


// vedio.js pdna hai
// export default v
