
// Ocultar la sección de datos del médico y sus expedientes inicialmente
document.getElementById('datosMedico').style.display = 'none';
let userId = null;
function login() {
    // Obtener los valores del formulario de inicio de sesión del html
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    const data = {
        login: login,
        password: password
    };

    // Envio la solicitud POST al servidor utilizando la librería rest.js
    rest.post('/api/medico/login', data, (status, response) => {
        if (status === 200) {
            console.log('Inicio de sesión exitoso:', response); // Mensaje del servidor
            userId = response.usuario.id;
            
            // Mostrar la sección de datos del médico y sus expedientes
            document.getElementById('datosMedico').style.display = 'block';
            // Mostrar el botón de "Editar Datos"
            document.getElementById('editarDatosButton').style.display = 'block';
            // Mostrar la tabla con expedientes
            document.getElementById('tablaExpedientes').style.display = 'block';
            // Ocultar el formulario de inicio de sesión
            document.getElementById('loginForm').style.display = 'none';
            // Ocultar el botón de registro
            document.getElementById('registerButton').style.display = 'none';
            // Aparece el boton nuevo expediente
            document.getElementById('nuevoExpedienteButton').style.display = 'block';
            console.log(`userId es: ${userId}`)
            // ahora almaceno el id del medico en el local storage
            localStorage.setItem('userId', userId);
            // ahora llamo a la funcion obtenerexpedientesMedico
            obtenerexpedientesMedico();
            // ahora llamo a la funcion obtenerDatosMedico
            obtenerDatosMedico();
            // aparece el boton de cerrar sesion
            document.getElementById('logoutButton').style.display = 'block';
            obtenerCentros();

            obtenerNombreEspecialidad();
            
        } else {
            console.error('Error:', message);
        }
    });
}

function registro() {
    obtenerCentros();
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const login = document.getElementById('loginRegistro').value;
    const password = document.getElementById('passwordRegistro').value;
    const centroId = document.getElementById('centroId').value;
    

    const data = {
        nombre: nombre,
        apellidos: apellidos,
        login: login,
        password: password,
        centro_id: centroId
    };
    rest.post('/api/medico', data, (status, response) => {
        if (status === 201) {
            console.log('Registro exitoso:', response); // Mensaje del servidor
            // Aquí puedes redirigir a otra página o realizar alguna acción adicional
        } else {
            console.error('Error registro:', response.error);
            
        }
    });
}
// creo una variable para alamcenaar las especialidades

function obtenerNombreEspecialidad() {
    // hago una peticion get al servidor para obtener los datos de la especialidad para tener un array con las especialidades
    rest.get('/api/especialidad', (status, response) => {
        if (status === 200) {
            console.log('Especialidades cargadas:', response);
            

            

            // ahora en el desplegable especialidad y especialidadNuevo añado las especialidades el value es el id 
            // y el texto es el nombre de la especialidad
            const especialidades = response;
            const select = document.getElementById('especialidad');
            const selectNuevo = document.getElementById('especialidadNuevo');
            select.innerHTML = '';
            selectNuevo.innerHTML = '';
            especialidades.forEach(especialidad => {
                const option = document.createElement('option');
                option.value = especialidad.id;
                option.text = especialidad.nombre;
                select.appendChild(option);
                const optionNuevo = document.createElement('option');
                optionNuevo.value = especialidad.id;
                optionNuevo.text = especialidad.nombre;
                selectNuevo.appendChild(optionNuevo);
            });
            
            

        }
});

        

}



// funcion para obtener datos del medico
function obtenerDatosMedico() {
    rest.get(`/api/medico/${userId}`, (status, response) => {
        if (status === 200) {
            console.log('Datos del medico:', response);
            document.getElementById('nombreEdit').value = response.nombre;
            document.getElementById('apellidosEdit').value = response.apellidos;
            document.getElementById('loginEdit').value = response.login;
            document.getElementById('passwordEdit').value = response.password;
            document.getElementById('centroIdEdit').value = response.centroId;
            document.getElementById('bienvenida').innerHTML = `Bienvenido ${response.nombre} ${response.apellidos}`;
        }
    }
    );
    // añado en el div bienvenida el nombre del medico diciendo bienvenido nombre y apellidos del medico
    

    
    


    
}

