-- ============================================================
-- NEXTLEVEL ACADEMY - Leads / Contactos
-- ============================================================

CREATE TABLE public.leads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    nombre          TEXT NOT NULL,
    email           TEXT NOT NULL,
    telefono        TEXT,
    asunto          TEXT,
    mensaje         TEXT NOT NULL,
    origen          TEXT NOT NULL DEFAULT 'contacto_web',
    estado          TEXT NOT NULL DEFAULT 'nuevo' CHECK (estado IN ('nuevo','contactado','cerrado','spam')),
    metadata        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_estado_created_at ON public.leads(estado, created_at DESC);
CREATE INDEX idx_leads_email ON public.leads(email);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- No se exponen políticas públicas. El acceso se realiza desde server actions
-- usando la clave de servicio y desde panel admin autenticado.
