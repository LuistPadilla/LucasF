const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Configuración del servidor
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/lucas', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Conexión a MongoDB exitosa"))
  .catch(err => console.error("Error al conectar a MongoDB:", err));

// Definición del esquema y modelo
const DatosSchema = new mongoose.Schema({
	nombre: String,
	apellido: String,
	email: String,
	id_google: String
    campo1: String,
    campo2: String,
	campo3: Date,
    campo4: Date,
    campo5: String,
});

const Datos = mongoose.model('Datos', DatosSchema);

// Rutas

// Obtener todos los documentos
app.get('/api/datos', async (req, res) => {
    try {
        const datos = await Datos.find();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo documento
app.post('/api/datos', async (req, res) => {
    const nuevoDato = new Datos(req.body);
    try {
        const datoGuardado = await nuevoDato.save();
        res.status(201).json(datoGuardado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Actualizar un documento por ID
app.put('/api/datos/:id', async (req, res) => {
    try {
        const datoActualizado = await Datos.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!datoActualizado) return res.status(404).json({ message: "Dato no encontrado" });
        res.json(datoActualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Eliminar un documento por ID
app.delete('/api/datos/:id', async (req, res) => {
    try {
        const datoEliminado = await Datos.findByIdAndDelete(req.params.id);
        if (!datoEliminado) return res.status(404).json({ message: "Dato no encontrado" });
        res.json({ message: "Dato eliminado" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
