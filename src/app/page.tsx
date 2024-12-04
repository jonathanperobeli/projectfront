// CRUD FESTAS, MAP PARA MOSTRAR AS FESTAS, NO HOME PARA MOSTRAR AS FESTAS

'use client';

import { useEffect, useState } from "react";
import Pessoa from "../components/Pessoa";

interface Festa {
  id: number;
  nome: string;
  data: Date;
}

const Home: React.FC = () => {
  const [festas, setFestas] = useState<Festa[]>([]);
  const [festaSelecionada, setFestaSelecionada] = useState<number | null>(null);
  const [newFesta, setNewFesta] = useState<string>("");  // Para o nome da nova festa
  const [editFestaId, setEditFestaId] = useState<number | null>(null);
  const [editFestaNome, setEditFestaNome] = useState<string>("");

  // FUNÇÕES DE CRUD - FESTAS

  // Função para buscar as festas
  useEffect(() => {
    const fetchFestas = async () => {
      const response = await fetch("http://localhost:3000/festas");
      const data: Festa[] = await response.json();
      setFestas(data);
    };

    fetchFestas();
  }, [festas]);

  // Função para criar uma nova festa
  const handleAddFesta = async () => {
    if (newFesta.trim() === "") return; // Verificar se o nome não está vazio

    const response = await fetch("http://localhost:3000/festas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome: newFesta, data: new Date() }),
    });

    if (response.ok) {
      setNewFesta("");
      setFestaSelecionada(null); 
    } else {
      alert("Erro ao adicionar festa!");
    }
  };

  // Função para editar uma festa
  const handleEditFesta = async () => {
    if (editFestaNome.trim() === "") return;

    const response = await fetch(`http://localhost:3000/festas/${editFestaId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome: editFestaNome, data: new Date() }), 
    });

    if (response.ok) {
      setEditFestaId(null);
      setEditFestaNome("");
    } else {
      alert("Erro ao editar festa!");
    }
  };

  // Função para excluir uma festa
  const handleDeleteFesta = async (id: number) => {
    const response = await fetch(`http://localhost:3000/festas/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setFestaSelecionada(null);
    } else {
      alert("Erro ao excluir festa!");
    }
  };

  const handleFestaClick = (id: number) => {
    setFestaSelecionada(id);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 pt-10"> {/* Ajustado para mais para cima */}
      <h1 className="text-[60px] mb-8">Combinar festas!</h1> {/* Adicionando espaço abaixo do título */}
      <div className="w-full max-w-5xl"> {/* Aumentando a largura do componente */}
        {/* Menu de ações */}
        <div className="flex justify-end space-x-4 bg-white p-3 rounded-md shadow-md ">
          {/* Botões de Ação */}
          <div>
            <input
              type="text"
              value={newFesta}
              onChange={(e) => setNewFesta(e.target.value)}
              placeholder="Nome da nova festa"
              className="border p-2 mx-2 rounded"
            />
            <button
              onClick={handleAddFesta}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-opacity-75"
            >
              Adicionar Festa
            </button>
          </div>

          {/* Botões para editar e excluir */}
          {festaSelecionada && (
            <div className="space-x-4">
              <button
                onClick={() => {
                  setEditFestaId(festaSelecionada);
                  const festa = festas.find(f => f.id === festaSelecionada);
                  if (festa) setEditFestaNome(festa.nome);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-opacity-75"
              >
                Editar Festa
              </button>
              <button
                onClick={() => handleDeleteFesta(festaSelecionada)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-opacity-75"
              >
                Excluir Festa
              </button>
            </div>
          )}
        </div>

        {/* RODANDO UM MAP PARA MOSTRAR AS FESTAS */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {festas.map((festa) => (
            <button
              key={festa.id}
              onClick={() => handleFestaClick(festa.id)}
              className={`p-4 rounded-md shadow-md 
                ${festaSelecionada === festa.id ? "bg-blue-500 text-white" : "bg-blue-500 text-white"}`} // Todos com a mesma cor
            >
              {festa.nome}
            </button>
          ))}
        </div>

        {/* Editando uma festa */}
        {editFestaId && (
          <div className="mt-4">
            <input
              type="text"
              value={editFestaNome}
              onChange={(e) => setEditFestaNome(e.target.value)}
              placeholder="Editar nome da festa"
              className="border p-2 rounded"
            />
            <button
              onClick={handleEditFesta}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-opacity-75"
            >
              Salvar Edição
            </button>
          </div>
        )}

        {/* Exibindo detalhes da festa */}
        <div className="mt-5">
          {festaSelecionada && <Pessoa festaId={festaSelecionada} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
