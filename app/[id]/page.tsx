"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { checkoutService, RegistrationInfoResponse } from "../api/checkout";

import i18n from "@/app/i18n";
import { Spinner } from "@heroui/react";

export default function CheckoutInfoPage({ params }: any) {
  const { t } = useTranslation();
  const [registrationInfo, setRegistrationInfo] =
    useState<RegistrationInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure i18n is initialized
    if (!i18n.isInitialized) {
      i18n.init();
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchRegistrationInfo = async () => {
      try {
        const data = await checkoutService.getRegistrationInfo(params.id);

        setRegistrationInfo(data);
      } catch (err) {
        setError(t("registration.checkout.error"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationInfo();
  }, [params.id, t]);

  const getStatusColor = (status: string) => {
    return status.toLowerCase() === "done" ? "text-green-500" : "text-red-500";
  };

  const getStatusIcon = (status: string) => {
    if (status.toLowerCase() === "done") {
      return (
        <svg
          className="w-24 h-24 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            animate={{ pathLength: 1 }}
            d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572"
            initial={{ pathLength: 0 }}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <motion.path
            animate={{ pathLength: 1 }}
            d="M22 4L12 14.01L9 11.01"
            initial={{ pathLength: 0 }}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>
      );
    }

    if (status.toLowerCase() === "error") {
      return (
        <svg
          className="w-24 h-24 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            animate={{ pathLength: 1 }}
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            initial={{ pathLength: 0 }}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <motion.path
            animate={{ pathLength: 1 }}
            d="M15 9L9 15"
            initial={{ pathLength: 0 }}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.path
            animate={{ pathLength: 1 }}
            d="M9 9L15 15"
            initial={{ pathLength: 0 }}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
          />
        </svg>
      );
    }

    return (
      <svg
        className="w-24 h-24 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          animate={{ pathLength: 1 }}
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          initial={{ pathLength: 0 }}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <motion.path
          animate={{ pathLength: 1 }}
          d="M15 9L9 15"
          initial={{ pathLength: 0 }}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.path
          animate={{ pathLength: 1 }}
          d="M9 9L15 15"
          initial={{ pathLength: 0 }}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
        />
      </svg>
    );
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon("error")}
          </div>
          <div className="text-red-500 text-xl">
            {t("registration.checkout.error")}
          </div>
        </div>
      </div>
    );
  }

  if (!registrationInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-xl bg-white p-8 rounded-2xl shadow-lg">
          {t("registration.checkout.noInfo")}
        </div>
      </div>
    );
  }

  const isSuccess = registrationInfo.payment_status.toLowerCase() === "done";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Status Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden lg:w-1/3 h-fit">
            <div className="flex justify-between items-center  bg-blue-200 p-6 border-b border-gray-100">
              <Image alt="logo" height={80} src="/ONEPAY.png" width={100} />
            </div>
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                {getStatusIcon(registrationInfo.payment_status)}
              </div>
              <h2
                className={`text-2xl font-bold ${getStatusColor(registrationInfo.payment_status)} mb-2`}
              >
                {isSuccess
                  ? t("registration.checkout.paymentSuccess")
                  : t("registration.checkout.paymentFailed")}
              </h2>
              <p className="text-gray-500">
                {t("registration.checkout.registrationId")}:{" "}
                {registrationInfo.id}
              </p>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  {t("fees.title")}
                </h3>
                <div className="bg-indigo-50 rounded-xl p-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center border-b pb-4">
                      <span className="text-gray-600">{t("fees.usd")}</span>
                      <span className="font-medium bg-indigo-50 text-indigo-700">
                        ${registrationInfo.RegistrationOption.fee_usd}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t("fees.vnd")}</span>
                      <span className="font-medium bg-indigo-50 text-indigo-700">
                        {registrationInfo.RegistrationOption.fee_vnd.toLocaleString()}{" "}
                        VND
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Details */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden lg:w-2/3">
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-200 to-indigo-100 p-6 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-700 text-xl">
                  {t("registration.checkout.title")}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {t("registration.checkout.subtitle")}
                </p>
              </div>
            </div>

            <div className="p-6 lg:p-8 space-y-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("registration.form.lastName")}
                      </span>
                      <span className="font-medium">
                        {registrationInfo.last_name}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("registration.form.middleName")}
                      </span>
                      <span className="font-medium">
                        {registrationInfo.middle_name}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("registration.form.firstName")}
                      </span>
                      <span className="font-medium">
                        {registrationInfo.first_name}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("registration.form.email")}
                      </span>
                      <span className="font-medium">
                        {registrationInfo.email}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("registration.form.phone")}
                      </span>
                      <span className="font-medium">
                        {registrationInfo.phone_number}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("registration.form.dob")}
                      </span>
                      <span className="font-medium">
                        {registrationInfo.date_of_birth}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("registration.form.nationality")}
                      </span>
                      <span className="font-medium">
                        {registrationInfo.nationality}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("registration.categories.title")}
                      </span>
                      <span className="font-medium">
                        {registrationInfo.registration_category}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("registration.doctorate.title")}
                      </span>
                      <span className="font-medium">
                        {registrationInfo.doctorate_degree}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("registration.form.institution")}
                      </span>
                      <span className="font-medium">
                        {registrationInfo.institution}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("registration.form.sponsor.title")}
                      </span>
                      <span className="font-medium">
                        {registrationInfo.sponsor || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("registration.checkout.paymentStatus")}
                      </span>
                      <span
                        className={`font-medium ${getStatusColor(registrationInfo.payment_status)}`}
                      >
                        {isSuccess
                          ? t("fees.status.success")
                          : t("fees.status.failed")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
