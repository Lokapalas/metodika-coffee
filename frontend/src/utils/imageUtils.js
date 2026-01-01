// Утилиты для работы с изображениями

// Базовый URL для изображений
const IMAGES_BASE_PATH = '/images/products';

// Маппинг названий продуктов к именам файлов
const imageMapping = {
    // Классика кофе
    'Американо': 'americano.jpg',
    'Эспрессо': 'espresso.jpg',
    'Капучино': 'cappuccino.jpg',
    'Латте': 'latte.jpg',
    'Флэт Уайт': 'flatwhite.jpg',
    'Раф': 'raf.jpg',
    
    // Спешел кофе
    'Фильтр': 'filter.jpg',
    'Аэрофильтр': 'aerofilter.jpg',
    'Аэрокано': 'aerocano.jpg',
    'Френч-пресс': 'frenchpress.jpg',
    'Воронка': 'vortonka.jpg',
    'Каскара': 'cascara.jpg',
    
    // Не слипнется
    'Огненный цитрус': 'ognenniy-citrus.jpg',
    'Мокко': 'mocha.jpg',
    'Раф арахисовый': 'raf-peanut.jpg',
    'Раф медовый': 'raf-honey.jpg',
    
    // Оригинальный кофе
    'Латте Синнабон': 'latte-cinnabon.jpg',
    'Латте малина в шоколаде': 'latte-raspberry-chocolate.jpg',
    'Латте шоколадная халва': 'latte-halva-chocolate.jpg',
    'Сырный латте': 'cheese-latte.jpg',
    'Огненный тропик': 'ognenniy-tropik.jpg',
    'Раф Грушёвый чизкейк': 'raf-pear-cheesecake.jpg',
    
    // Холодные напитки
    'Айс-латте': 'ice-latte.jpg',
    'Бамбл': 'bumble.jpg',
    'Эспрессо-тоник': 'espresso-tonic.jpg',
    'Айс-латте Синнабон': 'ice-latte-cinnabon.jpg',
    
    // Не кофе
    'Горячий шоколад': 'hot-chocolate.jpg',
    'Горячий шоколад спешел': 'hot-chocolate-special.jpg',
    'Малиновый какао': 'raspberry-cocoa.jpg',
    'Какао': 'cocoa.jpg',
    'Какао спешел': 'cocoa-special.jpg',
    'Бейбичино': 'babychino.jpg',
    'Молочный коктейль': 'milkshake.jpg',
    'Молочный коктейль ягодный': 'berry-milkshake.jpg',
    'Матча-латте': 'matcha-latte.jpg',
    'Матча бамбл': 'matcha-bumble.jpg',
    'Айс матча-латте': 'ice-matcha-latte.jpg',
    'Матча-тоник': 'matcha-tonic.jpg',
    'Ягодный смузи': 'berry-smoothie.jpg',
    'Протеиновый коктейль': 'protein-shake.jpg',
    
    // Завтраки
    'Комбо-завтрак': 'combo-breakfast.jpg',
    'Сырники с топингом': 'cheesecakes.jpg',
    'Гранола на молоке': 'granola.jpg',
    'Раф каша': 'raf-porridge.jpg',
    'Раф каша ягодная': 'raf-berry-porridge.jpg',
    'Каша рисовая с манго и халвой': 'rice-porridge-mango.jpg',
    'Каша рисовая с грушей и халвой': 'rice-porridge-pear.jpg',
    'Каша конструктор': 'porridge-constructor.jpg',
    
    // Пицца
    '4 сыра': 'pizza-4cheese.jpg',
    'Ветчина и грибы': 'pizza-ham-mushrooms.jpg',
    'Груша-Горгонзолла': 'pizza-pear-gorgonzola.jpg',
    'Маргарита': 'pizza-margherita.jpg',
    'Мясная': 'pizza-meat.jpg',
    'Пепперони': 'pizza-pepperoni.jpg',
    
    // Первые блюда
    'Куриный суп-лапша': 'chicken-noodle-soup.jpg',
    
    // Вторые блюда
    'Куриные котлеты с пюре и сырным соусом': 'chicken-cutlets.jpg',
    'Паста с цыплёнком в сливочно-шпинатном соусе': 'pasta-chicken-spinach.jpg',
    'Лапша удон с курицей и овощами': 'udon-chicken-vegetables.jpg'
};

// Функция для получения пути к изображению
export const getProductImage = (productName, productImage = null) => {
    // Если в продукте указано изображение, используем его
    if (productImage) {
        return `${IMAGES_BASE_PATH}/${productImage}`;
    }
    
    // Иначе ищем по маппингу
    const fileName = imageMapping[productName];
    if (fileName) {
        return `${IMAGES_BASE_PATH}/${fileName}`;
    }
    
    // Если изображение не найдено, возвращаем заглушку
    return `${IMAGES_BASE_PATH}/default.jpg`;
};

// Функция для загрузки изображения с fallback
export const loadImageWithFallback = (src, fallbackSrc = '/images/products/default.jpg') => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = () => {
            console.warn(`Изображение не найдено: ${src}, используем fallback`);
            resolve(fallbackSrc);
        };
    });
};

// Иконки для категорий
export const categoryIcons = {
    'coffee-classic': '☕',
    'coffee-special': '✨',
    'coffee-non-sleep': '🔥',
    'coffee-original': '🎨',
    'cold-drinks': '🧊',
    'non-coffee': '🍫',
    'breakfast': '🥞',
    'pizza': '🍕',
    'first-courses': '🍲',
    'second-courses': '🍛',
    'additives': '➕'
};

// Функция для получения иконки категории
export const getCategoryIcon = (categoryId) => {
    return categoryIcons[categoryId] || '📦';
};
