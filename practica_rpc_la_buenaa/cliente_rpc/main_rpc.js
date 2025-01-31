

var app = rpc("localhost", "gestion_hospitales");
var obtenerEspecialidades = app.procedure("obtenerEspecialidades");
var obtenerCentros = app.procedure("obtenerCentros");
var logins = app.procedure("logins");
var crearMe = app.procedure("crearMe");
var actualizarme = app.procedure("actualizarme");
var obtenerDatosMedico = app.procedure("obtenerDatosMedico");
var obtenerExpDisponibles = app.procedure("obtenerExpDisponibles");
var asignarExp = app.procedure("asignarExp");
var obtenerExpAsignados = app.procedure("obtenerExpAsignados");
var resolverExp = app.procedure("resolverExp");


// habra una primera pantalla de login o registro
// si el usuario se logea correctamente, se le redirige a la pantalla principal
// si el usuario se registra correctamente, se le redirige a la pantalla principal
// si el usuario no se logea o registra correctamente, se le muestra un mensaje de error
// este archivo es el main
// Path: cliente_rpc/main_rpc.js
// Compare this snippet from cliente_rpc/rpc_cliente.js:
// /* Hago el cliente basandome en rpc */



function obtenerEspecialidades_main() {
    // Llamo al procedimiento obtenerEspecialidades del servidor para mostrarlo en los selects

    // Obtener el select de especialidadregistro y limpiar opciones anteriores
    var selectRegistro = document.getElementById("especialidadregistro");
    selectRegistro.innerHTML = ''; // Limpiar opciones anteriores

    // Obtener el select de especialidadeditar y limpiar opciones anteriores
    var selectEditar = document.getElementById("especialidadeditar");
    selectEditar.innerHTML = ''; // Limpiar opciones anteriores

    // Obtener el select de especialidadconsulta y limpiar opciones anteriores
    var selectConsulta = document.getElementById("especialidadconsulta");
    selectConsulta.innerHTML = ''; // Limpiar opciones anteriores

    obtenerEspecialidades(function(resultado) {
        if (resultado != null) {
            console.log("Especialidades: ", resultado);
            
            // Llenar el select de especialidadregistro
            for (var i = 0; i < resultado.length; i++) {
                var option = document.createElement("option");
                option.value = resultado[i].id;
                option.innerText = resultado[i].nombre;
                selectRegistro.appendChild(option);
            }

            // Llenar el select de especialidadeditar
            for (var i = 0; i < resultado.length; i++) {
                var option = document.createElement("option");
                option.value = resultado[i].id;
                option.innerText = resultado[i].nombre;
                selectEditar.appendChild(option);
            }

            // Llenar el select de especialidadconsulta
            for (var i = 0; i < resultado.length; i++) {
                var option = document.createElement("option");
                option.value = resultado[i].id;
                option.innerText = resultado[i].nombre;
                selectConsulta.appendChild(option);
            }

        } else {
            alert("Error al obtener las especialidades");
        }
    });
}


// hago una funcion para salir del sistema (volviendo a la pantalla de login)
function salirSistema() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registroButton").style.display = "block";
    document.getElementById("editarButton").style.display = "none";
    document.getElementById("asignarExpedienteButton").style.display = "none";
    document.getElementById("nombre").style.display = "none";
    document.getElementById("resolverExpedientesboton").style.display = "none";
    document.getElementById("consultarExpedientesForm").style.display = "none";
    document.getElementById("resolverExpedientesForm").style.display = "none";
    document.getElementById("asignarExpedienteContainer").style.display = "none";
    document.getElementById("registroFormContainer").style.display = "none";
    document.getElementById("editarFormContainer").style.display = "none";
    document.getElementById("resolverExpedientesForm").style.display = "none";
    document.getElementById("asignarExpedienteButton").style.display = "none";
    document.getElementById("resolverExpedientesButton").style.display = "none";
    document.getElementById("cerrarSesionButton").style.display = "none";
    
    
}



