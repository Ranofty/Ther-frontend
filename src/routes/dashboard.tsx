import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context }) => {
    // Dashboard is now merged into the profile page.
    // Redirect connected users to their profile; others go home.
    throw redirect({ to: "/" });
  },
  component: () => null,
});
