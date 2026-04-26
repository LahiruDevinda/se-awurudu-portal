'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getUserMoment, uploadMoment } from '@/app/actions/moments';
import { getSystemSettings } from '@/app/actions/settings';
import Link from 'next/link';

export default function MomentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [currentMoment, setCurrentMoment] = useState<any>(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function init() {
      const [settings, moment] = await Promise.all([
        getSystemSettings(),
        getUserMoment()
      ]);
      setIsActive(settings.media_active);
      if (moment) {
        setCurrentMoment(moment);
      }
      setLoading(false);
    }
    init();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setFile(selected);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActive || !file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadMoment(formData);
    setUploading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Your moment has been uploaded successfully!');
      setCurrentMoment({
        file_url: result.url,
        file_type: result.type
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-8 bg-muted/30">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8 mt-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">Moments Gallery</h1>
          <p className="text-muted-foreground text-sm md:text-base">Share your favorite Awurudu moment! Upload one photo or video.</p>
        </div>

        {!isActive && (
          <div className="mb-6 bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-xl font-bold text-center">
            Media uploads are currently closed.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-primary/20 shadow-xl h-fit rounded-2xl overflow-hidden">
            <form onSubmit={handleUpload}>
              <CardHeader>
                <CardTitle>{currentMoment ? 'Update Your Moment' : 'Upload a Moment'}</CardTitle>
                <CardDescription>Max size: 10MB (Images or Videos only)</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  disabled={!isActive || uploading}
                  className="cursor-pointer h-12 pt-2 rounded-xl"
                />
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full h-14 text-md font-bold rounded-xl" 
                  disabled={!isActive || uploading || !file}
                  type="submit"
                >
                  {uploading ? 'Uploading...' : currentMoment ? 'Replace Current Moment' : 'Upload Now'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="border-primary/20 shadow-xl h-fit overflow-hidden rounded-2xl">
            <CardHeader className="bg-secondary/10 border-b border-secondary/20 pb-4">
              <CardTitle className="text-center text-lg">Your Live Moment</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!currentMoment ? (
                <div className="aspect-square flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/20">
                  You haven&apos;t uploaded any moments yet.
                </div>
              ) : (
                <div className="aspect-square relative flex items-center justify-center bg-black/5">
                  {currentMoment.file_type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={currentMoment.file_url} alt="Your Awurudu Moment" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <video src={currentMoment.file_url} controls className="max-w-full max-h-full" />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
