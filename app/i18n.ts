import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
const enTranslations = {
    registration: {
        title: "Registration Form",
        subtitle: "Please fill in all required fields",
        categories: {
            title: "Academic  titles and degrees",
            ent: "ENT Doctors",
            student: "Resident & Trainee",
            chairman: "Chairman & Speaker"
        },
        doctorate: {
            title: "Doctorate Degree",
            prof_md_phd: "Prof. M.D, Ph.D",
            aprof_md_phd: "A/Prof. M.D, Ph.D",
            dr_md_phd: "Dr. M.D, Ph.D",
            dr_md: "Dr. M.D",
            dr: "Dr.",
            prof: "Professor",
            md: "Medical Doctor",
            phd: "PhD",
            other: "Other"
        },
        form: {
            nationality: "Nationality",
            firstName: "First Name",
            middleName: "Middle Name",
            lastName: "Last Name",
            dob: "Date of Birth",
            institution: "Institution",
            email: "Email",
            phone: "Phone Number",
            sponsor: {
                title: "Sponsor",
                subtitle: "If you have a sponsor, please enter their name",
                placeholder: "Enter sponsor name"
            },
            gala: {
                title: "Gala Dinner",
                subtitle: "Join us for the special gala dinner event (100 USD)"
            },
            submit: "Go to payment",
            processing: "Processing...",
            success: "Registration successful! Redirecting to payment...",
            error: "Registration failed. Please try again.",
            apiError: {
                title: "Error occurred!",
                description: "Please check your personal information. Each person is only allowed to register once."
            },
            required: "Required field"
        },
        validation: {
            category: "Please select a registration category",
            doctorate: "Please select your doctorate degree",
            firstName: "First name must be 2-50 letters",
            lastName: "Last name must be 2-50 letters",
            dob: "Please select your date of birth",
            institution: "Please enter your institution",
            email: "Please enter a valid email address",
            phone: "Please enter a valid phone number",
            nationality: "Please enter your nationality",
            middleName: "Please enter your middle name"
        },
        checkout: {
            title: "Registration Information",
            subtitle: "Complete registration details",
            registrationId: "Registration ID",
            paymentStatus: "Payment Status",
            paymentSuccess: "Payment Successful",
            paymentFailed: "Payment Failed",
            noInfo: "No registration information found",
            loading: "Loading registration information...",
            error: "Failed to load registration information"
        },
        price: {
            title: "Registration Fee",
            loading: "Loading price information...",
            subtype: "Registration Type",
            select_category: "Please select a registration category",
            error: {
                title: "Error Loading Price",
                description: "Failed to load price information. Please try again."
            }
        },
        total: {
            title: "Total Registration Fee",
            includes: "Fee includes:",
            conference: "Conference registration fee",
            gala: "Gala dinner",
            free: "Free"
        }
    },
    fees: {
        title: "Registration Fee",
        early: {
            title: "Early Bird",
            subtitle: "Until March 31, 2025",
            price: "500 USD"
        },
        standard: {
            title: "Standard",
            subtitle: "April 1 - May 31, 2025",
            price: "600 USD"
        },
        onsite: {
            title: "On-site",
            subtitle: "After June 1, 2025",
            price: "700 USD"
        },
        delegate: "Doctor",
        accommodation: {
            title: "Resident & Trainee",
            price: "300 USD"

        },
        gala: {
            title: "Gala Dinner",
            price: "100 USD"
        },
        note: "All fees are in USD",
        status: {
            success: "Success",
            failed: "Failed"
        }
    }
};

