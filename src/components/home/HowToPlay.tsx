
"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mouse, Smartphone, Hand, Keyboard } from "lucide-react";

export function HowToPlay() {
  const isMobile = useIsMobile();

  return (
    <section id="how-to-play" className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">How to Play</h2>
      <p className="text-center text-muted-foreground mb-8">
        Master the controls to conquer the course.
      </p>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {isMobile ? <Smartphone /> : <Keyboard />}
              {isMobile ? "For Phones & Tablets" : "For PC & Laptop"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isMobile ? (
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>
                  <strong>Aim:</strong> Use the on-screen Left/Right arrow buttons to set direction.
                </li>
                <li>
                  <strong>Power:</strong> Press and hold the on-screen 'Power' button to charge your shot, then release to shoot.
                </li>
                <li>
                  <strong>Camera:</strong> Use standard touch gestures (one-finger drag to orbit, two-finger pinch to zoom) to look around the course.
                </li>
              </ul>
            ) : (
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>
                  <strong>Aim:</strong> Use the <strong>Left and Right arrow keys</strong> on your keyboard to set your direction.
                </li>
                <li>
                  <strong>Power:</strong> Press and hold the <strong>Spacebar</strong> to charge your shot, then release to shoot.
                </li>
                <li>
                  <strong>Camera:</strong> Use your <strong>mouse</strong> to control the camera. Left-click and drag to orbit, right-click and drag to pan, and use the scroll wheel to zoom.
                </li>
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <Hand />
                Gameplay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Get the ball in the hole in as few strokes as possible.</li>
              <li>Beat all 10 levels to become a minigolf champion!</li>
              <li>
                Use the AI Designer to create and play your own custom courses.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
