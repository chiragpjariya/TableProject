import gif from '../img/cut.gif'
import {  useState } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteComments, getComments, updatepost } from "../Api/Api"
import {
    getCoreRowModel,
    useReactTable,
    flexRender,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";



function Table() {

    const queriyClient = useQueryClient()
    const { data, isError, error, isPending } = useQuery({
        queryKey: ["posts"],
        queryFn: getComments,
        staleTime: 10000,
        placeholderData: keepPreviousData
    })



    const DeleteComments = useMutation({
        mutationFn: (id) => deleteComments(id),
        onSuccess: (response, id) => {
            if (response.status > 199) {

                queriyClient.setQueryData(['posts'], (oldData) => {
                    let newData = oldData.filter((item) => item.id !== Number(id))
                    console.log('Delete successfully', newData);
                    return newData

                })
            } else {
                console.log('something wrong');

            }

        }
    });


    const UpdatePost = useMutation({
        mutationFn: (id) => updatepost(id),

    });


    const columns = [
        {
            header: 'id',
            accessorKey: 'id'
        },
        {
            header: 'title',
            accessorKey: 'title'
        },
        {
            header: 'body',
            accessorKey: 'body'
        },
        {
            header: 'Operation',
            cell: ({ cell }) => {
                const cellId = cell.id.split('_')[0]; // Extracts the numeric part (e.g., '2')
                // Extracts the numeric part (e.g., '2')
                return (
                    <div className='flex justify-around'>
                        <button
                            type="button"
                            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                            onClick={() => UpdatePost.mutate(cellId)} // Pass the extracted cell ID
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                            onClick={() => DeleteComments.mutate(cellId)} // Pass the extracted cell ID
                        >
                            Delete
                        </button>
                    </div>
                );
            }
        }

    ]

    const [sorting, setSorting] = useState()
    const [filtering, setFiltering] = useState()
    const [pageSize, setPageSize] = useState()





    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting: sorting,
            globalFilter: filtering,
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
            <div className='flex justify-around    items-center mt-12'>
                <div className="  w-10  ">
                    <select

                        onChange={(e) => table.setPageSize(e.target.value)}
                        className="text-white bg-gray-700 rounded-lg py-2 px-4 w-[150px] h-10 flex items-center justify-center"
                    >
                        {[5, 10, 20, 50].map(size => (
                            <option key={size} value={size} >{size} pageSize</option>
                        ))}
                    </select>
                </div>
                <div className="max-w-md mx-auto  ">
                    <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search Mockups, Logos..."
                            required=""
                            onChange={(e) => setFiltering(e.target.value)}
                            value={filtering}
                        />
                    </div>
                </div>
            </div>
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