# 🚨 Informe d'Incidència: INC-2026-01

**Títol:** Error 500 en la càrrega de productes per part dels usuaris
**Data:** 18/05/2026
**Severitat:** Alta (Impacta en les vendes)
**Estat:** Solucionat

---

## 1. Descripció de l'incidència
Alguns usuaris van reportar que al carregar la pàgina de la botiga principal (`/tienda`), apareixia un missatge d'error o no es mostraven els productes disponibles.

---

## 2. Com es va detectar (Gràcies a l'Observabilitat)

### 📈 Logs automàtics
El nostre middleware `httpLogger` va registrar una petició amb codi d'estat `500` i va generar automàticament un **Request ID** únic per fer el seguiment:

```json
{
  "level": 50,
  "time": "2026-05-18T10:15:30.456Z",
  "requestId": "e3b8a1c9-7d4f-4d32-9c12-32a98f12c7d9",
  "userId": null,
  "req": {
    "method": "GET",
    "url": "/api/products"
  },
  "res": {
    "statusCode": 500
  },
  "msg": "GET /api/products failed with status 500"
}
```

### 🔍 Traçabilitat amb Request ID
Mitjançant el **Request ID** (`e3b8a1c9-7d4f-4d32-9c12-32a98f12c7d9`), vam poder filtrar els logs manuals al controlador `productController.js` i al `errorHandler.js` per veure exactament quin error es va produir en aquesta petició concreta:

```json
{
  "level": 50,
  "time": "2026-05-18T10:15:30.459Z",
  "requestId": "e3b8a1c9-7d4f-4d32-9c12-32a98f12c7d9",
  "message": "Product validation failed: categoria: `roba` is not a valid enum value for path `categoria`.",
  "stack": "ValidationError: Product validation failed: categoria: `roba` is not a valid enum value for path `categoria`...\n   at Product.validate...",
  "msg": "Unhandled error"
}
```

---

## 3. Anàlisi i Causa Arrel
* **Causa Arrel:** Es va intentar inserir productes mitjançant un seed o migració que feia servir categories no permeses per l'esquema de Mongoose (`Product.js`). L'esquema només accepta `['interior', 'exterior', 'suculentas', 'florales']`, mentre que s'intentaven inserir com a `roba` o `calçat`.
* **Impacte:** L'API fallava immediatament en intentar guardar o validar els productes, retornant un error `500` i impedint que la botiga es mostrés correctament.

---

## 4. Resolució i Prevenció
1. **Acció Immediata:** Es va corregir l'esquema de validació i es va corregir l'script de seed (`seedProducts.js`) per fer servir només les categories vàlides (`interior`, `exterior`, `suculentas`, `florales`).
2. **Prevenció:** Es va deixar actiu el logger estructural amb Pino per detectar qualsevol error de validació similar abans d'arribar a l'usuari final.
