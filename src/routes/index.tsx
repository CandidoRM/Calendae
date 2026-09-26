import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendae } from "@/components/calendae";
import { TestScreen } from "@/components/test-screen";
import { SHOW_TEST_SCREEN } from "@/lib/test-screen";

export const Route = createFileRoute("/")({ component: Home });

const TEST_ROUND = 6;

function Home() {
  const [seen, setSeen] = useState(0);
  if (SHOW_TEST_SCREEN && seen < TEST_ROUND) {
    return <TestScreen onContinue={() => setSeen(TEST_ROUND)} />;
  }
  return <Calendae />;
}
