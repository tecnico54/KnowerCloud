document.addEventListener("DOMContentLoaded", function(){
    const fileInput = document.getElementById('fileInput');
    const btnDescargar = document.getElementById('btnDescargar');
    const dbName = "ArchivosGuardados";
    const storeName = "archivos";
    //Abrir o crear la base de datos IndexedDB
    let db;
    const openRequest = indexedDB.open(dbName, 1);
    openRequest.onupgradeneeded = function(event){
        db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)){
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
    };   
    openRequest.onsuccess = function(event){
        db = event.target.result;
    };
    //Manejar la subida del archivo
    fileInput.addEventListener('change', function(event){
        const file = event.target.files[0];
        if (file){
            const reader = new FileReader();
            reader.onload = function(e){
                const transaction = db.transaction([storeName], "readwrite");
                const store = transaction.objectStore(storeName);
                //Guardar el archivo en IndexedDB
                const archivo = {
                    name: file.name,
                    type: file.type,
                    data: e.target.result //Almacenar el archivo como ArrayBuffer
                };
                store.add(archivo);
                alert('Archivo subido y guardado.');
            };
            reader.readAsArrayBuffer(file); //Leemos el archivo como ArrayBuffer
        }
    });
    //Manejar la descarga del archivo
    btnDescargar.addEventListener('click', function(){
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        
        //Recuperar el archivo de IndexedDB
        const request = store.getAll(); //Obtener todos los archivos guardados
        
        request.onsuccess = function(event){
            if (request.result.length > 0){
                const archivo = request.result[0]; //Suponemos que solo hay un archivo guardado
                const blob = new Blob([archivo.data], { type: archivo.type });
                const archivoUrl = URL.createObjectURL(blob);
                //Crear un enlace temporal para descargar el archivo
                const enlace = document.createElement('a');
                enlace.href = archivoUrl;
                enlace.download = archivo.name;  //Usamos el nombre del archivo original
                enlace.click();
            }else{
                alert('No hay archivo guardado para descargar.');
            }
        };
    });
});