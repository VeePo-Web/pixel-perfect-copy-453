import ScrollReveal from "./ScrollReveal";
import { Plane, Car, MapPin } from "lucide-react";

const airports = [
  {
    code: "PSP",
    name: "Palm Springs International",
    distance: "45 min drive",
    description: "The closest option—quick and easy.",
  },
  {
    code: "LAX",
    name: "Los Angeles International",
    distance: "2.5 hr drive",
    description: "More flight options if you're coming from farther away.",
  },
  {
    code: "ONT",
    name: "Ontario International",
    distance: "1.5 hr drive",
    description: "Smaller and less busy than LAX.",
  },
];

const TravelSection = () => {
  return (
    <section className="bg-wedding-cream py-20 md:py-32">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <p className="font-sans-wedding text-sm tracking-widest uppercase text-wedding-text-light text-center mb-4">
            Getting Here
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-serif-wedding text-4xl md:text-5xl text-wedding-text text-center mb-4">
            Travel Information
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="font-sans-wedding text-wedding-text-light text-center max-w-2xl mx-auto mb-16">
            The venue is in the high desert of Southern California. 
            Here's what you need to know to find your way.
          </p>
        </ScrollReveal>

        {/* Airports */}
        <div className="max-w-4xl mx-auto mb-16">
          <ScrollReveal delay={0.3}>
            <div className="flex items-center justify-center gap-2 mb-8">
              <Plane className="text-wedding-sage" size={24} />
              <h3 className="font-serif-wedding text-2xl text-wedding-text">
                Nearby Airports
              </h3>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {airports.map((airport, index) => (
              <ScrollReveal key={airport.code} delay={0.1 * index}>
                <div className="bg-white p-6 rounded-lg text-center">
                  <p className="font-serif-wedding text-3xl text-wedding-sage mb-2">
                    {airport.code}
                  </p>
                  <h4 className="font-serif-wedding text-lg text-wedding-text mb-1">
                    {airport.name}
                  </h4>
                  <p className="font-sans-wedding text-sm text-wedding-teal font-medium mb-3">
                    {airport.distance}
                  </p>
                  <p className="font-sans-wedding text-xs text-wedding-text-light">
                    {airport.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Driving */}
        <div className="max-w-3xl mx-auto">
          <ScrollReveal delay={0.5}>
            <div className="flex items-center justify-center gap-2 mb-8">
              <Car className="text-wedding-sage" size={24} />
              <h3 className="font-serif-wedding text-2xl text-wedding-text">
                Driving Directions
              </h3>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <div className="bg-white p-8 rounded-lg">
              <div className="flex items-start gap-4 mb-6">
                <MapPin className="text-wedding-teal flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-serif-wedding text-lg text-wedding-text mb-2">
                    Venue Address
                  </h4>
                  <p className="font-sans-wedding text-wedding-text-light">
                    Joshua Tree Carmine Resort<br />
                    62405 Verbena Rd<br />
                    Joshua Tree, CA 92252
                  </p>
                </div>
              </div>

              <div className="space-y-4 font-sans-wedding text-sm text-wedding-text-light">
                <p>
                  <strong className="text-wedding-text">From Los Angeles:</strong> Take I-10 East 
                  toward Palm Springs. Exit at Highway 62 (Twentynine Palms Highway) and head north. 
                  The venue will be on your right after approximately 25 miles.
                </p>
                <p>
                  <strong className="text-wedding-text">From Palm Springs:</strong> Head north on 
                  Indian Canyon Drive, which becomes Highway 62. Continue for about 30 miles until 
                  you reach the venue.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-wedding-cream">
                <p className="font-sans-wedding text-xs text-wedding-text-light text-center">
                  💡 Pro tip: Download offline maps before you go—cell service can be spotty in the desert!
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default TravelSection;
