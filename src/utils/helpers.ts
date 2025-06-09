export const collectTags = (fileData: any[]) => {
  const tags: string[] = [];
  fileData.forEach((row) => {
    if (row['Tags']) {
      const rowTags = row['Tags'].split(',').map((tag: string) => tag.trim());
      rowTags.forEach((tag: string) => {
        if (tag && !tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }
  });
  return tags;
};

export function createCSV(fileData: any[], fileName: string = 'MovieData.csv') {
  if (fileData.length === 0) {
    alert('No data available to download.');
    return;
  }

  const selectedColumns = ["Name", "Year", "Letterboxd URI", "Watched Date"];
  const headers = selectedColumns.join(',');
  const rows = fileData.map((entry) =>
    selectedColumns
      .map((column) => `"${entry[column] || ''}"`)
      .join(',')
  );
  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
