import type { FaqItem, PortfolioItem, ProcessStep } from './types'

export const navItems = [
  { label: 'Работы', href: '#works' },
  { label: 'Обо мне', href: '#about' },
  { label: 'Процесс', href: '#process' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Запись', href: '#booking' },
]

export const portfolio: PortfolioItem[] = [
  { id: 'line-01', title: 'Линия / 01', caption: 'Оригинальный editorial-визуал для концепта', image: 'assets/images/generated-linework', alt: 'Чёрно-белый editorial-кадр с абстрактной линейной татуировкой на плече', orientation: 'landscape', generated: true },
  { id: 'body-02', title: 'Тело / 02', caption: 'Временный стоковый визуал', image: 'assets/images/stock-04', alt: 'Человек с татуированной рукой у окна', orientation: 'landscape' },
  { id: 'gesture-03', title: 'Жест / 03', caption: 'Оригинальный editorial-визуал для концепта', image: 'assets/images/generated-motion', alt: 'Татуированная рука в длинной выдержке с красным следом движения', orientation: 'landscape', generated: true },
  { id: 'portrait-04', title: 'Портрет / 04', caption: 'Временный стоковый визуал', image: 'assets/images/stock-01', alt: 'Чёрно-белый портрет татуированной модели', orientation: 'portrait' },
  { id: 'form-05', title: 'Форма / 05', caption: 'Временный стоковый визуал', image: 'assets/images/stock-02', alt: 'Татуированная модель в светлой фотостудии', orientation: 'portrait' },
  { id: 'ritual-06', title: 'Ритуал / 06', caption: 'Временный стоковый визуал', image: 'assets/images/stock-06', alt: 'Рабочая сцена в тату-студии', orientation: 'landscape' },
  { id: 'detail-07', title: 'Деталь / 07', caption: 'Временный стоковый визуал', image: 'assets/images/stock-05', alt: 'Татуированные руки в контрастном свете', orientation: 'portrait' },
  { id: 'space-08', title: 'Пространство / 08', caption: 'Временный стоковый визуал', image: 'assets/images/stock-07', alt: 'Сцена тату-конвенции в чёрно-белой обработке', orientation: 'landscape' },
]

export const processSteps: ProcessStep[] = [
  { number: '01', title: 'Идея', text: 'Ты рассказываешь, что хочется сохранить на коже. Можно без готового эскиза и точных формулировок.' },
  { number: '02', title: 'Эскиз', text: 'Я собираю направление и адаптирую референс под анатомию, масштаб и движение тела.' },
  { number: '03', title: 'Сеанс', text: 'Перед началом ещё раз сверяем место, размер и детали. Работаем в спокойном темпе.' },
  { number: '04', title: 'Заживление', text: 'После сеанса объясняю базовый уход и остаюсь на связи, если появятся вопросы.' },
]

export const faqItems: FaqItem[] = [
  { id: 'price', question: 'Как формируется стоимость?', answer: 'Индивидуально: учитываю размер, детализацию, место нанесения и предполагаемое время работы. Сначала обсуждаем идею — потом называю ориентир.' },
  { id: 'reference', question: 'Можно прийти с референсом?', answer: 'Да. Референс помогает понять направление. Я не копирую чужую работу один в один, а предлагаю решение, которое подходит именно твоему телу и масштабу.' },
  { id: 'prepare', question: 'Как подготовиться к сеансу?', answer: 'Выспаться, поесть заранее, не употреблять алкоголь и не травмировать кожу в зоне будущей татуировки. Точные рекомендации отправлю перед встречей.' },
  { id: 'pain', question: 'Это сильно больно?', answer: 'Ощущения зависят от места, длительности и индивидуальной чувствительности. Можно делать паузы и заранее обсудить, как тебе спокойнее пройти сеанс.' },
  { id: 'care', question: 'Что с уходом и заживлением?', answer: 'После сеанса дам понятную памятку по уходу. Если что-то в процессе заживления вызывает вопросы, лучше написать и уточнить.' },
]
