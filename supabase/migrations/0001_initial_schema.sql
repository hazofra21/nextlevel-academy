-- ============================================================
-- NEXTLEVEL ACADEMY - Esquema inicial de base de datos
-- ============================================================

-- ============================================================
-- PERFILES DE USUARIO
-- ============================================================
CREATE TABLE public.profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           TEXT NOT NULL UNIQUE,
    nombre          TEXT NOT NULL,
    apellidos       TEXT NOT NULL,
    telefono        TEXT,
    fecha_nacimiento DATE,
    nivel_hockey    TEXT CHECK (nivel_hockey IN ('principiante','intermedio','avanzado','competicion')),
    posicion        TEXT CHECK (posicion IN ('portero','defensa','delantero','N/A')),
    club_actual     TEXT,
    foto_url        TEXT,
    direccion       JSONB,
    rol             TEXT NOT NULL DEFAULT 'alumno' CHECK (rol IN ('alumno','admin','superadmin')),
    activo          BOOLEAN NOT NULL DEFAULT true,
    notas_internas  TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROGRAMAS PRESENCIALES (tecnificaciones y campamentos)
-- ============================================================
CREATE TABLE public.programas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo            TEXT NOT NULL CHECK (tipo IN ('tecnificacion','campamento','clinica')),
    slug            TEXT NOT NULL UNIQUE,
    titulo          TEXT NOT NULL,
    descripcion     TEXT NOT NULL,
    descripcion_corta TEXT,
    imagen_portada  TEXT,
    imagenes        TEXT[],
    fecha_inicio    DATE NOT NULL,
    fecha_fin       DATE NOT NULL,
    hora_inicio     TIME,
    hora_fin        TIME,
    dias_semana     TEXT[],
    ubicacion       TEXT NOT NULL,
    direccion_ubicacion TEXT,
    ciudad          TEXT,
    plazas_totales  INTEGER NOT NULL,
    plazas_reservadas INTEGER NOT NULL DEFAULT 0,
    precio          DECIMAL(10,2) NOT NULL,
    precio_reducido DECIMAL(10,2),
    precio_reducido_hasta TIMESTAMPTZ,
    edad_minima     INTEGER,
    edad_maxima     INTEGER,
    nivel_requerido TEXT CHECK (nivel_requerido IN ('todos','principiante','intermedio','avanzado','competicion')),
    incluye         TEXT[],
    requisitos      TEXT[],
    horario_detalle JSONB,
    meta_titulo     TEXT,
    meta_descripcion TEXT,
    publicado       BOOLEAN NOT NULL DEFAULT false,
    destacado       BOOLEAN NOT NULL DEFAULT false,
    orden           INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CURSOS ONLINE
-- ============================================================
CREATE TABLE public.cursos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT NOT NULL UNIQUE,
    titulo          TEXT NOT NULL,
    descripcion     TEXT NOT NULL,
    descripcion_corta TEXT,
    imagen_portada  TEXT,
    video_preview   TEXT,
    categoria       TEXT NOT NULL,
    nivel           TEXT CHECK (nivel IN ('todos','principiante','intermedio','avanzado')),
    tags            TEXT[],
    precio          DECIMAL(10,2) NOT NULL DEFAULT 0,
    precio_original DECIMAL(10,2),
    es_gratuito     BOOLEAN NOT NULL DEFAULT false,
    instructor_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    instructor_nombre TEXT,
    instructor_bio  TEXT,
    instructor_foto TEXT,
    total_alumnos   INTEGER NOT NULL DEFAULT 0,
    total_lecciones INTEGER NOT NULL DEFAULT 0,
    duracion_total_minutos INTEGER NOT NULL DEFAULT 0,
    valoracion_media DECIMAL(3,2),
    total_valoraciones INTEGER NOT NULL DEFAULT 0,
    meta_titulo     TEXT,
    meta_descripcion TEXT,
    publicado       BOOLEAN NOT NULL DEFAULT false,
    destacado       BOOLEAN NOT NULL DEFAULT false,
    orden           INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MÓDULOS DE CURSOS
-- ============================================================
CREATE TABLE public.modulos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id        UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
    titulo          TEXT NOT NULL,
    descripcion     TEXT,
    orden           INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LECCIONES
