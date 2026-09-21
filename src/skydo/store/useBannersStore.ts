import log from "./logger";
import { create, zustandDevtools } from "./index";
import beCall, { fetchData } from "../util/beCall";
import BE_ROUTES, { BFF_ROUTES } from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { BANNER_STYLE } from "../components/Banners/BannerCarousel";
import { debounce } from "../util/functions";
import { BannerData, BANNERS, WidgetType } from "../types/BannerTypes";
import Locale from "../util/locale/en";
import { formatDate } from "../util/formatters";
import { logApiFailureToSentry } from "../util/sentryLogger";
import { NEW_IMPORTER_OFFER_KEY, REFERRAL_BANNER_KEY } from "../constants/bannerConstants";

// Carousel priority: these are hoisted to the front in this order, everything
// else keeps the backend's order behind them. Referral first, then the offer.
const BANNER_PRIORITY: BANNERS[] = [REFERRAL_BANNER_KEY, NEW_IMPORTER_OFFER_KEY];

const sortBannersByPriority = (list: BANNERS[]): BANNERS[] => [
  ...BANNER_PRIORITY.filter((b) => list.includes(b)),
  ...list.filter((b) => !BANNER_PRIORITY.includes(b)),
];

interface BannersStore {
  bannerList: BANNERS[];
  fetchBanners: () => void;
  dismissBanner: (bannerType: BANNERS) => Promise<void>;
  bannerStyle: BANNER_STYLE;
  isLoading: Boolean;
  bannerData: BannerData;
  fetchHomeWidget: () => void;
  fetchTnc: () => void;
  tncFileUrl?: string;
  widget?: WidgetType;
  unsetWidget: () => void;
}

const useBannersStore = create<BannersStore>()(
  zustandDevtools(
    log((set: any, _get: () => BannersStore) => ({
      isLoading: true,
      bannerList: [],
      bannerStyle: BANNER_STYLE.GRID,
      unsetWidget: () => {
        set((store: BannersStore) => ({ ...store, widget: undefined }));
      },
      fetchHomeWidget: debounce(
        async () => {
          try {
            const widget = await fetchData<WidgetType & { activationWidgetData: { expiryDate: string } }>({
              url: BE_ROUTES.NOTIFICATION_WIDGET,
              method: ALLOWED_METHODS.POST,
            });
            if (widget?.data?.activationWidgetData) {
              const widgetData = {
                tag: "announcement",
                title: Locale.widgetTitle,
                identifierType: "ACTIVATION_EXP",
                description: widget?.data?.activationWidgetData?.expiryDate
                  ? Locale.firstMonthFreeSubtextWDate.replace(
                      ":date",
                      formatDate(widget?.data?.activationWidgetData?.expiryDate)
                    )
                  : Locale.widgetDescription,
              };
              set((store: BannersStore) => ({ ...store, widget: widgetData }));
            } else if (widget?.data) {
              set((store: BannersStore) => ({ ...store, widget: widget.data }));
            }
          } catch (e) {}
        },
        500,
        { isLeading: true }
      ),
      fetchTnc: debounce(
        async () => {
          try {
            const resp = await fetchData({
              url: BFF_ROUTES.FETCH_TNC,
              method: ALLOWED_METHODS.GET,
            });
            set((store: BannersStore) => ({ ...store, tncFileUrl: resp?.data }));
          } catch (e) {
            console.log("store error", e);
          }
        },
        500,
        { isLeading: true }
      ),
      fetchBanners: debounce(
        async () => {
          try {
            await beCall([{
              url: BFF_ROUTES.GET_BANNER_LIST,
              method: ALLOWED_METHODS.GET,
              onSuccess: (resp) => {
                const incoming: BANNERS[] = resp.data?.data?.bannerList ?? [];
                const bannerList = sortBannersByPriority(incoming);
                set((store: BannersStore) => ({
                  ...store,
                  ...resp.data?.data,
                  bannerList,
                  bannerData: resp.data?.bannerData,
                }));
              }
            }]);
          } catch (e) {
          } finally {
            set((store: BannersStore) => ({ ...store, isLoading: false }));
          }
        },
        500,
        { isLeading: true }
      ),
      // Drop the banner optimistically and don't refetch. What a dismiss means is the
      // backend's call and differs per banner, applied on the next fetchBanners:
      // NEW_IMPORTER_OFFER hides once, returns after 15 days and is gone after the 2nd
      // dismiss; REGIONAL_CURRENCY is a permanent skip on the first dismiss. Nothing
      // here encodes either schedule.
      dismissBanner: async (bannerType: BANNERS) => {
        set((store: BannersStore) => ({
          ...store,
          bannerList: store.bannerList.filter((b) => b !== bannerType),
        }));
        try {
          await beCall({
            url: BFF_ROUTES.SKIP_BANNER,
            method: ALLOWED_METHODS.POST,
            body: { bannerType },
          });
        } catch (e) {
          // A failed skip means the backend never recorded the dismissal, so
          // the banner reappears on the next fetch — log it so that's not silent.
          logApiFailureToSentry("useBannersStore/dismissBanner", BFF_ROUTES.SKIP_BANNER, { bannerType }, e);
        }
      },
    }))
  )
);
export default useBannersStore;
