import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScrollReveal from "./ScrollReveal";
import { Clock, MapPin } from "lucide-react";

const itinerary = {
  feb14: {
    title: "Arrival",
    events: [
      { time: "3:00 PM", event: "Check-In", venue: "Various Hotels", description: "Settle in and take your time—the desert will be waiting.", icon: "🏨" },
      { time: "6:00 PM", event: "Welcome Dinner", venue: "Desert Rose Restaurant", description: "A relaxed evening to reconnect over good food and conversation. Come as you are.", icon: "🍽️" },
      { time: "8:00 PM", event: "Stargazing", venue: "Resort Terrace", description: "If you're up for it, the night sky out here is something special.", icon: "⭐" },
    ],
  },
  feb15: {
    title: "The Day",
    events: [
      { time: "12:00 PM", event: "Bridal Brunch", venue: "The Garden Room", description: "For bridesmaids and close family—a quiet moment before the day begins.", icon: "🥂" },
      { time: "4:00 PM", event: "Ceremony", venue: "Joshua Tree Gardens", description: "We'll gather outdoors. Please arrive a bit early so we can start together.", icon: "💒" },
      { time: "5:00 PM", event: "Cocktails", venue: "Sunset Terrace", description: "Drinks and light bites as the sun sets over the desert.", icon: "🍸" },
      { time: "6:30 PM", event: "Dinner & Dancing", venue: "Grand Ballroom", description: "An evening of celebration—toasts, food, and time on the dance floor.", icon: "🎉" },
      { time: "11:00 PM", event: "Late Night", venue: "Resort Lounge", description: "For those who want to keep the night going a little longer.", icon: "🎶" },
    ],
  },
  feb16: {
    title: "Farewell",
    events: [
      { time: "10:00 AM", event: "Morning Brunch", venue: "Anna Blue Café", description: "A casual goodbye over coffee and breakfast. No rush.", icon: "☕" },
      { time: "12:00 PM", event: "Checkout", venue: "Various Hotels", description: "Safe travels, and thank you for being here.", icon: "👋" },
      { time: "2:00 PM", event: "Optional Hike", venue: "National Park", description: "For anyone staying a bit longer—explore the park at your own pace.", icon: "🥾" },
    ],
  },
};

const ItinerarySection = () => {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <ScrollReveal>
          <p className="font-sans-wedding text-sm tracking-widest uppercase text-wedding-text-light text-center mb-4">
            The Weekend
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-serif-wedding text-4xl md:text-5xl text-wedding-text text-center mb-4">
            A Few Days Together
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="font-sans-wedding text-wedding-text-light text-center max-w-2xl mx-auto mb-16">
            No rush, no pressure—just time to settle in, enjoy the desert, and be together.
          </p>
        </ScrollReveal>

        {/* Tabs */}
        <Tabs defaultValue="feb15" className="w-full max-w-3xl mx-auto">
          <ScrollReveal delay={0.3}>
            <TabsList className="flex w-full max-w-lg mx-auto bg-transparent border-b border-wedding-sage/30 mb-12 p-0 h-auto rounded-none">
              <TabsTrigger
                value="feb14"
                className="flex-1 font-sans-wedding text-sm md:text-base py-4 px-2 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-wedding-teal data-[state=active]:bg-transparent bg-transparent text-wedding-text-light data-[state=active]:text-wedding-teal data-[state=active]:shadow-none transition-all"
              >
                <span className="hidden md:inline">February 14</span>
                <span className="md:hidden">Feb 14</span>
              </TabsTrigger>
              <TabsTrigger
                value="feb15"
                className="flex-1 font-sans-wedding text-sm md:text-base py-4 px-2 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-wedding-teal data-[state=active]:bg-transparent bg-transparent text-wedding-text-light data-[state=active]:text-wedding-teal data-[state=active]:shadow-none transition-all"
              >
                <span className="hidden md:inline">February 15 ✨</span>
                <span className="md:hidden">Feb 15 ✨</span>
              </TabsTrigger>
              <TabsTrigger
                value="feb16"
                className="flex-1 font-sans-wedding text-sm md:text-base py-4 px-2 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-wedding-teal data-[state=active]:bg-transparent bg-transparent text-wedding-text-light data-[state=active]:text-wedding-teal data-[state=active]:shadow-none transition-all"
              >
                <span className="hidden md:inline">February 16</span>
                <span className="md:hidden">Feb 16</span>
              </TabsTrigger>
            </TabsList>
          </ScrollReveal>

          {Object.entries(itinerary).map(([day, { title, events }]) => (
            <TabsContent key={day} value={day}>
              <div className="text-center mb-8">
                <h3 className="font-serif-wedding text-2xl text-wedding-sage">{title}</h3>
              </div>
              <div className="space-y-6">
                {events.map((event, index) => (
                  <ScrollReveal key={index} delay={0.1 * index}>
                    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 bg-wedding-cream/50 p-6 rounded-lg">
                      {/* Time */}
                      <div className="md:w-32 flex-shrink-0 flex items-center gap-2">
                        <Clock size={16} className="text-wedding-teal" />
                        <span className="font-sans-wedding text-wedding-teal font-semibold text-lg">
                          {event.time}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="hidden md:flex w-12 h-12 items-center justify-center text-2xl">
                        {event.icon}
                      </div>

                      {/* Event Details */}
                      <div className="flex-1">
                        <h3 className="font-serif-wedding text-xl text-wedding-text mb-1">
                          {event.event}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <MapPin size={14} className="text-wedding-sage" />
                          <p className="font-sans-wedding text-sm text-wedding-sage font-medium">
                            {event.venue}
                          </p>
                        </div>
                        <p className="font-sans-wedding text-wedding-text-light text-sm">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ItinerarySection;
