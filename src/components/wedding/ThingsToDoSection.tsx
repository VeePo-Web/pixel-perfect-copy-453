import ScrollReveal from "./ScrollReveal";
import { Mountain, Camera, Coffee, Star } from "lucide-react";

const activities = [
  {
    icon: Mountain,
    title: "Joshua Tree National Park",
    description: "Rock formations, Joshua trees, and wide open space. The Cholla Cactus Garden is especially nice near sunset.",
    tip: "Entry fee: $30/vehicle",
  },
  {
    icon: Camera,
    title: "Pioneertown",
    description: "An old movie set turned small-town hangout. Pappy & Harriet's has good food and live music most nights.",
    tip: "20 min from venue",
  },
  {
    icon: Coffee,
    title: "Joshua Tree Village",
    description: "A handful of cafés, vintage shops, and galleries worth wandering through if you have the time.",
    tip: "15 min from venue",
  },
  {
    icon: Star,
    title: "Stargazing",
    description: "The desert sky is clear and quiet. If you're up late, step outside—it's worth it.",
    tip: "Best after 10 PM",
  },
];

const ThingsToDoSection = () => {
  return (
    <section className="bg-wedding-sage py-20 md:py-32">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <p className="font-sans-wedding text-sm tracking-widest uppercase text-white/80 text-center mb-4">
            Explore the Area
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-serif-wedding text-4xl md:text-5xl text-white text-center mb-4">
            Things to Do
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="font-sans-wedding text-white/80 text-center max-w-2xl mx-auto mb-16">
            If you'd like to explore while you're here, these are a few of our favorite spots. 
            No itinerary required—just go where the day takes you.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {activities.map((activity, index) => (
            <ScrollReveal key={activity.title} delay={0.1 * index}>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg h-full">
                <activity.icon className="text-white mb-4" size={32} />
                <h3 className="font-serif-wedding text-xl text-white mb-3">
                  {activity.title}
                </h3>
                <p className="font-sans-wedding text-sm text-white/80 mb-4">
                  {activity.description}
                </p>
                <p className="font-sans-wedding text-xs text-white/60 italic">
                  {activity.tip}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThingsToDoSection;
