import React from 'react';

type TableVeiculosProps = {
    data: Array<{ [key: string]: any }>;
    columns: Array<{ header: string; accessor: string }>;
};


export default function TableVeiculos({ data, columns }: TableVeiculosProps) {
    return (
        <div className="flex flex-col">
            <table className="border-collapse border border-gray-400">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.accessor} className="border border-gray-300">
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column) => (
                                <td key={column.accessor} className="border border-gray-300">
                                    {row[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}