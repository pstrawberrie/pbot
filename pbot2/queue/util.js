exports.validMessage = (message) => {
  if(message != '' && message.substr(0,1) === '!' && message.split(' ').length <= 3)
  return true;
}
