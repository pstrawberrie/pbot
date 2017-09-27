module.exports = (data) => {

  const user = data.name;
  const msg = data.message;
  const date = data.date;

  console.log('Message Entry:');
  console.log(user + ' / ' + msg);

}
