import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, PackageCheck, ShoppingBag, Store } from "lucide-react";

import { HomeSearch } from "@/components/catalog/home-search";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/mock";

const benefits = [
  {
    title: "Для брендов",
    description: "Загружайте коллекции, показывайте оптовые цены, MOQ и сезонные поставки байерам по всей России.",
    icon: Store
  },
  {
    title: "Для байеров",
    description: "Собирайте закупки из обуви, сумок и аксессуаров, сравнивайте бренды и быстро формируйте оптовые заказы.",
    icon: ShoppingBag
  }
];

const stats = [
  { value: "120+", label: "брендов" },
  { value: "8 500+", label: "товаров" },
  { value: "650+", label: "байеров" }
];

const categories = [
  {
    title: "Обувь",
    description: "Кроссовки, ботинки, туфли, сапоги, лоферы и кеды",
    image: "/images/categories/shoes.svg"
  },
  {
    title: "Сумки",
    description: "Сумки, рюкзаки, клатчи, шопперы и поясные модели",
    image: "/images/categories/bags.svg"
  },
  {
    title: "Аксессуары",
    description: "Ремни, кошельки, перчатки и сезонные дополнения",
    image: "/images/categories/accessories.svg"
  }
];

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="container grid min-h-[calc(100svh-4rem)] content-between gap-12 py-16 md:py-20">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">B2B fashion marketplace</p>
            <h1 className="mt-6 text-5xl font-medium leading-[1.02] tracking-normal md:text-7xl">
              Оптовая торговля обувью, сумками и аксессуарами
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              Wholee Store соединяет российские бренды и профессиональных байеров в едином пространстве для
              закупок, коллекций и долгосрочного роста.
            </p>
            <HomeSearch />
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/register">
                  Начать работу
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/catalog">Смотреть каталог</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    priority={product.id === "product-001"}
                  />
                </div>
                <p className="mt-3 text-sm font-medium">{product.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{product.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-20 md:py-28">
        <div className="container grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Платформа для двух сторон рынка</p>
            <h2 className="mt-5 text-3xl font-medium tracking-normal md:text-4xl">
              Закупки становятся прозрачнее, коллекции доступнее
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="border-t border-border pt-7">
                  <Icon className="h-6 w-6" />
                  <h3 className="mt-6 text-xl font-medium">{item.title}</h3>
                  <p className="mt-4 leading-7 text-muted">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-14">
        <div className="container grid gap-8 md:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="border-l border-border pl-6">
              <p className="text-4xl font-medium tracking-normal">{item.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border py-20 md:py-28">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Категории</p>
              <h2 className="mt-5 text-3xl font-medium tracking-normal md:text-4xl">
                Ниша сфокусирована на fashion-опте
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/catalog">Перейти в каталог</Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.title} href="/catalog" className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-medium">{category.title}</h3>
                    <p className="mt-2 leading-7 text-muted">{category.description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container grid gap-10 md:grid-cols-[1fr_0.7fr] md:items-center">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Старт</p>
            <h2 className="mt-5 text-3xl font-medium tracking-normal md:text-4xl">
              Запустите оптовые продажи и закупки в одном премиальном кабинете
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              На следующем шаге добавим каталог с фильтрами, карточки товаров и первые сценарии для байера и бренда.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Button asChild size="lg">
              <Link href="/register">
                Создать кабинет
                <Building2 className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/for-brands">
                Брендам
                <PackageCheck className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
