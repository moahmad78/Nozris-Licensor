'use client';

import * as XLSX from 'xlsx-js-style';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ExportButtonProps {
    data: any[];
    filename: string;
    label: string;
    variant?: 'primary' | 'secondary';
}

export function ExportButton({ data, filename, label, variant = 'primary' }: ExportButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleExport = () => {
        setLoading(true);
        try {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();

            // 1. Column Auto-Sizing
            const cols = Object.keys(data[0] || {}).map(key => ({
                wch: Math.max(key.length, ...data.map(row => (row[key] || '').toString().length)) + 2
            }));
            worksheet['!cols'] = cols;

            // 2. Header Styling ( प्रोफेशनल ब्लू बैकग्राउंड & वाइट बॉल्ड टेक्स्ट )
            const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const address = XLSX.utils.encode_col(C) + "1";
                if (!worksheet[address]) continue;
                worksheet[address].s = {
                    fill: { fgColor: { rgb: "2563EB" } }, // Blue-600
                    font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } }
                    }
                };
            }

            XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
            XLSX.writeFile(workbook, `${filename}.xlsx`);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const baseStyles = "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50";
    const variants = {
        primary: "bg-black text-white hover:bg-gray-800 shadow-sm",
        secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
    };

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className={`${baseStyles} ${variants[variant]}`}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {label}
        </button>
    );
}
