import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type WelcomeProps = {
  title?: ReactNode;
  children?: ReactNode;
};

export const Welcome = ({
  title = "Your CRM Starter Kit",
  children,
}: WelcomeProps) => (
  <Card>
    <CardHeader className="px-4">
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="px-4">
      {children ?? (
        <>
          <p className="text-sm mb-4">
            <a
              href="https://www.uptext.com"
              className="underline hover:no-underline"
            >
              UpTextCrm
            </a>{" "}
            is a template designed to help you quickly build your own CRM.
          </p>
          <p className="text-sm mb-4">
            This demo runs on a mock API, so you can explore and modify the
            data. It resets on reload. The full version uses Supabase for the
            backend.
          </p>
          <p className="text-sm">
            Powered by{" "}
            <a
              href="https://marmelab.com/shadcn-admin-kit"
              className="underline hover:no-underline"
            >
              shadcn-admin-kit
            </a>
            , UpTextCrm is fully open-source. You can find the code at{" "}
            <a
              href="https://github.com/uptext/UpTextCrm"
              className="underline hover:no-underline"
            >
              uptext/UpTextCrm
            </a>
            .
          </p>
        </>
      )}
    </CardContent>
  </Card>
);
