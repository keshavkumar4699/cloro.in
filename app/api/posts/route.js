// app/api/posts/route.js
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/libs/next-auth";
import Post from "@/models/Post";
import connectMongo from "@/libs/mongoose";

// GET all posts
export async function GET() {
  await connectMongo();
  try {
    const posts = await Post.find().populate("author", "name email image").exec();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// CREATE a new post
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  try {
    const formData = await request.formData();
    
    // Extract text fields
    const title = formData.get('title');
    const content = formData.get('content');
    const category = formData.get('category');
    const imageFile = formData.get('image');
    
    // Handle file upload (example using Cloudinary)
    let imageUrl = '';
    if (imageFile) {
      // Upload to your storage solution (e.g., Cloudinary, S3)
      // This is a placeholder - implement your actual file upload logic
      imageUrl = await uploadToStorage(imageFile);
    }

    const newPost = new Post({
      title,
      content,
      category,
      author: session.user.id,
      imageUrl, // Store the URL if image was uploaded
    });

    await newPost.save();

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

// Example upload function (replace with your actual implementation)
async function uploadToStorage(file) {
  // Implement your file upload logic here
  // Example for Cloudinary:
  /*
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_upload_preset');
  
  const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  return data.secure_url;
  */
  return 'https://example.com/placeholder.jpg'; // Return a placeholder if no upload
}