const form = document.getElementById('usuarioForm');
const tableBody = document.getElementById('usuariosTable').querySelector('tbody');

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
        fetch(`http://localhost:3006/api/usuarios/${usuarioId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        }).then(() => {
            obtenerUsuarios();
            form.reset(); //* Limpiar el formulario
            document.getElementById('usuarioId').value = ''; //* Limpiar el campo de id
        });
    } else {
        //* Crear nuevo usuario
        fetch('http://localhost:3006/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        }).then(() => obtenerUsuarios());
    }
});

function obtenerUsuarios() {
    fetch(`http://localhost:3006/api/usuarios`)
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
                        <button onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                        <button onclick="actualizarUsuario(${usuario.id})">Actualizar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
}

function eliminarUsuario(id) {
    fetch(`http://localhost:3006/api/usuarios/${id}`, { method: 'DELETE' })
        .then(() => obtenerUsuarios());
}

function actualizarUsuario(id) {
    fetch(`http://localhost:3006/api/usuarios/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el usuario. Verifica que el ID sea válido.');
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
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos del usuario:', error);
            alert('Error al cargar los datos del usuario: ' + error.message);
        });
};
obtenerUsuarios();
