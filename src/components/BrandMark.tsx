import Link from "next/link";

export function BrandMark() {
  return (
    <Link href="/" className="brandMark" aria-label="PNGtoSTL home">
      <img
        className="brandMarkIcon"
        src="/favicon.ico"
        alt="PNGtoSTL logo"
        width={27}
        height={27}
        decoding="async"
      />
      <span>
        <strong>PNGtoSTL</strong>
        <small>Image to STL workspace</small>
      </span>
    </Link>
  );
}
