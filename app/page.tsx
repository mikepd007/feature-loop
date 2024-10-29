import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Monitor, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Create Stunning Product Demos
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Record professional product walkthroughs that convert. Perfect for
            startup founders and product teams.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/record">
              <Button size="lg" className="rounded-full">
                Start Recording <Play className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/editor">
              <Button size="lg" variant="outline" className="rounded-full">
                Video Editor <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Monitor className="h-12 w-12 mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">Screen Recording</h3>
            <p className="text-muted-foreground">
              Capture your product in action with crystal-clear screen recording
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Camera className="h-12 w-12 mb-4 text-green-500" />
            <h3 className="text-xl font-semibold mb-2">Camera Overlay</h3>
            <p className="text-muted-foreground">
              Add a personal touch with picture-in-picture camera recording
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Sparkles className="h-12 w-12 mb-4 text-purple-500" />
            <h3 className="text-xl font-semibold mb-2">Instant Polish</h3>
            <p className="text-muted-foreground">
              Auto-enhance your videos with professional editing features
            </p>
          </Card>
        </div>

        {/* Social Proof */}
        <div className="text-center bg-card rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Trusted by Innovative Startups
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-70">
            <div className="text-xl font-semibold">TechCo</div>
            <div className="text-xl font-semibold">StartupX</div>
            <div className="text-xl font-semibold">LaunchPad</div>
            <div className="text-xl font-semibold">FutureScale</div>
          </div>
        </div>
      </div>
    </div>
  );
}