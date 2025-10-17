const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const os = require("os");

const PORT = process.env.PORT || 8888;

// MIME
function getMimeType(ext) {
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
  };
  return types[ext] || "text/plain; charset=utf-8";
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

const DATA_DIR = path.join(__dirname, "data");
const CONSULTAS_FILE = path.join(DATA_DIR, "consultas.txt");
function ensureDataDir() {
  return fs.promises.mkdir(DATA_DIR, { recursive: true });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/contacto/cargar") {
    try {
      const raw = await readBody(req);
      const params = new URLSearchParams(raw);
      const nombre = (params.get("nombre") || "").trim();
      const email = (params.get("email") || "").trim();
      const mensaje = (params.get("mensaje") || "").trim();

      if (!nombre || !email || !mensaje) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(
          '<h2>Faltan campos requeridos</h2><a href="/contacto">Volver</a>'
        );
      }

      // Fecha con formato "YYYY-MM-DD HH:mm"
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const fecha = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

      const bloque = `-------------------------
Fecha: ${fecha}
Nombre: ${nombre}
Email: ${email}
Mensaje: ${mensaje}
-------------------------

`;

      await ensureDataDir();
      await fs.promises.appendFile(CONSULTAS_FILE, bloque, "utf8");

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(
        `<h2>Gracias, ${nombre}. Registramos tu consulta.</h2><a href="/contacto">Volver</a> | <a href="/contacto/listar">Ver consultas</a>`
      );
    } catch (e) {
      console.error("Error /contacto/cargar:", e);
      res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(
        '<h2>Error interno del servidor</h2><a href="/">Volver</a>'
      );
    }
  }

  if (req.method === "GET" && req.url === "/contacto/listar") {
    try {
      const contenido = await fs.promises
        .readFile(CONSULTAS_FILE, "utf8")
        .catch((err) => {
          if (err.code === "ENOENT") return ""; // si no existe, tratamos como vacío
          throw err;
        });

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      if (!contenido.trim()) {
        return res.end(
          '<h2>Aún no hay consultas</h2><a href="/contacto">Volver</a>'
        );
      }
      return res.end(
        `<h2>Consultas</h2><pre>${contenido.replace(
          /</g,
          "&lt;"
        )}</pre><a href="/">Volver</a>`
      );
    } catch (e) {
      console.error("Error /contacto/listar:", e);
      res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(
        '<h2>Error interno del servidor</h2><a href="/">Volver</a>'
      );
    }
  }

  if (req.method === "POST" && req.url === "/login") {
    try {
      const raw = await readBody(req);
      const params = new URLSearchParams(raw);
      const user = (params.get("user") || "").trim();
      const pass = (params.get("pass") || "").trim();

      if (user === "demo" && pass === "1234") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(
          '<h2>Bienvenido, demo </h2><a href="/">Ir al inicio</a>'
        );
      } else {
        res.writeHead(401, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(
          '<h2>Credenciales inválidas</h2><a href="/login">Reintentar</a>'
        );
      }
    } catch (e) {
      console.error("Error /login:", e);
      res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
      return res.end("<h2>Error del servidor</h2>");
    }
  }

  if (req.method === "POST" && req.url === "/auth/recuperar") {
    try {
      const raw = await readBody(req);
      const params = new URLSearchParams(raw);
      const usuario = (params.get("usuario") || "").trim();
      const clave = (params.get("clave") || "").trim();

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(`
      <h2>Datos recibidos</h2>
      <p><strong>Usuario:</strong> ${usuario || "(vacío)"}</p>
      <p><strong>Clave:</strong> ${clave || "(vacía)"}</p>
      <a href="/">Volver</a>
    `);
    } catch (e) {
      console.error("Error /auth/recuperar:", e);
      res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(
        '<h2>Error interno del servidor</h2><a href="/">Volver</a>'
      );
    }
  }

  // Rutas GET dinámicas opcionales
  if (req.method === "GET" && req.url === "/api/status") {
    const data = {
      plataforma: os.platform(),
      cpus: os.cpus().length,
      memoriaLibre: os.freemem(),
      hora: new Date().toISOString(),
    };
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify(data));
  }

  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname || "/";

  if (pathname === "/") pathname = "index.html";
  // rutas
  else if (pathname === "/productos") pathname = "productos.html";
  else if (pathname === "/contacto") pathname = "contacto.html";
  else if (pathname === "/login") pathname = "login.html";
  else pathname = pathname.replace(/^\/+/, "");

  // normaliza y evita traversals
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(__dirname, "public", safePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(
        '<h2>404 - No encontrado</h2><a href="/">Ir al inicio</a>'
      );
    }
    res.writeHead(200, { "Content-Type": getMimeType(path.extname(filePath)) });
    return res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
