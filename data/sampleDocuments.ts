/**
 * Sample Intent Documents
 * Collection of sample documents for intent classification training and testing.
 */

export interface SampleIntentDocument {
  id: string;
  intent: string;
  text: string;
}

export const sampleIntentDocuments: SampleIntentDocument[] = [
  //------------------------------------
  // A. Direct Product Searches
  //------------------------------------
  { id: "A1", intent: "direct_product_search", text: "cemento holcim 50kg" },
  { id: "A2", intent: "direct_product_search", text: "tubería pvc 1 pulgada para agua potable" },
  { id: "A3", intent: "direct_product_search", text: "pintura blanca lavable para interiores" },
  { id: "A4", intent: "direct_product_search", text: "plancha de yeso 1/2" },
  { id: "A5", intent: "direct_product_search", text: "interruptor eléctrico blanco schneider" },

  //------------------------------------
  // B. Attribute-Based Searches
  //------------------------------------
  { id: "B1", intent: "attribute_based_search", text: "cerámica 60x60 antideslizante" },
  { id: "B2", intent: "attribute_based_search", text: "pernos galvanizados 3/8 x 4" },
  { id: "B3", intent: "attribute_based_search", text: "ventanas aluminio serie 25" },
  { id: "B4", intent: "attribute_based_search", text: "cables eléctricos 12 AWG" },
  { id: "B5", intent: "attribute_based_search", text: "malla electrosoldada 6mm" },

  //------------------------------------
  // C. Problem-Solving Searches
  //------------------------------------
  { id: "C1", intent: "problem_solving_search", text: "material para nivelar piso desnivelado" },
  { id: "C2", intent: "problem_solving_search", text: "cómo impermeabilizar terraza" },
  { id: "C3", intent: "problem_solving_search", text: "solución para humedad en paredes" },
  { id: "C4", intent: "problem_solving_search", text: "qué usar para pegar cerámica en exterior" },
  { id: "C5", intent: "problem_solving_search", text: "aislamiento acústico para paredes delgadas" },

  //------------------------------------
  // D. Comparison Searches
  //------------------------------------
  { id: "D1", intent: "comparison_search", text: "pintura acrílica vs pintura vinílica" },
  { id: "D2", intent: "comparison_search", text: "cemento portland vs cemento rápido" },
  { id: "D3", intent: "comparison_search", text: "pvc vs cpvc para agua caliente" },
  { id: "D4", intent: "comparison_search", text: "mejor marca de drywall en Ecuador" },
  { id: "D5", intent: "comparison_search", text: "qué es mejor: tubería HDPE o PVC" },

  //------------------------------------
  // E. Project-Based Searches
  //------------------------------------
  { id: "E1", intent: "project_based_search", text: "materiales para construir pérgola" },
  { id: "E2", intent: "project_based_search", text: "qué necesito para instalar un baño completo" },
  { id: "E3", intent: "project_based_search", text: "herramientas para remodelar cocina" },
  { id: "E4", intent: "project_based_search", text: "equipos para construcción de casa de 2 pisos" },
  { id: "E5", intent: "project_based_search", text: "materiales para hacer un contrapiso" },

  //------------------------------------
  // F. Budget or Bulk Searches
  //------------------------------------
  { id: "F1", intent: "bulk_or_budget_search", text: "cemento al por mayor Quito" },
  { id: "F2", intent: "bulk_or_budget_search", text: "materiales económicos para cerramiento" },
  { id: "F3", intent: "bulk_or_budget_search", text: "pintura barata para obra gris" },
  { id: "F4", intent: "bulk_or_budget_search", text: "paquete completo para instalación de tuberías" },
  { id: "F5", intent: "bulk_or_budget_search", text: "presupuesto materiales para 20 m2 de cerámica" },

  //------------------------------------
  // G. Price Queries
  //------------------------------------
  { id: "G1", intent: "price_query", text: "precio de cemento Holcim 50kg" },
  { id: "G2", intent: "price_query", text: "cuánto cuesta la tubería PVC 1 pulgada" },
  { id: "G3", intent: "price_query", text: "pintura para interiores precio por galón" },
  { id: "G4", intent: "price_query", text: "precio de cerámica 60x60 antideslizante" },
  { id: "G5", intent: "price_query", text: "cuánto valen las láminas de drywall 1/2" },

  //------------------------------------
  // H. Navigation
  //------------------------------------
  { id: "H1", intent: "navigation", text: "Ir al panel principal" },
  { id: "H2", intent: "navigation", text: "Muéstrame la página de productos" },
  { id: "H3", intent: "navigation", text: "Abrir sección de facturas" },

  //------------------------------------
  // I. Navigation with Parameters
  //------------------------------------
  { id: "I1", intent: "navigation_with_parameters", text: "Ver facturas del último mes" },
  { id: "I2", intent: "navigation_with_parameters", text: "Muéstrame productos filtrados por categoría eléctricos" },
  { id: "I3", intent: "navigation_with_parameters", text: "Listar cotizaciones entre enero y marzo" }

];

