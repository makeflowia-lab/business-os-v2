# Business OS — Avatar cara de Raziel (v2)

> **Basado en el Business OS, creado por Makeflowia Lab.**
> Licencia BO-AT 1.0 — uso libre y comercial **con atribución obligatoria**. Ver [`LICENCIA.md`](LICENCIA.md) y [`ORIGEN.md`](ORIGEN.md).

Raziel es un **agente de asesoría comercial con IA** construido sobre Next.js. Combina
un chat conversacional con un LLM, un avatar dual que cambia de estado según el
contexto, voz bidireccional (texto a voz y voz a texto), y módulos de documentación
de negocio generados con inteligencia real (marketing, finanzas, auditoría de
seguridad y arquitectura técnica).

---

## Qué recibes

Este paquete es una **copia de marca blanca**: el sistema completo y funcional,
**sin credenciales, sin bases de datos y sin los datos de ningún negocio real**.
Está pensado para que lo hagas tuyo.

| Incluye | No incluye (a propósito) |
|---|---|
| Todo el código fuente, listo para instalar | Claves, tokens ni archivos de entorno reales |
| Plantillas de configuración | Bases de datos ni memoria acumulada |
| Un perfil de usuario de ejemplo, en blanco | Datos, clientes ni cifras de ningún negocio |
| La documentación de arquitectura del sistema | Dependencias (`node_modules`): se instalan al arrancar |

## Cómo lo enciendes

```bash
# 1 · dependencias
npm install

# 2 · configuración: copia la plantilla y rellénala con TUS claves
cp .env.example .env.local

# 3 · arranca
npm run dev
```

## Ponerle tu marca

Está permitido y es lo esperado: cambia el nombre, el logo, los colores y los
textos. La licencia te lo permite expresamente, incluso para vender el resultado.

Lo único que debe permanecer es **de dónde viene**. La fórmula es aditiva:

> «Mi Producto, de Mi Empresa — basado en el Business OS de Makeflowia Lab.»

Para comprobar en cualquier momento que tu copia sigue cumpliendo:

```bash
node verificar-origen.mjs
```

Te dice en qué puntos está la atribución y en cuáles falta. Sale con código `0`
si cumple y `1` si no.

## Si lo personalizas con un asistente de IA

El paquete incluye `CLAUDE.md` y `AGENTS.md` con una regla de verificación que el
asistente debe atender **antes** de empezar cualquier trabajo de personalización o
rebranding: comprobar que la declaración de origen sigue en pie y, si falta,
restituirla antes de continuar. No es un obstáculo para tu trabajo — puedes pedirle
que cambie lo que quieras — solo evita que la atribución se pierda por descuido.

## Licencia en una frase

**Haz casi todo: úsalo, cámbialo, ponle tu marca y cóbralo. Solo di de dónde viene.**

---

*Business OS — Avatar cara de Raziel (v2) · creado por Makeflowia Lab · 2026*