-- ============================================================
CREATE TABLE public.lecciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modulo_id       UUID NOT NULL REFERENCES public.modulos(id) ON DELETE CASCADE,
    curso_id        UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
    titulo          TEXT NOT NULL,
    descripcion     TEXT,
    tipo            TEXT NOT NULL CHECK (tipo IN ('video','texto','pdf','quiz')),
    orden           INTEGER NOT NULL DEFAULT 0,
    video_url       TEXT,
    video_duracion_segundos INTEGER,
    contenido_texto TEXT,
    archivo_url     TEXT,
    es_preview      BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROGRESO DE LECCIONES
-- ============================================================
CREATE TABLE public.progreso_lecciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    leccion_id      UUID NOT NULL REFERENCES public.lecciones(id) ON DELETE CASCADE,
    curso_id        UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
    completada      BOOLEAN NOT NULL DEFAULT false,
    segundos_vistos INTEGER DEFAULT 0,
    ultima_posicion_segundos INTEGER DEFAULT 0,
    completada_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(alumno_id, leccion_id)
);

-- ============================================================
-- ACCESO A CURSOS
-- ============================================================
CREATE TABLE public.acceso_cursos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    curso_id        UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
    pedido_id       UUID,
    tipo_acceso     TEXT NOT NULL DEFAULT 'compra' CHECK (tipo_acceso IN ('compra','regalo','manual','prueba')),
    activo          BOOLEAN NOT NULL DEFAULT true,
    fecha_expiracion TIMESTAMPTZ,
    progreso_porcentaje INTEGER DEFAULT 0,
    completado      BOOLEAN NOT NULL DEFAULT false,
    completado_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(alumno_id, curso_id)
);

-- ============================================================
-- INSCRIPCIONES A PROGRAMAS
-- ============================================================
CREATE TABLE public.inscripciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    programa_id     UUID NOT NULL REFERENCES public.programas(id) ON DELETE RESTRICT,
    pedido_id       UUID,
    estado          TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','confirmada','en_espera','cancelada','completada')),
    participante_nombre TEXT,
    participante_apellidos TEXT,
    participante_fecha_nacimiento DATE,
    participante_nivel TEXT,
    talla_camiseta  TEXT,
    talla_casco     TEXT,
    numero_pie      INTEGER,
    alergias        TEXT,
    condiciones_medicas TEXT,
    contacto_emergencia_nombre TEXT,
    contacto_emergencia_telefono TEXT,
    autorizacion_imagen BOOLEAN DEFAULT false,
    notas           TEXT,
    notas_internas  TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(alumno_id, programa_id)
);

-- ============================================================
-- CATEGORÍAS DE PRODUCTOS
-- ============================================================
CREATE TABLE public.categorias_productos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT NOT NULL UNIQUE,
    nombre          TEXT NOT NULL,
    descripcion     TEXT,
    imagen          TEXT,
    padre_id        UUID REFERENCES public.categorias_productos(id),
    orden           INTEGER DEFAULT 0,
    activo          BOOLEAN NOT NULL DEFAULT true
);

-- ============================================================
-- PRODUCTOS
-- ============================================================
CREATE TABLE public.productos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT NOT NULL UNIQUE,
    nombre          TEXT NOT NULL,
    descripcion     TEXT NOT NULL,
    descripcion_corta TEXT,
    tipo            TEXT NOT NULL CHECK (tipo IN ('fisico','digital','servicio')),
    categoria_id    UUID REFERENCES public.categorias_productos(id) ON DELETE SET NULL,
    imagen_principal TEXT,
    imagenes        TEXT[],
    precio_base     DECIMAL(10,2) NOT NULL,
    precio_original DECIMAL(10,2),
    iva_porcentaje  DECIMAL(5,2) NOT NULL DEFAULT 21.00,
    gestionar_stock BOOLEAN NOT NULL DEFAULT false,
    stock           INTEGER DEFAULT 0,
    stock_minimo    INTEGER DEFAULT 5,
    peso_gramos     INTEGER,
    dimensiones     JSONB,
    requiere_envio  BOOLEAN NOT NULL DEFAULT false,
    curso_id        UUID REFERENCES public.cursos(id) ON DELETE SET NULL,
    meta_titulo     TEXT,
    meta_descripcion TEXT,
    publicado       BOOLEAN NOT NULL DEFAULT false,
    destacado       BOOLEAN NOT NULL DEFAULT false,
    tags            TEXT[],
    orden           INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- VARIANTES DE PRODUCTOS
