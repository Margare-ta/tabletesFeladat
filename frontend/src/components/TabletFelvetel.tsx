import { useState } from "react";

export default function TabletFelvetel() {
    const [name, setName] = useState<string>('');
    const [year, setYear] = useState<number>();
    const [price, setPrice] = useState<number>();
    const [ramSize, setRamSize] = useState<number>();
    const [cpucores, setCpucores] = useState<number>();
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newTablet = {
            name: name,
            year: year,
            price: price,
            ramSize: ramSize,
            cpucores: cpucores
        }
        try {
            const response = await fetch('http://localhost:3000/tablets', {
                method: 'POST',
                headers: {
                     'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTablet)
            })
            if (!response.ok){
                const errorData = await response.json();
                setError(errorData.error)
                throw new Error(`Hiba történt: ${response.status}`)
            }

            setRamSize(0);
            setName('');
            setYear(0);
            setPrice(0);
            setCpucores(0);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message)
        } finally {

        }
    }
    return <>
        <h2>Tablet felvétel</h2>
        
        <form onSubmit={handleSubmit}>
            <label>
                <p>Name:</p>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
              
            </label>
            <label>
                <p>Year:</p>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value)) }
                />
                
            </label>
            <label>
                <p>Price:</p>
                <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                />
               
            </label>
            <label>
                <p>Size of RAM:</p>
                <input
                    type="number"
                    value={ramSize}
                    onChange={(e) => setRamSize(parseInt(e.target.value))}
                />
               
            </label>
            <label>
                <p>CPU core number:</p>
                <input
                    type="number"
                    value={cpucores}
                    onChange={(e) => setCpucores(parseInt(e.target.value))}
                />
               
            </label>
            <button type="submit">Tablet felvétele</button>
            { error && <p>{ error }</p> }
            {success && <p>Sikeresen megtörtént a tablet felvétele.</p> }
        </form>
    </>
}