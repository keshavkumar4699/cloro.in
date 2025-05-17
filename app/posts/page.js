// app/posts/page.js
import PostsList from "@/components/PostsList";
import PostForm from "@/components/PostForm";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";

export default async function PostsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth?callbackUrl=/posts");

  return (
    <>
      <Header />

      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Community Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <PostsList />
          </div>
          <div className="md:col-span-1">
            <div className="sticky top-4">
              <h2 className="text-xl font-bold mb-4">Create a Post</h2>
              <PostForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
