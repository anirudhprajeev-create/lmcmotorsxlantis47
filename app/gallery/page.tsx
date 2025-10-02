import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function GalleryPage() {
    const cultureImages = PlaceHolderImages.filter(img => img.id.startsWith('culture-'));

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-3xl text-center">
                <h1 className="font-headline text-4xl font-bold md:text-5xl">LMC Gallery</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    A glimpse into our team and work culture at LMC Motors.
                </p>
            </div>
            <div className="mt-12">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {cultureImages.map((image) => (
                        <Card key={image.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="relative aspect-video">
                                    <Image 
                                        src={image.imageUrl} 
                                        alt={image.description}
                                        fill
                                        className="object-cover transition-transform duration-300 hover:scale-105"
                                        data-ai-hint={image.imageHint}
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
