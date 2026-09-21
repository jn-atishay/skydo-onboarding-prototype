import { LOCATION_CODE, LOCATION_CURRENCY_MAP } from "../../constants/dashboardConstants";
import EuropeFlagIcon from "../Icons/CountryFlags/EuropeFlagIcon";
import USFlagIcon from "../Icons/CountryFlags/USFlagIcon";
import UKFlagIcon from "../Icons/CountryFlags/UKFlagIcon";
import ROWFlagIcon from "../Icons/CountryFlags/ROWFlagIcon";
import USAPreferredPayIcon from "../Icons/USAPreferredPayIcon";
import EuropePreferredPayIcon from "../Icons/EuropePreferredPayIcon";
import UKPreferredPayIcon from "../Icons/UKPreferredPayIcon";
import Typography from "../AtomicComponents/Typography";
import CanadaPreferredPayIcon from "../Icons/CanadaPreferredPayIcon";
import CanadaFlagIcon from "../Icons/CountryFlags/CanadaFlagIcon";
import UaeFlagIcon from "../Icons/CountryFlags/UaeFlagIcon";
import IndiaFlagIcon from "../Icons/CountryFlags/IndiaFlagIcon";
import SingaporeFlagIcon from "../Icons/SingaporeFlagIcon";
import AusFlagIcon from "../Icons/CountryFlags/AusFlagIcon";
import AUSPreferredPayIcon from "../Icons/AUSPreferredPayIcon";
import SgPreferredPayIcon from "../Icons/SgPreferredPayIcon";
import UaePreferredPayIcon from "../Icons/UaePreferredPayIcon";
import KenyaFlagIcon from "../Icons/CountryFlags/KenyaFlagIcon";
import PolandFlagIcon from "../Icons/CountryFlags/PolandFlagIcon";
import SaudiArabiaFlagIcon from "../Icons/CountryFlags/SaudiArabiaFlagIcon";
import SwitzerlandFlagIcon from "../Icons/CountryFlags/SwitzerlandFlagIcon";
import KuwaitFlagIcon from "../Icons/CountryFlags/KuwaitFlagIcon";
import NorwayFlagIcon from "../Icons/CountryFlags/NorwayFlagIcon";
import QatarFlagIcon from "../Icons/CountryFlags/QatarFlagIcon";
import ThailandFlagIcon from "../Icons/CountryFlags/ThailandFlagIcon";
import MexicoFlagIcon from "../Icons/CountryFlags/MexicoFlagIcon";
import OmanFlagIcon from "../Icons/CountryFlags/OmanFlagIcon";
import RomaniaFlagIcon from "../Icons/CountryFlags/RomaniaFlagIcon";
import SwedenFlagIcon from "../Icons/CountryFlags/SwedenFlagIcon";
import TurkeyFlagIcon from "../Icons/CountryFlags/TurkeyFlagIcon";
import UgandaFlagIcon from "../Icons/CountryFlags/UgandaFlagIcon";
import BulgariaFlagIcon from "../Icons/CountryFlags/BulgariaFlagIcon";
import IsraelFlagIcon from "../Icons/CountryFlags/IsraelFlagIcon";
import ChinaFlagIcon from "../Icons/CountryFlags/ChinaFlagIcon";
import JapanFlagIcon from "../Icons/CountryFlags/JapanFlagIcon";
import CzechFlagIcon from "../Icons/CountryFlags/CzechFlagIcon";
import DenmarkFlagIcon from "../Icons/CountryFlags/DenmarkFlagIcon";
import HongKongFlagIcon from "../Icons/CountryFlags/HongKongFlagIcon";
import HungaryFlagIcon from "../Icons/CountryFlags/HungaryFlagIcon";
import SouthAfricaFlagIcon from "../Icons/CountryFlags/SouthAfricaFlagIcon";
import NewZealandFlagIcon from "../Icons/CountryFlags/NewZealandFlagIcon";
import BahrainFlagIcon from "../Icons/CountryFlags/BahrainFlagIcon";
import GermanyFlagIcon from "../Icons/CountryFlags/GermanyFlagIcon";
import FranceFlagIcon from "../Icons/CountryFlags/FranceFlagIcon";
import ItalyFlagIcon from "../Icons/CountryFlags/ItalyFlagIcon";
import NetherlandsFlagIcon from "../Icons/CountryFlags/NetherlandsFlagIcon";
import Image from "next/image";

export const CurrencyVsPreferredPayIconComp = ({
  currency,
  containerClass,
}: {
  currency: string;
  containerClass?: string;
}) => {
  switch (currency) {
    case LOCATION_CURRENCY_MAP[LOCATION_CODE.USA]:
      return <USAPreferredPayIcon containerClass={containerClass} />;
    case LOCATION_CURRENCY_MAP[LOCATION_CODE.EUROPE]:
      return <EuropePreferredPayIcon containerClass={containerClass} />;
    case LOCATION_CURRENCY_MAP[LOCATION_CODE.UK]:
      return <UKPreferredPayIcon containerClass={containerClass} />;
    case LOCATION_CURRENCY_MAP[LOCATION_CODE.CA]:
      return <CanadaPreferredPayIcon containerClass={containerClass} />;
    case LOCATION_CURRENCY_MAP[LOCATION_CODE.AUS]:
      return <AUSPreferredPayIcon containerClass={containerClass} />;
    case LOCATION_CURRENCY_MAP[LOCATION_CODE.SG]:
      return <SgPreferredPayIcon containerClass={containerClass} />;
    case LOCATION_CURRENCY_MAP[LOCATION_CODE.UAE]:
      return <UaePreferredPayIcon containerClass={containerClass} />;
    default:
      return <USAPreferredPayIcon containerClass={containerClass} />;
  }
};

