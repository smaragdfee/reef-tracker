import { useState, useEffect } from "react";

const STORAGE_KEY = "atolliq_aquariums";
const ACTIVE_KEY = "atolliq_active_aquarium";

export function useAquariums() {
  const [aquariums, setAquariums] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Beim Start aus localStorage laden
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedActive = localStorage.getItem(ACTIVE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAquariums(parsed);
      if (savedActive) {
        setActiveId(savedActive);
      } else if (parsed.length > 0) {
        setActiveId(parsed[0].id);
      }
    }
    setLoading(false);
  }, []);

  // Bei Änderung speichern
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(aquariums));
    }
  }, [aquariums, loading]);

  useEffect(() => {
    if (activeId) {
      localStorage.setItem(ACTIVE_KEY, activeId);
    }
  }, [activeId]);

  function addAquarium(data) {
    const newAquarium = {
      id: crypto.randomUUID(),
      name: data.name,
      volume: data.volume,
      width: data.width || null,
      height: data.height || null,
      depth: data.depth || null,
      type: data.type || "Riff",
      setupDate: data.setupDate || null,
      notes: data.notes || "",
      createdAt: new Date().toISOString(),
    };
    setAquariums((prev) => [...prev, newAquarium]);
    setActiveId(newAquarium.id);
    return newAquarium;
  }

  function updateAquarium(id, data) {
    setAquariums((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
  }

  function deleteAquarium(id) {
    const remaining = aquariums.filter((a) => a.id !== id);
    setAquariums(remaining);
    if (activeId === id) {
      setActiveId(remaining.length > 0 ? remaining[0].id : null);
    }
  }

  const activeAquarium = aquariums.find((a) => a.id === activeId) || null;

  return {
    aquariums,
    activeAquarium,
    activeId,
    loading,
    setActiveId,
    addAquarium,
    updateAquarium,
    deleteAquarium,
  };
}