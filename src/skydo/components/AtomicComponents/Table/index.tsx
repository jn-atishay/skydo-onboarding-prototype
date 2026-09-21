import { useState } from "react";
import classNames from "classnames";
import classnames from "classnames";
import Typography from "../Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import { TableColumn } from "../../../types/atomicComponentTypes";
import { formatIncomingCurrency, formatUTCDate } from "../../../util/formatters";
import Link from "next/link";
import CheckBox from "../CheckBox";

interface Props {
  wrapperClass?: string;
  headerClass?: string;
  rightCTAs?: () => void;
  headerTypography?: string;
  title?: string | JSX.Element;
  columns: TableColumn[];
  data: any[];
  onRowClick?: (data: any) => void;
  isCustomRow?: (data: any) => boolean;
  rowRenderer?: (data: any) => JSX.Element;
  customTableRowClass?: string;
  tableHeaderClass?: string;
  isInteractive?: (data: any) => boolean;
  conditionalRowClass?: (data: any) => string;
  rowIdFormatter?: (data: any) => string;
  tableClass?: string;
  theadClass?: string;
  bodyClass?: string;
  customTableDataClass?: string;
  tableTourId?: string;
  getHrefForRow?: (data: any) => string;
  isMultiSelect?: boolean;
  checkboxSelectedRows?: { [key: string]: boolean };
  checkBoxDataKey?: string;
  onGlobalCheckboxClick?: (checked: boolean) => void;
  onRowCheckboxClick?: (index: number, rowData: any) => void;
  isCheckboxDisabled?: (rowData: any) => boolean;
  isTimeZoneHandle?: boolean;
  /** When true, clicked row does not get blue background highlight */
  disableSelectedRowHighlight?: boolean;
}