// funcion para obtener los centros
function obtenerCentros() {
    rest.get('/api/centros', (status, response) => {
        if (status === 200) {
            console.log('Centros cargados:', response);
            const centros = response;
            console.log('Centros:', centros);
            
            // Obtener los selects
            const select = document.getElementById('centroId');
            const selectEdit = document.getElementById('centroIdEdit');
            
            // Limpiar los selects antes de agregar nuevas opciones
            select.innerHTML = '';  // Vaciar select principal
            selectEdit.innerHTML = '';  // Vaciar select de edición

            // Agregar las nuevas opciones
            centros.forEach(centro => {
                const option = document.createElement('option');
                option.value = centro.id;
                option.text = centro.nombre;
                select.appendChild(option);

                const optionEdit = document.createElement('option');
                optionEdit.value = centro.id;
                optionEdit.text = centro.nombre;
                selectEdit.appendChild(optionEdit);


               
            });
        }
    });
}



// esta funcion se llama una vez que el medico se ha logueado

function obtenerexpedientesMedico() {
    console.log('se ha llamado a la funcion obtenerexpedientesMedico')
    // hago que la variable userId sea igual al id del medico logueado y que no sea null

    
    console.log(`èstoy en obtenerexpedientesMedico y userId es: ${userId}`)
    rest.get(`/api/medico/${userId}/expedientes`, (status, response) => {
        if (status === 200) {
            console.log('Expedientes cargados:', response);
            
            // llano a la funcion cargarEspecialidadesYMostrarDatos
            cargarEspecialidadesYMostrarDatos(response);
            


        } else {
            console.error('Error al obtener los datos del medico:', response.error);
        }
    });
}






function mostrarLogin() {
    document.getElementById('datosMedico').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerButton').style.display = 'block';
    
}

function cerrarSesion() {
    document.getElementById('consultarExpedientesForm').style.display = 'none';
   
    // Mostrar el formulario de inicio de sesión y el botón de registro
    mostrarLogin();
}


document.getElementById('logoutButton').addEventListener('click', function() {
    // Llamar a la función para cerrar la sesión al hacer clic en el botón
    cerrarSesion();
    // ahora elimino el id del medico del local storage
    localStorage.removeItem('userId');
    // oculto el boton de cerrar sesion
    document.getElementById('logoutButton').style.display = 'none';
    // oculto el boton de nuevo expediente
    document.getElementById('nuevoExpedienteButton').style.display = 'none';
    // oculto el boton de editar datos
    document.getElementById('editarDatosButton').style.display = 'none';
    // oculto la tabla de expedientes
    document.getElementById('tablaExpedientes').style.display = 'none';
    // oculto el formulario de edicion de datos
    document.getElementById('editarDatosFormContainer').style.display = 'none';
    // oculto el formulario de consulta de expedientes
    document.getElementById('consultarExpedientesForm').style.display = 'none';
    // oculto el formulario de nuevo expediente
    document.getElementById('nuevoExpedienteForm').style.display = 'none';
    // oculto el formulario de registro
    document.getElementById('registroFormContainer').style.display = 'none';

});



function editarDatos() {
    const nombre = document.getElementById('nombreEdit').value;
    const apellidos = document.getElementById('apellidosEdit').value;
    const login = document.getElementById('loginEdit').value;
    const password = document.getElementById('passwordEdit').value;
    const centroId = document.getElementById('centroIdEdit').value;

    

    const data = {
        nombre: nombre,
        apellidos: apellidos,
        login: login,
        password: password,
        centro_id: centroId
    };

    console.log('Datos a editar:', data);

    // Enviar la solicitud PUT al servidor incluyendo el ID del medico en la URL
    rest.put(`/api/medico/${userId}`, data, (status, response) => {
        if (status === 200) {
            console.log('Datos actualizados:', response);
        } else {
            // hago un alert para que salga un mensaje de error
            alert('Error al actualizar los datos del medico:', response);
        }
    });
}



