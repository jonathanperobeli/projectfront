import { useEffect, useState } from "react";

interface Festa {
  id: number;
  nome: string;
  descricao: string;
}

const Festa: React.FC = () => {
  const [festas, setFestas] = useState<Festa[]>([]);

  useEffect(() => {
    const fetchFestas = async () => {
      const response = await fetch("http://localhost:3000/festas");
      const data: Festa[] = await response.json();
      setFestas(data);
    };

    fetchFestas();
  }, []);

  return (
    <div>
      {festas.map((festa) => (
        <div key={festa.id} className="p-4 bg-white rounded-md shadow-md">
          <h2 className="font-semibold text-lg">{festa.nome}</h2>
          <p>{festa.descricao}</p>
        </div>
      ))}
    </div>
  );
};

export default Festa;