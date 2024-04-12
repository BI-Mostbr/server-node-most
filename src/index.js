const express = require('express');
const axios = require('axios');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = 3333;

app.use(express.json());

// Rota para intermediar a chamada de API
app.post('/api/intermediary', async (req, res) => {
  try {
    const { url, method, body, headers } = req.body;

    // Carregando os certificados
    const certificado = fs.readFileSync('./cert/Certificado_itau.crt');
    const chave = fs.readFileSync('./cert/NOVO_CERTIFICADO.key');

    // Opções da requisição, incluindo certificados, corpo e cabeçalhos
    const options = {
      method: method,
      url,
      data: body, // Corpo da requisição
      headers, // Cabeçalhos da requisição
      
    httpsAgent: new https.Agent({ // Passando os certificados
        cert: certificado, // Certificado 1
        key: chave, // Certificado 2
      })
    };

    // Fazendo a chamada ao servidor de destino
    const response = await axios(options);

    // Enviando a resposta do servidor de destino de volta para o cliente
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor intermediário está rodando na porta ${PORT}`);
});