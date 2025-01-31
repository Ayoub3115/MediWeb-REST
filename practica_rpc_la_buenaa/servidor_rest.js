const express = require('express');

const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Configuración de la base de datos MySQL
const database = {
    host: "localhost",
    user: "ayoub",
    password: "telemedicina",
    database: "telemedicina"
};

// Crear la conexión a la base de datos
var connection = mysql.createConnection(database);

connection.connect(function (err) {
    if (err) {
        console.error("Error conectando a la base de datos:", err);
        process.exit();
    } else {
        console.log("Conectado a la base de datos MySQL");
    }
});

// Servir archivos estáticos desde la carpeta "cliente"
app.use("/cliente", express.static("cliente"));

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(bodyParser.json());

// Ruta para manejar la solicitud de inicio de sesión (POST)
app.post('/api/medico/login', (req, res) => {
    const { login, password } = req.body;

    const query = 'SELECT * FROM medicos WHERE login = ? AND password = ? AND especialidad_id IS NULL'; // Cambia aquí
    
    connection.query(query, [login, password], (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err); // Imprimir el error
            return res.status(500).json({ error: 'Error en la consulta SQL', details: err });
        }
        
        if (results.length > 0) {
            const usuarioEncontrado = results[0];
            const queryExpedientes = 'SELECT * FROM expedientes WHERE especialidad_id IS NULL'; // Cambia aquí también
            connection.query(queryExpedientes, [usuarioEncontrado.especialidad], (err, expedientes) => {
                if (err) {
                    console.error("Error al obtener expedientes:", err); // Imprimir el error
                    return res.status(500).json({ error: 'Error al obtener expedientes', details: err });
                }
                res.status(200).json({ usuario: usuarioEncontrado, expedientes });
            });
        } else {
            console.log("Usuario no encontrado"); // Imprimir el mensaje en la consola
            res.status(401).json({ message: 'Usuario no encontrado' });
        }
    });
});


// Ruta para obtener todas las especialidades (GET)
app.get('/api/especialidad', (req, res) => {
    const query = 'SELECT * FROM especialidades';
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json(results);
    });
});

// Ruta para obtener todos los centros (GET)
app.get('/api/centros', (req, res) => {
    const query = 'SELECT * FROM centros';
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json(results);
    });
});

// Ruta para obtener los datos de un médico por ID (GET)
app.get('/api/medico/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM medicos WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ error: 'El ID del médico no existe' });
        }
    });
});

// Ruta para obtener los expedientes de un médico por ID (GET)
app.get('/api/medico/:id/expedientes', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM expedientes WHERE map = ?';
    connection.query(query, [id], (err, results) => {
        // en la linea de arriba se cambia el map por el id del medico
        
        if (err) return res.status(500).json({ error: err });
        res.status(200).json(results);
        
    });
});

// Ruta para registrar un nuevo médico (POST)
app.post('/api/medico', (req, res) => {
    const { nombre, apellidos, login, password, centro_id } = req.body;
    
    const query = 'SELECT * FROM medicos WHERE login = ?';
    connection.query(query, [login], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) {
            return res.status(400).json({ error: 'El login ya está en uso' });
        }

        const nuevoMedico = {
            nombre,
            apellidos,
            password,
            especialidad_id: null, // si es válido
            login,
            centro_id
        };
        
        // Hago un console.log para ver si el objeto nuevoMedico se crea correctamente
        console.log(nuevoMedico);
        
        const insertQuery = 'INSERT INTO medicos SET ?';
        connection.query(insertQuery, nuevoMedico, (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.status(201).json({ message: 'Registro exitoso' });
        });
    });
});

// Ruta para actualizar los datos de un médico por ID (PUT)
app.put('/api/medico/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, apellidos, login, password, centro_id } = req.body;

    const query = 'SELECT * FROM medicos WHERE login = ? AND id != ?';
    connection.query(query, [login, id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) {
            return res.status(400).json({ error: 'El login ya está en uso' });
        }

        const updateQuery = 'UPDATE medicos SET ? WHERE id = ?';
        const medicoActualizado = { nombre, apellidos, login, password, centro_id };
        connection.query(updateQuery, [medicoActualizado, id], (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.status(200).json({ message: 'Datos actualizados exitosamente' });
        });
    });
});

// Ruta para eliminar un expediente por ID (DELETE)
app.delete('/eliminarExpediente/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM expedientes WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.affectedRows > 0) {
            res.status(200).json({ message: 'Expediente eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'El ID del expediente no existe' });
        }
    });
});

// Ruta para actualizar un expediente por ID (PUT)
app.put('/api/expediente/:id', (req, res) => {
    const id = req.params.id;
    // paso las fechas de texto a formato datetime que vienen en las variables de req.body fecha_creacion, fecha_asignacion
    // fecha_resolucion
    const expedienteActualizado = { ...req.body, fecha_creacion: new Date(req.body.fecha_creacion), fecha_asignacion: new Date(req.body.fecha_asignacion), fecha_resolucion: new Date(req.body.fecha_resolucion) };

    //const expedienteActualizado = { ...req.body};

    
    //const expedienteActualizado = { ...req.body };
    console.log(expedienteActualizado);

    const query = 'UPDATE expedientes SET ? WHERE id = ?';
    connection.query(query, [expedienteActualizado, id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Datos del expediente actualizados exitosamente' });
    });
});

// Ruta para crear un nuevo expediente (POST)
app.post('/api/map/:id/expedientes', (req, res) => {
    
    const nuevoma = req.params.id;
    // paso el nuevomap de texto a numero
    const nuevomap = parseInt(nuevoma);
    // fecha_creacion va a tener formato datetime
    const nuevoExpediente = { ...req.body, map: nuevomap, fecha_creacion: new Date() };
    // nuevoExpediente es el objeto que se va a insertar en la base de datos y los 
    

    console.log(nuevomap, nuevoExpediente)

    const query = 'INSERT INTO expedientes SET ?';
    console.log(query)
    connection.query(query, nuevoExpediente, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'Expediente creado exitosamente' });
    });
});

// añado una funcion para obtener los medicos pertenecientes a una provincia
app.get('/api/provincia/:provincia', (req, res) => {
    var id = null
    const provincia = req.params.provincia;
    const query = 'SELECT * FROM provincias WHERE nombre = ?'; 
    connection.query(query, [provincia], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        
        
        id = results[0].id;
        console.log("dentro",id);
        // ahora busco los medicos que pertenecen a esa provincia

        const query2 = 'SELECT * FROM medicos WHERE provincia = ?';
        connection.query(query2, [id], (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.status(200).json(results);
        }
        );
    }
    );
}
);





    

// Escuchar en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});

