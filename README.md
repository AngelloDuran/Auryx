#  Auryx - Diseñador de Ropa Personalizada
<img width="1920" height="1042" alt="image" src="https://github.com/user-attachments/assets/c086361d-1c27-4944-bf6a-77743932f03c" />


Auryx es una plataforma web que permite a los usuarios **diseñar su propia ropa** de forma interactiva: subir imágenes, ajustar tamaños, rotar, cambiar colores y guardar sus creaciones. El proyecto está compuesto por un **backend en Spring Boot** (Java 21) y un **frontend en React + Vite** con TailwindCSS y visualización 3D con Three.js.

---

## 📌 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura y Migración](#-arquitectura-y-migración)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
  - [Backend (Spring Boot)](#backend-spring-boot)
  - [Frontend (React + Vite)](#frontend-react--vite)
- [Comandos de Ejecución](#-comandos-de-ejecución)
- [Endpoints Principales de la API](#-endpoints-principales-de-la-api)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Personalización y Guardado de Diseños](#-personalización-y-guardado-de-diseños)
- [Posibles Problemas y Soluciones](#-posibles-problemas-y-soluciones)
- [Licencia](#-licencia)

---

##  Características

- 🎨 **Editor 2D** para playeras, gorras, sudaderas, pantalones y prendas de pana.
- 🖼️ Subir imágenes propias, redimensionar, rotar y eliminar capas.
- 🪄 **Quitar fondo blanco** de imágenes con control de tolerancia.
- 🎨 Cambiar color de fondo de la prenda.
- 💾 **Guardar diseños** en la base de datos (MySQL) asociados al usuario autenticado.
- 🖱️ **Vista previa 3D** con modelo GLB (opcional, con controles de rotación y zoom).
- 📱 **Diseño responsivo** y modo oscuro integrado.

---

##  Tecnologías

| Área          | Tecnologías                                                                 |
|---------------|-----------------------------------------------------------------------------|
| **Backend**   | Java 21, Spring Boot 3.5.11, Spring Security, JWT, Spring Data JPA, MySQL   |
| **Frontend**  | React 18, Vite, TailwindCSS, React Router, Three.js, React Three Fiber      |
| **Utilidades**| html2canvas (exportar a PNG), react-rnd (arrastrar/redimensionar)           |
| **Base de datos** | MySQL 8                                                                 |

---

##  Arquitectura y Migración

El proyecto original estaba desarrollado con un backend en **FastAPI (Python)** utilizando SQLAlchemy y autenticación con JWT. Se realizó una **migración completa a Spring Boot** manteniendo la misma funcionalidad y estructura de API.

### Principales cambios de la migración:

| FastAPI → Spring Boot                     |
|-------------------------------------------|
| `sqlalchemy.orm` → JPA / Hibernate        |
| `pydantic` → DTOs con validación (`@Valid`)|
| `dependencies` → `@Service`, `@Repository` |
| `JWT` manual → `jjwt-api` + `JwtUtil`     |
| `SQLAlchemy models` → `@Entity`           |
| `routers` → `@RestController`             |

La estrategia de migración fue **incremental**:
1. Se creó un nuevo proyecto Spring Boot con las dependencias necesarias.
2. Se configuró la conexión a MySQL y JPA.
3. Se mapearon las entidades principales (`User`, `Design`).
4. Se implementó la autenticación JWT.
5. Se recrearon los endpoints de registro, login y guardado de diseños.
6. El frontend se adaptó únicamente cambiando la URL base de la API.

---

##  Requisitos Previos

Asegúrate de tener instalado:

- **Java 21** (o superior)
- **Node.js** (v18 o superior) y npm
- **MySQL** (v8 recomendado)
- **Git** (opcional)

---

## 🔧 Instalación y Configuración

### Backend (Spring Boot)

1. Clona el repositorio y accede a la carpeta del backend:

bash
git clone https://github.com/tu-usuario/Auryx.git
cd Auryx/backend

2.Crea la base de datos en MySQL (ejecuta el script que se encuentra en database/schema.sql – o usa el siguiente comando):
sql
CREATE DATABASE auryx CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

3.Configura las credenciales de la base de datos y el secreto JWT en el archivo src/main/resources/application.properties:

properties
spring.datasource.url=jdbc:mysql://localhost:3306/auryx?useSSL=false&serverTimezone=UTC
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_CONTRASEÑA
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000

4.Compila y ejecuta el backend (puedes usar el wrapper de Maven):

bash
./mvnw clean compile
./mvnw spring-boot:run
El backend quedará disponible en http://localhost:8080.

Frontend (React + Vite)
1.Abre otra terminal y ve a la carpeta del frontend:
bash
cd ../client

2.Instala las dependencias (si no las has hecho aún):

bash
npm install

3.Asegúrate de que la URL de la API en src/services/api.js apunte al backend:

javascript
const API_URL = 'http://localhost:8080/api';

4.Inicia el servidor de desarrollo:

bash
npm run dev
El frontend se abrirá en http://localhost:5173.

Comandos de Ejecución (resumen)
Componente	Comando
Backend	cd backend && ./mvnw spring-boot:run
Frontend	cd client && npm run dev
Compilar backend	cd backend && ./mvnw clean compile
Crear JAR	cd backend && ./mvnw clean package
Ejecutar JAR	java -jar target/backend-0.0.1-SNAPSHOT.jar
Nota: En Windows usa mvnw.cmd en lugar de ./mvnw.

