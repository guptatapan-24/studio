
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from '@/lib/supabase/client';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { GolfFlagIcon } from '@/components/icons/GolfFlagIcon';

async function handlePasswordReset(email: string): Promise<{ error: any }> {
    'use server';
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `http://localhost:9002/auth/callback?next=/`,
    });
    return { error };
}


export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        const { error } = await handlePasswordReset(email);
        setIsLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setIsSubmitted(true);
        }
    };
  
  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 p-4">
        <div className="w-full max-w-sm">
            <Link href="/" className="flex flex-col items-center mb-6">
                <GolfFlagIcon className="h-10 w-10 mb-4" />
            </Link>

            {isSubmitted ? (
                 <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary mb-4">
                            <Mail className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <CardTitle>Check your email</CardTitle>
                        <CardDescription>
                            We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild variant="outline">
                            <Link href="/login">
                                Back to Login
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>
                        Enter your email address and we&apos;ll send you a link to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center text-sm">
                        <Link href="/login"
                            className="font-medium text-primary hover:underline"
                            prefetch={false}
                        >
                            Remember your password? Login
                        </Link>
                    </CardFooter>
                </Card>
            )}
        </div>
    </div>
  );
}
