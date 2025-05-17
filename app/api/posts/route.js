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
    const { title, content, category, uploadedImageUrl } = await request.json();

    const newPost = new Post({
      title,
      content,
      category,
      imageUrl: uploadedImageUrl,
      author: session.user.id,
    });

    await newPost.save();
    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}