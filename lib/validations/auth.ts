import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль")
});

export const legalEntitySchema = z.object({
  email: z.string().email("Введите корректный email"),
  companyName: z.string().min(2, "Укажите название организации"),
  inn: z.string().regex(/^(\d{10}|\d{12})$/, "ИНН должен содержать 10 или 12 цифр"),
  ogrn: z.string().regex(/^(\d{13}|\d{15})$/, "ОГРН должен содержать 13 или 15 цифр"),
  kpp: z.string().regex(/^\d{9}$/, "КПП должен содержать 9 цифр").optional()
});

export const registerSchema = z
  .object({
    role: z.enum(["brand", "buyer"], {
      required_error: "Выберите роль"
    }),
    companyName: z.string().min(2, "Укажите название компании"),
    inn: z
      .string()
      .min(10, "ИНН должен содержать 10 или 12 цифр")
      .max(12, "ИНН должен содержать 10 или 12 цифр")
      .regex(/^\d+$/, "ИНН должен содержать только цифры"),
    ogrn: z
      .string()
      .min(13, "ОГРН / ОГРНИП должен содержать 13 или 15 цифр")
      .max(15, "ОГРН / ОГРНИП должен содержать 13 или 15 цифр")
      .regex(/^\d+$/, "ОГРН / ОГРНИП должен содержать только цифры"),
    contactName: z.string().min(3, "Укажите контактное лицо"),
    email: z.string().email("Введите корректный email"),
    phone: z.string().min(7, "Укажите телефон"),
    password: z.string().min(6, "Пароль должен быть не короче 6 символов"),
    confirmPassword: z.string().min(1, "Повторите пароль"),
    brandName: z.string().optional(),
    categories: z.array(z.enum(["Обувь", "Сумки", "Аксессуары"])).default([]),
    businessType: z.enum(["Розничный магазин", "Маркетплейс", "Шоурум"]).optional(),
    city: z.string().optional(),
    terms: z.boolean().refine(Boolean, "Нужно согласиться с условиями")
  })
  .superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Пароли должны совпадать",
        path: ["confirmPassword"]
      });
    }

    if (values.role === "brand") {
      if (!values.brandName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Укажите название бренда",
          path: ["brandName"]
        });
      }

      if (values.categories.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Выберите хотя бы одну категорию",
          path: ["categories"]
        });
      }
    }

    if (values.role === "buyer") {
      if (!values.businessType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Выберите тип бизнеса",
          path: ["businessType"]
        });
      }

      if (!values.city?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Укажите город",
          path: ["city"]
        });
      }
    }
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type LegalEntityFormValues = z.infer<typeof legalEntitySchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
