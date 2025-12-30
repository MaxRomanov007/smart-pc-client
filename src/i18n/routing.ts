import {defineRouting} from 'next-intl/routing';
import {locales} from "@/config/i18n";

export const routing = defineRouting({
  locales: locales.map((l) => l.key),
  defaultLocale: locales.find((l) => l.isDefault)?.key ?? locales[0].key,
  localePrefix: "never",
});