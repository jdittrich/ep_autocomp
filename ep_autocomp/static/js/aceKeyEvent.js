exports.aceKeyEvent = function (type, context, cb) {
	var returnvalue = autocomp.aceKeyEvent(type, context); //returnvalue should be true if the event was handled. FUD
	return[returnvalue];
    
	//TODO: unsure: do we need to return anything here? return [1] was fiddled with by me e.g. ....
};
