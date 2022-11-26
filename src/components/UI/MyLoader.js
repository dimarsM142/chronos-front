import React from 'react';
import classes from './MyLoader.module.css';
function MyLoader({children, ...props}){
	return(
        <div className={classes.spinner}></div>
	)
}

export default MyLoader;


