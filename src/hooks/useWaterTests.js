import { useState } from "react";
import { DEMO_HISTORY } from "../data/parameters";

export function useWaterTests() {
  const [values, setValues] = useState({});
  const [history, setHistory] = useState(DEMO_HISTORY);
  const [saved, setSaved] = useState(false);

  function handleChange(id, val) {
    setValues((v) => ({ ...v, [id]: val }));
    setSaved(false);
  }

  function handleSave(today) {
    const entry = {
      date: today,
      ...Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, parseFloat(v) || null])
      ),
    };
    setHistory((h) => [...h, entry]);
    setSaved(true);
  }

  const hasValues = Object.values(values).some((v) => v !== "" && v !== undefined);

  return { values, history, saved, hasValues, handleChange, handleSave };
}