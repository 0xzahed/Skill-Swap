import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import AiImg from "../../assets/images/Ai.png";
import DataAnalystImg from "../../assets/images/data_analytics.png";
import MarketingImg from "../../assets/images/marketing.png";
import { IoStar } from "react-icons/io5";

const Header = () => {
  const slides = [
    {
      image: AiImg,
      title: "Master AI Skills",
      subtitle:
        "Learn cutting-edge artificial intelligence from industry experts",
    },
    {
      image: DataAnalystImg,
      title: "Data Analytics Mastery",
      subtitle: "Transform data into actionable insights with expert guidance",
    },
    {
      image: MarketingImg,
      title: "Digital Marketing Pro",
      subtitle: "Boost your brand with modern marketing strategies",
    },
  ];

  return (
    <div className="relative w-full h-[400px] md:h-[450px] bg-gradient-to-br from-[#422AD5]/10 to-purple-100/30">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full flex items-center">
              <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="text-left space-y-4 z-10">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 max-w-xl">
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                      <button className="bg-[#422AD5] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3319B0] transition-colors duration-300">
                        Get Started
                      </button>
                      <button className="bg-white text-[#422AD5] px-6 py-3 rounded-xl font-semibold border-2 border-[#422AD5] hover:bg-[#422AD5] hover:text-white transition-colors duration-300">
                        Learn More
                      </button>
                    </div>

                    <div className="flex gap-6 pt-4">
                      <div>
                        <p className="text-2xl font-bold text-[#422AD5]">
                          1000+
                        </p>
                        <p className="text-xs text-gray-600">Active Learners</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#422AD5]">50+</p>
                        <p className="text-xs text-gray-600">Expert Tutors</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#422AD5] flex items-center gap-1">
                          4.8<IoStar></IoStar>
                        </p>
                        <p className="text-xs text-gray-600">Average Rating</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative hidden lg:block">
                    <div className="relative">
                      <div className="absolute -top-4 -left-4 w-64 h-64 bg-[#422AD5]/20 rounded-full blur-3xl"></div>
                      <div className="absolute -bottom-4 -right-4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="relative w-full h-auto rounded-2xl shadow-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Header;