function obtenerCentros_main() {
    // Llamo al procedimiento obtenerCentros del servidor para mostrarlo en el select de centroIdregistro y centroIdeditar

    // Obtener el select de centroIdregistro y limpiar opciones anteriores
    var selectRegistro = document.getElementById("centroIdregistro");
    selectRegistro.innerHTML = ''; // Limpiar opciones anteriores

    // Obtener el select de centroIdeditar y limpiar opciones anteriores
    var selectEditar = document.getElementById("centroIdeditar");
    selectEditar.innerHTML = ''; // Limpiar opciones anteriores

    obtenerCentros(function(resultado) {
        if (resultado != null) {
            console.log("Centros: ", resultado);
            
            // Llenar el select de centroIdregistro
            for (var i = 0; i < resultado.length; i++) {
                var option = document.createElement("option");
                option.value = resultado[i].id;
                option.innerText = resultado[i].nombre;
                selectRegistro.appendChild(option);
            }

            // Llenar el select de centroIdeditar
            for (var i = 0; i < resultado.length; i++) {
                var option = document.createElement("option");
                option.value = resultado[i].id;
                option.innerText = resultado[i].nombre;
                selectEditar.appendChild(option);
            }

        } else {
            alert("Error al obtener los centros");
        }
    });
}


var medicoId = null;
var especialidadIDD = null;




    function login_main() {
        var login = document.getElementById("login").value;
        var password = document.getElementById("password").value;
    
        
        // Llamo al procedimiento login del servidor
        logins(login, password, function (resultado) {

    
            if (resultado != null) {
                           

                
                
                // el servidor manda         callback(null, result[0].id), asi que me quedo con el result[0].id
                medicoId = resultado;
                // la linea de arriba es igual a medicoId = resultado[0].id;

                console.log("Muestro el medicoID: ", medicoId)
                document.getElementById("editarButton").style.display = "block";
                document.getElementById("loginForm").style.display = "none";
                document.getElementById("registroButton").style.display = "none";
                document.getElementById("asignarExpedienteButton").style.display = "block";
                document.getElementById("cerrarSesionButton").style.display = "block";
                // se llama a la funcion mostrarNombreApellidos
                mostrarNombreApellidos();
                // se llama a la funcion obtenerExpAsignados
                obtenerExpAsignados(medicoId);
                // se pone el bpoton de resolverExpedienteButton visible
                document.getElementById("resolverExpedientesboton").style.display = "block";
                document.getElementById("nombre").style.display = "block";
                
                
            } else {
                // Si el login no es correcto, se muestra un mensaje de error
                alert("Error en el login");
                console.log("El resultado del login es: ", resultado)
            }
        });
    }
    // al darle al boton de cerrarSesionButton se llama a la funcion salirSistema
    document.getElementById("cerrarSesionButton").addEventListener("click", salirSistema);
    

// LLamo a la funcion login_main cuando se hace click en el boton de loginButton
document.getElementById("loginButton").addEventListener("click", login_main);

// se llama a la funcion registro_main cuando se hace click en el boton de registro
// se le  pedirán todos sus datos (incluida la especialidad) menos el ID que se lo asignará el servidor automáticamente.
// El campo login no podrá estar repetido con el login de otro médico. El centro se seleccionará de un desplegable.
// Se llama a la funcion registro_main cuando se hace click en el boton de registro
document.getElementById("registroButton").addEventListener("click", function () {
    // hago que aparezca el registroFormContainer
    document.getElementById("registroFormContainer").style.display = "block";
    // oculto el loginFormContainer
    document.getElementById("loginForm").style.display = "none";
    // oculto el boton registroButton
    document.getElementById("registroButton").style.display = "none";
    // se llama a la funcion obtenerEspecialidades_main
    obtenerEspecialidades_main();
    // se llama a la funcion obtenerCentros_main
    obtenerCentros_main();
});

