module.exports = function extractPassportDetails(text) {
  const details = {};

  const fields = {
    passportNumber: /Passport No:\s+([A-Z0-9]+)/i,
    surname: /Surname:\s+([A-Z\s]+)/i,
    givenName: /Given Name:\s+([A-Z\s]+)/i,
    nationality: /Nationality:\s+([A-Z]+)/i,
    dateOfBirth: /Date of Birth:\s+(\d{2}\/\d{2}\/\d{4})/i,
    placeOfBirth: /Place of Birth:\s+(.+)/i,
    sex: /Sex:\s+([MF])/i,
    dateOfIssue: /Date of Issue:\s+(\d{2}\/\d{2}\/\d{4})/i,
    dateOfExpiry: /Date of Expiry:\s+(\d{2}\/\d{2}\/\d{4})/i,
    placeOfIssue: /Place of Issue:\s+(.+)/i,
    fileNumber: /File Number:\s+([A-Z0-9]+)/i
  };

  for (const key in fields) {
    const match = text.match(fields[key]);
    details[key] = match ? match[1].trim() : null;
  }

  return details;
};
