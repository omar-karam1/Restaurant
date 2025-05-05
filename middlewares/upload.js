const multer = require('multer');
const path = require('path');

// تعيين مكان حفظ الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // تحديد المجلد الذي سيحفظ فيه الصور
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // تحديد امتداد الصورة
    cb(null, Date.now() + ext); // تعيين اسم فريد للصورة
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
