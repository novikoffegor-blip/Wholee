import Link from "next/link";

import { Button } from "@/components/ui/button";

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <main className="container min-h-[62vh] py-24">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Раздел в разработке</p>
        <h1 className="mt-5 text-4xl font-medium tracking-normal md:text-5xl">{title}</h1>
        <p className="mt-6 text-lg leading-8 text-muted">{description}</p>
        <Button asChild className="mt-10">
          <Link href="/">На главную</Link>
        </Button>
      </div>
    </main>
  );
}
