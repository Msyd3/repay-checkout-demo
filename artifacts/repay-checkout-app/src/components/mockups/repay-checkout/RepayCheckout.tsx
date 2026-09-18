import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CreditCard,
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
  | "mobile"
  | "payment"
  | "bank"
  | "bankSuccess";
type PaymentMethod = "repay" | "applePay";

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}images/${filename}`;
const repayBrowserLogo = assetUrl("repay-checkout-logo.png");
const sarSymbol = assetUrl("repay-checkout-sar.svg");

const paymentMethods: PaymentMethod[] = ["repay", "applePay"];

const paymentButtonThemes: Record<
  PaymentMethod,
  { background: string; hover: string; shadow: string; label: string }
> = {
  repay: {
    background: "bg-[#108bef]",
    hover: "hover:bg-[#087bd8]",
    shadow: "shadow-[0_9px_20px_rgba(16,139,239,.27)]",
    label: "Pay with RePay",
  },
  applePay: {
    background: "bg-[#222b35]",
    hover: "hover:bg-[#121922]",
    shadow: "shadow-[0_9px_20px_rgba(34,43,53,.23)]",
    label: "Pay with Apple Pay",
  },
};

function toEnglishDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776));
}

function RiyalAmount({
  className = "",
  value = "349",
}: {
  className?: string;
  value?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-[5px] ${className}`}
      dir="ltr"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <span
        role="img"
        aria-label="ريال سعودي"
        className="inline-block h-[1.05em] w-[0.95em] shrink-0 bg-current"
        style={{
          maskImage: `url(${sarSymbol})`,
          WebkitMaskImage: `url(${sarSymbol})`,
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
      />
      <span>{value}</span>
    </span>
  );
}

