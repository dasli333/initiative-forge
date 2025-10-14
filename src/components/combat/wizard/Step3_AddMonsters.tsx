import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, X, Loader2 } from "lucide-react";
import type { Step3Props, MonsterViewModel, AddedMonsterViewModel } from "./types";

const CR_FILTER_OPTIONS = [
  { value: "All", label: "All CR" },
  { value: "0-1", label: "CR 0-1" },
  { value: "2-5", label: "CR 2-5" },
  { value: "6-10", label: "CR 6-10" },
  { value: "11-15", label: "CR 11-15" },
  { value: "16-20", label: "CR 16-20" },
  { value: "21+", label: "CR 21+" },
] as const;

export function Step3_AddMonsters({
  searchTerm,
  crFilter,
  monsters,
  addedMonsters,
  onSearchChange,
  onCRFilterChange,
  onAddMonster,
  onUpdateCount,
  onRemoveMonster,
  onLoadMore,
  hasMore,
  isLoading,
  onBack,
  onNext,
}: Step3Props) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div className="max-w-7xl mx-auto">
      <h2 id="step-3-heading" className="text-2xl font-bold mb-6" tabIndex={-1}>
        Add Monsters
      </h2>

      <p className="text-gray-600 dark:text-gray-400 mb-6">Search and add monsters from the library to your combat.</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - Monster Library (60%) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="monster-search" className="sr-only">
                Search monsters
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="monster-search"
                  type="text"
                  placeholder="Search monsters..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-40">
              <Label htmlFor="cr-filter" className="sr-only">
                Filter by CR
              </Label>
              <Select value={crFilter} onValueChange={onCRFilterChange}>
                <SelectTrigger id="cr-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CR_FILTER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Monster List */}
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              {monsters.length === 0 && !isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  No monsters found. Try adjusting your search or filters.
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {monsters.map((monster) => (
                    <MonsterCard key={monster.id} monster={monster} onAdd={onAddMonster} />
                  ))}
                </Accordion>
              )}

              {/* Loading indicator / Load more trigger */}
              {hasMore && (
                <div ref={loadMoreRef} className="p-4 flex justify-center">
                  {isLoading && <Loader2 className="w-6 h-6 animate-spin text-gray-500" />}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Added Monsters (40%) */}
        <div className="lg:col-span-2">
          <div className="sticky top-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg font-semibold mb-4">Added to Combat</h3>

            {addedMonsters.size === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p className="text-sm">No monsters added yet</p>
                <p className="text-xs mt-1">Click the + button to add monsters</p>
              </div>
            ) : (
              <div className="space-y-2">
                {Array.from(addedMonsters.values()).map((monster) => (
                  <AddedMonsterItem
                    key={monster.monster_id}
                    monster={monster}
                    onUpdateCount={onUpdateCount}
                    onRemove={onRemoveMonster}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onNext} size="lg">
          Next
        </Button>
      </div>
    </div>
  );
}

// Monster Card Component
function MonsterCard({
  monster,
  onAdd,
}: {
  monster: MonsterViewModel;
  onAdd: (monsterId: string, monsterName: string) => void;
}) {
  return (
    <AccordionItem value={monster.id}>
      <div className="flex items-center justify-between pr-4 hover:bg-gray-50 dark:hover:bg-gray-900">
        <AccordionTrigger className="flex-1 hover:no-underline">
          <div className="flex items-center gap-3 text-left">
            <span className="font-medium">{monster.name}</span>
            <Badge variant="secondary">{monster.cr}</Badge>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {monster.size} {monster.type}
            </span>
          </div>
        </AccordionTrigger>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(monster.id, monster.name);
          }}
          className="ml-2"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <AccordionContent className="px-4 pb-4">
        <div className="space-y-3 text-sm">
          <div className="flex gap-4">
            <div>
              <span className="font-medium">HP:</span> {monster.hp}
            </div>
            <div>
              <span className="font-medium">AC:</span> {monster.ac}
            </div>
            <div>
              <span className="font-medium">Speed:</span> {monster.speed.join(", ")}
            </div>
          </div>

          {monster.actions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Actions</h4>
              <ul className="space-y-1">
                {monster.actions.slice(0, 3).map((action, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{action.name}:</span> {action.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

// Added Monster Item Component
function AddedMonsterItem({
  monster,
  onUpdateCount,
  onRemove,
}: {
  monster: AddedMonsterViewModel;
  onUpdateCount: (monsterId: string, count: number) => void;
  onRemove: (monsterId: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(monster.count.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCountClick = useCallback(() => {
    setIsEditing(true);
    setEditValue(monster.count.toString());
  }, [monster.count]);

  const handleCountSubmit = useCallback(() => {
    const newCount = parseInt(editValue, 10);
    if (!isNaN(newCount) && newCount >= 1) {
      onUpdateCount(monster.monster_id, newCount);
    } else {
      setEditValue(monster.count.toString());
    }
    setIsEditing(false);
  }, [editValue, monster.count, monster.monster_id, onUpdateCount]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleCountSubmit();
      } else if (e.key === "Escape") {
        setIsEditing(false);
        setEditValue(monster.count.toString());
      }
    },
    [handleCountSubmit, monster.count]
  );

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="flex-1">
        <span className="font-medium">{monster.name}</span>
      </div>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <Input
            ref={inputRef}
            type="number"
            min="1"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleCountSubmit}
            onKeyDown={handleKeyDown}
            className="w-16 h-8 text-center"
          />
        ) : (
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={handleCountClick}
          >
            x{monster.count}
          </Badge>
        )}

        <Button size="sm" variant="ghost" onClick={() => onRemove(monster.monster_id)} className="h-8 w-8 p-0">
          <X className="w-4 h-4" />
          <span className="sr-only">Remove {monster.name}</span>
        </Button>
      </div>
    </div>
  );
}
