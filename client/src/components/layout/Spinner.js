import spin from '../../img/spinning.gif';
import React, { Fragment } from 'react';

export default () => (
    <Fragment>
        <img
            src={spin}
            style={{ width: '200px', margin: 'auto', display: 'block' }}
            alt='Loading...' />
    </Fragment>
);