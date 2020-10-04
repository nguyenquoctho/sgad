const BASE_URL = process.env.GATSBY_API_URL
export { BASE_URL }
const API_URL_PUBLIC = process.env.GATSBY_API + "/api/public"
export { API_URL_PUBLIC }

const API_URL_ADMIN = process.env.GATSBY_API + "/api/admin"
export { API_URL_ADMIN }

const API_URL_COMPANY = process.env.GATSBY_API + "/api/auth/company"
export { API_URL_COMPANY }

const EDITOR_API = "lrvvup248ckddqzsypu4fbhujx3m227gsd95f9p6uvhmu1yr"
export { EDITOR_API }

const Authorization = "authorization"
export { Authorization }

const SecretToken = "secret"
export { SecretToken }

const houseTypes = [
  "Apartment",
  "Studio",
  "Office",
  "Officetel",
  "Shophouse",
  "Penthouse",
  "Duplex",
  "Villa",
]
export {houseTypes}

const typeSale=["Sale","Rent"]
export {typeSale}

const houseAvailable=["Hot","Available","Rented","Unavailable","Sold"]
export {houseAvailable}

const houseFurnitures=["Furnished","Semi-Furnished","Basic Funished","Office"]
export {houseFurnitures}

const blogCategories=["Tips","News","Vietnam Discovery","Rental Guides","Testimonials","Promotions"]
export {blogCategories}

const limitPerRequest=15
export {limitPerRequest}
