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
    const [error, setError] = useState(null);

    useEffect(() => {

        fetch('http://localhost:3000/tablets')
            .then((response) => {
                if (response.status === 404) {
                    throw new Error('Resource not found (404)');
                }
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setTablets(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }


    return <>
        <div>
            <h2>Tabletek</h2>

            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Year</th>
                        <th scope="col">Price</th>
                        <th scope="col">Ram GB</th>
                        <th scope="col">CPU's core number</th>
                    </tr>
                </thead>
                <tbody>
                    {tablets.map((tablet) => (
                        <tr>
                            <th>{tablet.Id}</th>
                            <td>{tablet.name}</td>
                            <td>{tablet.year}</td>
                            <td>{tablet.price}</td>
                            <td>{tablet.ramSize}</td>
                            <td>{tablet.cpucores}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
}