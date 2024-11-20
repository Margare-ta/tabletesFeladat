import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';

interface Tablet {
    Id: number;
    name: string;
    year: number;
    price: number;
    ramSize: number;
    cpucores: number;
}

export default function TabletLista() {
    const [tablets, setTablets] = useState<Tablet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const [sortKey, setSortKey] = useState<keyof Tablet | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch('http://localhost:3000/tablets')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                setTablets(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleSort = (key: keyof Tablet) => {
        setSortDirection((prev) => (sortKey === key && prev === "asc" ? "desc" : "asc"));
        setSortKey(key);
    };

    const sortedTablets = [...tablets].sort((a, b) => {
        if (!sortKey) return 0;
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (typeof aValue === "string" && typeof bValue === "string") {
            return sortDirection === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        } else if (typeof aValue === "number" && typeof bValue === "number") {
            return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
        return 0;
    });

    const filteredTablets = sortedTablets.filter(
        (tablet) =>
            tablet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tablet.year.toString().includes(searchTerm)
    );

    const totalPages = Math.ceil(filteredTablets.length / rowsPerPage);
    const paginatedTablets = filteredTablets.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const changePage = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDelete = (id: number) => {
        const updatedTablets = tablets.filter((tablet) => tablet.Id !== id);
        setTablets(updatedTablets);
    };

    if (loading) {
        return <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
        </div>;
    }

    if (error) {
        return <p className="text-danger">Error: {error}</p>;
    }

    return (
        <div className="p-4">
            <h2>Tabletek</h2>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or year..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" onClick={() => handleSort("Id")}>
                            # {sortKey === "Id" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th scope="col" onClick={() => handleSort("name")}>
                            Name {sortKey === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th scope="col" onClick={() => handleSort("year")}>
                            Year {sortKey === "year" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th scope="col" onClick={() => handleSort("price")}>
                            Price {sortKey === "price" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th scope="col" onClick={() => handleSort("ramSize")}>
                            Ram GB {sortKey === "ramSize" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th scope="col" onClick={() => handleSort("cpucores")}>
                            CPU's core number {sortKey === "cpucores" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedTablets.map((tablet) => (
                        <tr key={tablet.Id}>
                            <th scope="row">{tablet.Id}</th>
                            <td>{tablet.name}</td>
                            <td>{tablet.year}</td>
                            <td>{tablet.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                            <td>{tablet.ramSize}</td>
                            <td>{tablet.cpucores}</td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(tablet.Id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center">
                <button
                    className="btn btn-primary"
                    disabled={currentPage === 1}
                    onClick={() => changePage(currentPage - 1)}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    className="btn btn-primary"
                    disabled={currentPage === totalPages}
                    onClick={() => changePage(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
