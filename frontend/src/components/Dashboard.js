import React, { useState } from 'react';
import './Dashboard.css'; // Importa o arquivo CSS

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:3001/api/update-data');
            if (!response.ok) {
                throw new Error('Erro ao buscar dados');
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError('Erro ao buscar dados. Verifique o servidor.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="title">Resumo do Trello</h1>
            <button className="fetch-button" onClick={fetchData}>
                Atualizar Dados
            </button>
            {loading && <p className="loading-text">Carregando...</p>}
            {error && <p className="error-text">{error}</p>}
            <div className="list-container">
                {data.map((list, index) => (
                    <div key={index} className="list-card">
                        <h2>{list.name}</h2>
                        <p><strong>Geral:</strong> {list.outros}</p>
                        <p><strong>Adicionais:</strong> {list.adicional}</p>
                        <p><strong>Saldo:</strong> {list.saldo}</p>
                        <p><strong>Cloud:</strong> {list.cloud}</p>
                        <p><strong>Cloud + Base Padrão:</strong> {list.cloudBasePadrao}</p>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
