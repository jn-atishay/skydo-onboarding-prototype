import { FocusedHomeComponent, FocusedHomeCompState, FocusedHomeState } from "../constants/focusedHomeConstants";
import { Events } from "../analytics/EventConstants";

export const moveActiveStateFromVkyc = (focusedHomeStates: [FocusedHomeState]): [FocusedHomeState] => {
  const isVkycStateSelected = isCompSelected(focusedHomeStates, FocusedHomeComponent.VKYC);

  if (!isVkycStateSelected) return focusedHomeStates;

  let didMoveNextOne = false;

  const vkycCompState = focusedHomeStates?.find((el) => el.component === FocusedHomeComponent.VKYC);
  if (vkycCompState) {
    vkycCompState.componentState = FocusedHomeCompState.COMPLETED;
  }

  const ttCompState = focusedHomeStates?.find((el) => el.component === FocusedHomeComponent.TEST_TRANSACTION);
  if (ttCompState) {
    if (ttCompState.componentState === FocusedHomeCompState.NOT_STARTED) {
      ttCompState.componentState = FocusedHomeCompState.IN_PROGRESS;
      didMoveNextOne = true;
    }
  }

  const intCompState = focusedHomeStates?.find((el) => el.component === FocusedHomeComponent.INT_ACCOUNTS);
  if (intCompState && !didMoveNextOne) {
    if (intCompState.componentState === FocusedHomeCompState.NOT_STARTED) {
      intCompState.componentState = FocusedHomeCompState.IN_PROGRESS;
    }
  }

  return focusedHomeStates;
};

export const moveActiveStateToPaymentMethod = (focusedHomeStates: [FocusedHomeState]): [FocusedHomeState] => {
  let ans: [FocusedHomeState] = [
    {
      component: FocusedHomeComponent.PAYMENT_METHOD,
      componentState: FocusedHomeCompState.IN_PROGRESS,
    },
  ];

  focusedHomeStates.forEach((el) => {
    if (el.component === FocusedHomeComponent.TEST_TRANSACTION) {
      ans.push({
        component: FocusedHomeComponent.TEST_TRANSACTION,
        componentState: FocusedHomeCompState.COMPLETED,
      });
    } else if (el.component !== FocusedHomeComponent.PAYMENT_METHOD) {
      ans.push({
        component: el.component,
        componentState: FocusedHomeCompState.NOT_STARTED,
      });
    }
  });

  return ans;
};

export const isCompSelected = (focusedHomeStates: [FocusedHomeState], comp: FocusedHomeComponent) => {
  return focusedHomeStates?.find((el) => el.component == comp)?.componentState == FocusedHomeCompState.IN_PROGRESS;
};

export const isCompCompleted = (focusedHomeStates: [FocusedHomeState], comp: FocusedHomeComponent): boolean => {
  return focusedHomeStates?.find((el) => el.component == comp)?.componentState == FocusedHomeCompState.COMPLETED;
};

export const getCompState = (focusedHomeStates: [FocusedHomeState], comp: FocusedHomeComponent) => {
  return focusedHomeStates?.find((el) => el.component == comp)?.componentState || FocusedHomeCompState.COMPLETED;
};

export const getEventFromStates = (focusedHomeStates: [FocusedHomeState]): string | null => {
  const selectedComp = focusedHomeStates?.find(
    (el) => el.componentState === FocusedHomeCompState.IN_PROGRESS
  )?.component;
  switch (selectedComp) {
    case FocusedHomeComponent.VKYC:
      return Events.FOCUSED_HOME.VKYC_STATE;
    case FocusedHomeComponent.TEST_TRANSACTION:
      return Events.FOCUSED_HOME.TT_STATE;
    case FocusedHomeComponent.INT_ACCOUNTS:
      return Events.FOCUSED_HOME.INT_ACC_STATE;
    case FocusedHomeComponent.INVOICE:
      return Events.FOCUSED_HOME.INV_STATE;
      case FocusedHomeComponent.PAYMENT_METHOD:
        return Events.FOCUSED_HOME.PAYMENT_METHOD_STATE;
      case FocusedHomeComponent.PAYMENT_DETAIL:
        return Events.FOCUSED_HOME.PAYMENT_DETAIL_STATE;
    default:
      return null;
  }
};
