export type Locale = {
  key: string;
  label: string;
  isDefault?: boolean;
}

export const locales: Locale[] = [
  {key: "en", label: "English", isDefault: true},
  {key: "ru", label: "Русский"},
]