function registro_main() {
    var nombre = document.getElementById("nombreregistro").value;
    var apellidos = document.getElementById("apellidosregistro").value;
    var login = document.getElementById("loginregistro").value;
    var password = document.getElementById("passwordregistro").value;
    var especialidad = document.getElementById("especialidadregistro").value;
    var centro = document.getElementById("centroIdregistro").value;

    console.log("He cargado los datos del formulario de registro: ", nombre, apellidos, login, password, especialidad, centro)
    
    // Llamo al procedimiento crearMe del servidor
    crearMe(nombre, apellidos, login, password, especialidad, centro, function (resultado) {
        if (resultado && resultado.mensaje) {
            // Si el registro es correcto, se redirige a la pantalla principal
            console.log("Registro correcto: ", resultado.mensaje);
        } else {
            // Si el registro no es correcto, se muestra un mensaje de error
            alert("Error en el registro: " + (resultado.error || "Desconocido"));
        }
    });
}

// al darle al boton de cancelar registro, se oculta el registroFormContainer y se muestra el loginForm
document.getElementById("cancelarButtonregistro").addEventListener("click", function () {
    document.getElementById("registroFormContainer").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registroButton").style.display = "block";
});

// al darle al boton de guardarButtonregistro se llama a la funcion registro_main
document.getElementById("guardarButtonregistro").addEventListener("click", registro_main);

// Tendrá una opción que le permitirá editar sus datos (todos menos el ID).

function editar_main() {
    var nombre = document.getElementById("nombreeditar").value;
    var apellidos = document.getElementById("apellidoseditar").value;
    var login = document.getElementById("logineditar").value;
    var password = document.getElementById("passwordeditar").value;
    var especialidad_id = document.getElementById("especialidadeditar").value;
    var centro_id = document.getElementById("centroIdeditar").value;

    console.log("He cargado los datos del formulario de edición: ", nombre, apellidos, login, password, especialidad_id, centro_id)
    // paso a int especialidad_id y centro_id
    especialidad_id = parseInt(especialidad_id);
    centro_id = parseInt(centro_id);
    // paso las demas variables a string
    nombre = nombre.toString();
    apellidos = apellidos.toString();
    login = login.toString();
    password = password.toString();
    

   
    var datos = { nombre, apellidos, login, password, especialidad_id, centro_id };

    
    
    // Llamo al procedimiento actualizarMe del servidor
    console.log("Muestro el medicoID: ", medicoId)
    console.log("Muestro los datos: ", datos)
    actualizarme(medicoId,datos, function (resultado) {
        if (resultado != null) {
            // Si la actualización es correcta, se redirige a la pantalla principal
            console.log("Actualización correcta");
        } else {
            // Si la actualización no es correcta, se muestra un mensaje de error
            alert("Error en la actualización login ya en uso: ");
        }
    });
}


document.getElementById("editarButton").addEventListener("click", function () {
    // hago que aparezca el editarFormContainer
    document.getElementById("editarFormContainer").style.display = "block";
    
    
    document.getElementById("registroButton").style.display = "none";

    document.getElementById("editarButton").style.display = "none";
    // se llama a la funcion obtenerEspecialidades_main
    obtenerEspecialidades_main();
    // se llama a la funcion obtenerCentros_main
    obtenerCentros_main();
});

// al darle al botonn de guardarButtoneditar se llama a la funcion editar_main
document.getElementById("guardarButtoneditar").addEventListener("click", function () {
    editar_main();
    // llamo a la funcion mostrarNombreApellidos
    mostrarNombreApellidos();
   
}
);


// al darle al boton de cancelarButtoneditar se esconde el editarFormContainer
document.getElementById("cancelarButtoneditar").addEventListener("click", function () {
    document.getElementById("editarFormContainer").style.display = "none";
    
    document.getElementById("editarButton").style.display = "block";
});

