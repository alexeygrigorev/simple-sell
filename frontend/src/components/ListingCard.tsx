import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Listing } from "@/lib/api";

export function ListingCard({ listing }: { listing: Listing }) {
  const { toast } = useToast();

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group rounded-lg overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 block"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-body font-semibold text-card-foreground leading-tight line-clamp-1">
            {listing.title}
          </h3>
          <span className="text-lg font-bold text-primary whitespace-nowrap">
            €{listing.price}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {listing.description}
        </p>
        <div className="flex items-center">
          <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
            {listing.category}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3 gap-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toast({ title: "Coming soon", description: "Contact feature is not available yet." });
          }}
        >
          <MessageCircle className="w-4 h-4" />
          Contact Seller
        </Button>
      </div>
    </Link>
  );
}
