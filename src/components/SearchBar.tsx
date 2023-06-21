"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useTransition } from "react";

const SearchBar: React.FC<{}> = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  /**
   * search implementation from: https://www.youtube.com/watch?v=dSMp-oihHnw
   */
  const handleSearchParams = useCallback(
    (debouncedValue: string) => {
      let params = new URLSearchParams(window.location.search);
      if (debouncedValue.length > 0) params.set("search", debouncedValue);
      else params.delete("search");
      console.log(params.toString());
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router]
  );

  // set initial params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("search") ?? "";
    setSearch(searchQuery);
  }, []);

  useEffect(() => {
    if (debouncedSearch.length > 0 && !mounted) setMounted(true);
  }, [debouncedSearch.length, mounted]);

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // use search
  useEffect(() => {
    if (mounted) handleSearchParams(debouncedSearch);
  }, [debouncedSearch, handleSearchParams, mounted]);

  return (
    <input
      className="w-full p-1 bg-transparent border-2 rounded text-lg border-zinc-600 placeholder:text-zinc-600"
      placeholder="Search..."
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default SearchBar;
