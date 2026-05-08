import { useRef } from "react";
import { useEffect, useState } from "react";

import type { Banner } from "@/types/banner";
import type { Services } from "@/types/services";
import api from "@/services/axios";
import MainLayout from "@/components/layout/MainLayout";

import ProfileSection from "@/components/section/ProfileSection";
import { Link } from "react-router-dom";
import LoadingSkeleton from "@/components/LoadingSkeleteon";

const HomePage = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown = true;
    startX = e.pageX - sliderRef.current!.offsetLeft;
    scrollLeft = sliderRef.current!.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown = false;
  };

  const handleMouseUp = () => {
    isDown = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;

    e.preventDefault();
    const x = e.pageX - sliderRef.current!.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current!.scrollLeft = scrollLeft - walk;
  };

  const [banners, setBanners] = useState<Banner[]>([]);
  const [services, setServices] = useState<Services[]>([]);
  const [isLoading, setIsloading] = useState(false);

  const getBanner = async () => {
    try {
      const response = await api.get("/banner");

      setBanners(response.data.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getServices = async () => {
    setIsloading(true);
    try {
      const response = await api.get("/services");

      setServices(response.data.data);
      setIsloading(false);
    } catch (error: any) {
      console.log(error);
      setIsloading(false);
    }
  };

  useEffect(() => {
    getBanner();
    getServices();
  }, []);

  return (
    <MainLayout>
      {/* contnet */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <ProfileSection />

        <section className="mb-14">
          {isLoading ? (
            <LoadingSkeleton className="aspect-video w-[100%] h-20" />
          ) : (
            <>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center cursor-pointer"
                  >
                    <Link
                      to={`/payment/${service.service_code}`}
                      className="hover:text-red-500 transition-all"
                    >
                      <div className="w-16 h-16 rounded-2xl border border-slate-200 flex items-center justify-center bg-white shadow-sm hover:shadow-md transition-all mb-2">
                        <img
                          src={service.service_icon}
                          alt={`banner_${index}`}
                          draggable={false}
                          className="
                        w-full
                        h-full
                        object-cover
                        pointer-events-none
                      "
                        />
                      </div>
                    </Link>

                    <p className="text-xs text-slate-700">
                      {service.service_name}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* promo */}
        <section>
          <h3 className="font-semibold text-slate-900 mb-5">
            Temukan promo menarik
          </h3>

          {isLoading ? (
            <LoadingSkeleton className="aspect-video w-[100%] h-50" />
          ) : (
            <>
              <div
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="
            flex gap-4
            overflow-x-auto
            scrollbar-hide
            cursor-grab
            active:cursor-grabbing
            select-none
            pb-2
          "
              >
                {banners.map((banner, index) => (
                  <div
                    key={index}
                    className="
                  min-w-[320px]
                  h-[160px]
                  rounded-2xl
                  overflow-hidden
                  flex-shrink-0
                "
                  >
                    <img
                      src={banner.banner_image}
                      alt={`banner_${index}`}
                      draggable={false}
                      className="
                    w-full
                    h-full
                    object-cover
                    pointer-events-none
                  "
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </MainLayout>
  );
};

export default HomePage;
