import gif from '../img/cut.gif'
import { useState } from 'react'
import { useQuery } from "@tanstack/react-query"
import { getComments } from "../Api/Api"
import {
    getCoreRowModel,
    useReactTable,
    flexRender,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";

function Table() {

    const { data, isError, error, isPending } = useQuery({
        queryKey: ["comments"],
        queryFn: getComments,
        staleTime: 10000,
    })

    console.dir(data);

    const columns = [
        {
            header: 'id',
            accessorKey: 'id'
        },
        {
            header: 'name',
            accessorKey: 'name'
        },
        {
            header: 'email',
            accessorKey: 'email'
        },
        {
            header: 'body',
            accessorKey: 'body'
        }
    ]

    const [sorting, setSorting] = useState()
    const [filtering, setFiltering] = useState()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            filtering,
        },
        onGlobalFilterChange: setFiltering,
        onSortingChange: setSorting,
    })

    if (isPending) return <div className='h-screen w-full overflow-hidden'>
        <img src={gif} alt="animation" height={'100%'} width='100%' />
    </div>


    if (isError) return <div>Error: {error.message}</div>

    return (
        <>
            <div className="overflow-x-auto text-white text-3xl">
                <table className="table text-[1rem]">
                    {/* head */}
                    <thead className="bg-base-100 text-white">


                        {
                            table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {
                                        headerGroup.headers.map((column) => (
                                            <th key={column.id} className='text-[1rem]' onClick={column.column.getToggleSortingHandler()}>
                                                {
                                                    flexRender(column.column.columnDef.header, column.getContext())
                                                }
                                                { //syntaxt
                                                    { asc: '👆', desc: '👇' }[column.column.getIsSorted() ?? null]
                                                }
                                            </th>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        {/* <tr className="bg-base-200">
                            <th>1</th>
                        </tr> */}

                        {
                            table.getRowModel().rows.map((row) => (
                                <tr className="bg-base-200" key={row.id}>
                                    {
                                        row.getVisibleCells().map((cell) => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))

                                    }
                                </tr>
                            ))}
                    </tbody>
                </table>
                <div className='flex justify-around mt-10'>
                    <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2
                    "
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        First Page
                    </button>
                    <button type="button"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                        Previous
                    </button>
                    <button type="button"
                        onClick={() => table.nextPage()}
                        className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                        Next
                    </button>
                    <button type="button"
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.lastPage()}
                        className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                        Last Page
                    </button>
                </div>
            </div>
        </>
    )
}

export default Table