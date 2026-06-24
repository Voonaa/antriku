import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../lang/en.json';
import id from '../lang/id.json';

const translations = { en, id };

const LangContext = createContext();

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('app_lang') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('app_lang', lang);
    }, [lang]);

    const t = (key) => {
        return translations[lang][key] || translations['en'][key] || key;
    };

    return (
        <LangContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LangContext.Provider>
    );
};
