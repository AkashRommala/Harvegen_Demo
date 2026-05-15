import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} buffer - The file buffer
 * @param {string} folder - Cloudinary folder (e.g. 'harvegen/projects')
 * @returns {Promise<string>} Secure URL of the uploaded image
 */
export async function uploadToCloudinary(buffer, folder = 'harvegen') {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'auto' }, (error, result) => {
        if (error) return reject(error)
        resolve(result.secure_url)
      })
      .end(buffer)
  })
}

export default cloudinary
