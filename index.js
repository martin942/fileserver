const express = require("express");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/upload_files", upload.single("file"), uploadFiles);

app.get("/images", (req, res) => {
    let fileName = req.query.image;
    if(fileName == null || fileName == undefined || fileName == ""){
        res.json({message: "no image specified"});
        return;
    }
    let file = './uploads/'+fileName;
    let fileInfo = JSON.parse(fs.readFileSync('./uploads/'+fileName+'.info', 'utf8'));
    res.set('Content-Type', fileInfo.mimetype);
    var s = fs.createReadStream(file);
    s.on('open', () => {
        s.pipe(res);
    });
});

function uploadFiles(req, res) {
    let jsonString = JSON.stringify(req.file);
    fs.writeFile('./uploads/'+req.file.filename+'.info', jsonString, 'utf8', (err)=>{});
    res.json({ filename: req.file.filename});
}

app.listen(5000, () => {
    console.log(`Server started...`);
});