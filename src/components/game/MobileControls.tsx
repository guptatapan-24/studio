
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
    <div className="lg:hidden absolute bottom-4 w-full px-4 z-10 select-none">
      <div className="flex justify-between items-end">
        {/* Aim Controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-16 w-16 rounded-full bg-background/50 backdrop-blur-sm touch-action-none"
            onPointerDown={(e) => { e.preventDefault(); onAimLeft(); }}
            onContextMenu={(e) => e.preventDefault()}
            aria-label="Aim Left"
          >
            <ArrowLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-16 w-16 rounded-full bg-background/50 backdrop-blur-sm touch-action-none"
            onPointerDown={(e) => { e.preventDefault(); onAimRight(); }}
            onContextMenu={(e) => e.preventDefault()}
            aria-label="Aim Right"
          >
            <ArrowRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Power Button */}
        <Button
          size="icon"
          className="h-24 w-24 rounded-full text-primary-foreground text-lg font-bold shadow-lg touch-action-none"
          onPointerDown={(e) => { e.preventDefault(); onPowerChargeStart(); }}
          onPointerUp={(e) => { e.preventDefault(); onPowerChargeRelease(); }}
          onPointerLeave={(e) => { e.preventDefault(); onPowerChargeRelease(); }}
          onContextMenu={(e) => e.preventDefault()}
          style={{ WebkitTapHighlightColor: 'transparent' }}
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
