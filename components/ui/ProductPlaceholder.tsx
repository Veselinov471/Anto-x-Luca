import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
};

export function ProductPhoto({ src, alt, priority = false }: Props) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-[#efece6]">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 33vw, 50vw"
        className="object-cover object-center transition duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  );
}
