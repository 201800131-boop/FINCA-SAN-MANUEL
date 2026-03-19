import * as SQLite from 'expo-sqlite';

let db = null;

export const getDatabase = () => {
  if (!db) {
    db = SQLite.openDatabaseSync('finca_san_manuel.db');
  }
  return db;
};

export const initDatabase = async () => {
  const database = getDatabase();

  // Tabla de usuarios
  database.execSync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      usuario TEXT NOT NULL UNIQUE,
      contrasena TEXT NOT NULL,
      rol TEXT NOT NULL DEFAULT 'Empleado',
      activo INTEGER NOT NULL DEFAULT 1,
      fecha_creacion TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Tabla de permisos por rol
  database.execSync(`
    CREATE TABLE IF NOT EXISTS roles_permisos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rol TEXT NOT NULL UNIQUE,
      puede_ver_vacas INTEGER NOT NULL DEFAULT 1,
      puede_registrar_vacas INTEGER NOT NULL DEFAULT 0,
      puede_editar_vacas INTEGER NOT NULL DEFAULT 0,
      puede_iniciar_tratamientos INTEGER NOT NULL DEFAULT 0,
      puede_finalizar_tratamientos INTEGER NOT NULL DEFAULT 0,
      puede_ver_ajustes INTEGER NOT NULL DEFAULT 0,
      puede_administrar_usuarios INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Tabla de vacas
  database.execSync(`
    CREATE TABLE IF NOT EXISTS vacas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT NOT NULL UNIQUE,
      nombre TEXT NOT NULL,
      numero_arete TEXT UNIQUE,
      raza TEXT NOT NULL,
      sexo TEXT NOT NULL DEFAULT 'Hembra',
      fecha_nacimiento TEXT,
      edad_aproximada TEXT,
      fecha_ingreso TEXT,
      produccion_leche_dia REAL DEFAULT 0,
      procedencia TEXT,
      estado TEXT NOT NULL DEFAULT 'Activa',
      estado_salud TEXT,
      ultima_revision TEXT,
      alergias_notas TEXT,
      numero_partos INTEGER DEFAULT 0,
      ultimo_parto TEXT,
      estado_reproductivo TEXT,
      observaciones TEXT,
      creado_por INTEGER,
      fecha_creacion TEXT NOT NULL DEFAULT (datetime('now')),
      fecha_actualizacion TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (creado_por) REFERENCES usuarios(id)
    );
  `);

  // Tabla de catálogo de tratamientos
  database.execSync(`
    CREATE TABLE IF NOT EXISTS tratamientos_catalogo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      medicamento_base TEXT,
      dosis_sugerida TEXT,
      via_administracion TEXT,
      frecuencia TEXT,
      duracion_sugerida TEXT,
      observaciones TEXT,
      activo INTEGER NOT NULL DEFAULT 1,
      fecha_creacion TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Tabla de tratamientos
  database.execSync(`
    CREATE TABLE IF NOT EXISTS tratamientos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vaca_id INTEGER NOT NULL,
      tratamiento_catalogo_id INTEGER,
      tratamiento_manual TEXT,
      descripcion TEXT,
      motivo TEXT,
      medicamento TEXT,
      dosis TEXT,
      via_administracion TEXT,
      frecuencia TEXT,
      fecha_inicio TEXT NOT NULL,
      fecha_fin_estimada TEXT,
      fecha_fin_real TEXT,
      estado TEXT NOT NULL DEFAULT 'Vigente',
      resultado TEXT,
      responsable TEXT,
      observaciones_inicio TEXT,
      observaciones_fin TEXT,
      creado_por INTEGER,
      fecha_creacion TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (vaca_id) REFERENCES vacas(id),
      FOREIGN KEY (tratamiento_catalogo_id) REFERENCES tratamientos_catalogo(id),
      FOREIGN KEY (creado_por) REFERENCES usuarios(id)
    );
  `);

  // Insertar datos iniciales si no existen
  await insertInitialData(database);
};

