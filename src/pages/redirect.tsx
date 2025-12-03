import { useEffect } from "react";
import { useParams } from "wouter";

export default function RedirectPage() {
  const params = useParams();
  const slug = params.slug;

  useEffect(() => {
    if (slug) {
      // Redirect to backend API endpoint which will handle the redirect
      window.location.href = `/api/link/${slug}`;
    }
  }, [slug]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