// funcion para mostrar el nombre y apellidos del medico
function mostrarNombreApellidos() {
    
    var datos = obtenerDatosMedico(medicoId);
    if (datos != -1) {
        console.log("Datos del médico: ", datos);
        especialidadIDD = datos.especialidad_id;
        
        document.getElementById("nombreApellidos").innerText = datos.nombre + " " + datos.apellidos;
    }
}
// al darle al boton asignarExpedienteButton aparece el asignarExpedienteContainer
document.getElementById("asignarExpedienteButton").addEventListener("click", function () {
    document.getElementById("asignarExpedienteContainer").style.display = "block";
    document.getElementById("asignarExpedienteButton").style.display = "none";
    document.getElementById("editarButton").style.display = "none";
    mostrarExpDisponibles();
});


// Alpulsar el botón se le mostrará una tabla donde se mostrarán
// expedientes creados por MAP.  se mostrarán expedientes que cumplan las siguientes condiciones:
//No estar ya asignados a otro ME
//Que la especialidad solicitada sea la del ME que lo consulta. de cada expediente sólo se podrán ver los siguientes datos:
// Id, Nombre del MAP, Fecha de creación

function mostrarExpDisponibles() {
    console.log("Se ha llamado a mostrarExpDisponibles");
    console.log("Especialidad del médico: ", especialidadIDD);
    // paso la especialidadIDD a entero
    especialidadIDD = parseInt(especialidadIDD);
    
    expedientes = obtenerExpDisponibles(especialidadIDD);
    console.log("Expedientes disponibles: ", expedientes);

    var tbody = document.querySelector("#asignarExpedienteTable tbody");
    tbody.innerHTML = ""; // Limpiar solo el tbody

    for (let i = 0; i < expedientes.length; i++) {
        let id_expediente = expedientes[i].id;
        
        var fila = document.createElement("tr");

        var id = document.createElement("td");
        id.innerText = id_expediente;
        fila.appendChild(id);

        var fecha = document.createElement("td");
        fecha.innerText = expedientes[i].fecha_creacion;
        fila.appendChild(fecha);

        var nombre = document.createElement("td");
         var datosmap = obtenerDatosMedico(expedientes[i].map);
         var nombremap = datosmap.nombre + " " + datosmap.apellidos;

        
        nombre.innerText = nombremap;
        fila.appendChild(nombre);

        var accion = document.createElement("td");
        
        var asignarButton = document.createElement("button");
        asignarButton.innerText = "Asignar";
        
        asignarButton.addEventListener("click", function() {
            asignarExpediente_main(id_expediente);
            
            // Hago un bucle for para recorrer los expedientes y mostrar el expediente que se ha seleccionado
            for (let j = 0; j < expedientes.length; j++) {
                if (expedientes[j].id === id_expediente) {
                    console.log(" voy a mostrar el sip del expediente: ", expedientes[j].sip); 
                    cargarDatosExpediente(expedientes[j]);
                }
            }
            
            document.getElementById("consultarExpedientesForm").style.display = "block";
            document.getElementById("resolverExpedientesButton").style.display = "none";
        });

        accion.appendChild(asignarButton);
        fila.appendChild(accion);
        tbody.appendChild(fila);
    }
}


// asignará ese expediente al ME. Al asignarlo se asignaran automáticamente los campos del expediente:
// me: con el id del ME que lo ha tomado fecha_asignacion: con la fecha actual
// Se abrirá una ficha donde el ME podrá consultar el expediente 

