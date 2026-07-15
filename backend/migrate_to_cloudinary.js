import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load local env file
dotenv.config();

const MONGODB_URI = "mongodb+srv://rpatadiya2004_db_user:wMBEbL99Fm34Yvxh@novella.1afjchj.mongodb.net/novella?appName=novella";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadsDir = path.resolve('../uploads');

async function run() {
  console.log('Connecting to Atlas Database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected successfully!');

  const db = mongoose.connection.db;

  // Helper to upload file to Cloudinary
  async function uploadFile(filename) {
    const filePath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`File not found locally: ${filePath}`);
      return null;
    }
    try {
      console.log(`Uploading ${filename} to Cloudinary...`);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'novella_migration'
      });
      return result.secure_url;
    } catch (err) {
      console.error(`Failed to upload ${filename}:`, err.message);
      return null;
    }
  }

  // 1. Migrate Products
  console.log('Migrating products...');
  const productsCol = db.collection('products');
  const products = await productsCol.find({}).toArray();
  for (const prod of products) {
    let updated = false;
    let newImages = [];
    if (prod.images && prod.images.length > 0) {
      for (const img of prod.images) {
        if (img.includes('localhost:5000/uploads/')) {
          const filename = img.split('/uploads/')[1];
          const cloudUrl = await uploadFile(filename);
          if (cloudUrl) {
            newImages.push(cloudUrl);
            updated = true;
          } else {
            newImages.push(img);
          }
        } else {
          newImages.push(img);
        }
      }
    }
    let newImage = prod.image;
    if (prod.image && prod.image.includes('localhost:5000/uploads/')) {
      const filename = prod.image.split('/uploads/')[1];
      const cloudUrl = await uploadFile(filename);
      if (cloudUrl) {
        newImage = cloudUrl;
        updated = true;
      }
    }

    if (updated) {
      await productsCol.updateOne(
        { _id: prod._id },
        { $set: { image: newImage, images: newImages } }
      );
      console.log(`Updated product images for: ${prod.name}`);
    }
  }

  // 2. Migrate Categories
  console.log('Migrating categories...');
  const categoriesCol = db.collection('categories');
  const categories = await categoriesCol.find({}).toArray();
  for (const cat of categories) {
    if (cat.heroImage && cat.heroImage.includes('localhost:5000/uploads/')) {
      const filename = cat.heroImage.split('/uploads/')[1];
      const cloudUrl = await uploadFile(filename);
      if (cloudUrl) {
        await categoriesCol.updateOne(
          { _id: cat._id },
          { $set: { heroImage: cloudUrl } }
        );
        console.log(`Updated category image for: ${cat.name}`);
      }
    }
  }

  // 3. Migrate Showcases
  console.log('Migrating showcases...');
  const showcasesCol = db.collection('showcases');
  const showcases = await showcasesCol.find({}).toArray();
  for (const show of showcases) {
    if (show.image && show.image.includes('localhost:5000/uploads/')) {
      const filename = show.image.split('/uploads/')[1];
      const cloudUrl = await uploadFile(filename);
      if (cloudUrl) {
        await showcasesCol.updateOne(
          { _id: show._id },
          { $set: { image: cloudUrl } }
        );
        console.log(`Updated showcase image for: ${show.handle}`);
      }
    }
  }

  // 4. Migrate CMS Settings
  console.log('Migrating CMS Settings...');
  const cmsCol = db.collection('cmssettings');
  const cmsSettings = await cmsCol.find({}).toArray();
  for (const setting of cmsSettings) {
    let updated = false;
    let val = setting.value;
    if (val) {
      if (val.image && val.image.includes('localhost:5000/uploads/')) {
        const filename = val.image.split('/uploads/')[1];
        const cloudUrl = await uploadFile(filename);
        if (cloudUrl) {
          val.image = cloudUrl;
          updated = true;
        }
      }
      if (val.hotspots && val.hotspots.length > 0) {
        for (let spot of val.hotspots) {
          if (spot.fallback && spot.fallback.image && spot.fallback.image.includes('localhost:5000/uploads/')) {
            const filename = spot.fallback.image.split('/uploads/')[1];
            const cloudUrl = await uploadFile(filename);
            if (cloudUrl) {
              spot.fallback.image = cloudUrl;
              updated = true;
            }
          }
        }
      }
    }
    if (updated) {
      await cmsCol.updateOne(
        { _id: setting._id },
        { $set: { value: val } }
      );
      console.log(`Updated CMS setting: ${setting.key}`);
    }
  }

  console.log('Cloudinary Migration Complete!');
  await mongoose.disconnect();
}

run().catch(console.error);
