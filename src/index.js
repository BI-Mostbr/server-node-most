const https = require('https');
const axios = require('axios');
const fs = require('fs');
const express = require('express');
const app = express();


const port = 3333;

app.use(express.json());

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

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
  })

app.listen(port, () => {
  console.log(`Server is listening on https://localhost:${port}`);
});