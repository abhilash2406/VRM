export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    alert("No data to export");
    return;
  }

  // Get all keys from the first object to use as headers
  // Flatten objects if necessary, or just stringify values
  const headers = Object.keys(data[0]);

  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => {
      return headers.map(fieldName => {
        let value = row[fieldName];
        // Handle null/undefined
        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'object') {
          // If it's a nested object (like driver.user.first_name), try to stringify
          try {
            value = JSON.stringify(value);
          } catch (e) {
            value = '[Object]';
          }
        } else {
          value = String(value);
        }
        
        // Escape quotes and commas
        value = value.replace(/"/g, '""');
        if (value.search(/("|,|\n)/g) >= 0) {
          value = `"${value}"`;
        }
        return value;
      }).join(',');
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
