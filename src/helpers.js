import { useTranslation } from 'react-i18next';

export const getParentPath = pathParams => {
  let backUrl = null;
  if (pathParams) {
    const paths = pathParams.split(/\//g);
    if (paths.length > 1) {
      backUrl = '/' + paths.slice(0, paths.length - 1).join('/');
    } else {
      backUrl = '/';
    }
  }
  return backUrl;
};

export const GetBtnNextAriaLabel = (pageSize, totalRows) => {
  const { t } = useTranslation();

  return pageSize.current !== null || totalRows.current !== null
    ? `${t('showing')}: ` +
        pageSize.current.textContent +
        '/' +
        totalRows.current.textContent +
        `. ${t('show_more')}. `
    : `${t('show_more')}. `;
};

