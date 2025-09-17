import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { GolfBallIcon } from '@/components/icons/GolfBallIcon';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-golf-course');

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <GolfBallIcon className="h-6 w-6" />
              <span className="font-bold sm:inline-block">Web Golf</span>
            </Link>
          </div>
           <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
             <Link
                href="/levels"
                className="text-foreground/60 transition-colors hover:text-foreground/80"
              >
                Levels
              </Link>
             <Link
                href="/design"
                className="text-foreground/60 transition-colors hover:text-foreground/80"
              >
                Design
              </Link>
            </nav>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button asChild>
              <Link href="/levels">Play Now</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-primary-foreground">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 p-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              CloneFest 2025
            </h1>
            <p className="mt-4 text-lg md:text-xl text-primary-foreground/90">
              Reimagining a C-based Minigolf Classic. Porting an interactive 3D
              minigolf hole to the web using Three.js.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/levels">
                  Click to Play <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="container py-12 md:py-20 space-y-16">
          <section id="how-to-play" className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center">How to Play</h2>
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>
                      <strong>Aim:</strong> Use Left/Right arrow keys to set direction.
                    </li>
                    <li>
                      <strong>Power:</strong> Hold and release the Spacebar to shoot.
                    </li>
                    <li>
                      <strong>Camera:</strong> Use mouse or touch gestures to
                      orbit, pan, and zoom.
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Gameplay</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>
                      Get the ball in the hole in as few strokes as possible.
                    </li>
                    <li>
                      Complete a level to unlock the next one.
                    </li>
                    <li>
                      Complete all 10 levels to win!
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="background">
            <h2 className="text-3xl font-bold text-center">Background</h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-muted-foreground">
              This project is an introductory exercise in 3D web graphics,
              inspired by the open-source game Open Golf. The objective is to
              familiarize participants with the fundamentals of rendering and
              interacting with a 3D scene in a web browser.
            </p>
          </section>

          <section id="objective">
            <h2 className="text-3xl font-bold text-center">Core Objective</h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-muted-foreground">
              The primary goal is to render a static 3D golf hole using the
              Three.js library. The scene must contain a golf ball that a user
              can interact with, demonstrating a complete, albeit simple,
              feedback loop from user input to 3D visualization.
            </p>
          </section>

          <section id="requirements">
            <h2 className="text-3xl font-bold text-center">
              Project Requirements
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Scene & Asset Rendering', description: 'Initialize a Three.js scene, load a 3D model for the course, and render a golf ball.' },
                { title: 'Basic Physics & Interaction', description: 'Implement user input to apply velocity to the ball, with simplified friction.' },
                { title: 'Gameplay & State Management', description: 'Manage game state like hole, par, and strokes. Implement goal detection.' },
                { title: 'Player Controls', description: 'Intuitive controls for aiming precision and power, with clear visual feedback.' },
                { title: 'Camera System', description: 'Interactive camera controls (orbit, pan, zoom) to inspect the course.' },
                { title: 'AI Design Tool', description: 'A tool for programmatically editing course design, tuned using generative AI.' },
              ].map((item) => (
                <Card key={item.title}>
                  <CardHeader>
                    <CardTitle className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <span>{item.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <footer className="border-t">
          <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <GolfBallIcon className="h-6 w-6" />
              <p className="text-center text-sm leading-loose md:text-left">
                Built for CloneFest 2025. An exercise in web-based 3D.
              </p>
            </div>
            <Link
              href="/design"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Try the AI Course Designer
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
