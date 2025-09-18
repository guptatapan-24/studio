"use client";

import { createClient } from "@/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GolfFlagIcon } from "@/components/icons/GolfFlagIcon";

export default function LoginPage() {
  const supabase = createClient();

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
            <GolfFlagIcon className="h-10 w-10 mb-4" />
            <h1 className="text-2xl font-bold">Welcome to Web Golf</h1>
            <p className="text-muted-foreground">Sign in to continue</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
              theme="dark"
              redirectTo={`${process.env.NEXT_PUBLIC_BASE_URL}/levels`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
