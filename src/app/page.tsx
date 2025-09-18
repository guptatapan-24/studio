
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bot, Camera, Layers, Mouse, Target, Keyboard } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { HowToPlay } from '@/components/home/HowToPlay';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-golf-course');

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />

      <main className="flex-1">
        <section
          className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white bg-cover bg-center"
          style={{
            backgroundImage: heroImage ? `url(${heroImage.imageUrl})` : 'none',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="relative z-10 p-4 max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
                Web Golf
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/90 [text-shadow:1px_1px_2px_rgba(0,0,0,0.5)]">
                An interactive 3D minigolf experience, ported from a C-based classic to the modern web with Next.js and Three.js.
              </p>
              <div className="mt-8 flex justify-center">
                <Button asChild size="lg">
                  <Link href="/levels">
                    Play Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
          </div>
        </section>

        <div className="container py-12 md:py-20 space-y-16">
          <HowToPlay />

          <section id="requirements">
            <h2 className="text-3xl font-bold text-center mb-2">
              Project Features
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              An exercise in 3D web graphics, rendering, and interaction.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Scene & Asset Rendering', description: 'Initialize a Three.js scene, load a 3D model for the course, and render a golf ball.', icon: <Layers/> },
                { title: 'Basic Physics & Interaction', description: 'Implement user input to apply velocity to the ball, with simplified friction.', icon: <Mouse/> },
                { title: 'Gameplay & State Management', description: 'Manage game state like hole, par, and strokes. Implement goal detection.', icon: <Target/> },
                { title: 'Player Controls', description: 'Intuitive controls for aiming precision and power, with clear visual feedback.', icon: <Keyboard/> },
                { title: 'Camera System', description: 'Interactive camera controls (orbit, pan, zoom) to inspect the course.', icon: <Camera/> },
                { title: 'AI Design Tool', description: 'A tool for programmatically editing course design, tuned using generative AI.', icon: <Bot/> },
              ].map((item) => (
                <Card key={item.title} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {item.icon}
                      </div>
                      <span>{item.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <footer className="border-t bg-gray-50 dark:bg-gray-900/50">
          <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <p className="text-center text-sm leading-loose md:text-left text-muted-foreground">
                Built for CloneFest 2025. An exercise in web-based 3D.
              </p>
            </div>
            <Button variant="outline" asChild>
                <Link
                href="/design"
                >
                Try the AI Course Designer
                </Link>
            </Button>
          </div>
        </footer>
      </main>
    </div>
  );
}