function asignarExpediente_main(id_expediente) {
    console.log("Se ha llamado a asignarExpediente_main");
    // obtengo el id del expediente seleccionado  que se ha seleccionado en la tabla

    console.log("He cargado los datos del formulario de asignar expediente: ", id_expediente)
    console.log("Muestro el medicoID: ", medicoId)
    // Llamo al procedimiento asignarExp del servidor
    asignarExp(medicoId, id_expediente, function (resultado) {
        if (resultado != false) {
            // Si la asignación es correcta, se redirige a la pantalla principal
            console.log("Asignación correcta", resultado);
            
            console.log("He llamado a mostrarExpDisponibles");
            console.log("Se ha actulizado el expediente: ", id_expediente);

        } else {
            // Si la asignación no es correcta, se muestra un mensaje de error
            alert("Error en la asignación: " + (resultado.error || "Desconocido"));
        }
    });
}
// al pulsar el boton cancelarAsignarExpedienteButton se oculta el asignarExpedienteContainer
document.getElementById("cancelarAsignarExpedienteButton").addEventListener("click", function () {
    document.getElementById("asignarExpedienteContainer").style.display = "none";
    document.getElementById("asignarExpedienteButton").style.display = "block";
    document.getElementById("editarButton").style.display = "block";
    mostrarExpDisponibles();
    
});

// Función para cargar los datos del expediente en el formulario de consulta. En el caso de especialidad, se mostrará el nombre de la especialidad y no el ID.
function cargarDatosExpediente(expedientes) {
    
        
        document.getElementById('idExpediente').value = expedientes.id ;
        document.getElementById('fechaCreacion').value = expedientes.fecha_creacion ;
        document.getElementById('fechaAsignacion').value = expedientes.fecha_asignacion;
        document.getElementById('fechaResolucion').value = expedientes.fecha_resolucion || '';
        obtenerEspecialidades(function (resultado) {
            if (resultado != null) {
                console.log("Especialidades: ", resultado);
                
                
                for (var i = 0; i < resultado.length; i++) {
                    if (resultado[i].id == expedientes.especialidad) {
                        document.getElementById('especialidadconsulta').value = resultado[i].nombre;
                        console.log("Muestro la especialidad: ", resultado[i].nombre);
                    }
                }
            } else {
                alert("Error al obtener las especialidades");
            }
        });
        
        document.getElementById('sip').value = expedientes.sip || '';
        
        document.getElementById('nombrePaciente').value = expedientes.nombre || '';
        document.getElementById('apellidosPaciente').value = expedientes.apellidos || '';
        document.getElementById('observaciones').value = expedientes.observaciones || '';
        document.getElementById('solicitud').value = expedientes.solicitud || '';
        document.getElementById('respuesta').value = expedientes.respuesta || '';

        // oculto el asignarExpedienteContainer
        document.getElementById("asignarExpedienteContainer").style.display = "none";
    

}

// al pulsar el boton cancelarConsultarExpedientesButton se oculta el consultarExpedientesForm
document.getElementById("cancelarConsultarExpedientesButton").addEventListener("click", function () {
    document.getElementById("consultarExpedientesForm").style.display = "none";
    document.getElementById("asignarExpedienteButton").style.display = "block";
    document.getElementById("editarButton").style.display = "block";
    mostrarExpDisponibles();
    
});


