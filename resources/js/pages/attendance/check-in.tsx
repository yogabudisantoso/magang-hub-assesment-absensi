import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';

export default function CheckIn() {
  const { errors } = usePage().props;
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setErrorMsg('Unable to get your location. Please enable GPS.');
        }
      );
    }
  }, []);

  useEffect(() => {
    if (errors.message) {
      setErrorMsg(errors.message);
    }
  }, [errors]);

  const handleCheckIn = () => {
    if (!location) {
      setErrorMsg('Location is required for check-in.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    router.post('/intern/attendance/check-in', {
      latitude: location.lat,
      longitude: location.lng,
    }, {
      onFinish: () => {
        setLoading(false);
      },
    });
  };

  return (
    <>
      <Head title="Check In" />
      <div className="flex h-full flex-1 flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Check In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>
                {location
                  ? `Location: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                  : 'Getting location...'}
              </span>
            </div>

            {errorMsg && (
              <p className="text-center text-sm text-destructive">{errorMsg}</p>
            )}

            <Button
              className="w-full"
              onClick={handleCheckIn}
              disabled={loading || !location}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking in...
                </>
              ) : (
                'Check In Now'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

CheckIn.layout = {
  breadcrumbs: [
    {
      title: 'Check In',
      href: '/intern/attendance/check-in',
    },
  ],
};
