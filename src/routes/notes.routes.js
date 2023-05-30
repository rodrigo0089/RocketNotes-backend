const { Router } = require("express"); //pegando o express para este aquivo

const NotesController = require("../controllers/NotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const notesRoutes = Router();

const notesController = new NotesController();

notesRoutes.use(ensureAuthenticated);//vai fazer todas as rotas usar o middleware

notesRoutes.post("/", notesController.create);//criar
notesRoutes.get("/:id", notesController.show);//mostrar 1
notesRoutes.delete("/:id", notesController.delete);//deletar
notesRoutes.get("/", notesController.index);//listar todos

module.exports = notesRoutes;