const ImporterLocationVsIconComp = ({
  location,
  width,
  height,
}: {
  location: string;
  is40X40?: boolean;
  width?: number;
  height?: number;
}) => {
  switch (location) {
    case LOCATION_CODE.USA:
      return <USFlagIcon isFx={true} width={width} height={height} />;
    case LOCATION_CODE.EUROPE:
      return <EuropeFlagIcon width={width} height={height} />;
    case LOCATION_CODE.UK:
      return <UKFlagIcon width={width} height={height} />;
    case LOCATION_CODE.CA:
      return <CanadaFlagIcon width={width} height={height} />;
    case LOCATION_CODE.UAE:
      return <UaeFlagIcon width={width} height={height} />;
    case LOCATION_CODE.AUS:
      return <AusFlagIcon width={width} height={height} />;
    case LOCATION_CODE.ROW:
      return <ROWFlagIcon width={width} height={height} />;
    case LOCATION_CODE.IND:
      return <IndiaFlagIcon width={width} height={height} />;
    case LOCATION_CODE.SG:
      return <SingaporeFlagIcon width={width} height={height} />;
    case LOCATION_CODE.KENYA:
      return <KenyaFlagIcon width={width} height={height} />;
    case LOCATION_CODE.POLAND:
      return <PolandFlagIcon width={width} height={height} />;
    case LOCATION_CODE.SAUDI:
      return <SaudiArabiaFlagIcon width={width} height={height} />;
    case LOCATION_CODE.SWITZERLAND:
      return <SwitzerlandFlagIcon width={width} height={height} />;
    case LOCATION_CODE.KUWAIT:
      return <KuwaitFlagIcon width={width} height={height} />;
    case LOCATION_CODE.NORWAY:
      return <NorwayFlagIcon width={width} height={height} />;
    case LOCATION_CODE.QATAR:
      return <QatarFlagIcon width={width} height={height} />;
    case LOCATION_CODE.THAILAND:
      return <ThailandFlagIcon width={width} height={height} />;
    case LOCATION_CODE.MEXICO:
      return <MexicoFlagIcon width={width} height={height} />;
    case LOCATION_CODE.OMAN:
      return <OmanFlagIcon width={width} height={height} />;
    case LOCATION_CODE.ROMANIA:
      return <RomaniaFlagIcon width={width} height={height} />;
    case LOCATION_CODE.SWEDEN:
      return <SwedenFlagIcon width={width} height={height} />;
    case LOCATION_CODE.TURKEY:
      return <TurkeyFlagIcon width={width} height={height} />;
    case LOCATION_CODE.UGANDA:
      return <UgandaFlagIcon width={width} height={height} />;
    case LOCATION_CODE.BULGARIA:
      return <BulgariaFlagIcon width={width} height={height} />;
    case LOCATION_CODE.ISRAEL:
      return <IsraelFlagIcon width={width} height={height} />;
    case LOCATION_CODE.CHINA:
      return <ChinaFlagIcon width={width} height={height} />;
    case LOCATION_CODE.JAPAN:
      return <JapanFlagIcon width={width} height={height} />;
    case LOCATION_CODE.CZECH:
      return <CzechFlagIcon width={width} height={height} />;
    case LOCATION_CODE.HK:
      return <HongKongFlagIcon width={width} height={height} />;
    case LOCATION_CODE.DENMARK:
      return <DenmarkFlagIcon width={width} height={height} />;
    case LOCATION_CODE.HUNGARY:
      return <HungaryFlagIcon width={width} height={height} />;
    case LOCATION_CODE.SOUTH_AFRICA:
      return <SouthAfricaFlagIcon width={width} height={height} />;
    case LOCATION_CODE.NZ:
      return <NewZealandFlagIcon width={width} height={height} />;
    case LOCATION_CODE.BAHRAIN:
      return <BahrainFlagIcon width={width} height={height} />;
    case LOCATION_CODE.GERMANY:
      return <GermanyFlagIcon width={width} height={height} />;
    case LOCATION_CODE.FRANCE:
      return <FranceFlagIcon width={width} height={height} />;
    case LOCATION_CODE.ITALY:
      return <ItalyFlagIcon width={width} height={height} />;
    case LOCATION_CODE.NETHERLANDS:
      return <NetherlandsFlagIcon width={width} height={height} />;
    case LOCATION_CODE.SPAIN:
      return (
        <Image
          alt={"Spain Flag"}
          src={"https://skydo-public-documents.s3.ap-south-1.amazonaws.com/flags/es.svg"}
          width={width || 40}
          height={height || 40}
        />
      );
    default:
      return <Typography text={location} />;
  }
};

export default ImporterLocationVsIconComp;
