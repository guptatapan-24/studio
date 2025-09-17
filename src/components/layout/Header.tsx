import Link from 'next/link';
import { GolfBallIcon } from '@/components/icons/GolfBallIcon';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <GolfBallIcon className="h-6 w-6" />
            <span className="font-bold sm:inline-block">Web Golf</span>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
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
              Design Your Own Golf Course
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button asChild>
            <Link href="/levels">Play Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
