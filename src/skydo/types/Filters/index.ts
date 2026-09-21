export * from "./FilterRelatedTypes";

export enum FilterEvent {
  RE_NEST = "re_nest",
  UN_NEST = "un_nest",
}

export enum FilterType {
  SINGLE_SELECT = "SINGLE_SELECT",
  MULTI_SELECT = "MULTI_SELECT",
  NESTED = "NESTED",
}

/**
 * We only support 1 way of nesting filters for now
 */
export interface FilterSpec<T extends FilterType> {
  id: string;
  type: FilterType;
  searchable?: boolean;
  placeholder?: string;
  values: any;
  /**
   * Priority is used to sort filters in the UI
   * Filters with lower priority will be shown first
   */
  priority: number;
  extraConfig: {
    canBeNested: boolean;
    showClearAll?: boolean;
    [key: string]: any;
  };
}

export type FilterOption = {
  label: string;
  value: string | number;
  subOptions?: Array<FilterOption>;
};

export interface SingleSelect extends FilterSpec<FilterType.SINGLE_SELECT> {
  values: string | number;
  options: Array<FilterOption>;
  extraConfig: {
    canBeNested: boolean;
    showCheckbox?: boolean;
    [key: string]: any;
  };
}

export interface MultiSelect extends FilterSpec<FilterType.MULTI_SELECT> {
  values: Array<string | number>;
  options: Array<FilterOption>;
  extraConfig: {
    canBeNested: boolean;
    showSelectAll?: boolean;
    [key: string]: any;
  };
}

export interface Nested extends FilterSpec<FilterType.NESTED> {
  children: Array<SingleSelect | MultiSelect>;
  extraConfig: {
    canBeNested: false;
    [key: string]: any;
  };
}

export type Filter = SingleSelect | MultiSelect | Nested;
