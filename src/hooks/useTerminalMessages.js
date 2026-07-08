import { useEffect, useState } from "react";
import { TERMINAL_MESSAGES } from "@/data/portfolio";

export function useTerminalMessages() {
  const [terminalMsg, setTerminalMsg] = useState(TERMINAL_MESSAGES[1]);

  useEffect(() => {
    let current = 1;
    const interval = setInterval(() => {
      current = (current + 1) % TERMINAL_MESSAGES.length;
      setTerminalMsg(TERMINAL_MESSAGES[current]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return terminalMsg;
}
