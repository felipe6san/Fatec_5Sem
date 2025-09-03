//expressjs.com
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const e = require('express');
const port = 3000

//cria um objeto express
const app = express()
//vincula o middleware ao express
app.use(cors());

//permissão para usar outros métodos HTTP
app.use(methodOverride('X-HTTP-Method'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('X-Method-Override'));
app.use(methodOverride('_method'));


//permissão do servidor
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//fazer a conexão do banco de dados com o mongoose
let url = 'mongodb://localhost:27017/FatecVotorantim';

mongoose.connect(url)
  .then(
    () => console.log('Conectado ao MongoDB...')
  )
  .catch(
    (err) => { console.log("Erro na conexão: ", err) });

//estrutura do mongodb para armazenar os dados
var User = mongoose.model('Usuario', { name: String });

//inserir dados
app.post('/inserir', async (req, res) => {
  let corpo = req.body.name;
  //let corpo = "Ricardo";
  let user = await new User({ name: corpo });
  user.save().then(() =>
    console.log('Usuário salvo com sucesso!'))
  res.send({ status: 'Adicionado!' });
  //repostar que tem que voltar json
  res.json({ "status": 'Adicionado com sucesso!' });
});

//deletar dados
app.delete('/deletar', async (req, res) => {
  let corpo = req.body.name;
  await User.deleteOne({ name: corpo });
  res.json({ "status": 'Deletado com sucesso!' });
});

//deletar dados por id
app.delete('/deletar/:id', async (req, res) => {
  let id = req.params.id;
  await User.deleteOne({ _id: id });
  res.json({ "status": 'Deletado com sucesso!' });
});

//alterar dados por id
app.delete('/deletar/:id', async (req, res) => {
  let id = req.params.id;
  let corpo = req.body.name;
  await User.updateOne({ _id: id }, { name: corpo });
  res.json({ "status": 'Alterado com sucesso!' });
});

//Middleware para todas as rotas
app.get('/', (req, res) => {
  res.send({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`Rodando na porta http://localhost:${port}`)
})
