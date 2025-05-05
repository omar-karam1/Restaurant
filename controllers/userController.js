const bcrypt = require('bcryptjs');
const User = require('../models/User');

// إنشاء مستخدم مع تشفير كلمة المرور
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: role || 'user' // 👈 إضافة role بقيمة افتراضية "user"
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', user });

  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// عرض كل المستخدمين
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// عرض مستخدم حسب ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// تحديث بيانات مستخدم
exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// حذف مستخدم
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // حفظ معلومات المستخدم في الجلسة
    req.session.userId = user._id;
    req.session.role = user.role; // 👈 حفظ الدور في الجلسة
    req.session.save();

    res.status(200).json({ 
      message: 'Login successful', 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role // 👈 إرجاع الدور للفرونت
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Login error', error });
  }
};
