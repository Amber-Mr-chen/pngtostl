import Image from "next/image";
import Link from "next/link";

export function BrandMark() {
  return (
    <Link href="/" className="brandMark" aria-label="PNGtoSTL home">
      <Image
        className="brandMarkIcon"
        src="/icon-192.png"
        alt="PNGtoSTL logo"
        width={27}
        height={27}
      />
      PNGtoSTL
    </Link>
  );
}