// Función para obtener el ID del usuario a editar
function getUserId() {
    // Aquí puedes implementar la lógica para obtener el ID del médico desde la sesión actual
    // Por ejemplo, si el ID del usuario está almacenado en localStorage:
    const userId = localStorage.getItem('userId');
    
    // Si estás utilizando algún otro método para gestionar sesiones, ajusta esta función en consecuencia.

    return userId;
}



function eliminarExpediente(idExpediente) {
    rest.delete(`/eliminarExpediente/${idExpediente}`, (status, response) => {
        if (status === 200) {
            console.log('Expediente eliminado:', response.message);
            alert('Expediente eliminado exitosamente');
            // Aquí puedes realizar alguna acción adicional después de eliminar el expediente
        } else {
            console.error('Error al eliminar expediente:', response.error);
        }
    });
}



document.getElementById('guardarEditButton').addEventListener('click', editarDatos);




let especialidades = [];

// Función para cargar las especialidades
function cargarEspecialidades(callback) {
    rest.get('/api/especialidad', (status, response) => {
        if (status === 200) {
            console.log('Especialidades cargadas:', response);
            especialidades = response;
            callback(); // Llama al callback después de cargar las especialidades
        } else {
            console.error('Error al cargar las especialidades:', response.error);
        }
    });
}

