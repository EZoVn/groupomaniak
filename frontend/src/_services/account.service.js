const validEmail = (inputEmail) => {
  // creation de la reg exp validation email
  let emailRegExp = new RegExp(
    `^[a-zA-Z0-9.-_]+@{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,3}$`, 'g'
  );
  if (emailRegExp.test(inputEmail)) {
    return inputEmail
  } else {
    console.error(`L'email est incomplet. Exemple : monEmail@mail.fr`);
  }
};
const verifPassword = (pass, verifPass) => {
  if (pass != verifPass) {
    console.error("Les mots de passes ne sont pas identique");
    // } else if (pass.length < 8) {
    //   console.error("Le mot de passe ne contient pas assez de caractères. Entre 8 et 35max");
    // } else if (!/[A-Z]/.test(pass)) {
    //   console.error("Il faut une lettre majuscule minimum");
    // } else if (!/[a-z]/.test(pass)) {
    //   console.error("Il faut une lettre minuscule minimum");
    // } else if (!/[0-9]/.test(pass)) {
    //   console.error("Il faut un chiffre minimum");
    // } else if (!/[!"#$%&'()*+,./:;<=>?@\^_`{|}~-]/.test(pass)) {
    //   console.error("Il faut un symbole minimum");
  }
  else return pass && verifPass;
}
export const accountService = {
  validEmail,
  verifPassword,
}