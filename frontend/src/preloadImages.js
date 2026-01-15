// РЎРєСЂРёРїС‚ РїСЂРµРґР·Р°РіСЂСѓР·РєРё РёР·РѕР±СЂР°Р¶РµРЅРёР№
export const preloadProductImages = (products) => {
  if (!products || !Array.isArray(products)) return;
  
  const imageUrls = new Set();
  
  // РЎРѕР±РёСЂР°РµРј РІСЃРµ URL РёР·РѕР±СЂР°Р¶РµРЅРёР№
  products.forEach(product => {
    if (product.image) {
      imageUrls.add(product.image);
      // РўР°РєР¶Рµ РґРѕР±Р°РІР»СЏРµРј Р°Р»СЊС‚РµСЂРЅР°С‚РёРІРЅС‹Рµ С„РѕСЂРјР°С‚С‹
      imageUrls.add(product.image.replace('.jpg', '.JPG'));
      imageUrls.add(product.image.replace('.JPG', '.jpg'));
      imageUrls.add(product.image.replace('.jpg', '.png'));
      imageUrls.add(product.image.replace('.png', '.jpg'));
      imageUrls.add(product.image.replace('.PNG', '.jpg'));
    }
  });
  
  // РџСЂРµРґР·Р°РіСЂСѓР¶Р°РµРј РёР·РѕР±СЂР°Р¶РµРЅРёСЏ
  Array.from(imageUrls).forEach(url => {
    const img = new Image();
    img.src = url;
  });
  
  console.log(`РџСЂРµРґР·Р°РіСЂСѓР¶РµРЅРѕ ${imageUrls.size} РёР·РѕР±СЂР°Р¶РµРЅРёР№`);
};
