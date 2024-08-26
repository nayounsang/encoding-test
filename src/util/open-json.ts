export const openJSON = (json: object) => {
  const jsonString = JSON.stringify(json, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const newWindow = window.open(url, "_blank");
  if (newWindow) newWindow.document.title = "JSON";
};
