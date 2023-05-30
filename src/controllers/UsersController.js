const { hash, compare } = require('bcryptjs')
const AppError = require("../utils/AppError");
const sqliteConnection = require('../database/sqlite')

class UsersController {
  async create(request, response){
    const {name , email, password} = request.body;//vai pegar o que for passado no corpo da requisição

    const database = await sqliteConnection();

    //se retornar qualquer registro aqui significa que ja tem algum usuário usando esse email
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(checkUserExists){
      throw new AppError('Este e-mail já está em uso.');
    }

    const hashedPassword = await hash(password, 8)

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json();
  }

  async update(request, response){
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    //chama o banco de dado nessa função
    const database = await sqliteConnection();

    //faz a leitura de todos os usuários que foi passado através do request.params
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    //verifica se o usuário existe
    if(!user) {
      throw new AppError("Usuário não encontrado");
    }

    //faz a leitura de todos os emails da tabela users que foi passado através do request.body
    const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
      throw new AppError("este email já está em uso.")
    }

    //vai pegar o name que foi lido pelo SELECT e passa o name que foi passado pelo request.params
    user.name = name ?? user.name;//use name se foi passado, se não use user.name
    user.email = email ?? user.email;

    //Condicional que verifica se a senha antiga foi digitada 
    if(password  && !old_password){
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha")
    }
    
    //Condicional que verifica se a senha antiga esta correta
    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)
      
      //se não digitou a senha antiga então dispara o AppError
      if (!checkOldPassword) {
        throw new AppError("A senha não confere.")
      }

      //criptografa a nova senha
      user.password = await hash(password, 8)
    }

    //se passou por todas as condicional então atualiza o que foi passado 
    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );

    return response.json();

  }

}
module.exports = UsersController;