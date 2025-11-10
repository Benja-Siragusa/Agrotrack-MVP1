Actividad obligatoria 1

Nombre: Benjamin Nicolas Siragusa Arbeloa
DNI: 45.235.482

creacion del primer MVP del protal web interno de Agrotrack

mapa de rutas:

agrotrack/
    data/
        consultas.txt
    public/
        contacto.html
        estilos.css
        index.html
        login.html
        productos.html
    .gitignore
    AgroTrack.postman_collection.json
    img1
    img2
    package.json
    README.md
    server.js

1) para ejecutar el programa, en la terminal desde la carpeta principal, ejecutar el comando "node server"

2) el servidor corre en el puerto 8888

3) rutas de el prototipo

    ruta    ->    fin de la ruta    ->    respuesta    ->    codigo de estado
rutas del metodo get

    /    ->     pagina de incio     ->    index.html    ->    200/400
    /productos -> pag de productos  ->    productos.html ->   200/404
    /contacto  -> form de contacto  ->    contacto.html  ->  200/404
    /contacto/listar -> lista de contactos -> html con el contenido de data o "no hay consultas" -> 200/404
    /login    ->    inicio sesion (demo)    ->    login.html    ->    200/404
    /estilos.css    ->    cargar los estilos en cada pagina    ->    200/404

(404: cualquier ruta no mapeada devuelve HTML “No encontrado” con link a /)

ahora del motodo post
    /contacto/cargar    ->    cargar una consulta a data    ->    html de agradecimiento    ->    200/400/500
    /auth/recuperar    ->    hace un echo de los datos de incio de sesion (demo)    ->    html mostrando credenciales    200/500




imagen de ejemplo al volver al incio, haciendo get a index.html
![alt text](<Captura de pantalla (225).png>)

imagen de ejemplo al subir un formulario, haciendo post para cargar los datos en data
![alt text](<Captura de pantalla (223).png>)


    ASINCRONIA
en el codigo, se usa programacion asincrona para evitar el  bloqueo dele vent loop, los eventos "data","end" y "error" en el objeto req, se manejan mediante callback encapsuladas en una promise, lo que me permitio usar await en las funciones, esto me garantiza que el servidor espera de forma no bloqueante a que se reciba todo el cuerpo de la peticion antes de procesarla, tambien tenemos funciones con metodos como fs.promise.appendFle() y fs.promise.readFile() que tambien devuelven promesas y es asincrono, el event loop sigue ejecutando otras cosas hasta que la funcion trae el archivo

    Cabeceras MIME
mediante la funcion getMimeType(ext), el servidor identifica automaticamente el contenido de los archivos servidos, permite que el navegador interprete correctamente los archivos, html, css, js y json, no puse mas como imagenes o archivos de otro tipo ya que en este MVP no eran necesarios. en la funcion, cuando se recibe un archivo, con path.extname(filepath) obtenemos su extension y se usa una funcion para establecer el encabezado http

    Manejo de errores
en el codigo implementamos multiples niveles de manejos de errores, tenemos errores de validacion de formularios por si por ejemplo faltan campos obligatorios por completas, errores de autenticacion en el login (solo de prueba ya que el log in no testea credenciales), y errores internos por si sucede alguna excepcion en algun block try/catch, devuelve un estado 500 y un mensaje de error interno del servidor, por ultimo tenemos un manejo de errores de archivos no encontrados con un estado de codigo 404 y un error ENOENT para cuando el archivo de consultas esta vacio evitar el fallo y mostrar un mensaje de que todavia no hay consultas.


Actividad Obligatoria 2:
