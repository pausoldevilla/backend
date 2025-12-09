# Backend – Soldevilla  

Aquest és el backend de **Soldevilla**, una plataforma centrada en la compra de plantes.  

---

## Tecnologies previstes  
- **Node.js** (Express.js per a API REST)  
- **Base de dades NoSQL (MongoDB)**  
- **Autenticació amb JWT** per a gestió de sessions  

---

## Funcionalitats principals  
- **Gestió d’usuaris:** registre, login, rols (usuari i administrador)  
- **CRUD d’articles:** crear, llegir, actualitzar i eliminar anuncis  
- **Missatgeria interna:** contacte amb el venedor  
- **Favorits:** guardar i consultar articles marcats  
- **Gestió de categories i filtres:** per organitzar i facilitar la cerca  
- **Administració (opcional):** control d’anuncis fraudulents i gestió de contingut  

---

## Requisits no funcionals  
- **API REST:** endpoints clars i documentats  
- **Seguretat:** xifratge de contrasenyes (bcrypt), validació de dades i rols  
- **Escalabilitat:** pensat per suportar gran volum d’anuncis i usuaris  
- **Compatibilitat:** integració fluida amb el frontend en React  
- **Disponibilitat:** arquitectura preparada per desplegament al núvol  
