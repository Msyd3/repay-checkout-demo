import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Banknote,
  Check,
  CircleHelp,
  LockKeyhole,
  MoreHorizontal,
  PackageCheck,
  ReceiptText,
  Smartphone,
  X,
} from "lucide-react";

type CheckoutState =
  | "ready"
  | "processing"
  | "success"
  | "browser"
  | "otp"
  | "payment"
  | "bank"
  | "bankSuccess";
type PaymentMethod = "repay" | "tamara" | "cod" | "applePay";

const repayLogo = "/__mockup/images/repay-logo.png";
const repayBrowserLogo = "/__mockup/images/repay-checkout-logo.png";
const sarSymbol = "/__mockup/images/repay-checkout-sar.svg";

const paymentMethods: Array<{
  id: PaymentMethod;
  title: string;
  detail: string;
  mark: string;
}> = [
  { id: "repay", title: "Repay", detail: "ادفع مباشرة من حسابك البنكي", mark: "repay" },
  { id: "tamara", title: "تمارا", detail: "تقسيط مشترياتك على دفعات", mark: "tamara" },
  { id: "cod", title: "الدفع عند التوصيل", detail: "ادفع عند استلام طلبك", mark: "cod" },
  { id: "applePay", title: "Apple Pay", detail: "دفع سريع وآمن", mark: "applePay" },
];

const paymentButtonThemes: Record<
  PaymentMethod,
  { background: string; hover: string; shadow: string; label: string }
> = {
  repay: {
    background: "bg-[#108bef]",
    hover: "hover:bg-[#087bd8]",
    shadow: "shadow-[0_9px_20px_rgba(16,139,239,.27)]",
    label: "ادفع عبر Repay",
  },
  tamara: {
    background: "bg-[#8a4bc5]",
    hover: "hover:bg-[#7535b0]",
    shadow: "shadow-[0_9px_20px_rgba(138,75,197,.24)]",
    label: "ادفع عبر تمارا",
  },
  cod: {
    background: "bg-[#c8892f]",
    hover: "hover:bg-[#ae711e]",
    shadow: "shadow-[0_9px_20px_rgba(200,137,47,.24)]",
    label: "الدفع عند التوصيل",
  },
  applePay: {
    background: "bg-[#222b35]",
    hover: "hover:bg-[#121922]",
    shadow: "shadow-[0_9px_20px_rgba(34,43,53,.23)]",
    label: "ادفع عبر Apple Pay",
  },
};

function RepayWord() {
  return (
    <span style={{ fontFamily: "'Nunito', sans-serif", letterSpacing: "-0.04em" }}>
      Repay
    </span>
  );
}

function toEnglishDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776));
}

