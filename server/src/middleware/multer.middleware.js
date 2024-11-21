import multer from "multer";
import path from 'path';

function getdate() {
    const currentDate = new Date();

    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    
    const formattedDateTime = `${hours}-${minutes}-${seconds}_${day}-${month}-${year}`;
    
    return formattedDateTime;
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,  path.join(process.cwd(), "public", "temp")) 
    },
    filename: function (req, file, cb) {
        cb(null, `${getdate()}-${file.originalname}`);
    }
})


// const storage = multer.memoryStorage()


const upload = multer({ storage: storage })

export { upload }
