import { MapPin, Calendar, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import AppHeader from "./AppHeader";
import { Screen, Tournament } from "../types";

type TournamentLocationScreenProps = {
  tournament: Tournament | null;
  onNavigate: (screen: Screen, data?: any) => void;
};

export default function TournamentLocationScreen({
  tournament,
  onNavigate,
}: TournamentLocationScreenProps) {
  if (!tournament) return null;

  const handleOpenInMaps = () => {
    const { lat, lng } = tournament.locationDetails.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Location"
        showBackButton
        onBack={() => onNavigate("tournamentDetails", { tournament })}
      />

      <div className="px-6 py-6">
        {/* Location Info Card */}
        <Card className="p-6 mb-6">
          <h3 className="mb-4">{tournament.locationDetails.name}</h3>

          <div className="space-y-4">
            <div className="flex gap-3">
              <MapPin size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-sm">{tournament.locationDetails.address}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Calendar size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Start Date & Time</p>
                <p className="text-sm">
                  {tournament.startDate} at 09:00 AM
                </p>
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-6 rounded-xl"
            onClick={handleOpenInMaps}
          >
            <ExternalLink size={18} className="mr-2" />
            Open in Google Maps
          </Button>
        </Card>

        {/* Real Map View */}
        <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
          <div className="aspect-square bg-secondary relative">
            <iframe
              title="Tournament Location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={`https://maps.google.com/maps?q=${tournament.locationDetails.coordinates.lat},${tournament.locationDetails.coordinates.lng}&z=14&output=embed`}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[20%] contrast-[1.1] brightness-[1.1]"
            ></iframe>
          </div>
        </Card>

        {/* Directions Hint */}
        <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
          <p className="text-sm text-center text-muted-foreground">
            Click "Open in Google Maps" to get directions from your location
          </p>
        </div>
      </div>
    </div>
  );
}
