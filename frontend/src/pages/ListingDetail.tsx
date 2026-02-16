import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getListing, type Listing } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getListing(id)
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
            <Link to="/" className="font-display text-2xl text-foreground">
              Trova
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-muted rounded w-24" />
            <div className="aspect-[4/3] sm:aspect-[16/9] bg-muted rounded-lg" />
            <div className="space-y-3">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-24" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
            <Link to="/" className="font-display text-2xl text-foreground">
              Trova
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground text-lg">Listing not found</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/">Back to listings</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link to="/" className="font-display text-2xl text-foreground">
            Trova
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to listings
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="rounded-lg overflow-hidden bg-muted aspect-square">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground w-fit mb-3">
              {listing.category}
            </span>

            <h1 className="font-display text-2xl sm:text-3xl text-foreground mb-2">
              {listing.title}
            </h1>

            <span className="text-2xl font-bold text-primary mb-6">
              €{listing.price}
            </span>

            <p className="text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
              {listing.description}
            </p>

            <div className="mt-auto">
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() =>
                  toast({
                    title: "Coming soon",
                    description: "Contact feature is not available yet.",
                  })
                }
              >
                <MessageCircle className="w-5 h-5" />
                Contact Seller
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Listed on{" "}
                {new Date(listing.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingDetail;
