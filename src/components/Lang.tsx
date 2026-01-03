import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { useTranslations } from "next-intl";

export default function Lang() {
    const changeLocale = (locale: string) => {
        document.cookie = `locale=${locale}; path=/; max-age=31536000`;
        window.location.reload();
    }

    const [lang, setLang] = useState<string>('en');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLang(
            document.cookie
                .split("; ")
                .find((row) => row.startsWith("locale="))
                ?.split("=")[1] || "en"
        );
    }, []);

    const t = useTranslations('common');

    return <Dropdown
        label={t('select_language')}
        value={lang}
        items={[
            { label: t('english'), value: "en" },
            { label: t('persian'), value: "fa" },
        ]}
        onChange={(value) => {
            changeLocale(value)
            setLang(value);
        }}
    />
}