const express = require("express");
const todosRoutes = express.Router();
const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();

//C
todosRoutes.post("/todos", async (request, response) => {
    const { name } = request.body;
    const { titulo } = request.body;
    const { data } = request.body;
    const { hora } = request.body;
    const todo = await prisma.todo.create({
        data: {
            titulo,
            name,
            data,
            hora

        },
    });

    return response.status(201).json(todo);
});
//R
todosRoutes.get("/todos", async (request, response) => {
    const todos = await prisma.todo.findMany();
    return response.status(200).json(todos);
});
//U
todosRoutes.put("/todos", async (request, response) => {
    const { titulo, status, name, data, hora, id } = request.body;

    if (!id) {
        return response.status(400).json("Id is not mandatory");
    }

    const todoAlreadyExist = await prisma.todo.findUnique({ where: { id } });

    if (!todoAlreadyExist) {
        return response.status(404).json("Todo not exist");
    }

    const todo = await prisma.todo.update({
        where: {
            id,
        },
        data: {
            titulo,
            status,
            name,
            data,
            hora,
        },
    });

    return response.status(200).json(todo);
});
//D

todosRoutes.delete("/todos/:id", async (request, response) => {
    const { id } = request.params

    const inId = parseInt(id)

    if (!inId) {
        return response.status(400).json("Id is not mandatory");
    }

    const todoAlreadyExist = await prisma.todo.findUnique({
        where: { id: inId },
    });

    if (!todoAlreadyExist) {
        return response.status(404).json("Todo not exist");
    }

    await prisma.todo.delete({ where: { id: inId } });
    return response.status(200).send()

});

module.exports = todosRoutes;