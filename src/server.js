require("express-async-errors");//Lib que vai tratar os erros
const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");

const cors = require("cors");//lib que vai fazer a comunicação do backend com o frontend
const express = require("express");//coloca toda a pasta express dentro dessa const
const routes = require("./routes");// vai carregar o arquivo index.js

migrationsRun();

const app = express();//inicializa o express na aplicação
app.use(cors());
app.use(express.json());//para fazer o node entender que a requisição sera em json

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);//para a aplicação usar essas rotas 

app.use((error, request, response, next) =>{
  if(error instanceof AppError){
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.error(error);//para debugar o erro caso precise

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  })
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));//a porta que vai receber as requisições 