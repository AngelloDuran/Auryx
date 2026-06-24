# Auryx

Guia de instalacion y arranque para desarrollo local del proyecto Auryx.

El repositorio esta dividido en dos partes:
- `backend/`: Spring Boot + Maven
- `client/`: React + Vite

## Requisitos previos

Antes de iniciar, instala lo siguiente:
- Java 21
- MySQL
- Node.js
- npm

## 1. Clonar el repositorio

```bash
git clone https://github.com/AngelloDuran/Tienda_Auryx.git
cd Auryx
```

## 2. Crear la base de datos

El backend usa MySQL con una base llamada `auryx`.

Ejecuta en MySQL:

```sql
CREATE DATABASE auryx;
```

Si tu usuario o contrasena de MySQL son distintos, edita este archivo:

```text
backend/src/main/resources/application.properties
```

Valores importantes:
- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`

## 3. Levantar el backend Spring Boot

Abre una terminal dentro de `backend/`:

```bash
cd backend
```

Si es la primera vez, puedes compilar y descargar dependencias con:

```bash
./mvnw clean install
```

Luego inicia el servidor:

```bash
./mvnw spring-boot:run
```

En Windows usa:

```bash
mvnw.cmd spring-boot:run
```

El backend quedara disponible en:

```text
http://localhost:8080
```

## 4. Levantar el frontend React

Abre otra terminal dentro de `client/`:

```bash
cd client
```

Instala dependencias:

```bash
npm install
```

Inicia el frontend:

```bash
npm run dev
```

El frontend quedara disponible en:

```text
http://localhost:5173
```

## 5. Conexion entre frontend y backend

El frontend consume el backend en esta URL:

```text
http://localhost:8080/api
```

Eso significa que, en desarrollo, debes tener ambos servicios levantados al mismo tiempo.

## 6. Puntos importantes de configuracion

- CORS en Spring Boot esta habilitado solo para `http://localhost:5173`.
- Si cambias el puerto del frontend, actualiza `backend/src/main/java/com/auryx/backend/config/SecurityConfig.java`.
- Si cambias la URL del backend, actualiza `client/src/services/api.js`.
- El backend usa JWT y configura el secreto en `backend/src/main/resources/application.properties`.

## 7. Verificacion rapida

1. Levanta MySQL.
2. Crea la base `auryx`.
3. Inicia el backend con `./mvnw spring-boot:run`.
4. Inicia el frontend con `npm run dev`.
5. Abre `http://localhost:5173`.

## 8. Problemas comunes

- Error de conexion a MySQL: revisa usuario, contrasena, host y que la base `auryx` exista.
- Puerto 8080 ocupado: cierra el proceso que lo usa o cambia el puerto del backend.
- Puerto 5173 ocupado: detiene el otro proceso o cambia el puerto de Vite.
- Si el frontend no puede leer datos, confirma que el backend este corriendo y que la URL base siga siendo `http://localhost:8080/api`.

## 9. Estructura util del proyecto

- `backend/pom.xml`: dependencias y arranque de Spring Boot
- `backend/src/main/resources/application.properties`: configuracion de BD y JWT
- `client/package.json`: scripts de React/Vite
- `client/src/services/api.js`: llamadas al backend

