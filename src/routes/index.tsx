import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendae } from "@/components/calendae";
import { TestScreen } from "@/components/test-screen";
import { SHOW_TEST_SCREEN } from "@/lib/test-screen";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [tests, setTests] = useState(SHOW_TEST_SCREEN);
  if (tests) return <TestScreen onContinue={() => setTests(false)} />;
  return <Calendae />;
}
