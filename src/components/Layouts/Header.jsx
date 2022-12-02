import React, { useEffect, useRef, Fragment } from 'react';
import { useLocation } from 'react-router';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import logo from '../../img/vayla_sivussa_fi_sv_rgb.png';
import logo_en from '../../img/logo_en.png';

const Header = props => {
  const ref = useRef(null);
  const { pathname } = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    ref.current?.focus();
  }, [pathname]);

  return (
    <Fragment>
      <div id='top' className='accessibility-shortcuts' ref={ref} tabIndex={-1}>
        {props.children}
        <a href='AVA/src/components/Layouts/Header#header' className='sr-only sr-only-focusable'>
          {t('go_to_header')}
        </a>
        <a href='AVA/src/components/Layouts/Header#content' className='sr-only sr-only-focusable'>
          {t('go_to_content')}
        </a>
        <a href='AVA/src/components/Layouts/Header#footer' className='sr-only sr-only-focusable'>
          {t('go_to_footer')}
        </a>
      </div>
      <div className='page-wrapper'>
        <div className='header'>
          <div className='logo'>
            <a href='https://www.vayla.fi' id='page-top'>
              <img
                src={i18n.language === 'en' ? logo_en : logo}
                alt={t('ftia_full')}
              />
            </a>
          </div>
          <div className='lang-buttons' id='header'>
            <button
              className='lang-btn'
              onClick={() => i18n.changeLanguage('fi')}
            >
              Suomi
            </button>
            <button
              className='lang-btn'
              onClick={() => i18n.changeLanguage('sv')}
            >
              Svenska
            </button>
            <button
              className='lang-btn'
              onClick={() => i18n.changeLanguage('en')}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Header;
