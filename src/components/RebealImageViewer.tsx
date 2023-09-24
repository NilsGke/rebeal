"use client";

import { ReBeal } from "@/app/types";
import { ReactNode, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function ReBealImageViewer({
  images,
  className = "",
  children,
  lazy = false,
  disabled = false,
  onImageDragStart,
  onImageDragEnd,
  envClassName,
  selfieClassName,
  padding,
}: {
  images: ReBeal["images"];
  className?: string;
  children?: ReactNode;
  lazy?: boolean;
  disabled?: boolean;
  onImageDragStart?: () => void;
  onImageDragEnd?: () => void;
  envClassName?: string;
  selfieClassName?: string;
  padding?: number;
}) {
  const [environmentBig, setEnvironmentBig] = useState(true);
  const [dragging, setDragging] = useState(false);

  const smallImageRef = useRef<HTMLImageElement>(null);
  const bigImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (disabled) return;

    const element = smallImageRef.current;
    if (element === null) return;

    let startX = 0,
      startY = 0;

    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    element.addEventListener("mousedown", dragMouseDown);
    element.addEventListener("touchstart", dragTouchStart);

    function dragTouchStart(e: TouchEvent) {
      onImageDragStart && onImageDragStart();
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      // get the mouse cursor position at startup:
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      document.ontouchend = closeDragElement;
      // call a function whenever the cursor moves:
      document.ontouchmove = touchDrag;
    }

    function dragMouseDown(e: MouseEvent) {
      onImageDragStart && onImageDragStart();
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      startX = e.clientX;
      startY = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = mouseDrag;
    }

    function touchDrag(e: TouchEvent) {
      const element = smallImageRef.current;
      if (element === null) return;

      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.touches[0].clientX;
      pos2 = pos4 - e.touches[0].clientY;
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;

      setElementPosition(element);
    }

    function mouseDrag(e: MouseEvent) {
      const element = smallImageRef.current;
      if (element === null) return;

      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      setElementPosition(element);
    }

    function setElementPosition(element: HTMLElement) {
      // set the element's new position:
      element.style.left = element.offsetLeft - pos1 + "px";
      element.style.top = element.offsetTop - pos2 + "px";

      const boundary = bigImageRef.current;
      if (boundary === null) return;

      // check for image outside boundary (big image)
      const [offsetx, offsety] = checkOutsideBoundary(element, boundary);
      element.style.left = element.offsetLeft + offsetx + "px";
      element.style.top = element.offsetTop + offsety + "px";
    }

    function checkOutsideBoundary(element: HTMLElement, boundary: HTMLElement) {
      const boundaryBoundings = boundary.getBoundingClientRect();
      const elementBoundings = element.getBoundingClientRect();

      let x = 0,
        y = 0;

      if (elementBoundings.x < boundaryBoundings.x)
        x -= elementBoundings.x - boundaryBoundings.x;

      if (elementBoundings.y < boundaryBoundings.y)
        y -= elementBoundings.y - boundaryBoundings.y;

      if (
        elementBoundings.x + elementBoundings.width >
        boundaryBoundings.x + boundaryBoundings.width
      )
        x -=
          elementBoundings.x +
          elementBoundings.width -
          (boundaryBoundings.x + boundaryBoundings.width);

      if (
        elementBoundings.y + elementBoundings.height >
        boundaryBoundings.y + boundaryBoundings.height
      )
        y -=
          elementBoundings.y +
          elementBoundings.height -
          (boundaryBoundings.y + boundaryBoundings.height);

      return [x, y];
    }

    function closeDragElement() {
      onImageDragEnd && onImageDragEnd();

      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.ontouchmove = null;

      const element = smallImageRef.current;
      if (element === null) return;

      // check if no move (-> click)
      if (startX === pos3 && startY === pos4) {
        setEnvironmentBig((prev) => !prev);
        return;
      }

      animateToCorner();
    }

    function animateToCorner() {
      const element = smallImageRef.current;
      if (element === null) return;
      const boundary = bigImageRef.current;
      if (boundary === null) return;

      const elementBoundings = element.getBoundingClientRect();
      const boundaryBoundings = boundary.getBoundingClientRect();

      const distanceLeft =
        elementBoundings.x + elementBoundings.width / 2 - boundaryBoundings.x;

      const distanceRight =
        boundaryBoundings.x +
        boundaryBoundings.width -
        (elementBoundings.x + elementBoundings.width / 2);

      const padding = 20;

      let goalX = 0,
        goalY = padding;

      if (distanceLeft <= distanceRight) goalX = padding;
      else goalX = boundaryBoundings.width - padding - elementBoundings.width;

      const animation = element.animate(
        {
          left: goalX + "px",
          top: goalY + "px",
        },
        {
          duration: 300,
          easing: "ease-out",
        }
      );

      animation.onfinish = () => {
        element.style.left = goalX + "px";
        element.style.top = goalY + "px";
      };
    }

    return () => {
      element.removeEventListener("mousedown", dragMouseDown);
      element.removeEventListener("touchstart", dragTouchStart);
    };
  }, [disabled, onImageDragEnd, onImageDragStart]);

  return (
    <div className={twMerge("relative aspect-[3/4]", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={bigImageRef}
        className={twMerge("rounded-2xl h-full", envClassName)}
        src={environmentBig ? images.environment : images.selfie}
        alt={environmentBig ? "environment Image" : "selfie image"}
        loading={lazy ? "lazy" : "eager"}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={smallImageRef}
        className={twMerge(
          "rounded-xl absolute top-4 left-4 h-[30%] border-2 border-black",
          selfieClassName
        )}
        style={{
          top: padding,
          left: padding,
        }}
        src={environmentBig ? images.selfie : images.environment}
        alt={environmentBig ? "selfie image" : "environment Image"}
        loading={lazy ? "lazy" : "eager"}
      />
      {children}
    </div>
  );
}
