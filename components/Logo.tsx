import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage';

interface LogoProps {
  className?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({ className, alt = "Logo Sekolah" }) => {
  // Cek localStorage dulu untuk performa (cache)
  const [src, setSrc] = useState<string>(() => {
      return localStorage.getItem('schoolLogo') || "/logo.png";
  });
  
  // URL Default (Tut Wuri Handayani) jika logo custom tidak ditemukan
  const fallbackSrc = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Tut_Wuri_Handayani.svg";

  useEffect(() => {
    // Cek update logo dari database di background
    const fetchLogo = async () => {
        try {
            const logo = await StorageService.getSchoolLogo();
            if (logo) {
                // Jika logo beda dengan cache, update
                if (logo !== localStorage.getItem('schoolLogo')) {
                    setSrc(logo);
                    localStorage.setItem('schoolLogo', logo);
                }
            }
        } catch (e) {
            // Ignore error silently
        }
    };
    fetchLogo();
  }, []);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        // Jika gagal load src utama (misal /logo.png tidak ada), coba fallback
        if (target.src !== fallbackSrc && !target.src.includes("Tut_Wuri_Handayani")) {
            target.src = fallbackSrc;
        }
      }}
    />
  );
};