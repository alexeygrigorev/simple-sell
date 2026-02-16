import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { CATEGORIES, analyzeImage, createListing, type Category } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const CreateListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<"upload" | "form">("upload");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Other");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  const handleImageSelected = useCallback(async (file: File, preview: string) => {
    setImagePreview(preview);
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(file);
      setTitle(result.title);
      setDescription(result.description);
      setCategory(result.category);
      setPrice(String(result.price));
      setStep("form");
    } catch {
      toast({ title: "Analysis failed", description: "Please fill in the details manually.", variant: "destructive" });
      setStep("form");
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;
    setIsSaving(true);
    try {
      await createListing({
        title,
        description,
        price: Number(price),
        category,
        imageUrl: imagePreview || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
        location: location || "Unknown",
      });
      toast({ title: "Listing created!", description: "Your item is now live." });
      navigate("/");
    } catch {
      toast({ title: "Error", description: "Failed to create listing.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl">Create Listing</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {step === "upload" && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                <Sparkles className="w-4 h-4" />
                AI-powered
              </div>
              <h2 className="font-display text-2xl text-foreground">Start with a photo</h2>
              <p className="text-muted-foreground mt-1">
                Upload an image and we'll fill in the details for you
              </p>
            </div>
            <ImageUpload onImageSelected={handleImageSelected} isAnalyzing={isAnalyzing} />
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {imagePreview && (
              <div className="rounded-lg overflow-hidden bg-muted aspect-video">
                <img src={imagePreview} alt="Item" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What are you selling?" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your item…" rows={4} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Price ($)</label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" min="0" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
                  <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.filter((c) => c !== "All").map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isSaving}>
              {isSaving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Posting…</> : "Post Listing"}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
};

export default CreateListing;
