# Visor de PDF (Vue.js)

Un visor de PDF simple y moderno construido con el framework Vue.js. Este proyecto utiliza `pdf.js` de Mozilla para el renderizado de documentos en el navegador.

## Características

* **Renderizado de PDF:** Muestra documentos PDF en el navegador usando Canvas.
* **Vista Dual/Simple:** Cambia automáticamente entre vista de página doble (formato libro) o página simple, basado en el tamaño de la ventana.
* **Navegación por Miniaturas:** Un panel lateral (sidebar) muestra todas las páginas como miniaturas para una navegación rápida.
* **Carga de Archivos:** Permite al usuario subir sus propios archivos PDF.
* **Modo Oscuro:** Incluye un interruptor para cambiar el tema de la aplicación.
* **Diseño Responsivo:** La interfaz se adapta a diferentes tamaños de pantalla.

## Tecnologías Utilizadas

* **Vue.js (Vue 3):** Utilizando el Composition API (`<script setup>`).
* **pdf.js:** Biblioteca para el parseo y renderizado de los archivos PDF.

## Cómo Ejecutar el Proyecto

Este proyecto está contenido dentro de la carpeta `/vue-app`.

1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/tu-usuario/tu-repo.git](https://github.com/tu-usuario/tu-repo.git)
    ```

2.  Navega a la carpeta de la aplicación Vue:
    ```bash
    cd tu-repo/vue-app
    ```

3.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```

4.  Inicia el servidor de desarrollo:
    ```bash
    npm run serve
    ```

5.  Abre tu navegador y visita `http://localhost:8080`.
