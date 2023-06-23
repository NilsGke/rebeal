const datesAreSameDay = (date1: Date | number, date2: Date | number) => {
  if (typeof date1 === "number") date1 = new Date(date1);
  if (typeof date2 === "number") date2 = new Date(date2);

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export default datesAreSameDay;
