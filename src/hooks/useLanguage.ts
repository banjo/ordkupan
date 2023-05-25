/* eslint-disable import/no-duplicates */
import { setDefaultOptions } from "date-fns";
import { sv } from "date-fns/locale";

export const useLanguage = () => {
    setDefaultOptions({ locale: sv });
};