const insertInitialData = async (database) => {
  // Verificar si ya existe el admin
  const adminExists = database.getFirstSync(
    'SELECT id FROM usuarios WHERE usuario = ?',
    ['admin']
  );

  if (!adminExists) {
    // Crear usuario admin por defecto
    database.runSync(
      `INSERT INTO usuarios (nombre, usuario, contrasena, rol, activo) VALUES (?, ?, ?, ?, ?)`,
      ['Administrador', 'admin', 'admin123', 'Admin', 1]
    );

    // Crear usuario operador de ejemplo
    database.runSync(
      `INSERT INTO usuarios (nombre, usuario, contrasena, rol, activo) VALUES (?, ?, ?, ?, ?)`,
      ['Operador Demo', 'operador', 'op123', 'Empleado', 1]
    );
  }

  // Insertar permisos por rol si no existen
  const permisosExisten = database.getFirstSync('SELECT id FROM roles_permisos WHERE rol = ?', ['Admin']);
  if (!permisosExisten) {
    database.runSync(
      `INSERT INTO roles_permisos (rol, puede_ver_vacas, puede_registrar_vacas, puede_editar_vacas,
        puede_iniciar_tratamientos, puede_finalizar_tratamientos, puede_ver_ajustes, puede_administrar_usuarios)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Admin', 1, 1, 1, 1, 1, 1, 1]
    );
    database.runSync(
      `INSERT INTO roles_permisos (rol, puede_ver_vacas, puede_registrar_vacas, puede_editar_vacas,
        puede_iniciar_tratamientos, puede_finalizar_tratamientos, puede_ver_ajustes, puede_administrar_usuarios)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Empleado', 1, 1, 1, 1, 1, 0, 0]
    );
    database.runSync(
      `INSERT INTO roles_permisos (rol, puede_ver_vacas, puede_registrar_vacas, puede_editar_vacas,
        puede_iniciar_tratamientos, puede_finalizar_tratamientos, puede_ver_ajustes, puede_administrar_usuarios)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Consulta', 1, 0, 0, 0, 0, 0, 0]
    );
  }

  // Insertar catálogos de tratamientos de ejemplo
  const catalogoExiste = database.getFirstSync('SELECT id FROM tratamientos_catalogo LIMIT 1');
  if (!catalogoExiste) {
    const catalogos = [
      ['Desparasitación general', 'Tratamiento antiparasitario de rutina', 'Ivermectina', '1 ml por 50 kg', 'Subcutánea', 'Dosis única', '1 día', 'Repetir cada 3 meses'],
      ['Mastitis', 'Tratamiento para infección de ubre', 'Penicilina + Estreptomicina', '5 ml intramuscular', 'Intramuscular', 'Cada 12 horas', '5 días', 'Revisar producción de leche'],
      ['Fiebre aftosa - vacuna', 'Vacunación preventiva obligatoria', 'Vacuna Aftosa', '2 ml', 'Subcutánea', 'Dosis única', '1 día', 'Aplicar cada 6 meses'],
      ['Brucela - vacuna', 'Vacunación contra brucelosis', 'Vacuna RB51', '2 ml', 'Subcutánea', 'Dosis única', '1 día', 'Aplicar según calendario'],
      ['Neumonía', 'Tratamiento para infección respiratoria', 'Oxitetraciclina', '10 ml', 'Intramuscular', 'Cada 24 horas', '3-5 días', 'Aislar el animal si es necesario'],
    ];
    for (const cat of catalogos) {
      database.runSync(
        `INSERT INTO tratamientos_catalogo (nombre, descripcion, medicamento_base, dosis_sugerida, via_administracion, frecuencia, duracion_sugerida, observaciones)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        cat
      );
    }
  }
};

// ============ USUARIOS ============

export const getUsuarios = () => {
  const db = getDatabase();
  return db.getAllSync('SELECT * FROM usuarios ORDER BY nombre ASC');
};

export const getUsuarioById = (id) => {
  const db = getDatabase();
  return db.getFirstSync('SELECT * FROM usuarios WHERE id = ?', [id]);
};

export const getUsuarioByCredentials = (usuario, contrasena) => {
  const db = getDatabase();
  return db.getFirstSync(
    'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ? AND activo = 1',
    [usuario, contrasena]
  );
};

export const crearUsuario = (data) => {
  const db = getDatabase();
  return db.runSync(
    `INSERT INTO usuarios (nombre, usuario, contrasena, rol, activo) VALUES (?, ?, ?, ?, ?)`,
    [data.nombre, data.usuario, data.contrasena, data.rol, data.activo ?? 1]
  );
};

