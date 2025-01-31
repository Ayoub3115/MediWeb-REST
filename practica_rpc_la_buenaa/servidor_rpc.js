var rpc = require("./rpc_servidor.js");


const e = require("express");
const mysql = require('mysql');

// Configuración de la base de datos MySQL
const database = {
    host: "localhost",
    user: "ayoub",
    password: "telemedicina",
    database: "telemedicina"
};

// Crear la conexión a la base de datos
var conexion = mysql.createConnection(database);

conexion.connect(function (err) {
    if (err) {
        console.error("Error conectando a la base de datos:", err);
        process.exit();
    } else {
        console.log("Conectado a la base de datos MySQL");
    }
});














// Procedo a implementar los procedimientos RPC El servidor RPC implementará todas las funciones que podrá invocar el cliente

function obtenerEspecialidades(callback) {
    var sql = "SELECT * FROM especialidades";
    conexion.query(sql, function (err, result) {
        if (err) {
            console.log("Error al obtener las especialidades: ", err);
            callback(null); // Llamas al callback con null en caso de error
        } else {
           
            callback(result); // Llamas al callback con los resultados
        }
    });
}


function obtenerCentros(callback) {
    // Voy a buscar en la base de datos
    var sql = "SELECT * FROM centros";
    
    // Asegúrate de usar el objeto 'conexion' que creaste previamente
    conexion.query(sql, function (err, result) {
        if (err) {
            console.log("Error al obtener los centros: ", err);
            callback(null);  // Llamar al callback con null en caso de error
        } else {
            
            callback(result);  // Llamar al callback con el resultado
        }
    });
}


// Hago que la funcion logins compruebe si el login y la contraseña son correctos
function logins(login, password, callback) {
    var sql = "SELECT * FROM medicos WHERE login = ? AND password = ?";
    conexion.query(sql, [login, password], function (err, result) {
        if (err) {
            console.log("Error al verificar el login: ", err);
            callback(null,{ error: "Error interno del servidor." });
            return; // Salir de la función después de enviar el callback
        }

        if (result.length === 0) {
            console.log("Login incorrecto: ", { login });
            callback(null,{ error: "Login incorrecto." });
            return; // Salir de la función después de enviar el callback
        }

        console.log("Login correcto: ", { login });
        // devuelvo null luego el id del médico
        console.log(result[0].id);
        callback( result[0].id);
    });
}



// Corregir la función crearMe para aceptar los parámetros directamente
function crearMe(nombre, apellidos, login, password, especialidad, centro, callback) {
    var sql = "INSERT INTO medicos SET nombre = ?, apellidos = ?, login = ?, password = ?, especialidad_id = ?, centro_id = ?";
    conexion.query(sql, [nombre, apellidos, login, password, especialidad, centro], function (err, result) {
        if (err) {
            console.log("Error al crear médico: ", err);
            callback({ error: "Error interno del servidor." });
        } else {
            console.log("Médico creado: ", { id: result.insertId, nombre, apellidos, login, especialidad, centro });
            callback({ mensaje: "Médico creado correctamente.", id: result.insertId });
        }
    });
}


function actualizarme(id,datos, callback) {
    // extraigo los datos
    var { nombre,apellidos, login, password, especialidad_id, centro_id } = datos;

    // Creo la consulta SQL
    var sql = "UPDATE medicos SET nombre = ?, apellidos = ?, login = ?, password = ?, especialidad_id = ?, centro_id = ? WHERE id = ?";
    conexion.query(sql, [nombre, apellidos, login, password, especialidad_id, centro_id, id], function (err, result) {
        if (err) {
            console.log("Error al actualizar el médico: ", err);
            callback(null);
        } else {
            console.log("Médico actualizado: ", { id, nombre, apellidos, login, especialidad_id, centro_id });
            callback(result);
        }
    });
}






function obtenerDatosMedico(id_med, callback) {
    var sql = "SELECT * FROM medicos WHERE id = ?";
    conexion.query(sql, [id_med], function (err, result) {
        if (err) {
            console.log("Error al obtener los datos del médico: ", err);
            callback(null);
        } else {
            callback(result[0]);
        }
    });
}


function obtenerExpDisponibles(id_especialidad, callback) {
    var sql = "SELECT * FROM expedientes WHERE me IS NULL AND especialidad_id = ?";
    conexion.query(sql, [id_especialidad], function (err, result) {
        if (err) {
            console.log("Error al obtener los expedientes disponibles: ", err);
            callback(null);
        } else {
            callback(result);
        }
    });
}
// asigno el expediente y añado la fecha de asignación
function asignarExp( id_me, id_exp, callback) {
    // paso id_exp y id_me a int
    id = parseInt(id_exp);
    me = parseInt(id_me);

    fecha_asignacion = new Date();

    // los nuevos datos que se pasan son
    console.log({ id, me, fecha_asignacion });


    var sql = "UPDATE expedientes SET me = ?, fecha_asignacion = ? WHERE id = ?";
    conexion.query(sql, [me,fecha_asignacion ,id], function (err, result) {
        if (err) {
            console.log("Error al asignar el expediente: ", err);
            callback({ error: "Error interno del servidor." });
        } else {
            console.log("Expediente asignado correctamente: ", { id,me, fecha_asignacion: new Date() });
            callback({ mensaje: "Expediente asignado correctamente. Y le pongo la fecha de asigancion", fecha_asignacion: new Date() });
        }
    });
}

function obtenerExpAsignados(id_me, callback) {
    var sql = "SELECT * FROM expedientes WHERE me = ?";
    conexion.query(sql, [id_me], function (err, result) {
        if (err) {
            console.log("Error al obtener los expedientes asignados: ", err);
            callback(null);
        } else {
            callback(result);
        }
    });
}


function resolverExp(id,respuesta, callback) {
    fecha_resolucion = new Date();
    var sql = "UPDATE expedientes SET respuesta = ?, fecha_resolucion=? WHERE id = ?";
    conexion.query(sql, [respuesta,fecha_resolucion, id], function (err, result) {
        if (err) {
            console.log("Error al resolver el expediente: ", err);
            callback({ error: "Error interno del servidor." });
        } else {
            console.log("Expediente resuelto correctamente: ", { id, respuesta });
            callback({ mensaje: "Expediente resuelto correctamente." });
        }
    });
}





var servidor = rpc.server(3501, () => {
    console.log("Servidor RPC iniciado en el puerto 3501");
});

var app = servidor.createApp("gestion_hospitales");

// Registrar los procedimientos
app.registerAsync("obtenerEspecialidades", obtenerEspecialidades);
app.registerAsync("obtenerCentros", obtenerCentros);
app.registerAsync("logins", logins);
app.registerAsync("crearMe", crearMe); // Registrar función crearMe correctamente
app.registerAsync("actualizarme", actualizarme);
app.registerAsync("obtenerDatosMedico", obtenerDatosMedico);
app.registerAsync("obtenerExpDisponibles", obtenerExpDisponibles);
app.registerAsync("asignarExp", asignarExp);
app.registerAsync("obtenerExpAsignados", obtenerExpAsignados);
app.registerAsync("resolverExp", resolverExp);
