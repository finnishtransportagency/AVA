import React from 'react';
import { withRouter } from 'react-router-dom';
import { config } from '../App';

export const Cell = props => {
  const [indexHTML, setIndexHTML] = React.useState(null);

  React.useEffect(() => {
    fetch(`${config.apiUrlFolders}/${props.value}`)
      .then(res => res.json())
      .then(data => {
        const index = data?.aineisto?.find(row =>
          row.tiedosto.includes('index.html')
        );

        if (!index) {
          return;
        }

        fetch(`${config.apiUrlFolders}/${index.tiedosto}`)
          .then(res => res.json())
          .then(data => setIndexHTML(data.url))          
      });
  }, [indexHTML, props]);

  if (indexHTML !== null) {
    return (
      <span tabIndex='0' title={props.value}>
        {/* 0{getIndexSize()}1{props.size}2{props.value}3 */}-
      </span>
    );
  }

  return <ClickableCellRendererModified {...props} />;
};

const ClickableCellRendererModified = props => {

  const GetLink = () => {

    const GetModifiedDate = () => {
      var d = new Date(props.data.lastmodified),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = '' + d.getHours(),
        minute = '' + d.getMinutes();

      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;
      if (hour.length < 2) 
          hour = '0' + hour;
      if (minute.length < 2) 
          minute = '0' + minute;

      return [day, month, year].join('-') + ' ' + [hour, minute].join(':');
    }

    if (props.value === 'BackToParent') {
      return ('');
    } else if (!props.data.onkohakemisto) {
      return (
        <span tabIndex='0' title={props.value}>
          {GetModifiedDate()}
        </span>
      );
    }
    return (
      <span tabIndex='0' title={props.value}>
        {GetModifiedDate()}
      </span>
    );
  };

  return <div className='data-wrapper'>{GetLink()}</div>;
};

export default withRouter(Cell);