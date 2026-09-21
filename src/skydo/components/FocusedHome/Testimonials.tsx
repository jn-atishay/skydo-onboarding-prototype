import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import Typography from "../AtomicComponents/Typography";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import { useEffect } from "react";

const Testimonials = () => {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.trackAsync(Events.FOCUSED_HOME.TESTIMONIAL_CARD_SEEN, {
      project: "fhv2",
      subpage: "fh_intent",
    });
  }, []);

  return (
    <div className={"flex flex-col gap-6"}>
      <Typography
        text={Locale.focusedHome.testimonials.title}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.LARGE}
        fontWeight={"bold"}
      />
      <div className={"flex flex-row gap-6"}>
        <div className={"flex-1 shrink-0 py-6 px-4 bg-white rounded-10px flex flex-col gap-4 min-w-0"}>
          <iframe
            width={"auto"}
            height={"auto"}
            src="https://www.youtube.com/embed/q4Z-Hl5uKDE?si=lKrrn3a0Wsx3KRBi&rel=0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className={"rounded-10px aspect-[4/3]"}
          ></iframe>
          <div className={"flex flex-col gap-2"}>
            <Typography
              text={Locale.focusedHome.testimonials.testimonial1Name}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"bold"}
            />
            <Typography
              text={Locale.focusedHome.testimonials.testimonial1Company}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-500 !font-normal"}
            />
          </div>
        </div>

        <div className={"flex-1 shrink-0 py-6 px-4 bg-white rounded-10px flex flex-col gap-4 min-w-0"}>
          <iframe
            width={"auto"}
            height={"auto"}
            src="https://www.youtube.com/embed/SflthBt0DVQ?si=qrHvSi8JA52xbtCN&rel=0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className={"rounded-10px aspect-[4/3]"}
          ></iframe>
          <div className={"flex flex-col gap-2"}>
            <Typography
              text={Locale.focusedHome.testimonials.testimonial2Name}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"bold"}
            />
            <Typography
              text={Locale.focusedHome.testimonials.testimonial2Company}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-500 !font-normal"}
            />
          </div>
        </div>

        <div className={"flex-1 shrink-0 py-6 px-4 bg-white rounded-10px flex flex-col gap-4 min-w-0"}>
          <iframe
            width={"auto"}
            height={"auto"}
            src="https://www.youtube.com/embed/QZhu_whQd28?si=HbL7XoHbEUW67FIk&rel=0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className={"rounded-10px aspect-[4/3]"}
          ></iframe>
          <div className={"flex flex-col gap-2"}>
            <Typography
              text={Locale.focusedHome.testimonials.testimonial3Name}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={"bold"}
            />
            <Typography
              text={Locale.focusedHome.testimonials.testimonial3Company}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-500 !font-normal"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;