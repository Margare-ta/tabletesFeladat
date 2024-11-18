import { useEffect, useState } from "react";

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
            
            <ul>
                {tablets.map((tablet) => (
                    <li key={tablet.Id}>
                        {tablet.name} {tablet.year} - {tablet.price} Ft - {tablet.ramSize} GB- {tablet.cpucores} Mag
                        
                    </li>
                ))}
            </ul>
        </div>
    </>
}