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

ahora del motodo post
    /contacto/cargar    ->    cargar una consulta a data    ->    html de agradecimiento    ->    200/400/500
    /auth/recuperar    ->    hace un echo de los datos de incio de sesion (demo)    ->    html mostrando credenciales    200/500




imagen de ejemplo al volver al incio, haciendo get a index.html
![alt text](<Captura de pantalla (225).png>)

imagen de ejemplo al subir un formulario, haciendo post para cargar los datos en data
![alt text](<Captura de pantalla (223).png>)



