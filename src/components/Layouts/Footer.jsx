import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import logo from '../../img/vayla_alla_fi_sv_rgb.png';
import logo_en from '../../img/vaylavirasto-logo_en_rgb.png';
import { config } from "../../App";

const Footer = () => {
  const scrollTop = useRef(null);

  const { t } = useTranslation();

  useEffect(() => {
    const windowScrollHandler = () => {
      let scrolled = window.scrollY;
      let windowHeight = window.innerHeight;
      if (scrolled > windowHeight && scrollTop.current) {
        scrollTop.current.classList.add('active');
      } else {
        scrollTop.current.classList.remove('active');
      }
    };
    window.addEventListener('scroll', windowScrollHandler);
    return () => window.removeEventListener('scroll', windowScrollHandler);
  }, []);

  const scrollToTop = () => {
    let topElem = document.getElementById('page-top');
    if (topElem) {
      topElem.focus();
    }
  };

  return (
    <footer className='footer' id='footer'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-6'>
            <div className='logo'>
              <img
                src={i18n.language === 'en' ? logo_en : logo}
                alt={t('ftia_full')}
              />
            </div>
            <div className='content'>
              <p tabIndex='-1'>{t('footer_paragraph')}</p>
            </div>

            <div className='social-media-links'>
              <a
                className='footer__description__item footer_description__social__item yja-external-link'
                href='AVA/src/components/Layouts/Footer'
                title='Facebook'
                target='_blank'
                rel='noreferrer'
                aria-label='Facebook, avautuu uuteen välilehteen.'
              >
                {' '}
                <span className='fa-stack fa-2x'>
                  {' '}
                  <i className='fas fa-circle fa-stack-2x'></i>{' '}
                  <i className='fab fa-facebook-square fa-stack-1x fa-inverse'></i>{' '}
                </span>{' '}
                <span className='external-link-notification sr-only'>
                  {t('external_link')}
                </span>
              </a>
              <a
                className='footer__description__item footer_description__social__item yja-external-link'
                href='https://twitter.com/vaylafi'
                title='Twitter'
                target='_blank'
                rel='noreferrer'
                aria-label='Twitter, avautuu uuteen välilehteen.'
              >
                {' '}
                <span className='fa-stack fa-2x'>
                  {' '}
                  <i className='fas fa-circle fa-stack-2x'></i>{' '}
                  <i className='fab fab fa-twitter fa-stack-1x fa-inverse'></i>{' '}
                </span>{' '}
                <span className='external-link-notification sr-only'>
                  {t('external_link')}
                </span>
              </a>
              <a
                className='footer__description__item footer_description__social__item yja-external-link'
                href='https://instagram.com/vaylafi'
                title='Instagram'
                target='_blank'
                rel='noreferrer'
                aria-label='Instagram, avautuu uuteen välilehteen.'
              >
                {' '}
                <span className='fa-stack fa-2x'>
                  {' '}
                  <i className='fas fa-circle fa-stack-2x'></i>{' '}
                  <i className='fab fab fa-instagram fa-stack-1x fa-inverse'></i>{' '}
                </span>{' '}
                <span className='external-link-notification sr-only'>
                  {t('external_link')}
                </span>
              </a>
              <a
                className='footer__description__item footer_description__social__item yja-external-link'
                href='https://www.linkedin.com/company/vaylafi'
                title='LinkedIn'
                target='_blank'
                rel='noreferrer'
                aria-label='LinkedIn, avautuu uuteen välilehteen.'
              >
                {' '}
                <span className='fa-stack fa-2x'>
                  {' '}
                  <i className='fas fa-circle fa-stack-2x'></i>{' '}
                  <i className='fab fab fa-linkedin fa-stack-1x fa-inverse'></i>{' '}
                </span>{' '}
                <span className='external-link-notification sr-only'>
                  {t('external_link')}
                </span>
              </a>
              <a
                className='footer__description__item footer_description__social__item yja-external-link'
                href='http://flickr.com/vaylafi'
                title='Flickr'
                target='_blank'
                rel='noreferrer'
                aria-label='Flickr, avautuu uuteen välilehteen.'
              >
                {' '}
                <span className='fa-stack fa-2x'>
                  {' '}
                  <i className='fas fa-circle fa-stack-2x'></i>{' '}
                  <i className='fab fab fa-flickr fa-stack-1x fa-inverse'></i>{' '}
                </span>{' '}
                <span className='external-link-notification sr-only'>
                  {t('external_link')}
                </span>
              </a>
              <a
                className='footer__description__item footer_description__social__item yja-external-link'
                href='https://www.youtube.com/c/vaylafi'
                title='YouTube'
                target='_blank'
                rel='noreferrer'
                aria-label='YouTube, avautuu uuteen välilehteen.'
              >
                {' '}
                <span className='fa-stack fa-2x'>
                  {' '}
                  <i className='fas fa-circle fa-stack-2x'></i>{' '}
                  <i className='fab fab fa-youtube fa-stack-1x fa-inverse'></i>{' '}
                </span>{' '}
                <span className='external-link-notification sr-only'>
                  {t('external_link')}
                </span>
              </a>
            </div>
          </div>
          <div className='col-lg-6'>
            <div className='content right'>
              <h2>{t('contact_info')}</h2>
              <p tabIndex='-1'>
                {t('telephone_switch')} 0295 34 3000
                <br />
                {t('fax')} 0295 34 3700
                <br />
                {t('pasila_customer_service')} 0295 34 3003
                <br />
                {t('kirjaamo_email')}
              </p>
              <h2>{t('postal_address')}</h2>
              <p tabIndex='-1'>
                {t('ftia_full')}
                <br />
                {t('ftia_po_box')}
                <br />
                {t('ftia_zip_country')}
              </p>

              <div className='footer__contact__links'>
                <a
                  className='footer__contact__links__item'
                  href={t('accessibility_url')}
                >
                  {' '}
                  {t('accessibility')}
                </a>{' '}
                <br />
                <a
                  className='footer__contact__links__item'
                  href='https://vayla.fi/tietoa-meista/yhteystiedot/tietoa-sivustosta'
                >
                  {' '}
                  {t('about_the_site')}
                </a>{' '}
                <br />
                <a
                  className='footer__contact__links__item'
                  href='https://vayla.fi/tietoa-meista/yhteystiedot/tietosuoja'
                >
                  {' '}
                  {t('data_protection')}
                </a>{' '}
                <br />
                <a
                  className='footer__contact__links__item'
                  href='https://vayla.fi/tietoa-meista/medialle/sosiaalinen-media'
                >
                  {' '}
                  {t('social_media')}
                </a>{' '}
                <br />
                {
                  config.codeVersion !== "" ?
                    <p tabIndex='-1'>
                      { config.codeVersion }
                    </p>
                    : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        ref={scrollTop}
        className='scroll-to-top'
        onClick={scrollToTop}
        aria-label={t('back')}
        tabIndex='0'
      >
        <i className='fas fa-angle-up'></i>
      </button>
    </footer>
  );
};

export default Footer;