export const actualizarUsuario = (id, data) => {
  const db = getDatabase();
  return db.runSync(
    `UPDATE usuarios SET nombre=?, usuario=?, rol=?, activo=? WHERE id=?`,
    [data.nombre, data.usuario, data.rol, data.activo, id]
  );
};

export const cambiarContrasena = (id, nuevaContrasena) => {
  const db = getDatabase();
  return db.runSync('UPDATE usuarios SET contrasena=? WHERE id=?', [nuevaContrasena, id]);
};

export const toggleUsuarioActivo = (id, activo) => {
  const db = getDatabase();
  return db.runSync('UPDATE usuarios SET activo=? WHERE id=?', [activo ? 1 : 0, id]);
};

// ============ PERMISOS ============

export const getPermisosPorRol = (rol) => {
  const db = getDatabase();
  return db.getFirstSync('SELECT * FROM roles_permisos WHERE rol = ?', [rol]);
};

export const getRolesPermisos = () => {
  const db = getDatabase();
  return db.getAllSync('SELECT * FROM roles_permisos ORDER BY rol ASC');
};

export const actualizarPermisos = (rol, data) => {
  const db = getDatabase();
  return db.runSync(
    `UPDATE roles_permisos SET puede_ver_vacas=?, puede_registrar_vacas=?, puede_editar_vacas=?,
      puede_iniciar_tratamientos=?, puede_finalizar_tratamientos=?, puede_ver_ajustes=?, puede_administrar_usuarios=?
      WHERE rol=?`,
    [
      data.puede_ver_vacas ? 1 : 0,
      data.puede_registrar_vacas ? 1 : 0,
      data.puede_editar_vacas ? 1 : 0,
      data.puede_iniciar_tratamientos ? 1 : 0,
      data.puede_finalizar_tratamientos ? 1 : 0,
      data.puede_ver_ajustes ? 1 : 0,
      data.puede_administrar_usuarios ? 1 : 0,
      rol,
    ]
  );
};

// ============ VACAS ============

export const getVacas = (filtros = {}) => {
  const db = getDatabase();
  let query = 'SELECT * FROM vacas WHERE 1=1';
  const params = [];

  if (filtros.estado) {
    query += ' AND estado = ?';
    params.push(filtros.estado);
  }
  if (filtros.raza) {
    query += ' AND raza = ?';
    params.push(filtros.raza);
  }
  if (filtros.busqueda) {
    query += ' AND (nombre LIKE ? OR codigo LIKE ? OR numero_arete LIKE ?)';
    params.push(`%${filtros.busqueda}%`, `%${filtros.busqueda}%`, `%${filtros.busqueda}%`);
  }
  query += ' ORDER BY nombre ASC';
  return db.getAllSync(query, params);
};

export const getVacaById = (id) => {
  const db = getDatabase();
  return db.getFirstSync('SELECT * FROM vacas WHERE id = ?', [id]);
};

export const existeCodigoVaca = (codigo, excludeId = null) => {
  const db = getDatabase();
  if (excludeId) {
    return db.getFirstSync('SELECT id FROM vacas WHERE codigo = ? AND id != ?', [codigo, excludeId]);
  }
  return db.getFirstSync('SELECT id FROM vacas WHERE codigo = ?', [codigo]);
};

export const existeAreteVaca = (arete, excludeId = null) => {
  const db = getDatabase();
  if (!arete) return null;
  if (excludeId) {
    return db.getFirstSync('SELECT id FROM vacas WHERE numero_arete = ? AND id != ?', [arete, excludeId]);
  }
  return db.getFirstSync('SELECT id FROM vacas WHERE numero_arete = ?', [arete]);
};

