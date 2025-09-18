
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mouse, Smartphone, Hand, Keyboard } from "lucide-react";

export function HowToPlay() {

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
              <Keyboard />
              For PC & Laptop
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <strong>Aim:</strong> Use the <strong>Left and Right arrow keys</strong> to set your direction.
              </li>
              <li>
                <strong>Power:</strong> Press and hold the <strong>Spacebar</strong> to charge your shot, then release to shoot.
              </li>
              <li>
                <strong>Camera:</strong> Use your <strong>mouse</strong> to orbit (left-click), pan (right-click), and zoom (scroll).
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <Smartphone />
                For Phones & Tablets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>
                  <strong>Aim:</strong> Use the on-screen <strong>Left/Right arrow buttons</strong> to set direction.
                </li>
                <li>
                  <strong>Power:</strong> Press and hold the on-screen <strong>'Power' button</strong> to charge your shot, then release to shoot.
                </li>
                <li>
                  <strong>Camera:</strong> Use standard touch gestures (<strong>one-finger drag</strong> to orbit, <strong>two-finger pinch</strong> to zoom).
                </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
