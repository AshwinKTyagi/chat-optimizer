export interface SampleIntentDocument {
  id: string;
  intent:
    | "product_search"
    | "price_query"
    | "bulk_or_budget_search"
    | "comparison_search"
    | "planning_search"
    | "navigation"
    | "navigation_with_parameters";
  text: string;
}

export const sampleIntentDocuments: SampleIntentDocument[] = [
  // =========================================================
  // PRODUCT SEARCH (30)
  // =========================================================
  { id: "PS01", intent: "product_search", text: "bolsa de cemento Holcim 50kg" },
  { id: "PS02", intent: "product_search", text: "tubería PVC de 1 pulgada para agua potable" },
  { id: "PS03", intent: "product_search", text: "pintura blanca lavable para interiores marca Sherwin" },
  { id: "PS04", intent: "product_search", text: "plancha de yeso de 1/2 pulgada tipo drywall" },
  { id: "PS05", intent: "product_search", text: "interruptor eléctrico blanco marca Schneider" },
  { id: "PS06", intent: "product_search", text: "porcelanato 60x60 beige para piso" },
  { id: "PS07", intent: "product_search", text: "malla electrosoldada 6mm en rollo" },
  { id: "PS08", intent: "product_search", text: "taladro inalámbrico Dewalt 20V" },

  { id: "PS09", intent: "product_search", text: "cerámica 60x60 antideslizante para exterior" },
  { id: "PS10", intent: "product_search", text: "pernos galvanizados 3/8 x 4 pulgadas" },
  { id: "PS11", intent: "product_search", text: "ventanas de aluminio serie 25" },
  { id: "PS12", intent: "product_search", text: "cables eléctricos calibre 12 AWG para instalación doméstica" },
  { id: "PS13", intent: "product_search", text: "teja metálica calibre 28 color rojo" },
  { id: "PS14", intent: "product_search", text: "pintura para interiores acabado mate y lavable" },
  { id: "PS15", intent: "product_search", text: "tubería para agua caliente que soporte alta presión y temperatura" },

  // add realistic variants / shorthand
  { id: "PS16", intent: "product_search", text: "cemento holcim 50 kg" },
  { id: "PS17", intent: "product_search", text: "tubo pvc 1\" potable" },
  { id: "PS18", intent: "product_search", text: "drywall 1/2" },
  { id: "PS19", intent: "product_search", text: "malla electrosoldada 6 mm" },
  { id: "PS20", intent: "product_search", text: "porcelanato 60x60 para piso interior" },
  { id: "PS21", intent: "product_search", text: "interruptor Schneider blanco" },
  { id: "PS22", intent: "product_search", text: "cable #12 awg" },
  { id: "PS23", intent: "product_search", text: "impermeabilizante acrílico para techos" },
  { id: "PS24", intent: "product_search", text: "tubo hdpe 32mm por metro" },

  // “any brand” phrasing
  { id: "PS25", intent: "product_search", text: "cerámica 60x60 exterior antideslizante cualquier marca" },
  { id: "PS26", intent: "product_search", text: "ventana aluminio serie 25 sin importar marca" },
  { id: "PS27", intent: "product_search", text: "tornillos para drywall punta fina 1 1/4" },
  { id: "PS28", intent: "product_search", text: "bloque de 15 para construcción" },
  { id: "PS29", intent: "product_search", text: "varilla corrugada 3/8 de acero" },
  { id: "PS30", intent: "product_search", text: "pegamento para cerámica tipo mortero" },

  // product_search hard-negatives (should NOT be product_search)
  { id: "HN_PS_01", intent: "price_query", text: "precio de tubería PVC 1 pulgada para agua potable" },
  { id: "HN_PS_02", intent: "price_query", text: "a cómo está el cemento Holcim 50kg" },
  { id: "HN_PS_03", intent: "bulk_or_budget_search", text: "cemento Holcim barato en cantidad" },
  { id: "HN_PS_04", intent: "bulk_or_budget_search", text: "taladro 20V económico, el más barato" },
  { id: "HN_PS_05", intent: "bulk_or_budget_search", text: "porcelanato 60x60 por menos de 20 dólares" },
  { id: "HN_PS_06", intent: "comparison_search", text: "PVC vs CPVC cuál conviene para agua caliente" },
  { id: "HN_PS_07", intent: "planning_search", text: "qué necesito para levantar una pared de drywall" },
  { id: "HN_PS_08", intent: "planning_search", text: "cómo impermeabilizar un techo con filtraciones" },
  { id: "HN_PS_09", intent: "navigation", text: "abrir la página de productos" },
  { id: "HN_PS_10", intent: "navigation_with_parameters", text: "ir a productos y filtrar por categoría eléctricos" },

  // =========================================================
  // BULK / BUDGET SEARCH (25)
  // =========================================================
  { id: "BB01", intent: "bulk_or_budget_search", text: "cemento Holcim al por mayor en Quito" },
  { id: "BB02", intent: "bulk_or_budget_search", text: "materiales económicos para hacer un cerramiento" },
  { id: "BB03", intent: "bulk_or_budget_search", text: "pintura barata para obra gris" },
  { id: "BB04", intent: "bulk_or_budget_search", text: "paquete completo y económico para instalación de tuberías" },
  { id: "BB05", intent: "bulk_or_budget_search", text: "comprar tubería PVC por volumen a mejor precio" },
  { id: "BB06", intent: "bulk_or_budget_search", text: "ofertas de materiales de construcción al por mayor" },
  { id: "BB07", intent: "bulk_or_budget_search", text: "necesito cemento holcim en cantidad" },
  { id: "BB08", intent: "bulk_or_budget_search", text: "proveedor de tubería pvc por volumen" },
  { id: "BB09", intent: "bulk_or_budget_search", text: "mayorista de cerámica para obra" },
  { id: "BB10", intent: "bulk_or_budget_search", text: "piso cerámico barato para obra" },
  { id: "BB11", intent: "bulk_or_budget_search", text: "material barato para remodelar casa" },
  { id: "BB12", intent: "bulk_or_budget_search", text: "drywall por volumen para obra" },
  { id: "BB13", intent: "bulk_or_budget_search", text: "comprar malla electrosoldada en cantidad" },

  // explicit “under X”
  { id: "BB14", intent: "bulk_or_budget_search", text: "mostrar productos con precio menor a 20 dólares" },
  { id: "BB15", intent: "bulk_or_budget_search", text: "busco taladro económico, el más barato" },
  { id: "BB16", intent: "bulk_or_budget_search", text: "cemento barato por saco" },
  { id: "BB17", intent: "bulk_or_budget_search", text: "ofertas por cantidad en cemento" },
  { id: "BB18", intent: "bulk_or_budget_search", text: "descuento por volumen en tubería pvc" },
  { id: "BB19", intent: "bulk_or_budget_search", text: "materiales low cost para remodelación básica" },
  { id: "BB20", intent: "bulk_or_budget_search", text: "quiero cerámica barata 60x60" },
  { id: "BB21", intent: "bulk_or_budget_search", text: "busco proveedores mayoristas de pintura" },
  { id: "BB22", intent: "bulk_or_budget_search", text: "cotizar materiales económicos para obra" },
  { id: "BB23", intent: "bulk_or_budget_search", text: "precio al por mayor de cemento holcim" },
  { id: "BB24", intent: "bulk_or_budget_search", text: "comprar tornillos por caja barato" },
  { id: "BB25", intent: "bulk_or_budget_search", text: "presupuesto de materiales para 20 m2 de cerámica" },
  
    // bulk_or_budget_search hard-negatives (should NOT be bulk_or_budget_search)
  { id: "HN_BB_01", intent: "price_query", text: "cuánto cuesta el cemento Holcim 50kg" },
  { id: "HN_BB_02", intent: "price_query", text: "precio por galón de pintura interior lavable" },
  { id: "HN_BB_03", intent: "product_search", text: "cemento Holcim 50kg" },
  { id: "HN_BB_04", intent: "product_search", text: "taladro inalámbrico Dewalt 20V" },
  { id: "HN_BB_05", intent: "comparison_search", text: "cerámica vs porcelanato para piso" },
  { id: "HN_BB_06", intent: "comparison_search", text: "HDPE o PVC cuál dura más" },
  { id: "HN_BB_07", intent: "planning_search", text: "qué necesito para instalar un baño completo desde cero" },
  { id: "HN_BB_08", intent: "planning_search", text: "cómo reparar goteras en el techo" },
  { id: "HN_BB_09", intent: "navigation", text: "ir al menú principal" },
  { id: "HN_BB_10", intent: "navigation_with_parameters", text: "abrir pedidos y filtrar por estado entregado" },
  
  // =========================================================
  // PRICE QUERIES (20)
  // =========================================================
  { id: "PR01", intent: "price_query", text: "precio de una bolsa de cemento Holcim de 50 kg" },
  { id: "PR02", intent: "price_query", text: "cuánto cuesta la tubería PVC de 1 pulgada" },
  { id: "PR03", intent: "price_query", text: "pintura para interiores, precio por galón" },
  { id: "PR04", intent: "price_query", text: "precio de cerámica 60x60 antideslizante por metro cuadrado" },
  { id: "PR05", intent: "price_query", text: "cuánto valen las láminas de drywall de 1/2 pulgada" },
  { id: "PR06", intent: "price_query", text: "valor de la malla electrosoldada de 6 mm" },
  { id: "PR07", intent: "price_query", text: "cuánto cuesta un taladro inalámbrico Dewalt" },
  { id: "PR08", intent: "price_query", text: "precio del tubo HDPE de 32 mm por metro" },
  { id: "PR09", intent: "price_query", text: "en cuánto está la cerámica 60x60 por m2" },
  { id: "PR10", intent: "price_query", text: "a cómo está la cerámica 60x60 por m2" },
  
  // slang / short
  { id: "PR11", intent: "price_query", text: "a cómo está el saco de cemento ahorita" },
  { id: "PR12", intent: "price_query", text: "a cómo está la varilla corrugada de 3/8" },
  { id: "PR13", intent: "price_query", text: "cuánto cuesta el metro del tubo hdpe 32" },
  { id: "PR14", intent: "price_query", text: "precio plancha drywall medio" },
  { id: "PR15", intent: "price_query", text: "a cómo el galón de pintura interior" },
  { id: "PR16", intent: "price_query", text: "a cómo está el cemento holcim 50kg" },
  { id: "PR17", intent: "price_query", text: "cuánto está el porcelanato por metro cuadrado" },
  { id: "PR18", intent: "price_query", text: "a cómo está el bloque de 15" },
  { id: "PR19", intent: "price_query", text: "cuánto cuesta la malla electrosoldada 6mm" },
  { id: "PR20", intent: "price_query", text: "cuánto vale un interruptor Schneider" },
  
  // price_query hard-negatives (should NOT be price_query)
  { id: "HN_PR_01", intent: "product_search", text: "tubería PVC 1 pulgada para agua potable" },
  { id: "HN_PR_02", intent: "product_search", text: "cerámica 60x60 antideslizante para exterior" },
  { id: "HN_PR_03", intent: "bulk_or_budget_search", text: "busco cerámica 60x60 barata para obra" },
  { id: "HN_PR_04", intent: "bulk_or_budget_search", text: "descuento por volumen en cemento Holcim 50kg" },
  { id: "HN_PR_05", intent: "comparison_search", text: "cemento Portland vs fraguado rápido" },
  { id: "HN_PR_06", intent: "comparison_search", text: "pintura mate o satinada cuál conviene para sala" },
  { id: "HN_PR_07", intent: "planning_search", text: "qué sellador usar en baño para evitar moho" },
  { id: "HN_PR_08", intent: "planning_search", text: "materiales para hacer un contrapiso de hormigón" },
  { id: "HN_PR_09", intent: "navigation", text: "abrir la sección de facturas" },
  { id: "HN_PR_10", intent: "navigation_with_parameters", text: "ver facturas del último mes" },
  
  // =========================================================
  // COMPARISON (15)
  // =========================================================
  { id: "CP01", intent: "comparison_search", text: "diferencia entre pintura acrílica y pintura vinílica" },
  { id: "CP02", intent: "comparison_search", text: "cemento Portland vs cemento de fraguado rápido" },
  { id: "CP03", intent: "comparison_search", text: "PVC o CPVC, cuál es mejor para agua caliente" },
  { id: "CP04", intent: "comparison_search", text: "qué es mejor para tubería: HDPE o PVC" },
  { id: "CP05", intent: "comparison_search", text: "cerámica vs porcelanato para uso en exterior" },
  { id: "CP06", intent: "comparison_search", text: "cables 12 AWG vs cables 14 AWG para casa" },
  { id: "CP07", intent: "comparison_search", text: "pintura mate o satinada, cuál conviene más para sala" },
  { id: "CP08", intent: "comparison_search", text: "drywall vs bloque para interiores" },
  { id: "CP09", intent: "comparison_search", text: "mate vs satinada para sala" },
  { id: "CP10", intent: "comparison_search", text: "hdpe vs pvc, cuál dura más bajo tierra" },
  { id: "CP11", intent: "comparison_search", text: "mortero o pega para cerámica, cuál conviene" },
  { id: "CP12", intent: "comparison_search", text: "varilla 3/8 o 1/2, cuál conviene para losa" },
  { id: "CP13", intent: "comparison_search", text: "cuál es mejor marca de drywall en Ecuador" },
  { id: "CP14", intent: "comparison_search", text: "cerámica o porcelanato, cuál conviene para piso" },
  { id: "CP15", intent: "comparison_search", text: "pvc vs cpvc para agua caliente, cuál recomiendas" },
  
  // comparison_search hard-negatives (should NOT be comparison_search)
  { id: "HN_CP_01", intent: "planning_search", text: "qué usar para pegar cerámica exterior que reciba lluvia" },
  { id: "HN_CP_02", intent: "planning_search", text: "cómo insonorizar una pared delgada entre habitaciones" },
  { id: "HN_CP_03", intent: "price_query", text: "precio del HDPE 32mm por metro" },
  { id: "HN_CP_04", intent: "price_query", text: "a cómo está la varilla corrugada 3/8" },
  { id: "HN_CP_05", intent: "bulk_or_budget_search", text: "pintura barata para obra gris" },
  { id: "HN_CP_06", intent: "bulk_or_budget_search", text: "comprar tubería PVC por volumen a mejor precio" },
  { id: "HN_CP_07", intent: "product_search", text: "tubería CPVC para agua caliente alta presión" },
  { id: "HN_CP_08", intent: "product_search", text: "cable 12 AWG para instalación doméstica" },
  { id: "HN_CP_09", intent: "navigation", text: "abrir la sección de cotizaciones" },
  { id: "HN_CP_10", intent: "navigation_with_parameters", text: "listar cotizaciones entre enero y marzo" },

  // =========================================================
  // PLANNING (merged: project + problem) (25)
  // =========================================================
  { id: "PL01", intent: "planning_search", text: "materiales necesarios para construir una pérgola de madera" },
  { id: "PL02", intent: "planning_search", text: "qué necesito para instalar un baño completo desde cero" },
  { id: "PL03", intent: "planning_search", text: "herramientas básicas para remodelar una cocina pequeña" },
  { id: "PL04", intent: "planning_search", text: "equipos y materiales para construir una casa de 2 pisos" },
  { id: "PL05", intent: "planning_search", text: "materiales para hacer un contrapiso de hormigón" },
  { id: "PL06", intent: "planning_search", text: "lista de materiales para construir una bodega" },
  { id: "PL07", intent: "planning_search", text: "materiales para levantar una pared de drywall" },
  { id: "PL08", intent: "planning_search", text: "qué materiales se necesitan para hacer una terraza" },
  { id: "PL09", intent: "planning_search", text: "lista de cosas para levantar una pared de drywall" },
  
  // troubleshooting
  { id: "PL10", intent: "planning_search", text: "material para nivelar un piso que está muy desnivelado" },
  { id: "PL11", intent: "planning_search", text: "cómo impermeabilizar una terraza que tiene filtraciones" },
  { id: "PL12", intent: "planning_search", text: "solución para humedad en paredes interiores" },
  { id: "PL13", intent: "planning_search", text: "qué usar para pegar cerámica en exterior que reciba lluvia" },
  { id: "PL14", intent: "planning_search", text: "aislamiento acústico para paredes delgadas entre habitaciones" },
  { id: "PL15", intent: "planning_search", text: "cómo reparar un techo que tiene goteras" },
  { id: "PL16", intent: "planning_search", text: "qué producto sirve para detener la humedad por capilaridad" },
  { id: "PL17", intent: "planning_search", text: "tengo goteras en el techo, qué se usa para arreglar eso" },
  { id: "PL18", intent: "planning_search", text: "qué hago para cortar la humedad que sube por la pared" },
  { id: "PL19", intent: "planning_search", text: "se escucha todo a través de la pared, cómo la insonorizo" },
  { id: "PL20", intent: "planning_search", text: "qué sellador uso en el baño para que no salga moho" },
  
  // short variants
  { id: "PL21", intent: "planning_search", text: "materiales para hacer cerramiento simple" },
  { id: "PL22", intent: "planning_search", text: "qué necesito para colocar cerámica en patio exterior" },
  { id: "PL23", intent: "planning_search", text: "con qué nivelar un piso desnivelado" },
  { id: "PL24", intent: "planning_search", text: "cómo evitar humedad en paredes interiores" },
  { id: "PL25", intent: "planning_search", text: "qué usar para impermeabilizar techo" },
  
  // planning_search hard-negatives (should NOT be planning_search)
  { id: "HN_PL_01", intent: "product_search", text: "impermeabilizante acrílico para techos" },
  { id: "HN_PL_02", intent: "product_search", text: "sellador para baño resistente al moho" },
  { id: "HN_PL_03", intent: "price_query", text: "precio del impermeabilizante acrílico por galón" },
  { id: "HN_PL_04", intent: "price_query", text: "cuánto cuesta la pega para cerámica por saco" },
  { id: "HN_PL_05", intent: "bulk_or_budget_search", text: "impermeabilizante barato para techo" },
  { id: "HN_PL_06", intent: "bulk_or_budget_search", text: "pega para cerámica económica por volumen" },
  { id: "HN_PL_07", intent: "comparison_search", text: "impermeabilizante acrílico vs cementicio cuál es mejor" },
  { id: "HN_PL_08", intent: "comparison_search", text: "pintura acrílica o vinílica cuál conviene" },
  { id: "HN_PL_09", intent: "navigation", text: "abrir la página de productos" },
  { id: "HN_PL_10", intent: "navigation_with_parameters", text: "ver pedidos realizados hoy" },
  
  // =========================================================
  // NAVIGATION (15)
  // =========================================================
  { id: "NV01", intent: "navigation", text: "Ir al panel principal del sistema" },
  { id: "NV02", intent: "navigation", text: "Muéstrame la página de productos" },
  { id: "NV03", intent: "navigation", text: "Abrir la sección de facturas" },
  { id: "NV04", intent: "navigation", text: "Ver mis pedidos recientes" },
  { id: "NV05", intent: "navigation", text: "Ir a la página de clientes" },
  { id: "NV06", intent: "navigation", text: "Abrir configuración de la cuenta" },
  { id: "NV07", intent: "navigation", text: "Mostrar el historial de compras" },
  { id: "NV08", intent: "navigation", text: "Ir al menú principal" },
  { id: "NV09", intent: "navigation", text: "mostrar mis pedidos" },
  { id: "NV10", intent: "navigation", text: "ver el carrito" },
  { id: "NV11", intent: "navigation", text: "ir a clientes" },
  { id: "NV12", intent: "navigation", text: "abrir productos" },
  { id: "NV13", intent: "navigation", text: "abrir pedidos" },
  { id: "NV14", intent: "navigation", text: "volver al inicio" },
  { id: "NV15", intent: "navigation", text: "abrir cotizaciones" },

    // navigation hard-negatives (should NOT be navigation)
  { id: "HN_NV_01", intent: "navigation_with_parameters", text: "ver facturas del último mes" },
  { id: "HN_NV_02", intent: "navigation_with_parameters", text: "mostrar facturas pendientes de pago" },
  { id: "HN_NV_03", intent: "navigation_with_parameters", text: "listar cotizaciones del cliente Pérez" },
  { id: "HN_NV_04", intent: "product_search", text: "mostrar cerámica 60x60 antideslizante para exterior" },
  { id: "HN_NV_05", intent: "bulk_or_budget_search", text: "mostrar productos por menos de 20 dólares" },
  { id: "HN_NV_06", intent: "price_query", text: "muéstrame el precio del cemento Holcim 50kg" },
  { id: "HN_NV_07", intent: "planning_search", text: "muéstrame qué necesito para construir una bodega" },
  { id: "HN_NV_08", intent: "comparison_search", text: "muéstrame la diferencia entre hdpe y pvc" },
  { id: "HN_NV_09", intent: "product_search", text: "ver taladro inalámbrico Dewalt 20V" },
  { id: "HN_NV_10", intent: "navigation_with_parameters", text: "abrir pedidos y filtrar por estado entregado" },

  // =========================================================
  // NAV WITH PARAMETERS (20)
  // (Internal records filtering, not catalog search)
  // =========================================================
  { id: "NP01", intent: "navigation_with_parameters", text: "Ver facturas del último mes" },
  { id: "NP02", intent: "navigation_with_parameters", text: "Listar cotizaciones entre enero y marzo" },
  { id: "NP03", intent: "navigation_with_parameters", text: "Mostrar facturas solo las que están pendientes de pago" },
  { id: "NP04", intent: "navigation_with_parameters", text: "Ver pedidos realizados hoy" },
  { id: "NP05", intent: "navigation_with_parameters", text: "Ver facturas del año 2023 únicamente" },
  { id: "NP06", intent: "navigation_with_parameters", text: "Listar cotizaciones del cliente Pérez" },
  { id: "NP07", intent: "navigation_with_parameters", text: "listar pedidos de hoy" },
  { id: "NP08", intent: "navigation_with_parameters", text: "mostrar facturas pendientes de pago" },
  { id: "NP09", intent: "navigation_with_parameters", text: "ver cotizaciones entre enero y marzo" },
  { id: "NP10", intent: "navigation_with_parameters", text: "ver pedidos recientes del cliente Pérez" },

  // more filter variety
  { id: "NP11", intent: "navigation_with_parameters", text: "mostrar facturas de esta semana" },
  { id: "NP12", intent: "navigation_with_parameters", text: "ver pedidos de ayer" },
  { id: "NP13", intent: "navigation_with_parameters", text: "listar cotizaciones pendientes" },
  { id: "NP14", intent: "navigation_with_parameters", text: "ver facturas pagadas" },
  { id: "NP15", intent: "navigation_with_parameters", text: "mostrar pedidos con estado entregado" },
  { id: "NP16", intent: "navigation_with_parameters", text: "ver pedidos con estado pendiente" },
  { id: "NP17", intent: "navigation_with_parameters", text: "abrir clientes y buscar a Pérez" },
  { id: "NP18", intent: "navigation_with_parameters", text: "abrir pedidos y filtrar por fecha de hoy" },
  { id: "NP19", intent: "navigation_with_parameters", text: "abrir facturas y filtrar por monto mayor a 100" },
  { id: "NP20", intent: "navigation_with_parameters", text: "abrir cotizaciones y filtrar por mes actual" },

  // navigation_with_parameters hard-negatives (should NOT be navigation_with_parameters)
  { id: "HN_NP_01", intent: "bulk_or_budget_search", text: "taladros por menos de 50 dólares" },
  { id: "HN_NP_02", intent: "bulk_or_budget_search", text: "cemento holcim al por mayor" },
  { id: "HN_NP_03", intent: "price_query", text: "precio de cerámica 60x60 por m2" },
  { id: "HN_NP_04", intent: "product_search", text: "cerámica 60x60 antideslizante exterior" },
  { id: "HN_NP_05", intent: "product_search", text: "tubería pvc 1 pulgada potable" },
  { id: "HN_NP_06", intent: "comparison_search", text: "PVC vs CPVC cuál es mejor" },
  { id: "HN_NP_07", intent: "planning_search", text: "materiales para hacer una terraza" },
  { id: "HN_NP_08", intent: "planning_search", text: "cómo impermeabilizar una terraza con filtraciones" },
  { id: "HN_NP_09", intent: "navigation", text: "abrir la sección de facturas" },
  { id: "HN_NP_10", intent: "navigation", text: "ir a clientes" },
];