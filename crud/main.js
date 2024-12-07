const form = document.getElementById('usuarioForm');
const tableBody = document.getElementById('usuariosTable').querySelector('tbody');
const submitButton = document.getElementById('submitButton');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = {
        nombre: document.getElementById('nombre').value,
        ciudad: document.getElementById('ciudad').value,
        cedula: document.getElementById('cedula').value,
        correo: document.getElementById('correo').value,
    };
   //* Actualizar usuario existente
   const usuarioId = document.getElementById('usuarioId').value;
    if (usuarioId) {
        fetch(`http://localhost:3007/api/usuarios/${usuarioId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        }).then(() => {
            obtenerUsuarios();
            form.reset(); //* Limpiar el formulario
            document.getElementById('usuarioId').value = ''; //* Limpiar el campo de id
            submitButton.textContent = 'AGREGAR USUARIO'; 
            Swal.fire({
                title: 'Usuario Editado correctamente', 
                text: 'El usuario fue editado exitosamente',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
        });
    } else {
        //* Crear nuevo usuario
        fetch('http://localhost:3007/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        }).then(() => { obtenerUsuarios();
            form.reset(); //* Limpiar el formulario
            document.getElementById('usuarioId').value = '';
            submitButton.textContent = 'AGREGAR USUARIO';
      
            Swal.fire({
             title: 'Usuario agregado',
             text: 'El usuario fue creado exitosamente',
             icon: 'success',
             confirmButtonText: 'Ok'
    });
         });
    }
});

function obtenerUsuarios() {
    fetch(`http://localhost:3007/api/usuarios`)
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = '';
            data.forEach(usuario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.ciudad}</td>
                    <td>${usuario.cedula}</td>
                    <td>${usuario.correo}</td>
                    <td>
                        <button onclick="eliminarUsuario(${usuario.id})">ELIMINAR</button>
                        <button onclick="actualizarUsuario(${usuario.id})">EDITAR</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
}

function eliminarUsuario(id) {
    Swal.fire({
        title: "Deseas eliminar usuario?",
        text: "Este usuario será eliminado permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar!"
      }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:3007/api/usuarios/${id}`, { method: 'DELETE' })
            .then(() => obtenerUsuarios())
          Swal.fire({
            title: "Eliminado!",
            text: "El usuario ha sido eliminado.",
            icon: "success"
          });
        }
      });;
}

function actualizarUsuario(id) {
    fetch(`http://localhost:3007/api/usuarios/${id}`)
        .then(response => {
            if (!response.ok) {
                // Si el estado de la respuesta no es exitoso
                if (response.status === 404) {
                    throw new Error('El usuario no existe en la base de datos.');
                }
                throw new Error('Error al obtener el usuario. Intenta nuevamente.');
            }
            return response.json();
        })
        .then(usuario => {
            if (usuario) {
                form.nombre.value = usuario.nombre;
                form.ciudad.value = usuario.ciudad;
                form.cedula.value = usuario.cedula;
                form.correo.value = usuario.correo;
                form.usuarioId.value = usuario.id; //* Guarda el id en el campo oculto
                submitButton.textContent = 'GUARDAR CAMBIOS';
                    
                
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos del usuario:', error);
            alert('Error al cargar los datos del usuario: ' + error.message);
        });
}

obtenerUsuarios();