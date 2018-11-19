// validating Email
function validateEmail() {
  const emailID = document.getElementById('#email');
  const passID = document.getElementById('#pass');
  const atpos = emailID.indexOf('@');
  const dotpos = emailID.lastIndexOf('.');


  if (emailID === '' && passID === '') {
    console.log('Both Field must be Filled');
  }
  if (atpos < 1 || (dotpos - atpos < 2)) {
    console.log('Please enter correct email ID');
    document.login.email.focus();
    return false;
  }
  // Check password Length
  if (passID.length < 8) {
    console.log('Password must have at least 8 Characters');
  }
  return (true);
}
