# Conversor de Formatos de Mensajería

Este proyecto es una aplicación web que permite convertir distintos formatos de mensajería, como JSON a SOAP y viceversa. El frontend está desarrollado con **React**, mientras que el backend está implementado en **Python** y montado en un servidor independiente.

## Funcionalidades

- Conversión entre JSON y SOAP
- Soporte para múltiples formatos de mensajería
- Interfaz de usuario intuitiva y responsiva
- Backend independiente que realiza las conversiones

## Tecnologías utilizadas

### Frontend
- **React**: Framework de JavaScript para construir interfaces de usuario.
- **Vite**: Herramienta rápida de desarrollo y compilación.
- **CSS**: Estilos personalizados para la aplicación.

### Backend
- **Python**: Lenguaje utilizado para implementar la lógica de conversión.
- **Flask**: Servidor web utilizado para procesar las solicitudes REST y realizar las conversiones.
  
## Instalación y uso

### Requisitos previos
- Node.js (para correr el frontend)
- Python 3.8 o superior (para el backend)
- [Instalar dependencias de Python](https://pip.pypa.io/en/stable/installation/) si es necesario


### 1. Instalación del frontend

Clona el repositorio:

```
git clone https://github.com/Jhons14/FrontConverter.git
```

Navega al directorio del frontend e Instala las dependencias:
```
cd FrontConverter
npm install
```
Inicia el servidor de desarrollo:
```
npm run dev
```
El frontend estará disponible en http://localhost:5173.

### 2. Instalación del backend

Clonar el repositorio:
```
https://github.com/Jhons14/BackConverter.git
```

Navega al directorio del backend:

```
cd backend
```

(Opcional) Crea y activa un entorno virtual:

```
python -m venv venv
venv\Scripts\activate
```
Instala las dependencias:
```
pip install -r requirements.txt
```

Inicia el servidor:
```
python app.py
```
El backend estará disponible en http://localhost:5000.
