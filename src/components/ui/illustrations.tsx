import { cn } from "@/lib/utils";

export function HangerIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      className={cn("h-28 w-36", className)}
      aria-hidden="true"
    >
      <path
        d="M80 16v13M80 29c-4.6 0-8 3.4-8 7.7 0 3.4 2 5.8 5 7l33.8 19.7c4.2 2.4 2.5 7.6-2.2 7.6H51.4c-4.7 0-6.4-5.2-2.2-7.6L83 43.7c3-1.2 5-3.6 5-7 0-4.3-3.4-7.7-8-7.7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M26 86h108" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M42 86v18M118 86v18M34 104h24M102 104h24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="126" cy="30" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M126 24v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ToteIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      className={cn("h-28 w-36", className)}
      aria-hidden="true"
    >
      <path
        d="M45 42h70l8 58a6 6 0 0 1-6 6.7H43a6 6 0 0 1-6-6.7l8-58Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M62 45V31a18 18 0 0 1 36 0v14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M56 63h48M56 78h30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M118 24v10M113 29h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function RackIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      className={cn("h-28 w-36", className)}
      aria-hidden="true"
    >
      <path d="M30 26v72M130 26v72M20 98h120" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 32h100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M52 33v22M74 33v30M96 33v18M118 33v26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M44 55h16l-3 27H47l-3-27ZM66 63h16l-3 28H69l-3-28ZM88 51h16l-3 25H91l-3-25ZM110 59h16l-3 26H113l-3-26Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M52 33a4 4 0 1 0-8 0" stroke="currentColor" strokeWidth="1.5" />
      <path d="M74 33a4 4 0 1 0-8 0" stroke="currentColor" strokeWidth="1.5" />
      <path d="M96 33a4 4 0 1 0-8 0" stroke="currentColor" strokeWidth="1.5" />
      <path d="M118 33a4 4 0 1 0-8 0" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function SearchIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      className={cn("h-28 w-36", className)}
      aria-hidden="true"
    >
      <circle cx="70" cy="52" r="29" stroke="currentColor" strokeWidth="1.5" />
      <path d="m91 73 25 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M56 46c3-7 10-11 18-10M44 66c4 5 10 8 17 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".7"
      />
      <path d="M126 26v10M121 31h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BoxIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      className={cn("h-28 w-36", className)}
      aria-hidden="true"
    >
      <path d="m40 46 40-18 40 18v44l-40 18-40-18V46Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M40 46 80 64l40-18M80 64v44" stroke="currentColor" strokeWidth="1.5" />
      <path d="m60 37 40 18v18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M24 82h16M120 34h16M132 28v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
