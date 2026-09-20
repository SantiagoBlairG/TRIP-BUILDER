import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="py-20 text-center">
      <p className="text-sm text-muted-foreground">A small detour · 404</p>
      <h1 className="mt-4 font-display text-5xl">This path ends here.</h1>
      <p className="my-6 text-muted-foreground">
        We couldn’t find that page. Your next adventure starts at home.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </section>
  );
}
