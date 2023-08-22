/**
 *
 * @param ttrb time to ReBeal
 * @param postedAt time, the rebeal was posted
 * @returns string that tells the time, that the post was late or just the time it was posted if it was posted in time
 */
export default function getLateness(ttrb: Date, postedAt: Date) {
  const date1 = ttrb.getTime();
  const date2 = postedAt.getTime();
  const days = (date2 - date1) / (1000 * 60 * 60 * 24);
  const hours = ((Math.abs(date2 - date1) / (1000 * 60 * 60)) % 24) + days * 24;
  const minutes = (Math.abs(date2 - date1) / (1000 * 60)) % 60;
  const seconds = (Math.abs(date2 - date1) / 1000) % 60;

  if (hours >= 1) return `${Math.round(hours)} hours late`;
  else if (minutes >= 3) return `${Math.round(minutes)} minutes late`;
  else if (minutes >= 2) return `${Math.round(seconds)} seconds late`;
  else return `${postedAt.toLocaleString("en-US").split(",")[1].trim()}`;
}
