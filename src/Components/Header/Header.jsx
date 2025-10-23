import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import images
import AiImg from "../../assets/images/Ai.png";
import DataAnalystImg from "../../assets/images/data_analyst.png";
import MarketingImg from "../../assets/images/marketing.png";

const Header = () => {
  return (
    <div className="w-full h-[400px]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="w-full h-full"
      >
        <SwiperSlide>
          <img
            src={AiImg}
            alt="AI Slide"
            className="w-[1200px] mx-auto h-full "
          />
        </SwiperSlide>

        <SwiperSlide>
          <img
            src={DataAnalystImg}
            alt="Data Analyst Slide"
            className="w-[1200px] mx-auto h-full "
          />
        </SwiperSlide>

        <SwiperSlide>
          <img
            src={MarketingImg}
            alt="Marketing Slide"
            className="w-[1200px] mx-auto h-full"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Header;
