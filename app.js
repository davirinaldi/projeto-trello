const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api', apiRoutes);

// Servir arquivos estáticos do React (frontend)
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Rota padrão para o React (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
