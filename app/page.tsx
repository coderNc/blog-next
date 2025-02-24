import prisma from "@/src/lib/db"

export default async function Home() {
  const blogs = await prisma.blog.findMany({
    where: { status: 'Published' },
    include: { author: true },
    take: 5
  })

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Latest Blogs</h1>
      <div className="space-y-4">
        {blogs.map(blog => (
          <article key={blog.id} className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-gray-600">By {blog.author.username}</p>
          </article>
        ))}
      </div>
    </main>
  )
}