const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;
// Configurar el almacenamiento de los archivos
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');  // Carpeta donde se guardarán los archivos
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único basado en la fecha
    }
});
const upload = multer({ storage: storage });
// Middleware para servir archivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));
// Ruta para subir archivos
app.post('/upload', upload.single('archivo'), (req, res) => {
    res.json({ message: 'Archivo subido exitosamente' });
});
// Ruta para descargar el archivo
app.get('/download', (req, res) => {
    const filePath = './uploads/archivo_guardado';  // Aquí debería ser el nombre del archivo guardado
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('Archivo no encontrado');
    }
});
// Arrancar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});