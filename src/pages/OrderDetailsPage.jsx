import {
  Check,
  Clock,
  ChefHat,
  Utensils,
  MapPin,
  Receipt,
  CreditCard,
  Heart,
} from "lucide-react";

export default function OrderDetailsPage() {
  /*
   * Demo order timeline.
   *
   * Later these values can come from your backend:
   * order.createdAt
   * order.preparationStartedAt
   * order.goingToServeAt
   * order.reachedAt
   * order.billRaisedAt
   * order.billedAt
   */

  const orderTimeline = [
    {
      id: 1,
      title: "Order Received",
      description: "Your order has been received successfully.",
      time: "12:42 PM",
      icon: Check,
      status: "completed",
    },
    {
      id: 2,
      title: "Food Preparation",
      description: "The kitchen has started preparing your food.",
      time: "12:45 PM",
      icon: ChefHat,
      status: "completed",
    },
    {
      id: 3,
      title: "Going to Serve",
      description: "Your food is ready and is on its way to your table.",
      time: "1:02 PM",
      icon: Utensils,
      status: "completed",
    },
    {
      id: 4,
      title: "Reached",
      description: "Your food has reached your table.",
      time: "1:05 PM",
      icon: MapPin,
      status: "completed",
    },
    {
      id: 5,
      title: "Bill Raised",
      description: "Your bill has been generated.",
      time: "1:35 PM",
      icon: Receipt,
      status: "completed",
    },
    {
      id: 6,
      title: "Billed",
      description: "Payment has been successfully completed.",
      time: "1:38 PM",
      icon: CreditCard,
      status: "completed",
    },
  ];

  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-900">

      {/* =================================
          HEADER
      ================================== */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[88px] w-full max-w-3xl items-center px-5 sm:px-8">

          <button
            type="button"
            onClick={() => window.history.back()}
            aria-label="Go back"
            className="
              mr-5
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              text-2xl
              transition
              hover:bg-slate-100
              active:scale-95
            "
          >
            ←
          </button>

          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Order Details
            </h1>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Order #GA1024 · Table #12
            </p>
          </div>

        </div>
      </header>

      {/* =================================
          MAIN
      ================================== */}
      <main
        className="
          mx-auto
          w-full
          max-w-3xl
          px-4
          pb-10
          pt-6
          sm:px-8
          sm:pt-8
        "
      >

        {/* =================================
            ORDER SUMMARY
        ================================== */}
        <section
          className="
            rounded-3xl
            bg-white
            p-5
            shadow-sm
            sm:p-6
          "
        >
          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="text-sm text-slate-500">
                Order Total
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                ₹294.00
              </h2>
            </div>

            <div
              className="
                rounded-full
                bg-green-100
                px-3
                py-1.5
                text-xs
                font-bold
                text-green-700
              "
            >
              Billed
            </div>

          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">
                Items
              </p>

              <p className="mt-1 font-bold">
                1 item
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">
                Table
              </p>

              <p className="mt-1 font-bold">
                #12
              </p>
            </div>

          </div>
        </section>

        {/* =================================
            TIMELINE
        ================================== */}
        <section className="mt-8">

          <div className="mb-5">
            <h2 className="text-xl font-bold sm:text-2xl">
              Order Progress
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track your order from kitchen to table.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">

            <div className="relative">

              {orderTimeline.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === orderTimeline.length - 1;

                return (
                  <div
                    key={step.id}
                    className="relative flex gap-4 sm:gap-5"
                  >

                    {/* =================================
                        CONNECTING LINE
                    ================================== */}
                    {!isLast && (
                      <div
                        className="
                          absolute
                          left-[19px]
                          top-[42px]
                          h-[calc(100%-10px)]
                          w-[3px]
                          bg-green-500
                        "
                      />
                    )}

                    {/* =================================
                        ICON
                    ================================== */}
                    <div
                      className="
                        relative
                        z-10
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-green-500
                        text-white
                        shadow-sm
                      "
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* =================================
                        CONTENT
                    ================================== */}
                    <div
                      className={`
                        min-w-0
                        flex-1
                        ${isLast ? "pb-0" : "pb-8"}
                      `}
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                            {step.title}
                          </h3>

                          <p className="mt-1 text-sm leading-5 text-slate-500">
                            {step.description}
                          </p>

                        </div>

                        {/* TIME */}
                        <div
                          className="
                            flex
                            shrink-0
                            items-center
                            gap-1
                            text-xs
                            font-semibold
                            text-slate-500
                            sm:text-sm
                          "
                        >
                          <Clock className="h-3.5 w-3.5" />
                          {step.time}
                        </div>

                      </div>

                      {/* Completed badge */}
                      <div
                        className="
                          mt-2
                          inline-flex
                          items-center
                          gap-1
                          rounded-full
                          bg-green-50
                          px-2.5
                          py-1
                          text-[10px]
                          font-semibold
                          text-green-700
                        "
                      >
                        <Check className="h-3 w-3" />
                        Completed
                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>
        </section>

        {/* =================================
            THANK YOU
        ================================== */}
        <section
          className="
            mt-8
            rounded-3xl
            bg-[#244294]
            px-6
            py-8
            text-center
            text-white
            shadow-lg
            sm:px-8
            sm:py-10
          "
        >

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-white/15
            "
          >
            <Heart className="h-7 w-7 fill-white" />
          </div>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            Thank You!
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/80 sm:text-base">
            Thank you for dining with us. We hope you enjoyed
            your meal and had a wonderful experience.
          </p>

          <p className="mt-5 text-sm font-semibold text-white/90">
            Order completed at 1:38 PM
          </p>

        </section>

      </main>
    </div>
  );
}