import React from 'react';
import { withRouter, Link, useParams } from 'react-router-dom';
import { config } from '../App';
import { useTranslation } from 'react-i18next';
import { getParentPath } from '../helpers';

const getRightSize = (size) => {
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (size == 0) return '0 B';
  
  var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
  return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export const Cell = props => {
  const [indexHTML, setIndexHTML] = React.useState(null);
  const { t } = useTranslation();

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
        {/* {getRightSize(props.data.size)}         */}-
      </span>
    );
  }

  return <ClickableCellRendererSize {...props} />;
};



const ClickableCellRendererSize = props => {
  const { folder } = useParams();


  
  const GetLink = () => {
    const { t } = useTranslation();
    const parentPath = getParentPath(folder);

    if (props.value === 'BackToParent') {
      return ('');
    } else if (!props.data.onkohakemisto) {
      return (
        <span tabIndex='0' title={props.value}>
          {getRightSize(props.data.size)}
          {/* {props.data.size} */}
        </span>
      );
    }
    return (
      <span tabIndex='0' title={props.value}>
        {getRightSize(props.data.size)}
        {/* {props.data.size} */}
      </span>
    );
  };

  return <div className='data-wrapper'>{GetLink()}</div>;
};

export default withRouter(Cell);