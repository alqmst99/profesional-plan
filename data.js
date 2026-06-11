export const proyectos = [
  {
    nombre: "Portal Corporativo - Empresa X",
    imagen: "assets/images/project-corporate.jpg",
    descripcion: "Sitio institucional para Empresa X con secciones de servicios, equipo y contacto.",
    codigo: "https://github.com/usuario/portal-corporativo",
    demo: "https://demo.com/portal-corporativo"
  },
  {
    nombre: "Landing de Producto - Producto Y",
    imagen: "assets/images/project-landing.jpg",
    descripcion: "Landing optimizada para conversión con formulario y seguimiento de campañas.",
    codigo: "https://github.com/usuario/landing-producto",
    demo: "https://demo.com/landing-producto"
  },
  {
    nombre: "Portfolio - Diseñadora Ana",
    imagen: "assets/images/project-portfolio.jpg",
    descripcion: "Portfolio personal con proyectos destacados y caso de estudio.",
    codigo: "https://github.com/usuario/portfolio-ana",
    demo: "https://demo.com/portfolio-ana"
  },
  {
    nombre: "E-commerce - Tienda Z",
    imagen: "assets/images/project-ecommerce.jpg",
    descripcion: "Tienda online con catálogo, carrito y pasarela de pago integrada.",
    codigo: "https://github.com/usuario/ecommerce-z",
    demo: "https://demo.com/ecommerce-z"
  }
];

export const servicios = [
  {
    tipo_servicio: "Landing page",
    tipo_plan: {
      plan: "Básico",
      content: { detalle: ["Sección principal", "Formulario", "WhatsApp directo", "Optimización liviana"] },
      precio: "95.000"
    }
  },
  {
    tipo_servicio: "Website completo",
    tipo_plan: {
      plan: "Profesional",
      content: { detalle: ["Páginas múltiples", "CMS básico", "Formulario avanzado", "Optimización SEO"] },
      precio: "220.000"
    }
  },
  {
    tipo_servicio: "Mantenimiento",
    tipo_plan: {
      plan: "Mensual",
      content: { detalle: ["Backups", "Actualizaciones", "Monitoreo de seguridad"] },
      precio: "15.000 / mes"
    }
  },
  {
    tipo_servicio: "E-commerce",
    tipo_plan: {
      plan: "Tienda",
      content: { detalle: ["Catálogo", "Carrito", "Pasarela de pago", "Integración logística"] },
      precio: "350.000"
    }
  }
];

export const blog = [
  {
    titulo: "Título del post",
    texto: "Contenido completo del post o resumen.",
    imagen: "ruta/imagen-post.jpg",
    tags: ["programación", "negocios", "fstail"],
    categoria: "Desarrollo Web"
  }
];