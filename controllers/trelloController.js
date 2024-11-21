const axios = require('axios');
const fs = require('fs');
const path = require('path');

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const TRELLO_BOARD_ID = process.env.TRELLO_BOARD_ID;
const API_BASE_URL = 'https://api.trello.com/1';

const jsonFilePath = path.join(__dirname, '../data/lists.json');

// Função para buscar dados do Trello
const fetchTrelloData = async () => {
    const listsUrl = `${API_BASE_URL}/boards/${TRELLO_BOARD_ID}/lists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
    const cardsUrl = `${API_BASE_URL}/boards/${TRELLO_BOARD_ID}/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

    const [listsResponse, cardsResponse] = await Promise.all([
        axios.get(listsUrl),
        axios.get(cardsUrl)
    ]);

    return { lists: listsResponse.data, cards: cardsResponse.data };
};

// Função para processar dados e salvar no JSON
const updateJsonData = async (req, res) => {
    try {
        const { lists, cards } = await fetchTrelloData();
        const listCounts = lists.map(list => {
            const relatedCards = cards.filter(card => card.idList === list.id);

            // Separar cartões por label
            const saldoCards = relatedCards.filter(card =>
                card.labels.some(label => label.name.toLowerCase() === 'saldo')
            );
            const cloudCards = relatedCards.filter(card =>
                card.labels.some(label => label.name.toLowerCase() === 'cloud')
            );
            const cloudBasePadraoCards = relatedCards.filter(card =>
                card.labels.some(label => label.name.toLowerCase() === 'cloud') &&
                card.labels.some(label => label.name.toLowerCase() === 'base padrão')
            );
            const adicionalCards = relatedCards.filter(card =>
                card.labels.some(label => label.name.toLowerCase() === 'adicional')
            );
            const outrosCards = relatedCards.filter(card =>
                !card.labels.some(label =>
                    ['saldo', 'adicional'].includes(label.name.toLowerCase())
                )
            );

            return {
                name: list.name,
                total: relatedCards.length,
                saldo: saldoCards.length,
                cloud: cloudCards.length,
                cloudBasePadrao: cloudBasePadraoCards.length,
                adicional: adicionalCards.length, // Novo campo para "Adicional"
                outros: outrosCards.length // "Outros" atualizado sem "Adicional"
            };
        });

        // Atualiza o arquivo JSON
        fs.writeFileSync(jsonFilePath, JSON.stringify({ lists: listCounts }, null, 2));

        res.json(listCounts);
    } catch (error) {
        console.error('Erro ao atualizar JSON:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar os dados' });
    }
};

module.exports = { updateJsonData };
