# OFM-ERR-001 — NullReferenceException در BpmnEngine.SendSms

- تاریخ مشاهده: ۲۰۲۶-۱۱-۰۳
- دسته: Database-Backend / BPMS
- وضعیت: نیازمند بررسی تکمیلی

## پیام
`Object reference not set to an instance of an object`

## محل گزارش‌شده
Event Viewer، لاگ Pargar، تابع `BpmnEngine.SendSms`، خط ۲۵۶ (طبق گزارش اولیه).

## علت
دسترسی به شیء null محتمل است، اما نام شیء و علت قطعی بدون Stack Trace و کد مشخص نیست.

## راهنمای بررسی
مقادیر ورودی و وابستگی‌های تابع ارسال پیامک، تنظیمات سرویس، اطلاعات گیرنده و Stack Trace کامل را بررسی کنید. قبل از اعمال اصلاح، مشخص کنید کدام شیء null شده است.

## پاسخ پیشنهادی پشتیبانی
با سلام و احترام، خطای NullReferenceException در مسیر ارسال پیامک گردش کار ثبت شده است. برای تشخیص دقیق علت، بررسی لاگ کامل و مقادیر ورودی تابع SendSms ضروری است. لطفاً زمان وقوع و Stack Trace مرتبط ارائه شود.
