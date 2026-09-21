import log from "./logger";
import { create, zustandDevtools } from "./index";
import {
  ActiveCampaign,
  ClaimedMilestoneProgress,
  ClaimReferralRewardResult,
  MilestoneProgress,
  MilestoneProgressRequestStatus,
  ReferralMetrics,
  ReferralState,
  ReferrerData,
  ReferrerRelation,
  UserReferralData,
} from "../types/Referral";
import { debounce } from "../util/functions";
import beCall, { fetchData } from "../util/beCall";
import BE_ROUTES, { BFF_ROUTES } from "../util/beRoutes";
import FE_ROUTES from "../util/feRoutes";
import Router from "next/router";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import useBannersStore from "./useBannersStore";

interface ReferralStore {
  referrerDetails?: ReferrerData;
  referrerDetailsViaCode?: ReferrerData;
  // referrerDetailsViaCode alone can't distinguish "not fetched yet" from "fetched,
  // no matching referrer" — both are `undefined`. Consumers need that distinction to
  // know when to stop showing a loading skeleton and show real (or generic) content.
  hasFetchedReferrerDetailsViaCode: boolean;
  userReferralData?: UserReferralData;
  invoiceCount?: number;
  referralMetrics?: ReferralMetrics;
  activeCampaign: ActiveCampaign;
  milestoneProgressByCampaign: Record<string, MilestoneProgress | null>;
  milestoneProgressStatusByCampaign: Record<string, MilestoneProgressRequestStatus>;
  // Alexa campaign endDate is per-user (activation + 15 days), so it
  // lives in store state rather than `campaigns.config.ts`.
  alexaCampaignEndDate?: string;
  alexaEndDateFetched: boolean;

  setReferrerDetails: (data?: ReferrerData) => void;
  setReferrerDetailsViaCode: (data?: ReferrerData) => void;
  setHasFetchedReferrerDetailsViaCode: (fetched: boolean) => void;
  setUserReferralData: (data?: UserReferralData) => void;
  setInvoiceCount: (data?: number) => void;
  setReferralMetrics: (data?: ReferralMetrics) => void;
  skipReferralBanner: () => void;
  isSkipLoading: boolean;
  isClaimLoading: boolean;
  setIsSkipLoading: (state: boolean) => void;
  setActiveCampaign: (campaign: ActiveCampaign) => void;
  setMilestoneProgress: (campaignName: string, progress: MilestoneProgress | null) => void;
  setMilestoneProgressStatus: (campaignName: string, status: MilestoneProgressRequestStatus) => void;
  setAlexaCampaignEndDate: (endDate?: string) => void;
  setAlexaEndDateFetched: (fetched: boolean) => void;

  fetchActiveReferral: () => void;
  fetchActiveCampaignPublic: (identifier?: string) => void;
  fetchMilestoneProgressForCampaign: (campaignName: string) => Promise<void>;
  fetchReferrerData: () => void;
  fetchReferrerDataViaCode: () => void;
  fetchReferralTrackingData: () => void;
  fetchReferralMetrics: () => void;
  fetchInvoiceCount: () => void;
  fetchReferralTrackingDataViaIdentifier: (identifier: String) => void;
  fetchAlexaCampaignEndDate: () => void;
  claimReferralReward: (campaignName: string) => Promise<ClaimReferralRewardResult>;
}

