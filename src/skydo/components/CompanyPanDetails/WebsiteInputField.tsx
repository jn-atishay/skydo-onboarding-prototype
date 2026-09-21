//Jan 2025

import TextInput from "../AtomicComponents/TextInput";
import { Field } from "react-final-form";
import React, { useContext, useRef, useState } from "react";
import Image from "next/image";
import AppContext from "../../context/AppContext";
import LinkIcon from "../Icons/LinkIcon";
import FadeLoaderIcon from "../Icons/FadeLoaderIcon";
import TickIcon from "../Icons/TickIcon";
import GlobeIcon from "../Icons/GlobeIcon";
import useOnboardingStore from "../../store/useOnboardingStore";
import Locale from "../../util/locale/en";
import { TOOLTIP_POSITION } from "../../constants/atomicConstants";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

const getFaviconUrl = (url: string) => {
  try {
    const hostname = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return null;
  }
};

interface Props {
  isWebNotAvailable: boolean;
  setUrlValidationError: (value: string) => void;
  isUrlValidationError: string;
  errors: any;
  labelAndPlaceholder: { label: string | JSX.Element; placeholder: string };
  labelTextClass?: string;
  inputClass?: string;
  customClass?: string;
  infoText?: string | JSX.Element;
  onFieldClick?: () => void;
  businessType?: string;
}

const WebsiteInputField = (props: Props) => {
  const {
    isWebNotAvailable,
    setUrlValidationError,
    isUrlValidationError,
    errors,
    labelAndPlaceholder,
    labelTextClass,
    inputClass,
    customClass,
    infoText,
    onFieldClick,
    businessType,
  } = props;
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [isFaviconLoadError, setIsFaviconLoadError] = useState(false);
  const { theme } = useContext(AppContext);
  const validateWebUrl = useOnboardingStore((state) => state.validateWebUrl);
  const validationTokenRef = useRef(0);
  const analytics = useAnalytics();

  const onUrlBlur = async (value: string) => {
    if (!value || isWebNotAvailable) return;
    const token = ++validationTokenRef.current;
    setIsValidatingUrl(true);
    try {
      const { isValid } = (await validateWebUrl(value)) || { isValid: false };
      if (token !== validationTokenRef.current) return;
      setIsUrlValid(isValid);
      setUrlValidationError(isValid ? "" : Locale.invalidUrl);
      analytics.trackAsync(isValid ? Events.WEBSITE_VERIFIED : Events.WEBSITE_VERIFICATION_FAILED, {
        entity_type: businessType,
      });
    } finally {
      if (token === validationTokenRef.current) {
        setIsValidatingUrl(false);
      }
    }
  };

  return (
    <Field name={"webUrl"}>
      {(props) => (
        <TextInput
          inputClass={inputClass}
          customClass={customClass}
          labelTextClass={labelTextClass}
          isDisabled={isWebNotAvailable}
          onInputClick={() => isWebNotAvailable && onFieldClick?.()}
          label={labelAndPlaceholder.label as string}
          isLabelRequired={!isWebNotAvailable}
          infoText={infoText}
          tooltipProps={{ position: TOOLTIP_POSITION.TOP, tooltipTheme: "dark" }}
          placeholder={labelAndPlaceholder.placeholder}
          leftElement={() => {
            if (isValidatingUrl) {
              return (
                <div className={"mr-3"}>
                  <FadeLoaderIcon stroke={theme.hexColors.black[500]} width={20} height={20} />
                </div>
              );
            }
            if (isUrlValid) {
              const faviconUrl = getFaviconUrl(props.input.value);
              if (faviconUrl && !isFaviconLoadError) {
                return (
                  <div className={"flex mr-3"}>
                    <Image
                      src={faviconUrl}
                      width={20}
                      height={20}
                      alt={""}
                      onError={() => setIsFaviconLoadError(true)}
                    />
                  </div>
                );
              }
              return (
                <div className={"mr-3"}>
                  <GlobeIcon stroke={theme.hexColors.black[500]} width={20} height={20} />
                </div>
              );
            }
            return (
              <div className={"mr-3"}>
                <LinkIcon stroke={theme.hexColors.black[500]} width={20} height={20} />
              </div>
            );
          }}
          rightElement={() => (isUrlValid ? <TickIcon /> : null)}
          onChange={(value: any) => {
            props.input.onChange(value);
            validationTokenRef.current += 1;
            setIsValidatingUrl(false);
            setUrlValidationError("");
            setIsUrlValid(false);
            setIsFaviconLoadError(false);
          }}
          onBlur={() => {
            props.input.onBlur();
            onUrlBlur(props.input.value);
          }}
          value={props.input.value}
          isError={isUrlValidationError ? !!isUrlValidationError : props.meta.submitFailed && props.meta.error}
          footerText={isUrlValidationError ? isUrlValidationError : props.meta.submitFailed && errors?.webUrl}
        />
      )}
    </Field>
  );
};

export default WebsiteInputField;
