"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight, Space, Mouse, Smartphone, Hand } from "lucide-react";

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
              {isMobile ? <Smartphone /> : <Mouse />}
              Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isMobile ? (
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>
                  <strong>Aim:</strong> Use the Left/Right arrow buttons to set
                  direction.
                </li>
                <li>
                  <strong>Power:</strong> Hold and release the 'Power' button to shoot.
                </li>
                <li>
                  <strong>Camera:</strong> Use touch gestures (pinch, drag) to
                  orbit, pan, and zoom.
                </li>
              </ul>
            ) : (
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>
                  <strong>Aim:</strong> Use Left/Right arrow keys to set
                  direction.
                </li>
                <li>
                  <strong>Power:</strong> Hold and release the Spacebar to shoot.
                </li>
                <li>
                  <strong>Camera:</strong> Use mouse to orbit, pan, and zoom.
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
