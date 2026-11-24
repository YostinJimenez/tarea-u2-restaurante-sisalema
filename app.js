// dotenv es un modulo que permite cargar variables de entorno desde un archivo .env
// El npm install dotenv es para tener variables privadas en un archivo .env
require('dotenv').config();
// El npm install body-parser es para parsear las peticiones en JSON
const bodyParser = require("body-parser");
// El fs sirve para leer archivos estaticos(es decir archivos que no cambian)
const fs = require('fs');
// El path se lo usa para evitar poner toda la ruta del archivo
const path = require('path');
const usersFilePath = path.join(__dirname, 'users.json');
// llamar el controlador de la base de datos
// prisma client es un cliente que se conecta a la base de datos
// se lo usa para interactuar con la base de datos
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const express = require("express");
const LoggerMiddleware = require("./src/middlewares/looger.js");
const { isValidUser } = require("./src/utils/validation.js");
const errorHandler = require("./src/middlewares/errorHandler.js");
const authenticateToken = require("./src/middlewares/auth.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(LoggerMiddleware);
app.use(errorHandler);
// Middleware: son funciones que se ejecutan antes de que una peticion llegue al servidor
// se pueden usar para modificar la peticion o la respuesta
app.use(bodyParser.json());
// extended: true permite enviar datos complejos como imagenes y archivos.Esta linea de codigo lo unico que hace es decodificar los datos que se envian en la peticion
// En pocas palabras es para que el servidor pueda leer los datos que se envian en la peticion
app.use(bodyParser.urlencoded({ extended: true }));
// const PORT = 3000;

// variable de entorno: Son variables que se almacenan en archivos .env y se utilizan para configurar el servidor
// se pueden usar para almacenar datos sensibles como contraseñas y claves API
const PORT = process.env.PORT || 3000;
// ABPS: Analisis, Busqueda, Planeacion y Solucion


// Funcion anonimas (recibe peticion y respuesta)
// req (request) son los datos que envia el usuario al servidor
// res (response) son los datos que envia el servidor al usuario
app.get("/", (req, res) => {
    res.send(`<h1>Clase de ExpressJs12</h1>
        <p>Bienvenidos a la clase de Express</p>
        <a href="https://www.google.com">Ir a Google</a>`);
});

// ORM lo que hace esque como programar en JS pero que en realidad es base de datos
// Como prisma es una libreria que se usa para facilitar la programacion de base de datos
// Es como un traductor entre el codigo de JS y la base de datos
// En pocas palabras es para que el servidor pueda leer los datos que se envian en la peticion
// npm install prisma --save-dev
// Ahora usamos el npm install @primas/client es el controlador de la base de datos
// npm install pg
// npx prisma init es para inicializar el proyecto
// npx prisma db push es para crear la base de datos
// npx prisma db push --force es para crear la base de datos y borrar los datos existentes
// al usar el ORM tambein nos funciona migrar la base de datos a un lengujae diferente

// Dos metodos para query params y path params son formas de enviar datos al servidor
// query params: son parametros que se envian en la url ?nombre=valor&edad=25 (se lo diferencia porque tiene ?)
// path params: son parametros que se envian en la url /users/:id (se lo diferencia porque tiene :)
app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    res.send(`<h2>El usuario con el ID ${id} se envio al servidor</h2>`);
});

//Para una consulta a la base de datos se usa query params
app.get("/search", (req, res) => {
    const terms = req.query.terms || "No se proporciono el termino de busqueda";
    const category = req.query.category || "Todas";
    // como usamos query params saldria la el 
    // "http://localhost:3005/search?terms=apple&category=Electronicos"

    res.send(`
        <h2>El usuario con el termino de busqueda ${terms}<h2>
        <br style="color: red;">
        <h3>La categoria ${category}</h3>`);
});

app.post("/form", (req, res) => {
    const name = req.body.name || "Anonimo";
    const email = req.body.email || "No se proporciono el email";
    res.json({
        message: "El usuario se envio al servidor",
        data: {
            name,
            email
        }
    });
});

app.post("/api/data", (req, res) => {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({
            error: "El usuario no se envio al servidor"
        });
    }
    res.status(201).json({
        message: "El usuario se envio al servidor",
        data: data
    });
});

