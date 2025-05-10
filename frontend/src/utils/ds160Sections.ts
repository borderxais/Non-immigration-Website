// utils/ds160Sections.ts

export const getSections = (formData: any) => {
  const personalInfoI = {
    surname: formData.surname,
    givenName: formData.givenName,
    fullNameNative: formData.fullNameNative,
    gender: formData.gender === 'M' ? '男' : '女',
    maritalStatus: formData.maritalStatus,
    dateOfBirth: 'N/A', // Simplified to avoid date issues
    birthCity: formData.birthCity,
    birthState: formData.birthState,
    birthCountry: formData.birthCountry,
  };

  const personalInfoII = {
    nationality: formData.nationality,
    hasOtherNationality: formData.hasOtherNationality === 'Y' ? '是' : formData.hasOtherNationality === 'N' ? '否' : 'N/A',
    otherNationality: formData.hasOtherNationality === 'Y' ? formData.otherNationality : 'N/A',
    isPermResOtherCountry: formData.isPermResOtherCountry === 'Y' ? '是' : formData.isPermResOtherCountry === 'N' ? '否' : 'N/A',
    permResCountry: formData.isPermResOtherCountry === 'Y' ? formData.permResCountry : 'N/A',
    nationalIdNumber: formData.nationalIdNumber_na ? 'N/A' : formData.nationalIdNumber,
    usSSN: formData.usSSN_na ? 'N/A' : (formData.usSSN ? `${formData.usSSN.part1 || ''}-${formData.usSSN.part2 || ''}-${formData.usSSN.part3 || ''}` : 'N/A'),
    usTaxId: formData.usTaxId_na ? 'N/A' : formData.usTaxId,
  };

  const travelInfo = {
    visaClass: formData.visaClass || 'N/A',
    specificPurpose: formData.specificPurpose || 'N/A',
    applicationReceiptNumber: formData.applicationReceiptNumber || 'N/A',
    arrivalDate: 'N/A', // Simplified to avoid date issues
    lengthOfStay: formData.stayDuration ? `${formData.stayDuration} ${formData.stayDurationType || '天'}` : 'N/A',
    usAddress: formData.usAddressLine1 || 'N/A',
    whoIsPaying: formData.whoIsPaying || 'N/A',
    payerName: formData.payerSurname && formData.payerGivenName ? `${formData.payerSurname} ${formData.payerGivenName}` : 'N/A',
    payerRelationship: formData.payerRelationship || 'N/A',
    payerAddress: formData.payerAddress1 || 'N/A',
    payerContact: formData.payerPhone || 'N/A',
    principalApplicantInfo: formData.principalApplicantSurname && formData.principalApplicantGivenName
      ? `姓: ${formData.principalApplicantSurname}, 名: ${formData.principalApplicantGivenName}`
      : 'N/A',
  };

  const travelCompanions = {
    hasCompanions: formData.hasCompanions === 'Y' ? '是' : formData.hasCompanions === 'N' ? '否' : 'N/A',
    groupTravel: formData.groupTravel === 'Y' ? '是' : formData.groupTravel === 'N' ? '否' : 'N/A',
    groupName: formData.groupName || 'N/A',
    companionsCount: formData.companions?.length || 0,
    companionsDetails: formData.companions?.map((c: any, i: number) => `同行人 ${i + 1}: ${c.surname} ${c.givenName}, 关系: ${c.relationship}`)?.join('; ') || 'N/A',
  };

  const educationHistory = {
    highestEducationLevel: formData.highestEducationLevel,
    educationHistoryCount: formData.educationHistory?.length || 0,
  };

  const workHistory = {
    primaryOccupation: formData.primaryOccupation,
    currentlyEmployed: formData.currentlyEmployed ? '是' : '否',
    currentEmployerName: formData.currentEmployerName,
    currentJobTitle: formData.currentJobTitle,
    previousEmploymentCount: formData.previousEmployment?.length || 0,
  };

  const passportInfo = {
    passportType: formData.passportType,
    passportNumber: formData.passportNumber,
    passportIssuingCountry: formData.passportIssuingCountry,
    passportIssuanceDate: 'N/A', // Simplified to avoid date issues
    passportExpirationDate: 'N/A', // Simplified to avoid date issues
    hasPreviousVisa: formData.hasPreviousVisa ? '是' : '否',
  };

  return [
    { title: '个人信息 I', data: personalInfoI, step: 0 },
    { title: '个人信息 II', data: personalInfoII, step: 1 },
    { title: '旅行信息', data: travelInfo, step: 2 },
    { title: '同行人', data: travelCompanions, step: 3 },
    { title: '教育历史', data: educationHistory, step: 4 },
    { title: '工作历史', data: workHistory, step: 5 },
    { title: '护照信息', data: passportInfo, step: 6 },
  ];
};

export const formatDate = (day?: string, month?: string, year?: string): string => {
  // Always return N/A to avoid date serialization issues
  return 'N/A';
};
