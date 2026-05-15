import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: false, trim: true, default: '' },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
      index: true,
    },
    password: { type: String, select: false }, // excluded from queries by default
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    college: { type: String, default: '', trim: true },
    branch: { type: String, default: '', trim: true },
    isVerified: { type: Boolean, default: false },
    // Progress tracking
    completedTutorials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tutorial' }],
    completedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  },
  { timestamps: true }
)

// Hash password before save (Mongoose 7+: async middleware — no next() parameter)
// Skips hashing if the password was already pre-hashed (set via $locals.skipHash)
UserSchema.pre('save', async function () {
  if (this.$locals?.skipHash) return          // already hashed externally
  if (!this.isModified('password') || !this.password) return
  this.password = await bcrypt.hash(this.password, 12)
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model('User', UserSchema)
