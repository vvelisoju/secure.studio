export function separateUserAndCompanyDetails(data: any) {
    const company = {
        name: data.companyName,
        GSTIN: data.GSTIN,
        PAN: data.PAN,
        employeeRange: data.employeeRange,
        websiteUrl: data.websiteUrl,
        address: data.companyAddress,
    };

    const user = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        gender: data.gender,
        joiningDate: data.joiningDate,
        userType: data.userType,
    };
    return { user, company};
}

