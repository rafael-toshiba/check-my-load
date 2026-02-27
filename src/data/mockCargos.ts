import { Cargo } from '@/types/cargo';

export const orderCustomerMap: Record<string, string> = {
  "5548546": "Rafael Toshiba",
  "99987885": "Felipe",
  "984654894": "Rafael Toshiba",
  "64845": "João da barra"
};

export const cargos: Cargo[] = [
  {
    id: "1251",
    licensePlate: "SAI4D45",
    products: [
      // ACO CEARENSE
      {
        code: "9",
        barcode: "9",
        description: "TRELICA TR 8SL C/6M ACO CEARENSE",
        brand: "ACO CEARENSE",
        totalQuantity: 60,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: false, // Estrutural metálico, sem código de barras comercial
        orders: [{ orderId: "5548546", quantity: 60 }]
      },
      {
        code: "10",
        barcode: "10",
        description: "VERGALHAO CA50 10.00MM 3/8 7,5KG ACO CEARENSE",
        brand: "ACO CEARENSE",
        totalQuantity: 4,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: false, // Estrutural metálico
        orders: [{ orderId: "5548546", quantity: 4 }]
      },
      // ATLANTI CORDAS
      {
        code: "85",
        barcode: "85",
        description: "POLIESTER TRANC COLOR 06MM CARR C/ 150MT ATLANTI CORDAS",
        brand: "ATLANTI CORDAS",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "5548546", quantity: 1 }]
      },
      {
        code: "92",
        barcode: "92",
        description: "POLIESTER TRANC VERDE 08MM CARR C/ 240MT ATLANTI CORDAS",
        brand: "ATLANTI CORDAS",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "5548546", quantity: 1 }]
      },
      // BAKOF
      {
        code: "3213",
        barcode: "3213",
        description: "CAIXA DE POLIETILENO 2000 LT C/TAMPA BAKOF",
        brand: "BAKOF",
        totalQuantity: 4,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: false, // Produto de grande porte
        orders: [{ orderId: "5548546", quantity: 4 }]
      },
      // CISER
      {
        code: "298",
        barcode: "298",
        description: "GANCHO 5,5X70 P/BUCHA 8 ZB C/100 CISER",
        brand: "CISER",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "5548546", quantity: 1 }]
      },
      {
        code: "299",
        barcode: "299",
        description: "KIT PARAFUSO TELHA 6,60X110 ZB CX C/100 CISER",
        brand: "CISER",
        totalQuantity: 2,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "5548546", quantity: 2 }]
      },
      {
        code: "304",
        barcode: "304",
        description: "PARAFUSO CHIPBOARD PH 4,0X30 CX C/500 CISER",
        brand: "CISER",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "5548546", quantity: 1 }]
      },
      {
        code: "368",
        barcode: "368",
        description: "PARAFUSO SEXT ROSCA SOBERBA 1/4X50 ZB C/200 CISER",
        brand: "CISER",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "5548546", quantity: 1 }]
      },
      {
        code: "1707",
        barcode: "1707",
        description: "PARAFUSO SEXT ROSCA SOBERBA 5/16X50MM ZB C/200 CISER",
        brand: "CISER",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "5548546", quantity: 1 }]
      },
      // DENVER
      {
        code: "11374",
        barcode: "11374",
        description: "SUPERFITA RL 10CM X 10MTS DENVER",
        brand: "DENVER",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "99987885", quantity: 1 }]
      },
      {
        code: "11375",
        barcode: "11375",
        description: "SUPERFITA RL 20CM X 10MTS DENVER",
        brand: "DENVER",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "99987885", quantity: 1 }]
      },
      {
        code: "11376",
        barcode: "11376",
        description: "SUPERFITA RL 30CM X 10MTS DENVER",
        brand: "DENVER",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "99987885", quantity: 1 }]
      },
      {
        code: "11377",
        barcode: "11377",
        description: "SUPERFITA RL 45CM X 10MTS DENVER",
        brand: "DENVER",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "984654894", quantity: 1 }]
      },
      {
        code: "11378",
        barcode: "11378",
        description: "SUPERFITA RL 90CM X 10MTS DENVER",
        brand: "DENVER",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "984654894", quantity: 1 }]
      },
      // EPLAST
      {
        code: "4693",
        barcode: "4693",
        description: "TELHA COLONIAL CERAMICA 2,30X0,86 EPLAST",
        brand: "EPLAST",
        totalQuantity: 14,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: false, // Telhas não costumam ter código na peça individual
        orders: [{ orderId: "984654894", quantity: 14 }]
      },
      // FOXLUX
      {
        code: "12136",
        barcode: "12136",
        description: "BOMBA DAGUA PERIFERICA 1/2CV 220V FOXLUX",
        brand: "FOXLUX",
        totalQuantity: 6,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "984654894", quantity: 6 }]
      },
      // GERDAU
      {
        code: "590",
        barcode: "590",
        description: "PREGO CC 19 X 39 - 3.1/2X9 GERDAU",
        brand: "GERDAU",
        totalQuantity: 9,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [
          { orderId: "984654894", quantity: 5 },
          { orderId: "99987885", quantity: 4 }
        ]
      },
      // GRANPLAST
      {
        code: "613",
        barcode: "613",
        description: "ASSENTO SANITARIO BRANCO GRANPLAST",
        brand: "GRANPLAST",
        totalQuantity: 6,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "64845", quantity: 6 }]
      },
      // IMBRALIT
      {
        code: "3769",
        barcode: "3769",
        description: "TELHA FIBROCIMENTO 5MM 1,83 X 1,10M IMBRALIT",
        brand: "IMBRALIT",
        totalQuantity: 7,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: false, // Telhas
        orders: [{ orderId: "64845", quantity: 7 }]
      },
      {
        code: "3770",
        barcode: "3770",
        description: "TELHA FIBROCIMENTO 5MM 2,13 X 1,10M IMBRALIT",
        brand: "IMBRALIT",
        totalQuantity: 140,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: false, // Telhas
        orders: [{ orderId: "64845", quantity: 140 }]
      },
      // MAGMA
      {
        code: "11703",
        barcode: "11703",
        description: "ELETRODOS FUSION-AM 2,50 CX 5KG MAGMA",
        brand: "MAGMA",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "64845", quantity: 1 }]
      },
      // MARI LOUCAS
      {
        code: "10147",
        barcode: "10147",
        description: "BACIA C/ CAIXA ACOPL GARDENIA SIMPLES BRANCA MARI LOUCAS",
        brand: "MARI LOUCAS",
        totalQuantity: 6,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "64845", quantity: 6 }]
      },
      // NETO MADEIRAS
      {
        code: "707",
        barcode: "707",
        description: "PORTA SEMI-OCA AMESCLA PINT 2,10 X 0,80 CM",
        brand: "NETO MADEIRAS",
        totalQuantity: 4,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: false, // Madeiras e portas
        orders: [{ orderId: "64845", quantity: 4 }]
      },
      {
        code: "1874",
        barcode: "1874",
        description: "TABUA DE PINUS 2,0 X 25 DE 3M",
        brand: "NETO MADEIRAS",
        totalQuantity: 20,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: false, // Madeiras
        orders: [{ orderId: "64845", quantity: 20 }]
      },
      {
        code: "1875",
        barcode: "1875",
        description: "TABUA DE PINUS 2,0 X 30 DE 3M",
        brand: "NETO MADEIRAS",
        totalQuantity: 58,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: false, // Madeiras
        orders: [{ orderId: "64845", quantity: 58 }]
      },
      {
        code: "7472",
        barcode: "7472",
        description: "PORTA SEMI-OCA AMESCLA PINT 2,10 X 0,70CM",
        brand: "NETO MADEIRAS",
        totalQuantity: 4,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: false, // Madeiras e portas
        orders: [{ orderId: "64845", quantity: 4 }]
      },
      {
        code: "7543",
        barcode: "7543",
        description: "ADUELA DE MASSARANDUBA 13CM",
        brand: "NETO MADEIRAS",
        totalQuantity: 10,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: false, // Madeiras
        orders: [{ orderId: "64845", quantity: 10 }]
      },
      {
        code: "7707",
        barcode: "7707",
        description: "PORTA REVES JATOBA SCHLINDWEIN 2,10 X 70 (FITADA)",
        brand: "NETO MADEIRAS",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: false, // Madeiras e portas
        orders: [{ orderId: "64845", quantity: 1 }]
      },
      {
        code: "7708",
        barcode: "7708",
        description: "PORTA REVES JATOBA SCHLINDWEIN 2,10 X 80 (FITADA)",
        brand: "NETO MADEIRAS",
        totalQuantity: 9,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: false, // Madeiras e portas
        orders: [{ orderId: "64845", quantity: 9 }]
      },
      // PULVITEC
      {
        code: "973",
        barcode: "973",
        description: "VEDANEL COM GUIA PULVITEC",
        brand: "PULVITEC",
        totalQuantity: 6,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "64845", quantity: 6 }]
      },
      // REDIMAX
      {
        code: "1001",
        barcode: "1001",
        description: "REJUNTE FLEX PLATINA 20X1KG REDIMAX",
        brand: "REDIMAX",
        totalQuantity: 60,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "64845", quantity: 60 }]
      },
      {
        code: "9948",
        barcode: "9948",
        description: "ARGAMASSA COLANTE CINZA AC I 15KG PLASTICA REDIMAX",
        brand: "REDIMAX",
        totalQuantity: 100,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true, // Sacos grandes costumam ter o EAN impresso
        orders: [{ orderId: "64845", quantity: 100 }]
      },
      // SIL
      {
        code: "1079",
        barcode: "1079",
        description: "CABO FLEXSIL 1,50 VERDE SIL",
        brand: "SIL",
        totalQuantity: 6,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "64845", quantity: 6 }]
      },
      {
        code: "1089",
        barcode: "1089",
        description: "CABO FLEXSIL 4,00 PRETO SIL",
        brand: "SIL",
        totalQuantity: 2,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "64845", quantity: 2 }]
      },
      {
        code: "11502",
        barcode: "11502",
        description: "CABO FLEXSIL 1,50 VERMELHO SIL",
        brand: "SIL",
        totalQuantity: 6,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "64845", quantity: 6 }]
      },
      // TRAMONTINA
      {
        code: "509",
        barcode: "509",
        description: "CHAVE FENDA 1/8X3 41500/010 TRAMONTINA",
        brand: "TRAMONTINA",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "64845", quantity: 1 }]
      },
      {
        code: "513",
        barcode: "513",
        description: "CHAVE FENDA 1/8X4 41500/011 TRAMONTINA",
        brand: "TRAMONTINA",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "64845", quantity: 1 }]
      },
      {
        code: "514",
        barcode: "514",
        description: "CHAVE FENDA 1/8X5 41500/012 TRAMONTINA",
        brand: "TRAMONTINA",
        totalQuantity: 1,
        checkedQuantity: null,
        isChecked: false,
        hasBarcode: true,
        orders: [{ orderId: "64845", quantity: 1 }]
      }
    ]
  }
];

export const mockCargos = cargos;