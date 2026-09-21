import React, { FC, useContext } from "react";
import Typography from "../AtomicComponents/Typography";
import {
  BadgeSizes,
  BadgeTypes,
  BUTTON_SIZES,
  BUTTON_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES
} from "../../constants/atomicConstants";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import AppContext from "../../context/AppContext";
import Button from "../AtomicComponents/Button";
import Image from "next/image";
import PlayIcon from "../Icons/PlayIcon";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import Locale from "../../util/locale/en";
import Badge from "../AtomicComponents/Badge";
import { WidgetType } from "../../types/BannerTypes";

export type FeatureTagType = "new_feature" | "announcement" | "fix" | "alert";

export const actionType = {
  DISMISS_CLICKED: "DISMISS_CLICKED",
  CTA_CLICKED: "CTA_CLICKED",
  ICON_CLICKED: "ICON_CLICKED",
};

const FeatureWidget: FC<WidgetType & { closeWidget: () => void }> = (props) => {
  const { theme } = useContext(AppContext);
  const analytics = useAnalytics();
  const tagColor = {
    announcement: "bg-orange-400",
    new_feature: "bg-green-400",
    alert: "bg-yellow-400",
    fix: "bg-red-400"
  };
  const tagText = {
    announcement: Locale.announcement,
    new_feature: Locale.feature,
    alert: Locale.alert,
    fix: Locale.fix
  };

  return (
    <div className={"bg-white fixed bottom-6 right-6 rounded-10px shadow-headerShadow p-4 w-[250px]"}>
      <div className={"flex flex-row justify-between"}>
        <Badge
          title={tagText[props.tag]}
          type={BadgeTypes.Full}
          size={BadgeSizes.Medium}
          className={tagColor[props.tag]}
        />
        <div
          className={"cursor-pointer"}
          onClick={() => {
            analytics.trackAsync(Events.NOTIFICATION_WIDGET_EXITED, {
              title: props.title,
              tag: props.tag,
            });
            try {
              beCall({
                path: BE_ROUTES.SET_NOTIFICATION_WIDGET_ACTION,
                method: ALLOWED_METHODS.POST,
                body: {
                  id: props.id,
                  actionType: actionType.DISMISS_CLICKED,
                  identifierType: props.identifierType,
                },
              });
            } catch (e) {}
            props.closeWidget();
          }}
        >
          <CrossIcon stroke={theme.hexColors.black[500]} />
        </div>
      </div>
      <div className={"flex flex-col my-4"}>
        {props?.image && (
          <div
            className={
              "flex-1 w-full relative rounded-lg min-h-[100px] mb-4 cursor-pointer border overflow-hidden bg-black-400"
            }
            onClick={() => {
              analytics.trackAsync(Events.NOTIFICATION_WIDGET_CLICKED, {
                title: props.title,
                tag: props.tag,
                source: "image",
              });
              window.open(props?.imageLink);
              try {
                beCall({
                  path: BE_ROUTES.SET_NOTIFICATION_WIDGET_ACTION,
                  method: ALLOWED_METHODS.POST,
                  body: {
                    id: props.id,
                    actionType: actionType.CTA_CLICKED,
                  },
                });
              } catch (e) {}
              props.closeWidget();
            }}
          >
            <Image src={props.image} layout={"fill"} objectFit={"fill"} alt={"feature thumbnail"} />
            <div className={"absolute inset-0 justify-center flex items-center"}>
              <div className={"bg-white h-6 w-6 rounded-full shadow-common flex justify-center items-center"}>
                <PlayIcon />
              </div>
            </div>
          </div>
        )}
        <Typography
          text={props.title}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"!font-bold"}
        />
        <Typography
          text={props.description}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={"!text-black-500"}
        />
      </div>
      {props.cta ? (
        <div className={"flex flex-row justify-end"}>
          <Button
            type={BUTTON_TYPES.PRIMARY}
            title={props.cta}
            size={BUTTON_SIZES.X_SMALL}
            onButtonClick={() => {
              analytics.trackAsync(Events.NOTIFICATION_WIDGET_CLICKED, {
                title: props.title,
                tag: props.tag,
                source: "cta",
              });
              window.open(props?.ctaLink);
              try {
                beCall({
                  path: BE_ROUTES.SET_NOTIFICATION_WIDGET_ACTION,
                  method: ALLOWED_METHODS.POST,
                  body: {
                    id: props.id,
                    actionType: actionType.CTA_CLICKED,
                  },
                });
              } catch (e) {}
              props.closeWidget();
            }}
            buttonClass={"px-4 py-2"}
          />
        </div>
      ) : null}
    </div>
  );
};

export default FeatureWidget;
