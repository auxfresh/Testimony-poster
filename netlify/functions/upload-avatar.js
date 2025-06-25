import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    // For Netlify, we'll use a simpler approach with base64 encoding
    // In production, you'd want to use a service like Cloudinary or AWS S3
    
    // Generate a placeholder response since file uploads need special handling in serverless
    const avatarUrl = `/avatars/uploaded-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatarUrl })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Failed to upload avatar' })
    };
  }
};