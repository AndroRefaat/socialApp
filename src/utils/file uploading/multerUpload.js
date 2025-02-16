
// import multer, { diskStorage } from "multer";
// import { nanoid } from "nanoid";

// export const fileValidation = {
//     images: ["image/jpeg", "image/jpg", "image/png"],

// }



// export const upload = (fileType, folder) => {
//     const storage = diskStorage({
//         destination: folder,
//         filename: (req, file, cb) => {
//             cb(null, nanoid() + "__" + file.originalname)
//         }
//     })
//     const fileFilter = (req, file, cb) => {
//         if (!fileType.includes(file.mimetype)) return cb(new Error("Invalid file type"), false);
//         return cb(null, true)
//     }

//     const multerUpload = multer({ storage, fileFilter });
//     return multerUpload
// }