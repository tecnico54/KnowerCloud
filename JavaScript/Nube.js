document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById('fileInput');
    const btnDescargar = document.getElementById('btnDescargar');
    // Abre (o crea) la base de datos en IndexedDB
    let db;
    const request = indexedDB.open("ArchivosDB", 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains("archivos")) {
            db.createObjectStore("archivos", { keyPath: "id" });
        }
    };
    request.onsuccess = function(event) {
        db = event.target.result;
    };
    request.onerror = function(event) {
        console.error("Error al abrir IndexedDB", event);
    };
    // Guardar archivo en IndexedDB
    fileInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const transaction = db.transaction(["archivos"], "readwrite");
                const store = transaction.objectStore("archivos");

                store.put({ id: "archivoGuardado", data: e.target.result, type: file.type, name: file.name });

                alert("Archivo guardado en IndexedDB.");
            };
            reader.readAsArrayBuffer(file);
        }
    });
    // Descargar archivo desde IndexedDB
    btnDescargar.addEventListener("click", function() {
        const transaction = db.transaction(["archivos"], "readonly");
        const store = transaction.objectStore("archivos");

        const request = store.get("archivoGuardado");

        request.onsuccess = function(event) {
            const result = event.target.result;
            if (result) {
                const archivoBlob = new Blob([result.data], { type: result.type });
                const enlace = document.createElement("a");
                enlace.href = URL.createObjectURL(archivoBlob);
                enlace.download = result.name;
                enlace.click();
            } else {
                alert("No hay archivo guardado.");
            }
        };
    });
});
