// Edite aqui: produtos, categorias, tags, preços, etc.
window.CARDAPIO_DATA = {
  config: {
    storeName: "Sushi Mania",
    logoText: "PA",
    // Opcional: URL da imagem da logo (ex: "./img/logo.png" ou "https://...")
    logoImage: "japalogo.jpg",
    line: "Pedido mínimo R$ 20,00 • 30-50 min • Grátis",
    headline: "Faça seu pedido!",
    subtitle: "",
    instagramUrl: "https://instagram.com/",
    location: "São Paulo",
    distance: "2,3km",
    rating: "4,8",
    reviewsCount: "148",
    open: { isOpen: true, message: "Aberto" },

    promo: {
      title: "Compre 1 leve 2 • Super Combo",
      desc: "Aproveite a promoção por tempo limitado.",
      countdownSeconds: 45 * 60
    },

    info: {
      deliveryTypes: "Motoboy • Retirada",
      payments: "Pix",
      address: "São Paulo - SP",
      areas: "Centro • Zona Sul, Norte, Leste, Oeste."
    },

    categories: ["Promo", "Temaki", "Barcas", "Hot", "Bebidas"],
    drinks: [
      "Coca Cola - Lata",
      "Coca Cola Zero - Lata",
      "Guaraná - Lata",
      "Sprite - Lata",
      "Suco Uva - Lata",
      "Suco Laranja - Lata",
      "Água sem Gás",
      "Água com Gás"
    ],
    barcaItems: [
      "20 Hot Philadelphia",
      "20 Sashimi Salmão",
      "20 Niguiri Skin",
      "20 Uramaki de Shimeji",
      "20 Uramaki de Salmão Cream Cheese",
      "20 Niguiris de Salmão",
      "20 Hossomaki Salmão Grelhado",
      "20 Hossomaki Salmão"
    ],

    reviews: [
      { name: "Cinthia", stars: 5, text: "Chegou perfeito, bem embalado e tudo fresquinho.", image: "recebidobarca.jpeg" },
      { name: "Lucas", stars: 5, text: "Melhor custo-benefício. Entrega rápida.", image: "recebidohot1.jpg" },
      { name: "Luiza", stars: 5, text: "Viciei kkk, tudo muito bem feito.", image: "recebidotemaki1.jpg" },
      { name: "Ronald", stars: 5, text: "Bem servido e qualidade absurda.", image: "7.jpg" }
    ]
  },

  promoProducts: [
    { id:"p1", cat:"Promo", title:"2 Temaki Salmão + Bebida", desc:"Combo promocional.", oldPrice:45.80, price:19.90, tag:"Pague 1 Leve 2", image:"temaki2.png" },
    { id:"p2", cat:"Promo", title:"2 Temaki Hot + Bebida", desc:"Bem servido e rápido.", oldPrice:45.80, price:19.90, tag:"Promo", image:"temakihot.png" },
    { id:"p3", cat:"Promo", title:"Super Barca 100 peças + Bebida", desc:"Custo-benefício (limitado).", oldPrice:149.80, price:59.90, tag:"MAIS VENDIDO", image:"barcasushi1.png" },
    { id:"p4", cat:"Promo", title:"4 Temaki Salmão + Bebida", desc:"Pra dividir com geral.", oldPrice:85.80, price:32.90, tag:"Combo", image:"temaki4.png" }
  ],

  menuProducts: [
    { id:"m3", cat:"Barcas", title:"Barca 60 peças", desc:"Mix sushi + hot.", price:49.90, tag:"Top", image:"combinado4.png" },
    { id:"m4", cat:"Hot", title:"Combo Hot 30 peças", desc:"Bem recheado.", price:34.90, tag:"Hot", image:"combinado3.png" }
  ]
};
