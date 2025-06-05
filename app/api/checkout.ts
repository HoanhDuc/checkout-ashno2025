"use client";
import axiosInstance from "@/app/api/axios";
export interface RegistrationRequestBody {
    date_of_birth?: string | null;
    doctorate_degree?: string | null;
    email?: string | null;
    first_name?: string | null;
    institution?: string | null;
    last_name?: string | null;
    middle_name?: string | null;
    nationality?: string | null;
    phone_number?: string | null;
    registration_category?: string | null;
    sponsor?: string | null;
    attend_gala_dinner: boolean | null;
    registration_type?: string | null;
    registration_option?: string | null;
}

export interface RegistrationOption {
    id: string;
    createdAt: string;
    updatedAt: string;
    category: string;
    subtype: string;
    fee_usd: number;
    fee_vnd: number;
    active: boolean;
}

export interface RegistrationInfoResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    registration_option_id: string;
    RegistrationOption: RegistrationOption;
    registration_category: string;
    nationality: string;
    doctorate_degree: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    date_of_birth: string;
    institution: string;
    email: string;
    phone_number: string;
    sponsor: string;
    payment_status: string;
}

export interface RegistrationOptionResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    category: string;
    subtype: string;
    fee_usd: number;
    fee_vnd: number;
    active: boolean;
}

export const checkoutService = {
    async register(body: RegistrationRequestBody): Promise<{
        payment_url: string;
        user_id: string;
    }> {
        try {
            const response = await axiosInstance.post("/register", body);
            return response.data;
        } catch (error) {
            console.error("Register failed:", error);
            throw error;
        }
    },
    async getRegistrationInfo(userId: string): Promise<RegistrationInfoResponse> {
        try {
            const response = await axiosInstance.get(
                `/register/${userId}/registration-info`
            );

            return response.data;
        } catch (error) {
            console.error("Get registration info failed:", error);
            throw error;
        }
    },
    async getRegistrationOption(registrationOption: string, attendGalaDinner: boolean): Promise<RegistrationOptionResponse> {
        try {
            const response = await axiosInstance.get(
                `/register/option?registration_option=${encodeURIComponent(registrationOption)}&attend_gala_dinner=${attendGalaDinner}`
            );
            return response.data;
        } catch (error) {
            console.error("Get registration option failed:", error);
            throw error;
        }
    },
};
