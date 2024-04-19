const https = require('https');
const axios = require('axios');
const fs = require('fs');
const express = require('express');
const app = express();




const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/intermediary', async (req, res) => {
    try {
      const { url, method, body, headers } = req.body;
  
      // Opções da requisição, incluindo certificados, corpo e cabeçalhos
      const options = {
        method: method,
        url,
        data: body, // Corpo da requisição
        headers, // Cabeçalhos da requisição
      };
  
      // Fazendo a chamada ao servidor de destino
      const response = await axios(options);
  
      // Enviando a resposta do servidor de destino de volta para o cliente
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })

const port = 3333;

const server = https.createServer({
  cert: fs.readFileSync('./cert/Certificado_itau.crt'),
  key: fs.readFileSync('./cert/NOVO_CERTIFICADO.key')
}, app);

server.listen(port, () => {
  console.log(`Server is listening on https://localhost:${port}`);
});