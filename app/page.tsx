"use client";
import { useState, useEffect } from "react";
import i18n from "@/app/i18n";

import {
  Input,
  Select,
  SelectItem,
  Button,
  DatePicker,
  Spinner,
  addToast,
} from "@heroui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { getLocalTimeZone, today } from "@internationalized/date";

import { checkoutService } from "@/app/api/checkout";

const registrationCategories = [
  { label: "registration.categories.ent", value: "ENT Doctors" },
  { label: "registration.categories.student", value: "Student & Trainees" },
  { label: "registration.categories.chairman", value: "Chairman & Speaker" },
];

const doctorateDegrees = [
  { label: "registration.doctorate.prof_md_phd", value: "prof_md_phd" },
  { label: "registration.doctorate.aprof_md_phd", value: "aprof_md_phd" },
  { label: "registration.doctorate.dr_md_phd", value: "dr_md_phd" },
  { label: "registration.doctorate.dr_md", value: "dr_md" },
  { label: "registration.doctorate.dr", value: "dr" },
];

const initialState = {
  category: "",
  nationality: "",
  doctorate: "",
  firstName: "",
  middleName: "",
  lastName: "",
  dob: "",
  institution: "",
  email: "",
  phone: "",
  sponsor: "",
};

interface ValidationRule {
  required: boolean;
  message: string;
  pattern?: RegExp;
}

const validationRules: Record<keyof typeof initialState, ValidationRule> = {
  category: {
    required: true,
    message: "registration.validation.category",
  },
  doctorate: { required: true, message: "registration.validation.doctorate" },
  firstName: {
    required: true,
    pattern: /^[A-Za-z\s]{2,50}$/,
    message: "registration.validation.firstName",
  },
  lastName: {
    required: true,
    pattern: /^[A-Za-z\s]{2,50}$/,
    message: "registration.validation.lastName",
  },
  dob: { required: true, message: "registration.validation.dob" },
  institution: {
    required: true,
    message: "registration.validation.institution",
  },
  email: {
    required: true,
    pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
    message: "registration.validation.email",
  },
  phone: {
    required: true,
    pattern: /^[0-9+\-\s()]{10,15}$/,
    message: "registration.validation.phone",
  },
  nationality: {
    required: true,
    message: "registration.validation.nationality",
  },
  middleName: { required: false, message: "" },
  sponsor: { required: false, message: "" },
};

function RegistrationForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateField = (name: string, value: string) => {
    const rules = validationRules[name as keyof typeof validationRules];

    if (!rules) return "";

    if (rules.required && !value.trim()) return t(rules.message);
    if (rules.pattern && value && !rules.pattern.test(value))
      return t(rules.message);

    return "";
  };

  const validate = () => {
    const newErrors: any = {};
    let hasErrors = false;

    const allTouched = Object.keys(form).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );

    setTouched(allTouched);

    Object.keys(validationRules).forEach((field) => {
      const value = form[field as keyof typeof form];
      const error = validateField(field, value);

      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    addToast({
      title: t("registration.form.error"),
      description: "123",
      color: "danger",
    });
    e.preventDefault();
    const isValid = validate();

    if (isValid) {
      setIsSubmitting(true);
      try {
        const registrationData = {
          registration_category: form.category,
          registration_option: form.category,
          nationality: form.nationality,
          doctorate_degree: form.doctorate,
          first_name: form.firstName,
          middle_name: form.middleName,
          last_name: form.lastName,
          date_of_birth: form.dob,
          institution: form.institution,
          email: form.email,
          phone_number: form.phone,
          sponsor: form.sponsor,
          attend_gala_dinner: true,
          registration_type: "Doctor",
        };

        const response = await checkoutService.register(registrationData);

        if (response?.payment_url) {
          const url = new URL(response.payment_url);

          window.location.href = url.href;
        }
        setSubmitted(true);
        setForm(initialState);
        setErrors({});
        setTouched({});
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || t("registration.form.error");

        setErrors((prev: any) => ({
          ...prev,
          submit: errorMessage,
        }));
        addToast({
          title: t("registration.form.error"),
          description: errorMessage,
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const firstError = document.querySelector('[aria-invalid="true"]');

      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
    if (touched[field]) {
      const error = validateField(field, value);

      setErrors((prev: any) => ({ ...prev, [field]: error }));
    }
  };

  return (
    <motion.div className="pb-16 ">
      <Image
        src="/DANG-KY-THAM-DU-VN.png"
        alt="logo"
        width={1000}
        height={400}
        className="absolute top-20 left-0 mb-10 h-[200px] lg:h-[400px] w-screen mx-0 object-cover"
      />

      <div className="mt-[230px] lg:mt-[430px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fee Table */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-4 bg-gradient-to-r from-blue-200 to-indigo-100 p-4 items-center border-b border-gray-200">
              <div className="font-semibold text-gray-700 border-r border-gray-200 pr-4">
                {t("fees.title")}
              </div>
              <div className="text-center font-semibold text-gray-700 border-r border-gray-200 px-4">
                {t("fees.early.title")}
                <br />
                <span className="text-sm font-normal text-gray-500">
                  {t("fees.early.subtitle")}
                </span>
              </div>
              <div className="text-center font-semibold text-gray-700 border-r border-gray-200 px-4">
                {t("fees.standard.title")}
                <br />
                <span className="text-sm font-normal text-gray-500">
                  {t("fees.standard.subtitle")}
                </span>
              </div>
              <div className="text-center font-semibold text-gray-700 px-4">
                {t("fees.onsite.title")}
                <br />
                <span className="text-sm font-normal text-gray-500">
                  {t("fees.onsite.subtitle")}
                </span>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden bg-gradient-to-r from-blue-200 to-indigo-100 p-4 border-b border-gray-200">
              <div className="font-semibold text-gray-700 text-lg">
                {t("fees.title")}
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {/* Delegate Row */}
              <div className="md:grid md:grid-cols-4 p-4 transition-colors duration-200 items-center">
                <div className="font-medium text-gray-800 md:border-r md:border-gray-200 md:pr-4 mb-3 md:mb-0">
                  {t("fees.delegate")}
                </div>
                <div className="md:contents">
                  <div className="text-center md:border-r md:border-gray-200 md:px-4 mb-3 md:mb-0">
                    <div className="text-xs text-gray-500 mb-1 md:hidden">
                      {t("fees.early.title")}
                    </div>
                    <span className="text-sm inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium w-full md:w-auto">
                      1.800.000 VNĐ
                    </span>
                  </div>
                  <div className="text-center md:border-r md:border-gray-200 md:px-4 mb-3 md:mb-0">
                    <div className="text-xs text-gray-500 mb-1 md:hidden">
                      {t("fees.standard.title")}
                    </div>
                    <span className="text-sm inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium w-full md:w-auto">
                      2.200.000 VNĐ
                    </span>
                  </div>
                  <div className="text-center md:px-4">
                    <div className="text-xs text-gray-500 mb-1 md:hidden">
                      {t("fees.onsite.title")}
                    </div>
                    <span className="text-sm inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium w-full md:w-auto">
                      3.000.000 VNĐ
                    </span>
                  </div>
                </div>
              </div>

              {/* Accommodation Row */}
              <div className="md:grid md:grid-cols-4 p-4 transition-colors duration-200 items-center">
                <div className="font-medium text-gray-800 md:border-r md:border-gray-200 md:pr-4 mb-3 md:mb-0">
                  {t("fees.accommodation")}
                </div>
                <div className="col-span-3 text-center px-4">
                  <span className="text-sm inline-block px-6 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium w-full md:w-auto">
                    1.500.000 VNĐ
                  </span>
                </div>
              </div>

              {/* Gala Row */}
              <div className="md:grid md:grid-cols-4 p-4 transition-colors duration-200 items-center">
                <div className="font-medium text-gray-800 md:border-r md:border-gray-200 md:pr-4 mb-3 md:mb-0">
                  {t("fees.gala")}
                </div>
                <div className="col-span-3 text-center px-4">
                  <span className="text-sm inline-block px-6 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium w-full md:w-auto">
                    1.000.000 VNĐ
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 text-sm text-gray-500 text-center border-t border-gray-200">
              {t("fees.note")}
            </div>
          </div>
        </div>
        {/* Registration Form */}
        <motion.form
          noValidate
          className="bg-white border border-gray-100 dark:bg-zinc-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-200 to-indigo-100 p-4 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-700 text-lg">
                {t("registration.title")}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {t("registration.subtitle")}
              </p>
            </div>
            <Image alt="logo" height={80} src="/ONEPAY.png" width={100} />
          </div>

          <div className="p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label
                  className="font-medium text-gray-700 dark:text-gray-200"
                  htmlFor="category"
                >
                  {t("registration.categories.title")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Select
                  aria-invalid={!!errors.category && touched.category}
                  className={`mt-1 transition-all duration-200 ${
                    errors.category && touched.category
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  id="category"
                  isInvalid={!!errors.category && touched.category}
                  placeholder={t("registration.categories.title")}
                  onChange={(e) => handleChange("category", e.target.value)}
                >
                  {registrationCategories.map((cat) => (
                    <SelectItem key={cat.value} className="hover:outline-none">
                      {t(cat.label)}
                    </SelectItem>
                  ))}
                </Select>
                {errors.category && touched.category && (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1"
                    initial={{ opacity: 0, y: -10 }}
                  >
                    {t(errors.category)}
                  </motion.div>
                )}
              </div>

              <div>
                <label className="font-medium" htmlFor="nationality">
                  {t("registration.form.nationality")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  className="mt-1"
                  id="nationality"
                  isInvalid={!!errors.nationality}
                  placeholder={t("registration.form.nationality")}
                  value={form.nationality}
                  onChange={(e) => handleChange("nationality", e.target.value)}
                />
                {errors.nationality && (
                  <div className="text-xs text-red-500 mt-1">
                    {t(errors.nationality)}
                  </div>
                )}
              </div>

              <div>
                <label className="font-medium" htmlFor="doctorate">
                  {t("registration.doctorate.title")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Select
                  className="mt-1"
                  id="doctorate"
                  isInvalid={!!errors.doctorate}
                  placeholder={t("registration.doctorate.title")}
                  onChange={(e) => handleChange("doctorate", e.target.value)}
                >
                  {doctorateDegrees.map((deg) => (
                    <SelectItem key={deg.value}>{t(deg.label)}</SelectItem>
                  ))}
                </Select>
                {errors.doctorate && (
                  <div className="text-xs text-red-500 mt-1">
                    {t(errors.doctorate)}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="font-medium" htmlFor="firstName">
                  {t("registration.form.firstName")}
                </label>
                <Input
                  className="mt-1"
                  id="firstName"
                  isInvalid={!!errors.firstName}
                  placeholder={t("registration.form.firstName")}
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                />
                {errors.firstName && (
                  <div className="text-xs text-red-500 mt-1">
                    {t(errors.firstName)}
                  </div>
                )}
              </div>

              <div>
                <label className="font-medium" htmlFor="middleName">
                  {t("registration.form.middleName")}
                </label>
                <Input
                  className="mt-1"
                  id="middleName"
                  placeholder={t("registration.form.middleName")}
                  value={form.middleName}
                  onChange={(e) => handleChange("middleName", e.target.value)}
                />
              </div>

              <div>
                <label className="font-medium" htmlFor="lastName">
                  {t("registration.form.lastName")}
                </label>
                <Input
                  className="mt-1"
                  id="lastName"
                  isInvalid={!!errors.lastName}
                  placeholder={t("registration.form.lastName")}
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                />
                {errors.lastName && (
                  <div className="text-xs text-red-500 mt-1">
                    {t(errors.lastName)}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-medium" htmlFor="dob">
                  {t("registration.form.dob")}
                </label>
                <DatePicker
                  className="mt-1 w-full"
                  isInvalid={!!errors.dob}
                  maxValue={today(getLocalTimeZone()) as any}
                  showMonthAndYearPickers={true}
                  onChange={(date) =>
                    handleChange("dob", date?.toString() ?? "")
                  }
                />
                {errors.dob && (
                  <div className="text-xs text-red-500 mt-1">
                    {t(errors.dob)}
                  </div>
                )}
              </div>

              <div>
                <label className="font-medium" htmlFor="institution">
                  {t("registration.form.institution")}
                </label>
                <Input
                  className="mt-1"
                  id="institution"
                  isInvalid={!!errors.institution}
                  placeholder={t("registration.form.institution")}
                  value={form.institution}
                  onChange={(e) => handleChange("institution", e.target.value)}
                />
                {errors.institution && (
                  <div className="text-xs text-red-500 mt-1">
                    {t(errors.institution)}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-medium" htmlFor="email">
                  {t("registration.form.email")}
                </label>
                <Input
                  className="mt-1"
                  id="email"
                  isInvalid={!!errors.email}
                  placeholder={t("registration.form.email")}
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                {errors.email && (
                  <div className="text-xs text-red-500 mt-1">
                    {t(errors.email)}
                  </div>
                )}
              </div>

              <div>
                <label className="font-medium" htmlFor="phone">
                  {t("registration.form.phone")}
                </label>
                <Input
                  className="mt-1"
                  id="phone"
                  isInvalid={!!errors.phone}
                  placeholder={t("registration.form.phone")}
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
                {errors.phone && (
                  <div className="text-xs text-red-500 mt-1">
                    {t(errors.phone)}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="font-medium" htmlFor="sponsor">
                {t("registration.form.sponsor.title")}
              </label>
              <Input
                className="mt-1"
                height={50}
                id="sponsor"
                placeholder={t("registration.form.sponsor.placeholder")}
                value={form.sponsor}
                onChange={(e) => handleChange("sponsor", e.target.value)}
              />
              <span className="text-sm text-gray-500 block mt-2">
                {t("registration.form.sponsor.subtitle")}
              </span>
            </div>

            <div className="flex justify-end gap-2">
              {errors.submit && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-lg font-medium bg-red-500/10 px-4 py-2 rounded-xl flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>
                  {errors.submit}
                </motion.div>
              )}
              <Button
                className="bg-gradient-to-r from-blue-200 to-indigo-100 text-gray-800 w-[200px] h-12 text-md font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Spinner className="mr-2" size="sm" />
                    {t("registration.form.processing")}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {t("registration.form.submit")}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure i18n is initialized
    if (!i18n.isInitialized) {
      i18n.init();
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <RegistrationForm />;
}
