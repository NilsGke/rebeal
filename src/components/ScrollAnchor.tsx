"use client";

import { useEffect, useRef } from "react";

export default function ScrollAnchor() {
  const anchorRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (anchorRef.current) anchorRef.current.scrollIntoView();
  }, []);

  return <span ref={anchorRef} />;
}
