# اعتبارسنجی مقدار فیلد بر اساس مجموع دو ستون در DataGrid

**محیط:** فرم‌ساز برید سامانه (OFM / Fonix)  
**محل استفاده:** Number Component → Validation → Custom Validation  
**وضعیت:** تست‌شده و موفق (۱۴۰۵/۰۸/۱۷)

## سناریو
مقدار واردشده در فیلد عددی یک ردیف DataGrid نباید از مجموع دو فیلد همان ردیف بیشتر باشد:

- `APPROVEOVERTIME`
- `HBPAYOVERTIME`

## کد عملیاتی
```javascript
function toNumber(val) {
    return Number(String(val || 0).replace(/,/g, '')) || 0;
}

var N1 = toNumber(row.APPROVEOVERTIME);
var N2 = toNumber(row.HBPAYOVERTIME);
var N3 = N1 + N2;

valid = (toNumber(input) <= N3)
    ? true
    : 'مقدار ورودی نباید از مجموع اضافه‌کار تأییدشده بیشتر باشد.';
```

## توضیحات
- `row`: آبجکت ردیف جاری DataGrid در محیط Custom Validation این کامپوننت.
- `input`: مقدار فیلد در حال اعتبارسنجی.
- `valid`: مقدار `true` برای پذیرش ورودی، یا متن خطا برای رد آن.
- `toNumber`: حذف جداکننده هزارگان و تبدیل مقدار به عدد؛ مقدار خالی یا نامعتبر را صفر در نظر می‌گیرد.
- `<=`: برابر بودن مقدار ورودی با مجموع مجاز است. برای الزام به کوچک‌تر بودن، از `<` استفاده کنید.

## نمونه
| APPROVEOVERTIME | HBPAYOVERTIME | input | نتیجه |
|---:|---:|---:|---|
| 100 | 200 | 150 | معتبر |
| 100 | 200 | 300 | معتبر |
| 100 | 200 | 350 | نامعتبر |

## نکته عیب‌یابی
در این سناریو، استفاده از `data.APPROVEOVERTIME` و `data.HBPAYOVERTIME` برای دسترسی به مقادیر ردیف جاری نتیجه مطلوب نداد، اما استفاده از `row.APPROVEOVERTIME` و `row.HBPAYOVERTIME` در Custom Validation با موفقیت آزمایش شد.

> توجه: دسترسی به `row` در این محیط خاص تأیید شده است و نباید بدون آزمایش به تمام بخش‌های فرم‌ساز تعمیم داده شود.
