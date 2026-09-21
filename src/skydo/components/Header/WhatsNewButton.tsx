import React, { FC, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import BellIcon from "../Icons/BellIcon";
import Typography from "../AtomicComponents/Typography";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import classNames from "classnames";
import { FeatureTagType } from "../DashboardContainer/FeatureWidget";
import Image from "next/image";
import Button from "../AtomicComponents/Button";
import PlayIcon from "../Icons/PlayIcon";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import Locale from "../../util/locale/en";
import Tooltip from "../AtomicComponents/Tooltip";
import useOutsideClickFinder from "../../hooks/useOutsideClickFinder";
import useDashboardContainerStore from "../../store/useDashboardContainerStore";

interface WhatsNewButtonProps {}

type trayItem = {
  tag: FeatureTagType;
  title: string;
  description: string;
  bodyLink?: string;
  cta?: string;
  ctaLink?: string;
  image?: string;
  imageLink?: string;
  isVideo?: boolean; // Flag to show play icon overlay
  read: boolean;
  date: string;
  requiresUaeAccess?: boolean; // Flag to filter based on UAE account access
};

interface Notifications {
  badge?: boolean;
  trayItems?: trayItem[];
}

const WhatsNewButton: FC<WhatsNewButtonProps> = (props) => {
  const [trayOpen, setTrayOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notifications>({});
  const analytics = useAnalytics();
  const notifTrayRef = useRef(null);
  const router = useRouter();
  const { hasUaeAccountAccess } = useDashboardContainerStore();

  // Dashboard destinations stay in the app; only external links get a new tab. Guards a missing
  // link, which would otherwise open a blank tab.
  const openNotificationLink = (link?: string) => {
    if (!link) return;
    if (link.startsWith("/")) {
      setTrayOpen(false);
      void router.push(link);
      return;
    }
    window.open(link);
  };

  const tagColor = {
    announcement: "bg-orange-400",
    new_feature: "bg-green-400",
    fix: "bg-red-400",
    alert: "bg-yellow-400",
  };
  const tagText = {
    announcement: Locale.announcement,
    new_feature: Locale.feature,
    fix: Locale.fix,
    alert: Locale.alert,
  };
  const getNotifications = async () => {
    try {
      await beCall({
        url: BE_ROUTES.NOTIFICATIONS_TRAY,
        method: ALLOWED_METHODS.POST,
        onSuccess: (res) => {
          // Filter notifications based on UAE account access
          const filteredTrayItems = res.data.trayItems?.filter((item: trayItem) => {
            return !(item.requiresUaeAccess && !hasUaeAccountAccess);
          });

          setNotifications({
            ...res.data,
            trayItems: filteredTrayItems,
          });
        },
      });
    } catch (e) {}
  };

  useEffect(() => {
    getNotifications();
  }, [hasUaeAccountAccess]);

  const TrayItem = (params: trayItem) => {
    return (
      <div
        className={classNames("p-4 hover:bg-blue-50 cursor-pointer", params.read && "bg-black-50")}
        onClick={() => {
          analytics.trackAsync(Events.NOTIFICATION_CLICKED, {
            title: params.title,
            tag: params.tag,
            source: "body",
          });
          openNotificationLink(params.bodyLink);
        }}
      >
        <div className={"flex flex-row gap-2 mb-4"}>
          <div>
            <Typography
              text={tagText[params.tag]}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={classNames("px-1 py-0.5 !text-white rounded-5px", tagColor[params.tag])}
            />
          </div>
          <div className={"flex-1 w-[205px]"}>
            <Typography
              text={params.title}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!font-bold"}
            />
          </div>
          <div>
            <Typography text={params.date} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_X_SMALL} />
          </div>
        </div>
        <div className={"flex flex-row gap-4"}>
          {params.image && (
            <div
              className={classNames(
                "w-[128px] relative rounded-lg min-h-[72px] border overflow-hidden",
                params.requiresUaeAccess ? "bg-primary-400" : "bg-black-400"
              )}
              onClick={(e) => {
                e.stopPropagation();
                analytics.trackAsync(Events.NOTIFICATION_CLICKED, {
                  title: params.title,
                  tag: params.tag,
                  source: "image",
                });
                openNotificationLink(params.imageLink);
              }}
            >
              <Image src={params.image} layout={"fill"} objectFit={"fill"} alt={"feature thumbnail"} />
              {(params.isVideo ?? true) && (
                <div className={"absolute inset-0 justify-center flex items-center"}>
                  <div className={"bg-white h-6 w-6 rounded-full shadow-common flex justify-center items-center"}>
                    <PlayIcon />
                  </div>
                </div>
              )}
            </div>
          )}
          <div className={"flex flex-col gap-2 flex-1"}>
            <Typography
              text={params.description}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-500"}
            />
            {params.cta && (
              <div className={"flex flex-row justify-end"}>
                <Button
                  type={BUTTON_TYPES.SECONDARY}
                  title={params.cta}
                  size={BUTTON_SIZES.X_SMALL}
                  onButtonClick={(e) => {
                    e.stopPropagation();
                    analytics.trackAsync(Events.NOTIFICATION_CLICKED, {
                      title: params.title,
                      tag: params.tag,
                      source: "cta",
                    });
                    openNotificationLink(params.ctaLink);
                  }}
                  buttonClass={"px-4 py-2"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const NewSection = () => {
    return (
      <div
        className={
          "absolute bg-white flex flex-col rounded-10px w-[376px] shadow-elevation2 mt-10 top-0 right-0 overflow-hidden"
        }
        ref={notifTrayRef}
      >
        <div className={"p-2 text-center border-b !border-black-400"}>
          <Typography
            text={Locale.whatsNew}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!font-bold"}
          />
        </div>
        <div className={"max-h-[450px] overflow-auto divide-y divide-black-400"}>
          {notifications?.trayItems?.map((item, id) => (
            <TrayItem key={id} {...item} />
          ))}
        </div>
      </div>
    );
  };

  const onNotifIconClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setTrayOpen((v) => !v);
    analytics.trackAsync(Events.NOTIFICATION_ICON_CLICKED);
    setNotifications((v) => {
      return { ...v, badge: false };
    });
    try {
      beCall({
        path: BE_ROUTES.SET_NOTIFICATION_CLICK,
        method: ALLOWED_METHODS.POST,
      });
    } catch (e) {}
  };

  useOutsideClickFinder(notifTrayRef, () => {
    setTrayOpen(false);
  });

  if (Object.keys(notifications).length === 0) {
    return null;
  }

  return (
    <div className={"relative"}>
      <Tooltip
        tooltipText={<Typography text={Locale.whatsNew} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-white"} />}
        tooltipTheme={"dark"}
      >
        <div className={"relative cursor-pointer"} onClick={onNotifIconClick}>
          <BellIcon height={24} width={24} strokeWidth={1} />
          {notifications?.badge && <div className={"w-2 h-2 bg-red-400 absolute -top-1 -right-1 rounded-full"} />}
        </div>
      </Tooltip>
      {trayOpen && <NewSection />}
    </div>
  );
};

export default WhatsNewButton;
