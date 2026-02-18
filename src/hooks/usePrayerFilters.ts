import { useState, useMemo, useCallback } from "react";
import type { Prayer } from "../types/prayer";

/**
 * Custom hook for managing prayer filtering logic
 * Optimized to prevent unnecessary re-renders and network calls
 */
export const usePrayerFilters = (prayers: Prayer[]) => {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Extract all unique tags from prayers (computed once on mount)
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    prayers.forEach((prayer) => {
      prayer.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [prayers]);

  // Check if a prayer should be visible based on selected filters
  // Uses OR logic: prayer is visible if it has ANY of the selected tags
  const isPrayerVisible = useCallback((prayer: Prayer): boolean => {
    if (selectedTags.size === 0) return true;
    
    // Prayer must have at least ONE of the selected tags (OR logic)
    return Array.from(selectedTags).some((selectedTag) =>
      prayer.tags.includes(selectedTag)
    );
  }, [selectedTags]);

  // Count visible prayers (memoized)
  const visibleCount = useMemo(() => {
    return prayers.filter(isPrayerVisible).length;
  }, [prayers, isPrayerVisible]);

  // Toggle a tag filter (wrapped in useCallback to prevent re-creation)
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSelectedTags(new Set());
  }, []);

  return {
    allTags,
    selectedTags,
    toggleTag,
    clearAllFilters,
    isPrayerVisible,
    visibleCount,
  };
};
