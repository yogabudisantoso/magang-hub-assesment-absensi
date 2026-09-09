import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, X } from 'lucide-react';
import type { LogbookReport, PageProps } from '@/types';

interface LogbookCreateProps extends PageProps {
  todayReport: LogbookReport | null;
}

export default function LogbookCreate({ todayReport }: LogbookCreateProps) {
  const { errors } = usePage().props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (errors.message) {
      setErrorMsg(errors.message);
    }
  }, [errors]);

  useEffect(() => {
    const newPreviews = photos.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      setErrorMsg('Maximum 5 photos allowed.');
      return;
    }
    setPhotos((prev) => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (description.length < 10) {
      setErrorMsg('Description must be at least 10 characters.');
      return;
    }

    if (photos.length === 0) {
      setErrorMsg('At least 1 photo is required.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('description', description);
    photos.forEach((photo, index) => {
      formData.append(`photos[${index}]`, photo);
    });

    router.post('/intern/logbook', formData, {
      onFinish: () => {
        setLoading(false);
      },
    });
  };

  if (todayReport) {
    return (
      <>
        <Head title="Logbook" />
        <div className="flex h-full flex-1 flex-col items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardContent className="py-8 text-center">
              <p className="text-lg font-semibold">Logbook already submitted today</p>
              <p className="text-sm text-muted-foreground mt-2">
                You can submit another entry tomorrow.
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="Submit Logbook" />
      <div className="flex h-full flex-1 flex-col items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-center">Daily Logbook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                What did you work on today? (min. 10 characters)
              </label>
              <Textarea
                placeholder="Describe your tasks, progress, and accomplishments..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {description.length} / 2000 characters
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Photo Evidence (1-5 photos required)
              </label>
              <div className="flex flex-wrap gap-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-24 rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-24 w-24 rounded-md border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary"
                  >
                    <Upload className="h-6 w-6" />
                    <span className="text-xs mt-1">Upload</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                {photos.length} / 5 photos selected
              </p>
            </div>

            {errorMsg && (
              <p className="text-sm text-destructive">{errorMsg}</p>
            )}

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={loading || description.length < 10 || photos.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Logbook'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

LogbookCreate.layout = {
  breadcrumbs: [
    { title: 'Logbook', href: '/intern/logbook' },
    { title: 'Create', href: '/intern/logbook/create' },
  ],
};
