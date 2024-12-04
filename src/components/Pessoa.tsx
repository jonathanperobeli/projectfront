// CRUD - PESSOA

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Pessoa {
  id?: number; // Opcional para criação
  nome: string;
  idade: number;
  nomeCompleto: string;
  foto?: string;
  presente: boolean;
  convidada: boolean;
  anfitriao: boolean;
  festaId: number;
}

interface PessoaProps {
  festaId: number;
}

const Pessoa: React.FC<PessoaProps> = ({ festaId }) => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal
  const [modalPessoa, setModalPessoa] = useState<Pessoa | null>(null); // Dados da pessoa no modal


  

  useEffect(() => {
    const fetchPessoas = async () => {
      if (festaId) {
        const response = await fetch(`http://localhost:3000/pessoas/festa/${festaId}`);
        const data: Pessoa[] = await response.json();
        setPessoas(data);
      }
    };

    fetchPessoas();
  }, [festaId]);

  const openModal = (pessoa?: Pessoa) => {
    if (pessoa) {
      setModalPessoa(pessoa);
    } else {
      setModalPessoa({
        nome: "",
        idade: 0,
        nomeCompleto: "",
        presente: true,
        convidada: true,
        anfitriao: false,
        festaId,
      });
    }
    setIsModalOpen(true);
  };

  // Fechar o modal
  const closeModal = () => {
    setModalPessoa(null);
    setIsModalOpen(false);
  };

  // Salvar ou atualizar pessoa
  const savePessoa = async () => {
    if (!modalPessoa) return;

    const url = modalPessoa.id
      ? `http://localhost:3000/pessoas/${modalPessoa.id}`
      : `http://localhost:3000/pessoas`;
    const method = modalPessoa.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modalPessoa),
    });

    if (response.ok) {
      closeModal();
      const updatedPessoas = await fetch(`http://localhost:3000/pessoas/festa/${festaId}`).then(
        (res) => res.json()
      );
      setPessoas(updatedPessoas);
    } else {
      alert("Erro ao salvar pessoa!");
    }
  };

  // Deletar pessoa
  const deletePessoa = async (pessoaId: number) => {
    const response = await fetch(`http://localhost:3000/pessoas/${pessoaId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setPessoas((prev) => prev.filter((pessoa) => pessoa.id !== pessoaId));
    } else {
      alert("Erro ao deletar pessoa!");
    }
  };

  return (
    <div>
      <button
        onClick={() => openModal()}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-opacity-75"
      >
        Adicionar Pessoa
      </button>

      <div className="grid grid-cols-3 gap-4">
        {pessoas.length > 0 ? (
          pessoas.map((pessoa) => (
            <div
              key={pessoa.id}
              className={`p-4 bg-white rounded-md shadow-md flex flex-col items-center ${
                pessoa.anfitriao ? "border-4 border-yellow-500" : "border border-gray-300"
              }`}
            >
              <h2 className="font-semibold text-lg">{pessoa.nome}</h2>
              <p className="text-gray-500">Idade: {pessoa.idade}</p>
              {pessoa.foto && (
                <Image
                  src={pessoa.foto}
                  alt={pessoa.nome}
                  width={200}
                  height={200}
                  className="w-16 h-16 rounded-full mt-2"
                />
              )}
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => openModal(pessoa)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-opacity-75"
                >
                  Editar
                </button>
                <button
                  onClick={() => deletePessoa(pessoa.id!)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-opacity-75"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center">Nenhuma pessoa encontrada para essa festa.</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && modalPessoa && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {modalPessoa.id ? "Editar Pessoa" : "Adicionar Pessoa"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                value={modalPessoa.nome}
                onChange={(e) =>
                  setModalPessoa({ ...modalPessoa, nome: e.target.value })
                }
                placeholder="Nome"
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                value={modalPessoa.idade}
                onChange={(e) =>
                  setModalPessoa({ ...modalPessoa, idade: Number(e.target.value) })
                }
                placeholder="Idade"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                value={modalPessoa.nomeCompleto}
                onChange={(e) =>
                  setModalPessoa({ ...modalPessoa, nomeCompleto: e.target.value })
                }
                placeholder="Nome Completo"
                className="w-full border p-2 rounded"
              />
              <input
                type="url"
                value={modalPessoa.foto || ""}
                onChange={(e) =>
                  setModalPessoa({ ...modalPessoa, foto: e.target.value })
                }
                placeholder="URL da Foto"
                className="w-full border p-2 rounded"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={modalPessoa.anfitriao}
                  onChange={(e) =>
                    setModalPessoa({
                      ...modalPessoa,
                      anfitriao: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
                <label>Anfitrião</label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={savePessoa}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-opacity-75"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pessoa;
