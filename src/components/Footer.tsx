import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <Link href="/videos">ملاحظات المختبر</Link>
        <Link href="/resources">مصادر</Link>
        <a href="https://www.youtube.com/channel/UClnq0KE_pVQ27O3iT1ZriUg" target="_blank" rel="noopener">
          يوتيوب
        </a>
      </div>
    </footer>
  );
}
