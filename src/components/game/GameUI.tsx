import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

type GameUIProps = {
  level: number;
  par: number;
  strokes: number;
  power: number; // 0 to 100
  onReset: () => void;
};

export function GameUI({ level, par, strokes, power, onReset }: GameUIProps) {
  return (
    <>
      <div className="absolute top-4 left-4 z-10 text-foreground">
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm text-muted-foreground">Hole</p>
                <p className="text-2xl font-bold">{level}</p>
              </div>
              <div className="h-10 border-l border-border"></div>
              <div>
                <p className="text-sm text-muted-foreground">Par</p>
                <p className="text-2xl font-bold">{par}</p>
              </div>
              <div className="h-10 border-l border-border"></div>
              <div>
                <p className="text-sm text-muted-foreground">Strokes</p>
                <p className="text-2xl font-bold">{strokes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <Button variant="secondary" size="icon" onClick={onReset} aria-label="Reset Level" tabIndex={-1}>
            <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-64">
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardContent className="p-3">
             <label htmlFor="power" className="text-sm font-medium mb-2 block text-center">Power</label>
             <Progress id="power" value={power} className="w-full" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}