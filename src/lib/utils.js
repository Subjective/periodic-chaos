const formatCamelCase = (str) => {
  // Split the string into individual words
  const words = str.replace(/([a-z])([A-Z])/g, "$1 $2").split(/[\s_-]+/);

  // Capitalize the first letter of each word and join them with spaces
  const formatted = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return formatted;
};

export { formatCamelCase };
