import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

export default function CheckOut() {
  const { errors } = usePage().props;
  const [taskSummary, setTaskSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (errors.message) {
      setErrorMsg(errors.message);
    }
  }, [errors]);

  const handleCheckOut = () => {
    if (taskSummary.length < 10) {
      setErrorMsg('Task summary must be at least 10 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    router.post('/intern/attendance/check-out', {
      task_summary: taskSummary,
    }, {
      onFinish: () => {
        setLoading(false);
      },
    });
  };

  return (
    <>
      <Head title="Check Out" />
      <div className="flex h-full flex-1 flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Check Out</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                What did you work on today? (min. 10 characters)
              </label>
              <Textarea
                placeholder="Describe your tasks and accomplishments for today..."
                value={taskSummary}
                onChange={(e) => setTaskSummary(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {taskSummary.length} / 1000 characters
              </p>
            </div>

            {errorMsg && (
              <p className="text-sm text-destructive">{errorMsg}</p>
            )}

            <Button
              className="w-full"
              onClick={handleCheckOut}
              disabled={loading || taskSummary.length < 10}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking out...
                </>
              ) : (
                'Check Out Now'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

CheckOut.layout = {
  breadcrumbs: [
    {
      title: 'Check Out',
      href: '/intern/attendance/check-out',
    },
  ],
};
