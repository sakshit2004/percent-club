"use client"

export default function TestMiddlewarePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Middleware Test Page</h1>
      <p className="text-muted-foreground">
        If you can see this page, the middleware is working and you are authenticated.
      </p>
      <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
        <p className="text-green-800">
          ✅ Middleware is protecting this route successfully!
        </p>
      </div>
    </div>
  )
}
