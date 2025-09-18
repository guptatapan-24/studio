
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { MainNav } from '@/components/layout/MainNav';
import { GolfFlagIcon } from '../icons/GolfFlagIcon';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  }

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="mr-2 flex items-center space-x-2">
            <GolfFlagIcon className="h-6 w-6" />
            <span className="font-bold sm:inline-block">Web Golf</span>
          </Link>
          <div className="hidden md:flex">
            <MainNav />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {user && userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-9 w-9">
                     <AvatarFallback>{getInitials(userProfile.displayName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userProfile.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="mt-8 flex flex-col gap-6">
                <Link href="/" className="flex items-center space-x-2">
                    <GolfFlagIcon className="h-6 w-6" />
                    <span className="font-bold">Web Golf</span>
                </Link>
                <MainNav isMobile={true} />
                 <div className="flex flex-col gap-4 pt-4 border-t">
                    {user ? (
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2">
                             <Avatar>
                               <AvatarFallback>{getInitials(userProfile?.displayName)}</AvatarFallback>
                             </Avatar>
                             <div>
                                <p className="text-sm font-medium">{userProfile?.displayName}</p>
                                <p className="text-xs text-muted-foreground">{userProfile?.email}</p>
                             </div>
                          </div>
                          <Button variant="ghost" onClick={handleSignOut} className="justify-start">
                              <LogOut className="mr-2" />
                              Logout
                          </Button>
                        </div>
                    ) : (
                        <>
                            <Button asChild variant="ghost" className="justify-start text-lg">
                                <Link href="/login">Login</Link>
                            </Button>
                             <Button asChild className="justify-center text-lg">
                                <Link href="/register">Register</Link>
                            </Button>
                        </>
                    )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
