export const getUserType = (type: any) => {
    console.log(type)

    let userType;

    switch (type) {
        case "USER_ADMIN":
            userType = "Company"
            break;
        case "USER":
            userType = "Individual"
            break;
        case "EMPLOYEE":
            userType = "Employee"
            break;
        case "SUPER_ADMIN":
            userType = "Super Admin"
            break;
        default:
            userType = "-"
    }

    return userType;
};