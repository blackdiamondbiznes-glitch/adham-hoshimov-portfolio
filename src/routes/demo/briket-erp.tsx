import { createFileRoute } from "@tanstack/react-router";
import { ErpDemo } from "@/components/demo/erp-demo";

export const Route = createFileRoute("/demo/briket-erp")({
  component: ErpDemo,
});
