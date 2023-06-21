const getTags = (name: string) => {
  const tags: string[] = [];
  const parts = name.toLowerCase().split(" ");
  parts.forEach((part, i) => {
    for (let j = 0; j <= i; j++)
      tags.push(
        ...generateTags(
          parts
            .slice(i - j, j)
            .join(" ")
            .trim() +
            " " +
            part
        )
      );
  });

  const filtered = tags.filter((t) => t !== "");
  const unique = filtered.filter(
    (element, index) => filtered.indexOf(element) === index
  );
  return unique;
};

/**
 * tag generation from https://medium.com/@ken11zer01/firebase-firestore-text-search-and-pagination-91a0df8131ef
 * @param name
 */
const generateTags = (name: string) => {
  const arrName: string[] = [];
  let curName = "";
  name.split("").forEach((letter) => {
    curName += letter;
    arrName.push(curName.trim());
  });
  return arrName;
};

export default getTags;
