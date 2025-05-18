import MainLayout from "@/components/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Recommended Posts</h1>
        {/* Your main content goes here */}
        <div className="space-y-6">
          {/* Example post */}
          <article className="p-6 bg-base-100 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-2">Post Title</h2>
            <p className="text-base-content/80">Post excerpt goes here...</p>
          </article>
          {/* Add more posts */}
        </div>
      </div>
    </MainLayout>
  );
}