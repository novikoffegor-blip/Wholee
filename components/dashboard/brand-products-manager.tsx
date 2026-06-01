"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, Plus, X } from "lucide-react";

import { TextareaField, TextField, SelectField } from "@/components/auth/form-field";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { brandProducts, type BrandDashboardProduct, type BrandProductStatus } from "@/lib/mock/dashboard/brand-dashboard";
import { formatPrice } from "@/lib/utils";

type ProductCategory = BrandDashboardProduct["category"];

const emptyForm = {
  name: "",
  category: "Кроссовки" as ProductCategory,
  description: "",
  wholesalePrice: "",
  moq: "",
  stock: "",
  status: "Активен" as BrandProductStatus
};

export function BrandProductsManager() {
  const [products, setProducts] = useState<BrandDashboardProduct[]>(brandProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formValues, setFormValues] = useState(emptyForm);

  function deleteProduct(productId: string) {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
  }

  function saveProduct() {
    if (!formValues.name || !formValues.wholesalePrice || !formValues.moq || !formValues.stock) {
      return;
    }

    const newProduct: BrandDashboardProduct = {
      id: `brand-product-${Date.now()}`,
      brandId: "brand-aurora",
      brandName: "Aurora Atelier",
      name: formValues.name,
      category: formValues.category,
      subcategory: formValues.category,
      images: ["/images/products/shopper.svg"],
      wholesalePrice: Number(formValues.wholesalePrice),
      retailPrice: Number(formValues.wholesalePrice) * 2,
      moq: Number(formValues.moq),
      sizes: ["One Size"],
      sizeRange: "one size",
      colors: ["чёрный"],
      gender: "Унисекс",
      material: "кожа",
      sku: `AA-${products.length + 1}`.padStart(6, "0"),
      season: "Демисезон",
      description: formValues.description,
      stock: Number(formValues.stock),
      status: formValues.status
    };

    // Пока нет бэкенда, новый товар живёт только в состоянии этой страницы.
    setProducts((currentProducts) => [newProduct, ...currentProducts]);
    setFormValues(emptyForm);
    setIsFormOpen(false);
  }

  return (
    <main className="px-4 py-10 md:px-10 md:py-12">
      <div className="max-w-7xl">
        <div className="flex flex-col justify-between gap-5 border-b border-border pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Каталог бренда</p>
            <h1 className="mt-4 text-3xl font-medium tracking-normal md:text-5xl">Мои товары</h1>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Добавить товар
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:hidden">
          {products.map((product) => (
            <article key={product.id} className="border border-border p-4">
              <div className="flex gap-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
                  <Image src={product.images[0]} alt={product.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="mt-1 text-xs text-muted">{product.sku}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <StatusBadge>{product.status}</StatusBadge>
                    <span className="border border-border px-2.5 py-1 text-xs text-muted">{product.category}</span>
                  </div>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
                <div>
                  <dt className="text-muted">Оптовая цена</dt>
                  <dd className="mt-1 font-medium">{formatPrice(product.wholesalePrice)}</dd>
                </div>
                <div>
                  <dt className="text-muted">MOQ</dt>
                  <dd className="mt-1 font-medium">{product.moq} шт.</dd>
                </div>
              </dl>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" type="button">
                  Изменить
                </Button>
                <Button variant="ghost" size="sm" type="button" onClick={() => deleteProduct(product.id)}>
                  Удалить
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted">
                <th className="py-4 font-medium">Фото</th>
                <th className="py-4 font-medium">Название</th>
                <th className="py-4 font-medium">Категория</th>
                <th className="py-4 font-medium">Оптовая цена</th>
                <th className="py-4 font-medium">MOQ</th>
                <th className="py-4 font-medium">Статус</th>
                <th className="py-4 text-right font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border align-middle">
                  <td className="py-4">
                    <div className="relative h-16 w-14 overflow-hidden rounded-xl bg-surface">
                      <Image src={product.images[0]} alt={product.name} fill sizes="56px" className="object-cover" />
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-medium">{product.name}</p>
                    <p className="mt-1 text-xs text-muted">{product.sku}</p>
                  </td>
                  <td className="py-4 text-muted">{product.category}</td>
                  <td className="py-4">{formatPrice(product.wholesalePrice)}</td>
                  <td className="py-4">{product.moq} шт.</td>
                  <td className="py-4">
                    <StatusBadge>{product.status}</StatusBadge>
                  </td>
                  <td className="py-4 text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="outline" size="sm" type="button">
                        Изменить
                      </Button>
                      <Button variant="ghost" size="sm" type="button" onClick={() => deleteProduct(product.id)}>
                        Удалить
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen ? (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-foreground/35 px-4 py-6">
          <div className="mx-auto max-w-3xl border border-border bg-surface shadow-soft">
            <div className="flex items-start justify-between gap-4 border-b border-border p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Новый товар</p>
                <h2 className="mt-3 text-2xl font-medium">Добавить товар</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center border border-border transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:outline-none"
                aria-label="Закрыть форму"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">
              <TextField
                label="Название товара"
                value={formValues.name}
                onChange={(event) => setFormValues((values) => ({ ...values, name: event.target.value }))}
              />
              <SelectField
                label="Категория"
                value={formValues.category}
                onChange={(event) =>
                  setFormValues((values) => ({ ...values, category: event.target.value as ProductCategory }))
                }
              >
                <option value="Кроссовки">Кроссовки</option>
                <option value="Лоферы">Лоферы</option>
                <option value="Ботинки">Ботинки</option>
                <option value="Туфли">Туфли</option>
                <option value="Сумки">Сумки</option>
                <option value="Аксессуары">Аксессуары</option>
              </SelectField>
              <div className="md:col-span-2">
                <TextareaField
                  label="Описание"
                  value={formValues.description}
                  onChange={(event) => setFormValues((values) => ({ ...values, description: event.target.value }))}
                />
              </div>
              <TextField
                label="Оптовая цена за единицу (₽)"
                type="number"
                value={formValues.wholesalePrice}
                onChange={(event) => setFormValues((values) => ({ ...values, wholesalePrice: event.target.value }))}
              />
              <TextField
                label="MOQ — минимальный объём заказа (шт.)"
                type="number"
                value={formValues.moq}
                onChange={(event) => setFormValues((values) => ({ ...values, moq: event.target.value }))}
              />
              <TextField
                label="Доступное количество на складе (шт.)"
                type="number"
                value={formValues.stock}
                onChange={(event) => setFormValues((values) => ({ ...values, stock: event.target.value }))}
              />
              <SelectField
                label="Статус"
                value={formValues.status}
                onChange={(event) =>
                  setFormValues((values) => ({ ...values, status: event.target.value as BrandProductStatus }))
                }
              >
                <option value="Активен">Активен</option>
                <option value="Скрыт">Скрыт</option>
              </SelectField>
              <div className="md:col-span-2">
                <div className="flex min-h-36 items-center justify-center border border-dashed border-border bg-surface text-center text-sm text-muted">
                  <div>
                    <ImagePlus className="mx-auto h-6 w-6" />
                    <p className="mt-3">Загрузка фото будет подключена позже</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-border p-6 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Отмена
              </Button>
              <Button type="button" onClick={saveProduct}>
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