const Table = (props: Props) => {
  const {
    wrapperClass,
    headerClass,
    headerTypography,
    title,
    isCustomRow,
    rowRenderer,
    rightCTAs,
    columns,
    data,
    customTableRowClass,
    onRowClick = () => {},
    tableHeaderClass,
    isInteractive,
    conditionalRowClass,
    rowIdFormatter,
    tableClass,
    theadClass,
    bodyClass,
    customTableDataClass,
    tableTourId,
    getHrefForRow,
    isMultiSelect,
    checkboxSelectedRows,
    checkBoxDataKey,
    onGlobalCheckboxClick,
    onRowCheckboxClick,
    isCheckboxDisabled,
    isTimeZoneHandle,
    disableSelectedRowHighlight,
  } = props;

  // By default, row should in interactive
  const isInteractiveRow = isInteractive || ((data: any) => true);

  const getRowDataValue = (rowData: any, dataKey: string = "") => {
    const keys = dataKey.split(".");
    let finalValue = { ...rowData };
    keys.forEach((key) => {
      finalValue = (finalValue && finalValue[key]) || "";
    });
    return finalValue;
  };

  const [selectedRow, setSelectedRow] = useState<number>(-1);

  const isAllRowSelected = () => {
    if (!isMultiSelect) return false;
    if (!checkboxSelectedRows || Object.keys(checkboxSelectedRows).length === 0) return false;
    const isAnyRowNotSelected = data.some((row) => {
      const checkBoxValue = getRowDataValue(row, checkBoxDataKey);
      if (!checkboxSelectedRows?.[checkBoxValue]) return true;
    });
    return !isAnyRowNotSelected;
  };

  const renderTableRow = (rowData: any, index: number) => {
    if (!rowData) return null;
    const dataIndexValue = index;
    const checkboxValue = getRowDataValue(rowData, checkBoxDataKey);
    const isRowSelected = checkboxSelectedRows?.[checkboxValue];
    const rowContent = () => {
      return (
        <>
          {isCustomRow && rowRenderer && isCustomRow(rowData) ? (
            rowRenderer(rowData)
          ) : (
            <>
              {isMultiSelect && onRowCheckboxClick ? (
                <td>
                  <CheckBox
                    containerClass={"flex items-center justify-center h-full"}
                    checkboxClass={"!w-5 !h-5"}
                    checked={isCheckboxDisabled?.(rowData) ? false : !!isRowSelected}
                    isDisabled={isCheckboxDisabled?.(rowData)}
                    onCheckboxClick={() => onRowCheckboxClick(index, rowData)}
                  />
                </td>
              ) : null}
              {columns.map((column: TableColumn, index) => {
                const { dataKey, currencyDataKey, widthClass, formattedCellData, isMoney, isDate, ctas } = column;
                if (ctas && ctas.length !== 0) {
                  return (
                    <td
                      key={`${dataKey}${index}`}
                      className={classNames(
                        "flex items-center justify-end text-left flex-1",
                        customTableDataClass,
                        widthClass
                      )}
                    >
                      {ctas.map((cta) => cta(rowData))}
                    </td>
                  );
                }
                let value = getRowDataValue(rowData, dataKey);
                const currency = getRowDataValue(rowData, currencyDataKey);
                value = isMoney ? formatIncomingCurrency(value, currency) : value;
                value =
                  isDate && value
                    ? 
                    isTimeZoneHandle === false
                      ? formatUTCDate(value):
                     new Intl.DateTimeFormat("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }).format(new Date(value))
                    : value;

                return (
                  <td
                    key={`${dataKey}${index}`}
                    className={classNames("flex items-center text-left flex-1", customTableDataClass, widthClass)}
                  >
                    {formattedCellData ? (
                      formattedCellData(rowData, dataIndexValue, selectedRow === dataIndexValue)
                    ) : (
                      <Typography text={value} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"cursor-pointer"} />
                    )}
                  </td>
                );
              })}
            </>
          )}
        </>
      );
    };
    return (
      <tr
        id={rowIdFormatter ? rowIdFormatter(rowData) : ""}
        key={`${rowData.id}${index}`}
        className={classnames(
          "flex bg-white pl-6 pr-4 min-h-[48px] justify-center border-b border-black-400 last:border-b-0 last:rounded-b-10px group",
          customTableRowClass,
          isInteractiveRow && isInteractiveRow(rowData) ? "hover:shadow-headerShadow hover:scale-100" : "",
          !disableSelectedRowHighlight && selectedRow === index ? "!bg-blue-200" : "",
          conditionalRowClass ? conditionalRowClass(rowData) : ""
        )}
        onClick={() => {
          onRowClick(rowData);
          if (isInteractive?.(rowData)) setSelectedRow(index);
        }}
        data-tour={dataIndexValue === 0 ? tableTourId : ""}
      >
        {getHrefForRow && getHrefForRow(rowData) ? (
          <Link href={getHrefForRow(rowData)} onClick={(e) => e.preventDefault()}>
            <a className={"flex flex-1"}>{rowContent()}</a>
          </Link>
        ) : (
          rowContent()
        )}
      </tr>
    );
  };

  return (
    <div className={classNames("", wrapperClass)}>
      {title ? (
        // @ts-ignore
        <div className={classNames("flex_row_item_center justify-between mb-6", headerClass)}>
          <Typography
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.SMALL}
            text={title}
            textClasses={headerTypography ? headerTypography : ""}
          />
          {rightCTAs ? rightCTAs() : null}
        </div>
      ) : null}
      <table className={classNames("w-full", tableClass)}>
        <thead className={theadClass}>
          <tr
            className={classnames(
              "flex bg-blue-50 rounded-t-10px pl-6 pr-4 h-12 justify-center border-b border-black-400 sticky top-12 gap-x-2",
              tableHeaderClass
            )}
          >
            {isMultiSelect ? (
              <th>
                <CheckBox
                  containerClass={"flex items-center justify-center h-full"}
                  checkboxClass={"!w-5 !h-5"}
                  checked={isAllRowSelected()}
                  onCheckboxClick={(event) => onGlobalCheckboxClick?.(event.target.checked)}
                />
              </th>
            ) : null}
            {columns.map((column: TableColumn, index) => {
              const { dataKey, headerTitle, widthClass, headerTextClass } = column;
              return (
                <th key={`${dataKey}${index}`} className={classNames("flex items-center text-left flex-1", widthClass)}>
                  <Typography
                    text={headerTitle}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={headerTextClass}
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className={bodyClass}>
          {data.map((rowData: any, index) => {
            return renderTableRow(rowData, index);
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
