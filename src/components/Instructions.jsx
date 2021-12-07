import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback
} from 'react';
import { Link } from 'react-router-dom';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { GetBtnNextAriaLabel } from '../helpers';
import { config } from '../App';
import { AG_GRID_LOCALE_FI } from '../locale.fi.js';
import Header from './Header';

const Instructions = () => {
  // state variables
  const [gridApi, setGridApi] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(null);
  const [pageCounter, setPageCounter] = useState(1);
  const [pageTotalCount, setpageTotalCount] = useState(null);
  const [, setFilterSelectedTypes] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [srNotification, setSrNotification] = useState(false);
  const { t } = useTranslation();

  // refs
  const myGrid = useRef(null);
  const typeSelectorFilter = useRef(null);
  const pageSize = useRef(null);
  const totalRows = useRef(null);
  const showMoreBtn = useRef(null);
  const noResultsDiv = useRef(null);
  const selectedTypes = useRef(null);
  const textSearchBox = useRef(null);
  let isMounted = useRef(false);

  const notifyScreenReader = notification => {
    setSrNotification(notification);
    setTimeout(() => setSrNotification(false), 3000);
  };

  const setExternalFilterNoResultsVisibility = useCallback(() => {
    if (gridApi === null || gridApi.getDisplayedRowCount() === 0) {
      noResultsDiv.current.style.display = 'block';
      myGrid.current.eGridDiv.style.visibility = 'hidden'; // hide grid
    } else {
      noResultsDiv.current.style.display = 'none';
      myGrid.current.eGridDiv.style.visibility = 'visible'; // show grid
    }
  }, [gridApi]);

  const setRowHeight = useCallback(() => {
    if (isMobileView()) {
      gridApi.gridOptionsWrapper.gridOptions.rowHeight = 438;
    } else {
      gridApi.gridOptionsWrapper.gridOptions.rowHeight = 40;
    }
  }, [gridApi]);

  const updateResultsElement = useCallback(
    (visibleRows, rowsPerPg, total, pagingDisabled = false) => {
      if (gridApi !== null) {
        pageSize.current.textContent =
          visibleRows > rowsPerPg && !pagingDisabled ? rowsPerPg : visibleRows;
        totalRows.current.textContent = total;
      }
    },
    [gridApi]
  );

  useEffect(() => {
    document.title = t('heading');
    // run once when this view is rendered to remove
    // possible previous filters
    filterSelectedValues = [];
    dateValidFilter = false;
    filterSelectedCategory = '';
  }, [t]);

  // Init grid
  useEffect(() => {
    isMounted.current = true;
    let timeoutId = '';
    if (gridApi !== null) {
      // Show loading overlay
      gridApi.showLoadingOverlay();

      // Get data
      axios
        .get(config.apiUrlInstructions)
        .then(response => {
          if (isMounted.current) {
            windowWidth = getWindowWidth();
            setRowHeight();
            const envRowData = response.data.docs;
            setRowData(envRowData);
            let visibleRowCount = gridApi.getDisplayedRowCount();
            updateResultsElement(
              visibleRowCount,
              config.rowsPerPage,
              envRowData.length
            );

            const pageTotalCountValue = gridApi.paginationGetTotalPages(); // start value
            setpageTotalCount(pageTotalCountValue);

            setRowsPerPage(gridApi.paginationGetPageSize()); // start value

            setExternalFilterNoResultsVisibility();

            timeoutId = setTimeout(() => {
              setAgBodyViewportHeight(true);
              setShowMoreBtnVisibility(1, pageTotalCountValue);

              // Hide loading overlay
              gridApi.hideOverlay();
            }, 100);
          }
        })
        .catch(error => {
          if (showMoreBtn.current) {
            showMoreBtn.current.style.visibility = 'hidden';
          }
          console.log(error);
          // Hide loading overlay
          gridApi.hideOverlay();
        });
    }
    return () => {
      isMounted.current = false;
      clearTimeout(timeoutId);
    };
  }, [
    gridApi,
    myGrid,
    setExternalFilterNoResultsVisibility,
    setRowHeight,
    updateResultsElement
  ]);

  const refreshGridData = useCallback(() => {
    var tempData = gridApi.gridOptionsWrapper.gridOptions.rowData;
    gridApi.gridOptionsWrapper.gridOptions.api.setRowData([]);
    gridApi.gridOptionsWrapper.gridOptions.api.setRowData(tempData);
  }, [gridApi]);

  useLayoutEffect(() => {
    let layoutTimeoutId = '';
    const windowResizeHandler = () => {
      // Prevent action on mobile devices, where browser's url field is hidden on scroll and causes window resize event.
      if (windowWidth !== getWindowWidth()) {
        if (gridApi !== null) {
          windowWidth = getWindowWidth();
          setRowHeight();
          refreshGridData();
        }
        layoutTimeoutId = setTimeout(() => {
          setAgBodyViewportHeight(true);
        }, 200);
      }
    };

    window.addEventListener('resize', windowResizeHandler);
    return () => {
      window.removeEventListener('resize', windowResizeHandler);
      clearTimeout(layoutTimeoutId);
    };
  }, [gridApi, refreshGridData, setRowHeight]);

  const setAgBodyViewportHeight = resetHeight => {
    if (isMounted.current) {
      var elem = document.getElementsByClassName('ag-body-viewport')[0];
      if (resetHeight) {
        elem.style.height = 0;
      }
      elem.style.height = elem.scrollHeight + 'px';
    }
  };

  const nimiValue = params => {
    let nameData = params.data.nimi;
    let title = params.colDef.headerName;
    let fileName = params.data.tiedosto;
    let fileType = getFileType(fileName);
    let fileTypeIconClass = getFileTypeIconClass(fileType);

    const fixedFilename = fileName.split(/[\\/]/).pop();
    const fileUrl = `${config.instructionsBaseUrl}${fixedFilename}`;

    // TODO: link to actual file when API produces it
    let newLink = `<a href='${fileUrl}' title='${nameData} (${fileType.toUpperCase()})'><span class='file ${fileTypeIconClass}' role='img' aria-label='Tiedosto'></span>${nameData} (${fileType.toUpperCase()})</a>`;
    return `<div class="data-wrapper">
                <div class="data-cell mobile"><strong>${title}</strong></div>
                <div class="data-cell">${newLink}</div>
            </div>`;
  };

  const getFileType = filename => {
    var dotIdx = filename.lastIndexOf('.');
    var fileType = filename.substring(dotIdx + 1);
    return fileType;
  };

  const getFileTypeIconClass = filetype => {
    let iconFileClass = 'filetype-' + filetype;
    return iconFileClass;
  };

  const mobileCell = params => {
    let title = params.colDef.headerName;
    let data = params.data[params.colDef.field];
    return `<div class="data-wrapper">
                <div class="data-cell mobile"><strong>${title}</strong></div>
                <div class="data-cell">${data}</div>
            </div>`;
  };

  const mobileCellDate = params => {
    let title = params.colDef.headerName;
    let data = params.data[params.colDef.field];
    let outputDate = parseDate(data);
    return `<div class="data-wrapper">
                <div class="data-cell mobile"><strong>${title}</strong></div>
                <div class="data-cell">${outputDate}</div>
            </div>`;
  };

  const parseDate = dateString => {
    const date = moment(dateString);
    return date.isValid() ? date.format('DD.MM.YYYY') : '-';
  };

  function handleSearch() {
    // Show loading overlay
    gridApi.showLoadingOverlay();
    // Execute quick search filter
    gridApi.setQuickFilter(searchText);
    // Update element displaying amount of results
    let visibleRowCount = gridApi.getDisplayedRowCount();
    updateResultsElement(visibleRowCount, rowsPerPage, rowData.length, true);
    // Remove paging after filtering
    setShowMoreBtnVisibility(1, 1);
    // Current number of rows
    let currentTotalRows = rowData.length;
    gridApi.paginationSetPageSize(currentTotalRows);
    // Set grid viewport height
    setAgBodyViewportHeight(true);
    // Set .no-results element visibility
    setExternalFilterNoResultsVisibility();
    // Hide loading overlay
    gridApi.hideOverlay();
    notifyScreenReader(t('search_results_updated'));
  }

  const onBtnNextClickHandler = () => {
    // Show loading overlay
    gridApi.showLoadingOverlay();
    // Page counter
    let pageCounterValue = pageCounter + 1;
    setPageCounter(pageCounterValue);
    // Total number of pages
    let pageTotalCountValue = pageTotalCount;
    if (pageTotalCountValue === null) {
      pageTotalCountValue = gridApi.paginationGetTotalPages(); // start value
      setpageTotalCount(pageTotalCountValue);
    }
    // Current number of rows
    let currentTotalRows = pageCounterValue * config.rowsPerPage;
    gridApi.paginationSetPageSize(currentTotalRows);

    setShowMoreBtnVisibility(pageCounterValue, pageTotalCountValue);

    // Rows per page
    let rowsPerPageValue = currentTotalRows;
    if (rowsPerPageValue === null) {
      rowsPerPageValue = gridApi.paginationGetPageSize(); // start value
    }
    setRowsPerPage(rowsPerPageValue);

    // Update element displaying amount of results
    let visibleRowCount = gridApi.getDisplayedRowCount();
    updateResultsElement(visibleRowCount, rowsPerPageValue, rowData.length);

    // Empty gridData to maintain order in mobile layout after button click
    refreshGridData();

    // Set grid viewport height
    setTimeout(() => {
      setAgBodyViewportHeight(false);
    }, 100);

    // Hide loading overlay
    gridApi.hideOverlay();
  };

  const setShowMoreBtnVisibility = (pageCount, pagesTotalCount) => {
    var btn = showMoreBtn.current;
    if (pageCount < pagesTotalCount) {
      btn.style.visibility = 'visible';
      return true;
    } else {
      btn.style.visibility = 'hidden';
      return false;
    }
  };

  const getTypeSelectValues = () => {
    let items = [];

    if (rowData.length > 0) {
      let types = rowData.filter(x => x.tyyppi);
      let uniqueTypes = [];
      types.forEach(item => {
        if (uniqueTypes.indexOf(item.tyyppi) === -1) {
          uniqueTypes.push(item.tyyppi);
        }
      });
      for (let i = 0; i < uniqueTypes.length; i++) {
        items.push(
          <option key={uniqueTypes[i]} value={uniqueTypes[i]}>
            {uniqueTypes[i]}
          </option>
        );
      }
    }

    return items;
  };

  const externalFilterChanged = (event, newValue, inputElem) => {
    switch (inputElem) {
      case 'checkbox': // "Vain voimassa olevat" checkbox
        dateValidFilter = event.target.checked;
        break;
      case 'dropdown': // "Tyyppi" selector
        let val = event.target.value;
        if (val.length > 0 && filterSelectedValues.indexOf(val) === -1) {
          let nv = [...filterSelectedValues, val];
          filterSelectedValues = nv;
          setFilterSelectedTypes(nv); // must be set to update list of selected type filters
        }
        event.target.value = ''; // Set dropdown element to first option
        setTimeout(() => {
          selectedTypes.current.style.minHeight =
            selectedTypes.current.children[0].clientHeight + 'px'; // Set height of .selected-types element
        });
        break;
      case 'category': // "Kategoria" selector (Rautatiet, Tiet, Vesiväylät, Taitorakenteet, Muut)
        if (event.target.className === 'active') {
          filterSelectedCategory = '';

          let btns = document.getElementsByClassName('active');
          Array.from(btns).map(x => (x.className = ''));
        } else {
          filterSelectedCategory = newValue;

          let btns = document.getElementsByClassName('active');
          Array.from(btns).map(x => (x.className = ''));

          event.target.className = 'active';
        }
        break;
      default:
        break;
    }

    gridApi.onFilterChanged();

    let visibleRowCount = gridApi.getDisplayedRowCount();

    let rowsPerPageValue = gridApi.paginationGetPageSize();
    setRowsPerPage(rowsPerPageValue);
    // Update element displaying amount of results
    updateResultsElement(
      visibleRowCount,
      rowsPerPageValue,
      rowData.length,
      true
    );

    gridApi.paginationSetPageSize(rowData.length);

    setShowMoreBtnVisibility(1, 1); // Remove paging after filtering
    // Set .no-results element visibility
    setExternalFilterNoResultsVisibility();

    // Set grid viewport height
    setTimeout(() => {
      setAgBodyViewportHeight(true);
    }, 100);
  };

  const isExternalFilterPresent = () => {
    return true;
  };

  const doesExternalFilterPass = node => {
    if (filterSelectedCategory.length > 0) {
      if (node.data.kategoria !== filterSelectedCategory) {
        return false;
      }
    }
    if (filterSelectedValues.length > 0) {
      if (filterSelectedValues.indexOf(node.data.tyyppi) === -1) {
        return false;
      }
    }
    if (!isDateValid(node.data.voimassa)) {
      return false;
    }
    return true;
  };

  const isDateValid = date => {
    let today = Date.now();
    return dateValidFilter && typeof date === 'string'
      ? asDate(date) < today
      : true;
  };

  const getSelectedTypeFilters = () => {
    let items = [];
    if (filterSelectedValues !== undefined && filterSelectedValues.length > 0) {
      items = Object.entries(filterSelectedValues).map(typeFilter => {
        return (
          <div key={typeFilter[1]}>
            <button
              aria-label={'Poista tyyppi-filtteri ' + typeFilter[1]}
              className='button'
              onClick={() => removeTypeFilter(typeFilter[1])}
            >
              {typeFilter[1]}
            </button>
          </div>
        );
      });
    }
    return items;
  };

  const removeTypeFilter = filterName => {
    var updList = []; // Needed to update selected types list properly
    let removeIdx = filterSelectedValues.indexOf(filterName);
    filterSelectedValues.splice(removeIdx, 1);
    updList = [...filterSelectedValues];
    setFilterSelectedTypes(updList);
    // Update grid
    gridApi.onFilterChanged();
    if (updList.length === 0) {
      selectedTypes.current.style.minHeight = '0'; // Hide .selected-types elements
    }
    // Update element displaying amount of results
    let visibleRowCount = gridApi.getDisplayedRowCount();
    setAgBodyViewportHeight(true);
    // Update element displaying amount of results
    updateResultsElement(visibleRowCount, rowsPerPage, rowData.length, true);
    // Set .no-results element visibility
    setExternalFilterNoResultsVisibility();
  };

  // Helpers
  const isMobileView = () => {
    var clientWidth = window.innerWidth;
    return clientWidth <= config.mobileMaxClientWidth;
  };

  const getWindowWidth = () => {
    return window.innerWidth;
  };

  const localeTextFunc = (key, defaultValue) => {
    return AG_GRID_LOCALE_FI[key] || defaultValue;
  };

  const sortableValueGetter = params => {
    return params.data[params.colDef.field];
  };

  // const isFilterSet = () => {
  //   return (
  //     (filterSelectedValues !== null && filterSelectedValues.length > 0) ||
  //     dateValidFilter ||
  //     textSearchBox.current.value.length > 0 ||
  //     filterSelectedCategory.length > 0
  //   );
  // };

  const handleSelection = (event, newValue, element) => {
    const { value } = event.target;
    setSelectedFilter(value);
    externalFilterChanged(event, newValue, element);
  };

  // Remove row if it doesn't contain a file
  const fixedData = rowData.filter(
    row => row.tiedosto.split('/').pop().indexOf('.') > -1
  );

  return (
    <React.Fragment>
      {srNotification ? (
        <div className='sr-description' aria-live='assertive'>
          {srNotification}
        </div>
      ) : null}
      <Header>
        <a href='#filters' className='sr-only sr-only-focusable'>
          {t('go_to_filters')}
        </a>
        <a href='#result' className='sr-only sr-only-focusable'>
          {t('go_to_search_result')}
        </a>
      </Header>
      <div className='page-wrapper'>
        <div className='content-area'>
          <Link to='/' className='arrow-link'>
            {t('go_back_to_home')}
          </Link>

          <h1 tabIndex='-1' id='content'>
            {t('instruction_list')}
          </h1>
          <p tabIndex='-1'>{t('instructions_help')}</p>
        </div>

        <div className='table-wrapper'>
          <div className='header-wrapper'>
            <div className='header-row first'>
              <div className='header-cell'>
                <div
                  role='group'
                  aria-label='suodata luetteloa, voit valita yhden suodatusehdon kerrallaan'
                  className='section-selector'
                  id='filters'
                >
                  <button
                    onClick={e => handleSelection(e, 'rata', 'category')}
                    value='rata'
                    aria-pressed={selectedFilter === 'rata'}
                  >
                    {t('railways')}
                  </button>

                  <button
                    onClick={e => handleSelection(e, 'tie', 'category')}
                    value='tie'
                    aria-pressed={selectedFilter === 'tie'}
                  >
                    {t('roads')}
                  </button>

                  <button
                    onClick={e => handleSelection(e, 'vesivayla', 'category')}
                    aria-pressed={selectedFilter === 'vesivayla'}
                    value='vesivayla'
                  >
                    {t('waterways')}
                  </button>

                  <button
                    onClick={e =>
                      handleSelection(e, 'taitorakenteet', 'category')
                    }
                    aria-pressed={selectedFilter === 'taitorakenteet'}
                    value='taitorakenteet'
                  >
                    {t('skill_structures')}
                  </button>

                  <button
                    onClick={e => handleSelection(e, 'muut', 'category')}
                    value='muut'
                    aria-pressed={selectedFilter === 'muut'}
                  >
                    {t('other')}
                  </button>
                </div>
              </div>
              <div className='header-cell right'>
                <div tabIndex='-1' className='results-count active-outline'>
                  <span>{t('showing')}:</span> <span ref={pageSize}></span> /{' '}
                  <span ref={totalRows}></span>
                </div>
              </div>
            </div>
            <div className='header-row second'>
              <div className='header-cell'>
                <div className='sub-table'>
                  <div className='sub-cell mobile-align third'>
                    <div className='select-wrapper'>
                      <select
                        tabIndex='0'
                        className='input select'
                        id='filter-type-select'
                        ref={typeSelectorFilter}
                        onChange={e =>
                          externalFilterChanged(e, 'selectedType', 'dropdown')
                        }
                        aria-label='Tyyppi'
                        aria-describedby='filter-type-select-info'
                        aria-controls='selected-filter-types'
                      >
                        <option value=''>{t('select_type')}</option>
                        {getTypeSelectValues()}
                      </select>
                      <i className='fas fa-angle-down'></i>
                      <p
                        className='sr-description'
                        id='filter-type-select-info'
                      >
                        {t('filter_help')}
                      </p>
                    </div>
                    <div ref={selectedTypes} className='selected-types'>
                      <div
                        className='absolute-wrapper'
                        id='selected-filter-types'
                        role='region'
                        aria-live='polite'
                      >
                        {getSelectedTypeFilters()}
                      </div>
                    </div>
                  </div>
                  <div className='sub-cell mobile-align'>
                    <div className='valid-selector'>
                      <input
                        aria-labelledby='valid-only-label'
                        tabIndex='0'
                        className='input checkbox'
                        type='checkbox'
                        id='valid-only'
                        name='valid-only'
                        onChange={event =>
                          externalFilterChanged(event, 'validDate', 'checkbox')
                        }
                      />
                      <label
                        id='valid-only-label'
                        className='label'
                        htmlFor='valid-only'
                      >
                        {t('valid_only')}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className='header-cell wide'>
                <div className='freeword-search'>
                  <div className='input-wrapper'>
                    <input
                      ref={textSearchBox}
                      tabIndex='0'
                      className='input textbox'
                      type='text'
                      id='filter-text-box'
                      placeholder={t('search')}
                      value={searchText}
                      onChange={event => setSearchText(event.target.value)}
                    />
                    <button tabIndex='0' onClick={handleSearch}>
                      {t('filter_results')}
                    </button>
                  </div>
                </div>
              </div>
              {/* TODO: Added later? */}
              {/* <div className="header-cell right">
                                <div className="more-filters">
                                    <button tabIndex="0" className="button">Lisää rajauksia <i className="abacus-icon"></i></button>
                                </div> 
                            </div>*/}
            </div>
          </div>
        </div>

        <div
          className='ag-theme-alpine'
          style={{ height: 'auto', width: '100%' }}
          id='result'
        >
          <div
            className='no-results'
            ref={noResultsDiv}
            style={{ display: 'none' }}
          >
            {AG_GRID_LOCALE_FI.noRowsToShow}
          </div>

          <AgGridReact
            rowData={fixedData}
            rowSelection='multiple'
            onGridReady={params => setGridApi(params.api)}
            suppressColumnVirtualisation={true}
            domLayout='autoHeight'
            ref={myGrid}
            pagination={true}
            paginationPageSize={config.rowsPerPage}
            suppressPaginationPanel={true}
            isExternalFilterPresent={isExternalFilterPresent}
            doesExternalFilterPass={doesExternalFilterPass}
            localeTextFunc={localeTextFunc}
            enableSorting={true}
            overlayLoadingTemplate='<p>Ladataan...</p>'
            overlayNoRowsTemplate='<p></p>'
          >
            <AgGridColumn
              width={542}
              suppressMovable={true}
              hide={false}
              lockVisible={true}
              lockPinned={true}
              headerName={t('name')}
              field='nimi'
              cellRenderer={nimiValue}
              valueGetter={sortableValueGetter}
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn
              width={170}
              suppressMovable={true}
              hide={false}
              lockVisible={true}
              lockPinned={true}
              headerName={t('topic')}
              field='aihe'
              cellRenderer={mobileCell}
              valueGetter={sortableValueGetter}
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn
              width={100}
              suppressMovable={true}
              hide={false}
              lockVisible={true}
              lockPinned={true}
              headerName={t('type')}
              field='tyyppi'
              cellRenderer={mobileCell}
              valueGetter={sortableValueGetter}
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn
              width={99}
              suppressMovable={true}
              hide={false}
              lockVisible={true}
              lockPinned={true}
              headerName={t('identifier')}
              field='tunnus'
              cellRenderer={mobileCell}
              valueGetter={sortableValueGetter}
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn
              width={90}
              suppressMovable={true}
              hide={false}
              lockVisible={true}
              lockPinned={true}
              headerName={t('date')}
              field='pvm'
              cellRenderer={mobileCellDate}
              valueGetter={sortableValueGetter}
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn
              width={140}
              suppressMovable={true}
              hide={false}
              lockVisible={true}
              lockPinned={true}
              headerName={t('contact_person')}
              cellRenderer={mobileCell}
              valueGetter={sortableValueGetter}
              field='yhteyshenkilo'
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn
              width={110}
              suppressMovable={true}
              hide={false}
              lockVisible={true}
              lockPinned={true}
              headerName={t('valid')}
              field='voimassa'
              cellRenderer={mobileCellDate}
              valueGetter={sortableValueGetter}
              sortable={true}
              filterParams={dateFilterParams}
            ></AgGridColumn>
            <AgGridColumn
              width={112}
              suppressMovable={true}
              hide={false}
              lockVisible={true}
              lockPinned={true}
              headerName={t('updated')}
              field='paivitetty'
              cellRenderer={mobileCellDate}
              valueGetter={sortableValueGetter}
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn
              hide={true}
              suppressMovable={true}
              lockVisible={true}
              lockPinned={true}
              headerName={t('file')}
              field='tiedosto'
            ></AgGridColumn>
          </AgGridReact>
          <button
            aria-label={GetBtnNextAriaLabel(pageSize, totalRows)}
            tabIndex='0'
            style={{ visibility: 'hidden' }}
            className='btn-show-more input'
            ref={showMoreBtn}
            onClick={onBtnNextClickHandler}
          >
            {t('show more')}
          </button>
        </div>
        <div id="license-rules">
          <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
            <img src="https://licensebuttons.net/l/by/4.0/88x31.png" alt="Creative Commons License"/>
          </a>
          <span class="license-rules">
          {t('license_prefix')} <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">{t('license_postfix')}</a>
          </span>
        </div>
      </div>
    </React.Fragment>
  );
};

let filterSelectedValues = [];
let dateValidFilter = false;
let filterSelectedCategory = '';
let windowWidth;

var dateFilterParams = {
  comparator: function (filterLocalDateAtMidnight, cellValue) {
    var cellDate = asDate(cellValue);

    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
  }
};

function asDate(dateAsString) {
  var splitFields = dateAsString.split('-');
  return new Date(splitFields[0], splitFields[1] - 1, splitFields[2]);
}

export default Instructions;