function BrowserPaymentPage({
  onPay,
  onOtherPay,
  onClose,
}: {
  onPay: (bank: BankOption) => void;
  onOtherPay: () => void;
  onClose: () => void;
}) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<"bank" | "other">("bank");
  const normalizedMobileNumber = mobileNumber.replace(/\D/g, "");
  const canContinue = /^05\d{8}$/.test(normalizedMobileNumber);
  const canVerify = /^\d{6}$/.test(verificationCode);
  const canSubmitPayment =
    selectedPaymentOption === "other" || (selectedPaymentOption === "bank" && Boolean(selectedBank));
  const isPrimaryButtonEnabled = isVerified ? canSubmitPayment : canContinue && canVerify;

  const handleMobileChange = (value: string) => {
    const digitsOnly = toEnglishDigits(value).replace(/\D/g, "").slice(0, 10);
    setMobileNumber(digitsOnly);
    setVerificationCode("");
  };

  const handleCodeChange = (value: string) => {
    setVerificationCode(toEnglishDigits(value).replace(/\D/g, "").slice(0, 6));
  };

  const handlePrimaryAction = () => {
    if (!isVerified) {
      if (canContinue && canVerify) {
        setIsVerified(true);
      }
      return;
    }

    if (selectedPaymentOption === "other") {
      onOtherPay();
      return;
    }

    const bank = bankOptions.find((option) => option.id === selectedBank);
    if (bank) {
      onPay(bank);
    }
  };

  return (
    <div
      dir="rtl"
      className="absolute inset-0 z-30 overflow-hidden bg-white text-[#102b45]"
      style={{
        fontFamily: "'Rubik', 'DM Sans', sans-serif",
      }}
    >
      <div className="flex h-full flex-col pt-[18px]">
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
            <div className="flex flex-col items-center gap-[8px] text-center" dir="rtl">
              <img
                src={repayBrowserLogo}
                alt="Repay"
                className="h-[52px] w-[52px] rounded-[15px] object-contain"
              />
            </div>

            {isVerified ? (
              <div className="flex flex-1 flex-col pt-[18px]">
                <div className="rounded-[17px] border border-[#d2d2d2] bg-white px-[14px] py-[13px] shadow-[0_5px_16px_rgba(20,42,54,.05)]">
                  <div className="flex items-center gap-[10px]">
                    <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#eef8ff] text-[#008cff]">
                      <Check size={18} strokeWidth={2.7} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] font-bold text-[#4d7794]">تم التحقق من رقم الجوال</p>
                      <p
                        dir="ltr"
                        className="mt-[3px] truncate text-left text-[14px] font-bold text-[#102b45]"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                      >
                        {mobileNumber}
                      </p>
                    </div>
                  </div>
                </div>

                <InlinePaymentOptions
                  selectedBank={selectedBank}
                  selectedOption={selectedPaymentOption}
                  onSelectBank={(bankId) => {
                    setSelectedPaymentOption("bank");
                    setSelectedBank(bankId);
                  }}
                  onSelectOther={() => {
                    setSelectedPaymentOption("other");
                    setSelectedBank(null);
                  }}
                />
              </div>
            ) : (
            <div className="flex flex-1 flex-col justify-center">
            <div className="text-right">
              <p className="text-[10px] font-semibold text-[#4d7794]">إتمام الدفع</p>
              <h2 className="mt-[6px] text-[22px] font-bold leading-[1.15] tracking-[-0.06em] text-[#102b45]">
                دفع أسرع. أينما كنت
              </h2>
              <p className="mt-[8px] text-[11px] leading-[1.5] text-[#5e7f95]">
                تجربة دفع واحدة، بسيط، سريع وآمن
              </p>
            </div>
            <div className="mt-[22px] rounded-[17px] border border-[#d2d2d2] bg-white px-[14px] py-[13px] shadow-[0_5px_16px_rgba(20,42,54,.05)]">
            <div className="flex items-center gap-[9px]">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-white text-[#008cff]">
                <Smartphone size={17} strokeWidth={1.9} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#4d7794]">رقم الجوال</p>
                <p className="mt-[4px] text-[13px] font-bold text-[#102b45]">أدخل رقم جوالك</p>
              </div>
            </div>
            <div className="mt-[12px] flex h-[46px] items-center overflow-hidden rounded-[12px] border border-[#c8c8c8] bg-white" dir="ltr">
              <input
                aria-label="رقم الجوال"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                lang="en"
                dir="ltr"
                value={mobileNumber}
                onChange={(event) => handleMobileChange(event.target.value)}
                placeholder="05X XXX XXXX"
                className="h-full min-w-0 flex-1 bg-transparent px-[12px] text-[15px] font-bold tracking-[0.04em] text-[#102b45] outline-none placeholder:font-medium placeholder:text-[#8eaabd]"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              />
            </div>
            <div className="mt-[10px] flex items-center gap-[6px] text-[9px] text-[#2775a8]">
              <LockKeyhole size={12} strokeWidth={1.9} />
              <span>سيصلك رمز تحقق آمن على جوالك</span>
            </div>
            {canContinue && (
              <div className="mt-[14px] border-t border-[#dddddd] pt-[13px]">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-bold text-[#4d7794]">رمز التحقق</span>
                  <span className="text-[#7b96a5]">
                    أرسلنا رمزًا إلى{" "}
                    <span dir="ltr" className="font-bold" style={{ fontFamily: "'Nunito', sans-serif" }}>
                      {mobileNumber}
                    </span>
                  </span>
                </div>
                <input
                  aria-label="رمز التحقق"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  lang="en"
                  dir="ltr"
                  value={verificationCode}
                  onChange={(event) => handleCodeChange(event.target.value)}
                  placeholder="••••••"
                  className="mt-[9px] h-[45px] w-full rounded-[11px] border border-[#c8c8c8] bg-[#fbfdff] text-center text-[20px] font-bold tracking-[0.32em] text-[#102b45] outline-none placeholder:text-[#b5cad7] focus:border-[#008cff] focus:ring-2 focus:ring-[#008cff]/10"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                />
                <div className="mt-[6px] flex items-center justify-between text-[9px]">
                  <span className="text-[#7791a2]" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    {verificationCode.length} / 6
                  </span>
                  <span className="text-[#2775a8]">أدخل الرمز لإكمال الدفع</span>
                </div>
              </div>
            )}
            </div>

            </div>
            )}

            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={!isPrimaryButtonEnabled}
              className={`mt-[14px] flex h-[49px] w-full shrink-0 items-center justify-center rounded-[15px] bg-[#008cff] text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(0,140,255,.24)] transition-all ${
                isPrimaryButtonEnabled
                  ? "hover:bg-[#0079db] active:scale-[.985]"
                  : "cursor-not-allowed"
              }`}
            >
              <span
                className={`inline-flex items-center gap-[8px] transition-opacity ${
                  isPrimaryButtonEnabled ? "opacity-100" : "opacity-45"
                }`}
              >
                <span>{!isVerified && canVerify ? "تأكيد الدفع" : "متابعة الدفع"}</span>
                <RiyalAmount className="text-[13px] font-bold text-white" />
              </span>
            </button>

            <p className="mt-[13px] text-center text-[9px] leading-[1.45] text-[#6d8ba0]">
              بالمتابعة، أنت توافق على إتمام الدفع عبر حسابك في RePay
            </p>
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
      <div className="flex h-full flex-col pt-[18px]">
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
            <div className="mt-[25px] rounded-[17px] border border-[#d2d2d2] bg-white px-[14px] py-[15px] shadow-[0_5px_16px_rgba(20,42,54,.05)]">
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
              className="mt-[16px] h-[56px] w-full rounded-[13px] border border-[#c8c8c8] bg-[#fbfdff] text-center text-[24px] font-bold tracking-[0.34em] text-[#102b45] outline-none transition-colors placeholder:text-[#b5b5b5] focus:border-[#008cff] focus:ring-2 focus:ring-[#008cff]/10"
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
                : "cursor-not-allowed bg-[#b8b8b8]"
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

function InlinePaymentOptions({
  selectedBank,
  selectedOption,
  onSelectBank,
  onSelectOther,
}: {
  selectedBank: string | null;
  selectedOption: "bank" | "other";
  onSelectBank: (bankId: string) => void;
  onSelectOther: () => void;
}) {
  return (
    <div className="mt-[12px] rounded-[17px] border border-[#d2d2d2] bg-white px-[12px] pb-[13px] pt-[14px] shadow-[0_5px_16px_rgba(20,42,54,.05)]">
      <div className="text-right">
        <p className="text-[15px] font-bold tracking-[-0.04em] text-[#102b45]">اختر طريقة الدفع</p>
        <p className="mt-[4px] text-[9px] leading-[1.45] text-[#7892a0]">
          اختر طريقة الدفع الخاصة بك أو ادفع مباشرة من حسابك
        </p>
      </div>

      <div className="mt-[12px] flex max-h-[245px] flex-col gap-[7px] overflow-y-auto pb-[2px]" dir="rtl">
        <button
          type="button"
          aria-pressed={selectedOption === "other"}
          onClick={onSelectOther}
          className={`flex min-h-[46px] w-full shrink-0 items-center justify-center rounded-[12px] border text-[11px] font-bold transition-colors active:scale-[.985] ${
            selectedOption === "other"
              ? "border-[#111820] bg-[#111820] text-white"
              : "border-[#d2d2d2] bg-white text-[#19344a] hover:bg-[#fafafa]"
          }`}
        >
          طرق دفع أخرى
        </button>

        {bankOptions.map((bank) => {
          const isSelected = bank.id === selectedBank;

          return (
            <button
              key={bank.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectBank(bank.id)}
              className={`flex min-h-[49px] w-full shrink-0 items-center gap-[8px] rounded-[12px] border px-[9px] text-right transition-colors active:scale-[.985] ${
                isSelected
                  ? "border-[#008cff] bg-[#f1f8ff]"
                  : "border-[#d2d2d2] bg-white hover:bg-[#fafafa]"
              }`}
            >
              <span
                className="h-[27px] w-[27px] shrink-0 rounded-[8px]"
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

    </div>
  );
}

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
        <div className="flex flex-1 flex-col items-center justify-center px-[26px] pb-[56px] pt-[20px] text-center">
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
      className="absolute inset-0 z-50 overflow-hidden bg-[#008cff] text-white"
      style={{
        fontFamily: "'Rubik', 'DM Sans', sans-serif",
      }}
    >
      <div className="flex h-full flex-col px-[26px]">
        <div className="flex flex-1 flex-col items-center pt-[88px] text-center">
          <div
            className="flex h-[116px] w-[116px] items-center justify-center rounded-full border-2 border-white/40 bg-white/15 text-white"
            aria-hidden="true"
          >
            <Check size={58} strokeWidth={2.5} />
          </div>
          <p className="mt-[28px] max-w-[285px] text-[19px] font-bold leading-[1.4] tracking-[-0.055em] text-white">
            تمت معالجة عملية الدفع بنجاح
          </p>
          <RiyalAmount className="mt-[16px] text-[54px] font-extrabold leading-none tracking-[-0.08em] text-white" />
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mb-[22px] flex h-[51px] w-full shrink-0 items-center justify-center rounded-[15px] bg-white text-[13px] font-bold text-[#008cff] shadow-[0_10px_24px_rgba(0,70,130,.18)] transition-colors hover:bg-[#f4faff] active:scale-[.985]"
        >
          عودة
        </button>

        <div className="pointer-events-none mx-auto mb-[10px] h-[4px] w-[106px] shrink-0 rounded-full bg-white" />
      </div>
    </div>
  );
}

function PaymentAuthorizationPage({
  onPay,
  onOtherPay,
  onClose,
}: {
  onPay: (bank: BankOption) => void;
  onOtherPay: () => void;
  onClose: () => void;
}) {
  const [isBankSheetOpen, setIsBankSheetOpen] = useState(true);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedSheetOption, setSelectedSheetOption] = useState<"bank" | "other">("bank");

  return (
    <div
      dir="rtl"
      className="absolute inset-0 z-30 overflow-hidden bg-[#fafafa] text-[#102b45]"
      style={{ fontFamily: "'Rubik', 'DM Sans', sans-serif" }}
    >
      <div className="flex h-full flex-col">
        {/* Top Action */}
        <div className="flex shrink-0 items-center justify-end px-[18px] pt-[24px]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-[#102b45] transition-colors hover:bg-[#e4e4e4] active:scale-[.97]"
            aria-label="إغلاق"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden px-[22px] pb-[92px] pt-[18px]">
          {/* Products List */}
          <div className="flex flex-col gap-[18px]">
            {/* Item 1 */}
            <div className="flex items-center gap-[14px]">
              <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[15px] bg-[#f5ecdf] flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="h-[34px] w-[56px] rounded-[6px] bg-[#1a1a1a] shadow-sm relative">
                  <div className="absolute top-[4px] left-[4px] w-[18px] h-[26px] bg-[#2a2a2a] rounded-[4px]" />
                  <div className="absolute top-[4px] right-[4px] w-[18px] h-[26px] bg-[#2a2a2a] rounded-[4px]" />
                </div>
              </div>
              <div className="flex flex-col justify-center flex-1">
                <p className="text-[14px] font-semibold text-[#102b45]">نظارة شمسية</p>
                <p className="mt-[2px] text-[11px] text-[#6d8ba0]">أسود</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-[14px]">
              <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[15px] bg-[#f5ecdf] flex items-center justify-center relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="h-[46px] w-[60px] rounded-t-[14px] rounded-b-[6px] bg-white shadow-sm border border-[#e4dcc8] relative overflow-hidden flex flex-col justify-end">
                   <div className="absolute top-[10px] left-[6px] right-[6px] h-[8px] bg-[#f5d96e] rounded-sm" />
                   <div className="w-full h-[14px] bg-[#e3e6e8]" />
                </div>
              </div>
              <div className="flex flex-col justify-center flex-1">
                <p className="text-[14px] font-semibold text-[#102b45]">حذاء رياضي</p>
                <p className="mt-[2px] text-[11px] text-[#6d8ba0]">مقاس ٧</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Action Area */}
        <div className="absolute bottom-0 left-0 right-0 px-[22px] pb-[28px] pt-[20px] bg-gradient-to-t from-[#fafafa] via-[#fafafa] to-transparent pointer-events-none">
          <div className="pointer-events-auto">
            <div className="mb-[14px] flex flex-col gap-[8px] text-[12px]">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#102b45]">المجموع الفرعي</span>
                <RiyalAmount
                  value="303.48"
                  className="text-[12px] font-semibold text-[#102b45]"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#102b45]">الشحن</span>
                <span className="font-semibold text-[#102b45]">مجاني</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#102b45]">الضريبة</span>
                <RiyalAmount
                  value="45.52"
                  className="text-[12px] font-semibold text-[#102b45]"
                />
              </div>
              <div className="mt-[5px] flex items-center justify-between pt-[4px]">
                <span className="text-[17px] font-bold text-[#102b45]">المجموع</span>
                <RiyalAmount
                  value="349.00"
                  className="text-[19px] font-extrabold text-[#102b45]"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedBank(null);
                setSelectedSheetOption("bank");
                setIsBankSheetOpen(true);
              }}
              className="flex h-[52px] w-full items-center justify-center rounded-[26px] bg-[#008cff] text-[22px] font-extrabold text-white transition-transform active:scale-[.97] shadow-[0_8px_24px_rgba(0,140,255,.25)] hover:bg-[#007cdb]"
              style={{ fontFamily: "'Nunito', sans-serif", letterSpacing: "-0.03em" }}
            >
              RePay
            </button>
          </div>
        </div>

        {/* Bank Sheet */}
        {isBankSheetOpen && (
          <div
            className="absolute inset-0 z-40 flex items-end bg-[#102b45]/30 transition-opacity"
            role="dialog"
            aria-modal="true"
            aria-label="اختيار البنك"
          >
            <div className="w-full rounded-t-[26px] border-t border-[#d8e7ed] bg-white px-[18px] pb-[34px] pt-[10px] shadow-[0_-12px_34px_rgba(16,43,69,.18)] animate-in slide-in-from-bottom-full duration-300">
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
                  <p className="text-[17px] font-bold tracking-[-0.045em] text-[#102b45]">اختر طريقة الدفع</p>
                  <p className="mt-[4px] text-[10px] text-[#7892a0]">اختر طريقة الدفع الخاصة بك أو ادفع مباشرة من حسابك</p>
                </div>
              </div>

              <div className="mt-[14px] flex max-h-[274px] flex-col gap-[8px] overflow-y-auto pb-[2px]" dir="rtl">
                <button
                  type="button"
                  aria-pressed={selectedSheetOption === "other"}
                  onClick={() => {
                    setSelectedSheetOption("other");
                    setSelectedBank(null);
                  }}
                  className={`flex min-h-[48px] w-full shrink-0 items-center justify-center rounded-[13px] border text-[12px] font-bold transition-colors active:scale-[.985] ${
                    selectedSheetOption === "other"
                      ? "border-[#111820] bg-[#111820] text-white"
                      : "border-[#dce8ed] bg-white text-[#19344a] hover:border-[#b9d2df] hover:bg-[#fbfdff]"
                  }`}
                >
                  طرق دفع أخرى
                </button>

                {bankOptions.map((bank) => {
                  const isSelected = bank.id === selectedBank;

                  return (
                    <button
                      key={bank.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelectedSheetOption("bank");
                        setSelectedBank(bank.id);
                      }}
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
                disabled={!selectedBank && selectedSheetOption !== "other"}
                onClick={() => {
                  if (selectedSheetOption === "other") {
                    setIsBankSheetOpen(false);
                    onOtherPay();
                    return;
                  }

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
                  selectedSheetOption === "other"
                    ? "bg-[#111820] shadow-[0_9px_20px_rgba(17,24,32,.20)] hover:bg-[#1b2630]"
                    : selectedBank
                    ? "bg-[#008cff] shadow-[0_9px_20px_rgba(0,140,255,.20)] hover:bg-[#0079db]"
                    : "cursor-not-allowed bg-[#b8b8b8]"
                }`}
              >
                {selectedSheetOption === "other" ? "Apple Pay" : "متابعة الدفع"}
              </button>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute bottom-[10px] left-1/2 -translate-x-1/2 h-[4px] w-[106px] rounded-full bg-[#172435] z-50" />
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
    if (checkoutState === "success") {
      setCheckoutState("ready");
      setSelectedMethod("repay");
      return;
    }

    if (checkoutState !== "ready") {
      return;
    }

    if (selectedMethod === "applePay") {
      setCheckoutState("success");
    } else if (selectedMethod === "repay") {
      setCheckoutState("mobile");
    }
  };

  const isProcessing = checkoutState === "processing";
  const isSuccess = checkoutState === "success";
  const selectedButtonTheme = paymentButtonThemes[selectedMethod];

  return (
    <main
      dir="rtl"
      className="relative min-h-[100dvh] overflow-hidden bg-[#f8faf9]"
      style={{
        fontFamily: "'Rubik', 'DM Sans', sans-serif",
      }}
    >
      <section
        className="relative mx-auto min-h-[100dvh] w-full max-w-[390px] overflow-hidden bg-[#f8faf9] text-[#172435]"
        aria-label="صفحة دفع Repay"
      >
        <div className="relative min-h-[100dvh] overflow-hidden bg-[#f8faf9] text-[#172435]">
          <div className="relative flex min-h-[100dvh] flex-col px-[19px] pb-[18px] pt-[24px]">

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
                </div>
                <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[9px] bg-white text-[#4f7d87]">
                  <ReceiptText size={16} strokeWidth={1.8} />
                </div>
              </div>
              <div className="mt-[9px] grid grid-cols-2 gap-[7px]">
                <div className="flex min-w-0 items-center gap-[6px] rounded-[10px] bg-white/75 px-[6px] py-[6px]">
                  <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[7px] bg-[#f5ecdf]">
                    <div className="h-[12px] w-[21px] rounded-[3px] bg-[#1a1a1a]" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[8px] font-bold text-[#172435]">نظارة شمسية</p>
                    <p className="mt-[1px] text-[7px] text-[#819198]">أسود</p>
                  </div>
                </div>
                <div className="flex min-w-0 items-center gap-[6px] rounded-[10px] bg-white/75 px-[6px] py-[6px]">
                  <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[7px] bg-[#f5ecdf]">
                    <div className="h-[16px] w-[21px] rounded-t-[5px] rounded-b-[2px] border border-[#e4dcc8] bg-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[8px] font-bold text-[#172435]">حذاء رياضي</p>
                    <p className="mt-[1px] text-[7px] text-[#819198]">مقاس ٧</p>
                  </div>
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

              <div className="mt-[10px] grid grid-cols-2 gap-[8px]">
                {paymentMethods.map((method) => {
                  const isSelected = method === selectedMethod;
                  const isRepay = method === "repay";

                  return (
                    <button
                      key={method}
                      type="button"
                      aria-pressed={isSelected}
                      disabled={isProcessing}
                      onClick={() => setSelectedMethod(method)}
                      className={`flex min-w-0 w-full items-center justify-center rounded-[15px] border-0 px-[8px] py-[19px] text-center text-[13px] font-bold text-white transition-all duration-200 ${
                        isRepay
                          ? "bg-[#108bef] shadow-[0_9px_20px_rgba(16,139,239,.27)] hover:bg-[#087bd8]"
                          : "bg-[#000000] shadow-[0_9px_20px_rgba(0,0,0,.22)] hover:bg-[#171717]"
                      } ${isSelected ? "ring-2 ring-[#172435] ring-offset-2" : "opacity-85"} active:scale-[.985]`}
                    >
                      {isRepay ? "Pay with RePay" : "Apple Pay"}
                    </button>
                  );
                })}
              </div>

              <div className="mt-[10px] text-left" dir="ltr">
                <p dir="rtl" className="mb-[6px] px-[2px] text-right text-[12px] font-medium text-[#536d7a]">معلومات البطاقة</p>
                <div className="overflow-hidden rounded-[13px] border border-[#d8d8d8] bg-white shadow-[0_2px_5px_rgba(20,42,54,.06)]">
                  <div className="flex h-[54px] items-center gap-[8px] px-[12px]">
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 1234 1234 1234"
                      aria-label="Card number"
                      className="min-w-0 flex-1 bg-transparent text-[15px] text-[#3d4850] outline-none placeholder:text-[#899096]"
                    />
                    <div className="flex shrink-0 items-center gap-[4px]">
                      <span className="flex h-[23px] w-[30px] items-center justify-center rounded-[3px] border border-[#d9d9d9] text-[9px] font-extrabold italic text-[#243fa8]">
                        VISA
                      </span>
                      <span className="flex h-[23px] w-[30px] items-center justify-center rounded-[3px] bg-[#212121] text-[9px] font-bold text-white">
                        <span className="mr-[-3px] h-[13px] w-[13px] rounded-full bg-[#ea3323]" />
                        <span className="ml-[-3px] h-[13px] w-[13px] rounded-full bg-[#f5a623]" />
                      </span>
                      <span className="flex h-[23px] w-[30px] items-center justify-center rounded-[3px] bg-[#2574b9] text-[7px] font-bold text-white">
                        AM<br />EX
                      </span>
                      <span className="flex h-[23px] w-[30px] items-center justify-center rounded-[3px] border border-[#d9d9d9] text-[16px] font-bold text-[#2474ac]">
                        ◉
                      </span>
                    </div>
                  </div>
                  <div className="grid h-[58px] grid-cols-2 border-t border-[#e1e1e1]">
                    <label className="flex items-center border-r border-[#e1e1e1] px-[12px]">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM / YY"
                        aria-label="Expiration date"
                        className="w-full bg-transparent text-[15px] text-[#3d4850] outline-none placeholder:text-[#899096]"
                      />
                    </label>
                    <label className="flex items-center gap-[8px] px-[12px]">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="CVC"
                        aria-label="CVC"
                        className="min-w-0 flex-1 bg-transparent text-[15px] text-[#3d4850] outline-none placeholder:text-[#899096]"
                      />
                      <CreditCard size={25} strokeWidth={1.6} className="shrink-0 text-[#30363a]" />
                    </label>
                  </div>
                </div>
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
                disabled={isProcessing || selectedMethod === "applePay"}
                onClick={handlePayment}
                className={`group relative flex h-[51px] w-full items-center justify-center overflow-hidden rounded-[16px] text-[13px] font-bold tracking-[-0.02em] transition-all duration-300 ${
                  selectedMethod === "applePay" && !isSuccess
                    ? "cursor-not-allowed bg-[#d6dce0] text-[#8a959b] shadow-none"
                    : isSuccess
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
                      {selectedButtonTheme.label}
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

          {isSuccess && <BankPaymentSuccessPage onBack={handlePayment} />}

          {checkoutState === "mobile" && (
            <BrowserPaymentPage
              onPay={(bank) => {
                setSelectedBankForPage(bank);
                setCheckoutState("bank");
              }}
              onOtherPay={() => {
                setSelectedMethod("applePay");
                setCheckoutState("success");
              }}
              onClose={() => setCheckoutState("ready")}
            />
          )}

          {checkoutState === "payment" && (
            <PaymentAuthorizationPage
              onPay={(bank) => {
                setSelectedBankForPage(bank);
                setCheckoutState("bank");
              }}
              onOtherPay={() => {
                setSelectedMethod("applePay");
                setCheckoutState("success");
              }}
              onClose={() => setCheckoutState("ready")}
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