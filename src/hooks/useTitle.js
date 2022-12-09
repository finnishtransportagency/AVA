import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export const useTitle = folder => {
  const [title, setTitle] = useState('');
  const { t } = useTranslation();
  // TODO refactor title creation to new custom hook
  useEffect(() => {
    let title = `${ folder ?? t('heading') }`;
    if (title === 'ava') {
      title = `${ t('heading') }`;
    }
    title = title.replace('ava', '');

    document.title = title;
    setTitle(title);
  }, [ folder, t ]);
  return title
};