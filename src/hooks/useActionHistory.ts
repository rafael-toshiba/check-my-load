import { useState, useCallback, useEffect } from 'react';
import { ActionHistoryEntry, ActionType } from '@/types/cargo';

const HISTORY_KEY = 'cargo-action-history';
const MAX_ENTRIES = 500;

export function useActionHistory(cargoId: string | null) {
  const [history, setHistory] = useState<ActionHistoryEntry[]>([]);

  // Load history on mount or when cargoId changes
  useEffect(() => {
    if (cargoId) {
      loadHistory(cargoId);
    } else {
      setHistory([]);
    }
  }, [cargoId]);

  const loadHistory = (id: string) => {
    try {
      const saved = localStorage.getItem(`${HISTORY_KEY}-${id}`);
      if (saved) {
        setHistory(JSON.parse(saved));
      } else {
        setHistory([]);
      }
    } catch {
      setHistory([]);
    }
  };

  const saveHistory = useCallback((entries: ActionHistoryEntry[], id: string) => {
    try {
      // Keep only the last MAX_ENTRIES
      const trimmed = entries.slice(0, MAX_ENTRIES);
      localStorage.setItem(`${HISTORY_KEY}-${id}`, JSON.stringify(trimmed));
    } catch {
      // Storage might be full
    }
  }, []);

  const addEntry = useCallback((
    type: ActionType,
    description: string,
    metadata?: Record<string, unknown>
  ) => {
    if (!cargoId) return;

    const iconMap: Record<ActionType, string> = {
      product_checked: '✅',
      product_warning: '⚠️',
      bag_created: '📦',
      bag_deleted: '🗑️',
      progress_saved: '💾',
      photo_captured: '📸',
      conference_completed: '🎯',
      conference_started: '🚀',
    };

    const entry: ActionHistoryEntry = {
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date().toISOString(),
      description,
      icon: iconMap[type],
      metadata,
    };

    setHistory(prev => {
      const updated = [entry, ...prev];
      saveHistory(updated, cargoId);
      return updated;
    });
  }, [cargoId, saveHistory]);

  const clearHistory = useCallback(() => {
    if (!cargoId) return;
    setHistory([]);
    localStorage.removeItem(`${HISTORY_KEY}-${cargoId}`);
  }, [cargoId]);

  const filterByType = useCallback((types: ActionType[]) => {
    return history.filter(entry => types.includes(entry.type));
  }, [history]);

  const searchHistory = useCallback((query: string) => {
    const lower = query.toLowerCase();
    return history.filter(entry => 
      entry.description.toLowerCase().includes(lower)
    );
  }, [history]);

  return {
    history,
    addEntry,
    clearHistory,
    filterByType,
    searchHistory,
  };
}
