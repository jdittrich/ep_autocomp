exports.aceEditEvent = function(type, context, cb) {
  if(!context.callstack.docTextChanged) return false; // we should only run this if the pad contents is changed. If this is not done, an edit event occurs every few seconds, even without user action. 
  autocomp.aceEditEvent(type, context, cb);
};
