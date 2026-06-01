"use client";

import { useState } from "react";

import { SelectField, TextField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { buyerCompany } from "@/lib/mock";

const businessTypes = ["Розничный магазин", "Маркетплейс", "Шоурум"];

export function BuyerProfileForm() {
  const [values, setValues] = useState({
    companyName: buyerCompany.companyName,
    inn: buyerCompany.inn,
    ogrn: buyerCompany.ogrn,
    businessType: buyerCompany.businessType,
    city: buyerCompany.city,
    contactName: buyerCompany.contactName,
    email: buyerCompany.email,
    phone: buyerCompany.phone
  });
  const [message, setMessage] = useState("");

  function updateValue(field: keyof typeof values, value: string) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  function saveProfile() {
    console.log("Wholee Store buyer profile payload:", values);
    setMessage("Изменения сохранены на фронте. Позже подключим REST API.");
  }

  return (
    <main className="px-4 py-10 md:px-10 md:py-12">
      <div className="max-w-5xl">
        <div className="border-b border-border pb-6">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Настройки</p>
          <h1 className="mt-4 text-3xl font-medium tracking-normal md:text-5xl">Профиль компании</h1>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <TextField
            label="Название компании"
            value={values.companyName}
            onChange={(event) => updateValue("companyName", event.target.value)}
          />
          <TextField label="ИНН" value={values.inn} onChange={(event) => updateValue("inn", event.target.value)} />
          <TextField label="ОГРН" value={values.ogrn} onChange={(event) => updateValue("ogrn", event.target.value)} />
          <SelectField
            label="Тип бизнеса"
            value={values.businessType}
            onChange={(event) => updateValue("businessType", event.target.value)}
          >
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </SelectField>
          <TextField label="Город" value={values.city} onChange={(event) => updateValue("city", event.target.value)} />
          <TextField
            label="Контактное лицо"
            value={values.contactName}
            onChange={(event) => updateValue("contactName", event.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
          />
          <TextField
            label="Телефон"
            type="tel"
            value={values.phone}
            onChange={(event) => updateValue("phone", event.target.value)}
          />
        </div>

        {message ? <p className="mt-6 border border-border px-4 py-3 text-sm">{message}</p> : null}

        <Button type="button" className="mt-8" onClick={saveProfile}>
          Сохранить изменения
        </Button>
      </div>
    </main>
  );
}
