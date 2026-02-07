export const exportToCSV = (data: any, fileName: string) => {
    // Flatten approach depends on data structure, here we assume mixed array or specific handling
    // For this unified report, let's export separate CSVs or a combined one?
    // User asked for "fetched data array", usually meaning a list.
    // We'll flatten whatever object is passed if it's an array, else wrap it.

    if (!data) return;

    let items = Array.isArray(data) ? data : [data];
    // If complex object with nested arrays (like our API response), we might need parsing.
    // Assuming this utility receives a flat array of "Activities" prepared by the Page.

    if (items.length === 0) return;

    const replacer = (key: string, value: any) => value === null ? '' : value;
    const header = Object.keys(items[0]);

    const csv = [
        header.join(','), // header row first
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};
