import { createFileRoute } from "@tanstack/react-router";
import { BotDemo } from "@/components/demo/bot-demo";

export const Route = createFileRoute("/demo/konkurs-bot")({
  component: BotDemo,
});
