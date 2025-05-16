import Image from 'next/image';

export default function BannerSection() {
  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <Image
            src="/img/banner/banner-1.jpg"
            alt="Banner 1"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <Image
            src="/img/banner/banner-2.jpg"
            alt="Banner 2"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
}