// Función para mostrar datos en la tabla
function mostrarDatos(expedientes) {
    console.log('Expedientes del medico completos:', expedientes);

    const tabla = document.getElementById('tablaExpedientes');
    tabla.innerHTML = '';

    // Agregar encabezados una sola vez fuera del bucle
    const encabezados = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Fecha Cre.</th>
                <th>Fecha Asig</th>
                <th>Fecha Res</th>
                <th>Especialidad</th>
                <th>SIP</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
    `;
    tabla.innerHTML = encabezados;

    // Agregar filas de datos dentro del bucle y en especialidades pongo el nombre de la especialidad en vez del id
    expedientes.forEach(expediente => {
        // Obtener el nombre de la especialidad a partir del id
        let nombreEspecialidad = '';
        const especialidad = especialidades.find(especialidad => especialidad.id === expediente.especialidad_id);
        console.log('Especialidad AHORA:', especialidad);
        if (especialidad) {
            nombreEspecialidad = especialidad.nombre;
        }

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${expediente.id}</td>
            <td>${expediente.fecha_creacion}</td>
            <td>${expediente.fecha_asignacion}</td>
            <td>${expediente.fecha_resolucion}</td>
            <td>${nombreEspecialidad}</td>
            <td>${expediente.sip}</td>
            <td>
                <button onclick="eliminarExpediente(${expediente.id})">Eliminar</button>
                <button onclick="consultarexp(${expediente.id})">Consultar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });

    // Cerrar el cuerpo de la tabla una vez terminadas las filas de datos
    tabla.innerHTML += `</tbody>`;
}

// Cargar especialidades y luego mostrar datos
function cargarEspecialidadesYMostrarDatos(expedientes) {
    cargarEspecialidades(() => mostrarDatos(expedientes));
}





let mesp = '';

// Función para cargar los datos del expediente en el formulario de consulta
function cargarDatosExpediente(expediente) {
    document.getElementById('idExpediente').value = expediente.id || '';
    document.getElementById('fechaCreacion').value = expediente.fecha_creacion || '';
    document.getElementById('fechaAsignacion').value = expediente.fecha_asignacion || null;
    document.getElementById('fechaResolucion').value = expediente.fecha_resolucion || null;
    document.getElementById('especialidad').value = expediente.especialidad_id || '';
    document.getElementById('especialidadNuevo').value = expediente.especialidad_id || '';
   

    
    // obtengo el nombre del me a partir del id
    rest.get(`/api/medico/${expediente.me}`, (status, response) => {
        if (status === 200) {
            mesp = response.nombre + ' ' + response.apellidos;
            console.log('Nombre del medico en me:', mesp);
            
            // guardo en el local storage el mesp
            localStorage.setItem('mesp', mesp);
            
            // actualizar el campo 'me' con el nombre del médico
            document.getElementById('me').value = mesp;
        } else {
            console.log('Error al obtener el nombre del medico:', status);
            // Manejo de errores, en caso de que no se pueda obtener el nombre del médico
            document.getElementById('me').value = '';
        }
    });
    
    // otros campos
    document.getElementById('sip').value = expediente.sip || '';
    document.getElementById('nombrePaciente').value = expediente.nombre || '';
    document.getElementById('apellidosPaciente').value = expediente.apellidos || '';
    document.getElementById('observaciones').value = expediente.observaciones || '';
    document.getElementById('solicitud').value = expediente.solicitud || '';
    document.getElementById('respuesta').value = expediente.respuesta || '';
    document.getElementById('fechaNacimiento').value = expediente.fechaNacimiento || '';
    document.getElementById('sexoNuevo').value = expediente.genero || '';
}


// Función para mostrar los datos del expediente al consultar
function mostrarDatosExpediente(expediente) {
    cargarDatosExpediente(expediente);
    // Mostrar el formulario de consulta de expedientes
    document.getElementById('consultarExpedientesForm').style.display = 'block';
}
// Al darle al boton de consultar se llama a la funcion
document.getElementById('consultarExpedienteButton').addEventListener('click', function() {
    const idExpediente = document.getElementById('idExpediente').value;
    // Llamar a la función para consultar el expediente por su ID
    consultarexp(idExpediente);
    guardarExpediente(idExpediente);
});





document.getElementById('cancelarConsultarExpedientesButton').addEventListener('click', function() {
    // Mostrar la tabla de expedientes
    document.getElementById('tablaExpedientes').style.display = 'block';
    
    // Ocultar el formulario de consulta del expediente
    document.getElementById('consultarExpedientesForm').style.display = 'none';
    
    // Ahora muestro los datos del medico en la funcion mostrarDatos
    
    obtenerexpedientesMedico();





});

// Funcion para recibir los datos del formulariod del expediente al darle al boton de guardar
document.getElementById('guardarConsultarExpedientesButton').addEventListener('click', function() {
    console.log("se ha llamado a la funcion guardarexpedientes")
    const idEx = document.getElementById('idExpediente').value;
    // Llamar a la función guardarExpediente al hacer clic en el botón
    guardarExpediente(idEx);
});

function guardarExpediente(idExpediente) {
    
    const idt = document.getElementById('idExpediente').value;
    const fechacreacion = document.getElementById('fechaCreacion').value;
    const fechaAsignacion = document.getElementById('fechaAsignacion').value;
    const fechaResolucion = document.getElementById('fechaResolucion').value;
    const sip = document.getElementById('sip').value;
    const nombre = document.getElementById('nombrePaciente').value;
    const apellidos = document.getElementById('apellidosPaciente').value;
    const observaciones = document.getElementById('observaciones').value;
    const solicitud = document.getElementById('solicitud').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const sexo = document.getElementById('sexoNuevo').value;

    const especialida = document.getElementById('especialidadNuevo').value;
    const especialidad = parseInt(especialida);
    // paso a date
   

    const id = parseInt(idt);



    const data = {
        id: id,
        fecha_creacion: fechacreacion,
        fecha_asignacion: fechaAsignacion,
        fecha_resolucion: fechaResolucion,
        especialidad_id: especialidad, // Solo una vez
        sip: sip,
        nombre: nombre,
        apellidos: apellidos,
        observaciones: observaciones,
        solicitud: solicitud,
        map: userId,
        fechaNacimiento: fechaNacimiento,
        genero: sexo
    };
    

    console.log('Datos del expediente a guardar:', data);

    // Enviar la solicitud Put al servidor para guardar el expediente
    rest.put(`/api/expediente/${idExpediente}`, data, (status, response) => {
       
        if (status === 200) {
            console.log('Expediente guardado:', response);
            // Aquí puedes realizar alguna acción adicional después de guardar el expediente
        } else {
            console.error('Error al guardar expediente:', response.error);
        }
    });
}


// Función para rellenar los datos del expediente en el formulario de consulta


function rellenarDatosExpediente() {
    console.log('se ha llamado a la funcion rellenarDatosExpediente')

    // Ahora envio las datos al servidor con el metodo post
   
    const especialida = document.getElementById('especialidadNuevo').value;
    const sip = document.getElementById('sipNuevo').value;
    const nombre = document.getElementById('nombrePacienteNuevo').value;
    const apellidos = document.getElementById('apellidosPacienteNuevo').value;
    const observaciones = document.getElementById('observacionesNuevo').value;
    const solicitud = document.getElementById('solicitudNuevo').value;
    const fechaNacimiento = document.getElementById('fechaNacimientoNuevo').value;
    const sexo = document.getElementById('sexoNuevo').value;

    const especialidad = parseInt(especialida);
    // la linea anterior d

    const data = {
        
        especialidad_id: especialidad,
        sip: sip,
        nombre: nombre,
        apellidos: apellidos,
        observaciones: observaciones,
        solicitud: solicitud,
        fechaNacimiento: fechaNacimiento,
        genero: sexo,
        
    };
    

    console.log('Datos del expediente a guardar:', data);

    // Enviar la solicitud post al servidor para guardar el expediente al darle al boton de guardar
    rest.post(`/api/map/${userId}/expedientes`, data, (status, response) => {
        if (status === 201) {
            console.log('Expediente guardado:', response);
            // Aquí puedes realizar alguna acción adicional después de guardar el expediente
            // ahora pongo el id del nuevo expediente en el formulario
            console.log('id del expediente guardado:', response);
        } else {
            console.error('Error al guardar expediente:', response.error);
        }
    });
}


function consultarexp(Idexp) {
    rest.get(`/api/medico/${userId}/expedientes`, (status, response) => {
        if (status === 200) {
            console.log('Expedientes cargados 1:', response);
            const expedientes = response.filter(expediente => expediente.id === Idexp);
            console.log('Expedientes cargados filtrados:', expedientes)
            if (expedientes.length > 0) {
                // Mostrar los datos del expediente consultado
                mostrarDatosExpediente(expedientes[0]);
                
                // Ocultar la tabla de expedientes
                document.getElementById('tablaExpedientes').style.display = 'none';
                document.getElementById('editarDatosFormContainer').style.display = 'none';
                

                
                // Mostrar solo el formulario de consulta del expediente
                document.getElementById('consultarExpedientesForm').style.display = 'block';
            } else {
                document.getElementById('resultadoExpedientes').innerHTML = 'No se encontraron expedientes para este map.';
            }
        } else {
            console.error('Error al cargar los expedientes:', response);
        }
    });
}

// se llama a la funcion rellenarDatosExpediente al darle al boton de nuevo expediente

document.getElementById('nuevoExpedienteButton').addEventListener('click', function() {
    // Mostrar el formulario de nuevo expediente
    document.getElementById('nuevoExpedienteForm').style.display = 'block';
    // Ocultar la tabla de expedientes
    document.getElementById('tablaExpedientes').style.display = 'none';
    // Ocultar el formulario de consulta del expediente
    document.getElementById('consultarExpedientesForm').style.display = 'none';
    // Ocultar el formulario de edición de datos
    document.getElementById('editarDatosFormContainer').style.display = 'none';
    // Ocultar el formulario de consulta de expedientes
    document.getElementById('consultarExpedientesForm').style.display = 'none';
    // Ocultar el formulario de consulta de expedientes
    document.getElementById('consultarExpedientesForm').style.display = 'none';
    // Ocultar el formulario de consulta de expedientes
    document.getElementById('consultarExpedientesForm').style.display = 'none';
    // Ocultar el formulario de consulta de expedientes
    document.getElementById('consultarExpedientesForm').style.display = 'none';
    // Ocultar el formulario de consulta de expedientes
    document.getElementById('consultarExpedientesForm').style.display = 'none';
    // Ocultar el formulario de consulta de expedientes
    document.getElementById('consultarExpedientesForm').style.display = 'none';
    // Ocultar el formulario de consulta de expedientes
    document.getElementById('consultarExpedientesForm').style.display = 'none';
    // Ocultar el formulario de consulta de expedientes
    document.getElementById('consultarExpedientesForm').style.display = 'none';
    // Ocultar el formulario de consulta de expedientes
    document.getElementById('consultarExpedientesForm').style.display = 'none';
    // Ocultar el formulario de consulta de expedientes
    document.getElementById('consultarExpedientesForm').style.display = 'none';
    // Oculto tambien el boton de nuevo expediente
    document.getElementById('nuevoExpedienteButton').style.display = 'none';
    // oculto el boton de editar datos
    document.getElementById('editarDatosButton').style.display = 'none';
    // oculto el boton de cerrar sesion
    document.getElementById('logoutButton').style.display = 'none';


    // Llamar a la función para rellenar los datos del expediente en el formulario
  
}
);
// al darle al boton de guardar se llama a la funcion rellenarDatosExpediente
document.getElementById('guardarNuevo2ExpedienteButton').addEventListener('click', function() {
    
    // Mostrar la tabla de expedientes
    document.getElementById('tablaExpedientes').style.display = 'block';
    // Ocultar el formulario de nuevo expediente
    document.getElementById('nuevoExpedienteForm').style.display = 'none';
    // Mostrar el boton de nuevo expediente
    document.getElementById('nuevoExpedienteButton').style.display = 'block';
    // Mostrar el boton de cerrar sesion
    document.getElementById('logoutButton').style.display = 'block';
    rellenarDatosExpediente();
   

}
)

// Al darle al boton de cancelar se llama a la funcion
document.getElementById('cancelarNuevo2ExpedienteButton').addEventListener('click', function() {
    // Mostrar la tabla de expedientes
    document.getElementById('tablaExpedientes').style.display = 'block';

    // Mostrar el boton de nuevo expediente
    document.getElementById('nuevoExpedienteButton').style.display = 'block';
    // Mostrar el boton de editar datos
    document.getElementById('editarDatosButton').style.display = 'block';
    // Mostrar el boton de cerrar sesion
    document.getElementById('logoutButton').style.display = 'block';

    
    // Ocultar el formulario de nuevo expediente
    document.getElementById('nuevoExpedienteForm').style.display = 'none';
});





document.getElementById('loginButton').addEventListener('click', login);
// al darle al boton de login se llama a la funcion obtenerDatosMedico

document.getElementById('registerButton').addEventListener('click', function() {
    document.getElementById('registroFormContainer').style.display = "block";
    document.getElementById('loginForm').style.display = "none";
    document.getElementById('registerButton').style.display = "none";
    registro(); 
});

document.getElementById('guardarButton').addEventListener('click', registro);

document.getElementById('cancelarButton').addEventListener('click', function() {
    document.getElementById('registroFormContainer').style.display = "none";
    document.getElementById('loginForm').style.display = "block";
    document.getElementById('registerButton').style.display = "block";
    
});

document.getElementById('editarDatosButton').addEventListener('click', function() {
    // Ocultar el formulario de registro
    document.getElementById('registroFormContainer').style.display = 'none';
    // Mostrar el formulario de edición de datos
    document.getElementById('editarDatosFormContainer').style.display = 'block';
    // Ocultar todo lo anterior a editar datos
    document.getElementById('datosMedico').style.display = 'none';
    document.getElementById('editarDatosButton').style.display = 'none';
});

document.getElementById('cancelarEditButton').addEventListener('click', function() {
    document.getElementById('editarDatosFormContainer').style.display = 'none';
    document.getElementById('datosMedico').style.display = 'block';
    document.getElementById('editarDatosButton').style.display = 'block';
    obtenerexpedientesMedico();
});

// al pulsar el boton nuevoExpedienteButton se llama a la funcion obtenerexpedientesMedico
document.getElementById('nuevoExpedienteButton').addEventListener('click', function() {
    obtenerexpedientesMedico();
});