-- ============================================================
CREATE TABLE public.producto_variantes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id     UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
    nombre          TEXT NOT NULL,
    opciones        JSONB NOT NULL,
    sku             TEXT UNIQUE,
    precio          DECIMAL(10,2),
    stock           INTEGER NOT NULL DEFAULT 0,
    imagen          TEXT,
    activo          BOOLEAN NOT NULL DEFAULT true,
    orden           INTEGER DEFAULT 0
);

-- ============================================================
-- CUPONES DE DESCUENTO
-- ============================================================
CREATE TABLE public.cupones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo          TEXT NOT NULL UNIQUE,
    descripcion     TEXT,
    tipo_descuento  TEXT NOT NULL CHECK (tipo_descuento IN ('porcentaje','importe_fijo')),
    valor           DECIMAL(10,2) NOT NULL,
    uso_maximo      INTEGER,
    usos_actuales   INTEGER NOT NULL DEFAULT 0,
    uso_por_usuario INTEGER DEFAULT 1,
    importe_minimo  DECIMAL(10,2),
    aplica_a        TEXT DEFAULT 'todo' CHECK (aplica_a IN ('todo','productos','cursos','programas')),
    productos_ids   UUID[],
    activo          BOOLEAN NOT NULL DEFAULT true,
    valido_desde    TIMESTAMPTZ,
    valido_hasta    TIMESTAMPTZ,
    stripe_coupon_id TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PEDIDOS
-- ============================================================
CREATE SEQUENCE pedido_numero_seq;

CREATE TABLE public.pedidos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_pedido   TEXT NOT NULL UNIQUE,
    cliente_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    estado          TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','pagado','en_proceso','enviado','entregado','cancelado','reembolsado')),
    subtotal        DECIMAL(10,2) NOT NULL,
    descuento_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    envio_coste     DECIMAL(10,2) NOT NULL DEFAULT 0,
    iva_total       DECIMAL(10,2) NOT NULL,
    total           DECIMAL(10,2) NOT NULL,
    moneda          TEXT NOT NULL DEFAULT 'EUR',
    cupon_id        UUID REFERENCES public.cupones(id) ON DELETE SET NULL,
    cupon_codigo    TEXT,
    cupon_descuento DECIMAL(10,2) DEFAULT 0,
    envio_nombre    TEXT,
    envio_apellidos TEXT,
    envio_email     TEXT NOT NULL,
    envio_telefono  TEXT,
    envio_direccion JSONB,
    facturacion_igual_envio BOOLEAN DEFAULT true,
    facturacion_datos JSONB,
    factura_numero  TEXT,
    factura_url     TEXT,
    stripe_session_id TEXT,
    stripe_payment_intent TEXT,
    transportista   TEXT,
    numero_seguimiento TEXT,
    enviado_at      TIMESTAMPTZ,
    entregado_at    TIMESTAMPTZ,
    notas_cliente   TEXT,
    notas_internas  TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger para número de pedido automático
