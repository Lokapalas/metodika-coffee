// Полная база данных меню Методика Кофе

export const categories = [
    { id: 'coffee-classic', name: 'Классика кофе', icon: '☕' },
    { id: 'coffee-special', name: 'Спешел кофе', icon: '✨' },
    { id: 'coffee-non-sleep', name: 'Не слипнется', icon: '🔥' },
    { id: 'coffee-original', name: 'Оригинальный кофе', icon: '🎨' },
    { id: 'cold-drinks', name: 'Холодные напитки', icon: '🧊' },
    { id: 'non-coffee', name: 'Не кофе', icon: '🍫' },
    { id: 'breakfast', name: 'Завтраки', icon: '🥞' },
    { id: 'pizza', name: 'Пицца', icon: '🍕' },
    { id: 'first-courses', name: 'Первые блюда', icon: '🍲' },
    { id: 'second-courses', name: 'Вторые блюда', icon: '🍛' },
    { id: 'additives', name: 'Добавки', icon: '➕' }
];

export const sizes = {
    'S': { name: 'S (Маленький)', priceSuffix: 'S' },
    'M': { name: 'M (Средний)', priceSuffix: 'M' },
    'L': { name: 'L (Большой)', priceSuffix: 'L' }
};

// Вспомогательная функция для получения ID сиропов
const getSyrupIds = () => [
    'syrup-caramel', 'syrup-salted-caramel', 'syrup-vanilla', 'syrup-chocolate',
    'syrup-coconut', 'syrup-mint', 'syrup-cherry', 'syrup-raspberry',
    'syrup-strawberry', 'syrup-blackberry', 'syrup-hazelnut', 'syrup-macadamia',
    'syrup-almond', 'syrup-pistachio', 'syrup-salted-toffee'
];

