'use strict';
const mimetype = require('mime-types');
const sharp = require('sharp')
const crypto = require('node:crypto');
const fs = require('fs');
const path = require('path');
/**
 * A set of functions called "actions" for `avatar`
 */

module.exports = {
  get: async (ctx) => {
    const { id } = ctx.params;
    try {
      if (!Number.isInteger(parseInt(id))) {
        ctx.throw(400, 'The id must be an integer');
      }

      const user = await strapi.entityService.findOne('plugin::users-permissions.user', id);
      if (!user) {
        ctx.throw(404, 'User not found');
      }

      if (!user.avatar) {
        ctx.throw(404, 'User has no avatar');
      }

      const base64Data = await user.avatar;
      // Remove the data URI prefix (e.g., "data:image/png;base64,")
      const imageData = base64Data.replace(/^data:image\/\w+;base64,/, '');

      // Create a buffer from the base64 data
      const imageBuffer = Buffer.from(imageData, 'base64');

      // Get the root directory of the project
      const projectRoot = path.resolve(__dirname, '..', '..', '..', '..');

      // Specify the cache directory path relative to the project root
      const cacheDirPath = path.join(projectRoot, 'public', 'avatars');

      // Check if the cache directory exists, and create it if it doesn't
      if (!fs.existsSync(cacheDirPath)) {
        fs.mkdirSync(cacheDirPath, { recursive: true });
      }

      // Generate a checksum for the base64 data
      const checksum = crypto.createHash('md5').update(base64Data).digest("hex");

      // Specify the cache file path with the checksum in the filename
      const cacheFilePath = path.join(cacheDirPath, `${checksum}.webp`);

      if (fs.existsSync(cacheFilePath)) {
        // If the cached file exists, read it from the file system and send it as the response
        const cachedImageBuffer = fs.readFileSync(cacheFilePath);

        // Set the appropriate response headers
        ctx.set('Cache-Control', 'public, max-age=31536000, immutable');
        ctx.set('Content-Disposition', `inline; filename=${checksum}.webp`);
        ctx.set('Content-Type', 'image/webp');
        ctx.length = cachedImageBuffer.length;
        ctx.body = cachedImageBuffer;
      } else {
        // If the cached file does not exist, process the image and save it to the cache directory
        const webpBuffer = await sharp(imageBuffer)
          .resize(200, 200, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({
            quality: 80
          })
          .toBuffer();

        // Save the image buffer to the cache directory
        fs.writeFileSync(cacheFilePath, webpBuffer);

        // Set the appropriate response headers
        ctx.set('Cache-Control', 'public, max-age=31536000, immutable');
        ctx.set('Content-Disposition', `inline; filename=${checksum}.webp`);
        ctx.set('Content-Type', 'image/webp');
        ctx.length = webpBuffer.length;
        ctx.body = webpBuffer;
        ctx.type = 'image/webp';
      }
    } catch (err) {
      strapi.log.error('error', err);
      ctx.body = err;
    }
  }
};