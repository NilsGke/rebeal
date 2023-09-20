import { ReBeal, Reaction } from "@/app/types";

export default async function reactToReBeal(
  reBealId: ReBeal["id"],
  reactionImageUrl: string,
  reactionType: Reaction["type"]
) {
  return fetch("/api/reactions/react", {
    method: "POST",
    body: JSON.stringify({
      reBealId,
      reactionImageUrl,
      reactionType,
    }),
  });
}
