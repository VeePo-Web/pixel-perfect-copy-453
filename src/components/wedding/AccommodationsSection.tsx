import { Button } from "@/components/ui/button";
import ScrollReveal from "./ScrollReveal";
import { Star, Car } from "lucide-react";
import { toast } from "sonner";

const hotels = [
  {
    name: "Joshua Tree Inn",
    description: "A cozy boutique hotel with vintage charm and a quiet courtyard. Great for couples or solo travelers.",
    price: "$150/night",
    distance: "10 min drive",
    amenities: ["Pool", "Free WiFi", "Breakfast"],
    rating: 4.5,
    bookingUrl: "https://www.booking.com",
  },
  {
    name: "Desert Sage Lodge",
    description: "Comfortable rooms with desert views and a relaxed atmosphere. Good for families or groups.",
    price: "$180/night",
    distance: "15 min drive",
    amenities: ["Pool", "Spa", "Restaurant"],
    rating: 4.7,
    bookingUrl: "https://www.hotels.com",
  },
  {
    name: "Carmine Resort",
    description: "Stay right at the venue—no driving needed. Includes access to all resort amenities.",
    price: "$220/night",
    distance: "On-site",
    amenities: ["Full Service", "Spa", "Shuttle"],
    rating: 4.9,
    featured: true,
    bookingUrl: "https://www.expedia.com",
  },
];

const AccommodationsSection = () => {
  const handleReserve = (hotelName: string, bookingUrl: string) => {
    toast.success(`Opening reservations for ${hotelName}`, {
      description: "Remember to mention 'Mitchell-Garcia Wedding' for special rates!",
    });
    window.open(bookingUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="bg-wedding-cream py-20 md:py-32">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <ScrollReveal>
          <p className="font-sans-wedding text-sm tracking-widest uppercase text-wedding-text-light text-center mb-4">
            Where to Stay
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-serif-wedding text-4xl md:text-5xl text-wedding-text text-center mb-4">
            Places to Rest
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="font-sans-wedding text-wedding-text-light text-center max-w-2xl mx-auto mb-16">
            A few options we'd recommend. Mention "Mitchell-Garcia Wedding" for group rates.
          </p>
        </ScrollReveal>

        {/* Hotel Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {hotels.map((hotel, index) => (
            <ScrollReveal key={hotel.name} delay={0.1 * index}>
              <div
                className={`bg-white p-8 rounded-sm text-center h-full flex flex-col ${
                  hotel.featured ? "ring-2 ring-wedding-teal shadow-lg relative" : "shadow-sm"
                }`}
              >
                {hotel.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-wedding-teal text-white text-xs px-4 py-1 rounded-full font-sans-wedding">
                    Recommended
                  </span>
                )}
                
                <h3 className="font-serif-wedding text-2xl text-wedding-text mb-2">
                  {hotel.name}
                </h3>
                
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(hotel.rating) ? "fill-wedding-sage text-wedding-sage" : "text-wedding-cream-dark"}
                    />
                  ))}
                  <span className="font-sans-wedding text-xs text-wedding-text-light ml-1">
                    {hotel.rating}
                  </span>
                </div>

                <p className="font-sans-wedding text-wedding-text-light text-sm leading-relaxed mb-4 flex-grow">
                  {hotel.description}
                </p>

                <div className="flex items-center justify-center gap-2 text-wedding-text-light mb-4">
                  <Car size={14} />
                  <span className="font-sans-wedding text-xs">{hotel.distance}</span>
                </div>

                <div className="flex justify-center gap-4 mb-6">
                  {hotel.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="font-sans-wedding text-xs text-wedding-sage bg-wedding-cream px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <p className="font-serif-wedding text-xl text-wedding-text mb-6">
                  {hotel.price}
                </p>
                
                <Button
                  onClick={() => handleReserve(hotel.name, hotel.bookingUrl)}
                  variant="outline"
                  className={`mt-auto font-sans-wedding tracking-wide ${
                    hotel.featured
                      ? "bg-wedding-teal text-white border-wedding-teal hover:bg-wedding-teal-light"
                      : "bg-transparent text-wedding-sage border-wedding-sage hover:bg-wedding-sage hover:text-white"
                  }`}
                >
                  Reserve Now
                </Button>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Additional Info */}
        <ScrollReveal delay={0.5}>
          <div className="mt-16 text-center">
            <p className="font-sans-wedding text-sm text-wedding-text-light">
              Need help with accommodations?{" "}
              <a 
                href="mailto:sales@hickoryandrose.com" 
                className="text-wedding-teal hover:underline"
                onClick={() => toast.info("Opening email client...")}
              >
                Contact us
              </a>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AccommodationsSection;
