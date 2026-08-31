# Don Aurelio · Catálogo por WhatsApp

Catálogo estático de abarrotes y antojitos, con categorías, búsqueda, cantidades,
resumen del pedido y enlace de WhatsApp. Publicado en
https://pamsb117.github.io/CatalogoWats/.

## Archivos

- `catalog.js`: productos, precios, categorías y número de WhatsApp original.
- `app.js`: filtros, búsqueda y carrito de uso local en la página.
- `styles.css`: diseño adaptable a computadora y celular.
- `index.html`: identidad, horarios y datos de ubicación.

No requiere instalar dependencias ni ejecutar una compilación. Para verlo localmente,
sirve esta carpeta con un servidor HTTP estático (los módulos JavaScript no deben
abrirse desde `file://`). GitHub Pages publica la rama `main` desde la raíz.

## Validación

Con Node.js 24:

```sh
npm run check
npm test
```

El flujo `Check catalog` comprueba sintaxis, precios, filtros y cálculo del pedido
en cada cambio. Las pruebas no envían pedidos ni mensajes.

El carrito se mantiene en memoria mientras la página permanece abierta; no almacena
datos de clientes. El enlace de WhatsApp prepara un mensaje que la persona debe
revisar y enviar. No hay pasarela de pago ni confirmación automática de existencias
o entrega. Se conserva el número de WhatsApp del código original. El teléfono de
ejemplo del pie anterior se sustituyó por instrucciones para pedir desde el catálogo.

## Imagen

`assets/oaxaca-hero.png` es una imagen generada e identificada como ilustrativa,
no una fotografía real de los productos del negocio. Se utiliza también para la
vista previa al compartir el enlace. Los datos del establecimiento proceden de la
versión original y deben confirmarse con el negocio antes de utilizarlo comercialmente.
