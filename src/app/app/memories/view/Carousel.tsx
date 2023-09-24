"use client";

import { ReBeal } from "@/app/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import { useRef } from "react";
import ReBealImageViewer from "@/components/RebealImageViewer";
import "swiper/css";

export default function RebealCarousel({
  reBeals,
  activeReBealCallback,
  startAt,
}: {
  reBeals: (Omit<ReBeal, "user" | "postedAt"> & { postedAt: Date })[];
  activeReBealCallback: (reBeal: (typeof reBeals)[number]) => void;
  startAt?: number;
}) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section>
      <Swiper
        grabCursor
        initialSlide={startAt}
        spaceBetween={50}
        onBeforeSlideChangeStart={(e) => e}
        onSlideChange={(swiper) => {
          const active = reBeals.at(swiper.activeIndex);
          if (active) activeReBealCallback(active);
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {reBeals.map((reBeal, index) => (
          <SwiperSlide key={reBeal.id}>
            {({ isNext, isPrev, isActive }) => (
              <ReBealImageViewer
                lazy={!isNext && !isPrev}
                images={reBeal.images}
                disabled={!isActive}
                onImageDragStart={() =>
                  swiperRef.current && swiperRef.current.disable()
                }
                onImageDragEnd={() =>
                  swiperRef.current && swiperRef.current.enable()
                }
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
