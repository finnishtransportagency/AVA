import { useTranslation } from "react-i18next";

export const GetBtnNextAriaLabel = (pageSize, totalRows) => {
  const { t } = useTranslation();

  return pageSize.current !== null || totalRows.current !== null
    ? `${ t('showing') }: ` +
    pageSize.current.textContent +
    '/' +
    totalRows.current.textContent +
    `. ${ t('show_more') }. `
    : `${ t('show_more') }. `;
};