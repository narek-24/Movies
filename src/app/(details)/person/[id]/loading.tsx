import ScrollTop from "@/components/scrolltop";
import { SkeletonCarousel } from "@/components/ui/carousel";

export default async function PersonDetailsLoadingPage() {
  return (
    <>
      <ScrollTop />
      <section className="relative py-16 md:pt-18 lg:pb-24">
        <div className="to-background absolute inset-0 -z-20 bg-linear-to-r from-slate-600 to-gray-500 opacity-6 dark:opacity-10"></div>
        <div className="to-background absolute inset-0 -z-10 bg-linear-to-b from-transparent via-transparent"></div>

        <div className="container">
          <div className="skeleton mt-1 mb-4 h-7 w-60 rounded"></div>
          <div className="skeleton mb-4 h-4 w-72 rounded sm:w-96"></div>
        </div>
      </section>

      <section className="container mb-16 flex flex-col gap-12 md:flex-row-reverse lg:gap-16">
        <div className="shrink-0 md:w-[270px]">
          <div className="skeleton mx-auto h-[405px] w-[270px] rounded"></div>

          <div className="grid grid-cols-2 gap-3">
            <div className="skeleton h-8 rounded-full"></div>
          </div>
        </div>

        <div className="max-w-full min-w-0 space-y-8 md:grow md:space-y-12">
          <div className="max-w-3xl">
            <div className="skeleton mb-5 h-7 w-32 rounded"></div>
            <div className="space-y-2">
              <div className="skeleton h-5 rounded"></div>
              <div className="skeleton h-5 rounded"></div>
              <div className="skeleton h-5 rounded"></div>
              <div className="skeleton h-5 rounded"></div>
              <div className="skeleton h-5 rounded"></div>
              <div className="skeleton h-5 w-1/2 rounded"></div>
            </div>
          </div>

          <div className="lg:-mt-1">
            <div className="skeleton mb-3 h-7 w-28 rounded"></div>
            <SkeletonCarousel />
          </div>
        </div>
      </section>
    </>
  );
}
