import type { Brand } from "@/types";

export const brands: Brand[] = [
  {
    id: "brand-aurora",
    name: "Aurora Atelier",
    logo: "/images/brands/logos/aurora-atelier.svg",
    cover: "/images/brands/covers/aurora-atelier-lifestyle.png",
    accent: "#8d2f3c",
    badges: ["Премиальная кожа", "Капсульные коллекции", "Сделано в России"],
    description: "Премиальная городская обувь и кожаные аксессуары.",
    category: "Мультикатегория",
    conditions: {
      minimumOrder: "от 6 пар или 20 штук на модель",
      delivery: "Отгрузка от 7 рабочих дней",
      payment: "Предоплата по счёту",
      assortment: "Капсульные коллекции обуви и аксессуаров"
    },
    contact: {
      manager: "Елена Миронова",
      city: "Москва",
      email: "brand@aurora.example",
      phone: "+7 495 120-45-90"
    }
  },
  {
    id: "brand-nord",
    name: "Nord Line",
    logo: "/images/brands/logos/nord-line.svg",
    cover: "/images/brands/covers/nord-line-lifestyle.png",
    accent: "#315667",
    badges: ["Сезонные поставки", "Широкая размерная сетка"],
    description: "Сезонные коллекции обуви для российского ритейла.",
    category: "Обувь",
    conditions: {
      minimumOrder: "от 8 пар на модель",
      delivery: "Отгрузка от 10 рабочих дней",
      payment: "Предоплата по счёту",
      assortment: "Сезонная обувь и базовые модели"
    },
    contact: {
      manager: "Алексей Ветров",
      city: "Санкт-Петербург",
      email: "sales@nordline.example",
      phone: "+7 812 555-18-20"
    }
  },
  {
    id: "brand-liniya",
    name: "Liniya 27",
    logo: "/images/brands/logos/liniya-27.svg",
    cover: "/images/brands/covers/liniya-27-lifestyle.png",
    accent: "#6E3038",
    badges: ["Базовый ассортимент", "Регулярные дропы"],
    description: "Лаконичная обувь для офиса и повседневного гардероба.",
    category: "Обувь",
    conditions: {
      minimumOrder: "от 14 пар на модель",
      delivery: "Отгрузка от 6 рабочих дней",
      payment: "Предоплата 50%, остаток перед отгрузкой",
      assortment: "Повседневная и офисная обувь"
    },
    contact: {
      manager: "Ольга Романова",
      city: "Нижний Новгород",
      email: "hello@liniya27.example",
      phone: "+7 831 555-27-27"
    }
  },
  {
    id: "brand-forma",
    name: "Forma Step",
    logo: "/images/brands/logos/forma-step.svg",
    cover: "/images/brands/covers/forma-step-lifestyle.png",
    accent: "#405A49",
    badges: ["Комфортная колодка", "Современные формы"],
    description: "Комфортная обувь с выразительными формами и устойчивой колодкой.",
    category: "Обувь",
    conditions: {
      minimumOrder: "от 8 пар на модель",
      delivery: "Отгрузка от 8 рабочих дней",
      payment: "Предоплата по счёту",
      assortment: "Городская обувь с акцентом на комфорт"
    },
    contact: {
      manager: "Мария Фролова",
      city: "Екатеринбург",
      email: "wholesale@formastep.example",
      phone: "+7 343 555-40-18"
    }
  },
  {
    id: "brand-sfera",
    name: "Sfera Motion",
    logo: "/images/brands/logos/sfera-motion.svg",
    cover: "/images/brands/covers/sfera-motion-lifestyle.png",
    accent: "#326889",
    badges: ["Активный лайфстайл", "Унисекс-модели"],
    description: "Динамичная городская обувь для активного ритма.",
    category: "Обувь",
    conditions: {
      minimumOrder: "от 12 пар на модель",
      delivery: "Отгрузка от 9 рабочих дней",
      payment: "Предоплата 70%",
      assortment: "Кроссовки, кеды и городские ботинки"
    },
    contact: {
      manager: "Илья Савин",
      city: "Ростов-на-Дону",
      email: "partners@sferamotion.example",
      phone: "+7 863 555-31-40"
    }
  },
  {
    id: "brand-mira",
    name: "Mira Objects",
    logo: "/images/brands/logos/mira-objects.svg",
    cover: "/images/brands/covers/mira-objects-lifestyle.png",
    accent: "#9A5547",
    badges: ["Натуральная кожа", "Малые серии", "Предметный дизайн"],
    description: "Функциональные сумки и малые объекты для повседневной жизни.",
    category: "Сумки",
    conditions: {
      minimumOrder: "от 8 штук на модель",
      delivery: "Отгрузка от 5 рабочих дней",
      payment: "Предоплата по счёту",
      assortment: "Сумки, рюкзаки и малые аксессуары"
    },
    contact: {
      manager: "Диана Хабибуллина",
      city: "Казань",
      email: "order@miraobjects.example",
      phone: "+7 843 555-09-81"
    }
  }
];