const viTranslations = {
    registration: {
        title: "Đăng Ký Tham Dự",
        subtitle: "Vui lòng điền đầy đủ thông tin bắt buộc",
        categories: {
            title: "Loại Đăng Ký",
            ent: "Bác sĩ Tai Mũi Họng",
            student: "Bác sĩ nội trú",
            chairman: "Chủ tịch & Giảng viên"
        },
        doctorate: {
            title: "Học Vị",
            prof_md_phd: "GS.TS. Bác sĩ",
            aprof_md_phd: "PGS.TS Bác sĩ",
            dr_md_phd: "TS. Bác sĩ",
            dr_md: "Bác sĩ",
            dr: "Bác sĩ",
            prof: "Giáo sư",
            md: "Bác sĩ Y khoa",
            phd: "Tiến sĩ",
            other: "Khác"
        },
        form: {
            nationality: "Quốc tịch",
            firstName: "Tên",
            middleName: "Tên đệm",
            lastName: "Họ",
            dob: "Ngày sinh",
            institution: "Cơ quan",
            email: "Email",
            phone: "Số điện thoại",
            sponsor: {
                title: "Người bảo trợ",
                subtitle: "Nếu có người bảo trợ, vui lòng nhập tên",
                placeholder: "Nhập tên người bảo trợ"
            },
            gala: {
                title: "Gala Dinner",
                subtitle: "Tham gia bữa tiệc gala đặc biệt (1.000.000 VND)"
            },
            submit: "Thanh toán",
            processing: "Đang xử lý...",
            success: "Đăng ký thành công! Đang chuyển hướng đến trang thanh toán...",
            error: "Đăng ký thất bại. Vui lòng thử lại.",
            apiError: {
                title: "Có lỗi xảy ra!",
                description: "Hãy kiểm tra lại thông tin cá nhân. Mỗi người chỉ được phép đăng kí 1 lần"
            },
            required: "Trường bắt buộc"
        },
        validation: {
            category: "Vui lòng chọn loại đăng ký",
            doctorate: "Vui lòng chọn học vị",
            firstName: "Tên phải từ 2-50 ký tự",
            lastName: "Họ phải từ 2-50 ký tự",
            dob: "Vui lòng chọn ngày sinh",
            institution: "Vui lòng nhập tên cơ quan",
            email: "Vui lòng nhập email hợp lệ",
            phone: "Vui lòng nhập số điện thoại hợp lệ",
            nationality: "Vui lòng nhập quốc tịch",
            middleName: "Vui lòng nhập tên đệm"
        },
        checkout: {
            title: "Thông tin đăng ký",
            subtitle: "Chi tiết đăng ký đầy đủ",
            registrationId: "Mã đăng ký",
            paymentStatus: "Trạng thái thanh toán",
            paymentSuccess: "Thanh toán thành công",
            paymentFailed: "Thanh toán thất bại",
            noInfo: "Không tìm thấy thông tin đăng ký",
            loading: "Đang tải thông tin đăng ký...",
            error: "Không thể tải thông tin đăng ký"
        },
        price: {
            title: "Phí đăng ký",
            loading: "Đang tải thông tin giá...",
            subtype: "Loại đăng ký",
            select_category: "Vui lòng chọn loại đăng ký",
            error: {
                title: "Lỗi tải giá",
                description: "Không thể tải thông tin giá. Vui lòng thử lại."
            }
        },
        total: {
            title: "Tổng phí đăng ký",
            includes: "Phí bao gồm:",
            conference: "Phí tham dự hội nghị",
            gala: "Phí tham dự gala dinner",
            free: "Miễn phí"
        }
    },
    fees: {
        title: "Chi phí tham dự",
        early: {
            title: "Đăng ký sớm",
            subtitle: "Đến 31/03/2025",
            price: "1.800.000 VND"
        },
        standard: {
            title: "Đăng ký thường",
            subtitle: "01/04 - 31/05/2025",
            price: "2.200.000 VND"
        },
        onsite: {
            title: "Đăng ký tại chỗ",
            subtitle: "Sau 01/06/2025",
            price: "3.000.000 VND"
        },
        delegate: "Đại biểu tham dự",
        accommodation: {
            title: "Nội trú",
            price: "1.500.000 VND"
        },
        gala: {
            title: "Gala Dinner",
            price: "1.000.000 VND"
        },
        note: "Tất cả phí được tính bằng đồng Việt Nam (VND)",
        status: {
            success: "Thành công",
            failed: "Thất bại"
        }
    }
};

// Create i18n instance
const i18nInstance = i18n.createInstance();

// Initialize i18next
i18nInstance
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslations },
            vi: { translation: viTranslations }
        },
        lng: 'vi', // default language
        fallbackLng: 'vi',
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false // This is important for client-side rendering
        }
    });

export default i18nInstance; 