export const crearVaca = (data) => {
  const db = getDatabase();
  return db.runSync(
    `INSERT INTO vacas (codigo, nombre, numero_arete, raza, sexo, fecha_nacimiento, edad_aproximada,
      fecha_ingreso, produccion_leche_dia, procedencia, estado, estado_salud, ultima_revision,
      alergias_notas, numero_partos, ultimo_parto, estado_reproductivo, observaciones, creado_por)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.codigo, data.nombre, data.numero_arete || null, data.raza, data.sexo || 'Hembra',
      data.fecha_nacimiento || null, data.edad_aproximada || null, data.fecha_ingreso || null,
      data.produccion_leche_dia || 0, data.procedencia || null, data.estado || 'Activa',
      data.estado_salud || null, data.ultima_revision || null, data.alergias_notas || null,
      data.numero_partos || 0, data.ultimo_parto || null, data.estado_reproductivo || null,
      data.observaciones || null, data.creado_por || null,
    ]
  );
};

export const actualizarVaca = (id, data) => {
  const db = getDatabase();
  return db.runSync(
    `UPDATE vacas SET codigo=?, nombre=?, numero_arete=?, raza=?, sexo=?, fecha_nacimiento=?,
      edad_aproximada=?, fecha_ingreso=?, produccion_leche_dia=?, procedencia=?, estado=?,
      estado_salud=?, ultima_revision=?, alergias_notas=?, numero_partos=?, ultimo_parto=?,
      estado_reproductivo=?, observaciones=?, fecha_actualizacion=datetime('now') WHERE id=?`,
    [
      data.codigo, data.nombre, data.numero_arete || null, data.raza, data.sexo || 'Hembra',
      data.fecha_nacimiento || null, data.edad_aproximada || null, data.fecha_ingreso || null,
      data.produccion_leche_dia || 0, data.procedencia || null, data.estado || 'Activa',
      data.estado_salud || null, data.ultima_revision || null, data.alergias_notas || null,
      data.numero_partos || 0, data.ultimo_parto || null, data.estado_reproductivo || null,
      data.observaciones || null, id,
    ]
  );
};

export const cambiarEstadoVaca = (id, estado) => {
  const db = getDatabase();
  return db.runSync(
    `UPDATE vacas SET estado=?, fecha_actualizacion=datetime('now') WHERE id=?`,
    [estado, id]
  );
};

export const getResumenVacas = () => {
  const db = getDatabase();
  return db.getAllSync(
    `SELECT estado, COUNT(*) as total FROM vacas GROUP BY estado`
  );
};

// ============ CATÁLOGO DE TRATAMIENTOS ============

export const getCatalogos = (soloActivos = false) => {
  const db = getDatabase();
  if (soloActivos) {
    return db.getAllSync('SELECT * FROM tratamientos_catalogo WHERE activo = 1 ORDER BY nombre ASC');
  }
  return db.getAllSync('SELECT * FROM tratamientos_catalogo ORDER BY nombre ASC');
};

export const getCatalogoById = (id) => {
  const db = getDatabase();
  return db.getFirstSync('SELECT * FROM tratamientos_catalogo WHERE id = ?', [id]);
};

export const crearCatalogo = (data) => {
  const db = getDatabase();
  return db.runSync(
    `INSERT INTO tratamientos_catalogo (nombre, descripcion, medicamento_base, dosis_sugerida,
      via_administracion, frecuencia, duracion_sugerida, observaciones, activo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.nombre, data.descripcion || null, data.medicamento_base || null,
      data.dosis_sugerida || null, data.via_administracion || null, data.frecuencia || null,
      data.duracion_sugerida || null, data.observaciones || null, 1,
    ]
  );
};

export const actualizarCatalogo = (id, data) => {
  const db = getDatabase();
  return db.runSync(
    `UPDATE tratamientos_catalogo SET nombre=?, descripcion=?, medicamento_base=?, dosis_sugerida=?,
      via_administracion=?, frecuencia=?, duracion_sugerida=?, observaciones=? WHERE id=?`,
    [
      data.nombre, data.descripcion || null, data.medicamento_base || null,
      data.dosis_sugerida || null, data.via_administracion || null, data.frecuencia || null,
      data.duracion_sugerida || null, data.observaciones || null, id,
    ]
  );
};

export const toggleCatalogoActivo = (id, activo) => {
  const db = getDatabase();
  return db.runSync('UPDATE tratamientos_catalogo SET activo=? WHERE id=?', [activo ? 1 : 0, id]);
};

// ============ TRATAMIENTOS ============

export const getTratamientos = (filtros = {}) => {
  const db = getDatabase();
  let query = `
    SELECT t.*, v.nombre as vaca_nombre, v.codigo as vaca_codigo, v.numero_arete as vaca_arete
    FROM tratamientos t
    LEFT JOIN vacas v ON t.vaca_id = v.id
    WHERE 1=1
  `;
  const params = [];

  if (filtros.estado) {
    query += ' AND t.estado = ?';
    params.push(filtros.estado);
  }
  if (filtros.vaca_id) {
    query += ' AND t.vaca_id = ?';
    params.push(filtros.vaca_id);
  }
  if (filtros.responsable) {
    query += ' AND t.responsable LIKE ?';
    params.push(`%${filtros.responsable}%`);
  }
  if (filtros.busqueda) {
    query += ' AND (v.nombre LIKE ? OR v.codigo LIKE ? OR t.tratamiento_manual LIKE ? OR t.descripcion LIKE ?)';
    params.push(`%${filtros.busqueda}%`, `%${filtros.busqueda}%`, `%${filtros.busqueda}%`, `%${filtros.busqueda}%`);
  }
  query += ' ORDER BY t.fecha_creacion DESC';
  return db.getAllSync(query, params);
};