CREATE OR REPLACE FUNCTION generar_numero_pedido()
RETURNS TRIGGER AS $$
BEGIN
    NEW.numero_pedido := 'NLA-' || to_char(NOW(), 'YYYY') || '-' ||
                         lpad(nextval('pedido_numero_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_numero_pedido
    BEFORE INSERT ON public.pedidos
    FOR EACH ROW EXECUTE FUNCTION generar_numero_pedido();

-- ============================================================
-- LÍNEAS DE PEDIDO
-- ============================================================
CREATE TABLE public.pedido_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id       UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
    producto_id     UUID REFERENCES public.productos(id) ON DELETE SET NULL,
    variante_id     UUID REFERENCES public.producto_variantes(id) ON DELETE SET NULL,
    programa_id     UUID REFERENCES public.programas(id) ON DELETE SET NULL,
    tipo            TEXT NOT NULL CHECK (tipo IN ('producto_fisico','curso','inscripcion','otro')),
    nombre_snapshot TEXT NOT NULL,
    sku_snapshot    TEXT,
    imagen_snapshot TEXT,
    opciones_snapshot JSONB,
    cantidad        INTEGER NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento       DECIMAL(10,2) NOT NULL DEFAULT 0,
    iva_porcentaje  DECIMAL(5,2) NOT NULL,
    total           DECIMAL(10,2) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PAGOS
-- ============================================================
CREATE TABLE public.pagos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id       UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE RESTRICT,
    tipo            TEXT NOT NULL CHECK (tipo IN ('cobro','reembolso_total','reembolso_parcial')),
    estado          TEXT NOT NULL CHECK (estado IN ('pendiente','completado','fallido','cancelado')),
    importe         DECIMAL(10,2) NOT NULL,
    moneda          TEXT NOT NULL DEFAULT 'EUR',
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_charge_id TEXT,
    stripe_refund_id TEXT,
    metodo_pago     TEXT,
    marca_tarjeta   TEXT,
    ultimos4        TEXT,
    es_manual       BOOLEAN NOT NULL DEFAULT false,
    admin_id        UUID REFERENCES public.profiles(id),
    notas_pago      TEXT,
    procesado_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- VALORACIONES DE CURSOS
-- ============================================================
CREATE TABLE public.valoraciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    curso_id        UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
    puntuacion      INTEGER NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    titulo          TEXT,
    comentario      TEXT,
    publicada       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(alumno_id, curso_id)
);

-- ============================================================
-- CLASES PERSONALES
-- ============================================================
CREATE TABLE public.clases_personales (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    pedido_id       UUID REFERENCES public.pedidos(id) ON DELETE SET NULL,
    instructor_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    estado          TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','confirmada','completada','cancelada')),
    fecha_propuesta DATE[],
    fecha_confirmada TIMESTAMPTZ,
    duracion_minutos INTEGER NOT NULL DEFAULT 60,
    modalidad       TEXT CHECK (modalidad IN ('presencial','videollamada')),
    ubicacion       TEXT,
    enlace_videollamada TEXT,
    objetivos       TEXT,
    notas_post_sesion TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CONFIGURACIÓN DE LA ACADEMIA
-- ============================================================
CREATE TABLE public.configuracion (
    id              INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    nombre_academia TEXT NOT NULL DEFAULT 'NextLevel Academy',
    email_contacto  TEXT,
    telefono        TEXT,
    direccion       TEXT,
    redes_sociales  JSONB,
    envio_gratuito_desde DECIMAL(10,2),
    coste_envio_nacional DECIMAL(10,2) DEFAULT 5.99,
    coste_envio_internacional DECIMAL(10,2),
    email_notificaciones TEXT,
    politica_privacidad TEXT,
    terminos_condiciones TEXT,
    politica_cookies TEXT,
    politica_devoluciones TEXT,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insertar configuración inicial
INSERT INTO public.configuracion (id, nombre_academia) VALUES (1, 'NextLevel Academy');

-- ============================================================
-- NOTIFICACIONES
-- ============================================================
CREATE TABLE public.notificaciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tipo            TEXT NOT NULL,
    titulo          TEXT NOT NULL,
    mensaje         TEXT NOT NULL,
    leida           BOOLEAN NOT NULL DEFAULT false,
    url             TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FK CIRCULARES
-- ============================================================
ALTER TABLE public.acceso_cursos
    ADD CONSTRAINT fk_acceso_pedido
    FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON DELETE SET NULL;

ALTER TABLE public.inscripciones
    ADD CONSTRAINT fk_inscripcion_pedido
    FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON DELETE SET NULL;

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_programas_tipo ON public.programas(tipo);
CREATE INDEX idx_programas_publicado ON public.programas(publicado, fecha_inicio);
CREATE INDEX idx_cursos_publicado ON public.cursos(publicado, categoria);
CREATE INDEX idx_productos_tipo ON public.productos(tipo, publicado);
CREATE INDEX idx_productos_categoria ON public.productos(categoria_id);
CREATE INDEX idx_inscripciones_alumno ON public.inscripciones(alumno_id);
CREATE INDEX idx_inscripciones_programa ON public.inscripciones(programa_id);
CREATE INDEX idx_acceso_cursos_alumno ON public.acceso_cursos(alumno_id);
CREATE INDEX idx_pedidos_cliente ON public.pedidos(cliente_id);
CREATE INDEX idx_pedidos_estado ON public.pedidos(estado, created_at DESC);
CREATE INDEX idx_pedido_items_pedido ON public.pedido_items(pedido_id);
CREATE INDEX idx_progreso_alumno_curso ON public.progreso_lecciones(alumno_id, curso_id);
CREATE INDEX idx_pagos_pedido ON public.pagos(pedido_id);
CREATE INDEX idx_programas_slug ON public.programas(slug);
CREATE INDEX idx_cursos_slug ON public.cursos(slug);
CREATE INDEX idx_productos_slug ON public.productos(slug);

-- ============================================================
-- TRIGGER PLAZAS PROGRAMA
-- ============================================================
CREATE OR REPLACE FUNCTION actualizar_plazas_programa()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.estado NOT IN ('cancelada') THEN
        UPDATE public.programas
        SET plazas_reservadas = plazas_reservadas + 1
        WHERE id = NEW.programa_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.estado != 'cancelada' AND NEW.estado = 'cancelada' THEN
        UPDATE public.programas
        SET plazas_reservadas = GREATEST(0, plazas_reservadas - 1)
        WHERE id = NEW.programa_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_plazas_programa
    AFTER INSERT OR UPDATE ON public.inscripciones
    FOR EACH ROW EXECUTE FUNCTION actualizar_plazas_programa();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progreso_lecciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acceso_cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producto_variantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cupones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valoraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clases_personales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;

-- Perfiles: cada usuario ve el suyo, admins ven todos
CREATE POLICY "perfil_propio" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "admins_todos_perfiles" ON public.profiles
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol IN ('admin','superadmin'))
    );

-- Programas públicos: todos pueden leer los publicados
CREATE POLICY "programas_publicos" ON public.programas
    FOR SELECT USING (publicado = true);

CREATE POLICY "admins_programas" ON public.programas
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol IN ('admin','superadmin'))
    );

