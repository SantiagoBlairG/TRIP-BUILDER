import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TripNotFound() {
  return (
    <section className="py-16 text-center">
      <p className="text-sm text-muted-foreground">Trip not found</p>
      <h1 className="mt-4 font-display text-5xl">
        This adventure isn’t in your library.
      </h1>
      <p className="my-6 text-sm text-muted-foreground">
        The link may be incomplete, or this trip may no longer be available.
      </p>
      <Button asChild>
        <Link href="/">Back to my trips</Link>
      </Button>
    </section>
  );
}
