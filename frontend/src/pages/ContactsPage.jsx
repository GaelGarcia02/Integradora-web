import React, { useEffect } from "react";
import TablaInfo from "../components/TablaInfo";
import BotonModal from "../components/Buttons/BotonModal";
import FormularioContactos from "../components/Forms/FormularioContactos";
import { useContacts } from "../context/ContactsContext";

const ContactsPage = () => {
  const { contacts, getContacts, deleteContact } = useContacts();
  const columnNames = ["id_contact", "name_", "cell_number", "email"];

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl shadow-sm">
      {/* --- Título --- */}
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-users text-[#0159B3] text-xl"></i>
        <h2 className="text-2xl font-bold text-gray-800">Contactos</h2>
      </div>

      <hr className="mb-6 border-gray-300" />

      {/* --- Encabezado con botones --- */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-6">
        <div>
          <BotonModal
            nombreBoton="Nuevo Contacto"
            icono="fas fa-plus"
            contenidoModal={<FormularioContactos />}
            titulo="Agregar Contacto"
          />
        </div>
      </div>

      {/* --- Tabla --- */}
      <TablaInfo
        columns={columnNames}
        data={contacts}
        totalRecords={contacts.length}
        hiddenColumns={["id_contact"]}
        customColumnNames={{
          name_: "Nombre",
          cell_number: "Número de celular",
          email: "Correo electrónico",
        }}
        formType="contacts"
        onDelete={deleteContact}
      />
    </div>
  );
};

export default ContactsPage;