// Usamos el utf-8 para que el archivo se lea en formato de texto
// En caso de que el JSON tenga emojis y no le pongamos el encoding utf-8, no se mostrarían los emojis
// Por eso es importante poner el encoding utf-8

app.get("/users", (req, res) => {
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: "Error al leer el archivo de usuarios"
            });
        }
        const users = JSON.parse(data);
        res.json(users);
    });
});

app.post("/users", (req, res) => {
    const newUsers = req.body;
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: "Error al leer el archivo de usuarios"
            });
        }
        const users = JSON.parse(data);
        const validation = isValidUser(newUsers, users);
        if (!validation.valid) {
            return res.status(400).json({
                error: validation.error
            });
        }
        users.push(newUsers);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({
                    error: "Error al escribir el archivo de usuarios"
                });
            }
            res.status(201).json(newUsers);
        });
    });
});
// req.params.id es para obtener el id del usuario desde la url
// el parametro se da por los dos puntos
// toda lo que viaja en la url son texto en el http lo cual se debe convertir a numeros
app.put("/users/:id", (req, res) => {
    // El 10 es para asegurar que se convierta a base 10 por cualquier cosa
    const userId = parseInt(req.params.id, 10);
    const updatedUsers = req.body;
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: "Error al leer el archivo de usuarios"
            });
        }
        let users = JSON.parse(data);
        // se lo usa para mapear el archivo de usuarios y reemplazar el usuario con el id proporcionado
        // Lo que hace que con el users accede al primer registro y le asigna a user
        // se lo usa el id para que leea en lso query params
        // users = users.map((user) => user.id === id ? updatedUsers : user);
        users = users.map((user) =>
            user.id === userId ? { ...user, ...updatedUsers } : user,
            // lo que hace ..user desestrcuturar el objeto quiero decir de tener:
            // {id:1, name:"Juan", age: 25}
            //  desestructurado seria:
            //  {id: 1}, {name: "Juan", age: 25}
            // si quisiera cambiar el nombre por ejemplo:
            // {id:1}, {name: "Pedro", age: 25} 
            // con el updatedUsers pasa como body para actualizar los datos
        );
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            // en stringify(users, null, 2) el null es para que no se muestre en una sola linea
            // el estrunquear con el users funciona como si tubiera dos punto : 
            if (err) {
                return res.status(500).json({
                    error: "Error al escribir el archivo de usuarios"
                });
            }
            res.status(200).json(updatedUsers);
        });
    });
});

app.delete("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10);
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: "Error al leer el archivo de usuarios"
            });
        }
        let users = JSON.parse(data);
        users = users.filter((user) => user.id !== userId);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({
                    error: "Error al escribir el archivo de usuarios"
                });
            }
            res.status(200).json(users);
        });
    });
});


// Ahora vamos a ver middlewares
app.get("/error", (req, res, next) => {
    next(new Error("Error Intencional"));
});


app.use(errorHandler);
// Proceso sincrono y asincrono son formas de ejecutar funciones
// Sincrono : Es una funcion que se ejecuta de forma secuencial
// Asincrono : Es una funcion que se ejecuta de forma no secuencial
// Ejemplos de funciones asincronas son 
app.get('/db_users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.log(error);
    }

});

app.get('/protected-route', authenticateToken, (req, res) => {
    res.json({
        message: "Ruta protegida",
        user: req.user
    });
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            role: "USER"
        }
    });
    res.status(201).json({
        message: "Usuario registrado exitosamente",
    });
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
    }
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '4h' });
    res.json({ token });
});




// Metodo listen (puerto) y el callback (funcion anonima) que se ejecuta cuando el servidor se inicia 
// el callback siempre va a recibir dos parametros req y res
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto http://localhost:${PORT}`);
});


// Parciar los métodos para cada petición
// El servidor agarra solo el metodo de la peticion GET/POST/PUT/DELETE en JSON
// En cada peticiones se puede ver el sistema operativo en la cabecera, el idioma, etc


// Funciones asincronas : Son funciones que se ejecutan de forma asincrona

// Funciones sincronas : Son funciones que se ejecutan de forma sincrona
// Funciones de callback : Son funciones que se pasan como parametros a otras funciones y se ejecutan cuando la funcion principal termina
