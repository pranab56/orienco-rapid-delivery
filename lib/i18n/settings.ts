export const fallbackLng = 'fr'
export const languages = [fallbackLng, 'en', 'am', 'ru', 'ar']
export const defaultNS = 'common'
export const cookieName = 'i18next'

export function getOptions (lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}
