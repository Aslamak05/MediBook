import mongoose from 'mongoose';

const MONGO_URL = 'mongodb+srv://medibook:medibook123@medibook.fe0zugu.mongodb.net/medibook?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['patient', 'doctor', 'admin'] },
  phone: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function deleteAccounts() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('✓ Connected to MongoDB');

    // Delete only patient and doctor demo accounts
    const result = await User.deleteMany({ email: { $in: ['patient@demo.com', 'doctor@demo.com'] } });
    
    console.log(`✓ Deleted ${result.deletedCount} accounts`);
    console.log('✓ Keeping: admin@demo.com');

    await mongoose.disconnect();
    console.log('✓ Done!');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

deleteAccounts();
