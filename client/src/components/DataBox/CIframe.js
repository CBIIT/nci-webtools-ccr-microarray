import React, { useEffect } from 'react';

export default function CIframe(props) {
  useEffect(() => {
    props.showLoading('Loading Plot ...');
  });

  return (
    <div>
      <iframe
        onLoad={props.onLoadComplete}
        title={props.title}
        src={props.link}
        width={'100%'}
        height={'980px'}
        frameBorder={'0'}
        scrolling="yes"
      />
    </div>
  );
}