export const additives = [
    // Для кофейных напитков
    { id: 'decaf', name: 'Декаф', price: 70, category: 'coffee' },
    { id: 'extra-shot', name: 'Доп. шот эспрессо', price: 85, category: 'coffee' },
    
    // Растительные молоки
    { id: 'milk-lactose-free', name: 'Безлактозное молоко', prices: { S: 50, M: 60, L: 70 }, category: 'milk' },
    { id: 'milk-almond', name: 'Миндальное молоко', prices: { S: 50, M: 60, L: 70 }, category: 'milk' },
    { id: 'milk-banana', name: 'Банановое молоко', prices: { S: 50, M: 60, L: 70 }, category: 'milk' },
    { id: 'milk-coconut', name: 'Кокосовое молоко', prices: { S: 50, M: 60, L: 70 }, category: 'milk' },
    { id: 'milk-pistachio', name: 'Фисташковое молоко', prices: { S: 50, M: 60, L: 70 }, category: 'milk' },
    { id: 'milk-hazelnut', name: 'Фундучное молоко', prices: { S: 50, M: 60, L: 70 }, category: 'milk' },
    
    // Дополнительные добавки
    { id: 'honey', name: 'Мёд', price: 35, category: 'sweeteners' },
    { id: 'condensed-milk', name: 'Сгущёнка', price: 40, category: 'sweeteners' },
    { id: 'peanut-butter', name: 'Арахисовая паста', price: 50, category: 'sweeteners' },
    { id: 'halva', name: 'Халва', price: 30, category: 'sweeteners' },
    
    // Сиропы
    { id: 'syrup-caramel', name: 'Карамель', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    { id: 'syrup-salted-caramel', name: 'Солёная карамель', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    { id: 'syrup-vanilla', name: 'Ваниль', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    { id: 'syrup-chocolate', name: 'Шоколад', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    { id: 'syrup-coconut', name: 'Кокос', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    { id: 'syrup-mint', name: 'Мята', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    { id: 'syrup-cherry', name: 'Вишня', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    { id: 'syrup-raspberry', name: 'Малина', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    { id: 'syrup-strawberry', name: 'Клубника', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    { id: 'syrup-blackberry', name: 'Ежевика', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    { id: 'syrup-hazelnut', name: 'Лесной орех', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    { id: 'syrup-macadamia', name: 'Макадамия', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    { id: 'syrup-almond', name: 'Миндаль', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    { id: 'syrup-pistachio', name: 'Фисташка', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    { id: 'syrup-salted-toffee', name: 'Солёная ириска', prices: { S: 30, M: 35, L: 40 }, category: 'syrups' },
    
    // Для завтраков
    { id: 'granola-berries', name: 'Гранола ягодная', price: 0, category: 'breakfast' },
    { id: 'raf-porridge', name: 'Раф-каша', price: 0, category: 'breakfast' },
    { id: 'cheesecakes', name: 'Сырники', price: 0, category: 'breakfast' },
    
    // Топпинги для сырников
    { id: 'topping-condensed', name: 'Сгущёнка', price: 40, category: 'toppings' },
    { id: 'topping-mango', name: 'Пюре манго', price: 60, category: 'toppings' },
    { id: 'topping-pear', name: 'Груша', price: 60, category: 'toppings' },
    
    // Для конструктора каш
    { id: 'porridge-5cereals', name: '5 злаков', price: 150, category: 'porridge' },
    { id: 'porridge-rice', name: 'Рисовая', price: 150, category: 'porridge' },
    { id: 'porridge-millet', name: 'Пшённая', price: 150, category: 'porridge' },
    
    // Семена и ягоды для каш
    { id: 'seeds', name: 'Семена', price: 40, category: 'porridge' },
    { id: 'dried-cranberries', name: 'Клюква сушёная', price: 50, category: 'porridge' },
    { id: 'berries', name: 'Ягоды', price: 80, category: 'porridge' }
];

// Основная база продуктов
const menuProducts = [
    // ========== КЛАССИКА КОФЕ ==========
    {
        id: 1,
        name: 'Американо',
        category: 'coffee-classic',
        description: 'Классический черный кофе',
        image: 'americano.jpg',
        sizes: {
            'S': { price: 220, available: true },
            'M': { price: 280, available: true },
            'L': { price: null, available: false }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', 'honey', 'condensed-milk']
    },
    {
        id: 2,
        name: 'Эспрессо',
        category: 'coffee-classic',
        description: 'Крепкий концентрированный кофе',
        image: 'espresso.jpg',
        sizes: {
            'S': { price: 180, available: true },
            'M': { price: null, available: false },
            'L': { price: null, available: false }
        },
        availableAdditives: ['decaf', 'extra-shot']
    },
    {
        id: 3,
        name: 'Капучино',
        category: 'coffee-classic',
        description: 'Кофе с молочной пенкой',
        image: 'cappuccino.jpg',
        sizes: {
            'S': { price: 240, available: true },
            'M': { price: 290, available: true },
            'L': { price: 350, available: true }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', 'honey', 'condensed-milk', 'peanut-butter', 'halva', ...getSyrupIds()]
    },
    {
        id: 4,
        name: 'Латте',
        category: 'coffee-classic',
        description: 'Нежный кофе с молоком',
        image: 'latte.jpg',
        sizes: {
            'S': { price: 240, available: true },
            'M': { price: 290, available: true },
            'L': { price: 340, available: true }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', 'honey', 'condensed-milk', 'peanut-butter', 'halva', ...getSyrupIds()]
    },
    {
        id: 5,
        name: 'Флэт Уайт',
        category: 'coffee-classic',
        description: 'Кофе с идеальной пенкой',
        image: 'flatwhite.jpg',
        sizes: {
            'S': { price: 260, available: true },
            'M': { price: 320, available: true },
            'L': { price: 360, available: true }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', 'honey', 'condensed-milk', 'peanut-butter', 'halva', ...getSyrupIds()]
    },
    {
        id: 6,
        name: 'Раф',
        category: 'coffee-classic',
        description: 'Сливочный кофе с ванилью',
        image: 'raf.jpg',
        sizes: {
            'S': { price: 300, available: true },
            'M': { price: 360, available: true },
            'L': { price: 390, available: true }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', 'honey', 'condensed-milk', 'peanut-butter', 'halva', ...getSyrupIds()]
    },
    
    // ========== СПЕШЕЛ КОФЕ ==========
    {
        id: 7,
        name: 'Фильтр',
        category: 'coffee-special',
        description: 'Альтернативный способ заваривания',
        image: 'filter.jpg',
        sizes: {
            'S': { price: 210, available: true },
            'M': { price: 260, available: true },
            'L': { price: 290, available: true }
        },
        availableAdditives: ['decaf', 'honey', 'condensed-milk']
    },
    {
        id: 8,
        name: 'Аэрофильтр',
        category: 'coffee-special',
        description: 'Кофе, приготовленный в аэропрессе',
        image: 'aerofilter.jpg',
        sizes: {
            'S': { price: 210, available: true },
            'M': { price: 260, available: true },
            'L': { price: null, available: false }
        },
        availableAdditives: ['decaf', 'honey', 'condensed-milk']
    },
    {
        id: 9,
        name: 'Аэрокано',
        category: 'coffee-special',
        description: 'Холодное заваривание в аэропрессе',
        image: 'aerocano.jpg',
        sizes: {
            'S': { price: 210, available: true },
            'M': { price: null, available: false },
            'L': { price: null, available: false }
        },
        availableAdditives: ['decaf']
    },
    {
        id: 10,
        name: 'Френч-пресс',
        category: 'coffee-special',
        description: 'Кофе из френч-пресса',
        image: 'frenchpress.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 280, available: true },
            'L': { price: null, available: false }
        },
        availableAdditives: ['decaf', 'honey', 'condensed-milk']
    },
    {
        id: 11,
        name: 'Воронка',
        category: 'coffee-special',
        description: 'Кофе через воронку',
        image: 'vortonka.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 280, available: true },
            'L': { price: null, available: false }
        },
        availableAdditives: ['decaf', 'honey', 'condensed-milk']
    },
    {
        id: 12,
        name: 'Каскара',
        category: 'coffee-special',
        description: 'Чай из кофейных ягод',
        image: 'cascara.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: null, available: false },
            'L': { price: 350, available: true }
        },
        availableAdditives: ['honey']
    },
    
    // ========== НЕ СЛИПНЕТСЯ ==========
    {
        id: 13,
        name: 'Огненный цитрус',
        category: 'coffee-non-sleep',
        description: 'Кофе с цитрусовыми нотами',
        image: 'ognenniy-citrus.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 350, available: true },
            'L': { price: 380, available: true }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 14,
        name: 'Мокко',
        category: 'coffee-non-sleep',
        description: 'Кофе с шоколадом',
        image: 'mocha.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 320, available: true },
            'L': { price: 370, available: true }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', 'honey', 'condensed-milk']
    },
    {
        id: 15,
        name: 'Раф арахисовый',
        category: 'coffee-non-sleep',
        description: 'Раф с арахисовой пастой',
        image: 'raf-peanut.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 390, available: true },
            'L': { price: 440, available: true }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 16,
        name: 'Раф медовый',
        category: 'coffee-non-sleep',
        description: 'Раф с мёдом',
        image: 'raf-honey.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 370, available: true },
            'L': { price: 410, available: true }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    
    // ========== ОРИГИНАЛЬНЫЙ КОФЕ ==========
    {
        id: 17,
        name: 'Латте Синнабон',
        category: 'coffee-original',
        description: 'Латте с корицей и карамелью',
        image: 'latte-cinnabon.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 380, available: true },
            'L': { price: null, available: false }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 18,
        name: 'Латте малина в шоколаде',
        category: 'coffee-original',
        description: 'Латте с малиной и шоколадом',
        image: 'latte-raspberry-chocolate.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 350, available: true },
            'L': { price: 410, available: true }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 19,
        name: 'Латте шоколадная халва',
        category: 'coffee-original',
        description: 'Латте с халвой и шоколадом',
        image: 'latte-halva-chocolate.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 390, available: true },
            'L': { price: null, available: false }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 20,
        name: 'Сырный латте',
        category: 'coffee-original',
        description: 'Латте с сырным вкусом',
        image: 'cheese-latte.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 400, available: true },
            'L': { price: 430, available: true }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 21,
        name: 'Огненный тропик',
        category: 'coffee-original',
        description: 'Кофе с тропическими нотами',
        image: 'ognenniy-tropik.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 400, available: true },
            'L': { price: 430, available: true }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 22,
        name: 'Раф Грушёвый чизкейк',
        category: 'coffee-original',
        description: 'Раф со вкусом грушёвого чизкейка',
        image: 'raf-pear-cheesecake.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 450, available: true },
            'L': { price: null, available: false }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    
    // ========== ХОЛОДНЫЕ НАПИТКИ ==========
    {
        id: 23,
        name: 'Айс-латте',
        category: 'cold-drinks',
        description: 'Холодный латте',
        image: 'ice-latte.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 300, available: true },
            'L': { price: 350, available: true }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', ...getSyrupIds()]
    },
    {
        id: 24,
        name: 'Бамбл',
        category: 'cold-drinks',
        description: 'Холодный напиток с лимоном и мёдом',
        image: 'bumble.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 360, available: true },
            'L': { price: 390, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 25,
        name: 'Эспрессо-тоник',
        category: 'cold-drinks',
        description: 'Эспрессо с тоником',
        image: 'espresso-tonic.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 290, available: true },
            'L': { price: 340, available: true }
        },
        availableAdditives: ['decaf', 'extra-shot']
    },
    {
        id: 26,
        name: 'Айс-латте Синнабон',
        category: 'cold-drinks',
        description: 'Холодный латте с корицей',
        image: 'ice-latte-cinnabon.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 390, available: true },
            'L': { price: null, available: false }
        },
        availableAdditives: ['decaf', 'extra-shot', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    
    // ========== НЕ КОФЕ ==========
    {
        id: 27,
        name: 'Горячий шоколад',
        category: 'non-coffee',
        description: 'Классический горячий шоколад',
        image: 'hot-chocolate.jpg',
        sizes: {
            'S': { price: 220, available: true },
            'M': { price: null, available: false },
            'L': { price: 350, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', ...getSyrupIds()]
    },
    {
        id: 28,
        name: 'Горячий шоколад спешел',
        category: 'non-coffee',
        description: 'Особый горячий шоколад',
        image: 'hot-chocolate-special.jpg',
        sizes: {
            'S': { price: 250, available: true },
            'M': { price: null, available: false },
            'L': { price: 380, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', ...getSyrupIds()]
    },
    {
        id: 29,
        name: 'Малиновый какао',
        category: 'non-coffee',
        description: 'Какао с малиной',
        image: 'raspberry-cocoa.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 400, available: true },
            'L': { price: null, available: false }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 30,
        name: 'Какао',
        category: 'non-coffee',
        description: 'Классическое какао',
        image: 'cocoa.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 290, available: true },
            'L': { price: 330, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', ...getSyrupIds()]
    },
    {
        id: 31,
        name: 'Какао спешел',
        category: 'non-coffee',
        description: 'Особое какао',
        image: 'cocoa-special.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 320, available: true },
            'L': { price: 360, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', ...getSyrupIds()]
    },
    {
        id: 32,
        name: 'Бейбичино',
        category: 'non-coffee',
        description: 'Молочный напиток для детей',
        image: 'babychino.jpg',
        sizes: {
            'S': { price: 170, available: true },
            'M': { price: 220, available: true },
            'L': { price: null, available: false }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', ...getSyrupIds()]
    },
    {
        id: 33,
        name: 'Молочный коктейль',
        category: 'non-coffee',
        description: 'Классический молочный коктейль',
        image: 'milkshake.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: null, available: false },
            'L': { price: 370, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', ...getSyrupIds()]
    },
    {
        id: 34,
        name: 'Молочный коктейль ягодный',
        category: 'non-coffee',
        description: 'Молочный коктейль с ягодами',
        image: 'berry-milkshake.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: null, available: false },
            'L': { price: 400, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 35,
        name: 'Матча-латте',
        category: 'non-coffee',
        description: 'Латте с матчей',
        image: 'matcha-latte.jpg',
        sizes: {
            'S': { price: 250, available: true },
            'M': { price: 280, available: true },
            'L': { price: 340, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', 'honey', ...getSyrupIds()]
    },
    {
        id: 36,
        name: 'Матча бамбл',
        category: 'non-coffee',
        description: 'Матча с лимоном и мёдом',
        image: 'matcha-bumble.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 380, available: true },
            'L': { price: null, available: false }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', 'honey']
    },
    {
        id: 37,
        name: 'Айс матча-латте',
        category: 'non-coffee',
        description: 'Холодный матча-латте',
        image: 'ice-matcha-latte.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: null, available: false },
            'L': { price: 350, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', 'honey', ...getSyrupIds()]
    },
    {
        id: 38,
        name: 'Матча-тоник',
        category: 'non-coffee',
        description: 'Матча с тоником',
        image: 'matcha-tonic.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: null, available: false },
            'L': { price: 340, available: true }
        },
        availableAdditives: ['honey']
    },
    {
        id: 39,
        name: 'Ягодный смузи',
        category: 'non-coffee',
        description: 'Смузи из свежих ягод',
        image: 'berry-smoothie.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: 380, available: true },
            'L': { price: null, available: false }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', 'honey']
    },
    {
        id: 40,
        name: 'Протеиновый коктейль',
        category: 'non-coffee',
        description: 'Коктейль с протеином',
        image: 'protein-shake.jpg',
        sizes: {
            'S': { price: null, available: false },
            'M': { price: null, available: false },
            'L': { price: 410, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', 'honey', ...getSyrupIds()]
    },
    
    // ========== ЗАВТРАКИ ==========
    {
        id: 41,
        name: 'Комбо-завтрак',
        category: 'breakfast',
        description: 'На выбор 3 блюда: кофе 250мл + гранола/раф-каша + сырники',
        image: 'combo-breakfast.jpg',
        sizes: {
            'M': { price: 590, available: true }
        },
        availableAdditives: ['granola-berries', 'raf-porridge', 'cheesecakes']
    },
    {
        id: 42,
        name: 'Сырники с топингом',
        category: 'breakfast',
        description: 'Домашние сырники',
        image: 'cheesecakes.jpg',
        sizes: {
            'M': { price: 210, available: true }
        },
        availableAdditives: ['topping-condensed', 'topping-mango', 'topping-pear']
    },
    {
        id: 43,
        name: 'Гранола на молоке',
        category: 'breakfast',
        description: 'Хрустящая гранола с молоком',
        image: 'granola.jpg',
        sizes: {
            'M': { price: 250, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 44,
        name: 'Раф каша',
        category: 'breakfast',
        description: 'Каша с раф-кофе',
        image: 'raf-porridge.jpg',
        sizes: {
            'M': { price: 190, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 45,
        name: 'Раф каша ягодная',
        category: 'breakfast',
        description: 'Раф-каша с ягодами',
        image: 'raf-berry-porridge.jpg',
        sizes: {
            'M': { price: 240, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 46,
        name: 'Каша рисовая с манго и халвой',
        category: 'breakfast',
        description: 'Рисовая каша с манго и халвой',
        image: 'rice-porridge-mango.jpg',
        sizes: {
            'M': { price: 350, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 47,
        name: 'Каша рисовая с грушей и халвой',
        category: 'breakfast',
        description: 'Рисовая каша с грушей и халвой',
        image: 'rice-porridge-pear.jpg',
        sizes: {
            'M': { price: 350, available: true }
        },
        availableAdditives: ['milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut']
    },
    {
        id: 48,
        name: 'Каша конструктор',
        category: 'breakfast',
        description: 'Собери свою кашу: основа + молоко + добавки',
        image: 'porridge-constructor.jpg',
        sizes: {
            'M': { price: 150, available: true }
        },
        availableAdditives: ['porridge-5cereals', 'porridge-rice', 'porridge-millet', 'milk-lactose-free', 'milk-almond', 'milk-banana', 'milk-coconut', 'milk-pistachio', 'milk-hazelnut', 'halva', 'seeds', 'dried-cranberries', 'berries']
    },
    
    // ========== ПИЦЦА ==========
    {
        id: 49,
        name: '4 сыра',
        category: 'pizza',
        description: 'Смесь четырёх сыров',
        image: 'pizza-4cheese.jpg',
        sizes: {
            'M': { price: 700, available: true }
        }
    },
    {
        id: 50,
        name: 'Ветчина и грибы',
        category: 'pizza',
        description: 'Ветчина с шампиньонами',
        image: 'pizza-ham-mushrooms.jpg',
        sizes: {
            'M': { price: 700, available: true }
        }
    },
    {
        id: 51,
        name: 'Груша-Горгонзолла',
        category: 'pizza',
        description: 'С грушей и сыром горгонзолла',
        image: 'pizza-pear-gorgonzola.jpg',
        sizes: {
            'M': { price: 700, available: true }
        }
    },
    {
        id: 52,
        name: 'Маргарита',
        category: 'pizza',
        description: 'Классическая с томатами и моцареллой',
        image: 'pizza-margherita.jpg',
        sizes: {
            'M': { price: 700, available: true }
        }
    },
    {
        id: 53,
        name: 'Мясная',
        category: 'pizza',
        description: 'С ассорти мясных продуктов',
        image: 'pizza-meat.jpg',
        sizes: {
            'M': { price: 700, available: true }
        }
    },
    {
        id: 54,
        name: 'Пепперони',
        category: 'pizza',
        description: 'С острой колбасой пепперони',
        image: 'pizza-pepperoni.jpg',
        sizes: {
            'M': { price: 700, available: true }
        }
    },
    
    // ========== ПЕРВЫЕ БЛЮДА ==========
    {
        id: 55,
        name: 'Куриный суп-лапша',
        category: 'first-courses',
        description: 'Домашний куриный суп с лапшой',
        image: 'chicken-noodle-soup.jpg',
        sizes: {
            'M': { price: 280, available: true }
        }
    },
    
    // ========== ВТОРЫЕ БЛЮДА ==========
    {
        id: 56,
        name: 'Куриные котлеты с пюре и сырным соусом',
        category: 'second-courses',
        description: 'Котлеты из куриного филе с картофельным пюре',
        image: 'chicken-cutlets.jpg',
        sizes: {
            'M': { price: 450, available: true }
        }
    },
    {
        id: 57,
        name: 'Паста с цыплёнком в сливочно-шпинатном соусе',
        category: 'second-courses',
        description: 'Паста с курицей и шпинатом в сливочном соусе',
        image: 'pasta-chicken-spinach.jpg',
        sizes: {
            'M': { price: 400, available: true }
        }
    },
    {
        id: 58,
        name: 'Лапша удон с курицей и овощами',
        category: 'second-courses',
        description: 'Лапша удон с курицей и свежими овощами',
        image: 'udon-chicken-vegetables.jpg',
        sizes: {
            'M': { price: 500, available: true }
        }
    }
];

// Функция для получения продуктов по категории
export const getProductsByCategory = (categoryId) => {
    return menuProducts.filter(product => product.category === categoryId);
};

// Функция для получения всех продуктов
export const getAllProducts = () => {
    return menuProducts;
};

// Функция для получения продукта по ID
export const getProductById = (id) => {
    return menuProducts.find(product => product.id === id);
};

// Функция для получения доступных размеров продукта
export const getAvailableSizes = (product) => {
    return Object.entries(product.sizes || {})
        .filter(([size, data]) => data.available && data.price !== null)
        .map(([size, data]) => ({
            size,
            price: data.price,
            name: sizes[size]?.name || size
        }));
};

// Функция для получения базовой цены продукта (минимальной)
export const getBasePrice = (product) => {
    const availableSizes = getAvailableSizes(product);
    if (availableSizes.length === 0) return 0;
    return Math.min(...availableSizes.map(s => s.price));
};

// Функция для получения доступных добавок
export const getAvailableAdditives = (product) => {
    if (!product.availableAdditives) return [];
    return additives.filter(additive => 
        product.availableAdditives.includes(additive.id)
    );
};

export default menuProducts;
