const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express()
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/ImageStorage")
.then(() => console.log('DataBase connected'))
.catch(err => console.log(err));

const ProfileSchema = mongoose.Schema({
    UserName : String,
    ImageURL :  String
}) 
const ProfileModel = mongoose.model("ProfilePicture",ProfileSchema) 

const s = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'public/images')
    },
    filename:(req,file,cb) =>{
        cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})

const uploadImage = multer({
    storage:s
})

app.post('/uploadImage',uploadImage.single('image'),(req,res)=>{
    
    const image = req.file.filename;
    const UserName = req.body.UserName;
    const newProfile = new ProfileModel({
        UserName: UserName,
        ImageURL: image
    });

    newProfile.save()
    .then(() => {
        res.status(200).json({ message: 'Image uploaded and data saved successfully.' });
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Failed to save data.' });
    });
});

app.get("/", (req, res) =>{
   
    ProfileModel.find({}).then((data) =>{
        res.status(200).json({ data: data});
    }).catch((err)=>{
        res.status(400).json({ error: err});
    })
})

app.listen(3000, () => {
  console.log('listening at http://localhost:3000');
});
