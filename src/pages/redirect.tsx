import { useEffect } from "react";
import { useParams } from "wouter";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export default function RedirectPage() {
  const params = useParams();
  const slug = params.slug;

  useEffect(() => {
    if (slug) {
      // Get the source parameter to check if it's an internal click
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('source');
      
      // Build the redirect URL with source parameter if present
      const redirectUrl = source 
        ? `${API_BASE_URL}/link/${slug}?source=${source}`
        : `${API_BASE_URL}/link/${slug}`;
      
      // Redirect to backend API endpoint which will handle the redirect
      window.location.href = redirectUrl;
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
