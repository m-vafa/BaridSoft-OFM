# OFM-FB-001 — استخراج Schema فرم مقصد

**وضعیت:** آزمایش‌شده و تأییدشده توسط کاربر

## هدف
با دریافت نام لاتین فرم از `$scope.data.Latintitleform`، ابتدا FormTypeId از رکوردهای منبع داخلی استخراج می‌شود، سپس با `Http.get` به `/Fonix/OFM/api/FormType/Get?Id=...` درخواست داده می‌شود. کامپوننت‌های ورودی Schema به DG1 منتقل می‌شوند.

## پیش‌نیاز
محیط Fonix Button، توابع `FonixUtils.getInternalResourceData` و `Http.get`، گرید `DG1` و فیلد گزارش `textareaField1`.

## خروجی DG1
`Propertynameee`, `Labelll`, `valueee`, `ComponentType`, `FieldPath`, `ParentKey`, `DefaultValue`, `RequiredField`, `DisabledField`, `HiddenField`, `InputField`, `ComponentLevel`, `DescriptionField`.

**نکته:** `valueee` عمداً خالی می‌ماند. `Labelll` از `c.label || key` استفاده می‌کند و در فرم دارای برچسب فارسی نیز درست آزمایش شده است.

## محدودیت‌ها
- برای کشف FormTypeId دست‌کم یک رکورد قابل‌دسترسی لازم است.
- حداکثر ۱۰۰ رکورد برای کشف شناسه درخواست می‌شود.
- پیمایش فقط ساختارهای `components`, `columns`, `rows` را طبق کد پایه پوشش می‌دهد.

[کد پایه](code.js) · [نتایج آزمایش](test-results.md)
