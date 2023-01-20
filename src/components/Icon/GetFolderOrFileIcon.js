import i18n from "i18next";

export const getBackButtonOrFolderOrFileIcon = (value, isDir) => {

  if (value === 'BackToParent') {
    return <i className='fas fa-arrow-left ava-list-icon' role='img'/>;
  } else if (isDir) {
    return (
      <i
        className='fas fa-folder-open ava-list-icon'
        role='img'
        data-cy={'folder-link'}
        aria-label={ i18n.t('folder') }
      />
    );
  }
  return (
    <i
      className='fas fa-file ava-list-icon'
      role='img'
      aria-label={ i18n.t('file') }
    />
  );
};