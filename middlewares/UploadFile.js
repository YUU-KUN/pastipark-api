import multer from 'multer';

// const storage = multer.memoryStorage({});

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/evidences');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create the multer instance
export const upload = multer({ storage: storage });