export const existeTratamientoVigenteSimilar = (vacaId, nombreTratamiento) => {
  const db = getDatabase();
  return db.getFirstSync(
    `SELECT id FROM tratamientos
     WHERE vaca_id = ?
       AND estado = 'Vigente'
       AND lower(trim(coalesce(tratamiento_manual, descripcion, ''))) = lower(trim(?))
     LIMIT 1`,
    [vacaId, nombreTratamiento]
  );
};

export const getTratamientoById = (id) => {
  const db = getDatabase();
  return db.getFirstSync(
    `SELECT t.*, v.nombre as vaca_nombre, v.codigo as vaca_codigo
     FROM tratamientos t LEFT JOIN vacas v ON t.vaca_id = v.id
     WHERE t.id = ?`,
    [id]
  );
};

export const getTratamientosPorVaca = (vaca_id) => {
  const db = getDatabase();
  return db.getAllSync(
    'SELECT * FROM tratamientos WHERE vaca_id = ? ORDER BY fecha_creacion DESC',
    [vaca_id]
  );
};

export const crearTratamiento = (data) => {
  const db = getDatabase();
  const result = db.runSync(
    `INSERT INTO tratamientos (vaca_id, tratamiento_catalogo_id, tratamiento_manual, descripcion,
      motivo, medicamento, dosis, via_administracion, frecuencia, fecha_inicio, fecha_fin_estimada,
      estado, responsable, observaciones_inicio, creado_por)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.vaca_id, data.tratamiento_catalogo_id || null, data.tratamiento_manual || null,
      data.descripcion || null, data.motivo || null, data.medicamento || null,
      data.dosis || null, data.via_administracion || null, data.frecuencia || null,
      data.fecha_inicio, data.fecha_fin_estimada || null, 'Vigente',
      data.responsable || null, data.observaciones_inicio || null, data.creado_por || null,
    ]
  );
  // Actualizar estado de la vaca a "En tratamiento"
  db.runSync(`UPDATE vacas SET estado='En tratamiento', fecha_actualizacion=datetime('now') WHERE id=?`, [data.vaca_id]);
  return result;
};

export const finalizarTratamiento = (id, data) => {
  const db = getDatabase();
  const result = db.runSync(
    `UPDATE tratamientos SET estado=?, resultado=?, fecha_fin_real=?, observaciones_fin=? WHERE id=?`,
    [data.estado || 'Finalizado', data.resultado || null, data.fecha_fin_real, data.observaciones_fin || null, id]
  );
  // Verificar si la vaca tiene más tratamientos vigentes
  const tratamiento = db.getFirstSync('SELECT vaca_id FROM tratamientos WHERE id = ?', [id]);
  if (tratamiento) {
    const vigentes = db.getFirstSync(
      `SELECT COUNT(*) as total FROM tratamientos WHERE vaca_id = ? AND estado = 'Vigente'`,
      [tratamiento.vaca_id]
    );
    if (!vigentes || vigentes.total === 0) {
      db.runSync(`UPDATE vacas SET estado='Activa', fecha_actualizacion=datetime('now') WHERE id=? AND estado='En tratamiento'`, [tratamiento.vaca_id]);
    }
  }
  return result;
};

export const getResumenTratamientos = () => {
  const db = getDatabase();
  return db.getAllSync(
    `SELECT estado, COUNT(*) as total FROM tratamientos GROUP BY estado`
  );
};

export const getConteoVacas = () => {
  const db = getDatabase();
  return db.getFirstSync('SELECT COUNT(*) as total FROM vacas');
};

export const getConteoTratamientosVigentes = () => {
  const db = getDatabase();
  return db.getFirstSync(`SELECT COUNT(*) as total FROM tratamientos WHERE estado = 'Vigente'`);
};
