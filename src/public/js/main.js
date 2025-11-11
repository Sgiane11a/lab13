const API_URL = "http://98.83.43.117:3000/contacts";

const contactForm = document.getElementById("contactForm");
const contactsTable = document.getElementById("contactsTable");
const cancelEdit = document.getElementById("cancelEdit");

// Listar contactos
async function getContacts() {
  const res = await fetch(API_URL);
  const data = await res.json();
  contactsTable.innerHTML = "";
  data.forEach(c => {
    contactsTable.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.nombre}</td>
        <td>${c.apellidos}</td>
        <td>${c.correo}</td>
        <td>${c.fecha_nac}</td>
        <td>${c.foto_url ? `<img src="${c.foto_url}" width="50">` : ""}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editContact(${c.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteContact(${c.id})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

// Crear o actualizar contacto
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData();
  const id = document.getElementById("contactId").value;
  formData.append("nombre", document.getElementById("nombre").value);
  formData.append("apellidos", document.getElementById("apellidos").value);
  formData.append("correo", document.getElementById("correo").value);
  formData.append("fecha_nac", document.getElementById("fecha_nac").value);
  if (document.getElementById("foto").files[0]) {
    formData.append("foto", document.getElementById("foto").files[0]);
  }

  if (id) {
    await fetch(`${API_URL}/${id}`, { method: "PUT", body: formData });
  } else {
    await fetch(API_URL, { method: "POST", body: formData });
  }

  contactForm.reset();
  document.getElementById("contactId").value = "";
  getContacts();
});

// Editar contacto
async function editContact(id) {
  const res = await fetch(`${API_URL}`);
  const data = await res.json();
  const contact = data.find(c => c.id === id);
  document.getElementById("contactId").value = contact.id;
  document.getElementById("nombre").value = contact.nombre;
  document.getElementById("apellidos").value = contact.apellidos;
  document.getElementById("correo").value = contact.correo;
  document.getElementById("fecha_nac").value = contact.fecha_nac;
}

// Cancelar edición
cancelEdit.addEventListener("click", () => {
  contactForm.reset();
  document.getElementById("contactId").value = "";
});

// Eliminar contacto
async function deleteContact(id) {
  if (confirm("¿Eliminar contacto?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    getContacts();
  }
}

// Inicial
getContacts();