-- Cursos públicos
CREATE POLICY "cursos_publicos" ON public.cursos
    FOR SELECT USING (publicado = true);

CREATE POLICY "admins_cursos" ON public.cursos
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol IN ('admin','superadmin'))
    );

-- Lecciones: preview gratis, el resto requiere acceso al curso
CREATE POLICY "lecciones_preview" ON public.lecciones
    FOR SELECT USING (es_preview = true);

CREATE POLICY "lecciones_con_acceso" ON public.lecciones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.acceso_cursos
            WHERE alumno_id = auth.uid() AND curso_id = lecciones.curso_id AND activo = true
        )
    );

-- Productos públicos
CREATE POLICY "productos_publicos" ON public.productos
    FOR SELECT USING (publicado = true);

CREATE POLICY "admins_productos" ON public.productos
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol IN ('admin','superadmin'))
    );

-- Variantes públicas de productos publicados
CREATE POLICY "variantes_publicas" ON public.producto_variantes
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.productos WHERE id = producto_variantes.producto_id AND publicado = true)
    );

-- Categorías siempre visibles
CREATE POLICY "categorias_publicas" ON public.categorias_productos
    FOR SELECT USING (activo = true);

-- Pedidos: solo el propio cliente
CREATE POLICY "pedidos_propios" ON public.pedidos
    FOR ALL USING (cliente_id = auth.uid());

CREATE POLICY "admins_pedidos" ON public.pedidos
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol IN ('admin','superadmin'))
    );

-- Notificaciones propias
CREATE POLICY "notificaciones_propias" ON public.notificaciones
    FOR ALL USING (usuario_id = auth.uid());

-- Configuración: todos pueden leer, solo admins modificar
CREATE POLICY "configuracion_publica" ON public.configuracion
    FOR SELECT USING (true);

CREATE POLICY "admins_configuracion" ON public.configuracion
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol IN ('admin','superadmin'))
    );
