"use client";
import { useState, useEffect } from "react";
import {
  Input,
  Select,
  SelectItem,
  Button,
  DatePicker,
  Spinner,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { getLocalTimeZone, today } from "@internationalized/date";
import { countries } from "countries-list";

import i18n from "@/app/i18n";
import {
  checkoutService,
  RegistrationOptionResponse,
} from "@/app/api/checkout";

const registrationCategories = [
  { label: "registration.categories.ent", value: "ENT Doctors" },
  { label: "registration.categories.student", value: "Student & Trainees" },
  // { label: "registration.categories.chairman", value: "Chairman & Speaker" },
];

const doctorateDegrees = [
  {
    label: "registration.doctorate.prof_md_phd",
    value: "registration.doctorate.prof_md_phd",
  },
  {
    label: "registration.doctorate.aprof_md_phd",
    value: "registration.doctorate.aprof_md_phd",
  },
  {
    label: "registration.doctorate.dr_md_phd",
    value: "registration.doctorate.dr_md_phd",
  },
  {
    label: "registration.doctorate.dr_md",
    value: "registration.doctorate.dr_md",
  },
];

const countryOptions = Object.entries(countries)
  .map(([code, country]) => ({
    label: country.name,
    key: code.toUpperCase(),
    description: `Country code: ${code.toUpperCase()}`,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

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
  attendGalaDinner: true,
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
    pattern: /^[A-Za-zÀ-ỹ\s]{2,50}$/,
    message: "registration.validation.firstName",
  },
  lastName: {
    required: true,
    pattern: /^[A-Za-zÀ-ỹ\s]{2,50}$/,
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
  attendGalaDinner: { required: false, message: "" },
};

// Add custom switch component
const CustomSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <label aria-label="Toggle Gala Dinner attendance" className="switch">
      <input
        aria-label="Gala Dinner attendance"
        checked={checked}
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="slider" />
      <span className="hand left">
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path
            d="M0 9H13V15C13 15.2761 12.7761 15.5 12.5 15.5H0V9Z"
            fill="#3B82F6"
          />
          <path
            d="M13.5 9H21C21.5523 9 22 9.44772 22 10V15C22 15.5523 21.5523 16 21 16H17.5C15.2909 16 13.5 14.2091 13.5 12V9Z"
            fill="#FED5CD"
          />
          <path
            d="M13 9H15V14.5C15 14.7761 14.7761 15 14.5 15H13V9Z"
            fill="#ffffff"
          />
          <path
            className="thumb"
            d="M23.25 9.19999H15V14.2C16.933 14.2 18.5 12.633 18.5 10.7L22.25 10.7C22.9403 10.7 23.5 10.1404 23.5 9.44999C23.5 9.31192 23.3881 9.19999 23.25 9.19999Z"
            fill="#FDE3D9"
          />
        </svg>
      </span>
      <span className="hand right">
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path
            d="M24 9H11V15C11 15.2761 11.2239 15.5 11.5 15.5H24V9Z"
            fill="#3B82F6"
          />
          <path
            d="M10.5 9H3C2.44772 9 2 9.44772 2 10V15C2 15.5523 2.44772 16 3 16H6.5C8.70914 16 10.5 14.2091 10.5 12V9Z"
            fill="#FED5CD"
          />
          <path
            d="M11 9H9V14.5C9 14.7761 9.22386 15 9.5 15H11V9Z"
            fill="#ffffff"
          />
          <path
            className="thumb"
            d="M0.750003 9.19999H9V14.2C7.067 14.2 5.5 12.633 5.5 10.7L1.75002 10.7C1.05965 10.7 0.5 10.1404 0.5 9.44999C0.5 9.31192 0.61193 9.19999 0.750003 9.19999Z"
            fill="#FDE3D9"
          />
        </svg>
      </span>
    </label>
  );
};

function RegistrationForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceInfo, setPriceInfo] = useState<RegistrationOptionResponse | null>(
    null
  );
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);

  // Add useEffect to fetch price when category or gala dinner changes
  useEffect(() => {
    const fetchPrice = async () => {
      if (!form.category) return;

      setIsLoadingPrice(true);
      try {
        const response = await checkoutService.getRegistrationOption(
          form.category,
          form.attendGalaDinner
        );

        if (response?.fee_vnd) {
          setPriceInfo(response);
        }
      } catch (error) {
        console.error("Failed to fetch price:", error);
      } finally {
        setIsLoadingPrice(false);
      }
    };

    fetchPrice();
  }, [form.category, form.attendGalaDinner]);

  const validateField = (name: string, value: string | boolean) => {
    const rules = validationRules[name as keyof typeof validationRules];

    if (!rules) return "";

    if (rules.required && typeof value === "string" && !value.trim())
      return t(rules.message);
    if (
      rules.pattern &&
      typeof value === "string" &&
      value &&
      !rules.pattern.test(value)
    )
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

      if (typeof value === "string") {
        const error = validateField(field, value);

        if (error) {
          newErrors[field] = error;
          hasErrors = true;
        }
      }
    });

    setErrors(newErrors);

    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validate();

    if (isValid) {
      setIsSubmitting(true);
      try {
        const registrationData = {
          registration_category: form.category,
          registration_option: form.category,
          nationality: form.nationality.toLowerCase(),
          doctorate_degree: form.doctorate,
          first_name: form.firstName,
          middle_name: form.middleName,
          last_name: form.lastName,
          date_of_birth: form.dob,
          institution: form.institution,
          email: form.email,
          phone_number: form.phone,
          sponsor: form.sponsor,
          attend_gala_dinner: form.attendGalaDinner,
        };

        const response = await checkoutService.register(registrationData);

        if (response?.payment_url) {
          window.location.href = response.payment_url;
        }
        setErrors({});
        setTouched({});
      } catch (error: any) {
        setErrors((prev: any) => ({
          ...prev,
          submit: {
            title: t("registration.form.apiError.title"),
            description: t("registration.form.apiError.description"),
          },
        }));
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

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
    if (touched[field] && typeof value === "string") {
      const error = validateField(field, value);

      setErrors((prev: any) => ({ ...prev, [field]: error }));
    }
  };

  return (
    <motion.div className="pb-16">
      <Image
        alt="logo"
        className="absolute top-20 left-0 w-screen mx-0 object-contain rounded-b-lg"
        height={1080}
        src={
          i18n.language === "vi"
            ? "/DANG-KY-THAM-DU-VN.png"
            : "/DANG-KY-THAM-DU-EN.png"
        }
        width={1920}
      />

      <div className="mt-[215px] lg:mt-[320px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      {t("fees.early.price")}
                    </span>
                  </div>
                  <div className="text-center md:border-r md:border-gray-200 md:px-4 mb-3 md:mb-0">
                    <div className="text-xs text-gray-500 mb-1 md:hidden">
                      {t("fees.standard.title")}
                    </div>
                    <span className="text-sm inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium w-full md:w-auto">
                      {t("fees.standard.price")}
                    </span>
                  </div>
                  <div className="text-center md:px-4">
                    <div className="text-xs text-gray-500 mb-1 md:hidden">
                      {t("fees.onsite.title")}
                    </div>
                    <span className="text-sm inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium w-full md:w-auto">
                      {t("fees.onsite.price")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Accommodation Row */}
              <div className="md:grid md:grid-cols-4 p-4 transition-colors duration-200 items-center">
                <div className="font-medium text-gray-800 md:border-r md:border-gray-200 md:pr-4 mb-3 md:mb-0">
                  {t("fees.accommodation.title")}
                </div>
                <div className="col-span-3 text-center px-4">
                  <span className="text-sm inline-block px-6 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium w-full md:w-auto">
                    {t("fees.accommodation.price")}
                  </span>
                </div>
              </div>

              {/* Gala Row */}
              <div className="md:grid md:grid-cols-4 p-4 transition-colors duration-200 items-center">
                <div className="font-medium text-gray-800 md:border-r md:border-gray-200 md:pr-4 mb-3 md:mb-0">
                  {t("fees.gala.title")}
                </div>
                <div className="col-span-3 text-center px-4">
                  <span className="text-sm inline-block px-6 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium w-full md:w-auto">
                    {t("fees.gala.price")}
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
                  <span className="text-red-500"> *</span>
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
                  <span className="text-red-500"> *</span>
                </label>
                <Autocomplete
                  className="mt-1"
                  defaultItems={countryOptions}
                  id="nationality"
                  isInvalid={!!errors.nationality}
                  placeholder={t("registration.form.nationality")}
                  selectedKey={form.nationality}
                  onSelectionChange={(key) =>
                    handleChange("nationality", key as string)
                  }
                >
                  {(country) => (
                    <AutocompleteItem key={country.key}>
                      {country.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                {errors.nationality && (
                  <div className="text-xs text-red-500 mt-1">
                    {t(errors.nationality)}
                  </div>
                )}
              </div>
              <div>
                <label className="font-medium" htmlFor="doctorate">
                  {t("registration.doctorate.title")}{" "}
                  <span className="text-red-500"> *</span>
                </label>
                <Select
                  className="mt-1"
                  id="doctorate"
                  isInvalid={!!errors.doctorate}
                  placeholder={t("registration.doctorate.title")}
                  onChange={(e) => handleChange("doctorate", t(e.target.value))}
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
                  <span className="text-red-500"> *</span>
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
                  <span className="text-red-500"> *</span>
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
                  <span className="text-red-500"> *</span>
                </label>
                <DatePicker
                  className="mt-1 w-full"
                  isInvalid={!!errors.dob}
                  maxValue={today(getLocalTimeZone()) as any}
                  showMonthAndYearPickers={true}
                  onChange={(date: any) =>
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
                  <span className="text-red-500"> *</span>
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
                  <span className="text-red-500"> *</span>
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
                  <span className="text-red-500"> *</span>
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

            <div className="flex items-center justify-between p-4 bg-[#f4f4f5] rounded-xl">
              <div>
                <label
                  className="font-medium text-gray-700"
                  htmlFor="galaDinner"
                >
                  {t("registration.form.gala.title")}
                </label>
                <p className="hidden md:block text-sm text-gray-500 mt-1">
                  {t("registration.form.gala.subtitle")}
                </p>
              </div>
              <CustomSwitch
                checked={form.attendGalaDinner}
                onChange={(value) => handleChange("attendGalaDinner", value)}
              />
            </div>

            {/* Total Fee Display with enhanced shadow - Always visible */}
            {form.category && (
              <div className="mb-6 bg-[#f4f4f5] rounded-xl p-4 transition-shadow duration-300">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between md:items-center">
                    <span className="text-gray-900 font-medium">
                      {t("registration.total.title")}
                    </span>
                    {isLoadingPrice && form.category ? (
                      <div className="flex items-center">
                        <Spinner size="sm" />
                        <span className="ml-2 text-gray-700 text-sm">
                          {t("registration.price.loading")}
                        </span>
                      </div>
                    ) : priceInfo ? (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#1A569F]">
                          {i18n?.language === "vi"
                            ? `${priceInfo.fee_vnd.toLocaleString("vi-VN")} VND`
                            : `${priceInfo.fee_usd.toLocaleString("en-US")} USD`}
                        </div>
                        <div className="text-sm text-gray-700">
                          {t("registration.total.conference")}
                          {form.attendGalaDinner &&
                            ` + ${t("fees.gala.title")}`}
                        </div>
                      </div>
                    ) : (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-400">
                          {!form.category ? t("registration.total.free") : "0"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {t("registration.price.select_category")}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* {priceInfo && (
                    <div className="text-sm text-gray-700 border-t border-gray-300 pt-3 mt-2">
                      {t("registration.total.includes")}
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>{t("registration.total.conference")}</li>
                        {form.attendGalaDinner && (
                          <li>{t("registration.total.gala")}</li>
                        )}
                      </ul>
                    </div>
                  )} */}
                </div>
              </div>
            )}
            {errors.submit && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 bg-red-50 border border-red-200 rounded-xl p-4"
                initial={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-red-800 font-medium">
                      {errors.submit.title}
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      {errors.submit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                className="bg-gradient-to-r from-blue-200 to-indigo-100 text-[#1A569F] min-w-[200px] h-12 text-md font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50"
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
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
