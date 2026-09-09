import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

export default function LeaveRequest() {
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!formData.start_date || !formData.end_date || !formData.reason) {
      setError('All fields are required.');
      return;
    }

    if (formData.reason.length < 10) {
      setError('Reason must be at least 10 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    router.post('/intern/leave', formData, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => {
          router.visit('/intern/leave');
        }, 2000);
      },
      onError: (errors) => {
        setError(errors.message || 'Failed to submit request. Please try again.');
      },
      onFinish: () => {
        setLoading(false);
      },
    });
  };

  return (
    <>
      <Head title="Request Leave" />
      <div className="flex h-full flex-1 flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Request Leave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {success ? (
              <div className="text-center text-green-600">
                <p className="text-lg font-semibold">Leave request submitted!</p>
                <p className="text-sm">Redirecting to leave list...</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason (min. 10 characters)</label>
                  <Textarea
                    placeholder="Explain why you need leave..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={3}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

LeaveRequest.layout = {
  breadcrumbs: [
    {
      title: 'Request Leave',
      href: '/intern/leave/create',
    },
  ],
};
