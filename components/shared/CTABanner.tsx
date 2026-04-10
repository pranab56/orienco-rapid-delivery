"use client";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from 'react-i18next';

export default function CTABanner() {
    const { t } = useTranslation('common');
    const pathname = usePathname();

    const isDashboardRoute =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/partner-dashboard') ||
        pathname.startsWith('/hotels-partner-dashboard') ||
        pathname.startsWith('/transport-Partner-dashboard') ||
        pathname.startsWith('/transport-partner-dashboard');

    if (isDashboardRoute) {
        return null;
    }

    return (
        <section>
            <div className="bg-primary py-10 md:py-12">
                <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
                    <div className="text-white space-y-1 md:space-y-2 text-center lg:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold">{t('insights.featured_title')}</h2>
                        <p className="text-sm md:text-lg opacity-90">{t('insights.featured_subtitle')}</p>
                    </div>

                    <div className="relative w-full max-w-sm px-4 md:px-0">
                        <input
                            type="text"
                            placeholder={t('insights.find_agent')}
                            className="w-full h-12 md:h-14 bg-white rounded-lg px-5 md:px-6 pr-12 text-neutral-1 font-medium focus:outline-none shadow-lg focus:ring-2 focus:ring-white/20 text-sm md:text-base"
                        />
                        <Search className="absolute right-8 md:right-4 top-1/2 -translate-y-1/2 text-primary size-5 md:size-6" />
                    </div>
                </div>
            </div>
        </section>
    )
}