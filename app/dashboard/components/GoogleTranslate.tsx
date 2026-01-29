"use client";

import { useEffect } from 'react';
import { getCookie } from 'cookies-next'; 

const GoogleTranslate = () => {
  useEffect(() => {
    // @ts-ignore
    window.googleTranslateElementInit = () => {
      // @ts-ignore
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,fr,sw,ar,ha,pt', 
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    if (!document.querySelector('#google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return <div id="google_translate_element" style={{ display: 'none' }}></div>;
};

export default GoogleTranslate;