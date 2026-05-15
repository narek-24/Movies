import ScrollTop from "@/components/scrolltop";

export default function DetailsLoading() {
  return (
    <>
      <ScrollTop />
      <section className="relative mb-8 pt-20 pb-20 md:mb-12 md:pt-28 md:pb-36">
        <div
          className="absolute inset-0 -z-10 bg-linear-to-b from-gray-700/15 to-transparent dark:from-white/7"
          aria-hidden
        ></div>

        <div className="container">
          {/* Title */}
          <div className="skeleton mt-1.5 mb-3 h-7.5 w-72 rounded"></div>

          {/* Tag */}
          <div className="skeleton mb-5 h-4 w-80 rounded md:w-96"></div>

          {/* Info */}
          <div className="skeleton mb-4 h-5 w-52 rounded"></div>

          {/* Genres */}
          <div className="mb-4.5 flex flex-wrap gap-2">
            <div className="skeleton h-[27px] w-24 rounded-full"></div>
            <div className="skeleton h-[27px] w-24 rounded-full"></div>
            <div className="skeleton h-[27px] w-24 rounded-full"></div>
          </div>
        </div>
      </section>

      <div className="space-y-12 lg:space-y-20">
        <div className="container flex flex-col gap-10 lg:flex-row-reverse lg:gap-16">
          <div className="shrink-0 lg:w-[300px]">
            <div className="skeleton h-[450px] w-[300px] rounded-xl max-lg:hidden"></div>

            <div className="lg:mt-6">
              <h3 className="skeleton mb-3 h-6 w-40 rounded lg:h-6"></h3>
              <ul className="text-muted-foreground flex flex-wrap gap-4 text-sm lg:flex-col lg:gap-3.5">
                <div className="skeleton h-3 w-32 rounded"></div>
                <div className="skeleton h-3 w-32 rounded"></div>
                <div className="skeleton h-3 w-32 rounded"></div>
                <div className="skeleton h-3 w-32 rounded"></div>
                <div className="skeleton h-3 w-32 rounded"></div>
              </ul>
            </div>
          </div>

          <div className="h-fit max-w-full min-w-0 grow space-y-10">
            <section>
              <div className="skeleton mb-4 h-6 w-40 rounded"></div>
              <div className="max-w-3xl space-y-2">
                <div className="skeleton h-5 w-full rounded"></div>
                <div className="skeleton h-5 w-full rounded"></div>
                <div className="skeleton h-5 w-full rounded"></div>
                <div className="skeleton h-5 w-2/3 rounded"></div>
              </div>
            </section>

            <section>
              <div className="skeleton mb-4 h-6 w-40 rounded"></div>
              <div className="skeleton aspect-video w-full rounded-xl"></div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