function RiyalAmount({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-[5px] ${className}`}
      dir="ltr"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <img
        src={sarSymbol}
        alt="ريال سعودي"
        className="h-[21px] w-[19px] object-contain"
      />
      <span>349</span>
    </span>
  );
}

function BrowserPaymentPage({
  onContinue,
  onClose,
}: {
  onContinue: () => void;
  onClose: () => void;
}) {
  const [mobileNumber, setMobileNumber] = useState("");
  const normalizedMobileNumber = mobileNumber.replace(/\D/g, "");
  const canContinue = /^5\d{8}$/.test(normalizedMobileNumber);

  const handleMobileChange = (value: string) => {
    const digitsOnly = toEnglishDigits(value).replace(/\D/g, "").slice(0, 9);
    setMobileNumber(digitsOnly);
  };

  return (
    <div
      dir="rtl"
      className="absolute inset-0 z-30 overflow-hidden bg-white text-[#102b45]"
      style={{
        fontFamily: "'Rubik', 'DM Sans', sans-serif",
      }}
    >
      <div className="flex h-full flex-col">
        <div className="relative flex h-[49px] shrink-0 items-end justify-between px-[20px] pb-[8px] pt-[17px] text-[11px] font-bold text-[#142333]">
          <span dir="ltr" style={{ fontFamily: "'Nunito', sans-serif" }}>
            9:41
          </span>
          <div className="pointer-events-none absolute left-1/2 top-[10px] h-[24px] w-[96px] -translate-x-1/2 rounded-full bg-[#111b28]" />
          <div className="flex items-center gap-[6px]" aria-label="حالة الهاتف">
            <span className="h-[9px] w-[14px] rounded-[2px] border-[1.5px] border-[#142333]" />
            <span className="h-[9px] w-[13px] rounded-[2px] border-[1.5px] border-[#142333]" />
            <span className="h-[9px] w-[13px] rounded-[2px] border-[1.5px] border-[#142333]" />
          </div>
        </div>

        <div className="flex h-[54px] shrink-0 items-center gap-[8px] border-b border-[#e5edf2] bg-white px-[12px]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[#4a789c] transition-colors hover:bg-white active:scale-[.97]"
            aria-label="إغلاق المتصفح"
          >
            <X size={16} strokeWidth={2.1} />
          </button>
          <div className="flex h-[32px] min-w-0 flex-1 items-center justify-center gap-[6px] rounded-[10px] border border-[#dfe8ed] bg-white px-[10px] text-[9px] text-[#47718e] shadow-[0_1px_2px_rgba(0,112,201,.04)]">
            <LockKeyhole size={11} strokeWidth={2} className="shrink-0 text-[#008cff]" />
            <span dir="ltr" className="truncate font-semibold tracking-[0.01em]">
              secure.repay.com.sa
            </span>
          </div>
          <button
            type="button"
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[#4a789c] transition-colors hover:bg-white active:scale-[.97]"
            aria-label="خيارات المتصفح"
          >
            <MoreHorizontal size={17} strokeWidth={2.1} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white px-[20px] pb-[22px] pt-[25px]">
          <div className="flex min-h-full flex-col" dir="rtl">
            <div className="flex items-start justify-between gap-[14px]" dir="ltr">
              <img
                src={repayBrowserLogo}
                alt="Repay"
                className="h-[48px] w-[48px] shrink-0 rounded-[14px] object-contain object-left"
              />
              <div className="min-w-0 flex-1 pt-[1px] text-right" dir="rtl">
                <p
                  className="text-[11px] font-extrabold tracking-[-0.03em] text-[#102b45]"
                  dir="ltr"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Secure Checkout
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center">
            <div className="text-right">
              <p className="text-[10px] font-semibold text-[#4d7794]">دخول سريع</p>
              <h2 className="mt-[6px] text-[22px] font-bold leading-[1.15] tracking-[-0.06em] text-[#102b45]">
                دخول سريع لإتمام الدفع
              </h2>
              <p className="mt-[8px] text-[11px] leading-[1.5] text-[#5e7f95]">
                أدخل رقم جوالك للمتابعة بأمان
              </p>
            </div>
            <div className="mt-[22px] rounded-[17px] border border-[#dbeaf3] bg-white px-[14px] py-[13px] shadow-[0_5px_16px_rgba(0,140,255,.04)]">
            <div className="flex items-center gap-[9px]">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-white text-[#008cff]">
                <Smartphone size={17} strokeWidth={1.9} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#4d7794]">دخول سريع</p>
                <p className="mt-[4px] text-[13px] font-bold text-[#102b45]">أدخل رقمك للمتابعة</p>
              </div>
            </div>
            <div className="mt-[12px] flex h-[46px] items-center overflow-hidden rounded-[12px] border border-[#c6dfe9] bg-white" dir="ltr">
              <span className="flex h-full items-center border-r border-[#e0eaee] px-[11px] text-[12px] font-bold text-[#5f7782]">
                <span style={{ fontFamily: "'Nunito', sans-serif" }}>+966</span>
              </span>
              <input
                aria-label="رقم الجوال"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={mobileNumber}
                onChange={(event) => handleMobileChange(event.target.value)}
                placeholder="5X XXX XXXX"
                className="h-full min-w-0 flex-1 bg-transparent px-[12px] text-[13px] font-bold tracking-[0.04em] text-[#102b45] outline-none placeholder:font-medium placeholder:text-[#8eaabd]"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              />
            </div>
            <div className="mt-[10px] flex items-center gap-[6px] text-[9px] text-[#2775a8]">
              <LockKeyhole size={12} strokeWidth={1.9} />
              <span>رمز تحقق آمن سيصلك على جوالك</span>
            </div>
            </div>

            <button
            type="button"
            onClick={() => {
              if (canContinue) {
                onContinue();
              }
            }}
            disabled={!canContinue}
            className={`mt-[22px] flex h-[49px] w-full items-center justify-center gap-[8px] rounded-[15px] text-[13px] font-bold text-white transition-all active:scale-[.985] ${
              canContinue
                ? "bg-[#008cff] shadow-[0_10px_22px_rgba(0,140,255,.24)] hover:bg-[#0079db]"
                : "cursor-not-allowed bg-[#b9dcf4]"
            }`}
          >ارسال رمز التحقق</button>

            <p className="mt-[13px] text-center text-[9px] leading-[1.45] text-[#6d8ba0]">
              بالمتابعة، أنت توافق على إتمام الدفع من حسابك في Repay
            </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none mx-auto mb-[10px] h-[4px] w-[106px] shrink-0 rounded-full bg-[#172435]" />
      </div>
    </div>
  );
}

function OtpVerificationPage({
  onVerify,
  onClose,
}: {
  onVerify: () => void;
  onClose: () => void;
}) {
  const [verificationCode, setVerificationCode] = useState("");
  const canVerify = /^\d{6}$/.test(verificationCode);

  const handleCodeChange = (value: string) => {
    setVerificationCode(toEnglishDigits(value).replace(/\D/g, "").slice(0, 6));
  };

  return (
    <div
      dir="rtl"
      className="absolute inset-0 z-30 overflow-hidden bg-white text-[#102b45]"
      style={{ fontFamily: "'Rubik', 'DM Sans', sans-serif" }}
    >
      <div className="flex h-full flex-col">
        <div className="relative flex h-[49px] shrink-0 items-end justify-between px-[20px] pb-[8px] pt-[17px] text-[11px] font-bold text-[#142333]">
          <span dir="ltr" style={{ fontFamily: "'Nunito', sans-serif" }}>
            9:41
          </span>
          <div className="pointer-events-none absolute left-1/2 top-[10px] h-[24px] w-[96px] -translate-x-1/2 rounded-full bg-[#111b28]" />
          <div className="flex items-center gap-[6px]" aria-label="حالة الهاتف">
            <span className="h-[9px] w-[14px] rounded-[2px] border-[1.5px] border-[#142333]" />
            <span className="h-[9px] w-[13px] rounded-[2px] border-[1.5px] border-[#142333]" />
            <span className="h-[9px] w-[13px] rounded-[2px] border-[1.5px] border-[#142333]" />
          </div>
        </div>

        <div className="flex h-[54px] shrink-0 items-center gap-[8px] border-b border-[#e5edf2] bg-white px-[12px]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[#4a789c] transition-colors hover:bg-[#f5faff] active:scale-[.97]"
            aria-label="إغلاق المتصفح"
          >
            <X size={16} strokeWidth={2.1} />
          </button>
          <div className="flex h-[32px] min-w-0 flex-1 items-center justify-center gap-[6px] rounded-[10px] border border-[#dfe8ed] bg-white px-[10px] text-[9px] text-[#47718e] shadow-[0_1px_2px_rgba(0,112,201,.04)]">
            <LockKeyhole size={11} strokeWidth={2} className="shrink-0 text-[#008cff]" />
            <span dir="ltr" className="truncate font-semibold tracking-[0.01em]">
              secure.repay.com.sa
            </span>
          </div>
          <button
            type="button"
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[#4a789c] transition-colors hover:bg-[#f5faff] active:scale-[.97]"
            aria-label="خيارات المتصفح"
          >
            <MoreHorizontal size={17} strokeWidth={2.1} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white px-[20px] pb-[22px] pt-[25px]">
          <div className="flex min-h-full flex-col" dir="rtl">
            <div className="flex items-start justify-between gap-[14px]" dir="ltr">
              <img
                src={repayBrowserLogo}
                alt="Repay"
                className="h-[48px] w-[48px] shrink-0 rounded-[14px] object-contain object-left"
              />
              <div className="min-w-0 flex-1 pt-[1px] text-right" dir="rtl">
                <p
                  className="text-[11px] font-extrabold tracking-[-0.03em] text-[#102b45]"
                  dir="ltr"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Secure Checkout
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center">
            <div className="text-right">
              <p className="text-[10px] font-semibold text-[#4d7794]">دخول سريع</p>
              <h2 className="mt-[6px] text-[22px] font-bold leading-[1.15] tracking-[-0.06em] text-[#102b45]">
                أدخل رمز التحقق
              </h2>
              <p className="mt-[8px] text-[11px] leading-[1.5] text-[#5e7f95]">
                أرسلنا رمزًا مكوّنًا من{" "}
                <span style={{ fontFamily: "'Nunito', sans-serif" }}>6</span> أرقام إلى رقم جوالك
              </p>
            </div>
            <div className="mt-[25px] rounded-[17px] border border-[#dbeaf3] bg-white px-[14px] py-[15px] shadow-[0_5px_16px_rgba(0,140,255,.04)]">
            <div className="flex items-center gap-[9px]">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#f1f8ff] text-[#008cff]">
                <LockKeyhole size={17} strokeWidth={1.9} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#4d7794]">رمز التحقق</p>
              <p className="mt-[4px] text-[13px] font-bold text-[#102b45]">أدخل الرمز المرسل إليك</p>
              </div>
            </div>

            <input
              aria-label="رمز التحقق"
              type="tel"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={verificationCode}
              onChange={(event) => handleCodeChange(event.target.value)}
              placeholder="••••••"
              className="mt-[16px] h-[56px] w-full rounded-[13px] border border-[#cfe3ef] bg-[#fbfdff] text-center text-[24px] font-bold tracking-[0.34em] text-[#102b45] outline-none transition-colors placeholder:text-[#b5cad7] focus:border-[#008cff] focus:ring-2 focus:ring-[#008cff]/10"
              dir="ltr"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            />
            <div className="mt-[10px] flex items-center justify-between text-[9px]">
              <span className="text-[#7791a2]" style={{ fontFamily: "'Nunito', sans-serif" }}>
                {verificationCode.length} / 6
              </span>
              <button
                type="button"
                onClick={() => setVerificationCode("")}
                className="font-bold text-[#008cff] transition-colors hover:text-[#006fc9]"
              >
                إعادة إرسال الرمز
              </button>
            </div>
            </div>

            <button
            type="button"
            onClick={() => {
              if (canVerify) {
                onVerify();
              }
            }}
            disabled={!canVerify}
            className={`mt-[22px] flex h-[49px] w-full items-center justify-center gap-[8px] rounded-[15px] text-[13px] font-bold text-white transition-all active:scale-[.985] ${
              canVerify
                ? "bg-[#008cff] shadow-[0_10px_22px_rgba(0,140,255,.24)] hover:bg-[#0079db]"
                : "cursor-not-allowed bg-[#b9dcf4]"
            }`}
          >
            تأكيد الرمز
            </button>

            <p className="mt-[14px] flex items-center justify-center gap-[5px] text-center text-[9px] leading-[1.45] text-[#6d8ba0]">
            <LockKeyhole size={11} strokeWidth={1.8} />
            رمز التحقق صالح للاستخدام مرة واحدة
            </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none mx-auto mb-[10px] h-[4px] w-[106px] shrink-0 rounded-full bg-[#172435]" />
      </div>
    </div>
  );
}

const bankOptions = [
  { id: "alrajhi", name: "مصرف الراجحي", color: "#159a8c" },
  { id: "snb", name: "البنك الأهلي السعودي", color: "#1c4e80" },
  { id: "riyad", name: "بنك الرياض", color: "#d84c4c" },
  { id: "alinma", name: "مصرف الإنماء", color: "#2c9a68" },
  { id: "albilad", name: "بنك البلاد", color: "#e8a93a" },
  { id: "saab", name: "البنك السعودي الأول", color: "#7a54a8" },
  { id: "bsf", name: "البنك السعودي الفرنسي", color: "#0a7cc1" },
  { id: "aljazira", name: "بنك الجزيرة", color: "#e06f35" },
  { id: "anb", name: "البنك العربي الوطني", color: "#2d6c62" },
  { id: "gib", name: "بنك الخليج الدولي", color: "#355aa8" },
];

type BankOption = (typeof bankOptions)[number];

function BankPaymentPage({
  bank,
  onComplete,
}: {
  bank: BankOption;
  onComplete: () => void;
}) {
  const isLightBank = bank.id === "albilad";
  const foreground = isLightBank ? "#102b45" : "#ffffff";
  const buttonBackground = isLightBank ? "#102b45" : "#ffffff";
  const buttonForeground = isLightBank ? "#ffffff" : bank.color;

  return (
    <div
      dir="rtl"
      className="absolute inset-0 z-50 overflow-hidden"
      style={{
        backgroundColor: bank.color,
        color: foreground,
        fontFamily: "'Rubik', 'DM Sans', sans-serif",
      }}
    >
      <div className="flex h-full flex-col">
        <div className="relative flex h-[56px] shrink-0 items-end justify-between px-[20px] pb-[10px] pt-[18px] text-[11px] font-bold">
          <span dir="ltr" style={{ fontFamily: "'Nunito', sans-serif" }}>
            9:41
          </span>
          <div
            className="pointer-events-none absolute left-1/2 top-[10px] h-[24px] w-[96px] -translate-x-1/2 rounded-full bg-[#111b28]"
            aria-hidden="true"
          />
          <div className="flex items-center gap-[6px]" aria-label="حالة الهاتف">
            <span className="h-[9px] w-[14px] rounded-[2px] border-[1.5px] border-current" />
            <span className="h-[9px] w-[13px] rounded-[2px] border-[1.5px] border-current" />
            <span className="h-[9px] w-[13px] rounded-[2px] border-[1.5px] border-current" />
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-[26px] pb-[56px] text-center">
          <div
            className="flex h-[78px] w-[78px] items-center justify-center rounded-[24px] border border-white/30 bg-white/20"
            aria-hidden="true"
          >
            <span className="h-[36px] w-[36px] rounded-[12px] bg-white/90" />
          </div>
          <p className="mt-[20px] text-[11px] font-semibold opacity-80">الدفع عبر</p>
          <h1 className="mt-[7px] text-[23px] font-bold tracking-[-0.06em]">{bank.name}</h1>
          <div className="mt-[28px]">
            <p className="text-[10px] font-semibold opacity-80">المبلغ المطلوب</p>
            <span
              dir="ltr"
              className="mt-[5px] block text-[48px] font-extrabold leading-none tracking-[-0.08em]"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              349
            </span>
            <span className="mt-[4px] block text-[11px] font-semibold opacity-80">ريال سعودي</span>
          </div>
          <p className="mt-[25px] max-w-[230px] text-[11px] leading-[1.6] opacity-85">
            تم اختيار البنك، يمكنك الرجوع لتغيير طريقة الدفع
          </p>
          <button
            type="button"
            onClick={onComplete}
            className="mt-[25px] flex h-[49px] w-full items-center justify-center rounded-[15px] text-[13px] font-bold transition-transform active:scale-[.985]"
            style={{ backgroundColor: buttonBackground, color: buttonForeground }}
          >
            إتمام الدفع
          </button>
        </div>

        <div
          className="pointer-events-none mx-auto mb-[10px] h-[4px] w-[106px] shrink-0 rounded-full"
          style={{ backgroundColor: foreground }}
        />
      </div>
    </div>
  );
}

function BankPaymentSuccessPage({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <div
      dir="rtl"
      className="absolute inset-0 z-50 overflow-hidden bg-white text-[#102b45]"
      style={{
        fontFamily: "'Rubik', 'DM Sans', sans-serif",
      }}
    >
      <div className="flex h-full flex-col">
        <div className="relative flex h-[56px] shrink-0 items-end justify-between px-[20px] pb-[10px] pt-[18px] text-[11px] font-bold text-[#142333]">
          <span dir="ltr" style={{ fontFamily: "'Nunito', sans-serif" }}>
            9:41
          </span>
          <div
            className="pointer-events-none absolute left-1/2 top-[10px] h-[24px] w-[96px] -translate-x-1/2 rounded-full bg-[#111b28]"
            aria-hidden="true"
          />
          <div className="flex items-center gap-[6px]" aria-label="حالة الهاتف">
            <span className="h-[9px] w-[14px] rounded-[2px] border-[1.5px] border-[#142333]" />
            <span className="h-[9px] w-[13px] rounded-[2px] border-[1.5px] border-[#142333]" />
            <span className="h-[9px] w-[13px] rounded-[2px] border-[1.5px] border-[#142333]" />
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-[26px] pb-[56px] text-center">
          <div
            className="flex h-[78px] w-[78px] items-center justify-center rounded-full border border-[#bfe3fb] bg-[#eef8ff] text-[#008cff]"
            aria-hidden="true"
          >
            <Check size={38} strokeWidth={2.4} />
          </div>
          <p className="mt-[21px] max-w-[275px] text-[18px] font-bold leading-[1.35] tracking-[-0.055em] text-[#102b45]">
            تمت معالجة عملية الدفع بنجاح
          </p>
          <RiyalAmount className="mt-[13px] text-[52px] font-extrabold leading-none tracking-[-0.08em] text-[#102b45]" />
          <button
            type="button"
            onClick={onBack}
            className="mt-[32px] flex h-[49px] w-full items-center justify-center rounded-[15px] bg-[#102b45] text-[13px] font-bold text-white transition-colors hover:bg-[#1c3449] active:scale-[.985]"
          >
            العودة للمتجر
          </button>
        </div>

        <div className="pointer-events-none mx-auto mb-[10px] h-[4px] w-[106px] shrink-0 rounded-full bg-[#172435]" />
      </div>
    </div>
  );
}

function PaymentAuthorizationPage({
  onPay,
  onClose,
}: {
  onPay: (bank: BankOption) => void;
  onClose: () => void;
}) {
  const [selectedOption, setSelectedOption] = useState<"bank" | "other">("bank");
  const [isBankSheetOpen, setIsBankSheetOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  return (
    <div
      dir="rtl"
      className="absolute inset-0 z-30 overflow-hidden bg-white text-[#102b45]"
      style={{ fontFamily: "'Rubik', 'DM Sans', sans-serif" }}
    >
      <div className="flex h-full flex-col">
        <div className="relative flex h-[49px] shrink-0 items-end justify-between px-[20px] pb-[8px] pt-[17px] text-[11px] font-bold text-[#142333]">
          <span dir="ltr" style={{ fontFamily: "'Nunito', sans-serif" }}>
            9:41
          </span>
          <div className="pointer-events-none absolute left-1/2 top-[10px] h-[24px] w-[96px] -translate-x-1/2 rounded-full bg-[#111b28]" />
          <div className="flex items-center gap-[6px]" aria-label="حالة الهاتف">
            <span className="h-[9px] w-[14px] rounded-[2px] border-[1.5px] border-[#142333]" />
            <span className="h-[9px] w-[13px] rounded-[2px] border-[1.5px] border-[#142333]" />
            <span className="h-[9px] w-[13px] rounded-[2px] border-[1.5px] border-[#142333]" />
          </div>
        </div>

        <div className="flex h-[54px] shrink-0 items-center gap-[8px] border-b border-[#e5edf2] bg-white px-[12px]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[#4a789c] transition-colors hover:bg-[#f5faff] active:scale-[.97]"
            aria-label="العودة إلى رمز التحقق"
          >
            <X size={16} strokeWidth={2.1} />
          </button>
          <div className="flex h-[32px] min-w-0 flex-1 items-center justify-center gap-[6px] rounded-[10px] border border-[#dfe8ed] bg-white px-[10px] text-[9px] text-[#47718e] shadow-[0_1px_2px_rgba(0,112,201,.04)]">
            <LockKeyhole size={11} strokeWidth={2} className="shrink-0 text-[#008cff]" />
            <span dir="ltr" className="truncate font-semibold tracking-[0.01em]">
              secure.repay.com.sa
            </span>
          </div>
          <button
            type="button"
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[#4a789c] transition-colors hover:bg-[#f5faff] active:scale-[.97]"
            aria-label="خيارات المتصفح"
          >
            <MoreHorizontal size={17} strokeWidth={2.1} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white px-[20px] pb-[22px] pt-[25px]">
          <div className="flex min-h-full flex-col" dir="rtl">
            <div className="flex items-start justify-between gap-[14px]" dir="ltr">
              <img
                src={repayBrowserLogo}
                alt="Repay"
                className="h-[48px] w-[48px] shrink-0 rounded-[14px] object-contain object-left"
              />
              <div className="min-w-0 flex-1 pt-[1px] text-right" dir="rtl">
                <p
                  className="text-[11px] font-extrabold tracking-[-0.03em] text-[#102b45]"
                  dir="ltr"
                  style={{ fontFamily: "'Rubik', sans-serif" }}
                >مَلبَس</p>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center">
              <div className="text-center">
                <p className="text-[10px] font-semibold text-[#4d7794]">المبلغ</p>
                <RiyalAmount className="mt-[8px] text-[43px] font-extrabold leading-none tracking-[-0.08em] text-[#102b45]" />
              </div>

              <div className="mt-[32px] space-y-[8px]">
                <button
                  type="button"
                  aria-pressed={selectedOption === "bank"}
                  onClick={() => setSelectedOption("bank")}
                  className={`flex w-full items-center gap-[10px] rounded-[15px] border px-[12px] py-[11px] text-right transition-all active:scale-[.995] ${
                    selectedOption === "bank"
                      ? "border-[#008cff] bg-[#f2f8fe] shadow-[0_6px_16px_rgba(0,140,255,.10)]"
                      : "border-[#dce6eb] bg-white hover:border-[#b9d2df]"
                  }`}
                >
                  <span
                    className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] ${
                      selectedOption === "bank" ? "bg-[#dff1ff] text-[#008cff]" : "bg-[#f2f7fa] text-[#6b8797]"
                    }`}
                  >
                    <Banknote size={18} strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-bold text-[#102b45]">الدفع مباشرة من الحساب البنكي</span>
                    <span className="mt-[3px] block text-[9px] text-[#7591a0]">خصم آمن ومباشر من حسابك</span>
                  </span>
                  <span
                    className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border ${
                      selectedOption === "bank" ? "border-[#008cff] bg-[#008cff]" : "border-[#c9d7de]"
                    }`}
                  >
                    {selectedOption === "bank" && <Check size={11} strokeWidth={3} className="text-white" />}
                  </span>
                </button>

                <button
                  type="button"
                  aria-pressed={selectedOption === "other"}
                  onClick={() => setSelectedOption("other")}
                  className={`flex w-full items-center gap-[10px] rounded-[15px] border px-[12px] py-[11px] text-right transition-all active:scale-[.995] ${
                    selectedOption === "other"
                      ? "border-[#008cff] bg-[#f2f8fe] shadow-[0_6px_16px_rgba(0,140,255,.10)]"
                      : "border-[#dce6eb] bg-white hover:border-[#b9d2df]"
                  }`}
                >
                  <span
                    className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] text-[13px] font-extrabold tracking-[.08em] ${
                      selectedOption === "other" ? "bg-[#e8f5ff] text-[#008cff]" : "bg-[#f2f7fa] text-[#6b8797]"
                    }`}
                  >
                    ···
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-bold text-[#102b45]">طرق دفع أخرى</span>
                    <span className="mt-[3px] block text-[9px] text-[#7591a0]">Apple Pay وطرق الدفع المتاحة</span>
                  </span>
                  <span
                    className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border ${
                      selectedOption === "other" ? "border-[#008cff] bg-[#008cff]" : "border-[#c9d7de]"
                    }`}
                  >
                    {selectedOption === "other" && <Check size={11} strokeWidth={3} className="text-white" />}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (selectedOption === "bank") {
                    setIsBankSheetOpen(true);
                  }
                }}
                className={`mt-[22px] flex h-[49px] w-full items-center justify-center rounded-[15px] text-[13px] font-bold text-white transition-colors active:scale-[.985] ${
                  selectedOption === "other"
                    ? "bg-[#111820] shadow-[0_10px_22px_rgba(17,24,32,.20)] hover:bg-[#1b2630]"
                    : "bg-[#008cff] shadow-[0_10px_22px_rgba(0,140,255,.24)] hover:bg-[#0079db]"
                }`}
              >
                {selectedOption === "other" ? "الدفع عبر Apple Pay" : "الدفع مباشرة من الحساب البنكي"}
              </button>

              <p className="mt-[13px] text-center text-[9px] leading-[1.45] text-[#6d8ba0]">
                عملية دفع آمنة ومشفّرة
              </p>
            </div>
          </div>
        </div>

        {isBankSheetOpen && (
          <div
            className="absolute inset-0 z-40 flex items-end bg-[#102b45]/30"
            role="dialog"
            aria-modal="true"
            aria-label="اختيار البنك"
          >
            <div className="w-full rounded-t-[26px] border-t border-[#d8e7ed] bg-white px-[18px] pb-[18px] pt-[10px] shadow-[0_-12px_34px_rgba(16,43,69,.18)]">
              <div className="mx-auto mb-[13px] h-[4px] w-[43px] rounded-full bg-[#c8d7de]" />
              <div className="flex items-start justify-between gap-[12px]" dir="ltr">
                <button
                  type="button"
                  onClick={() => setIsBankSheetOpen(false)}
                  className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[#5f7a89] transition-colors hover:bg-[#f3f8fa] active:scale-[.97]"
                  aria-label="إغلاق قائمة البنوك"
                >
                  <X size={16} strokeWidth={2.1} />
                </button>
                <div className="min-w-0 flex-1 text-right" dir="rtl">
                  <p className="text-[17px] font-bold tracking-[-0.045em] text-[#102b45]">اختر البنك</p>
                  <p className="mt-[4px] text-[10px] text-[#7892a0]">اختر البنك الذي تريد الدفع من خلاله</p>
                </div>
              </div>

              <div className="mt-[16px] flex max-h-[274px] flex-col gap-[8px] overflow-y-auto pb-[2px]" dir="rtl">
                {bankOptions.map((bank) => {
                  const isSelected = bank.id === selectedBank;

                  return (
                    <button
                      key={bank.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedBank(bank.id)}
                      className={`flex min-h-[52px] w-full shrink-0 items-center gap-[8px] rounded-[13px] border px-[9px] text-right transition-colors active:scale-[.985] ${
                        isSelected
                          ? "border-[#008cff] bg-[#f1f8ff]"
                          : "border-[#dce8ed] bg-white hover:border-[#b9d2df] hover:bg-[#fbfdff]"
                      }`}
                    >
                      <span
                        className="h-[28px] w-[28px] shrink-0 rounded-[9px]"
                        style={{ backgroundColor: bank.color }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1 text-[10px] font-bold leading-[1.35] text-[#19344a]">
                        {bank.name}
                      </span>
                      {isSelected && <Check size={14} strokeWidth={3} className="shrink-0 text-[#008cff]" />}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={!selectedBank}
                onClick={() => {
                  if (selectedBank) {
                    const bank = bankOptions.find((option) => option.id === selectedBank);
                    if (!bank) {
                      return;
                    }
                    setIsBankSheetOpen(false);
                    onPay(bank);
                  }
                }}
                className={`mt-[15px] flex h-[48px] w-full items-center justify-center rounded-[14px] text-[13px] font-bold text-white transition-colors active:scale-[.985] ${
                  selectedBank
                    ? "bg-[#008cff] shadow-[0_9px_20px_rgba(0,140,255,.20)] hover:bg-[#0079db]"
                    : "cursor-not-allowed bg-[#b9dcf4]"
                }`}
              >
                متابعة الدفع
              </button>
            </div>
          </div>
        )}

        <div className="pointer-events-none mx-auto mb-[10px] h-[4px] w-[106px] shrink-0 rounded-full bg-[#172435]" />
      </div>
    </div>
  );
}

export function RepayCheckout() {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("ready");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("repay");
  const [selectedBankForPage, setSelectedBankForPage] = useState<BankOption | null>(null);

  useEffect(() => {
    if (checkoutState !== "processing") {
      return;
    }

    const timer = window.setTimeout(() => {
      setCheckoutState("success");
    }, 1350);

    return () => window.clearTimeout(timer);
  }, [checkoutState]);

  const handlePayment = () => {
    if (selectedMethod !== "repay") {
      return;
    }

    if (checkoutState === "browser") {
      return;
    }

    if (checkoutState === "success") {
      setCheckoutState("ready");
      return;
    }

    if (checkoutState === "ready") {
      setCheckoutState("browser");
    }
  };

  const isProcessing = checkoutState === "processing";
  const isSuccess = checkoutState === "success";
  const selectedPayment = paymentMethods.find((method) => method.id === selectedMethod);
  const selectedButtonTheme = paymentButtonThemes[selectedMethod];

  return (
    <main
      dir="rtl"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-3 py-5 sm:px-8"
      style={{
        backgroundColor: "#dfeaf2",
        backgroundImage:
          "radial-gradient(circle at 15% 12%, rgba(255,255,255,.78), transparent 30%), radial-gradient(circle at 85% 90%, rgba(31,106,159,.14), transparent 33%)",
        fontFamily: "'Rubik', 'DM Sans', sans-serif",
      }}
    >
      <section
        className="relative w-full max-w-[390px] overflow-visible rounded-[49px] border-[6px] border-[#202d3c] bg-[#202d3c] p-[3px]"
        style={{
          aspectRatio: "390 / 844",
          boxShadow:
            "0 34px 72px rgba(30, 65, 88, .24), 0 8px 22px rgba(30, 65, 88, .16), inset 0 0 0 1px rgba(255,255,255,.17)",
        }}
        aria-label="صفحة دفع Repay على هاتف آيفون"
      >
        <div className="pointer-events-none absolute -left-[10px] top-[142px] h-[54px] w-[4px] rounded-l-full bg-[#263746]" />
        <div className="pointer-events-none absolute -left-[10px] top-[210px] h-[91px] w-[4px] rounded-l-full bg-[#263746]" />
        <div className="pointer-events-none absolute -right-[10px] top-[178px] h-[74px] w-[4px] rounded-r-full bg-[#263746]" />

        <div className="relative h-full overflow-hidden rounded-[42px] bg-[#f8faf9] text-[#172435]">
          <div className="pointer-events-none absolute left-1/2 top-[11px] z-20 flex h-[25px] w-[98px] -translate-x-1/2 items-center justify-start rounded-full bg-[#111b28] pl-[11px]">
            <span className="h-[6px] w-[6px] rounded-full bg-[#26384a] shadow-[0_0_0_2px_rgba(255,255,255,.03)]" />
          </div>

          <div className="relative flex h-full flex-col px-[19px] pb-[18px] pt-[13px]">
            <div className="flex h-[27px] items-center justify-between px-[3px] text-[11px] font-bold tracking-[-0.02em] text-[#142333]">
              <div className="flex items-center gap-[5px]" aria-label="حالة الهاتف">
                <span className="relative h-[9px] w-[14px] rounded-[2px] border-[1.5px] border-[#142333]">
                  <span className="absolute inset-[2px] rounded-[1px] bg-[#142333]" />
                </span>
                <span className="h-[9px] w-[13px] rounded-[2px] border-[1.5px] border-[#142333]" />
                <span className="h-[9px] w-[13px] rounded-[2px] border-[1.5px] border-[#142333]" />
              </div>
              <span dir="ltr" style={{ fontFamily: "'Nunito', sans-serif" }}>
                9:41
              </span>
            </div>

            <header className="relative flex items-center justify-center pb-[16px] pt-[8px]">
              <div className="text-center">
                <p className="mt-[7px] text-[9px] font-bold tracking-[0.16em] text-[#7b8d96]">مَلبَس</p>
                <p className="mt-[3px] text-[15px] font-bold tracking-[-0.04em] text-[#172435]">
                  إتمام الطلب
                </p>
              </div>
              <button
                type="button"
                className="absolute left-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#dfe7e8] bg-white text-[#536676] transition-colors hover:border-[#b9cbd2] active:bg-[#eef3f3]"
                aria-label="المساعدة"
              >
                <CircleHelp size={17} strokeWidth={2} />
              </button>
            </header>

            <div className="rounded-[16px] border border-[#d9e8ec] bg-[#eef7f8] px-[12px] py-[10px]">
              <div className="flex items-start justify-between gap-[10px]">
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold text-[#7a8d95]">ملخص الطلب</p>
                  <p className="mt-[4px] truncate text-[12px] font-bold tracking-[-0.03em] text-[#172435]">
                    جاكيت كتان خفيف
                  </p>
                  <p className="mt-[2px] text-[9px] text-[#819198]">أسود · مقاس M</p>
                </div>
                <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[9px] bg-white text-[#4f7d87]">
                  <ReceiptText size={16} strokeWidth={1.8} />
                </div>
              </div>
              <div className="mt-[7px] flex items-center justify-between border-t border-[#d8e6e9] pt-[7px]">
                <span className="text-[9px] text-[#7f9097]">الإجمالي</span>
                <RiyalAmount className="text-[14px] font-bold tracking-[-0.05em] text-[#172435]" />
              </div>
            </div>

            <div className="mt-[12px]">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[14px] font-bold tracking-[-0.035em] text-[#172435]">طريقة الدفع</p>
                  <p className="mt-[3px] text-[10px] text-[#82939a]">اختر الطريقة الأنسب لك</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#0879d4]">
                   آمنة <span style={{ fontFamily: "'Nunito', sans-serif" }}>100%</span>
                  <BadgeCheck size={13} strokeWidth={2.2} />
                </span>
              </div>

              <div className="mt-[10px] space-y-[7px]">
                {paymentMethods.map((method) => {
                  const isSelected = method.id === selectedMethod;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      aria-pressed={isSelected}
                      disabled={isProcessing}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex w-full items-center gap-[9px] rounded-[15px] border px-[10px] py-[8px] text-right transition-all duration-200 ${
                        isSelected
                          ? "border-[#108bef] bg-[#f2f8fe] shadow-[0_5px_14px_rgba(17,140,243,.10)]"
                          : "border-[#dce6e7] bg-white opacity-75 hover:border-[#b9cbd2] hover:bg-[#fbfdfd] active:scale-[.995]"
                      }`}
                    >
                      <span
                         className={`flex h-[34px] w-[70px] shrink-0 items-center justify-center overflow-hidden rounded-[9px] transition-transform duration-200 ${
                          method.id === "repay"
                             ? "bg-[#eef8ff] p-[3px]"
                             : method.id === "tamara"
                               ? "bg-[#f3e7ff]"
                               : method.id === "cod"
                                 ? "bg-[#fff4dd]"
                                 : "bg-[#eef3f5]"
                        }`}
                      >
                        {method.mark === "repay" ? (
                           <img
                             src={repayLogo}
                             alt="Repay"
                             className="h-full w-full rounded-[6px] object-contain"
                           />
                         ) : method.mark === "tamara" ? (
                           <span className="text-[12px] font-bold text-[#6d27a9]">تمارا</span>
                         ) : method.mark === "cod" ? (
                           <span className="flex items-center gap-[4px] text-[#8b5a13]">
                             <Banknote size={16} strokeWidth={1.9} />
                             <span className="text-[9px] font-bold">عند الاستلام</span>
                           </span>
                        ) : (
                           <span className="text-[10px] font-bold tracking-[-0.03em] text-[#253844]">
                             Apple Pay
                           </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12px] font-bold tracking-[-0.025em] text-[#172435]">
                           {method.id === "repay" ? <RepayWord /> : method.title}
                        </span>
                        <span className="mt-[2px] block truncate text-[9px] text-[#819198]">{method.detail}</span>
                      </span>
                      <span
                        className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                          isSelected ? "border-[#108bef] bg-[#108bef]" : "border-[#c9d7da] bg-transparent"
                        }`}
                      >
                        {isSelected && <Check size={11} strokeWidth={3} className="text-white" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-[10px] flex items-center gap-[8px] rounded-[13px] bg-[#fffaf0] px-[11px] py-[8px] text-[#88764d]">
              <LockKeyhole size={14} strokeWidth={1.8} className="shrink-0" />
              <p className="text-[9px] leading-[1.4]">بياناتك مشفّرة ولن يتم حفظ معلومات بطاقتك</p>
            </div>

            <div className="mt-auto">
              <div className="mb-[10px] flex items-end justify-between px-[2px]">
                <span className="text-[10px] font-medium text-[#7f9097]">المبلغ المستحق</span>
                 <RiyalAmount className="text-[20px] font-bold tracking-[-0.06em] text-[#172435]" />
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayment}
                className={`group relative flex h-[51px] w-full items-center justify-center overflow-hidden rounded-[16px] text-[13px] font-bold tracking-[-0.02em] transition-all duration-300 ${
                  isSuccess
                    ? "bg-[#1d9b78] text-white shadow-[0_9px_20px_rgba(29,155,120,.22)]"
                     : `${selectedButtonTheme.background} ${selectedButtonTheme.hover} ${selectedButtonTheme.shadow} active:scale-[.985]`
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-[8px]" aria-live="polite">
                    <span className="h-[14px] w-[14px] animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    جارٍ تأمين الدفع
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center gap-[7px]" aria-live="polite">
                    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white/20">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    تم الدفع بنجاح
                  </span>
                ) : (
                  <span className="flex items-center gap-[8px]">
                    <span className="text-background">
                      {selectedMethod === "repay" ? (
                        <>
                          ادفع عبر <RepayWord />
                        </>
                      ) : (
                        selectedButtonTheme.label
                      )}
                    </span>
                  </span>
                )}
              </button>

              <div className="mt-[9px] flex items-center justify-center gap-[5px] text-[9px] font-medium text-[#89999f]">
                {isSuccess ? (
                  <>
                    <PackageCheck size={12} strokeWidth={1.9} className="text-[#1d9b78]" />
                    تم إرسال تفاصيل الطلب إلى بريدك الإلكتروني
                  </>
                ) : (
                  <span style={{ fontFamily: "'Nunito', sans-serif", letterSpacing: "0.01em" }}>
                    powered by <span className="font-extrabold text-[#536d7a]">RePay</span>
                  </span>
                )}
              </div>
            </div>

            <div className="pointer-events-none mx-auto mt-[10px] h-[4px] w-[106px] rounded-full bg-[#172435]" />
          </div>

          {isSuccess && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f8faf9]/95 px-[31px] backdrop-blur-[3px]">
              <div className="w-full rounded-[25px] border border-[#d9ede6] bg-white px-[21px] py-[25px] text-center shadow-[0_18px_40px_rgba(20,77,69,.12)]">
                <div className="mx-auto flex h-[55px] w-[55px] items-center justify-center rounded-full bg-[#dff5ed] text-[#1d9b78]">
                  <ReceiptText size={28} strokeWidth={1.8} />
                </div>
                <p className="mt-[15px] text-[20px] font-bold tracking-[-0.055em] text-[#172435]">تم تأكيد طلبك</p>
                <p className="mx-auto mt-[7px] max-w-[210px] text-[11px] leading-[1.45] text-[#7b8e94]">
                    تم دفع <RiyalAmount className="text-[11px] font-bold" /> بنجاح عبر{" "}
                    {selectedMethod === "repay" ? <RepayWord /> : selectedPayment?.title}
                </p>
                <button
                  type="button"
                  onClick={handlePayment}
                  className="mt-[19px] flex h-[43px] w-full items-center justify-center gap-2 rounded-[13px] bg-[#172435] text-[12px] font-bold text-white transition-colors hover:bg-[#26394b] active:scale-[.985]"
                >
                  العودة للمتجر
                </button>
              </div>
            </div>
          )}

          {checkoutState === "browser" && (
            <BrowserPaymentPage
              onContinue={() => setCheckoutState("otp")}
              onClose={() => setCheckoutState("ready")}
            />
          )}

          {checkoutState === "otp" && (
            <OtpVerificationPage
              onVerify={() => setCheckoutState("payment")}
              onClose={() => setCheckoutState("browser")}
            />
          )}

          {checkoutState === "payment" && (
            <PaymentAuthorizationPage
              onPay={(bank) => {
                setSelectedBankForPage(bank);
                setCheckoutState("bank");
              }}
              onClose={() => setCheckoutState("otp")}
            />
          )}

          {checkoutState === "bank" && selectedBankForPage && (
            <BankPaymentPage
              bank={selectedBankForPage}
              onComplete={() => setCheckoutState("bankSuccess")}
            />
          )}
          {checkoutState === "bankSuccess" && selectedBankForPage && (
            <BankPaymentSuccessPage
              onBack={() => setCheckoutState("ready")}
            />
          )}
        </div>
      </section>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&family=Rubik:wght@400;500;600;700;800&display=swap');
        @keyframes repay-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

export default RepayCheckout;