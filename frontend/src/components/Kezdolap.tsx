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

export default function TabletStarterPage() {
    const [tablets, setTablets] = useState<Tablet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) {
        return <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
        </div>;
    }

    if (error) {
        return <p className="text-danger">Error: {error}</p>;
    }

    const mostExpensive = [...tablets]
        .sort((a, b) => b.price - a.price)
        .slice(0, 3);

    const leastExpensive = [...tablets]
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);


    const mostLiked = [...tablets]
        .sort(() => Math.random() - 0.5)
        .slice(0, 1);

    const renderTable = (title: string, data: Tablet[]) => (
        <div className="mb-4">
            <h3>{title}</h3>
            <table className="table table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Year</th>
                        <th>Price</th>
                        <th>Ram GB</th>
                        <th>CPU's core number</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((tablet) => (
                        <tr key={tablet.Id}>
                            <th scope="row">{tablet.Id}</th>
                            <td>{tablet.name}</td>
                            <td>{tablet.year}</td>
                            <td>{tablet.price} HUF</td>
                            <td>{tablet.ramSize}</td>
                            <td>{tablet.cpucores}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (

        <div className="container">
            <h1 className="my-4">Tablet Overview</h1>

            <button className="btn btn-dark"><a href="/tabletek-felvetel">Tablet felvétele</a></button>
            <button className="btn btn-dark"><a href="/tabletek-torles">Tabletek törlése</a></button>
            <button className="btn btn-dark"><a href="/tabletek-lista">Tabletek listája</a></button>

            {renderTable("Three Most Expensive Tablets", mostExpensive)}
            {renderTable("Three Least Expensive Tablets", leastExpensive)}
            {renderTable("Most Liked Tablet", mostLiked)}
        </div>
    );
}
