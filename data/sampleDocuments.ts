export interface SampleIntentDocument {
  id: string;
  intent: string;
  text: string;
}

export const sampleIntentDocuments: SampleIntentDocument[] = [
  //------------------------------------
  // A. Direct Product Searches
  // Pure product mentions: brand/model/format. No price/budget/comparison words.
  //------------------------------------
  { id: "A1", intent: "direct_product_search", text: "bolsa de cemento Holcim 50kg" },
  { id: "A2", intent: "direct_product_search", text: "tubería PVC de 1 pulgada para agua potable" },
  { id: "A3", intent: "direct_product_search", text: "pintura blanca lavable para interiores marca Sherwin" },
  { id: "A4", intent: "direct_product_search", text: "plancha de yeso de 1/2 pulgada tipo drywall" },
  { id: "A5", intent: "direct_product_search", text: "interruptor eléctrico blanco marca Schneider" },
  { id: "A6", intent: "direct_product_search", text: "porcelanato 60x60 beige para piso" },
  { id: "A7", intent: "direct_product_search", text: "malla electrosoldada 6mm en rollo" },
  { id: "A8", intent: "direct_product_search", text: "taladro inalámbrico Dewalt 20V" },

  //------------------------------------
  // B. Attribute-Based Searches
  // Focus on specs/characteristics, often generic or “any brand” phrasing.
  //------------------------------------
  { id: "B1", intent: "attribute_based_search", text: "cerámica 60x60 antideslizante para exterior, cualquier marca" },
  { id: "B2", intent: "attribute_based_search", text: "pernos galvanizados de 3/8 x 4 pulgadas como especificación" },
  { id: "B3", intent: "attribute_based_search", text: "ventanas de aluminio serie 25 sin importar la marca" },
  { id: "B4", intent: "attribute_based_search", text: "cables eléctricos calibre 12 AWG para instalación doméstica" },
  { id: "B5", intent: "attribute_based_search", text: "malla electrosoldada de 6 mm como característica del producto" },
  { id: "B6", intent: "attribute_based_search", text: "teja metálica calibre 28 color rojo como especificación" },
  { id: "B7", intent: "attribute_based_search", text: "pintura para interiores con acabado mate y lavable" },
  { id: "B8", intent: "attribute_based_search", text: "tubería para agua caliente que soporte alta presión y temperatura" },

  //------------------------------------
  // C. Problem-Solving Searches
  // “cómo…”, “solución…”, “qué usar para…”, “material para…”.
  //------------------------------------
  { id: "C1", intent: "problem_solving_search", text: "material para nivelar un piso que está muy desnivelado" },
  { id: "C2", intent: "problem_solving_search", text: "cómo impermeabilizar una terraza que tiene filtraciones" },
  { id: "C3", intent: "problem_solving_search", text: "solución para humedad en paredes interiores" },
  { id: "C4", intent: "problem_solving_search", text: "qué usar para pegar cerámica en exterior que reciba lluvia" },
  { id: "C5", intent: "problem_solving_search", text: "aislamiento acústico para paredes delgadas entre habitaciones" },
  { id: "C6", intent: "problem_solving_search", text: "cómo reparar un techo que tiene goteras" },
  { id: "C7", intent: "problem_solving_search", text: "material para evitar que el piso suene al caminar" },
  { id: "C8", intent: "problem_solving_search", text: "qué producto sirve para detener la humedad por capilaridad" },

  //------------------------------------
  // D. Comparison Searches
  // “vs”, “o”, “qué es mejor”, “diferencia entre…”.
  //------------------------------------
  { id: "D1", intent: "comparison_search", text: "diferencia entre pintura acrílica y pintura vinílica" },
  { id: "D2", intent: "comparison_search", text: "cemento Portland vs cemento de fraguado rápido" },
  { id: "D3", intent: "comparison_search", text: "PVC o CPVC, cuál es mejor para agua caliente" },
  { id: "D4", intent: "comparison_search", text: "cuál es la mejor marca de drywall en Ecuador" },
  { id: "D5", intent: "comparison_search", text: "qué es mejor para tubería: HDPE o PVC" },
  { id: "D6", intent: "comparison_search", text: "cerámica vs porcelanato para uso en exterior" },
  { id: "D7", intent: "comparison_search", text: "cables 12 AWG vs cables 14 AWG para casa" },
  { id: "D8", intent: "comparison_search", text: "pintura mate o satinada, cuál conviene más para sala" },

  //------------------------------------
  // E. Project-Based Searches
  // “materiales para…”, “qué necesito para…”, “lista de materiales…”.
  //------------------------------------
  { id: "E1", intent: "project_based_search", text: "materiales necesarios para construir una pérgola de madera" },
  { id: "E2", intent: "project_based_search", text: "qué necesito para instalar un baño completo desde cero" },
  { id: "E3", intent: "project_based_search", text: "herramientas básicas para remodelar una cocina pequeña" },
  { id: "E4", intent: "project_based_search", text: "equipos y materiales para construir una casa de 2 pisos" },
  { id: "E5", intent: "project_based_search", text: "materiales para hacer un contrapiso de hormigón" },
  { id: "E6", intent: "project_based_search", text: "lista de materiales para construir una bodega" },
  { id: "E7", intent: "project_based_search", text: "materiales para levantar una pared de drywall" },
  { id: "E8", intent: "project_based_search", text: "qué materiales se necesitan para hacer una terraza" },

  //------------------------------------
  // F. Budget or Bulk Searches
  // “barato”, “económico”, “al por mayor”, “por volumen”, “presupuesto”, “low cost”.
  //------------------------------------
  { id: "F1", intent: "bulk_or_budget_search", text: "cemento Holcim al por mayor en Quito" },
  { id: "F2", intent: "bulk_or_budget_search", text: "materiales económicos para hacer un cerramiento" },
  { id: "F3", intent: "bulk_or_budget_search", text: "pintura barata para obra gris" },
  { id: "F4", intent: "bulk_or_budget_search", text: "paquete completo y económico para instalación de tuberías" },
  { id: "F5", intent: "bulk_or_budget_search", text: "presupuesto de materiales para 20 m2 de cerámica" },
  { id: "F6", intent: "bulk_or_budget_search", text: "comprar tubería PVC por volumen a mejor precio" },
  { id: "F7", intent: "bulk_or_budget_search", text: "materiales low cost para remodelación básica" },
  { id: "F8", intent: "bulk_or_budget_search", text: "ofertas de materiales de construcción al por mayor" },

  //------------------------------------
  // G. Price Queries
  // Always explicitly talk about price: “precio”, “cuánto cuesta”, “cuánto vale”, “valor”.
  //------------------------------------
  { id: "G1", intent: "price_query", text: "precio de una bolsa de cemento Holcim de 50 kg" },
  { id: "G2", intent: "price_query", text: "cuánto cuesta la tubería PVC de 1 pulgada" },
  { id: "G3", intent: "price_query", text: "pintura para interiores, precio por galón" },
  { id: "G4", intent: "price_query", text: "precio de cerámica 60x60 antideslizante por metro cuadrado" },
  { id: "G5", intent: "price_query", text: "cuánto valen las láminas de drywall de 1/2 pulgada" },
  { id: "G6", intent: "price_query", text: "valor de la malla electrosoldada de 6 mm" },
  { id: "G7", intent: "price_query", text: "cuánto cuesta un taladro inalámbrico Dewalt" },
  { id: "G8", intent: "price_query", text: "precio del tubo HDPE de 32 mm por metro" },

  //------------------------------------
  // H. Navigation
  //------------------------------------
  { id: "H1", intent: "navigation", text: "Ir al panel principal del sistema" },
  { id: "H2", intent: "navigation", text: "Muéstrame la página de productos" },
  { id: "H3", intent: "navigation", text: "Abrir la sección de facturas" },
  { id: "H4", intent: "navigation", text: "Ver mis pedidos recientes" },
  { id: "H5", intent: "navigation", text: "Ir a la página de clientes" },
  { id: "H6", intent: "navigation", text: "Abrir configuración de la cuenta" },
  { id: "H7", intent: "navigation", text: "Mostrar el historial de compras" },
  { id: "H8", intent: "navigation", text: "Ir al menú principal" },

  //------------------------------------
  // I. Navigation with Parameters
  //------------------------------------
  { id: "I1", intent: "navigation_with_parameters", text: "Ver facturas del último mes" },
  { id: "I2", intent: "navigation_with_parameters", text: "Muéstrame productos filtrados por categoría eléctricos" },
  { id: "I3", intent: "navigation_with_parameters", text: "Listar cotizaciones entre enero y marzo" },
  { id: "I4", intent: "navigation_with_parameters", text: "Mostrar facturas solo las que están pendientes de pago" },
  { id: "I5", intent: "navigation_with_parameters", text: "Ver pedidos realizados hoy" },
  { id: "I6", intent: "navigation_with_parameters", text: "Mostrar productos con precio menor a 20 dólares" },
  { id: "I7", intent: "navigation_with_parameters", text: "Ver facturas del año 2023 únicamente" },
  { id: "I8", intent: "navigation_with_parameters", text: "Listar cotizaciones del cliente Pérez" }
];