import * as React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

const BreadcrumbItem = ({ match, breadcrumb }) => {
  const { t } = useTranslation();
  let title =
    match.url === '/' ? t('homepage') : breadcrumb.props.children.toLowerCase();

  title = title.replace('ava','');
 // var uuu = {title};
  return <Link to={match.url}>{title}</Link>;
};

const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <ul className='breadcrumb'>
      {breadcrumbs.map(({ match, breadcrumb }) => (
        <li key={match.url}>
          <BreadcrumbItem match={match} breadcrumb={breadcrumb} />
        </li>
      ))}
    </ul>
  );
};

export default withBreadcrumbs()(Breadcrumbs);
