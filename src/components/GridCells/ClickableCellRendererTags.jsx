import React from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from "react-toastify";

export const Cell = props => {
    return <ClickableCellRendererTags { ...props } />;
};


function resolveTagName(tag) {
    
    switch (tag.key) {
        case 'x':
            return 'X-koordinaatti';
        case 'y':
            return 'Y-koordinaatti';
        case 'transport_type':
            return 'Väylämuoto';
        case 'material_type':
            return 'Aineistolaji';
        
        default:
            return tag.key;
    }
}

function getTitle(props) {
    let title = '';
    props?.data?.tags?.tags?.forEach((tag, index) => {
        title += resolveTagName(tag) + '=' + tag.value + ',\n';
    });
    return title;
}

function copyToClickboard(props) {
    const title = getTitle(props);
    navigator.clipboard.writeText(title)
    toast.success('Tägit kopioitu leikepöydälle' + title, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

function getDefaultElement(props) {
    return (
        <span tabIndex='0' title={ getTitle(props) } onClick={ () => {
            copyToClickboard(props);
        } }>
          {
              props?.data?.tags?.tags?.map((tag, index) => {
                  return <>
                      <span key={ index } className='tag'>
                            { resolveTagName(tag) }={ tag.value },
                      </span>
                  </>
              })
          }
        </span>
    );
}

const ClickableCellRendererTags = props => {
    
    const GetLink = () => {
        if (props.value === 'BackToParent') {
            return <span tabIndex='0'>
            </span>
        } else if (!props.data.onkohakemisto) {
            return getDefaultElement(props);
        }
        return getDefaultElement(props);
    };
    
    return <div className='data-wrapper'>{ GetLink() }</div>;
};

export default withRouter(Cell);