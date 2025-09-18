
"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";

type MobileControlsProps = {
  onAimLeft: () => void;
  onAimRight: () => void;
  onPowerChargeStart: () => void;
  onPowerChargeRelease: () => void;
};

export function MobileControls({
  onAimLeft,
  onAimRight,
  onPowerChargeStart,
  onPowerChargeRelease,
}: MobileControlsProps) {
  return (
    <div className="md:hidden absolute bottom-4 w-full px-4 z-10">
      <div className="w-full max-w-sm mx-auto flex justify-between items-center">
        {/* Aim Controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-16 w-16 rounded-full bg-background/50 backdrop-blur-sm"
            onPointerDown={onAimLeft}
            aria-label="Aim Left"
          >
            <ArrowLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-16 w-16 rounded-full bg-background/50 backdrop-blur-sm"
            onPointerDown={onAimRight}
            aria-label="Aim Right"
          >
            <ArrowRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Power Button */}
        <Button
          size="icon"
          className="h-24 w-24 rounded-full text-primary-foreground text-lg font-bold shadow-lg"
          onPointerDown={onPowerChargeStart}
          onPointerUp={onPowerChargeRelease}
          onPointerLeave={onPowerChargeRelease} // Release if finger slides off
          aria-label="Hold to charge power, release to shoot"
        >
          <div className="flex flex-col items-center">
            <Zap className="h-8 w-8" />
            <span>Power</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
