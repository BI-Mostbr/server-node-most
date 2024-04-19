const express = require('express');
const axios = require('axios');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = 3333;

app.use(express.json());

// Middleware para configurar CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://app.mostbr.com.br/'); // Substitua pelo seu domínio
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});


app.options('*', (req, res) => {
  res.status(200).send();
});

// Rota para intermediar a chamada de API
app.post('/api/intermediary', async (req, res) => {
  try {
    const { url, method, body, headers } = req.body;

    // Carregando os certificados
    const certificado = fs.readFileSync('/home/ubuntu/server10/cert/Certificado_itau.crt');
    const chave = fs.readFileSync('/home/ubuntu/server10/cert/NOVO_CERTIFICADO.key');

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