import mongoose from 'mongoose'

/**
 * OTP document stored in MongoDB.
 * TTL index on `createdAt` auto-deletes the document after 5 minutes.
 *
 * Stores only email + otp. Profile data is immediately stored in User collection.
 */
const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    enum: ['signin', 'signup'],
    required: true,
  },
  // TTL: MongoDB automatically removes this document 5 minutes after creation
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // seconds
  },
})

// Compound unique index: one active OTP per email at a time
OtpSchema.index({ email: 1 }, { unique: true })

export default mongoose.models.Otp || mongoose.model('Otp', OtpSchema)
