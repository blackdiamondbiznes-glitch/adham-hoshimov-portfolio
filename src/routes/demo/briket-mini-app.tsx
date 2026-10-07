import { createFileRoute } from "@tanstack/react-router";
import { MiniDemo } from "@/components/demo/mini-demo";

export const Route = createFileRoute("/demo/briket-mini-app")({
  component: MiniDemo,
});