// Funcion para mostrar los expedientes que tengan el me igual al medicoId
function mostrarresolver(){
    console.log("He llamado a resolver");
    expedientesasig = obtenerExpAsignados(medicoId);
    // con el resultado de obtenerExpAsignados cargo los datos en la tabla resolverExpedientesTable
    var tbody = document.querySelector("#resolverExpedientesTable tbody");
    tbody.innerHTML = ""; // Limpiar solo el tbody

    for(let i = 0; i < expedientesasig.length; i++){
        let id_expediente = expedientesasig[i].id;

        var fila = document.createElement("tr");

        var id = document.createElement("td");
        id.innerText = id_expediente;
        fila.appendChild(id);

        var fecha = document.createElement("td");
        fecha.innerText = expedientesasig[i].fecha_creacion;
        fila.appendChild(fecha);

        var fecha_asignacion = document.createElement("td");
        fecha_asignacion.innerText = expedientesasig[i].fecha_asignacion;
        fila.appendChild(fecha_asignacion);

        var fecha_resolucion = document.createElement("td");
        fecha_resolucion.innerText = expedientesasig[i].fecha_resolucion;
        fila.appendChild(fecha_resolucion);

        var sip = document.createElement("td");
        sip.innerText = expedientesasig[i].sip;
        fila.appendChild(sip);

        var accion = document.createElement("td");

        var resolverButton = document.createElement("button");
        resolverButton.innerText = "Resolver";

        

        resolverButton.addEventListener("click", function() {
            console.log("He llamado a la funcion resolverExpediente_main con el idexpediente: ", id_expediente);
            resolverExpediente_main(id_expediente);
            // Hago un bucle for para recorrer los expedientes y mostrar el expediente que se ha seleccionado
            for (let j = 0; j < expedientesasig.length; j++) {
                if (expedientesasig[j].id === id_expediente) {
                    console.log("Voy a mostrar el sip del expediente: ", expedientesasig[j].sip); 
                    cargarDatosExpediente(expedientesasig[j]);
                }
            }
            
            document.getElementById("consultarExpedientesForm").style.display = "block";
            document.getElementById("resolverExpedientesButton").style.display = "block";
            document.getElementById("consultarExpedientesForm").style.display = "block";
            document.getElementById("resolverExpedientesForm").style.display = "none";
            document.getElementById("resolverExpedientesboton").style.display = "block";
            document.getElementById("editarButton").style.display = "block";
            // oculto el boton de asignarExpedienteButton
            document.getElementById("asignarExpedienteButton").style.display = "none";
        });

        

        accion.appendChild(resolverButton);
        
        fila.appendChild(accion);

        tbody.appendChild(fila);
    }
}


// al pulsar el boton resolverExpedientesboton se llama a la funcion resolver
document.getElementById("resolverExpedientesboton").addEventListener("click", function () {
    document.getElementById("resolverExpedientesForm").style.display = "block";
    document.getElementById("resolverExpedientesboton").style.display = "none";
    document.getElementById("editarButton").style.display = "none";
    mostrarresolver();
});

// al pulsar el boton cancelarResolverExpedientesButton se oculta el resolverExpedientesForm
document.getElementById("cancelarResolverExpedientesButton").addEventListener("click", function () {
    document.getElementById("resolverExpedientesForm").style.display = "none";
    document.getElementById("resolverExpedientesboton").style.display = "block";
    document.getElementById("editarButton").style.display = "block";
    mostrarExpDisponibles();
    
});



function resolverExpediente_main(id_expediente){
    console.log("He llamado a resolverExpediente_main");
    // obtengo el id del expediente seleccionado  que se ha seleccionado en la tabla

    console.log("He cargado los datos del formulario de resolver expediente: ", id_expediente)
    
    // cargo lo que hay dentro de el label de respuesta
    var mensaje = document.getElementById("respuesta").value;
    // Llamo al procedimiento resolverExp del servidor
    resolverExp( id_expediente,mensaje, function (resultado) {
        if (resultado != false) {
            // Si la asignación es correcta, se redirige a la pantalla principal
            console.log("Resolución correcta", resultado);
            
            console.log("He llamado a resolverExpediente_main");
            console.log("Se ha resuelto el expediente: ", id_expediente);

        } else {
            // Si la asignación no es correcta, se muestra un mensaje de error
            alert("Error en la resolución de resolverExpediente_main: " + (resultado.error || "Desconocido"));
        }
    });
}

// funcion para asignar todos los expedientes disponibles




// al pulsar el boton resolverExpedientesButton se llama a la funcion resolverExpediente_main
document.getElementById("resolverExpedientesButton").addEventListener("click", function () {
    document.getElementById("resolverExpedientesForm").style.display = "block";
    document.getElementById("resolverExpedientesboton").style.display = "none";
    document.getElementById("editarButton").style.display = "none";
    mostrarresolver();
    
});






