const useReferralStore = create<ReferralStore>()(
  zustandDevtools(
    log((set: (arg0: (state: any) => any) => void, get: () => ReferralStore) => ({
      referrerDetails: undefined,
      referralMetrics: undefined,
      activeCampaign: { name: "" },
      milestoneProgressByCampaign: {},
      milestoneProgressStatusByCampaign: {},
      isClaimLoading: false,
      alexaEndDateFetched: false,
      hasFetchedReferrerDetailsViaCode: false,
      setReferrerDetails: (data?: ReferrerData) => {
        const referrerDetails = data?.referrerId ? data : undefined;
        set((state) => ({ ...state, referrerDetails: referrerDetails }));
      },
      setReferrerDetailsViaCode: (data?: ReferrerData) => {
        // Mirrors setReferrerDetails: an unresolvable referral code comes back as an
        // object with every field undefined, which must not read as a live referral.
        set((s) => ({ ...s, referrerDetailsViaCode: data?.referrerId ? data : undefined }));
      },
      setHasFetchedReferrerDetailsViaCode: (fetched: boolean) => {
        set((s) => ({ ...s, hasFetchedReferrerDetailsViaCode: fetched }));
      },
      setUserReferralData: (data?: UserReferralData) => {
        set((s) => ({ ...s, userReferralData: data }));
      },
      setReferralMetrics: (data?: ReferralMetrics) => {
        set((s) => ({ ...s, referralMetrics: data }));
      },
      setInvoiceCount: (data?: number) => {
        set((s) => ({ ...s, invoiceCount: data }));
      },
      setIsSkipLoading: (state: boolean) => {
        set((s) => ({ ...s, isSkipLoading: state }));
      },
      setActiveCampaign: (campaign: ActiveCampaign) => {
        set((s) => ({ ...s, activeCampaign: campaign }));
      },
      setMilestoneProgress: (campaignName: string, progress: MilestoneProgress | null) => {
        set((s) => ({
          ...s,
          milestoneProgressByCampaign: {
            ...s.milestoneProgressByCampaign,
            [campaignName]: progress,
          },
        }));
      },
      setMilestoneProgressStatus: (campaignName: string, status: MilestoneProgressRequestStatus) => {
        set((s) => ({
          ...s,
          milestoneProgressStatusByCampaign: {
            ...s.milestoneProgressStatusByCampaign,
            [campaignName]: status,
          },
        }));
      },
      setAlexaCampaignEndDate: (endDate?: string) => {
        set((s) => ({ ...s, alexaCampaignEndDate: endDate }));
      },
      setAlexaEndDateFetched: (fetched: boolean) => {
        set((s) => ({ ...s, alexaEndDateFetched: fetched }));
      },

      fetchActiveReferral: debounce(async () => {
        try {
          await beCall({
            url: BFF_ROUTES.FETCH_ACTIVE_REFERRAL,
            method: ALLOWED_METHODS.GET,
            onSuccess: (response) => {
              if (response?.data) get().setActiveCampaign(response.data as ActiveCampaign);
            },
          });
        } catch (e) {}
      }, 500),

      fetchActiveCampaignPublic: debounce(async (identifier?: string) => {
        if (!identifier) return;
        try {
          await beCall({
            url: BFF_ROUTES.FETCH_ACTIVE_REFERRAL_PUB,
            method: ALLOWED_METHODS.POST,
            body: { identifier },
            onSuccess: (response) => {
              if (response?.data) get().setActiveCampaign(response.data as ActiveCampaign);
            },
          });
        } catch (e) {}
      }, 500),

      fetchMilestoneProgressForCampaign: async (campaignName: string) => {
        get().setMilestoneProgressStatus(campaignName, "loading");
        try {
          const response = await fetchData<MilestoneProgress | null>({
            url: BFF_ROUTES.FETCH_MILESTONE_PROGRESS,
            method: ALLOWED_METHODS.POST,
            body: { campaignName },
          });
          if (!response.success) {
            get().setMilestoneProgressStatus(campaignName, "error");
            return;
          }
          get().setMilestoneProgress(campaignName, response.data ?? null);
          get().setMilestoneProgressStatus(campaignName, "success");
        } catch (e) {
          get().setMilestoneProgressStatus(campaignName, "error");
        }
      },

      fetchReferrerData: debounce(
        async () => {
          try {
            const response = await fetchData<ReferrerData | undefined>({
              url: BE_ROUTES.FETCH_REFERRER_DETAILS,
            });
            get().setReferrerDetails(response.data);
          } catch (e) {}
        },
        500,
        { isLeading: true }
      ),
      fetchReferrerDataViaCode: debounce(
        async () => {
          try {
            // Bounded so a hung request can't leave referral pill/reward skeletons
            // spinning forever — this only affects decorative content, never blocks render.
            const response = await Promise.race([
              fetchData<ReferrerData | undefined>({ url: BE_ROUTES.FETCH_REFERRER_DETAILS_VIA_CODE }),
              new Promise<never>((_, reject) => setTimeout(() => reject(new Error("referrer_fetch_timeout")), 3000)),
            ]);
            get().setReferrerDetailsViaCode(response.data);
          } catch (e) {
          } finally {
            get().setHasFetchedReferrerDetailsViaCode(true);
          }
        },
        500,
        { isLeading: true }
      ),
      fetchReferralTrackingData: debounce(
        async () => {
          try {
            await beCall([
              {
                url: BE_ROUTES.FETCH_REFERRAL_TRACKING_DATA,
                onSuccess: (response) => {
                  get().setUserReferralData(response.data);
                },
              },
              {
                url: BFF_ROUTES.FETCH_ACTIVE_REFERRAL,
                method: ALLOWED_METHODS.GET,
                onSuccess: (response) => {
                  if (response.data) get().setActiveCampaign(response.data as ActiveCampaign);
                },
              },
            ]);
          } catch (e) {}
        },
        500,
        { isLeading: true }
      ),

      fetchReferralMetrics: debounce(
        async () => {
          try {
            const response = await fetchData<{
              uniqueReferrersCount?: number;
              totalRewardValueInCrores?: number;
              totalGiftsAchieved?: number;
            }>({
              url: BFF_ROUTES.FETCH_REFERRAL_METRICS,
              method: ALLOWED_METHODS.GET,
            });
            const metrics = response?.data;
            get().setReferralMetrics({
              totalReferrers: metrics?.uniqueReferrersCount,
              totalRewardValueInCrores: metrics?.totalRewardValueInCrores,
              totalGiftsAchieved: metrics?.totalGiftsAchieved,
            });
          } catch (e) {}
        },
        500,
        { isLeading: true }
      ),

      skipReferralBanner: async () => {
        get().setIsSkipLoading(true);
        try {
          // Send the active campaignKey so backend records dismissal per
          // campaign — a new campaign next month gets a clean slate.
          const campaignName = get().activeCampaign?.name;
          await beCall({
            url: BFF_ROUTES.SKIP_REFERRAL_BANNER,
            method: ALLOWED_METHODS.POST,
            body: { campaignName },
          });
          await useBannersStore.getState().fetchBanners();
        } catch (e) {
        } finally {
          get().setIsSkipLoading(false);
        }
      },

      fetchReferralTrackingDataViaIdentifier: debounce(
        async (identifier: String) => {
          try {
            await beCall([
              {
                url: BE_ROUTES.FETCH_REFERRAL_TRACKING_DATA_VIA_IDENTIFIER,
                method: "POST",
                body: { identifier },
                onSuccess: (response) => {
                  if (response.data) {
                    get().setUserReferralData(response.data);
                    const metrics = response.data?.referralMetrics;
                    if (metrics) {
                      get().setReferralMetrics({
                        totalReferrers: metrics.uniqueReferrersCount,
                        totalRewardValueInCrores: metrics.totalRewardValueInCrores,
                        totalGiftsAchieved: metrics.totalGiftsAchieved,
                      });
                      if (typeof metrics.daysLeft === "number") {
                        const endDate = new Date();
                        endDate.setDate(endDate.getDate() + metrics.daysLeft);
                        get().setAlexaCampaignEndDate(endDate.toISOString());
                      }
                    }
                  } else if (Router.pathname?.startsWith("/referral/")) {
                    Router.push(FE_ROUTES.LOGIN);
                  }
                },
              },
              {
                url: BFF_ROUTES.FETCH_ACTIVE_REFERRAL_PUB,
                method: ALLOWED_METHODS.POST,
                body: { identifier },
                onSuccess: (response) => {
                  if (response.data) get().setActiveCampaign(response.data as ActiveCampaign);
                },
              },
            ]);
          } catch (e) {}
        },
        500,
        { isLeading: true }
      ),

      fetchAlexaCampaignEndDate: debounce(
        async () => {
          get().setAlexaEndDateFetched(true);
          try {
            // redirect: false so a stray 403 (e.g. unauthenticated visitor
            // hitting an alexa-active surface) doesn't bounce the user to
            // /login. Public surfaces source endDate from the public BFF.
            const response = await fetchData<{ endDate?: string; daysLeft?: number } | undefined>({
              url: BFF_ROUTES.FETCH_ALEXA_15DAYS_ELIGIBILITY,
              method: ALLOWED_METHODS.GET,
              redirect: false,
            });
            const payload = response?.data;
            const endDateStr = payload?.endDate;
            const daysLeft = payload?.daysLeft;
            let endDate: string | undefined;
            if (typeof endDateStr === "string") {
              endDate = endDateStr;
            } else if (typeof daysLeft === "number") {
              const d = new Date();
              d.setDate(d.getDate() + daysLeft);
              endDate = d.toISOString();
            }
            get().setAlexaCampaignEndDate(endDate);
          } catch (e) {}
        },
        500,
        { isLeading: true }
      ),

      claimReferralReward: async (campaignName: string) => {
        set((state) => ({ ...state, isClaimLoading: true }));
        try {
          const response = await fetchData<ClaimedMilestoneProgress>({
            url: BFF_ROUTES.CLAIM_REFERRAL_REWARD,
            method: ALLOWED_METHODS.POST,
            body: { campaignName },
          });
          if (!response.success || !response.data) {
            return { success: false, message: response.message };
          }
          const claimedCampaignName = response.data.campaignName;
          get().setMilestoneProgress(claimedCampaignName, response.data);
          return { success: true, data: response.data };
        } catch (e) {
          return { success: false };
        } finally {
          set((state) => ({ ...state, isClaimLoading: false }));
        }
      },

      fetchInvoiceCount: debounce(
        async () => {
          try {
            const response = await fetchData<number>({
              method: "POST",
              url: BE_ROUTES.FETCH_INVOICE_COUNT,
            });
            get().setInvoiceCount(response.data);
          } catch (e) {}
        },
        500,
        { isLeading: true }
      ),
    }))
  )
);

export default useReferralStore;
